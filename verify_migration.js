import { getDb, closeDatabase } from './src/database.js';

console.log('Running database migration check...');
try {
    const db = getDb();
    console.log('Database initialized successfully.');

    // Verify columns exist
    const columns = db.prepare("PRAGMA table_info(chapters)").all();
    const columnNames = columns.map(c => c.name);
    console.log('Chapters table columns:', columnNames.join(', '));

    const required = ['version', 'total_versions', 'is_old_version'];
    const missing = required.filter(c => !columnNames.includes(c));

    if (missing.length === 0) {
        console.log('✓ All usage columns present.');
    } else {
        console.error('✗ Missing columns:', missing.join(', '));
    }

} catch (error) {
    console.error('Migration check failed:', error);
} finally {
    closeDatabase();
}
