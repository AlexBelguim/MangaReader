import fs from 'fs-extra';
import path from 'path';
import { CONFIG } from './config.js';

/**
 * Bookmark structure:
 * {
 *   id: string,
 *   url: string,
 *   title: string,
 *   alias: string | null,
 *   website: string,
 *   source: 'remote' | 'local',
 *   totalChapters: number,
 *   lastChecked: string,
 *   lastReadChapter: number,
 *   downloadedChapters: number[],           // Chapter numbers downloaded
 *   downloadedVersions: { [chapterNum]: url }, // Which specific URL was downloaded
 *   deletedChapterUrls: string[],           // URLs user has deleted
 *   newDuplicates: number[],                // Chapters that gained new duplicates since last check
 *   updatedChapters: object[],              // Chapters with URL changes (old URL we downloaded changed)
 *   createdAt: string,
 *   updatedAt: string
 * }
 */

class BookmarkManager {
  constructor() {
    this.bookmarks = [];
    this.loaded = false;
  }

  async ensureDataDir() {
    await fs.ensureDir(CONFIG.dataDir);
  }

  async load() {
    await this.ensureDataDir();

    if (await fs.pathExists(CONFIG.bookmarksFile)) {
      const data = await fs.readJson(CONFIG.bookmarksFile);
      this.bookmarks = data.bookmarks || [];
      this.categories = data.categories || [];
    } else {
      this.bookmarks = [];
      this.categories = [];
    }
    this.loaded = true;
  }

  async save() {
    await this.ensureDataDir();
    await fs.writeJson(CONFIG.bookmarksFile, {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      categories: this.categories || [],
      bookmarks: this.bookmarks
    }, { spaces: 2 });
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Category management
  async getCategories() {
    if (!this.loaded) await this.load();
    return this.categories || [];
  }

  async addCategory(name) {
    if (!this.loaded) await this.load();
    if (!this.categories) this.categories = [];

    const normalized = name.trim();
    if (this.categories.includes(normalized)) {
      return { success: false, message: 'Category already exists' };
    }

    this.categories.push(normalized);
    await this.save();
    return { success: true, category: normalized };
  }

  async deleteCategory(name) {
    if (!this.loaded) await this.load();
    if (!this.categories) return { success: false, message: 'No categories' };

    this.categories = this.categories.filter(c => c !== name);

    // Remove category from all bookmarks
    for (const bookmark of this.bookmarks) {
      if (bookmark.categories) {
        bookmark.categories = bookmark.categories.filter(c => c !== name);
      }
    }

    await this.save();
    return { success: true };
  }

  async setBookmarkCategories(id, categories) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    bookmark.categories = categories;
    bookmark.updatedAt = new Date().toISOString();
    await this.save();
    return { success: true, bookmark };
  }

  async add(mangaInfo) {
    if (!this.loaded) await this.load();

    // Check if already bookmarked (by URL)
    const existing = this.bookmarks.find(b => b.url === mangaInfo.url);
    if (existing) {
      return { success: false, message: 'Manga already bookmarked', bookmark: existing };
    }

    const bookmark = {
      id: this.generateId(),
      url: mangaInfo.url,
      title: mangaInfo.title,
      alias: null,
      website: mangaInfo.website,
      source: mangaInfo.source || 'remote',
      cover: mangaInfo.cover || null,
      description: mangaInfo.description || '',
      categories: [],
      totalChapters: mangaInfo.totalChapters,
      uniqueChapters: mangaInfo.uniqueChapters || mangaInfo.chapters?.length || 0,
      chapters: mangaInfo.chapters || [],
      duplicateChapters: mangaInfo.duplicateChapters || [],
      lastChecked: new Date().toISOString(),
      lastReadChapter: 0,
      downloadedChapters: [],
      downloadedVersions: {},    // { chapterNum: url } - which specific version downloaded
      deletedChapterUrls: [],
      newDuplicates: [],         // Chapters that gained new duplicates
      updatedChapters: [],       // Chapters where downloaded URL changed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.bookmarks.push(bookmark);
    await this.save();
    return { success: true, message: 'Bookmark added', bookmark };
  }

  async update(id, updates) {
    if (!this.loaded) await this.load();

    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index === -1) {
      return { success: false, message: 'Bookmark not found' };
    }

    this.bookmarks[index] = {
      ...this.bookmarks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.save();
    return { success: true, message: 'Bookmark updated', bookmark: this.bookmarks[index] };
  }

  async setAlias(id, alias) {
    return this.update(id, { alias });
  }

  async remove(id) {
    if (!this.loaded) await this.load();

    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index === -1) {
      return { success: false, message: 'Bookmark not found' };
    }

    const removed = this.bookmarks.splice(index, 1)[0];
    await this.save();
    return { success: true, message: 'Bookmark removed', bookmark: removed };
  }

  async getAll() {
    if (!this.loaded) await this.load();
    return this.bookmarks;
  }

  async getById(id) {
    if (!this.loaded) await this.load();
    return this.bookmarks.find(b => b.id === id);
  }

  async getByUrl(url) {
    if (!this.loaded) await this.load();
    return this.bookmarks.find(b => b.url === url);
  }

  async findByTitleOrAlias(search) {
    if (!this.loaded) await this.load();
    const searchLower = search.toLowerCase();
    return this.bookmarks.filter(b =>
      b.title.toLowerCase().includes(searchLower) ||
      (b.alias && b.alias.toLowerCase().includes(searchLower))
    );
  }

  async markChapterDownloaded(id, chapterNumber, chapterUrl = null) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    if (!bookmark.downloadedChapters.includes(chapterNumber)) {
      bookmark.downloadedChapters.push(chapterNumber);
      bookmark.downloadedChapters.sort((a, b) => a - b);
    }

    // Track which specific versions were downloaded (as array)
    if (chapterUrl) {
      if (!bookmark.downloadedVersions) bookmark.downloadedVersions = {};

      // Convert old format (single URL) to array if needed
      const existing = bookmark.downloadedVersions[chapterNumber];
      if (typeof existing === 'string') {
        bookmark.downloadedVersions[chapterNumber] = [existing];
      } else if (!Array.isArray(existing)) {
        bookmark.downloadedVersions[chapterNumber] = [];
      }

      // Add URL if not already tracked
      if (!bookmark.downloadedVersions[chapterNumber].includes(chapterUrl)) {
        bookmark.downloadedVersions[chapterNumber].push(chapterUrl);
      }
    }

    // Remove from newDuplicates once downloaded
    if (bookmark.newDuplicates) {
      bookmark.newDuplicates = bookmark.newDuplicates.filter(n => n !== chapterNumber);
    }

    bookmark.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true };
  }

  async updateChapterCount(id, totalChapters, chapters = [], cover = null, duplicateChapters = []) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    const downloadedVersions = bookmark.downloadedVersions || {};
    const oldDuplicateNums = new Set((bookmark.duplicateChapters || []).map(d => d.number));
    const newDuplicateNums = new Set(duplicateChapters.map(d => d.number));

    // Detect NEW duplicates (chapters that weren't duplicates before but are now)
    const newDuplicates = [];
    for (const dup of duplicateChapters) {
      if (!oldDuplicateNums.has(dup.number)) {
        // This is a new duplicate - chapter gained additional versions
        newDuplicates.push(dup.number);
      }
    }

    // Detect updated chapters: 
    // If we downloaded a specific URL and that URL is no longer in the chapter list
    // OR if a new version appeared for a chapter we downloaded
    const updatedChapters = [];
    const urlChangedChapters = []; // Track chapters where URL changed
    const currentChapterUrls = new Map(); // number -> [urls]

    for (const ch of chapters) {
      if (!currentChapterUrls.has(ch.number)) {
        currentChapterUrls.set(ch.number, []);
      }
      currentChapterUrls.get(ch.number).push(ch.url);
    }

    // Handle array format for downloadedVersions
    const getDownloadedUrls = (chapterNum) => {
      const val = downloadedVersions[chapterNum];
      if (!val) return [];
      if (typeof val === 'string') return [val];
      if (Array.isArray(val)) return val;
      return [];
    };

    for (const [chapterNum, _] of Object.entries(downloadedVersions)) {
      const num = parseFloat(chapterNum);
      const downloadedUrls = getDownloadedUrls(chapterNum);
      const currentUrls = currentChapterUrls.get(num) || [];

      for (const downloadedUrl of downloadedUrls) {
        // Check if our downloaded URL still exists on remote
        if (!currentUrls.includes(downloadedUrl)) {
          // Our downloaded version's URL is no longer on remote
          // This could be: URL changed, or chapter removed
          if (currentUrls.length > 0) {
            // URL changed - there are new URLs for this chapter
            updatedChapters.push({
              number: num,
              oldUrl: downloadedUrl,
              newUrls: currentUrls,
              type: 'url_changed',
              detectedAt: new Date().toISOString()
            });
            // Track this so we keep the old URL in chapter list
            urlChangedChapters.push({
              number: num,
              oldUrl: downloadedUrl
            });
          }
          // If currentUrls is empty, chapter was removed - handled by merge logic below
        }
      }

      // Check for new duplicates
      if (currentUrls.length > 1 && !oldDuplicateNums.has(num)) {
        updatedChapters.push({
          number: num,
          downloadedUrls: downloadedUrls,
          allUrls: currentUrls,
          type: 'new_version',
          detectedAt: new Date().toISOString()
        });
      }
    }

    // SAFE MERGE: Don't lose chapters that exist locally but not on remote
    // Merge new chapters with existing, keeping any that are downloaded
    const existingChapterMap = new Map();
    for (const ch of (bookmark.chapters || [])) {
      const key = `${ch.number}|${ch.url}`;
      existingChapterMap.set(key, ch);
    }

    // Add new chapters from remote
    for (const ch of chapters) {
      const key = `${ch.number}|${ch.url}`;
      existingChapterMap.set(key, ch);
    }

    // Also add old URLs from url_changed chapters (so they appear as duplicates)
    for (const changed of urlChangedChapters) {
      const key = `${changed.number}|${changed.oldUrl}`;
      if (!existingChapterMap.has(key)) {
        // Find existing chapter info for this number to get title
        const existingCh = (bookmark.chapters || []).find(c => c.url === changed.oldUrl);
        existingChapterMap.set(key, {
          number: changed.number,
          title: existingCh?.title || `Chapter ${changed.number}`,
          url: changed.oldUrl,
          urlChanged: true,  // Mark as old URL
          isOldVersion: true
        });
      }
    }

    // Build merged chapter list
    // Keep downloaded chapters even if removed from remote
    const downloadedChapterNums = new Set(bookmark.downloadedChapters || []);
    const remoteUrls = new Set(chapters.map(c => c.url));

    // Also get all downloaded URLs
    const allDownloadedUrls = new Set();
    for (const [chNum, val] of Object.entries(downloadedVersions)) {
      if (typeof val === 'string') allDownloadedUrls.add(val);
      else if (Array.isArray(val)) val.forEach(u => allDownloadedUrls.add(u));
    }

    const mergedChapters = [];
    const removedFromRemote = [];

    for (const [key, ch] of existingChapterMap) {
      if (remoteUrls.has(ch.url)) {
        // Chapter still exists on remote
        mergedChapters.push(ch);
      } else if (allDownloadedUrls.has(ch.url)) {
        // This specific URL was downloaded - KEEP IT (for url_changed cases)
        mergedChapters.push({ ...ch, removedFromRemote: true });
        if (!removedFromRemote.includes(ch.number)) {
          removedFromRemote.push(ch.number);
        }
      } else if (downloadedChapterNums.has(ch.number) && ch.urlChanged) {
        // Old URL that changed - keep it so user can see both versions
        mergedChapters.push({ ...ch, removedFromRemote: true });
      }
      // If not on remote AND not downloaded, we can drop it
    }


    const updates = {
      totalChapters,
      uniqueChapters: new Set(mergedChapters.map(c => c.number).filter(n => !(bookmark.excludedChapters || []).includes(n))).size,
      chapters: mergedChapters,
      duplicateChapters,
      lastChecked: new Date().toISOString()
    };

    // Track chapters that were removed from remote but we have locally
    if (removedFromRemote.length > 0) {
      updates.removedFromRemote = [...(bookmark.removedFromRemote || []), ...removedFromRemote]
        .filter((v, i, a) => a.indexOf(v) === i);
    }

    // Only track new duplicates for chapters we care about
    if (newDuplicates.length > 0) {
      updates.newDuplicates = [...(bookmark.newDuplicates || []), ...newDuplicates]
        .filter((v, i, a) => a.indexOf(v) === i); // unique
    }

    if (updatedChapters.length > 0) {
      const existingUpdated = bookmark.updatedChapters || [];
      const updatedMap = new Map(existingUpdated.map(u => [u.number, u]));
      for (const u of updatedChapters) {
        updatedMap.set(u.number, u);
      }
      updates.updatedChapters = Array.from(updatedMap.values());
    }

    if (cover) {
      updates.cover = cover;
    }
    return this.update(id, updates);
  }

  async markChapterDeleted(id, chapterNumber, chapterUrl) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    // Remove from downloadedChapters
    bookmark.downloadedChapters = bookmark.downloadedChapters.filter(n => n !== chapterNumber);

    // Add URL to deletedChapterUrls if not already there
    if (!bookmark.deletedChapterUrls) {
      bookmark.deletedChapterUrls = [];
    }
    if (chapterUrl && !bookmark.deletedChapterUrls.includes(chapterUrl)) {
      bookmark.deletedChapterUrls.push(chapterUrl);
    }

    bookmark.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true };
  }

  async clearUpdatedChapter(id, chapterNumber) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    bookmark.updatedChapters = (bookmark.updatedChapters || []).filter(u => u.number !== chapterNumber);
    bookmark.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true };
  }

  async clearDeletedUrl(id, url) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    bookmark.deletedChapterUrls = (bookmark.deletedChapterUrls || []).filter(u => u !== url);
    bookmark.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true };
  }

  // Reading progress tracking
  async updateReadingProgress(id, chapterNumber, page, totalPages) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    // Initialize reading progress structure
    if (!bookmark.readingProgress) {
      bookmark.readingProgress = {};
    }

    // Update progress for this chapter
    bookmark.readingProgress[chapterNumber] = {
      page,
      totalPages,
      lastRead: new Date().toISOString()
    };

    // Update last read chapter
    bookmark.lastReadChapter = chapterNumber;
    bookmark.lastReadAt = new Date().toISOString();

    // Mark chapter as read if on last page
    if (page >= totalPages) {
      if (!bookmark.readChapters) bookmark.readChapters = [];
      if (!bookmark.readChapters.includes(chapterNumber)) {
        bookmark.readChapters.push(chapterNumber);
      }
    }

    bookmark.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true };
  }

  async markChapterRead(id, chapterNumber, isRead = true) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    if (!bookmark.readChapters) bookmark.readChapters = [];

    if (isRead) {
      if (!bookmark.readChapters.includes(chapterNumber)) {
        bookmark.readChapters.push(chapterNumber);
      }
    } else {
      bookmark.readChapters = bookmark.readChapters.filter(n => n !== chapterNumber);
    }

    bookmark.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true };
  }

  async markChaptersReadBelow(id, chapterNumber) {
    if (!this.loaded) await this.load();

    const bookmark = this.bookmarks.find(b => b.id === id);
    if (!bookmark) {
      return { success: false, message: 'Bookmark not found' };
    }

    if (!bookmark.readChapters) bookmark.readChapters = [];

    // Get all chapter numbers <= chapterNumber
    const chaptersToMark = bookmark.chapters
      .filter(c => c.number <= chapterNumber)
      .map(c => c.number);

    // Add all to readChapters (avoiding duplicates)
    for (const num of chaptersToMark) {
      if (!bookmark.readChapters.includes(num)) {
        bookmark.readChapters.push(num);
      }
    }

    bookmark.updatedAt = new Date().toISOString();
    await this.save();

    return { success: true, count: chaptersToMark.length };
  }

  getDisplayName(bookmark) {
    return bookmark.alias || bookmark.title;
  }
}

export const bookmarkManager = new BookmarkManager();
export default bookmarkManager;
