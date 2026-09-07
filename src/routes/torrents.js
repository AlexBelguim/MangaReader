/**
 * Torrent routes: Prowlarr / qBittorrent settings (admin), release search,
 * and the grab -> watch -> import lifecycle. Mounted at /api/torrents.
 *
 * Path note: guardPermissions lets a non-admin user through non-GET routes
 * whose path contains "download" only with canDownload, everything else
 * needs canEdit - so the grab/import/cancel routes live under /downloads.
 */

import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { torrentSettingsDb, torrentDb, isMaskedSecret } from '../db/torrents.js';
import { bookmarkDb } from '../db/bookmarks.js';
import * as torrents from '../services/torrentService.js';

const router = express.Router();

// A tracked torrent the caller may act on: the user who grabbed it, or an
// admin. Answers the request itself when there is none.
function trackedTorrent(req, res) {
    const row = torrentDb.get(String(req.params.hash || ''));
    if (!row) {
        res.status(404).json({ error: 'Unknown torrent' });
        return null;
    }
    if (req.user.role !== 'admin' && row.userId != null && row.userId !== req.user.id) {
        res.status(403).json({ error: 'That torrent was added by another user' });
        return null;
    }
    return row;
}

const statusOf = (error, fallback) => (Number.isInteger(error.status) ? error.status : fallback);

// ==================== SETTINGS (admin) ====================

router.get('/settings', requireAdmin, (req, res) => {
    res.json({
        settings: torrentSettingsDb.getMasked(),
        configured: { prowlarr: torrentSettingsDb.isProwlarrConfigured(), qbittorrent: torrentSettingsDb.isQbittorrentConfigured() }
    });
});

router.put('/settings', requireAdmin, (req, res) => {
    try {
        torrentSettingsDb.save(req.body || {});
        res.json({ success: true, settings: torrentSettingsDb.getMasked() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test with the values in the form (unsaved), a masked secret meaning "the stored one"
router.post('/settings/test', requireAdmin, async (req, res) => {
    const { service, settings: candidate = {} } = req.body || {};
    try {
        const stored = torrentSettingsDb.get();
        if (service === 'prowlarr') {
            const s = { ...candidate };
            if (!s.apiKey || isMaskedSecret(s.apiKey)) s.apiKey = stored.prowlarr.apiKey;
            return res.json({ success: true, result: await torrents.testProwlarr(s) });
        }
        if (service === 'qbittorrent') {
            const s = { ...candidate };
            if (!s.password || isMaskedSecret(s.password)) s.password = stored.qbittorrent.password;
            return res.json({ success: true, result: await torrents.testQbittorrent(s) });
        }
        res.status(400).json({ error: 'service must be prowlarr or qbittorrent' });
    } catch (error) {
        res.status(502).json({ error: error.message });
    }
});

// ==================== STATUS / SEARCH ====================

// Whether the feature is usable (so the UI can show or hide its buttons)
router.get('/status', (req, res) => {
    res.json({
        prowlarr: torrentSettingsDb.isProwlarrConfigured(),
        qbittorrent: torrentSettingsDb.isQbittorrentConfigured(),
        active: torrentDb.active().length
    });
});

// Results carry a server-side id per release; download links never leave the server
router.get('/search', async (req, res) => {
    try {
        const q = String(req.query.q || '').trim();
        if (!q) return res.status(400).json({ error: 'q is required' });
        const results = await torrents.search(q);
        res.json({ success: true, query: q, count: results.length, results });
    } catch (error) {
        res.status(502).json({ error: error.message });
    }
});

// ==================== DOWNLOADS ====================

router.get('/downloads', (req, res) => {
    res.json({ torrents: torrentDb.list({ limit: 100 }) });
});

// Grab a release: body { releaseId, bookmarkId?, newSeriesTitle?, autoImport? }
router.post('/downloads', async (req, res) => {
    try {
        const { releaseId, release, bookmarkId, newSeriesTitle, autoImport } = req.body || {};
        const id = releaseId || (release && typeof release === 'object' ? release.id : null);
        if (!id) return res.status(400).json({ error: 'releaseId is required (an id from a search)' });
        if (bookmarkId && !bookmarkDb.getById(bookmarkId, req.user.id)) return res.status(404).json({ error: 'Series not found' });
        const row = await torrents.grab({ releaseId: String(id), bookmarkId: bookmarkId || null, newSeriesTitle: newSeriesTitle || null, userId: req.user.id, autoImport: autoImport ?? null });
        res.json({ success: true, torrent: row });
    } catch (error) {
        console.error(`[Torrents] Grab failed: ${error.message}`);
        res.status(statusOf(error, 502)).json({ error: error.message });
    }
});

router.post('/downloads/refresh', async (req, res) => {
    try {
        await torrents.poll();
        torrents.ensurePolling();
        res.json({ torrents: torrentDb.list({ limit: 100 }) });
    } catch (error) {
        res.status(502).json({ error: error.message });
    }
});

// Import a finished torrent (again), optionally into another series
router.post('/downloads/:hash/import', async (req, res) => {
    const row = trackedTorrent(req, res);
    if (!row) return;
    try {
        const { bookmarkId } = req.body || {};
        if (bookmarkId && !bookmarkDb.getById(bookmarkId, req.user.id)) return res.status(404).json({ error: 'Series not found' });
        const { bookmark, summary } = await torrents.importTorrent(row.hash, { bookmarkId: bookmarkId || null });
        res.json({ success: true, bookmarkId: bookmark.id, summary });
    } catch (error) {
        res.status(statusOf(error, 500)).json({ error: error.message });
    }
});

router.post('/downloads/:hash/pause', async (req, res) => {
    const row = trackedTorrent(req, res);
    if (!row) return;
    try {
        await torrents.pause(row.hash);
        res.json({ success: true });
    } catch (error) {
        res.status(statusOf(error, 502)).json({ error: error.message });
    }
});

router.post('/downloads/:hash/resume', async (req, res) => {
    const row = trackedTorrent(req, res);
    if (!row) return;
    try {
        await torrents.resume(row.hash);
        res.json({ success: true });
    } catch (error) {
        res.status(statusOf(error, 502)).json({ error: error.message });
    }
});

// Stop tracking; optionally remove it from qBittorrent and delete its files
router.delete('/downloads/:hash', async (req, res) => {
    const row = trackedTorrent(req, res);
    if (!row) return;
    try {
        const fromClient = req.query.fromClient !== 'false';
        const deleteFiles = req.query.deleteFiles === 'true';
        await torrents.remove(row.hash, { deleteFiles, fromClient });
        res.json({ success: true });
    } catch (error) {
        res.status(statusOf(error, 502)).json({ error: error.message });
    }
});

export default router;
