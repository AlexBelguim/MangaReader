/**
 * AniList Routes - OAuth connect/callback, media search, bookmark mapping,
 * and pull-sync of reading progress from AniList.
 *
 * Mounted at /api/anilist. All routes sit behind the global JWT auth except
 * /callback, which is whitelisted in middleware/auth.js and identifies the
 * user via the OAuth `state` parameter (their JWT, echoed back by AniList).
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { logger } from '../logger.js';
import { anilistDb } from '../db/anilist.js';
import { anilistService } from '../services/anilistService.js';
import { bookmarkDb } from '../database.js';

const router = express.Router();

const notConfigured = (res) =>
    res.status(400).json({ error: 'AniList is not configured. Set ANILIST_CLIENT_ID and ANILIST_CLIENT_SECRET in .env' });

const requireConnection = (req, res) => {
    if (!anilistService.isConfigured()) { notConfigured(res); return null; }
    const tokenRow = anilistDb.getToken(req.user.id);
    if (!tokenRow) { res.status(400).json({ error: 'AniList account not connected' }); return null; }
    return tokenRow;
};

// Connection status for the acting user
router.get('/status', (req, res) => {
    const tokenRow = anilistDb.getToken(req.user.id);
    res.json({
        configured: anilistService.isConfigured(),
        connected: !!tokenRow,
        anilistUsername: tokenRow?.anilist_username || null
    });
});

// Build the AniList authorize URL; state carries the user's JWT so the
// callback (which arrives without an Authorization header) knows who it is.
router.get('/auth', (req, res) => {
    if (!anilistService.isConfigured()) return notConfigured(res);
    const token = req.headers.authorization.split(' ')[1];
    res.json({ url: anilistService.getAuthUrl(token) });
});

// OAuth callback — whitelisted in middleware/auth.js (no Bearer header on the
// external redirect). state = the user's JWT from /auth.
router.get('/callback', async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!code || !state) return res.status(400).send('Missing code or state');

        let decoded;
        try {
            decoded = jwt.verify(state, CONFIG.auth.jwtSecret);
        } catch {
            return res.status(401).send('Invalid or expired state — try connecting again');
        }

        const redirectUri = `${req.protocol}://${req.get('host')}/api/anilist/callback`;
        const tokenData = await anilistService.exchangeCode(code, redirectUri);
        const viewer = await anilistService.getViewer(tokenData.access_token);
        anilistDb.saveToken(decoded.id, tokenData.access_token, viewer);

        logger.info(`[AniList] User ${decoded.username || decoded.id} connected as ${viewer.name}`);
        res.redirect('/#/settings?anilist=connected');
    } catch (error) {
        logger.error(`[AniList] OAuth callback failed: ${error.message}`);
        res.status(500).send(`AniList connection failed: ${error.message}`);
    }
});

router.post('/disconnect', (req, res) => {
    anilistDb.deleteToken(req.user.id);
    res.json({ success: true });
});

// Search AniList for mapping candidates
router.get('/search', async (req, res) => {
    if (!requireConnection(req, res)) return;
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Missing search query' });
    try {
        res.json({ results: await anilistService.searchManga(q) });
    } catch (error) {
        res.status(502).json({ error: error.message });
    }
});

// Current mapping for one bookmark
router.get('/map/:bookmarkId', (req, res) => {
    const bookmark = bookmarkDb.getById(req.params.bookmarkId, req.user.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    res.json({ mapping: anilistDb.getMapping(req.params.bookmarkId) });
});

// Link a bookmark to an AniList media entry, then push current progress
router.post('/map', async (req, res) => {
    const tokenRow = requireConnection(req, res);
    if (!tokenRow) return;
    const { bookmarkId, anilistId } = req.body || {};
    if (!bookmarkId || !anilistId) return res.status(400).json({ error: 'bookmarkId and anilistId required' });
    const bookmark = bookmarkDb.getById(bookmarkId, req.user.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    try {
        const media = await anilistService.getMedia(parseInt(anilistId, 10));
        if (!media) return res.status(404).json({ error: 'AniList media not found' });
        anilistDb.setMapping(bookmarkId, media);
        const push = await anilistService.pushProgress(req.user.id, bookmarkId);
        res.json({ success: true, mapping: anilistDb.getMapping(bookmarkId), push });
    } catch (error) {
        res.status(502).json({ error: error.message });
    }
});

// Update mapping flags (sync on/off)
router.patch('/map/:bookmarkId', (req, res) => {
    const bookmark = bookmarkDb.getById(req.params.bookmarkId, req.user.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    const { syncEnabled } = req.body || {};
    if (typeof syncEnabled !== 'boolean') return res.status(400).json({ error: 'syncEnabled (boolean) required' });
    anilistDb.setSyncEnabled(req.params.bookmarkId, syncEnabled);
    res.json({ mapping: anilistDb.getMapping(req.params.bookmarkId) });
});

router.delete('/map/:bookmarkId', (req, res) => {
    const bookmark = bookmarkDb.getById(req.params.bookmarkId, req.user.id);
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
    anilistDb.deleteMapping(req.params.bookmarkId);
    res.json({ success: true });
});

/**
 * Pull progress from AniList into the app for every mapped bookmark.
 * Union policy: only ever marks chapters read, never unreads. Progress is
 * clamped to the highest chapter number the app knows about.
 */
router.post('/pull', async (req, res) => {
    const tokenRow = requireConnection(req, res);
    if (!tokenRow) return;
    try {
        const list = await anilistService.getMangaList(tokenRow.access_token, tokenRow.anilist_user_id);
        const byMediaId = new Map(list.map(e => [e.mediaId, e]));

        const updated = [];
        const skipped = [];

        for (const mapping of anilistDb.listMappings(req.user.id)) {
            if (!mapping.sync_enabled) { skipped.push({ bookmarkId: mapping.bookmark_id, reason: 'sync-disabled' }); continue; }
            const entry = byMediaId.get(mapping.anilist_id);
            if (!entry || !entry.progress) { skipped.push({ bookmarkId: mapping.bookmark_id, reason: 'no-progress' }); continue; }

            const maxKnown = anilistDb.maxKnownChapter(mapping.bookmark_id);
            const target = Math.min(Math.floor(entry.progress), maxKnown);
            if (target <= 0) { skipped.push({ bookmarkId: mapping.bookmark_id, reason: 'no-known-chapters' }); continue; }

            const before = anilistDb.highestReadChapter(mapping.bookmark_id, req.user.id);
            bookmarkDb.markChaptersReadBelow(req.user.id, mapping.bookmark_id, target);
            anilistDb.setLastPushed(req.user.id, mapping.bookmark_id, Math.max(anilistDb.getLastPushed(req.user.id, mapping.bookmark_id), target));

            if (target > before) {
                updated.push({ bookmarkId: mapping.bookmark_id, title: mapping.bookmark_title, markedUpTo: target });
            } else {
                skipped.push({ bookmarkId: mapping.bookmark_id, reason: 'already-read' });
            }
        }

        logger.info(`[AniList] Pull by user ${req.user.id}: ${updated.length} updated, ${skipped.length} skipped`);
        res.json({ success: true, updated, skipped });
    } catch (error) {
        res.status(502).json({ error: error.message });
    }
});

export default router;
