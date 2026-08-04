import { getDb } from './connection.js';

// Reader settings are per-user: every method takes userId first.
export const readerSettingsDb = {
    get(userId, key) {
        const db = getDb();
        const row = db.prepare('SELECT value FROM reader_settings WHERE user_id = ? AND key = ?').get(userId, key);
        return row ? JSON.parse(row.value) : null;
    },

    set(userId, key, value) {
        const db = getDb();
        db.prepare('INSERT OR REPLACE INTO reader_settings (user_id, key, value) VALUES (?, ?, ?)').run(userId, key, JSON.stringify(value));
        return { success: true };
    },

    getAll(userId) {
        const db = getDb();
        const rows = db.prepare('SELECT key, value FROM reader_settings WHERE user_id = ?').all(userId);
        const result = {};
        for (const row of rows) {
            result[row.key] = JSON.parse(row.value);
        }
        return result;
    }
};
