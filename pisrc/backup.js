
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './src/config.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runBackup() {
    console.log('📦 Starting database backup...');

    const dbFile = 'manga.db';
    const sourcePath = path.join(CONFIG.dataDir, dbFile);

    // Determine backup destination on SMB
    // Assuming downloadsDir is like /mnt/smb/Apps/manga/media/downloads
    // We want /mnt/smb/Apps/manga/backups
    const smbDownloadsDir = CONFIG.downloadsDir;
    // Go up two levels from downloads to get to 'manga' root, then into 'backups'
    // This is safer than hardcoding /mnt/smb in case it changes
    const smbRootDir = path.resolve(smbDownloadsDir, '../../');
    const backupDir = path.join(smbRootDir, 'backups');

    try {
        // 1. Check if source DB exists
        if (!await fs.pathExists(sourcePath)) {
            console.error(`❌ Source database not found at: ${sourcePath}`);
            process.exit(1);
        }

        // 2. Ensure backup directory exists on SMB
        await fs.ensureDir(backupDir);

        // 3. Generate timestamped filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `manga.db.${timestamp}.bak`;
        const destPath = path.join(backupDir, backupName);

        // 4. Copy the file
        console.log(`   Source: ${sourcePath}`);
        console.log(`   Dest:   ${destPath}`);

        await fs.copy(sourcePath, destPath);

        console.log('✅ Backup completed successfully!');

        // 5. Cleanup old backups (optional: keep last 30)
        await cleanupOldBackups(backupDir);

    } catch (error) {
        console.error(`❌ Backup failed: ${error.message}`);
        process.exit(1);
    }
}

async function cleanupOldBackups(dir) {
    try {
        const files = await fs.readdir(dir);
        const backups = files.filter(f => f.startsWith('manga.db.'));

        // Sort by name (which acts as date sort due to ISO timestamp)
        backups.sort();

        // Keep last 50
        const keepCount = 50;
        if (backups.length > keepCount) {
            const toDelete = backups.slice(0, backups.length - keepCount);
            console.log(`Cleaning up ${toDelete.length} old backups...`);

            for (const file of toDelete) {
                await fs.remove(path.join(dir, file));
            }
        }
    } catch (error) {
        console.warn('Warning: Failed to cleanup old backups:', error.message);
    }
}

runBackup();
