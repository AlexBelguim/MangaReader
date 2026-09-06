/**
 * Torrent integration storage: the Prowlarr / qBittorrent connection
 * settings (server-wide, admin-managed) and the torrents the app handed to
 * qBittorrent, from grab through import.
 */

import { getDb } from './connection.js';

const SETTINGS_KEY = 'torrents';

// What the password looks like when settings are sent to the UI
export const PASSWORD_MASK = '••••••••';

// A value that is only mask characters means "keep the stored secret".
// Tolerant of the bullets arriving re-encoded (a client that mangles UTF-8).
export function isMaskedSecret(value) {
    return typeof value === 'string' && value.length >= 4 && /^[•●�*]+$/.test(value);
}

export const DEFAULT_TORRENT_SETTINGS = {
    prowlarr: { baseUrl: '', apiKey: '' },
    qbittorrent: { baseUrl: '', username: '', password: '', category: 'manga', savePath: '' },
    // qBittorrent reports paths as it sees them; the app may see the same
    // folder under another prefix (container mounts). from -> to.
    pathMappings: [],
    autoImport: true
};

function readJson(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch (e) { return fallback; }
}

export const appSettingsDb = {
    get(key, fallback = null) {
        const row = getDb().prepare('SELECT value FROM app_settings WHERE key = ?').get(key);
        return row ? readJson(row.value, fallback) : fallback;
    },
    set(key, value) {
        getDb().prepare('INSERT OR REPLACE INTO app_settings (key, value, updated_at) VALUES (?, ?, ?)')
            .run(key, JSON.stringify(value), new Date().toISOString());
    }
};

export const torrentSettingsDb = {
    /** Full settings, secrets included (for the services). */
    get() {
        const saved = appSettingsDb.get(SETTINGS_KEY, {}) || {};
        return {
            ...DEFAULT_TORRENT_SETTINGS,
            ...saved,
            prowlarr: { ...DEFAULT_TORRENT_SETTINGS.prowlarr, ...(saved.prowlarr || {}) },
            qbittorrent: { ...DEFAULT_TORRENT_SETTINGS.qbittorrent, ...(saved.qbittorrent || {}) },
            pathMappings: Array.isArray(saved.pathMappings) ? saved.pathMappings : []
        };
    },

    /** Settings as the UI may see them: secrets replaced by a mask (and a flag saying one is set). */
    getMasked() {
        const s = this.get();
        return {
            ...s,
            prowlarr: { ...s.prowlarr, apiKey: s.prowlarr.apiKey ? PASSWORD_MASK : '', apiKeySet: !!s.prowlarr.apiKey },
            qbittorrent: { ...s.qbittorrent, password: s.qbittorrent.password ? PASSWORD_MASK : '', passwordSet: !!s.qbittorrent.password }
        };
    },

    /**
     * Merge submitted settings over the stored ones. A masked secret means
     * "keep what is stored"; an empty string clears it.
     */
    save(input = {}) {
        const current = this.get();
        const next = {
            ...current,
            autoImport: input.autoImport === undefined ? current.autoImport : !!input.autoImport,
            prowlarr: { ...current.prowlarr, ...(input.prowlarr || {}) },
            qbittorrent: { ...current.qbittorrent, ...(input.qbittorrent || {}) },
            pathMappings: Array.isArray(input.pathMappings) ? input.pathMappings : current.pathMappings
        };
        if (input.prowlarr && isMaskedSecret(input.prowlarr.apiKey)) next.prowlarr.apiKey = current.prowlarr.apiKey;
        if (input.qbittorrent && isMaskedSecret(input.qbittorrent.password)) next.qbittorrent.password = current.qbittorrent.password;
        for (const svc of ['prowlarr', 'qbittorrent']) {
            for (const k of Object.keys(next[svc])) next[svc][k] = typeof next[svc][k] === 'string' ? next[svc][k].trim() : next[svc][k];
        }
        next.pathMappings = next.pathMappings
            .map(m => ({ from: String(m?.from || '').trim(), to: String(m?.to || '').trim() }))
            .filter(m => m.from && m.to);
        appSettingsDb.set(SETTINGS_KEY, next);
        return next;
    },

    isProwlarrConfigured() {
        const s = this.get();
        return !!(s.prowlarr.baseUrl && s.prowlarr.apiKey);
    },

    isQbittorrentConfigured() {
        return !!this.get().qbittorrent.baseUrl;
    }
};

const ACTIVE_STATUSES = ['downloading', 'completed', 'importing'];

function rowToTorrent(r) {
    if (!r) return null;
    return {
        hash: r.hash,
        name: r.name,
        releaseTitle: r.release_title,
        size: r.size,
        indexer: r.indexer,
        infoUrl: r.info_url,
        bookmarkId: r.bookmark_id,
        newSeriesTitle: r.new_series_title,
        userId: r.user_id,
        status: r.status,
        progress: r.progress,
        dlspeed: r.dlspeed,
        eta: r.eta,
        state: r.state,
        savePath: r.save_path,
        contentPath: r.content_path,
        addedAt: r.added_at,
        completedAt: r.completed_at,
        importedAt: r.imported_at,
        autoImport: !!r.auto_import,
        error: r.error,
        importResult: readJson(r.import_result, null)
    };
}

export const torrentDb = {
    insert(t) {
        getDb().prepare(`
            INSERT OR REPLACE INTO torrent_downloads
              (hash, name, release_title, size, indexer, info_url, bookmark_id, new_series_title, user_id, status,
               progress, dlspeed, eta, state, save_path, content_path, added_at, auto_import)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, NULL, ?, ?, ?, ?, ?)
        `).run(
            t.hash, t.name || null, t.releaseTitle || null, t.size || 0, t.indexer || null, t.infoUrl || null,
            t.bookmarkId || null, t.newSeriesTitle || null, t.userId ?? null, t.status || 'downloading',
            t.state || null, t.savePath || null, t.contentPath || null, new Date().toISOString(), t.autoImport === false ? 0 : 1
        );
        return this.get(t.hash);
    },

    get(hash) {
        return rowToTorrent(getDb().prepare('SELECT * FROM torrent_downloads WHERE hash = ?').get(hash));
    },

    /** Everything the queue page should show, newest first. */
    list({ includeFinished = true, limit = 100 } = {}) {
        const where = includeFinished ? '' : `WHERE status IN (${ACTIVE_STATUSES.map(() => '?').join(',')})`;
        const rows = getDb().prepare(`SELECT * FROM torrent_downloads ${where} ORDER BY added_at DESC LIMIT ?`)
            .all(...(includeFinished ? [] : ACTIVE_STATUSES), limit);
        return rows.map(rowToTorrent);
    },

    active() {
        return getDb().prepare(`SELECT * FROM torrent_downloads WHERE status IN (${ACTIVE_STATUSES.map(() => '?').join(',')})`)
            .all(...ACTIVE_STATUSES).map(rowToTorrent);
    },

    /** Patch columns by their JS names. */
    update(hash, patch) {
        const map = {
            name: 'name', status: 'status', progress: 'progress', dlspeed: 'dlspeed', eta: 'eta', state: 'state',
            savePath: 'save_path', contentPath: 'content_path', completedAt: 'completed_at', importedAt: 'imported_at',
            error: 'error', bookmarkId: 'bookmark_id', newSeriesTitle: 'new_series_title', autoImport: 'auto_import', size: 'size'
        };
        const sets = [];
        const values = [];
        for (const [k, v] of Object.entries(patch)) {
            if (!map[k]) continue;
            sets.push(`${map[k]} = ?`);
            values.push(k === 'autoImport' ? (v ? 1 : 0) : v);
        }
        if ('importResult' in patch) {
            sets.push('import_result = ?');
            values.push(patch.importResult ? JSON.stringify(patch.importResult) : null);
        }
        if (sets.length === 0) return this.get(hash);
        getDb().prepare(`UPDATE torrent_downloads SET ${sets.join(', ')} WHERE hash = ?`).run(...values, hash);
        return this.get(hash);
    },

    remove(hash) {
        return getDb().prepare('DELETE FROM torrent_downloads WHERE hash = ?').run(hash).changes > 0;
    }
};

export default { appSettingsDb, torrentSettingsDb, torrentDb, PASSWORD_MASK, DEFAULT_TORRENT_SETTINGS };
