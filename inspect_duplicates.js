import Database from 'better-sqlite3';

const dbPath = 'f:/git/pupeteer/manga.db';
const db = new Database(dbPath);

const bookmarkId = 'mipapxpabxbo2zlz50m';
const chapterNum = 1;

console.log(`Inspecting duplicates for Bookmark: ${bookmarkId}, Chapter: ${chapterNum}`);

const rows = db.prepare(`
    SELECT id, number, version, total_versions, is_old_version, url, uploaded_at 
    FROM chapters 
    WHERE bookmark_id = ? AND number = ?
`).all(bookmarkId, chapterNum);

console.log(JSON.stringify(rows, null, 2));

db.close();
