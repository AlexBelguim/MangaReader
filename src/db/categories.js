import { getDb } from './connection.js';

export const categoryDb = {
    getAll() {
        const db = getDb();
        return db.prepare('SELECT name FROM categories ORDER BY name').all().map(r => r.name);
    },

    add(name) {
        const db = getDb();
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
    }
};
