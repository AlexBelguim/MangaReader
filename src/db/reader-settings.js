import { getDb } from './connection.js';

export const readerSettingsDb = {
    get(key) {
        const db = getDb();
        const row = db.prepare('SELECT value FROM reader_settings WHERE key = ?').get(key);
        return row ? JSON.parse(row.value) : null;
    },

    set(key, value) {
        const db = getDb();
        db.prepare('INSERT OR REPLACE INTO reader_settings (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
        return { success: true };
    },

    getAll() {
        const db = getDb();
        const rows = db.prepare('SELECT key, value FROM reader_settings').all();
        const result = {};
        for (const row of rows) {
            result[row.key] = JSON.parse(row.value);
        }
        return result;
    }
};
