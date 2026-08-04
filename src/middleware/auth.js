import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { logger } from '../logger.js';
import { usersDb } from '../db/users.js';

export const auth = (req, res, next) => {
    // Allow public access to certain routes if needed (e.g., covers)
    // But generally API should be protected
    if (req.method === 'OPTIONS') return next();
    
    // Allow image proxying without auth since it's used in img tags
    if (req.path === '/scrapers/proxy-cover') return next();

    // AniList OAuth callback arrives as an external browser redirect with no
    // Authorization header; the route itself verifies the `state` JWT.
    if (req.path === '/anilist/callback') return next();

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }

        const decoded = jwt.verify(token, CONFIG.auth.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn(`[Auth] Invalid token: ${error.message}`);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/** 403 unless the caller is an admin. Use on user-management and admin routes. */
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// GET paths a demo token may hit (prefix match, req.path relative to /api).
// /series is allowed but the series router strips it down to demo-flagged
// entries (see routes/series.js). Deliberately excludes /scrapers,
// /favorites, /queue, /downloads and /admin.
const DEMO_GET_WHITELIST = ['/bookmarks', '/chapter-settings', '/reader-settings', '/settings', '/auth/me', '/series'];

// Non-GET paths that count as "downloading" rather than "editing" for the
// per-user permission flags.
const DOWNLOAD_PATH_RE = /download|check|scan|cbz|auto-check|queue/;

/**
 * Central permission gate, mounted right after `auth` on /api.
 *  - admin: everything
 *  - demo:  read-only, whitelisted GET paths only; mutations 403 with demo:true
 *  - user:  GET always; mutations need canDownload / canEdit by path
 *
 * Role/flags are re-read from the DB on every request (a single cheap SQLite
 * lookup) so admin-panel changes apply immediately instead of after the 7d
 * token expires.
 */
export const guardPermissions = (req, res, next) => {
    // Path exempted by the auth middleware (e.g. /scrapers/proxy-cover) —
    // no user context, nothing to guard.
    if (!req.user) return next();

    if (req.user.role === 'demo') {
        if (req.method === 'GET' && DEMO_GET_WHITELIST.some(p => req.path.startsWith(p))) {
            return next();
        }
        return res.status(403).json({ error: 'Not available in the demo', demo: true });
    }

    const row = usersDb.getById(req.user?.id);
    if (!row) {
        return res.status(401).json({ error: 'User no longer exists' });
    }
    // Refresh the token claims with the live DB values, so downstream
    // middleware (requireAdmin) and handlers see current role/flags too.
    req.user.role = row.role || 'user';
    req.user.canDownload = !!row.can_download;
    req.user.canEdit = !!row.can_edit;

    if (req.user.role === 'admin') return next();

    // role === 'user'
    if (req.method === 'GET') return next();
    if (DOWNLOAD_PATH_RE.test(req.path)) {
        if (req.user.canDownload) return next();
        return res.status(403).json({ error: 'Your account is not allowed to download' });
    }
    if (req.user.canEdit) return next();
    return res.status(403).json({ error: 'Your account is not allowed to edit' });
};
