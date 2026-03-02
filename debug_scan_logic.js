import { downloader } from './src/downloader.js';
import { CONFIG } from './src/config.js';

console.log('--- Debugging Scan Local Logic ---');
console.log('Downloads Dir:', CONFIG.downloadsDir);

const title = "Chained Soldier";
const alias = null;

async function test() {
    console.log(`Scanning: "${title}" (alias: ${alias})`);

    // 1. Check Folder Path
    const mangaDir = downloader.getMangaDir(title, alias);
    console.log('Target Path:', mangaDir);

    try {
        const chapters = await downloader.scanLocalChapters(title, alias);
        console.log(`Found ${chapters.length} chapters.`);
        if (chapters.length > 0) {
            console.log('Sample (first 3):');
            console.table(chapters.slice(0, 3));
        } else {
            console.log('Why 0? Checking existence...');
            const fs = await import('fs-extra');
            if (await fs.pathExists(mangaDir)) {
                console.log('- Folder EXISTS.');
                const files = await fs.readdir(mangaDir);
                console.log(`- Folder contains ${files.length} items.`);
                console.log('- First 5 items:', files.slice(0, 5));
            } else {
                console.log('- Folder DOES NOT EXIST.');
            }
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
