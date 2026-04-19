import Database from 'better-sqlite3';

const dbPath = 'f:/git/pupeteer/manga.db';
const db = new Database(dbPath);

const searchQuery = '%Where Men Are Scarce%';
console.log(`Searching for bookmark matching: ${searchQuery}`);

const bookmark = db.prepare('SELECT * FROM bookmarks WHERE title LIKE ?').get(searchQuery);

if (bookmark) {
    console.log('--- Bookmark Found ---');
    console.table([bookmark]);
    console.log('\n--- Chapters ---');
    const chapters = db.prepare('SELECT * FROM chapters WHERE bookmark_id = ?').all(bookmark.id);
    console.table(chapters);
} else {
    console.log('No bookmark found.');
}

db.close();
