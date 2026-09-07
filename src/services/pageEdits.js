/**
 * Page edits on a folder of numbered page images: rotate, swap, cut a
 * spread in two, delete, renumber. Used by the volume-release routes and
 * by the volume importer. (The chapter page routes in routes/bookmarks.js
 * predate this module and keep their own copies.)
 */

import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { CONFIG } from '../config.js';

export const IMAGE_RE = /\.(jpe?g|png|gif|webp|avif)$/i;
// Wider than this (width / height) counts as a double-page spread
export const SPREAD_ASPECT = 1.2;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/** A page name as sent by a client: a bare image file name, nothing else. */
export function safePageName(filename) {
  const name = String(filename || '');
  if (!name || name !== path.basename(name) || name.startsWith('.') || !IMAGE_RE.test(name)) {
    throw new Error('Invalid page name');
  }
  return name;
}

/** Page files of a folder in reading order. */
export async function listPages(dir) {
  const files = (await fs.readdir(dir)).filter(f => IMAGE_RE.test(f) && !f.startsWith('.'));
  return files.sort(collator.compare);
}

/**
 * Cut a double-page spread in two, in reading order (right half first for
 * right-to-left, the way the scraper does it). Returns null when the image
 * is not wide enough, unless forced.
 * @returns {Promise<{ first: Buffer, second: Buffer } | null>}
 */
export async function splitSpread(buffer, { force = false } = {}) {
  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) throw new Error('Could not read the image size');
  if (!force && meta.width / meta.height <= SPREAD_ASPECT) return null;
  const half = Math.floor(meta.width / 2);
  const left = { left: 0, top: 0, width: half, height: meta.height };
  const right = { left: half, top: 0, width: meta.width - half, height: meta.height };
  const rtl = CONFIG.readingDirection === 'rtl';
  const first = await sharp(buffer).extract(rtl ? right : left).toBuffer();
  const second = await sharp(buffer).extract(rtl ? left : right).toBuffer();
  return { first, second };
}

async function pagePath(dir, filename) {
  const file = path.join(dir, safePageName(filename));
  if (!await fs.pathExists(file)) throw new Error('Page not found');
  return file;
}

export async function rotatePage(dir, filename, degrees = 90) {
  const file = await pagePath(dir, filename);
  const buffer = await fs.readFile(file); // a buffer avoids file locks on Windows
  await sharp(buffer).rotate(degrees).toFile(file + '.tmp');
  await fs.move(file + '.tmp', file, { overwrite: true });
}

export async function swapPages(dir, filenameA, filenameB) {
  const a = await pagePath(dir, filenameA);
  const b = await pagePath(dir, filenameB);
  const temp = path.join(dir, '.swap_temp');
  await fs.move(a, temp, { overwrite: true });
  await fs.move(b, a);
  await fs.move(temp, b);
}

/** Cut a page in two (always, the reader's choice) and renumber the folder. */
export async function splitPage(dir, filename) {
  const file = await pagePath(dir, filename);
  const ext = path.extname(file);
  const base = path.basename(file, ext);
  const halves = await splitSpread(await fs.readFile(file), { force: true });
  await fs.writeFile(path.join(dir, `${base}_1${ext}`), halves.first);
  await fs.writeFile(path.join(dir, `${base}_2${ext}`), halves.second);
  await fs.remove(file);
  return renumberPages(dir);
}

export async function deletePage(dir, filename) {
  await fs.remove(await pagePath(dir, filename));
}

/** Rename every page to 001.ext, 002.ext, ... in reading order. */
export async function renumberPages(dir) {
  const files = await listPages(dir);
  const stamp = Date.now();
  const temps = files.map((f, i) => ({ tmp: `.renumber_${stamp}_${i}${path.extname(f).toLowerCase()}`, from: f }));
  for (const t of temps) await fs.move(path.join(dir, t.from), path.join(dir, t.tmp), { overwrite: true });
  const names = [];
  for (let i = 0; i < temps.length; i++) {
    const name = `${String(i + 1).padStart(3, '0')}${path.extname(temps[i].tmp)}`;
    await fs.move(path.join(dir, temps[i].tmp), path.join(dir, name), { overwrite: true });
    names.push(name);
  }
  return names;
}

export default { safePageName, listPages, splitSpread, rotatePage, swapPages, splitPage, deletePage, renumberPages, IMAGE_RE, SPREAD_ASPECT };
