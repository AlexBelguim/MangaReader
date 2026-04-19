import Database from 'better-sqlite3';

const dbPath = 'f:/git/pupeteer/manga.db';
const db = new Database(dbPath);

console.log('--- Inspecting Series Table ---');
const series = db.prepare('SELECT * FROM series').all();

if (series.length === 0) {
    console.log('No series found.');
} else {
    console.table(series);

    // Check the first series in detail if it has a cover_entry_id
    const s = series[0];
    if (s.cover_entry_id) {
        console.log(`\n--- Inspecting Cover Entry (ID: ${s.cover_entry_id}) for Series "${s.title}" ---`);
        // Note: 'series_entries' table links series to bookmarks
        const entry = db.prepare('SELECT * FROM series_entries WHERE id = ?').get(s.cover_entry_id);
        if (entry) {
            console.table([entry]);
            console.log('\n--- Linked Bookmark ---');
            const bookmark = db.prepare('SELECT id, title, cover, local_cover FROM bookmarks WHERE id = ?').get(entry.bookmark_id);
            console.table([bookmark]);
        } else {
            console.log('Cover entry not found in series_entries table.');
        }
    } else {
        console.log('Series has no explicit cover_entry_id. Checking first entry...');
        const firstEntry = db.prepare('SELECT * FROM series_entries WHERE series_id = ? ORDER BY sort_order ASC LIMIT 1').get(s.id);
        if (firstEntry) {
            console.log(`First Entry ID: ${firstEntry.id}`);
            const bookmark = db.prepare('SELECT id, title, cover, local_cover FROM bookmarks WHERE id = ?').get(firstEntry.bookmark_id);
            console.table([bookmark]);
        } else {
            console.log('Series is empty.');
        }
    }
}

db.close();
