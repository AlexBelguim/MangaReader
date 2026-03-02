import Database from 'better-sqlite3';

const params = process.argv.slice(2);
const dbPath = params[0] || 'f:/git/pupeteer/manga.db';

console.log(`Inspecting database: ${dbPath}`);
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

for (const table of tables) {
    if (table.name === 'sqlite_sequence') continue;
    console.log(`\nTable: ${table.name}`);
    const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
    for (const col of columns) {
        console.log(`  - ${col.name} (${col.type})`);
    }
}

db.close();
