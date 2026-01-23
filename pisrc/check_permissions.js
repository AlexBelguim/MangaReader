
import fs from 'fs';
import path from 'path';
import { CONFIG } from './src/config.js';

console.log('--- Permission Check ---');
console.log(`Data Directory from config: ${CONFIG.dataDir}`);

function checkAccess(targetPath) {
    console.log(`\nChecking: ${targetPath}`);
    try {
        if (!fs.existsSync(targetPath)) {
            console.log('❌ Path does not exist.');
            // Try to create if it's a directory we expect to exist? 
            // For now just report.
            return;
        }

        const stats = fs.statSync(targetPath);
        console.log(`   Type: ${stats.isDirectory() ? 'Directory' : 'File'}`);
        console.log(`   Owner UID: ${stats.uid}, GID: ${stats.gid}`);
        console.log(`   Mode: ${stats.mode.toString(8)}`);

        try {
            fs.accessSync(targetPath, fs.constants.R_OK);
            console.log('   ✅ Read access: OK');
        } catch (e) {
            console.log('   ❌ Read access: DENIED');
        }

        try {
            fs.accessSync(targetPath, fs.constants.W_OK);
            console.log('   ✅ Write access: OK');
        } catch (e) {
            console.log('   ❌ Write access: DENIED');
        }

    } catch (error) {
        console.log(`   ❌ Error checking path: ${error.message}`);
    }
}

// 1. Check Data Directory
checkAccess(CONFIG.dataDir);

// 2. Check Database File
const dbPath = path.join(CONFIG.dataDir, 'manga.db');
checkAccess(dbPath);

// 3. Try to write a test file to Data Directory
const testFile = path.join(CONFIG.dataDir, 'perm_test.txt');
console.log(`\nAttempting to write test file: ${testFile}`);
try {
    fs.writeFileSync(testFile, 'test');
    console.log('   ✅ Write Test: SUCCESS (Created file)');
    fs.unlinkSync(testFile);
    console.log('   ✅ Delete Test: SUCCESS (Deleted file)');
} catch (error) {
    console.log(`   ❌ Write/Delete Test FAILED: ${error.message}`);
}
