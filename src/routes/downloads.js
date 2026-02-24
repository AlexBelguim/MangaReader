/**
 * Downloads Routes - Download chapters, check for updates, scan local files, CBZ support
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { bookmarkDb, chapterSettingsDb } from '../database.js';
import { downloader } from '../downloader.js';
import { CONFIG } from '../config.js';
import { scraperFactory } from '../scrapers/templates/index.js';
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
                    const chaptersToAdd = checkResult.newChapters.filter(c => !existingUrls.has(c.url));

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
        const { chapters, all } = req.body;
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

        let chaptersToDownload = [];
        if (all) {
            chaptersToDownload = bookmark.chapters
                .filter(c => !bookmark.downloadedChapters.includes(c.number))
                .filter(c => !deletedUrls.has(c.url))
                .filter(c => !excludedChapters.has(c.number))
                .filter(c => !lockedChapters.has(c.number))
                .map(c => c.number);
        } else if (chapters && Array.isArray(chapters)) {
            chaptersToDownload = chapters
                .filter(n => !bookmark.downloadedChapters.includes(n))
                .filter(n => !excludedChapters.has(n))
                .filter(n => !lockedChapters.has(n));
        }

        if (chaptersToDownload.length === 0) {
            return res.json({ message: 'No chapters to download', status: 'complete' });
        }

        const taskId = `${bookmark.id}-${Date.now()}`;
        activeDownloads.set(taskId, {
            bookmarkId: bookmark.id, mangaTitle: bookmark.alias || bookmark.title,
            total: chaptersToDownload.length, chapters: chaptersToDownload,
            completedChapters: [], completed: 0, current: null, status: 'queued', errors: []
        });

        taskQueue.addAsync({
            type: 'download',
            description: `Download ${chaptersToDownload.length} chapters for ${bookmark.alias || bookmark.title}`,
            execute: () => downloadChaptersAsync(taskId, bookmark, chaptersToDownload)
        });

        res.json({ taskId, chaptersCount: chaptersToDownload.length, chapters: chaptersToDownload });
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
    const scraper = scraperFactory.getScraperForUrl(bookmark.url);

    for (const chapterNum of chaptersToDownload) {
        if (!activeDownloads.has(taskId) || task.status === 'cancelled') break;

        while (task.status === 'paused') {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (!activeDownloads.has(taskId) || task.status === 'cancelled') break;
        }
        if (task.status === 'cancelled') break;

        const chapter = bookmark.chapters.find(c => c.number === chapterNum);
        if (!chapter) continue;

        task.current = chapterNum;
        task.remainingChapters = chaptersToDownload.slice(chaptersToDownload.indexOf(chapterNum) + 1);

        try {
            const images = await scraper.getChapterImages(chapter.url);
            await downloader.downloadChapter(bookmark.title, chapterNum, images, bookmark.alias, null, chapter.url);
            await bookmarkDb.markChapterDownloaded(bookmark.id, chapterNum, chapter.url);
        } catch (error) {
            task.errors.push({ chapter: chapterNum, error: error.message });
        }
        task.completed++;
        task.completedChapters = task.completedChapters || [];
        task.completedChapters.push(chapterNum);
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

// Scan for local manga
router.post('/scan-local', async (req, res) => {
    try {
        const downloadsDir = CONFIG.downloadsDir;
        if (!await fs.pathExists(downloadsDir)) return res.json({ found: 0, synced: 0 });

        const entries = await fs.readdir(downloadsDir, { withFileTypes: true });
        const bookmarks = await bookmarkDb.getAll();
        let found = 0, synced = 0;

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;
            const mangaFolder = entry.name;
            const chapters = await downloader.scanLocalChapters(mangaFolder);
            if (chapters.length === 0) continue;
            found++;

            const existingBookmark = bookmarks.find(b =>
                downloader.sanitizeFileName(b.title) === mangaFolder ||
                (b.alias && downloader.sanitizeFileName(b.alias) === mangaFolder)
            );

            if (existingBookmark) {
                await bookmarkDb.update(existingBookmark.id, { downloadedChapters: chapters.map(c => c.number) });
                synced++;
            }
        }

        res.json({ found, synced });
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

export default router;
