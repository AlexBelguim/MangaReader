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
    await fs.writeFile(path.join(tempDir, `${String(index).padStart(3, '0')}${ext}`), await readItem(item));
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
  const result = await downloader.extractCbz(archivePath, bookmark.title, chapterNumber, bookmark.alias, { forceReExtract: true, deleteAfter: false });
  const url = `local://${bookmark.id}/chapter-${chapterNumber}`;
  await bookmarkDb.update(bookmark.id, {
    chapters: [...(bookmark.chapters || []), { number: chapterNumber, title: `Chapter ${chapterNumber}`, url, removedFromRemote: true }]
  }, bookmark.userId ?? undefined);
  bookmarkDb.markChapterDownloaded(bookmark.id, chapterNumber, url);
  return { chapter: chapterNumber, extracted: result.extracted };
}

/**
 * Import everything a finished release contains into a bookmark.
 * Volume numbers come from each file's own name, then from the release
 * name (a range "v01-v03" numbers the files in order), then from position.
 * @returns {Promise<{ volumes: Array<{ number, name, pages }>, chapters: number[], skipped: string[] }>}
 */
export async function importRelease(bookmark, rootPath, { releaseName = '' } = {}) {
  const found = await scanRelease(rootPath);
  const summary = { volumes: [], chapters: [], skipped: [] };
  for (const u of found.unsupported) summary.skipped.push(`${path.basename(u)} (only .cbz/.zip archives and image folders can be imported)`);

  const releaseInfo = parseReleaseName(releaseName || path.basename(rootPath));
  const items = [
    ...found.archives.map(p => ({ path: p, kind: 'archive' })),
    // A folder of images inside a folder that also holds archives is usually
    // an unpacked copy; only import image folders when there are no archives.
    ...(found.archives.length === 0 ? found.imageDirs.map(p => ({ path: p, kind: 'dir' })) : [])
  ];
  if (items.length === 0) throw new Error('Nothing importable in this release (no .cbz/.zip archives or image folders)');

  const used = new Set();
  let nextVolume = releaseInfo.volumes[0] || 1;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const own = parseReleaseName(path.basename(item.path));
    try {
      if (own.volume === null && own.chapter !== null && own.chapterEnd === null && item.kind === 'archive') {
        // Single chapter archive: import as that chapter
        const r = await importAsChapter(bookmark, item.path, own.chapter);
        summary.chapters.push(r.chapter);
        continue;
      }
      let number = own.volume;
      if (number === null) {
        // From the release name: a range numbers the files in order
        if (items.length === 1 && releaseInfo.volume !== null) number = releaseInfo.volume;
        else if (releaseInfo.volumes.length >= items.length) number = releaseInfo.volumes[i];
        else number = nextVolume;
      }
      while (used.has(number)) number++;
      used.add(number);
      nextVolume = number + 1;

      const r = await importAsVolume(bookmark, item.path, {
        number,
        name: volumeLabel(number),
        releaseName: releaseName || path.basename(item.path)
      });
      summary.volumes.push({ number, name: r.volume.name, pages: r.pageCount, id: r.volume.id });
    } catch (e) {
      summary.skipped.push(`${path.basename(item.path)}: ${e.message}`);
    }
  }
  return summary;
}

export default { scanRelease, importAsVolume, importAsChapter, importRelease, volumeFolderName };
