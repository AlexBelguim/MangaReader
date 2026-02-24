import { getDb } from './connection.js';

export const artistDb = {
    getAll() {
        const db = getDb();
        return db.prepare(`
      SELECT a.*, COUNT(ba.bookmark_id) as bookmarkCount 
      FROM artists a 
      LEFT JOIN bookmark_artists ba ON a.id = ba.artist_id 
      GROUP BY a.id 
      ORDER BY a.name
    `).all();
    },

    getById(id) {
        const db = getDb();
        return db.prepare('SELECT * FROM artists WHERE id = ?').get(id);
    },

    getByName(name) {
        const db = getDb();
        return db.prepare('SELECT * FROM artists WHERE name = ?').get(name);
    },

    create(name) {
        const db = getDb();
        const normalized = name.trim();

        // Check if exists
        const existing = this.getByName(normalized);
        if (existing) return existing;

        const result = db.prepare('INSERT INTO artists (name) VALUES (?)').run(normalized);
        return { id: result.lastInsertRowid, name: normalized };
    },

    delete(id) {
        const db = getDb();
        db.prepare('DELETE FROM artists WHERE id = ?').run(id);
        return { success: true };
    },

    rename(id, newName) {
        const db = getDb();
        db.prepare('UPDATE artists SET name = ? WHERE id = ?').run(newName.trim(), id);
        return { success: true };
    },

    // Get artists for a bookmark
    getForBookmark(bookmarkId) {
        const db = getDb();
        return db.prepare(`
      SELECT a.* FROM artists a
      JOIN bookmark_artists ba ON a.id = ba.artist_id
      WHERE ba.bookmark_id = ?
      ORDER BY a.name
    `).all(bookmarkId);
    },

    // Set artists for a bookmark
    setForBookmark(bookmarkId, artistNames) {
        const db = getDb();

        db.transaction(() => {
            // Clear existing
            db.prepare('DELETE FROM bookmark_artists WHERE bookmark_id = ?').run(bookmarkId);

            // Add new ones
            const insertArtist = db.prepare('INSERT OR IGNORE INTO artists (name) VALUES (?)');
            const getArtist = db.prepare('SELECT id FROM artists WHERE name = ?');
            const linkArtist = db.prepare('INSERT INTO bookmark_artists (bookmark_id, artist_id) VALUES (?, ?)');

            for (const name of artistNames) {
                const normalized = name.trim();
                if (!normalized) continue;

                insertArtist.run(normalized);
                const artist = getArtist.get(normalized);
                if (artist) {
                    linkArtist.run(bookmarkId, artist.id);
                }
            }
        })();

        return { success: true };
    },

    // Add a single artist to a bookmark
    addToBookmark(bookmarkId, artistName) {
        const db = getDb();
        const normalized = artistName.trim();

        db.prepare('INSERT OR IGNORE INTO artists (name) VALUES (?)').run(normalized);
        const artist = db.prepare('SELECT id FROM artists WHERE name = ?').get(normalized);

        if (artist) {
            db.prepare('INSERT OR IGNORE INTO bookmark_artists (bookmark_id, artist_id) VALUES (?, ?)').run(bookmarkId, artist.id);
        }

        return { success: true };
    },

    // Remove an artist from a bookmark
    removeFromBookmark(bookmarkId, artistId) {
        const db = getDb();
        db.prepare('DELETE FROM bookmark_artists WHERE bookmark_id = ? AND artist_id = ?').run(bookmarkId, artistId);
        return { success: true };
    },

    // Get all bookmarks by artist
    getBookmarksByArtist(artistId) {
        const db = getDb();
        return db.prepare(`
      SELECT b.* FROM bookmarks b
      JOIN bookmark_artists ba ON b.id = ba.bookmark_id
      WHERE ba.artist_id = ?
      ORDER BY b.title
    `).all(artistId);
    }
};
