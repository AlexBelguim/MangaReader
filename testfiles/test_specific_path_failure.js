import path from 'path';
import fs from 'fs';

console.log('--- Testing Specific Path Failure ---');

const dbPath = "/mnt/smb/Apps/manga/media/downloads/Shounen ga Otona ni Natta Natsu/covers/cover_from_chapter.jpg";
const downloadsDir = "Z:\\Apps\\manga\\media\\downloads";

console.log(`DB Path: ${dbPath}`);
console.log(`Downloads Dir: ${downloadsDir}`);

try {
    const decodedPath = decodeURIComponent(dbPath);
    const normalized = decodedPath.replace(/\\/g, '/');

    console.log(`Normalized: ${normalized}`);

    if (normalized.includes('/covers/')) {
        const parts = normalized.split('/covers/');
        const parentPath = parts[0];
        console.log(`Parent Path: ${parentPath}`);

        const folderName = parentPath.split('/').filter(p => p).pop();
        console.log(`Folder Name: "${folderName}"`);

        if (folderName) {
            const target = path.join(downloadsDir, folderName);
            console.log(`Target Full Path: ${target}`);
        } else {
            console.log('Failed to extract folder name');
        }
    } else {
        console.log('No /covers/ found');
    }
} catch (e) {
    console.error('CRASHED!');
    console.error(e);
}
