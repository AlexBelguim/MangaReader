/**
 * Favorites View Component
 * Displays favorite galleries and trophy pages
 */

import { api } from '../api.js';
import { store } from '../store.js';
import { router } from '../router.js';
import { renderHeader, setupHeaderListeners } from '../components/header.js';
import { showToast } from '../utils/toast.js';

// View state
let state = {
  favorites: { favorites: {}, listOrder: [] },
  trophyPages: {}, // { mangaId: { chapterNum: { pageIndex: {...} } } }
  bookmarks: [], // For manga titles
  series: [], // For series grouping
  loading: true,
  activeTab: 'galleries' // 'galleries' or 'trophies'
};

/**
 * Render a gallery card
 */
function renderGalleryCard(listName, items) {
  // Get first page from first item as cover
  let coverUrl = null;
  if (items.length > 0) {
    const firstItem = items[0];
    if (firstItem.imagePaths && firstItem.imagePaths.length > 0) {
      const imgPath = firstItem.imagePaths[0];
      // Extract filename from string or object
      let filename;
      if (typeof imgPath === 'string') {
        filename = imgPath;
      } else if (imgPath && typeof imgPath === 'object') {
        filename = imgPath.filename || imgPath.path || imgPath.name || imgPath.url;
        if (filename && filename.includes('/')) {
          filename = filename.split('/').pop();
        }
        if (filename && filename.includes('\\')) {
          filename = filename.split('\\').pop();
        }
      }
      if (filename) {
        coverUrl = `/api/public/chapter-images/${firstItem.mangaId}/${firstItem.chapterNum}/${encodeURIComponent(filename)}`;
      }
    }
  }

  // Count total pages across all items
  const totalPages = items.reduce((sum, item) => sum + (item.imagePaths?.length || 0), 0);

  return `
    <div class="manga-card gallery-card" data-gallery="${listName}">
      <div class="manga-card-cover">
        ${coverUrl
      ? `<img src="${coverUrl}" alt="${listName}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📁</div>'">`
      : `<div class="placeholder">📁</div>`}
        <div class="manga-card-badges">
            <span class="badge badge-series">${totalPages} pages</span>
        </div>
      </div>
      <div class="manga-card-title">${listName}</div>
    </div>
  `;
}

/**
 * Get manga title from bookmarks/series
 */
function getMangaDisplayName(mangaId) {
  const manga = state.bookmarks.find(b => b.id === mangaId);
  if (manga) {
    return manga.alias || manga.title;
  }
  return mangaId;
}

/**
 * Get series name for a manga if it belongs to one
 */
function getSeriesForManga(mangaId) {
  const manga = state.bookmarks.find(b => b.id === mangaId);
  if (manga && manga.seriesId) {
    const series = state.series.find(s => s.id === manga.seriesId);
    if (series) {
      return { id: series.id, name: series.alias || series.title };
    }
  }
  return null;
}

/**
 * Render a trophy card (for manga or series)
 */
function renderTrophyCard(id, displayName, totalTrophies, isSeries = false) {
  return `
    <div class="manga-card trophy-gallery-card" data-trophy-id="${id}" data-is-series="${isSeries}">
      <div class="manga-card-cover">
        <div class="placeholder trophy-placeholder">🏆</div>
        <div class="manga-card-badges">
            <span class="badge badge-trophy">🏆 ${totalTrophies}</span>
            ${isSeries ? '<span class="badge badge-series">Series</span>' : ''}
        </div>
      </div>
      <div class="manga-card-title">${displayName}</div>
    </div>
  `;
}

/**
 * Group trophies by manga/series
 */
function buildTrophyGroups() {
  const groups = {}; // { groupId: { name, isSeries, count, mangaIds } }

  console.log('Building trophy groups from:', state.trophyPages);

  for (const mangaId of Object.keys(state.trophyPages)) {
    const chapters = state.trophyPages[mangaId];
    let trophyCount = 0;

    for (const [chNum, pages] of Object.entries(chapters)) {
      trophyCount += Object.keys(pages).length;
    }

    console.log(`Manga ${mangaId}: ${trophyCount} trophies`);

    if (trophyCount === 0) continue;

    const series = getSeriesForManga(mangaId);

    if (series) {
      // Group by series
      if (!groups[series.id]) {
        groups[series.id] = {
          name: series.name,
          isSeries: true,
          count: 0,
          mangaIds: []
        };
      }
      groups[series.id].count += trophyCount;
      groups[series.id].mangaIds.push(mangaId);
    } else {
      // Individual manga
      const displayName = getMangaDisplayName(mangaId);
      console.log(`No series for ${mangaId}, using name: ${displayName}`);
      groups[mangaId] = {
        name: displayName,
        isSeries: false,
        count: trophyCount,
        mangaIds: [mangaId]
      };
    }
  }

  console.log('Trophy groups result:', groups);
  return groups;
}

/**
 * Render the favorites view
 */
export function render() {
  if (state.loading) {
    return `
      ${renderHeader('manga')}
      <div class="container">
        <div class="loading-spinner"></div>
      </div>
    `;
  }

  const { favorites, listOrder } = state.favorites;

  // Tab bar
  const tabBar = `
    <div class="favorites-tabs">
      <button class="tab-btn ${state.activeTab === 'galleries' ? 'active' : ''}" data-tab="galleries">
        📁 Galleries
      </button>
      <button class="tab-btn ${state.activeTab === 'trophies' ? 'active' : ''}" data-tab="trophies">
        🏆 Trophies
      </button>
    </div>
  `;

  let content = '';

  if (state.activeTab === 'galleries') {
    if (listOrder.length === 0) {
      content = `
        <div class="empty-state">
          <h2>No Favorite Galleries</h2>
          <p>Create lists to organize your favorite pages.</p>
        </div>
      `;
    } else {
      const galleryCards = listOrder.map(name => {
        const items = (favorites && favorites[name]) || [];
        return renderGalleryCard(name, items);
      }).join('');

      content = `
        <div class="library-grid">
          ${galleryCards}
        </div>
      `;
    }
  } else {
    // Trophies tab
    const trophyGroups = buildTrophyGroups();
    const groupIds = Object.keys(trophyGroups);

    if (groupIds.length === 0) {
      content = `
        <div class="empty-state">
          <h2>No Trophy Pages</h2>
          <p>Mark pages as trophies in the reader to see them here.</p>
        </div>
      `;
    } else {
      const trophyCards = groupIds.map(groupId => {
        const group = trophyGroups[groupId];
        return renderTrophyCard(groupId, group.name, group.count, group.isSeries);
      }).join('');

      content = `
        <div class="library-grid">
          ${trophyCards}
        </div>
      `;
    }
  }

  return `
    ${renderHeader('manga')}
    <div class="container">
      <h2 style="padding: 10px 20px 0;">Favorites</h2>
      ${tabBar}
      ${content}
    </div>
  `;
}

/**
 * Setup event listeners
 */
export function setupListeners() {
  setupHeaderListeners();

  const app = document.getElementById('app');

  // Tab switching
  app.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.tab;
      app.innerHTML = render();
      setupListeners();
    });
  });

  // Gallery card clicks - open reader with only pages from this gallery
  const galleryCards = app.querySelectorAll('.gallery-card');
  console.log('[Favorites] Found gallery cards:', galleryCards.length);
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const galleryName = card.dataset.gallery;
      console.log('[Favorites] Gallery clicked:', galleryName);
      router.go(`/read/gallery/${encodeURIComponent(galleryName)}`);
    });
  });

  // Trophy card clicks
  app.querySelectorAll('.trophy-gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.trophyId;
      const isSeries = card.dataset.isSeries === 'true';

      if (isSeries) {
        router.go(`/series/${id}`);
      } else {
        router.go(`/manga/${id}`);
      }
    });
  });
}

/**
 * Load favorites data
 */
async function loadData() {
  try {
    const [favoritesData, trophyData, bookmarksData, seriesData] = await Promise.all([
      store.loadFavorites(),
      api.get('/trophy-pages'),
      store.loadBookmarks(),
      store.loadSeries()
    ]);

    state.favorites = favoritesData || { favorites: {}, listOrder: [] };
    state.trophyPages = trophyData || {};
    state.bookmarks = bookmarksData || [];
    state.series = seriesData || [];
    state.loading = false;
  } catch (error) {
    console.error('Failed to load favorites:', error);
    showToast('Failed to load favorites', 'error');
    state.loading = false;
  }
}

/**
 * Mount the favorites view
 */
export async function mount() {
  console.log('[Favorites] mount called');
  state.loading = true;

  const app = document.getElementById('app');
  app.innerHTML = render();

  await loadData();

  console.log('[Favorites] Data loaded, rendering...');
  app.innerHTML = render();
  console.log('[Favorites] Calling setupListeners...');
  setupListeners();
  console.log('[Favorites] setupListeners complete');
}

/**
 * Unmount the favorites view
 */
export function unmount() {
  // Cleanup if needed
}

export default { mount, unmount, render };
