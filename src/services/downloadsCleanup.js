/**
 * Leftovers in the downloads folder: what is on disk that no bookmark,
 * downloaded chapter version or volume refers to any more.
 *
 * The folder layout is derived, never recorded: a bookmark's folder is
 * `<DOWNLOADS_DIR>/<alias or title>`, chapters are `Chapter NNNNN[ vTOKEN]`
 * folders inside it (the token names a version), release volumes are
 * `Volume NN` folders the volumes table points at, and imports write into
 * a `.importing…` temp dir first. Anything else that accumulates - a series
 * renamed by alias, a version deleted from the DB but not from disk, a
 * crashed import - is a leftover. Nothing here deletes on its own: `scan`
 * lists, `remove` deletes exactly the paths it is given, and only if a
 * fresh scan still calls them leftovers.
 */

import path from 'path';
import fs from 'fs-extra';
import { CONFIG } from '../config.js';
import { downloader } from '../downloader.js';
import { getDb } from '../db/connection.js';
import { bookmarkDb } from '../db/bookmarks.js';

const CHAPTER_DIR_RE = /^Chapter\s*(\d+(?:\.\d+)?)/i;
const VOLUME_DIR_RE = /^Volume\s/i;
const TEMP_DIR_RE = /^\.importing|^\.renumber_|^\.swap_temp/i;

async function sizeOf(target) {
  let total = 0;
  const stat = await fs.stat(target).catch(() => null);
  if (!stat) return 0;
  if (stat.isFile()) return stat.size;
  const walk = async (dir) => {
    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile()) {
        try { total += (await fs.stat(full)).size; } catch (err) { /* vanished */ }
      }
    }
  };
  await walk(target);
  return total;
}

/**
 * Every bookmark that maps onto a downloads folder, grouped by folder.
 * Two users tracking the same manga share one folder, so a chapter folder
 * counts as claimed when any of them claims it.
 * @returns {Map<string, Array<{ id, title, alias, userId }>>} absolute dir -> bookmarks
 */
function bookmarksByDir() {
  const rows = getDb().prepare('SELECT id, title, alias, user_id FROM bookmarks').all();
  const map = new Map();
  for (const r of rows) {
    const dir = path.resolve(downloader.getMangaDir(r.title, r.alias));
    if (!map.has(dir)) map.set(dir, []);
    map.get(dir).push({ id: r.id, title: r.title, alias: r.alias, userId: r.user_id });
  }
  return map;
}

/**
 * Scan the downloads folder for leftovers.
 * @returns {Promise<{ root: string, scannedAt: string, groups: Array<{ series: string, bookmarkIds: string[], items: Array<{ kind: 'series'|'chapter'|'volume'|'temp', path: string, name: string, size: number, note: string }> }>, totalSize: number, totalItems: number }>}
 *   `path` is relative to the downloads folder (what `remove` takes back).
 */
export async function scan() {
  const root = path.resolve(CONFIG.downloadsDir);
  const byDir = bookmarksByDir();
  const groups = [];
  let totalSize = 0;
  let totalItems = 0;

  const add = (group, item) => {
    group.items.push(item);
    totalSize += item.size;
    totalItems++;
  };

  const top = await fs.pathExists(root) ? await fs.readdir(root, { withFileTypes: true }) : [];
  for (const entry of top) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(root, entry.name);
    const owners = byDir.get(path.resolve(dir));

    if (!owners) {
      // A whole series folder nobody maps to (renamed alias, deleted bookmark kept its files)
      const group = { series: entry.name, bookmarkIds: [], items: [] };
      add(group, { kind: 'series', path: entry.name, name: entry.name, size: await sizeOf(dir), note: 'No series in the library uses this folder' });
      groups.push(group);
      continue;
    }

    const group = { series: entry.name, bookmarkIds: owners.map(o => o.id), items: [] };
    const bookmarks = owners.map(o => bookmarkDb.getById(o.id, o.userId)).filter(Boolean);
    if (bookmarks.length === 0) continue;

    // What the owners claim
    const claimedChapterFolders = new Set();
    const claimedVolumeFolders = new Set();
    const first = bookmarks[0];
    const chapterFolders = await downloader.getChapterFolders(first.title, first.alias);
    for (const b of bookmarks) {
      const downloadedNums = new Set((b.downloadedChapters || []).map(Number));
      for (const [num, list] of Object.entries(chapterFolders)) {
        const matched = downloader.matchFoldersToUrls(list, b.downloadedVersions?.[num] || []);
        for (const f of matched) {
          if (f.url) claimedChapterFolders.add(f.folder);
          // Downloads from before version tracking: the plain chapter folder
          // of a chapter marked downloaded is in use even without a URL.
          else if (!f.isVersioned && downloadedNums.has(Number(num))) claimedChapterFolders.add(f.folder);
        }
      }
      for (const v of b.volumes || []) if (v.folder) claimedVolumeFolders.add(v.folder);
    }

    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch (e) { continue; }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const rel = path.join(entry.name, e.name);
      const full = path.join(dir, e.name);
      if (TEMP_DIR_RE.test(e.name)) {
        add(group, { kind: 'temp', path: rel, name: e.name, size: await sizeOf(full), note: 'Temporary folder of an import that did not finish' });
      } else if (CHAPTER_DIR_RE.test(e.name)) {
        if (claimedChapterFolders.has(e.name)) continue;
        const num = parseFloat(e.name.match(CHAPTER_DIR_RE)[1]);
        const versioned = / v[a-z0-9]+$/i.test(e.name);
        add(group, {
          kind: 'chapter', path: rel, name: e.name, size: await sizeOf(full),
          note: versioned ? `Chapter ${num}: a version no downloaded chapter refers to` : `Chapter ${num}: not marked as downloaded`
        });
      } else if (VOLUME_DIR_RE.test(e.name)) {
        if (claimedVolumeFolders.has(e.name)) continue;
        add(group, { kind: 'volume', path: rel, name: e.name, size: await sizeOf(full), note: 'No volume in the library points at this folder' });
      }
    }
    if (group.items.length) groups.push(group);
  }

  groups.sort((a, b) => a.series.localeCompare(b.series));
  return { root, scannedAt: new Date().toISOString(), groups, totalSize, totalItems };
}

/**
 * Delete leftovers. Only paths a fresh scan still reports are removed, so
 * a stale list (or a crafted one) can never reach anything in use.
 * @param {string[]} relPaths - as returned by `scan` (relative to the downloads folder)
 * @returns {Promise<{ removed: Array<{ path, size }>, skipped: Array<{ path, reason }>, freed: number }>}
 */
export async function remove(relPaths = []) {
  const current = await scan();
  const known = new Map();
  for (const g of current.groups) for (const it of g.items) known.set(it.path, it);
  const root = path.resolve(CONFIG.downloadsDir);
  const result = { removed: [], skipped: [], freed: 0 };

  for (const rel of relPaths) {
    const key = String(rel || '');
    const item = known.get(key);
    if (!item) {
      result.skipped.push({ path: key, reason: 'No longer a leftover (or never was); scan again' });
      continue;
    }
    const full = path.resolve(root, key);
    if (full !== root && !full.startsWith(root + path.sep)) {
      result.skipped.push({ path: key, reason: 'Outside the downloads folder' });
      continue;
    }
    try {
      await fs.remove(full);
      result.removed.push({ path: key, size: item.size });
      result.freed += item.size;
      console.log(`[Cleanup] Removed leftover ${item.kind}: ${key} (${item.size} bytes)`);
    } catch (e) {
      result.skipped.push({ path: key, reason: e.message });
    }
  }
  return result;
}

export default { scan, remove };
