import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs-extra';
import { CONFIG } from '../config.js';

const DB_PATH = path.join(CONFIG.dataDir, 'manga.db');

let db = null;

// Initialize database with schema
export function initDatabase() {
    fs.ensureDirSync(CONFIG.dataDir);

    db = new Database(DB_PATH);
    db.pragma('journal_mode = DELETE'); // Better compatibility with network storage
    db.pragma('foreign_keys = ON');

    // Create tables
    db.exec(`
    -- Bookmarks (manga) table
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      url TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      alias TEXT,
      website TEXT,
      source TEXT DEFAULT 'remote',
      cover TEXT,
      local_cover TEXT,
      description TEXT,
      total_chapters INTEGER DEFAULT 0,
      unique_chapters INTEGER DEFAULT 0,
      last_checked TEXT,
      last_read_chapter REAL DEFAULT 0,
      last_read_at TEXT,
      preferred_release_group TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    -- Bookmark-Category junction table
    CREATE TABLE IF NOT EXISTS bookmark_categories (
      bookmark_id TEXT NOT NULL,
      category_id INTEGER NOT NULL,
      PRIMARY KEY (bookmark_id, category_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    );

    -- Chapters table
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookmark_id TEXT NOT NULL,
      number REAL NOT NULL,
      title TEXT,
      url TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      total_versions INTEGER DEFAULT 1,
      original_number REAL,
      removed_from_remote INTEGER DEFAULT 0,
      is_old_version INTEGER DEFAULT 0,
      url_changed INTEGER DEFAULT 0,
      release_group TEXT,
      uploaded_at TEXT,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      UNIQUE(bookmark_id, url)
    );
    CREATE INDEX IF NOT EXISTS idx_chapters_bookmark ON chapters(bookmark_id);
    CREATE INDEX IF NOT EXISTS idx_chapters_number ON chapters(bookmark_id, number);

    -- Downloaded chapters tracking
    CREATE TABLE IF NOT EXISTS downloaded_chapters (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Downloaded versions (which URL was downloaded)
    CREATE TABLE IF NOT EXISTS downloaded_versions (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      url TEXT NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number, url),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Deleted/hidden chapter URLs
    CREATE TABLE IF NOT EXISTS deleted_chapter_urls (
      bookmark_id TEXT NOT NULL,
      url TEXT NOT NULL,
      PRIMARY KEY (bookmark_id, url),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Read chapters
    CREATE TABLE IF NOT EXISTS read_chapters (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Reading progress per chapter
    CREATE TABLE IF NOT EXISTS reading_progress (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      page INTEGER NOT NULL,
      total_pages INTEGER NOT NULL,
      last_read TEXT NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- New duplicates tracking
    CREATE TABLE IF NOT EXISTS new_duplicates (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Updated chapters tracking
    CREATE TABLE IF NOT EXISTS updated_chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      old_url TEXT,
      new_urls TEXT, -- JSON array
      type TEXT,
      detected_at TEXT,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      UNIQUE(bookmark_id, chapter_number)
    );

    -- Duplicate chapters info
    CREATE TABLE IF NOT EXISTS duplicate_chapters (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      count INTEGER DEFAULT 2,
      PRIMARY KEY (bookmark_id, chapter_number),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Excluded chapters (permanently hidden, not shown in list, not downloaded)
    CREATE TABLE IF NOT EXISTS excluded_chapters (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      excluded_at TEXT NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Trophy pages
    CREATE TABLE IF NOT EXISTS trophy_pages (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      page_index INTEGER NOT NULL,
      is_single INTEGER DEFAULT 1,
      pages TEXT, -- JSON array of page indices
      PRIMARY KEY (bookmark_id, chapter_number, page_index),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Chapter settings (cover pair, linked pages, locked status)
    CREATE TABLE IF NOT EXISTS chapter_settings (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      first_page_single INTEGER DEFAULT 1,
      last_page_single INTEGER DEFAULT 0,
      locked INTEGER DEFAULT 0,
      reading_mode TEXT,
      direction TEXT,
      PRIMARY KEY (bookmark_id, chapter_number),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );



    -- Favorite lists
    CREATE TABLE IF NOT EXISTS favorite_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      sort_order INTEGER DEFAULT 0
    );

    -- Favorite items
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      bookmark_id TEXT NOT NULL,
      manga_title TEXT,
      chapter_number REAL NOT NULL,
      chapter_url TEXT,
      page_indices TEXT, -- JSON array
      display_mode TEXT,
      display_side TEXT,
      image_paths TEXT, -- JSON array
      created_at TEXT NOT NULL,
      FOREIGN KEY (list_id) REFERENCES favorite_lists(id) ON DELETE CASCADE,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Reader settings (global)
    CREATE TABLE IF NOT EXISTS reader_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );

    -- Artists table
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    -- Bookmark-Artist junction table
    -- Note: bookmark_id references external JSON bookmarks, not SQLite table
    CREATE TABLE IF NOT EXISTS bookmark_artists (
      bookmark_id TEXT NOT NULL,
      artist_id INTEGER NOT NULL,
      PRIMARY KEY (bookmark_id, artist_id),
      FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_bookmark_artists ON bookmark_artists(artist_id);
    CREATE INDEX IF NOT EXISTS idx_bookmark_artists_bookmark ON bookmark_artists(bookmark_id);

    -- Series table (for grouping related manga/stories)
    CREATE TABLE IF NOT EXISTS series (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      alias TEXT,
      cover_entry_id TEXT,  -- Which entry's cover to use
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    -- Series entries (individual manga/stories within a series)
    CREATE TABLE IF NOT EXISTS series_entries (
      id TEXT PRIMARY KEY,
      series_id TEXT NOT NULL,
      bookmark_id TEXT NOT NULL,
      entry_order INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_series_entries ON series_entries(series_id);

    -- Series-Artist junction table
    CREATE TABLE IF NOT EXISTS series_artists (
      series_id TEXT NOT NULL,
      artist_id INTEGER NOT NULL,
      PRIMARY KEY (series_id, artist_id),
      FOREIGN KEY (series_id) REFERENCES series(id) ON DELETE CASCADE,
      FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
    );

    -- Volumes table (custom groups of chapters within a bookmark)
    CREATE TABLE IF NOT EXISTS volumes (
      id TEXT PRIMARY KEY,
      bookmark_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- Volume chapters (mapping chapters to volumes)
    CREATE TABLE IF NOT EXISTS volume_chapters (
      volume_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      PRIMARY KEY (volume_id, chapter_number),
      FOREIGN KEY (volume_id) REFERENCES volumes(id) ON DELETE CASCADE
    );

    -- Push notification subscriptions
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      endpoint TEXT UNIQUE NOT NULL,
      keys TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- Persistent Job Queue
    CREATE TABLE IF NOT EXISTS job_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      data TEXT NOT NULL, -- JSON
      status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
      result TEXT, -- JSON result or error message
      created_at TEXT NOT NULL,
      started_at TEXT,
      completed_at TEXT,
      error TEXT
    );

    -- Users (for Authentication)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

    // Fix bookmark_artists table if it has wrong foreign key
    fixBookmarkArtistsTable();

    // Add preferred_release_group column if not exists
    addPreferredReleaseGroupColumn();

    // Add release_group and uploaded_at columns to chapters if not exists
    addChapterMetadataColumns();

    // Lazy migration for locked column in chapter_settings
    try {
        db.prepare('ALTER TABLE chapter_settings ADD COLUMN locked INTEGER DEFAULT 0').run();
    } catch (e) {
        // Column likely already exists
    }

    // Lazy migration for display_order column in volumes
    try {
        db.prepare('ALTER TABLE volumes ADD COLUMN display_order INTEGER DEFAULT 0').run();
    } catch (e) {
        // Column likely already exists
    }

    // Lazy migration for auto_check and auto_download columns in bookmarks
    try {
        db.prepare('ALTER TABLE bookmarks ADD COLUMN auto_check INTEGER DEFAULT 0').run();
        console.log('📦 Added auto_check column to bookmarks');
    } catch (e) {
        // Column likely already exists
    }

    try {
        db.prepare('ALTER TABLE bookmarks ADD COLUMN auto_download INTEGER DEFAULT 0').run();
        console.log('📦 Added auto_download column to bookmarks');
    } catch (e) {
        // Column likely already exists
    }

    // Lazy migration for reading_mode and direction in chapter_settings
    try {
        db.prepare('ALTER TABLE chapter_settings ADD COLUMN reading_mode TEXT').run();
        console.log('📦 Added reading_mode column to chapter_settings');
    } catch (e) { }

    try {
        db.prepare('ALTER TABLE chapter_settings ADD COLUMN direction TEXT').run();
        console.log('📦 Added direction column to chapter_settings');
    } catch (e) { }

    console.log('📦 Database initialized:', DB_PATH);
    return db;
}

// Get database instance
export function getDb() {
    if (!db) {
        initDatabase();
    }
    return db;
}

// Shared ID generator
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Fix bookmark_artists table if it has wrong foreign key
function fixBookmarkArtistsTable() {
    // Check if bookmark_artists has the wrong foreign key constraint
    // by trying to check the table info
    try {
        const tableInfo = db.prepare("SELECT sql FROM sqlite_master WHERE name = 'bookmark_artists'").get();
        if (tableInfo && tableInfo.sql && tableInfo.sql.includes('REFERENCES bookmarks')) {
            console.log('📦 Fixing bookmark_artists table foreign key...');

            // Save existing data
            const existingData = db.prepare('SELECT * FROM bookmark_artists').all();

            // Drop and recreate table without the problematic foreign key
            db.exec(`
        DROP TABLE IF EXISTS bookmark_artists;
        
        CREATE TABLE bookmark_artists (
          bookmark_id TEXT NOT NULL,
          artist_id INTEGER NOT NULL,
          PRIMARY KEY (bookmark_id, artist_id),
          FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_bookmark_artists ON bookmark_artists(artist_id);
        CREATE INDEX IF NOT EXISTS idx_bookmark_artists_bookmark ON bookmark_artists(bookmark_id);
      `);

            // Restore data
            const insertStmt = db.prepare('INSERT OR IGNORE INTO bookmark_artists (bookmark_id, artist_id) VALUES (?, ?)');
            for (const row of existingData) {
                insertStmt.run(row.bookmark_id, row.artist_id);
            }

            console.log('📦 bookmark_artists table fixed');
        }
    } catch (e) {
        // Table might not exist yet, that's fine
    }
}

// Add preferred_release_group column if it doesn't exist
function addPreferredReleaseGroupColumn() {
    try {
        const columns = db.prepare("PRAGMA table_info(bookmarks)").all();
        const hasColumn = columns.some(c => c.name === 'preferred_release_group');
        if (!hasColumn) {
            db.exec('ALTER TABLE bookmarks ADD COLUMN preferred_release_group TEXT');
            console.log('📦 Added preferred_release_group column');
        }
    } catch (e) {
        // Table might not exist yet, that's fine
    }
}

// Add release_group and uploaded_at columns to chapters if they don't exist
function addChapterMetadataColumns() {
    try {
        const columns = db.prepare("PRAGMA table_info(chapters)").all();
        const existingColumns = new Set(columns.map(c => c.name));

        // List of columns to check and their definitions
        const columnsToCheck = [
            { name: 'release_group', def: 'TEXT' },
            { name: 'uploaded_at', def: 'TEXT' },
            { name: 'version', def: 'INTEGER DEFAULT 1' },
            { name: 'total_versions', def: 'INTEGER DEFAULT 1' },
            { name: 'original_number', def: 'REAL' },
            { name: 'removed_from_remote', def: 'INTEGER DEFAULT 0' },
            { name: 'is_old_version', def: 'INTEGER DEFAULT 0' },
            { name: 'url_changed', def: 'INTEGER DEFAULT 0' }
        ];

        for (const col of columnsToCheck) {
            if (!existingColumns.has(col.name)) {
                db.exec(`ALTER TABLE chapters ADD COLUMN ${col.name} ${col.def}`);
                console.log(`📦 Added ${col.name} column to chapters`);
            }
        }
    } catch (e) {
        console.error('Error migrating chapters table:', e);
    }
}

// Close database
export function closeDatabase() {
    if (db) {
        db.close();
        db = null;
    }
}
