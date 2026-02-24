import { getDb, generateId } from './connection.js';

export const seriesDb = {
    // Create a new series
    create(title, alias = null) {
        const db = getDb();
        const id = generateId();
        const now = new Date().toISOString();

        db.prepare(`
      INSERT INTO series (id, title, alias, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, title, alias, now, now);

        return { id, title, alias, created_at: now, updated_at: now };
    },

    // Get all series with entry counts and cover info
    getAll() {
        const db = getDb();
        const series = db.prepare(`
      SELECT s.*,
        (SELECT COUNT(*) FROM series_entries WHERE series_id = s.id) as entry_count,
        (SELECT COUNT(*) FROM series_entries se 
         JOIN chapters c ON c.bookmark_id = se.bookmark_id
         WHERE se.series_id = s.id) as total_chapters
      FROM series s
      ORDER BY s.title
    `).all();

        // Get cover for each series
        for (const s of series) {
            if (s.cover_entry_id) {
                const coverEntry = db.prepare(`
          SELECT b.id as bookmark_id, b.cover, b.local_cover, b.title, b.alias 
          FROM series_entries se
          JOIN bookmarks b ON se.bookmark_id = b.id
          WHERE se.id = ?
        `).get(s.cover_entry_id);
                if (coverEntry) {
                    s.cover = coverEntry.cover;
                    s.localCover = coverEntry.local_cover;
                    s.coverBookmarkId = coverEntry.bookmark_id;
                    s.coverTitle = coverEntry.alias || coverEntry.title;
                }
            } else {
                // Use first entry's cover
                const firstEntry = db.prepare(`
          SELECT b.id as bookmark_id, b.cover, b.local_cover, b.title, b.alias 
          FROM series_entries se
          JOIN bookmarks b ON se.bookmark_id = b.id
          WHERE se.series_id = ?
          ORDER BY se.entry_order, se.created_at
          LIMIT 1
        `).get(s.id);
                if (firstEntry) {
                    s.cover = firstEntry.cover;
                    s.localCover = firstEntry.local_cover;
                    s.coverBookmarkId = firstEntry.bookmark_id;
                    s.coverTitle = firstEntry.alias || firstEntry.title;
                }
            }
        }

        return series;
    },

    // Get a series by ID with all entries
    getById(id) {
        const db = getDb();
        const series = db.prepare('SELECT * FROM series WHERE id = ?').get(id);
        if (!series) return null;

        // Get all entries with bookmark data
        series.entries = db.prepare(`
      SELECT se.*, b.id as bookmark_id, b.title, b.alias, b.cover, b.local_cover, 
             b.total_chapters, b.website,
             (SELECT COUNT(*) FROM chapters WHERE bookmark_id = b.id) as chapter_count,
             (SELECT COUNT(*) FROM downloaded_chapters WHERE bookmark_id = b.id) as downloaded_count
      FROM series_entries se
      JOIN bookmarks b ON se.bookmark_id = b.id
      WHERE se.series_id = ?
      ORDER BY se.entry_order, se.created_at
    `).all(id);

        // Get downloaded chapters for each entry
        for (const entry of series.entries) {
            const downloaded = db.prepare(
                'SELECT chapter_number FROM downloaded_chapters WHERE bookmark_id = ?'
            ).all(entry.bookmark_id);
            entry.downloadedChapters = downloaded.map(d => d.chapter_number);
            // Map local_cover to localCover for frontend compatibility
            entry.localCover = entry.local_cover;
        }

        // Calculate totals
        series.entry_count = series.entries.length;
        series.total_chapters = series.entries.reduce((sum, e) => sum + (e.chapter_count || 0), 0);
        series.downloaded_chapters = series.entries.reduce((sum, e) => sum + (e.downloadedChapters?.length || 0), 0);

        // Get cover
        if (series.cover_entry_id) {
            const coverEntry = series.entries.find(e => e.id === series.cover_entry_id);
            if (coverEntry) {
                series.cover = coverEntry.localCover || coverEntry.cover;
            }
        } else if (series.entries.length > 0) {
            series.cover = series.entries[0].localCover || series.entries[0].cover;
        }

        return series;
    },

    // Update series
    update(id, data) {
        const db = getDb();
        const updates = [];
        const values = [];

        if (data.title !== undefined) {
            updates.push('title = ?');
            values.push(data.title);
        }
        if (data.alias !== undefined) {
            updates.push('alias = ?');
            values.push(data.alias);
        }
        if (data.cover_entry_id !== undefined) {
            updates.push('cover_entry_id = ?');
            values.push(data.cover_entry_id);
        }

        if (updates.length > 0) {
            updates.push('updated_at = ?');
            values.push(new Date().toISOString());
            values.push(id);

            db.prepare(`UPDATE series SET ${updates.join(', ')} WHERE id = ?`).run(...values);
        }

        return this.getById(id);
    },

    // Delete series (entries will be deleted by cascade)
    delete(id) {
        const db = getDb();
        db.prepare('DELETE FROM series WHERE id = ?').run(id);
        return { success: true };
    },

    // Add a bookmark to a series
    addEntry(seriesId, bookmarkId, order = null) {
        const db = getDb();
        const id = generateId();
        const now = new Date().toISOString();

        // If no order specified, put at the end
        if (order === null) {
            const maxOrder = db.prepare(`
        SELECT MAX(entry_order) as max_order FROM series_entries WHERE series_id = ?
      `).get(seriesId);
            order = (maxOrder?.max_order || 0) + 1;
        }

        db.prepare(`
      INSERT INTO series_entries (id, series_id, bookmark_id, entry_order, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, seriesId, bookmarkId, order, now);

        // Update series timestamp
        db.prepare('UPDATE series SET updated_at = ? WHERE id = ?').run(now, seriesId);

        return { id, series_id: seriesId, bookmark_id: bookmarkId, entry_order: order };
    },

    // Remove an entry from a series
    removeEntry(entryId) {
        const db = getDb();
        const entry = db.prepare('SELECT series_id FROM series_entries WHERE id = ?').get(entryId);
        if (entry) {
            db.prepare('DELETE FROM series_entries WHERE id = ?').run(entryId);
            db.prepare('UPDATE series SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), entry.series_id);
        }
        return { success: true };
    },

    // Reorder entries in a series
    reorderEntries(seriesId, entryIds) {
        const db = getDb();
        const now = new Date().toISOString();

        const updateStmt = db.prepare('UPDATE series_entries SET entry_order = ? WHERE id = ?');
        db.transaction(() => {
            entryIds.forEach((entryId, index) => {
                updateStmt.run(index, entryId);
            });
            db.prepare('UPDATE series SET updated_at = ? WHERE id = ?').run(now, seriesId);
        })();

        return { success: true };
    },

    // Get series for a bookmark
    getSeriesForBookmark(bookmarkId) {
        const db = getDb();
        return db.prepare(`
      SELECT s.*, se.id as entry_id, se.entry_order
      FROM series s
      JOIN series_entries se ON s.id = se.series_id
      WHERE se.bookmark_id = ?
    `).all(bookmarkId);
    },

    // Get bookmarks not in any series (for adding to series)
    getBookmarksNotInSeries() {
        const db = getDb();
        const bookmarks = db.prepare(`
      SELECT b.id, b.title, b.alias, b.cover, b.local_cover
      FROM bookmarks b
      WHERE b.id NOT IN (SELECT bookmark_id FROM series_entries)
      ORDER BY b.title
    `).all();
        // Map local_cover to localCover for frontend
        return bookmarks.map(b => ({ ...b, localCover: b.local_cover }));
    },

    // Set cover entry for series
    setCoverEntry(seriesId, entryId) {
        const db = getDb();
        db.prepare('UPDATE series SET cover_entry_id = ?, updated_at = ? WHERE id = ?')
            .run(entryId, new Date().toISOString(), seriesId);
        return { success: true };
    }
};
