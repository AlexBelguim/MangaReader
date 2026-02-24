// Re-export barrel — all consumers continue importing from here unchanged.
export { initDatabase, getDb, generateId, closeDatabase } from './db/connection.js';
export { migrateFromJson } from './db/migrate-json.js';
export { bookmarkDb } from './db/bookmarks.js';
export { categoryDb } from './db/categories.js';
export { trophyDb } from './db/trophies.js';
export { chapterSettingsDb } from './db/chapter-settings.js';
export { favoritesDb } from './db/favorites.js';
export { readerSettingsDb } from './db/reader-settings.js';
export { artistDb } from './db/artists.js';
export { seriesDb } from './db/series.js';

// Default export for backward compatibility
import { initDatabase, getDb, closeDatabase } from './db/connection.js';
import { migrateFromJson } from './db/migrate-json.js';
import { bookmarkDb } from './db/bookmarks.js';
import { categoryDb } from './db/categories.js';
import { trophyDb } from './db/trophies.js';
import { chapterSettingsDb } from './db/chapter-settings.js';
import { favoritesDb } from './db/favorites.js';
import { readerSettingsDb } from './db/reader-settings.js';
import { artistDb } from './db/artists.js';
import { seriesDb } from './db/series.js';

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
