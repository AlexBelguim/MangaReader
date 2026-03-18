import { handleScan } from '../utils/scan.js';

/**
 * Library View Component
 * Main grid of manga cards
 */

import { api } from '../api.js';
import { store } from '../store.js';
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
  searchQuery: localStorage.getItem('library_search') || '',
  sortBy: localStorage.getItem('library_sort') || 'updated',
  viewMode: 'manga', // 'manga' or 'series'
  loading: true
};

// Event handler reference for cleanup
let viewModeHandler = null;
let storeUnsubs = [];

/**
 * Sort bookmarks by current sort preference
 */
function sortBookmarks(list) {
  return [...list].sort((a, b) => {
    switch (state.sortBy) {
      case 'az': return (a.alias || a.title).localeCompare(b.alias || b.title);
      case 'za': return (b.alias || b.title).localeCompare(a.alias || a.title);
      case 'lastread': return (b.lastReadAt || '').localeCompare(a.lastReadAt || '');
      case 'chapters': {
        const ac = a.chapters?.length || a.uniqueChapters || 0;
        const bc = b.chapters?.length || b.uniqueChapters || 0;
        return bc - ac;
      }
      case 'updated':
      default: return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    }
  });
}

/**
 * Render a manga card
 */
function renderMangaCard(manga) {
  const displayName = manga.alias || manga.title;
  const downloadedCount = manga.downloadedCount ?? manga.downloadedChapters?.length ?? 0;
  const excludedSet = new Set(manga.excludedChapters || []);
  const visibleChapters = (manga.chapters || []).filter(c => !excludedSet.has(c.number));
  const totalCount = new Set(visibleChapters.map(c => c.number)).size || manga.uniqueChapters || 0;
  const readCount = manga.readCount ?? manga.readChapters?.length ?? 0;
  const hasUpdates = (manga.updatedCount ?? manga.updatedChapters?.length ?? 0) > 0;


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
          ${manga.autoCheck ? `<span class="badge badge-monitored" title="Auto-check enabled">⏰</span>` : ''}
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

  // Favorites - redirect to dedicated favorites view
  if (state.activeCategory === 'Favorites') {
    // Redirect to favorites view - don't return any HTML to avoid overwriting
    router.go('/favorites');
    return ''; // Return empty - favorites view will render its own content
  }

  let content = '';
  if (state.viewMode === 'series') {
    // Render series view
    const seriesCards = state.series.map(renderSeriesCard).join('');
    content = `
      <div class="library-grid" id="library-grid">
        ${state.loading
        ? '<div class="loading-spinner"></div>'
        : (seriesCards || '<div class="empty-state"><h2>No series yet</h2><p>Create a series to group related manga together.</p><button class="btn btn-primary" id="empty-add-series-btn">+ Create Series</button></div>')
      }
      </div>
    `;
  } else {
    // Render manga view
    let filtered = state.bookmarks;

    // Get NSFW category names for filtering
    const nsfwCategoryNames = (Array.isArray(state.categories) ? state.categories : [])
      .filter(c => typeof c === 'object' ? c.isNsfw : false)
      .map(c => c.name);

    // Special 'nsfw' filter: show manga in ANY NSFW-marked category
    if (state.activeCategory === '__nsfw__') {
      filtered = filtered.filter(m => (m.categories || []).some(c => nsfwCategoryNames.includes(c)));
    } else if (state.activeCategory) {
      filtered = filtered.filter(m => (m.categories || []).includes(state.activeCategory));
    } else {
      // "All" — exclude manga that belongs to any NSFW category
      if (nsfwCategoryNames.length > 0) {
        filtered = filtered.filter(m => !(m.categories || []).some(c => nsfwCategoryNames.includes(c)));
      }
    }

    if (state.artistFilter) {
      filtered = filtered.filter(m => (m.artists || []).includes(state.artistFilter));
    }

    // Search filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        (m.title || '').toLowerCase().includes(q) ||
        (m.alias || '').toLowerCase().includes(q) ||
        (m.artists || []).some(a => a.toLowerCase().includes(q))
      );
    }

    // Sort
    filtered = sortBookmarks(filtered);

    const cards = filtered.map(renderMangaCard).join('');

    content = `
      <div class="library-controls">
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" id="library-search" placeholder="Search manga or author..." value="${state.searchQuery}" autocomplete="off">
          ${state.searchQuery ? '<button class="search-clear" id="search-clear">×</button>' : ''}
        </div>
        <select class="sort-select" id="library-sort">
          <option value="updated" ${state.sortBy === 'updated' ? 'selected' : ''}>Recently Updated</option>
          <option value="az" ${state.sortBy === 'az' ? 'selected' : ''}>A → Z</option>
          <option value="za" ${state.sortBy === 'za' ? 'selected' : ''}>Z → A</option>
          <option value="lastread" ${state.sortBy === 'lastread' ? 'selected' : ''}>Last Read</option>
          <option value="chapters" ${state.sortBy === 'chapters' ? 'selected' : ''}>Most Chapters</option>
        </select>
      </div>
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
    `;
  }

  return `
    ${renderHeader(state.viewMode)}
    <div class="container">
      ${content}
    </div>
    ${renderCategoryFab()}
    ${renderAddModal()}
    ${renderAddSeriesModal()}
  `;
}

/**
 * Render category filter FAB
 */

function renderCategoryFab() {
  const { activeCategory } = state;
  const rawCategories = Array.isArray(state.categories) ? state.categories : [];
  // Normalize: support both string[] and {name, isNsfw}[] formats
  const categories = rawCategories.map(c => typeof c === 'object' ? c : { name: c, isNsfw: false });
  const hasNsfwCategories = categories.some(c => c.isNsfw);

  return `
      <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${activeCategory ? 'has-filter' : ''}" id="category-fab-btn">
        ${activeCategory === '__nsfw__' ? '🔞' : activeCategory || '🏷️'}
      </button>
      <div class="category-fab-menu hidden" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" id="manage-categories-btn">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${!activeCategory ? 'active' : ''}" data-category="">All</button>
          ${hasNsfwCategories ? `<button class="category-menu-item ${activeCategory === '__nsfw__' ? 'active' : ''}" data-category="__nsfw__" style="color: #f44336;">🔞 All 18+</button>` : ''}
          ${categories.map(cat => `
            <button class="category-menu-item ${activeCategory === cat.name ? 'active' : ''}" data-category="${cat.name}">
              ${cat.name}${cat.isNsfw ? ' <span style="color:#f44336;font-size:0.75em;">18+</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
    ${renderManageCategoriesModal()}
      `;
}

function renderManageCategoriesModal() {
  const rawCategories = Array.isArray(state.categories) ? state.categories : [];
  const categories = rawCategories.map(c => typeof c === 'object' ? c : { name: c, isNsfw: false });

  return `
    <div class="modal" id="manage-categories-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
          <h2>⚙️ Manage Categories</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group" style="display: flex; gap: 8px; margin-bottom: 16px;">
            <input type="text" id="new-category-input" placeholder="New category name..." style="flex: 1;">
            <button class="btn btn-primary" id="add-category-btn">Add</button>
          </div>
          <div id="categories-list" style="max-height: 300px; overflow-y: auto;">
            ${categories.length === 0 ? '<p class="text-muted">No categories yet</p>' : ''}
            ${categories.map(cat => `
              <div class="category-manage-row" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid var(--border-color, #333);">
                <span style="flex: 1;">${cat.name}</span>
                <div style="display: flex; gap: 6px; align-items: center;">
                  <label style="display: flex; align-items: center; gap: 4px; cursor: pointer; font-size: 0.85em; color: ${cat.isNsfw ? '#f44336' : 'var(--text-secondary)'}">
                    <input type="checkbox" class="nsfw-toggle" data-category="${cat.name}" ${cat.isNsfw ? 'checked' : ''} style="width: 16px; height: 16px;">
                    18+
                  </label>
                  <button class="btn-icon small danger delete-category-btn" data-category="${cat.name}" title="Delete">🗑️</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="close-manage-categories-btn">Close</button>
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
 * Render add series modal
 */
function renderAddSeriesModal() {
  return `
      <div class="modal" id="add-series-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Series</h2>
          <button class="modal-close" id="add-series-modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="series-title">Series Title</label>
            <input type="text" id="series-title" placeholder="e.g., Marvel Cinematic Universe" required>
          </div>
          <div class="form-group">
            <label for="series-alias">Alias (Optional)</label>
            <input type="text" id="series-alias" placeholder="e.g., MCU">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="add-series-modal-cancel">Cancel</button>
          <button class="btn btn-primary" id="add-series-modal-submit">Create</button>
        </div>
      </div>
    </div>
      `;
}
function handleClearFilters() {
  state.activeCategory = null;
  state.artistFilter = null;
  state.searchQuery = '';
  localStorage.removeItem('library_active_category');
  localStorage.removeItem('library_artist_filter');
  localStorage.removeItem('library_search');
  mount();
}

/**
 * Setup event listeners
 */
/**
 * Handle card clicks
 */
async function handleCardClick(e) {
  const card = e.target.closest('.manga-card');
  if (card) {
    // Check for Gallery Card
    if (card.classList.contains('gallery-card')) {
      const name = card.dataset.gallery;
      router.go(`/read/gallery/${encodeURIComponent(name)}`);
      return;
    }

    const id = card.dataset.id;
    const seriesId = card.dataset.seriesId;

    // Handle Series Card
    if (seriesId) {
      router.go(`/series/${seriesId}`);
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
            router.go(`/read/${id}/${targetChapter}`);
            return;
          } else {
            showToast('No chapters available to read', 'warning');
          }
        }
      }

      // Default behavior: Open Detail View
      router.go(`/manga/${id}`);
    }
  }
}

/**
 * Setup event listeners
 */
export function setupListeners() {
  const app = document.getElementById('app');

  // Manga card clicks
  app.removeEventListener('click', handleCardClick);
  app.addEventListener('click', handleCardClick);

  // Header actions (Favorites, Queue, etc.) are now handled by setupHeaderListeners in header.js
  // that is called centrally by the router or by each view.

  // Scan Folder listeners are now handled centrally by setupHeaderListeners in header.js

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

  // Manage categories button
  document.getElementById('manage-categories-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const modal = document.getElementById('manage-categories-modal');
    if (modal) modal.classList.add('open');
  });

  // Close manage categories modal
  document.getElementById('close-manage-categories-btn')?.addEventListener('click', () => {
    document.getElementById('manage-categories-modal')?.classList.remove('open');
  });
  document.querySelector('#manage-categories-modal .modal-overlay')?.addEventListener('click', () => {
    document.getElementById('manage-categories-modal')?.classList.remove('open');
  });
  document.querySelector('#manage-categories-modal .modal-close')?.addEventListener('click', () => {
    document.getElementById('manage-categories-modal')?.classList.remove('open');
  });

  // Add category
  document.getElementById('add-category-btn')?.addEventListener('click', async () => {
    const input = document.getElementById('new-category-input');
    const name = input?.value?.trim();
    if (!name) return;
    try {
      await api.post('/categories', { name });
      input.value = '';
      showToast('Category added', 'success');
      await loadData(true);
      mount();
    } catch (error) {
      showToast('Failed: ' + error.message, 'error');
    }
  });

  // NSFW toggles
  document.querySelectorAll('.nsfw-toggle').forEach(toggle => {
    toggle.addEventListener('change', async (e) => {
      const catName = toggle.dataset.category;
      try {
        await api.put(`/categories/${encodeURIComponent(catName)}/nsfw`, { isNsfw: toggle.checked });
        showToast(`${catName} ${toggle.checked ? 'marked as 18+' : 'unmarked'}`, 'success');
        await loadData(true);
        mount();
      } catch (error) {
        showToast('Failed: ' + error.message, 'error');
        toggle.checked = !toggle.checked;
      }
    });
  });

  // Delete category buttons
  document.querySelectorAll('.delete-category-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const catName = btn.dataset.category;
      if (!confirm(`Delete category "${catName}"?`)) return;
      try {
        await api.delete(`/categories/${encodeURIComponent(catName)}`);
        showToast('Category deleted', 'success');
        if (state.activeCategory === catName) {
          state.activeCategory = null;
          localStorage.removeItem('library_active_category');
        }
        await loadData(true);
        mount();
      } catch (error) {
        showToast('Failed: ' + error.message, 'error');
      }
    });
  });

  // Artist filter clear
  const artistBadge = document.getElementById('artist-filter-badge');
  if (artistBadge) {
    artistBadge.addEventListener('click', () => {
      state.artistFilter = null;
      mount();
    });
  }

  // Search bar
  const searchInput = document.getElementById('library-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      localStorage.setItem('library_search', e.target.value);
      // Re-render grid only
      const grid = document.getElementById('library-grid');
      if (grid) {
        let filtered = state.activeCategory
          ? state.bookmarks.filter(m => (m.categories || []).includes(state.activeCategory))
          : state.bookmarks;
        if (state.artistFilter) {
          filtered = filtered.filter(m => (m.artists || []).includes(state.artistFilter));
        }
        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          filtered = filtered.filter(m =>
            (m.title || '').toLowerCase().includes(q) ||
            (m.alias || '').toLowerCase().includes(q)
          );
        }
        filtered = sortBookmarks(filtered);
        grid.innerHTML = filtered.map(renderMangaCard).join('') || renderEmptyState();
        // Show/hide clear button
        const clearBtn = document.getElementById('search-clear');
        if (!clearBtn && state.searchQuery) {
          searchInput.parentElement.insertAdjacentHTML('beforeend', '<button class="search-clear" id="search-clear">×</button>');
          document.getElementById('search-clear')?.addEventListener('click', () => {
            state.searchQuery = '';
            localStorage.removeItem('library_search');
            searchInput.value = '';
            mount();
          });
        } else if (clearBtn && !state.searchQuery) {
          clearBtn.remove();
        }
      }
    });
    // Focus preservation: re-focus after render
    if (state.searchQuery) searchInput.focus();
  }

  const searchClear = document.getElementById('search-clear');
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      state.searchQuery = '';
      mount();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById('library-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      localStorage.setItem('library_sort', state.sortBy);
      mount();
    });
  }

  // Global Clear Filters (from Logo click)
  // Remove first to prevent duplicates if cleanup failed
  window.removeEventListener('clearFilters', handleClearFilters);
  window.addEventListener('clearFilters', handleClearFilters);

  // Add modal
  const addBtn = document.getElementById('add-manga-btn');
  const mobileAddBtn = document.getElementById('mobile-add-btn');
  const modal = document.getElementById('add-modal');
  const modalClose = document.getElementById('add-modal-close');
  const modalCancel = document.getElementById('add-modal-cancel');
  const modalSubmit = document.getElementById('add-modal-submit');
  const mobileMenu = document.getElementById('mobile-menu');

  const showAddModal = () => {
    if (mobileMenu) mobileMenu.classList.add('hidden');
    if (modal) modal.classList.add('open');
  };

  if (addBtn) addBtn.addEventListener('click', showAddModal);
  if (mobileAddBtn) mobileAddBtn.addEventListener('click', showAddModal);

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

  // Add series modal
  const addSeriesBtn = document.getElementById('add-series-btn');
  const mobileAddSeriesBtn = document.getElementById('mobile-add-series-btn');
  const seriesModal = document.getElementById('add-series-modal');
  const seriesModalClose = document.getElementById('add-series-modal-close');
  const seriesModalCancel = document.getElementById('add-series-modal-cancel');
  const seriesModalSubmit = document.getElementById('add-series-modal-submit');

  const mobileMenuForSeries = document.getElementById('mobile-menu');
  if ((addSeriesBtn || mobileAddSeriesBtn) && seriesModal) {
    const showSeriesModal = () => {
      if (mobileMenuForSeries) mobileMenuForSeries.classList.add('hidden');
      seriesModal.classList.add('open');
    }
    if (addSeriesBtn) addSeriesBtn.addEventListener('click', showSeriesModal);
    if (mobileAddSeriesBtn) mobileAddSeriesBtn.addEventListener('click', showSeriesModal);
  }

  if (seriesModalClose) seriesModalClose.addEventListener('click', () => seriesModal.classList.remove('open'));
  if (seriesModalCancel) seriesModalCancel.addEventListener('click', () => seriesModal.classList.remove('open'));

  if (seriesModalSubmit) {
    seriesModalSubmit.addEventListener('click', async () => {
      const titleInput = document.getElementById('series-title');
      const aliasInput = document.getElementById('series-alias');
      const title = titleInput.value.trim();
      const alias = aliasInput.value.trim();

      if (!title) {
        showToast('Please enter a title', 'error');
        return;
      }

      try {
        seriesModalSubmit.disabled = true;
        seriesModalSubmit.textContent = 'Creating...';

        await api.createSeries(title, alias);
        showToast('Series created successfully!', 'success');
        seriesModal.classList.remove('open');
        titleInput.value = '';
        aliasInput.value = '';

        // Refresh library
        await loadData(true);
        mount();
      } catch (error) {
        showToast('Failed to create series: ' + error.message, 'error');
      } finally {
        seriesModalSubmit.disabled = false;
        seriesModalSubmit.textContent = 'Create';
      }
    });
  }

  // Close series modal on overlay click
  const seriesOverlay = seriesModal?.querySelector('.modal-overlay');
  if (seriesOverlay) {
    seriesOverlay.addEventListener('click', () => seriesModal.classList.remove('open'));
  }

  // Empty state add button
  const emptyAddBtn = document.getElementById('empty-add-btn');
  if (emptyAddBtn && modal) {
    emptyAddBtn.addEventListener('click', () => modal.classList.add('open'));
  }

  // Empty state add series button
  const emptyAddSeriesBtn = document.getElementById('empty-add-series-btn');
  if (emptyAddSeriesBtn && seriesModal) {
    emptyAddSeriesBtn.addEventListener('click', () => seriesModal.classList.add('open'));
  }

  // Close modal on overlay click
  const overlay = modal?.querySelector('.modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => modal.classList.remove('open'));
  }

  // Header Component Listeners
  setupHeaderListeners();
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
async function loadData(force = false) {
  try {
    const [bookmarks, categories, series, favorites] = await Promise.all([
      store.loadBookmarks(force),
      store.loadCategories(force),
      store.loadSeries(force),
      store.loadFavorites(force)
    ]);

    state.bookmarks = bookmarks;
    state.categories = categories;
    state.series = series;
    state.favorites = favorites;
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

  // Sync artistFilter with localStorage
  const storedArtist = localStorage.getItem('library_artist_filter');
  if (storedArtist && state.artistFilter !== storedArtist) {
    state.artistFilter = storedArtist;
  }

  // Sync searchQuery with localStorage (e.g. set by artist link click from manga detail)
  const storedSearch = localStorage.getItem('library_search') || '';
  if (state.searchQuery !== storedSearch) {
    state.searchQuery = storedSearch;
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

  // Subscribe to store updates for live refresh
  storeUnsubs.forEach(fn => fn());
  storeUnsubs = [
    store.subscribe('bookmarks', (bookmarks) => {
      state.bookmarks = bookmarks;
      const grid = document.getElementById('library-grid');
      if (grid) {
        let filtered = state.activeCategory
          ? state.bookmarks.filter(m => (m.categories || []).includes(state.activeCategory))
          : state.bookmarks;
        if (state.artistFilter) filtered = filtered.filter(m => (m.artists || []).includes(state.artistFilter));
        if (state.searchQuery) {
          const q = state.searchQuery.toLowerCase();
          filtered = filtered.filter(m => (m.title || '').toLowerCase().includes(q) || (m.alias || '').toLowerCase().includes(q));
        }
        filtered = sortBookmarks(filtered);
        grid.innerHTML = filtered.map(renderMangaCard).join('') || renderEmptyState();
      }
    })
  ];
}

/**
 * Unmount / cleanup
 */
export function unmount() {
  // Unmount previous view
  if (viewModeHandler) {
    window.removeEventListener('viewModeChange', viewModeHandler);
    viewModeHandler = null;
  }

  // Remove card click listener
  const app = document.getElementById('app');
  if (app) {
    app.removeEventListener('click', handleCardClick);
  }

  // Remove clearFilters listener
  window.removeEventListener('clearFilters', handleClearFilters);

  // Unsubscribe from store
  storeUnsubs.forEach(fn => fn());
  storeUnsubs = [];
}

export default { mount, unmount, render };
