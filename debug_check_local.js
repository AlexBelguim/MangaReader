import { CONFIG } from './src/config.js';
import path from 'path';
import fs from 'fs-extra';

// 1. Mock the sanitize logic from Downloader
function sanitizeFileName(name) {
    if (!name) return '';
    return name
        .replace(/[<>:"/\\|?*]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 200);
}

// 2. Setup test data
const downloadsDir = CONFIG.downloadsDir;
console.log(`Configured Downloads Dir: ${downloadsDir}`);

// 3. User complained about ALL manga. let's pick 3 random ones from DB to test.
import Database from 'better-sqlite3';
const db = new Database('f:/git/pupeteer/manga.db');
const bookmarks = db.prepare('SELECT title, alias FROM bookmarks LIMIT 5').all();

console.log(`\n--- Testing ${bookmarks.length} Bookmarks ---`);

for (const b of bookmarks) {
    const folderName = sanitizeFileName(b.alias || b.title);
    const expectedPath = path.join(downloadsDir, folderName);
    const exists = fs.existsSync(expectedPath);

    console.log(`\nManga: "${b.title}"`);
    console.log(`   Alias: "${b.alias || 'N/A'}"`);
    console.log(`   Sanitized Name: "${folderName}"`);
    console.log(`   Expected Path:  "${expectedPath}"`);
    console.log(`   EXISTS: ${exists ? 'YES' : 'NO'}`);

    if (!exists) {
        // Try to list the downloads dir to see if there's a close match
        try {
            const files = fs.readdirSync(downloadsDir);
            const match = files.find(f => f.toLowerCase() === folderName.toLowerCase());
            if (match) {
                console.log(`   ! Found similar folder (Case Mismatch?): "${match}"`);
            }
        } catch (e) { }
    }
}

db.close();
