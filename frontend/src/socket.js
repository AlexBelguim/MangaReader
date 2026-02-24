/**
 * Socket.io Client
 * Manages real-time connection and event handling
 */

import { io } from 'socket.io-client';

class SocketClient {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.subscribedMangas = new Set();
    }

    /**
     * Connect to Socket.io server
     */
    connect() {
        if (this.socket?.connected) return;

        this.socket = io({
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10
        });

        this.socket.on('connect', () => {
            console.log('[Socket] Connected:', this.socket.id);

            // Re-subscribe to previously subscribed mangas
            this.subscribedMangas.forEach(mangaId => {
                this.socket.emit('subscribe:manga', mangaId);
            });

            // Subscribe to global events
            this.socket.emit('subscribe:global');
        });

        this.socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('[Socket] Connection error:', error.message);
        });
    }

    /**
     * Disconnect from server
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    /**
     * Subscribe to a manga's updates
     */
    subscribeToManga(mangaId) {
        this.subscribedMangas.add(mangaId);
        if (this.socket?.connected) {
            this.socket.emit('subscribe:manga', mangaId);
        }
    }

    /**
     * Unsubscribe from a manga's updates
     */
    unsubscribeFromManga(mangaId) {
        this.subscribedMangas.delete(mangaId);
        if (this.socket?.connected) {
            this.socket.emit('unsubscribe:manga', mangaId);
        }
    }

    /**
     * Listen for an event
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    /**
     * Remove event listener
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(callback);
        }
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    /**
     * Emit an event to server
     */
    emit(event, data) {
        if (this.socket?.connected) {
            this.socket.emit(event, data);
        }
    }
}

// Socket event types (matching server)
export const SocketEvents = {
    CHAPTER_DOWNLOADED: 'chapter:downloaded',
    CHAPTER_DELETED: 'chapter:deleted',
    CHAPTER_LOCKED: 'chapter:locked',
    CHAPTER_UNLOCKED: 'chapter:unlocked',
    CHAPTER_HIDDEN: 'chapter:hidden',
    CHAPTER_UNHIDDEN: 'chapter:unhidden',
    MANGA_UPDATED: 'manga:updated',
    MANGA_ADDED: 'manga:added',
    MANGA_DELETED: 'manga:deleted',
    DOWNLOAD_STARTED: 'download:started',
    DOWNLOAD_PROGRESS: 'download:progress',
    DOWNLOAD_COMPLETED: 'download:completed',
    DOWNLOAD_FAILED: 'download:failed',
    QUEUE_UPDATED: 'queue:updated',
    ACTION_RECORDED: 'action:recorded',
    ACTION_UNDONE: 'action:undone'
};

// Export singleton instance
export const socket = new SocketClient();
export default socket;
