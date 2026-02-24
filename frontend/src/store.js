/**
 * Reactive Store
 * Centralized state management with pub/sub, caching, and data loaders.
 * Views subscribe to data keys and get notified when data changes.
 */

import { api } from './api.js';
import { socket, SocketEvents } from './socket.js';

const _state = {
    bookmarks: [],
    series: [],
    categories: [],
    favorites: { favorites: {}, listOrder: [] },
};

// Track which keys have been loaded
const _loaded = new Set();

// Loading promises to deduplicate concurrent requests
const _loading = new Map();

// Subscribers: key -> Set<callback>
const _subscribers = new Map();

/**
 * Get current value for a key
 */
function get(key) {
    return _state[key];
}

/**
 * Set value for a key and notify subscribers
 */
function set(key, value) {
    _state[key] = value;
    _loaded.add(key);
    _notify(key);
}

/**
 * Subscribe to changes on a key. Returns unsubscribe function.
 */
function subscribe(key, callback) {
    if (!_subscribers.has(key)) _subscribers.set(key, new Set());
    _subscribers.get(key).add(callback);
    return () => _subscribers.get(key)?.delete(callback);
}

/**
 * Notify all subscribers for a key
 */
function _notify(key) {
    const subs = _subscribers.get(key);
    if (subs) subs.forEach(cb => cb(_state[key]));
}

/**
 * Mark a key as stale so next load re-fetches
 */
function invalidate(key) {
    _loaded.delete(key);
    _loading.delete(key);
}

/**
 * Check if a key has been loaded
 */
function isLoaded(key) {
    return _loaded.has(key);
}

// ── Data Loaders ──────────────────────────────────────────────

/**
 * Load bookmarks (cached unless force=true)
 */
async function loadBookmarks(force = false) {
    if (!force && _loaded.has('bookmarks')) return _state.bookmarks;

    // Deduplicate concurrent requests
    if (_loading.has('bookmarks')) return _loading.get('bookmarks');

    const promise = api.getBookmarks().then(data => {
        _state.bookmarks = data || [];
        _loaded.add('bookmarks');
        _loading.delete('bookmarks');
        _notify('bookmarks');
        return _state.bookmarks;
    }).catch(err => {
        _loading.delete('bookmarks');
        throw err;
    });

    _loading.set('bookmarks', promise);
    return promise;
}

/**
 * Load series (cached unless force=true)
 */
async function loadSeries(force = false) {
    if (!force && _loaded.has('series')) return _state.series;
    if (_loading.has('series')) return _loading.get('series');

    const promise = api.get('/series').then(data => {
        _state.series = data || [];
        _loaded.add('series');
        _loading.delete('series');
        _notify('series');
        return _state.series;
    }).catch(err => {
        _loading.delete('series');
        throw err;
    });

    _loading.set('series', promise);
    return promise;
}

/**
 * Load categories (cached unless force=true)
 */
async function loadCategories(force = false) {
    if (!force && _loaded.has('categories')) return _state.categories;
    if (_loading.has('categories')) return _loading.get('categories');

    const promise = api.get('/categories').then(result => {
        _state.categories = result.categories || [];
        _loaded.add('categories');
        _loading.delete('categories');
        _notify('categories');
        return _state.categories;
    }).catch(err => {
        _loading.delete('categories');
        throw err;
    });

    _loading.set('categories', promise);
    return promise;
}

/**
 * Load favorites (cached unless force=true)
 */
async function loadFavorites(force = false) {
    if (!force && _loaded.has('favorites')) return _state.favorites;
    if (_loading.has('favorites')) return _loading.get('favorites');

    const promise = api.getFavorites().then(data => {
        _state.favorites = data || { favorites: {}, listOrder: [] };
        _loaded.add('favorites');
        _loading.delete('favorites');
        _notify('favorites');
        return _state.favorites;
    }).catch(err => {
        _loading.delete('favorites');
        throw err;
    });

    _loading.set('favorites', promise);
    return promise;
}

// ── Socket Integration ────────────────────────────────────────

/**
 * Wire socket events to auto-invalidate + reload store data
 */
function initSocketListeners() {
    // Manga added/updated/deleted → refresh bookmarks
    socket.on(SocketEvents.MANGA_UPDATED, () => {
        invalidate('bookmarks');
        loadBookmarks(true);
    });

    socket.on(SocketEvents.MANGA_ADDED, () => {
        invalidate('bookmarks');
        loadBookmarks(true);
    });

    socket.on(SocketEvents.MANGA_DELETED, () => {
        invalidate('bookmarks');
        loadBookmarks(true);
    });

    // Download events → refresh bookmarks (counts change)
    socket.on(SocketEvents.DOWNLOAD_COMPLETED, () => {
        invalidate('bookmarks');
        loadBookmarks(true);
    });
}

// Auto-init socket listeners
initSocketListeners();

// ── Export ─────────────────────────────────────────────────────

export const store = {
    get,
    set,
    subscribe,
    invalidate,
    isLoaded,
    loadBookmarks,
    loadSeries,
    loadCategories,
    loadFavorites,
};

export default store;
