/**
 * Series View Component
 * Shows series info and manga entries
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { renderHeader } from '../components/header.js';
import { showToast } from '../utils/toast.js';

// View state
let state = {
  series: null,
  loading: true
};

/**
 * Render the series view
 */
export function render() {
  if (state.loading) {
    return `
      ${renderHeader('series')}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;
  }

  const series = state.series;
  if (!series) {
    return `
      ${renderHeader('series')}
      <div class="container">
        <div class="empty-state">
          <h2>Series not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;
  }

  const displayName = series.alias || series.title;
  const entries = series.entries || [];
  const totalChapters = entries.reduce((sum, e) => sum + (e.chapter_count || 0), 0);

  // Series cover - use first entry's cover since getById doesn't populate coverBookmarkId
  let coverUrl = null;
  if (entries.length > 0) {
    const first = entries[0];
    if (first.local_cover && first.bookmark_id) {
      coverUrl = `/api/public/covers/${first.bookmark_id}/${encodeURIComponent(first.local_cover.split(/[/\\]/).pop())}`;
    } else if (first.localCover && first.bookmark_id) {
      coverUrl = `/api/public/covers/${first.bookmark_id}/${encodeURIComponent(first.localCover.split(/[/\\]/).pop())}`;
    } else if (first.cover) {
      coverUrl = first.cover;
    }
  }

  return `
    ${renderHeader('series')}
    <div class="container">
      <div class="series-detail">
        <div class="series-detail-header">
          <div class="series-detail-cover">
            ${coverUrl
      ? `<img src="${coverUrl}" alt="${displayName}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`
      : `<div class="placeholder">📖</div>`
    }
          </div>
          <div class="series-detail-info">
            <h1>${displayName}</h1>
            <div class="series-detail-meta">
              <span class="meta-item">${entries.length} Entries</span>
              <span class="meta-item">${totalChapters} Total Chapters</span>
            </div>
            <div class="series-detail-actions">
              <button class="btn btn-secondary" id="add-entry-btn">+ Add Entry</button>
              <button class="btn btn-secondary" id="edit-series-btn">✏️ Edit</button>
              <button class="btn btn-secondary" id="back-library-btn">← Library</button>
            </div>
          </div>
        </div>
        
        <div class="series-entries-section">
          <h2>Entries</h2>
          <div class="series-entries-grid">
            ${entries.map((entry, idx) => renderSeriesEntry(entry, idx, entries.length)).join('')}
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Entry Modal -->
    <div class="modal" id="add-entry-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add Manga to Series</h2>
          <button class="btn-icon" onclick="document.getElementById('add-entry-modal').classList.remove('open')">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="available-bookmarks-input">Select Manga:</label>
            <input list="available-bookmarks-list" id="available-bookmarks-input" class="form-control" style="width: 100%; margin-bottom: 1rem;" placeholder="Loading..." autocomplete="off">
            <datalist id="available-bookmarks-list"></datalist>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="document.getElementById('add-entry-modal').classList.remove('open')">Cancel</button>
          <button class="btn btn-primary" id="confirm-add-entry-btn">Add to Series</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render a series entry card
 */
function renderSeriesEntry(entry, index, totalEntries) {
  const displayName = entry.alias || entry.title;

  // Try multiple cover sources
  let coverUrl = null;
  if (entry.local_cover) {
    coverUrl = `/api/public/covers/${entry.bookmark_id}/${encodeURIComponent(entry.local_cover.split(/[/\\]/).pop())}`;
  } else if (entry.localCover) {
    coverUrl = `/api/public/covers/${entry.bookmark_id}/${encodeURIComponent(entry.localCover.split(/[/\\]/).pop())}`;
  } else if (entry.cover) {
    coverUrl = entry.cover;
  }

  return `
    <div class="series-entry-card" data-id="${entry.bookmark_id}" data-order="${entry.order_index}">
      <div class="series-entry-order-controls">
        <span class="order-number">${index + 1}</span>
        <div class="order-buttons">
          <button class="btn-icon small" data-action="move-up" data-id="${entry.bookmark_id}" ${index === 0 ? 'disabled' : ''}>↑</button>
          <button class="btn-icon small" data-action="move-down" data-id="${entry.bookmark_id}" ${index === totalEntries - 1 ? 'disabled' : ''}>↓</button>
        </div>
      </div>
      <div class="series-entry-cover">
        ${coverUrl
      ? `<img src="${coverUrl}" alt="${displayName}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`
      : `<div class="placeholder">📚</div>`
    }
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${entry.chapter_count || 0} ch</span>
          ${entry.downloadedChapters?.length > 0
      ? `<span class="badge badge-downloaded">${entry.downloadedChapters.length}</span>`
      : ''
    }
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${entry.bookmark_id}" data-entryid="${entry.id}" title="Use as series cover">🖼️</button>
      </div>
      <div class="series-entry-info">
        <div class="series-entry-title">${displayName}</div>
      </div>
    </div>
  `;
}

/**
 * Setup event listeners
 */
export function setupListeners() {
  const app = document.getElementById('app');
  const series = state.series;

  // Back button
  document.getElementById('back-btn')?.addEventListener('click', () => router.go('/'));
  document.getElementById('back-library-btn')?.addEventListener('click', () => router.go('/'));

  // Entry card clicks (only on the card itself, not buttons)
  app.querySelectorAll('.series-entry-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't navigate if clicking buttons
      if (e.target.closest('[data-action]')) return;

      const id = card.dataset.id;
      router.go(`/manga/${id}`);
    });
  });

  // Action buttons (move up, move down, set cover)
  app.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const bookmarkId = btn.dataset.id;

      switch (action) {
        case 'move-up':
          await reorderEntry(bookmarkId, -1);
          break;
        case 'move-down':
          await reorderEntry(bookmarkId, 1);
          break;
        case 'set-cover':
          const entryId = btn.dataset.entryid;
          await setSeriesCover(entryId);
          break;
      }
    });
  });

  // Add entry button
  const addEntryBtn = document.getElementById('add-entry-btn');
  const addEntryModal = document.getElementById('add-entry-modal');
  const availableBookmarksInput = document.getElementById('available-bookmarks-input');
  const availableBookmarksList = document.getElementById('available-bookmarks-list');
  const confirmAddEntryBtn = document.getElementById('confirm-add-entry-btn');

  let currentAvailable = [];

  if (addEntryBtn && addEntryModal) {
    addEntryBtn.addEventListener('click', async () => {
      try {
        addEntryBtn.disabled = true;
        if (availableBookmarksInput) {
          availableBookmarksInput.value = '';
          availableBookmarksInput.placeholder = 'Loading...';
          availableBookmarksInput.disabled = true;
        }
        if (availableBookmarksList) {
          availableBookmarksList.innerHTML = '';
        }
        addEntryModal.classList.add('open');

        const available = await api.getAvailableBookmarksForSeries();
        currentAvailable = available;

        if (available.length === 0) {
          if (availableBookmarksInput) {
            availableBookmarksInput.placeholder = 'No available manga found';
          }
          confirmAddEntryBtn.disabled = true;
        } else {
          if (availableBookmarksInput) {
            availableBookmarksInput.placeholder = 'Select or type a manga...';
            availableBookmarksInput.disabled = false;
          }
          if (availableBookmarksList) {
            availableBookmarksList.innerHTML = available.map(b => {
              const displayName = b.alias || b.title || '';
              return `<option value="${displayName.replace(/"/g, '&quot;')}"></option>`;
            }).join('');
          }
          confirmAddEntryBtn.disabled = false;
        }
      } catch (err) {
        showToast('Failed to load available manga', 'error');
        addEntryModal.classList.remove('open');
      } finally {
        addEntryBtn.disabled = false;
      }
    });

    confirmAddEntryBtn.addEventListener('click', async () => {
      const selectedName = availableBookmarksInput ? availableBookmarksInput.value : '';
      const selectedManga = currentAvailable.find(b => (b.alias || b.title || '') === selectedName);

      if (!selectedManga) {
        showToast('Please select a valid manga from the list', 'warning');
        return;
      }

      const bookmarkId = selectedManga.id;

      try {
        confirmAddEntryBtn.disabled = true;
        confirmAddEntryBtn.textContent = 'Adding...';

        await api.addSeriesEntry(series.id, bookmarkId);
        showToast('Manga added to series', 'success');

        addEntryModal.classList.remove('open');
        await loadData(series.id);
        app.innerHTML = render();
        setupListeners();
      } catch (err) {
        showToast('Failed to add manga: ' + err.message, 'error');
      } finally {
        confirmAddEntryBtn.disabled = false;
        confirmAddEntryBtn.textContent = 'Add to Series';
      }
    });
  }

  // Edit series button
  document.getElementById('edit-series-btn')?.addEventListener('click', () => {
    showToast('Edit series coming soon', 'info');
  });
}

/**
 * Reorder an entry in the series
 */
async function reorderEntry(bookmarkId, direction) {
  const series = state.series;
  if (!series) return;

  const entries = series.entries || [];
  const currentIdx = entries.findIndex(e => e.bookmark_id === bookmarkId);
  if (currentIdx === -1) return;

  const newIdx = currentIdx + direction;
  if (newIdx < 0 || newIdx >= entries.length) return;

  // Build new order array
  const newOrder = entries.map(e => e.bookmark_id);
  [newOrder[currentIdx], newOrder[newIdx]] = [newOrder[newIdx], newOrder[currentIdx]];

  try {
    await api.post(`/series/${series.id}/reorder`, { order: newOrder });
    showToast('Order updated', 'success');

    // Reload
    await loadData(series.id);
    const app = document.getElementById('app');
    app.innerHTML = render();
    setupListeners();
  } catch (error) {
    showToast('Failed to reorder: ' + error.message, 'error');
  }
}

/**
 * Set series cover from an entry
 */
async function setSeriesCover(entryId) {
  const series = state.series;
  if (!series) return;

  try {
    await api.setSeriesCover(series.id, entryId);
    showToast('Series cover updated', 'success');

    // Reload
    await loadData(series.id);
    const app = document.getElementById('app');
    app.innerHTML = render();
    setupListeners();
  } catch (error) {
    showToast('Failed to set cover: ' + error.message, 'error');
  }
}

/**
 * Load series data
 */
async function loadData(seriesId) {
  try {
    const series = await api.get(`/series/${seriesId}`);
    state.series = series;
    state.loading = false;
  } catch (error) {
    showToast('Failed to load series', 'error');
    state.loading = false;
  }
}

/**
 * Mount the view
 */
export async function mount(params = []) {
  const [seriesId] = params;

  if (!seriesId) {
    router.go('/');
    return;
  }

  const app = document.getElementById('app');

  // Show loading
  state.loading = true;
  state.series = null;
  app.innerHTML = render();

  await loadData(seriesId);

  app.innerHTML = render();
  setupListeners();
}

/**
 * Unmount cleanup
 */
export function unmount() {
  state.series = null;
  state.loading = true;
}

export default { mount, unmount, render };
