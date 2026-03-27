/**
 * Manga Detail View Component
 * Shows manga info, chapters, and actions
 */

import { api } from '../api.js';
import { store } from '../store.js';
import { router } from '../router.js';
import { socket } from '../socket.js';
import { renderHeader, setupHeaderListeners } from '../components/header.js';
import { showToast } from '../utils/toast.js';
import { continueReading } from './reader.js';
import { offlineManager } from '../offline-manager.js';

const CHAPTERS_PER_PAGE = 50;

// View state
let state = {
  manga: null,
  categories: [],
  currentPage: 0,
  filter: 'all',
  loading: true,
  selectionMode: false,
  selected: new Set(),
  activeVolume: null,
  activeVolumeId: null,
  cbzFiles: [],
  manageChapters: false,
  offlineChapters: new Set(),
  isAutoOffline: false
};

// ==================== HELPERS ====================

function timeUntil(dateStr) {
  if (!dateStr) return 'Not scheduled';
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return 'Running soon...';
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return `in ${hours}h ${remMins}m`;
}

/**
 * Render auto-check / schedule button (single button)
 */
function renderAutoCheckToggle(manga) {
  const isEnabled = manga.autoCheck === true;

  if (!isEnabled) {
    return `<button class="btn btn-secondary" id="schedule-btn">⏰ Schedule</button>`;
  }

  const scheduleLabel = manga.checkSchedule === 'weekly'
    ? `${(manga.checkDay || 'monday').charAt(0).toUpperCase() + (manga.checkDay || 'monday').slice(1)} ${manga.checkTime || '06:00'}`
    : manga.checkSchedule === 'daily'
      ? `Daily ${manga.checkTime || '06:00'}`
      : 'Every 6h';

  return `<button class="btn btn-primary" id="schedule-btn">⏰ ${scheduleLabel}</button>`;
}

/**
 * Render schedule modal
 */
function renderScheduleModal(manga) {
  const isEnabled = manga.autoCheck === true;
  const schedule = manga.checkSchedule || 'daily';
  const day = manga.checkDay || 'monday';
  const time = manga.checkTime || '06:00';
  const autoDownload = manga.autoDownload || false;

  return `
    <div class="modal" id="schedule-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>⏰ Auto-Check Schedule</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="schedule-type">Frequency</label>
            <select id="schedule-type">
              <option value="daily" ${schedule === 'daily' ? 'selected' : ''}>Daily</option>
              <option value="weekly" ${schedule === 'weekly' ? 'selected' : ''}>Weekly</option>
            </select>
          </div>
          <div class="form-group" id="schedule-day-group" style="${schedule === 'weekly' ? '' : 'display:none'}">
            <label for="schedule-day">Day of Week</label>
            <select id="schedule-day">
              <option value="monday" ${day === 'monday' ? 'selected' : ''}>Monday</option>
              <option value="tuesday" ${day === 'tuesday' ? 'selected' : ''}>Tuesday</option>
              <option value="wednesday" ${day === 'wednesday' ? 'selected' : ''}>Wednesday</option>
              <option value="thursday" ${day === 'thursday' ? 'selected' : ''}>Thursday</option>
              <option value="friday" ${day === 'friday' ? 'selected' : ''}>Friday</option>
              <option value="saturday" ${day === 'saturday' ? 'selected' : ''}>Saturday</option>
              <option value="sunday" ${day === 'sunday' ? 'selected' : ''}>Sunday</option>
            </select>
          </div>
          <div class="form-group">
            <label for="schedule-time">Time</label>
            <input type="time" id="schedule-time" value="${time}">
          </div>
          <div class="form-group">
            <label class="toggle-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="auto-download-toggle" ${autoDownload ? 'checked' : ''} style="width: 18px; height: 18px;">
              <span>Auto-download new chapters</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          ${isEnabled ? `<button class="btn btn-danger" id="disable-schedule-btn" style="margin-right:auto;">Disable</button>` : ''}
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="save-schedule-btn">${isEnabled ? 'Save' : 'Enable & Save'}</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the manga detail view
 */
export function render() {
  if (state.loading) {
    return `
      ${renderHeader()}
      <div class="container">
        <div class="loading-center"><div class="loading-spinner"></div></div>
      </div>
    `;
  }

  const manga = state.manga;
  if (!manga) {
    return `
      ${renderHeader()}
      <div class="container">
        <div class="empty-state">
          <h2>Manga not found</h2>
          <button class="btn btn-primary" id="back-btn">← Back to Library</button>
        </div>
      </div>
    `;
  }

  const displayName = manga.alias || manga.title;
  const chapters = manga.chapters || [];
  const downloadedChapters = new Set(manga.downloadedChapters || []);
  const readChapters = new Set(manga.readChapters || []);
  const excludedSet = new Set(manga.excludedChapters || []);
  const deletedUrls = new Set(manga.deletedChapterUrls || []);
  const volumes = manga.volumes || [];

  // Get all chapter numbers that are in volumes
  const volumeChapterNumbers = new Set();
  volumes.forEach(vol => {
    (vol.chapters || []).forEach(num => volumeChapterNumbers.add(num));
  });

  // Filter visible chapters
  let visibleChapters;
  if (state.filter === 'hidden') {
    // Show chapters that are excluded OR have hidden versions
    visibleChapters = chapters.filter(c =>
      excludedSet.has(c.number) || deletedUrls.has(c.url)
    );
  } else {
    // Normal behavior - exclude hidden, deleted
    visibleChapters = chapters.filter(c =>
      !excludedSet.has(c.number) && !deletedUrls.has(c.url)
    );
  }

  // Loose chapters = visible but NOT in any volume
  const looseChapters = visibleChapters.filter(c => !volumeChapterNumbers.has(c.number));

  // Volume Mode Logic
  let targetChapters = [];
  if (state.activeVolume) {
    // In volume mode, show only chapters for this volume
    const volumeChapters = new Set(state.activeVolume.chapters || []);
    targetChapters = visibleChapters.filter(c => volumeChapters.has(c.number));
  } else {
    // In manga mode, show loose chapters (not in any volume)
    targetChapters = looseChapters;
  }

  // Group by chapter number
  const chapterGroups = new Map();
  targetChapters.forEach(ch => {
    if (!chapterGroups.has(ch.number)) {
      chapterGroups.set(ch.number, []);
    }
    chapterGroups.get(ch.number).push(ch);
  });

  // Sort and filter
  let sortedGroups = Array.from(chapterGroups.entries()).sort((a, b) => a[0] - b[0]);

  if (state.filter === 'downloaded') {
    sortedGroups = sortedGroups.filter(([num]) => downloadedChapters.has(num));
  } else if (state.filter === 'not-downloaded') {
    sortedGroups = sortedGroups.filter(([num]) => !downloadedChapters.has(num));
  } else if (state.filter === 'main') {
    sortedGroups = sortedGroups.filter(([num]) => Number.isInteger(num));
  } else if (state.filter === 'extra') {
    sortedGroups = sortedGroups.filter(([num]) => !Number.isInteger(num));
  }

  // Pagination - clamp currentPage to valid range
  // Reset pagination when switching modes (handled in mount/listeners) but safe guard here
  const totalPages = Math.max(1, Math.ceil(sortedGroups.length / CHAPTERS_PER_PAGE));

  // Ensure currentPage is within valid bounds
  if (state.currentPage >= totalPages) {
    state.currentPage = Math.max(0, totalPages - 1);
  }

  const startIdx = state.currentPage * CHAPTERS_PER_PAGE;
  const paginatedGroups = sortedGroups.slice(startIdx, startIdx + CHAPTERS_PER_PAGE);

  // Display in descending order
  const displayGroups = [...paginatedGroups].reverse();

  // Stats
  const totalCount = chapterGroups.size;
  const downloadedCount = [...chapterGroups.keys()].filter(n => downloadedChapters.has(n)).length;
  const readCount = readChapters.size;

  // Render Header (Manga or Volume)
  let headerHtml = '';
  if (state.activeVolume) {
    const vol = state.activeVolume;
    // Volume Cover
    let volCoverUrl = null;
    if (vol.local_cover) { // Note: volume object usually has local_cover (underscore) from DB
      volCoverUrl = `/api/public/covers/${manga.id}/${encodeURIComponent(vol.local_cover.split(/[/\\]/).pop())}`;
    } else if (vol.cover) {
      volCoverUrl = vol.cover;
    }

    headerHtml = `
      ${renderHeader()}
      <div class="container">
        <div class="manga-detail">
          <div class="manga-detail-header">
            <div class="manga-detail-cover">
              ${volCoverUrl
        ? `<img src="${volCoverUrl}" alt="${vol.name}">`
        : `<div class="placeholder">📚</div>`
      }
            </div>
            <div class="manga-detail-info">
              <div class="meta-item" style="margin-bottom: 8px;">
                <a href="#/manga/${manga.id}" class="text-muted" style="text-decoration:none;">← ${displayName}</a>
              </div>
              <h1>${vol.name}</h1>
              <div class="manga-detail-meta">
                <span class="meta-item">${totalCount} Chapters</span>
                ${downloadedCount > 0 ? `<span class="meta-item downloaded">${downloadedCount} Downloaded</span>` : ''}
              </div>
               <div class="manga-detail-actions">
                 <button class="btn btn-secondary" onclick="window.location.hash='#/manga/${manga.id}'">Back to Manga</button>
                 <button class="btn btn-secondary" id="manage-chapters-btn">${state.manageChapters ? 'Done Managing' : '➕ Add Chapters'}</button>
                 <button class="btn btn-secondary" id="edit-vol-btn" data-vol-id="${vol.id}">✏️ Edit Volume</button>
               </div>
            </div>
          </div>
      `;
  } else {
    // Standard Manga Header
    const coverUrl = manga.localCover
      ? `/api/public/covers/${manga.id}/${encodeURIComponent(manga.localCover.split(/[/\\]/).pop())}`
      : manga.cover;

    headerHtml = `
        ${renderHeader()}
        <div class="container">
          <div class="manga-detail">
            <div class="manga-detail-header">
              <div class="manga-detail-cover">
                ${coverUrl
        ? `<img src="${coverUrl}" alt="${displayName}">`
        : `<div class="placeholder">📚</div>`
      }
              </div>
              <div class="manga-detail-info">
                <h1>${displayName}</h1>
                <div class="manga-detail-meta">
                  <span class="meta-item accent" id="source-label" style="cursor: pointer;" title="Click to change source">${manga.website || 'Local'}</span>
                  <span class="meta-item">${manga.chapters?.length || 0} Total Chapters</span>
                  ${downloadedChapters.size > 0 ? `<span class="meta-item downloaded">${downloadedChapters.size} Downloaded</span>` : ''}
                  ${readChapters.size > 0 ? `<span class="meta-item">${readChapters.size} Read</span>` : ''}
                </div>
                ${((manga.artists || []).length > 0 || (manga.categories || []).length > 0) ? `
                <div class="manga-artists" style="margin-top: 8px;">
                  ${(manga.artists || []).length > 0 ? `
                    <span class="meta-label">Author:</span>
                    ${manga.artists.map(artist => `<a href="#//" class="artist-link" data-artist="${artist}">${artist}</a>`).join(', ')}
                  ` : ''}
                  ${(manga.categories || []).length > 0 ? `
                    <span class="meta-label" style="margin-left: ${(manga.artists || []).length > 0 ? '16px' : '0'};">Tags:</span>
                    ${manga.categories.map(cat => `<span class="tag">${cat}</span>`).join('')}
                  ` : ''}
                </div>
                ` : ''}
                <div class="manga-detail-actions">
                  <button class="btn btn-primary" id="continue-btn">
                    ▶ ${manga.lastReadChapter ? 'Continue' : 'Start'} Reading
                  </button>
              <button class="btn btn-secondary" id="download-all-btn">
                ↓ Download All
              </button>
              <button class="btn btn-secondary" id="refresh-btn">🔄 Refresh</button>
              ${manga.website !== 'Local' ? `<button class="btn btn-secondary" id="quick-check-btn">⚡ Quick Check</button>` : ''}
              ${manga.website === 'Local' ? `<button class="btn btn-secondary" id="scan-folder-btn">📁 Scan Folder</button>` : ''}
              <button class="btn btn-secondary ${state.isAutoOffline ? 'btn-active' : ''}" id="auto-offline-btn" title="Auto-save new chapters offline for reading without internet">
                ${state.isAutoOffline ? '📴 Auto-Offline ✓' : '📴 Auto-Offline'}
              </button>
              <button class="btn btn-secondary" id="edit-btn">✏️ Edit</button>
              ${(manga.volumes || []).length === 0 ? '<button class="btn btn-secondary" id="add-volume-btn">+ Add Volume</button>' : ''}
              ${renderAutoCheckToggle(manga)}
            </div>
            ${manga.description ? `<p class="manga-description">${manga.description}</p>` : ''}
            ${state.cbzFiles.length > 0 ? `
            <div class="cbz-section" style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0;">📦 CBZ Files (${state.cbzFiles.length})</h3>
              <div class="cbz-list">
                ${state.cbzFiles.map(cbz => `
                  <div class="cbz-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--bg-primary); border-radius: 4px; margin-bottom: 8px;">
                    <div>
                      <div style="font-weight: bold;">${cbz.name}</div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${cbz.chapterNumber ? `Chapter ${cbz.chapterNumber}` : 'Unknown chapter'}
                        ${cbz.isExtracted ? ' | ✅ Extracted' : ''}
                      </div>
                    </div>
                    <button class="btn btn-small ${cbz.isExtracted ? 'btn-secondary' : 'btn-primary'}" 
                            data-cbz-path="${encodeURIComponent(cbz.path)}" 
                            data-cbz-chapter="${cbz.chapterNumber || 1}"
                            data-cbz-extracted="${cbz.isExtracted}">
                      ${cbz.isExtracted ? 'Re-Extract' : 'Extract'}
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      `;
  }

  return `
    ${headerHtml}
        
        ${state.activeVolume ? (state.manageChapters ? renderAvailableChapters(manga, looseChapters) : '') : renderVolumesSection(manga, downloadedChapters)}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${state.filter === 'all' ? 'active' : ''}" data-filter="all">
                All (${chapterGroups.size})
              </button>
              <button class="filter-btn ${state.filter === 'downloaded' ? 'active' : ''}" data-filter="downloaded">
                Downloaded (${downloadedCount})
              </button>
              <button class="filter-btn ${state.filter === 'not-downloaded' ? 'active' : ''}" data-filter="not-downloaded">
                Not DL'd
              </button>
              <button class="filter-btn ${state.filter === 'hidden' ? 'active' : ''}" data-filter="hidden">
                Hidden
              </button>
            </div>
          </div>
          
          ${totalPages > 1 ? renderPagination(totalPages) : ''}
          
          <div class="chapter-list">
            ${displayGroups.map(([num, versions]) =>
    renderChapterItem(num, versions, downloadedChapters, readChapters, manga)
  ).join('')}
          </div>
          
          ${totalPages > 1 ? renderPagination(totalPages) : ''}
        </div>
      ${renderModals()}
    </div>
  `;
}

function renderDeleteModal() {
  const manga = state.manga;
  if (!manga) return '';
  const displayName = manga.alias || manga.title;
  return `
    <div class="modal" id="delete-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 420px;">
        <div class="modal-header">
          <h2>🗑️ Delete Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Are you sure you want to delete <strong>${displayName}</strong> from your library?</p>
          <p class="text-muted" style="font-size: 0.85em;">This cannot be undone.</p>
          <div class="form-group" style="margin-top: 12px;">
            <label class="toggle-label" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="delete-files-toggle" style="width: 18px; height: 18px;">
              <span>Also delete downloaded files from disk</span>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-danger" id="confirm-delete-manga-btn">Delete</button>
        </div>
      </div>
    </div>
  `;
}

function renderMigrateSourceModal() {
  const manga = state.manga;
  if (!manga) return '';
  return `
    <div class="modal" id="migrate-source-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 700px;">
        <div class="modal-header">
          <h2>🔄 Change Source</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p>Current source: <strong>${manga.website || 'Local'}</strong></p>
          <p class="text-muted" style="font-size: 0.85em; margin-bottom: 12px;">Search for the manga on a different source, or paste a URL directly.</p>
          
          <!-- Search Section -->
          <div class="form-group">
            <label>Search for Manga</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="migrate-search-input" placeholder="Search manga title..." value="${manga.alias || manga.title}" style="flex: 1;">
              <select id="migrate-search-scraper" style="width: 150px;">
                <option value="comix.to">comix.to</option>
              </select>
              <button class="btn btn-secondary" id="migrate-search-btn">🔍 Search</button>
            </div>
          </div>
          
          <!-- Search Results -->
          <div id="migrate-search-results" style="max-height: 300px; overflow-y: auto; margin-bottom: 12px; display: none;">
            <div id="migrate-results-grid" class="library-grid" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 8px;"></div>
          </div>
          <div id="migrate-search-loading" style="display: none; text-align: center; padding: 20px;">
            <div class="loading-spinner"></div>
            <p class="text-muted" style="margin-top: 8px;">Searching...</p>
          </div>
          
          <hr style="border-color: var(--border-color); margin: 12px 0;">
          
          <!-- URL Input Section -->
          <div class="form-group">
            <label for="migrate-url-input">Manga URL</label>
            <input type="url" id="migrate-url-input" placeholder="https://..." style="width: 100%;">
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Current URL: <code style="word-break:break-all;">${manga.url}</code></p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-migrate-btn">Migrate Source</button>
        </div>
      </div>
    </div>
  `;
}

function renderModals() {
  const manga = state.manga;
  return `
    ${manga ? renderScheduleModal(manga) : ''}
    ${renderAddVolumeModal()}
    ${renderDeleteModal()}
    ${renderMigrateSourceModal()}

    <!-- Edit Manga Modal -->
    <div class="modal" id="edit-manga-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>✏️ Edit Manga</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <datalist id="artist-list"></datalist>
          <datalist id="category-list"></datalist>
          <div class="form-group">
            <label for="edit-alias-input">Display Name (Alias)</label>
            <input type="text" id="edit-alias-input" placeholder="Custom display name..." value="${manga?.alias || ''}">
          </div>
          <div class="form-group">
            <label for="edit-artist-input">Author/Artist</label>
            <input type="text" id="edit-artist-input" list="artist-list" placeholder="Author or artist name..." value="${manga?.artists?.join(', ') || ''}">
          </div>
          <div class="form-group">
            <label for="edit-categories-input">Tags/Categories (comma separated)</label>
            <input type="text" id="edit-categories-input" list="category-list" placeholder="tag1, tag2, tag3..." value="${manga?.categories?.join(', ') || ''}">
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div id="cover-preview" style="width: 100px; height: 150px; background: var(--bg-secondary); border-radius: 4px; margin-bottom: 8px; overflow: hidden;">
              ${manga?.localCover ? `<img src="/api/public/covers/${manga.id}/${encodeURIComponent(manga.localCover.split(/[/\\]/).pop())}" style="width: 100%; height: 100%; object-fit: cover;">` : ''}
            </div>
            <button type="button" class="btn btn-small btn-secondary" id="change-cover-btn">Change Cover</button>
          </div>
          <p class="text-muted" style="font-size: 0.8em;">Original title: ${manga?.title || ''}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" id="delete-manga-btn" style="margin-right:auto;">🗑️ Delete</button>
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="save-manga-btn">Save</button>
        </div>
      </div>
    </div>

    <!-- Download All Modal -->
    <div class="modal" id="download-all-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Download Options</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <p style="margin-bottom: 15px;">How would you like to download missing chapters?</p>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px;">
              <input type="radio" name="download-version-mode" value="single" checked style="width: 16px; height: 16px;">
              <div>
                <strong style="display: block;">1 Version Per Chapter</strong>
                <span class="text-muted" style="font-size: 0.85em;">Only downloads the primary version for each chapter.</span>
              </div>
            </label>
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 10px; border: 1px solid var(--border-color); border-radius: 4px;">
              <input type="radio" name="download-version-mode" value="all" style="width: 16px; height: 16px;">
              <div>
                <strong style="display: block;">All Versions</strong>
                <span class="text-muted" style="font-size: 0.85em;">Downloads every available translation/version for missing chapters.</span>
              </div>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="confirm-download-all-btn">Download</button>
        </div>
      </div>
    </div>

    <!-- Edit Volume Modal -->
    <div class="modal" id="edit-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Edit Volume</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="volume-name-input">Volume Name</label>
            <input type="text" id="volume-name-input" placeholder="e.g. Volume 1">
          </div>
          <div class="form-group">
            <label>Cover Image</label>
            <div style="display:flex; gap:10px;">
                <button class="btn btn-secondary" id="vol-cover-upload-btn">Upload</button>
                <button class="btn btn-primary" id="vol-cover-selector-btn">Select from Chapter</button>
            </div>
             <p class="text-muted" style="font-size:0.8em; margin-top:5px;">
                You can also set the main series cover using the "Select from Chapter" tool.
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-danger" id="delete-volume-btn" style="margin-right:auto;">Delete Volume</button>
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="save-volume-btn">Save Changes</button>
        </div>
      </div>
    </div>

    <!-- Cover Selector Modal -->
    <div class="modal" id="cover-selector-modal" style="z-index: 210;">
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header">
          <h2>Select Cover Image</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body" style="height: 60vh; display:flex; flex-direction:column;">
          <div class="form-group">
            <label>Select Chapter</label>
            <select id="cover-chapter-select" style="width:100%"></select>
          </div>
          <div id="cover-images-grid" style="flex:1; overflow-y:auto; display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:10px; padding:10px; background:var(--bg-secondary); border-radius:var(--radius-sm);">
            <div class="loading-center"><div class="loading-spinner"></div></div>
          </div>
           <div class="form-group" style="margin-top:10px;">
             <label>Apply To:</label>
             <div style="display:flex; gap:15px; align-items:center;">
                <label style="display:inline-flex; align-items:center; gap:5px; margin:0;">
                    <input type="radio" name="cover-target" value="volume" checked> Volume
                </label>
                <label style="display:inline-flex; align-items:center; gap:5px; margin:0;">
                    <input type="radio" name="cover-target" value="manga"> Main Series
                </label>
             </div>
           </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render a chapter item
 */
// Helper to get version title safely
function getVersionDisplayTitle(versions, num) {
  if (!versions || versions.length === 0) return '';
  return versions[0].title !== `Chapter ${num}` ? versions[0].title : '';
}

function renderChapterItem(num, versions, downloadedChapters, readChapters, manga) {
  const isDownloaded = downloadedChapters.has(num);
  const isRead = readChapters.has(num);
  const isExtra = !Number.isInteger(num);
  // moved hasMultiple down

  // Get downloaded versions for this chapter
  const downloadedVersions = manga.downloadedVersions?.[num] || [];
  const deletedUrls = new Set(manga.deletedChapterUrls || []);

  // Visibility logic for versions
  const visibleVersions = versions.filter(v => {
    // If showing hidden, show EVERYTHING (visible + hidden) 
    // otherwise hide deleted ones
    // Use state.filter if possible, but renderChapterItem doesn't access state directly?
    // Actually it's in the same module scope, so 'state' is available
    if (state.filter === 'hidden') return true;
    return !deletedUrls.has(v.url);
  });

  // Check if we are in Volume Mode
  const isVolumeMode = !!state.activeVolume;

  // Volume Mode Restrictions:
  // 1. Only show downloaded versions
  // 2. Effectively "lock" the chapter (visual indication)
  let displayVersions = visibleVersions;
  if (isVolumeMode) {
    displayVersions = visibleVersions.filter(v => {
      if (Array.isArray(downloadedVersions)) {
        return downloadedVersions.includes(v.url);
      }
      return downloadedVersions === v.url;
    });

    // If no downloaded versions, maybe show a placeholder or keep empty?
    // User said "only show the downloaded version", implies hiding others.
  }

  // Sort displayVersions so downloaded ones come first - ensures the primary
  // chapter row always targets a downloaded version when one exists
  displayVersions.sort((a, b) => {
    const aDownloaded = Array.isArray(downloadedVersions)
      ? downloadedVersions.includes(a.url)
      : downloadedVersions === a.url;
    const bDownloaded = Array.isArray(downloadedVersions)
      ? downloadedVersions.includes(b.url)
      : downloadedVersions === b.url;
    return (bDownloaded ? 1 : 0) - (aDownloaded ? 1 : 0);
  });

  const hasMultiple = displayVersions.length > 1;

  // Get the first version URL for single-version operations
  const firstVersionUrl = displayVersions[0]?.url ? encodeURIComponent(displayVersions[0].url) : null;

  // Get chapter settings
  const chapterSettings = manga.chapterSettings || {};
  // In volume mode, force lock visual (or maybe just hide lock button?)
  // User said "chapters in volumes should be locked"
  const isLocked = isVolumeMode ? true : (chapterSettings[num]?.locked);

  const classes = [
    'chapter-item',
    isDownloaded ? 'downloaded' : '',
    isRead ? 'read' : '',
    isExtra ? 'extra' : ''
  ].filter(Boolean).join(' ');

  // Render version dropdown if multiple versions exist
  const versionsHtml = hasMultiple ? `
    <div class="versions-dropdown hidden" id="versions-${num}">
      ${displayVersions.map(v => {
    const versionUrl = encodeURIComponent(v.url);
    const isVersionDownloaded = Array.isArray(downloadedVersions)
      ? downloadedVersions.includes(v.url)
      : downloadedVersions === v.url;
    const isLocalVersion = v.url.startsWith('local://');
    return `
          <div class="version-row ${isVersionDownloaded ? 'downloaded' : ''}"
               data-version-url="${versionUrl}" data-num="${num}">
            <span class="version-title" style="cursor: pointer; flex: 1;">${v.title || v.releaseGroup || 'Version'}${isLocalVersion ? ' <span class="badge badge-local" style="background: var(--color-info, #2196f3); color: white; font-size: 0.65em; padding: 1px 5px; border-radius: 3px; margin-left: 6px; vertical-align: middle;">Local</span>' : ''}</span>
            <div class="version-actions">
              ${isVersionDownloaded
        ? `<button class="btn-icon small success" data-action="read-version" data-num="${num}" data-url="${versionUrl}">▶</button>
                   <button class="btn-icon small danger" data-action="delete-version" data-num="${num}" data-url="${versionUrl}">🗑️</button>`
        : `<button class="btn-icon small" data-action="download-version" data-num="${num}" data-url="${versionUrl}">↓</button>`
      }
              ${deletedUrls.has(v.url)
        ? `<button class="btn-icon small warning" data-action="restore-version" data-num="${num}" data-url="${versionUrl}" title="Restore Version">↩️</button>`
        : `<button class="btn-icon small" data-action="hide-version" data-num="${num}" data-url="${versionUrl}" title="Hide Version">👁️‍🗨️</button>`
      }
            </div>
          </div>
        `;
  }).join('')}
    </div>
  ` : '';

  const isExcluded = (manga.excludedChapters || []).includes(num);

  return `
    <div class="chapter-group" data-chapter="${num}">
      <div class="${classes}" data-num="${num}" style="${isExcluded ? 'opacity: 0.7' : ''}">
        <span class="chapter-number">Ch. ${num}</span>
        <span class="chapter-title">
          ${displayVersions[0] ? (displayVersions[0].title !== `Chapter ${num}` ? displayVersions[0].title : '') : versions[0].title}
          ${isExcluded ? '<span class="badge badge-warning" style="margin-left:8px; font-size:0.7em">Excluded</span>' : ''}
        </span>
        ${isExtra ? '<span class="chapter-tag">Extra</span>' : ''}
        <div class="chapter-actions">
          ${isExcluded
      ? `<button class="btn-icon small warning" data-action="restore-chapter" data-num="${num}" title="Restore Chapter">↩️</button>`
      : (isVolumeMode
        ? `<div style="display: flex; align-items: center; gap: 4px;">
            <span style="opacity: 0.5; font-size: 0.8em">Vol</span>
            ${state.manageChapters ? `<button class="btn-icon small danger remove-from-vol-btn" data-num="${num}" title="Remove from Volume">×</button>` : ''}
          </div>`
        : `<button class="btn-icon small lock-btn ${isLocked ? 'locked' : ''}"
                        data-action="lock" data-num="${num}"
                        title="${isLocked ? 'Unlock' : 'Lock'}">
                  ${isLocked ? '🔒' : '🔓'}
                </button>`)
    }
          ${!isExcluded && firstVersionUrl ? (
      deletedUrls.has(displayVersions[0]?.url)
        ? `<button class="btn-icon small warning" data-action="unhide-chapter" data-num="${num}" data-url="${firstVersionUrl}" title="Unhide Chapter">↩️</button>`
        : `<button class="btn-icon small" data-action="hide-chapter" data-num="${num}" data-url="${firstVersionUrl}" title="Hide Chapter">👁️‍🗨️</button>`
    ) : ''}
          <button class="btn-icon small ${isRead ? 'success' : 'muted'}"
                  data-action="read" data-num="${num}"
                  title="${isRead ? 'Mark unread' : 'Mark read'}">
            ${isRead ? '👁️' : '○'}
          </button>
          ${isDownloaded
      ? `<button class="btn-icon small danger" data-action="delete-chapter" data-num="${num}" data-url="${firstVersionUrl}" title="Delete Files">🗑️</button>
         <button class="btn-icon small ${state.offlineChapters.has(num) ? 'success' : ''}" data-action="offline-save" data-num="${num}" title="${state.offlineChapters.has(num) ? 'Remove offline copy' : 'Save for offline reading'}">
           ${state.offlineChapters.has(num) ? '📴' : '💾'}
         </button>`
      : `<button class="btn-icon small ${isDownloaded ? 'success' : ''}"
              data-action="download" data-num="${num}"
              title="${isDownloaded ? 'Downloaded' : 'Download'}">
          ${isDownloaded ? '✓' : '↓'}
        </button>`
    }
          ${hasMultiple ? `
            <button class="btn-icon small versions-btn" data-action="versions" data-num="${num}">
              ${visibleVersions.length} ▼
            </button>
          ` : ''}
        </div>
      </div>
      ${versionsHtml}
    </div>
  `;
}

/**
 * Render pagination
 */
function renderPagination(totalPages) {
  return `
    <div class="chapter-pagination">
      <button class="btn btn-icon" data-page="first" ${state.currentPage === 0 ? 'disabled' : ''}>«</button>
      <button class="btn btn-icon" data-page="prev" ${state.currentPage === 0 ? 'disabled' : ''}>‹</button>
      <span class="pagination-info">Page ${state.currentPage + 1} of ${totalPages}</span>
      <button class="btn btn-icon" data-page="next" ${state.currentPage >= totalPages - 1 ? 'disabled' : ''}>›</button>
      <button class="btn btn-icon" data-page="last" ${state.currentPage >= totalPages - 1 ? 'disabled' : ''}>»</button>
    </div>
  `;
}

function renderAvailableChapters(manga, looseChapters) {
  if (looseChapters.length === 0) {
    return `
      <div class="available-chapters-section">
        <div class="section-header">
          <h2>Available Chapters</h2>
        </div>
        <div class="empty-state-lite">All chapters are already assigned to volumes.</div>
      </div>
    `;
  }

  // Group by chapter number to avoid duplicates for multi-version chapters
  const uniqueNumbers = [...new Set(looseChapters.map(ch => ch.number))].sort((a, b) => a - b);

  return `
    <div class="available-chapters-section">
      <div class="section-header">
        <h2>Available Chapters</h2>
        <p class="text-muted" style="font-size: 0.9em; margin-bottom: 12px;">These chapters are not assigned to any volume yet.</p>
      </div>
      <div class="available-chapters-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
        ${uniqueNumbers.map(num => `
          <div class="available-chapter-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: var(--bg-secondary); border-radius: var(--radius-sm);">
            <span style="font-weight: 500;">Ch. ${num}</span>
            <button class="btn btn-small btn-primary add-to-vol-btn" data-num="${num}">Add</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Render volumes section
 */
function renderVolumesSection(manga, downloadedChapters) {
  const volumes = manga.volumes || [];
  if (volumes.length === 0) return '';

  const volumeCards = volumes.map(vol => {
    const volChapters = vol.chapters || [];
    const volDownloaded = volChapters.filter(n => downloadedChapters.has(n)).length;

    return `
      <div class="volume-card" data-volume-id="${vol.id}">
        <div class="volume-cover">
          ${vol.cover
        ? `<img src="${vol.cover}" alt="${vol.name}">`
        : `<div class="placeholder">📚</div>`
      }
          <div class="volume-badges">
            <span class="badge badge-chapters">${volChapters.length} ch</span>
            ${volDownloaded > 0 ? `<span class="badge badge-downloaded">${volDownloaded}</span>` : ''}
          </div>
        </div>
        <div class="volume-info">
          <div class="volume-name">${vol.name}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="volumes-section">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h2 style="margin: 0;">Volumes</h2>
        <button class="btn btn-secondary btn-small" id="add-volume-btn">+ Add Volume</button>
      </div>
      <div class="volumes-grid">
        ${volumeCards || (manga.chapters?.length > 0 ? '<div class="empty-state-lite">No volumes yet. Create one to organize your chapters!</div>' : '')}
      </div>
    </div>
  `;
}

/**
 * Setup event listeners
 */
export function setupListeners() {
  const app = document.getElementById('app');
  const manga = state.manga;
  if (!manga) return;

  // Back buttons
  document.getElementById('back-btn')?.addEventListener('click', () => router.go('/'));
  document.getElementById('back-library-btn')?.addEventListener('click', () => router.go('/'));

  // Artist link clicks - fill search bar in library and navigate there
  app.querySelectorAll('.artist-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const artist = link.dataset.artist;
      if (artist) {
        // Store artist name in search and go to library
        localStorage.setItem('library_search', artist);
        localStorage.removeItem('library_artist_filter');
        router.go('/');
      }
    });
  });

  // Continue reading
  document.getElementById('continue-btn')?.addEventListener('click', () => {
    continueReading(manga.id);
  });

  // Download all - open options modal
  document.getElementById('download-all-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('download-all-modal');
    if (modal) modal.classList.add('open');
  });

  // Confirm download all
  document.getElementById('confirm-download-all-btn')?.addEventListener('click', async () => {
    try {
      showToast('Queueing downloads...', 'info');

      const modeRadios = document.getElementsByName('download-version-mode');
      let selectedMode = 'single';
      for (const r of modeRadios) {
        if (r.checked) selectedMode = r.value;
      }

      document.getElementById('download-all-modal')?.classList.remove('open');

      const result = await api.post(`/bookmarks/${manga.id}/download`, { all: true, versionMode: selectedMode });
      if (result.chaptersCount > 0) {
        showToast(`Download queued: ${result.chaptersCount} versions`, 'success');
      } else {
        showToast('Already have these chapters downloaded', 'info');
      }
    } catch (error) {
      showToast('Failed to download: ' + error.message, 'error');
    }
  });

  // Quick check
  document.getElementById('check-updates-btn')?.addEventListener('click', async () => {
    try {
      showToast('Checking for updates...', 'info');
      await api.post(`/bookmarks/${manga.id}/quick-check`);
      showToast('Check complete!', 'success');
    } catch (error) {
      showToast('Check failed: ' + error.message, 'error');
    }
  });

  // Schedule button - open schedule modal (single button for enable/configure)
  document.getElementById('schedule-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('schedule-modal');
    if (modal) modal.classList.add('open');
  });

  // Schedule type change - show/hide day selector
  document.getElementById('schedule-type')?.addEventListener('change', (e) => {
    const dayGroup = document.getElementById('schedule-day-group');
    if (dayGroup) {
      dayGroup.style.display = e.target.value === 'weekly' ? '' : 'none';
    }
  });

  // Save schedule
  document.getElementById('save-schedule-btn')?.addEventListener('click', async () => {
    try {
      const schedule = document.getElementById('schedule-type').value;
      const day = document.getElementById('schedule-day').value;
      const time = document.getElementById('schedule-time').value;
      const autoDownload = document.getElementById('auto-download-toggle').checked;

      await api.updateAutoCheckSchedule(manga.id, {
        enabled: true,
        schedule,
        day,
        time,
        autoDownload
      });

      state.manga.checkSchedule = schedule;
      state.manga.checkDay = day;
      state.manga.checkTime = time;
      state.manga.autoDownload = autoDownload;

      document.getElementById('schedule-modal')?.classList.remove('open');
      mount([manga.id]);
      showToast('Schedule updated', 'success');
    } catch (error) {
      showToast('Failed to save schedule: ' + error.message, 'error');
    }
  });

  // Disable schedule button
  document.getElementById('disable-schedule-btn')?.addEventListener('click', async () => {
    try {
      await api.toggleAutoCheck(manga.id, false);
      state.manga.autoCheck = false;
      state.manga.checkSchedule = null;
      state.manga.checkDay = null;
      state.manga.checkTime = null;
      state.manga.nextCheck = null;
      document.getElementById('schedule-modal')?.classList.remove('open');
      mount([manga.id]);
      showToast('Auto-check disabled', 'success');
    } catch (error) {
      showToast('Failed to disable: ' + error.message, 'error');
    }
  });

  // Refresh button - check for updates
  document.getElementById('refresh-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('refresh-btn');
    try {
      btn.disabled = true;
      btn.textContent = '⏳ Checking...';
      showToast('Checking for updates...', 'info');
      await api.post(`/bookmarks/${manga.id}/check`);
      await loadData(manga.id);
      mount([manga.id]);
      showToast('Check complete!', 'success');
    } catch (error) {
      showToast('Check failed: ' + error.message, 'error');
      if (btn) {
        btn.disabled = false;
        btn.textContent = '🔄 Refresh';
      }
    }
  });

  // Scan folder button - scan local folder for this manga
  document.getElementById('scan-folder-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('scan-folder-btn');
    try {
      btn.disabled = true;
      btn.textContent = '⏳ Scanning...';
      showToast('Scanning folder...', 'info');
      const result = await api.scanBookmark(manga.id);
      await loadData(manga.id);
      mount([manga.id]);
      const added = result.addedChapters?.length || 0;
      const removed = result.removedChapters?.length || 0;
      if (added > 0 || removed > 0) {
        showToast(`Scan complete: ${added} added, ${removed} removed`, 'success');
      } else {
        showToast('Scan complete: No changes', 'info');
      }
    } catch (error) {
      showToast('Scan failed: ' + error.message, 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = '📁 Scan Folder';
      }
    }
  });

  // CBZ extract buttons
  document.querySelectorAll('[data-cbz-path]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cbzPath = decodeURIComponent(btn.dataset.cbzPath);
      const defaultChapter = parseInt(btn.dataset.cbzChapter) || 1;
      const isExtracted = btn.dataset.cbzExtracted === 'true';

      // Ask for chapter number
      const chapterStr = prompt(`Enter chapter number for extraction:`, String(defaultChapter));
      if (!chapterStr) return;

      const chapterNum = parseFloat(chapterStr);
      if (isNaN(chapterNum)) {
        showToast('Invalid chapter number', 'error');
        return;
      }

      try {
        btn.disabled = true;
        btn.textContent = 'Extracting...';
        showToast('Extracting CBZ...', 'info');

        await api.extractCbz(manga.id, cbzPath, chapterNum, { forceReExtract: isExtracted });

        showToast('CBZ extracted successfully!', 'success');

        // Reload to show updated state
        await loadData(manga.id);
        mount([manga.id]);
      } catch (error) {
        showToast('Extract failed: ' + error.message, 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = isExtracted ? 'Re-Extract' : 'Extract';
      }
    });
  });

  // Edit button - open edit modal
  document.getElementById('edit-btn')?.addEventListener('click', async () => {
    const modal = document.getElementById('edit-manga-modal');
    if (modal) {
      document.getElementById('edit-alias-input').value = manga.alias || '';

      // Reset selected cover path
      window._selectedCoverPath = null;

      // Populate artist and category datalists
      try {
        const [artists, categories] = await Promise.all([
          api.getAllArtists(),
          api.getAllCategories()
        ]);

        const artistList = document.getElementById('artist-list');
        const categoryList = document.getElementById('category-list');

        // Store full lists for filtering
        window._allArtists = artists;
        window._allCategories = categories;

        if (artistList) {
          artistList.innerHTML = artists.map(a => `<option value="${a}">`).join('');
        }
        if (categoryList) {
          categoryList.innerHTML = categories.map(c => `<option value="${c}">`).join('');
        }

        // Add input handlers for autocomplete filtering
        const artistInput = document.getElementById('edit-artist-input');
        const categoryInput = document.getElementById('edit-categories-input');

        artistInput?.addEventListener('input', () => {
          const val = artistInput.value.toLowerCase();
          const lastComma = artistInput.value.lastIndexOf(',');
          const current = artistInput.value.substring(lastComma + 1).trim().toLowerCase();

          if (current.length > 0 && window._allArtists) {
            const matches = window._allArtists.filter(a => a.toLowerCase().includes(current));
            if (artistList && matches.length > 0) {
              // Show matches in last position
              const prefix = lastComma >= 0 ? artistInput.value.substring(0, lastComma + 1) + ' ' : '';
              artistList.innerHTML = matches.map(a => `<option value="${prefix}${a}">`).join('');
            }
          }
        });

        categoryInput?.addEventListener('input', () => {
          const lastComma = categoryInput.value.lastIndexOf(',');
          const current = categoryInput.value.substring(lastComma + 1).trim().toLowerCase();

          if (current.length > 0 && window._allCategories) {
            const matches = window._allCategories.filter(c => c.toLowerCase().includes(current));
            if (categoryList && matches.length > 0) {
              const prefix = lastComma >= 0 ? categoryInput.value.substring(0, lastComma + 1) + ' ' : '';
              categoryList.innerHTML = matches.map(c => `<option value="${prefix}${c}">`).join('');
            }
          }
        });

      } catch (e) {
        console.error('Failed to load artists/categories:', e);
      }

      modal.classList.add('open');
    }
  });

  // Save manga changes
  document.getElementById('save-manga-btn')?.addEventListener('click', async () => {
    try {
      const alias = document.getElementById('edit-alias-input').value.trim();
      const artistInput = document.getElementById('edit-artist-input').value.trim();
      const categoriesInput = document.getElementById('edit-categories-input').value.trim();

      // Parse artist (comma separated)
      const artists = artistInput ? artistInput.split(',').map(a => a.trim()).filter(a => a) : [];

      // Parse categories (comma separated)
      const categories = categoriesInput ? categoriesInput.split(',').map(c => c.trim()).filter(c => c) : [];

      // Update bookmark alias
      await api.updateBookmark(manga.id, { alias: alias || null });

      // Update artists
      await api.setBookmarkArtists(manga.id, artists);

      // Update categories (always call, even if empty to clear)
      await api.setBookmarkCategories(manga.id, categories);

      // Update cover if changed
      if (window._selectedCoverPath) {
        // Use the new endpoint that copies to covers folder
        await api.setBookmarkCoverFromImage(manga.id, window._selectedCoverPath);
      }

      state.manga.alias = alias || null;
      state.manga.artists = artists;
      state.manga.categories = categories;

      document.getElementById('edit-manga-modal')?.classList.remove('open');
      mount([manga.id]);
      showToast('Manga updated', 'success');
    } catch (error) {
      showToast('Failed to update: ' + error.message, 'error');
    }
  });

  // Change cover button
  document.getElementById('change-cover-btn')?.addEventListener('click', async () => {
    try {
      showToast('Loading images...', 'info');
      const images = await api.getFolderImages(manga.id);

      if (images.length === 0) {
        showToast('No images found in manga folder', 'warning');
        return;
      }

      // Create cover selection modal
      const modal = document.createElement('div');
      modal.id = 'cover-select-modal';
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:10000;display:flex;align-items:center;justify-content:center;';

      modal.innerHTML = `
        <div style="background:var(--bg-primary);border-radius:8px;padding:24px;max-width:600px;width:90%;max-height:80vh;overflow-y:auto;">
          <h3 style="margin:0 0 16px 0;">Select Cover Image</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:8px;">
            ${images.slice(0, 50).map(img => `
              <div class="cover-option" data-path="${img.path}" style="cursor:pointer;border:2px solid transparent;border-radius:4px;overflow:hidden;">
                <img src="/api/proxy-image?path=${encodeURIComponent(img.path)}" style="width:100%;aspect-ratio:2/3;object-fit:cover;">
              </div>
            `).join('')}
          </div>
          ${images.length > 50 ? `<p style="margin:8px 0 0 0;color:var(--text-secondary);">Showing first 50 of ${images.length} images</p>` : ''}
          <div style="margin-top:16px;display:flex;justify-content:flex-end;">
            <button class="btn btn-secondary" id="close-cover-modal">Cancel</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      document.getElementById('close-cover-modal').addEventListener('click', () => modal.remove());
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

      // Handle cover selection
      modal.querySelectorAll('.cover-option').forEach(opt => {
        opt.addEventListener('click', () => {
          window._selectedCoverPath = opt.dataset.path;
          // Update preview
          const preview = document.getElementById('cover-preview');
          if (preview) {
            preview.innerHTML = `<img src="/api/proxy-image?path=${encodeURIComponent(window._selectedCoverPath)}" style="width:100%;height:100%;object-fit:cover;">`;
          }
          modal.remove();
          showToast('Cover selected', 'success');
        });
      });

    } catch (error) {
      showToast('Failed to load images: ' + error.message, 'error');
    }
  });

  // Delete manga - open confirmation modal
  document.getElementById('delete-manga-btn')?.addEventListener('click', () => {
    const modal = document.getElementById('delete-manga-modal');
    if (modal) modal.classList.add('open');
  });

  // Confirm delete manga
  document.getElementById('confirm-delete-manga-btn')?.addEventListener('click', async () => {
    const deleteFiles = document.getElementById('delete-files-toggle')?.checked || false;
    try {
      await api.deleteBookmark(manga.id, deleteFiles);
      document.getElementById('delete-manga-modal')?.classList.remove('open');
      showToast('Manga deleted', 'success');
      router.go('/');
    } catch (error) {
      showToast('Failed to delete: ' + error.message, 'error');
    }
  });

  // Quick Check button
  document.getElementById('quick-check-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('quick-check-btn');
    try {
      btn.disabled = true;
      btn.textContent = '⏳ Checking...';
      showToast('Quick checking for updates...', 'info');
      const result = await api.post(`/bookmarks/${manga.id}/quick-check`);
      await loadData(manga.id);
      mount([manga.id]);
      if (result.newChaptersCount > 0) {
        showToast(`Found ${result.newChaptersCount} new chapter(s)!`, 'success');
      } else {
        showToast('No new chapters found', 'info');
      }
    } catch (error) {
      showToast('Quick check failed: ' + error.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = '⚡ Quick Check'; }
    }
  });

  // Source label click - open migrate source modal and populate scraper list
  document.getElementById('source-label')?.addEventListener('click', async () => {
    const modal = document.getElementById('migrate-source-modal');
    if (modal) {
      modal.classList.add('open');
      // Dynamically populate scraper dropdown
      const select = document.getElementById('migrate-search-scraper');
      if (select && select.options.length <= 1) {
        try {
          const data = await api.get('/scrapers/list');
          if (data.success) {
            select.innerHTML = data.scrapers
              .filter(s => s.supportsSearch)
              .map(s => `<option value="${s.name}" ${s.name === manga.website ? '' : ''}>${s.name}</option>`)
              .join('');
            // Pre-select a scraper that's NOT the current source (since we're migrating away)
            const otherScraper = data.scrapers.find(s => s.supportsSearch && s.name !== manga.website);
            if (otherScraper) select.value = otherScraper.name;
          }
        } catch (e) {
          console.warn('Failed to load scrapers:', e);
        }
      }
    }
  });

  // Migrate modal: search for manga
  const migrateSearchHandler = async () => {
    const query = document.getElementById('migrate-search-input')?.value?.trim();
    const scraper = document.getElementById('migrate-search-scraper')?.value;
    if (!query) return;
    
    const loading = document.getElementById('migrate-search-loading');
    const resultsContainer = document.getElementById('migrate-search-results');
    const grid = document.getElementById('migrate-results-grid');
    
    loading.style.display = 'block';
    resultsContainer.style.display = 'none';
    
    try {
      const data = await api.get(`/scrapers/search?q=${encodeURIComponent(query)}&scraper=${encodeURIComponent(scraper)}`);
      const results = data.results || [];
      
      if (results.length === 0) {
        grid.innerHTML = '<p class="text-muted" style="text-align: center; padding: 20px;">No results found</p>';
      } else {
        grid.innerHTML = results.map(r => {
          const coverUrl = r.cover?.startsWith('/covers/') ? r.cover 
            : r.cover ? `/api/scrapers/proxy-cover?url=${encodeURIComponent(r.cover)}` : '';
          return `
            <div class="manga-card migrate-result-card" data-url="${r.url}" style="cursor: pointer; font-size: 0.85em;">
              <div class="manga-card-cover" style="height: 150px;">
                ${coverUrl ? `<img src="${coverUrl}" alt="Cover" loading="lazy" onerror="this.outerHTML='<div class=\\'placeholder\\'>📖</div>'">`
                  : '<div class="placeholder">📖</div>'}
                ${r.chapterCount ? `<div class="manga-card-badges"><span class="badge badge-chapters">${r.chapterCount} ch</span></div>` : ''}
              </div>
              <div class="manga-card-title" title="${r.title}" style="font-size: 0.8rem; padding: 4px;">${r.title}</div>
            </div>
          `;
        }).join('');
        
        // Click handler for search results - fills URL input
        grid.querySelectorAll('.migrate-result-card').forEach(card => {
          card.addEventListener('click', () => {
            const url = card.dataset.url;
            document.getElementById('migrate-url-input').value = url;
            // Highlight selected
            grid.querySelectorAll('.migrate-result-card').forEach(c => c.style.outline = '');
            card.style.outline = '2px solid var(--color-primary)';
            showToast(`Selected: ${card.querySelector('.manga-card-title')?.textContent}`, 'info');
          });
        });
      }
      
      loading.style.display = 'none';
      resultsContainer.style.display = 'block';
    } catch (err) {
      loading.style.display = 'none';
      showToast('Search failed: ' + err.message, 'error');
    }
  };
  
  document.getElementById('migrate-search-btn')?.addEventListener('click', migrateSearchHandler);
  document.getElementById('migrate-search-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') migrateSearchHandler();
  });

  // Confirm migrate source
  document.getElementById('confirm-migrate-btn')?.addEventListener('click', async () => {
    const newUrl = document.getElementById('migrate-url-input')?.value?.trim();
    if (!newUrl) {
      showToast('Please enter a URL', 'warning');
      return;
    }
    const btn = document.getElementById('confirm-migrate-btn');
    try {
      btn.disabled = true;
      btn.textContent = 'Migrating...';
      showToast('Migrating source...', 'info');

      // Step 1: Migrate source (converts downloaded chapters to local)
      const result = await api.migrateSource(manga.id, newUrl);
      showToast(`Migrated! ${result.migratedChapters} chapters preserved as local`, 'success');

      // Step 2: Run full check against the new source
      showToast('Running full check on new source...', 'info');
      await api.post(`/bookmarks/${manga.id}/check`);

      document.getElementById('migrate-source-modal')?.classList.remove('open');
      await loadData(manga.id);
      mount([manga.id]);
      showToast('Source migration complete!', 'success');
    } catch (error) {
      showToast('Migration failed: ' + error.message, 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Migrate Source'; }
    }
  });

  // Chapter filters
  app.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      state.currentPage = 0;
      mount([manga.id]);
    });
  });

  // Pagination
  app.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.page;
      const totalPages = Math.ceil(state.manga.chapters.length / CHAPTERS_PER_PAGE);

      switch (action) {
        case 'first': state.currentPage = 0; break;
        case 'prev': state.currentPage = Math.max(0, state.currentPage - 1); break;
        case 'next': state.currentPage = Math.min(totalPages - 1, state.currentPage + 1); break;
        case 'last': state.currentPage = totalPages - 1; break;
      }
      mount([manga.id]);
    });
  });

  // Chapter item clicks
  app.querySelectorAll('.chapter-item').forEach(item => {
    item.addEventListener('click', (e) => {
      // Don't navigate if clicking action buttons
      if (e.target.closest('.chapter-actions')) return;

      const num = parseFloat(item.dataset.num);
      const downloaded = manga.downloadedChapters || [];

      if (downloaded.includes(num)) {
        // Find the first downloaded version URL so we open the correct version
        const versions = manga.downloadedVersions?.[num] || [];
        const versionUrl = Array.isArray(versions) ? versions[0] : versions;
        if (versionUrl) {
          router.go(`/read/${manga.id}/${num}?version=${encodeURIComponent(versionUrl)}`);
        } else {
          router.go(`/read/${manga.id}/${num}`);
        }
      } else {
        showToast('Chapter not downloaded', 'info');
      }
    });
  });

  // Chapter action buttons
  app.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const action = btn.dataset.action;
      const num = parseFloat(btn.dataset.num);
      const url = btn.dataset.url ? decodeURIComponent(btn.dataset.url) : null;

      switch (action) {
        case 'lock':
          await toggleLock(num);
          break;
        case 'read':
          await toggleRead(num);
          break;
        case 'download':
          await downloadChapter(num);
          break;
        case 'versions':
          toggleVersions(num);
          break;
        case 'read-version':
          router.go(`/read/${manga.id}/${num}?version=${encodeURIComponent(url)}`);
          break;
        case 'download-version':
          await downloadVersion(num, url);
          break;
        case 'delete-version':
          await deleteVersion(num, url);
          break;
        case 'hide-version':
          await hideVersion(num, url);
          break;
        case 'restore-version':
          await restoreVersion(num, url);
          break;
        case 'restore-chapter':
          await restoreChapter(num);
          break;
        case 'delete-chapter':
          await deleteChapter(num, url);
          break;
        case 'hide-chapter':
          await hideChapter(num, url);
          break;
        case 'unhide-chapter':
          await unhideChapter(num, url);
          break;
      }
    });
  });

  // Version row title click - read that version
  app.querySelectorAll('.version-row .version-title').forEach(title => {
    title.addEventListener('click', (e) => {
      e.stopPropagation();
      const row = title.closest('.version-row');
      const num = parseFloat(row.dataset.num);
      const url = row.dataset.versionUrl ? decodeURIComponent(row.dataset.versionUrl) : null;
      if (row.classList.contains('downloaded') && url) {
        router.go(`/read/${manga.id}/${num}?version=${encodeURIComponent(url)}`);
      } else {
        showToast('Version not downloaded yet', 'info');
      }
    });
  });

  // Volume card clicks
  app.querySelectorAll('.volume-card').forEach(card => {
    card.addEventListener('click', () => {
      const volumeId = card.dataset.volumeId;
      router.go(`/manga/${manga.id}/volume/${volumeId}`);
    });
  });

  // Volume Management Listeners
  setupVolumeListeners(app);

  // Header Component Listeners
  setupHeaderListeners();

  // Subscribe to manga updates via Socket.io
  socket.subscribeToManga(manga.id);
}

/**
 * Toggle chapter lock
 */
async function toggleLock(chapterNum) {
  const manga = state.manga;
  const settings = manga.chapterSettings?.[chapterNum] || {};
  const newLocked = !settings.locked;

  try {
    if (newLocked) {
      await api.lockChapter(manga.id, chapterNum);
    } else {
      await api.unlockChapter(manga.id, chapterNum);
    }

    // Update local state
    if (!manga.chapterSettings) manga.chapterSettings = {};
    manga.chapterSettings[chapterNum] = { ...settings, locked: newLocked };

    showToast(newLocked ? 'Chapter locked' : 'Chapter unlocked', 'success');
    mount([manga.id]);
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}

/**
 * Toggle read status
 */
async function toggleRead(chapterNum) {
  const manga = state.manga;
  const readChapters = new Set(manga.readChapters || []);
  const isRead = readChapters.has(chapterNum);

  try {
    await api.post(`/bookmarks/${manga.id}/chapters/${chapterNum}/read`, { read: !isRead });

    // Update local state
    if (isRead) {
      readChapters.delete(chapterNum);
    } else {
      readChapters.add(chapterNum);
    }
    manga.readChapters = [...readChapters];

    showToast(isRead ? 'Marked unread' : 'Marked read', 'success');
    mount([manga.id]);
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}

/**
 * Download a chapter
 */
async function downloadChapter(chapterNum) {
  const manga = state.manga;

  // Find the first visible, non-hidden version URL for this chapter
  const deletedUrls = new Set(manga.deletedChapterUrls || []);
  const firstVersion = (manga.chapters || []).find(
    c => c.number === chapterNum && !deletedUrls.has(c.url)
  );

  try {
    showToast(`Downloading chapter ${chapterNum}...`, 'info');
    if (firstVersion) {
      // Use download-version to target the specific version URL
      await api.post(`/bookmarks/${manga.id}/download-version`, {
        chapterNumber: chapterNum,
        url: firstVersion.url
      });
    } else {
      await api.post(`/bookmarks/${manga.id}/download`, { chapters: [chapterNum] });
    }
    showToast('Download queued!', 'success');
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}

/**
 * Toggle versions dropdown
 */
function toggleVersions(chapterNum) {
  // Close all other dropdowns first
  document.querySelectorAll('.versions-dropdown').forEach(d => {
    if (d.id !== `versions-${chapterNum}`) {
      d.classList.add('hidden');
    }
  });

  const dropdown = document.getElementById(`versions-${chapterNum}`);
  if (dropdown) {
    dropdown.classList.toggle('hidden');
  }
}

/**
 * Download a specific version
 */
async function downloadVersion(chapterNum, url) {
  const manga = state.manga;

  try {
    showToast(`Downloading version...`, 'info');
    await api.post(`/bookmarks/${manga.id}/download-version`, {
      chapterNumber: chapterNum,
      url: url
    });
    showToast('Download queued!', 'success');
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}

/**
 * Delete a downloaded version
 */
async function deleteVersion(chapterNum, url) {
  const manga = state.manga;

  try {
    await api.request(`/bookmarks/${manga.id}/chapters`, {
      method: 'DELETE',
      body: JSON.stringify({ chapterNumber: chapterNum, url: url })
    });
    showToast('Version deleted', 'success');
    await loadData(manga.id);
    mount([manga.id]);
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}

/**
 * Hide a version (uses undo system)
 */
async function hideVersion(chapterNum, url) {
  const manga = state.manga;

  try {
    await api.hideVersion(manga.id, chapterNum, url);
    showToast('Version hidden', 'success');
    await loadData(manga.id);
    mount([manga.id]);
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}
/**
 * Restore a hidden/deleted version
 */
async function restoreVersion(chapterNum, url) {
  const manga = state.manga;
  try {
    await api.unhideVersion(manga.id, chapterNum, url);
    showToast('Version restored', 'success');
    await loadData(manga.id);
    mount([manga.id]);
  } catch (error) {
    showToast('Failed to restore version: ' + error.message, 'error');
  }
}

/**
 * Restore an excluded chapter
 */
async function restoreChapter(chapterNum) {
  const manga = state.manga;
  try {
    await api.unexcludeChapter(manga.id, chapterNum);
    showToast('Chapter restored', 'success');
    await loadData(manga.id);
    mount([manga.id]);
  } catch (error) {
    showToast('Failed to restore chapter: ' + error.message, 'error');
  }
}

/**
 * Delete chapter files (single version)
 */
async function deleteChapter(chapterNum, url) {
  const manga = state.manga;

  if (!confirm("Delete this chapter's files from disk?")) return;

  try {
    await api.request(`/bookmarks/${manga.id}/chapters`, {
      method: 'DELETE',
      body: JSON.stringify({ chapterNumber: chapterNum, url: url })
    });
    showToast('Chapter files deleted', 'success');
    await loadData(manga.id);
    mount([manga.id]);
  } catch (error) {
    showToast('Failed to delete: ' + error.message, 'error');
  }
}

/**
 * Hide a chapter (single version)
 */
async function hideChapter(chapterNum, url) {
  const manga = state.manga;

  if (!confirm('Hide this chapter? It will be moved to the Hidden filter.')) return;

  try {
    await api.hideVersion(manga.id, chapterNum, url);
    showToast('Chapter hidden', 'success');
    await loadData(manga.id);
    mount([manga.id]);
  } catch (error) {
    showToast('Failed to hide chapter: ' + error.message, 'error');
  }
}

/**
 * Unhide a chapter (single version)
 */
async function unhideChapter(chapterNum, url) {
  const manga = state.manga;
  try {
    await api.unhideVersion(manga.id, chapterNum, url);
    showToast('Chapter unhidden', 'success');
    await loadData(manga.id);
    mount([manga.id]);
  } catch (error) {
    showToast('Failed to unhide chapter: ' + error.message, 'error');
  }
}

/**
 * Load manga data
 */
async function loadData(mangaId) {
  try {
    const [manga, categories] = await Promise.all([
      api.getBookmark(mangaId),
      store.loadCategories()
    ]);

    state.manga = manga;
    state.categories = categories;
    state.loading = false;

    // Fetch CBZ files for local manga
    if (manga.website === 'Local') {
      try {
        const cbzFiles = await api.getCbzFiles(mangaId);
        state.cbzFiles = cbzFiles || [];
      } catch (e) {
        console.error('Failed to load CBZ files:', e);
        state.cbzFiles = [];
      }
    } else {
      state.cbzFiles = [];
    }

    // Default to last page
    const chapterCount = new Set((manga.chapters || []).map(c => c.number)).size;
    const totalPages = Math.ceil(chapterCount / CHAPTERS_PER_PAGE);
    state.currentPage = Math.max(0, totalPages - 1);

    // Set active volume if ID is present
    if (state.activeVolumeId) {
      state.activeVolume = (manga.volumes || []).find(v => v.id === state.activeVolumeId);
    } else {
      state.activeVolume = null;
    }

  } catch (error) {
    showToast('Failed to load manga', 'error');
    state.loading = false;
  }
}

/**
 * Mount the view
 */
export async function mount(params = []) {
  const [mangaId, action, actionId] = params;

  if (!mangaId) {
    router.go('/');
    return;
  }

  // Set active volume ID from params
  state.activeVolumeId = (action === 'volume') ? actionId : null;

  const app = document.getElementById('app');

  // Show loading if first load or manga changed
  if (!state.manga || state.manga.id !== mangaId) {
    state.loading = true;
    state.manga = null;
    app.innerHTML = render();

    await loadData(mangaId);
  } else {
    // If manga loaded but view mode changed (e.g. entering/exiting volume volume), update volume object
    if (state.activeVolumeId) {
      state.activeVolume = (state.manga.volumes || []).find(v => v.id === state.activeVolumeId);
    } else {
      state.activeVolume = null;
    }
  }

  app.innerHTML = render();
  setupListeners();
}

/**
 * Unmount cleanup
 */
export function unmount() {
  if (state.manga) {
    socket.unsubscribeFromManga(state.manga.id);
  }
  state.manga = null;
  state.loading = true;
}

export default { mount, unmount, render };

// ==========================================
// Volume Management Logic
// ==========================================

/**
 * Render add volume modal
 */
function renderAddVolumeModal() {
  return `
    <div class="modal" id="add-volume-modal">
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>📦 Add New Volume</h2>
          <button class="modal-close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="add-volume-name-input">Volume Name</label>
            <input type="text" id="add-volume-name-input" placeholder="e.g. Volume 1">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary modal-close-btn">Cancel</button>
          <button class="btn btn-primary" id="add-volume-submit-btn">Create Volume</button>
        </div>
      </div>
    </div>
  `;
}

function setupVolumeListeners(app) {
  const manga = state.manga;
  if (!manga) return;

  // --- Add Volume Modal ---
  const addVolBtn = app.querySelector('#add-volume-btn');
  const addVolModal = app.querySelector('#add-volume-modal');
  const addVolSubmitBtn = app.querySelector('#add-volume-submit-btn');

  if (addVolBtn && addVolModal) {
    addVolBtn.addEventListener('click', () => {
      addVolModal.classList.add('open');
      app.querySelector('#add-volume-name-input').focus();
    });
  }

  // Close modal listeners
  addVolModal?.querySelectorAll('.modal-close, .modal-close-btn, .modal-overlay').forEach(btn => {
    btn.addEventListener('click', () => addVolModal.classList.remove('open'));
  });

  if (addVolSubmitBtn) {
    addVolSubmitBtn.addEventListener('click', async () => {
      const name = app.querySelector('#add-volume-name-input').value.trim();
      if (!name) return showToast('Please enter a volume name', 'error');

      try {
        addVolSubmitBtn.disabled = true;
        addVolSubmitBtn.textContent = 'Creating...';

        await api.createVolume(manga.id, name);
        showToast('Volume created successfully!', 'success');

        addVolModal.classList.remove('open');
        app.querySelector('#add-volume-name-input').value = '';

        await loadData(manga.id);
        mount([manga.id]);
      } catch (error) {
        showToast('Failed to create volume: ' + error.message, 'error');
      } finally {
        addVolSubmitBtn.disabled = false;
        addVolSubmitBtn.textContent = 'Create Volume';
      }
    });
  }

  // --- Manage Volume Chapters ---
  const manageChaptersBtn = app.querySelector('#manage-chapters-btn');
  if (manageChaptersBtn) {
    manageChaptersBtn.addEventListener('click', () => {
      state.manageChapters = !state.manageChapters;
      mount([manga.id, 'volume', state.activeVolumeId]);
    });
  }

  // Add chapter to volume
  app.querySelectorAll('.add-to-vol-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const chapterNum = parseFloat(btn.dataset.num);
      const vol = state.activeVolume;
      if (!vol) return;

      try {
        btn.disabled = true;
        btn.textContent = '...';

        const currentChapters = vol.chapters || [];
        if (currentChapters.includes(chapterNum)) return;

        const newChapters = [...currentChapters, chapterNum].sort((a, b) => a - b);

        await api.updateVolumeChapters(manga.id, vol.id, newChapters);
        showToast(`Chapter ${chapterNum} added to volume`, 'success');

        await loadData(manga.id);
        mount([manga.id, 'volume', vol.id]);
      } catch (error) {
        showToast('Failed to add chapter: ' + error.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Add';
      }
    });
  });

  // Remove chapter from volume
  app.querySelectorAll('.remove-from-vol-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation(); // Don't trigger chapter click
      const chapterNum = parseFloat(btn.dataset.num);
      const vol = state.activeVolume;
      if (!vol) return;

      try {
        btn.disabled = true;
        btn.textContent = '...';

        const currentChapters = vol.chapters || [];
        const newChapters = currentChapters.filter(num => num !== chapterNum);

        await api.updateVolumeChapters(manga.id, vol.id, newChapters);
        showToast(`Chapter ${chapterNum} removed from volume`, 'success');

        await loadData(manga.id);
        mount([manga.id, 'volume', vol.id]);
      } catch (error) {
        showToast('Failed to remove chapter: ' + error.message, 'error');
        btn.disabled = false;
        btn.textContent = '×';
      }
    });
  });

  // --- Edit Volume Modal ---
  const editVolBtn = app.querySelector('#edit-vol-btn');
  const editModal = app.querySelector('#edit-volume-modal');

  if (editVolBtn && editModal) {
    editVolBtn.addEventListener('click', () => {
      const volId = editVolBtn.dataset.volId;
      const vol = manga.volumes.find(v => v.id === volId);
      if (!vol) return;

      // Populate form
      app.querySelector('#volume-name-input').value = vol.name;

      // Store current editing volume ID
      editModal.dataset.editingVolId = volId;

      editModal.classList.add('open');
    });
  }

  // Save Volume Changes
  const saveVolBtn = app.querySelector('#save-volume-btn');
  if (saveVolBtn) {
    saveVolBtn.addEventListener('click', async () => {
      const volId = editModal.dataset.editingVolId;
      const newName = app.querySelector('#volume-name-input').value.trim();

      if (!newName) return showToast('Volume name cannot be empty', 'error');

      try {
        await api.renameVolume(manga.id, volId, newName);
        showToast('Volume renamed', 'success');
        editModal.classList.remove('open');
        await loadData(manga.id);
        mount([manga.id, 'volume', volId]); // Reload volume view
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Delete Volume
  const deleteVolBtn = app.querySelector('#delete-volume-btn');
  if (deleteVolBtn) {
    deleteVolBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this volume? Chapters will remain in the library.')) return;

      const volId = editModal.dataset.editingVolId;
      try {
        await api.deleteVolume(manga.id, volId);
        showToast('Volume deleted', 'success');
        editModal.classList.remove('open');
        window.location.hash = `#/manga/${manga.id}`; // Go back to manga view
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // --- Cover Upload (Volume) ---
  const uploadBtn = app.querySelector('#vol-cover-upload-btn');
  if (uploadBtn) {
    // Create hidden input
    let fileInput = document.getElementById('vol-cover-input-hidden');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.id = 'vol-cover-input-hidden';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);

      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const volId = editModal.dataset.editingVolId;
        if (!volId) return;

        try {
          // Reset input so the same file can be selected again
          fileInput.value = '';

          uploadBtn.disabled = true;
          uploadBtn.textContent = 'Uploading...';

          await api.uploadVolumeCover(manga.id, volId, file);

          showToast('Cover uploaded', 'success');
          await loadData(manga.id);
          // Update the volume cover source directly in the DOM if we are looking at it
          // the mount call below handles the full refresh
          mount([manga.id, 'volume', volId]);
        } catch (err) {
          showToast('Upload failed: ' + err.message, 'error');
        } finally {
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = '📤 Upload Image';
        }
      });
    }

    uploadBtn.addEventListener('click', () => fileInput.click());
  }

  // --- Cover Selector Modal (Trigger) ---
  const selectorBtn = app.querySelector('#vol-cover-selector-btn');
  const coverModal = app.querySelector('#cover-selector-modal');

  if (selectorBtn && coverModal) {
    selectorBtn.addEventListener('click', async () => {
      // Close edit modal temporarily or just stack them? Stack is fine if z-index is correct.
      // Pre-fill chapter select
      const select = coverModal.querySelector('#cover-chapter-select');
      select.innerHTML = '<option value="">Select a chapter...</option>';

      // Use dataset from EDIT modal to determine scope
      const editModal = app.querySelector('#edit-volume-modal');
      const volId = editModal ? editModal.dataset.editingVolId : null;

      let chapters = [...(manga.chapters || [])];

      // If we are editing a volume, filter chapters to that volume
      if (volId) {
        const vol = manga.volumes.find(v => v.id === volId);
        if (vol && vol.chapters) {
          // Convert to Set for faster lookup, though not strictly necessary for small lists
          // Note: volume.chapters are usually just numbers in the DB
          const volChapterNums = new Set(vol.chapters);
          chapters = chapters.filter(c => volChapterNums.has(c.number));
        }
      }

      // Sort chapters numerically
      chapters.sort((a, b) => a.number - b.number);

      // Deduplicate by chapter number
      const seenChapters = new Set();
      chapters.forEach(c => {
        if (!seenChapters.has(c.number)) {
          seenChapters.add(c.number);
          const opt = document.createElement('option');
          opt.value = c.number;
          opt.textContent = `Chapter ${c.number}`;
          select.appendChild(opt);
        }
      });

      // Select first chapter by default and load images
      if (chapters.length > 0) {
        select.value = chapters[0].number;
        loadCoverImages(manga.id, chapters[0].number);
      }

      coverModal.classList.add('open');
    });
  }

  // Chapter Select Change
  const chapterSelect = app.querySelector('#cover-chapter-select');
  if (chapterSelect) {
    chapterSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        loadCoverImages(manga.id, e.target.value);
      }
    });
  }

  // Modal Closing Logic (Generic)
  app.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      modal.classList.remove('open');
    });
  });

  // Close on outside click
  app.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
      const modal = overlay.closest('.modal');
      modal.classList.remove('open');
    });
  });
}

/**
 * Load images for cover selector
 */
async function loadCoverImages(mangaId, chapterNum) {
  const grid = document.getElementById('cover-images-grid');
  if (!grid) return;

  grid.innerHTML = '<div class="loading-center"><div class="loading-spinner"></div></div>';

  try {
    const result = await api.getChapterImages(mangaId, chapterNum);
    const images = result.images || [];

    grid.innerHTML = '';

    if (images.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px;">No images found.</div>';
      return;
    }

    images.forEach(img => {
      const div = document.createElement('div');
      div.className = 'cover-grid-item';
      // Use padding-bottom hack for aspect ratio (2:3 = 150%) to ensure it works everywhere
      div.style.cssText = 'cursor:pointer; width:100%; padding-bottom:150%; height:0; border-radius:4px; overflow:hidden; position:relative; background: #222;';
      div.innerHTML = `<img src="${img}" style="position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; object-position:top;" loading="lazy">`;

      div.addEventListener('click', () => {
        // Get target (Volume or Main)
        const target = document.querySelector('input[name="cover-target"]:checked').value;
        const filename = img.split('/').pop(); // Extract filename from URL
        setCoverFromImage(filename, chapterNum, target);
      });

      grid.appendChild(div);
    });

  } catch (err) {
    grid.innerHTML = `<div style="color:var(--danger); padding:20px;">Error: ${err.message}</div>`;
  }
}

/**
 * Set cover from image
 */
async function setCoverFromImage(filename, chapterNum, target) {
  const manga = state.manga;
  const editModal = document.getElementById('edit-volume-modal');
  const coverModal = document.getElementById('cover-selector-modal');

  if (!confirm(`Set this image as ${target} cover?`)) return;

  try {
    if (target === 'volume') {
      const volId = editModal.dataset.editingVolId;
      if (!volId) throw new Error('No volume selected');

      await api.setVolumeCoverFromChapter(manga.id, volId, chapterNum, filename);
      showToast('Volume cover updated', 'success');

      // Refresh
      coverModal.classList.remove('open');
      editModal.classList.remove('open'); // Also close edit modal as we are done
      await loadData(manga.id);
      mount([manga.id, 'volume', volId]);

    } else {
      // Main Series Cover
      await api.setMangaCoverFromChapter(manga.id, chapterNum, filename);
      showToast('Series cover updated', 'success');

      coverModal.classList.remove('open');
      // Don't necessarily close edit modal? Maybe user wants to continue editing volume.
      // But usually nice to close.
      await loadData(manga.id);
      // Stay on current view (could be volume or main)
      const currentHash = window.location.hash.replace('#', '');
      // If we are in volume view, mount volume, else mount main
      if (state.activeVolumeId) {
        mount([manga.id, 'volume', state.activeVolumeId]);
      } else {
        mount([manga.id]);
      }
    }
  } catch (err) {
    showToast('Failed to set cover: ' + err.message, 'error');
  }
}
