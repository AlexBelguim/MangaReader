/**
 * Bookmarks Routes - CRUD, chapter management, covers, reading progress
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import {
    bookmarkDb,
    artistDb,
    seriesDb,
    chapterSettingsDb,
    getDb
} from '../database.js';
import { downloader } from '../downloader.js';
import { CONFIG } from '../config.js';
import { validate, schemas } from '../middleware/validation.js';
import { queue } from '../queue.js';
import { scraperFactory } from '../scrapers/templates/index.js';

const router = express.Router();

// ==================== BOOKMARK CRUD ====================

// Get all bookmarks (lightweight summary for library grid)
router.get('/', async (req, res) => {
    try {
        const bookmarks = bookmarkDb.getAllSummary();
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get single bookmark
router.get('/:id', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        // Add artists to the response
        const artists = artistDb.getForBookmark(bookmark.id);
        bookmark.artists = artists.map(a => a.name);

        // Add downloaded page counts
        try {
            if (bookmark.source === 'local' || bookmark.url?.startsWith('local://')) {
                const chapters = await downloader.scanLocalChapters(bookmark.title, bookmark.alias);
                bookmark.downloadedPageCounts = {};
                chapters.forEach(c => {
                    if (c.imageCount > 0) bookmark.downloadedPageCounts[c.number] = c.imageCount;
                });
            } else {
                bookmark.downloadedPageCounts = await downloader.getDownloadedChapterPageCounts(bookmark.title, bookmark.alias);
            }
        } catch (e) {
            console.warn(`Failed to get page counts for ${bookmark.title}: ${e.message}`);
            bookmark.downloadedPageCounts = {};
        }

        res.json(bookmark);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get paginated chapters for a bookmark
router.get('/:id/chapters', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const page = Math.max(0, parseInt(req.query.page) || 0);
        const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 50));
        const filter = req.query.filter || 'all';

        let chapters = bookmark.chapters || [];

        const downloadedChapters = new Set(bookmark.downloadedChapters || []);
        const readChapters = new Set(bookmark.readChapters || []);
        const deletedUrls = new Set(bookmark.deletedChapterUrls || []);

        if (filter === 'downloaded') {
            chapters = chapters.filter(c => downloadedChapters.has(c.number) && !deletedUrls.has(c.url));
        } else if (filter === 'unread') {
            chapters = chapters.filter(c => !readChapters.has(c.number) && !deletedUrls.has(c.url));
        } else {
            chapters = chapters.filter(c => !deletedUrls.has(c.url));
        }

        chapters.sort((a, b) => b.number - a.number);

        const totalChapters = chapters.length;
        const totalPages = Math.ceil(totalChapters / limit);
        const startIndex = page * limit;
        const paginatedChapters = chapters.slice(startIndex, startIndex + limit);

        res.json({
            chapters: paginatedChapters,
            pagination: {
                page,
                limit,
                totalChapters,
                totalPages,
                hasMore: page < totalPages - 1
            },
            stats: {
                downloaded: downloadedChapters.size,
                read: readChapters.size,
                total: bookmark.chapters?.length || 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new manga
router.post('/', validate(schemas.addBookmark), async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        console.log(`[API] Adding manga from: ${url}`);

        const scraper = scraperFactory.getScraperForUrl(url);
        if (!scraper) {
            return res.status(400).json({
                error: 'Unsupported website',
                supportedSites: scraperFactory.getSupportedWebsites()
            });
        }

        const job = queue.add('scrape', { url });

        res.json({
            success: true,
            message: 'Scrape job queued',
            jobId: job.id,
            status: 'pending'
        });

    } catch (error) {
        console.error(`[API] Error adding manga:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Update bookmark (rename/alias)
router.patch('/:id', validate(schemas.renameBookmark), async (req, res) => {
    try {
        const { alias: rawAlias, readChapters } = req.body;
        const bookmarkId = req.params.id;

        const currentBookmark = bookmarkDb.getById(bookmarkId);
        if (!currentBookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        if (readChapters !== undefined && rawAlias === undefined) {
            const result = bookmarkDb.update(bookmarkId, { readChapters });
            return res.json(result);
        }

        const alias = rawAlias?.trim() || null;

        console.log(`[Rename] Bookmark: ${currentBookmark.title}`);
        console.log(`[Rename] Old alias: "${currentBookmark.alias}" -> New alias: "${alias}"`);

        const oldAlias = currentBookmark.alias;
        const newAlias = alias;

        if (oldAlias !== newAlias) {
            console.log(`[Rename] Alias changed, attempting folder rename...`);
            const folderResult = await downloader.renameMangaFolder(
                currentBookmark.title,
                oldAlias,
                newAlias
            );

            console.log(`[Rename] Folder result:`, folderResult);

            if (!folderResult.success && folderResult.message !== 'No existing folder to rename') {
                return res.status(400).json({ error: folderResult.message });
            }

            if (folderResult.renamed && currentBookmark.localCover) {
                const oldFolderName = folderResult.oldFolderName;
                const newFolderName = folderResult.newFolderName;
                const newLocalCover = currentBookmark.localCover.replace(
                    `/downloads/${encodeURIComponent(oldFolderName)}/`,
                    `/downloads/${encodeURIComponent(newFolderName)}/`
                );
                console.log(`[Rename] Updating localCover: ${currentBookmark.localCover} -> ${newLocalCover}`);
                const result = bookmarkDb.update(bookmarkId, { alias, localCover: newLocalCover });
                return res.json({ ...result, folderRenamed: true });
            }

            const result = bookmarkDb.update(bookmarkId, { alias });
            return res.json(result);
        } else {
            return res.json({ success: true, message: 'No changes' });
        }
    } catch (error) {
        console.error(`[Rename] Error:`, error);
        res.status(500).json({ error: error.message });
    }
});

// Hide all non-downloaded versions
router.post('/:id/hide-undownloaded-versions', async (req, res) => {
    try {
        const bookmark = bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();
        const downloadedVersions = bookmark.downloadedVersions || {};
        const chapters = bookmark.chapters || [];
        const existingHidden = new Set(bookmark.deletedChapterUrls || []);

        let hiddenCount = 0;

        for (const [chapterNum, downloadedUrls] of Object.entries(downloadedVersions)) {
            const num = parseFloat(chapterNum);
            const downloadedSet = new Set(Array.isArray(downloadedUrls) ? downloadedUrls : [downloadedUrls]);

            const allVersions = chapters.filter(c => c.number === num);

            for (const version of allVersions) {
                if (!downloadedSet.has(version.url) && !existingHidden.has(version.url)) {
                    db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)')
                        .run(bookmark.id, version.url);
                    hiddenCount++;
                }
            }
        }

        console.log(`[Hide Versions] Hidden ${hiddenCount} undownloaded versions for ${bookmark.alias || bookmark.title}`);
        res.json({ success: true, hiddenCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete bookmark
router.delete('/:id', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const deleteFolder = req.query.deleteFolder === 'true';

        if (deleteFolder) {
            try {
                const mangaDir = downloader.getMangaDir(bookmark.title, bookmark.alias);
                if (await fs.pathExists(mangaDir)) {
                    await fs.remove(mangaDir);
                    console.log(`Deleted manga folder: ${mangaDir}`);
                }
            } catch (folderError) {
                console.error('Error deleting manga folder:', folderError);
            }
        }

        const result = bookmarkDb.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== CATEGORY ASSOCIATIONS ====================

// Set categories for a bookmark
router.post('/:id/categories', async (req, res) => {
    try {
        const { categories } = req.body;
        const result = await bookmarkDb.setBookmarkCategories(req.params.id, categories || []);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ARTIST ASSOCIATIONS ====================

// Get artists for a bookmark
router.get('/:id/artists', (req, res) => {
    try {
        const artists = artistDb.getForBookmark(req.params.id);
        res.json({ artists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set artists for a bookmark
router.post('/:id/artists', (req, res) => {
    try {
        const { artists } = req.body;
        artistDb.setForBookmark(req.params.id, artists || []);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add artist to bookmark
router.post('/:id/artists/add', (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Artist name required' });
        }
        artistDb.addToBookmark(req.params.id, name);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove artist from bookmark
router.delete('/:id/artists/:artistId', (req, res) => {
    try {
        artistDb.removeFromBookmark(req.params.id, parseInt(req.params.artistId));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== SERIES ASSOCIATIONS ====================

// Get series for a bookmark
router.get('/:id/series', (req, res) => {
    try {
        const series = seriesDb.getSeriesForBookmark(req.params.id);
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== CHAPTER MANAGEMENT ====================

// Hide a chapter version
router.post('/:id/hide-version', async (req, res) => {
    try {
        const { chapterNumber, url } = req.body;
        const bookmark = bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        try {
            await downloader.deleteChapter(
                bookmark.title,
                chapterNumber,
                bookmark.alias,
                url
            );
        } catch (e) {
            // Ignore errors if folder doesn't exist
        }

        const db = getDb();

        db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)')
            .run(bookmark.id, url);

        db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND url = ?')
            .run(bookmark.id, url);

        const remainingVersions = db.prepare(
            'SELECT COUNT(*) as count FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ?'
        ).get(bookmark.id, chapterNumber);

        if (remainingVersions.count === 0) {
            db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?')
                .run(bookmark.id, chapterNumber);
        }

        console.log(`[Hide Version] Hidden chapter ${chapterNumber} version for ${bookmark.alias || bookmark.title}`);
        res.json({ success: true, message: 'Version hidden' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unhide a chapter version
router.post('/:id/unhide-version', async (req, res) => {
    try {
        const { chapterNumber, url } = req.body;
        const bookmark = bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();
        db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ? AND url = ?')
            .run(bookmark.id, url);

        console.log(`[Unhide Version] Restored chapter ${chapterNumber} version for ${bookmark.alias || bookmark.title}`);
        res.json({ success: true, message: 'Version restored' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get hidden versions for a chapter
router.get('/:id/hidden-versions/:chapterNumber', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        const chapterNum = parseFloat(req.params.chapterNumber);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const deletedUrls = new Set(bookmark.deletedChapterUrls || []);
        const chapters = bookmark.chapters || [];

        const hiddenVersions = chapters
            .filter(c => c.number === chapterNum && deletedUrls.has(c.url))
            .map(c => ({ number: c.number, title: c.title, url: c.url }));

        res.json({ success: true, hiddenVersions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove chapter entry (without blacklisting)
router.post('/:id/remove-chapter-entry', async (req, res) => {
    try {
        const { chapterNumber } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const chapterNum = parseFloat(chapterNumber);

        const updatedChapters = (bookmark.chapters || []).filter(c => c.number !== chapterNum);
        const updatedDownloaded = (bookmark.downloadedChapters || []).filter(n => n !== chapterNum);
        const updatedVersions = { ...bookmark.downloadedVersions };
        delete updatedVersions[chapterNum];
        const updatedReadChapters = (bookmark.readChapters || []).filter(n => n !== chapterNum);
        const updatedProgress = { ...bookmark.readingProgress };
        delete updatedProgress[chapterNum];
        const chapterUrls = (bookmark.chapters || []).filter(c => c.number === chapterNum).map(c => c.url);
        const updatedDeletedUrls = (bookmark.deletedChapterUrls || []).filter(url => !chapterUrls.includes(url));

        await bookmarkDb.update(bookmark.id, {
            chapters: updatedChapters,
            downloadedChapters: updatedDownloaded,
            downloadedVersions: updatedVersions,
            readChapters: updatedReadChapters,
            readingProgress: updatedProgress,
            deletedChapterUrls: updatedDeletedUrls,
            totalChapters: new Set(updatedChapters.map(c => c.number)).size
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Exclude chapter permanently
router.post('/:id/exclude-chapter', async (req, res) => {
    try {
        const { chapterNumber } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const chapterNum = parseFloat(chapterNumber);

        await downloader.deleteChapter(bookmark.title, chapterNum, bookmark.alias);

        const updatedDownloaded = (bookmark.downloadedChapters || []).filter(n => n !== chapterNum);
        const updatedVersions = { ...bookmark.downloadedVersions };
        delete updatedVersions[chapterNum];

        await bookmarkDb.update(bookmark.id, {
            downloadedChapters: updatedDownloaded,
            downloadedVersions: updatedVersions
        });

        bookmarkDb.excludeChapter(bookmark.id, chapterNum);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Unexclude a chapter
router.post('/:id/unexclude-chapter', async (req, res) => {
    try {
        const { chapterNumber } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const chapterNum = parseFloat(chapterNumber);
        bookmarkDb.unexcludeChapter(bookmark.id, chapterNum);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get excluded chapters
router.get('/:id/excluded-chapters', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const excludedChapters = bookmarkDb.getExcludedChapters(bookmark.id);
        res.json({ success: true, excludedChapters });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Manually add a chapter
router.post('/:id/chapters', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).send('Not found');

        const { number, url, title } = req.body;
        if (number === undefined || !url) {
            return res.status(400).json({ error: 'Chapter number and URL required' });
        }

        const newChapter = {
            number: parseFloat(number),
            url,
            title: title || `Chapter ${number}`,
            date: new Date().toISOString()
        };

        const exists = bookmark.chapters.some(c => c.url === url);
        if (!exists) {
            const chapters = [...bookmark.chapters, newChapter];
            chapters.sort((a, b) => b.number - a.number);
            await bookmarkDb.update(req.params.id, { chapters });
            res.json({ success: true, chapter: newChapter });
        } else {
            res.json({ success: false, message: 'Chapter already exists' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Delete a specific chapter version (for duplicates)
router.delete('/:id/chapters', async (req, res) => {
    try {
        const { chapterNumber, url } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        try {
            await downloader.deleteChapter(
                bookmark.title,
                chapterNumber,
                bookmark.alias,
                url
            );
        } catch (e) {
            // Ignore errors if folder doesn't exist
        }

        const downloadedVersions = { ...(bookmark.downloadedVersions || {}) };
        const numKey = String(chapterNumber);
        if (downloadedVersions[numKey]) {
            const versions = downloadedVersions[numKey];
            if (Array.isArray(versions)) {
                downloadedVersions[numKey] = versions.filter(v => v !== url);
                if (downloadedVersions[numKey].length === 0) {
                    delete downloadedVersions[numKey];
                } else if (downloadedVersions[numKey].length === 1) {
                    downloadedVersions[numKey] = downloadedVersions[numKey][0];
                }
            } else if (versions === url) {
                delete downloadedVersions[numKey];
            }
        }

        let downloadedChapters = [...(bookmark.downloadedChapters || [])];
        if (!downloadedVersions[numKey]) {
            downloadedChapters = downloadedChapters.filter(n => n !== chapterNumber);
        }

        const updatedChapters = bookmark.chapters.filter(ch =>
            !(ch.number === chapterNumber && ch.url === url)
        );

        const updatedDuplicates = (bookmark.duplicateChapters || []).map(dup => {
            if (dup.number === chapterNumber) {
                const newVersions = dup.versions.filter(v => v.url !== url);
                if (newVersions.length <= 1) {
                    return null;
                }
                return { ...dup, versions: newVersions };
            }
            return dup;
        }).filter(Boolean);

        await bookmarkDb.update(req.params.id, {
            chapters: updatedChapters,
            duplicateChapters: updatedDuplicates,
            downloadedVersions,
            downloadedChapters
        });

        res.json({ success: true, message: 'Chapter version removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== READING PROGRESS ====================

// Update reading progress
router.post('/:id/reading-progress', async (req, res) => {
    try {
        const { chapter, page, totalPages } = req.body;
        const result = await bookmarkDb.updateReadingProgress(
            req.params.id,
            parseFloat(chapter),
            page,
            totalPages
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark chapter as read/unread
router.post('/:id/chapters/:num/read', async (req, res) => {
    try {
        const { isRead } = req.body;
        const result = await bookmarkDb.markChapterRead(
            req.params.id,
            parseFloat(req.params.num),
            isRead !== false
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark all chapters below as read
router.post('/:id/chapters/:num/read-below', async (req, res) => {
    try {
        const result = await bookmarkDb.markChaptersReadBelow(
            req.params.id,
            parseFloat(req.params.num)
        );
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== COVERS ====================

// Get all covers for a manga
router.get('/:id/covers', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const covers = await downloader.getCovers(bookmark.title, bookmark.alias);
        const activeCover = await downloader.getActiveCover(bookmark.title, bookmark.alias);

        res.json({
            covers: covers.map(c => ({
                filename: c.filename,
                url: `/api/bookmarks/${req.params.id}/covers/${encodeURIComponent(c.filename)}`,
                isActive: activeCover && c.filename === activeCover.filename
            })),
            activeCover: activeCover ? {
                filename: activeCover.filename,
                url: `/api/bookmarks/${req.params.id}/covers/${encodeURIComponent(activeCover.filename)}`
            } : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve a specific cover image
router.get('/:id/covers/:filename', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        let coverDir;

        const reqFilename = decodeURIComponent(req.params.filename);
        if (bookmark.local_cover && bookmark.local_cover.endsWith(reqFilename)) {
            let relPath = bookmark.local_cover;
            if (relPath.startsWith('/downloads/')) {
                relPath = relPath.substring(11);
            } else if (relPath.startsWith('downloads/')) {
                relPath = relPath.substring(10);
            }

            try {
                relPath = decodeURIComponent(relPath);
            } catch (e) { }

            const fullPath = path.join(CONFIG.downloadsDir, relPath);
            coverDir = path.dirname(fullPath);
        } else {
            coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
        }

        const filePath = path.join(coverDir, reqFilename);

        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ error: 'Cover not found' });
        }

        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set active cover
router.post('/:id/covers/:filename/activate', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const filename = decodeURIComponent(req.params.filename);
        await downloader.setActiveCover(bookmark.title, filename, bookmark.alias);

        const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
        const newCoverPath = path.join(coverDir, filename);
        await bookmarkDb.update(bookmark.id, { localCover: newCoverPath });

        res.json({ success: true, message: 'Cover activated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set first image of first chapter as cover
router.post('/:id/covers/from-chapter', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const chapters = await downloader.scanLocalChapters(bookmark.title, bookmark.alias);
        if (chapters.length === 0) {
            return res.status(404).json({ error: 'No downloaded chapters found' });
        }

        const firstChapter = chapters.sort((a, b) => a.number - b.number)[0];
        const chapterDir = downloader.getChapterDir(bookmark.title, firstChapter.number, bookmark.alias, firstChapter.version);

        const files = await fs.readdir(chapterDir);
        const imageFiles = files
            .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
            .sort();

        if (imageFiles.length === 0) {
            return res.status(404).json({ error: 'No images found in chapter' });
        }

        const firstImagePath = path.join(chapterDir, imageFiles[0]);

        const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
        await fs.ensureDir(coverDir);

        const ext = path.extname(imageFiles[0]);
        const coverFilename = `cover_from_chapter${ext}`;
        const coverPath = path.join(coverDir, coverFilename);

        await fs.copy(firstImagePath, coverPath);

        await downloader.setActiveCover(bookmark.title, coverFilename, bookmark.alias);
        await bookmarkDb.update(bookmark.id, { localCover: coverPath });

        res.json({ success: true, coverPath: `/api/bookmarks/${bookmark.id}/covers/${encodeURIComponent(coverFilename)}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== MISC BOOKMARK OPERATIONS ====================

// Clear deleted URL tracking for a chapter
router.post('/:id/clear-deleted/:url', async (req, res) => {
    try {
        const url = decodeURIComponent(req.params.url);
        await bookmarkDb.clearDeletedUrl(req.params.id, url);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear updated chapter flag
router.post('/:id/clear-updated/:num', async (req, res) => {
    try {
        const chapterNum = parseFloat(req.params.num);
        await bookmarkDb.clearUpdatedChapter(req.params.id, chapterNum);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Toggle auto-check for a bookmark
router.post('/:id/auto-check', async (req, res) => {
    try {
        const { enabled, autoDownload } = req.body;
        const updates = {};

        if (enabled !== undefined) {
            updates.autoCheck = enabled ? 1 : 0;
        }
        if (autoDownload !== undefined) {
            updates.autoDownload = autoDownload ? 1 : 0;
        }

        const result = bookmarkDb.update(req.params.id, updates);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
