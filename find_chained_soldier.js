import Database from 'better-sqlite3';

const dbPath = 'f:/git/pupeteer/manga.db';
const db = new Database(dbPath);

console.log('Searching for "Chained Soldier"...');
const bookmark = db.prepare('SELECT id, title, alias FROM bookmarks WHERE title LIKE ?').get('%Chained Soldier%');

if (bookmark) {
    console.log(JSON.stringify(bookmark, null, 2));
} else {
    console.log('Not found.');
}

db.close();
