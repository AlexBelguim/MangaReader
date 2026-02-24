import { getDb } from './connection.js';

export const favoritesDb = {
    getAll() {
        const db = getDb();

        const lists = db.prepare('SELECT id, name FROM favorite_lists ORDER BY sort_order').all();
        const listOrder = lists.map(l => l.name);

        const favorites = {};
        for (const list of lists) {
            const items = db.prepare(`
        SELECT bookmark_id, manga_title, chapter_number, chapter_url, page_indices,
               display_mode, display_side, image_paths, created_at
        FROM favorites WHERE list_id = ? ORDER BY id
      `).all(list.id);

            favorites[list.name] = items.map(item => ({
                mangaId: item.bookmark_id,
                mangaTitle: item.manga_title,
                chapterNum: item.chapter_number,
                chapterUrl: item.chapter_url,
                pageIndices: JSON.parse(item.page_indices || '[]'),
                displayMode: item.display_mode,
                displaySide: item.display_side,
                imagePaths: JSON.parse(item.image_paths || '[]'),
                createdAt: item.created_at
            }));
        }

        return { favorites, listOrder };
    },

    createList(name) {
        const db = getDb();
        try {
            const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM favorite_lists').get();
            db.prepare('INSERT INTO favorite_lists (name, sort_order) VALUES (?, ?)').run(name, (maxOrder?.max || 0) + 1);
            return { success: true };
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return { success: false, error: 'List already exists' };
            }
            throw e;
        }
    },

    deleteList(name) {
        const db = getDb();
        db.prepare('DELETE FROM favorite_lists WHERE name = ?').run(name);
        return { success: true };
    },

    renameList(oldName, newName) {
        const db = getDb();
        try {
            db.prepare('UPDATE favorite_lists SET name = ? WHERE name = ?').run(newName, oldName);
            return { success: true };
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return { success: false, error: 'A list with that name already exists' };
            }
            throw e;
        }
    },

    addFavorite(listName, favorite) {
        const db = getDb();

        // Get or create list
        let list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);
        if (!list) {
            const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM favorite_lists').get();
            db.prepare('INSERT INTO favorite_lists (name, sort_order) VALUES (?, ?)').run(listName, (maxOrder?.max || 0) + 1);
            list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);
        }

        db.prepare(`
      INSERT INTO favorites (list_id, bookmark_id, manga_title, chapter_number, chapter_url, 
                            page_indices, display_mode, display_side, image_paths, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            list.id,
            favorite.mangaId,
            favorite.mangaTitle,
            favorite.chapterNum,
            favorite.chapterUrl,
            JSON.stringify(favorite.pageIndices || []),
            favorite.displayMode,
            favorite.displaySide,
            JSON.stringify(favorite.imagePaths || []),
            new Date().toISOString()
        );

        return { success: true };
    },

    removeFavorite(listName, index) {
        const db = getDb();

        const list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);
        if (!list) return { success: false, error: 'List not found' };

        // Get all favorites for this list to find the one at index
        const items = db.prepare('SELECT id FROM favorites WHERE list_id = ? ORDER BY id').all(list.id);
        if (index < 0 || index >= items.length) return { success: false, error: 'Invalid index' };

        db.prepare('DELETE FROM favorites WHERE id = ?').run(items[index].id);
        return { success: true };
    },

    saveAll(data) {
        const db = getDb();

        db.transaction(() => {
            db.prepare('DELETE FROM favorites').run();
            db.prepare('DELETE FROM favorite_lists').run();

            const insertList = db.prepare('INSERT INTO favorite_lists (name, sort_order) VALUES (?, ?)');
            const insertFav = db.prepare(`
        INSERT INTO favorites (list_id, bookmark_id, manga_title, chapter_number, chapter_url,
                              page_indices, display_mode, display_side, image_paths, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

            const listOrder = data.listOrder || Object.keys(data.favorites || {});
            let order = 0;

            for (const listName of listOrder) {
                insertList.run(listName, order++);
                const list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);

                for (const fav of (data.favorites?.[listName] || [])) {
                    insertFav.run(
                        list.id,
                        fav.mangaId,
                        fav.mangaTitle,
                        fav.chapterNum,
                        fav.chapterUrl,
                        JSON.stringify(fav.pageIndices || []),
                        fav.displayMode,
                        fav.displaySide,
                        JSON.stringify(fav.imagePaths || []),
                        fav.createdAt || new Date().toISOString()
                    );
                }
            }
        })();

        return { success: true };
    }
};
