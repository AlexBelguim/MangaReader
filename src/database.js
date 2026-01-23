import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs-extra';
import { CONFIG } from './config.js';

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
function generateId() {
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
    const hasReleaseGroup = columns.some(c => c.name === 'release_group');
    const hasUploadedAt = columns.some(c => c.name === 'uploaded_at');

    if (!hasReleaseGroup) {
      db.exec('ALTER TABLE chapters ADD COLUMN release_group TEXT');
      console.log('📦 Added release_group column to chapters');
    }
    if (!hasUploadedAt) {
      db.exec('ALTER TABLE chapters ADD COLUMN uploaded_at TEXT');
      console.log('📦 Added uploaded_at column to chapters');
    }
  } catch (e) {
    // Table might not exist yet, that's fine
  }
}

// Close database
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// ==================== MIGRATION FROM JSON ====================

export async function migrateFromJson() {
  const db = getDb();

  // Check if already migrated
  const bookmarkCount = db.prepare('SELECT COUNT(*) as count FROM bookmarks').get();
  if (bookmarkCount.count > 0) {
    console.log('📦 Database already has data, skipping migration');
    return;
  }

  console.log('📦 Migrating from JSON files...');

  // Migrate bookmarks.json
  const bookmarksFile = CONFIG.bookmarksFile;
  if (await fs.pathExists(bookmarksFile)) {
    const data = await fs.readJson(bookmarksFile);

    // Migrate categories
    const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
    for (const cat of (data.categories || [])) {
      insertCategory.run(cat);
    }

    // Migrate bookmarks
    const insertBookmark = db.prepare(`
      INSERT OR REPLACE INTO bookmarks 
      (id, url, title, alias, website, source, cover, local_cover, description, 
       total_chapters, unique_chapters, last_checked, last_read_chapter, last_read_at,
       created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertChapter = db.prepare(`
      INSERT OR REPLACE INTO chapters 
      (bookmark_id, number, title, url, version, total_versions, original_number, 
       removed_from_remote, is_old_version, url_changed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertDownloaded = db.prepare('INSERT OR IGNORE INTO downloaded_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
    const insertDownloadedVersion = db.prepare('INSERT OR IGNORE INTO downloaded_versions (bookmark_id, chapter_number, url) VALUES (?, ?, ?)');
    const insertDeleted = db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)');
    const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
    const insertProgress = db.prepare('INSERT OR REPLACE INTO reading_progress (bookmark_id, chapter_number, page, total_pages, last_read) VALUES (?, ?, ?, ?, ?)');
    const insertNewDup = db.prepare('INSERT OR IGNORE INTO new_duplicates (bookmark_id, chapter_number) VALUES (?, ?)');
    const insertDupChapter = db.prepare('INSERT OR REPLACE INTO duplicate_chapters (bookmark_id, chapter_number, count) VALUES (?, ?, ?)');
    const insertUpdatedChapter = db.prepare('INSERT OR REPLACE INTO updated_chapters (bookmark_id, chapter_number, old_url, new_urls, type, detected_at) VALUES (?, ?, ?, ?, ?, ?)');
    const insertBookmarkCategory = db.prepare('INSERT OR IGNORE INTO bookmark_categories (bookmark_id, category_id) VALUES (?, ?)');

    const getCategoryId = db.prepare('SELECT id FROM categories WHERE name = ?');

    const migrateBookmark = db.transaction((bookmark) => {
      // Insert bookmark
      insertBookmark.run(
        bookmark.id,
        bookmark.url,
        bookmark.title,
        bookmark.alias,
        bookmark.website,
        bookmark.source || 'remote',
        bookmark.cover,
        bookmark.localCover,
        bookmark.description,
        bookmark.totalChapters || 0,
        bookmark.uniqueChapters || 0,
        bookmark.lastChecked,
        bookmark.lastReadChapter || 0,
        bookmark.lastReadAt,
        bookmark.createdAt,
        bookmark.updatedAt
      );

      // Insert chapters
      for (const ch of (bookmark.chapters || [])) {
        insertChapter.run(
          bookmark.id,
          ch.number,
          ch.title,
          ch.url,
          ch.version || 1,
          ch.totalVersions || 1,
          ch.originalNumber,
          ch.removedFromRemote ? 1 : 0,
          ch.isOldVersion ? 1 : 0,
          ch.urlChanged ? 1 : 0
        );
      }

      // Insert downloaded chapters
      for (const num of (bookmark.downloadedChapters || [])) {
        insertDownloaded.run(bookmark.id, num);
      }

      // Insert downloaded versions
      const versions = bookmark.downloadedVersions || {};
      for (const [chNum, urls] of Object.entries(versions)) {
        const urlArray = Array.isArray(urls) ? urls : [urls];
        for (const url of urlArray) {
          insertDownloadedVersion.run(bookmark.id, parseFloat(chNum), url);
        }
      }

      // Insert deleted URLs
      for (const url of (bookmark.deletedChapterUrls || [])) {
        insertDeleted.run(bookmark.id, url);
      }

      // Insert read chapters
      for (const num of (bookmark.readChapters || [])) {
        insertRead.run(bookmark.id, num);
      }

      // Insert reading progress
      const progress = bookmark.readingProgress || {};
      for (const [chNum, prog] of Object.entries(progress)) {
        insertProgress.run(bookmark.id, parseFloat(chNum), prog.page, prog.totalPages, prog.lastRead);
      }

      // Insert new duplicates
      for (const num of (bookmark.newDuplicates || [])) {
        insertNewDup.run(bookmark.id, num);
      }

      // Insert duplicate chapters
      for (const dup of (bookmark.duplicateChapters || [])) {
        insertDupChapter.run(bookmark.id, dup.number, dup.count || 2);
      }

      // Insert updated chapters
      for (const upd of (bookmark.updatedChapters || [])) {
        insertUpdatedChapter.run(
          bookmark.id,
          upd.number,
          upd.oldUrl,
          JSON.stringify(upd.newUrls || []),
          upd.type,
          upd.detectedAt
        );
      }

      // Insert bookmark categories
      for (const catName of (bookmark.categories || [])) {
        const cat = getCategoryId.get(catName);
        if (cat) {
          insertBookmarkCategory.run(bookmark.id, cat.id);
        }
      }
    });

    for (const bookmark of (data.bookmarks || [])) {
      migrateBookmark(bookmark);
    }

    console.log(`  ✓ Migrated ${data.bookmarks?.length || 0} bookmarks`);
  }

  // Migrate favorites.json
  const favoritesFile = path.join(CONFIG.dataDir, 'favorites.json');
  if (await fs.pathExists(favoritesFile)) {
    const data = await fs.readJson(favoritesFile);

    const insertList = db.prepare('INSERT OR IGNORE INTO favorite_lists (name, sort_order) VALUES (?, ?)');
    const getListId = db.prepare('SELECT id FROM favorite_lists WHERE name = ?');
    const insertFavorite = db.prepare(`
      INSERT INTO favorites 
      (list_id, bookmark_id, manga_title, chapter_number, chapter_url, page_indices, 
       display_mode, display_side, image_paths, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const listOrder = data.listOrder || Object.keys(data.favorites || {});
    let sortOrder = 0;

    for (const listName of listOrder) {
      insertList.run(listName, sortOrder++);
      const list = getListId.get(listName);

      for (const fav of (data.favorites?.[listName] || [])) {
        insertFavorite.run(
          list.id,
          fav.mangaId,
          fav.mangaTitle,
          fav.chapterNum,
          fav.chapterUrl,
          JSON.stringify(fav.pageIndices || []),
          fav.displayMode,
          fav.displaySide,
          JSON.stringify(fav.imagePaths || []),
          fav.createdAt
        );
      }
    }

    console.log(`  ✓ Migrated ${listOrder.length} favorite lists`);
  }

  // Migrate chapterSettings.json
  const settingsFile = path.join(CONFIG.dataDir, 'chapterSettings.json');
  if (await fs.pathExists(settingsFile)) {
    const data = await fs.readJson(settingsFile);

    const insertSetting = db.prepare(`
      INSERT OR REPLACE INTO chapter_settings 
      (bookmark_id, chapter_number, first_page_single, last_page_single) 
      VALUES (?, ?, ?, ?)
    `);

    let count = 0;
    for (const [mangaId, chapters] of Object.entries(data)) {
      for (const [chNum, settings] of Object.entries(chapters)) {
        insertSetting.run(
          mangaId,
          parseFloat(chNum),
          settings.firstPageSingle ? 1 : 0,
          settings.lastPageSingle ? 1 : 0
        );
        count++;
      }
    }

    console.log(`  ✓ Migrated ${count} chapter settings`);
  }

  // Migrate trophyPages.json
  const trophyFile = path.join(CONFIG.dataDir, 'trophyPages.json');
  if (await fs.pathExists(trophyFile)) {
    const data = await fs.readJson(trophyFile);

    const insertTrophy = db.prepare(`
      INSERT OR REPLACE INTO trophy_pages 
      (bookmark_id, chapter_number, page_index, is_single, pages) 
      VALUES (?, ?, ?, ?, ?)
    `);

    let count = 0;
    for (const [mangaId, chapters] of Object.entries(data)) {
      for (const [chNum, pages] of Object.entries(chapters)) {
        for (const [pageIdx, info] of Object.entries(pages)) {
          insertTrophy.run(
            mangaId,
            parseFloat(chNum),
            parseInt(pageIdx),
            info.isSingle ? 1 : 0,
            JSON.stringify(info.pages || [])
          );
          count++;
        }
      }
    }

    console.log(`  ✓ Migrated ${count} trophy pages`);
  }

  console.log('📦 Migration complete!');
}

// ==================== BOOKMARK OPERATIONS ====================

export const bookmarkDb = {
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  getAll() {
    const db = getDb();
    const bookmarks = db.prepare('SELECT * FROM bookmarks ORDER BY updated_at DESC').all();

    // Enrich with related data
    return bookmarks.map(b => this.enrichBookmark(b));
  },

  getById(id) {
    const db = getDb();
    const bookmark = db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(id);
    if (!bookmark) return null;
    return this.enrichBookmark(bookmark);
  },

  getByUrl(url) {
    const db = getDb();
    const bookmark = db.prepare('SELECT * FROM bookmarks WHERE url = ?').get(url);
    if (!bookmark) return null;
    return this.enrichBookmark(bookmark);
  },

  enrichBookmark(bookmark) {
    const db = getDb();
    const id = bookmark.id;

    // Get chapters
    const chapters = db.prepare(`
      SELECT number, title, url, version, total_versions, original_number,
             removed_from_remote, is_old_version, url_changed, release_group, uploaded_at
      FROM chapters WHERE bookmark_id = ? ORDER BY number, version
    `).all(id);

    // Get downloaded chapters
    const downloadedChapters = db.prepare(
      'SELECT chapter_number FROM downloaded_chapters WHERE bookmark_id = ?'
    ).all(id).map(r => r.chapter_number);

    // Get downloaded versions
    const downloadedVersionsRaw = db.prepare(
      'SELECT chapter_number, url FROM downloaded_versions WHERE bookmark_id = ?'
    ).all(id);
    const downloadedVersions = {};
    for (const dv of downloadedVersionsRaw) {
      if (!downloadedVersions[dv.chapter_number]) {
        downloadedVersions[dv.chapter_number] = [];
      }
      downloadedVersions[dv.chapter_number].push(dv.url);
    }

    // Get deleted URLs
    const deletedChapterUrls = db.prepare(
      'SELECT url FROM deleted_chapter_urls WHERE bookmark_id = ?'
    ).all(id).map(r => r.url);

    // Get read chapters
    const readChapters = db.prepare(
      'SELECT chapter_number FROM read_chapters WHERE bookmark_id = ?'
    ).all(id).map(r => r.chapter_number);

    // Get reading progress
    const progressRaw = db.prepare(
      'SELECT chapter_number, page, total_pages, last_read FROM reading_progress WHERE bookmark_id = ?'
    ).all(id);
    const readingProgress = {};
    for (const p of progressRaw) {
      readingProgress[p.chapter_number] = {
        page: p.page,
        totalPages: p.total_pages,
        lastRead: p.last_read
      };
    }

    // Get new duplicates
    const newDuplicates = db.prepare(
      'SELECT chapter_number FROM new_duplicates WHERE bookmark_id = ?'
    ).all(id).map(r => r.chapter_number);

    // Get duplicate chapters
    const duplicateChapters = db.prepare(
      'SELECT chapter_number, count FROM duplicate_chapters WHERE bookmark_id = ?'
    ).all(id).map(r => ({ number: r.chapter_number, count: r.count }));

    // Get excluded chapters
    const excludedChapters = db.prepare(
      'SELECT chapter_number FROM excluded_chapters WHERE bookmark_id = ?'
    ).all(id).map(r => r.chapter_number);

    // Get updated chapters
    const updatedChapters = db.prepare(
      'SELECT chapter_number, old_url, new_urls, type, detected_at FROM updated_chapters WHERE bookmark_id = ?'
    ).all(id).map(r => ({
      number: r.chapter_number,
      oldUrl: r.old_url,
      newUrls: JSON.parse(r.new_urls || '[]'),
      type: r.type,
      detectedAt: r.detected_at
    }));

    // Get categories
    const categories = db.prepare(`
      SELECT c.name FROM categories c
      JOIN bookmark_categories bc ON c.id = bc.category_id
      WHERE bc.bookmark_id = ?
    `).all(id).map(r => r.name);

    return {
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      alias: bookmark.alias,
      website: bookmark.website,
      source: bookmark.source,
      cover: bookmark.cover,
      localCover: bookmark.local_cover,
      description: bookmark.description,
      totalChapters: bookmark.total_chapters,
      uniqueChapters: bookmark.unique_chapters,
      lastChecked: bookmark.last_checked,
      lastReadChapter: bookmark.last_read_chapter,
      lastReadAt: bookmark.last_read_at,
      preferredReleaseGroup: bookmark.preferred_release_group,
      createdAt: bookmark.created_at,
      updatedAt: bookmark.updated_at,
      chapters: chapters.map(c => ({
        number: c.number,
        title: c.title,
        url: c.url,
        version: c.version,
        totalVersions: c.total_versions,
        originalNumber: c.original_number,
        removedFromRemote: !!c.removed_from_remote,
        isOldVersion: !!c.is_old_version,
        urlChanged: !!c.url_changed,
        releaseGroup: c.release_group || '',
        uploadedAt: c.uploaded_at || ''
      })),
      downloadedChapters,
      downloadedVersions,
      deletedChapterUrls,
      readChapters,
      readingProgress,
      newDuplicates,
      duplicateChapters,
      updatedChapters,
      categories,
      duplicateChapters,
      updatedChapters,
      categories,
      excludedChapters,
      autoCheck: !!bookmark.auto_check,
      autoDownload: !!bookmark.auto_download,
      volumes: this.getVolumes(id)
    };
  },

  // Get volumes for a bookmark
  getVolumes(bookmarkId) {
    const db = getDb();

    // Auto-migrate: Check for cover column
    try {
      db.prepare('SELECT cover FROM volumes LIMIT 1').get();
    } catch (e) {
      if (e.message.includes('no such column')) {
        try {
          db.prepare('ALTER TABLE volumes ADD COLUMN cover TEXT').run();
        } catch (e2) {
          console.error('Failed to add cover column to volumes (getVolumes):', e2);
        }
      }
    }

    const volumesRaw = db.prepare('SELECT id, name, cover, display_order, created_at FROM volumes WHERE bookmark_id = ? ORDER BY display_order, created_at').all(bookmarkId);

    return volumesRaw.map(vol => {
      const chapters = db.prepare('SELECT chapter_number FROM volume_chapters WHERE volume_id = ? ORDER BY chapter_number').all(vol.id);
      return {
        id: vol.id,
        name: vol.name,
        cover: vol.cover,
        displayOrder: vol.display_order || 0,
        createdAt: vol.created_at,
        chapters: chapters.map(c => c.chapter_number)
      };
    });
  },

  // Create a volume
  createVolume(bookmarkId, name, chapterNumbers) {
    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();

    const insertVolume = db.prepare('INSERT INTO volumes (id, bookmark_id, name, created_at) VALUES (?, ?, ?, ?)');
    const insertChapter = db.prepare('INSERT INTO volume_chapters (volume_id, chapter_number) VALUES (?, ?)');

    const createTransaction = db.transaction(() => {
      insertVolume.run(id, bookmarkId, name, now);
      for (const num of chapterNumbers) {
        insertChapter.run(id, num);
      }
    });

    createTransaction();
    return { id, name, chapters: chapterNumbers };
  },

  // Delete a volume
  deleteVolume(volumeId) {
    const db = getDb();
    db.prepare('DELETE FROM volumes WHERE id = ?').run(volumeId);
  },

  // Reorder volume (move up or down)
  reorderVolume(bookmarkId, volumeId, direction) {
    const db = getDb();
    const volumes = db.prepare('SELECT id, display_order FROM volumes WHERE bookmark_id = ? ORDER BY display_order, created_at').all(bookmarkId);

    const currentIndex = volumes.findIndex(v => v.id === volumeId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= volumes.length) return;

    // Swap display_order values
    const currentOrder = currentIndex;
    const newOrder = newIndex;

    db.prepare('UPDATE volumes SET display_order = ? WHERE id = ?').run(newOrder, volumeId);
    db.prepare('UPDATE volumes SET display_order = ? WHERE id = ?').run(currentOrder, volumes[newIndex].id);
  },

  // Update a volume
  updateVolume(volumeId, data) {
    const db = getDb();

    // Auto-migrate: Check for cover column
    try {
      db.prepare('SELECT cover FROM volumes LIMIT 1').get();
    } catch (e) {
      if (e.message.includes('no such column')) {
        try {
          db.prepare('ALTER TABLE volumes ADD COLUMN cover TEXT').run();
        } catch (e2) {
          console.error('Failed to add cover column to volumes:', e2);
        }
      }
    }

    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }

    if (data.cover !== undefined) {
      fields.push('cover = ?');
      values.push(data.cover);
    }

    if (fields.length === 0) return;

    values.push(volumeId);
    db.prepare(`UPDATE volumes SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  },

  // Exclude a chapter (permanently hide and prevent download)
  excludeChapter(bookmarkId, chapterNumber) {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT OR REPLACE INTO excluded_chapters (bookmark_id, chapter_number, excluded_at)
      VALUES (?, ?, ?)
    `).run(bookmarkId, chapterNumber, now);
  },

  // Unexclude a chapter
  unexcludeChapter(bookmarkId, chapterNumber) {
    const db = getDb();
    db.prepare('DELETE FROM excluded_chapters WHERE bookmark_id = ? AND chapter_number = ?')
      .run(bookmarkId, chapterNumber);
  },

  // Get excluded chapters for a bookmark
  getExcludedChapters(bookmarkId) {
    const db = getDb();
    return db.prepare('SELECT chapter_number FROM excluded_chapters WHERE bookmark_id = ?')
      .all(bookmarkId).map(r => r.chapter_number);
  },

  add(mangaInfo) {
    const db = getDb();

    // Check if already exists
    const existing = db.prepare('SELECT id FROM bookmarks WHERE url = ?').get(mangaInfo.url);
    if (existing) {
      return { success: false, message: 'Manga already bookmarked', bookmark: this.getById(existing.id) };
    }

    const id = this.generateId();
    const now = new Date().toISOString();

    const insertBookmark = db.prepare(`
      INSERT INTO bookmarks 
      (id, url, title, alias, website, source, cover, description, 
       total_chapters, unique_chapters, last_checked, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertChapter = db.prepare(`
      INSERT INTO chapters (bookmark_id, number, title, url, version, total_versions, original_number, release_group, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    db.transaction(() => {
      insertBookmark.run(
        id,
        mangaInfo.url,
        mangaInfo.title,
        null,
        mangaInfo.website,
        mangaInfo.source || 'remote',
        mangaInfo.cover,
        mangaInfo.description || '',
        mangaInfo.totalChapters || 0,
        mangaInfo.uniqueChapters || mangaInfo.chapters?.length || 0,
        now,
        now,
        now
      );

      for (const ch of (mangaInfo.chapters || [])) {
        insertChapter.run(id, ch.number, ch.title, ch.url, ch.version || 1, ch.totalVersions || 1, ch.originalNumber, ch.releaseGroup || '', ch.uploadedAt || '');
      }
    })();

    return { success: true, message: 'Bookmark added', bookmark: this.getById(id) };
  },

  update(id, updates) {
    const db = getDb();
    const now = new Date().toISOString();

    console.log(`[DB Update] Bookmark ${id}, updates:`, updates);

    const fields = [];
    const values = [];

    const fieldMap = {
      alias: 'alias',
      cover: 'cover',
      localCover: 'local_cover',
      description: 'description',
      totalChapters: 'total_chapters',
      uniqueChapters: 'unique_chapters',
      lastChecked: 'last_checked',
      lastReadChapter: 'last_read_chapter',
      lastReadAt: 'last_read_at',
      preferredReleaseGroup: 'preferred_release_group',
      autoCheck: 'auto_check',
      autoDownload: 'auto_download'
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        fields.push(`${col} = ?`);
        values.push(updates[key]);
        console.log(`[DB Update] Setting ${col} = ${updates[key]}`);
      }
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    if (fields.length > 1) {
      const sql = `UPDATE bookmarks SET ${fields.join(', ')} WHERE id = ?`;
      console.log(`[DB Update] SQL: ${sql}`);
      console.log(`[DB Update] Values:`, values);
      db.prepare(sql).run(...values);
    }

    // Update chapters if provided - MERGE instead of replace to prevent data loss
    if (updates.chapters) {
      // Get existing chapters
      const existingChapters = db.prepare('SELECT * FROM chapters WHERE bookmark_id = ?').all(id);
      const existingByUrl = new Map(existingChapters.map(ch => [ch.url, ch]));
      const existingByNumberVersion = new Map(existingChapters.map(ch => [`${ch.number}-${ch.version}`, ch]));

      // Track which URLs are in the new scrape
      const newUrls = new Set(updates.chapters.map(ch => ch.url));

      // Prepare statements
      const insertChapter = db.prepare(`
        INSERT OR REPLACE INTO chapters (bookmark_id, number, title, url, version, total_versions, original_number, removed_from_remote, is_old_version, url_changed, release_group, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const updateRemoved = db.prepare(`
        UPDATE chapters SET removed_from_remote = 1 WHERE bookmark_id = ? AND url = ?
      `);

      // Insert/update new chapters
      for (const ch of updates.chapters) {
        const existing = existingByUrl.get(ch.url);
        insertChapter.run(
          id,
          ch.number,
          ch.title,
          ch.url,
          ch.version || 1,
          ch.totalVersions || 1,
          ch.originalNumber,
          ch.removedFromRemote ? 1 : 0,  // New chapters are not removed
          ch.isOldVersion ? 1 : 0,
          ch.urlChanged ? 1 : 0,
          ch.releaseGroup || '',
          ch.uploadedAt || ''
        );
      }

      // Mark chapters not in new scrape as "removed_from_remote" but DON'T delete them
      for (const existing of existingChapters) {
        if (!newUrls.has(existing.url)) {
          // This chapter wasn't in the new scrape - mark it but keep it
          updateRemoved.run(id, existing.url);
          console.log(`[DB Update] Marked chapter ${existing.number} as removed_from_remote (preserving data)`);
        }
      }
    }

    // Update duplicate chapters if provided
    if (updates.duplicateChapters) {
      db.prepare('DELETE FROM duplicate_chapters WHERE bookmark_id = ?').run(id);
      const insertDup = db.prepare('INSERT INTO duplicate_chapters (bookmark_id, chapter_number, count) VALUES (?, ?, ?)');
      for (const dup of updates.duplicateChapters) {
        insertDup.run(id, dup.number, dup.count || 2);
      }
    }

    // Update new duplicates if provided
    if (updates.newDuplicates) {
      db.prepare('DELETE FROM new_duplicates WHERE bookmark_id = ?').run(id);
      const insertNewDup = db.prepare('INSERT INTO new_duplicates (bookmark_id, chapter_number) VALUES (?, ?)');
      for (const num of updates.newDuplicates) {
        insertNewDup.run(id, num);
      }
    }

    // Update updated chapters if provided
    if (updates.updatedChapters) {
      db.prepare('DELETE FROM updated_chapters WHERE bookmark_id = ?').run(id);
      const insertUpd = db.prepare('INSERT INTO updated_chapters (bookmark_id, chapter_number, old_url, new_urls, type, detected_at) VALUES (?, ?, ?, ?, ?, ?)');
      for (const upd of updates.updatedChapters) {
        insertUpd.run(id, upd.number, upd.oldUrl, JSON.stringify(upd.newUrls || []), upd.type, upd.detectedAt);
      }
    }

    // Update downloaded chapters if provided (for scan-local sync)
    if (updates.downloadedChapters !== undefined) {
      db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ?').run(id);
      const insertDownloaded = db.prepare('INSERT INTO downloaded_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
      // Deduplicate chapter numbers to avoid UNIQUE constraint errors
      const uniqueChapters = [...new Set(updates.downloadedChapters)];
      for (const num of uniqueChapters) {
        insertDownloaded.run(id, num);
      }
    }

    // Update downloaded versions if provided (for scan-local sync)
    if (updates.downloadedVersions !== undefined) {
      db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ?').run(id);
      const insertVersion = db.prepare('INSERT INTO downloaded_versions (bookmark_id, chapter_number, url) VALUES (?, ?, ?)');
      for (const [numStr, urls] of Object.entries(updates.downloadedVersions)) {
        const num = parseFloat(numStr);
        const urlArray = Array.isArray(urls) ? urls : [urls];
        for (const url of urlArray) {
          insertVersion.run(id, num, url);
        }
      }
    }

    // Update deleted chapter URLs if provided
    if (updates.deletedChapterUrls !== undefined) {
      db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ?').run(id);
      const insertDeleted = db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)');
      for (const url of updates.deletedChapterUrls) {
        insertDeleted.run(id, url);
      }
    }

    // Update read chapters if provided
    if (updates.readChapters !== undefined) {
      db.prepare('DELETE FROM read_chapters WHERE bookmark_id = ?').run(id);
      const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
      for (const num of updates.readChapters) {
        insertRead.run(id, num);
      }
    }

    return { success: true, message: 'Bookmark updated', bookmark: this.getById(id) };
  },

  remove(id) {
    const db = getDb();
    const bookmark = this.getById(id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    // CASCADE will handle related tables
    db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
    return { success: true, message: 'Bookmark removed', bookmark };
  },

  markChapterDownloaded(id, chapterNumber, chapterUrl = null) {
    const db = getDb();

    db.prepare('INSERT OR IGNORE INTO downloaded_chapters (bookmark_id, chapter_number) VALUES (?, ?)').run(id, chapterNumber);

    if (chapterUrl) {
      db.prepare('INSERT OR IGNORE INTO downloaded_versions (bookmark_id, chapter_number, url) VALUES (?, ?, ?)').run(id, chapterNumber, chapterUrl);
    }

    // Remove from new duplicates
    db.prepare('DELETE FROM new_duplicates WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);

    db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

    return { success: true };
  },

  markChapterDeleted(id, chapterNumber, chapterUrl) {
    const db = getDb();

    db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);

    if (chapterUrl) {
      db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)').run(id, chapterUrl);
    }

    db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

    return { success: true };
  },

  clearDeletedUrl(id, url) {
    const db = getDb();
    db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ? AND url = ?').run(id, url);
    return { success: true };
  },

  updateReadingProgress(id, chapterNumber, page, totalPages) {
    const db = getDb();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT OR REPLACE INTO reading_progress (bookmark_id, chapter_number, page, total_pages, last_read)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, chapterNumber, page, totalPages, now);

    db.prepare('UPDATE bookmarks SET last_read_chapter = ?, last_read_at = ?, updated_at = ? WHERE id = ?')
      .run(chapterNumber, now, now, id);

    // Auto-mark as read if on last page
    if (page >= totalPages) {
      db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)').run(id, chapterNumber);
    }

    return { success: true };
  },

  markChapterRead(id, chapterNumber, isRead = true) {
    const db = getDb();

    if (isRead) {
      db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)').run(id, chapterNumber);
    } else {
      db.prepare('DELETE FROM read_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);
    }

    db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

    return { success: true };
  },

  markChaptersReadBelow(id, chapterNumber) {
    const db = getDb();

    const chapters = db.prepare('SELECT DISTINCT number FROM chapters WHERE bookmark_id = ? AND number <= ?').all(id, chapterNumber);

    const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)');

    db.transaction(() => {
      for (const ch of chapters) {
        insertRead.run(id, ch.number);
      }
    })();

    db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

    return { success: true, count: chapters.length };
  },

  clearUpdatedChapter(id, chapterNumber) {
    const db = getDb();
    db.prepare('DELETE FROM updated_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);
    return { success: true };
  },

  setBookmarkCategories(id, categoryNames) {
    const db = getDb();

    // Clear existing
    db.prepare('DELETE FROM bookmark_categories WHERE bookmark_id = ?').run(id);

    // Add new
    const insertCat = db.prepare(`
      INSERT OR IGNORE INTO bookmark_categories (bookmark_id, category_id)
      SELECT ?, id FROM categories WHERE name = ?
    `);

    for (const name of categoryNames) {
      insertCat.run(id, name);
    }

    db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

    return { success: true, bookmark: this.getById(id) };
  }
};

// ==================== CATEGORY OPERATIONS ====================

export const categoryDb = {
  getAll() {
    const db = getDb();
    return db.prepare('SELECT name FROM categories ORDER BY name').all().map(r => r.name);
  },

  add(name) {
    const db = getDb();
    try {
      db.prepare('INSERT INTO categories (name) VALUES (?)').run(name.trim());
      return { success: true, category: name.trim() };
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, message: 'Category already exists' };
      }
      throw e;
    }
  },

  delete(name) {
    const db = getDb();
    db.prepare('DELETE FROM categories WHERE name = ?').run(name);
    return { success: true };
  }
};

// ==================== TROPHY PAGES OPERATIONS ====================

export const trophyDb = {
  getAll() {
    const db = getDb();
    const rows = db.prepare('SELECT bookmark_id, chapter_number, page_index, is_single, pages FROM trophy_pages').all();

    const result = {};
    for (const row of rows) {
      if (!result[row.bookmark_id]) result[row.bookmark_id] = {};
      if (!result[row.bookmark_id][row.chapter_number]) result[row.bookmark_id][row.chapter_number] = {};
      result[row.bookmark_id][row.chapter_number][row.page_index] = {
        isSingle: !!row.is_single,
        pages: JSON.parse(row.pages || '[]')
      };
    }
    return result;
  },

  getForChapter(bookmarkId, chapterNumber) {
    const db = getDb();
    const rows = db.prepare('SELECT page_index, is_single, pages FROM trophy_pages WHERE bookmark_id = ? AND chapter_number = ?')
      .all(bookmarkId, chapterNumber);

    const result = {};
    for (const row of rows) {
      result[row.page_index] = {
        isSingle: !!row.is_single,
        pages: JSON.parse(row.pages || '[]')
      };
    }
    return result;
  },

  save(bookmarkId, chapterNumber, trophyMap) {
    const db = getDb();

    db.prepare('DELETE FROM trophy_pages WHERE bookmark_id = ? AND chapter_number = ?').run(bookmarkId, chapterNumber);

    const insert = db.prepare('INSERT INTO trophy_pages (bookmark_id, chapter_number, page_index, is_single, pages) VALUES (?, ?, ?, ?, ?)');

    db.transaction(() => {
      for (const [pageIdx, info] of Object.entries(trophyMap)) {
        insert.run(bookmarkId, chapterNumber, parseInt(pageIdx), info.isSingle ? 1 : 0, JSON.stringify(info.pages || []));
      }
    })();

    return { success: true };
  },

  saveAll(trophyData) {
    const db = getDb();

    db.prepare('DELETE FROM trophy_pages').run();

    const insert = db.prepare('INSERT INTO trophy_pages (bookmark_id, chapter_number, page_index, is_single, pages) VALUES (?, ?, ?, ?, ?)');

    db.transaction(() => {
      for (const [mangaId, chapters] of Object.entries(trophyData)) {
        for (const [chNum, pages] of Object.entries(chapters)) {
          for (const [pageIdx, info] of Object.entries(pages)) {
            insert.run(mangaId, parseFloat(chNum), parseInt(pageIdx), info.isSingle ? 1 : 0, JSON.stringify(info.pages || []));
          }
        }
      }
    })();

    return { success: true };
  }
};

// ==================== CHAPTER SETTINGS OPERATIONS ====================

export const chapterSettingsDb = {
  getAll() {
    const db = getDb();
    const rows = db.prepare('SELECT bookmark_id, chapter_number, first_page_single, last_page_single, locked FROM chapter_settings').all();

    const result = {};
    for (const row of rows) {
      if (!result[row.bookmark_id]) result[row.bookmark_id] = {};
      result[row.bookmark_id][row.chapter_number] = {
        firstPageSingle: !!row.first_page_single,
        lastPageSingle: !!row.last_page_single,
        locked: !!row.locked
      };
    }
    return result;
  },

  save(bookmarkId, chapterNumber, settings) {
    const db = getDb();

    db.prepare(`
      INSERT OR REPLACE INTO chapter_settings (bookmark_id, chapter_number, first_page_single, last_page_single, locked)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      bookmarkId,
      chapterNumber,
      settings.firstPageSingle ? 1 : 0,
      settings.lastPageSingle ? 1 : 0,
      settings.locked ? 1 : 0
    );

    return { success: true };
  },

  saveAll(settingsData) {
    const db = getDb();

    db.prepare('DELETE FROM chapter_settings').run();

    const insert = db.prepare('INSERT INTO chapter_settings (bookmark_id, chapter_number, first_page_single, last_page_single, locked) VALUES (?, ?, ?, ?, ?)');

    db.transaction(() => {
      for (const [mangaId, chapters] of Object.entries(settingsData)) {
        for (const [chNum, settings] of Object.entries(chapters)) {
          insert.run(
            mangaId,
            parseFloat(chNum),
            settings.firstPageSingle ? 1 : 0,
            settings.lastPageSingle ? 1 : 0,
            settings.locked ? 1 : 0
          );
        }
      }
    })();

    return { success: true };
  }
};

// ==================== FAVORITES OPERATIONS ====================

export const favoritesDb = {
  getAll() {
    const db = getDb();

    const lists = db.prepare('SELECT id, name FROM favorite_lists ORDER BY sort_order').all();
    const listOrder = lists.map(l => l.name);

    const favorites = {};
    for (const list of lists) {
      const items = db.prepare(`
        SELECT bookmark_id, manga_title, chapter_number, chapter_url, page_indices,
               display_mode, display_side, image_paths, created_at
        FROM favorites WHERE list_id = ? ORDER BY id
      `).all(list.id);

      favorites[list.name] = items.map(item => ({
        mangaId: item.bookmark_id,
        mangaTitle: item.manga_title,
        chapterNum: item.chapter_number,
        chapterUrl: item.chapter_url,
        pageIndices: JSON.parse(item.page_indices || '[]'),
        displayMode: item.display_mode,
        displaySide: item.display_side,
        imagePaths: JSON.parse(item.image_paths || '[]'),
        createdAt: item.created_at
      }));
    }

    return { favorites, listOrder };
  },

  createList(name) {
    const db = getDb();
    try {
      const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM favorite_lists').get();
      db.prepare('INSERT INTO favorite_lists (name, sort_order) VALUES (?, ?)').run(name, (maxOrder?.max || 0) + 1);
      return { success: true };
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'List already exists' };
      }
      throw e;
    }
  },

  deleteList(name) {
    const db = getDb();
    db.prepare('DELETE FROM favorite_lists WHERE name = ?').run(name);
    return { success: true };
  },

  renameList(oldName, newName) {
    const db = getDb();
    try {
      db.prepare('UPDATE favorite_lists SET name = ? WHERE name = ?').run(newName, oldName);
      return { success: true };
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return { success: false, error: 'A list with that name already exists' };
      }
      throw e;
    }
  },

  addFavorite(listName, favorite) {
    const db = getDb();

    // Get or create list
    let list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);
    if (!list) {
      const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM favorite_lists').get();
      db.prepare('INSERT INTO favorite_lists (name, sort_order) VALUES (?, ?)').run(listName, (maxOrder?.max || 0) + 1);
      list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);
    }

    db.prepare(`
      INSERT INTO favorites (list_id, bookmark_id, manga_title, chapter_number, chapter_url, 
                            page_indices, display_mode, display_side, image_paths, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      list.id,
      favorite.mangaId,
      favorite.mangaTitle,
      favorite.chapterNum,
      favorite.chapterUrl,
      JSON.stringify(favorite.pageIndices || []),
      favorite.displayMode,
      favorite.displaySide,
      JSON.stringify(favorite.imagePaths || []),
      new Date().toISOString()
    );

    return { success: true };
  },

  removeFavorite(listName, index) {
    const db = getDb();

    const list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);
    if (!list) return { success: false, error: 'List not found' };

    // Get all favorites for this list to find the one at index
    const items = db.prepare('SELECT id FROM favorites WHERE list_id = ? ORDER BY id').all(list.id);
    if (index < 0 || index >= items.length) return { success: false, error: 'Invalid index' };

    db.prepare('DELETE FROM favorites WHERE id = ?').run(items[index].id);
    return { success: true };
  },

  saveAll(data) {
    const db = getDb();

    db.transaction(() => {
      db.prepare('DELETE FROM favorites').run();
      db.prepare('DELETE FROM favorite_lists').run();

      const insertList = db.prepare('INSERT INTO favorite_lists (name, sort_order) VALUES (?, ?)');
      const insertFav = db.prepare(`
        INSERT INTO favorites (list_id, bookmark_id, manga_title, chapter_number, chapter_url,
                              page_indices, display_mode, display_side, image_paths, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const listOrder = data.listOrder || Object.keys(data.favorites || {});
      let order = 0;

      for (const listName of listOrder) {
        insertList.run(listName, order++);
        const list = db.prepare('SELECT id FROM favorite_lists WHERE name = ?').get(listName);

        for (const fav of (data.favorites?.[listName] || [])) {
          insertFav.run(
            list.id,
            fav.mangaId,
            fav.mangaTitle,
            fav.chapterNum,
            fav.chapterUrl,
            JSON.stringify(fav.pageIndices || []),
            fav.displayMode,
            fav.displaySide,
            JSON.stringify(fav.imagePaths || []),
            fav.createdAt || new Date().toISOString()
          );
        }
      }
    })();

    return { success: true };
  }
};

// ==================== READER SETTINGS OPERATIONS ====================

export const readerSettingsDb = {
  get(key) {
    const db = getDb();
    const row = db.prepare('SELECT value FROM reader_settings WHERE key = ?').get(key);
    return row ? JSON.parse(row.value) : null;
  },

  set(key, value) {
    const db = getDb();
    db.prepare('INSERT OR REPLACE INTO reader_settings (key, value) VALUES (?, ?)').run(key, JSON.stringify(value));
    return { success: true };
  },

  getAll() {
    const db = getDb();
    const rows = db.prepare('SELECT key, value FROM reader_settings').all();
    const result = {};
    for (const row of rows) {
      result[row.key] = JSON.parse(row.value);
    }
    return result;
  }
};

// ==================== ARTIST OPERATIONS ====================

export const artistDb = {
  getAll() {
    const db = getDb();
    return db.prepare(`
      SELECT a.*, COUNT(ba.bookmark_id) as bookmarkCount 
      FROM artists a 
      LEFT JOIN bookmark_artists ba ON a.id = ba.artist_id 
      GROUP BY a.id 
      ORDER BY a.name
    `).all();
  },

  getById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM artists WHERE id = ?').get(id);
  },

  getByName(name) {
    const db = getDb();
    return db.prepare('SELECT * FROM artists WHERE name = ?').get(name);
  },

  create(name) {
    const db = getDb();
    const normalized = name.trim();

    // Check if exists
    const existing = this.getByName(normalized);
    if (existing) return existing;

    const result = db.prepare('INSERT INTO artists (name) VALUES (?)').run(normalized);
    return { id: result.lastInsertRowid, name: normalized };
  },

  delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM artists WHERE id = ?').run(id);
    return { success: true };
  },

  rename(id, newName) {
    const db = getDb();
    db.prepare('UPDATE artists SET name = ? WHERE id = ?').run(newName.trim(), id);
    return { success: true };
  },

  // Get artists for a bookmark
  getForBookmark(bookmarkId) {
    const db = getDb();
    return db.prepare(`
      SELECT a.* FROM artists a
      JOIN bookmark_artists ba ON a.id = ba.artist_id
      WHERE ba.bookmark_id = ?
      ORDER BY a.name
    `).all(bookmarkId);
  },

  // Set artists for a bookmark
  setForBookmark(bookmarkId, artistNames) {
    const db = getDb();

    db.transaction(() => {
      // Clear existing
      db.prepare('DELETE FROM bookmark_artists WHERE bookmark_id = ?').run(bookmarkId);

      // Add new ones
      const insertArtist = db.prepare('INSERT OR IGNORE INTO artists (name) VALUES (?)');
      const getArtist = db.prepare('SELECT id FROM artists WHERE name = ?');
      const linkArtist = db.prepare('INSERT INTO bookmark_artists (bookmark_id, artist_id) VALUES (?, ?)');

      for (const name of artistNames) {
        const normalized = name.trim();
        if (!normalized) continue;

        insertArtist.run(normalized);
        const artist = getArtist.get(normalized);
        if (artist) {
          linkArtist.run(bookmarkId, artist.id);
        }
      }
    })();

    return { success: true };
  },

  // Add a single artist to a bookmark
  addToBookmark(bookmarkId, artistName) {
    const db = getDb();
    const normalized = artistName.trim();

    db.prepare('INSERT OR IGNORE INTO artists (name) VALUES (?)').run(normalized);
    const artist = db.prepare('SELECT id FROM artists WHERE name = ?').get(normalized);

    if (artist) {
      db.prepare('INSERT OR IGNORE INTO bookmark_artists (bookmark_id, artist_id) VALUES (?, ?)').run(bookmarkId, artist.id);
    }

    return { success: true };
  },

  // Remove an artist from a bookmark
  removeFromBookmark(bookmarkId, artistId) {
    const db = getDb();
    db.prepare('DELETE FROM bookmark_artists WHERE bookmark_id = ? AND artist_id = ?').run(bookmarkId, artistId);
    return { success: true };
  },

  // Get all bookmarks by artist
  getBookmarksByArtist(artistId) {
    const db = getDb();
    return db.prepare(`
      SELECT b.* FROM bookmarks b
      JOIN bookmark_artists ba ON b.id = ba.bookmark_id
      WHERE ba.artist_id = ?
      ORDER BY b.title
    `).all(artistId);
  }
};

// Series database operations
export const seriesDb = {
  // Create a new series
  create(title, alias = null) {
    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO series (id, title, alias, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, title, alias, now, now);

    return { id, title, alias, created_at: now, updated_at: now };
  },

  // Get all series with entry counts and cover info
  getAll() {
    const db = getDb();
    const series = db.prepare(`
      SELECT s.*,
        (SELECT COUNT(*) FROM series_entries WHERE series_id = s.id) as entry_count,
        (SELECT COUNT(*) FROM series_entries se 
         JOIN chapters c ON c.bookmark_id = se.bookmark_id
         WHERE se.series_id = s.id) as total_chapters
      FROM series s
      ORDER BY s.title
    `).all();

    // Get cover for each series
    for (const s of series) {
      if (s.cover_entry_id) {
        const coverEntry = db.prepare(`
          SELECT b.id as bookmark_id, b.cover, b.local_cover, b.title, b.alias 
          FROM series_entries se
          JOIN bookmarks b ON se.bookmark_id = b.id
          WHERE se.id = ?
        `).get(s.cover_entry_id);
        if (coverEntry) {
          s.cover = coverEntry.local_cover || coverEntry.cover;
          s.coverBookmarkId = coverEntry.bookmark_id;
          s.coverTitle = coverEntry.alias || coverEntry.title;
        }
      } else {
        // Use first entry's cover
        const firstEntry = db.prepare(`
          SELECT b.id as bookmark_id, b.cover, b.local_cover, b.title, b.alias 
          FROM series_entries se
          JOIN bookmarks b ON se.bookmark_id = b.id
          WHERE se.series_id = ?
          ORDER BY se.entry_order, se.created_at
          LIMIT 1
        `).get(s.id);
        if (firstEntry) {
          s.cover = firstEntry.local_cover || firstEntry.cover;
          s.coverBookmarkId = firstEntry.bookmark_id;
          s.coverTitle = firstEntry.alias || firstEntry.title;
        }
      }
    }

    return series;
  },

  // Get a series by ID with all entries
  getById(id) {
    const db = getDb();
    const series = db.prepare('SELECT * FROM series WHERE id = ?').get(id);
    if (!series) return null;

    // Get all entries with bookmark data
    series.entries = db.prepare(`
      SELECT se.*, b.id as bookmark_id, b.title, b.alias, b.cover, b.local_cover, 
             b.total_chapters, b.website,
             (SELECT COUNT(*) FROM chapters WHERE bookmark_id = b.id) as chapter_count,
             (SELECT COUNT(*) FROM downloaded_chapters WHERE bookmark_id = b.id) as downloaded_count
      FROM series_entries se
      JOIN bookmarks b ON se.bookmark_id = b.id
      WHERE se.series_id = ?
      ORDER BY se.entry_order, se.created_at
    `).all(id);

    // Get downloaded chapters for each entry
    for (const entry of series.entries) {
      const downloaded = db.prepare(
        'SELECT chapter_number FROM downloaded_chapters WHERE bookmark_id = ?'
      ).all(entry.bookmark_id);
      entry.downloadedChapters = downloaded.map(d => d.chapter_number);
      // Map local_cover to localCover for frontend compatibility
      entry.localCover = entry.local_cover;
    }

    // Calculate totals
    series.entry_count = series.entries.length;
    series.total_chapters = series.entries.reduce((sum, e) => sum + (e.chapter_count || 0), 0);
    series.downloaded_chapters = series.entries.reduce((sum, e) => sum + (e.downloadedChapters?.length || 0), 0);

    // Get cover
    if (series.cover_entry_id) {
      const coverEntry = series.entries.find(e => e.id === series.cover_entry_id);
      if (coverEntry) {
        series.cover = coverEntry.localCover || coverEntry.cover;
      }
    } else if (series.entries.length > 0) {
      series.cover = series.entries[0].localCover || series.entries[0].cover;
    }

    return series;
  },

  // Update series
  update(id, data) {
    const db = getDb();
    const updates = [];
    const values = [];

    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.alias !== undefined) {
      updates.push('alias = ?');
      values.push(data.alias);
    }
    if (data.cover_entry_id !== undefined) {
      updates.push('cover_entry_id = ?');
      values.push(data.cover_entry_id);
    }

    if (updates.length > 0) {
      updates.push('updated_at = ?');
      values.push(new Date().toISOString());
      values.push(id);

      db.prepare(`UPDATE series SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    return this.getById(id);
  },

  // Delete series (entries will be deleted by cascade)
  delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM series WHERE id = ?').run(id);
    return { success: true };
  },

  // Add a bookmark to a series
  addEntry(seriesId, bookmarkId, order = null) {
    const db = getDb();
    const id = generateId();
    const now = new Date().toISOString();

    // If no order specified, put at the end
    if (order === null) {
      const maxOrder = db.prepare(`
        SELECT MAX(entry_order) as max_order FROM series_entries WHERE series_id = ?
      `).get(seriesId);
      order = (maxOrder?.max_order || 0) + 1;
    }

    db.prepare(`
      INSERT INTO series_entries (id, series_id, bookmark_id, entry_order, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, seriesId, bookmarkId, order, now);

    // Update series timestamp
    db.prepare('UPDATE series SET updated_at = ? WHERE id = ?').run(now, seriesId);

    return { id, series_id: seriesId, bookmark_id: bookmarkId, entry_order: order };
  },

  // Remove an entry from a series
  removeEntry(entryId) {
    const db = getDb();
    const entry = db.prepare('SELECT series_id FROM series_entries WHERE id = ?').get(entryId);
    if (entry) {
      db.prepare('DELETE FROM series_entries WHERE id = ?').run(entryId);
      db.prepare('UPDATE series SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), entry.series_id);
    }
    return { success: true };
  },

  // Reorder entries in a series
  reorderEntries(seriesId, entryIds) {
    const db = getDb();
    const now = new Date().toISOString();

    const updateStmt = db.prepare('UPDATE series_entries SET entry_order = ? WHERE id = ?');
    db.transaction(() => {
      entryIds.forEach((entryId, index) => {
        updateStmt.run(index, entryId);
      });
      db.prepare('UPDATE series SET updated_at = ? WHERE id = ?').run(now, seriesId);
    })();

    return { success: true };
  },

  // Get series for a bookmark
  getSeriesForBookmark(bookmarkId) {
    const db = getDb();
    return db.prepare(`
      SELECT s.*, se.id as entry_id, se.entry_order
      FROM series s
      JOIN series_entries se ON s.id = se.series_id
      WHERE se.bookmark_id = ?
    `).all(bookmarkId);
  },

  // Get bookmarks not in any series (for adding to series)
  getBookmarksNotInSeries() {
    const db = getDb();
    const bookmarks = db.prepare(`
      SELECT b.id, b.title, b.alias, b.cover, b.local_cover
      FROM bookmarks b
      WHERE b.id NOT IN (SELECT bookmark_id FROM series_entries)
      ORDER BY b.title
    `).all();
    // Map local_cover to localCover for frontend
    return bookmarks.map(b => ({ ...b, localCover: b.local_cover }));
  },

  // Set cover entry for series
  setCoverEntry(seriesId, entryId) {
    const db = getDb();
    db.prepare('UPDATE series SET cover_entry_id = ?, updated_at = ? WHERE id = ?')
      .run(entryId, new Date().toISOString(), seriesId);
    return { success: true };
  }
};

export default {
  initDatabase,
  getDb,
  closeDatabase,
  migrateFromJson,
  bookmarkDb,
  categoryDb,
  trophyDb,
  chapterSettingsDb,
  favoritesDb,
  readerSettingsDb,
  artistDb,
  seriesDb
};
