import Database from 'better-sqlite3';
import fs from 'fs-extra';
import path from 'path';

const dbPath = 'f:/git/pupeteer/manga.db';
const downloadsDir = 'Z:/Apps/manga/media/downloads';

// Original (bad) and new (good) names
const badName = 'In a World Where Men Are Scarce, Sperm Is a Precious Resource';
const goodName = 'In a World Where Men Are Scarce, Sperm Is a Precious Resource';

const oldPath = path.join(downloadsDir, badName);
const newPath = path.join(downloadsDir, goodName);

console.log('--- Fixing Bookmark and Folder ---');

// 1. Rename Folder
if (fs.existsSync(oldPath)) {
    console.log(`Renaming folder:\n  FROM: ${oldPath}\n  TO:   ${newPath}`);
    try {
        fs.moveSync(oldPath, newPath, { overwrite: true });
        console.log('✓ Folder renamed.');
    } catch (e) {
        console.error('✗ Failed to rename folder:', e.message);
    }
} else {
    console.log('! Old folder not found (maybe already renamed?).');
}

// 2. Update Database
const db = new Database(dbPath);
const coverPath = `${goodName}/covers/cover_from_chapter.jpg`;

try {
    const changes = db.prepare(`
        UPDATE bookmarks 
        SET title = ?, 
            local_cover = ?
        WHERE title LIKE ?
    `).run(goodName, coverPath, `%Where Men Are Scarce%`);

    console.log(`Database Changes: ${changes.changes} rows updated.`);
    if (changes.changes > 0) {
        console.log(`✓ Database title set to: "${goodName}"`);
        console.log(`✓ Local cover set to:  "${coverPath}"`);
    } else {
        console.log('! No bookmark found to update.');
    }

} catch (e) {
    console.error('Database update error:', e);
} finally {
    db.close();
}
