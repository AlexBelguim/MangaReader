import Database from 'better-sqlite3';

const dbPath = 'f:/git/pupeteer/manga.db';
console.log(`Checking data integrity for: ${dbPath}`);
const db = new Database(dbPath);

try {
    // 1. General Stats
    const totalChapters = db.prepare('SELECT COUNT(*) as count FROM chapters').get().count;
    console.log(`Total Chapters: ${totalChapters}`);

    if (totalChapters === 0) {
        console.log('Database is empty (of chapters).');
        process.exit(0);
    }

    // 2. Check for NULLs or Defaults in key columns
    const nullVersion = db.prepare('SELECT COUNT(*) as count FROM chapters WHERE version IS NULL').get().count;
    const zeroVersion = db.prepare('SELECT COUNT(*) as count FROM chapters WHERE version = 0').get().count;

    const nullTotal = db.prepare('SELECT COUNT(*) as count FROM chapters WHERE total_versions IS NULL').get().count;
    const zeroTotal = db.prepare('SELECT COUNT(*) as count FROM chapters WHERE total_versions = 0').get().count;

    console.log(`\n--- Null/Zero Checks ---`);
    console.log(`Versions NULL: ${nullVersion}`);
    console.log(`Versions Zero: ${zeroVersion}`);
    console.log(`Total Versions NULL: ${nullTotal}`);
    console.log(`Total Versions Zero: ${zeroTotal}`);

    // 3. Check Logical Consistency
    // version should not be greater than total_versions
    const invalidVersionCount = db.prepare('SELECT COUNT(*) as count FROM chapters WHERE version > total_versions').get().count;
    console.log(`\n--- Logical Checks ---`);
    console.log(`Rows where version > total_versions: ${invalidVersionCount}`);

    // 4. Check for 'is_old_version' usage
    const oldVersions = db.prepare('SELECT COUNT(*) as count FROM chapters WHERE is_old_version = 1').get().count;
    console.log(`Chapters marked as old versions: ${oldVersions}`);

    // 5. Sample some data
    console.log(`\n--- Sample Data (Limit 5) ---`);
    const samples = db.prepare(`
    SELECT id, number, title, version, total_versions, is_old_version 
    FROM chapters 
    LIMIT 5
  `).all();
    console.table(samples);

    // 6. Check duplicates/versions logic if any exist
    const multiVersionChapters = db.prepare(`
    SELECT bookmark_id, number, count(*) as count 
    FROM chapters 
    GROUP BY bookmark_id, number 
    HAVING count > 1
    LIMIT 5
  `).all();

    if (multiVersionChapters.length > 0) {
        console.log(`\n--- Found Chapters with Multiple Versions (Sample) ---`);
        console.table(multiVersionChapters);
    } else {
        console.log(`\nNo chapters found with multiple versions (duplicate bookmark_id + number entries).`);
    }

} catch (e) {
    console.error('Error during inspection:', e);
} finally {
    db.close();
}
