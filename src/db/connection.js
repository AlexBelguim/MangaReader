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
  db.pragma('journal_mode = WAL'); // Fast concurrent reads/writes (requires local storage)
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    -- Bookmarks (manga) table — per user; a URL is unique per owner, so two
    -- users may track the same manga independently. All child tables key off
    -- bookmark_id and are transitively per-user. Later columns (auto_check,
    -- is_demo, ...) are added by the lazy ALTERs/migrations below.
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      url TEXT NOT NULL,
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
      updated_at TEXT NOT NULL,
      UNIQUE(user_id, url),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

    -- Read chapters (per user)
    CREATE TABLE IF NOT EXISTS read_chapters (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number, user_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Reading progress per chapter (per user)
    CREATE TABLE IF NOT EXISTS reading_progress (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      user_id INTEGER NOT NULL,
      page INTEGER NOT NULL,
      total_pages INTEGER NOT NULL,
      last_read TEXT NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number, user_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

    -- Trophy pages (per user)
    CREATE TABLE IF NOT EXISTS trophy_pages (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      page_index INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      is_single INTEGER DEFAULT 1,
      pages TEXT, -- JSON array of page indices
      PRIMARY KEY (bookmark_id, chapter_number, page_index, user_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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



    -- Favorite lists (per user)
    CREATE TABLE IF NOT EXISTS favorite_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      UNIQUE(user_id, name),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Favorite items (per user)
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      bookmark_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      manga_title TEXT,
      chapter_number REAL NOT NULL,
      chapter_url TEXT,
      page_indices TEXT, -- JSON array
      display_mode TEXT,
      display_side TEXT,
      image_paths TEXT, -- JSON array
      created_at TEXT NOT NULL,
      FOREIGN KEY (list_id) REFERENCES favorite_lists(id) ON DELETE CASCADE,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Reader settings (per user)
    CREATE TABLE IF NOT EXISTS reader_settings (
      user_id INTEGER NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      PRIMARY KEY (user_id, key),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    -- user_id is NULL for system/legacy jobs (visible to admins only);
    -- no FK on purpose: jobs may outlive users and deleting a user must
    -- not cascade-delete queue history.
    CREATE TABLE IF NOT EXISTS job_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      data TEXT NOT NULL, -- JSON
      status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
      result TEXT, -- JSON result or error message
      created_at TEXT NOT NULL,
      started_at TEXT,
      completed_at TEXT,
      error TEXT,
      user_id INTEGER
    );

    -- Users (for Authentication)
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    -- AniList OAuth tokens (per app user)
    CREATE TABLE IF NOT EXISTS anilist_tokens (
      user_id INTEGER PRIMARY KEY,
      access_token TEXT NOT NULL,
      anilist_user_id INTEGER,
      anilist_username TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- AniList media mapping per bookmark (reading-progress sync)
    CREATE TABLE IF NOT EXISTS bookmark_anilist (
      bookmark_id TEXT PRIMARY KEY,
      anilist_id INTEGER NOT NULL,
      anilist_title TEXT,
      media_format TEXT,
      chapters_total INTEGER,
      sync_enabled INTEGER DEFAULT 1,
      last_pushed_progress INTEGER DEFAULT 0,
      mapped_at TEXT NOT NULL,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );

    -- AniList push bookkeeping (per user; supersedes bookmark_anilist.last_pushed_progress)
    CREATE TABLE IF NOT EXISTS anilist_push_state (
      user_id INTEGER NOT NULL,
      bookmark_id TEXT NOT NULL,
      progress INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, bookmark_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
    );
  `);

  // Fix bookmark_artists table if it has wrong foreign key
  fixBookmarkArtistsTable();

  // Add preferred_release_group column if not exists
  addPreferredReleaseGroupColumn();

  // Add release_group and uploaded_at columns to chapters if not exists
  addChapterMetadataColumns();

  // Migrate read state (read_chapters/reading_progress) to per-user tables
  migrateReadStateToPerUser();

  // Migrate favorites, reader settings and trophy pages to per-user tables
  migrateFavoritesSettingsTrophiesToPerUser();

  // Migrate bookmarks to per-user (must run after the migrations above:
  // several of them rebuild tables that FK-reference bookmarks)
  migrateBookmarksToPerUser();

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

  // Lazy migration for schedule columns (daily, weekly, specific day+time)
  try {
    db.prepare('ALTER TABLE bookmarks ADD COLUMN check_schedule TEXT DEFAULT NULL').run();
    console.log('📦 Added check_schedule column to bookmarks');
  } catch (e) {
    // Column likely already exists
  }

  try {
    db.prepare('ALTER TABLE bookmarks ADD COLUMN check_day TEXT DEFAULT NULL').run();
    console.log('📦 Added check_day column to bookmarks');
  } catch (e) {
    // Column likely already exists
  }

  try {
    db.prepare('ALTER TABLE bookmarks ADD COLUMN check_time TEXT DEFAULT NULL').run();
    console.log('📦 Added check_time column to bookmarks');
  } catch (e) {
    // Column likely already exists
  }

  try {
    db.prepare('ALTER TABLE bookmarks ADD COLUMN next_check TEXT DEFAULT NULL').run();
    console.log('📦 Added next_check column to bookmarks');
  } catch (e) {
    // Column likely already exists
  }

  // Lazy migration for user_id column in job_queue (per-user queue visibility;
  // existing rows stay NULL = system/legacy, visible to admins only)
  try {
    db.prepare('ALTER TABLE job_queue ADD COLUMN user_id INTEGER').run();
    console.log('📦 Added user_id column to job_queue');
  } catch (e) {
    // Column likely already exists
  }
  db.exec('CREATE INDEX IF NOT EXISTS idx_job_queue_user ON job_queue(user_id)');

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

// Primary admin = first user with role 'admin', else the first user. Existing
// (pre-multiuser) read state is attributed to this account. Returns null when
// the users table is empty.
export function getPrimaryAdminId() {
  try {
    const columns = db.prepare("PRAGMA table_info(users)").all();
    if (columns.length === 0) return null;
    // role is added by a lazy migration that runs after initDatabase on very
    // old installs, so fall back to plain id order when it is missing.
    const hasRole = columns.some(c => c.name === 'role');
    const sql = hasRole
      ? "SELECT id FROM users ORDER BY CASE WHEN role = 'admin' THEN 0 ELSE 1 END, id LIMIT 1"
      : "SELECT id FROM users ORDER BY id LIMIT 1";
    return db.prepare(sql).get()?.id ?? null;
  } catch (e) {
    return null;
  }
}

// Generic per-user migration: several tables used to be global (no user_id
// column). For each, rename to <table>_old, recreate with the new per-user
// shape, copy existing rows over with user_id = primary admin, then drop the
// old table. When no user exists yet the tables are new/empty anyway, so the
// copy is skipped. Idempotent: skips tables that already have user_id.
function migrateTableToPerUser(tableName, createSql, copySql) {
  try {
    const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
    if (columns.some(c => c.name === 'user_id')) return; // already per-user

    const adminId = getPrimaryAdminId();
    // DROP TABLE performs an implicit DELETE that fires FK actions: dropping
    // favorite_lists_old would cascade into the not-yet-migrated favorites
    // table. Disable FK enforcement for the duration of the migration
    // (the pragma is a no-op inside a transaction, so wrap it outside).
    db.pragma('foreign_keys = OFF');
    try {
      const migrate = db.transaction(() => {
        db.exec(`ALTER TABLE ${tableName} RENAME TO ${tableName}_old`);
        db.exec(createSql);
        if (adminId !== null) {
          db.prepare(copySql).run(adminId);
        }
        db.exec(`DROP TABLE ${tableName}_old`);
      });
      migrate();
    } finally {
      db.pragma('foreign_keys = ON');
    }
    console.log(adminId !== null
      ? `📦 Migrated ${tableName} to per-user (existing rows attributed to user ${adminId})`
      : `📦 Migrated ${tableName} to per-user (no users yet, table starts empty)`);
  } catch (e) {
    console.error(`Error migrating ${tableName} to per-user:`, e);
  }
}

// read_chapters/reading_progress used to be global (PK bookmark_id +
// chapter_number). They are now per-user.
function migrateReadStateToPerUser() {
  migrateTableToPerUser('read_chapters', `
    CREATE TABLE IF NOT EXISTS read_chapters (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      user_id INTEGER NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number, user_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    'INSERT INTO read_chapters (bookmark_id, chapter_number, user_id) SELECT bookmark_id, chapter_number, ? FROM read_chapters_old');

  migrateTableToPerUser('reading_progress', `
    CREATE TABLE IF NOT EXISTS reading_progress (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      user_id INTEGER NOT NULL,
      page INTEGER NOT NULL,
      total_pages INTEGER NOT NULL,
      last_read TEXT NOT NULL,
      PRIMARY KEY (bookmark_id, chapter_number, user_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    'INSERT INTO reading_progress (bookmark_id, chapter_number, user_id, page, total_pages, last_read) SELECT bookmark_id, chapter_number, ?, page, total_pages, last_read FROM reading_progress_old');
}

// favorites/favorite_lists/reader_settings/trophy_pages used to be global.
// They are now per-user; existing rows are attributed to the primary admin.
function migrateFavoritesSettingsTrophiesToPerUser() {
  migrateTableToPerUser('favorite_lists', `
    CREATE TABLE IF NOT EXISTS favorite_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      UNIQUE(user_id, name),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    'INSERT INTO favorite_lists (id, user_id, name, sort_order) SELECT id, ?, name, sort_order FROM favorite_lists_old');

  migrateTableToPerUser('favorites', `
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      bookmark_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      manga_title TEXT,
      chapter_number REAL NOT NULL,
      chapter_url TEXT,
      page_indices TEXT, -- JSON array
      display_mode TEXT,
      display_side TEXT,
      image_paths TEXT, -- JSON array
      created_at TEXT NOT NULL,
      FOREIGN KEY (list_id) REFERENCES favorite_lists(id) ON DELETE CASCADE,
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `INSERT INTO favorites (id, list_id, bookmark_id, user_id, manga_title, chapter_number, chapter_url, page_indices, display_mode, display_side, image_paths, created_at)
     SELECT id, list_id, bookmark_id, ?, manga_title, chapter_number, chapter_url, page_indices, display_mode, display_side, image_paths, created_at FROM favorites_old`);

  migrateTableToPerUser('reader_settings', `
    CREATE TABLE IF NOT EXISTS reader_settings (
      user_id INTEGER NOT NULL,
      key TEXT NOT NULL,
      value TEXT,
      PRIMARY KEY (user_id, key),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    'INSERT INTO reader_settings (user_id, key, value) SELECT ?, key, value FROM reader_settings_old');

  migrateTableToPerUser('trophy_pages', `
    CREATE TABLE IF NOT EXISTS trophy_pages (
      bookmark_id TEXT NOT NULL,
      chapter_number REAL NOT NULL,
      page_index INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      is_single INTEGER DEFAULT 1,
      pages TEXT, -- JSON array of page indices
      PRIMARY KEY (bookmark_id, chapter_number, page_index, user_id),
      FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    'INSERT INTO trophy_pages (bookmark_id, chapter_number, page_index, user_id, is_single, pages) SELECT bookmark_id, chapter_number, page_index, ?, is_single, pages FROM trophy_pages_old');
}

// bookmarks used to be global (url TEXT UNIQUE). They are now per-user:
// existing rows are attributed to the primary admin and URL uniqueness
// becomes per-user (UNIQUE(user_id, url)). Columns that only exist on newer
// installs (auto_check, is_demo, ...) are copied when present — the lazy
// ALTERs in initDatabase and db/migrations.js add them to the new table
// otherwise (their try/catch makes re-adding a no-op).
function migrateBookmarksToPerUser() {
  const columns = db.prepare('PRAGMA table_info(bookmarks)').all();
  if (columns.some(c => c.name === 'user_id')) return; // already per-user

  const BASE_COLUMNS = [
    'id', 'url', 'title', 'alias', 'website', 'source', 'cover', 'local_cover',
    'description', 'total_chapters', 'unique_chapters', 'last_checked',
    'last_read_chapter', 'last_read_at', 'preferred_release_group',
    'created_at', 'updated_at'
  ];
  const OPTIONAL_COLUMNS = [
    'auto_check', 'auto_download', 'check_schedule', 'check_day',
    'check_time', 'next_check', 'is_demo'
  ];
  const present = new Set(columns.map(c => c.name));
  const copyColumns = [...BASE_COLUMNS, ...OPTIONAL_COLUMNS.filter(c => present.has(c))];

  // legacy_alter_table=ON: renaming bookmarks must NOT rewrite the many
  // child tables' REFERENCES bookmarks(id) to bookmarks_old (the SQLite
  // ≥3.25 default), which would break FK resolution once the old table is
  // dropped. migrateTableToPerUser also toggles foreign_keys OFF/ON around
  // the transaction because DROP TABLE fires FK actions.
  db.pragma('legacy_alter_table = ON');
  try {
    migrateTableToPerUser('bookmarks', `
    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      url TEXT NOT NULL,
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
      updated_at TEXT NOT NULL,
      auto_check INTEGER DEFAULT 0,
      auto_download INTEGER DEFAULT 0,
      check_schedule TEXT DEFAULT NULL,
      check_day TEXT DEFAULT NULL,
      check_time TEXT DEFAULT NULL,
      next_check TEXT DEFAULT NULL,
      is_demo INTEGER DEFAULT 0,
      UNIQUE(user_id, url),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
      `INSERT INTO bookmarks (user_id, ${copyColumns.join(', ')}) SELECT ?, ${copyColumns.join(', ')} FROM bookmarks_old`);
  } finally {
    db.pragma('legacy_alter_table = OFF');
  }
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

// Add tags column if it doesn't exist
function addTagsColumn() {
  try {
    const columns = db.prepare("PRAGMA table_info(bookmarks)").all();
    const hasColumn = columns.some(c => c.name === 'tags');
    if (!hasColumn) {
      db.exec('ALTER TABLE bookmarks ADD COLUMN tags TEXT');
      console.log('📦 Added tags column');
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
