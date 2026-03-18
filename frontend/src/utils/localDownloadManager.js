/**
 * Local Download Manager
 * Handles storing manga images in the Origin Private File System (OPFS)
 * and tracking metadata in IndexedDB.
 */

import { api } from '../api.js';

const DB_NAME = 'manga_local_storage';
const DB_VERSION = 1;
const STORE_NAME = 'local_chapters';

class LocalDownloadManager {
    constructor() {
        this.db = null;
        this.opfsRoot = null;
    }

    /**
     * Initialize IndexedDB and OPFS root
     */
    async init() {
        if (this.db && this.opfsRoot) return;

        // Init IndexedDB
        this.db = await new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: ['mangaId', 'chapterNumber'] });
                }
            };
        });

        // Init OPFS
        if (navigator.storage && navigator.storage.getDirectory) {
            this.opfsRoot = await navigator.storage.getDirectory();
        } else {
            console.error('[LocalDownloadManager] OPFS not supported');
        }
    }

    /**
     * Download a chapter to local storage
     * @param {string} mangaId 
     * @param {number} chapterNumber 
     * @param {Function} onProgress 
     */
    async downloadChapter(mangaId, chapterNumber, onProgress = null) {
        await this.init();
        if (!this.opfsRoot) throw new Error('OPFS not supported');

        console.log(`[LocalDownloadManager] Downloading chapter ${chapterNumber} for manga ${mangaId}`);

        // 1. Get image URLs from server
        const images = await api.getChapterImages(mangaId, chapterNumber);
        if (!images || !images.length) throw new Error('No images found for chapter');

        // 2. Create directory in OPFS
        const mangaDir = await this.opfsRoot.getDirectoryHandle(mangaId, { create: true });
        const chapterDir = await mangaDir.getDirectoryHandle(chapterNumber.toString(), { create: true });

        const localPaths = [];
        let completed = 0;

        // 3. Download and save each image
        for (const img of images) {
            const url = typeof img === 'string' ? img : img.url;
            const filename = url.split('/').pop().split('?')[0];
            
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                
                const fileHandle = await chapterDir.getFileHandle(filename, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
                
                localPaths.push({
                    filename,
                    size: blob.size,
                    type: blob.type
                });

                completed++;
                if (onProgress) onProgress(completed, images.length);
            } catch (err) {
                console.error(`[LocalDownloadManager] Failed to download ${url}:`, err);
            }
        }

        // 4. Update IndexedDB
        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.put({
            mangaId,
            chapterNumber,
            images: localPaths,
            downloadedAt: new Date().toISOString()
        });

        console.log(`[LocalDownloadManager] Chapter ${chapterNumber} saved locally`);
    }

    /**
     * Get local image URL for a chapter page
     * @param {string} mangaId 
     * @param {number} chapterNumber 
     * @param {string} filename 
     * @returns {Promise<string|null>} Blob URL
     */
    async getLocalImageUrl(mangaId, chapterNumber, filename) {
        await this.init();
        if (!this.opfsRoot) return null;

        try {
            const mangaDir = await this.opfsRoot.getDirectoryHandle(mangaId);
            const chapterDir = await mangaDir.getDirectoryHandle(chapterNumber.toString());
            const fileHandle = await chapterDir.getFileHandle(filename);
            const file = await fileHandle.getFile();
            return URL.createObjectURL(file);
        } catch (e) {
            return null;
        }
    }

    /**
     * Check if a chapter is downloaded locally
     * @param {string} mangaId 
     * @param {number} chapterNumber 
     */
    async isDownloadedLocally(mangaId, chapterNumber) {
        await this.init();
        const tx = this.db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const record = await new Promise((resolve) => {
            const request = store.get([mangaId, chapterNumber]);
            request.onsuccess = () => resolve(request.result);
        });
        return !!record;
    }

    /**
     * Delete local chapter files
     */
    async deleteLocalChapter(mangaId, chapterNumber) {
        await this.init();
        if (!this.opfsRoot) return;

        try {
            const mangaDir = await this.opfsRoot.getDirectoryHandle(mangaId);
            await mangaDir.removeEntry(chapterNumber.toString(), { recursive: true });
        } catch (e) {
            // Ignore if folder doesn't exist
        }

        const tx = this.db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete([mangaId, chapterNumber]);
    }
}

export const localDownloadManager = new LocalDownloadManager();
export default localDownloadManager;
