import { getDb } from './connection.js';

// Trophy pages are per-user: every method takes userId first, except
// deleteForChapter which purges all users' entries for deleted chapter content.
export const trophyDb = {
    getAll(userId) {
        const db = getDb();
        const rows = db.prepare('SELECT bookmark_id, chapter_number, page_index, is_single, pages FROM trophy_pages WHERE user_id = ?').all(userId);

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

    getForChapter(userId, bookmarkId, chapterNumber) {
        const db = getDb();
        const rows = db.prepare('SELECT page_index, is_single, pages FROM trophy_pages WHERE user_id = ? AND bookmark_id = ? AND chapter_number = ?')
            .all(userId, bookmarkId, chapterNumber);

        const result = {};
        for (const row of rows) {
            result[row.page_index] = {
                isSingle: !!row.is_single,
                pages: JSON.parse(row.pages || '[]')
            };
        }
        return result;
    },

    getForManga(userId, bookmarkId) {
        const db = getDb();
        const rows = db.prepare('SELECT chapter_number, page_index, is_single, pages FROM trophy_pages WHERE user_id = ? AND bookmark_id = ?')
            .all(userId, bookmarkId);

        const result = {};
        for (const row of rows) {
            if (!result[row.chapter_number]) result[row.chapter_number] = {};
            result[row.chapter_number][row.page_index] = {
                isSingle: !!row.is_single,
                pages: JSON.parse(row.pages || '[]')
            };
        }
        return result;
    },

    save(userId, bookmarkId, chapterNumber, trophyMap) {
        const db = getDb();

        db.prepare('DELETE FROM trophy_pages WHERE user_id = ? AND bookmark_id = ? AND chapter_number = ?').run(userId, bookmarkId, chapterNumber);

        const insert = db.prepare('INSERT INTO trophy_pages (bookmark_id, chapter_number, page_index, user_id, is_single, pages) VALUES (?, ?, ?, ?, ?, ?)');

        db.transaction(() => {
            for (const [pageIdx, info] of Object.entries(trophyMap)) {
                insert.run(bookmarkId, chapterNumber, parseInt(pageIdx), userId, info.isSingle ? 1 : 0, JSON.stringify(info.pages || []));
            }
        })();

        return { success: true };
    },

    // Chapter content was deleted: purge every user's entries for it (user-less on purpose)
    deleteForChapter(bookmarkId, chapterNumber) {
        const db = getDb();
        db.prepare('DELETE FROM trophy_pages WHERE bookmark_id = ? AND chapter_number = ?').run(bookmarkId, chapterNumber);
        return { success: true };
    },

    saveAll(userId, trophyData) {
        const db = getDb();

        db.prepare('DELETE FROM trophy_pages WHERE user_id = ?').run(userId);

        const insert = db.prepare('INSERT INTO trophy_pages (bookmark_id, chapter_number, page_index, user_id, is_single, pages) VALUES (?, ?, ?, ?, ?, ?)');

        db.transaction(() => {
            for (const [mangaId, chapters] of Object.entries(trophyData)) {
                for (const [chNum, pages] of Object.entries(chapters)) {
                    for (const [pageIdx, info] of Object.entries(pages)) {
                        insert.run(mangaId, parseFloat(chNum), parseInt(pageIdx), userId, info.isSingle ? 1 : 0, JSON.stringify(info.pages || []));
                    }
                }
            }
        })();

        return { success: true };
    }
};
