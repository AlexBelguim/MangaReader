/**
 * The *arr-style brain for torrents: search through Prowlarr, hand releases
 * to qBittorrent, watch them, and import what finishes into the library.
 * State lives in torrent_downloads (survives restarts); qBittorrent is
 * polled while anything is active.
 */

import path from 'path';
import crypto from 'crypto';
import fs from 'fs-extra';
import { torrentSettingsDb, torrentDb } from '../db/torrents.js';
import { bookmarkDb } from '../db/bookmarks.js';
import { downloader } from '../downloader.js';
import * as prowlarr from './prowlarr.js';
import { QBittorrentClient, isComplete, ERROR_STATES } from './qbittorrent.js';
import { parseReleaseName } from './release-name.js';
import { importRelease, describeRelease } from './volumeImporter.js';
import { emitToAll } from './socketService.js';

export const TORRENT_EVENT = 'torrent:update';

const POLL_ACTIVE_MS = 10000;
let pollTimer = null;
let pollInFlight = null;
let clientCache = null;

// Search hits stay server-side: Prowlarr's download links carry its API key,
// so a browser only ever sees an id and grabs by it.
const RELEASE_TTL_MS = 30 * 60 * 1000;
const RELEASE_CACHE_MAX = 2000;
const releaseCache = new Map(); // id -> { release, expires }

function settings() {
  return torrentSettingsDb.get();
}

function qbt() {
  const s = settings().qbittorrent;
  if (!s.baseUrl) throw new Error('qBittorrent is not configured (Settings > Torrents)');
  if (!clientCache || clientCache.baseUrl !== s.baseUrl.replace(/\/+$/, '') || clientCache.username !== s.username || clientCache.password !== s.password) {
    clientCache = new QBittorrentClient(s);
  }
  return clientCache;
}

function requireProwlarr() {
  const s = settings().prowlarr;
  if (!s.baseUrl || !s.apiKey) throw new Error('Prowlarr is not configured (Settings > Torrents)');
  return s;
}

function broadcast() {
  try {
    emitToAll(TORRENT_EVENT, { torrents: torrentDb.list({ limit: 50 }) });
  } catch (e) { /* socket not ready */ }
}

function fail(message, status) {
  const err = new Error(message);
  err.status = status;
  return err;
}

/** Where qBittorrent's path is on this machine, per the configured mappings. */
export function toLocalPath(remotePath) {
  if (!remotePath) return remotePath;
  const mappings = [...settings().pathMappings].sort((a, b) => b.from.length - a.from.length);
  const norm = (p) => p.replace(/\\/g, '/').replace(/\/+$/, '');
  const r = norm(remotePath);
  for (const m of mappings) {
    const from = norm(m.from);
    if (r === from || r.startsWith(from + '/')) {
      return path.normalize(m.to.replace(/[\\/]+$/, '') + r.slice(from.length));
    }
  }
  return remotePath;
}

// ─── Search ──────────────────────────────────────────────────────────

/**
 * Search Prowlarr. Returns client-safe releases (no download links); the
 * full release is cached under the returned id for grab().
 */
export async function search(query) {
  const results = await prowlarr.search(requireProwlarr(), query);
  const listed = results.map(r => {
    const id = crypto.randomUUID();
    releaseCache.set(id, { release: r, expires: Date.now() + RELEASE_TTL_MS });
    return publicRelease(id, r);
  });
  pruneReleases();
  return listed.sort((a, b) => (b.seeders ?? -1) - (a.seeders ?? -1));
}

function pruneReleases() {
  const now = Date.now();
  for (const [id, entry] of releaseCache) if (entry.expires <= now) releaseCache.delete(id);
  // Still over the cap: drop the oldest (a Map keeps insertion order)
  while (releaseCache.size > RELEASE_CACHE_MAX) releaseCache.delete(releaseCache.keys().next().value);
}

/** The part of a release a client may see. */
function publicRelease(id, r) {
  return {
    id,
    title: r.title,
    size: r.size,
    seeders: r.seeders,
    leechers: r.leechers,
    indexer: r.indexer,
    publishDate: r.publishDate,
    infoUrl: safeInfoUrl(r.infoUrl),
    infoHash: r.infoHash,
    categories: r.categories,
    hasDownload: !!(r.downloadUrl || r.magnetUrl),
    parsed: parseReleaseName(r.title)
  };
}

// Only http(s) links, and never one carrying an API key
function safeInfoUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return null;
    if ([...u.searchParams.keys()].some(k => /apikey/i.test(k))) return null;
    return u.toString();
  } catch (e) {
    return null;
  }
}

export function getCachedRelease(id) {
  const key = String(id || '');
  const entry = releaseCache.get(key);
  if (!entry) return null;
  if (entry.expires <= Date.now()) {
    releaseCache.delete(key);
    return null;
  }
  return entry.release;
}

// ─── Grab ────────────────────────────────────────────────────────────

/**
 * Start grabbing a cached search hit. Answers at once with a pending entry
 * (status "grabbing", temporary hash); fetching the .torrent through
 * Prowlarr and handing it to qBittorrent happen in the background, because
 * a tunnel or proxy in front of the app may not keep a request open that
 * long. The entry is replaced by the real torrent, or marked failed.
 * @param {{ releaseId: string, bookmarkId?: string, newSeriesTitle?: string, userId?: number, autoImport?: boolean }} opts
 */
export async function grab({ releaseId, bookmarkId = null, newSeriesTitle = null, userId = null, autoImport = null }) {
  const release = getCachedRelease(releaseId);
  if (!release) throw fail('Search results expired, search again', 410);
  if (!release.downloadUrl && !release.magnetUrl) throw fail('That release has no download link', 400);
  const s = settings();
  requireProwlarr();
  const client = qbt();

  const pending = torrentDb.insert({
    hash: `grab-${crypto.randomUUID()}`,
    name: release.title,
    releaseTitle: release.title,
    size: release.size || 0,
    indexer: release.indexer || null,
    infoUrl: safeInfoUrl(release.infoUrl),
    bookmarkId,
    newSeriesTitle: bookmarkId ? null : (newSeriesTitle || parseReleaseName(release.title).title || release.title),
    userId,
    status: 'grabbing',
    autoImport: autoImport === null ? s.autoImport !== false : !!autoImport
  });
  broadcast();
  finishGrab(pending, release, client, s).catch(e => console.error(`[Torrents] Grab of "${release.title}" failed: ${e.message}`));
  return pending;
}

async function finishGrab(pending, release, client, s) {
  try {
    const payload = await prowlarr.fetchRelease(requireProwlarr(), release);
    const added = await client.add({
      ...payload,
      category: s.qbittorrent.category || undefined,
      savePath: s.qbittorrent.savePath || undefined
    });
    if (!added.hash) throw new Error('Could not determine the torrent hash');

    const existing = torrentDb.get(added.hash);
    if (existing && ['downloading', 'completed', 'importing'].includes(existing.status)) {
      throw new Error(`Already downloading: ${existing.name || existing.releaseTitle}`);
    }
    if (!torrentDb.get(pending.hash)) return null; // removed from the list meanwhile
    torrentDb.remove(pending.hash);
    const row = torrentDb.insert({
      ...pending,
      hash: added.hash,
      name: added.name || release.title,
      status: 'downloading'
    });
    console.log(`[Torrents] Grabbed "${row.releaseTitle}" (${row.hash}) for ${row.bookmarkId ? `bookmark ${row.bookmarkId}` : `new series "${row.newSeriesTitle}"`}`);
    broadcast();
    ensurePolling();
    return row;
  } catch (e) {
    if (torrentDb.get(pending.hash)) torrentDb.update(pending.hash, { status: 'failed', error: e.message });
    broadcast();
    throw e;
  }
}

// ─── Polling ─────────────────────────────────────────────────────────

export function ensurePolling() {
  if (pollTimer) return;
  pollTimer = setTimeout(pollOnce, 1500);
}

async function pollOnce() {
  pollTimer = null;
  let again = false;
  try {
    again = await poll();
  } catch (e) {
    console.warn(`[Torrents] Poll failed: ${e.message}`);
    again = true;
  }
  if (again && !pollTimer) pollTimer = setTimeout(pollOnce, POLL_ACTIVE_MS);
}

/**
 * Refresh every active torrent from qBittorrent; import the ones that
 * finished. Concurrent callers share one run. Resolves to whether another
 * poll is needed.
 */
export function poll() {
  if (!pollInFlight) {
    pollInFlight = doPoll().finally(() => { pollInFlight = null; });
  }
  return pollInFlight;
}

async function doPoll() {
  const active = torrentDb.active();
  if (active.length === 0) return false;
  let client;
  try {
    client = qbt();
  } catch (e) {
    return false; // not configured: nothing to watch
  }
  const listed = await client.list({ hashes: active.map(t => t.hash) });
  const byHash = new Map(listed.map(t => [t.hash, t]));
  let changed = false;

  for (const row of active) {
    const t = byHash.get(row.hash);
    if (!t) {
      // Gone from qBittorrent (removed there) - nothing left to watch
      if (row.status === 'downloading') {
        torrentDb.update(row.hash, { status: 'removed', error: 'Removed from qBittorrent' });
        changed = true;
      }
      continue;
    }
    const patch = {
      name: t.name || row.name,
      progress: t.progress,
      dlspeed: t.dlspeed,
      eta: t.eta,
      state: t.state,
      savePath: t.savePath,
      contentPath: t.contentPath,
      size: t.size || row.size
    };
    if (ERROR_STATES.has(t.state)) {
      patch.status = 'failed';
      patch.error = t.state === 'missingFiles' ? 'qBittorrent reports missing files' : 'qBittorrent reports an error';
    } else if (row.status === 'downloading' && isComplete(t)) {
      patch.status = 'completed';
      patch.completedAt = new Date().toISOString();
    }
    torrentDb.update(row.hash, patch);
    changed = true;
    if (patch.status === 'completed' && row.autoImport) {
      importTorrent(row.hash).catch(e => console.warn(`[Torrents] Auto-import of ${row.hash} failed: ${e.message}`));
    }
  }
  if (changed) broadcast();
  // Keep polling while something is still downloading or waiting to import
  return torrentDb.active().some(t => t.status === 'downloading' || t.status === 'importing');
}

// ─── Import ──────────────────────────────────────────────────────────

function finished(row) {
  return ['completed', 'imported', 'failed'].includes(row.status) || row.progress >= 1;
}

// Where a finished torrent's files are for this app
async function localPathOf(row) {
  const reported = row.contentPath || (row.savePath && row.name ? path.join(row.savePath, row.name) : null);
  if (!reported) throw new Error('qBittorrent has not reported where the files are yet; refresh and try again');
  const localPath = toLocalPath(reported);
  if (!await fs.pathExists(localPath)) {
    throw new Error(`Cannot see the download at "${localPath}". qBittorrent reports "${reported}"; add a path mapping in Settings > Torrents if the app sees that folder under another path.`);
  }
  return localPath;
}

/**
 * What a finished torrent contains, item by item, with the target each
 * item would get on an automatic import (for the review dialog).
 */
export async function describeTorrent(hash) {
  const row = torrentDb.get(hash);
  if (!row) throw fail('Unknown torrent', 404);
  if (!finished(row)) throw fail('The download has not finished yet', 409);
  const localPath = await localPathOf(row);
  const plan = await describeRelease(localPath, { releaseName: row.releaseTitle || row.name });
  return { releaseName: plan.releaseName, items: plan.items, unsupported: plan.unsupported };
}

/**
 * Import a finished torrent into its bookmark (creating a local series
 * when none was chosen). Safe to call again after a failure. With a
 * selection ([{ path, as: 'volume'|'chapter'|'skip', number }]) only those
 * items are imported, at those targets.
 */
export async function importTorrent(hash, { bookmarkId = null, selection = null } = {}) {
  const row = torrentDb.get(hash);
  if (!row) throw fail('Unknown torrent', 404);
  if (row.status === 'importing') throw fail('Import already running', 409);
  if (!finished(row)) throw fail('The download has not finished yet', 409);

  const targetId = bookmarkId || row.bookmarkId;
  torrentDb.update(row.hash, { status: 'importing', error: null, bookmarkId: targetId || null });
  broadcast();
  try {
    let bookmark = targetId ? bookmarkDb.getById(targetId) : null;
    if (targetId && !bookmark) throw new Error('The chosen series no longer exists');

    const localPath = await localPathOf(row);
    // Only now create a series for it, so a path problem leaves no empty one behind
    if (!bookmark) bookmark = createLocalSeries(row.newSeriesTitle || parseReleaseName(row.releaseTitle || row.name).title || row.name, row.userId);

    const summary = await importRelease(bookmark, localPath, { releaseName: row.releaseTitle || row.name, selection });
    if (summary.volumes.length === 0 && summary.chapters.length === 0) {
      throw new Error(summary.skipped[0] || 'Nothing was imported');
    }
    torrentDb.update(row.hash, { status: 'imported', importedAt: new Date().toISOString(), bookmarkId: bookmark.id, importResult: summary, error: null });
    console.log(`[Torrents] Imported "${row.releaseTitle}": ${summary.volumes.length} volume(s), ${summary.chapters.length} chapter(s)${summary.skipped.length ? `, ${summary.skipped.length} skipped` : ''}`);
    broadcast();
    return { bookmark, summary };
  } catch (e) {
    torrentDb.update(row.hash, { status: 'failed', error: e.message });
    broadcast();
    throw e;
  }
}

export function createLocalSeries(title, userId) {
  const clean = String(title || 'Untitled').trim() || 'Untitled';
  const result = bookmarkDb.add({
    url: `local://${downloader.sanitizeFileName(clean)}`,
    title: clean,
    alias: null,
    website: 'Local',
    chapters: [],
    totalChapters: 0,
    cover: null
  }, userId);
  const id = result?.bookmark?.id || result?.id;
  const bookmark = bookmarkDb.getById(id);
  if (!bookmark) throw new Error('Could not create the series');
  return bookmark;
}

// ─── Removal / pause ─────────────────────────────────────────────────

export async function remove(hash, { deleteFiles = false, fromClient = true } = {}) {
  const row = torrentDb.get(hash);
  if (!row) return false;
  // A pending grab has no torrent in qBittorrent yet
  if (fromClient && row.status !== 'grabbing') {
    try {
      await qbt().delete(row.hash, deleteFiles);
    } catch (e) {
      console.warn(`[Torrents] Could not remove ${row.hash} from qBittorrent: ${e.message}`);
    }
  }
  torrentDb.remove(row.hash);
  broadcast();
  return true;
}

// Only torrents this app tracks reach qBittorrent (its API also accepts
// "all" and hash lists, which must never come from a client).
export async function pause(hash) {
  const row = torrentDb.get(hash);
  if (!row) throw fail('Unknown torrent', 404);
  await qbt().pause(row.hash);
}

export async function resume(hash) {
  const row = torrentDb.get(hash);
  if (!row) throw fail('Unknown torrent', 404);
  await qbt().resume(row.hash);
  ensurePolling();
}

// ─── Connection tests ────────────────────────────────────────────────

export async function testProwlarr(candidate) {
  const s = { ...settings().prowlarr, ...(candidate || {}) };
  if (candidate?.apiKey === undefined || candidate.apiKey === '' ) s.apiKey = settings().prowlarr.apiKey || s.apiKey;
  return prowlarr.testConnection(s);
}

export async function testQbittorrent(candidate) {
  const s = { ...settings().qbittorrent, ...(candidate || {}) };
  return new QBittorrentClient(s).testConnection();
}

/** Called once at startup: resume watching anything that was active. */
export function start() {
  // A grab that was still fetching when the server stopped never reached qBittorrent
  for (const row of torrentDb.list({ limit: 1000 }).filter(t => t.status === 'grabbing')) {
    torrentDb.update(row.hash, { status: 'failed', error: 'The grab was interrupted by a restart; grab it again' });
  }
  // An import that was running when the server stopped never finished
  for (const row of torrentDb.active().filter(t => t.status === 'importing')) {
    torrentDb.update(row.hash, { status: 'completed', error: 'The import was interrupted by a restart' });
    if (row.autoImport) {
      importTorrent(row.hash).catch(e => console.warn(`[Torrents] Import of ${row.hash} after restart failed: ${e.message}`));
    }
  }
  if (torrentDb.active().length > 0) ensurePolling();
}

export default { search, grab, poll, ensurePolling, describeTorrent, importTorrent, createLocalSeries, remove, pause, resume, testProwlarr, testQbittorrent, toLocalPath, getCachedRelease, start, TORRENT_EVENT };
