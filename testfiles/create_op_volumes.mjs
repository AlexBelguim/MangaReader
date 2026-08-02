/**
 * One-off: create the remaining One Piece volumes (16+) in the library,
 * matching the user's existing pattern ("NNN - VIZ Title", official chapter
 * groupings from the One Piece fandom wiki), and set each volume's cover to
 * the first page of its first downloaded chapter.
 *
 *   node testfiles/create_op_volumes.mjs          # dry run, prints the plan
 *   node testfiles/create_op_volumes.mjs --apply  # writes to the DB
 *
 * Inputs: testfiles/op_volumes.json (wikitext: volume# -> US title),
 *         testfiles/op_volumes.html (rendered page: volume# -> chapters).
 * Regenerate them with:
 *   curl -A "Mozilla/5.0" "https://onepiece.fandom.com/api.php?action=parse&page=Chapters_and_Volumes/Volumes&format=json&prop=wikitext" -o testfiles/op_volumes.json
 *   curl -A "Mozilla/5.0" "https://onepiece.fandom.com/api.php?action=parse&page=Chapters_and_Volumes/Volumes&format=json&prop=text" -o testfiles/op_volumes_html.json
 *   node -e "const d=require('./testfiles/op_volumes_html.json');require('fs').writeFileSync('testfiles/op_volumes.html',d.parse.text['*'])"
 */

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { initDatabase, getDb } from '../src/db/connection.js';
import { bookmarkDb } from '../src/db/bookmarks.js';
import { downloader } from '../src/downloader.js';
import { CONFIG } from '../src/config.js';

const APPLY = process.argv.includes('--apply');
const BOOKMARK_ID = 'miqp49oabm3nd7cm5ok';
const FIRST_NEW_VOLUME = 16;

// ---------- 1. wikitext: volume number -> US (VIZ) title ----------
const wt = JSON.parse(fs.readFileSync(new URL('./op_volumes.json', import.meta.url), 'utf8'))
    .parse.wikitext['*'];
const titles = new Map();
{
    const re = /\{\{Volume\d*\s*\n([\s\S]*?)\n\}\}/g;
    let m;
    while ((m = re.exec(wt))) {
        const num = m[1].match(/\|#=\s*(\d+)/);
        const us = m[1].match(/\|US Title=\s*(.+)/);
        if (num && us) titles.set(Number(num[1]), us[1].trim());
    }
}

// ---------- 2. rendered HTML: volume number -> ordered chapter numbers ----------
const html = fs.readFileSync(new URL('./op_volumes.html', import.meta.url), 'utf8');
const volumeChapters = new Map();
{
    const tables = html.split(/<table id="Volume(?:&#95;|_)/).slice(1);
    for (const block of tables) {
        const num = Number(block.slice(0, block.indexOf('"')));
        if (!num) continue;
        const end = block.indexOf('</table>');
        const body = end === -1 ? block : block.slice(0, end);
        const chapters = [];
        const seen = new Set();
        const re = /href="\/wiki\/Chapter_(\d+(?:\.\d+)?)"/g;
        let m;
        while ((m = re.exec(body))) {
            const n = Number(m[1]);
            if (!seen.has(n)) { seen.add(n); chapters.push(n); }
        }
        volumeChapters.set(num, chapters);
    }
}

console.log(`parsed ${titles.size} titles, ${volumeChapters.size} volume chapter lists`);

// ---------- 3. plan against the library ----------
initDatabase();
const db = getDb();
const bookmark = await bookmarkDb.getById(BOOKMARK_ID);
if (!bookmark) throw new Error('One Piece bookmark not found');

const inLibrary = new Set(
    db.prepare('SELECT DISTINCT number FROM chapters WHERE bookmark_id = ?').all(BOOKMARK_ID).map(r => r.number)
);
const existingNames = new Set(
    db.prepare('SELECT name FROM volumes WHERE bookmark_id = ?').all(BOOKMARK_ID).map(r => r.name)
);

const plan = [];
for (const [num, chapters] of [...volumeChapters.entries()].sort((a, b) => a[0] - b[0])) {
    if (num < FIRST_NEW_VOLUME) continue;
    const title = titles.get(num);
    if (!title) { console.warn(`vol ${num}: no US title parsed, skipping`); continue; }
    const name = `${String(num).padStart(3, '0')} - ${title}`;
    if (existingNames.has(name)) { console.log(`vol ${num}: already exists, skipping`); continue; }
    const present = chapters.filter(c => inLibrary.has(c));
    if (present.length === 0) { console.log(`vol ${num}: no chapters in library yet, stopping here`); break; }
    plan.push({ num, name, chapters: present, wikiCount: chapters.length });
}

console.log(`\nplan: ${plan.length} volumes to create`);
for (const p of plan) {
    const missing = p.wikiCount - p.chapters.length;
    console.log(`  ${p.name}: ${p.chapters.length} chapters (${p.chapters[0]}–${p.chapters[p.chapters.length - 1]})${missing ? ` [${missing} wiki chapter(s) not in library]` : ''}`);
}

if (!APPLY) {
    console.log('\ndry run — pass --apply to write');
    process.exit(0);
}

// ---------- 4. create volumes + covers ----------
const coversDir = path.join(CONFIG.dataDir, 'covers', 'volumes');
await fs.promises.mkdir(coversDir, { recursive: true });
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

let coversSet = 0, coversSkipped = 0;
for (const p of plan) {
    const volume = bookmarkDb.createVolume(BOOKMARK_ID, p.name, p.chapters);

    // Keep chapters.in_volume_id in sync (same as migration 002 did)
    const sync = db.prepare('UPDATE chapters SET in_volume_id = ? WHERE bookmark_id = ? AND number = ?');
    for (const num of p.chapters) sync.run(volume.id, BOOKMARK_ID, num);

    // Cover: first page of the volume's first downloaded chapter
    let coverMsg = 'no downloaded version';
    const versions = await downloader.getExistingVersions(bookmark.title, p.chapters[0], bookmark.alias);
    const valid = versions.find(v => v.imageCount > 0);
    if (valid) {
        const images = (await fs.promises.readdir(valid.path))
            .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
            .sort(collator.compare);
        if (images.length > 0) {
            const dst = `volume_${volume.id}_${Date.now()}.jpg`;
            await sharp(path.join(valid.path, images[0]))
                .resize(600)
                .jpeg({ quality: 90 })
                .toFile(path.join(coversDir, dst));
            bookmarkDb.updateVolume(volume.id, { cover: `/covers/volumes/${dst}` });
            coversSet++;
            coverMsg = 'cover set';
        }
    }
    if (coverMsg !== 'cover set') coversSkipped++;
    console.log(`✓ ${p.name} (${p.chapters.length} chapters, ${coverMsg})`);
}

console.log(`\ndone: ${plan.length} volumes created, ${coversSet} covers set, ${coversSkipped} without cover`);
