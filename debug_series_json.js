import Database from 'better-sqlite3';

const dbPath = 'f:/git/pupeteer/manga.db';
const db = new Database(dbPath);

console.log('--- Series Debug (JSON) ---');
const series = db.prepare('SELECT * FROM series').all();

if (series.length > 0) {
    console.log(`Found ${series.length} series.`);
    const firstSeries = series[0];
    console.log('Sample Series:', JSON.stringify(firstSeries, null, 2));

    const entries = db.prepare(`
        SELECT se.*, b.title as bookmark_title, b.cover, b.local_cover 
        FROM series_entries se 
        JOIN bookmarks b ON se.bookmark_id = b.id 
        WHERE se.series_id = ?
    `).all(firstSeries.id);

    console.log(`Entries for series "${firstSeries.title}":`);
    console.log(JSON.stringify(entries, null, 2));
} else {
    console.log('No series found.');
}

db.close();
