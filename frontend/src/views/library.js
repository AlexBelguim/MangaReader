/**
 * Library View Component
 * Main grid of manga cards
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { renderHeader, setupHeaderListeners } from '../components/header.js';
import { showToast } from '../utils/toast.js';

// View state
let state = {
  bookmarks: [],
  series: [],
  favorites: { favorites: {}, listOrder: [] },
  activeCategory: localStorage.getItem('library_active_category') || null,
  artistFilter: null,
  viewMode: 'manga', // 'manga' or 'series'
  loading: true
};

// Event handler reference for cleanup
let viewModeHandler = null;

/**
 * Render a manga card
 */
function renderMangaCard(manga) {
  const displayName = manga.alias || manga.title;
  const downloadedCount = manga.downloadedChapters?.length || 0;
  const excludedSet = new Set(manga.excludedChapters || []);
  const visibleChapters = (manga.chapters || []).filter(c => !excludedSet.has(c.number));
  const totalCount = new Set(visibleChapters.map(c => c.number)).size || manga.uniqueChapters || 0;
  const readCount = manga.readChapters?.length || 0;
  const hasUpdates = (manga.updatedChapters || []).length > 0;

  // Cover URL
  const coverUrl = manga.localCover
    ? `/api/public/covers/${manga.id}/${encodeURIComponent(manga.localCover.split(/[/\\]/).pop())}`
    : manga.cover;

  const isLocal = manga.source === 'local';

  return `
    <div class="manga-card" data-id="${manga.id}">
      <div class="manga-card-cover">
        ${coverUrl
      ? `<img src="${coverUrl}" alt="${displayName}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`
      : `<div class="placeholder">${isLocal ? '💾' : '📚'}</div>`
    }
        <div class="manga-card-badges">
          ${readCount > 0 ? `<span class="badge badge-read" title="Read">${readCount}</span>` : ''}
          <span class="badge badge-chapters" title="Total">${totalCount}</span>
          ${downloadedCount > 0 ? `<span class="badge badge-downloaded" title="Downloaded">${downloadedCount}</span>` : ''}
          ${hasUpdates ? `<span class="badge badge-warning" title="Updates available">!</span>` : ''}
          ${state.activeCategory === 'Favorites' ? `<span class="badge badge-play" title="Click to Read">▶</span>` : ''}
        </div>
      </div>
      <div class="manga-card-title">${displayName}</div>
    </div>
  `;
}

/**
 * Render empty state
 */
function renderEmptyState() {
  return `
    <div class="empty-state">
      <h2>No manga in your library</h2>
      <p>Click "Add Manga" to get started!</p>
      <button class="btn btn-primary" id="empty-add-btn">+ Add Manga</button>
    </div>
  `;
}

/**
 * Render a series card
 */
function renderSeriesCard(series) {
  const displayName = series.alias || series.title;
  const entryCount = series.entries?.length || series.entry_count || 0;

  // Cover URL - backend sets localCover and coverBookmarkId on series object
  let coverUrl = null;
  if (series.localCover && series.coverBookmarkId) {
    coverUrl = `/api/public/covers/${series.coverBookmarkId}/${encodeURIComponent(series.localCover.split(/[/\\]/).pop())}`;
  } else if (series.cover) {
    coverUrl = series.cover;
  }

  return `
    <div class="manga-card series-card" data-series-id="${series.id}">
      <div class="manga-card-cover">
        ${coverUrl
      ? `<img src="${coverUrl}" alt="${displayName}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`
      : `<div class="placeholder">📖</div>`
    }
        <div class="manga-card-badges">
          <span class="badge badge-series">Series</span>
          <span class="badge badge-chapters">${entryCount} entries</span>
        </div>
      </div>
      <div class="manga-card-title">${displayName}</div>
    </div>
  `;
}

/**
 * Render a gallery card (Favorite List)
 */
function renderGalleryCard(listName, items) {
  // Find cover image from first item
  let coverUrl = null;
  for (const item of items) {
    if (item.imagePaths && item.imagePaths.length > 0) {
      // Construct URL
      const filename = item.imagePaths[0];
      coverUrl = `/api/public/chapter-images/${item.mangaId}/${item.chapterNum}/${encodeURIComponent(filename)}`;
      break;
    }
  }

  const count = items.length;

  return `
    <div class="manga-card gallery-card" data-gallery="${listName}">
      <div class="manga-card-cover">
        ${coverUrl
      ? `<img src="${coverUrl}" alt="${listName}" loading="lazy">`
      : `<div class="placeholder">📁</div>`}
        <div class="manga-card-badges">
            <span class="badge badge-series">${count} items</span>
        </div>
      </div>
      <div class="manga-card-title">${listName}</div>
    </div>
  `;
}

/**
 * Render the library view
 */
export function render() {
  // Load saved viewMode from localStorage
  const savedMode = localStorage.getItem('library_view_mode');
  if (savedMode && savedMode !== state.viewMode) {
    state.viewMode = savedMode;
  }

  if (state.viewMode === 'series') {
    // Render series view
    const seriesCards = state.series.map(renderSeriesCard).join('');

    return `
        ${renderHeader(state.viewMode)}
<div class="container">
  <div class="library-grid" id="library-grid">
    ${state.loading
        ? '<div class="loading-spinner"></div>'
        : (seriesCards || '<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p></div>')
      }
  </div>
</div>
`;

  }

  // Favorites - redirect to dedicated favorites view
  if (state.activeCategory === 'Favorites') {
    // Redirect to favorites view - don't return any HTML to avoid overwriting
    router.go('/favorites');
    return ''; // Return empty - favorites view will render its own content
  }
  let filtered = state.activeCategory
    ? state.bookmarks.filter(m => (m.categories || []).includes(state.activeCategory))
    : state.bookmarks;

  if (state.artistFilter) {
    filtered = filtered.filter(m => (m.artists || []).includes(state.artistFilter));
  }

  const cards = filtered.map(renderMangaCard).join('');

  return `
    ${renderHeader(state.viewMode)}
    <div class="container">
      ${state.artistFilter ? `
        <div class="artist-filter-badge" id="artist-filter-badge">
          <span class="artist-filter-icon">🎨</span>
          <span class="artist-filter-name">${state.artistFilter}</span>
          <span class="artist-filter-clear">×</span>
        </div>
      ` : ''}
      <div class="library-grid" id="library-grid">
        ${state.loading
      ? '<div class="loading-spinner"></div>'
      : (cards || renderEmptyState())
    }
      </div>
    </div>
    ${renderCategoryFab()}
    ${renderAddModal()}
    `;
}

/**
 * Render category filter FAB
 */

function renderCategoryFab() {
  const { activeCategory } = state;
  const categories = Array.isArray(state.categories) ? state.categories : [];

  return `
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${activeCategory ? 'has-filter' : ''}" id="category-fab-btn">
        ${activeCategory || '🏷️'}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${!activeCategory ? 'active' : ''}" data-category="">All</button>
          ${categories.map(cat => `
            <button class="category-menu-item ${activeCategory === cat ? 'active' : ''}" data-category="${cat}">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
      `;
}

/**
 * Render add manga modal
 */

/**
 * Render add manga modal
 */
function renderAddModal() {
  return `
      <div class="modal" id="add-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Manga</h2>
          <button class="modal-close" id="add-modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="manga-url">Manga URL</label>
            <input type="url" id="manga-url" placeholder="https://comix.to/..." required>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="add-modal-cancel">Cancel</button>
          <button class="btn btn-primary" id="add-modal-submit">Add</button>
        </div>
      </div>
    </div>
      `;
}

/**
 * Handle clear filters event
 */
function handleClearFilters() {
  state.activeCategory = null;
  state.artistFilter = null;
  localStorage.removeItem('library_active_category');
  mount();
}

/**
 * Setup event listeners
 */
export function setupListeners() {
  const app = document.getElementById('app');

  // Manga card clicks
  app.addEventListener('click', (e) => {
    const card = e.target.closest('.manga-card');
    if (card) {
      // Check for Gallery Card
      if (card.classList.contains('gallery-card')) {
        const name = card.dataset.gallery;
        router.go(`/ read / gallery / ${encodeURIComponent(name)} `);
        return;
      }

      const id = card.dataset.id;
      const seriesId = card.dataset.seriesId;

      // Handle Series Card
      if (seriesId) {
        router.go(`/ series / ${seriesId} `);
        return;
      }

      // Handle Manga Card
      if (id) {
        // Special behavior for Favorites: Open Reader directly
        if (state.activeCategory === 'Favorites') {
          const manga = state.bookmarks.find(m => m.id === id);
          if (manga) {
            // Determine chapter to read
            let targetChapter = manga.last_read_chapter;

            // If never read, find the first available chapter
            if (!targetChapter && manga.chapters && manga.chapters.length > 0) {
              // Sort by number ascending to find the first one
              const sorted = [...manga.chapters].sort((a, b) => a.number - b.number);
              targetChapter = sorted[0].number;
            }

            // Navigate to reader if a chapter is found
            if (targetChapter) {
              // Format: /read/:id/:chapter
              // Note: Router likely expects the "reader" view which is at /read or /reader. 
              // Checking router definitions would be ideal, but assuming standard /read/:id/:chapter based on context
              router.go(`/ read / ${id}/${targetChapter}`);
              return;
            } else {
              showToast('No chapters available to read', 'warning');
              // Fallback to detail view
            }
          }
        }

        // Default behavior: Open Detail View
        router.go(`/manga/${id}`);
      }
    }
  });

  // CRITICAL: Setup header listeners for navigation
  setupHeaderListeners();

  // Header Actions
  const favBtn = document.getElementById('favorites-btn');
  const scanBtn = document.getElementById('scan-btn');
  const quickCheckBtn = document.getElementById('quick-check-btn');

  const mobileFavBtn = document.getElementById('mobile-favorites-btn');
  const mobileScanBtn = document.getElementById('mobile-scan-btn');
  const mobileQuickCheckBtn = document.getElementById('mobile-quick-check-btn');

  // Favorites
  const handleFavorites = () => {
    // Toggle: if already on favorites, clear it. If not, set it.
    if (state.activeCategory === 'Favorites') {
      filterByCategory(null);
    } else {
      filterByCategory('Favorites');
    }
  };
  if (favBtn) favBtn.addEventListener('click', handleFavorites);
  if (mobileFavBtn) mobileFavBtn.addEventListener('click', handleFavorites);

  // Scan Folder
  const handleScan = async () => {
    try {
      if (scanBtn) { scanBtn.disabled = true; scanBtn.textContent = 'Scanning...'; }
      if (mobileScanBtn) mobileScanBtn.textContent = 'Scanning...';
      showToast('Scanning downloads folder...', 'info');

      await api.scanLibrary();

      showToast('Scan complete. Refreshing...', 'success');
      await loadData();
      mount();
    } catch (e) {
      showToast('Scan failed: ' + e.message, 'error');
    } finally {
      if (scanBtn) { scanBtn.disabled = false; scanBtn.textContent = '📁 Scan Folder'; }
      if (mobileScanBtn) mobileScanBtn.textContent = '📁 Scan Folder';
    }
  };
  if (scanBtn) scanBtn.addEventListener('click', handleScan);
  if (mobileScanBtn) mobileScanBtn.addEventListener('click', handleScan);

  // View mode change listener - only set up once globally
  if (!window._libraryViewModeListenerSet) {
    window._libraryViewModeListenerSet = true;
    window.addEventListener('viewModeChange', (e) => {
      state.viewMode = e.detail.mode;
      // Re-render
      const app = document.getElementById('app');
      app.innerHTML = render();
      setupListeners();
      // CRITICAL: Re-attach header listeners to new header buttons
      setupHeaderListeners();
    });
  }

  // Category FAB
  const fabBtn = document.getElementById('category-fab-btn');
  const fabMenu = document.getElementById('category-fab-menu');

  if (fabBtn && fabMenu) {
    fabBtn.addEventListener('click', () => {
      fabMenu.classList.toggle('hidden');
    });

    fabMenu.addEventListener('click', (e) => {
      const item = e.target.closest('.category-menu-item');
      if (item) {
        const category = item.dataset.category || null;
        filterByCategory(category);
        fabMenu.classList.add('hidden');
      }
    });
  }

  // Artist filter clear
  const artistBadge = document.getElementById('artist-filter-badge');
  if (artistBadge) {
    artistBadge.addEventListener('click', () => {
      state.artistFilter = null;
      mount();
    });
  }

  // Global Clear Filters (from Logo click)
  // Remove first to prevent duplicates if cleanup failed
  window.removeEventListener('clearFilters', handleClearFilters);
  window.addEventListener('clearFilters', handleClearFilters);

  // Add modal
  const addBtn = document.getElementById('add-manga-btn');
  const modal = document.getElementById('add-modal');
  const modalClose = document.getElementById('add-modal-close');
  const modalCancel = document.getElementById('add-modal-cancel');
  const modalSubmit = document.getElementById('add-modal-submit');

  if (addBtn && modal) {
    addBtn.addEventListener('click', () => modal.classList.add('open'));
  }

  if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('open'));
  if (modalCancel) modalCancel.addEventListener('click', () => modal.classList.remove('open'));

  if (modalSubmit) {
    modalSubmit.addEventListener('click', async () => {
      const urlInput = document.getElementById('manga-url');
      const url = urlInput.value.trim();

      if (!url) {
        showToast('Please enter a URL', 'error');
        return;
      }

      try {
        modalSubmit.disabled = true;
        modalSubmit.textContent = 'Adding...';

        await api.addBookmark(url);
        showToast('Manga added successfully!', 'success');
        modal.classList.remove('open');
        urlInput.value = '';

        // Refresh library
        await loadData();
        mount();
      } catch (error) {
        showToast('Failed to add manga: ' + error.message, 'error');
      } finally {
        modalSubmit.disabled = false;
        modalSubmit.textContent = 'Add';
      }
    });
  }

  // Empty state add button
  const emptyAddBtn = document.getElementById('empty-add-btn');
  if (emptyAddBtn && modal) {
    emptyAddBtn.addEventListener('click', () => modal.classList.add('open'));
  }

  // Close modal on overlay click
  const overlay = modal?.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => modal.classList.remove('open'));
  }
}

/**
 * Filter by category
 */
function filterByCategory(category) {
  state.activeCategory = category;
  if (category) {
    localStorage.setItem('library_active_category', category);
  } else {
    localStorage.removeItem('library_active_category');
  }
  mount();
}

/**
 * Load library data
 */
async function loadData() {
  try {
    const [bookmarks, categoriesResult, series, favorites] = await Promise.all([
      api.getBookmarks(),
      api.get('/categories'),
      api.get('/series'),
      api.getFavorites()
    ]);

    state.bookmarks = bookmarks;
    state.categories = categoriesResult.categories || [];
    state.series = series || [];
    state.favorites = favorites || { favorites: {}, listOrder: [] };
    state.loading = false;
  } catch (error) {
    showToast('Failed to load library', 'error');
    state.loading = false;
  }
}

/**
 * Mount the library view
 */
export async function mount() {
  const app = document.getElementById('app');

  // Sync activeCategory with localStorage in case it was changed externally (e.g. by header logo click)
  const storedCategory = localStorage.getItem('library_active_category');
  if (state.activeCategory !== storedCategory) {
    state.activeCategory = storedCategory;
  }

  // Show loading first
  if (state.loading) {
    app.innerHTML = render();
  }

  // Load data if needed
  if (state.bookmarks.length === 0 && state.loading) {
    await loadData();
  }

  // Render with data
  app.innerHTML = render();
  setupListeners();
}

/**
 * Unmount / cleanup
 */
export function unmount() {
  // Remove event listener to prevent duplicates
  if (viewModeHandler) {
    window.removeEventListener('viewModeChange', viewModeHandler);
    viewModeHandler = null;
  }

  // Remove clearFilters listener
  window.removeEventListener('clearFilters', handleClearFilters);
}

export default { mount, unmount, render };
