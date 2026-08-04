import { getDb } from './connection.js';

/**
 * AniList data access: per-user OAuth tokens and per-bookmark media mappings
 * used by the reading-progress sync (see services/anilistService.js).
 */
export const anilistDb = {
    // ---------------- Tokens ----------------

    saveToken(userId, accessToken, anilistUser = {}) {
        const db = getDb();
        db.prepare(`
            INSERT OR REPLACE INTO anilist_tokens (user_id, access_token, anilist_user_id, anilist_username, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))
        `).run(userId, accessToken, anilistUser.id ?? null, anilistUser.name ?? null);
    },

    getToken(userId) {
        const db = getDb();
        return db.prepare('SELECT * FROM anilist_tokens WHERE user_id = ?').get(userId) || null;
    },

    deleteToken(userId) {
        const db = getDb();
        db.prepare('DELETE FROM anilist_tokens WHERE user_id = ?').run(userId);
    },

    // ---------------- Mappings ----------------

    setMapping(bookmarkId, media) {
        const db = getDb();
        db.prepare(`
            INSERT OR REPLACE INTO bookmark_anilist
                (bookmark_id, anilist_id, anilist_title, media_format, chapters_total, sync_enabled, last_pushed_progress, mapped_at)
            VALUES (?, ?, ?, ?, ?, 1, 0, datetime('now'))
        `).run(
            bookmarkId,
            media.id,
            media.title?.english || media.title?.romaji || null,
            media.format || null,
            media.chapters ?? null
        );
    },

    getMapping(bookmarkId) {
        const db = getDb();
        return db.prepare('SELECT * FROM bookmark_anilist WHERE bookmark_id = ?').get(bookmarkId) || null;
    },

    deleteMapping(bookmarkId) {
        const db = getDb();
        db.prepare('DELETE FROM bookmark_anilist WHERE bookmark_id = ?').run(bookmarkId);
    },

    listMappings(userId = null) {
        const db = getDb();
        const scoped = userId !== null && userId !== undefined;
        return db.prepare(`
            SELECT ba.*, b.title AS bookmark_title
            FROM bookmark_anilist ba
            JOIN bookmarks b ON b.id = ba.bookmark_id
            ${scoped ? 'WHERE b.user_id = ?' : ''}
            ORDER BY b.title
        `).all(...(scoped ? [userId] : []));
    },

    setSyncEnabled(bookmarkId, enabled) {
        const db = getDb();
        db.prepare('UPDATE bookmark_anilist SET sync_enabled = ? WHERE bookmark_id = ?')
            .run(enabled ? 1 : 0, bookmarkId);
    },

    // ---------------- Push state (per user) ----------------

    getLastPushed(userId, bookmarkId) {
        const db = getDb();
        return db.prepare('SELECT progress FROM anilist_push_state WHERE user_id = ? AND bookmark_id = ?')
            .get(userId, bookmarkId)?.progress || 0;
    },

    setLastPushed(userId, bookmarkId, progress) {
        const db = getDb();
        db.prepare(`
            INSERT OR REPLACE INTO anilist_push_state (user_id, bookmark_id, progress)
            VALUES (?, ?, ?)
        `).run(userId, bookmarkId, progress);
    },

    // ---------------- Read-state helpers ----------------

    highestReadChapter(bookmarkId, userId) {
        const db = getDb();
        return db.prepare('SELECT MAX(chapter_number) AS n FROM read_chapters WHERE bookmark_id = ? AND user_id = ?')
            .get(bookmarkId, userId).n || 0;
    },

    /** Highest chapter number the app actually knows about for this bookmark. */
    maxKnownChapter(bookmarkId) {
        const db = getDb();
        return db.prepare('SELECT MAX(number) AS n FROM chapters WHERE bookmark_id = ?')
            .get(bookmarkId).n || 0;
    }
};
