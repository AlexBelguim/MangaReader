/**
 * Database migrations runner
 * Manages schema changes and tracks applied migrations
 */

import { getDb } from '../database.js';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run all pending migrations
 */
export async function runMigrations() {
    const db = getDb();

    // Create migrations tracking table
    db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

    // Get applied migrations
    const applied = new Set(
        db.prepare('SELECT name FROM migrations').all().map(r => r.name)
    );

    console.log('📦 Checking database migrations...');

    // Run in-code migrations (safer for ALTER TABLE)
    await runInCodeMigrations(db, applied);

    console.log('📦 Migrations complete');
}

/**
 * In-code migrations for ALTER TABLE statements
 * (SQLite doesn't support all ALTER TABLE operations, so we handle carefully)
 */
async function runInCodeMigrations(db, applied) {
    const migrations = [
        {
            name: '001_action_history',
            run: () => {
                db.exec(`
          CREATE TABLE IF NOT EXISTS action_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action_type TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            bookmark_id TEXT,
            before_state TEXT,
            after_state TEXT,
            description TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            undone_at TEXT,
            FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
          );
          
          CREATE INDEX IF NOT EXISTS idx_action_history_bookmark ON action_history(bookmark_id);
          CREATE INDEX IF NOT EXISTS idx_action_history_type ON action_history(action_type);
          CREATE INDEX IF NOT EXISTS idx_action_history_created ON action_history(created_at DESC);
        `);
            }
        },
        {
            name: '002_chapter_protection',
            run: () => {
                // Add locked column to chapters
                try {
                    db.prepare('ALTER TABLE chapters ADD COLUMN locked INTEGER DEFAULT 0').run();
                    console.log('  ✓ Added locked column to chapters');
                } catch (e) {
                    // Column likely exists
                }

                // Add in_volume_id column to chapters
                try {
                    db.prepare('ALTER TABLE chapters ADD COLUMN in_volume_id TEXT').run();
                    console.log('  ✓ Added in_volume_id column to chapters');
                } catch (e) {
                    // Column likely exists
                }

                // Create index
                db.exec('CREATE INDEX IF NOT EXISTS idx_chapters_volume ON chapters(in_volume_id)');

                // Sync volume associations from volume_chapters table
                const volumes = db.prepare('SELECT id, bookmark_id FROM volumes').all();
                for (const volume of volumes) {
                    const chapters = db.prepare(
                        'SELECT chapter_number FROM volume_chapters WHERE volume_id = ?'
                    ).all(volume.id);

                    for (const ch of chapters) {
                        db.prepare(`
              UPDATE chapters 
              SET in_volume_id = ? 
              WHERE bookmark_id = ? AND number = ?
            `).run(volume.id, volume.bookmark_id, ch.chapter_number);
                    }
                }
                console.log('  ✓ Synced volume associations');
            }
        },
        {
            name: '003_pin_auth',
            run: () => {
                // Add PIN column to users table for additional verification
                try {
                    db.prepare('ALTER TABLE users ADD COLUMN pin_hash TEXT').run();
                    console.log('  ✓ Added pin_hash column to users');
                } catch (e) {
                    // Column likely exists
                }

                // Add trusted_ips table for PIN-based device trust
                db.exec(`
          CREATE TABLE IF NOT EXISTS trusted_devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_hash TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            trusted_at TEXT NOT NULL DEFAULT (datetime('now')),
            last_used TEXT,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, device_hash)
          );
        `);
            }
        }
    ];

    for (const migration of migrations) {
        if (!applied.has(migration.name)) {
            console.log(`  Running migration: ${migration.name}`);
            try {
                migration.run();
                db.prepare('INSERT INTO migrations (name) VALUES (?)').run(migration.name);
                console.log(`  ✓ ${migration.name} applied`);
            } catch (error) {
                console.error(`  ✗ ${migration.name} failed:`, error.message);
                throw error;
            }
        }
    }
}

export default { runMigrations };
