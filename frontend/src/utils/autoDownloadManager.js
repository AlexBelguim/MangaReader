/**
 * Auto-Download Manager
 * Listens for socket events and automatically triggers local downloads
 * if the manga has auto-download-local enabled.
 */

import { socket, SocketEvents } from '../socket.js';
import { localDownloadManager } from './localDownloadManager.js';
import { isPwa } from './pwa.js';

class AutoDownloadManager {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize listeners
     */
    init() {
        if (this.initialized || !isPwa()) return;
        this.initialized = true;

        console.log('[AutoDownloadManager] Initialized');

        // Listen for server-side download completion
        socket.on(SocketEvents.CHAPTER_DOWNLOADED, async (data) => {
            const { mangaId, chapterNumber } = data;
            
            if (this.shouldAutoDownload(mangaId)) {
                console.log(`[AutoDownloadManager] Auto-downloading chapter ${chapterNumber} for ${mangaId}`);
                try {
                    await localDownloadManager.downloadChapter(mangaId, chapterNumber);
                } catch (err) {
                    console.error('[AutoDownloadManager] Auto-download failed:', err);
                }
            }
        });
    }

    /**
     * Check if a manga should be auto-downloaded to local storage
     * @param {string} mangaId 
     * @returns {boolean}
     */
    shouldAutoDownload(mangaId) {
        const prefs = JSON.parse(localStorage.getItem('pwa_auto_download_prefs') || '{}');
        return !!prefs[mangaId];
    }

    /**
     * Toggle auto-download for a manga
     * @param {string} mangaId 
     * @param {boolean} enabled 
     */
    toggleAutoDownload(mangaId, enabled) {
        const prefs = JSON.parse(localStorage.getItem('pwa_auto_download_prefs') || '{}');
        if (enabled) {
            prefs[mangaId] = true;
        } else {
            delete prefs[mangaId];
        }
        localStorage.setItem('pwa_auto_download_prefs', JSON.stringify(prefs));
    }
}

export const autoDownloadManager = new AutoDownloadManager();
export default autoDownloadManager;
