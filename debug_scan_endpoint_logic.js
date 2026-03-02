import { bookmarkDb } from './src/database.js';
import { downloader } from './src/downloader.js';
import path from 'path';

console.log('--- Debugging Scan Local Endpoint Logic ---');

const bookmarkId = 'mkrg10ir44fnray51sb';

async function test() {
    try {
        const bookmark = await bookmarkDb.getById(bookmarkId);
        if (!bookmark) {
            console.error('Bookmark not found!');
            return;
        }

        console.log(`Bookmark: "${bookmark.title}"`);
        console.log(`Alias: "${bookmark.alias}"`);
        console.log(`Local Cover: "${bookmark.local_cover}"`);

        // --- Replicate Server Logic ---
        let scanTitle = bookmark.title;
        let scanAlias = bookmark.alias;

        if (bookmark.local_cover) {
            try {
                const decodedPath = decodeURIComponent(bookmark.local_cover);
                console.log(`Decoded Path: "${decodedPath}"`);

                const normalized = decodedPath.replace(/\\/g, '/');
                console.log(`Normalized Path: "${normalized}"`);

                if (normalized.includes('/covers/')) {
                    const parts = normalized.split('/covers/');
                    const parentPath = parts[0];
                    const folderName = parentPath.split('/').filter(p => p).pop();

                    if (folderName) {
                        console.log(`[Scan] Derived folder from local_cover: "${folderName}"`);
                        scanTitle = folderName;
                        scanAlias = null;
                    } else {
                        console.log('[Scan] Could not extract folder name from parent path.');
                    }
                } else {
                    console.log('[Scan] Path does not contain "/covers/".');
                }
            } catch (e) {
                console.warn(`[Scan] Error parsing path: ${e.message}`);
            }
        }

        console.log(`\nCalling scanLocalChapters("${scanTitle}", "${scanAlias}")...`);

        // Call downloader directly
        const localChapters = await downloader.scanLocalChapters(scanTitle, scanAlias);
        console.log(`Found ${localChapters.length} chapters.`);

        // Also verify folder existence manually again to be sure
        const fs = await import('fs-extra');
        const CONFIG = (await import('./src/config.js')).CONFIG;
        const targetDir = path.join(CONFIG.downloadsDir, downloader.sanitizeFileName(scanTitle));
        console.log(`Target Dir (downloader would use): "${targetDir}"`);
        console.log(`Exists? ${await fs.pathExists(targetDir)}`);

    } catch (e) {
        console.error('CRITICAL ERROR:', e);
    }
}

test();
