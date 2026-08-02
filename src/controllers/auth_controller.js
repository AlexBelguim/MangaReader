import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { logger } from '../logger.js';
import { usersDb } from '../db/users.js';

const signToken = (user, expiresIn = '7d') => jwt.sign(
    {
        id: user.id,
        username: user.username,
        role: user.role,
        canDownload: user.canDownload,
        canEdit: user.canEdit
    },
    CONFIG.auth.jwtSecret,
    { expiresIn }
);

export const login = (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = usersDb.verify(username, password);
    if (!user) {
        logger.warn(`[Auth] Failed login attempt for user: ${username}`);
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    logger.info(`[Auth] Successful login for user: ${username}`);
    res.json({ token: signToken(user), user });
};

/**
 * Current user info. Re-read from the DB so permission changes made in the
 * admin panel are reflected without waiting for the 7d token to expire.
 */
export const me = (req, res) => {
    if (req.user.role === 'demo') {
        return res.json({ user: { username: 'demo', role: 'demo', canDownload: false, canEdit: false } });
    }
    const row = usersDb.getById(req.user.id);
    if (!row) {
        return res.status(404).json({ error: 'User no longer exists' });
    }
    res.json({
        user: {
            id: row.id,
            username: row.username,
            role: row.role || 'user',
            canDownload: !!row.can_download,
            canEdit: !!row.can_edit
        }
    });
};

/**
 * Public demo login. No credentials — hands out a short-lived read-only
 * token. Everything a demo token can do is restricted in guardPermissions
 * (src/middleware/auth.js), not here.
 */
export const demoLogin = (req, res) => {
    logger.info('[Auth] Demo session started');
    res.json({ token: signToken({ id: 0, username: 'demo', role: 'demo', canDownload: false, canEdit: false }, '12h') });
};
