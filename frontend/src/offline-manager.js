/**
 * Offline Manager
 * Manages chapter offline storage in IndexedDB.
 * Stores chapter images as blobs for offline reading.
 */

import { api } from './api.js';

const DB_NAME = 'manga-offline';
const DB_VERSION = 1;
const IMAGE_STORE = 'images';
const CHAPTER_STORE = 'chapters';

let _db = null;

// ==================== DATABASE ====================

function openDB() {
    return new Promise((resolve, reject) => {
        if (_db) return resolve(_db);

        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(IMAGE_STORE)) {
                db.createObjectStore(IMAGE_STORE);
            }
            if (!db.objectStoreNames.contains(CHAPTER_STORE)) {
                db.createObjectStore(CHAPTER_STORE);
            }
        };
        req.onsuccess = () => {
            _db = req.result;
            resolve(_db);
        };
        req.onerror = () => reject(req.error);
    });
}

function dbGet(storeName, key) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    }));
}

function dbPut(storeName, key, value) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    }));
}

function dbDelete(storeName, key) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    }));
}

function dbGetAllKeys(storeName) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    }));
}

// ==================== CHAPTER KEY HELPERS ====================

function chapterKey(mangaId, chapterNum) {
    return `${mangaId}:${chapterNum}`;
}

function imageKey(mangaId, chapterNum, imageUrl) {
    return `${mangaId}:${chapterNum}:${imageUrl}`;
}

function parseChapterKey(key) {
    const parts = key.split(':');
    return { mangaId: parts[0], chapterNum: parseFloat(parts[1]) };
}

// ==================== PUBLIC API ====================

/**
 * Save a chapter for offline reading.
 * Fetches all images from the server and stores them as blobs in IndexedDB.
 * @param {string} mangaId
 * @param {number} chapterNum
 * @param {function} onProgress - callback(current, total)
 * @returns {Promise<{success: boolean, imageCount: number}>}
 */
async function saveChapterOffline(mangaId, chapterNum, onProgress = null) {
    // Get the reader images from the API
    const data = await api.get(`/bookmarks/${mangaId}/chapters/${chapterNum}/reader-images`);
    if (!data || !data.images || data.images.length === 0) {
        throw new Error('No images found for this chapter');
    }

    const images = data.images;
    const total = images.length;
    let saved = 0;

    // Get auth token for fetching images
    const token = api.getToken();

    for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].url;
        const fullUrl = imgUrl.startsWith('http') ? imgUrl : `${window.location.origin}${imgUrl}`;

        try {
            const response = await fetch(fullUrl, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const blob = await response.blob();
            await dbPut(IMAGE_STORE, imageKey(mangaId, chapterNum, imgUrl), blob);
            saved++;

            if (onProgress) onProgress(saved, total);
        } catch (e) {
            console.error(`[Offline] Failed to cache image ${i + 1}/${total}:`, e);
        }
    }

    // Store chapter metadata
    const metadata = {
        mangaId,
        chapterNum,
        imageUrls: images.map(img => typeof img === 'string' ? img : img.url),
        savedAt: Date.now(),
        imageCount: saved
    };
    await dbPut(CHAPTER_STORE, chapterKey(mangaId, chapterNum), metadata);

    return { success: true, imageCount: saved };
}

/**
 * Get offline chapter images as blob URLs for the reader.
 * @param {string} mangaId
 * @param {number} chapterNum
 * @returns {Promise<string[]|null>} Array of blob URLs, or null if not cached
 */
async function getOfflineChapter(mangaId, chapterNum) {
    const metadata = await dbGet(CHAPTER_STORE, chapterKey(mangaId, chapterNum));
    if (!metadata) return null;

    const blobUrls = [];
    for (const imgUrl of metadata.imageUrls) {
        const blob = await dbGet(IMAGE_STORE, imageKey(mangaId, chapterNum, imgUrl));
        if (blob) {
            blobUrls.push(URL.createObjectURL(blob));
        } else {
            // If any image is missing, return null (incomplete cache)
            blobUrls.forEach(url => URL.revokeObjectURL(url));
            return null;
        }
    }

    return blobUrls;
}

/**
 * Delete an offline chapter and its images.
 * @param {string} mangaId
 * @param {number} chapterNum
 */
async function deleteOfflineChapter(mangaId, chapterNum) {
    const metadata = await dbGet(CHAPTER_STORE, chapterKey(mangaId, chapterNum));
    if (metadata && metadata.imageUrls) {
        for (const imgUrl of metadata.imageUrls) {
            await dbDelete(IMAGE_STORE, imageKey(mangaId, chapterNum, imgUrl));
        }
    }
    await dbDelete(CHAPTER_STORE, chapterKey(mangaId, chapterNum));
}

/**
 * Check if a chapter is available offline.
 * @param {string} mangaId
 * @param {number} chapterNum
 * @returns {Promise<boolean>}
 */
async function isChapterOffline(mangaId, chapterNum) {
    const metadata = await dbGet(CHAPTER_STORE, chapterKey(mangaId, chapterNum));
    return !!metadata;
}

/**
 * Get all offline chapters metadata.
 * @returns {Promise<Array<{mangaId: string, chapterNum: number, savedAt: number, imageCount: number}>>}
 */
async function getOfflineChapters() {
    const keys = await dbGetAllKeys(CHAPTER_STORE);
    const chapters = [];
    for (const key of keys) {
        if (key.startsWith('auto-offline-')) continue; // skip auto-offline flags
        const metadata = await dbGet(CHAPTER_STORE, key);
        if (metadata) chapters.push(metadata);
    }
    return chapters;
}

/**
 * Get all offline chapters for a specific manga.
 * @param {string} mangaId
 * @returns {Promise<number[]>} Array of chapter numbers that are offline
 */
async function getOfflineChaptersForManga(mangaId) {
    const keys = await dbGetAllKeys(CHAPTER_STORE);
    const chapters = [];
    for (const key of keys) {
        if (key.startsWith('auto-offline-')) continue;
        if (key.startsWith(`${mangaId}:`)) {
            const { chapterNum } = parseChapterKey(key);
            chapters.push(chapterNum);
        }
    }
    return chapters;
}

/**
 * Estimate storage usage.
 * @returns {Promise<{used: number, quota: number, usedMB: string, quotaMB: string}>}
 */
async function getStorageUsage() {
    if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        return {
            used: estimate.usage || 0,
            quota: estimate.quota || 0,
            usedMB: ((estimate.usage || 0) / (1024 * 1024)).toFixed(1),
            quotaMB: ((estimate.quota || 0) / (1024 * 1024)).toFixed(0)
        };
    }
    return { used: 0, quota: 0, usedMB: '0', quotaMB: 'Unknown' };
}

/**
 * Delete all offline data.
 */
async function clearAllOfflineData() {
    const db = await openDB();

    // Clear images
    await new Promise((resolve, reject) => {
        const tx = db.transaction(IMAGE_STORE, 'readwrite');
        const store = tx.objectStore(IMAGE_STORE);
        const req = store.clear();
        req.onsuccess = resolve;
        req.onerror = reject;
    });

    // Clear chapters
    await new Promise((resolve, reject) => {
        const tx = db.transaction(CHAPTER_STORE, 'readwrite');
        const store = tx.objectStore(CHAPTER_STORE);
        const req = store.clear();
        req.onsuccess = resolve;
        req.onerror = reject;
    });
}

// ==================== AUTO-OFFLINE ====================

/**
 * Set auto-offline preference for a manga.
 * @param {string} mangaId
 * @param {boolean} enabled
 */
async function setAutoOffline(mangaId, enabled) {
    if (enabled) {
        await dbPut(CHAPTER_STORE, `auto-offline-${mangaId}`, { enabled: true, mangaId });
    } else {
        await dbDelete(CHAPTER_STORE, `auto-offline-${mangaId}`);
    }
}

/**
 * Check if auto-offline is enabled for a manga.
 * @param {string} mangaId
 * @returns {Promise<boolean>}
 */
async function isAutoOffline(mangaId) {
    const data = await dbGet(CHAPTER_STORE, `auto-offline-${mangaId}`);
    return !!data?.enabled;
}

/**
 * Get list of manga IDs with auto-offline enabled.
 * @returns {Promise<string[]>}
 */
async function getAutoOfflineManga() {
    const keys = await dbGetAllKeys(CHAPTER_STORE);
    return keys
        .filter(k => k.startsWith('auto-offline-'))
        .map(k => k.replace('auto-offline-', ''));
}

// ==================== SERVICE WORKER SYNC LISTENER ====================

// Listen for sync messages from the service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', async (event) => {
        if (event.data?.type === 'sync-offline') {
            const mangaId = event.data.mangaId;
            console.log(`[Offline] Auto-sync triggered for manga ${mangaId}`);
            try {
                await syncNewChaptersForManga(mangaId);
            } catch (e) {
                console.error('[Offline] Auto-sync failed:', e);
            }
        }
    });
}

/**
 * Sync new chapters offline for a manga.
 * Downloads any chapters that are server-downloaded but not yet cached locally.
 */
async function syncNewChaptersForManga(mangaId) {
    try {
        const bookmark = await api.getBookmark(mangaId);
        if (!bookmark) return;

        const downloadedChapters = bookmark.downloadedChapters || [];
        const offlineChapters = await getOfflineChaptersForManga(mangaId);

        const newChapters = downloadedChapters.filter(ch => !offlineChapters.includes(ch));
        console.log(`[Offline] ${newChapters.length} new chapters to sync for ${bookmark.alias || bookmark.title}`);

        for (const chapterNum of newChapters) {
            await saveChapterOffline(mangaId, chapterNum);
            console.log(`[Offline] Auto-synced chapter ${chapterNum}`);
        }
    } catch (e) {
        console.error('[Offline] Sync error:', e);
    }
}

// ==================== EXPORT ====================

export const offlineManager = {
    saveChapterOffline,
    getOfflineChapter,
    deleteOfflineChapter,
    isChapterOffline,
    getOfflineChapters,
    getOfflineChaptersForManga,
    getStorageUsage,
    clearAllOfflineData,
    setAutoOffline,
    isAutoOffline,
    getAutoOfflineManga,
    syncNewChaptersForManga
};

export default offlineManager;
