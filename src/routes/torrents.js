/**
 * Torrent routes: Prowlarr / qBittorrent settings (admin), release search,
 * and the grab -> watch -> import lifecycle. Mounted at /api/torrents.
 *
 * Path note: guardPermissions lets a non-admin user through non-GET routes
 * whose path contains "download" only with canDownload, everything else
 * needs canEdit - so the grab/import/cancel routes live under /downloads.
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import { requireAdmin } from '../middleware/auth.js';
import { describeRelease } from '../services/volumeImporter.js';
import { parseReleaseName } from '../services/release-name.js';
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
        autoImport: torrentSettingsDb.get().autoImport !== false,
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

// Grab a release: body { releaseId, bookmarkId?, newSeriesTitle?, autoImport? }.
// Answers 202 with a pending entry; the outcome shows up in the list.
router.post('/downloads', async (req, res) => {
    try {
        const { releaseId, release, bookmarkId, newSeriesTitle, autoImport } = req.body || {};
        const id = releaseId || (release && typeof release === 'object' ? release.id : null);
        if (!id) return res.status(400).json({ error: 'releaseId is required (an id from a search)' });
        if (bookmarkId && !bookmarkDb.getById(bookmarkId, req.user.id)) return res.status(404).json({ error: 'Series not found' });
        const row = await torrents.grab({ releaseId: String(id), bookmarkId: bookmarkId || null, newSeriesTitle: newSeriesTitle || null, userId: req.user.id, autoImport: autoImport ?? null });
        res.status(202).json({ success: true, pending: true, torrent: row });
    } catch (error) {
        console.error(`[Torrents] Grab failed: ${error.message}`);
        res.status(statusOf(error, 502)).json({ error: error.message });
    }
});

// Add a pasted magnet link or .torrent URL for a series: body { magnet,
// bookmarkId?, newSeriesTitle?, autoImport? }. Needs only qBittorrent.
router.post('/downloads/magnet', async (req, res) => {
    try {
        const { magnet, bookmarkId, newSeriesTitle, autoImport } = req.body || {};
        if (!magnet || typeof magnet !== 'string') return res.status(400).json({ error: 'magnet is required' });
        if (magnet.length > 4000) return res.status(400).json({ error: 'That is too long to be a magnet link' });
        if (bookmarkId && !bookmarkDb.getById(bookmarkId, req.user.id)) return res.status(404).json({ error: 'Series not found' });
        const row = await torrents.grabMagnet({ magnet, bookmarkId: bookmarkId || null, newSeriesTitle: newSeriesTitle || null, userId: req.user.id, autoImport: autoImport ?? null });
        res.status(202).json({ success: true, pending: true, torrent: row });
    } catch (error) {
        console.error(`[Torrents] Magnet add failed: ${error.message}`);
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

// ==================== IMPORT PROGRESS ====================
// Every import (torrent or folder) runs as a queue task; these list them
// with their progress so the queue page and the review dialog can follow.

router.get('/imports', (req, res) => {
    res.json({ imports: torrents.listImports() });
});

router.get('/imports/:id', (req, res) => {
    const rec = torrents.getImport(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Unknown import' });
    res.json(rec);
});

// ==================== IMPORT FROM A FOLDER ALREADY ON DISK ====================
// A release that is already where qBittorrent puts things (a re-import after
// a deleted volume, or something dropped there by hand) can be imported
// without grabbing anything. Browsing is limited to the roots the torrent
// settings name: the local side of every path mapping and the mapped save
// path. The route prefix carries "download" so the same permission as a
// grab applies.

function importRoots() {
    const s = torrentSettingsDb.get();
    const roots = new Set();
    for (const m of s.pathMappings || []) if (m.to) roots.add(path.resolve(m.to));
    if (s.qbittorrent?.savePath) {
        const local = torrents.toLocalPath(s.qbittorrent.savePath);
        if (local) roots.add(path.resolve(local));
    }
    return [...roots];
}

// The requested path, resolved and confirmed to sit inside one of the roots
function resolveImportPath(requested) {
    const roots = importRoots();
    if (roots.length === 0) {
        const err = new Error('Nothing to browse: set a save path or a path mapping in Settings > Torrents first');
        err.status = 400;
        throw err;
    }
    const target = path.resolve(String(requested || ''));
    const inside = roots.some(r => target === r || target.startsWith(r + path.sep));
    if (!inside) {
        const err = new Error('That path is outside the folders this app may import from');
        err.status = 403;
        throw err;
    }
    return { target, roots };
}

const ARCHIVE_RE = /\.(cbz|zip)$/i;

// Folders and archives at a path (no path: the roots themselves)
router.get('/local-downloads/browse', async (req, res) => {
    try {
        const roots = importRoots();
        if (!req.query.path) {
            const list = [];
            for (const r of roots) list.push({ name: r, path: r, kind: 'dir', exists: await fs.pathExists(r) });
            return res.json({ roots, path: null, parent: null, entries: list });
        }
        const { target } = resolveImportPath(req.query.path);
        if (!await fs.pathExists(target)) return res.status(404).json({ error: 'Folder not found' });
        const dirents = await fs.readdir(target, { withFileTypes: true });
        const entries = [];
        for (const d of dirents) {
            if (d.name.startsWith('.')) continue;
            const full = path.join(target, d.name);
            if (d.isDirectory()) entries.push({ name: d.name, path: full, kind: 'dir' });
            else if (d.isFile() && ARCHIVE_RE.test(d.name)) {
                let size = null;
                try { size = (await fs.stat(full)).size; } catch (e) { /* unreadable */ }
                entries.push({ name: d.name, path: full, kind: 'archive', size });
            }
        }
        entries.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name, undefined, { numeric: true }) : a.kind === 'dir' ? -1 : 1));
        const isRoot = roots.includes(target);
        res.json({ roots, path: target, parent: isRoot ? null : path.dirname(target), entries });
    } catch (error) {
        res.status(statusOf(error, 500)).json({ error: error.message });
    }
});

// What a folder (or archive) would import as, shaped like /downloads/:hash/contents
router.get('/local-downloads/contents', async (req, res) => {
    try {
        const { target } = resolveImportPath(req.query.path);
        if (!await fs.pathExists(target)) return res.status(404).json({ error: 'Not found on disk' });
        const plan = await describeRelease(target);
        const bookmark = req.query.bookmarkId ? bookmarkDb.getById(req.query.bookmarkId, req.user.id) : null;
        res.json({
            success: true,
            releaseName: plan.releaseName,
            items: plan.items,
            unsupported: plan.unsupported,
            bookmarkId: bookmark?.id || null,
            bookmarkTitle: bookmark ? (bookmark.alias || bookmark.title) : null,
            newSeriesTitle: parseReleaseName(path.basename(target)).title || path.basename(target),
            existing: {
                volumes: (bookmark?.volumes || []).filter(v => v.kind === 'release').map(v => ({ number: v.number, name: v.name })),
                chapters: bookmark?.downloadedChapters || []
            }
        });
    } catch (error) {
        res.status(statusOf(error, 500)).json({ error: error.message });
    }
});

// Import a folder (or archive): body { path, bookmarkId?, newSeriesTitle?, selection? }
router.post('/local-downloads/import', async (req, res) => {
    try {
        const { path: requested, bookmarkId, newSeriesTitle, selection } = req.body || {};
        const { target } = resolveImportPath(requested);
        if (!await fs.pathExists(target)) return res.status(404).json({ error: 'Not found on disk' });
        if (selection !== undefined && selection !== null && !Array.isArray(selection)) return res.status(400).json({ error: 'selection must be a list' });
        const bookmark = bookmarkId ? bookmarkDb.getById(bookmarkId, req.user.id) : null;
        if (bookmarkId && !bookmark) return res.status(404).json({ error: 'Series not found' });
        // Queued: the import runs as a task with progress (GET /imports/:id, queue page)
        const rec = torrents.queueFolderImport({
            path: target, bookmark, newSeriesTitle: newSeriesTitle || null,
            selection: Array.isArray(selection) ? selection : null, userId: req.user.id
        });
        res.status(202).json({ success: true, queued: true, importId: rec.id, import: rec });
    } catch (error) {
        res.status(statusOf(error, 500)).json({ error: error.message });
    }
});

// What a finished download contains, each item with the target it would
// get on an automatic import, plus what the series already has
router.get('/downloads/:hash/contents', async (req, res) => {
    const row = trackedTorrent(req, res);
    if (!row) return;
    try {
        const plan = await torrents.describeTorrent(row.hash);
        const bookmark = row.bookmarkId ? bookmarkDb.getById(row.bookmarkId, req.user.id) : null;
        res.json({
            success: true,
            releaseName: plan.releaseName,
            items: plan.items,
            unsupported: plan.unsupported,
            bookmarkId: bookmark?.id || null,
            bookmarkTitle: bookmark ? (bookmark.alias || bookmark.title) : null,
            newSeriesTitle: row.newSeriesTitle || null,
            existing: {
                volumes: (bookmark?.volumes || []).filter(v => v.kind === 'release').map(v => ({ number: v.number, name: v.name })),
                chapters: bookmark?.downloadedChapters || []
            }
        });
    } catch (error) {
        res.status(statusOf(error, 500)).json({ error: error.message });
    }
});

// Import a finished torrent (again), optionally into another series and
// optionally only a selection of its items: body { bookmarkId?, selection? }
router.post('/downloads/:hash/import', async (req, res) => {
    const row = trackedTorrent(req, res);
    if (!row) return;
    try {
        const { bookmarkId, selection } = req.body || {};
        if (bookmarkId && !bookmarkDb.getById(bookmarkId, req.user.id)) return res.status(404).json({ error: 'Series not found' });
        if (selection !== undefined && selection !== null && !Array.isArray(selection)) return res.status(400).json({ error: 'selection must be a list' });
        // Queued: the import runs as a task with progress (GET /imports/:id, queue page)
        const rec = torrents.queueTorrentImport(row.hash, { bookmarkId: bookmarkId || null, selection: Array.isArray(selection) ? selection : null });
        res.status(202).json({ success: true, queued: true, importId: rec.id, import: rec });
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
