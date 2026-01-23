import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { scraperFactory } from './scrapers/templates/index.js';
import { ComixScraper } from './scrapers/comix.js';
import { downloader } from './downloader.js';
import { CONFIG } from './config.js';
import { requestLogger, logger } from './logger.js';
import {
  initDatabase,
  migrateFromJson,
  getDb,
  trophyDb,
  chapterSettingsDb,
  favoritesDb,
  readerSettingsDb,
  artistDb,
  seriesDb,
  bookmarkDb,
  categoryDb,
  closeDatabase
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = CONFIG.port || 3000;

// Configure upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
// Middleware
app.use(express.json());
app.use(requestLogger);

// Public Cover Image Route (Exempt from Auth)
app.get('/api/public/covers/:id/:filename', async (req, res) => {
  console.log(`[Debug] Public cover request: ${req.params.id} / ${req.params.filename}`);
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) return res.status(404).send('Not found');

    const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
    const filePath = path.join(coverDir, req.params.filename);

    if (await fs.pathExists(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Cover not found');
    }
  } catch (e) {
    console.error(`Error serving cover: ${e.message}`);
    res.status(500).send('Error');
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use('/covers', express.static(path.join(CONFIG.dataDir, 'covers')));
app.use('/downloads', express.static(CONFIG.downloadsDir));

import { queue } from './queue.js';
const activeDownloads = new Map();
const taskQueue = queue;
import { auth } from './middleware/auth.js';
import { login } from './controllers/auth_controller.js';
import { validate, schemas } from './middleware/validation.js';

// Init DB and Queue
try {
  const db = getDb();
  queue.recover(); // Recover any stuck jobs
} catch (e) {
  logger.error(`Failed to initialize database: ${e.message}`);
  process.exit(1);
}

// Register Queue Processors
queue.registerProcessor('scrape', async (jobData, jobId) => {
  const { url } = jobData;
  logger.info(`[Queue-Worker] Processing scrape job ${jobId} for ${url}`);

  const scraper = scraperFactory.getScraperForUrl(url);
  if (!scraper) {
    throw new Error(`No scraper found for URL: ${url}`);
  }

  const mangaInfo = await scraper.getMangaInfo(url);
  logger.info(`[Queue-Worker] Scraped info: ${mangaInfo.title}`);

  const result = await bookmarkDb.add(mangaInfo);

  // Download cover locally
  if (result.success && mangaInfo.cover) {
    try {
      let coverUrl = mangaInfo.cover;
      if (coverUrl.startsWith('//')) {
        coverUrl = 'https:' + coverUrl;
      }
      const coverResult = await downloader.downloadCover(
        mangaInfo.title,
        coverUrl,
        result.bookmark.alias
      );
      if (coverResult) {
        await bookmarkDb.update(result.bookmark.id, {
          localCover: coverResult.path,
          remoteCover: coverUrl
        });
      }
    } catch (err) {
      logger.warn(`[Queue-Worker] Failed to download cover: ${err.message}`);
    }
  }

  // Save artists
  if (result.success && mangaInfo.artists && mangaInfo.artists.length > 0) {
    artistDb.setForBookmark(result.bookmark.id, mangaInfo.artists);
  }

  return result;
});

// API Routes

// Public Routes
app.post('/api/auth/login', login);



// Protected Routes Middleware
app.use('/api', auth);

// Auth


// Queue Status
app.get('/api/queue/status', (req, res) => {
  res.json({
    active: queue.getActiveJobs().length
  });
});

app.get('/api/queue/tasks', (req, res) => {
  res.json(queue.getActiveJobs());
});

// Get all bookmarks
app.get('/api/bookmarks', async (req, res) => {
  try {
    const bookmarks = await bookmarkDb.getAll();

    // For each bookmark, add artists and local source info
    for (const bookmark of bookmarks) {
      // Add artists
      const artists = artistDb.getForBookmark(bookmark.id);
      bookmark.artists = artists.map(a => a.name);

      // For local-source bookmarks, add folder/cbz counts
      if (bookmark.source === 'local' || bookmark.url?.startsWith('local://')) {
        bookmark.source = 'local'; // Ensure source is set
        try {
          const chapters = await downloader.scanLocalChapters(bookmark.title, bookmark.alias);
          const cbzFiles = await downloader.findCbzFiles(bookmark.title, bookmark.alias);
          bookmark.folderChapters = chapters.length;
          bookmark.cbzChapters = cbzFiles.length;
        } catch (e) {
          bookmark.folderChapters = 0;
          bookmark.cbzChapters = 0;
        }
      }
    }

    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single bookmark
app.get('/api/bookmarks/:id', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }
    // Add artists to the response
    const artists = artistDb.getForBookmark(bookmark.id);
    bookmark.artists = artists.map(a => a.name);

    // Add downloaded page counts
    try {
      if (bookmark.source === 'local' || bookmark.url?.startsWith('local://')) {
        // Reuse scanLocalChapters for local scan, but convert to map
        const chapters = await downloader.scanLocalChapters(bookmark.title, bookmark.alias);
        bookmark.downloadedPageCounts = {};
        chapters.forEach(c => {
          if (c.imageCount > 0) bookmark.downloadedPageCounts[c.number] = c.imageCount;
        });
      } else {
        // For web sources, scan folders
        bookmark.downloadedPageCounts = await downloader.getDownloadedChapterPageCounts(bookmark.title, bookmark.alias);
      }
    } catch (e) {
      console.warn(`Failed to get page counts for ${bookmark.title}: ${e.message}`);
      bookmark.downloadedPageCounts = {};
    }

    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get paginated chapters for a bookmark (for performance with large chapter lists)
app.get('/api/bookmarks/:id/chapters', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Parse pagination params
    const page = Math.max(0, parseInt(req.query.page) || 0);
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 50));
    const filter = req.query.filter || 'all'; // 'all', 'downloaded', 'unread'

    let chapters = bookmark.chapters || [];

    // Apply filter
    const downloadedChapters = new Set(bookmark.downloadedChapters || []);
    const readChapters = new Set(bookmark.readChapters || []);
    const deletedUrls = new Set(bookmark.deletedChapterUrls || []);

    if (filter === 'downloaded') {
      chapters = chapters.filter(c => downloadedChapters.has(c.number) && !deletedUrls.has(c.url));
    } else if (filter === 'unread') {
      chapters = chapters.filter(c => !readChapters.has(c.number) && !deletedUrls.has(c.url));
    } else {
      // Filter out hidden chapters
      chapters = chapters.filter(c => !deletedUrls.has(c.url));
    }

    // Sort by chapter number descending (newest first)
    chapters.sort((a, b) => b.number - a.number);

    // Paginate
    const totalChapters = chapters.length;
    const totalPages = Math.ceil(totalChapters / limit);
    const startIndex = page * limit;
    const paginatedChapters = chapters.slice(startIndex, startIndex + limit);

    res.json({
      chapters: paginatedChapters,
      pagination: {
        page,
        limit,
        totalChapters,
        totalPages,
        hasMore: page < totalPages - 1
      },
      // Include summary stats
      stats: {
        downloaded: downloadedChapters.size,
        read: readChapters.size,
        total: bookmark.chapters?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new manga
app.post('/api/bookmarks', validate(schemas.addBookmark), async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`[API] Adding manga from: ${url}`);

    const scraper = scraperFactory.getScraperForUrl(url);
    if (!scraper) {
      return res.status(400).json({
        error: 'Unsupported website',
        supportedSites: scraperFactory.getSupportedWebsites()
      });
    }

    // Queue the scrape operation
    const job = queue.add('scrape', { url });

    logger.info(`[API] Scrape job queued: ${job.id}`);

    // Return immediately with job ID (User can poll status)
    res.json({
      success: true,
      message: 'Scrape job queued',
      jobId: job.id,
      status: 'pending'
    });


  } catch (error) {
    console.error(`[API] Error adding manga:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Update bookmark (rename/alias)
app.patch('/api/bookmarks/:id', validate(schemas.renameBookmark), async (req, res) => {
  try {
    const { alias: rawAlias, readChapters } = req.body;
    const bookmarkId = req.params.id;

    // Get current bookmark
    const currentBookmark = bookmarkDb.getById(bookmarkId);
    if (!currentBookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // If only updating readChapters (no alias change)
    if (readChapters !== undefined && rawAlias === undefined) {
      const result = bookmarkDb.update(bookmarkId, { readChapters });
      return res.json(result);
    }

    // Normalize alias: empty string becomes null
    const alias = rawAlias?.trim() || null;

    console.log(`[Rename] Bookmark: ${currentBookmark.title}`);
    console.log(`[Rename] Old alias: "${currentBookmark.alias}" -> New alias: "${alias}"`);

    // Rename folder if alias is changing
    const oldAlias = currentBookmark.alias;
    const newAlias = alias;

    if (oldAlias !== newAlias) {
      console.log(`[Rename] Alias changed, attempting folder rename...`);
      const folderResult = await downloader.renameMangaFolder(
        currentBookmark.title,
        oldAlias,
        newAlias
      );

      console.log(`[Rename] Folder result:`, folderResult);

      if (!folderResult.success && folderResult.message !== 'No existing folder to rename') {
        return res.status(400).json({ error: folderResult.message });
      }

      // Also update localCover path if folder was renamed
      if (folderResult.renamed && currentBookmark.localCover) {
        const oldFolderName = folderResult.oldFolderName;
        const newFolderName = folderResult.newFolderName;
        const newLocalCover = currentBookmark.localCover.replace(
          `/downloads/${encodeURIComponent(oldFolderName)}/`,
          `/downloads/${encodeURIComponent(newFolderName)}/`
        );
        console.log(`[Rename] Updating localCover: ${currentBookmark.localCover} -> ${newLocalCover}`);
        // Update both alias and localCover
        const result = bookmarkDb.update(bookmarkId, { alias, localCover: newLocalCover });
        return res.json({ ...result, folderRenamed: true });
      }

      // Update alias in database
      const result = bookmarkDb.update(bookmarkId, { alias });
      return res.json({ ...result, folderRenamed: folderResult.renamed });
    }

    const result = bookmarkDb.update(bookmarkId, { alias });
    res.json(result);
  } catch (error) {
    console.error(`[Rename] Error:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Hide all non-downloaded versions for chapters with at least one downloaded version
app.post('/api/bookmarks/:id/hide-undownloaded-versions', async (req, res) => {
  try {
    const bookmark = bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const db = getDb();
    const downloadedVersions = bookmark.downloadedVersions || {};
    const chapters = bookmark.chapters || [];
    const existingHidden = new Set(bookmark.deletedChapterUrls || []);

    let hiddenCount = 0;

    // For each chapter number with downloaded versions
    for (const [chapterNum, downloadedUrls] of Object.entries(downloadedVersions)) {
      const num = parseFloat(chapterNum);
      const downloadedSet = new Set(Array.isArray(downloadedUrls) ? downloadedUrls : [downloadedUrls]);

      // Find all versions of this chapter
      const allVersions = chapters.filter(c => c.number === num);

      // Hide non-downloaded versions
      for (const version of allVersions) {
        if (!downloadedSet.has(version.url) && !existingHidden.has(version.url)) {
          db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)')
            .run(bookmark.id, version.url);
          hiddenCount++;
        }
      }
    }

    console.log(`[Hide Versions] Hidden ${hiddenCount} undownloaded versions for ${bookmark.alias || bookmark.title}`);
    res.json({ success: true, hiddenCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete bookmark
app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    // Get bookmark info before deleting
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Check if we should delete the folder (query param: deleteFolder=true)
    const deleteFolder = req.query.deleteFolder === 'true';

    if (deleteFolder) {
      // Delete the manga folder if it exists
      try {
        const mangaDir = downloader.getMangaDir(bookmark.title, bookmark.alias);
        if (await fs.pathExists(mangaDir)) {
          await fs.remove(mangaDir);
          console.log(`Deleted manga folder: ${mangaDir}`);
        }
      } catch (folderError) {
        console.error('Error deleting manga folder:', folderError);
        // Continue with bookmark deletion even if folder deletion fails
      }
    }

    // Delete the bookmark from database
    const result = bookmarkDb.remove(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = categoryDb.getAll();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a category
app.post('/api/categories', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name required' });
    }
    const result = categoryDb.add(name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a category
app.delete('/api/categories/:name', (req, res) => {
  try {
    const result = categoryDb.delete(decodeURIComponent(req.params.name));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set categories for a bookmark
app.post('/api/bookmarks/:id/categories', async (req, res) => {
  try {
    const { categories } = req.body;
    const result = await bookmarkDb.setBookmarkCategories(req.params.id, categories || []);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ARTIST ENDPOINTS ====================

// Get all artists
app.get('/api/artists', (req, res) => {
  try {
    const artists = artistDb.getAll();
    res.json({ artists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookmarks by artist
app.get('/api/artists/:id/bookmarks', (req, res) => {
  try {
    const bookmarks = artistDb.getBookmarksByArtist(parseInt(req.params.id));
    res.json({ bookmarks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create artist
app.post('/api/artists', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Artist name required' });
    }
    const artist = artistDb.create(name);
    res.json({ success: true, artist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename artist
app.patch('/api/artists/:id', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Artist name required' });
    }
    artistDb.rename(parseInt(req.params.id), name);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete artist
app.delete('/api/artists/:id', (req, res) => {
  try {
    artistDb.delete(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artists for a bookmark
app.get('/api/bookmarks/:id/artists', (req, res) => {
  try {
    const artists = artistDb.getForBookmark(req.params.id);
    res.json({ artists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set artists for a bookmark
app.post('/api/bookmarks/:id/artists', (req, res) => {
  try {
    const { artists } = req.body;
    artistDb.setForBookmark(req.params.id, artists || []);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add artist to bookmark
app.post('/api/bookmarks/:id/artists/add', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Artist name required' });
    }
    artistDb.addToBookmark(req.params.id, name);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove artist from bookmark
app.delete('/api/bookmarks/:id/artists/:artistId', (req, res) => {
  try {
    artistDb.removeFromBookmark(req.params.id, parseInt(req.params.artistId));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERIES API ====================

// Get all series
app.get('/api/series', (req, res) => {
  try {
    const series = seriesDb.getAll();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookmarks not in any series
app.get('/api/series/available-bookmarks', (req, res) => {
  try {
    const bookmarks = seriesDb.getBookmarksNotInSeries();
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new series
app.post('/api/series', (req, res) => {
  try {
    const { title, alias } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title required' });
    }
    const series = seriesDb.create(title.trim(), alias?.trim() || null);
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a series by ID
app.get('/api/series/:id', (req, res) => {
  try {
    const series = seriesDb.getById(req.params.id);
    if (!series) {
      return res.status(404).json({ error: 'Series not found' });
    }
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a series
app.patch('/api/series/:id', (req, res) => {
  try {
    const { title, alias, cover_entry_id } = req.body;
    const series = seriesDb.update(req.params.id, { title, alias, cover_entry_id });
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a series
app.delete('/api/series/:id', (req, res) => {
  try {
    seriesDb.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add entry to series
app.post('/api/series/:id/entries', (req, res) => {
  try {
    const { bookmarkId, order } = req.body;
    if (!bookmarkId) {
      return res.status(400).json({ error: 'Bookmark ID required' });
    }
    const entry = seriesDb.addEntry(req.params.id, bookmarkId, order);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove entry from series
app.delete('/api/series/:id/entries/:entryId', (req, res) => {
  try {
    seriesDb.removeEntry(req.params.entryId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder entries in a series
app.post('/api/series/:id/reorder', (req, res) => {
  try {
    const { entryIds } = req.body;
    if (!entryIds || !Array.isArray(entryIds)) {
      return res.status(400).json({ error: 'Entry IDs array required' });
    }
    seriesDb.reorderEntries(req.params.id, entryIds);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set cover entry for series
app.post('/api/series/:id/cover', (req, res) => {
  try {
    const { entryId } = req.body;
    seriesDb.setCoverEntry(req.params.id, entryId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get series for a bookmark
app.get('/api/bookmarks/:id/series', (req, res) => {
  try {
    const series = seriesDb.getSeriesForBookmark(req.params.id);
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Hide a chapter version (add to deletedChapterUrls and delete folder if exists)
app.post('/api/bookmarks/:id/hide-version', async (req, res) => {
  try {
    const { chapterNumber, url } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Delete the folder if it exists
    try {
      await downloader.deleteChapter(
        bookmark.title,
        chapterNumber,
        bookmark.alias,
        url // Pass URL for versioned folder detection
      );
    } catch (e) {
      // Ignore errors if folder doesn't exist
    }

    // Remove from downloadedVersions
    const downloadedVersions = { ...(bookmark.downloadedVersions || {}) };
    const numKey = String(chapterNumber);
    if (downloadedVersions[numKey]) {
      const versions = downloadedVersions[numKey];
      if (Array.isArray(versions)) {
        downloadedVersions[numKey] = versions.filter(v => v !== url);
        if (downloadedVersions[numKey].length === 0) {
          delete downloadedVersions[numKey];
        } else if (downloadedVersions[numKey].length === 1) {
          downloadedVersions[numKey] = downloadedVersions[numKey][0];
        }
      } else if (versions === url) {
        delete downloadedVersions[numKey];
      }
    }

    // Add URL to deletedChapterUrls (hidden from view but kept for update checking)
    const deletedUrls = new Set(bookmark.deletedChapterUrls || []);
    deletedUrls.add(url);

    // Check if chapter still has any downloaded versions
    const downloadedChapters = [...(bookmark.downloadedChapters || [])];
    if (!downloadedVersions[numKey]) {
      const idx = downloadedChapters.indexOf(chapterNumber);
      if (idx > -1) {
        downloadedChapters.splice(idx, 1);
      }
    }

    await bookmarkDb.update(req.params.id, {
      deletedChapterUrls: [...deletedUrls],
      downloadedVersions,
      downloadedChapters
    });

    res.json({ success: true, message: 'Version hidden' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unhide a chapter version (remove from deletedChapterUrls)
app.post('/api/bookmarks/:id/unhide-version', async (req, res) => {
  try {
    const { chapterNumber, url } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Remove URL from deletedChapterUrls
    const deletedUrls = new Set(bookmark.deletedChapterUrls || []);
    deletedUrls.delete(url);

    await bookmarkDb.update(req.params.id, {
      deletedChapterUrls: [...deletedUrls]
    });

    res.json({ success: true, message: 'Version restored' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hidden versions for a chapter
app.get('/api/bookmarks/:id/hidden-versions/:chapterNumber', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    const chapterNum = parseFloat(req.params.chapterNumber);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const deletedUrls = new Set(bookmark.deletedChapterUrls || []);
    const chapters = bookmark.chapters || [];

    // Find all versions for this chapter that are hidden
    const hiddenVersions = chapters
      .filter(c => c.number === chapterNum && deletedUrls.has(c.url))
      .map(c => ({ number: c.number, title: c.title, url: c.url }));

    res.json({ success: true, hiddenVersions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove chapter entry (without blacklisting - can be re-added on update)
app.post('/api/bookmarks/:id/remove-chapter-entry', async (req, res) => {
  try {
    const { chapterNumber } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const chapterNum = parseFloat(chapterNumber);

    // Remove all versions of this chapter from the chapters array
    const updatedChapters = (bookmark.chapters || []).filter(c => c.number !== chapterNum);

    // Remove from downloadedChapters
    const updatedDownloaded = (bookmark.downloadedChapters || []).filter(n => n !== chapterNum);

    // Remove from downloadedVersions
    const updatedVersions = { ...bookmark.downloadedVersions };
    delete updatedVersions[chapterNum];

    // Remove from readChapters
    const updatedReadChapters = (bookmark.readChapters || []).filter(n => n !== chapterNum);

    // Remove from readingProgress
    const updatedProgress = { ...bookmark.readingProgress };
    delete updatedProgress[chapterNum];

    // Remove any deleted URLs for this chapter (so it's not blacklisted)
    const chapterUrls = (bookmark.chapters || []).filter(c => c.number === chapterNum).map(c => c.url);
    const updatedDeletedUrls = (bookmark.deletedChapterUrls || []).filter(url => !chapterUrls.includes(url));

    // Update bookmark
    await bookmarkDb.update(bookmark.id, {
      chapters: updatedChapters,
      downloadedChapters: updatedDownloaded,
      downloadedVersions: updatedVersions,
      readChapters: updatedReadChapters,
      readingProgress: updatedProgress,
      deletedChapterUrls: updatedDeletedUrls,
      totalChapters: new Set(updatedChapters.map(c => c.number)).size
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual add chapter version from URL
app.post('/api/bookmarks/:id/chapters/:number/manual-add', async (req, res) => {
  try {
    const { url } = req.body;
    const { id, number } = req.params;
    const chapterNum = parseFloat(number);

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const bookmark = await bookmarkDb.getById(id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Queue the task
    const result = await taskQueue.addAndWait({
      type: 'download',
      description: `Manual add Chapter ${chapterNum}`,
      mangaId: id,
      mangaTitle: bookmark.title,
      execute: async () => {
        console.log(`[Manual Add] Chapter ${chapterNum} from: ${url}`);

        // Use appropriate scraper based on URL
        if (!scraperFactory.browser) {
          throw new Error('Browser not initialized');
        }

        const scraper = scraperFactory.getScraperForUrl(url);
        if (!scraper) {
          throw new Error(`No scraper found for URL: ${url}`);
        }

        let images = [];

        try {
          // Verify URL is valid
          try {
            new URL(url);
          } catch (e) {
            throw new Error('Invalid URL');
          }

          images = await scraper.getChapterImages(url);
          console.log(`[Manual Add] Found ${images.length} images`);

          if (images.length === 0) {
            throw new Error('No images found on page');
          }

          // Download the chapter
          const downloadResult = await downloader.downloadChapter(
            bookmark.title,
            chapterNum,
            images,
            bookmark.alias,
            null, // no progress callback
            url // pass URL for version identification
          );

          // Update bookmark data
          const currentBookmark = await bookmarkDb.getById(id);

          // Update downloadedChapters list
          const downloadedChapters = new Set(currentBookmark.downloadedChapters || []);
          downloadedChapters.add(chapterNum);

          // Update downloadedVersions
          const downloadedVersions = { ...(currentBookmark.downloadedVersions || {}) };
          const numKey = String(chapterNum);

          if (!downloadedVersions[numKey]) {
            downloadedVersions[numKey] = url;
          } else if (typeof downloadedVersions[numKey] === 'string') {
            if (downloadedVersions[numKey] !== url) {
              downloadedVersions[numKey] = [downloadedVersions[numKey], url];
            }
          } else if (Array.isArray(downloadedVersions[numKey])) {
            if (!downloadedVersions[numKey].includes(url)) {
              downloadedVersions[numKey] = [...downloadedVersions[numKey], url];
            }
          }

          // Add to chapters list if not present (as a new version entry)
          const chapters = [...(currentBookmark.chapters || [])];
          // Check if this URL is already in chapters
          const existingEntry = chapters.find(c => c.number === chapterNum && c.url === url);

          if (!existingEntry) {
            // Find generic title or use generic
            let title = `Chapter ${chapterNum}`;
            const existingChapter = chapters.find(c => c.number === chapterNum);
            if (existingChapter) title = existingChapter.title;

            chapters.push({
              number: chapterNum,
              title: title,
              url: url,
              uploadedAt: new Date().toISOString()
            });
            // Re-sort chapters
            chapters.sort((a, b) => a.number - b.number);
          }

          await bookmarkDb.update(id, {
            downloadedChapters: [...downloadedChapters],
            downloadedVersions,
            chapters
          });

          return { success: true, downloadResult };

        } catch (error) {
          console.error('[Manual Add] Error:', error);
          throw error;
        }
      }
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exclude chapter permanently (hide from list, delete files, prevent download all)
app.post('/api/bookmarks/:id/exclude-chapter', async (req, res) => {
  try {
    const { chapterNumber } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const chapterNum = parseFloat(chapterNumber);

    // Delete all versions from disk
    await downloader.deleteChapter(bookmark.title, chapterNum, bookmark.alias);

    // Remove from downloadedChapters
    const updatedDownloaded = (bookmark.downloadedChapters || []).filter(n => n !== chapterNum);

    // Remove from downloadedVersions
    const updatedVersions = { ...bookmark.downloadedVersions };
    delete updatedVersions[chapterNum];

    // Update bookmark
    await bookmarkDb.update(bookmark.id, {
      downloadedChapters: updatedDownloaded,
      downloadedVersions: updatedVersions
    });

    // Add to excluded chapters
    bookmarkDb.excludeChapter(bookmark.id, chapterNum);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unexclude a chapter (restore to list)
app.post('/api/bookmarks/:id/unexclude-chapter', async (req, res) => {
  try {
    const { chapterNumber } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const chapterNum = parseFloat(chapterNumber);
    bookmarkDb.unexcludeChapter(bookmark.id, chapterNum);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get excluded chapters for a bookmark
app.get('/api/bookmarks/:id/excluded-chapters', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const excludedChapters = bookmarkDb.getExcludedChapters(bookmark.id);
    res.json({ success: true, excludedChapters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a volume
app.post('/api/bookmarks/:id/volumes', async (req, res) => {
  try {
    const { name, chapters } = req.body;
    if (!name || !chapters || !Array.isArray(chapters)) {
      return res.status(400).json({ error: 'Name and chapters array required' });
    }

    // Create volume
    const volume = bookmarkDb.createVolume(req.params.id, name, chapters);
    res.json({ success: true, volume });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload volume cover
app.post('/api/bookmarks/:id/volumes/:volumeId/cover', upload.single('cover'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { volumeId } = req.params;
    const ext = path.extname(req.file.originalname) || '.jpg';
    const filename = `volume_${volumeId}_${Date.now()}${ext}`;

    const coversDir = path.join(CONFIG.dataDir, 'covers', 'volumes');
    await fs.ensureDir(coversDir);

    const filePath = path.join(coversDir, filename);

    await sharp(req.file.buffer)
      .resize(600)
      .jpeg({ quality: 90 })
      .toFile(filePath);

    // Mount point is /covers, file is in volumes/filename
    const urlPath = `/covers/volumes/${filename}`;

    bookmarkDb.updateVolume(volumeId, { cover: urlPath });

    res.json({ success: true, cover: urlPath });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Set volume cover from chapter
app.post('/api/bookmarks/:id/volumes/:volumeId/cover/from-chapter', async (req, res) => {
  try {
    const { volumeId } = req.params;
    const { chapterNumber, filename } = req.body;

    if (chapterNumber === undefined) {
      return res.status(400).json({ error: 'Chapter number required' });
    }

    // Get bookmark to find alias/title
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Find chapter images
    const versions = await downloader.getExistingVersions(bookmark.title, chapterNumber, bookmark.alias);
    const validVersion = versions.find(v => v.imageCount > 0);

    if (!validVersion) {
      return res.status(404).json({ error: 'Chapter not downloaded or empty. Please download it first.' });
    }

    // Get images
    const files = await fs.readdir(validVersion.path);
    const images = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    images.sort(collator.compare);

    if (images.length === 0) {
      return res.status(404).json({ error: 'No images found in chapter folder' });
    }

    let sourceFile = images[0];
    if (filename) {
      const found = images.find(f => f === filename);
      if (found) {
        sourceFile = found;
      } else {
        console.warn(`Requested cover filename '${filename}' not found in chapter, defaulting to first page.`);
      }
    }

    const sourcePath = path.join(validVersion.path, sourceFile);

    // Prepare destination
    const ext = path.extname(sourcePath);
    const dstFilename = `volume_${volumeId}_${Date.now()}${ext}`;
    const coversDir = path.join(CONFIG.dataDir, 'covers', 'volumes');
    await fs.ensureDir(coversDir);
    const destPath = path.join(coversDir, dstFilename);

    // Copy and Resize
    await sharp(sourcePath)
      .resize(600)
      .jpeg({ quality: 90 })
      .toFile(destPath);

    const urlPath = `/covers/volumes/${dstFilename}`;
    bookmarkDb.updateVolume(volumeId, { cover: urlPath });

    res.json({ success: true, cover: urlPath });

  } catch (error) {
    console.error('Set cover from chapter error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rename a volume
app.put('/api/bookmarks/:id/volumes/:volumeId/rename', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Volume name required' });
    }

    bookmarkDb.updateVolume(req.params.volumeId, { name: name.trim() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder a volume (move up or down)
app.post('/api/bookmarks/:id/volumes/:volumeId/reorder', async (req, res) => {
  try {
    const { direction } = req.body;
    if (!direction || !['up', 'down'].includes(direction)) {
      return res.status(400).json({ error: 'Direction must be "up" or "down"' });
    }

    bookmarkDb.reorderVolume(req.params.id, req.params.volumeId, direction);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a volume
app.delete('/api/bookmarks/:id/volumes/:volumeId', async (req, res) => {
  try {
    bookmarkDb.deleteVolume(req.params.volumeId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get hidden/duplicate versions for a specific chapter
app.get('/api/bookmarks/:id/hidden-versions/:num', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) return res.status(404).send('Not found');

    const num = parseFloat(req.params.num);
    const versions = bookmark.chapters.filter(c => c.number === num);
    res.json(versions);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

// Manually add a chapter
app.post('/api/bookmarks/:id/chapters', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) return res.status(404).send('Not found');

    const { number, url, title } = req.body;
    if (number === undefined || !url) {
      return res.status(400).json({ error: 'Chapter number and URL required' });
    }

    const newChapter = {
      number: parseFloat(number),
      url,
      title: title || `Chapter ${number}`,
      date: new Date().toISOString()
    };

    const exists = bookmark.chapters.some(c => c.url === url);
    if (!exists) {
      const chapters = [...bookmark.chapters, newChapter];
      chapters.sort((a, b) => b.number - a.number); // Keep sorted descending
      await bookmarkDb.update(req.params.id, { chapters });
      res.json({ success: true, chapter: newChapter });
    } else {
      res.json({ success: false, message: 'Chapter already exists' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete downloaded version from disk
app.post('/api/bookmarks/:id/delete-download', async (req, res) => {
  try {
    const { chapterNumber, url } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Delete the files from disk
    const result = await downloader.deleteChapter(
      bookmark.title,
      chapterNumber,
      bookmark.alias,
      url // Pass URL for versioned folder detection
    );

    if (result.success) {
      // Update downloadedVersions - handle both old string format and new array format
      const downloadedVersions = { ...(bookmark.downloadedVersions || {}) };
      let versions = downloadedVersions[chapterNumber];

      if (typeof versions === 'string') {
        // Old format - single URL
        if (versions === url) {
          delete downloadedVersions[chapterNumber];
        }
      } else if (Array.isArray(versions)) {
        // New format - array of URLs
        versions = versions.filter(u => u !== url);
        if (versions.length === 0) {
          delete downloadedVersions[chapterNumber];
        } else {
          downloadedVersions[chapterNumber] = versions;
        }
      }

      // Check if this chapter number still has any downloaded versions
      const stillDownloaded = downloadedVersions[chapterNumber] &&
        (typeof downloadedVersions[chapterNumber] === 'string' || downloadedVersions[chapterNumber].length > 0);

      let downloadedChapters = [...(bookmark.downloadedChapters || [])];
      if (!stillDownloaded) {
        downloadedChapters = downloadedChapters.filter(n => n !== chapterNumber);
      }

      await bookmarkDb.update(req.params.id, {
        downloadedChapters,
        downloadedVersions
      });

      res.json({ success: true, message: 'Downloaded version deleted' });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific version of a chapter (via query params for compare view)
app.delete('/api/bookmarks/:id/chapters/:num/version', async (req, res) => {
  try {
    const chapterNumber = parseFloat(req.params.num);
    const url = decodeURIComponent(req.query.url);
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Delete the files from disk
    const result = await downloader.deleteChapter(
      bookmark.title,
      chapterNumber,
      bookmark.alias,
      url
    );

    if (result.success) {
      // Update downloadedVersions
      const downloadedVersions = { ...(bookmark.downloadedVersions || {}) };
      let versions = downloadedVersions[chapterNumber];

      if (typeof versions === 'string') {
        if (versions === url) {
          delete downloadedVersions[chapterNumber];
        }
      } else if (Array.isArray(versions)) {
        versions = versions.filter(u => u !== url);
        if (versions.length === 0) {
          delete downloadedVersions[chapterNumber];
        } else {
          downloadedVersions[chapterNumber] = versions;
        }
      }

      const stillDownloaded = downloadedVersions[chapterNumber] &&
        (typeof downloadedVersions[chapterNumber] === 'string' || downloadedVersions[chapterNumber].length > 0);

      let downloadedChapters = [...(bookmark.downloadedChapters || [])];
      if (!stillDownloaded) {
        downloadedChapters = downloadedChapters.filter(n => n !== chapterNumber);
      }

      await bookmarkDb.update(req.params.id, {
        downloadedChapters,
        downloadedVersions
      });

      res.json({ success: true, message: 'Version deleted' });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific chapter version (for duplicates)
app.delete('/api/bookmarks/:id/chapters', async (req, res) => {
  try {
    const { chapterNumber, url } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Delete the files from disk if downloaded
    try {
      await downloader.deleteChapter(
        bookmark.title,
        chapterNumber,
        bookmark.alias,
        url // Pass URL for versioned folder detection
      );
    } catch (e) {
      // Ignore errors if folder doesn't exist
    }

    // Remove from downloadedVersions if present
    const downloadedVersions = { ...(bookmark.downloadedVersions || {}) };
    const numKey = String(chapterNumber);
    if (downloadedVersions[numKey]) {
      const versions = downloadedVersions[numKey];
      if (Array.isArray(versions)) {
        downloadedVersions[numKey] = versions.filter(v => v !== url);
        if (downloadedVersions[numKey].length === 0) {
          delete downloadedVersions[numKey];
        } else if (downloadedVersions[numKey].length === 1) {
          downloadedVersions[numKey] = downloadedVersions[numKey][0];
        }
      } else if (versions === url) {
        delete downloadedVersions[numKey];
      }
    }

    // Update downloadedChapters
    let downloadedChapters = [...(bookmark.downloadedChapters || [])];
    if (!downloadedVersions[numKey]) {
      downloadedChapters = downloadedChapters.filter(n => n !== chapterNumber);
    }

    // Remove the specific chapter by URL
    const updatedChapters = bookmark.chapters.filter(ch =>
      !(ch.number === chapterNumber && ch.url === url)
    );

    // Update duplicate info
    const updatedDuplicates = (bookmark.duplicateChapters || []).map(dup => {
      if (dup.number === chapterNumber) {
        const newVersions = dup.versions.filter(v => v.url !== url);
        if (newVersions.length <= 1) {
          return null; // No longer a duplicate
        }
        return { ...dup, versions: newVersions };
      }
      return dup;
    }).filter(Boolean);

    await bookmarkDb.update(req.params.id, {
      chapters: updatedChapters,
      duplicateChapters: updatedDuplicates,
      downloadedVersions,
      downloadedChapters
    });

    res.json({ success: true, message: 'Chapter version removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check for updates on a single manga
app.post('/api/bookmarks/:id/check', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const scraper = scraperFactory.getScraperForUrl(bookmark.url);
    if (!scraper) {
      return res.status(400).json({ error: 'No scraper available' });
    }

    // Queue the scrape operation
    const result = await taskQueue.addAndWait({
      type: 'scrape',
      description: `Checking updates for ${bookmark.alias || bookmark.title}`,
      mangaId: bookmark.id,
      mangaTitle: bookmark.alias || bookmark.title,
      execute: async () => {
        const mangaInfo = await scraper.getMangaInfo(bookmark.url);

        // Protect chapters in volumes from updates
        const volumes = bookmarkDb.getVolumes(bookmark.id);
        const protectedChapters = new Set();
        volumes.forEach(v => v.chapters.forEach(c => protectedChapters.add(c)));

        if (protectedChapters.size > 0) {
          // Merge logic: Use existing chapters for protected ones
          const existingChaptersMap = new Map((bookmark.chapters || []).map(c => [c.number, c]));
          mangaInfo.chapters = mangaInfo.chapters.map(c => {
            if (protectedChapters.has(c.number) && existingChaptersMap.has(c.number)) {
              return existingChaptersMap.get(c.number);
            }
            return c;
          });
        }

        const newChapters = mangaInfo.totalChapters - bookmark.totalChapters;

        bookmarkDb.update(bookmark.id, {
          totalChapters: mangaInfo.totalChapters,
          chapters: mangaInfo.chapters,
          cover: mangaInfo.cover,
          duplicateChapters: mangaInfo.duplicateChapters
        });

        // Download new cover if different from remote
        if (mangaInfo.cover && mangaInfo.cover !== bookmark.remoteCover) {
          const coverResult = await downloader.downloadCover(
            bookmark.title,
            mangaInfo.cover,
            bookmark.alias
          );
          if (coverResult && coverResult.isNew) {
            await bookmarkDb.update(bookmark.id, {
              localCover: coverResult.path,
              remoteCover: mangaInfo.cover
            });
          }
        }

        const updated = await bookmarkDb.getById(bookmark.id);
        return {
          ...updated,
          newChaptersCount: newChapters
        };
      }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quick check for updates (first page only - faster)
app.post('/api/bookmarks/:id/quick-check', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const scraper = scraperFactory.getScraperForUrl(bookmark.url);
    if (!scraper) {
      return res.status(400).json({ error: 'No scraper available' });
    }

    // Check if scraper supports quick check
    if (!scraper.supportsQuickCheck) {
      return res.status(400).json({
        error: 'Quick check not supported for this website',
        supportsQuickCheck: false
      });
    }

    // Queue the scrape operation
    const result = await taskQueue.addAndWait({
      type: 'scrape',
      description: `Quick check for ${bookmark.alias || bookmark.title}`,
      mangaId: bookmark.id,
      mangaTitle: bookmark.alias || bookmark.title,
      execute: async () => {
        // Get known chapter URLs
        const knownChapterUrls = (bookmark.chapters || []).map(c => c.url);

        const checkResult = await scraper.quickCheckUpdates(bookmark.url, knownChapterUrls);

        // If new chapters found, merge them into the database
        if (checkResult.hasUpdates && checkResult.newChapters.length > 0) {
          // Merge new chapters with existing ones
          const existingChapters = bookmark.chapters || [];
          const existingUrls = new Set(existingChapters.map(c => c.url));

          // Only add chapters that don't already exist
          const chaptersToAdd = checkResult.newChapters.filter(c => !existingUrls.has(c.url));

          if (chaptersToAdd.length > 0) {
            const mergedChapters = [...existingChapters, ...chaptersToAdd];
            const uniqueChapterNumbers = new Set(mergedChapters.map(c => c.number));

            bookmarkDb.update(bookmark.id, {
              chapters: mergedChapters,
              totalChapters: mergedChapters.length,
              uniqueChapters: uniqueChapterNumbers.size
            });
          }
        }

        return {
          hasUpdates: checkResult.hasUpdates,
          latestChapter: checkResult.latestChapter,
          newChaptersCount: checkResult.newChapters.length,
          newChapters: checkResult.newChapters,
          supportsQuickCheck: true,
          updated: checkResult.hasUpdates && checkResult.newChapters.length > 0
        };
      }
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check all bookmarks for updates
app.post('/api/check-all', async (req, res) => {
  try {
    const bookmarks = bookmarkDb.getAll();
    const allSettings = chapterSettingsDb.getAll();

    // Queue all updates as a single task to prevent parallel scraping
    const results = await taskQueue.addAndWait({
      type: 'scrape',
      description: `Checking all ${bookmarks.length} manga for updates`,
      execute: async () => {
        const results = [];

        for (const bookmark of bookmarks) {
          try {
            const scraper = scraperFactory.getScraperForUrl(bookmark.url);
            if (!scraper) continue;

            const mangaInfo = await scraper.getMangaInfo(bookmark.url);

            // Protect chapters in volumes or locked chapters from updates
            const volumes = bookmarkDb.getVolumes(bookmark.id);
            const protectedChapters = new Set();
            volumes.forEach(v => v.chapters.forEach(c => protectedChapters.add(c)));

            // Add locked chapters
            const mangaSettings = allSettings[bookmark.id] || {};
            for (const [chNum, settings] of Object.entries(mangaSettings)) {
              if (settings.locked) {
                protectedChapters.add(parseFloat(chNum));
              }
            }

            if (protectedChapters.size > 0) {
              // Merge logic: Use existing chapters for protected ones
              const existingChaptersMap = new Map((bookmark.chapters || []).map(c => [c.number, c]));
              mangaInfo.chapters = mangaInfo.chapters.map(c => {
                if (protectedChapters.has(c.number) && existingChaptersMap.has(c.number)) {
                  return existingChaptersMap.get(c.number);
                }
                return c;
              });
            }

            const newChapters = mangaInfo.totalChapters - bookmark.totalChapters;

            bookmarkDb.update(bookmark.id, {
              totalChapters: mangaInfo.totalChapters,
              chapters: mangaInfo.chapters,
              cover: mangaInfo.cover,
              duplicateChapters: mangaInfo.duplicateChapters
            });

            results.push({
              id: bookmark.id,
              title: bookmark.alias || bookmark.title,
              oldCount: bookmark.totalChapters,
              newCount: mangaInfo.totalChapters,
              newChapters
            });
          } catch (error) {
            results.push({
              id: bookmark.id,
              title: bookmark.alias || bookmark.title,
              error: error.message
            });
          }
        }

        return results;
      }
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start download
app.post('/api/bookmarks/:id/download', async (req, res) => {
  try {
    const { chapters, all } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const deletedUrls = new Set(bookmark.deletedChapterUrls || []);
    const excludedChapters = new Set(bookmark.excludedChapters || []);

    // Get locked chapters
    const allSettings = chapterSettingsDb.getAll();
    const mangaSettings = allSettings[bookmark.id] || {};
    const lockedChapters = new Set();
    Object.entries(mangaSettings).forEach(([num, s]) => {
      if (s.locked) lockedChapters.add(parseFloat(num));
    });

    // Determine chapters to download
    let chaptersToDownload = [];

    if (all) {
      // Download all chapters NOT already downloaded, NOT deleted, NOT excluded, and NOT locked
      chaptersToDownload = bookmark.chapters
        .filter(c => !bookmark.downloadedChapters.includes(c.number))
        .filter(c => !deletedUrls.has(c.url))
        .filter(c => !excludedChapters.has(c.number))
        .filter(c => !lockedChapters.has(c.number))
        .map(c => c.number);
    } else if (chapters && Array.isArray(chapters)) {
      // Download specific chapters (user explicitly chose, but still respect excluded/locked)
      chaptersToDownload = chapters
        .filter(n => !bookmark.downloadedChapters.includes(n))
        .filter(n => !excludedChapters.has(n))
        .filter(n => !lockedChapters.has(n));
    }

    if (chaptersToDownload.length === 0) {
      return res.json({ message: 'No chapters to download', status: 'complete' });
    }

    // Create download task ID
    const taskId = `${bookmark.id}-${Date.now()}`;
    activeDownloads.set(taskId, {
      bookmarkId: bookmark.id,
      mangaTitle: bookmark.alias || bookmark.title,
      total: chaptersToDownload.length,
      chapters: chaptersToDownload,
      completedChapters: [],
      completed: 0,
      current: null,
      status: 'queued',
      errors: []
    });

    // Queue the entire download task to prevent parallel scraping
    taskQueue.add({
      type: 'download',
      execute: () => downloadChaptersAsync(taskId, bookmark, chaptersToDownload)
    });

    res.json({ taskId, chaptersCount: chaptersToDownload.length, chapters: chaptersToDownload });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get download progress
app.get('/api/downloads/:taskId', (req, res) => {
  const task = activeDownloads.get(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: 'Download task not found' });
  }
  res.json(task);
});

// Get all active downloads
app.get('/api/downloads', (req, res) => {
  try {
    const downloads = {};
    activeDownloads.forEach((task, taskId) => {
      downloads[taskId] = task;
    });
    res.json(downloads);
  } catch (error) {
    console.error('Error in /api/downloads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pause download
app.post('/api/downloads/:taskId/pause', (req, res) => {
  const task = activeDownloads.get(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: 'Download task not found' });
  }
  task.status = 'paused';
  res.json({ success: true, status: 'paused' });
});

// Resume download
app.post('/api/downloads/:taskId/resume', (req, res) => {
  const task = activeDownloads.get(req.params.taskId);
  if (!task) {
    return res.status(404).json({ error: 'Download task not found' });
  }
  task.status = 'running';
  res.json({ success: true, status: 'running' });
});

// Cancel download
app.post('/api/downloads/:taskId/cancel', (req, res) => {
  const task = activeDownloads.get(req.params.taskId);
  if (task) {
    task.status = 'cancelled';
  }
  activeDownloads.delete(req.params.taskId);
  res.json({ success: true, status: 'cancelled' });
});

// Background download function - runs one task at a time via queue
async function downloadChaptersAsync(taskId, bookmark, chaptersToDownload) {
  const task = activeDownloads.get(taskId);
  if (!task) return;

  // Mark as running now that we're actually starting
  task.status = 'running';

  const scraper = scraperFactory.getScraperForUrl(bookmark.url);

  for (const chapterNum of chaptersToDownload) {
    // Check for cancellation
    if (!activeDownloads.has(taskId) || task.status === 'cancelled') break;

    // Wait while paused
    while (task.status === 'paused') {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Check if cancelled while paused
      if (!activeDownloads.has(taskId) || task.status === 'cancelled') break;
    }
    if (task.status === 'cancelled') break;

    // Find the first version of this chapter (first in DB is the one to use)
    const chapter = bookmark.chapters.find(c => c.number === chapterNum);
    if (!chapter) continue;

    task.current = chapterNum;
    // Track remaining chapters for UI
    task.remainingChapters = chaptersToDownload.slice(chaptersToDownload.indexOf(chapterNum) + 1);

    try {
      const images = await scraper.getChapterImages(chapter.url);
      await downloader.downloadChapter(
        bookmark.title,
        chapterNum,
        images,
        bookmark.alias,
        null, // onProgress
        chapter.url // Pass URL for versioned folder
      );
      // Mark with the URL we downloaded
      await bookmarkDb.markChapterDownloaded(bookmark.id, chapterNum, chapter.url);
    } catch (error) {
      task.errors.push({ chapter: chapterNum, error: error.message });
    }
    task.completed++;
    task.completedChapters = task.completedChapters || [];
    task.completedChapters.push(chapterNum);
  }

  task.status = 'complete';
  task.current = null;

  // Clean up after 5 minutes
  setTimeout(() => activeDownloads.delete(taskId), 5 * 60 * 1000);
}

// Download a specific version of a chapter
app.post('/api/bookmarks/:id/download-version', async (req, res) => {
  try {
    const { chapterNumber, url } = req.body;
    const bookmark = await bookmarkDb.getById(req.params.id);

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const chapter = bookmark.chapters.find(c => c.number === chapterNumber && c.url === url);
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter version not found' });
    }

    const scraper = scraperFactory.getScraperForUrl(bookmark.url);
    if (!scraper) {
      return res.status(400).json({ error: 'No scraper available for this URL' });
    }

    // Create download task ID for tracking
    const taskId = `${bookmark.id}-${Date.now()}`;
    activeDownloads.set(taskId, {
      bookmarkId: bookmark.id,
      mangaTitle: bookmark.alias || bookmark.title,
      total: 1,
      chapters: [chapterNumber],
      completedChapters: [],
      completed: 0,
      current: chapterNumber,
      status: 'queued',
      errors: [],
      versionUrl: url // Track which version URL
    });

    // Queue the download to prevent parallel scraping
    taskQueue.add({
      type: 'download',
      execute: async () => {
        const task = activeDownloads.get(taskId);
        if (!task) return;

        try {
          task.status = 'running';
          const images = await scraper.getChapterImages(url);
          await downloader.downloadChapter(
            bookmark.title,
            chapterNumber,
            images,
            bookmark.alias,
            null, // onProgress
            url // Pass URL for versioned folder
          );
          // Mark as downloaded with this URL
          await bookmarkDb.markChapterDownloaded(bookmark.id, chapterNumber, url);
          task.completed = 1;
          task.completedChapters = [chapterNumber];
          task.status = 'complete';
        } catch (error) {
          task.status = 'error';
          task.errors.push({ chapter: chapterNumber, error: error.message });
        }

        // Clean up after 5 minutes
        setTimeout(() => activeDownloads.delete(taskId), 5 * 60 * 1000);
      }
    });

    res.json({ taskId, chapters: [chapterNumber] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel download
app.delete('/api/downloads/:taskId', (req, res) => {
  activeDownloads.delete(req.params.taskId);
  res.json({ message: 'Download cancelled' });
});

// Get supported websites
app.get('/api/supported-sites', (req, res) => {
  res.json(scraperFactory.getSupportedWebsites());
});

// Scan downloads folder for new manga
app.get('/api/debug-info', (req, res) => {
  res.json({
    config: CONFIG,
    resolvedDownloadsDir: path.resolve(CONFIG.downloadsDir),
    cwd: process.cwd()
  });
});

// Scan for local manga
app.post('/api/scan-local', async (req, res) => {
  try {
    const downloadsDir = CONFIG.downloadsDir;

    if (!await fs.pathExists(downloadsDir)) {
      return res.json({ found: 0, synced: 0 });
    }

    const entries = await fs.readdir(downloadsDir, { withFileTypes: true });
    const bookmarks = await bookmarkDb.getAll();

    let found = 0;
    let synced = 0;

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const mangaFolder = entry.name;
      const mangaPath = path.join(downloadsDir, mangaFolder);

      // Check if this folder has chapters
      const chapters = await downloader.scanLocalChapters(mangaFolder);
      if (chapters.length === 0) continue;

      found++;

      // Check if we have a bookmark for this manga (by title match)
      const existingBookmark = bookmarks.find(b =>
        downloader.sanitizeFileName(b.title) === mangaFolder ||
        (b.alias && downloader.sanitizeFileName(b.alias) === mangaFolder)
      );

      if (existingBookmark) {
        // Sync downloaded chapters
        await bookmarkDb.update(existingBookmark.id, {
          downloadedChapters: chapters.map(c => c.number)
        });
        synced++;
      }
      // Note: We don't auto-create bookmarks for unknown folders
      // User should add them via URL
    }

    res.json({ found, synced });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get local manga folders that aren't in the database yet
app.get('/api/local-manga', async (req, res) => {
  try {
    const mangaFolders = await downloader.scanAllMangaFolders();
    const bookmarks = await bookmarkDb.getAll();

    // Filter to only folders without a matching bookmark
    const localOnly = mangaFolders.filter(folder => {
      return !bookmarks.some(b =>
        downloader.sanitizeFileName(b.title) === downloader.sanitizeFileName(folder.folderName) ||
        (b.alias && downloader.sanitizeFileName(b.alias) === downloader.sanitizeFileName(folder.folderName))
      );
    });

    res.json(localOnly);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a local-only bookmark (no URL)
app.post('/api/local-manga', async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({ error: 'Folder name required' });
    }

    // Check folder exists
    const folderPath = path.join(CONFIG.downloadsDir, folderName);
    if (!await fs.pathExists(folderPath)) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Scan for chapters and CBZ files
    const chapters = await downloader.scanLocalChapters(folderName);
    const cbzFiles = await downloader.findCbzFiles(folderName);

    // Build chapter list from what we have
    const chapterList = chapters.map(c => ({
      number: c.number,
      title: `Chapter ${c.number}`,
      url: `local://${folderName}/chapter/${c.number}`,
      removedFromRemote: true // Mark as local-only
    }));

    // Create bookmark
    const bookmark = await bookmarkDb.add({
      url: `local://${folderName}`,
      title: folderName,
      alias: null,
      website: 'Local',
      chapters: chapterList,
      totalChapters: chapterList.length,
      downloadedChapters: chapters.map(c => c.number),
      cover: null
    });

    // Try to find a cover
    const mangaFolders = await downloader.scanAllMangaFolders();
    const thisFolder = mangaFolders.find(f => f.folderName === folderName);
    if (thisFolder?.coverImage) {
      // Download/copy the cover to covers folder
      // For now just return the path - cover management will handle it
    }

    res.json({
      success: true,
      bookmark,
      cbzFiles: cbzFiles.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update reading progress
app.post('/api/bookmarks/:id/reading-progress', async (req, res) => {
  try {
    const { chapter, page, totalPages } = req.body;
    const result = await bookmarkDb.updateReadingProgress(
      req.params.id,
      parseFloat(chapter),
      page,
      totalPages
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark chapter as read/unread
app.post('/api/bookmarks/:id/chapters/:num/read', async (req, res) => {
  try {
    const { isRead } = req.body;
    const result = await bookmarkDb.markChapterRead(
      req.params.id,
      parseFloat(req.params.num),
      isRead !== false
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all chapters below as read
app.post('/api/bookmarks/:id/chapters/:num/read-below', async (req, res) => {
  try {
    const result = await bookmarkDb.markChaptersReadBelow(
      req.params.id,
      parseFloat(req.params.num)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chapter images for reader
app.get('/api/bookmarks/:id/chapters/:num/images', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const chapterNum = parseFloat(req.params.num);
    const versionUrl = req.query.version ? decodeURIComponent(req.query.version) : null;
    const chapter = bookmark.chapters.find(c => c.number === chapterNum);
    // Note: chapter may be null for local-only chapters, that's OK

    // Only load from local downloaded images
    console.log(`Loading chapter ${chapterNum} for "${bookmark.title}" (alias: ${bookmark.alias}), version: ${versionUrl || 'default'}`);
    const localImages = await downloader.getLocalChapterImages(
      bookmark.title,
      chapterNum,
      bookmark.alias,
      versionUrl
    );
    console.log(`Found ${localImages ? localImages.length : 0} local images`);

    if (localImages && localImages.length > 0) {
      return res.json({
        chapter: chapterNum,
        title: chapter ? chapter.title : `Chapter ${chapterNum}`,
        images: localImages,
        source: 'local'
      });
    }

    // No local images found
    res.status(404).json({ error: 'Chapter not downloaded. Please download it first.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CBZ Support Endpoints

// Get CBZ files for a manga
app.get('/api/bookmarks/:id/cbz', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const cbzFiles = await downloader.findCbzFiles(bookmark.title, bookmark.alias);
    res.json(cbzFiles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract a single CBZ file
app.post('/api/bookmarks/:id/cbz/extract', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const { cbzPath, chapterNumber, deleteAfter, forceReExtract, renameCbz } = req.body;

    if (!cbzPath || chapterNumber === undefined) {
      return res.status(400).json({ error: 'cbzPath and chapterNumber required' });
    }

    // Security check - make sure path is within downloads dir
    const resolvedPath = path.resolve(cbzPath);
    const resolvedDownloadsDir = path.resolve(CONFIG.downloadsDir);
    if (!resolvedPath.startsWith(resolvedDownloadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await downloader.extractCbz(
      cbzPath,
      bookmark.title,
      chapterNumber,
      bookmark.alias,
      {
        deleteAfter: deleteAfter || false,
        forceReExtract: forceReExtract || false,
        renameCbz: renameCbz !== false // default true
      }
    );

    // Update downloaded chapters and chapters list in database
    if (result.success) {
      const downloadedChapters = new Set(bookmark.downloadedChapters || []);
      downloadedChapters.add(chapterNumber);

      // Also add to chapters array if not present
      const chapters = bookmark.chapters || [];
      const existingChapter = chapters.find(c => c.number === chapterNumber);
      if (!existingChapter) {
        chapters.push({
          number: chapterNumber,
          title: `Chapter ${chapterNumber}`,
          url: `local://${bookmark.title}/chapter/${chapterNumber}`,
          removedFromRemote: true // Mark as local-only
        });
        // Sort chapters
        chapters.sort((a, b) => a.number - b.number);
      }

      await bookmarkDb.update(bookmark.id, {
        downloadedChapters: Array.from(downloadedChapters).sort((a, b) => a - b),
        chapters: chapters,
        totalChapters: chapters.length
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Extract all CBZ files for a manga
app.post('/api/bookmarks/:id/cbz/extract-all', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const { deleteAfter, forceReExtract, renameCbz } = req.body;
    const results = await downloader.extractAllCbz(
      bookmark.title,
      bookmark.alias,
      {
        deleteAfter: deleteAfter || false,
        forceReExtract: forceReExtract || false,
        renameCbz: renameCbz !== false // default true
      }
    );

    // Update downloaded chapters and chapters list for all successfully extracted
    const downloadedChapters = new Set(bookmark.downloadedChapters || []);
    const chapters = bookmark.chapters || [];

    for (const result of results) {
      if (result.success && !result.skipped && result.chapterNumber !== undefined) {
        downloadedChapters.add(result.chapterNumber);

        // Add to chapters array if not present
        const existingChapter = chapters.find(c => c.number === result.chapterNumber);
        if (!existingChapter) {
          chapters.push({
            number: result.chapterNumber,
            title: `Chapter ${result.chapterNumber}`,
            url: `local://${bookmark.title}/chapter/${result.chapterNumber}`,
            removedFromRemote: true
          });
        }
      }
    }

    // Sort chapters
    chapters.sort((a, b) => a.number - b.number);

    await bookmarkDb.update(bookmark.id, {
      downloadedChapters: Array.from(downloadedChapters).sort((a, b) => a - b),
      chapters: chapters,
      totalChapters: chapters.length
    });

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotate an image on disk by 90 degrees
app.post('/api/rotate-image', async (req, res) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path required' });
    }

    // imagePath comes as /downloads/MangaName/Chapter 00001/001.jpg
    // We need to convert to actual file path
    if (!imagePath.startsWith('/downloads/')) {
      return res.status(400).json({ error: 'Invalid image path' });
    }

    const relativePath = imagePath.replace('/downloads/', '');
    const absolutePath = path.join(CONFIG.downloadsDir, relativePath);

    // Security check - make sure path is within downloads dir
    const resolvedPath = path.resolve(absolutePath);
    const resolvedDownloadsDir = path.resolve(CONFIG.downloadsDir);
    if (!resolvedPath.startsWith(resolvedDownloadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!await fs.pathExists(absolutePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Read, rotate 90 degrees clockwise, and save back
    const imageBuffer = await fs.readFile(absolutePath);
    const rotatedBuffer = await sharp(imageBuffer)
      .rotate(90)
      .toBuffer();

    await fs.writeFile(absolutePath, rotatedBuffer);

    console.log(`Rotated image: ${absolutePath}`);
    res.json({ success: true, message: 'Image rotated 90 degrees' });
  } catch (error) {
    console.error('Rotate error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an image and rename subsequent files
app.post('/api/delete-image', async (req, res) => {
  try {
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path required' });
    }

    if (!imagePath.startsWith('/downloads/')) {
      return res.status(400).json({ error: 'Invalid image path' });
    }

    const relativePath = imagePath.replace('/downloads/', '');
    const absolutePath = path.join(CONFIG.downloadsDir, relativePath);

    // Security check
    const resolvedPath = path.resolve(absolutePath);
    const resolvedDownloadsDir = path.resolve(CONFIG.downloadsDir);
    if (!resolvedPath.startsWith(resolvedDownloadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!await fs.pathExists(absolutePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Get directory and filename info
    const dir = path.dirname(absolutePath);
    const ext = path.extname(absolutePath);
    const basename = path.basename(absolutePath, ext);
    const pageNum = parseInt(basename, 10);

    if (isNaN(pageNum)) {
      return res.status(400).json({ error: 'Invalid page number format' });
    }

    // Get all image files in the directory
    const files = await fs.readdir(dir);
    const imageFiles = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map(f => ({
        name: f,
        num: parseInt(path.basename(f, path.extname(f)), 10),
        ext: path.extname(f)
      }))
      .filter(f => !isNaN(f.num))
      .sort((a, b) => a.num - b.num);

    // Delete the target file
    await fs.remove(absolutePath);
    console.log(`Deleted image: ${absolutePath}`);

    // Rename subsequent files to fill the gap
    const filesToRename = imageFiles.filter(f => f.num > pageNum);
    for (const file of filesToRename) {
      const oldPath = path.join(dir, file.name);
      const newNum = String(file.num - 1).padStart(3, '0');
      const newPath = path.join(dir, newNum + file.ext);
      await fs.rename(oldPath, newPath);
      console.log(`Renamed: ${file.name} -> ${newNum}${file.ext}`);
    }

    res.json({
      success: true,
      message: 'Image deleted and pages renumbered',
      deletedPage: pageNum,
      renamedCount: filesToRename.length
    });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Split an image in half and rename subsequent files
app.post('/api/split-image', async (req, res) => {
  try {
    const { imagePath, direction = 'rtl' } = req.body;

    console.log('Split request received:', { imagePath, direction });

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path required' });
    }

    if (!imagePath.startsWith('/downloads/')) {
      return res.status(400).json({ error: 'Invalid image path' });
    }

    const relativePath = imagePath.replace('/downloads/', '');
    const absolutePath = path.join(CONFIG.downloadsDir, relativePath);

    console.log('Resolved paths:', { relativePath, absolutePath, downloadsDir: CONFIG.downloadsDir });

    // Security check
    const resolvedPath = path.resolve(absolutePath);
    const resolvedDownloadsDir = path.resolve(CONFIG.downloadsDir);
    if (!resolvedPath.startsWith(resolvedDownloadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const exists = await fs.pathExists(absolutePath);
    console.log('File exists:', exists);

    if (!exists) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const chapterDir = path.dirname(absolutePath);
    const originalFilename = path.basename(absolutePath);
    const ext = path.extname(originalFilename);

    // Parse the number from filename (e.g., "005.jpg" -> 5)
    const numMatch = originalFilename.match(/^(\d+)/);
    if (!numMatch) {
      return res.status(400).json({ error: 'Cannot parse image number from filename' });
    }
    const imageNum = parseInt(numMatch[1], 10);

    // Get all image files in the chapter directory
    const files = await fs.readdir(chapterDir);
    const imageFiles = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map(f => {
        const match = f.match(/^(\d+)/);
        return { filename: f, num: match ? parseInt(match[1], 10) : 0 };
      })
      .sort((a, b) => b.num - a.num); // Sort descending to rename from highest first

    // Read and split the image
    const imageBuffer = await fs.readFile(absolutePath);
    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width;
    const height = metadata.height;
    const halfWidth = Math.floor(width / 2);

    // Check if image is wide enough
    if (width / height < 1.2) {
      return res.status(400).json({ error: 'Image does not appear to be a double-page spread' });
    }

    // Create left and right halves
    const leftBuffer = await sharp(imageBuffer)
      .extract({ left: 0, top: 0, width: halfWidth, height })
      .jpeg({ quality: 95 })
      .toBuffer();

    const rightBuffer = await sharp(imageBuffer)
      .extract({ left: halfWidth, top: 0, width: width - halfWidth, height })
      .jpeg({ quality: 95 })
      .toBuffer();

    // Rename all files after this one (increment by 1)
    // Process in descending order to avoid overwriting
    for (const file of imageFiles) {
      if (file.num > imageNum) {
        const oldPath = path.join(chapterDir, file.filename);
        const newNum = String(file.num + 1).padStart(3, '0');
        const newFilename = file.filename.replace(/^\d+/, newNum);
        const newPath = path.join(chapterDir, newFilename);
        await fs.rename(oldPath, newPath);
      }
    }

    // Determine which half is first based on reading direction
    // RTL: right half is page N, left half is page N+1
    // LTR: left half is page N, right half is page N+1
    const firstNum = String(imageNum).padStart(3, '0');
    const secondNum = String(imageNum + 1).padStart(3, '0');

    // Delete original
    await fs.remove(absolutePath);

    if (direction === 'rtl') {
      await fs.writeFile(path.join(chapterDir, `${firstNum}.jpg`), rightBuffer);
      await fs.writeFile(path.join(chapterDir, `${secondNum}.jpg`), leftBuffer);
    } else {
      await fs.writeFile(path.join(chapterDir, `${firstNum}.jpg`), leftBuffer);
      await fs.writeFile(path.join(chapterDir, `${secondNum}.jpg`), rightBuffer);
    }

    console.log(`Split image: ${absolutePath} into two pages`);
    res.json({
      success: true,
      message: 'Image split into two pages',
      newFiles: [
        `/downloads/${path.relative(CONFIG.downloadsDir, path.join(chapterDir, `${firstNum}.jpg`)).replace(/\\/g, '/')}`,
        `/downloads/${path.relative(CONFIG.downloadsDir, path.join(chapterDir, `${secondNum}.jpg`)).replace(/\\/g, '/')}`
      ]
    });
  } catch (error) {
    console.error('Split error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Swap two images (exchange their positions/filenames)
app.post('/api/swap-images', async (req, res) => {
  try {
    const { imagePath1, imagePath2 } = req.body;

    console.log('Swap request received:', { imagePath1, imagePath2 });

    if (!imagePath1 || !imagePath2) {
      return res.status(400).json({ error: 'Two image paths required' });
    }

    if (!imagePath1.startsWith('/downloads/') || !imagePath2.startsWith('/downloads/')) {
      return res.status(400).json({ error: 'Invalid image paths' });
    }

    const relativePath1 = imagePath1.replace('/downloads/', '');
    const relativePath2 = imagePath2.replace('/downloads/', '');
    const absolutePath1 = path.join(CONFIG.downloadsDir, relativePath1);
    const absolutePath2 = path.join(CONFIG.downloadsDir, relativePath2);

    // Security check
    const resolvedPath1 = path.resolve(absolutePath1);
    const resolvedPath2 = path.resolve(absolutePath2);
    const resolvedDownloadsDir = path.resolve(CONFIG.downloadsDir);
    if (!resolvedPath1.startsWith(resolvedDownloadsDir) || !resolvedPath2.startsWith(resolvedDownloadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!await fs.pathExists(absolutePath1) || !await fs.pathExists(absolutePath2)) {
      return res.status(404).json({ error: 'One or both images not found' });
    }

    // Swap files using a temp file
    const tempPath = absolutePath1 + '.swap_temp';
    await fs.rename(absolutePath1, tempPath);
    await fs.rename(absolutePath2, absolutePath1);
    await fs.rename(tempPath, absolutePath2);

    console.log(`Swapped images: ${absolutePath1} <-> ${absolutePath2}`);
    res.json({ success: true, message: 'Images swapped' });
  } catch (error) {
    console.error('Swap error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get version details (image counts) for a chapter
app.get('/api/bookmarks/:id/chapters/:num/versions', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const chapterNum = parseFloat(req.params.num);
    const versions = await downloader.getExistingVersions(
      bookmark.title,
      chapterNum,
      bookmark.alias
    );

    // Map folder names to URL hashes for matching
    const downloadedVersions = bookmark.downloadedVersions?.[chapterNum] || [];
    const urlList = Array.isArray(downloadedVersions) ? downloadedVersions : [downloadedVersions];

    const versionDetails = versions.map(v => {
      // Extract version hash from folder name (e.g., "Chapter 00098 v5me7" -> "5me7")
      const hashMatch = v.folder.match(/ v([a-z0-9]+)$/i);
      const folderHash = hashMatch ? hashMatch[1] : null;

      // Try to match to a URL by comparing hashes
      let matchedUrl = null;
      for (const url of urlList) {
        const urlHash = downloader.getVersionFromUrl(url);
        if (folderHash && urlHash === folderHash) {
          matchedUrl = url;
          break;
        }
      }

      // If no hash match but folder is unversioned, match to first URL that doesn't have a version folder
      if (!matchedUrl && !v.isVersioned && urlList.length > 0) {
        // Find a URL whose hash doesn't match any versioned folder
        for (const url of urlList) {
          const urlHash = downloader.getVersionFromUrl(url);
          const hasMatchingFolder = versions.some(ver => {
            const verHashMatch = ver.folder.match(/ v([a-z0-9]+)$/i);
            return verHashMatch && verHashMatch[1] === urlHash;
          });
          if (!hasMatchingFolder) {
            matchedUrl = url;
            break;
          }
        }
      }

      return {
        folder: v.folder,
        imageCount: v.imageCount,
        isVersioned: v.isVersioned,
        hash: folderHash,
        url: matchedUrl
      };
    });

    res.json({ versions: versionDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a downloaded chapter
app.delete('/api/bookmarks/:id/chapters/:num/download', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const chapterNum = parseFloat(req.params.num);

    // Check if locked
    const allSettings = chapterSettingsDb.getAll();
    const settings = allSettings[bookmark.id]?.[chapterNum];
    if (settings?.locked) {
      return res.status(403).json({ error: 'Chapter is locked and cannot be deleted' });
    }

    const chapter = bookmark.chapters.find(c => c.number === chapterNum);

    // Delete the chapter folder
    const result = await downloader.deleteChapter(bookmark.title, chapterNum, bookmark.alias);

    if (result.success) {
      // Mark as deleted in bookmark (with URL tracking)
      await bookmarkDb.markChapterDeleted(
        bookmark.id,
        chapterNum,
        chapter?.url
      );
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scan local downloads to sync with bookmark
app.post('/api/bookmarks/:id/scan-local', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const localChapters = await downloader.scanLocalChapters(bookmark.title, bookmark.alias);
    const localNumbers = localChapters.map(c => c.number);
    const localNumberSet = new Set(localNumbers);

    // Detect chapters that were previously marked as downloaded but no longer exist
    const previousDownloaded = bookmark.downloadedChapters || [];
    const removedChapters = previousDownloaded.filter(num => !localNumberSet.has(num));
    const addedChapters = localNumbers.filter(num => !previousDownloaded.includes(num));

    // Check for chapters that exist locally but not in the chapter data
    const existingChapterNumbers = new Set((bookmark.chapters || []).map(c => c.number));
    const missingFromData = localNumbers.filter(num => !existingChapterNumbers.has(num));

    // Add missing chapters to the chapter list
    let chaptersToMerge = null;
    if (missingFromData.length > 0) {
      const existingChapters = bookmark.chapters || [];
      const newChapterEntries = missingFromData.map(num => {
        const localInfo = localChapters.find(c => c.number === num);
        return {
          number: num,
          title: `Chapter ${num}`,
          url: `local://${bookmark.id}/chapter-${num}`, // Synthetic local URL
          version: 1,
          totalVersions: 1,
          removedFromRemote: true // Mark as local-only
        };
      });
      chaptersToMerge = [...existingChapters, ...newChapterEntries];
    }

    // Build a map of existing folders by chapter number and version hash
    const existingFolders = new Map();
    localChapters.forEach(ch => {
      if (!existingFolders.has(ch.number)) {
        existingFolders.set(ch.number, new Set());
      }
      if (ch.version) {
        existingFolders.get(ch.number).add(ch.version);
      } else {
        existingFolders.get(ch.number).add('base'); // Mark non-versioned as 'base'
      }
    });

    // Update downloadedVersions to match reality
    const currentVersions = bookmark.downloadedVersions || {};
    const newVersions = {};

    for (const [numStr, urls] of Object.entries(currentVersions)) {
      const num = parseFloat(numStr);
      const existingVersionHashes = existingFolders.get(num) || new Set();

      // Filter URLs to only those whose folders still exist
      const urlArray = Array.isArray(urls) ? urls : [urls];
      const validUrls = urlArray.filter(url => {
        const versionHash = downloader.getVersionFromUrl(url);
        // Check if folder exists (either versioned or base)
        return existingVersionHashes.has(versionHash) ||
          (existingVersionHashes.has('base') && urlArray.length === 1);
      });

      if (validUrls.length > 0) {
        newVersions[numStr] = validUrls.length === 1 ? validUrls[0] : validUrls;
      }
    }

    // Also add local URLs for chapters that exist on disk but have no tracked version
    for (const num of missingFromData) {
      if (!newVersions[num]) {
        newVersions[num] = `local://${bookmark.id}/chapter-${num}`;
      }
    }

    // Update bookmark with merged data
    const updateData = {
      downloadedChapters: localNumbers,
      downloadedVersions: newVersions
    };

    if (chaptersToMerge) {
      updateData.chapters = chaptersToMerge;
      updateData.totalChapters = chaptersToMerge.length;
      // Calculate uniqueChapters excluding excluded chapters
      const excludedSet = new Set(bookmark.excludedChapters || []);
      updateData.uniqueChapters = new Set(chaptersToMerge.map(c => c.number).filter(n => !excludedSet.has(n))).size;
    } else {
      // Always recalculate uniqueChapters to fix any desync, excluding excluded chapters
      const currentChapters = bookmark.chapters || [];
      const excludedSet = new Set(bookmark.excludedChapters || []);
      updateData.uniqueChapters = new Set(currentChapters.map(c => c.number).filter(n => !excludedSet.has(n))).size;
    }

    await bookmarkDb.update(bookmark.id, updateData);

    res.json({
      success: true,
      localChapters,
      count: localNumbers.length,
      removedChapters,
      addedChapters,
      addedToData: missingFromData,
      changed: removedChapters.length > 0 || addedChapters.length > 0 || missingFromData.length > 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear deleted URL tracking for a chapter (allow re-download)
app.post('/api/bookmarks/:id/clear-deleted/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url);
    await bookmarkDb.clearDeletedUrl(req.params.id, url);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear updated chapter flag
app.post('/api/bookmarks/:id/clear-updated/:num', async (req, res) => {
  try {
    const chapterNum = parseFloat(req.params.num);
    await bookmarkDb.clearUpdatedChapter(req.params.id, chapterNum);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all covers for a manga
app.get('/api/bookmarks/:id/covers', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const covers = await downloader.getCovers(bookmark.title, bookmark.alias);
    const activeCover = await downloader.getActiveCover(bookmark.title, bookmark.alias);

    res.json({
      covers: covers.map(c => ({
        filename: c.filename,
        url: `/api/bookmarks/${req.params.id}/covers/${encodeURIComponent(c.filename)}`,
        isActive: activeCover && c.filename === activeCover.filename
      })),
      activeCover: activeCover ? {
        filename: activeCover.filename,
        url: `/api/bookmarks/${req.params.id}/covers/${encodeURIComponent(activeCover.filename)}`
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve a specific cover image
app.get('/api/bookmarks/:id/covers/:filename', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
    const filePath = path.join(coverDir, decodeURIComponent(req.params.filename));

    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ error: 'Cover not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set active cover
app.post('/api/bookmarks/:id/covers/:filename/activate', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    const filename = decodeURIComponent(req.params.filename);
    await downloader.setActiveCover(bookmark.title, filename, bookmark.alias);

    // Update bookmark with new active cover path
    const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
    const newCoverPath = path.join(coverDir, filename);
    await bookmarkDb.update(bookmark.id, { localCover: newCoverPath });

    res.json({ success: true, message: 'Cover activated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set first image of first chapter as cover
app.post('/api/bookmarks/:id/covers/from-chapter', async (req, res) => {
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    // Get downloaded chapters
    const chapters = await downloader.scanLocalChapters(bookmark.title, bookmark.alias);
    if (chapters.length === 0) {
      return res.status(404).json({ error: 'No downloaded chapters found' });
    }

    // Find lowest chapter number
    const firstChapter = chapters.sort((a, b) => a.number - b.number)[0];
    const chapterDir = downloader.getChapterDir(bookmark.title, firstChapter.number, bookmark.alias, firstChapter.version);

    // Get first image
    const files = await fs.readdir(chapterDir);
    const imageFiles = files
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort();

    if (imageFiles.length === 0) {
      return res.status(404).json({ error: 'No images found in chapter' });
    }

    const firstImagePath = path.join(chapterDir, imageFiles[0]);

    // Copy to covers folder
    const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
    await fs.ensureDir(coverDir);

    const ext = path.extname(imageFiles[0]);
    const coverFilename = `cover_from_chapter${ext}`;
    const coverPath = path.join(coverDir, coverFilename);

    await fs.copy(firstImagePath, coverPath);

    // Set as active cover
    await downloader.setActiveCover(bookmark.title, coverFilename, bookmark.alias);
    await bookmarkDb.update(bookmark.id, { localCover: coverPath });

    res.json({ success: true, coverPath: `/api/bookmarks/${bookmark.id}/covers/${encodeURIComponent(coverFilename)}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FAVORITES API ====================

// Get all favorites
app.get('/api/favorites', async (req, res) => {
  try {
    const data = favoritesDb.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save all favorites (full replace)
app.put('/api/favorites', async (req, res) => {
  try {
    const { favorites, listOrder } = req.body;
    favoritesDb.saveAll({ favorites: favorites || {}, listOrder: listOrder || [] });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new list
app.post('/api/favorites/lists', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'List name required' });
    }
    const result = favoritesDb.createList(name);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a list
app.delete('/api/favorites/lists/:name', async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    favoritesDb.deleteList(name);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rename a list
app.patch('/api/favorites/lists/:name', async (req, res) => {
  try {
    const oldName = decodeURIComponent(req.params.name);
    const { newName } = req.body;
    if (!newName) {
      return res.status(400).json({ error: 'New name required' });
    }
    const result = favoritesDb.renameList(oldName, newName);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a favorite to a list
app.post('/api/favorites/lists/:name/items', async (req, res) => {
  try {
    const listName = decodeURIComponent(req.params.name);
    const favorite = req.body;
    favoritesDb.addFavorite(listName, favorite);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove a favorite from a list
app.delete('/api/favorites/lists/:name/items/:index', async (req, res) => {
  try {
    const listName = decodeURIComponent(req.params.name);
    const index = parseInt(req.params.index, 10);
    const result = favoritesDb.removeFavorite(listName, index);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CHAPTER SETTINGS API ====================

// Get all chapter settings
app.get('/api/chapter-settings', async (req, res) => {
  try {
    const data = chapterSettingsDb.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chapter settings for a manga
app.get('/api/chapter-settings/:mangaId', async (req, res) => {
  try {
    const { mangaId } = req.params;
    const allSettings = chapterSettingsDb.getAll();
    res.json(allSettings[mangaId] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save chapter settings for a specific manga/chapter
app.put('/api/chapter-settings/:mangaId/:chapterNum', async (req, res) => {
  try {
    const { mangaId, chapterNum } = req.params;
    const settings = req.body;
    chapterSettingsDb.save(mangaId, parseFloat(chapterNum), settings);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save all chapter settings (full replace)
app.put('/api/chapter-settings', async (req, res) => {
  try {
    chapterSettingsDb.saveAll(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TROPHY PAGES API ====================

// Get all trophy pages
app.get('/api/trophy-pages', async (req, res) => {
  try {
    const data = trophyDb.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save all trophy pages (full replace)
app.put('/api/trophy-pages', async (req, res) => {
  try {
    trophyDb.saveAll(req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save trophy pages for a specific manga/chapter
app.put('/api/trophy-pages/:mangaId/:chapterNum', async (req, res) => {
  try {
    const { mangaId, chapterNum } = req.params;
    const trophyMap = req.body;
    trophyDb.save(mangaId, parseFloat(chapterNum), trophyMap);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== READER SETTINGS API ====================

// Get all reader settings
app.get('/api/reader-settings', async (req, res) => {
  try {
    const data = readerSettingsDb.getAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save reader settings
app.put('/api/reader-settings', async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      readerSettingsDb.set(key, value);
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== PUSH NOTIFICATIONS ====================

// Simple VAPID-less push for testing (in production, use web-push library)
// For now, we'll store subscriptions and send via the service worker

// Subscribe to push notifications
app.post('/api/push/subscribe', async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    const db = getDb();
    const now = new Date().toISOString();

    // Insert or update subscription
    db.prepare(`
      INSERT OR REPLACE INTO push_subscriptions (endpoint, keys, created_at)
      VALUES (?, ?, ?)
    `).run(endpoint, JSON.stringify(keys || {}), now);

    console.log('[Push] Subscription saved:', endpoint.substring(0, 50) + '...');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unsubscribe from push notifications
app.post('/api/push/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({ error: 'Endpoint required' });
    }

    const db = getDb();
    db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get subscription count (for status display)
app.get('/api/push/status', (req, res) => {
  try {
    const db = getDb();
    const count = db.prepare('SELECT COUNT(*) as count FROM push_subscriptions').get();
    res.json({
      subscriptionCount: count.count,
      pushEnabled: count.count > 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper to send push notifications (called when new chapters found)
async function sendPushNotifications(mangaTitle, chapterCount) {
  try {
    const db = getDb();
    const subscriptions = db.prepare('SELECT * FROM push_subscriptions').all();

    if (subscriptions.length === 0) return;

    console.log(`[Push] Sending notification to ${subscriptions.length} devices: ${mangaTitle}`);

    // Note: For real push notifications, you need the web-push library and VAPID keys
    // This is a placeholder - the actual push would happen via browser's Push API
    // For now, we'll log it and the service worker will handle display

    // Store notification for clients to poll
    global.pendingNotifications = global.pendingNotifications || [];
    global.pendingNotifications.push({
      title: 'New Manga Chapter!',
      body: `${chapterCount} new chapter${chapterCount > 1 ? 's' : ''} for ${mangaTitle}`,
      timestamp: Date.now()
    });

    // Clean old notifications (keep last 10)
    if (global.pendingNotifications.length > 10) {
      global.pendingNotifications = global.pendingNotifications.slice(-10);
    }
  } catch (err) {
    console.error('[Push] Failed to send notifications:', err);
  }
}

// Get pending notifications (polled by client)
app.get('/api/push/pending', (req, res) => {
  const notifications = global.pendingNotifications || [];
  global.pendingNotifications = []; // Clear after reading
  res.json({ notifications });
});

// ==================== AUTO-CHECK SCHEDULER ====================

// Toggle auto-check for a bookmark
app.post('/api/bookmarks/:id/auto-check', async (req, res) => {
  try {
    const { enabled, autoDownload } = req.body;
    const updates = {};

    if (enabled !== undefined) {
      updates.autoCheck = enabled ? 1 : 0;
    }
    if (autoDownload !== undefined) {
      updates.autoDownload = autoDownload ? 1 : 0;
    }

    const result = bookmarkDb.update(req.params.id, updates);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get auto-check status
app.get('/api/auto-check/status', (req, res) => {
  try {
    const db = getDb();
    const enabled = db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE auto_check = 1').get();
    const total = db.prepare('SELECT COUNT(*) as count FROM bookmarks').get();
    res.json({
      enabledCount: enabled.count,
      totalCount: total.count,
      lastRun: global.lastAutoCheckRun || null,
      nextRun: global.nextAutoCheckRun || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual trigger for auto-check (useful for testing)
app.post('/api/auto-check/run', async (req, res) => {
  try {
    const result = await runAutoCheck();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auto-check function with staggered timing
async function runAutoCheck() {
  console.log('[Auto-Check] Starting scheduled check...');
  global.lastAutoCheckRun = new Date().toISOString();

  const db = getDb();
  const autoCheckEnabled = db.prepare(`
    SELECT id, url, title, alias, website 
    FROM bookmarks 
    WHERE auto_check = 1 AND website IS NOT NULL AND website != 'Local'
  `).all();

  // Shuffle to spread load across different websites
  const shuffled = [...autoCheckEnabled].sort(() => Math.random() - 0.5);

  const results = {
    checked: 0,
    updated: 0,
    downloaded: 0,
    errors: [],
    totalToCheck: shuffled.length
  };

  console.log(`[Auto-Check] Checking ${shuffled.length} manga with staggered timing...`);

  for (let i = 0; i < shuffled.length; i++) {
    const manga = shuffled[i];

    // Add 30-second delay between checks (except for first one)
    if (i > 0) {
      console.log(`[Auto-Check] Waiting 30s before next check (${i}/${shuffled.length})...`);
      await new Promise(r => setTimeout(r, 30000));
    }

    try {
      console.log(`[Auto-Check] Checking: ${manga.alias || manga.title}`);


      // Use quick check for efficiency
      const scraper = scraperFactory.getScraperForUrl(manga.url);
      if (!scraper || !scraper.supportsQuickCheck) {
        continue;
      }

      // Get current known chapter URLs
      const bookmark = bookmarkDb.getById(manga.id);
      const knownUrls = (bookmark.chapters || []).map(c => c.url);

      // Quick check for updates
      const updateResult = await scraper.quickCheckUpdates(manga.url, knownUrls);
      results.checked++;

      if (updateResult.hasUpdates && updateResult.newChapters.length > 0) {
        console.log(`[Auto-Check] Found ${updateResult.newChapters.length} new chapters for ${manga.title}`);
        results.updated++;

        // Send push notification
        await sendPushNotifications(manga.alias || manga.title, updateResult.newChapters.length);

        // If auto-download is enabled, queue downloads
        if (bookmark.autoDownload) {
          for (const chapter of updateResult.newChapters) {
            try {
              await taskQueue.addAndWait({
                type: 'download',
                description: `Auto-downloading Ch.${chapter.number} of ${manga.alias || manga.title}`,
                mangaId: manga.id,
                mangaTitle: manga.alias || manga.title,
                execute: async () => {
                  return await downloader.downloadChapter(
                    manga.title,
                    chapter.number,
                    chapter.url,
                    manga.alias
                  );
                }
              });
              results.downloaded++;
            } catch (dlErr) {
              console.error(`[Auto-Check] Download failed: ${dlErr.message}`);
              results.errors.push({ manga: manga.title, chapter: chapter.number, error: dlErr.message });
            }
          }
        }
      }
    } catch (err) {
      console.error(`[Auto-Check] Error checking ${manga.title}: ${err.message}`);
      results.errors.push({ manga: manga.title, error: err.message });
    }
  }

  console.log(`[Auto-Check] Complete. Checked: ${results.checked}, Updated: ${results.updated}, Downloaded: ${results.downloaded}`);
  return results;
}

// Schedule auto-check every 6 hours
function scheduleAutoCheck() {
  const SIX_HOURS = 6 * 60 * 60 * 1000;

  const runScheduled = async () => {
    try {
      await runAutoCheck();
    } catch (err) {
      console.error('[Auto-Check] Scheduled check failed:', err);
    }
    // Schedule next run
    global.nextAutoCheckRun = new Date(Date.now() + SIX_HOURS).toISOString();
    setTimeout(runScheduled, SIX_HOURS);
  };

  // Set initial next run time
  global.nextAutoCheckRun = new Date(Date.now() + SIX_HOURS).toISOString();
  setTimeout(runScheduled, SIX_HOURS);

  console.log('[Auto-Check] Scheduler started (runs every 6 hours)');
}

// Initialize and start server
async function start() {
  // Initialize database and migrate from JSON if needed
  initDatabase();
  await migrateFromJson();

  await scraperFactory.init();

  // Start auto-check scheduler
  scheduleAutoCheck();

  app.listen(port, () => {
    console.log(`\n🚀 Manga Scraper Web UI running at http://localhost:${port}\n`);
  });
}

start().catch(console.error);

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  closeDatabase();
  await scraperFactory.close();
  process.exit(0);
});
