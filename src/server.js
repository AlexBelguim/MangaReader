import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { scraperFactory } from './scrapers/templates/index.js';
import { downloader } from './downloader.js';
import { CONFIG } from './config.js';
import { requestLogger, logger } from './logger.js';
import {
  initDatabase,
  migrateFromJson,
  getDb,
  artistDb,
  bookmarkDb,
  closeDatabase
} from './database.js';
import { favoritesDb } from './db/favorites.js';
import { trophyDb } from './db/trophies.js';

// Import route modules
import adminRouter from './routes/admin.js';
import chaptersRouter from './routes/chapters.js';
import settingsRouter from './routes/settings.js';
import bookmarksRouter from './routes/bookmarks.js';
import favoritesRouter from './routes/favorites.js';
import categoriesRouter from './routes/categories.js';
import artistsRouter from './routes/artists.js';
import seriesRouter from './routes/series.js';
import volumesRouter from './routes/volumes.js';
import readerRouter from './routes/reader.js';
import downloadsRouter from './routes/downloads.js';
import dataRouter from './routes/data.js';

import { queue } from './queue.js';
import { auth } from './middleware/auth.js';
import { login } from './controllers/auth_controller.js';
import { runMigrations } from './db/migrations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const port = CONFIG.port || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// ==================== PUBLIC ROUTES (before auth) ====================

// Proxy image from local folder
app.get('/api/proxy-image', async (req, res) => {
  try {
    const imagePath = req.query.path;
    if (!imagePath) return res.status(400).send('Missing path');

    const decodedPath = decodeURIComponent(imagePath);
    const resolvedPath = path.resolve(decodedPath);
    const resolvedDownloadsDir = path.resolve(CONFIG.downloadsDir);

    // Security check - ensure path is within downloads dir
    if (!resolvedPath.startsWith(resolvedDownloadsDir)) {
      return res.status(403).send('Access denied');
    }

    const stat = await fs.stat(resolvedPath);
    if (!stat.isFile()) return res.status(404).send('Not found');

    const ext = path.extname(resolvedPath).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    res.setHeader('Content-Type', contentTypes[ext] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const stream = fs.createReadStream(resolvedPath);
    stream.pipe(res);
  } catch (error) {
    console.error('Proxy image error:', error);
    res.status(500).send('Error loading image');
  }
});

// Public Cover Image Route
app.get('/api/public/covers/:id/:filename', async (req, res) => {
  console.log(`[Debug] Public cover request: ${req.params.id} / ${req.params.filename}`);
  try {
    const bookmark = await bookmarkDb.getById(req.params.id);
    if (!bookmark) return res.status(404).send('Not found');

    let filePath;
    const reqFilename = decodeURIComponent(req.params.filename);

    // If localCover is saved, try to use it directly
    if (bookmark.local_cover && bookmark.local_cover.endsWith(reqFilename)) {
      // Try the saved path directly first
      if (await fs.pathExists(bookmark.local_cover)) {
        filePath = bookmark.local_cover;
      } else {
        // Try to extract relative path and construct new path
        let relPath = bookmark.local_cover;

        // Handle various path formats
        if (relPath.startsWith('/downloads/')) {
          relPath = relPath.substring(11);
        } else if (relPath.startsWith('downloads/')) {
          relPath = relPath.substring(10);
        } else if (relPath.includes('/downloads/')) {
          // Handle full paths like /mnt/smb/.../downloads/...
          relPath = relPath.substring(relPath.indexOf('/downloads/') + 11);
        } else if (relPath.includes('\\downloads\\')) {
          // Handle Windows full paths like F:\...\downloads\...
          relPath = relPath.substring(relPath.indexOf('\\downloads\\') + 12);
        }

        // Try with CONFIG.downloadsDir
        const fullPath = path.join(CONFIG.downloadsDir, relPath);
        if (await fs.pathExists(fullPath)) {
          filePath = fullPath;
        }
      }
    }

    // Fall back to computed cover directory
    if (!filePath) {
      const coverDir = downloader.getCoverDir(bookmark.title, bookmark.alias);
      filePath = path.join(coverDir, reqFilename);
    }

    if (await fs.pathExists(filePath)) {
      res.sendFile(filePath);
    } else {
      console.log(`[Debug] Cover not found at: ${filePath}`);
      res.status(404).send('Cover not found');
    }
  } catch (e) {
    console.error(`Error serving cover: ${e.message}`);
    res.status(500).send('Error');
  }
});

// Public Chapter Image Route (For Cover Selector)
app.get('/api/public/chapter-images/:id/:chapter/:filename', async (req, res) => {
  try {
    const { id, chapter, filename } = req.params;
    const safeFilename = path.basename(filename);
    if (safeFilename !== filename || filename.includes('..')) {
      return res.status(403).send('Invalid filename');
    }

    const bookmark = await bookmarkDb.getById(id);
    if (!bookmark) return res.status(404).send('Not Found');

    const versions = await downloader.getExistingVersions(bookmark.title, parseFloat(chapter), bookmark.alias);
    const validVersion = versions.find(v => v.imageCount > 0);

    if (!validVersion) return res.status(404).send('Not Found');

    const decodedFilename = decodeURIComponent(filename);
    const filePath = path.join(validVersion.path, decodedFilename);

    if (await fs.pathExists(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (err) {
    console.error(`Error serving chapter image: ${err.message}`);
    res.status(500).send(err.message);
  }
});

// Static file serving
app.use(express.static(path.join(__dirname, 'public')));
app.use('/covers', express.static(path.join(CONFIG.dataDir, 'covers')));
app.use('/downloads', express.static(CONFIG.downloadsDir));

// ==================== QUEUE ALIAS ====================

const taskQueue = queue;

// Register Queue Processors
queue.registerProcessor('delete-chapter', async (jobData) => {
  const { bookmarkId, title, chapterNumber, alias, url } = jobData;
  logger.info(`[Queue-Worker] Processing delete-chapter for ${title} Ch.${chapterNumber}`);

  try {
    await downloader.deleteChapter(title, chapterNumber, alias, url);

    if (bookmarkId) {
      favoritesDb.deleteForChapter(bookmarkId, chapterNumber);
      trophyDb.deleteForChapter(bookmarkId, chapterNumber);
    }

    return { success: true };
  } catch (e) {
    throw new Error(`Failed to delete chapter: ${e.message}`);
  }
});

queue.registerProcessor('delete-manga-folder', async (jobData) => {
  const { title, alias } = jobData;
  logger.info(`[Queue-Worker] Processing delete-manga-folder for ${title}`);

  try {
    const mangaDir = downloader.getMangaDir(title, alias);
    if (await fs.pathExists(mangaDir)) {
      await fs.remove(mangaDir);
      logger.info(`Deleted manga folder: ${mangaDir}`);
    }
    return { success: true };
  } catch (e) {
    throw new Error(`Failed to delete manga folder: ${e.message}`);
  }
});

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

  if (result.success && mangaInfo.artists && mangaInfo.artists.length > 0) {
    artistDb.setForBookmark(result.bookmark.id, mangaInfo.artists);
  }

  return result;
});

// ==================== AUTH & ROUTE MOUNTING ====================

// Public auth endpoint
app.post('/api/auth/login', login);

// Protected routes middleware
app.use('/api', auth);

// Mount modular routes
app.use('/api/admin', adminRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/bookmarks', bookmarksRouter);
app.use('/api/bookmarks', volumesRouter);     // /api/bookmarks/:id/volumes/*
app.use('/api/bookmarks', readerRouter);      // /api/bookmarks/:id/chapters/*/images, versions, download
app.use('/api/favorites', favoritesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/artists', artistsRouter);
app.use('/api/series', seriesRouter);
app.use('/api', downloadsRouter);             // Mixed prefixes: /api/bookmarks/:id/download, /api/downloads/*, /api/check-all, etc.
app.use('/api', dataRouter);                  // /api/chapter-settings, /api/trophy-pages, /api/reader-settings, /api/push/*

// Queue Status
app.get('/api/queue/status', (req, res) => {
  res.json({
    active: queue.getActiveJobs().length
  });
});

app.get('/api/queue/tasks', (req, res) => {
  res.json(queue.getActiveJobs());
});

app.get('/api/queue/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  res.json(queue.getHistory(limit));
});

// Auto-check status
app.get('/api/auto-check/status', (req, res) => {
  try {
    const db = getDb();
    const enabled = db.prepare('SELECT COUNT(*) as count FROM bookmarks WHERE auto_check = 1').get();
    const total = db.prepare('SELECT COUNT(*) as count FROM bookmarks').get();

    // Get per-manga scheduled tasks
    const scheduledManga = db.prepare(`
      SELECT id, title, alias, auto_check, check_schedule, check_day, check_time, next_check
      FROM bookmarks 
      WHERE auto_check = 1
      ORDER BY next_check ASC
    `).all();

    const schedules = scheduledManga.map(m => ({
      id: m.id,
      title: m.alias || m.title,
      schedule: m.check_schedule || 'default',
      day: m.check_day,
      time: m.check_time,
      nextCheck: m.next_check
    }));

    res.json({
      enabledCount: enabled.count,
      totalCount: total.count,
      lastRun: global.lastAutoCheckRun || null,
      nextRun: global.nextAutoCheckRun || null,
      schedules
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Manual trigger for auto-check
app.post('/api/auto-check/run', async (req, res) => {
  try {
    const result = await runAutoCheck();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AUTO-CHECK SCHEDULER ====================

async function sendPushNotifications(mangaTitle, chapterCount) {
  try {
    const db = getDb();
    const subscriptions = db.prepare('SELECT * FROM push_subscriptions').all();

    if (subscriptions.length === 0) return;

    console.log(`[Push] Sending notification to ${subscriptions.length} devices: ${mangaTitle}`);

    global.pendingNotifications = global.pendingNotifications || [];
    global.pendingNotifications.push({
      title: 'New Manga Chapter!',
      body: `${chapterCount} new chapter${chapterCount > 1 ? 's' : ''} for ${mangaTitle}`,
      timestamp: Date.now()
    });

    if (global.pendingNotifications.length > 10) {
      global.pendingNotifications = global.pendingNotifications.slice(-10);
    }
  } catch (err) {
    console.error('[Push] Failed to send notifications:', err);
  }
}

async function runAutoCheck() {
  console.log('[Auto-Check] Starting scheduled check...');
  global.lastAutoCheckRun = new Date().toISOString();

  const db = getDb();
  const autoCheckEnabled = db.prepare(`
    SELECT id, url, title, alias, website, check_schedule, check_day, check_time, next_check
    FROM bookmarks 
    WHERE auto_check = 1 AND website IS NOT NULL AND website != 'Local'
  `).all();

  // Filter to only manga whose next_check is due (or has no schedule set = use default)
  const now = new Date();
  const dueForCheck = autoCheckEnabled.filter(m => {
    if (!m.next_check) return true; // No schedule set, always check
    return new Date(m.next_check) <= now;
  });

  const shuffled = [...dueForCheck].sort(() => Math.random() - 0.5);

  const results = {
    checked: 0,
    updated: 0,
    downloaded: 0,
    errors: [],
    totalToCheck: shuffled.length,
    totalEnabled: autoCheckEnabled.length
  };

  console.log(`[Auto-Check] Checking ${shuffled.length}/${autoCheckEnabled.length} manga with staggered timing...`);

  for (let i = 0; i < shuffled.length; i++) {
    const manga = shuffled[i];

    if (i > 0) {
      console.log(`[Auto-Check] Waiting 30s before next check (${i}/${shuffled.length})...`);
      await new Promise(r => setTimeout(r, 30000));
    }

    try {
      console.log(`[Auto-Check] Checking: ${manga.alias || manga.title}`);

      const scraper = scraperFactory.getScraperForUrl(manga.url);
      if (!scraper || !scraper.supportsQuickCheck) {
        continue;
      }

      const bookmark = bookmarkDb.getById(manga.id);
      const knownUrls = (bookmark.chapters || []).map(c => c.url);

      const updateResult = await scraper.quickCheckUpdates(manga.url, knownUrls);
      results.checked++;

      // Update next_check for this manga
      try {
        const sched = manga.check_schedule || 'daily';
        const dayMap = {
          'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
          'thursday': 4, 'friday': 5, 'saturday': 6
        };
        const checkTime = manga.check_time || '06:00';
        const [h, m] = checkTime.split(':').map(Number);
        let nextCheck;
        if (sched === 'weekly') {
          const targetDay = dayMap[(manga.check_day || 'monday').toLowerCase()] || 1;
          nextCheck = new Date();
          nextCheck.setHours(h, m, 0, 0);
          const currentDay = nextCheck.getDay();
          let daysUntil = targetDay - currentDay;
          if (daysUntil <= 0) daysUntil += 7;
          nextCheck.setDate(nextCheck.getDate() + daysUntil);
        } else {
          // daily
          nextCheck = new Date();
          nextCheck.setHours(h, m, 0, 0);
          if (nextCheck <= new Date()) nextCheck.setDate(nextCheck.getDate() + 1);
        }
        db.prepare('UPDATE bookmarks SET next_check = ? WHERE id = ?').run(nextCheck.toISOString(), manga.id);
      } catch (schedErr) {
        console.error(`[Auto-Check] Failed to update next_check for ${manga.title}: ${schedErr.message}`);
      }

      if (updateResult.hasUpdates && updateResult.newChapters.length > 0) {
        console.log(`[Auto-Check] Found ${updateResult.newChapters.length} new chapters for ${manga.title}`);
        results.updated++;

        // Merge new chapters into the bookmark's chapter list
        const existingChapters = bookmark.chapters || [];
        const existingUrls = new Set(existingChapters.map(c => c.url));
        const existingChapterNumbers = new Set(existingChapters.map(c => c.number));
        const chaptersToAdd = updateResult.newChapters.filter(c => !existingUrls.has(c.url));

        if (chaptersToAdd.length > 0) {
          const mergedChapters = [...existingChapters, ...chaptersToAdd];
          const uniqueChapterNumbers = new Set(mergedChapters.map(c => c.number));
          bookmarkDb.update(manga.id, {
            chapters: mergedChapters,
            totalChapters: mergedChapters.length,
            uniqueChapters: uniqueChapterNumbers.size
          });
        }

        // Only count truly new chapter numbers for notifications
        const trulyNewChapters = updateResult.newChapters.filter(c => !existingChapterNumbers.has(c.number));

        if (trulyNewChapters.length > 0) {
          await sendPushNotifications(manga.alias || manga.title, trulyNewChapters.length);
        }

        if (bookmark.autoDownload && trulyNewChapters.length > 0) {
          for (const chapter of trulyNewChapters) {
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

function scheduleAutoCheck() {
  const ONE_HOUR = 60 * 60 * 1000;

  const runScheduled = async () => {
    try {
      await runAutoCheck();
    } catch (err) {
      console.error('[Auto-Check] Scheduled check failed:', err);
    }
    global.nextAutoCheckRun = new Date(Date.now() + ONE_HOUR).toISOString();
    setTimeout(runScheduled, ONE_HOUR);
  };

  global.nextAutoCheckRun = new Date(Date.now() + ONE_HOUR).toISOString();
  setTimeout(runScheduled, ONE_HOUR);

  console.log('[Auto-Check] Scheduler started (checks every hour for due manga)');
}

// ==================== STARTUP ====================

async function start() {
  try {
    initDatabase();
  } catch (e) {
    console.error(`Failed to initialize database: ${e.message}`);
    logger.error(`Failed to initialize database: ${e.message}`);
    process.exit(1);
  }
  queue.recover();
  await migrateFromJson();
  await runMigrations();
  await scraperFactory.init();

  scheduleAutoCheck();

  // Socket.io connection handling
  io.on('connection', (socket) => {
    logger.info(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('subscribe:manga', (mangaId) => {
      socket.join(`manga:${mangaId}`);
      logger.debug(`[Socket.io] ${socket.id} subscribed to manga:${mangaId}`);
    });

    socket.on('unsubscribe:manga', (mangaId) => {
      socket.leave(`manga:${mangaId}`);
    });

    socket.on('subscribe:global', () => {
      socket.join('global');
    });

    socket.on('disconnect', () => {
      logger.debug(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`\n🚀 Manga Scraper Web UI running at http://localhost:${port}`);
    console.log(`   Socket.io enabled for real-time updates\n`);
  });
}

// Export io for use in other modules
export { io };

start().catch(console.error);

// Handle shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  closeDatabase();
  await scraperFactory.close();
  io.close();
  process.exit(0);
});
