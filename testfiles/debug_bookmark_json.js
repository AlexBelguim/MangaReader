import Database from 'better-sqlite3';

const dbPath = 'f:/git/pupeteer/manga.db';
const db = new Database(dbPath);

const searchQuery = '%Where Men Are Scarce%';
const bookmark = db.prepare('SELECT id, title, alias, cover, local_cover, total_chapters FROM bookmarks WHERE title LIKE ?').get(searchQuery);

if (bookmark) {
    console.log(JSON.stringify(bookmark, null, 2));
} else {
    console.log('No bookmark found.');
}

db.close();
