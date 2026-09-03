import { getDb } from './connection.js';

// A chapter_settings row exists for two unrelated reasons: the reader saved
// display settings for the chapter, or the chapter was locked (the lock and
// unlock routes upsert a row too). Only the former counts as "this chapter
// has reader settings". Treating a lock-only row as settings made a locked,
// never-opened chapter report firstPageSingle/lastPageSingle = false instead
// of inheriting from the previous chapter.
function hasReaderSettings(row) {
    return row.reading_mode != null || row.direction != null;
}

function rowToSettings(row) {
    const settings = { locked: !!row.locked };
    if (hasReaderSettings(row)) {
        settings.firstPageSingle = !!row.first_page_single;
        settings.lastPageSingle = !!row.last_page_single;
        if (row.reading_mode != null) settings.mode = row.reading_mode;
        if (row.direction != null) settings.direction = row.direction;
    }
    return settings;
}

const COLUMNS = 'bookmark_id, chapter_number, first_page_single, last_page_single, locked, reading_mode, direction';

function toRowValues(bookmarkId, chapterNumber, settings) {
    return [
        bookmarkId,
        chapterNumber,
        settings.firstPageSingle ? 1 : 0,
        settings.lastPageSingle ? 1 : 0,
        settings.locked ? 1 : 0,
        settings.mode || null,
        settings.direction || null
    ];
}

export const chapterSettingsDb = {
    getAll() {
        const db = getDb();
        const rows = db.prepare(`SELECT ${COLUMNS} FROM chapter_settings`).all();

        const result = {};
        for (const row of rows) {
            if (!result[row.bookmark_id]) result[row.bookmark_id] = {};
            result[row.bookmark_id][row.chapter_number] = rowToSettings(row);
        }
        return result;
    },

    get(bookmarkId, chapterNumber) {
        const db = getDb();
        const row = db.prepare('SELECT * FROM chapter_settings WHERE bookmark_id = ? AND chapter_number = ?').get(bookmarkId, chapterNumber);
        if (!row) return null;
        return rowToSettings(row);
    },

    save(bookmarkId, chapterNumber, settings) {
        const db = getDb();

        db.prepare(`
      INSERT OR REPLACE INTO chapter_settings (${COLUMNS})
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(...toRowValues(bookmarkId, chapterNumber, settings));

        return { success: true };
    },

    saveAll(settingsData) {
        const db = getDb();

        db.prepare('DELETE FROM chapter_settings').run();

        const insert = db.prepare(`INSERT INTO chapter_settings (${COLUMNS}) VALUES (?, ?, ?, ?, ?, ?, ?)`);

        db.transaction(() => {
            for (const [mangaId, chapters] of Object.entries(settingsData)) {
                for (const [chNum, settings] of Object.entries(chapters)) {
                    insert.run(...toRowValues(mangaId, parseFloat(chNum), settings));
                }
            }
        })();

        return { success: true };
    }
};
