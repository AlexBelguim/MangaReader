/**
 * Manga Reader - Main Entry Point
 * Initializes the application, socket connection, and routing
 */

import { api } from './api.js';
import { socket, SocketEvents } from './socket.js';
import { router } from './router.js';

class App {
    constructor() {
        this.currentView = null;
        this.mangaCache = new Map();
    }

    /**
     * Initialize the application
     */
    async init() {
        console.log('[App] Initializing...');

        // Check authentication
        if (!api.isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        // Connect to Socket.io
        socket.connect();

        // Setup global socket event listeners
        this.setupSocketListeners();

        // Initialize router
        router.init();

        // Hide loading screen
        this.hideLoading();

        console.log('[App] Ready');
    }

    /**
     * Setup Socket.io event listeners for real-time updates
     */
    setupSocketListeners() {
        // Chapter events
        socket.on(SocketEvents.CHAPTER_DOWNLOADED, (data) => {
            console.log('[Socket] Chapter downloaded:', data);
            this.onChapterUpdate(data);
        });

        socket.on(SocketEvents.CHAPTER_HIDDEN, (data) => {
            console.log('[Socket] Chapter hidden:', data);
            this.onChapterUpdate(data);
        });

        socket.on(SocketEvents.CHAPTER_UNHIDDEN, (data) => {
            console.log('[Socket] Chapter unhidden:', data);
            this.onChapterUpdate(data);
        });

        // Manga events
        socket.on(SocketEvents.MANGA_UPDATED, (data) => {
            console.log('[Socket] Manga updated:', data);
            this.onMangaUpdate(data);
        });

        // Download events
        socket.on(SocketEvents.DOWNLOAD_PROGRESS, (data) => {
            this.onDownloadProgress(data);
        });

        socket.on(SocketEvents.DOWNLOAD_COMPLETED, (data) => {
            console.log('[Socket] Download completed:', data);
            this.showToast(`Downloaded: ${data.chapterNumber}`, 'success');
        });

        // Queue events
        socket.on(SocketEvents.QUEUE_UPDATED, (data) => {
            this.onQueueUpdate(data);
        });

        // Action events (for undo UI)
        socket.on(SocketEvents.ACTION_RECORDED, (data) => {
            console.log('[Socket] Action recorded:', data);
            this.updateUndoButton();
        });

        socket.on(SocketEvents.ACTION_UNDONE, (data) => {
            console.log('[Socket] Action undone:', data);
            this.showToast('Action undone', 'info');
            this.updateUndoButton();
        });
    }

    /**
     * Handle chapter updates
     */
    onChapterUpdate(data) {
        // Emit custom event for views to handle
        window.dispatchEvent(new CustomEvent('chapter:update', { detail: data }));
    }

    /**
     * Handle manga updates
     */
    onMangaUpdate(data) {
        // Invalidate cache
        this.mangaCache.delete(data.mangaId);
        // Emit custom event
        window.dispatchEvent(new CustomEvent('manga:update', { detail: data }));
    }

    /**
     * Handle download progress
     */
    onDownloadProgress(data) {
        window.dispatchEvent(new CustomEvent('download:progress', { detail: data }));
    }

    /**
     * Handle queue updates
     */
    onQueueUpdate(data) {
        window.dispatchEvent(new CustomEvent('queue:update', { detail: data }));
    }

    /**
     * Update undo button state
     */
    async updateUndoButton() {
        try {
            const { undoableCount } = await api.getActions({ limit: 1 });
            const undoBtn = document.getElementById('undo-btn');
            if (undoBtn) {
                undoBtn.style.display = undoableCount > 0 ? 'flex' : 'none';
                const countEl = undoBtn.querySelector('.count');
                if (countEl) countEl.textContent = undoableCount;
            }
        } catch (e) {
            // Ignore
        }
    }

    /**
     * Show a toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('show'));

        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loading = document.querySelector('.loading-screen');
        if (loading) {
            loading.classList.add('hidden');
            setTimeout(() => loading.remove(), 300);
        }
    }
}

// Initialize app when DOM is ready
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());

// Export for use in other modules
export { app };
