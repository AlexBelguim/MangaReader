import { getDb } from './connection.js';

export const chapterSettingsDb = {
    getAll() {
        const db = getDb();
        const rows = db.prepare('SELECT bookmark_id, chapter_number, first_page_single, last_page_single, locked FROM chapter_settings').all();

        const result = {};
        for (const row of rows) {
            if (!result[row.bookmark_id]) result[row.bookmark_id] = {};
            result[row.bookmark_id][row.chapter_number] = {
                firstPageSingle: !!row.first_page_single,
                lastPageSingle: !!row.last_page_single,
                locked: !!row.locked
            };
        }
        return result;
    },

    get(bookmarkId, chapterNumber) {
        const db = getDb();
        const row = db.prepare('SELECT * FROM chapter_settings WHERE bookmark_id = ? AND chapter_number = ?').get(bookmarkId, chapterNumber);
        if (!row) return null;
        return {
            firstPageSingle: !!row.first_page_single,
            lastPageSingle: !!row.last_page_single,
            locked: !!row.locked,
            mode: row.reading_mode,
            direction: row.direction
        };
    },

    save(bookmarkId, chapterNumber, settings) {
        const db = getDb();

        db.prepare(`
      INSERT OR REPLACE INTO chapter_settings (bookmark_id, chapter_number, first_page_single, last_page_single, locked, reading_mode, direction)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            bookmarkId,
            chapterNumber,
            settings.firstPageSingle ? 1 : 0,
            settings.lastPageSingle ? 1 : 0,
            settings.locked ? 1 : 0,
            settings.mode || null,
            settings.direction || null
        );

        return { success: true };
    },

    saveAll(settingsData) {
        const db = getDb();

        db.prepare('DELETE FROM chapter_settings').run();

        const insert = db.prepare('INSERT INTO chapter_settings (bookmark_id, chapter_number, first_page_single, last_page_single, locked, reading_mode, direction) VALUES (?, ?, ?, ?, ?, ?, ?)');

        db.transaction(() => {
            for (const [mangaId, chapters] of Object.entries(settingsData)) {
                for (const [chNum, settings] of Object.entries(chapters)) {
                    insert.run(
                        mangaId,
                        parseFloat(chNum),
                        settings.firstPageSingle ? 1 : 0,
                        settings.lastPageSingle ? 1 : 0,
                        settings.locked ? 1 : 0,
                        settings.mode || null,
                        settings.direction || null
                    );
                }
            }
        })();

        return { success: true };
    }
};
