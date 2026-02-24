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
    favoriteLists: [], // cached favorite list names for dropdown
    navigationDirection: null, // 'prev', 'next-linked', or null
    nextChapterImage: null, // URL of next chapter's first image (for link mode)
    nextChapterNum: null // chapter number of the next chapter
};

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

    // Check if current page is a trophy
    const currentIsTrophy = isCurrentPageTrophy();

    return `
    <div class="reader ${state.mode}-mode ${state.showControls ? '' : 'controls-hidden'}">
      <!-- Header -->
      <div class="reader-header">
        <button class="btn-icon" id="reader-close-btn">×</button>
        <div class="reader-title">
          <span class="manga-name">${displayName}</span>
          <span class="chapter-name">Ch. ${chapterNum}</span>
        </div>
        <div class="reader-header-actions">
          ${state.isGalleryMode ? '' : `
          ${state.mode === 'manga' ? `
            <button class="btn-icon ${state.singlePageMode ? 'active' : ''}" id="single-page-btn" title="${state.singlePageMode ? 'Switch to double page' : 'Switch to single page'}">
              ${state.singlePageMode ? '1️⃣' : '2️⃣'}
            </button>
            <button class="btn-icon ${currentIsTrophy ? 'active' : ''}" id="trophy-btn" title="${currentIsTrophy ? 'Unmark trophy' : 'Mark as trophy'}">🏆</button>
          ` : ''}
          <button class="btn-icon" id="fullscreen-btn" title="Toggle fullscreen">⛶</button>
          <button class="btn-icon" id="reader-settings-btn">⚙️</button>
          `}
        </div>
      </div>
      
      <!-- Page Manipulation Toolbar -->
      ${state.isGalleryMode ? '' : `
      <div class="reader-toolbar" id="reader-toolbar">
        <button class="btn-icon toolbar-btn" id="rotate-btn" title="Rotate 90° CW">🔄</button>
        ${state.mode === 'manga' && !state.singlePageMode ? `
          <button class="btn-icon toolbar-btn" id="swap-btn" title="Swap pages in spread">⇄</button>
        ` : ''}
        ${state.singlePageMode || state.mode === 'webtoon' ? `
          <button class="btn-icon toolbar-btn" id="split-btn" title="Split wide image into halves">✂️</button>
        ` : ''}
        <button class="btn-icon toolbar-btn danger" id="delete-page-btn" title="Delete page">🗑️</button>
        <div class="favorites-btn-wrapper">
          <button class="btn-icon toolbar-btn" id="favorites-btn" title="Add to favorites">⭐</button>
          <div class="favorites-dropdown hidden" id="favorites-dropdown">
            <div class="favorites-dropdown-title">Add to list:</div>
            <div class="favorites-dropdown-list" id="favorites-list-items"></div>
          </div>
        </div>
      </div>
      `}
      
      <!-- Content -->
      <div class="reader-content" id="reader-content" style="${state.mode === 'webtoon' ? `zoom: ${state.zoom}%` : ''}">
        ${state.isGalleryMode ? renderGalleryContent() : (state.mode === 'webtoon' ? renderWebtoonContent() : renderMangaContent())}
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
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="first-page-single" ${state.firstPageSingle ? 'checked' : ''}> First Page Single
            </label>
          </div>
          <div class="setting-row">
            <label class="checkbox-label">
                <input type="checkbox" id="last-page-single" ${state.lastPageSingle ? 'checked' : ''}> Last Page Single
            </label>
          </div>
          </div>
          `}
          <button class="btn btn-secondary" id="close-settings-btn">Close</button>
        </div>
      </div>
    </div>
  `;
}

// ==================== CONTENT RENDERERS ====================

/**
 * Render gallery content (respects saved displayMode: single/double)
 */
function renderGalleryContent() {
    return `
    <div class="gallery-pages">
      ${state.images.map((spread, idx) => {
        const displayMode = spread.displayMode || 'single';
        const displaySide = spread.displaySide || 'left';
        const urls = spread.urls || [spread.url];
        const isDouble = displayMode === 'double' && urls.length >= 2;

        if (isDouble) {
            return `
            <div class="gallery-page double-page side-${displaySide}" data-page="${idx}">
              <img src="${urls[0]}" alt="Page ${idx + 1}A" loading="lazy">
              <img src="${urls[1]}" alt="Page ${idx + 1}B" loading="lazy">
            </div>
          `;
        } else {
            return `
            <div class="gallery-page single-page" data-page="${idx}">
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

    // First page alone?
    if (state.firstPageSingle && total > 0) {
        spreads.push([0]);
        i = 1;
    }

    // Pair remaining pages
    while (i < total) {
        // Trophy pages are ALWAYS single
        if (state.trophyPages[i]) {
            spreads.push([i]);
            i++;
            continue;
        }

        // Last page alone (for link mode)?
        if (state.lastPageSingle && i === total - 1) {
            // If link mode has a next chapter image, create link spread
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
    return spread.some(p => !!state.trophyPages[p]);
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
 */
async function toggleCurrentPageTrophy() {
    if (!state.manga || !state.chapter || state.isGalleryMode) return;

    const visiblePages = getVisiblePages();
    if (visiblePages.length === 0) return;

    const anyIsTrophy = visiblePages.some(p => !!state.trophyPages[p]);
    const isSingle = state.singlePageMode || visiblePages.length === 1;

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
        // Mark as trophy
        visiblePages.forEach(p => {
            state.trophyPages[p] = { isSingle, pages: [...visiblePages] };
        });
        const modeText = isSingle ? 'single' : 'double';
        showToast(`Page${visiblePages.length > 1 ? 's' : ''} marked as trophy (${modeText}) 🏆`, 'success');
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

// ==================== READING PROGRESS ====================

/**
 * Calculate and save current reading progress
 */
async function saveCurrentProgress() {
    if (!state.manga || !state.chapter || state.isGalleryMode || !state.images.length) return;

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

    // Manga mode navigation (click left/right)
    if (state.mode === 'manga') {
        const content = document.getElementById('reader-content');
        content?.addEventListener('click', (e) => {
            const rect = content.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const isLeft = x < rect.width / 2;

            if (isLeft) {
                prevPage();
            } else {
                nextPage();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);

    // Chapter navigation
    document.getElementById('prev-chapter-btn')?.addEventListener('click', () => navigateChapter(-1));
    document.getElementById('next-chapter-btn')?.addEventListener('click', () => navigateChapter(1));

    // Toggle controls on tap (mobile) - webtoon only
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

        if (!confirm('Split this page into left and right halves? This is permanent.')) return;

        try {
            showToast('Splitting...', 'info');
            const result = await api.splitPage(state.manga.id, state.chapter.number, filename);
            if (result.images) {
                await reloadImages(result.images);
                showToast('Page split into halves', 'success');
            }
        } catch (e) {
            showToast('Split failed: ' + e.message, 'error');
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

    // Favorites button — toggle dropdown
    document.getElementById('favorites-btn')?.addEventListener('click', async () => {
        const dropdown = document.getElementById('favorites-dropdown');
        if (!dropdown) return;

        const isHidden = dropdown.classList.contains('hidden');
        if (isHidden) {
            // Fetch lists and populate
            try {
                const data = await api.getFavorites();
                const listNames = Object.keys(data.favorites || data || {});
                state.favoriteLists = listNames;

                const container = document.getElementById('favorites-list-items');
                if (container) {
                    if (listNames.length === 0) {
                        container.innerHTML = '<div class="favorites-dropdown-empty">No lists yet</div>';
                    } else {
                        container.innerHTML = listNames.map(name =>
                            `<button class="favorites-dropdown-item" data-list="${name}">${name}</button>`
                        ).join('');

                        // Add click handlers
                        container.querySelectorAll('.favorites-dropdown-item').forEach(btn => {
                            btn.addEventListener('click', async () => {
                                await addToFavoriteList(btn.dataset.list);
                                dropdown.classList.add('hidden');
                            });
                        });
                    }
                }
            } catch (e) {
                showToast('Failed to load favorites: ' + e.message, 'error');
                return;
            }
        }

        dropdown.classList.toggle('hidden');
    });

    // Close favorites dropdown when clicking elsewhere
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('favorites-dropdown');
        const btn = document.getElementById('favorites-btn');
        if (dropdown && !dropdown.contains(e.target) && e.target !== btn) {
            dropdown.classList.add('hidden');
        }
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

    // Link page click — navigate to next chapter (skip first page since it was previewed)
    document.getElementById('link-page')?.addEventListener('click', () => {
        if (state.nextChapterNum && state.manga) {
            saveCurrentProgress();
            state.navigationDirection = 'next-linked';
            router.go(`/read/${state.manga.id}/${state.nextChapterNum}`);
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
 */
async function addToFavoriteList(listName) {
    if (!state.manga || !state.chapter) return;

    const pages = getVisiblePages();
    if (pages.length === 0) {
        showToast('No page selected', 'info');
        return;
    }

    // Build imagePaths from visible pages
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
    if (e.key === 'Escape') {
        saveCurrentProgress();
        if (state.manga) {
            router.go(`/manga/${state.manga.id}`);
        }
        return;
    }

    if (state.mode === 'manga') {
        if (e.key === 'ArrowLeft') {
            prevPage();
        } else if (e.key === 'ArrowRight') {
            nextPage();
        }
    }
}

/**
 * Navigate to next page (manga mode)
 */
function nextPage() {
    const maxPage = state.singlePageMode ? state.images.length - 1 : buildSpreads().length - 1;
    if (state.currentPage < maxPage) {
        state.currentPage++;
        updateSpread();
    } else {
        // End of chapter - save progress and go to next
        saveCurrentProgress();
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
        content.innerHTML = state.mode === 'webtoon' ? renderWebtoonContent() : renderMangaContent();

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
    if (!state.manga || !state.chapter) return;

    // Save progress before navigating
    await saveCurrentProgress();

    const chapters = state.manga.downloadedChapters || [];
    const sorted = [...chapters].sort((a, b) => a - b);
    const currentIdx = sorted.indexOf(state.chapter.number);
    const newIdx = currentIdx + delta;

    if (newIdx >= 0 && newIdx < sorted.length) {
        // Set navigation direction so the next chapter opens at the right position
        state.navigationDirection = delta < 0 ? 'prev' : null;
        router.go(`/read/${state.manga.id}/${sorted[newIdx]}`);
    } else {
        showToast(delta > 0 ? 'Last chapter' : 'First chapter', 'info');
    }
}

// ==================== DATA LOADING ====================

/**
 * Load chapter data
 */
async function loadData(mangaId, chapterNum, versionUrl) {
    try {
        // Load settings from localStorage
        state.mode = localStorage.getItem('reader_mode') || 'webtoon';
        state.direction = localStorage.getItem('reader_direction') || 'rtl';

        // Special handling for Favorite Galleries
        if (mangaId === 'gallery') {
            const listName = decodeURIComponent(chapterNum);
            const favoritesData = await api.getFavorites();
            const list = favoritesData.favorites[listName] || [];

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

            if (state.images.length === 0) {
                showToast('Gallery is empty', 'warning');
            }
        } else {
            // Standard Manga Reader Mode
            state.isGalleryMode = false;
            const manga = await api.getBookmark(mangaId);
            state.manga = manga;
            state.chapter = manga.chapters?.find(c => c.number === parseFloat(chapterNum)) || { number: parseFloat(chapterNum) };

            // Get images (optionally from a specific version)
            const imagesEndpoint = versionUrl
                ? `/bookmarks/${mangaId}/chapters/${chapterNum}/images?versionUrl=${encodeURIComponent(versionUrl)}`
                : `/bookmarks/${mangaId}/chapters/${chapterNum}/images`;
            const result = await api.get(imagesEndpoint);
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
                state.trophyPages = {};
                console.warn('Failed to load trophy pages', e);
            }

            // Resume reading progress
            const targetNum = parseFloat(chapterNum);
            const progress = manga.readingProgress?.[targetNum];
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
        }

        // Apply navigation direction (overrides progress)
        if (state.navigationDirection === 'prev' && state.mode === 'manga') {
            if (state.singlePageMode) {
                state.currentPage = Math.max(0, state.images.length - 1);
            } else {
                const spreads = buildSpreads();
                state.currentPage = Math.max(0, spreads.length - 1);
            }
            state.navigationDirection = null;
        } else if (state.navigationDirection === 'next-linked' && state.mode === 'manga') {
            // Skip first page since it was already shown in link preview
            state.currentPage = state.firstPageSingle ? 1 : 0;
            state.navigationDirection = null;
        } else {
            state.navigationDirection = null;
        }

        // Fetch next chapter preview for link mode
        if (state.lastPageSingle) {
            await fetchNextPreview();
        }

        state.loading = false;
    } catch (error) {
        console.error('Failed to load chapter:', error);
        showToast('Failed to load chapter: ' + (error.message || 'Unknown error'), 'error');
        state.loading = false;
    }
}

// ==================== LIFECYCLE ====================

/**
 * Mount the reader view
 */
export async function mount(params = []) {
    console.log('[Reader] mount called with params:', params);
    const [mangaId, chapterNum] = params;

    if (!mangaId || !chapterNum) {
        router.go('/');
        return;
    }

    const app = document.getElementById('app');

    // Reset state for new chapter
    state.loading = true;
    state.images = [];
    state.singlePageMode = false;
    state._resumeScrollToPage = null;
    state.nextChapterImage = null;
    state.nextChapterNum = null;
    app.innerHTML = render();

    // Version-aware reading: check for multiple versions
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
        } else {
            await loadData(mangaId, chapterNum);
        }
    } catch (e) {
        // Fallback: load without version check
        await loadData(mangaId, chapterNum);
    }

    app.innerHTML = render();
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
            router.go(`/read/${mangaId}/${targetChapter}`);
        } else {
            showToast('No downloaded chapters to read', 'info');
        }
    } catch (error) {
        showToast('Failed to continue reading: ' + error.message, 'error');
    }
}

export default { mount, unmount, render, continueReading };
