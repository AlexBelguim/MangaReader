/**
 * Reader View Component
 * Displays manga pages in webtoon or manga (spread) mode
 * Features: trophy toggle, single/double page, reading progress, page slider
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { showToast } from '../utils/toast.js';

// View state
let state = {
    manga: null,
    chapter: null,
    images: [],
    trophyPages: {}, // { pageIndex: { isSingle: true, pages: [] } }
    mode: 'webtoon', // 'webtoon' or 'manga'
    direction: 'rtl', // 'ltr' or 'rtl'
    firstPageSingle: true,
    lastPageSingle: false,
    singlePageMode: false, // true = show one page at a time
    currentPage: 0,
    zoom: 100,
    loading: true,
    showControls: true,
    isGalleryMode: false, // true when viewing favorites gallery
    isCollectionMode: false, // true for galleries and trophy views
    favoriteLists: [], // cached favorite list names for dropdown
    allFavorites: null, // cached entire favorites list
    navigationDirection: null, // 'prev', 'next-linked', or null
    nextChapterImage: null, // URL of next chapter's first image (for link mode)
    nextChapterNum: null // chapter number of the next chapter
};

// ==================== HELPERS ====================

/**
 * Check if current page is favorited in any list
 */
function isCurrentPageFavorited() {
    if (!state.manga || !state.chapter || !state.allFavorites || !state.allFavorites.favorites) return false;
    if (state.isCollectionMode) return true; // Always highlighted in collection mode

    const currentIndex = getCurrentImageIndex();
    let pagesToCheck = [currentIndex];

    // In spread mode, check both pages
    if (state.mode === 'manga' && !state.singlePageMode) {
        const spreads = buildSpreads();
        const spread = spreads[state.currentPage];
        if (spread && Array.isArray(spread)) {
            pagesToCheck = spread;
        } else if (spread && spread.pages) {
            pagesToCheck = spread.pages;
        }
    }

    // Build imagePaths from current pages
    const imagePaths = pagesToCheck.map(idx => {
        const fn = getFilenameFromUrl(state.images[idx]);
        return fn ? { filename: fn } : null;
    }).filter(Boolean);

    // Look through all favorite lists
    for (const listName in state.allFavorites.favorites) {
        const listItems = state.allFavorites.favorites[listName];
        if (!Array.isArray(listItems)) continue;

        for (const item of listItems) {
            if (item.mangaId === state.manga.id && item.chapterNum === state.chapter.number) {
                if (item.imagePaths) {
                    for (const imgPath of item.imagePaths) {
                        const filename = typeof imgPath === 'string' ? imgPath : imgPath?.filename || imgPath?.path;
                        for (const p of imagePaths) {
                            if (p && p.filename === filename) return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

/**
 * Update the favorite button UI
 */
function updateFavoriteButton() {
    const btn = document.getElementById('favorites-btn');
    if (!btn) return;

    if (isCurrentPageFavorited()) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

// ==================== RENDER ====================

/**
 * Render the reader view
 */
export function render() {
    if (state.loading) {
        return `
      <div class="reader-loading">
        <div class="loading-spinner"></div>
        <p>Loading chapter...</p>
      </div>
    `;
    }

    if (!state.manga || !state.images.length) {
        return `
      <div class="reader-error">
        <h2>Failed to load chapter</h2>
        <button class="btn btn-primary" id="reader-back-btn">← Back</button>
      </div>
    `;
    }

    const displayName = state.manga.alias || state.manga.title;
    const chapterNum = state.chapter?.number;
    const spreads = buildSpreads();
    const totalSpreads = spreads.length;
    const totalPages = state.images.length;

    // Determine page counts for display
    let maxPage, currentDisplay;
    if (state.mode === 'webtoon') {
        maxPage = totalPages - 1;
        currentDisplay = `${totalPages} pages`;
    } else if (state.singlePageMode) {
        maxPage = totalPages - 1;
        currentDisplay = `${state.currentPage + 1} / ${totalPages}`;
    } else {
        maxPage = totalSpreads - 1;
        currentDisplay = `${state.currentPage + 1} / ${totalSpreads}`;
    }

    // Check if current page is favorited in any list
    const currentIsFavorited = isCurrentPageFavorited();

    // Check if current page is a trophy
    const currentIsTrophy = isCurrentPageTrophy();

    return `
    <div class="reader ${state.mode}-mode ${state.showControls ? '' : 'controls-hidden'}">
      <!-- Unified Top Bar -->
      <div class="reader-bar">
        <button class="reader-bar-btn close-btn" id="reader-close-btn" title="Back">×</button>
        <div class="reader-title">
          <span class="manga-name">${displayName}</span>
          <span class="chapter-name">Ch. ${chapterNum}</span>
        </div>
        ${state.isCollectionMode ? '' : `
        <div class="reader-bar-tools" id="reader-toolbar">
          <button class="reader-bar-btn ${currentIsFavorited ? 'active' : ''}" id="favorites-btn" title="Add to favorites">⭐</button>
          
          <button class="reader-bar-btn" id="rotate-btn" title="Rotate 90° CW">🔄</button>
          ${state.mode === 'manga' && !state.singlePageMode ? `
            <button class="reader-bar-btn" id="swap-btn" title="Swap pages in spread">⇄</button>
          ` : ''}
          ${state.singlePageMode || state.mode === 'webtoon' ? `
            <button class="reader-bar-btn" id="split-btn" title="Split wide image into halves">✂️</button>
          ` : ''}
          <span class="reader-bar-divider"></span>
          ${state.mode === 'manga' ? `
            <button class="reader-bar-btn ${state.singlePageMode ? 'active' : ''}" id="single-page-btn" title="${state.singlePageMode ? 'Switch to double page' : 'Switch to single page'}">
              ${state.singlePageMode ? '1️⃣' : '2️⃣'}
            </button>
            <button class="reader-bar-btn ${currentIsTrophy ? 'active' : ''}" id="trophy-btn" title="${currentIsTrophy ? 'Unmark trophy' : 'Mark as trophy'}">🏆</button>
          ` : ''}
          <button class="reader-bar-btn" id="fullscreen-btn" title="Toggle fullscreen">⛶</button>
          <button class="reader-bar-btn" id="reader-settings-btn" title="Settings">⚙️</button>
        </div>
        `}
      </div>
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${state.mode === 'webtoon' ? `zoom: ${state.zoom}%` : ''}">
        ${state.isCollectionMode ? renderGalleryContent() : (state.mode === 'webtoon' ? renderWebtoonContent() : renderMangaContent())}
      </div>
      
      <!-- Footer -->
      <div class="reader-footer">
        <button class="btn btn-secondary" id="prev-chapter-btn">← Prev</button>
        <div class="page-slider-container">
          ${state.mode !== 'webtoon' ? `
          <input type="range" class="page-slider" id="page-slider"
            min="0" max="${maxPage}" value="${state.currentPage}"
          >
          ` : ''}
          <span class="page-indicator" id="page-indicator">${currentDisplay}</span>
        </div>
        <button class="btn btn-secondary" id="next-chapter-btn">Next →</button>
      </div>
      
      <!-- Settings panel -->
      <div class="reader-settings hidden" id="reader-settings">
        <div class="settings-panel">
          <h3>Reader Settings</h3>
          <div class="setting-row">
            <label>Mode</label>
            <div class="btn-group">
              <button class="btn ${state.mode === 'webtoon' ? 'btn-primary' : 'btn-secondary'}" data-mode="webtoon">Webtoon</button>
              <button class="btn ${state.mode === 'manga' ? 'btn-primary' : 'btn-secondary'}" data-mode="manga">Manga</button>
            </div>
          </div>
          ${state.mode === 'webtoon' ? `
          <div class="setting-row">
            <label>Zoom: ${state.zoom}%</label>
            <input type="range" min="50" max="200" value="${state.zoom}" id="zoom-slider">
          </div>
          ` : `
          <div class="setting-row">
            <label>Direction</label>
            <div class="btn-group">
              <button class="btn ${state.direction === 'rtl' ? 'btn-primary' : 'btn-secondary'}" data-direction="rtl">RTL ←</button>
              <button class="btn ${state.direction === 'ltr' ? 'btn-primary' : 'btn-secondary'}" data-direction="ltr">→ LTR</button>
            </div>
          </div>
          <div class="settings-divider"></div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="first-page-single" ${state.firstPageSingle ? 'checked' : ''}> First Page Single
            </label>
            <span class="setting-hint">Show cover page alone</span>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="last-page-single" ${state.lastPageSingle ? 'checked' : ''}> 
                Link to Next Chapter
            </label>
            <span class="setting-hint">Pair last page with next chapter's first page</span>
          </div>
          `}
          <button class="btn btn-secondary settings-close-btn" id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>
  `;
}

// ==================== CONTENT RENDERERS ====================

/**
 * Render gallery/collection content (respects saved displayMode: single/double)
 */
function renderGalleryContent() {
    const isManga = state.mode === 'manga';

    if (isManga && !state.singlePageMode) {
        // Spread mode for collections
        const currentSpread = state.images[state.currentPage];
        if (!currentSpread) return '';

        const urls = currentSpread.urls || [currentSpread.url];
        const displayMode = currentSpread.displayMode || 'single';
        const displaySide = currentSpread.displaySide || 'left';

        if (displayMode === 'double' && urls.length >= 2) {
            return `
            <div class="manga-spread collection-spread ${state.direction} double-page">
              <div class="manga-page"><img src="${urls[0]}" alt="Page A"></div>
              <div class="manga-page"><img src="${urls[1]}" alt="Page B"></div>
            </div>
            `;
        } else {
            return `
            <div class="manga-spread collection-spread single ${state.direction}">
              <div class="manga-page"><img src="${urls[0]}" alt="Page"></div>
            </div>
            `;
        }
    }

    // Webtoon or single-page manga mode
    return `
    <div class="${isManga ? 'manga-spread single ' + state.direction : 'gallery-pages'}">
      ${(isManga ? [state.images[state.currentPage]] : state.images).map((spread, idx) => {
        if (!spread) return '';
        const displayMode = spread.displayMode || 'single';
        const displaySide = spread.displaySide || 'left';
        const urls = spread.urls || [spread.url];
        const isDouble = displayMode === 'double' && urls.length >= 2;

        if (isDouble) {
            return `
            <div class="gallery-page double-page side-${displaySide} ${isManga ? 'manga-page' : ''}" data-page="${idx}">
              <img src="${urls[0]}" alt="Page ${idx + 1}A" loading="lazy">
              <img src="${urls[1]}" alt="Page ${idx + 1}B" loading="lazy">
            </div>
          `;
        } else {
            return `
            <div class="gallery-page single-page ${isManga ? 'manga-page' : ''}" data-page="${idx}">
              <img src="${urls[0]}" alt="Page ${idx + 1}" loading="lazy">
            </div>
          `;
        }
    }).join('')}
    </div>
  `;
}

/**
 * Render webtoon (vertical scroll) content
 */
function renderWebtoonContent() {
    return `
    <div class="webtoon-pages">
      ${state.images.map((img, idx) => {
        const imgUrl = typeof img === 'string' ? img : img.url;
        const isTrophy = state.trophyPages[idx];
        return `
        <div class="webtoon-page ${isTrophy ? 'trophy-page' : ''}" data-page="${idx}">
          ${isTrophy ? '<div class="trophy-indicator">🏆</div>' : ''}
          <img src="${imgUrl}" alt="Page ${idx + 1}" loading="lazy">
        </div>
      `;
    }).join('')}
    </div>
  `;
}


/**
 * Render manga (spread) content
 * Handles regular spreads and link spreads (last page + next chapter preview)
 */
function renderMangaContent() {
    if (state.singlePageMode) {
        return renderSinglePageContent();
    }

    const spreads = buildSpreads();
    const currentSpread = spreads[state.currentPage];
    if (!currentSpread) return '';

    // Link spread: last page paired with next chapter's first image
    if (currentSpread.type === 'link') {
        const pageIdx = currentSpread.pages[0];
        const img = state.images[pageIdx];
        const imgUrl = typeof img === 'string' ? img : img.url;
        const isTrophy = state.trophyPages[pageIdx];
        return `
        <div class="manga-spread ${state.direction}">
          <div class="manga-page ${isTrophy ? 'trophy-page' : ''}">
            ${isTrophy ? '<div class="trophy-indicator">🏆</div>' : ''}
            <img src="${imgUrl}" alt="Page ${pageIdx + 1}">
          </div>
          <div class="manga-page link-page" id="link-page">
            <div class="link-overlay">Ch. ${currentSpread.nextChapter} →</div>
            <img src="${currentSpread.nextImage}" alt="Next chapter preview">
          </div>
        </div>
      `;
    }

    // Regular spread
    return `
    <div class="manga-spread ${state.direction}">
      ${currentSpread.map(pageIdx => {
        const img = state.images[pageIdx];
        const imgUrl = typeof img === 'string' ? img : img.url;
        const isTrophy = state.trophyPages[pageIdx];
        return `
        <div class="manga-page ${isTrophy ? 'trophy-page' : ''}">
          ${isTrophy ? '<div class="trophy-indicator">🏆</div>' : ''}
          <img src="${imgUrl}" alt="Page ${pageIdx + 1}">
        </div>
      `;
    }).join('')}
    </div>
  `;
}

/**
 * Render single page mode content
 * Trophy double pages still render as doubles even in single mode
 */
function renderSinglePageContent() {
    const pageIdx = state.currentPage;
    const trophyData = state.trophyPages[pageIdx];

    // Trophy double page: render both pages as spread even in single mode
    if (trophyData && !trophyData.isSingle && trophyData.pages && trophyData.pages.length === 2) {
        const [p1, p2] = trophyData.pages;
        const img1 = state.images[p1];
        const img2 = state.images[p2];
        const url1 = typeof img1 === 'string' ? img1 : img1?.url;
        const url2 = typeof img2 === 'string' ? img2 : img2?.url;
        if (url1 && url2) {
            return `
            <div class="manga-spread ${state.direction}">
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${url1}" alt="Page ${p1 + 1}"></div>
              <div class="manga-page trophy-page"><div class="trophy-indicator">🏆</div><img src="${url2}" alt="Page ${p2 + 1}"></div>
            </div>
            `;
        }
    }

    // Regular single page
    const img = state.images[pageIdx];
    if (!img) return '';
    const imgUrl = typeof img === 'string' ? img : img.url;
    const isTrophy = state.trophyPages[pageIdx];

    return `
    <div class="manga-spread single ${state.direction}">
      <div class="manga-page ${isTrophy ? 'trophy-page' : ''}">
        ${isTrophy ? '<div class="trophy-indicator">🏆</div>' : ''}
        <img src="${imgUrl}" alt="Page ${pageIdx + 1}">
      </div>
    </div>
  `;
}

// ==================== SPREAD BUILDING ====================

/**
 * Build spreads for manga mode
 * When lastPageSingle + nextChapterImage, appends a link spread at the end
 */
function buildSpreads() {
    const spreads = [];
    const total = state.images.length;
    let i = 0;

    // Collection mode has pre-defined spreads/items
    if (state.isCollectionMode) {
        for (let j = 0; j < total; j++) {
            spreads.push([j]);
        }
        return spreads;
    }

    let firstPageSingleApplied = !state.firstPageSingle; // track if we still need to apply it

    while (i < total) {
        const trophyData = state.trophyPages[i];

        // Trophy page handling
        if (trophyData) {
            if (!trophyData.isSingle && trophyData.pages && trophyData.pages.length === 2) {
                // Trophy saved as double spread — show both pages together
                const [p1, p2] = trophyData.pages;
                spreads.push([p1, p2]);
                // Skip both pages (they might not be consecutive indices if something is off, so jump past both)
                i = Math.max(p1, p2) + 1;
            } else {
                // Trophy saved as single
                spreads.push([i]);
                i++;
            }
            continue;
        }

        // First non-trophy page: apply firstPageSingle if not yet applied
        if (!firstPageSingleApplied) {
            firstPageSingleApplied = true;
            spreads.push([i]);
            i++;
            continue;
        }

        // Last page alone (for link mode)?
        if (state.lastPageSingle && i === total - 1) {
            if (state.nextChapterImage) {
                spreads.push({ type: 'link', pages: [i], nextImage: state.nextChapterImage, nextChapter: state.nextChapterNum });
            } else {
                spreads.push([i]);
            }
            i++;
            break;
        }

        if (i + 1 < total) {
            // Check if next page is trophy - if so, current must be single too
            if (state.trophyPages[i + 1]) {
                spreads.push([i]);
                i++;
            } else if (state.lastPageSingle && i + 1 === total - 1) {
                // If next page is the last and should be single
                spreads.push([i]);
                if (state.nextChapterImage) {
                    spreads.push({ type: 'link', pages: [i + 1], nextImage: state.nextChapterImage, nextChapter: state.nextChapterNum });
                } else {
                    spreads.push([i + 1]);
                }
                i += 2;
            } else {
                spreads.push([i, i + 1]);
                i += 2;
            }
        } else {
            spreads.push([i]);
            i++;
        }
    }

    return spreads;
}

// ==================== TROPHY HELPERS ====================

/**
 * Check if the current visible page(s) contain a trophy
 */
function isCurrentPageTrophy() {
    if (state.singlePageMode) {
        return !!state.trophyPages[state.currentPage];
    }
    const spreads = buildSpreads();
    const spread = spreads[state.currentPage];
    if (!spread) return false;
    // Handle both array spreads and link objects
    const spreadPages = Array.isArray(spread) ? spread : (spread.pages || []);
    return spreadPages.some(p => !!state.trophyPages[p]);
}

/**
 * Get the visible page indices for the current view
 */
function getVisiblePages() {
    if (state.singlePageMode) {
        return [state.currentPage];
    }
    const spreads = buildSpreads();
    const spread = spreads[state.currentPage];
    if (!spread) return [];
    // Link spreads are objects with { type: 'link', pages: [...] }
    return Array.isArray(spread) ? spread : (spread.pages || []);
}

/**
 * Toggle trophy status for the current visible page(s)
 * In spread mode, asks which page or full spread to mark
 */
async function toggleCurrentPageTrophy() {
    if (!state.manga || !state.chapter || state.isCollectionMode) return;

    const visiblePages = getVisiblePages();
    if (visiblePages.length === 0) return;

    const anyIsTrophy = visiblePages.some(p => !!state.trophyPages[p]);

    if (anyIsTrophy) {
        // Un-trophy: in single page mode, also remove paired page
        const pagesToRemove = [...visiblePages];
        if (state.singlePageMode) {
            const data = state.trophyPages[state.currentPage];
            if (data && !data.isSingle && data.pages && data.pages.length > 1) {
                pagesToRemove.length = 0;
                pagesToRemove.push(...data.pages);
            }
        }
        pagesToRemove.forEach(p => delete state.trophyPages[p]);
        showToast(`Page${pagesToRemove.length > 1 ? 's' : ''} unmarked as trophy`, 'info');
    } else {
        // In spread mode with 2 pages, ask which page(s) to mark
        let selectedPages = visiblePages;
        let isSingle = state.singlePageMode || visiblePages.length === 1;

        if (!state.singlePageMode && visiblePages.length === 2) {
            const choice = await showPagePicker(visiblePages, 'Mark as trophy 🏆');
            if (!choice) return; // cancelled
            selectedPages = choice.pages;
            isSingle = choice.pages.length === 1;
        }

        selectedPages.forEach(p => {
            state.trophyPages[p] = { isSingle, pages: [...selectedPages] };
        });
        const modeText = isSingle ? 'single' : 'double';
        showToast(`Page${selectedPages.length > 1 ? 's' : ''} marked as trophy (${modeText}) 🏆`, 'success');
    }

    // Save to server
    try {
        await api.saveTrophyPages(state.manga.id, state.chapter.number, state.trophyPages);
    } catch (e) {
        console.error('Failed to save trophy pages:', e);
    }

    // Re-render the spread
    updateSpread();
    // Update trophy button state
    updateTrophyButton();
}

/**
 * Update trophy button active state
 */
function updateTrophyButton() {
    const btn = document.getElementById('trophy-btn');
    if (btn) {
        const isTrophy = isCurrentPageTrophy();
        btn.classList.toggle('active', isTrophy);
        btn.title = isTrophy ? 'Unmark trophy' : 'Mark as trophy';
    }
}

// ==================== FAVORITES HELPERS ====================

/**
 * Check if the current visible page(s) has been favorited
 */
// This function was moved outside render() and updated.
// The previous implementation was here.

/**
 * Update favorite button active state
 */
// This function was moved outside render() and updated.
// The previous implementation was here.

// ==================== READING PROGRESS ====================

/**
 * Calculate and save current reading progress
 */
async function saveCurrentProgress() {
    if (!state.manga || !state.chapter || state.isCollectionMode || !state.images.length) return;

    let currentPage = 1;
    if (state.mode === 'manga') {
        if (state.singlePageMode) {
            currentPage = state.currentPage + 1;
        } else {
            const spreads = buildSpreads();
            const spread = spreads[state.currentPage];
            if (spread && spread.length > 0) {
                currentPage = spread[0] + 1;
            }
        }
    } else {
        // Webtoon - get from scroll position
        const content = document.getElementById('reader-content');
        if (content) {
            const images = content.querySelectorAll('img');
            const scrollTop = content.scrollTop;
            let accumulatedHeight = 0;
            images.forEach((img, i) => {
                if (scrollTop >= accumulatedHeight) {
                    currentPage = i + 1;
                }
                accumulatedHeight += img.offsetHeight;
            });
        }
    }

    try {
        await api.updateReadingProgress(
            state.manga.id,
            state.chapter.number,
            currentPage,
            state.images.length
        );
    } catch (error) {
        console.error('Failed to save progress:', error);
    }
}

// ==================== EVENT LISTENERS ====================

/**
 * Setup event listeners
 */
export function setupListeners() {
    const app = document.getElementById('app');

    // Close button - save progress first
    document.getElementById('reader-close-btn')?.addEventListener('click', async () => {
        await saveCurrentProgress();
        if (state.manga && state.manga.id !== 'gallery') {
            router.go(`/manga/${state.manga.id}`);
        } else {
            router.go('/');
        }
    });

    document.getElementById('reader-back-btn')?.addEventListener('click', () => {
        router.go('/');
    });

    // Settings toggle
    document.getElementById('reader-settings-btn')?.addEventListener('click', () => {
        document.getElementById('reader-settings')?.classList.toggle('hidden');
    });

    document.getElementById('close-settings-btn')?.addEventListener('click', () => {
        document.getElementById('reader-settings')?.classList.add('hidden');
    });

    // Single page mode toggle
    document.getElementById('single-page-btn')?.addEventListener('click', () => {
        // When switching modes, try to preserve position
        if (state.singlePageMode) {
            // Single -> Double: map single page index to spread index
            const spreads = buildSpreads();
            let newSpread = 0;
            for (let i = 0; i < spreads.length; i++) {
                if (spreads[i].includes(state.currentPage)) {
                    newSpread = i;
                    break;
                }
            }
            state.singlePageMode = false;
            state.currentPage = newSpread;
        } else {
            // Double -> Single: map spread index to first page of spread
            const spreads = buildSpreads();
            const spread = spreads[state.currentPage];
            state.singlePageMode = true;
            state.currentPage = spread ? spread[0] : 0;
        }
        fullReRender();
    });

    // Trophy toggle
    document.getElementById('trophy-btn')?.addEventListener('click', () => {
        toggleCurrentPageTrophy();
    });

    // Mode toggle
    app.querySelectorAll('[data-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            const newMode = btn.dataset.mode;
            // Preserve position across mode switch
            let currentImageIndex = getCurrentImageIndex();

            state.mode = newMode;
            localStorage.setItem('reader_mode', state.mode);

            // Map image index to new mode
            if (newMode === 'webtoon') {
                state.currentPage = currentImageIndex;
            } else {
                if (state.singlePageMode) {
                    state.currentPage = currentImageIndex;
                } else {
                    const spreads = buildSpreads();
                    let newSpread = 0;
                    for (let i = 0; i < spreads.length; i++) {
                        if (spreads[i].includes(currentImageIndex)) {
                            newSpread = i;
                            break;
                        }
                    }
                    state.currentPage = newSpread;
                }
            }

            if (state.manga?.id && state.chapter?.number) {
                saveSettings();
            }
            fullReRender();

            // If switching to webtoon, scroll to the image
            if (newMode === 'webtoon') {
                setTimeout(() => {
                    const content = document.getElementById('reader-content');
                    if (content) {
                        const imgs = content.querySelectorAll('img');
                        if (imgs[currentImageIndex]) {
                            imgs[currentImageIndex].scrollIntoView({ behavior: 'auto', block: 'start' });
                        }
                    }
                }, 100);
            }
        });
    });

    // Direction toggle
    app.querySelectorAll('[data-direction]').forEach(btn => {
        btn.addEventListener('click', async () => {
            state.direction = btn.dataset.direction;
            localStorage.setItem('reader_direction', state.direction);
            if (state.manga?.id && state.chapter?.number) {
                await saveSettings();
            }
            fullReRender();
        });
    });

    // Checkboxes
    document.getElementById('first-page-single')?.addEventListener('change', async (e) => {
        state.firstPageSingle = e.target.checked;
        await saveSettings();
        updateSpread();
    });

    document.getElementById('last-page-single')?.addEventListener('change', async (e) => {
        state.lastPageSingle = e.target.checked;
        await saveSettings();
        // Fetch or clear next chapter preview for link mode
        if (state.lastPageSingle && state.manga?.id && state.chapter?.number) {
            await fetchNextPreview();
        } else {
            state.nextChapterImage = null;
            state.nextChapterNum = null;
        }
        updateSpread();
    });

    // Zoom slider
    document.getElementById('zoom-slider')?.addEventListener('input', (e) => {
        state.zoom = parseInt(e.target.value);
        const content = document.getElementById('reader-content');
        if (content) {
            content.style.zoom = `${state.zoom}%`;
        }
    });

    // Page slider
    const pageSlider = document.getElementById('page-slider');
    if (pageSlider) {
        pageSlider.addEventListener('input', (e) => {
            // Preview: update indicator only
            const val = parseInt(e.target.value);
            const indicator = document.getElementById('page-indicator');
            if (indicator) {
                if (state.singlePageMode) {
                    indicator.textContent = `${val + 1} / ${state.images.length}`;
                } else {
                    indicator.textContent = `${val + 1} / ${buildSpreads().length}`;
                }
            }
        });
        pageSlider.addEventListener('change', (e) => {
            // Navigate to page
            state.currentPage = parseInt(e.target.value);
            updateSpread();
        });
    }

    // Manga mode navigation (click left/center/right zones)
    if (state.mode === 'manga') {
        const content = document.getElementById('reader-content');
        content?.addEventListener('click', (e) => {
            // Don't toggle if clicking a button or link
            if (e.target.closest('button, a, .link-overlay')) return;

            const rect = content.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ratio = x / rect.width;

            if (ratio < 0.3) {
                // Left 30% — navigate back
                prevPage();
            } else if (ratio > 0.7) {
                // Right 30% — navigate forward
                nextPage();
            } else {
                // Center 40% — toggle controls
                state.showControls = !state.showControls;
                document.querySelector('.reader')?.classList.toggle('controls-hidden', !state.showControls);
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Chapter navigation
    document.getElementById('prev-chapter-btn')?.addEventListener('click', () => navigateChapter(-1));
    document.getElementById('next-chapter-btn')?.addEventListener('click', () => navigateChapter(1));

    // Toggle controls on tap (webtoon mode)
    if (state.mode === 'webtoon') {
        document.getElementById('reader-content')?.addEventListener('click', () => {
            state.showControls = !state.showControls;
            document.querySelector('.reader')?.classList.toggle('controls-hidden', !state.showControls);
        });
    }

    // ==================== PAGE MANIPULATION TOOLBAR ====================

    // Rotate 90° CW
    document.getElementById('rotate-btn')?.addEventListener('click', async () => {
        const filename = getCurrentPageFilename();
        if (!filename || !state.manga || !state.chapter) return;

        try {
            showToast('Rotating...', 'info');
            const result = await api.rotatePage(state.manga.id, state.chapter.number, filename);
            if (result.images) {
                await reloadImages(result.images);
                showToast('Page rotated', 'success');
            }
        } catch (e) {
            showToast('Rotate failed: ' + e.message, 'error');
        }
    });

    // Swap pages in spread
    document.getElementById('swap-btn')?.addEventListener('click', async () => {
        const spreads = buildSpreads();
        const spread = spreads[state.currentPage];
        if (!spread || spread.length !== 2 || !state.manga || !state.chapter) {
            showToast('Select a spread with 2 pages to swap', 'info');
            return;
        }

        const fnA = getFilenameFromUrl(state.images[spread[0]]);
        const fnB = getFilenameFromUrl(state.images[spread[1]]);
        if (!fnA || !fnB) return;

        try {
            showToast('Swapping...', 'info');
            const result = await api.swapPages(state.manga.id, state.chapter.number, fnA, fnB);
            if (result.images) {
                await reloadImages(result.images);
                showToast('Pages swapped', 'success');
            }
        } catch (e) {
            showToast('Swap failed: ' + e.message, 'error');
        }
    });

    // Split page
    document.getElementById('split-btn')?.addEventListener('click', async () => {
        const filename = getCurrentPageFilename();
        if (!filename || !state.manga || !state.chapter) return;

        if (!confirm('Split this page into halves? This is permanent.')) return;

        const splitBtn = document.getElementById('split-btn');

        try {
            // Clear images and show loading - this unloads images from browser
            showToast('Preparing to split...', 'info');
            if (splitBtn) splitBtn.disabled = true;

            // Clear images first to unload them
            state.images = [];
            state.loading = true;

            // Re-render to show loading animation (this will show the spinner)
            app.innerHTML = render();

            // Wait longer to ensure images are fully unloaded from browser
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Now perform the split operation (keep loading true while this happens)
            showToast('Splitting page...', 'info');
            const result = await api.splitPage(state.manga.id, state.chapter.number, filename);

            // Re-enable button
            if (splitBtn) splitBtn.disabled = false;

            // Load the chapter fresh - this will set loading=false when done
            await loadData(state.manga.id, state.chapter.number, state.chapter.versionUrl);

            // Re-render the app to dismiss the loading spinner
            app.innerHTML = render();
            setupListeners();

            // Restore page position
            updateSpread();

            if (result.warning) {
                showToast(result.warning, 'warning');
            } else {
                showToast('Page split into halves', 'success');
            }
        } catch (e) {
            // On error, reload to restore state
            if (splitBtn) splitBtn.disabled = false;
            showToast('Split failed: ' + e.message, 'error');
            await loadData(state.manga.id, state.chapter.number, state.chapter.versionUrl);
            app.innerHTML = render();
            setupListeners();
        }
    });

    // Delete page
    document.getElementById('delete-page-btn')?.addEventListener('click', async () => {
        const filename = getCurrentPageFilename();
        if (!filename || !state.manga || !state.chapter) return;

        if (!confirm(`Delete page "${filename}" permanently? This cannot be undone.`)) return;

        try {
            showToast('Deleting...', 'info');
            const result = await api.deletePage(state.manga.id, state.chapter.number, filename);
            if (result.images) {
                await reloadImages(result.images);
                showToast('Page deleted', 'success');
            }
        } catch (e) {
            showToast('Delete failed: ' + e.message, 'error');
        }
    });

    // Favorites button — open modal
    document.getElementById('favorites-btn')?.addEventListener('click', async () => {
        // Fetch lists and populate
        try {
            const data = await api.getFavorites();
            state.allFavorites = data;
            state.favoriteLists = Object.keys(data.favorites || data || {});
        } catch (e) {
            console.error('Failed to load favorites', e);
            showToast('Failed to load favorites', 'error');
            return;
        }

        const currentIndex = getCurrentImageIndex();
        let pagesToFavorite = [currentIndex];

        // In spread mode, ask which page if applicable
        if (state.mode === 'manga' && !state.singlePageMode) {
            const spreads = buildSpreads();
            const spread = spreads[state.currentPage];
            if (spread && Array.isArray(spread)) {
                pagesToFavorite = spread;
            } else if (spread && spread.pages) {
                pagesToFavorite = spread.pages;
            }
        }

        if (pagesToFavorite.length > 1) {
            const choice = await showPagePicker(pagesToFavorite, 'Select Page for Favorites ⭐');
            if (!choice) return; // User cancelled
            pagesToFavorite = choice.pages;
        }

        // Show the list picker modal
        showListPicker(pagesToFavorite);
    });

    // Fullscreen toggle
    document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen().catch(() => {
                showToast('Fullscreen not supported', 'info');
            });
        }
    });

    // Hide reader class on body
    document.body.classList.add('reader-active');
}

// ==================== PAGE MANIPULATION HELPERS ====================

/**
 * Extract filename from image URL
 * e.g. "/api/public/chapter-images/123/4/page001.jpg?_t=123" → "page001.jpg"
 */
function getFilenameFromUrl(img) {
    const url = typeof img === 'string' ? img : img?.url || img?.urls?.[0];
    if (!url) return null;
    // Strip query params (e.g. cache-busting ?_t=xxx)
    const cleanUrl = url.split('?')[0];
    const parts = cleanUrl.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
}

/**
 * Get filename of the current visible page (first page in spread/single)
 */
function getCurrentPageFilename() {
    const pages = getVisiblePages();
    if (pages.length === 0) return null;
    return getFilenameFromUrl(state.images[pages[0]]);
}

/**
 * Reload images from server response and update display
 */
async function reloadImages(newImages) {
    // Add cache bust to force reload of rotated/modified images
    const bust = Date.now();
    state.images = newImages.map(url => url + (url.includes('?') ? '&' : '?') + `_t=${bust}`);

    // Clamp current page
    if (state.mode === 'manga') {
        if (state.singlePageMode) {
            state.currentPage = Math.min(state.currentPage, state.images.length - 1);
        } else {
            const spreads = buildSpreads();
            state.currentPage = Math.min(state.currentPage, spreads.length - 1);
        }
    }
    state.currentPage = Math.max(0, state.currentPage);

    updateSpread();
}

/**
 * Add current page info to a favorites list
 * In spread mode, asks which page or full spread to save
 */
async function addToFavoriteList(listName) {
    if (!state.manga || !state.chapter) return;

    let pages = getVisiblePages();
    if (pages.length === 0) {
        showToast('No page selected', 'info');
        return;
    }

    // In spread mode with 2 pages, ask which page(s) to save
    if (!state.singlePageMode && pages.length === 2) {
        const choice = await showPagePicker(pages, `Add to "${listName}" ⭐`);
        if (!choice) return; // cancelled
        pages = choice.pages;
    }

    // Build imagePaths from selected pages
    const imagePaths = pages.map(idx => {
        const fn = getFilenameFromUrl(state.images[idx]);
        return fn ? { filename: fn } : null;
    }).filter(Boolean);

    const displayMode = pages.length > 1 ? 'double' : 'single';

    const favoriteItem = {
        mangaId: state.manga.id,
        chapterNum: state.chapter.number,
        title: `${state.manga.alias || state.manga.title} Ch.${state.chapter.number} p${pages[0] + 1}`,
        imagePaths,
        displayMode,
        displaySide: state.direction === 'rtl' ? 'right' : 'left'
    };

    try {
        await api.addFavoriteItem(listName, favoriteItem);
        showToast(`Added to "${listName}" ⭐`, 'success');
    } catch (e) {
        showToast('Failed to add favorite: ' + e.message, 'error');
    }
}

/**
 * Delete a specific mapped favorite item from a list
 */
async function removeFavoriteItem(listName, item) {
    if (!state.manga || !state.chapter) return;

    // Deleting from favorites requires the index/timestamp or the precise object according to the backend
    // Since we don't have the explicit backend removal endpoint for a single image,
    // wait, we would need to look at library backend for deletion.
    // The library DELETE /api/favorites/:list is for deleting the whole list.
    // To remove an item, there's `deleteFavoriteItem`.
    // Let's implement it in api.js if it doesn't exist, or pass the info.
    try {
        await api.removeFavoriteItem(listName, item);
        showToast(`Removed from "${listName}"`, 'info');
    } catch (e) {
        showToast('Failed to remove favorite: ' + e.message, 'error');
        throw e;
    }
}

/**
 * Fetch next chapter's first image for link mode
 */
async function fetchNextPreview() {
    if (!state.manga?.id || !state.chapter?.number) return;
    try {
        const data = await api.getNextChapterPreview(state.manga.id, state.chapter.number);
        state.nextChapterImage = data.firstImage || null;
        state.nextChapterNum = data.nextChapter || null;
    } catch (e) {
        state.nextChapterImage = null;
        state.nextChapterNum = null;
    }
}

/**
 * Show a version selection modal and return the chosen URL
 * Returns the selected version URL, or null if cancelled
 */
function showVersionSelector(versions, chapterNum) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'version-modal-overlay';
        overlay.innerHTML = `
            <div class="version-modal">
                <h3>Chapter ${chapterNum} has ${versions.length} versions</h3>
                <p>Select which version to read:</p>
                <div class="version-list"></div>
                <button class="version-cancel">Cancel</button>
            </div>
        `;
        const listEl = overlay.querySelector('.version-list');
        versions.forEach((url, idx) => {
            const btn = document.createElement('button');
            btn.className = 'version-item';
            btn.textContent = `Version ${idx + 1}`;
            btn.addEventListener('click', () => {
                overlay.remove();
                resolve(url);
            });
            listEl.appendChild(btn);
        });
        overlay.querySelector('.version-cancel').addEventListener('click', () => {
            overlay.remove();
            resolve(null);
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
                resolve(null);
            }
        });
        document.body.appendChild(overlay);
    });
}

/**
 * Show a list picker modal for favorites
 * Shows all available lists and allows adding/removing the current page(s)
 */
function showListPicker(pages) {
    if (!state.manga || !state.chapter) return;

    // Build imagePaths from selected pages
    const imagePaths = pages.map(idx => {
        const fn = getFilenameFromUrl(state.images[idx]);
        return fn ? { filename: fn } : null;
    }).filter(Boolean);

    // Helper to check if current selection is in a specific list
    const isInList = (listName) => {
        if (!state.allFavorites || !state.allFavorites.favorites) return -1;
        const listItems = state.allFavorites.favorites[listName];
        if (!Array.isArray(listItems)) return -1;

        for (let i = 0; i < listItems.length; i++) {
            const item = listItems[i];
            if (item.mangaId === state.manga.id && item.chapterNum === state.chapter.number) {
                if (item.imagePaths) {
                    for (const imgPath of item.imagePaths) {
                        const filename = typeof imgPath === 'string' ? imgPath : imgPath?.filename || imgPath?.path;
                        for (const p of imagePaths) {
                            if (p && p.filename === filename) return i;
                        }
                    }
                }
            }
        }
        return -1;
    };

    const overlay = document.createElement('div');
    overlay.className = 'page-picker-overlay';

    // We'll reuse the page-picker-modal styles since it shares the centered layout we want
    let listsHtml = '';
    if (state.favoriteLists.length === 0) {
        listsHtml = '<div style="margin: 20px 0; color: #888;">No favorite lists available.</div>';
    } else {
        listsHtml = `<div class="favorite-list-selection" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 400px; overflow-y: auto;">`;
        state.favoriteLists.forEach(listName => {
            const existingIndex = isInList(listName);
            const isExisting = existingIndex !== -1;
            listsHtml += `
                <button class="page-picker-option list-option ${isExisting ? 'active-list' : ''}" data-list="${listName}" style="width: 100%; text-align: left; padding: 12px 15px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1.1em; font-weight: bold;">${listName}</span>
                    <span style="font-size: 1.2em;">${isExisting ? '✅' : '➕'}</span>
                </button>
            `;
        });
        listsHtml += `</div>`;
    }

    overlay.innerHTML = `
        <div class="page-picker-modal" style="width: 90%; max-width: 400px;">
            <h3>Favorites ⭐</h3>
            <p class="page-picker-subtitle" style="margin-bottom: 20px;">Manage favorite lists</p>
            ${listsHtml}
            <div style="display: flex; gap: 10px;">
                <button class="page-picker-cancel" style="flex: 1;">Close</button>
            </div>
        </div>
    `;

    // Add CSS for active list option dynamically just for this modal
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        .list-option.active-list {
            background: #2a3b2a;
            border-color: #4CAF50;
        }
        .list-option.active-list:hover {
            background: #384d38;
        }
    `;
    overlay.appendChild(styleEl);

    // Event listeners
    const cancelBtn = overlay.querySelector('.page-picker-cancel');
    cancelBtn.addEventListener('click', () => {
        overlay.remove();
        updateFavoriteButton();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            updateFavoriteButton();
        }
    });

    // Handle adding/removing from lists
    const listBtns = overlay.querySelectorAll('.list-option');
    listBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const listName = btn.dataset.list;

            // Re-evaluate existing index dynamically in case it changed
            // This ensures if the user clicks quickly we don't use stale index
            const existingIndex = isInList(listName);
            const isExisting = existingIndex !== -1;

            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';

            try {
                if (isExisting) {
                    // Remove it
                    await api.removeFavoriteItem(listName, existingIndex);
                    // Update local state by refetching
                    const data = await api.getFavorites();
                    state.allFavorites = data;

                    // Update button UI
                    btn.classList.remove('active-list');
                    btn.querySelector('span:last-child').textContent = '➕';
                } else {
                    // Add it
                    const displayMode = pages.length > 1 ? 'double' : 'single';
                    const favoriteItem = {
                        mangaId: state.manga.id,
                        chapterNum: state.chapter.number,
                        title: `${state.manga.alias || state.manga.title} Ch.${state.chapter.number} p${pages[0] + 1}`,
                        imagePaths,
                        displayMode,
                        displaySide: state.direction === 'rtl' ? 'right' : 'left'
                    };

                    await api.addFavoriteItem(listName, favoriteItem);
                    // Update local state by refetching
                    const data = await api.getFavorites();
                    state.allFavorites = data;

                    // Update button UI
                    btn.classList.add('active-list');
                    btn.querySelector('span:last-child').textContent = '✅';
                }
            } catch (e) {
                console.error(e);
            } finally {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        });
    });

    document.body.appendChild(overlay);
}

/**
 * Show a page picker dialog when in spread mode
 * Shows thumbnails of both pages and lets user choose left, right, or full spread
 * Returns { pages: [indices] } or null if cancelled
 */
function showPagePicker(visiblePages, actionTitle) {
    return new Promise((resolve) => {
        const [p1, p2] = visiblePages;
        const img1 = state.images[p1];
        const img2 = state.images[p2];
        const url1 = typeof img1 === 'string' ? img1 : img1?.url;
        const url2 = typeof img2 === 'string' ? img2 : img2?.url;

        // In RTL mode, the display order is swapped
        const isRtl = state.direction === 'rtl';
        const leftPage = isRtl ? p2 : p1;
        const rightPage = isRtl ? p1 : p2;
        const leftUrl = isRtl ? url2 : url1;
        const rightUrl = isRtl ? url1 : url2;

        const overlay = document.createElement('div');
        overlay.className = 'page-picker-overlay';
        overlay.innerHTML = `
            <div class="page-picker-modal">
                <h3>${actionTitle}</h3>
                <p class="page-picker-subtitle">Which page do you want?</p>
                <div class="page-picker-previews">
                    <button class="page-picker-option" data-choice="left" title="Page ${leftPage + 1}">
                        <img src="${leftUrl}" alt="Page ${leftPage + 1}">
                        <span class="page-picker-label">Page ${leftPage + 1}</span>
                    </button>
                    <button class="page-picker-option" data-choice="right" title="Page ${rightPage + 1}">
                        <img src="${rightUrl}" alt="Page ${rightPage + 1}">
                        <span class="page-picker-label">Page ${rightPage + 1}</span>
                    </button>
                </div>
                <button class="page-picker-option spread-option" data-choice="both">
                    📖 Full Spread (both pages)
                </button>
                <button class="page-picker-cancel">Cancel</button>
            </div>
        `;

        const cleanup = (result) => {
            overlay.remove();
            resolve(result);
        };

        overlay.querySelectorAll('.page-picker-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.choice;
                if (choice === 'left') cleanup({ pages: [leftPage] });
                else if (choice === 'right') cleanup({ pages: [rightPage] });
                else if (choice === 'both') cleanup({ pages: visiblePages });
            });
        });

        overlay.querySelector('.page-picker-cancel').addEventListener('click', () => cleanup(null));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cleanup(null);
        });

        document.body.appendChild(overlay);
    });
}

// ==================== NAVIGATION ====================

/**
 * Get current image index from the current view state
 */
function getCurrentImageIndex() {
    if (state.mode === 'webtoon') {
        const content = document.getElementById('reader-content');
        if (content) {
            const images = content.querySelectorAll('img');
            if (images.length > 0) {
                const scrollTop = content.scrollTop;
                if (scrollTop > 10) {
                    let currentY = 0;
                    for (let i = 0; i < images.length; i++) {
                        const h = images[i].offsetHeight;
                        if (currentY + h > scrollTop) {
                            return i;
                        }
                        currentY += h;
                    }
                }
            }
        }
        return 0;
    } else if (state.singlePageMode) {
        return state.currentPage;
    } else {
        const spreads = buildSpreads();
        const spread = spreads[state.currentPage];
        return spread && spread.length > 0 ? spread[0] : 0;
    }
}

/**
 * Handle keyboard navigation
 */
function handleKeyboard(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'Escape') {
        saveCurrentProgress();
        if (state.manga) {
            router.go(`/manga/${state.manga.id}`);
        }
        return;
    }

    if (state.mode === 'manga') {
        if (e.key === 'ArrowLeft') {
            if (state.direction === 'rtl') nextPage();
            else prevPage();
        } else if (e.key === 'ArrowRight') {
            if (state.direction === 'rtl') prevPage();
            else nextPage();
        } else if (e.key === ' ') {
            e.preventDefault();
            nextPage();
        }
    } else if (state.mode === 'webtoon') {
        if (e.key === ' ') {
            e.preventDefault();
            const content = document.getElementById('reader-content');
            if (content) {
                const step = content.clientHeight * 0.8;
                content.scrollBy({ top: e.shiftKey ? -step : step, behavior: 'smooth' });
            }
        }
    }
}

/**
 * Navigate to next page (manga mode)
 */
function nextPage() {
    const spreads = buildSpreads();
    const maxPage = state.singlePageMode ? state.images.length - 1 : spreads.length - 1;
    if (state.currentPage < maxPage) {
        state.currentPage++;
        updateSpread();
    } else {
        // End of chapter - check if we're on a link spread
        const currentSpread = spreads[state.currentPage];
        const isLinkSpread = currentSpread && currentSpread.type === 'link';

        // Save progress before navigating
        saveCurrentProgress();

        // If on link spread, set direction to skip first page of next chapter
        if (isLinkSpread) {
            state.navigationDirection = 'next-linked';
        }

        navigateChapter(1);
    }
}

/**
 * Navigate to previous page (manga mode)
 */
function prevPage() {
    if (state.currentPage > 0) {
        state.currentPage--;
        updateSpread();
    } else {
        // Start of chapter - go to previous
        navigateChapter(-1);
    }
}

/**
 * Update the spread display (partial re-render)
 */
function updateSpread() {
    const content = document.getElementById('reader-content');
    if (content) {
        content.innerHTML = state.isCollectionMode ? renderGalleryContent() : (state.mode === 'webtoon' ? renderWebtoonContent() : renderMangaContent());

        // Update page indicator
        const indicator = document.getElementById('page-indicator');
        if (indicator) {
            if (state.singlePageMode) {
                indicator.textContent = `${state.currentPage + 1} / ${state.images.length}`;
            } else {
                indicator.textContent = `${state.currentPage + 1} / ${buildSpreads().length}`;
            }
        }

        // Update slider
        const slider = document.getElementById('page-slider');
        if (slider) {
            slider.value = state.currentPage;
            slider.max = state.singlePageMode ? state.images.length - 1 : buildSpreads().length - 1;
        }

        // Update trophy button
        updateTrophyButton();

        // Update favorite button
        updateFavoriteButton();
    }
}

/**
 * Full re-render (used when mode/settings change)
 */
function fullReRender() {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = render();
        setupListeners();
    }
}

/**
 * Navigate to adjacent chapter
 */
async function navigateChapter(delta) {
    console.log('[Nav] navigateChapter called with delta:', delta);
    if (!state.manga || !state.chapter) {
        console.log('[Nav] early return - no manga or chapter');
        return;
    }

    // Save progress before navigating
    await saveCurrentProgress();

    const chapters = state.manga.downloadedChapters || [];
    const sorted = [...chapters].sort((a, b) => a - b);
    const currentIdx = sorted.indexOf(state.chapter.number);
    const newIdx = currentIdx + delta;
    console.log('[Nav]', { delta, chapterNumber: state.chapter.number, sorted, currentIdx, newIdx });

    if (newIdx >= 0 && newIdx < sorted.length) {
        // Set navigation direction so the next chapter opens at the right position
        // Only set if not already set (e.g., from link spread navigation)
        if (!state.navigationDirection) {
            state.navigationDirection = delta < 0 ? 'prev' : null;
        }
        const nextChapterNum = sorted[newIdx];
        // Find downloaded version URL for the next chapter
        const downloadedVersions = state.manga.downloadedVersions || {};
        const versions = downloadedVersions[nextChapterNum] || [];
        const versionUrl = Array.isArray(versions) ? versions[0] : versions;
        const versionParam = versionUrl ? `?version=${encodeURIComponent(versionUrl)}` : '';
        console.log('[Nav] Calling router.go with:', `/read/${state.manga.id}/${nextChapterNum}${versionParam}`);
        router.go(`/read/${state.manga.id}/${nextChapterNum}${versionParam}`);
    } else {
        showToast(delta > 0 ? 'Last chapter' : 'First chapter', 'info');
    }
}

// ==================== DATA LOADING ====================

/**
 * Load chapter data
 */
async function loadData(mangaId, chapterNum, versionUrl) {
    console.log('[Reader] loadData called:', { mangaId, chapterNum, versionUrl });
    try {
        // Load settings from localStorage
        state.mode = localStorage.getItem('reader_mode') || 'webtoon';
        state.direction = localStorage.getItem('reader_direction') || 'rtl';

        // Special handling for Favorite Galleries
        if (mangaId === 'gallery') {
            const listName = decodeURIComponent(chapterNum);
            const favoritesData = await api.getFavorites();
            const list = favoritesData.favorites?.[listName] || [];

            state.images = [];

            for (const item of list) {
                const imagePaths = item.imagePaths || [];
                const urls = [];
                for (const imgPath of imagePaths) {
                    let filename;
                    if (typeof imgPath === 'string') {
                        filename = imgPath;
                    } else if (imgPath && typeof imgPath === 'object') {
                        filename = imgPath.filename || imgPath.path || imgPath.name || imgPath.url;
                        if (filename && filename.includes('/')) filename = filename.split('/').pop();
                        if (filename && filename.includes('\\')) filename = filename.split('\\').pop();
                    }
                    if (!filename) continue;
                    urls.push(`/api/public/chapter-images/${item.mangaId}/${item.chapterNum}/${encodeURIComponent(filename)}`);
                }
                if (urls.length > 0) {
                    state.images.push({
                        urls: urls,
                        displayMode: item.displayMode || 'single',
                        displaySide: item.displaySide || 'left'
                    });
                }
            }

            state.manga = { id: 'gallery', title: listName, alias: listName };
            state.chapter = { number: 'Gallery' };
            state.isGalleryMode = true;
            state.isCollectionMode = true;

            if (state.images.length === 0) {
                showToast('Gallery is empty', 'warning');
            }
        } else if (mangaId === 'trophies') {
            // Trophy Viewer Mode
            const subId = chapterNum; // could be mangaId or 'series/seriesId'
            let trophyItems = [];
            let displayName = 'Trophies';

            if (subId.startsWith('series-')) {
                const seriesId = subId.replace('series-', '');
                const seriesData = await store.loadSeries();
                const series = seriesData.find(s => s.id === seriesId);
                displayName = series ? (series.alias || series.title) : 'Series Trophies';

                // Get all manga in this series
                const bookmarks = await store.loadBookmarks();
                const mangaInSeries = bookmarks.filter(b => b.seriesId === seriesId);

                for (const manga of mangaInSeries) {
                    const pages = await api.getTrophyPagesAll(manga.id);
                    // Format into virtual spreads
                    for (const chNum in pages) {
                        for (const pgIdx in pages[chNum]) {
                            const data = pages[chNum][pgIdx];
                            const images = await api.getChapterImages(manga.id, chNum);
                            const imgUrl = images.images[pgIdx];
                            const filename = typeof imgUrl === 'string' ? imgUrl.split('/').pop() : imgUrl?.filename || imgUrl?.path;

                            trophyItems.push({
                                mangaId: manga.id,
                                chapterNum: chNum,
                                imagePaths: [{ filename }],
                                displayMode: data.isSingle ? 'single' : 'double',
                                displaySide: 'left' // default
                            });
                        }
                    }
                }
            } else {
                // Individual manga trophies
                const manga = await api.getBookmark(subId);
                displayName = manga ? (manga.alias || manga.title) : 'Manga Trophies';
                const pages = await api.getTrophyPagesAll(subId);

                for (const chNum in pages) {
                    for (const pgIdx in pages[chNum]) {
                        const data = pages[chNum][pgIdx];
                        const images = await api.getChapterImages(subId, chNum);
                        const imgUrl = images.images[pgIdx];
                        const filename = typeof imgUrl === 'string' ? imgUrl.split('/').pop() : imgUrl?.filename || imgUrl?.path;

                        trophyItems.push({
                            mangaId: subId,
                            chapterNum: chNum,
                            imagePaths: [{ filename: decodeURIComponent(filename) }],
                            displayMode: data.isSingle ? 'single' : 'double',
                            displaySide: 'left'
                        });
                    }
                }
            }

            state.images = trophyItems.map(item => {
                const filename = item.imagePaths[0].filename;
                const url = `/api/public/chapter-images/${item.mangaId}/${item.chapterNum}/${encodeURIComponent(filename)}`;
                return {
                    urls: [url],
                    displayMode: item.displayMode,
                    displaySide: item.displaySide
                };
            });

            state.manga = { id: 'trophies', title: displayName, alias: displayName };
            state.chapter = { number: '🏆' };
            state.isCollectionMode = true;
            state.isGalleryMode = false;

        } else {
            // Standard Manga Reader Mode
            state.isGalleryMode = false;
            const manga = await api.getBookmark(mangaId);
            state.manga = manga;
            console.log('[Reader] manga loaded, finding chapter...');
            state.chapter = manga.chapters?.find(c => c.number === parseFloat(chapterNum)) || { number: parseFloat(chapterNum) };

            // Get images (optionally from a specific version)
            const imagesEndpoint = versionUrl
                ? `/bookmarks/${mangaId}/chapters/${chapterNum}/reader-images?version=${encodeURIComponent(versionUrl)}`
                : `/bookmarks/${mangaId}/chapters/${chapterNum}/reader-images`;
            const result = await api.get(imagesEndpoint);
            console.log('[Reader] images loaded, count:', result.images?.length);
            state.images = result.images || [];

            // Fetch chapter settings
            try {
                const settings = await api.getChapterSettings(mangaId, chapterNum);
                if (settings) {
                    if (settings.mode) state.mode = settings.mode;
                    if (settings.direction) state.direction = settings.direction;
                    if (settings.firstPageSingle !== undefined) state.firstPageSingle = settings.firstPageSingle;
                    if (settings.lastPageSingle !== undefined) state.lastPageSingle = settings.lastPageSingle;
                }
            } catch (e) {
                console.warn('Failed to load chapter settings', e);
            }

            // Fetch trophy pages
            try {
                const trophyData = await api.getTrophyPages(mangaId, chapterNum);
                state.trophyPages = trophyData || {};
            } catch (e) {
                console.warn('Failed to load trophy pages', e);
            }

            // Fetch favorites state to highlight the button
            try {
                const data = await api.getFavorites();
                state.allFavorites = data;
                state.favoriteLists = Object.keys(data.favorites || data || {});
            } catch (e) {
                console.warn('Failed to load favorites', e);
            }
        } // End of else (standard manga mode)

        // Resume reading progress
        const targetNum = parseFloat(chapterNum);
        const progress = state.manga?.readingProgress?.[targetNum];
        if (progress && progress.page < progress.totalPages) {
            if (state.mode === 'manga') {
                if (state.singlePageMode) {
                    state.currentPage = Math.max(0, progress.page - 1);
                } else {
                    // Map page index to spread index
                    const pageIdx = Math.max(0, progress.page - 1);
                    const spreads = buildSpreads();
                    let spreadIdx = 0;
                    for (let i = 0; i < spreads.length; i++) {
                        const sp = spreads[i];
                        const pages = Array.isArray(sp) ? sp : (sp.pages || []);
                        if (pages.includes(pageIdx) || (pages[0] >= pageIdx)) {
                            spreadIdx = i;
                            break;
                        }
                        spreadIdx = i;
                    }
                    state.currentPage = spreadIdx;
                }
            } else {
                // Webtoon: we'll scroll after render
                state.currentPage = 0;
                state._resumeScrollToPage = progress.page - 1;
            }
        } else {
            state.currentPage = 0;
        }

    } catch (e) {
        console.error('Error loading chapter:', e);
        showToast('Failed to load chapter', 'error');
    }

    // Apply navigation direction (overrides progress)
    if (state.navigationDirection === 'prev' && state.mode === 'manga') {
        if (state.singlePageMode) {
            state.currentPage = Math.max(0, state.images.length - 1);
        } else {
            const spreads = buildSpreads();
            state.currentPage = Math.max(0, spreads.length - 1);
        }
    } else if (state.navigationDirection === 'next-linked' && state.mode === 'manga') {
        // Skip first page of new chapter if we navigated via link spread
        if (state.images.length > 1) {
            if (state.singlePageMode) {
                state.currentPage = 1; // page index 1
            } else {
                const spreads = buildSpreads();
                // Find spread containing page 1
                let spreadIdx = 0;
                for (let i = 0; i < spreads.length; i++) {
                    const sp = spreads[i];
                    const pages = Array.isArray(sp) ? sp : (sp.pages || []);
                    if (pages.includes(1)) {
                        spreadIdx = i;
                        break;
                    }
                }
                state.currentPage = spreadIdx;
            }
        }
    }

    // Clear navigation direction
    state.navigationDirection = null;

    // Fetch next chapter preview
    if (state.lastPageSingle) {
        await fetchNextPreview();
    }

    state.loading = false;
    fullReRender();

    // Scroll to resumed page in webtoon mode
    if (state.mode === 'webtoon' && state._resumeScrollToPage) {
        setTimeout(() => {
            const content = document.getElementById('reader-content');
            if (content) {
                const imgs = content.querySelectorAll('img');
                if (imgs[state._resumeScrollToPage]) {
                    imgs[state._resumeScrollToPage].scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            }
            delete state._resumeScrollToPage;
        }, 300); // Wait for images to start rendering
    }
}

/**
 * Initialize and load chapter
 */
export async function init(mangaId, chapterNum, versionUrl) {
    state.loading = true;

    // Prevent scrolling default behavior for arrow keys so page doesn't jump
    const preventScroll = (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key) && e.target === document.body) {
            e.preventDefault();
        }
    };
    window.addEventListener('keydown', preventScroll, { passive: false });

    await loadData(mangaId, chapterNum, versionUrl);

    // Initial render
    fullReRender();

    // Cleanup when leaving route
    return () => {
        window.removeEventListener('keydown', preventScroll);
        document.removeEventListener('keydown', handleKeyboard);
        document.body.classList.remove('reader-active');
    };
}



// ==================== LIFECYCLE ====================

/**
 * Mount the reader view
 */
export async function mount(params = []) {
    console.log('[Reader] mount called with params:', params);
    let [mangaId, chapterNum] = params;
    
    // Parse ?version= from chapterNum (router concatenates query params with last path segment)
    let urlVersionParam = null;
    if (chapterNum && chapterNum.includes('?')) {
        const [num, queryStr] = chapterNum.split('?');
        chapterNum = num;
        const queryParams = new URLSearchParams(queryStr);
        urlVersionParam = queryParams.get('version');
    }
    console.log('[Reader] mangaId:', mangaId, 'chapterNum:', chapterNum, 'urlVersion:', urlVersionParam);

    if (!mangaId || !chapterNum) {
        router.go('/');
        return;
    }

    const app = document.getElementById('app');

    // Reset state for new chapter
    state.loading = true;
    console.log('[Reader] loading set to true, calling loadData...');
    state.images = [];
    state.singlePageMode = false;
    state._resumeScrollToPage = null;
    state.nextChapterImage = null;
    state.nextChapterNum = null;
    app.innerHTML = render();

    // If version URL was provided via URL parameter, use it directly
    if (urlVersionParam) {
        await loadData(mangaId, chapterNum, decodeURIComponent(urlVersionParam));
    } else {
        // Version-aware reading: check for multiple downloaded versions
        try {
            const manga = await api.getBookmark(mangaId);
            const downloadedVersions = manga.downloadedVersions || {};
            const deletedUrls = new Set(manga.deletedChapterUrls || []);
            const versions = downloadedVersions[parseFloat(chapterNum)];
            let visibleVersions = [];
            if (Array.isArray(versions)) {
                visibleVersions = versions.filter(url => !deletedUrls.has(url));
            }
            if (visibleVersions.length > 1) {
                // Show version selection modal
                const choice = await showVersionSelector(visibleVersions, chapterNum);
                if (choice === null) {
                    // User cancelled — go back to manga page
                    router.go(`/manga/${mangaId}`);
                    return;
                }
                // Pass version URL to loadData
                await loadData(mangaId, chapterNum, choice);
            } else if (visibleVersions.length === 1) {
                // Only one version — use it directly
                await loadData(mangaId, chapterNum, visibleVersions[0]);
            } else {
                await loadData(mangaId, chapterNum);
            }
        } catch (e) {
            console.log('[Reader] Error in version check, falling back:', e);
            // Fallback: load without version check
            await loadData(mangaId, chapterNum);
        }
    }

    app.innerHTML = render();
    console.log('[Reader] render called, loading:', state.loading, 'manga:', !!state.manga, 'images:', state.images.length);
    setupListeners();

    // Webtoon: scroll to saved position after images load
    if (state.mode === 'webtoon' && state._resumeScrollToPage != null) {
        const targetPage = state._resumeScrollToPage;
        state._resumeScrollToPage = null;
        setTimeout(() => {
            const content = document.getElementById('reader-content');
            if (content) {
                const images = content.querySelectorAll('img');
                if (images[targetPage]) {
                    images[targetPage].scrollIntoView({ behavior: 'auto', block: 'start' });
                }
            }
        }, 300);
    }
}

/**
 * Unmount cleanup - save progress before leaving
 */
export async function unmount() {
    console.log('[Reader] unmount called');
    await saveCurrentProgress();
    document.body.classList.remove('reader-active');
    document.removeEventListener('keydown', handleKeyboard);
    state.manga = null;
    state.chapter = null;
    state.images = [];
    state.loading = true;
    state.singlePageMode = false;
    state._resumeScrollToPage = null;
}

/**
 * Save settings to DB
 */
async function saveSettings() {
    if (!state.manga || !state.chapter || state.manga.id === 'gallery') return;

    try {
        await api.updateChapterSettings(state.manga.id, state.chapter.number, {
            mode: state.mode,
            direction: state.direction,
            firstPageSingle: state.firstPageSingle,
            lastPageSingle: state.lastPageSingle
        });
    } catch (e) {
        console.error('Failed to save settings:', e);
    }
}

// ==================== CONTINUE READING (exported for manga view) ====================

/**
 * Find the best chapter to continue reading and navigate to it.
 * Prioritizes: partially read > first unread > first downloaded.
 */
export async function continueReading(mangaId) {
    try {
        const manga = await api.getBookmark(mangaId);
        const downloadedChapters = manga.downloadedChapters || [];
        const readChapters = new Set(manga.readChapters || []);
        const readingProgress = manga.readingProgress || {};
        const downloadedVersions = manga.downloadedVersions || {};

        const sortedDownloaded = [...downloadedChapters].sort((a, b) => a - b);

        let targetChapter = null;

        // First, check for partially read chapters
        for (const num of sortedDownloaded) {
            const progress = readingProgress[num];
            if (progress && progress.page < progress.totalPages && !readChapters.has(num)) {
                targetChapter = num;
                break;
            }
        }

        // If no partial progress, find first unread
        if (targetChapter === null) {
            for (const num of sortedDownloaded) {
                if (!readChapters.has(num)) {
                    targetChapter = num;
                    break;
                }
            }
        }

        // If all read, start from the first downloaded
        if (targetChapter === null && sortedDownloaded.length > 0) {
            targetChapter = sortedDownloaded[0];
        }

        if (targetChapter !== null) {
            // Find downloaded version URL for the target chapter
            const versions = downloadedVersions[targetChapter] || [];
            const versionUrl = Array.isArray(versions) ? versions[0] : versions;
            const versionParam = versionUrl ? `?version=${encodeURIComponent(versionUrl)}` : '';
            router.go(`/read/${mangaId}/${targetChapter}${versionParam}`);
        } else {
            showToast('No downloaded chapters to read', 'info');
        }
    } catch (error) {
        showToast('Failed to continue reading: ' + error.message, 'error');
    }
}

export default { mount, unmount, render, continueReading };
