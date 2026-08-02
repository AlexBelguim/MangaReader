import bcrypt from 'bcryptjs';
import { getDb } from './connection.js';
import { CONFIG } from '../config.js';

const BCRYPT_ROUNDS = 10;

const toClientUser = (row) => row && ({
    id: row.id,
    username: row.username,
    role: row.role || 'user',
    canDownload: !!row.can_download,
    canEdit: !!row.can_edit,
    createdAt: row.created_at
});

export const usersDb = {
    count() {
        const db = getDb();
        return db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
    },

    listUsers() {
        const db = getDb();
        return db.prepare('SELECT id, username, role, can_download, can_edit, created_at FROM users ORDER BY username').all()
            .map(toClientUser);
    },

    getByUsername(username) {
        const db = getDb();
        return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    },

    getById(id) {
        const db = getDb();
        return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    },

    createUser({ username, password, role = 'user', canDownload = true, canEdit = true }) {
        const db = getDb();
        const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
        try {
            const result = db.prepare(
                "INSERT INTO users (username, password_hash, role, can_download, can_edit, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
            ).run(username.trim(), hash, role, canDownload ? 1 : 0, canEdit ? 1 : 0);
            return { success: true, user: toClientUser(this.getById(result.lastInsertRowid)) };
        } catch (e) {
            if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                return { success: false, message: 'Username already exists' };
            }
            throw e;
        }
    },

    updateUser(id, { role, canDownload, canEdit }) {
        const db = getDb();
        db.prepare('UPDATE users SET role = ?, can_download = ?, can_edit = ? WHERE id = ?')
            .run(role, canDownload ? 1 : 0, canEdit ? 1 : 0, id);
        return toClientUser(this.getById(id));
    },

    setPassword(id, password) {
        const db = getDb();
        const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
        db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hash, id);
    },

    deleteUser(id) {
        const db = getDb();
        db.prepare('DELETE FROM users WHERE id = ?').run(id);
    },

    countAdmins() {
        const db = getDb();
        return db.prepare("SELECT COUNT(*) AS n FROM users WHERE role = 'admin'").get().n;
    },

    /** Verify credentials, returning the client-shaped user or null. */
    verify(username, password) {
        const row = this.getByUsername(username);
        if (!row || !row.password_hash) return null;
        if (!bcrypt.compareSync(password, row.password_hash)) return null;
        return toClientUser(row);
    },

    /**
     * Bootstrap: on first run (empty users table) create the admin from the
     * ADMIN_USERNAME / ADMIN_PASSWORD env vars, so existing single-user
     * deployments keep their credentials after the upgrade.
     */
    seedAdminFromEnv() {
        if (this.count() > 0) return;
        if (!CONFIG.auth.password) {
            console.warn('[Users] Users table is empty but ADMIN_PASSWORD is not set — no admin seeded');
            return;
        }
        const result = this.createUser({
            username: CONFIG.auth.username,
            password: CONFIG.auth.password,
            role: 'admin'
        });
        if (result.success) {
            console.log(`[Users] Seeded admin user '${CONFIG.auth.username}' from environment`);
        }
    }
};
