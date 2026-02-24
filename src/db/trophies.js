import { getDb } from './connection.js';

export const trophyDb = {
    getAll() {
        const db = getDb();
        const rows = db.prepare('SELECT bookmark_id, chapter_number, page_index, is_single, pages FROM trophy_pages').all();

        const result = {};
        for (const row of rows) {
            if (!result[row.bookmark_id]) result[row.bookmark_id] = {};
            if (!result[row.bookmark_id][row.chapter_number]) result[row.bookmark_id][row.chapter_number] = {};
            result[row.bookmark_id][row.chapter_number][row.page_index] = {
                isSingle: !!row.is_single,
                pages: JSON.parse(row.pages || '[]')
            };
        }
        return result;
    },

    getForChapter(bookmarkId, chapterNumber) {
        const db = getDb();
        const rows = db.prepare('SELECT page_index, is_single, pages FROM trophy_pages WHERE bookmark_id = ? AND chapter_number = ?')
            .all(bookmarkId, chapterNumber);

        const result = {};
        for (const row of rows) {
            result[row.page_index] = {
                isSingle: !!row.is_single,
                pages: JSON.parse(row.pages || '[]')
            };
        }
        return result;
    },

    save(bookmarkId, chapterNumber, trophyMap) {
        const db = getDb();

        db.prepare('DELETE FROM trophy_pages WHERE bookmark_id = ? AND chapter_number = ?').run(bookmarkId, chapterNumber);

        const insert = db.prepare('INSERT INTO trophy_pages (bookmark_id, chapter_number, page_index, is_single, pages) VALUES (?, ?, ?, ?, ?)');

        db.transaction(() => {
            for (const [pageIdx, info] of Object.entries(trophyMap)) {
                insert.run(bookmarkId, chapterNumber, parseInt(pageIdx), info.isSingle ? 1 : 0, JSON.stringify(info.pages || []));
            }
        })();

        return { success: true };
    },

    saveAll(trophyData) {
        const db = getDb();

        db.prepare('DELETE FROM trophy_pages').run();

        const insert = db.prepare('INSERT INTO trophy_pages (bookmark_id, chapter_number, page_index, is_single, pages) VALUES (?, ?, ?, ?, ?)');

        db.transaction(() => {
            for (const [mangaId, chapters] of Object.entries(trophyData)) {
                for (const [chNum, pages] of Object.entries(chapters)) {
                    for (const [pageIdx, info] of Object.entries(pages)) {
                        insert.run(mangaId, parseFloat(chNum), parseInt(pageIdx), info.isSingle ? 1 : 0, JSON.stringify(info.pages || []));
                    }
                }
            }
        })();

        return { success: true };
    }
};
