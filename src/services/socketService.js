/**
 * Socket Event Emitter Service
 * Helper service to emit socket events from anywhere in the backend
 */

// This will be set by server.js after io is initialized
let io = null;

export function setIO(ioInstance) {
    io = ioInstance;
}

/**
 * Emit an event to a specific manga room
 */
export function emitToManga(mangaId, event, data) {
    if (io) {
        io.to(`manga:${mangaId}`).emit(event, data);
    }
}

/**
 * Emit an event to all connected clients
 */
export function emitToAll(event, data) {
    if (io) {
        io.emit(event, data);
    }
}

/**
 * Emit an event to the global room
 */
export function emitToGlobal(event, data) {
    if (io) {
        io.to('global').emit(event, data);
    }
}

// Event type constants
export const SocketEvents = {
    // Chapter events
    CHAPTER_DOWNLOADED: 'chapter:downloaded',
    CHAPTER_DELETED: 'chapter:deleted',
    CHAPTER_LOCKED: 'chapter:locked',
    CHAPTER_UNLOCKED: 'chapter:unlocked',
    CHAPTER_HIDDEN: 'chapter:hidden',
    CHAPTER_UNHIDDEN: 'chapter:unhidden',

    // Manga events
    MANGA_UPDATED: 'manga:updated',
    MANGA_ADDED: 'manga:added',
    MANGA_DELETED: 'manga:deleted',

    // Download events
    DOWNLOAD_STARTED: 'download:started',
    DOWNLOAD_PROGRESS: 'download:progress',
    DOWNLOAD_COMPLETED: 'download:completed',
    DOWNLOAD_FAILED: 'download:failed',

    // Queue events
    QUEUE_UPDATED: 'queue:updated',
    JOB_STARTED: 'job:started',
    JOB_COMPLETED: 'job:completed',
    JOB_FAILED: 'job:failed',

    // Action history events
    ACTION_RECORDED: 'action:recorded',
    ACTION_UNDONE: 'action:undone'
};

export default {
    setIO,
    emitToManga,
    emitToAll,
    emitToGlobal,
    SocketEvents
};
