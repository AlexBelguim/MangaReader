/**
 * Turn a volume release (a CBZ/ZIP archive or a folder of page images) into
 * a volume with its own pages: <manga folder>/Volume NN/001.jpg ... plus a
 * volumes row of kind 'release'. Chapter-shaped archives ("c001-c010") go
 * through the existing chapter extraction instead, so they land as normal
 * chapters.
 *
 * Volume folders never start with "Chapter", which is what every chapter
 * enumerator in downloader.js keys on, so they stay invisible to chapter
 * scans, version matching and leftover-folder detection.
 */

import path from 'path';
import fs from 'fs-extra';
import AdmZip from 'adm-zip';
import sharp from 'sharp';
import { downloader } from '../downloader.js';
import { bookmarkDb } from '../db/bookmarks.js';
import { CONFIG } from '../config.js';
import { parseReleaseName, volumeLabel } from './release-name.js';
import { splitSpread } from './pageEdits.js';

const IMAGE_RE = /\.(jpe?g|png|gif|webp|avif)$/i;
const ARCHIVE_RE = /\.(cbz|zip)$/i;
const UNSUPPORTED_ARCHIVE_RE = /\.(cbr|rar|7z|cb7|pdf|epub)$/i;
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

export function volumeFolderName(number) {
  return volumeLabel(number); // "Volume 01"
}

function volumeDir(bookmark, number) {
  return path.join(downloader.getMangaDir(bookmark.title, bookmark.alias), volumeFolderName(number));
}

/**
 * What a finished download contains that we can import: archives, image
 * folders, and things we cannot read (cbr/rar...).
 * @returns {Promise<{ archives: string[], imageDirs: string[], unsupported: string[] }>}
 */
export async function scanRelease(rootPath) {
  const out = { archives: [], imageDirs: [], unsupported: [] };
  const stat = await fs.stat(rootPath).catch(() => null);
  if (!stat) throw new Error(`Not found on disk: ${rootPath}`);
  if (stat.isFile()) {
    if (ARCHIVE_RE.test(rootPath)) out.archives.push(rootPath);
    else if (UNSUPPORTED_ARCHIVE_RE.test(rootPath)) out.unsupported.push(rootPath);
    return out;
  }
  const walk = async (dir, depth) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const images = entries.filter(e => e.isFile() && IMAGE_RE.test(e.name));
    if (images.length >= 3) out.imageDirs.push(dir);
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory() && depth < 4) await walk(full, depth + 1);
      else if (e.isFile() && ARCHIVE_RE.test(e.name)) out.archives.push(full);
      else if (e.isFile() && UNSUPPORTED_ARCHIVE_RE.test(e.name)) out.unsupported.push(full);
    }
  };
  await walk(rootPath, 0);
  out.archives.sort(collator.compare);
  out.imageDirs.sort(collator.compare);
  return out;
}

// Pages of an archive in reading order: by folder, then natural filename order
function archivePages(zip) {
  return zip.getEntries()
    .filter(e => !e.isDirectory && IMAGE_RE.test(e.entryName) && !/(^|\/)__MACOSX\//.test(e.entryName) && !/(^|\/)\._/.test(e.entryName))
    .sort((a, b) => collator.compare(a.entryName, b.entryName));
}

async function writePages(targetDir, items, readItem) {
  const tempDir = `${targetDir}.importing`;
  await fs.remove(tempDir);
  await fs.ensureDir(tempDir);
  let index = 0;
  for (const item of items) {
    index++;
    const ext = path.extname(item.name).toLowerCase().replace(/^\.jpeg$/, '.jpg');
    const buffer = await readItem(item);
    // Every stored page is a single page: a double-page spread is cut in
    // two in reading order (the rule the scraper applies too), so the
    // reader's two-page pairing never lands on a spread.
    let halves = null;
    try {
      halves = await splitSpread(buffer);
    } catch (e) {
      // unreadable image: keep it as it is
    }
    const pagePath = (n) => path.join(tempDir, `${String(n).padStart(3, '0')}${ext}`);
    if (halves) {
      await fs.writeFile(pagePath(index), halves.first);
      index++;
      await fs.writeFile(pagePath(index), halves.second);
    } else {
      await fs.writeFile(pagePath(index), buffer);
    }
  }
  await fs.remove(targetDir);
  await fs.move(tempDir, targetDir);
  return index;
}

async function makeCover(volumeId, firstPagePath) {
  const coversDir = path.join(CONFIG.dataDir, 'covers', 'volumes');
  await fs.ensureDir(coversDir);
  const filename = `volume_${volumeId}_${Date.now()}.jpg`;
  await sharp(firstPagePath).resize(600).jpeg({ quality: 90 }).toFile(path.join(coversDir, filename));
  return `/covers/volumes/${filename}`;
}

/**
 * Import one archive or image folder as volume `number` of the bookmark.
 * Existing pages of that volume are replaced.
 * @returns {Promise<{ volume: object, pageCount: number, folder: string }>}
 */
export async function importAsVolume(bookmark, sourcePath, { number, name, releaseName, source = 'torrent' }) {
  if (!Number.isFinite(number)) throw new Error('A volume needs a number');
  const targetDir = volumeDir(bookmark, number);
  const isArchive = (await fs.stat(sourcePath)).isFile();

  let pageCount;
  if (isArchive) {
    const zip = new AdmZip(sourcePath);
    const pages = archivePages(zip);
    if (pages.length === 0) throw new Error(`No page images inside ${path.basename(sourcePath)}`);
    pageCount = await writePages(targetDir, pages.map(p => ({ name: p.entryName, entry: p })), item => item.entry.getData());
  } else {
    const files = (await fs.readdir(sourcePath)).filter(f => IMAGE_RE.test(f)).sort(collator.compare);
    if (files.length === 0) throw new Error(`No page images inside ${path.basename(sourcePath)}`);
    pageCount = await writePages(targetDir, files.map(f => ({ name: f })), item => fs.readFile(path.join(sourcePath, item.name)));
  }

  const folder = path.relative(downloader.getMangaDir(bookmark.title, bookmark.alias), targetDir);
  const volume = bookmarkDb.upsertReleaseVolume(bookmark.id, {
    number,
    name: name || volumeLabel(number),
    folder,
    pageCount,
    source,
    releaseName: releaseName || path.basename(sourcePath)
  });

  // Cover from the first page (kept when the user already set one)
  if (!volume.cover) {
    try {
      const first = (await fs.readdir(targetDir)).filter(f => IMAGE_RE.test(f)).sort(collator.compare)[0];
      if (first) bookmarkDb.updateVolume(volume.id, { cover: await makeCover(volume.id, path.join(targetDir, first)) });
    } catch (e) {
      console.warn(`[VolumeImport] Could not make a cover for ${volume.name}: ${e.message}`);
    }
  }
  return { volume: bookmarkDb.getVolumeById(volume.id), pageCount, folder };
}

/**
 * Import an archive that is really a chapter (or a run of chapters) with the
 * regular chapter extraction, so it shows up as chapters, not a volume.
 */
export async function importAsChapter(bookmark, archivePath, chapterNumber) {
  // renameCbz false: the archive belongs to the torrent (seeding) and keeps its name
  const result = await downloader.extractCbz(archivePath, bookmark.title, chapterNumber, bookmark.alias, { forceReExtract: true, deleteAfter: false, renameCbz: false });
  const url = `local://${bookmark.id}/chapter-${chapterNumber}`;
  await bookmarkDb.update(bookmark.id, {
    chapters: [...(bookmark.chapters || []), { number: chapterNumber, title: `Chapter ${chapterNumber}`, url, removedFromRemote: true }]
  }, bookmark.userId ?? undefined);
  bookmarkDb.markChapterDownloaded(bookmark.id, chapterNumber, url);
  return { chapter: chapterNumber, extracted: result.extracted };
}

/**
 * What a finished release contains, item by item, with the target each
 * item would get on an automatic import: the volume number from the
 * file's own name, then from the release name (a range "v01-v03" numbers
 * the files in order), then from position; a single-chapter archive
 * becomes that chapter. Paths are relative to the release root.
 * @returns {Promise<{ releaseName: string, root: string, items: Array<{ path, name, kind: 'archive'|'dir', size: number|null, pages: number|null, parsed: object, as: 'volume'|'chapter', number: number }>, unsupported: string[] }>}
 */
export async function describeRelease(rootPath, { releaseName = '' } = {}) {
  const found = await scanRelease(rootPath);
  const resolved = path.resolve(rootPath);
  // Item paths are relative to a FOLDER. Picking a single archive makes the
  // release root that file, so the folder holding it is the base - otherwise
  // the file name is joined onto the file itself ("x.cbz/x.cbz", ENOTDIR).
  const stat = await fs.stat(resolved).catch(() => null);
  const root = stat && stat.isFile() ? path.dirname(resolved) : resolved;
  const rel = (p) => path.relative(root, p).split(path.sep).join('/') || path.basename(p);
  const releaseInfo = parseReleaseName(releaseName || path.basename(rootPath));
  const candidates = [
    ...found.archives.map(p => ({ path: p, kind: 'archive' })),
    // A folder of images inside a folder that also holds archives is usually
    // an unpacked copy; only offer image folders when there are no archives.
    ...(found.archives.length === 0 ? found.imageDirs.map(p => ({ path: p, kind: 'dir' })) : [])
  ];

  const used = new Set();
  let nextVolume = releaseInfo.volumes[0] || 1;
  const items = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const own = parseReleaseName(path.basename(c.path));
    let size = null;
    let pages = null;
    try {
      if (c.kind === 'archive') size = (await fs.stat(c.path)).size;
      else pages = (await fs.readdir(c.path)).filter(f => IMAGE_RE.test(f)).length;
    } catch (e) {
      // unreadable: shown without a size
    }
    const item = {
      path: rel(c.path),
      name: path.basename(c.path),
      kind: c.kind,
      size,
      pages,
      parsed: { volume: own.volume, volumeEnd: own.volumeEnd, chapter: own.chapter, chapterEnd: own.chapterEnd },
      as: 'volume',
      number: null
    };
    if (own.volume === null && own.chapter !== null && own.chapterEnd === null && c.kind === 'archive') {
      item.as = 'chapter';
      item.number = own.chapter;
    } else {
      let number = own.volume;
      if (number === null) {
        if (candidates.length === 1 && releaseInfo.volume !== null) number = releaseInfo.volume;
        else if (releaseInfo.volumes.length >= candidates.length) number = releaseInfo.volumes[i];
        else number = nextVolume;
      }
      while (used.has(number)) number++;
      used.add(number);
      nextVolume = number + 1;
      item.number = number;
    }
    items.push(item);
  }
  return { releaseName: releaseName || path.basename(rootPath), root, items, unsupported: found.unsupported.map(u => path.basename(u)) };
}

/**
 * Import a finished release into a bookmark: everything at its automatic
 * target, or only a selection ([{ path, as: 'volume'|'chapter'|'skip',
 * number }]) at the targets chosen. Only items the scan found can be
 * imported.
 * `onProgress({ done, total, current })` is called before each item and once
 * at the end, for progress displays.
 * @returns {Promise<{ volumes: Array<{ number, name, pages, id }>, chapters: number[], skipped: string[] }>}
 */
export async function importRelease(bookmark, rootPath, { releaseName = '', selection = null, onProgress = null } = {}) {
  const plan = await describeRelease(rootPath, { releaseName });
  const summary = { volumes: [], chapters: [], skipped: [] };
  for (const u of plan.unsupported) summary.skipped.push(`${u} (only .cbz/.zip archives and image folders can be imported)`);
  if (plan.items.length === 0) throw new Error('Nothing importable in this release (no .cbz/.zip archives or image folders)');

  let items;
  if (Array.isArray(selection)) {
    const byPath = new Map(plan.items.map(i => [i.path, i]));
    items = [];
    for (const s of selection) {
      const base = byPath.get(String(s?.path ?? ''));
      if (!base) {
        summary.skipped.push(`${s?.path || '?'}: not part of this download`);
        continue;
      }
      const as = s.as === 'chapter' ? 'chapter' : s.as === 'volume' ? 'volume' : 'skip';
      if (as === 'skip') continue;
      const number = Number(s.number);
      if (!Number.isFinite(number) || number < 0) {
        summary.skipped.push(`${base.name}: no ${as} number given`);
        continue;
      }
      items.push({ ...base, as, number });
    }
  } else {
    items = plan.items;
  }

  const seenVolumes = new Set();
  const report = (done, current) => {
    if (!onProgress) return;
    try { onProgress({ done, total: items.length, current }); } catch (e) { /* a display problem must not stop the import */ }
  };
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    report(i, item.name);
    const abs = path.resolve(plan.root, item.path);
    try {
      if (item.as === 'chapter') {
        if (item.kind !== 'archive') throw new Error('an image folder can only be imported as a volume');
        const r = await importAsChapter(bookmark, abs, item.number);
        summary.chapters.push(r.chapter);
        continue;
      }
      if (seenVolumes.has(item.number)) throw new Error(`volume ${item.number} was already imported from another file of this selection`);
      seenVolumes.add(item.number);
      const r = await importAsVolume(bookmark, abs, {
        number: item.number,
        name: volumeLabel(item.number),
        releaseName: releaseName || item.name
      });
      summary.volumes.push({ number: item.number, name: r.volume.name, pages: r.pageCount, id: r.volume.id });
    } catch (e) {
      summary.skipped.push(`${item.name}: ${e.message}`);
    }
  }
  report(items.length, null);
  return summary;
}

export default { scanRelease, describeRelease, importAsVolume, importAsChapter, importRelease, volumeFolderName };
