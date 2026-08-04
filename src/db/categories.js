import { getDb } from './connection.js';

export const categoryDb = {
    // Auto-migrate: ensure is_nsfw column exists
    _ensureNsfwColumn() {
        const db = getDb();
        try {
            db.prepare('SELECT is_nsfw FROM categories LIMIT 1').get();
        } catch (e) {
            if (e.message.includes('no such column')) {
                db.prepare('ALTER TABLE categories ADD COLUMN is_nsfw INTEGER DEFAULT 0').run();
                console.log('[DB Migration] Added is_nsfw column to categories table');
            }
        }
    },

    getAll(userId = null) {
        const db = getDb();
        this._ensureNsfwColumn();
        // Scoped: categories linked to the caller's bookmarks, plus unused
        // ones (they carry no association and are safe to show/manage).
        if (userId !== null && userId !== undefined) {
            return db.prepare(`
                SELECT name, COALESCE(is_nsfw, 0) as is_nsfw FROM categories c
                WHERE EXISTS (
                    SELECT 1 FROM bookmark_categories bc
                    JOIN bookmarks b ON b.id = bc.bookmark_id
                    WHERE bc.category_id = c.id AND b.user_id = ?
                ) OR NOT EXISTS (
                    SELECT 1 FROM bookmark_categories bc2 WHERE bc2.category_id = c.id
                )
                ORDER BY name
            `).all(userId)
                .map(r => ({ name: r.name, isNsfw: !!r.is_nsfw }));
        }
        return db.prepare('SELECT name, COALESCE(is_nsfw, 0) as is_nsfw FROM categories ORDER BY name').all()
            .map(r => ({ name: r.name, isNsfw: !!r.is_nsfw }));
    },

    // Legacy: return just names (for backward compat with bookmark category assignment)
    getAllNames() {
        const db = getDb();
        return db.prepare('SELECT name FROM categories ORDER BY name').all().map(r => r.name);
    },

    add(name) {
        const db = getDb();
        this._ensureNsfwColumn();
        try {
            db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim());
            return { success: true, category: name.trim() };
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return { success: false, message: 'Category already exists' };
            }
            throw e;
        }
    },

    delete(name) {
        const db = getDb();
        db.prepare('DELETE FROM categories WHERE name = ?').run(name);
        return { success: true };
    },

    toggleNsfw(name, isNsfw) {
        const db = getDb();
        this._ensureNsfwColumn();
        db.prepare('UPDATE categories SET is_nsfw = ? WHERE name = ?').run(isNsfw ? 1 : 0, name);
        return { success: true };
    },

    rename(oldName, newName) {
        const db = getDb();
        try {
            db.prepare('UPDATE categories SET name = ? WHERE name = ?').run(newName.trim(), oldName);
            // Also update bookmark_categories
            db.prepare(`
                UPDATE bookmark_categories SET category_id = (SELECT id FROM categories WHERE name = ?)
                WHERE category_id = (SELECT id FROM categories WHERE name = ?)
            `).run(newName.trim(), oldName);
            return { success: true };
        } catch (e) {
            return { success: false, message: e.message };
        }
    }
};
