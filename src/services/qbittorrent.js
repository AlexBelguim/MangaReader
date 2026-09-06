/**
 * qBittorrent Web API client (v2 API, qBittorrent 4.1+ and 5.x), used the
 * way Sonarr's download-client integration uses it: log in with the WebUI
 * credentials, add torrents under a category, watch them, delete them.
 *
 * API: https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)
 */

import { readTorrent, infoHashFromMagnet, nameFromMagnet } from './torrent-file.js';

const TIMEOUT_MS = 20000;

export class QBittorrentClient {
  /**
   * @param {{ baseUrl: string, username?: string, password?: string }} settings
   */
  constructor(settings) {
    const raw = String(settings?.baseUrl || '').trim();
    if (!raw) throw new Error('qBittorrent URL is not set');
    this.baseUrl = raw.replace(/\/+$/, '');
    this.username = settings.username || '';
    this.password = settings.password || '';
    this.cookie = null;
  }

  async login() {
    const body = new URLSearchParams({ username: this.username, password: this.password });
    let response;
    try {
      response = await fetch(`${this.baseUrl}/api/v2/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Referer': this.baseUrl },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS)
      });
    } catch (e) {
      throw new Error(`qBittorrent unreachable at ${this.baseUrl}: ${e.message}`);
    }
    const text = await response.text();
    if (response.status === 403 || /fails/i.test(text)) throw new Error('qBittorrent rejected the username or password');
    if (!response.ok) throw new Error(`qBittorrent login answered HTTP ${response.status}`);
    const setCookie = response.headers.get('set-cookie') || '';
    const sid = setCookie.match(/SID=([^;]+)/);
    // No cookie means the WebUI has authentication bypassed for this host
    this.cookie = sid ? `SID=${sid[1]}` : null;
    return true;
  }

  async request(path, { method = 'GET', form, multipart, query, retry = true } = {}) {
    if (this.cookie === null && retry) await this.login();
    const url = new URL(`${this.baseUrl}${path}`);
    if (query) for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    const headers = { 'Referer': this.baseUrl };
    if (this.cookie) headers.Cookie = this.cookie;
    let body;
    if (form) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      body = new URLSearchParams(form);
    } else if (multipart) {
      body = multipart;
    }
    let response;
    try {
      response = await fetch(url, { method, headers, body, signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (e) {
      throw new Error(`qBittorrent request failed: ${e.message}`);
    }
    if (response.status === 403 && retry) {
      // Session expired: log in once more and repeat
      this.cookie = null;
      await this.login();
      return this.request(path, { method, form, multipart, query, retry: false });
    }
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`qBittorrent answered HTTP ${response.status} for ${path}${text ? `: ${text.slice(0, 200)}` : ''}`);
    }
    return response;
  }

  async version() {
    const r = await this.request('/api/v2/app/version');
    return (await r.text()).trim();
  }

  /** @returns {{ ok: true, version: string, savePath: string }} */
  async testConnection() {
    const version = await this.version();
    let savePath = '';
    try {
      const prefs = await (await this.request('/api/v2/app/preferences')).json();
      savePath = prefs.save_path || '';
    } catch (e) { /* optional */ }
    return { ok: true, version, savePath };
  }

  /**
   * Add a torrent. Returns the info hash qBittorrent will list it under.
   * @param {{ magnet?: string, torrent?: Buffer, filename?: string, category?: string, savePath?: string, tags?: string, paused?: boolean }} opts
   * @returns {Promise<{ hash: string, name: string }>}
   */
  async add({ magnet, torrent, filename = 'release.torrent', category, savePath, tags, paused = false }) {
    const form = new FormData();
    let hash = null;
    let name = '';
    if (magnet) {
      form.append('urls', magnet);
      hash = infoHashFromMagnet(magnet);
      name = nameFromMagnet(magnet);
    } else if (torrent) {
      const parsed = readTorrent(torrent);
      hash = parsed.infoHash;
      name = parsed.name;
      form.append('torrents', new Blob([torrent], { type: 'application/x-bittorrent' }), filename);
    } else {
      throw new Error('Nothing to add: no magnet link and no torrent file');
    }
    if (category) form.append('category', category);
    if (savePath) form.append('savepath', savePath);
    if (tags) form.append('tags', tags);
    // qBittorrent 4.x reads "paused", 5.x reads "stopped"; send both
    form.append('paused', paused ? 'true' : 'false');
    form.append('stopped', paused ? 'true' : 'false');

    const r = await this.request('/api/v2/torrents/add', { method: 'POST', multipart: form });
    const text = (await r.text()).trim();
    if (text && text !== 'Ok.') throw new Error(`qBittorrent did not accept the torrent: ${text}`);
    return { hash, name };
  }

  /**
   * Torrents, optionally by category or hashes.
   * @returns {Promise<Array<{ hash, name, size, progress, dlspeed, eta, state, category, savePath, contentPath, completedOn, addedOn, seeds, ratio }>>}
   */
  async list({ category, hashes } = {}) {
    const query = {};
    if (category) query.category = category;
    if (hashes?.length) query.hashes = hashes.join('|');
    const r = await this.request('/api/v2/torrents/info', { query });
    const rows = await r.json();
    return (Array.isArray(rows) ? rows : []).map(t => ({
      hash: t.hash,
      name: t.name,
      size: t.size ?? t.total_size ?? 0,
      progress: typeof t.progress === 'number' ? t.progress : 0,
      dlspeed: t.dlspeed ?? 0,
      eta: t.eta ?? null,
      state: t.state || '',
      category: t.category || '',
      savePath: t.save_path || '',
      contentPath: t.content_path || '',
      completedOn: t.completion_on > 0 ? t.completion_on : null,
      addedOn: t.added_on || null,
      seeds: t.num_seeds ?? null,
      ratio: t.ratio ?? null
    }));
  }

  /** @returns {Promise<Array<{ name: string, size: number, progress: number }>>} */
  async files(hash) {
    const r = await this.request('/api/v2/torrents/files', { query: { hash } });
    const rows = await r.json();
    return (Array.isArray(rows) ? rows : []).map(f => ({ name: f.name, size: f.size ?? 0, progress: f.progress ?? 0 }));
  }

  async delete(hashes, deleteFiles = false) {
    await this.request('/api/v2/torrents/delete', {
      method: 'POST',
      form: { hashes: [].concat(hashes).join('|'), deleteFiles: deleteFiles ? 'true' : 'false' }
    });
  }

  // 4.x calls these pause/resume, 5.x stop/start
  async pause(hashes) {
    const form = { hashes: [].concat(hashes).join('|') };
    try { await this.request('/api/v2/torrents/stop', { method: 'POST', form }); }
    catch (e) { await this.request('/api/v2/torrents/pause', { method: 'POST', form }); }
  }

  async resume(hashes) {
    const form = { hashes: [].concat(hashes).join('|') };
    try { await this.request('/api/v2/torrents/start', { method: 'POST', form }); }
    catch (e) { await this.request('/api/v2/torrents/resume', { method: 'POST', form }); }
  }
}

// States qBittorrent reports that mean "everything is on disk"
export const COMPLETE_STATES = new Set(['uploading', 'stalledUP', 'pausedUP', 'stoppedUP', 'queuedUP', 'forcedUP', 'checkingUP']);
export const ERROR_STATES = new Set(['error', 'missingFiles']);

export function isComplete(torrent) {
  return COMPLETE_STATES.has(torrent.state) || torrent.progress >= 1;
}

export default { QBittorrentClient, isComplete, COMPLETE_STATES, ERROR_STATES };
