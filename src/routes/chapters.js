/**
 * Chapter Routes - Chapter-specific operations
 * Handles locking, hiding versions, volume associations, etc.
 */

import express from 'express';
import { getDb, bookmarkDb, chapterSettingsDb } from '../database.js';
import { actionHistoryService, ActionTypes, EntityTypes } from '../services/ActionHistoryService.js';
import { downloader } from '../downloader.js';

const router = express.Router();

/**
 * Lock a chapter (protect from auto-updates)
 */
router.post('/:bookmarkId/:chapterNumber/lock', async (req, res) => {
    try {
        const { bookmarkId, chapterNumber } = req.params;
        const chapterNum = parseFloat(chapterNumber);

        const bookmark = bookmarkDb.getById(bookmarkId);
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

        const bookmark = bookmarkDb.getById(bookmarkId);
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

        const bookmark = bookmarkDb.getById(bookmarkId);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const db = getDb();

        // Check if chapter is protected
        const chapter = db.prepare(
            'SELECT locked, in_volume_id FROM chapters WHERE bookmark_id = ? AND url = ?'
        ).get(bookmarkId, url);

        if (chapter?.locked || chapter?.in_volume_id) {
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

        // Delete the folder if it exists
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

        const bookmark = bookmarkDb.getById(bookmarkId);
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

        const bookmark = bookmarkDb.getById(bookmarkId);
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

        const bookmark = bookmarkDb.getById(bookmarkId);
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

        res.json({ success: true, settings: newSettings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
