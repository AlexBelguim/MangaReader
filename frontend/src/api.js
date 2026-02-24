/**
 * API Client
 * Centralized API communication with auth token handling
 */

const TOKEN_KEY = 'manga_auth_token';

class ApiClient {
    constructor() {
        this.baseUrl = '/api';
    }

    /**
     * Get stored auth token
     */
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    /**
     * Set auth token
     */
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    /**
     * Clear auth token (logout)
     */
    clearToken() {
        localStorage.removeItem(TOKEN_KEY);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Make an API request
     */
    async request(endpoint, options = {}) {
        const url = endpoint.startsWith('/') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/${endpoint}`;

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add auth token if available
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Handle auth errors
            if (response.status === 401) {
                this.clearToken();
                window.location.href = '/login.html';
                throw new Error('Authentication required');
            }

            // Parse JSON response
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Request failed: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`[API] ${options.method || 'GET'} ${endpoint}:`, error);
            throw error;
        }
    }

    // Convenience methods
    get(endpoint) {
        return this.request(endpoint);
    }

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    patch(endpoint, body) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // ==================== AUTH ====================

    async login(username, password) {
        const data = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }).then(r => r.json());

        if (data.token) {
            this.setToken(data.token);
            return true;
        }
        throw new Error(data.error || 'Login failed');
    }

    logout() {
        this.clearToken();
        window.location.href = '/login.html';
    }

    // ==================== BOOKMARKS ====================

    getBookmarks() {
        return this.get('/bookmarks');
    }

    getSeries() {
        return this.get('/series');
    }

    getBookmark(id) {
        return this.get(`/bookmarks/${id}`);
    }

    getChapters(bookmarkId, { page = 0, limit = 50, filter = 'all' } = {}) {
        return this.get(`/bookmarks/${bookmarkId}/chapters?page=${page}&limit=${limit}&filter=${filter}`);
    }

    // ==================== VOLUMES ====================

    createVolume(bookmarkId, name) {
        return this.post(`/bookmarks/${bookmarkId}/volumes`, { name });
    }

    renameVolume(bookmarkId, volumeId, name) {
        return this.put(`/bookmarks/${bookmarkId}/volumes/${volumeId}/rename`, { name });
    }

    deleteVolume(bookmarkId, volumeId) {
        return this.delete(`/bookmarks/${bookmarkId}/volumes/${volumeId}`);
    }

    setVolumeCoverFromChapter(bookmarkId, volumeId, chapterNumber, filename) {
        return this.post(`/bookmarks/${bookmarkId}/volumes/${volumeId}/cover/from-chapter`, { chapterNumber, filename });
    }

    setMangaCoverFromVolume(bookmarkId, volumeId) {
        // Not implemented yet, user asked for "change the manga main cover" which might mean from chapter
    }

    setMangaCoverFromChapter(bookmarkId, chapterNumber, filename) {
        return this.post(`/bookmarks/${bookmarkId}/covers/from-chapter`, { chapterNumber, filename });
    }

    getChapterImages(bookmarkId, chapterNumber) {
        return this.get(`/bookmarks/${bookmarkId}/chapters/${chapterNumber}/images`);
    }

    // ==================== VOLUMES ====================

    getVolumeChapters(bookmarkId, volumeId) {
        return this.get(`/bookmarks/${bookmarkId}/volumes/${volumeId}/chapters`);
    }

    updateVolumeChapters(bookmarkId, volumeId, chapterNumbers) {
        return this.post(`/bookmarks/${bookmarkId}/volumes/${volumeId}/chapters`, { chapterNumbers });
    }

    addBookmark(url) {
        return this.post('/bookmarks', { url });
    }

    updateBookmark(id, updates) {
        return this.patch(`/bookmarks/${id}`, updates);
    }

    deleteBookmark(id, deleteFolder = false) {
        return this.delete(`/bookmarks/${id}?deleteFolder=${deleteFolder}`);
    }

    // ==================== CHAPTERS ====================

    lockChapter(bookmarkId, chapterNumber) {
        return this.post(`/chapters/${bookmarkId}/${chapterNumber}/lock`);
    }

    unlockChapter(bookmarkId, chapterNumber) {
        return this.post(`/chapters/${bookmarkId}/${chapterNumber}/unlock`);
    }

    getLockStatus(bookmarkId, chapterNumber) {
        return this.get(`/chapters/${bookmarkId}/${chapterNumber}/lock-status`);
    }

    excludeChapter(bookmarkId, chapterNumber) {
        return this.post(`/bookmarks/${bookmarkId}/exclude-chapter`, { chapterNumber });
    }

    unexcludeChapter(bookmarkId, chapterNumber) {
        return this.post(`/bookmarks/${bookmarkId}/unexclude-chapter`, { chapterNumber });
    }

    hideVersion(bookmarkId, chapterNumber, url) {
        return this.post(`/chapters/${bookmarkId}/hide-version`, { chapterNumber, url });
    }

    unhideVersion(bookmarkId, chapterNumber, url) {
        return this.post(`/chapters/${bookmarkId}/unhide-version`, { chapterNumber, url });
    }

    getProtectedChapters(bookmarkId) {
        return this.get(`/chapters/${bookmarkId}/protected`);
    }

    bulkLockChapters(bookmarkId, chapterNumbers, lock = true) {
        return this.post(`/chapters/${bookmarkId}/bulk-lock`, { chapterNumbers, lock });
    }

    getChapterSettings(bookmarkId, chapterNumber) {
        return this.get(`/chapters/${bookmarkId}/${chapterNumber}/settings`);
    }

    updateChapterSettings(bookmarkId, chapterNumber, settings) {
        return this.post(`/chapters/${bookmarkId}/${chapterNumber}/settings`, settings);
    }

    // ==================== ADMIN/UNDO ====================

    getActions({ bookmarkId, limit = 50 } = {}) {
        const params = new URLSearchParams();
        if (bookmarkId) params.append('bookmarkId', bookmarkId);
        if (limit) params.append('limit', limit);
        return this.get(`/admin/actions?${params}`);
    }

    undoAction(actionId) {
        return this.post(`/admin/actions/${actionId}/undo`);
    }

    // ==================== DATABASE VIEWER ====================

    getTables() {
        return this.get('/admin/tables');
    }

    getTableRows(tableName, { page = 0, limit = 50 } = {}) {
        return this.get(`/admin/tables/${tableName}?page=${page}&limit=${limit}`);
    }

    getTableSchema(tableName) {
        return this.get(`/admin/tables/${tableName}/schema`);
    }

    // ==================== QUEUE ====================

    getQueueStatus() {
        return this.get('/queue/status');
    }

    getQueueTasks() {
        return this.get('/queue/tasks');
    }

    // ==================== SYSTEM ACTIONS ====================

    scanLibrary() {
        return this.post('/scan-local');
    }

    quickCheck() {
        return this.post('/check-all');
    }

    // ==================== FAVORITES ====================

    getFavorites() {
        return this.get('/favorites');
    }

    createFavoriteList(name) {
        return this.post('/favorites/lists', { name });
    }

    deleteFavoriteList(name) {
        return this.delete(`/favorites/lists/${encodeURIComponent(name)}`);
    }

    addFavoriteItem(listName, item) {
        return this.post(`/favorites/lists/${encodeURIComponent(listName)}/items`, item);
    }

    removeFavoriteItem(listName, index) {
        return this.delete(`/favorites/lists/${encodeURIComponent(listName)}/items/${index}`);
    }

    // ==================== READING PROGRESS ====================

    updateReadingProgress(bookmarkId, chapter, page, totalPages) {
        return this.post(`/bookmarks/${bookmarkId}/reading-progress`, { chapter, page, totalPages });
    }

    markChapterRead(bookmarkId, chapterNumber, isRead = true) {
        return this.post(`/bookmarks/${bookmarkId}/chapters/${chapterNumber}/read`, { isRead });
    }

    // ==================== TROPHY PAGES ====================

    getTrophyPages(mangaId, chapterNum) {
        return this.get(`/trophy-pages/${mangaId}/${chapterNum}`);
    }

    saveTrophyPages(mangaId, chapterNum, trophyMap) {
        return this.put(`/trophy-pages/${mangaId}/${chapterNum}`, trophyMap);
    }

    // ==================== PAGE MANIPULATION ====================

    rotatePage(bookmarkId, chapterNum, filename, degrees = 90) {
        return this.post(`/bookmarks/${bookmarkId}/chapters/${chapterNum}/pages/rotate`, { filename, degrees });
    }

    swapPages(bookmarkId, chapterNum, filenameA, filenameB) {
        return this.post(`/bookmarks/${bookmarkId}/chapters/${chapterNum}/pages/swap`, { filenameA, filenameB });
    }

    splitPage(bookmarkId, chapterNum, filename) {
        return this.post(`/bookmarks/${bookmarkId}/chapters/${chapterNum}/pages/split`, { filename });
    }

    deletePage(bookmarkId, chapterNum, filename) {
        return this.delete(`/bookmarks/${bookmarkId}/chapters/${chapterNum}/pages/${encodeURIComponent(filename)}`);
    }

    // ==================== LINK MODE ====================

    getNextChapterPreview(bookmarkId, chapterNum) {
        return this.get(`/bookmarks/${bookmarkId}/chapters/${chapterNum}/next-preview`);
    }
}

// Export singleton
export const api = new ApiClient();
export default api;
