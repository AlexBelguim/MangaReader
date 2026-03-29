/**
 * Downloads Routes - Download chapters, check for updates, scan local files, CBZ support
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { bookmarkDb, chapterSettingsDb } from '../database.js';
import { downloader } from '../downloader.js';
import { favoritesDb } from '../db/favorites.js';
import { trophyDb } from '../db/trophies.js';
import { CONFIG } from '../config.js';
import { scraperFactory } from '../scrapers/index.js';
import { queue } from '../queue.js';

const router = express.Router();
const taskQueue = queue;
const activeDownloads = new Map();

// ==================== DOWNLOAD & CHECK ====================

// Delete downloaded version from disk
router.post('/bookmarks/:id/delete-download', async (req, res) => {
    try {
        const { chapterNumber, url } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const result = await downloader.deleteChapter(
            bookmark.title, chapterNumber, bookmark.alias, url
        );

        if (result.success) {
            const downloadedVersions = { ...(bookmark.downloadedVersions || {}) };
            let versions = downloadedVersions[chapterNumber];

            if (typeof versions === 'string') {
                if (versions === url) delete downloadedVersions[chapterNumber];
            } else if (Array.isArray(versions)) {
                versions = versions.filter(u => u !== url);
                if (versions.length === 0) delete downloadedVersions[chapterNumber];
                else downloadedVersions[chapterNumber] = versions;
            }

            const stillDownloaded = downloadedVersions[chapterNumber] &&
                (typeof downloadedVersions[chapterNumber] === 'string' || downloadedVersions[chapterNumber].length > 0);

            let downloadedChapters = [...(bookmark.downloadedChapters || [])];
            if (!stillDownloaded) {
                downloadedChapters = downloadedChapters.filter(n => n !== chapterNumber);

                // Cleanup favorites and trophies when the last version is deleted
                favoritesDb.deleteForChapter(bookmark.id, chapterNumber);
                trophyDb.deleteForChapter(bookmark.id, chapterNumber);
            }

            await bookmarkDb.update(req.params.id, { downloadedChapters, downloadedVersions });
            res.json({ success: true, message: 'Downloaded version deleted' });
        } else {
            res.status(400).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check for updates on a single manga
router.post('/bookmarks/:id/check', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const scraper = scraperFactory.getScraperForUrl(bookmark.url);
        if (!scraper) return res.status(400).json({ error: 'No scraper available' });

        const result = await taskQueue.addAndWait({
            type: 'scrape',
            description: `Checking updates for ${bookmark.alias || bookmark.title}`,
            mangaId: bookmark.id,
            mangaTitle: bookmark.alias || bookmark.title,
            execute: async () => {
                const mangaInfo = await scraper.getMangaInfo(bookmark.url);

                const volumes = bookmarkDb.getVolumes(bookmark.id);
                const protectedChapters = new Set();
                volumes.forEach(v => v.chapters.forEach(c => protectedChapters.add(c)));

                if (protectedChapters.size > 0) {
                    const existingChaptersMap = new Map((bookmark.chapters || []).map(c => [c.number, c]));
                    mangaInfo.chapters = mangaInfo.chapters.map(c => {
                        if (protectedChapters.has(c.number) && existingChaptersMap.has(c.number)) {
                            return existingChaptersMap.get(c.number);
                        }
                        return c;
                    });
                }

                const newChapters = mangaInfo.totalChapters - bookmark.totalChapters;

                bookmarkDb.update(bookmark.id, {
                    totalChapters: mangaInfo.totalChapters,
                    chapters: mangaInfo.chapters,
                    cover: mangaInfo.cover,
                    duplicateChapters: mangaInfo.duplicateChapters
                });

                if (mangaInfo.cover && mangaInfo.cover !== bookmark.remoteCover) {
                    const coverResult = await downloader.downloadCover(bookmark.title, mangaInfo.cover, bookmark.alias);
                    if (coverResult && coverResult.isNew) {
                        await bookmarkDb.update(bookmark.id, { localCover: coverResult.path, remoteCover: mangaInfo.cover });
                    }
                }

                const updated = await bookmarkDb.getById(bookmark.id);
                return { ...updated, newChaptersCount: newChapters };
            }
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Quick check for updates (first page only)
router.post('/bookmarks/:id/quick-check', async (req, res) => {
    try {
        if (!scraperFactory.browser) await scraperFactory.init();

        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const scraper = scraperFactory.getScraperForUrl(bookmark.url);
        if (!scraper) return res.status(400).json({ error: 'No scraper available' });

        if (!scraper.supportsQuickCheck) {
            return res.status(400).json({ error: 'Quick check not supported for this website', supportsQuickCheck: false });
        }

        const result = await taskQueue.addAndWait({
            type: 'scrape',
            description: `Quick check for ${bookmark.alias || bookmark.title}`,
            mangaId: bookmark.id,
            mangaTitle: bookmark.alias || bookmark.title,
            execute: async () => {
                const knownChapterUrls = (bookmark.chapters || []).map(c => c.url);
                const checkResult = await scraper.quickCheckUpdates(bookmark.url, knownChapterUrls);

                if (checkResult.hasUpdates && checkResult.newChapters.length > 0) {
                    const existingChapters = bookmark.chapters || [];
                    const existingUrls = new Set(existingChapters.map(c => c.url));

                    // Get chapters that are in volumes (protected)
                    const volumes = bookmarkDb.getVolumes(bookmark.id);
                    const protectedChapters = new Set();
                    volumes.forEach(v => v.chapters.forEach(c => protectedChapters.add(c)));

                    // Get the latest chapter number in any volume
                    let latestVolumeChapter = 0;
                    volumes.forEach(v => {
                        v.chapters.forEach(c => {
                            if (c > latestVolumeChapter) latestVolumeChapter = c;
                        });
                    });

                    // Filter out chapters that:
                    // 1. Are already in volumes (protected from new versions)
                    // 2. Are older than the latest chapter in any volume (for extras like 87.1 when volume ends at 88)
                    const chaptersToAdd = checkResult.newChapters.filter(c => {
                        if (existingUrls.has(c.url)) return false;
                        // Skip if chapter is already in a volume
                        if (protectedChapters.has(c.number)) return false;
                        // Skip if it's an extra that's older than the latest volume chapter
                        if (latestVolumeChapter > 0 && c.number < latestVolumeChapter && !Number.isInteger(c.number)) return false;
                        return true;
                    });

                    if (chaptersToAdd.length > 0) {
                        const mergedChapters = [...existingChapters, ...chaptersToAdd];
                        const uniqueChapterNumbers = new Set(mergedChapters.map(c => c.number));
                        bookmarkDb.update(bookmark.id, {
                            chapters: mergedChapters,
                            totalChapters: mergedChapters.length,
                            uniqueChapters: uniqueChapterNumbers.size
                        });
                    }
                }

                return {
                    hasUpdates: checkResult.hasUpdates,
                    latestChapter: checkResult.latestChapter,
                    newChaptersCount: checkResult.newChapters.length,
                    newChapters: checkResult.newChapters,
                    supportsQuickCheck: true,
                    updated: checkResult.hasUpdates && checkResult.newChapters.length > 0
                };
            }
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check all bookmarks for updates
router.post('/check-all', async (req, res) => {
    try {
        const bookmarks = bookmarkDb.getAll();
        const allSettings = chapterSettingsDb.getAll();

        const results = await taskQueue.addAndWait({
            type: 'scrape',
            description: `Checking all ${bookmarks.length} manga for updates`,
            execute: async () => {
                const results = [];
                for (const bookmark of bookmarks) {
                    try {
                        const scraper = scraperFactory.getScraperForUrl(bookmark.url);
                        if (!scraper) continue;

                        const mangaInfo = await scraper.getMangaInfo(bookmark.url);

                        const volumes = bookmarkDb.getVolumes(bookmark.id);
                        const protectedChapters = new Set();
                        volumes.forEach(v => v.chapters.forEach(c => protectedChapters.add(c)));

                        const mangaSettings = allSettings[bookmark.id] || {};
                        for (const [chNum, settings] of Object.entries(mangaSettings)) {
                            if (settings.locked) protectedChapters.add(parseFloat(chNum));
                        }

                        if (protectedChapters.size > 0) {
                            const existingChaptersMap = new Map((bookmark.chapters || []).map(c => [c.number, c]));
                            mangaInfo.chapters = mangaInfo.chapters.map(c => {
                                if (protectedChapters.has(c.number) && existingChaptersMap.has(c.number)) {
                                    return existingChaptersMap.get(c.number);
                                }
                                return c;
                            });
                        }

                        const newChapters = mangaInfo.totalChapters - bookmark.totalChapters;
                        bookmarkDb.update(bookmark.id, {
                            totalChapters: mangaInfo.totalChapters,
                            chapters: mangaInfo.chapters,
                            cover: mangaInfo.cover,
                            duplicateChapters: mangaInfo.duplicateChapters
                        });

                        results.push({
                            id: bookmark.id, title: bookmark.alias || bookmark.title,
                            oldCount: bookmark.totalChapters, newCount: mangaInfo.totalChapters, newChapters
                        });
                    } catch (error) {
                        results.push({ id: bookmark.id, title: bookmark.alias || bookmark.title, error: error.message });
                    }
                }
                return results;
            }
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start download
router.post('/bookmarks/:id/download', async (req, res) => {
    try {
        // Ensure scraper is initialized
        if (!scraperFactory.browser) {
            await scraperFactory.init();
        }

        const { chapters, all, versionMode = 'single' } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const deletedUrls = new Set(bookmark.deletedChapterUrls || []);
        const excludedChapters = new Set(bookmark.excludedChapters || []);

        const allSettings = chapterSettingsDb.getAll();
        const mangaSettings = allSettings[bookmark.id] || {};
        const lockedChapters = new Set();
        Object.entries(mangaSettings).forEach(([num, s]) => {
            if (s.locked) lockedChapters.add(parseFloat(num));
        });

        // We will now queue an array of objects: { number, url }
        let chaptersToDownload = [];

        if (all) {
            // Filter all available versions in the bookmark
            const eligibleVersions = bookmark.chapters
                .filter(c => !deletedUrls.has(c.url))
                .filter(c => !excludedChapters.has(c.number))
                .filter(c => !lockedChapters.has(c.number));

            // If versionMode is 'single', we only want the FIRST version of each chapter number
            // that is NOT already downloaded.
            // If versionMode is 'all', we want ALL versions that are NOT already downloaded.

            // To do this, we group by chapter number
            const chaptersByNumber = new Map();
            for (const c of eligibleVersions) {
                if (!chaptersByNumber.has(c.number)) {
                    chaptersByNumber.set(c.number, []);
                }
                chaptersByNumber.get(c.number).push(c);
            }

            for (const [num, versions] of chaptersByNumber.entries()) {
                const downloadedForThisChapter = bookmark.downloadedVersions?.[num] || [];
                const isDownloaded = (url) => {
                    if (Array.isArray(downloadedForThisChapter)) return downloadedForThisChapter.includes(url);
                    return downloadedForThisChapter === url; // Legacy fallback
                };

                if (versionMode === 'single') {
                    // Just take the first version. If it's already downloaded, skip.
                    const firstVersion = versions[0];
                    if (firstVersion && !isDownloaded(firstVersion.url)) {
                        chaptersToDownload.push({ number: num, url: firstVersion.url });
                    }
                } else {
                    // Take all versions that aren't downloaded
                    for (const v of versions) {
                        if (!isDownloaded(v.url)) {
                            chaptersToDownload.push({ number: num, url: v.url });
                        }
                    }
                }
            }
        } else if (chapters && Array.isArray(chapters)) {
            // This handles the case where user selects specific chapters to download
            // Typically this array is just numbers from legacy code, but we should map them to first versions if so
            const eligibleVersions = bookmark.chapters
                .filter(c => chapters.includes(c.number))
                .filter(c => !excludedChapters.has(c.number))
                .filter(c => !lockedChapters.has(c.number));

            const chaptersByNumber = new Map();
            for (const c of eligibleVersions) {
                if (!chaptersByNumber.has(c.number)) {
                    chaptersByNumber.set(c.number, []);
                }
                chaptersByNumber.get(c.number).push(c);
            }

            for (const num of chapters) {
                if (excludedChapters.has(num) || lockedChapters.has(num)) continue;

                const versions = chaptersByNumber.get(num) || [];
                const downloadedForThisChapter = bookmark.downloadedVersions?.[num] || [];
                const isDownloaded = (url) => {
                    if (Array.isArray(downloadedForThisChapter)) return downloadedForThisChapter.includes(url);
                    return downloadedForThisChapter === url;
                };

                // For direct chapter selection, default to single version behavior (first available)
                const firstVersion = versions[0];
                if (firstVersion && !isDownloaded(firstVersion.url)) {
                    chaptersToDownload.push({ number: num, url: firstVersion.url });
                }
            }
        }

        if (chaptersToDownload.length === 0) {
            return res.json({ message: 'No chapters to download', status: 'complete' });
        }

        const taskId = `${bookmark.id}-${Date.now()}`;
        activeDownloads.set(taskId, {
            bookmarkId: bookmark.id, mangaTitle: bookmark.alias || bookmark.title,
            total: chaptersToDownload.length, chapters: chaptersToDownload.map(c => c.number), // Keep numbers for UI tracking easily
            completedChapters: [], completed: 0, current: null, status: 'queued', errors: []
        });

        taskQueue.addAsync({
            type: 'download',
            description: `Download ${chaptersToDownload.length} chapters for ${bookmark.alias || bookmark.title}`,
            execute: () => downloadChaptersAsync(taskId, bookmark, chaptersToDownload)
        });

        res.json({ taskId, chaptersCount: chaptersToDownload.length, chapters: chaptersToDownload.map(c => c.number) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Download a specific version of a chapter
router.post('/bookmarks/:id/download-version', async (req, res) => {
    try {
        const { chapterNumber, url } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const chapter = bookmark.chapters.find(c => c.number === chapterNumber && c.url === url);
        if (!chapter) return res.status(404).json({ error: 'Chapter version not found' });

        const scraper = scraperFactory.getScraperForUrl(bookmark.url);
        if (!scraper) return res.status(400).json({ error: 'No scraper available for this URL' });

        const taskId = `${bookmark.id}-${Date.now()}`;
        activeDownloads.set(taskId, {
            bookmarkId: bookmark.id, mangaTitle: bookmark.alias || bookmark.title,
            total: 1, chapters: [chapterNumber], completedChapters: [],
            completed: 0, current: chapterNumber, status: 'queued', errors: [], versionUrl: url
        });

        taskQueue.addAsync({
            type: 'download',
            description: `Download chapter ${chapterNumber} (version) for ${bookmark.alias || bookmark.title}`,
            execute: async () => {
                const task = activeDownloads.get(taskId);
                if (!task) return;
                try {
                    task.status = 'running';
                    const images = await scraper.getChapterImages(url);
                    await downloader.downloadChapter(bookmark.title, chapterNumber, images, bookmark.alias, null, url);
                    await bookmarkDb.markChapterDownloaded(bookmark.id, chapterNumber, url);
                    task.completed = 1;
                    task.completedChapters = [chapterNumber];
                    task.status = 'complete';
                } catch (error) {
                    task.status = 'error';
                    task.errors.push({ chapter: chapterNumber, error: error.message });
                }
                setTimeout(() => activeDownloads.delete(taskId), 5 * 60 * 1000);
            }
        });

        res.json({ taskId, chapters: [chapterNumber] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== DOWNLOAD STATUS ====================

// Get download progress
router.get('/downloads/:taskId', (req, res) => {
    const task = activeDownloads.get(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Download task not found' });
    res.json(task);
});

// Get all active downloads
router.get('/downloads', (req, res) => {
    try {
        const downloads = {};
        activeDownloads.forEach((task, taskId) => { downloads[taskId] = task; });
        res.json(downloads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pause download
router.post('/downloads/:taskId/pause', (req, res) => {
    const task = activeDownloads.get(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Download task not found' });
    task.status = 'paused';
    res.json({ success: true, status: 'paused' });
});

// Resume download
router.post('/downloads/:taskId/resume', (req, res) => {
    const task = activeDownloads.get(req.params.taskId);
    if (!task) return res.status(404).json({ error: 'Download task not found' });
    task.status = 'running';
    res.json({ success: true, status: 'running' });
});

// Cancel download
router.post('/downloads/:taskId/cancel', (req, res) => {
    const task = activeDownloads.get(req.params.taskId);
    if (task) task.status = 'cancelled';
    activeDownloads.delete(req.params.taskId);
    res.json({ success: true, status: 'cancelled' });
});

// Cancel download (DELETE)
router.delete('/downloads/:taskId', (req, res) => {
    activeDownloads.delete(req.params.taskId);
    res.json({ message: 'Download cancelled' });
});

// ==================== BACKGROUND DOWNLOAD ====================

async function downloadChaptersAsync(taskId, bookmark, chaptersToDownload) {
    const task = activeDownloads.get(taskId);
    if (!task) return;

    task.status = 'running';

    // Ensure scraper is initialized
    if (!scraperFactory.browser) {
        try {
            await scraperFactory.init();
        } catch (initErr) {
            task.status = 'error';
            task.errors.push({ chapter: 'init', error: 'Failed to initialize scraper: ' + initErr.message });
            return;
        }
    }

    const scraper = scraperFactory.getScraperForUrl(bookmark.url);
    if (!scraper) {
        task.status = 'error';
        task.errors.push({ chapter: 'init', error: 'No scraper available for this URL' });
        return;
    }

    for (const chapterData of chaptersToDownload) {
        if (!activeDownloads.has(taskId) || task.status === 'cancelled') break;

        while (task.status === 'paused') {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!activeDownloads.has(taskId) || task.status === 'cancelled') break;
        }
        if (task.status === 'cancelled') break;

        // chapterData is now { number, url }
        const chapterNum = chapterData.number;
        const targetUrl = chapterData.url;

        task.current = chapterNum;
        task.remainingChapters = chaptersToDownload.slice(chaptersToDownload.indexOf(chapterData) + 1).map(c => c.number);

        try {
            const images = await scraper.getChapterImages(targetUrl);
            await downloader.downloadChapter(bookmark.title, chapterNum, images, bookmark.alias, null, targetUrl);
            await bookmarkDb.markChapterDownloaded(bookmark.id, chapterNum, targetUrl);
        } catch (error) {
            task.errors.push({ chapter: chapterNum, error: error.message });
        }
        task.completed++;
        task.completedChapters = task.completedChapters || [];
        // Only push to completed list if not already there to prevent UI duplicates
        if (!task.completedChapters.includes(chapterNum)) {
            task.completedChapters.push(chapterNum);
        }
    }

    task.status = 'complete';
    task.current = null;
    setTimeout(() => activeDownloads.delete(taskId), 5 * 60 * 1000);
}

// ==================== LOCAL MANGA & SCAN ====================

// Get supported websites
router.get('/supported-sites', (req, res) => {
    res.json(scraperFactory.getSupportedWebsites());
});

// Debug info
router.get('/debug-info', (req, res) => {
    res.json({
        config: CONFIG,
        resolvedDownloadsDir: path.resolve(CONFIG.downloadsDir),
        cwd: process.cwd()
    });
});

// Scan for local manga (new folders only - returns list for user to import)
router.post('/scan-local', async (req, res) => {
    try {
        const downloadsDir = CONFIG.downloadsDir;
        if (!await fs.pathExists(downloadsDir)) return res.json({ found: [] });

        const entries = await fs.readdir(downloadsDir, { withFileTypes: true });
        const bookmarks = await bookmarkDb.getAll();
        const newFolders = [];

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            const mangaFolder = entry.name;

            // Check if this folder already exists in database
            const existingBookmark = bookmarks.find(b =>
                downloader.sanitizeFileName(b.title) === mangaFolder ||
                (b.alias && downloader.sanitizeFileName(b.alias) === mangaFolder)
            );

            // Skip if bookmark already exists
            if (existingBookmark) continue;

            // Check for chapters and CBZ files
            const chapters = await downloader.scanLocalChapters(mangaFolder);
            const cbzFiles = await downloader.findCbzFiles(mangaFolder);

            // Skip if no chapters and no CBZ files
            if (chapters.length === 0 && cbzFiles.length === 0) continue;

            newFolders.push({
                folderName: mangaFolder,
                chapters: chapters.map(c => c.number),
                chapterCount: chapters.length,
                cbzFiles: cbzFiles.length,
                hasCbz: cbzFiles.length > 0,
                hasChapters: chapters.length > 0
            });
        }

        res.json({ found: newFolders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get local manga folders not in database
router.get('/local-manga', async (req, res) => {
    try {
        const mangaFolders = await downloader.scanAllMangaFolders();
        const bookmarks = await bookmarkDb.getAll();

        const localOnly = mangaFolders.filter(folder => {
            return !bookmarks.some(b =>
                downloader.sanitizeFileName(b.title) === downloader.sanitizeFileName(folder.folderName) ||
                (b.alias && downloader.sanitizeFileName(b.alias) === downloader.sanitizeFileName(folder.folderName))
            );
        });

        res.json(localOnly);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a local-only bookmark
router.post('/local-manga', async (req, res) => {
    try {
        const { folderName } = req.body;
        if (!folderName) return res.status(400).json({ error: 'Folder name required' });

        const folderPath = path.join(CONFIG.downloadsDir, folderName);
        if (!await fs.pathExists(folderPath)) return res.status(404).json({ error: 'Folder not found' });

        const chapters = await downloader.scanLocalChapters(folderName);
        const cbzFiles = await downloader.findCbzFiles(folderName);

        const chapterList = chapters.map(c => ({
            number: c.number, title: `Chapter ${c.number}`,
            url: `local://${folderName}/chapter/${c.number}`, removedFromRemote: true
        }));

        const bookmark = await bookmarkDb.add({
            url: `local://${folderName}`, title: folderName, alias: null,
            website: 'Local', chapters: chapterList, totalChapters: chapterList.length,
            downloadedChapters: chapters.map(c => c.number), cover: null
        });

        res.json({ success: true, bookmark, cbzFiles: cbzFiles.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Scan local downloads to sync with bookmark
router.post('/bookmarks/:id/scan-local', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        let scanTitle = bookmark.title;
        let scanAlias = bookmark.alias;

        if (bookmark.local_cover) {
            try {
                const decodedPath = decodeURIComponent(bookmark.local_cover);
                const normalized = decodedPath.replace(/\\/g, '/');
                if (normalized.includes('/covers/')) {
                    const parts = normalized.split('/covers/');
                    const parentPath = parts[0];
                    const folderName = parentPath.split('/').filter(p => p).pop();
                    if (folderName) {
                        console.log(`[Scan] Using folder from local_cover: "${folderName}" instead of title "${scanTitle}"`);
                        scanTitle = folderName;
                        scanAlias = null;
                    }
                }
            } catch (e) {
                console.warn(`[Scan] Failed to parse local_cover path: ${e.message}`);
            }
        }

        const localChapters = await downloader.scanLocalChapters(scanTitle, scanAlias);
        const localNumbers = localChapters.map(c => c.number);
        const localNumberSet = new Set(localNumbers);

        const previousDownloaded = bookmark.downloadedChapters || [];
        const removedChapters = previousDownloaded.filter(num => !localNumberSet.has(num));
        const addedChapters = localNumbers.filter(num => !previousDownloaded.includes(num));

        const existingChapterNumbers = new Set((bookmark.chapters || []).map(c => c.number));
        const missingFromData = localNumbers.filter(num => !existingChapterNumbers.has(num));

        let chaptersToMerge = null;
        if (missingFromData.length > 0) {
            const existingChapters = bookmark.chapters || [];
            const newChapterEntries = missingFromData.map(num => ({
                number: num, title: `Chapter ${num}`,
                url: `local://${bookmark.id}/chapter-${num}`,
                version: 1, totalVersions: 1, removedFromRemote: true
            }));
            chaptersToMerge = [...existingChapters, ...newChapterEntries];
        }

        const existingFolders = new Map();
        localChapters.forEach(ch => {
            if (!existingFolders.has(ch.number)) existingFolders.set(ch.number, new Set());
            if (ch.version) existingFolders.get(ch.number).add(ch.version);
            else existingFolders.get(ch.number).add('base');
        });

        const currentVersions = bookmark.downloadedVersions || {};
        const newVersions = {};

        for (const [numStr, urls] of Object.entries(currentVersions)) {
            const num = parseFloat(numStr);
            const existingVersionHashes = existingFolders.get(num) || new Set();
            const urlArray = Array.isArray(urls) ? urls : [urls];
            const validUrls = urlArray.filter(url => {
                const versionHash = downloader.getVersionFromUrl(url);
                return existingVersionHashes.has(versionHash) ||
                    (existingVersionHashes.has('base') && urlArray.length === 1);
            });
            if (validUrls.length > 0) {
                newVersions[numStr] = validUrls.length === 1 ? validUrls[0] : validUrls;
            }
        }

        for (const num of missingFromData) {
            if (!newVersions[num]) newVersions[num] = `local://${bookmark.id}/chapter-${num}`;
        }

        const updateData = { downloadedChapters: localNumbers, downloadedVersions: newVersions };

        if (chaptersToMerge) {
            updateData.chapters = chaptersToMerge;
            updateData.totalChapters = chaptersToMerge.length;
            const excludedSet = new Set(bookmark.excludedChapters || []);
            updateData.uniqueChapters = new Set(chaptersToMerge.map(c => c.number).filter(n => !excludedSet.has(n))).size;
        } else {
            const currentChapters = bookmark.chapters || [];
            const excludedSet = new Set(bookmark.excludedChapters || []);
            updateData.uniqueChapters = new Set(currentChapters.map(c => c.number).filter(n => !excludedSet.has(n))).size;
        }

        await bookmarkDb.update(bookmark.id, updateData);

        res.json({
            success: true, localChapters, count: localNumbers.length,
            removedChapters, addedChapters, addedToData: missingFromData,
            changed: removedChapters.length > 0 || addedChapters.length > 0 || missingFromData.length > 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== CBZ SUPPORT ====================

// Get CBZ files for a manga
router.get('/bookmarks/:id/cbz', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
        const cbzFiles = await downloader.findCbzFiles(bookmark.title, bookmark.alias);
        res.json(cbzFiles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Extract a single CBZ file
router.post('/bookmarks/:id/cbz/extract', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const { cbzPath, chapterNumber, deleteAfter, forceReExtract, renameCbz } = req.body;
        if (!cbzPath || chapterNumber === undefined) {
            return res.status(400).json({ error: 'cbzPath and chapterNumber required' });
        }

        const resolvedPath = path.resolve(cbzPath);
        const resolvedDownloadsDir = path.resolve(CONFIG.downloadsDir);
        if (!resolvedPath.startsWith(resolvedDownloadsDir)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const result = await downloader.extractCbz(cbzPath, bookmark.title, chapterNumber, bookmark.alias, {
            deleteAfter: deleteAfter || false, forceReExtract: forceReExtract || false,
            renameCbz: renameCbz !== false
        });

        if (result.success) {
            const downloadedChapters = new Set(bookmark.downloadedChapters || []);
            downloadedChapters.add(chapterNumber);

            const chapters = bookmark.chapters || [];
            const existingChapter = chapters.find(c => c.number === chapterNumber);
            if (!existingChapter) {
                chapters.push({
                    number: chapterNumber, title: `Chapter ${chapterNumber}`,
                    url: `local://${bookmark.title}/chapter/${chapterNumber}`, removedFromRemote: true
                });
                chapters.sort((a, b) => a.number - b.number);
            }

            await bookmarkDb.update(bookmark.id, {
                downloadedChapters: Array.from(downloadedChapters).sort((a, b) => a - b),
                chapters, totalChapters: chapters.length
            });
        }

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Extract all CBZ files for a manga
router.post('/bookmarks/:id/cbz/extract-all', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const { deleteAfter, forceReExtract, renameCbz } = req.body;
        const results = await downloader.extractAllCbz(bookmark.title, bookmark.alias, {
            deleteAfter: deleteAfter || false, forceReExtract: forceReExtract || false,
            renameCbz: renameCbz !== false
        });

        const downloadedChapters = new Set(bookmark.downloadedChapters || []);
        const chapters = bookmark.chapters || [];

        for (const result of results) {
            if (result.success && !result.skipped && result.chapterNumber !== undefined) {
                downloadedChapters.add(result.chapterNumber);
                const existingChapter = chapters.find(c => c.number === result.chapterNumber);
                if (!existingChapter) {
                    chapters.push({
                        number: result.chapterNumber, title: `Chapter ${result.chapterNumber}`,
                        url: `local://${bookmark.title}/chapter/${result.chapterNumber}`, removedFromRemote: true
                    });
                }
            }
        }

        chapters.sort((a, b) => a.number - b.number);

        await bookmarkDb.update(bookmark.id, {
            downloadedChapters: Array.from(downloadedChapters).sort((a, b) => a - b),
            chapters, totalChapters: chapters.length
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get images from manga folder for cover selection
router.get('/bookmarks/:id/folder-images', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const mangaDir = downloader.getMangaDir(bookmark.title, bookmark.alias);
        if (!await fs.pathExists(mangaDir)) {
            return res.json([]);
        }

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const images = [];

        // Scan manga directory
        const entries = await fs.readdir(mangaDir, { withFileTypes: true });

        for (const entry of entries) {
            // Check root level images
            if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (imageExtensions.includes(ext)) {
                    images.push({
                        name: entry.name,
                        path: path.join(mangaDir, entry.name)
                    });
                }
            }
            // Check subfolders (covers, chapter folders)
            if (entry.isDirectory()) {
                const subDir = path.join(mangaDir, entry.name);
                const subEntries = await fs.readdir(subDir, { withFileTypes: true });
                for (const subEntry of subEntries) {
                    if (subEntry.isFile()) {
                        const ext = path.extname(subEntry.name).toLowerCase();
                        if (imageExtensions.includes(ext)) {
                            images.push({
                                name: `${entry.name}/${subEntry.name}`,
                                path: path.join(subDir, subEntry.name)
                            });
                        }
                    }
                }
            }
        }

        // Sort by name
        images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        res.json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

// Export helper for background auto-downloads
export function queueBackgroundDownload(bookmark, chaptersToDownload) {
    if (!chaptersToDownload || chaptersToDownload.length === 0) return null;
    
    const taskId = `${bookmark.id}-auto-${Date.now()}`;
    activeDownloads.set(taskId, {
        bookmarkId: bookmark.id, mangaTitle: bookmark.alias || bookmark.title,
        total: chaptersToDownload.length, chapters: chaptersToDownload.map(c => c.number),
        completedChapters: [], completed: 0, current: null, status: 'queued', errors: []
    });

    taskQueue.addAsync({
        type: 'download',
        description: `Auto-download ${chaptersToDownload.length} chapters for ${bookmark.alias || bookmark.title}`,
        execute: () => downloadChaptersAsync(taskId, bookmark, chaptersToDownload)
    });

    return taskId;
}

// ==================== PROXY IMAGE ====================
// Proxy image from local folder to avoid CORS issues
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

// This endpoint is registered elsewhere (in server.js)
// Export a function to register it
