// API wrapper functions
const API = {
  async getBookmarks() {
    const res = await fetch('/api/bookmarks');
    return res.json();
  },

  async getBookmark(id) {
    const res = await fetch(`/api/bookmarks/${id}`);
    return res.json();
  },

  async addBookmark(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 2 minute timeout for scraping

    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      return res.json();
    } catch (error) {
      clearTimeout(timeout);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out - scraping may still be in progress, try refreshing');
      }
      throw error;
    }
  },

  async updateBookmark(id, data) {
    const res = await fetch(`/api/bookmarks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteBookmark(id, deleteFolder = false) {
    const res = await fetch(`/api/bookmarks/${id}?deleteFolder=${deleteFolder}`, { method: 'DELETE' });
    return res.json();
  },

  async checkUpdates(id) {
    const res = await fetch(`/api/bookmarks/${id}/check`, { method: 'POST' });
    return res.json();
  },

  async quickCheckUpdates(id) {
    const res = await fetch(`/api/bookmarks/${id}/quick-check`, { method: 'POST' });
    return res.json();
  },

  async checkAllUpdates() {
    const res = await fetch('/api/check-all', { method: 'POST' });
    return res.json();
  },

  async startDownload(id, options) {
    const res = await fetch(`/api/bookmarks/${id}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    });
    return res.json();
  },

  async getDownloadProgress(taskId) {
    const res = await fetch(`/api/downloads/${taskId}`);
    return res.json();
  },

  async getAllDownloads() {
    const res = await fetch('/api/downloads');
    return res.json();
  },

  async getQueueTasks() {
    const res = await fetch('/api/queue/tasks');
    return res.json();
  },

  async pauseDownload(taskId) {
    const res = await fetch(`/api/downloads/${taskId}/pause`, { method: 'POST' });
    return res.json();
  },

  async resumeDownload(taskId) {
    const res = await fetch(`/api/downloads/${taskId}/resume`, { method: 'POST' });
    return res.json();
  },

  async cancelDownload(taskId) {
    const res = await fetch(`/api/downloads/${taskId}/cancel`, { method: 'POST' });
    return res.json();
  },

  async getChapterImages(bookmarkId, chapterNumber, versionUrl = null) {
    let url = `/api/bookmarks/${bookmarkId}/chapters/${chapterNumber}/images`;
    if (versionUrl) {
      url += `?version=${versionUrl}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  async rotateImage(imagePath) {
    const res = await fetch('/api/rotate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to rotate image');
    }
    return res.json();
  },

  async deleteImage(imagePath) {
    const res = await fetch('/api/delete-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to delete image');
    }
    return res.json();
  },

  async splitImage(imagePath, direction = 'rtl') {
    const res = await fetch('/api/split-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath, direction })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to split image');
    }
    return res.json();
  },

  async swapImages(imagePath1, imagePath2) {
    const res = await fetch('/api/swap-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePath1, imagePath2 })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to swap images');
    }
    return res.json();
  },

  async deleteChapterVersion(bookmarkId, chapterNumber, versionUrl) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/chapters/${chapterNumber}/version?url=${versionUrl}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async getCovers(bookmarkId) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/covers`);
    return res.json();
  },

  async setActiveCover(bookmarkId, filename) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/covers/${encodeURIComponent(filename)}/activate`, {
      method: 'POST'
    });
    return res.json();
  },

  async updateReadingProgress(bookmarkId, chapter, page, totalPages) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/reading-progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapter, page, totalPages })
    });
    return res.json();
  },

  async markChapterRead(bookmarkId, chapterNum, isRead = true) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/chapters/${chapterNum}/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRead })
    });
    return res.json();
  },

  async markChaptersReadBelow(bookmarkId, chapterNum) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/chapters/${chapterNum}/read-below`, {
      method: 'POST'
    });
    return res.json();
  },

  async getChapterVersions(bookmarkId, chapterNum) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/chapters/${chapterNum}/versions`);
    return res.json();
  },

  // Category management
  async getCategories() {
    const res = await fetch('/api/categories');
    return res.json();
  },

  async addCategory(name) {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  },

  async deleteCategory(name) {
    const res = await fetch(`/api/categories/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async setBookmarkCategories(bookmarkId, categories) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories })
    });
    return res.json();
  },

  // Favorites
  async getFavorites() {
    const res = await fetch('/api/favorites');
    return res.json();
  },

  async saveFavorites(favorites, listOrder) {
    const res = await fetch('/api/favorites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorites, listOrder })
    });
    return res.json();
  },

  async createFavoriteList(name) {
    const res = await fetch('/api/favorites/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  },

  async deleteFavoriteList(name) {
    const res = await fetch(`/api/favorites/lists/${encodeURIComponent(name)}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async renameFavoriteList(oldName, newName) {
    const res = await fetch(`/api/favorites/lists/${encodeURIComponent(oldName)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newName })
    });
    return res.json();
  },

  async addFavorite(listName, favorite) {
    const res = await fetch(`/api/favorites/lists/${encodeURIComponent(listName)}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favorite)
    });
    return res.json();
  },

  async removeFavorite(listName, index) {
    const res = await fetch(`/api/favorites/lists/${encodeURIComponent(listName)}/items/${index}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  // Chapter Settings
  async getChapterSettings() {
    const res = await fetch('/api/chapter-settings');
    return res.json();
  },

  async saveChapterSetting(mangaId, chapterNum, settings) {
    const res = await fetch(`/api/chapter-settings/${mangaId}/${chapterNum}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  async saveAllChapterSettings(settings) {
    const res = await fetch('/api/chapter-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // Trophy Pages
  async getTrophyPages() {
    const res = await fetch('/api/trophy-pages');
    return res.json();
  },

  async getTrophiesList() {
    const res = await fetch('/api/trophies-list');
    return res.json();
  },

  async saveTrophyPages(trophyPages) {
    const res = await fetch('/api/trophy-pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trophyPages)
    });
    return res.json();
  },

  async saveTrophyPagesForChapter(mangaId, chapterNum, trophyMap) {
    const res = await fetch(`/api/trophy-pages/${mangaId}/${chapterNum}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trophyMap)
    });
    return res.json();
  },

  // Reader Settings
  async getReaderSettings() {
    const res = await fetch('/api/reader-settings');
    return res.json();
  },

  async saveReaderSettings(settings) {
    const res = await fetch('/api/reader-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.json();
  },

  // CBZ Support
  async getCbzFiles(bookmarkId) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/cbz`);
    return res.json();
  },

  async extractCbz(bookmarkId, cbzPath, chapterNumber, options = {}) {
    const { deleteAfter = false, forceReExtract = false, renameCbz = true } = options;
    const res = await fetch(`/api/bookmarks/${bookmarkId}/cbz/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cbzPath, chapterNumber, deleteAfter, forceReExtract, renameCbz })
    });
    return res.json();
  },

  async extractAllCbz(bookmarkId, options = {}) {
    const { deleteAfter = false, forceReExtract = false, renameCbz = true } = options;
    const res = await fetch(`/api/bookmarks/${bookmarkId}/cbz/extract-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteAfter, forceReExtract, renameCbz })
    });
    return res.json();
  },

  // Local manga discovery
  async getLocalManga() {
    const res = await fetch('/api/local-manga');
    return res.json();
  },

  async addLocalManga(folderName) {
    const res = await fetch('/api/local-manga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderName })
    });
    return res.json();
  },

  async setCoverFromChapter(bookmarkId) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/covers/from-chapter`, {
      method: 'POST'
    });
    return res.json();
  },

  // Series API
  async getSeries() {
    const res = await fetch('/api/series');
    return res.json();
  },

  async getSeriesById(id) {
    const res = await fetch(`/api/series/${id}`);
    return res.json();
  },

  async createSeries(title, alias = null) {
    const res = await fetch('/api/series', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, alias })
    });
    return res.json();
  },

  async updateSeries(id, data) {
    const res = await fetch(`/api/series/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteSeries(id) {
    const res = await fetch(`/api/series/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async addSeriesEntry(seriesId, bookmarkId, order = null) {
    const res = await fetch(`/api/series/${seriesId}/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookmarkId, order })
    });
    return res.json();
  },

  async removeSeriesEntry(seriesId, entryId) {
    const res = await fetch(`/api/series/${seriesId}/entries/${entryId}`, {
      method: 'DELETE'
    });
    return res.json();
  },

  async reorderSeriesEntries(seriesId, entryIds) {
    const res = await fetch(`/api/series/${seriesId}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryIds })
    });
    return res.json();
  },

  async setSeriesCover(seriesId, entryId) {
    const res = await fetch(`/api/series/${seriesId}/cover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entryId })
    });
    return res.json();
  },

  async getAvailableBookmarksForSeries() {
    const res = await fetch('/api/series/available-bookmarks');
    return res.json();
  },

  async getSeriesForBookmark(bookmarkId) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/series`);
    return res.json();
  },

  // Artist API methods
  async getArtists() {
    const res = await fetch('/api/artists');
    return res.json();
  },

  async getArtistBookmarks(artistId) {
    const res = await fetch(`/api/artists/${artistId}/bookmarks`);
    return res.json();
  },

  async createArtist(name) {
    const res = await fetch('/api/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  },

  async getBookmarkArtists(bookmarkId) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/artists`);
    return res.json();
  },

  async setBookmarkArtists(bookmarkId, artists) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/artists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artists })
    });
    return res.json();
  },

  async addArtistToBookmark(bookmarkId, name) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/artists/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return res.json();
  },

  async removeArtistFromBookmark(bookmarkId, artistId) {
    const res = await fetch(`/api/bookmarks/${bookmarkId}/artists/${artistId}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
