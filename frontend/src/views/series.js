/**
 * Series View Component
 * Shows series info and manga entries
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { renderHeader } from '../components/header.js';
import { showToast } from '../utils/toast.js';
import { icon, placeholder, coverImg } from '../icons.js';

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
      ? coverImg(coverUrl, displayName, { kind: 'series' })
      : placeholder('series')
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
              <button class="btn btn-secondary" id="find-more-btn" title="Search the site of this series' manga for more titles and add them here">${icon('search')} Find more like this</button>
              <button class="btn btn-secondary" id="edit-series-btn">${icon('pencil')} Edit</button>
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

// ==================== FIND MORE LIKE THIS ====================
// Search the site(s) this series' manga come from for more titles, and add
// a result straight into the series - a new manga is scraped and filed
// here with the tags and check settings of the first entry; a title already
// in the library is just linked.

const FIND_MODAL_ID = 'find-more-modal';

function escText(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function closeFindMoreModal() {
  document.getElementById(FIND_MODAL_ID)?.remove();
  document.removeEventListener('keydown', onFindKey);
}

function onFindKey(e) {
  if (e.key === 'Escape') closeFindMoreModal();
}

async function openFindMoreModal(series) {
  closeFindMoreModal();
  const entries = series.entries || [];
  const sites = [...new Set(entries.map(e => e.website).filter(w => w && w !== 'Local'))];
  const seed = entries[0] || null;
  const modal = document.createElement('div');
  modal.id = FIND_MODAL_ID;
  modal.className = 'modal open torrent-modal find-more-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>${icon('search')} Find more for ${escText(series.alias || series.title)}</h2>
        <button class="modal-close" data-act="close" title="Close">×</button>
      </div>
      <div class="torrent-body">
        <form class="torrent-search-form" id="find-more-form">
          <select id="find-more-site" title="Site to search">
            ${sites.map(s => `<option value="${escText(s)}">${escText(s)}</option>`).join('')}
            <option value="all">All sites</option>
          </select>
          <input type="text" id="find-more-query" value="${escText(series.alias || series.title)}" placeholder="Title to search for" autocomplete="off">
          <button type="submit" class="btn btn-primary">Search</button>
        </form>
        <div class="torrent-hint">Results added here are scraped and filed in this series${seed ? `, with the tags and check settings of <strong>${escText(seed.alias || seed.title)}</strong>` : ''}. Titles already in your library are linked as they are.</div>
        <div id="find-more-results"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.addEventListener('keydown', onFindKey);
  modal.querySelector('.modal-overlay').addEventListener('click', closeFindMoreModal);
  modal.querySelector('[data-act="close"]').addEventListener('click', closeFindMoreModal);

  const results = modal.querySelector('#find-more-results');
  const inSeries = new Set(entries.map(e => e.bookmark_id));
  // Library titles by URL, to link instead of re-scrape
  let libraryByUrl = new Map();
  try {
    const lib = await api.getBookmarks();
    const list = Array.isArray(lib) ? lib : (lib.bookmarks || []);
    libraryByUrl = new Map(list.map(b => [b.url, b]));
  } catch (e) { /* new adds only */ }

  const renderResults = (list) => {
    if (!list.length) {
      results.innerHTML = '<div class="torrent-hint">No results. Try a shorter title.</div>';
      return;
    }
    results.innerHTML = `<div class="library-grid find-more-grid">${list.map((r, i) => {
      const cover = r.cover ? (r.cover.startsWith('/covers/') ? r.cover : `/api/scrapers/proxy-cover?url=${encodeURIComponent(r.cover)}`) : '';
      const existing = libraryByUrl.get(r.url);
      const already = existing && inSeries.has(existing.id);
      return `
        <div class="manga-card scraper-result-card" data-index="${i}">
          <div class="manga-card-cover">
            ${cover ? coverImg(cover, 'Cover', { kind: 'series', self: true }) : placeholder('series')}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${escText(r.website)}</span>
              ${r.chapterCount ? `<span class="badge badge-chapters">${r.chapterCount} ch</span>` : ''}
            </div>
          </div>
          <div class="manga-card-title" title="${escText(r.title)}">${escText(r.title)}</div>
          <div class="find-more-actions">
            ${already
              ? '<span class="torrent-hint">Already in this series</span>'
              : `<button class="btn btn-primary find-more-add" data-index="${i}" style="width: 100%; font-size: 0.8rem;">${existing ? 'Add to series' : '+ Add and scrape'}</button>`}
          </div>
        </div>`;
    }).join('')}</div>`;
  };

  let current = [];
  const search = async () => {
    const q = modal.querySelector('#find-more-query').value.trim();
    const site = modal.querySelector('#find-more-site').value || 'all';
    if (!q) return;
    results.innerHTML = `<div class="torrent-hint">${icon('loader', { spin: true })} Searching ${escText(site === 'all' ? 'every site' : site)}…</div>`;
    try {
      const data = await api.get(`/scrapers/search?q=${encodeURIComponent(q)}&scraper=${encodeURIComponent(site)}`);
      current = data.results || [];
      renderResults(current);
    } catch (e) {
      results.innerHTML = `<div class="torrent-hint error">${escText(e.message)}</div>`;
    }
  };
  modal.querySelector('#find-more-form').addEventListener('submit', (e) => { e.preventDefault(); search(); });

  // Wait for a queued scrape to finish, then refresh the series behind the dialog
  const followJob = async (jobId, btn) => {
    for (let i = 0; i < 120; i++) {
      await new Promise(r => setTimeout(r, 3000));
      if (!document.getElementById(FIND_MODAL_ID)) return;
      let job = null;
      try {
        const history = await api.getQueueHistory(30);
        job = history.find(j => j.id === jobId) || null;
      } catch (e) { /* try again */ }
      if (!job) continue;
      if (job.status === 'completed') {
        btn.textContent = 'Added';
        showToast('Added to the series', 'success');
        await loadData(series.id);
        document.getElementById('app').innerHTML = render();
        setupListeners();
        return;
      }
      if (job.status === 'failed') {
        btn.disabled = false;
        btn.textContent = 'Retry';
        showToast(`Adding failed: ${job.error || 'unknown error'}`, 'error');
        return;
      }
      btn.textContent = job.status === 'waiting' ? 'Waiting for site…' : 'Scraping…';
    }
  };

  results.addEventListener('click', async (e) => {
    const btn = e.target.closest('.find-more-add');
    if (!btn) return;
    const r = current[parseInt(btn.dataset.index, 10)];
    if (!r) return;
    btn.disabled = true;
    const existing = libraryByUrl.get(r.url);
    try {
      if (existing) {
        await api.post(`/series/${series.id}/entries`, { bookmarkId: existing.id });
        btn.textContent = 'Added';
        inSeries.add(existing.id);
        showToast('Added to the series', 'success');
        await loadData(series.id);
        document.getElementById('app').innerHTML = render();
        setupListeners();
      } else {
        btn.textContent = 'Queued…';
        const data = await api.addBookmarkToSeries(r.url, { seriesId: series.id, copyFromBookmarkId: seed?.bookmark_id || null });
        showToast('Queued: it is scraped and then filed in this series', 'info');
        followJob(data.jobId, btn);
      }
    } catch (err) {
      btn.disabled = false;
      showToast(`Failed: ${err.message}`, 'error');
    }
  });

  search();
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
      ? coverImg(coverUrl, displayName, { kind: 'book' })
      : placeholder('book')
    }
        <div class="series-entry-badges">
          <span class="badge badge-chapters">${entry.chapter_count || 0} ch</span>
          ${entry.downloadedChapters?.length > 0
      ? `<span class="badge badge-downloaded">${entry.downloadedChapters.length}</span>`
      : ''
    }
        </div>
        <button class="series-set-cover-btn" data-action="set-cover" data-id="${entry.bookmark_id}" data-entryid="${entry.id}" title="Use as series cover">${icon('image', { title: 'Use as series cover' })}</button>
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

  document.getElementById('find-more-btn')?.addEventListener('click', () => openFindMoreModal(series));

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
