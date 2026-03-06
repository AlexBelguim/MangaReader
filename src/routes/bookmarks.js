/**
 * Bookmarks Routes - CRUD, chapter management, covers, reading progress
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
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

// Get all unique artists
router.get('/artists/all', (req, res) => {
    try {
        const db = getDb();
        const artists = db.prepare('SELECT DISTINCT name FROM artists ORDER BY name').all();
        res.json(artists.map(a => a.name));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all unique categories
router.get('/categories/all', (req, res) => {
    try {
        const db = getDb();
        const categories = db.prepare('SELECT DISTINCT name FROM categories ORDER BY name').all();
        res.json(categories.map(c => c.name));
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

// Update bookmark (rename/alias, tags)
router.patch('/:id', validate(schemas.renameBookmark), async (req, res) => {
    try {
        const { alias: rawAlias, readChapters, tags, localCover } = req.body;
        const bookmarkId = req.params.id;

        const currentBookmark = bookmarkDb.getById(bookmarkId);
        if (!currentBookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        // Handle tags update
        if (tags !== undefined) {
            const tagsJson = tags ? JSON.stringify(tags) : null;
            bookmarkDb.update(bookmarkId, { tags: tagsJson });
        }

        // Handle localCover update (don't affect alias)
        if (localCover !== undefined) {
            bookmarkDb.update(bookmarkId, { localCover });
        }

        if (readChapters !== undefined && rawAlias === undefined && tags === undefined && localCover === undefined) {
            const result = bookmarkDb.update(bookmarkId, { readChapters });
            return res.json(result);
        }

        // Only update alias if explicitly provided in request
        if (rawAlias === undefined) {
            // No alias in request, don't change it - just return current bookmark
            return res.json(currentBookmark);
        }

        const alias = rawAlias?.trim() || null;

        console.log(`[Rename] Bookmark: ${currentBookmark.title}`);
        console.log(`[Rename] Old alias: "${currentBookmark.alias}" -> New alias: "${alias}"`);

        const oldAlias = currentBookmark.alias;
        const newAlias = alias;

        // Always update alias even if it hasn't changed (to ensure it's saved)
        const result = bookmarkDb.update(bookmarkId, { alias });

        if (oldAlias !== newAlias) {
            console.log(`[Alias] Alias changed, attempting folder rename...`);
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
                // Simple string replacement - works with any path format
                let newLocalCover = currentBookmark.localCover.replace(
                    oldFolderName,
                    newFolderName
                );
                console.log(`[Rename] Updating localCover: ${currentBookmark.localCover} -> ${newLocalCover}`);
                bookmarkDb.update(bookmarkId, { localCover: newLocalCover });
                return res.json({ ...result, folderRenamed: true });
            }
        }

        return res.json(result);
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
            queue.add('delete-manga-folder', {
                title: bookmark.title,
                alias: bookmark.alias
            });
        }

        const result = bookmarkDb.remove(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Migrate source - change manga URL while preserving downloaded chapters as local
router.post('/:id/migrate-source', async (req, res) => {
    try {
        const { newUrl } = req.body;
        if (!newUrl) return res.status(400).json({ error: 'New URL is required' });

        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const scraper = scraperFactory.getScraperForUrl(newUrl);
        if (!scraper) return res.status(400).json({ error: 'No scraper found for this URL' });

        const db = getDb();
        const downloadedChapters = new Set(bookmark.downloadedChapters || []);

        // Convert downloaded chapter URLs to local:// in both chapters and downloaded_versions tables
        if (downloadedChapters.size > 0) {
            const chapters = bookmark.chapters || [];

            for (const ch of chapters) {
                if (downloadedChapters.has(ch.number)) {
                    const oldUrl = ch.url;
                    // Include version to avoid UNIQUE constraint when multiple versions of same chapter exist
                    const localUrl = `local://${bookmark.id}/chapter-${ch.number}-v${ch.version || 1}`;

                    // Update chapter URL to local
                    db.prepare('UPDATE chapters SET url = ?, removed_from_remote = 1 WHERE bookmark_id = ? AND url = ?')
                        .run(localUrl, bookmark.id, oldUrl);

                    // Update downloaded_versions to point to local URL
                    db.prepare('UPDATE downloaded_versions SET url = ? WHERE bookmark_id = ? AND chapter_number = ? AND url = ?')
                        .run(localUrl, bookmark.id, ch.number, oldUrl);

                    // Clean up any deleted_chapter_urls referencing the old URL
                    db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ? AND url = ?')
                        .run(bookmark.id, oldUrl);
                }
            }
        }

        // Update the bookmark's URL and website
        const newWebsite = scraper.websiteName || new URL(newUrl).hostname;
        db.prepare('UPDATE bookmarks SET url = ?, website = ?, updated_at = ? WHERE id = ?')
            .run(newUrl, newWebsite, new Date().toISOString(), bookmark.id);

        console.log(`[Migrate Source] ${bookmark.alias || bookmark.title}: ${bookmark.url} -> ${newUrl}`);
        console.log(`[Migrate Source] Converted ${downloadedChapters.size} downloaded chapters to local versions`);

        const updated = await bookmarkDb.getById(bookmark.id);
        res.json({ success: true, bookmark: updated, migratedChapters: downloadedChapters.size });
    } catch (error) {
        console.error('[Migrate Source] Error:', error);
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

        // Queue the actual file deletion to run in the background
        // so the UI doesn't freeze waiting for local file IO
        queue.add('delete-chapter', {
            bookmarkId: bookmark.id,
            title: bookmark.title,
            chapterNumber: chapterNumber,
            alias: bookmark.alias,
            url: url
        });

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

// Set cover from selected image path (copies to covers folder)
router.post('/:id/covers/from-image', async (req, res) => {
    try {
        const { imagePath } = req.body;
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        if (!imagePath) {
            return res.status(400).json({ error: 'Image path required' });
        }

        // Copy image to covers folder with unique name
        const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
        await fs.ensureDir(coverDir);

        // Generate unique filename using hash of source path
        const sourceHash = downloader.hashString(imagePath);
        const ext = path.extname(imagePath) || '.jpg';
        const coverFilename = `cover_${sourceHash}${ext}`;
        const coverPath = path.join(coverDir, coverFilename);

        // Copy the image to covers folder
        await fs.copy(imagePath, coverPath);

        // Update active cover
        await downloader.setActiveCover(bookmark.title, coverFilename, bookmark.alias);

        // Save full path to database
        await bookmarkDb.update(bookmark.id, { localCover: coverPath });

        res.json({ success: true, coverPath: `/api/bookmarks/${bookmark.id}/covers/${encodeURIComponent(coverFilename)}` });
    } catch (error) {
        console.error('Error setting cover from image:', error);
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
        const { enabled, autoDownload, schedule, day, time } = req.body;
        const updates = {};

        if (enabled !== undefined) {
            updates.autoCheck = enabled ? 1 : 0;
        }
        if (autoDownload !== undefined) {
            updates.autoDownload = autoDownload ? 1 : 0;
        }
        if (schedule !== undefined) {
            updates.checkSchedule = schedule; // 'daily', 'weekly', or null
        }
        if (day !== undefined) {
            updates.checkDay = day; // 'monday', 'tuesday', etc.
        }
        if (time !== undefined) {
            updates.checkTime = time; // 'HH:MM' format
        }

        // Calculate next check time
        if (updates.autoCheck === 1 || (enabled === undefined && updates.checkSchedule)) {
            const bookmark = bookmarkDb.getById(req.params.id);
            const sched = updates.checkSchedule || bookmark?.checkSchedule || 'daily';
            const checkDay = updates.checkDay || bookmark?.checkDay || 'monday';
            const checkTime = updates.checkTime || bookmark?.checkTime || '06:00';
            updates.nextCheck = calculateNextCheck(sched, checkDay, checkTime);
        }
        if (updates.autoCheck === 0) {
            updates.nextCheck = null;
            updates.checkSchedule = null;
            updates.checkDay = null;
            updates.checkTime = null;
        }

        const result = bookmarkDb.update(req.params.id, updates);
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper to calculate next check time
function calculateNextCheck(schedule, day, time) {
    const now = new Date();
    const [hours, minutes] = (time || '06:00').split(':').map(Number);

    if (schedule === 'daily') {
        const next = new Date(now);
        next.setHours(hours, minutes, 0, 0);
        if (next <= now) {
            next.setDate(next.getDate() + 1);
        }
        return next.toISOString();
    }

    if (schedule === 'weekly') {
        const dayMap = {
            'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6
        };
        const targetDay = dayMap[(day || 'monday').toLowerCase()] || 1;
        const next = new Date(now);
        next.setHours(hours, minutes, 0, 0);

        const currentDay = next.getDay();
        let daysUntil = targetDay - currentDay;
        if (daysUntil < 0 || (daysUntil === 0 && next <= now)) {
            daysUntil += 7;
        }
        next.setDate(next.getDate() + daysUntil);
        return next.toISOString();
    }

    // Default: 6 hours from now
    return new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();
}

// ==================== PAGE MANIPULATION ====================

// Helper to get chapter directory for a bookmark
async function getChapterDir(bookmarkId, chapterNum) {
    const bookmark = await bookmarkDb.getById(bookmarkId);
    if (!bookmark) return null;

    const versions = await downloader.getExistingVersions(bookmark.title, parseFloat(chapterNum), bookmark.alias);
    const validVersion = versions.find(v => v.imageCount > 0);
    return validVersion ? validVersion.path : null;
}

// Helper to get sorted image list for a chapter
async function getChapterImages(bookmarkId, chapterNum) {
    const chapterDir = await getChapterDir(bookmarkId, chapterNum);
    if (!chapterDir || !await fs.pathExists(chapterDir)) return [];

    const files = await fs.readdir(chapterDir);
    const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    images.sort(collator.compare);
    return images;
}

// Rotate a page
router.post('/:id/chapters/:chapterNum/pages/rotate', async (req, res) => {
    try {
        const { id, chapterNum } = req.params;
        const { filename, degrees = 90 } = req.body;

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const chapterDir = await getChapterDir(id, chapterNum);
        if (!chapterDir) {
            return res.status(404).json({ error: 'Chapter not found or not downloaded' });
        }

        const filePath = path.join(chapterDir, filename);
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ error: 'Image file not found' });
        }

        // Read file to buffer to avoid file locking on Windows
        const fileBuffer = await fs.readFile(filePath);

        // Rotate the image
        await sharp(fileBuffer)
            .rotate(degrees)
            .toFile(filePath + '.tmp');

        await fs.move(filePath + '.tmp', filePath, { overwrite: true });

        // Return updated image list
        const images = await getChapterImages(id, chapterNum);
        res.json({ images });
    } catch (error) {
        // Handle EBUSY error - file is locked by another process
        if (error.code === 'EBUSY' || error.code === 'ENOENT') {
            return res.status(423).json({ error: 'File is currently in use. Please close the reader and try again.' });
        }
        res.status(500).json({ error: error.message });
    }
});

// Swap two pages
router.post('/:id/chapters/:chapterNum/pages/swap', async (req, res) => {
    try {
        const { id, chapterNum } = req.params;
        const { filenameA, filenameB } = req.body;

        if (!filenameA || !filenameB) {
            return res.status(400).json({ error: 'Both filenameA and filenameB are required' });
        }

        const chapterDir = await getChapterDir(id, chapterNum);
        if (!chapterDir) {
            return res.status(404).json({ error: 'Chapter not found or not downloaded' });
        }

        const filePathA = path.join(chapterDir, filenameA);
        const filePathB = path.join(chapterDir, filenameB);

        if (!await fs.pathExists(filePathA)) {
            return res.status(404).json({ error: 'Image file A not found' });
        }
        if (!await fs.pathExists(filePathB)) {
            return res.status(404).json({ error: 'Image file B not found' });
        }

        // Swap the files
        const tempPath = path.join(chapterDir, '.swap_temp');
        await fs.move(filePathA, tempPath);
        await fs.move(filePathB, filePathA);
        await fs.move(tempPath, filePathB);

        // Return updated image list
        const images = await getChapterImages(id, chapterNum);
        res.json({ images });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Split a page into left and right halves
router.post('/:id/chapters/:chapterNum/pages/split', async (req, res) => {
    try {
        const { id, chapterNum } = req.params;
        const { filename } = req.body;

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }

        const chapterDir = await getChapterDir(id, chapterNum);
        if (!chapterDir) {
            return res.status(404).json({ error: 'Chapter not found or not downloaded' });
        }

        const filePath = path.join(chapterDir, filename);
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ error: 'Image file not found' });
        }

        // Read file to buffer to prevent file locking on Windows
        const fileBuffer = await fs.readFile(filePath);

        // Get image metadata
        const metadata = await sharp(fileBuffer).metadata();
        const width = metadata.width;
        const height = metadata.height;

        if (!width || !height) {
            return res.status(500).json({ error: 'Could not read image metadata' });
        }

        const halfWidth = Math.floor(width / 2);
        const ext = path.extname(filename);

        // Create split halves as temp files with proper names that will be caught by filter
        // For manga (RTL), the RIGHT half of the full image should be read FIRST.
        // So we name the right side as part 1, and left side as part 2.
        const baseName = path.basename(filename, ext);
        const rightTempPath = path.join(chapterDir, `${baseName}_1_right${ext}`);
        const leftTempPath = path.join(chapterDir, `${baseName}_2_left${ext}`);

        // Create right half (second half of the image, read first in RTL)
        await sharp(fileBuffer)
            .extract({ left: halfWidth, top: 0, width: width - halfWidth, height })
            .toFile(rightTempPath);

        // Create left half (first half of the image, read second in RTL)
        await sharp(fileBuffer)
            .extract({ left: 0, top: 0, width: halfWidth, height })
            .toFile(leftTempPath);

        // Try to delete the original double spread with retries
        let originalDeleted = false;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                await fs.remove(filePath);
                originalDeleted = true;
                break;
            } catch (deleteErr) {
                if (deleteErr.code === 'EBUSY') {
                    console.warn(`Delete attempt ${attempt + 1} failed, retrying in 1s...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    throw deleteErr;
                }
            }
        }

        if (!originalDeleted) {
            console.warn('Could not delete original file after 3 attempts (may be in use)');
        }

        // Get all images (including the new split files) and rename to sequential numbers
        const allFiles = await fs.readdir(chapterDir);
        // Include files with _1_right and _2_left suffixes too
        const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f) || /_1_right\.(jpg|jpeg|png|webp|gif)$/i.test(f) || /_2_left\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        imageFiles.sort(collator.compare);

        // If original wasn't deleted, it will be renamed too (which is fine)
        const filesToRename = imageFiles;

        // Rename all images to sequential numbers using a two-pass approach to avoid overwriting
        // Pass 1: Rename all files to a temporary namespace
        const tempFilesMap = [];
        for (let i = 0; i < filesToRename.length; i++) {
            const oldName = filesToRename[i];
            const fileExt = path.extname(oldName);
            const tempName = `temp_split_rename_${Date.now()}_${i}${fileExt}`;
            const oldPath = path.join(chapterDir, oldName);
            const tempPath = path.join(chapterDir, tempName);

            try {
                await fs.rename(oldPath, tempPath);
            } catch (renameErr) {
                console.warn('Rename to temp failed, trying copy+delete:', renameErr.message);
                try {
                    await fs.copy(oldPath, tempPath);
                    await fs.remove(oldPath);
                } catch (copyErr) {
                    console.warn('Copy+delete to temp also failed:', copyErr.message);
                    // If we can't move it to temp, we risk data loss, but try to continue
                }
            }
            tempFilesMap.push({ tempName, index: i, ext: fileExt, original: oldName });
        }

        // Pass 2: Rename from temp namespace to final zero-padded names
        const renamedFiles = [];
        for (const item of tempFilesMap) {
            const newName = String(item.index + 1).padStart(3, '0') + item.ext;
            const tempPath = path.join(chapterDir, item.tempName);
            const newPath = path.join(chapterDir, newName);

            try {
                if (await fs.pathExists(tempPath)) {
                    await fs.rename(tempPath, newPath);
                    renamedFiles.push(newName);
                } else {
                    renamedFiles.push(item.original); // Fallback if temp file missing
                }
            } catch (renameErr) {
                console.warn('Final rename failed, trying copy+delete:', renameErr.message);
                try {
                    await fs.copy(tempPath, newPath);
                    await fs.remove(tempPath);
                    renamedFiles.push(newName);
                } catch (copyErr) {
                    console.warn('Final copy+delete failed:', copyErr.message);
                    renamedFiles.push(item.original);
                }
            }
        }

        // Sort the renamed files numerically
        renamedFiles.sort(collator.compare);

        // Convert to URLs
        const images = renamedFiles.map(f =>
            `/api/public/chapter-images/${id}/${chapterNum}/${encodeURIComponent(f)}`
        );

        // Return updated image list
        res.json({ images });
    } catch (error) {
        // Handle file locked errors more gracefully
        if (error.code === 'EBUSY' || error.code === 'ENOENT') {
            // Still return success - the split likely worked, just the delete failed
            const chapterDir = await getChapterDir(id, chapterNum);
            if (chapterDir) {
                const allFiles = await fs.readdir(chapterDir);
                const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
                const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
                imageFiles.sort(collator.compare);
                // Convert to URLs
                const images = imageFiles.map(f =>
                    `/api/public/chapter-images/${id}/${chapterNum}/${encodeURIComponent(f)}`
                );
                return res.json({ images, warning: 'Original file could not be deleted. You may need to refresh or close the reader.' });
            }
        }
        res.status(500).json({ error: error.message });
    }
});

// Delete a page
router.delete('/:id/chapters/:chapterNum/pages/:filename', async (req, res) => {
    try {
        const { id, chapterNum, filename } = req.params;
        const decodedFilename = decodeURIComponent(filename);

        const chapterDir = await getChapterDir(id, chapterNum);
        if (!chapterDir) {
            return res.status(404).json({ error: 'Chapter not found or not downloaded' });
        }

        const filePath = path.join(chapterDir, decodedFilename);
        if (!await fs.pathExists(filePath)) {
            return res.status(404).json({ error: 'Image file not found' });
        }

        // Delete the file
        await fs.remove(filePath);

        // Return updated image list
        const images = await getChapterImages(id, chapterNum);
        res.json({ images });
    } catch (error) {
        // Handle EBUSY error - file is locked by another process
        if (error.code === 'EBUSY' || error.code === 'ENOENT') {
            return res.status(423).json({ error: 'File is currently in use. Please close the reader and try again.' });
        }
        res.status(500).json({ error: error.message });
    }
});

export default router;
