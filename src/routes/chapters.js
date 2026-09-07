/**
 * Chapter Routes - Chapter-specific operations
 * Handles locking, hiding versions, volume associations, etc.
 */

import express from 'express';
import { getDb, bookmarkDb, chapterSettingsDb } from '../database.js';
import { actionHistoryService, ActionTypes, EntityTypes } from '../services/ActionHistoryService.js';
import { downloader } from '../downloader.js';
import { favoritesDb } from '../db/favorites.js';
import { trophyDb } from '../db/trophies.js';

const router = express.Router();

/**
 * Lock a chapter (protect from auto-updates)
 */
router.post('/:bookmarkId/:chapterNumber/lock', async (req, res) => {
    try {
        const { bookmarkId, chapterNumber } = req.params;
        const chapterNum = parseFloat(chapterNumber);

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();

        // Get current state for undo
        const chapter = db.prepare(
            'SELECT locked FROM chapters WHERE bookmark_id = ? AND number = ?'
        ).get(bookmarkId, chapterNum);

        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // Record action for undo (only if changing state)
        if (!chapter.locked) {
            actionHistoryService.record({
                actionType: ActionTypes.LOCK_CHAPTER,
                entityType: EntityTypes.CHAPTER,
                entityId: `${bookmarkId}:${chapterNum}`,
                bookmarkId,
                beforeState: { chapterNumber: chapterNum, locked: false },
                afterState: { chapterNumber: chapterNum, locked: true },
                description: `Locked chapter ${chapterNum} of ${bookmark.alias || bookmark.title}`
            });
        }

        // Lock the chapter
        db.prepare('UPDATE chapters SET locked = 1 WHERE bookmark_id = ? AND number = ?')
            .run(bookmarkId, chapterNum);

        // Sync chapter_settings table
        const existing = chapterSettingsDb.get(bookmarkId, chapterNum);
        chapterSettingsDb.save(bookmarkId, chapterNum, { ...existing, locked: true });

        res.json({ success: true, locked: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Unlock a chapter
 */
router.post('/:bookmarkId/:chapterNumber/unlock', async (req, res) => {
    try {
        const { bookmarkId, chapterNumber } = req.params;
        const chapterNum = parseFloat(chapterNumber);

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();

        // Get current state for undo
        const chapter = db.prepare(
            'SELECT locked FROM chapters WHERE bookmark_id = ? AND number = ?'
        ).get(bookmarkId, chapterNum);

        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // Record action for undo (only if changing state)
        if (chapter.locked) {
            actionHistoryService.record({
                actionType: ActionTypes.UNLOCK_CHAPTER,
                entityType: EntityTypes.CHAPTER,
                entityId: `${bookmarkId}:${chapterNum}`,
                bookmarkId,
                beforeState: { chapterNumber: chapterNum, locked: true },
                afterState: { chapterNumber: chapterNum, locked: false },
                description: `Unlocked chapter ${chapterNum} of ${bookmark.alias || bookmark.title}`
            });
        }

        // Unlock the chapter
        db.prepare('UPDATE chapters SET locked = 0 WHERE bookmark_id = ? AND number = ?')
            .run(bookmarkId, chapterNum);

        // Sync chapter_settings table
        const existing = chapterSettingsDb.get(bookmarkId, chapterNum);
        chapterSettingsDb.save(bookmarkId, chapterNum, { ...existing, locked: false });

        res.json({ success: true, locked: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get chapter lock status
 */
router.get('/:bookmarkId/:chapterNumber/lock-status', (req, res) => {
    try {
        const { bookmarkId, chapterNumber } = req.params;
        const chapterNum = parseFloat(chapterNumber);

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();
        const chapter = db.prepare(
            'SELECT locked, in_volume_id FROM chapters WHERE bookmark_id = ? AND number = ?'
        ).get(bookmarkId, chapterNum);

        if (!chapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        // A chapter is protected if either locked OR in a volume
        const isProtected = chapter.locked || chapter.in_volume_id;

        res.json({
            locked: !!chapter.locked,
            inVolume: !!chapter.in_volume_id,
            volumeId: chapter.in_volume_id,
            protected: !!isProtected
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Hide a chapter version (with undo support)
 */
router.post('/:bookmarkId/hide-version', async (req, res) => {
    try {
        const { bookmarkId } = req.params;
        const { chapterNumber, url } = req.body;

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();

        // Check if chapter is protected. Lock state is read from the durable
        // chapter_settings table (keyed by number) since chapters.locked can
        // drift out of sync after a re-scrape; in_volume_id still comes from
        // the chapter row.
        const chapter = db.prepare(
            'SELECT locked, in_volume_id FROM chapters WHERE bookmark_id = ? AND url = ?'
        ).get(bookmarkId, url);
        const lockedSetting = db.prepare(
            'SELECT locked FROM chapter_settings WHERE bookmark_id = ? AND chapter_number = ?'
        ).get(bookmarkId, chapterNumber);

        if (chapter?.locked || lockedSetting?.locked || chapter?.in_volume_id) {
            return res.status(400).json({
                error: 'Cannot hide a protected chapter. Unlock it first or remove from volume.'
            });
        }

        // Record action for undo
        actionHistoryService.record({
            actionType: ActionTypes.HIDE_VERSION,
            entityType: EntityTypes.VERSION,
            entityId: url,
            bookmarkId,
            beforeState: { chapterNumber, url, visible: true },
            afterState: { chapterNumber, url, visible: false },
            description: `Hid version of chapter ${chapterNumber}`
        });

        // Only delete the folder if this version was actually downloaded
        // This prevents hiding a non-downloaded version from accidentally
        // deleting another version's files on disk
        const isDownloaded = db.prepare(
            'SELECT COUNT(*) as count FROM downloaded_versions WHERE bookmark_id = ? AND url = ?'
        ).get(bookmarkId, url);

        if (isDownloaded.count > 0) {
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
        }

        // Add URL to deleted_chapter_urls
        db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)')
            .run(bookmarkId, url);

        // Remove from downloaded_versions
        db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND url = ?')
            .run(bookmarkId, url);

        // Check if chapter still has any downloaded versions
        const remainingVersions = db.prepare(
            'SELECT COUNT(*) as count FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ?'
        ).get(bookmarkId, chapterNumber);

        // If no versions remain, remove from downloaded_chapters
        if (remainingVersions.count === 0) {
            db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?')
                .run(bookmarkId, chapterNumber);

            // Cleanup favorites and trophies when the last version of a chapter is deleted/hidden
            favoritesDb.deleteForChapter(bookmarkId, chapterNumber);
            trophyDb.deleteForChapter(bookmarkId, chapterNumber);
        }

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Unhide a chapter version (restore from hidden)
 */
router.post('/:bookmarkId/unhide-version', async (req, res) => {
    try {
        const { bookmarkId } = req.params;
        const { chapterNumber, url } = req.body;

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();

        // Record action for undo
        actionHistoryService.record({
            actionType: ActionTypes.UNHIDE_VERSION,
            entityType: EntityTypes.VERSION,
            entityId: url,
            bookmarkId,
            beforeState: { chapterNumber, url, visible: false },
            afterState: { chapterNumber, url, visible: true },
            description: `Restored version of chapter ${chapterNumber}`
        });

        // Remove from deleted_chapter_urls (unhide)
        db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ? AND url = ?')
            .run(bookmarkId, url);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Check which chapters are protected (in volumes or locked)
 */
router.get('/:bookmarkId/protected', (req, res) => {
    try {
        const { bookmarkId } = req.params;

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();

        // Get all protected chapters
        const protectedChapters = db.prepare(`
      SELECT number, locked, in_volume_id 
      FROM chapters 
      WHERE bookmark_id = ? AND (locked = 1 OR in_volume_id IS NOT NULL)
    `).all(bookmarkId);

        // Group by protection type
        const locked = protectedChapters.filter(c => c.locked).map(c => c.number);
        const inVolumes = protectedChapters.filter(c => c.in_volume_id).map(c => ({
            number: c.number,
            volumeId: c.in_volume_id
        }));

        res.json({
            lockedChapters: locked,
            volumeChapters: inVolumes,
            allProtected: protectedChapters.map(c => c.number)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Bulk lock/unlock chapters
 */
router.post('/:bookmarkId/bulk-lock', async (req, res) => {
    try {
        const { bookmarkId } = req.params;
        const { chapterNumbers, lock } = req.body;

        if (!Array.isArray(chapterNumbers) || chapterNumbers.length === 0) {
            return res.status(400).json({ error: 'chapterNumbers array required' });
        }

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();
        const lockValue = lock ? 1 : 0;
        const actionType = lock ? ActionTypes.LOCK_CHAPTER : ActionTypes.UNLOCK_CHAPTER;

        // Record bulk action
        actionHistoryService.record({
            actionType,
            entityType: EntityTypes.CHAPTER,
            entityId: `${bookmarkId}:bulk`,
            bookmarkId,
            beforeState: { chapterNumbers, locked: !lock },
            afterState: { chapterNumbers, locked: lock },
            description: `${lock ? 'Locked' : 'Unlocked'} ${chapterNumbers.length} chapters`
        });

        // Update all chapters
        const stmt = db.prepare('UPDATE chapters SET locked = ? WHERE bookmark_id = ? AND number = ?');
        for (const num of chapterNumbers) {
            stmt.run(lockValue, bookmarkId, num);
        }

        // Sync chapter_settings table
        for (const num of chapterNumbers) {
            const existing = chapterSettingsDb.get(bookmarkId, num);
            chapterSettingsDb.save(bookmarkId, num, { ...existing, locked: !!lock });
        }

        res.json({
            success: true,
            updated: chapterNumbers.length,
            locked: lock
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get chapter settings
 */
router.get('/:bookmarkId/:chapterNumber/settings', (req, res) => {
    try {
        const { bookmarkId, chapterNumber } = req.params;
        const chapterNum = parseFloat(chapterNumber);

        const settings = chapterSettingsDb.get(bookmarkId, chapterNum);
        res.json(settings || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update chapter settings
 */
router.post('/:bookmarkId/:chapterNumber/settings', async (req, res) => {
    try {
        const { bookmarkId, chapterNumber } = req.params;
        const settings = req.body;
        const chapterNum = parseFloat(chapterNumber);

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        // Get existing settings to merge
        const existing = chapterSettingsDb.get(bookmarkId, chapterNum) || {};

        // Merge settings
        const newSettings = {
            ...existing,
            ...settings,
            // Ensure types
            firstPageSingle: settings.firstPageSingle !== undefined ? !!settings.firstPageSingle : existing.firstPageSingle,
            lastPageSingle: settings.lastPageSingle !== undefined ? !!settings.lastPageSingle : existing.lastPageSingle,
            locked: settings.locked !== undefined ? !!settings.locked : existing.locked,
            mode: settings.mode !== undefined ? settings.mode : existing.mode,
            direction: settings.direction !== undefined ? settings.direction : existing.direction
        };

        chapterSettingsDb.save(bookmarkId, chapterNum, newSettings);

        // Sync locked state to chapters table
        if (settings.locked !== undefined) {
            const db = getDb();
            db.prepare('UPDATE chapters SET locked = ? WHERE bookmark_id = ? AND number = ?')
                .run(newSettings.locked ? 1 : 0, bookmarkId, chapterNum);
        }

        res.json({ success: true, settings: newSettings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Delete a downloaded chapter
 */
router.delete('/', async (req, res) => {
    try {
        const { bookmarkId, chapterNumber, url } = req.body;

        if (!bookmarkId || chapterNumber === undefined) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const chapterNum = parseFloat(chapterNumber);

        // Record action for undo (ActionTypes has no DELETE_VERSION; the
        // undefined value used to fail the NOT NULL constraint and 500 here)
        actionHistoryService.record({
            actionType: ActionTypes.DELETE_CHAPTER,
            entityType: EntityTypes.VERSION,
            entityId: url,
            bookmarkId,
            beforeState: { chapterNumber: chapterNum, url, exists: true },
            afterState: { chapterNumber: chapterNum, url, exists: false },
            description: `Deleted version of chapter ${chapterNum}`
        });

        const db = getDb();

        // Delete from downloaded_versions table
        db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND url = ? AND chapter_number = ?')
            .run(bookmarkId, url, chapterNum);

        // Check if there are any remaining versions for this chapter
        const remaining = db.prepare('SELECT COUNT(*) as count FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ?')
            .get(bookmarkId, chapterNum);

        if (remaining.count === 0) {
            // Delete from downloaded_chapters
            db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?')
                .run(bookmarkId, chapterNum);

            // Cleanup favorites and trophies
            favoritesDb.deleteForChapter(bookmarkId, chapterNum);
            trophyDb.deleteForChapter(bookmarkId, chapterNum);
        }

        // Delete from disk
        await downloader.deleteChapter(bookmark.title, chapterNum, bookmark.alias, url);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== COMBINED CHAPTERS ====================

/**
 * Combine downloaded chapters into one. Body: { sources: [12.1, 12.2],
 * target: 12, title?: 'Chapter 12', deleteSources?: false }. Pages are
 * concatenated in the given order into the target's folder; the sources are
 * excluded from the list (they stay under "hidden" and can be restored by
 * splitting the combined chapter again).
 */
router.post('/:bookmarkId/merge', async (req, res) => {
    try {
        const bookmark = bookmarkDb.getById(req.params.bookmarkId, req.user.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const { sources: rawSources, target: rawTarget, title: rawTitle, deleteSources = false } = req.body || {};
        const sources = Array.isArray(rawSources) ? rawSources.map(Number) : [];
        const target = Number(rawTarget);
        if (sources.length === 0 || sources.some(n => !Number.isFinite(n))) {
            return res.status(400).json({ error: 'Pick at least one downloaded chapter to combine' });
        }
        if (new Set(sources).size !== sources.length) return res.status(400).json({ error: 'A chapter is listed twice' });
        if (!Number.isFinite(target) || target < 0) return res.status(400).json({ error: 'Chapter number must be a number' });

        const known = new Set(bookmark.chapters.map(c => c.number));
        const downloaded = new Set(bookmark.downloadedChapters || []);
        for (const n of sources) {
            if (!known.has(n)) return res.status(400).json({ error: `Chapter ${n} is not in this manga` });
            if (!downloaded.has(n)) return res.status(400).json({ error: `Chapter ${n} is not downloaded; download it first` });
        }
        if (known.has(target) && !sources.includes(target)) {
            return res.status(400).json({ error: `Chapter ${target} already exists; include it in the selection or pick another number` });
        }
        if (bookmarkDb.getMergedChapters(bookmark.id)[target]) {
            return res.status(400).json({ error: `Chapter ${target} is already a combined chapter; split it first` });
        }

        const title = (typeof rawTitle === 'string' && rawTitle.trim()) ? rawTitle.trim().slice(0, 200) : `Chapter ${target}`;
        // Use the version the reader would open for each source
        const versionOf = (n) => {
            const list = bookmark.downloadedVersions?.[n];
            return Array.isArray(list) ? list[0] || null : (list || null);
        };
        const built = await downloader.buildMergedChapter(
            bookmark.title, bookmark.alias,
            sources.map(n => ({ number: n, url: versionOf(n) })),
            target
        );
        bookmarkDb.createMergedChapter(bookmark.id, req.user.id, { target, title, sources });

        // The combined folder holds every page now; optionally drop the originals
        let removed = 0;
        if (deleteSources) {
            const db = getDb();
            for (const n of sources) {
                if (n === target) continue;
                await downloader.deleteAllChapterFolders(bookmark.title, n, bookmark.alias).catch(() => { });
                db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ?').run(bookmark.id, n);
                db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(bookmark.id, n);
                removed++;
            }
        }

        // Informational only (a combine is undone with "split", not the undo
        // button); never let the history row fail the request.
        try {
            actionHistoryService.record({
                actionType: ActionTypes.MERGE_CHAPTERS || 'merge_chapters',
                entityType: EntityTypes.CHAPTER || 'chapter',
                entityId: `${bookmark.id}:${target}`,
                bookmarkId: bookmark.id,
                beforeState: { sources },
                afterState: { target, title, pages: built.pageCount },
                description: `Combined chapters ${sources.join(', ')} into chapter ${target}`,
                canUndo: false
            });
        } catch (e) {
            console.warn(`[Chapters] Could not record combine in history: ${e.message}`);
        }

        res.json({ success: true, target, title, pageCount: built.pageCount, parts: built.parts, removedSources: removed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Split a combined chapter again: its folder and row go, the sources come back
router.post('/:bookmarkId/:chapterNumber/unmerge', async (req, res) => {
    try {
        const bookmark = bookmarkDb.getById(req.params.bookmarkId, req.user.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
        const target = parseFloat(req.params.chapterNumber);
        const merge = bookmarkDb.getMergedChapters(bookmark.id)[target];
        if (!merge) return res.status(404).json({ error: `Chapter ${target} is not a combined chapter` });

        // A target that was itself a source (12 + 12.5 -> 12) keeps its
        // number but its original pages are gone; it comes back undownloaded.
        await downloader.deleteAllChapterFolders(bookmark.title, target, bookmark.alias).catch(() => { });
        const result = bookmarkDb.removeMergedChapter(bookmark.id, target);
        if (merge.sources.includes(target)) {
            const db = getDb();
            db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ?').run(bookmark.id, target);
            db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(bookmark.id, target);
        }
        res.json({ success: true, target, sources: result?.sources || merge.sources });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== "UP TO HERE" BULK ACTIONS ====================
// Long-press on a chapter's hide / delete button: everything up to and
// including that chapter. Locked chapters and chapters in a volume are
// left alone, like the single-chapter actions do.

// Hide one version: the same steps as hide-version above. False when the
// chapter is protected.
async function hideOneVersion(db, bookmark, chapterNumber, url) {
    const chapter = db.prepare('SELECT locked, in_volume_id FROM chapters WHERE bookmark_id = ? AND url = ?').get(bookmark.id, url);
    const lockedSetting = db.prepare('SELECT locked FROM chapter_settings WHERE bookmark_id = ? AND chapter_number = ?').get(bookmark.id, chapterNumber);
    if (chapter?.locked || lockedSetting?.locked || chapter?.in_volume_id) return false;

    const isDownloaded = db.prepare('SELECT COUNT(*) as count FROM downloaded_versions WHERE bookmark_id = ? AND url = ?').get(bookmark.id, url);
    if (isDownloaded.count > 0) {
        try {
            await downloader.deleteChapter(bookmark.title, chapterNumber, bookmark.alias, url);
        } catch (e) {
            // folder already gone
        }
    }
    db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)').run(bookmark.id, url);
    db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND url = ?').run(bookmark.id, url);
    const remaining = db.prepare('SELECT COUNT(*) as count FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ?').get(bookmark.id, chapterNumber);
    if (remaining.count === 0) {
        db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(bookmark.id, chapterNumber);
        favoritesDb.deleteForChapter(bookmark.id, chapterNumber);
        trophyDb.deleteForChapter(bookmark.id, chapterNumber);
    }
    return true;
}

// Every listed version of every chapter up to the number
function versionsUpTo(bookmark, limit) {
    return (bookmark.chapters || []).filter(c => typeof c.number === 'number' && c.number <= limit && c.url);
}

router.post('/:bookmarkId/bulk-hide', async (req, res) => {
    try {
        const limit = parseFloat(req.body?.upTo);
        if (!Number.isFinite(limit)) return res.status(400).json({ error: 'upTo (a chapter number) is required' });
        const bookmark = bookmarkDb.getById(req.params.bookmarkId, req.user.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const db = getDb();
        let hidden = 0;
        let skipped = 0;
        for (const c of versionsUpTo(bookmark, limit)) {
            if (await hideOneVersion(db, bookmark, c.number, c.url)) hidden++;
            else skipped++;
        }
        actionHistoryService.record({
            actionType: ActionTypes.HIDE_VERSION,
            entityType: EntityTypes.CHAPTER,
            entityId: `${bookmark.id}:bulk`,
            bookmarkId: bookmark.id,
            beforeState: { upTo: limit, hidden: 0 },
            afterState: { upTo: limit, hidden },
            description: `Hid ${hidden} chapter version(s) up to chapter ${limit}`
        });
        res.json({ success: true, hidden, skipped });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete the downloaded files of every chapter up to the number; with
// hide: true the chapters are hidden afterwards as well
router.post('/:bookmarkId/bulk-delete', async (req, res) => {
    try {
        const limit = parseFloat(req.body?.upTo);
        if (!Number.isFinite(limit)) return res.status(400).json({ error: 'upTo (a chapter number) is required' });
        const bookmark = bookmarkDb.getById(req.params.bookmarkId, req.user.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const settings = chapterSettingsDb.getAll()[bookmark.id] || {};
        let deleted = 0;
        let skipped = 0;
        for (const num of (bookmark.downloadedChapters || []).filter(n => n <= limit)) {
            if (settings[num]?.locked) {
                skipped++;
                continue;
            }
            const chapter = (bookmark.chapters || []).find(c => c.number === num);
            const result = await downloader.deleteChapter(bookmark.title, num, bookmark.alias);
            if (!result?.success) {
                skipped++;
                continue;
            }
            await bookmarkDb.markChapterDeleted(bookmark.id, num, chapter?.url);
            favoritesDb.deleteForChapter(bookmark.id, num);
            trophyDb.deleteForChapter(bookmark.id, num);
            deleted++;
        }

        let hidden = 0;
        if (req.body?.hide) {
            const db = getDb();
            for (const c of versionsUpTo(bookmark, limit)) {
                if (await hideOneVersion(db, bookmark, c.number, c.url)) hidden++;
            }
        }
        actionHistoryService.record({
            actionType: ActionTypes.DELETE_CHAPTER,
            entityType: EntityTypes.CHAPTER,
            entityId: `${bookmark.id}:bulk`,
            bookmarkId: bookmark.id,
            beforeState: { upTo: limit },
            afterState: { upTo: limit, deleted, hidden },
            description: `Deleted the files of ${deleted} chapter(s) up to chapter ${limit}${hidden ? ` and hid ${hidden} version(s)` : ''}`
        });
        res.json({ success: true, deleted, skipped, hidden });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
