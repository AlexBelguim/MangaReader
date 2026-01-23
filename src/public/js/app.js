// Main application state and logic
let state = {
  bookmarks: [],
  categories: [],
  series: [], // Series list
  activeCategory: null,
  artistFilter: null, // Filter library by artist name
  currentManga: null,
  currentSeries: null, // Current series being viewed
  currentChapter: null,
  currentImages: [],
  nextChapterFirstImage: null, // First image URL of next chapter (for link mode)
  isFullscreen: false, // Track fullscreen state to restore after DOM changes
  viewMode: 'manga', // 'manga' or 'series' - which view mode in library
  chapterListPage: 0, // Current page in chapter list pagination (0-indexed)
  chapterFilter: 'all', // 'all', 'main', 'extra', 'downloaded'
  readerSettings: {
    mode: 'webtoon', // 'webtoon' or 'manga'
    direction: 'rtl', // 'ltr' or 'rtl' (for manga mode)
    firstPageSingle: true,
    singlePageMode: false, // true = show one page at a time, false = show two pages
    currentPage: 0,
    zoom: 100 // zoom percentage for webtoon mode
  },
  trophyPages: {}, // { mangaId: { chapterNum: { pageIndex: { isSingle: bool, pages: [indices] } } } }
  chapterSettings: {}, // { mangaId: { chapterNum: { firstPageSingle: bool, lastPageSingle: bool } } }
  navigationDirection: null, // 'next' or 'prev' - set when navigating between chapters
  favorites: {}, // { listName: [{ mangaId, mangaTitle, chapterNum, chapterUrl, pageIndices, displayMode, displaySide, imagePaths, createdAt }] }
  favoriteListOrder: [], // Order of favorite lists
  currentFavoriteList: null, // Current list being viewed
  currentFavoriteIndex: 0, // Current index in favorites viewer
  selectionMode: { // Chapter selection for volumes
    active: false,
    selected: new Set()
  }
};

// Download/task manager state
let downloadManager = {
  tasks: new Map(), // taskId -> task info (downloads)
  scrapeTasks: new Map(), // taskId -> task info (scraping)
  isOpen: false,
  pollInterval: null
};

// Detect if we're on a mobile/touch device
const isMobile = () => window.matchMedia('(max-width: 768px) and (pointer: coarse)').matches;

// Initialize app
async function init() {
  // Auth Check
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Register routes
  router.register('/', showLibrary);
  router.register('/manga', showMangaDetail);
  router.register('/series', showSeriesDetail);
  router.register('/read', showReader);
  router.register('*', showLibrary);

  // Load saved reader settings from server
  await loadReaderSettings();

  // Load trophy pages from server
  await loadTrophyPages();

  // Load per-chapter settings from server
  await loadChapterSettings();

  // Load favorites from server
  await loadFavorites();

  // Restore download manager state
  restoreDownloadManager();

  // Setup long-press handler for chapter headers
  setupChapterLongPress();

  // Start router
  router.start();
}

// Logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
}

// Expose logout globally for UI usage
window.logout = logout;

// Route handlers
async function showLibrary() {
  const app = document.getElementById('app');
  app.innerHTML = '<div style="display:flex;justify-content:center;padding:50px;"><div class="loading-spinner"></div></div>';

  try {
    const [bookmarks, categoriesResult, series] = await Promise.all([
      API.getBookmarks(),
      API.getCategories(),
      API.getSeries()
    ]);

    state.bookmarks = bookmarks;
    state.categories = categoriesResult.categories || [];
    state.series = series || [];
    app.innerHTML = renderLibrary(state.bookmarks, state.categories, state.activeCategory, state.artistFilter, state.viewMode, state.series);
  } catch (error) {
    showToast('Failed to load library', 'error');
  }
}

// Series detail view
async function showSeriesDetail(params) {
  const [id] = params;
  if (!id) return router.navigate('/');

  const app = document.getElementById('app');
  app.innerHTML = '<div style="display:flex;justify-content:center;padding:50px;"><div class="loading-spinner"></div></div>';

  try {
    const series = await API.getSeriesById(id);
    if (!series) {
      showToast('Series not found', 'error');
      return router.navigate('/');
    }

    state.currentSeries = series;
    app.innerHTML = renderSeriesDetail(series);
  } catch (error) {
    showToast('Failed to load series', 'error');
    router.navigate('/');
  }
}

async function showMangaDetail(params) {
  const [id] = params;
  if (!id) return router.navigate('/');

  const app = document.getElementById('app');
  app.innerHTML = '<div style="display:flex;justify-content:center;padding:50px;"><div class="loading-spinner"></div></div>';

  try {
    // Load manga, categories, and settings in parallel
    const [manga, categoriesResult, chapterSettings] = await Promise.all([
      API.getBookmark(id),
      API.getCategories(),
      API.getMangaChapterSettings(id)
    ]);
    state.currentManga = manga;
    state.currentManga.chapterSettings = chapterSettings || {};
    state.categories = categoriesResult.categories || [];

    // Default to last page for chapter list (user request)
    const CHAPTERS_PER_PAGE = 50;
    const totalPages = Math.ceil((manga.chapters?.length || 0) / CHAPTERS_PER_PAGE);
    state.chapterListPage = Math.max(0, totalPages - 1);

    // Reset selection mode
    state.selectionMode = { active: false, selected: new Set() };

    app.innerHTML = renderMangaDetail(state.currentManga, state.categories, state.chapterListPage, state.selectionMode, state.chapterFilter);

    // Check for multiple covers and show button if available
    checkForMultipleCovers(id);

    // Load version details for duplicate manager
    loadVersionDetails(id);

    // Check for CBZ files
    checkForCbzFiles(id);

    // Check if manga needs a cover
    checkForMissingCover(id);

    // Note: Chapter click handlers are inline onclick in the HTML
  } catch (error) {
    showToast('Failed to load manga details', 'error');
    router.navigate('/');
  }
}

async function showReader(params) {
  const [mangaId, chapterNum] = params;

  // Extract version URL from hash query string if present
  // Hash format: #/read/id/num?version=xxx
  const hash = window.location.hash;
  const queryIndex = hash.indexOf('?');
  let versionUrl = null;
  if (queryIndex !== -1) {
    const queryString = hash.substring(queryIndex + 1);
    const urlParams = new URLSearchParams(queryString);
    versionUrl = urlParams.get('version');
  }

  console.log('showReader params:', params, 'mangaId:', mangaId, 'chapterNum:', chapterNum, 'version:', versionUrl);
  if (!mangaId || !chapterNum) return router.navigate('/');

  const app = document.getElementById('app');
  app.innerHTML = '<div style="display:flex;justify-content:center;padding:50px;"><div class="loading-spinner"></div></div>';

  try {
    // Get manga - always refresh to ensure chapters are current
    state.currentManga = await API.getBookmark(mangaId);

    // Check if chapter is downloaded
    const targetNum = parseFloat(chapterNum);
    const downloadedChapters = state.currentManga.downloadedChapters || [];

    console.log('Trying to read chapter:', targetNum, 'Downloaded:', downloadedChapters, 'Includes:', downloadedChapters.includes(targetNum));

    if (!downloadedChapters.includes(targetNum)) {
      showToast('Chapter not downloaded', 'error');
      return router.navigate(`/manga/${mangaId}`);
    }

    // Find chapter - handle both string and number comparison
    state.currentChapter = state.currentManga.chapters.find(c => c.number === targetNum);

    // If specific version requested, use that URL
    if (versionUrl) {
      state.currentChapter = {
        ...state.currentChapter,
        number: targetNum,
        url: decodeURIComponent(versionUrl)
      };
    }

    // If not found in chapters list, create a minimal chapter object for local-only chapters
    if (!state.currentChapter) {
      state.currentChapter = { number: targetNum, title: `Chapter ${targetNum}` };
    }

    // Fetch images from local - pass version URL if specified
    showToast('Loading chapter...', 'info');
    const result = await API.getChapterImages(mangaId, chapterNum, versionUrl);

    if (result.error) {
      showToast(result.error, 'error');
      return router.navigate(`/manga/${mangaId}`);
    }

    state.currentImages = result.images || [];

    // Load chapter-specific firstPageSingle if available (need this before calculating spreads)
    state.readerSettings.firstPageSingle = getChapterFirstPageSingle();

    // Determine starting page
    const progress = state.currentManga.readingProgress?.[targetNum];

    // If navigating to previous chapter, start at last page
    if (state.navigationDirection === 'prev' && state.readerSettings.mode === 'manga') {
      // Calculate last spread index
      const tempFirstPageSingle = getChapterFirstPageSingle();
      const tempTrophyInfo = getCurrentTrophyPages();
      const tempLastPageSingle = getChapterLastPageSingle();
      const spreads = buildSpreadMap(state.currentImages.length, tempFirstPageSingle, tempTrophyInfo, tempLastPageSingle);
      state.readerSettings.currentPage = Math.max(0, spreads.length - 1);
      state.navigationDirection = null; // Clear after use
    } else if (state.navigationDirection === 'next-linked' && state.readerSettings.mode === 'manga') {
      // Coming from a linked chapter - skip first page (start at spread 1)
      // This is because the first page was already shown in the link preview
      state.readerSettings.currentPage = 1;
      state.navigationDirection = null;
    } else if (progress && progress.page < progress.totalPages) {
      // Resume from saved progress
      if (state.readerSettings.mode === 'manga') {
        state.readerSettings.currentPage = Math.floor(progress.page / 2);
      } else {
        state.readerSettings.currentPage = 0; // Webtoon scrolls to position
      }
      state.navigationDirection = null;
    } else {
      state.readerSettings.currentPage = 0;
      state.navigationDirection = null;
    }

    // If link mode is active, fetch next chapter's first image
    if (getChapterLastPageSingle()) {
      await fetchNextChapterFirstImage();
    } else {
      state.nextChapterFirstImage = null;
    }

    app.innerHTML = renderReader(state.currentManga, state.currentChapter, state.currentImages, state.readerSettings, getCurrentTrophyPages(), getChapterLastPageSingle(), state.nextChapterFirstImage);

    // Hide FAB queue when in reader
    document.body.classList.add('reader-active');

    // Setup listeners based on mode
    if (state.readerSettings.mode === 'webtoon') {
      setupWebtoonScrollListener();
      // Scroll to saved position in webtoon mode
      if (progress && progress.page < progress.totalPages) {
        const content = document.getElementById('reader-content');
        setTimeout(() => {
          const images = content.querySelectorAll('img');
          if (images[progress.page - 1]) {
            images[progress.page - 1].scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      setupMangaScrollListener();
    }
    setupKeyboardNavigation();
  } catch (error) {
    showToast('Failed to load chapter: ' + error.message, 'error');
    router.navigate(`/manga/${mangaId}`);
  }
}

// Reader functions
async function readManga(mangaId, chapterNum, versionUrl = null) {
  // If a specific version is requested, go directly to reader
  if (versionUrl) {
    router.navigate(`/read/${mangaId}/${chapterNum}?version=${versionUrl}`);
    return;
  }

  // Check if chapter has multiple downloaded versions
  try {
    const manga = await API.getBookmark(mangaId);
    const downloadedVersions = manga.downloadedVersions || {};
    const deletedUrls = new Set(manga.deletedChapterUrls || []);
    const versions = downloadedVersions[chapterNum];

    // Filter out hidden/deleted versions
    let visibleVersions = [];
    if (Array.isArray(versions)) {
      visibleVersions = versions.filter(url => !deletedUrls.has(url));
    }

    // If multiple visible versions exist, open compare mode
    if (visibleVersions.length > 1) {
      const encodedUrls = visibleVersions.map(v => encodeURIComponent(v)).join(',');
      openCompareView(mangaId, chapterNum, encodedUrls, true); // true = opened from reader
      return;
    }

    // If only one version exists (or user specified version), proceed to reader
    router.navigate(`/read/${mangaId}/${chapterNum}`);
  } catch (error) {
    console.error('Failed to check versions:', error);
    // Fallback to normal navigation
    router.navigate(`/read/${mangaId}/${chapterNum}`);
  }
}

// Continue reading from last position
async function continueReading(mangaId) {
  try {
    const manga = await API.getBookmark(mangaId);
    const downloadedChapters = manga.downloadedChapters || [];
    const readChapters = new Set(manga.readChapters || []);
    const readingProgress = manga.readingProgress || {};

    // Sort downloaded chapters ascending
    const sortedDownloaded = [...downloadedChapters].sort((a, b) => a - b);

    // Find first unread or partially read chapter
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
    if (!targetChapter) {
      for (const num of sortedDownloaded) {
        if (!readChapters.has(num)) {
          targetChapter = num;
          break;
        }
      }
    }

    // If all read, start from the first downloaded
    if (!targetChapter && sortedDownloaded.length > 0) {
      targetChapter = sortedDownloaded[0];
    }

    if (targetChapter !== null) {
      readManga(mangaId, targetChapter);
    } else {
      showToast('No downloaded chapters to read', 'info');
    }
  } catch (error) {
    showToast('Failed to continue reading: ' + error.message, 'error');
  }
}

function closeReader() {
  // Save progress and chapter settings before closing
  saveCurrentProgress();
  saveChapterFirstPageSingle(); // Auto-save cover pair setting

  // Show FAB queue again
  document.body.classList.remove('reader-active');

  if (state.currentManga) {
    router.navigate(`/manga/${state.currentManga.id}`);
  } else {
    router.navigate('/');
  }
}

// Save current reading progress
async function saveCurrentProgress() {
  if (!state.currentManga || !state.currentChapter || !state.currentImages.length) return;

  let currentPage = 1;
  if (state.readerSettings.mode === 'manga') {
    // Calculate actual page from spread
    const { currentPage: spread, firstPageSingle } = state.readerSettings;
    if (firstPageSingle && spread === 0) {
      currentPage = 1;
    } else if (firstPageSingle) {
      currentPage = 1 + (spread - 1) * 2 + 1;
    } else {
      currentPage = spread * 2 + 1;
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
    await API.updateReadingProgress(
      state.currentManga.id,
      state.currentChapter.number,
      currentPage,
      state.currentImages.length
    );
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

// Mark chapter as read/unread
async function toggleChapterRead(mangaId, chapterNum, isRead) {
  try {
    await API.markChapterRead(mangaId, chapterNum, isRead);
    showToast(isRead ? 'Marked as read' : 'Marked as unread', 'success');
    // Update UI without full refresh
    updateChapterReadStatus(chapterNum, isRead);
  } catch (error) {
    showToast('Failed to update: ' + error.message, 'error');
  }
}

// Update read status in UI without refresh
function updateChapterReadStatus(chapterNum, isRead) {
  const groups = document.querySelectorAll(`.chapter-group[data-chapter="${chapterNum}"]`);
  groups.forEach(group => {
    const item = group.querySelector('.chapter-item');
    if (item) {
      if (isRead) {
        item.classList.add('read');
      } else {
        item.classList.remove('read');
      }
      // Update the eye button
      const btn = item.querySelector('button[title*="Mark"]');
      if (btn) {
        btn.classList.toggle('success', isRead);
        btn.classList.toggle('muted', !isRead);
        btn.innerHTML = isRead ? '👁️' : '○';
        btn.title = isRead ? 'Mark unread (right-click: mark all below)' : 'Mark read (right-click: mark all below)';
        btn.setAttribute('onclick', `event.stopPropagation(); toggleChapterRead('${state.currentManga.id}', ${chapterNum}, ${!isRead})`);
      }
    }
  });
}

// Toggle chapter lock status
async function toggleChapterLock(mangaId, chapterNum) {
  try {
    const manga = state.currentManga;
    if (!manga || manga.id !== mangaId) return;

    // Ensure structure exists
    if (!manga.chapterSettings) manga.chapterSettings = {};
    const settings = manga.chapterSettings[chapterNum] || {};

    const newLocked = !settings.locked;

    // Optimistic update
    manga.chapterSettings[chapterNum] = { ...settings, locked: newLocked };

    // Update UI
    updateChapterLockUI(chapterNum, newLocked);

    // Save to backend
    await API.saveChapterSetting(mangaId, chapterNum, manga.chapterSettings[chapterNum]);
  } catch (error) {
    showToast('Failed to toggle lock: ' + error.message, 'error');
  }
}

function updateChapterLockUI(chapterNum, locked) {
  const groups = document.querySelectorAll(`.chapter-group[data-chapter="${chapterNum}"]`);
  groups.forEach(group => {
    const btn = group.querySelector('.chapter-lock-btn');
    if (btn) {
      btn.innerHTML = locked ? '🔒' : '🔓';
      btn.title = locked ? 'Unlock Chapter (Prevent updates)' : 'Lock Chapter';
      btn.style.opacity = locked ? '1' : '0.3';
    }
  });
}

// Mark all chapters below as read
async function markAllReadBelow(mangaId, chapterNum) {
  try {
    const result = await API.markChaptersReadBelow(mangaId, chapterNum);
    showToast(`Marked ${result.count || 'all'} chapters as read`, 'success');
    // Update UI in-place for all affected chapters
    if (result.chapters) {
      result.chapters.forEach(num => updateChapterReadStatus(num, true));
    } else {
      // Fallback: mark all chapters with number <= chapterNum as read
      document.querySelectorAll('.chapter-group').forEach(group => {
        const num = parseFloat(group.dataset.chapter);
        if (num <= chapterNum) {
          updateChapterReadStatus(num, true);
        }
      });
    }
  } catch (error) {
    showToast('Failed to update: ' + error.message, 'error');
  }
}

// Download unread chapters
async function downloadUnreadChapters(mangaId) {
  try {
    const manga = await API.getBookmark(mangaId);
    const readChapters = new Set(manga.readChapters || []);
    const downloadedChapters = new Set(manga.downloadedChapters || []);
    const deletedUrls = new Set(manga.deletedChapterUrls || []);
    const excludedChapters = new Set(manga.excludedChapters || []);

    // Find chapters that are not read, not downloaded, not hidden, and not excluded
    const availableChapters = manga.chapters
      .filter(c => !readChapters.has(c.number) && !downloadedChapters.has(c.number) && !deletedUrls.has(c.url) && !excludedChapters.has(c.number));

    if (availableChapters.length === 0) {
      showToast('All unread chapters are already downloaded', 'info');
      return;
    }

    // For comix.to manga, show options if there are multiple versions
    if (manga.website === 'comix.to') {
      showDownloadOptionsModal(manga, availableChapters, async (selection) => {
        if (!selection) return; // cancelled

        const chaptersToDownload = getChaptersForDownload(availableChapters, selection.mode);
        executeDownloadAll(mangaId, chaptersToDownload, 'unread');
      });
    } else {
      // Non-comix manga: download all directly
      executeDownloadAll(mangaId, availableChapters, 'unread');
    }
  } catch (error) {
    showToast('Failed to start download: ' + error.message, 'error');
  }
}

// Hide all non-downloaded versions for chapters with at least one version downloaded
async function hideUndownloadedVersions(mangaId) {
  try {
    showToast('Hiding undownloaded versions...', 'info');
    const result = await API.hideUndownloadedVersions(mangaId);
    if (result.success) {
      showToast(`Hidden ${result.hiddenCount} undownloaded versions`, 'success');
      // Refresh the manga detail view
      const manga = await API.getBookmark(mangaId);
      state.currentManga = manga;
      router.reload();
    } else {
      showToast('Failed to hide versions', 'error');
    }
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}

function toggleReaderMode() {
  const newMode = state.readerSettings.mode === 'webtoon' ? 'manga' : 'webtoon';
  setReaderMode(newMode);
}

function setReaderMode(mode) {
  // Capture current image index to preserve position
  let currentImageIndex = 0;
  const currentMode = state.readerSettings.mode;

  if (currentMode === 'webtoon') {
    // Webtoon to Manga: Calculate from scroll position
    const content = document.getElementById('reader-content');
    if (content) {
      const images = content.querySelectorAll('img[data-page]');
      // If we have content and are scrolled down
      if (images.length > 0) {
        const scrollTop = content.scrollTop;
        if (scrollTop > 10) {
          let currentY = 0;
          // Find the first image that is significantly visible
          for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const h = img.offsetHeight;
            // If the bottom of the image is below the top of the viewport
            if (currentY + h > scrollTop) {
              currentImageIndex = parseInt(img.dataset.page || i);
              break;
            }
            currentY += h;
          }
        }
      }
    } else {
      currentImageIndex = state.readerSettings.currentPage || 0;
    }
  } else {
    // Manga to Webtoon: Get from spread
    const { currentPage, singlePageMode } = state.readerSettings;
    if (singlePageMode) {
      currentImageIndex = currentPage;
    } else {
      const spreads = buildSpreadMap(state.currentImages.length, getChapterFirstPageSingle(), getCurrentTrophyPages(), getChapterLastPageSingle());
      const spread = spreads[currentPage];
      // Use the first page of the spread
      if (spread && spread.pages.length > 0) {
        currentImageIndex = spread.pages[0];
      }
    }
  }

  // Set the new mode
  state.readerSettings.mode = mode;

  // Update currentPage for the new mode
  if (mode === 'webtoon') {
    state.readerSettings.currentPage = currentImageIndex;
  } else {
    // Manga mode: find spread for imageIndex
    const { singlePageMode } = state.readerSettings;
    if (singlePageMode) {
      state.readerSettings.currentPage = currentImageIndex;
    } else {
      const spreads = buildSpreadMap(state.currentImages.length, getChapterFirstPageSingle(), getCurrentTrophyPages(), getChapterLastPageSingle());
      let newSpreadIndex = 0;
      for (let i = 0; i < spreads.length; i++) {
        if (spreads[i].pages.includes(currentImageIndex)) {
          newSpreadIndex = i;
          break;
        }
      }
      state.readerSettings.currentPage = newSpreadIndex;
    }
  }

  saveReaderSettings();
  refreshReader();

  // If switching to Webtoon, manual scroll to the page
  if (mode === 'webtoon') {
    setTimeout(() => {
      const content = document.getElementById('reader-content');
      if (content) {
        const images = content.querySelectorAll('img[data-page]');
        const targetImg = Array.from(images).find(img => parseInt(img.dataset.page) === currentImageIndex);
        if (targetImg) {
          targetImg.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }
    }, 100);
  }
}

function toggleDirection() {
  state.readerSettings.direction = state.readerSettings.direction === 'rtl' ? 'ltr' : 'rtl';
  saveReaderSettings();
  refreshReader();
}

function setReaderDirection(direction) {
  state.readerSettings.direction = direction;
  saveReaderSettings();
  refreshReader();
}

function toggleFirstPageSingle() {
  state.readerSettings.firstPageSingle = !state.readerSettings.firstPageSingle;
  // Save per-chapter setting
  saveChapterFirstPageSingle();
  saveReaderSettings();
  refreshReader();
}

function toggleSinglePageMode() {
  state.readerSettings.singlePageMode = !state.readerSettings.singlePageMode;
  saveReaderSettings();
  refreshReader();
}

// Toggle trophy status for the current visible page(s)
async function toggleCurrentPageTrophy() {
  if (!state.currentManga || !state.currentChapter) return;

  const { singlePageMode, currentPage } = state.readerSettings;
  const firstPageSingle = getChapterFirstPageSingle();
  const totalImages = state.currentImages.length;
  const trophyInfo = getCurrentTrophyPages();

  // Get the page indices currently being displayed
  let visiblePages = [];

  if (singlePageMode) {
    visiblePages = [currentPage];
  } else {
    const spreads = buildSpreadMap(totalImages, firstPageSingle, trophyInfo, getChapterLastPageSingle());
    const currentSpread = spreads[currentPage];
    if (currentSpread) {
      visiblePages = currentSpread.pages;
    }
  }

  if (visiblePages.length === 0) return;

  // Check if any visible page is already a trophy
  const anyIsTrophy = visiblePages.some(p => isPageTrophy(p));

  // If un-trophying in single page mode, check if current page is part of a double trophy
  let pagesToToggle = [...visiblePages];
  if (anyIsTrophy && singlePageMode) {
    const trophyData = trophyInfo[currentPage];
    if (trophyData && !trophyData.isSingle && trophyData.pages && trophyData.pages.length > 1) {
      // This is a double trophy - untrophy all pages in the group
      pagesToToggle = [...trophyData.pages];
    }
  }

  // Determine if marking as single or double
  const isSingle = singlePageMode || visiblePages.length === 1;

  // Toggle all pages
  pagesToToggle.forEach(pageIndex => {
    if (anyIsTrophy) {
      // Remove trophy from all pages in the group
      removePageTrophy(pageIndex);
    } else {
      // Add trophy to all visible pages with display mode info
      addPageTrophy(pageIndex, isSingle, visiblePages);
    }
  });

  if (anyIsTrophy) {
    showToast(`Page${pagesToToggle.length > 1 ? 's' : ''} unmarked as trophy`, 'info');
  } else {
    const modeText = isSingle ? 'single' : 'double';
    showToast(`Page${visiblePages.length > 1 ? 's' : ''} marked as trophy (${modeText}) 🏆`, 'success');
  }

  await saveTrophyPages();
  refreshReader();
}

function addPageTrophy(pageIndex, isSingle, allPages) {
  if (!state.currentManga || !state.currentChapter) return;

  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;

  if (!state.trophyPages[mangaId]) {
    state.trophyPages[mangaId] = {};
  }
  if (!state.trophyPages[mangaId][chapterNum]) {
    state.trophyPages[mangaId][chapterNum] = {};
  }

  const trophyMap = state.trophyPages[mangaId][chapterNum];
  // Store trophy info: isSingle and which pages are grouped together
  trophyMap[pageIndex] = { isSingle, pages: [...allPages] };
}

function removePageTrophy(pageIndex) {
  if (!state.currentManga || !state.currentChapter) return;

  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;

  const trophyMap = state.trophyPages[mangaId]?.[chapterNum];
  if (trophyMap && trophyMap[pageIndex]) {
    // If this is part of a double trophy, also remove the paired page
    const trophyData = trophyMap[pageIndex];
    if (trophyData && !trophyData.isSingle && trophyData.pages && trophyData.pages.length > 1) {
      // Remove all pages in the group
      trophyData.pages.forEach(p => {
        if (trophyMap[p]) {
          delete trophyMap[p];
        }
      });
    } else {
      delete trophyMap[pageIndex];
    }
  }
}

async function togglePageTrophy(pageIndex) {
  if (!state.currentManga || !state.currentChapter) return;

  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;

  // Initialize structure if needed
  if (!state.trophyPages[mangaId]) {
    state.trophyPages[mangaId] = {};
  }
  if (!state.trophyPages[mangaId][chapterNum]) {
    state.trophyPages[mangaId][chapterNum] = {};
  }

  const trophyMap = state.trophyPages[mangaId][chapterNum];

  if (trophyMap[pageIndex]) {
    delete trophyMap[pageIndex];
    showToast(`Page ${pageIndex + 1} unmarked`, 'info');
  } else {
    // When toggling individual page, mark as single
    trophyMap[pageIndex] = { isSingle: true, pages: [pageIndex] };
    showToast(`Page ${pageIndex + 1} marked as trophy 🏆`, 'success');
  }

  // Save to server
  await saveTrophyPages();
  refreshReader();
}

function isPageTrophy(pageIndex) {
  if (!state.currentManga || !state.currentChapter) return false;
  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;
  const trophyMap = state.trophyPages[mangaId]?.[chapterNum];
  return trophyMap && trophyMap[pageIndex] !== undefined;
}

// Get trophy info for a page (returns { isSingle, pages } or null)
function getTrophyInfo(pageIndex) {
  if (!state.currentManga || !state.currentChapter) return null;
  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;
  return state.trophyPages[mangaId]?.[chapterNum]?.[pageIndex] || null;
}

async function saveTrophyPages() {
  try {
    await API.saveTrophyPages(state.trophyPages);
  } catch (e) {
    console.error('Error saving trophy pages:', e);
  }
}

async function loadTrophyPages() {
  try {
    state.trophyPages = await API.getTrophyPages();
  } catch (e) {
    console.error('Error loading trophy pages:', e);
    state.trophyPages = {};
  }
}

function getCurrentTrophyPages() {
  if (!state.currentManga || !state.currentChapter) return {};
  return state.trophyPages[state.currentManga.id]?.[state.currentChapter.number] || {};
}

// Get array of trophy page indices (for backward compatibility)
function getCurrentTrophyPageIndices() {
  const trophyMap = getCurrentTrophyPages();
  return Object.keys(trophyMap).map(k => parseInt(k, 10));
}

// Per-chapter firstPageSingle (cover pair) setting
async function saveChapterFirstPageSingle() {
  if (!state.currentManga || !state.currentChapter) return;

  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;

  if (!state.chapterSettings[mangaId]) {
    state.chapterSettings[mangaId] = {};
  }
  if (!state.chapterSettings[mangaId][chapterNum]) {
    state.chapterSettings[mangaId][chapterNum] = {};
  }

  state.chapterSettings[mangaId][chapterNum].firstPageSingle = state.readerSettings.firstPageSingle;

  try {
    await API.saveChapterSetting(mangaId, chapterNum, state.chapterSettings[mangaId][chapterNum]);
  } catch (e) {
    console.error('Error saving chapter setting:', e);
  }
}

async function loadChapterSettings() {
  try {
    state.chapterSettings = await API.getChapterSettings();
  } catch (e) {
    console.error('Error loading chapter settings:', e);
    state.chapterSettings = {};
  }
}

function getChapterFirstPageSingle() {
  if (!state.currentManga || !state.currentChapter) return state.readerSettings.firstPageSingle;
  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;
  const chapterSetting = state.chapterSettings[mangaId]?.[chapterNum]?.firstPageSingle;
  // Return chapter-specific setting if exists, otherwise global setting
  return chapterSetting !== undefined ? chapterSetting : state.readerSettings.firstPageSingle;
}

// Last page single setting - marks last page to pair with next chapter's first page
async function saveChapterLastPageSingle(value) {
  if (!state.currentManga || !state.currentChapter) return;

  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;

  if (!state.chapterSettings[mangaId]) {
    state.chapterSettings[mangaId] = {};
  }
  if (!state.chapterSettings[mangaId][chapterNum]) {
    state.chapterSettings[mangaId][chapterNum] = {};
  }

  state.chapterSettings[mangaId][chapterNum].lastPageSingle = value;

  try {
    await API.saveChapterSetting(mangaId, chapterNum, state.chapterSettings[mangaId][chapterNum]);
  } catch (e) {
    console.error('Error saving chapter setting:', e);
  }
}

function getChapterLastPageSingle() {
  if (!state.currentManga || !state.currentChapter) return false;
  const mangaId = state.currentManga.id;
  const chapterNum = state.currentChapter.number;
  return state.chapterSettings[mangaId]?.[chapterNum]?.lastPageSingle || false;
}

async function toggleLastPageSingle() {
  const current = getChapterLastPageSingle();
  const newValue = !current;
  saveChapterLastPageSingle(newValue);

  if (newValue) {
    // Fetch next chapter's first image
    await fetchNextChapterFirstImage();

    // Also enable firstPageSingle (cover pair) on the next chapter
    const nextChapterNum = getNextChapterNumber();
    if (nextChapterNum !== null) {
      saveChapterFirstPageSingleFor(nextChapterNum, true);
    }

    showToast('Last page linked to next chapter', 'info');
  } else {
    state.nextChapterFirstImage = null;
    showToast('Last page unlinked from next chapter', 'info');
  }
  refreshReader();
}

// Get the next downloaded chapter number
function getNextChapterNumber() {
  if (!state.currentManga || !state.currentChapter) return null;

  const downloadedSet = new Set(state.currentManga.downloadedChapters || []);
  const chapters = state.currentManga.chapters
    .filter(c => downloadedSet.has(c.number))
    .sort((a, b) => a.number - b.number);

  const currentIndex = chapters.findIndex(c => c.number === state.currentChapter.number);

  if (currentIndex < 0 || currentIndex >= chapters.length - 1) {
    return null;
  }

  return chapters[currentIndex + 1].number;
}

// Get the previous downloaded chapter number
function getPrevChapterNumber() {
  if (!state.currentManga || !state.currentChapter) return null;

  const downloadedSet = new Set(state.currentManga.downloadedChapters || []);
  const chapters = state.currentManga.chapters
    .filter(c => downloadedSet.has(c.number))
    .sort((a, b) => a.number - b.number);

  const currentIndex = chapters.findIndex(c => c.number === state.currentChapter.number);

  if (currentIndex <= 0) {
    return null;
  }

  return chapters[currentIndex - 1].number;
}

// Check if a specific chapter has lastPageSingle enabled
function getChapterLastPageSingleFor(chapterNum) {
  if (!state.currentManga) return false;
  const mangaId = state.currentManga.id;
  return state.chapterSettings[mangaId]?.[chapterNum]?.lastPageSingle || false;
}

// Save firstPageSingle for a specific chapter
async function saveChapterFirstPageSingleFor(chapterNum, value) {
  if (!state.currentManga) return;

  const mangaId = state.currentManga.id;

  if (!state.chapterSettings[mangaId]) {
    state.chapterSettings[mangaId] = {};
  }
  if (!state.chapterSettings[mangaId][chapterNum]) {
    state.chapterSettings[mangaId][chapterNum] = {};
  }

  state.chapterSettings[mangaId][chapterNum].firstPageSingle = value;

  try {
    await API.saveChapterSetting(mangaId, chapterNum, state.chapterSettings[mangaId][chapterNum]);
  } catch (e) {
    console.error('Error saving chapter setting:', e);
  }
}

// ==================== FAVORITES FUNCTIONS ====================

async function loadFavorites() {
  try {
    const data = await API.getFavorites();
    state.favorites = data.favorites || {};
    state.favoriteListOrder = data.listOrder || Object.keys(state.favorites);
  } catch (e) {
    console.error('Error loading favorites:', e);
    state.favorites = {};
    state.favoriteListOrder = [];
  }
}

async function saveFavorites() {
  try {
    await API.saveFavorites(state.favorites, state.favoriteListOrder);
  } catch (e) {
    console.error('Error saving favorites:', e);
  }
}

function getFavoriteLists() {
  return state.favoriteListOrder;
}

async function createFavoriteList(name) {
  if (!name || state.favorites[name]) return false;
  state.favorites[name] = [];
  state.favoriteListOrder.push(name);
  await saveFavorites();
  return true;
}

async function deleteFavoriteList(name) {
  if (!state.favorites[name]) return false;
  delete state.favorites[name];
  state.favoriteListOrder = state.favoriteListOrder.filter(n => n !== name);
  await saveFavorites();
  return true;
}

async function renameFavoriteList(oldName, newName) {
  if (!state.favorites[oldName] || state.favorites[newName]) return false;
  state.favorites[newName] = state.favorites[oldName];
  delete state.favorites[oldName];
  state.favoriteListOrder = state.favoriteListOrder.map(n => n === oldName ? newName : n);
  await saveFavorites();
  return true;
}

async function addFavorite(listName, favorite) {
  if (!state.favorites[listName]) {
    state.favorites[listName] = [];
    state.favoriteListOrder.push(listName);
  }
  state.favorites[listName].push({
    ...favorite,
    createdAt: new Date().toISOString()
  });
  await saveFavorites();
}

async function removeFavorite(listName, index) {
  if (!state.favorites[listName]) return;
  state.favorites[listName].splice(index, 1);
  await saveFavorites();
}

function getCurrentPageInfo() {
  if (!state.currentManga || !state.currentChapter || !state.currentImages) return null;

  const { mode, currentPage, firstPageSingle, singlePageMode } = state.readerSettings;
  const trophyInfo = getCurrentTrophyPages();
  const lastPageSingle = getChapterLastPageSingle();

  if (mode === 'webtoon') {
    // For webtoon, find which image is currently visible
    const content = document.getElementById('reader-content');
    if (!content) return null;

    const images = content.querySelectorAll('.webtoon-page');
    let visibleIndex = 0;
    const scrollTop = content.scrollTop;
    const viewportCenter = scrollTop + content.clientHeight / 2;

    images.forEach((img, idx) => {
      const rect = img.getBoundingClientRect();
      const imgCenter = img.offsetTop + rect.height / 2;
      if (imgCenter < viewportCenter) visibleIndex = idx;
    });

    return {
      pageIndices: [visibleIndex],
      displayMode: 'single',
      displaySide: 'both',
      imagePaths: [state.currentImages[visibleIndex]]
    };
  } else {
    // Manga mode
    const spreads = buildSpreadMap(state.currentImages.length, firstPageSingle, trophyInfo, lastPageSingle);
    const spread = spreads[currentPage];

    if (!spread) return null;

    const isSingle = singlePageMode || spread.pages.length === 1;

    return {
      pageIndices: spread.pages,
      displayMode: isSingle ? 'single' : 'double',
      displaySide: 'both', // Will be set by user in dialog
      imagePaths: spread.pages.map(idx => state.currentImages[idx])
    };
  }
}

function openFavoriteDialog() {
  const pageInfo = getCurrentPageInfo();
  if (!pageInfo) {
    showToast('Could not get current page info', 'error');
    return;
  }

  const lists = getFavoriteLists();
  const isDouble = pageInfo.displayMode === 'double' && pageInfo.pageIndices.length === 2;

  const dialog = document.createElement('div');
  dialog.className = 'modal';
  dialog.id = 'favorite-modal';
  dialog.style.display = 'flex';
  dialog.innerHTML = `
    <div class="modal-content favorite-dialog">
      <h2>⭐ Add to Favorites</h2>
      
      ${isDouble ? `
        <div class="favorite-option-group">
          <label>Which page to save?</label>
          <div class="favorite-page-options">
            <button class="btn btn-secondary favorite-side-btn" data-side="left">Left Page</button>
            <button class="btn btn-secondary favorite-side-btn active" data-side="both">Both Pages</button>
            <button class="btn btn-secondary favorite-side-btn" data-side="right">Right Page</button>
          </div>
        </div>
      ` : ''}
      
      <div class="favorite-option-group">
        <label>Add to list:</label>
        <div class="favorite-list-options">
          ${lists.length > 0 ? lists.map(name => `
            <button class="btn btn-secondary favorite-list-btn" data-list="${name}">${name}</button>
          `).join('') : '<span class="muted">No lists yet</span>'}
        </div>
      </div>
      
      <div class="favorite-option-group">
        <label>Or create new list:</label>
        <div class="favorite-new-list">
          <input type="text" id="new-favorite-list-name" placeholder="List name">
          <button class="btn btn-primary" onclick="createAndAddFavorite()">Create & Add</button>
        </div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeFavoriteDialog()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  // Store page info for later
  dialog.dataset.pageInfo = JSON.stringify(pageInfo);

  // Side selection handlers
  dialog.querySelectorAll('.favorite-side-btn').forEach(btn => {
    btn.onclick = () => {
      dialog.querySelectorAll('.favorite-side-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
  });

  // List selection handlers
  dialog.querySelectorAll('.favorite-list-btn').forEach(btn => {
    btn.onclick = () => {
      const listName = btn.dataset.list;
      addFavoriteFromDialog(listName);
    };
  });
}

function closeFavoriteDialog() {
  const modal = document.getElementById('favorite-modal');
  if (modal) modal.remove();
}

function getSelectedSide() {
  const activeBtn = document.querySelector('.favorite-side-btn.active');
  return activeBtn ? activeBtn.dataset.side : 'both';
}

async function addFavoriteFromDialog(listName) {
  const modal = document.getElementById('favorite-modal');
  if (!modal) return;

  const pageInfo = JSON.parse(modal.dataset.pageInfo);
  const displaySide = getSelectedSide();

  const favorite = {
    mangaId: state.currentManga.id,
    mangaTitle: state.currentManga.alias || state.currentManga.title,
    chapterNum: state.currentChapter.number,
    chapterUrl: state.currentChapter.url,
    pageIndices: pageInfo.pageIndices,
    displayMode: pageInfo.displayMode,
    displaySide: displaySide,
    imagePaths: pageInfo.imagePaths
  };

  await addFavorite(listName, favorite);
  closeFavoriteDialog();
  showToast(`Added to "${listName}"`, 'success');
}

async function createAndAddFavorite() {
  const input = document.getElementById('new-favorite-list-name');
  const name = input?.value?.trim();

  if (!name) {
    showToast('Please enter a list name', 'error');
    return;
  }

  if (state.favorites[name]) {
    showToast('List already exists', 'error');
    return;
  }

  await createFavoriteList(name);
  await addFavoriteFromDialog(name);
}

// ==================== FAVORITES VIEWER ====================

function openMangaFavorites(mangaId) {
  const manga = state.bookmarks.find(b => b.id === mangaId) || state.currentManga;
  if (!manga) return;

  const allFavorites = [];
  const tags = new Set();

  if (state.favorites) {
    Object.entries(state.favorites).forEach(([listName, items]) => {
      items.forEach(item => {
        if (item.mangaId === mangaId) {
          allFavorites.push({ ...item, _sourceList: listName });
          tags.add(listName);
        }
      });
    });
  }

  if (allFavorites.length === 0) {
    showToast('No favorites found for this manga', 'info');
    return;
  }

  state.currentFavoriteList = null;
  state.allMangaFavorites = allFavorites;
  state.favoritesTags = ['All', ...Array.from(tags).sort()];
  state.activeFavoritesTag = 'All';
  state.currentFavoritesItems = allFavorites;
  state.currentFavoriteIndex = 0;
  state.currentFavoritesTitle = `Favorites: ${manga.alias || manga.title}`;

  state.currentFavoriteIndex = 0;
  state.currentFavoritesTitle = `Favorites: ${manga.alias || manga.title}`;

  renderFavoritesGallery();
}

function filterFavoritesByTag(tag) {
  state.activeFavoritesTag = tag;
  if (tag === 'All') {
    state.currentFavoritesItems = state.allMangaFavorites;
  } else {
    state.currentFavoritesItems = state.allMangaFavorites.filter(item => item._sourceList === tag);
  }
  state.currentFavoriteIndex = 0;
  renderFavoritesGallery();
}

function openFavoritesFilterModal() {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 300px;">
      <h3>Filter by Tag</h3>
      <div class="params-list" style="display:flex;flex-direction:column;gap:8px;">
        ${state.favoritesTags.map(tag => `
          <button class="btn ${state.activeFavoritesTag === tag ? 'btn-primary' : 'btn-secondary'}" 
                  style="width:100%;text-align:left;justify-content:flex-start;"
                  onclick="filterFavoritesByTag('${tag}'); this.closest('.modal').remove()">
            ${tag}
          </button>
        `).join('')}
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function openFavoritesViewer() {
  const lists = getFavoriteLists();

  if (lists.length === 0) {
    showToast('No favorites yet! Add some using the ⭐ button in the reader.', 'info');
    return;
  }

  // Show list selection modal
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'favorites-list-modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content favorites-list-dialog">
      <h2>⭐ Favorites</h2>
      
      <div class="favorites-lists">
        ${lists.map(name => `
          <div class="favorites-list-item">
            <button class="btn btn-secondary favorites-list-open" data-list="${name}">
              ${name} (${state.favorites[name]?.length || 0})
            </button>
            <button class="btn-icon small danger" onclick="confirmDeleteFavoriteList('${name}')" title="Delete list">🗑️</button>
          </div>
        `).join('')}
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeFavoritesListModal()">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Open list handlers
  modal.querySelectorAll('.favorites-list-open').forEach(btn => {
    btn.onclick = () => {
      const listName = btn.dataset.list;
      closeFavoritesListModal();
      showFavoritesReader(listName);
    };
  });
}

function closeFavoritesListModal() {
  const modal = document.getElementById('favorites-list-modal');
  if (modal) modal.remove();
}

async function confirmDeleteFavoriteList(name) {
  if (confirm(`Delete favorite list "${name}" and all its items?`)) {
    await deleteFavoriteList(name);
    closeFavoritesListModal();
    openFavoritesViewer();
  }
}

function showFavoritesReader(listName) {
  const favorites = state.favorites[listName];
  if (!favorites || favorites.length === 0) {
    showToast('This list is empty', 'info');
    return;
  }

  state.currentFavoriteList = listName;
  state.favoritesTags = null; // Clear tags for single list view
  state.currentFavoritesItems = favorites;
  state.currentFavoriteIndex = 0;
  state.currentFavoritesTitle = `⭐ ${listName}`;

  renderFavoritesGallery();
}

function renderFavoritesGallery() {
  const items = state.currentFavoritesItems;
  const listName = state.currentFavoritesTitle || state.currentFavoriteList;
  const direction = state.readerSettings.direction; // Get global direction

  const app = document.getElementById('app');

  // Use standard page structure
  app.innerHTML = `
    ${renderHeader('favorites')}
    <div class="container" id="favorites-gallery-page">
      <div class="header-controls" style="margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <button class="btn btn-secondary" onclick="closeFavoritesReader()">← Back</button>
          <h2>${listName} <span style="font-size:0.6em;color:var(--text-muted);">(${items.length} items)</span></h2>
        </div>
        
        <div style="display: flex; gap: 10px;">
          ${state.favoritesTags && state.favoritesTags.length > 2 ? `
            <button class="btn btn-secondary" onclick="openFavoritesFilterModal()">
              🏷️ Filter: ${state.activeFavoritesTag || 'All'}
            </button>
          ` : ''}
        </div>
      </div>
      
      ${items.length === 0 ? '<div class="empty-state"><h2>No favorites found</h2></div>' : ''}
      
      <div class="library-grid" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); grid-auto-flow: dense;">
        ${items.map((item, index) => {
    const getUrl = (img) => typeof img === 'string' ? img : (img?.url || img);
    const rawImages = (item.imagePaths || []).map(getUrl);

    // Determine display logic matching the reader
    let imagesToShow = [];
    let isDouble = false;

    if (item.displaySide === 'left') {
      // Only show the left side image
      const img = direction === 'rtl' ? rawImages[1] : rawImages[0];
      imagesToShow = [img || rawImages[0]];
    } else if (item.displaySide === 'right') {
      // Only show the right side image
      const img = direction === 'rtl' ? rawImages[0] : rawImages[1];
      imagesToShow = [img || rawImages[0]];
    } else if (item.displayMode === 'double' && rawImages.length === 2) {
      // Double spread
      isDouble = true;
      imagesToShow = rawImages;
    } else {
      // Default single
      imagesToShow = [rawImages[0]];
    }

    let contentHtml = '';
    if (isDouble) {
      const [left, right] = direction === 'rtl' ? [imagesToShow[1], imagesToShow[0]] : [imagesToShow[0], imagesToShow[1]];
      // Double page spread
      contentHtml = `
               <div class="spread-thumb" style="display:flex; height:100%; width:100%;">
                 <img src="${left}" style="width:50%; height:100%; object-fit:contain; display:block;" loading="lazy">
                 <img src="${right}" style="width:50%; height:100%; object-fit:contain; display:block;" loading="lazy">
               </div>
             `;
    } else {
      // Single page
      contentHtml = `<img src="${imagesToShow[0]}" alt="Favorite" loading="lazy" style="width:100%; height:100%; object-fit:contain;">`;
    }

    // If double, span 2 columns and use wider aspect ratio
    const colSpan = isDouble ? 'grid-column: span 2;' : '';
    const aspectRatio = isDouble ? 'aspect-ratio: 4/3;' : 'aspect-ratio: 2/3;';

    return `
             <div class="manga-card" onclick="openFavoriteAtIndex(${index})" style="${colSpan}">
               <div class="manga-card-cover" style="${aspectRatio} background: #222;">
                 ${contentHtml}
                 <div class="manga-card-badges">
                   <span class="badge badge-chapters">Ch.${item.chapterNum}</span>
                 </div>
               </div>
               <div class="manga-card-title">${item.mangaTitle || 'Unknown Series'}</div>
             </div>
           `;
  }).join('')}
      </div>
    </div>
    ${renderAddModal()} 
  `;
}

function openFavoriteAtIndex(index) {
  state.currentFavoriteIndex = index;
  renderFavoritesReader();
}

function renderFavoritesReader() {
  const items = state.currentFavoritesItems;
  const index = state.currentFavoriteIndex;
  const fav = items?.[index];
  const listName = state.currentFavoriteList;

  if (!fav) return;

  // Extract URLs from imagePaths (handle both object {url} and string formats)
  const getUrl = (img) => typeof img === 'string' ? img : (img?.url || img);
  const images = (fav.imagePaths || []).map(getUrl);

  // Build image HTML based on displayMode and displaySide
  let imageHtml = '';
  const direction = state.readerSettings.direction;

  if (fav.displayMode === 'single' || fav.displaySide === 'both') {
    // Show all images
    if (fav.displayMode === 'double' && images.length === 2) {
      const [left, right] = direction === 'rtl'
        ? [images[1], images[0]]
        : [images[0], images[1]];
      imageHtml = `
        <div class="spread favorite-spread">
          <img src="${left}" class="spread-page" alt="Left">
          <img src="${right}" class="spread-page" alt="Right">
        </div>
      `;
    } else {
      imageHtml = `
        <div class="spread favorite-spread single">
          <img src="${images[0]}" class="spread-page" alt="Page">
        </div>
      `;
    }
  } else if (fav.displaySide === 'left') {
    const imgPath = direction === 'rtl' ? images[1] : images[0];
    imageHtml = `
      <div class="spread favorite-spread single">
        <img src="${imgPath || images[0]}" class="spread-page" alt="Left">
      </div>
    `;
  } else if (fav.displaySide === 'right') {
    const imgPath = direction === 'rtl' ? images[0] : images[1];
    imageHtml = `
      <div class="spread favorite-spread single">
        <img src="${imgPath || images[0]}" class="spread-page" alt="Right">
      </div>
    `;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="reader favorites-reader" id="reader">
      <div class="reader-header" id="reader-header">
        <div class="reader-title">
          <span style="color:var(--accent);">${state.currentFavoritesTitle || 'Favorites'}</span>
          <span style="margin-left:15px;font-size:0.9em;">${fav.mangaTitle} - Ch.${fav.chapterNum}</span>
        </div>
        <div class="reader-controls">
          ${state.favoritesTags && state.favoritesTags.length > 2 ? `
            <button class="reader-control-btn" onclick="openFavoritesFilterModal()" title="Filter by tag">🏷️</button>
          ` : ''}
          <button class="reader-control-btn danger" onclick="removeCurrentFavorite()" title="Remove from favorites">🗑️</button>
          ${state.readerSettings.mode === 'webtoon' ? `
            <div class="zoom-control">
              <span class="zoom-label">🔍</span>
              <input type="range" min="30" max="100" value="${state.readerSettings.zoom || 100}" class="zoom-slider" onchange="setZoom(this.value)" oninput="previewZoom(this.value)">
              <span class="zoom-value" id="zoom-value">${state.readerSettings.zoom || 100}%</span>
            </div>
          ` : ''}
          <button class="reader-control-btn toggle-btn" onclick="toggleFavoritesMode()" title="${state.readerSettings.mode === 'webtoon' ? 'Webtoon mode' : 'Manga mode'}">
            ${state.readerSettings.mode === 'webtoon' ? '📜' : '📖'}
          </button>
          <button class="reader-control-btn toggle-btn" onclick="toggleFavoritesDirection()" title="${direction === 'rtl' ? 'Japanese (RTL)' : 'Western (LTR)'}">
            ${direction === 'rtl' ? 'あ' : 'A'}
          </button>
          <button class="reader-control-btn" onclick="toggleFullscreen()" title="Fullscreen" id="fullscreen-btn">
            ⛶
          </button>
          <button class="reader-control-btn" onclick="renderFavoritesGallery()" title="Back to Gallery">
            ☷
          </button>
          <button class="reader-control-btn" onclick="closeFavoritesReader()" title="Close">
            ✕
          </button>
        </div>
      </div>
      
      <div class="reader-content ${state.readerSettings.mode === 'webtoon' ? 'webtoon' : 'manga'}" id="reader-content" onclick="handleFavoritesClick(event)" style="${state.readerSettings.mode === 'webtoon' ? 'justify-content: flex-start; padding-top: 80px;' : ''}">
        ${state.readerSettings.mode === 'webtoon'
      ? (() => {
        // Webtoon mode: show ALL favorites in the current filtered list as a continuous strip
        const blocks = items.map((item, idx) => {
          const getUrl = (img) => typeof img === 'string' ? img : (img?.url || img);
          const rawImages = (item.imagePaths || []).map(getUrl);

          // Determine which images to show based on settings
          let imagesToShow = [];

          // Determine which images to show based on settings, matching Gallery logic
          // Webtoon mode validation: Ensure we show exactly what the user saved
          const direction = state.readerSettings.direction; // Use global direction

          if (item.displaySide === 'left') {
            // Only show the left side image
            const img = direction === 'rtl' ? rawImages[1] : rawImages[0];
            imagesToShow = [img || rawImages[0]];
          } else if (item.displaySide === 'right') {
            // Only show the right side image
            const img = direction === 'rtl' ? rawImages[0] : rawImages[1];
            imagesToShow = [img || rawImages[0]];
          } else if (item.displayMode === 'double' && rawImages.length === 2) {
            // Link mode/Double spread
            imagesToShow = rawImages;
            // Ensure correct order for spread if needed, but Webtoon stacks vertically usually.
            // If we want them side-by-side in webtoon (which is rare), we'd need a container.
            // For now, let's stack them in file order (0 then 1) as that's standard for webtoon scrolls.
          } else {
            // Default single
            imagesToShow = [rawImages[0]];
          }

          // Render all resulting images
          const zoom = state.readerSettings.zoom || 100;

          if (imagesToShow.length === 2) {
            // Custom side-by-side spread rendering for Webtoon mode
            const [leftImg, rightImg] = direction === 'rtl'
              ? [imagesToShow[1], imagesToShow[0]]
              : [imagesToShow[0], imagesToShow[1]];

            return `
               <div id="fav-block-${idx}" style="margin-bottom:10px; display:flex; justify-content:center; max-width:${zoom}%; margin-left:auto; margin-right:auto;">
                 <img src="${leftImg}" style="width:50%; height:auto; display:block;" loading="lazy">
                 <img src="${rightImg}" style="width:50%; height:auto; display:block;" loading="lazy">
               </div>
             `;
          } else {
            // Standard vertical rendering
            const imagesHtml = imagesToShow.map(imgSrc =>
              `<img src="${imgSrc}" style="max-width:${zoom}%; display:block; margin: 0 auto; margin-bottom:0;" loading="lazy">`
            ).join('');
            return `<div id="fav-block-${idx}" style="margin-bottom:10px; text-align:center;">${imagesHtml}</div>`;
          }
        });

        return blocks.join('');
      })()
      : imageHtml
    }
      </div>
      
      <div class="reader-footer" id="reader-footer" style="${state.readerSettings.mode === 'webtoon' ? 'display:none;' : ''}">
        <button class="btn btn-secondary btn-small" onclick="prevFavorite()">← Prev</button>
        <span class="page-indicator">${index + 1} / ${items.length}</span>
        <button class="btn btn-secondary btn-small" onclick="nextFavorite()">Next →</button>
      </div>
    </div>
  `;

  // Restore scroll position or scroll to current index in Webtoon mode
  // Restore scroll position or scroll to current index in Webtoon mode
  if (state.readerSettings.mode === 'webtoon') {
    setTimeout(() => {
      const el = document.getElementById(`fav-block-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
      }

      // Add scroll listener to update current index
      const content = document.getElementById('reader-content');
      if (content) {
        let scrollTimeout;
        content.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            const blocks = content.querySelectorAll('div[id^="fav-block-"]');
            const scrollTop = content.scrollTop;

            for (const block of blocks) {
              // Find first block that is substantially visible
              if (block.offsetTop + block.offsetHeight > scrollTop + 50) {
                const idx = parseInt(block.id.replace('fav-block-', ''));
                if (!isNaN(idx)) {
                  state.currentFavoriteIndex = idx;
                }
                break;
              }
            }
          }, 100);
        });
      }
    }, 50);
  }
}

function toggleFavoritesMode() {
  state.readerSettings.mode = state.readerSettings.mode === 'webtoon' ? 'manga' : 'webtoon';
  saveReaderSettings();
  renderFavoritesReader();
}

function toggleFavoritesDirection() {
  state.readerSettings.direction = state.readerSettings.direction === 'rtl' ? 'ltr' : 'rtl';
  saveReaderSettings();
  renderFavoritesReader();
}

function handleFavoritesClick(event) {
  // Disable click navigation in webtoon mode as it uses scrolling
  if (state.readerSettings.mode === 'webtoon') return;

  const content = document.getElementById('reader-content');
  if (!content) return;

  const rect = content.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const third = rect.width / 3;

  const direction = state.readerSettings.direction;

  if (x < third) {
    // Left third
    direction === 'rtl' ? nextFavorite() : prevFavorite();
  } else if (x > third * 2) {
    // Right third
    direction === 'rtl' ? prevFavorite() : nextFavorite();
  }
}

function prevFavorite() {
  if (state.currentFavoriteIndex > 0) {
    state.currentFavoriteIndex--;
    renderFavoritesReader();
  }
}

function nextFavorite() {
  const items = state.currentFavoritesItems;
  if (state.currentFavoriteIndex < items.length - 1) {
    state.currentFavoriteIndex++;
    renderFavoritesReader();
  }
}

async function removeCurrentFavorite() {
  const items = state.currentFavoritesItems;
  const index = state.currentFavoriteIndex;
  const fav = items?.[index];

  if (!fav) return;

  const listName = fav._sourceList || state.currentFavoriteList;
  if (!listName) {
    showToast('Error identifying favorite list', 'error');
    return;
  }

  if (confirm('Remove this page from favorites?')) {
    // Find the real index in the backend list
    const realList = state.favorites[listName];
    if (!realList) return;

    // Use a robust check since we might be in an aggregated view where 'fav' is a copy
    const realIndex = realList.findIndex(item =>
      item.mangaId === fav.mangaId &&
      item.chapterNum === fav.chapterNum &&
      item.createdAt === fav.createdAt &&
      (item.imagePaths || [])[0] === (fav.imagePaths || [])[0]
    );

    if (realIndex === -1) {
      showToast('Could not find original favorite to remove', 'error');
      return;
    }

    try {
      await removeFavorite(listName, realIndex);

      // 1. Remove from source list object
      realList.splice(realIndex, 1);

      // 2. Remove from aggregated list if it exists
      if (state.allMangaFavorites) {
        // Find in allMangaFavorites
        const amIndex = state.allMangaFavorites.findIndex(item =>
          item.mangaId === fav.mangaId &&
          item._sourceList === listName &&
          item.createdAt === fav.createdAt
        );
        if (amIndex !== -1) state.allMangaFavorites.splice(amIndex, 1);
      }

      // 3. Remove from current view
      // If current view is NOT the same reference as realList (which it effectively isn't in filtered views)
      if (items !== realList) {
        items.splice(index, 1); // We can safely splice the current view array
      }

      // Adjust index
      if (state.currentFavoritesItems.length === 0) {
        closeFavoritesReader();
        showToast('List is now empty', 'info');
        return;
      }

      if (state.currentFavoriteIndex >= state.currentFavoritesItems.length) {
        state.currentFavoriteIndex = Math.max(0, state.currentFavoritesItems.length - 1);
      }

      renderFavoritesReader();
      showToast('Removed from favorites', 'success');
    } catch (error) {
      showToast('Failed to remove: ' + error.message, 'error');
    }
  }
}

function closeFavoritesReader() {
  // 1. If we are in the Reader view (id="reader"), close it and go back to Gallery
  const readerElement = document.getElementById('reader');
  if (readerElement) {
    // If it's the gallery using the reader ID (legacy check, though we changed it) or actual reader
    // Check internal structure or just assume if it has reader-content it's a reader

    // Actually, checking for 'favorites-gallery' class on the reader element might be useful if we hadn't changed IDs
    // But since we changed IDs, 'reader' means Reader Overlay.

    readerElement.remove(); // Safely remove the reader overlay/content
    // Re-render the gallery to restore the page view
    renderFavoritesGallery();
    return;
  }

  // 2. If we are in the Gallery view (id="favorites-gallery-page"), close it and go back to previous page
  const galleryElement = document.getElementById('favorites-gallery-page');
  if (galleryElement) {
    state.currentFavoriteList = null;
    state.currentFavoriteIndex = 0;
    state.allMangaFavorites = null;
    state.favoritesTags = null;

    // Smart navigation back
    if (state.currentManga) {
      router.navigate(`/manga/${state.currentManga.id}`);
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      router.navigate('/');
    }
    return;
  }

  // Fallback
  router.navigate('/');
}

// Fetch the first image of the next chapter for link mode
async function fetchNextChapterFirstImage() {
  if (!state.currentManga || !state.currentChapter) {
    state.nextChapterFirstImage = null;
    return;
  }

  const downloadedChapters = state.currentManga.downloadedChapters || [];
  const downloadedVersions = state.currentManga.downloadedVersions || {};
  const deletedUrls = new Set(state.currentManga.deletedChapterUrls || []);

  // Get unique downloaded chapter numbers sorted
  const sortedChapters = [...new Set(downloadedChapters)].sort((a, b) => a - b);

  const currentIndex = sortedChapters.indexOf(state.currentChapter.number);

  if (currentIndex < 0 || currentIndex >= sortedChapters.length - 1) {
    state.nextChapterFirstImage = null;
    return;
  }

  const nextChapterNum = sortedChapters[currentIndex + 1];

  // Find the downloaded version URL for next chapter (not hidden)
  let nextChapterUrl = null;
  const versions = downloadedVersions[nextChapterNum];
  if (versions) {
    const urlList = Array.isArray(versions) ? versions : [versions];
    // Find first non-hidden version
    nextChapterUrl = urlList.find(url => !deletedUrls.has(url));
  }

  try {
    const result = await API.getChapterImages(
      state.currentManga.id,
      nextChapterNum,
      nextChapterUrl ? encodeURIComponent(nextChapterUrl) : null
    );
    if (result.images && result.images.length > 0) {
      state.nextChapterFirstImage = result.images[0].url;
    } else {
      state.nextChapterFirstImage = null;
    }
  } catch (error) {
    console.error('Failed to fetch next chapter image:', error);
    state.nextChapterFirstImage = null;
  }
}

// Rotate current page by 90 degrees (permanently on disk)
async function rotateCurrentPage() {
  if (!state.currentManga || !state.currentChapter) return;

  const { singlePageMode, currentPage } = state.readerSettings;
  const firstPageSingle = getChapterFirstPageSingle();
  const trophyPages = getCurrentTrophyPages();

  // Get the page indices currently being displayed
  let visiblePages = [];

  if (singlePageMode) {
    visiblePages = [currentPage];
  } else {
    const spreads = buildSpreadMap(state.currentImages.length, firstPageSingle, trophyPages, getChapterLastPageSingle());
    const currentSpread = spreads[currentPage];
    if (currentSpread) {
      visiblePages = currentSpread.pages;
    }
  }

  if (visiblePages.length === 0) return;

  // Rotate each visible page on disk
  showToast('Rotating image...', 'info');

  for (const pageIndex of visiblePages) {
    const image = state.currentImages[pageIndex];
    if (image && image.url) {
      try {
        await API.rotateImage(image.url);
      } catch (error) {
        showToast(`Failed to rotate page ${pageIndex + 1}: ${error.message} `, 'error');
        return;
      }
    }
  }

  showToast(`Page${visiblePages.length > 1 ? 's' : ''} rotated 90°`, 'success');

  // Force refresh to reload images (add cache buster)
  state.currentImages = state.currentImages.map(img => ({
    ...img,
    url: img.url.split('?')[0] + '?t=' + Date.now()
  }));
  refreshReader();
}

// Delete current page permanently from disk
async function deleteCurrentPage() {
  if (!state.currentManga || !state.currentChapter) return;

  const { mode, singlePageMode, currentPage } = state.readerSettings;
  const firstPageSingle = getChapterFirstPageSingle();
  const trophyPages = getCurrentTrophyPages();

  // Get the page index to delete
  let pageToDelete = -1;

  if (mode === 'webtoon') {
    // In webtoon mode, find the page that's currently most visible in viewport
    const content = document.getElementById('reader-content');
    const images = content.querySelectorAll('img[data-page]');
    const viewportCenter = window.innerHeight / 2;

    let closestPage = -1;
    let closestDistance = Infinity;

    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const imgCenter = rect.top + rect.height / 2;
      const distance = Math.abs(imgCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPage = parseInt(img.dataset.page, 10);
      }
    });

    pageToDelete = closestPage;
  } else if (singlePageMode) {
    pageToDelete = currentPage;
  } else {
    // Double page mode - ask which page to delete if two are visible
    const spreads = buildSpreadMap(state.currentImages.length, firstPageSingle, trophyPages, getChapterLastPageSingle());
    const currentSpread = spreads[currentPage];

    if (currentSpread && currentSpread.pages.length === 2) {
      // Two pages visible - show dialog to choose
      const [page1, page2] = currentSpread.pages;
      const choice = await showDeletePageDialog(page1 + 1, page2 + 1);
      if (choice === null) return; // Cancelled
      pageToDelete = choice === 1 ? page1 : page2;
    } else if (currentSpread && currentSpread.pages.length === 1) {
      pageToDelete = currentSpread.pages[0];
    }
  }

  if (pageToDelete < 0 || pageToDelete >= state.currentImages.length) {
    showToast('No page selected', 'error');
    return;
  }

  const image = state.currentImages[pageToDelete];
  if (!image || !image.url) {
    showToast('Cannot delete this page', 'error');
    return;
  }

  // Show confirmation dialog
  const pageNum = pageToDelete + 1;
  const confirmed = confirm(`⚠️ DELETE PAGE ${pageNum}?\n\nThis will permanently delete this image from disk.\n\nThis action cannot be undone!`);

  if (!confirmed) return;

  try {
    showToast('Deleting page...', 'info');
    await API.deleteImage(image.url);
    showToast(`Page ${pageNum} deleted`, 'success');

    // Remove from current images array
    state.currentImages.splice(pageToDelete, 1);

    // Adjust current page if needed
    if (state.readerSettings.currentPage >= state.currentImages.length) {
      state.readerSettings.currentPage = Math.max(0, state.currentImages.length - 1);
    }

    // Clear any trophy pages that reference this or later pages
    const mangaId = state.currentManga.id;
    const chapterNum = state.currentChapter.number;
    if (state.trophyPages[mangaId] && state.trophyPages[mangaId][chapterNum]) {
      const newTrophyPages = {};
      for (const [idx, data] of Object.entries(state.trophyPages[mangaId][chapterNum])) {
        const pageIdx = parseInt(idx, 10);
        if (pageIdx < pageToDelete) {
          newTrophyPages[idx] = data;
        } else if (pageIdx > pageToDelete) {
          // Shift index down by 1
          newTrophyPages[pageIdx - 1] = {
            ...data,
            pages: data.pages ? data.pages.map(p => p > pageToDelete ? p - 1 : p) : undefined
          };
        }
        // If pageIdx === pageToDelete, it's deleted so we don't include it
      }
      state.trophyPages[mangaId][chapterNum] = newTrophyPages;
      saveTrophyPages();
    }

    // Refresh the reader
    refreshReader();
  } catch (error) {
    showToast(`Failed to delete page: ${error.message} `, 'error');
  }
}

// Helper function to show dialog for choosing which page to delete
function showDeletePageDialog(page1Num, page2Num) {
  return new Promise((resolve) => {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
    < div class="modal-content" style = "max-width: 350px;" >
        <h3>Delete Page</h3>
        <p style="margin: 15px 0; color: var(--danger);">⚠️ This will permanently delete the page from disk!</p>
        <p style="margin-bottom: 15px;">Which page do you want to delete?</p>
        <div style="display: flex; gap: 10px; justify-content: center;">
          <button class="btn btn-danger" id="delete-page-1">Page ${page1Num}</button>
          <button class="btn btn-danger" id="delete-page-2">Page ${page2Num}</button>
        </div>
        <div style="margin-top: 15px; text-align: center;">
          <button class="btn btn-secondary" id="delete-cancel">Cancel</button>
        </div>
      </div >
    `;
    document.body.appendChild(modal);

    modal.querySelector('#delete-page-1').onclick = () => {
      modal.remove();
      resolve(1);
    };
    modal.querySelector('#delete-page-2').onclick = () => {
      modal.remove();
      resolve(2);
    };
    modal.querySelector('#delete-cancel').onclick = () => {
      modal.remove();
      resolve(null);
    };
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(null);
      }
    };
  });
}

function setZoom(value) {
  state.readerSettings.zoom = parseInt(value);
  saveReaderSettings();
  // Update images directly without full refresh
  const images = document.querySelectorAll('#reader-content img');
  images.forEach(img => img.style.maxWidth = value + '%');
}

function previewZoom(value) {
  // Live preview without saving
  document.getElementById('zoom-value').textContent = value + '%';
  const images = document.querySelectorAll('#reader-content img');
  images.forEach(img => img.style.maxWidth = value + '%');
}

// Page slider functions
function goToPage(pageIndex) {
  const page = parseInt(pageIndex, 10);

  if (state.readerSettings.mode === 'webtoon') {
    // Scroll to the image at this index
    const content = document.getElementById('reader-content');
    const images = content.querySelectorAll('img');
    if (images[page]) {
      images[page].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } else {
    // Manga mode: go to this spread
    state.readerSettings.currentPage = page;
    refreshReader();
  }
  updatePageSlider();
}

function previewPageSlider(value) {
  // Update the page indicator text during drag
  const indicator = document.getElementById('page-indicator');
  if (!indicator) return;

  const page = parseInt(value, 10);

  if (state.readerSettings.mode === 'webtoon') {
    indicator.textContent = `${page + 1} / ${state.currentImages.length}`;
  } else {
    const trophyInfo = getCurrentTrophyPages();
    const lastPageSingle = getChapterLastPageSingle();
    const spreads = buildSpreadMap(state.currentImages.length, state.readerSettings.firstPageSingle, trophyInfo, lastPageSingle);
    indicator.textContent = `${page + 1} / ${spreads.length}`;
  }
}

function updatePageSlider() {
  const slider = document.getElementById('page-slider');
  const indicator = document.getElementById('page-indicator');
  if (!slider || !indicator) return;

  if (state.readerSettings.mode === 'webtoon') {
    // Update based on scroll position
    const content = document.getElementById('reader-content');
    const images = content.querySelectorAll('img');
    const scrollTop = content.scrollTop;
    const viewportCenter = scrollTop + content.clientHeight / 2;

    let currentIndex = 0;
    images.forEach((img, idx) => {
      if (img.offsetTop < viewportCenter) currentIndex = idx;
    });

    slider.value = currentIndex;
    slider.max = images.length - 1;
    indicator.textContent = `${currentIndex + 1} / ${images.length}`;
  } else {
    // Manga mode
    slider.value = state.readerSettings.currentPage;
    indicator.textContent = `${state.readerSettings.currentPage + 1} / ${parseInt(slider.max) + 1}`;
  }
}

// Setup scroll listener for webtoon mode page slider
function setupWebtoonScrollListener() {
  const content = document.getElementById('reader-content');
  if (!content) return;

  let scrollTimeout;
  content.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (state.readerSettings.mode === 'webtoon') {
        updatePageSlider();
      }
    }, 100);
  });
}

function handleReaderClick(event) {
  // Ignore clicks on buttons or controls
  if (event.target.closest('button') || event.target.closest('.reader-controls') || event.target.closest('.reader-footer')) {
    return;
  }

  const content = document.getElementById('reader-content');
  const rect = content.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const width = rect.width;

  // Mobile touch behavior: RIGHT = forward/next, LEFT = back/prev (always, regardless of RTL/LTR)
  if (isMobile()) {
    if (state.readerSettings.mode === 'webtoon') {
      // Webtoon mode: tap right to scroll down, tap left to scroll up
      if (clickX > width * 2 / 3) {
        // Right third - scroll down (next)
        scrollWebtoonForward();
      } else if (clickX < width / 3) {
        // Left third - scroll up (back)
        scrollWebtoonBack();
      } else {
        // Middle third - toggle UI
        toggleReaderUI();
      }
    } else {
      // Manga mode: tap right = next page, tap left = prev page (consistent regardless of direction)
      if (clickX > width * 2 / 3) {
        // Right third - go forward
        mobileNextPage();
      } else if (clickX < width / 3) {
        // Left third - go back
        mobilePrevPage();
      } else {
        // Middle third - toggle UI
        toggleReaderUI();
      }
    }
    return;
  }

  // Desktop behavior (unchanged)
  // In webtoon mode, just toggle UI on any click
  if (state.readerSettings.mode === 'webtoon') {
    toggleReaderUI();
    return;
  }

  // In manga mode, click left/right to navigate (no UI toggle)
  if (clickX < width / 3) {
    // Left third - prev (or next in RTL)
    if (state.readerSettings.direction === 'rtl') {
      nextPage();
    } else {
      prevPage();
    }
  } else if (clickX > width * 2 / 3) {
    // Right third - next (or prev in RTL)
    if (state.readerSettings.direction === 'rtl') {
      prevPage();
    } else {
      nextPage();
    }
  } else {
    // Middle third - toggle UI only here
    toggleReaderUI();
  }
}

function refreshReader() {
  const app = document.getElementById('app');
  app.innerHTML = renderReader(state.currentManga, state.currentChapter, state.currentImages, state.readerSettings, getCurrentTrophyPages(), getChapterLastPageSingle(), state.nextChapterFirstImage);

  if (state.readerSettings.mode === 'webtoon') {
    setupWebtoonScrollListener();
  } else {
    setupMangaScrollListener();
  }
  setupKeyboardNavigation();
}

// Debounced save to avoid too many server calls
let readerSettingsSaveTimeout = null;
function saveReaderSettings() {
  // Clear any pending save
  if (readerSettingsSaveTimeout) {
    clearTimeout(readerSettingsSaveTimeout);
  }
  // Debounce: wait 500ms before saving to server
  readerSettingsSaveTimeout = setTimeout(() => {
    API.saveReaderSettings(state.readerSettings).catch(e => {
      console.error('Error saving reader settings:', e);
    });
  }, 500);
}

async function loadReaderSettings() {
  try {
    const settings = await API.getReaderSettings();
    if (settings && Object.keys(settings).length > 0) {
      state.readerSettings = { ...state.readerSettings, ...settings };
    }
  } catch (e) {
    console.error('Error loading reader settings:', e);
  }
}

function toggleReaderUI() {
  const header = document.getElementById('reader-header');
  const footer = document.getElementById('reader-footer');
  header.classList.toggle('hidden');
  footer.classList.toggle('hidden');
}

function toggleFullscreen() {
  const btn = document.getElementById('fullscreen-btn');

  if (!document.fullscreenElement) {
    // Use documentElement so fullscreen survives DOM changes
    document.documentElement.requestFullscreen().then(() => {
      state.isFullscreen = true;
      if (btn) btn.textContent = '⛶';
    }).catch(err => {
      showToast('Could not enter fullscreen', 'error');
    });
  } else {
    document.exitFullscreen().then(() => {
      state.isFullscreen = false;
      if (btn) btn.textContent = '⛶';
    });
  }
}

// Listen for fullscreen changes to update button and state
document.addEventListener('fullscreenchange', () => {
  state.isFullscreen = !!document.fullscreenElement;
  const btn = document.getElementById('fullscreen-btn');
  if (btn) {
    btn.textContent = document.fullscreenElement ? '⛶' : '⛶';
    btn.title = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
  }
});

// Split a combined image into two pages (on disk)
async function splitCurrentImage() {
  const content = document.getElementById('reader-content');
  if (!content) return;

  let targetImg = null;

  if (state.readerSettings.mode === 'webtoon') {
    // In webtoon mode, find image most in view
    const images = content.querySelectorAll('img');
    const containerRect = content.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestDistance = Infinity;
    images.forEach(img => {
      const imgRect = img.getBoundingClientRect();
      const imgCenter = imgRect.top + imgRect.height / 2;
      const distance = Math.abs(imgCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        targetImg = img;
      }
    });
  } else {
    // In manga mode, find the widest image currently visible
    const images = Array.from(content.querySelectorAll('img.manga-page'));

    if (images.length === 0) {
      showToast('No images found to split', 'error');
      return;
    }

    // Find the widest image (most likely to be a double-page spread)
    let maxWidth = 0;
    for (const img of images) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio > maxWidth) {
        maxWidth = ratio;
        targetImg = img;
      }
    }

    // Check if the selected image is actually wide
    if (targetImg && targetImg.naturalWidth / targetImg.naturalHeight < 1.2) {
      showToast('No double-page spread found to split', 'info');
      return;
    }
  }

  if (!targetImg) {
    showToast('No image found to split', 'error');
    return;
  }

  await splitSingleImage(targetImg);
}

async function splitSingleImage(targetImg) {
  // Get the image URL (should be a local /downloads/ path)
  const imgUrl = targetImg.src;

  // Extract the path part (remove origin and query string)
  let imagePath;
  try {
    const url = new URL(imgUrl);
    // Decode URI to handle spaces and special characters
    imagePath = decodeURIComponent(url.pathname.split('?')[0]);
  } catch {
    imagePath = decodeURIComponent(imgUrl.split('?')[0]);
  }

  if (!imagePath.startsWith('/downloads/')) {
    showToast('Can only split downloaded images', 'error');
    return;
  }

  // Check aspect ratio
  const ratio = targetImg.naturalWidth / targetImg.naturalHeight;
  if (ratio < 1.2) {
    showToast('Image doesn\'t appear to be a double-page spread', 'info');
    return;
  }

  showToast('Splitting image...', 'info');

  try {
    await API.splitImage(imagePath, state.readerSettings.direction);
    showToast('Image split into two pages', 'success');

    // Reload the chapter to get the updated image list
    await reloadCurrentChapter();
  } catch (error) {
    showToast(`Failed to split: ${error.message}`, 'error');
  }
}

// Swap the order of currently visible pages
async function swapCurrentPages() {
  const content = document.getElementById('reader-content');
  if (!content) return;

  // Get the visible images
  const images = Array.from(content.querySelectorAll('img.manga-page'));

  if (images.length < 2) {
    showToast('Need two pages visible to swap', 'info');
    return;
  }

  // Get the URLs of both images
  let imagePath1, imagePath2;
  try {
    const url1 = new URL(images[0].src);
    const url2 = new URL(images[1].src);
    imagePath1 = decodeURIComponent(url1.pathname.split('?')[0]);
    imagePath2 = decodeURIComponent(url2.pathname.split('?')[0]);
  } catch {
    imagePath1 = decodeURIComponent(images[0].src.split('?')[0]);
    imagePath2 = decodeURIComponent(images[1].src.split('?')[0]);
  }

  if (!imagePath1.startsWith('/downloads/') || !imagePath2.startsWith('/downloads/')) {
    showToast('Can only swap downloaded images', 'error');
    return;
  }

  showToast('Swapping pages...', 'info');

  try {
    await API.swapImages(imagePath1, imagePath2);
    showToast('Pages swapped', 'success');

    // Add cache buster to force browser to reload swapped images
    state.currentImages = state.currentImages.map(img => ({
      ...img,
      url: img.url.split('?')[0] + '?t=' + Date.now()
    }));
    refreshReader();
  } catch (error) {
    showToast(`Failed to swap: ${error.message}`, 'error');
  }
}

// Reload current chapter images from server
async function reloadCurrentChapter() {
  if (!state.currentManga || !state.currentChapter) return;

  try {
    const result = await API.getChapterImages(
      state.currentManga.id,
      state.currentChapter.number
    );

    if (result.images) {
      state.currentImages = result.images;
      refreshReader();
    }
  } catch (error) {
    showToast('Failed to reload chapter', 'error');
  }
}



function setupMangaScrollListener() {
  const content = document.getElementById('reader-content');
  let scrollTimeout;

  content.addEventListener('wheel', (e) => {
    e.preventDefault();

    // Debounce scroll
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (e.deltaY > 0) {
        // Scroll down = next page
        nextPage();
      } else if (e.deltaY < 0) {
        // Scroll up = prev page
        prevPage();
      }
    }, 100);
  }, { passive: false });
}

function setupKeyboardNavigation() {
  // Remove old listener if exists
  if (window.readerKeyHandler) {
    document.removeEventListener('keydown', window.readerKeyHandler);
  }

  window.readerKeyHandler = (e) => {
    // Only handle if we're in reader
    if (!document.getElementById('reader')) return;

    const isRtl = state.readerSettings.direction === 'rtl';
    const isManga = state.readerSettings.mode === 'manga';

    // Check if we're in favorites reader mode
    const isFavoritesReader = state.currentFavoriteList !== null;

    switch (e.key) {
      case 'ArrowLeft':
        if (isManga) {
          if (isFavoritesReader) {
            isRtl ? nextFavorite() : prevFavorite();
          } else {
            isRtl ? nextPage() : prevPage();
          }
        }
        break;
      case 'ArrowRight':
        if (isManga) {
          if (isFavoritesReader) {
            isRtl ? prevFavorite() : nextFavorite();
          } else {
            isRtl ? prevPage() : nextPage();
          }
        }
        break;
      case 'ArrowUp':
      case 'PageUp':
        if (isManga) {
          isFavoritesReader ? prevFavorite() : prevPage();
        }
        break;
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        if (isManga) {
          e.preventDefault();
          isFavoritesReader ? nextFavorite() : nextPage();
        }
        break;
      case 'Escape':
        isFavoritesReader ? closeFavoritesReader() : closeReader();
        break;
    }
  };

  document.addEventListener('keydown', window.readerKeyHandler);
}

function prevPage() {
  if (state.readerSettings.mode === 'manga') {
    // Calculate max spread
    const totalImages = state.currentImages.length;
    const trophyInfo = getCurrentTrophyPages();
    const firstPageSingle = getChapterFirstPageSingle();
    let maxSpread;
    if (state.readerSettings.singlePageMode) {
      maxSpread = totalImages - 1;
    } else {
      const spreads = buildSpreadMap(totalImages, firstPageSingle, trophyInfo, getChapterLastPageSingle());
      maxSpread = spreads.length - 1;
    }

    // RTL: prev goes forward, LTR: prev goes back
    if (state.readerSettings.direction === 'rtl') {
      if (state.readerSettings.currentPage < maxSpread) {
        state.readerSettings.currentPage++;
        updateMangaPage();
      } else {
        nextChapter();
      }
    } else {
      if (state.readerSettings.currentPage > 0) {
        state.readerSettings.currentPage--;
        updateMangaPage();
      } else {
        prevChapter();
      }
    }
  }
}

function nextPage() {
  if (state.readerSettings.mode === 'manga') {
    const totalImages = state.currentImages.length;
    const trophyInfo = getCurrentTrophyPages();
    const firstPageSingle = getChapterFirstPageSingle();
    let maxSpread;
    if (state.readerSettings.singlePageMode) {
      maxSpread = totalImages - 1;
    } else {
      const spreads = buildSpreadMap(totalImages, firstPageSingle, trophyInfo, getChapterLastPageSingle());
      maxSpread = spreads.length - 1;
    }

    // RTL: next goes back, LTR: next goes forward
    if (state.readerSettings.direction === 'rtl') {
      if (state.readerSettings.currentPage > 0) {
        state.readerSettings.currentPage--;
        updateMangaPage();
      } else {
        prevChapter();
      }
    } else {
      if (state.readerSettings.currentPage < maxSpread) {
        state.readerSettings.currentPage++;
        updateMangaPage();
      } else {
        nextChapter();
      }
    }
  }
}

// Mobile-specific navigation: always right=forward, left=back regardless of RTL/LTR setting
function mobileNextPage() {
  if (state.readerSettings.mode === 'manga') {
    const totalImages = state.currentImages.length;
    const trophyInfo = getCurrentTrophyPages();
    const firstPageSingle = getChapterFirstPageSingle();
    let maxSpread;
    if (state.readerSettings.singlePageMode) {
      maxSpread = totalImages - 1;
    } else {
      const spreads = buildSpreadMap(totalImages, firstPageSingle, trophyInfo, getChapterLastPageSingle());
      maxSpread = spreads.length - 1;
    }

    if (state.readerSettings.currentPage < maxSpread) {
      state.readerSettings.currentPage++;
      updateMangaPage();
    } else {
      nextChapter();
    }
  }
}

function mobilePrevPage() {
  if (state.readerSettings.mode === 'manga') {
    if (state.readerSettings.currentPage > 0) {
      state.readerSettings.currentPage--;
      updateMangaPage();
    } else {
      prevChapter();
    }
  }
}

// Webtoon scroll navigation for mobile
function scrollWebtoonForward() {
  const content = document.getElementById('reader-content');
  if (!content) return;

  const scrollAmount = window.innerHeight * 0.8;
  const maxScroll = content.scrollHeight - content.clientHeight;

  if (content.scrollTop >= maxScroll - 10) {
    // At the bottom, go to next chapter
    nextChapter();
  } else {
    content.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  }
}

function scrollWebtoonBack() {
  const content = document.getElementById('reader-content');
  if (!content) return;

  if (content.scrollTop <= 10) {
    // At the top, go to previous chapter
    prevChapter();
  } else {
    const scrollAmount = window.innerHeight * 0.8;
    content.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
  }
}

function updateReader() {
  const app = document.getElementById('app');
  app.innerHTML = renderReader(state.currentManga, state.currentChapter, state.currentImages, state.readerSettings, getCurrentTrophyPages(), getChapterLastPageSingle(), state.nextChapterFirstImage);
  saveReaderSettings();
}

// Lightweight page update - only updates images and indicator, preserves fullscreen
function updateMangaPage() {
  const content = document.getElementById('reader-content');
  const indicator = document.getElementById('page-indicator');
  if (!content || !indicator) return;

  // Save reading progress
  saveCurrentProgress();

  const { currentPage, direction, singlePageMode } = state.readerSettings;
  const firstPageSingle = getChapterFirstPageSingle();
  const images = state.currentImages;
  const totalPages = images.length;
  const trophyInfo = getCurrentTrophyPages();

  // Helper to check trophy
  const isTrophyPage = (idx) => trophyInfo[idx] !== undefined;

  // Single page mode: show one page at a time, BUT trophy doubles always show as doubles
  if (singlePageMode) {
    const trophyData = trophyInfo[currentPage];
    if (trophyData && !trophyData.isSingle && trophyData.pages && trophyData.pages.length === 2) {
      // This is a trophy double - render as spread using saved order
      const [page1, page2] = trophyData.pages;
      const img1 = images[page1];
      const img2 = images[page2];
      if (img1 && img2) {
        // Use the saved order - page1 on left, page2 on right (as saved)
        content.innerHTML = `<img src="${img1.url}" alt="Page" class="manga-page left trophy" data-page="${page1}"><img src="${img2.url}" alt="Page" class="manga-page right trophy" data-page="${page2}">`;
      }
      indicator.textContent = `${currentPage + 1} / ${totalPages}`;
      const slider = document.getElementById('page-slider');
      if (slider) {
        slider.value = currentPage;
        slider.max = totalPages - 1;
      }
      saveReaderSettings();
      return;
    }

    // Regular single page
    const currentImg = images[currentPage];
    const trophy = isTrophyPage(currentPage) ? ' trophy' : '';
    if (currentImg) {
      content.innerHTML = `<img src="${currentImg.url}" alt="Page ${currentPage + 1}" class="manga-page single${trophy}" data-page="${currentPage}">`;
    }
    indicator.textContent = `${currentPage + 1} / ${totalPages}`;
    const slider = document.getElementById('page-slider');
    if (slider) {
      slider.value = currentPage;
      slider.max = totalPages - 1;
    }
    saveReaderSettings();
    return;
  }

  // Use spread map for proper trophy handling
  const spreads = buildSpreadMap(totalPages, firstPageSingle, trophyInfo, getChapterLastPageSingle());
  const currentSpread = spreads[currentPage] || { pages: [] };
  const isLastSpread = currentPage === spreads.length - 1;
  const lastPageIdx = totalPages - 1;
  const lastPageSingle = getChapterLastPageSingle();

  let leftImg = null, rightImg = null;
  let leftIdx = -1, rightIdx = -1;
  let nextChapterImg = null;

  if (currentSpread.pages.length === 1) {
    const pageIdx = currentSpread.pages[0];

    // Check if this is the last page and link mode is active
    if (isLastSpread && lastPageSingle && state.nextChapterFirstImage && pageIdx === lastPageIdx) {
      if (direction === 'rtl') {
        // RTL: current last page on right, next chapter first on left
        rightImg = images[pageIdx];
        rightIdx = pageIdx;
        nextChapterImg = state.nextChapterFirstImage;
      } else {
        // LTR: current last page on left, next chapter first on right
        leftImg = images[pageIdx];
        leftIdx = pageIdx;
        nextChapterImg = state.nextChapterFirstImage;
      }
    } else {
      leftImg = images[pageIdx];
      leftIdx = pageIdx;
    }
  } else if (currentSpread.pages.length === 2) {
    if (direction === 'rtl') {
      rightIdx = currentSpread.pages[0];
      leftIdx = currentSpread.pages[1];
      rightImg = images[rightIdx];
      leftImg = images[leftIdx];
    } else {
      leftIdx = currentSpread.pages[0];
      rightIdx = currentSpread.pages[1];
      leftImg = images[leftIdx];
      rightImg = images[rightIdx];
    }
  }

  const leftTrophy = leftIdx >= 0 && isTrophyPage(leftIdx) ? ' trophy' : '';
  const rightTrophy = rightIdx >= 0 && isTrophyPage(rightIdx) ? ' trophy' : '';

  let leftHtml = leftImg ? `<img src="${leftImg.url}" alt="Page" class="manga-page left${leftTrophy}" data-page="${leftIdx}">` : '';
  let rightHtml = rightImg ? `<img src="${rightImg.url}" alt="Page" class="manga-page right${rightTrophy}" data-page="${rightIdx}">` : '';

  // Handle next chapter image for link mode
  if (nextChapterImg) {
    if (direction === 'rtl') {
      // RTL: next chapter image on left (reading direction continues left)
      const nextChapterHtml = `<img src="${nextChapterImg}" alt="Next Chapter" class="manga-page left next-chapter" data-page="next">`;
      leftHtml = nextChapterHtml;
    } else {
      // LTR: next chapter image on right (reading direction continues right)
      const nextChapterHtml = `<img src="${nextChapterImg}" alt="Next Chapter" class="manga-page right next-chapter" data-page="next">`;
      rightHtml = nextChapterHtml;
    }
  }

  if (direction === 'rtl') {
    content.innerHTML = rightHtml + leftHtml;
  } else {
    content.innerHTML = leftHtml + rightHtml;
  }

  // Update page indicator and slider
  indicator.textContent = `${currentPage + 1} / ${spreads.length}`;
  const slider = document.getElementById('page-slider');
  if (slider) {
    slider.value = currentPage;
    slider.max = spreads.length - 1;
  }

  saveReaderSettings();
}

function prevChapter() {
  if (!state.currentManga || !state.currentChapter) return;

  // Auto-save current chapter settings before leaving
  saveChapterFirstPageSingle();

  const downloadedSet = new Set(state.currentManga.downloadedChapters || []);

  // Get unique chapter numbers that are downloaded (deduplicate by number)
  const seenNumbers = new Set();
  const chapters = state.currentManga.chapters
    .filter(c => {
      if (!downloadedSet.has(c.number)) return false;
      if (seenNumbers.has(c.number)) return false; // Skip duplicate chapter numbers
      seenNumbers.add(c.number);
      return true;
    })
    .sort((a, b) => a.number - b.number);

  const currentIndex = chapters.findIndex(c => c.number === state.currentChapter.number);

  if (currentIndex > 0) {
    const prevChapterData = chapters[currentIndex - 1];
    state.navigationDirection = 'prev'; // Start at last page
    // Use readMangaWithDirection to check for multiple versions
    readMangaWithDirection(state.currentManga.id, prevChapterData.number, 'prev');
  } else {
    showToast('No previous downloaded chapter', 'info');
  }
}

function nextChapter() {
  if (!state.currentManga || !state.currentChapter) return;

  // Auto-save current chapter settings before leaving
  saveChapterFirstPageSingle();

  const downloadedSet = new Set(state.currentManga.downloadedChapters || []);

  // Get unique chapter numbers that are downloaded (deduplicate by number)
  const seenNumbers = new Set();
  const chapters = state.currentManga.chapters
    .filter(c => {
      if (!downloadedSet.has(c.number)) return false;
      if (seenNumbers.has(c.number)) return false; // Skip duplicate chapter numbers
      seenNumbers.add(c.number);
      return true;
    })
    .sort((a, b) => a.number - b.number);

  const currentIndex = chapters.findIndex(c => c.number === state.currentChapter.number);

  if (currentIndex < chapters.length - 1) {
    const nextChapterData = chapters[currentIndex + 1];
    // If current chapter has link mode enabled, skip first page of next chapter
    const direction = getChapterLastPageSingle() ? 'next-linked' : 'next';
    state.navigationDirection = direction;
    // Use readMangaWithDirection to check for multiple versions
    readMangaWithDirection(state.currentManga.id, nextChapterData.number, direction);
  } else {
    showToast('No more downloaded chapters', 'info');
  }
}

// Read manga with navigation direction preserved (for prev/next chapter navigation)
async function readMangaWithDirection(mangaId, chapterNum, direction) {
  try {
    const manga = await API.getBookmark(mangaId);
    const downloadedVersions = manga.downloadedVersions || {};
    const deletedUrls = new Set(manga.deletedChapterUrls || []);
    const versions = downloadedVersions[chapterNum];

    // Filter out hidden/deleted versions
    let visibleVersions = [];
    if (Array.isArray(versions)) {
      visibleVersions = versions.filter(url => !deletedUrls.has(url));
    }

    // If multiple visible versions exist, open compare mode
    if (visibleVersions.length > 1) {
      const encodedUrls = visibleVersions.map(v => encodeURIComponent(v)).join(',');
      // Clear navigation direction since compare mode will handle it
      state.navigationDirection = null;
      openCompareView(mangaId, chapterNum, encodedUrls, true); // true = opened from reader
      return;
    }

    // Single version - navigate directly, keeping the direction
    state.navigationDirection = direction;
    router.navigate(`/read/${mangaId}/${chapterNum}`);
  } catch (error) {
    console.error('readMangaWithDirection error:', error);
    // Fallback to normal navigation
    state.navigationDirection = direction;
    router.navigate(`/read/${mangaId}/${chapterNum}`);
  }
}

// Chapter filtering
function filterChapters(filter, btn) {
  // Update button states
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter chapters (now using chapter-group wrapper)
  document.querySelectorAll('.chapter-group').forEach(item => {
    const type = item.dataset.type;
    const chapterItem = item.querySelector('.chapter-item');
    const isDownloaded = chapterItem && chapterItem.classList.contains('downloaded');

    let show = false;
    if (filter === 'all') {
      show = true;
    } else if (filter === 'downloaded') {
      show = isDownloaded;
    } else {
      show = type === filter;
    }

    item.style.display = show ? '' : 'none';
  });
}

// Chapter list pagination (CHAPTERS_PER_PAGE defined in components.js)

function goToChapterPage(page) {
  state.chapterListPage = page;
  refreshChapterList();
}

function goToFirstChapterPage() {
  goToChapterPage(0);
}

function goToLastChapterPage() {
  const totalChapters = state.currentManga?.chapters?.length || 0;
  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);
  goToChapterPage(Math.max(0, totalPages - 1));
}

function goToPrevChapterPage() {
  if (state.chapterListPage > 0) {
    goToChapterPage(state.chapterListPage - 1);
  }
}

function goToNextChapterPage() {
  const totalChapters = state.currentManga?.chapters?.length || 0;
  const totalPages = Math.ceil(totalChapters / CHAPTERS_PER_PAGE);
  if (state.chapterListPage < totalPages - 1) {
    goToChapterPage(state.chapterListPage + 1);
  }
}

function onChapterPageSelect(select) {
  goToChapterPage(parseInt(select.value, 10));
}

function refreshChapterList() {
  if (!state.currentManga) return;

  const app = document.getElementById('app');
  app.innerHTML = renderMangaDetail(state.currentManga, state.categories, state.chapterListPage);

  // Re-run post-render checks
  checkForMultipleCovers(state.currentManga.id);
  loadVersionDetails(state.currentManga.id);
  checkForCbzFiles(state.currentManga.id);
  checkForMissingCover(state.currentManga.id);
}

// Duplicate group toggle (collapsible)
function toggleDuplicateGroup(chapterNum) {
  const versions = document.getElementById(`dup-versions-${chapterNum}`);
  const icon = document.getElementById(`dup-icon-${chapterNum}`);
  if (versions) {
    const isHidden = versions.style.display === 'none';
    versions.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.textContent = isHidden ? '▼' : '▶';
  }
}

// Toggle versions dropdown for duplicate chapters
function toggleVersions(chapterNum) {
  const dropdown = document.getElementById(`versions-${chapterNum}`);
  const arrow = document.getElementById(`arrow-${chapterNum}`);
  if (dropdown) {
    const isHidden = dropdown.style.display === 'none';
    dropdown.style.display = isHidden ? 'flex' : 'none';
    if (arrow) arrow.classList.toggle('open', isHidden);
  }
}

// Long-press handler for chapter headers to show hidden versions
let longPressTimer = null;
let longPressTarget = null;
let longPressTriggered = false;

function setupChapterLongPress() {
  document.addEventListener('pointerdown', (e) => {
    const chapterItem = e.target.closest('.chapter-item');
    if (!chapterItem) return;

    // Don't trigger on buttons within chapter item
    if (e.target.closest('button')) return;

    const group = chapterItem.closest('.chapter-group');
    if (!group) return;

    const chapterNum = parseFloat(group.dataset.chapter);
    const mangaId = state.currentManga?.id;
    if (!mangaId) return;

    longPressTarget = chapterItem;
    longPressTriggered = false;
    longPressTimer = setTimeout(() => {
      longPressTriggered = true;
      showHiddenVersionsMenu(mangaId, chapterNum, e);
    }, 500);
  });

  document.addEventListener('pointerup', cancelLongPress);
  document.addEventListener('pointercancel', cancelLongPress);
  document.addEventListener('pointermove', (e) => {
    if (longPressTimer && longPressTarget) {
      const rect = longPressTarget.getBoundingClientRect();
      if (e.clientX < rect.left - 10 || e.clientX > rect.right + 10 ||
        e.clientY < rect.top - 10 || e.clientY > rect.bottom + 10) {
        cancelLongPress();
      }
    }
  });

  // Prevent click after long-press (stops navigation after showing menu)
  document.addEventListener('click', (e) => {
    if (longPressTriggered && e.target.closest('.chapter-item')) {
      e.preventDefault();
      e.stopPropagation();
      longPressTriggered = false;
    }
  }, true); // Use capture phase

  // Prevent context menu on chapter items (blocks mobile share/print popup)
  document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.chapter-item')) {
      e.preventDefault();
    }
  });
}

function cancelLongPress() {
  if (longPressTimer) {
    clearTimeout(longPressTimer);
    longPressTimer = null;
  }
  longPressTarget = null;
}

// Show hidden versions menu on long press
async function showHiddenVersionsMenu(mangaId, chapterNum, event) {
  cancelLongPress();

  // Show context menu with chapter options
  showChapterContextMenu(mangaId, chapterNum, event);
}

// Show context menu for chapter long-press
async function showChapterContextMenu(mangaId, chapterNum, event) {
  // Remove any existing popup
  const existing = document.querySelector('.chapter-context-menu');
  if (existing) existing.remove();

  // Fetch hidden versions count
  let hiddenCount = 0;
  try {
    const result = await API.getHiddenVersions(mangaId, chapterNum);
    hiddenCount = result.length > 0 ? result.length : (result.hiddenVersions?.length || 0); // Handle array or object return
  } catch (e) { }

  const popup = document.createElement('div');
  popup.className = 'chapter-context-menu';
  popup.innerHTML = `
    <div class="context-menu-items">
      ${hiddenCount > 0 ? `
        <button class="context-menu-item" onclick="showHiddenVersionsPopup2('${mangaId}', ${chapterNum}, event)">
          👁️ Show Hidden Versions (${hiddenCount})
        </button>
      ` : ''}
      <button class="context-menu-item" onclick="manualAddChapterVersion('${mangaId}', ${chapterNum})">
        ➕ Add Version (Link)
      </button>
      <button class="context-menu-item danger" onclick="excludeChapter('${mangaId}', ${chapterNum})">
        🚫 Exclude Chapter
      </button>
    </div>
  `;

  document.body.appendChild(popup);

  // Position near the click/touch
  const rect = popup.getBoundingClientRect();
  const x = event.clientX || event.pageX || 100;
  const y = event.clientY || event.pageY || 100;
  popup.style.left = Math.min(x, window.innerWidth - rect.width - 20) + 'px';
  popup.style.top = Math.min(y, window.innerHeight - rect.height - 20) + 'px';

  // Close when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closePopup(e) {
      if (!popup.contains(e.target)) {
        popup.remove();
        document.removeEventListener('click', closePopup);
      }
    });
  }, 100);
}

// Manual add chapter version
async function manualAddChapterVersion(mangaId, chapterNum) {
  // Close context menu
  const menu = document.querySelector('.chapter-context-menu');
  if (menu) menu.remove();

  const url = prompt(`Enter link to download Chapter ${chapterNum} from:`);
  if (!url || !url.trim()) return;

  showToast(`Starting manual download for Chapter ${chapterNum}...`, 'info');

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/chapters/${chapterNum}/manual-add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url.trim() })
    });

    const result = await response.json();

    if (result.error) {
      showToast(result.error, 'error');
    } else if (result.success) {
      showToast(`Download started! Task ID: ${result.taskId}`, 'success');
      // If we got a task ID, track it (it will show up in download manager)
      if (result.taskId) {
        trackDownload(result.taskId, mangaId, [chapterNum]);
      } else {
        // Manual refreshes if no task ID returned (synchronous case?)
        showToast('Download completed', 'success');
        // We might want to refresh the view to show the new version
        // But since it's likely a background task, the tracking above handles it.
        // If generic download returns result immediately (no task), we refresh.
        if (result.downloadResult) {
          // refresh data
          const manga = await API.getBookmark(mangaId);
          // Updating local state might be complex, simpler to reload manga detail
          showMangaDetail([mangaId]);
        }
      }
    }
  } catch (error) {
    showToast('Failed to start download: ' + error.message, 'error');
  }
}

// Show hidden versions popup (called from context menu)
async function showHiddenVersionsPopup2(mangaId, chapterNum, event) {
  // Close context menu
  const contextMenu = document.querySelector('.chapter-context-menu');
  if (contextMenu) contextMenu.remove();

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/hidden-versions/${chapterNum}`);
    if (!response.ok) {
      showToast('Failed to load hidden versions', 'error');
      return;
    }
    const result = await response.json();
    if (result.hiddenVersions?.length > 0) {
      showHiddenVersionsPopup(mangaId, chapterNum, result.hiddenVersions, event);
    }
  } catch (error) {
    showToast('Failed to load hidden versions', 'error');
  }
}

// Remove chapter entry (doesn't blacklist, can be re-added on update)
async function removeChapterEntry(mangaId, chapterNum) {
  // Close context menu
  const contextMenu = document.querySelector('.chapter-context-menu');
  if (contextMenu) contextMenu.remove();

  if (!confirm(`Remove chapter ${chapterNum} entry? It can be re-added on next update check.`)) return;

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/remove-chapter-entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum })
    });

    const result = await response.json();
    if (result.success) {
      showToast(`Chapter ${chapterNum} removed`, 'success');
      // Refresh the manga detail view
      showMangaDetail([mangaId]);
    } else {
      showToast(result.error || 'Failed to remove chapter', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Exclude chapter permanently (hide from list, delete files, prevent download all)
async function excludeChapter(mangaId, chapterNum) {
  // Close context menu
  const contextMenu = document.querySelector('.chapter-context-menu');
  if (contextMenu) contextMenu.remove();

  if (!confirm(`Exclude chapter ${chapterNum}?\n\nThis will:\n• Hide it from the chapter list\n• Delete downloaded files\n• Prevent it from being downloaded with "Download All"\n\nYou can restore it from the excluded chapters list.`)) return;

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/exclude-chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum })
    });

    const result = await response.json();
    if (result.success) {
      showToast(`Chapter ${chapterNum} excluded`, 'success');
      // Refresh the manga detail view
      showMangaDetail([mangaId]);
    } else {
      showToast(result.error || 'Failed to exclude chapter', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Unexclude a chapter (restore to list)
async function unexcludeChapter(mangaId, chapterNum) {
  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/unexclude-chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum })
    });

    const result = await response.json();
    if (result.success) {
      showToast(`Chapter ${chapterNum} restored`, 'success');
      // Refresh the manga detail view
      showMangaDetail([mangaId]);
    } else {
      showToast(result.error || 'Failed to restore chapter', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Display popup with hidden versions
function showHiddenVersionsPopup(mangaId, chapterNum, hiddenVersions, event) {
  // Remove any existing popup
  const existing = document.querySelector('.hidden-versions-popup');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.className = 'hidden-versions-popup';
  popup.innerHTML = `
    <div class="hidden-popup-header">
      <span>Hidden versions for Chapter ${chapterNum}</span>
      <button class="btn-icon small" onclick="this.closest('.hidden-versions-popup').remove()">×</button>
    </div>
    <div class="hidden-popup-content">
      ${hiddenVersions.map(v => `
        <div class="hidden-version-row">
          <span class="hidden-version-title">${v.title || `Chapter ${v.number}`}</span>
          <button class="btn btn-xs btn-primary" onclick="unhideVersion('${mangaId}', ${chapterNum}, '${encodeURIComponent(v.url)}')">
            Restore
          </button>
        </div>
      `).join('')}
    </div>
  `;

  document.body.appendChild(popup);

  // Position near the click
  const rect = popup.getBoundingClientRect();
  popup.style.left = Math.min(event.clientX, window.innerWidth - rect.width - 20) + 'px';
  popup.style.top = Math.min(event.clientY, window.innerHeight - rect.height - 20) + 'px';

  // Close when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closePopup(e) {
      if (!popup.contains(e.target)) {
        popup.remove();
        document.removeEventListener('click', closePopup);
      }
    });
  }, 100);
}

// Unhide a version
async function unhideVersion(mangaId, chapterNum, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/unhide-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    const result = await response.json();
    if (result.success) {
      showToast('Version restored', 'success');
      // Remove popup and refresh view
      const popup = document.querySelector('.hidden-versions-popup');
      if (popup) popup.remove();
      showMangaDetail([mangaId]);
    } else {
      showToast(result.error || 'Failed to restore', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Download a specific version by URL
async function downloadSpecificVersion(mangaId, chapterNum, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);
  showToast(`Downloading chapter ${chapterNum}...`, 'info');

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/download-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    const result = await response.json();
    if (result.taskId) {
      // Track the download like regular chapter downloads
      trackDownload(result.taskId, mangaId, result.chapters || [chapterNum]);
    } else if (result.error) {
      showToast(result.error || 'Download failed', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function toggleDuplicateManager() {
  const content = document.getElementById('duplicate-manager-content');
  const icon = document.getElementById('dup-manager-icon');
  if (content) {
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.textContent = isHidden ? '▲' : '▼';
  }
}

function toggleExcludedManager() {
  const content = document.getElementById('excluded-manager-content');
  const icon = document.getElementById('excluded-manager-icon');
  if (content) {
    const isHidden = content.style.display === 'none';
    content.style.display = isHidden ? 'block' : 'none';
    if (icon) icon.textContent = isHidden ? '▲' : '▼';
  }
}

// Hide a version from the list (adds to deletedChapterUrls) - keeps URL for update checking
async function hideChapterVersion(mangaId, chapterNum, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/hide-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    const result = await response.json();
    if (result.success) {
      showToast('Version hidden from list', 'success');
      // Remove from UI without full refresh
      hideVersionFromUI(chapterNum, encodedUrl);
    } else {
      showToast(result.error || 'Failed to hide', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Remove version from UI without refresh
function hideVersionFromUI(chapterNum, encodedUrl) {
  removeVersionFromUI(chapterNum, encodedUrl, false);
}

// Remove version from UI - isDeleteOnly: true means version still shows but not downloaded
function removeVersionFromUI(chapterNum, encodedUrl, isDeleteOnly) {
  // Find version row in dropdown
  const versionRow = document.querySelector(`.version-row[onclick*="${encodedUrl}"]`);
  if (versionRow) {
    if (isDeleteOnly) {
      // Just mark as not downloaded
      versionRow.classList.remove('downloaded');
      // Update buttons - change delete to download
      const btns = versionRow.querySelector('.version-btns');
      if (btns) {
        const delBtn = btns.querySelector('button.danger');
        if (delBtn) {
          delBtn.classList.remove('danger');
          delBtn.innerHTML = '↓';
          delBtn.title = 'Download';
          // Update onclick to download instead of delete
          const mangaId = state.currentManga?.id;
          if (mangaId) {
            delBtn.setAttribute('onclick', `event.stopPropagation(); downloadSpecificVersion('${mangaId}', ${chapterNum}, '${encodedUrl}')`);
          }
        }
      }
    } else {
      // Remove entirely (hide)
      versionRow.remove();
    }
  }

  // Also check duplicate manager rows
  const dupRow = document.querySelector(`.duplicate-version-row[data-url="${encodedUrl}"]`);
  if (dupRow) {
    dupRow.remove();
  }

  // Check if chapter group still has versions
  const group = document.querySelector(`.chapter-group[data-chapter="${chapterNum}"]`);
  if (group) {
    const remaining = group.querySelectorAll('.version-row');
    if (remaining.length === 0 && !isDeleteOnly) {
      // No versions left, remove the whole group
      group.remove();
    }

    // Update main chapter item downloaded status
    const downloadedVersions = group.querySelectorAll('.version-row.downloaded');
    const chapterItem = group.querySelector('.chapter-item');
    if (chapterItem) {
      if (downloadedVersions.length === 0) {
        chapterItem.classList.remove('downloaded');
        const dlBtn = chapterItem.querySelector('.chapter-actions button[title*=\"Download\"]');
        if (dlBtn) {
          dlBtn.classList.remove('success');
          dlBtn.innerHTML = '↓';
        }
      }
    }
  }
}

// Delete a downloaded version from disk
async function deleteDownloadedVersion(mangaId, chapterNum, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);

  if (!confirm(`Delete downloaded files for this version of Chapter ${chapterNum}?`)) return;

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/delete-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    const result = await response.json();
    if (result.success) {
      showToast('Downloaded version deleted', 'success');
      removeVersionFromUI(chapterNum, encodedUrl, true);
    } else {
      showToast(result.error || 'Failed to delete', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Delete a chapter version from disk only
async function deleteChapterVersion(mangaId, chapterNum, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);

  if (!confirm(`Delete downloaded files for this version of Chapter ${chapterNum}?`)) return;

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/delete-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    const result = await response.json();
    if (result.success) {
      showToast('Version deleted from disk', 'success');
      removeVersionFromUI(chapterNum, encodedUrl, true);
    } else {
      showToast(result.error || 'Failed to delete', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Delete from disk AND hide from list
async function deleteAndHideVersion(mangaId, chapterNum, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);

  if (!confirm(`Delete and hide this version of Chapter ${chapterNum}?`)) return;

  try {
    // First delete from disk
    await fetch(`/api/bookmarks/${mangaId}/delete-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    // Then hide from list
    await fetch(`/api/bookmarks/${mangaId}/hide-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    showToast('Version deleted and hidden', 'success');
    removeVersionFromUI(chapterNum, encodedUrl, false);
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function keepOnlyVersion(mangaId, chapterNum, encodedUrlToKeep) {
  const urlToKeep = decodeURIComponent(encodedUrlToKeep);

  if (!confirm(`Keep only this version and delete all other versions of Chapter ${chapterNum}?`)) return;

  try {
    // Get all versions of this chapter
    const manga = state.currentManga;
    const versionsToDelete = manga.chapters.filter(ch =>
      ch.number === chapterNum && ch.url !== urlToKeep
    );

    for (const v of versionsToDelete) {
      await fetch(`/api/bookmarks/${mangaId}/chapters`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterNumber: chapterNum, url: v.url })
      });
    }

    showToast(`Kept only selected version of Chapter ${chapterNum}`, 'success');
    showMangaDetail([mangaId]); // Refresh
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Load version details (image counts) for duplicate manager
async function loadVersionDetails(mangaId) {
  const manga = state.currentManga;
  if (!manga) return;

  const downloadedChapters = manga.downloadedChapters || [];
  const downloadedVersions = manga.downloadedVersions || {};

  // Find chapters with multiple downloaded versions
  for (const chapterNum of downloadedChapters) {
    const versions = downloadedVersions[chapterNum];
    if (Array.isArray(versions) && versions.length >= 2) {
      try {
        const result = await API.getChapterVersions(mangaId, chapterNum);
        console.log(`Chapter ${chapterNum} version details:`, result);

        if (result.versions && result.versions.length > 0) {
          const rows = document.querySelectorAll(`#dup-versions-${chapterNum} .duplicate-version-row`);

          // Try to match by URL first
          rows.forEach(row => {
            const rowUrl = row.dataset.url;
            if (rowUrl) {
              const decodedRowUrl = decodeURIComponent(rowUrl);
              const matchingVersion = result.versions.find(v => v.url === decodedRowUrl);
              if (matchingVersion && matchingVersion.imageCount) {
                const pagesSpan = row.querySelector('.version-pages');
                if (pagesSpan && !pagesSpan.textContent) {
                  pagesSpan.textContent = `(${matchingVersion.imageCount} pages)`;
                }
              }
            }
          });

          // If some rows still don't have page counts, assign remaining versions in order
          const rowsWithoutPages = Array.from(rows).filter(row => {
            const pagesSpan = row.querySelector('.version-pages');
            return pagesSpan && !pagesSpan.textContent;
          });

          const unusedVersions = result.versions.filter(v => {
            // Check if this version's imageCount was already used
            const usedUrls = Array.from(rows)
              .filter(row => {
                const pagesSpan = row.querySelector('.version-pages');
                return pagesSpan && pagesSpan.textContent;
              })
              .map(row => decodeURIComponent(row.dataset.url || ''));
            return !usedUrls.includes(v.url);
          });

          rowsWithoutPages.forEach((row, i) => {
            if (unusedVersions[i] && unusedVersions[i].imageCount) {
              const pagesSpan = row.querySelector('.version-pages');
              if (pagesSpan) {
                pagesSpan.textContent = `(${unusedVersions[i].imageCount} pages)`;
              }
            }
          });
        }
      } catch (e) { console.error(e); }
    }
  }
}

// Add manual chapter function
async function addManualChapter(mangaId) {
  const numStr = prompt('Enter chapter number:');
  if (!numStr) return;

  // Handle decimals
  const num = parseFloat(numStr);
  if (isNaN(num)) return showToast('Invalid number', 'error');

  const url = prompt('Enter chapter URL:');
  if (!url) return;

  try {
    const res = await API.addChapter(mangaId, { number: num, url });
    if (res.success) {
      showToast('Chapter added successfully', 'success');
      // Refresh manga
      const updated = await API.getBookmark(mangaId);

      // Update state
      state.currentManga = updated;

      // Calculate last page again to show new chapter
      const totalPages = Math.ceil((updated.chapters?.length || 0) / 50);
      state.chapterListPage = Math.max(0, totalPages - 1);

      updateMangaDetailView();
    } else {
      showToast(res.message || 'Failed to add chapter', 'error');
    }
  } catch (e) {
    showToast(e.message, 'error');
  }
}


async function downloadChapterVersion(mangaId, chapterNum, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);
  showToast(`Downloading Chapter ${chapterNum}...`, 'info');

  try {
    // For now, download using the standard flow - the specific URL handling
    // would need server-side support
    const result = await API.startDownload(mangaId, { chapters: [chapterNum] });
    if (result.taskId) {
      trackDownload(result.taskId, mangaId);
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Compare view state
let compareState = {
  mangaId: null,
  chapterNum: null,
  versions: [],
  currentPage: 0,
  syncScroll: true,
  openedFromReader: false // Track if opened from reading attempt vs manual compare
};

// Open compare view for multiple versions
// openedFromReader: if true, auto-open reader when only 1 version remains
async function openCompareView(mangaId, chapterNum, encodedUrls, openedFromReader = false) {
  const urls = encodedUrls.split(',').map(u => decodeURIComponent(u));

  compareState.mangaId = mangaId;
  compareState.chapterNum = chapterNum;
  compareState.versions = [];
  compareState.currentPage = 0;
  compareState.openedFromReader = openedFromReader;

  // Create compare modal
  const modal = document.createElement('div');
  modal.id = 'compare-modal';
  modal.className = 'compare-view';
  modal.innerHTML = `
    <div class="compare-header">
      <div class="compare-title">
        <span>Comparing Chapter ${chapterNum} - ${urls.length} versions</span>
      </div>
      <div class="compare-controls">
        <label class="compare-sync-label">
          <input type="checkbox" id="sync-scroll" checked onchange="compareState.syncScroll = this.checked">
          Sync scroll
        </label>
        <button class="reader-control-btn" onclick="closeCompareView()" title="Close">✕</button>
      </div>
    </div>
    <div class="compare-content" id="compare-content">
      <div class="compare-loading">
        <div class="loading-spinner"></div>
        <p>Loading versions...</p>
      </div>
    </div>
    <div class="compare-footer">
      <div class="compare-page-nav">
        <button class="btn btn-secondary" onclick="comparePrevPage()">← Prev</button>
        <span id="compare-page-indicator">Loading...</span>
        <button class="btn btn-secondary" onclick="compareNextPage()">Next →</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Load images for each version
  try {
    const versionPromises = urls.map(url =>
      API.getChapterImages(mangaId, chapterNum, encodeURIComponent(url))
    );
    const results = await Promise.all(versionPromises);

    compareState.versions = results.map((r, i) => ({
      url: urls[i],
      images: r.images || [],
      title: `Version ${i + 1}`
    }));

    // Find the chapter titles from manga data
    if (state.currentManga) {
      const chapters = state.currentManga.chapters.filter(c => c.number === chapterNum);
      compareState.versions.forEach((v, i) => {
        const matchingChapter = chapters.find(c => c.url === v.url);
        if (matchingChapter) {
          v.title = matchingChapter.title || `Version ${i + 1}`;
        }
      });
    }

    renderCompareView();
  } catch (error) {
    showToast('Failed to load versions: ' + error.message, 'error');
    closeCompareView();
  }
}

function renderCompareView() {
  const content = document.getElementById('compare-content');
  const indicator = document.getElementById('compare-page-indicator');
  if (!content) return;

  const maxPages = Math.max(...compareState.versions.map(v => v.images.length));
  const currentPage = compareState.currentPage;

  indicator.textContent = `Page ${currentPage + 1} / ${maxPages}`;

  content.innerHTML = `
    <div class="compare-panels">
      ${compareState.versions.map((version, i) => {
    const img = version.images[currentPage];
    const pageCount = version.images.length;
    return `
          <div class="compare-panel" data-version="${i}">
            <div class="compare-panel-header">
              <span class="compare-panel-title">${version.title}</span>
              <span class="compare-panel-info">${pageCount} pages</span>
              <button class="btn btn-xs btn-danger" onclick="deleteVersionFromCompare('${compareState.mangaId}', ${compareState.chapterNum}, '${encodeURIComponent(version.url)}')" title="Delete files only">
                🗑️
              </button>
              <button class="btn btn-xs btn-secondary" onclick="deleteAndHideFromCompare('${compareState.mangaId}', ${compareState.chapterNum}, '${encodeURIComponent(version.url)}')" title="Delete files and hide version">
                ×
              </button>
            </div>
            <div class="compare-panel-image" id="compare-panel-${i}" onscroll="handleCompareScroll(${i}, event)">
              ${img
        ? `<img src="${img.url}" alt="Page ${currentPage + 1}" loading="lazy">`
        : `<div class="compare-no-image">No page ${currentPage + 1}</div>`
      }
            </div>
          </div>
        `;
  }).join('')}
    </div>
  `;
}

function handleCompareScroll(sourceIndex, event) {
  if (!compareState.syncScroll) return;

  const sourcePanel = event.target;
  const scrollRatio = sourcePanel.scrollTop / (sourcePanel.scrollHeight - sourcePanel.clientHeight);

  compareState.versions.forEach((_, i) => {
    if (i !== sourceIndex) {
      const panel = document.getElementById(`compare-panel-${i}`);
      if (panel) {
        panel.scrollTop = scrollRatio * (panel.scrollHeight - panel.clientHeight);
      }
    }
  });

  // Add keyboard listener for compare view
  document.addEventListener('keydown', handleCompareKeyboard);
}

function handleCompareKeyboard(event) {
  if (!document.getElementById('compare-modal')) return;

  switch (event.key) {
    case 'ArrowLeft':
      comparePrevPage();
      break;
    case 'ArrowRight':
      compareNextPage();
      break;
    case 'Escape':
      closeCompareView();
      break;
  }
}

function comparePrevPage() {
  if (compareState.currentPage > 0) {
    compareState.currentPage--;
    renderCompareView();
  }
}

function compareNextPage() {
  const maxPages = Math.max(...compareState.versions.map(v => v.images.length));
  if (compareState.currentPage < maxPages - 1) {
    compareState.currentPage++;
    renderCompareView();
  }
}

async function deleteVersionFromCompare(mangaId, chapterNum, encodedUrl) {
  if (!confirm('Delete this version? This cannot be undone.')) return;

  try {
    await API.deleteChapterVersion(mangaId, chapterNum, encodedUrl);
    showToast('Version deleted', 'success');

    // Remove from compare state
    const url = decodeURIComponent(encodedUrl);
    compareState.versions = compareState.versions.filter(v => v.url !== url);

    if (compareState.versions.length < 2) {
      closeCompareView();

      // If exactly one version remains AND we opened from reader, open it in reader directly
      if (compareState.versions.length === 1 && compareState.openedFromReader) {
        const remainingVersion = compareState.versions[0];
        // Navigate directly to reader with the version URL
        router.navigate(`/read/${mangaId}/${chapterNum}?version=${encodeURIComponent(remainingVersion.url)}`);
      } else if (compareState.versions.length === 0 && compareState.openedFromReader) {
        // All versions deleted, go back to manga detail
        showMangaDetail([mangaId]);
      } else {
        // Otherwise, go back to manga detail
        showMangaDetail([mangaId]);
      }
    } else {
      renderCompareView();
    }
  } catch (error) {
    showToast('Failed to delete: ' + error.message, 'error');
  }
}

async function deleteAndHideFromCompare(mangaId, chapterNum, encodedUrl) {
  if (!confirm('Delete and hide this version? The version will not appear in future updates.')) return;

  try {
    // First delete the files
    await API.deleteChapterVersion(mangaId, chapterNum, encodedUrl);

    // Then hide the version
    const url = decodeURIComponent(encodedUrl);
    await fetch(`/api/bookmarks/${mangaId}/hide-version`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum, url })
    });

    showToast('Version deleted and hidden', 'success');

    // Remove from compare state
    compareState.versions = compareState.versions.filter(v => v.url !== url);

    if (compareState.versions.length < 2) {
      closeCompareView();

      // If exactly one version remains AND we opened from reader, open it in reader directly
      if (compareState.versions.length === 1 && compareState.openedFromReader) {
        const remainingVersion = compareState.versions[0];
        // Navigate directly to reader with the version URL
        router.navigate(`/read/${mangaId}/${chapterNum}?version=${encodeURIComponent(remainingVersion.url)}`);
      } else if (compareState.versions.length === 0 && compareState.openedFromReader) {
        // All versions deleted, go back to manga detail
        showMangaDetail([mangaId]);
      } else {
        // Otherwise, go back to manga detail
        showMangaDetail([mangaId]);
      }
    } else {
      renderCompareView();
    }
  } catch (error) {
    showToast('Failed: ' + error.message, 'error');
  }
}

function closeCompareView() {
  const modal = document.getElementById('compare-modal');
  if (modal) {
    modal.remove();
  }
  document.removeEventListener('keydown', handleCompareKeyboard);
  compareState = {
    mangaId: null,
    chapterNum: null,
    versions: [],
    currentPage: 0,
    syncScroll: true,
    openedFromReader: false
  };
}

// Cover selection functions
async function checkForMultipleCovers(mangaId) {
  try {
    const result = await API.getCovers(mangaId);
    if (result.covers && result.covers.length > 1) {
      const btn = document.getElementById('cover-change-btn');
      if (btn) {
        btn.classList.add('visible');
        btn.title = `${result.covers.length} covers available`;
      }
    }
  } catch (e) {
    // Silently fail - covers might not exist yet
  }
}

async function openCoverSelector(mangaId) {
  document.getElementById('cover-modal').classList.add('active');
  const grid = document.getElementById('cover-grid');
  grid.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const result = await API.getCovers(mangaId);

    if (!result.covers || result.covers.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No covers available</p>';
      return;
    }

    grid.innerHTML = result.covers.map(cover => `
      <div class="cover-option ${cover.isActive ? 'active' : ''}" onclick="selectCover('${mangaId}', '${cover.filename}')">
        <img src="${cover.url}" alt="Cover">
        ${cover.isActive ? '<span class="cover-active-badge">Active</span>' : ''}
      </div>
    `).join('');
  } catch (error) {
    grid.innerHTML = `<p style="color:var(--danger);">Failed to load covers: ${error.message}</p>`;
  }
}

async function selectCover(mangaId, filename) {
  try {
    const result = await API.setActiveCover(mangaId, filename);
    if (result.success) {
      showToast('Cover updated', 'success');
      closeModal('cover-modal');

      // Update the cover image on page
      const coverImg = document.getElementById('manga-cover-img');
      if (coverImg) {
        coverImg.src = `/api/bookmarks/${mangaId}/covers/${encodeURIComponent(filename)}`;
      }

      // Refresh to update state
      if (state.currentManga) {
        state.currentManga = await API.getBookmark(mangaId);
      }
    } else {
      showToast(result.error || 'Failed to update cover', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// CBZ Support functions
async function checkForCbzFiles(mangaId) {
  try {
    const cbzFiles = await API.getCbzFiles(mangaId);
    if (cbzFiles && cbzFiles.length > 0) {
      const btn = document.querySelector('.cbz-extract-btn');
      if (btn) {
        btn.style.display = 'inline-flex';
        const unextracted = cbzFiles.filter(f => !f.isExtracted).length;
        if (unextracted > 0) {
          btn.textContent = `📦 CBZ Files (${unextracted})`;
          btn.classList.add('has-updates');
        } else {
          btn.textContent = `📦 CBZ Files (${cbzFiles.length})`;
        }
      }
    }
  } catch (e) {
    // Silently fail - CBZ check is optional
  }
}

async function showCbzManager(mangaId) {
  // Clear stored CBZ data when opening fresh
  window.cbzFilesData = {};

  // Check if manga has cover
  const manga = state.currentManga;
  const hasCover = manga && (manga.cover || manga.localCover);

  // Create modal if not exists
  let modal = document.getElementById('cbz-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cbz-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h3>📦 CBZ Files</h3>
        <button class="close-btn" onclick="closeModal('cbz-modal')">×</button>
      </div>
      <div class="modal-body">
        <div id="cbz-list">
          <div class="loading-spinner"></div>
        </div>
      </div>
      <div class="modal-footer">
        <label class="cbz-cover-option">
          <input type="checkbox" id="cbz-set-cover" ${hasCover ? '' : 'checked'}>
          Use first image as cover
        </label>
        <div class="modal-footer-buttons">
          <button class="btn btn-secondary" onclick="closeModal('cbz-modal')">Close</button>
          <button class="btn btn-secondary" onclick="extractAllCbzWithData('${mangaId}', true)">Re-Extract All</button>
          <button class="btn btn-primary" onclick="extractAllCbzWithData('${mangaId}', false)">Extract All</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  await loadCbzFiles(mangaId);
}

async function loadCbzFiles(mangaId) {
  const list = document.getElementById('cbz-list');
  list.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const cbzFiles = await API.getCbzFiles(mangaId);

    if (!cbzFiles || cbzFiles.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No CBZ files found in manga folder</p>';
      return;
    }

    // Store CBZ data for later use (preserve manually set chapter numbers)
    window.cbzFilesData = window.cbzFilesData || {};
    cbzFiles.forEach(cbz => {
      // Preserve manually set chapter number if we had one
      const existing = window.cbzFilesData[cbz.name];
      if (existing && existing.manualChapter !== undefined) {
        cbz.chapterNumber = existing.manualChapter;
        cbz.manualChapter = existing.manualChapter;
      }
      // If only one CBZ file and no chapter detected, default to chapter 1
      if (cbzFiles.length === 1 && cbz.chapterNumber === null) {
        cbz.chapterNumber = 1;
      }
      window.cbzFilesData[cbz.name] = cbz;
    });

    list.innerHTML = cbzFiles.map(cbz => {
      const sizeKB = Math.round(cbz.size / 1024);
      const sizeMB = (cbz.size / (1024 * 1024)).toFixed(1);
      const sizeDisplay = cbz.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
      const hasChapter = cbz.chapterNumber !== null;

      return `
        <div class="cbz-item ${cbz.isExtracted ? 'extracted' : ''}" data-name="${cbz.name}" data-chapter="${cbz.chapterNumber || ''}">
          <div class="cbz-info">
            <span class="cbz-name">${cbz.name}</span>
            <span class="cbz-meta">${sizeDisplay} ${hasChapter ? `• Ch. ${cbz.chapterNumber}` : '• Unknown chapter'} ${cbz.isExtracted ? '• ✓ Extracted' : ''}</span>
          </div>
          <div class="cbz-actions">
            <div class="cbz-action-buttons">
              <button class="btn btn-small" onclick="promptCbzChapterByName('${mangaId}', '${cbz.name}')">
                ${hasChapter ? 'Ch. ' + cbz.chapterNumber : 'Set Ch.'}
              </button>
              ${hasChapter ? `
                <button class="btn btn-small ${cbz.isExtracted ? 'btn-secondary' : 'btn-primary'}" onclick="extractCbzByName('${mangaId}', '${cbz.name}', ${cbz.isExtracted})">
                  ${cbz.isExtracted ? 'Re-Extract' : 'Extract'}
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    list.innerHTML = `<p style="color:var(--danger);">Failed to load CBZ files: ${error.message}</p>`;
  }
}

async function extractSingleCbz(mangaId, cbzPath, chapterNumber, forceReExtract = false) {
  try {
    showToast(forceReExtract ? 'Re-extracting CBZ...' : 'Extracting CBZ...', 'info');
    const result = await API.extractCbz(mangaId, cbzPath, chapterNumber, { forceReExtract });

    if (result.success) {
      let message = `Extracted ${result.extracted} images to Chapter ${chapterNumber}`;
      if (result.renamed) {
        message += ` (renamed to ${result.newCbzName})`;
      }
      showToast(message, 'success');

      // Refresh manga to update downloaded chapters
      state.currentManga = await API.getBookmark(mangaId);

      // Check if user wants to set cover
      const setCoverCheckbox = document.getElementById('cbz-set-cover');
      const shouldSetCover = setCoverCheckbox && setCoverCheckbox.checked;

      if (shouldSetCover && !state.currentManga.localCover) {
        await API.setCoverFromChapter(mangaId);
        state.currentManga = await API.getBookmark(mangaId);
        // Uncheck after setting
        if (setCoverCheckbox) setCoverCheckbox.checked = false;
      }

      // Update chapter list display
      const app = document.getElementById('app');
      const scrollPos = app.scrollTop;
      app.innerHTML = renderMangaDetail(state.currentManga, state.categories, state.chapterListPage);
      app.scrollTop = scrollPos;

      // Re-run checks
      checkForCbzFiles(mangaId);
      checkForMissingCover(mangaId);

      // Reload CBZ list in modal if still open (also update stored data to reflect new name)
      if (document.getElementById('cbz-modal')?.classList.contains('active')) {
        // Clear old data if CBZ was renamed
        if (result.renamed) {
          delete window.cbzFilesData;
        }
        await loadCbzFiles(mangaId);
      }
    } else {
      showToast(result.error || 'Failed to extract CBZ', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function promptCbzChapter(mangaId, cbzPath) {
  const chapterNum = prompt('Enter chapter number for this CBZ file:');
  if (chapterNum !== null) {
    const num = parseFloat(chapterNum);
    if (!isNaN(num)) {
      // Update the UI to show the chapter number and extract button
      const item = document.querySelector(`.cbz-item[data-path="${cbzPath}"]`);
      if (item) {
        const meta = item.querySelector('.cbz-meta');
        const actions = item.querySelector('.cbz-actions');
        // Update meta to show chapter number
        const currentMeta = meta.textContent.split('•')[0].trim();
        meta.textContent = `${currentMeta} • Ch. ${num}`;
        // Replace Set Chapter with Extract button
        actions.innerHTML = `
          <button class="btn btn-small btn-primary" onclick="extractSingleCbz('${mangaId}', '${cbzPath.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}', ${num})">
            Extract
          </button>
        `;
      }
    } else {
      showToast('Invalid chapter number', 'error');
    }
  }
}

// New functions that use stored CBZ data to avoid path escaping issues
function extractCbzByName(mangaId, cbzName, forceReExtract = false) {
  const cbz = window.cbzFilesData?.[cbzName];
  if (cbz && cbz.chapterNumber !== null) {
    extractSingleCbz(mangaId, cbz.path, cbz.chapterNumber, forceReExtract);
  } else {
    showToast('Set chapter number first', 'error');
  }
}

function promptCbzChapterByName(mangaId, cbzName) {
  const cbz = window.cbzFilesData?.[cbzName];
  if (!cbz) {
    showToast('CBZ data not found', 'error');
    return;
  }

  const currentChapter = cbz.chapterNumber !== null ? cbz.chapterNumber : '';

  // Create a modal with number input for better mobile support
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'chapter-input-modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 300px;">
      <h3>Set Chapter Number</h3>
      <input type="number" id="chapter-number-input" value="${currentChapter}" 
             inputmode="decimal" step="any" min="0" placeholder="Enter chapter number"
             style="text-align: center; font-size: 18px;">
      <div class="modal-actions">
        <button class="btn btn-secondary" id="chapter-cancel">Cancel</button>
        <button class="btn btn-primary" id="chapter-save">Save</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const input = modal.querySelector('#chapter-number-input');
  input.focus();
  input.select();

  const saveChapter = () => {
    const chapterNum = input.value.trim();
    modal.remove();

    if (chapterNum !== '') {
      const num = parseFloat(chapterNum);
      if (!isNaN(num) && num >= 0) {
        // Update stored data
        cbz.chapterNumber = num;
        cbz.manualChapter = num; // Mark as manually set

        // Update the UI
        const item = document.querySelector(`.cbz-item[data-name="${cbzName}"]`);
        if (item) {
          item.dataset.chapter = num;
          const meta = item.querySelector('.cbz-meta');
          const actions = item.querySelector('.cbz-actions');
          // Update meta to show chapter number
          const currentMeta = meta.textContent.split('•')[0].trim();
          meta.textContent = `${currentMeta} • Ch. ${num}`;
          // Show both Set Chapter and Extract buttons
          actions.innerHTML = `
            <div class="cbz-action-buttons">
              <button class="btn btn-small" onclick="promptCbzChapterByName('${mangaId}', '${cbzName}')">
                Ch. ${num}
              </button>
              <button class="btn btn-small btn-primary" onclick="extractCbzByName('${mangaId}', '${cbzName}')">
                Extract
              </button>
            </div>
          `;
        }
      } else {
        showToast('Invalid chapter number', 'error');
      }
    }
  };

  modal.querySelector('#chapter-save').onclick = saveChapter;
  modal.querySelector('#chapter-cancel').onclick = () => modal.remove();

  // Save on Enter key
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveChapter();
    } else if (e.key === 'Escape') {
      modal.remove();
    }
  };

  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// Extract all CBZ files using stored data (including manually set chapter numbers)
async function extractAllCbzWithData(mangaId, forceReExtract = false) {
  const cbzData = window.cbzFilesData;
  if (!cbzData) {
    showToast('No CBZ data loaded', 'error');
    return;
  }

  // If force re-extract, include already extracted ones too
  const toExtract = Object.values(cbzData).filter(cbz =>
    cbz.chapterNumber !== null && (!cbz.isExtracted || forceReExtract)
  );

  if (toExtract.length === 0) {
    showToast('No CBZ files ready to extract (set chapter numbers first)', 'warning');
    return;
  }

  showToast(`${forceReExtract ? 'Re-extracting' : 'Extracting'} ${toExtract.length} CBZ file(s)...`, 'info');

  let successful = 0;
  let failed = 0;
  let renamed = 0;

  for (const cbz of toExtract) {
    try {
      const result = await API.extractCbz(mangaId, cbz.path, cbz.chapterNumber, { forceReExtract });
      if (result.success) {
        successful++;
        cbz.isExtracted = true;
        if (result.renamed) renamed++;
      } else {
        failed++;
      }
    } catch (e) {
      failed++;
    }
  }

  let message = `Extracted: ${successful}`;
  if (renamed > 0) message += `, Renamed: ${renamed}`;
  if (failed > 0) message += `, Failed: ${failed}`;
  showToast(message, failed > 0 ? 'warning' : 'success');

  // Refresh manga to update downloaded chapters
  state.currentManga = await API.getBookmark(mangaId);

  // Check if user wants to set cover
  const setCoverCheckbox = document.getElementById('cbz-set-cover');
  const shouldSetCover = setCoverCheckbox && setCoverCheckbox.checked;

  if (shouldSetCover && successful > 0 && !state.currentManga.localCover) {
    await API.setCoverFromChapter(mangaId);
    state.currentManga = await API.getBookmark(mangaId);
    // Uncheck after setting
    if (setCoverCheckbox) setCoverCheckbox.checked = false;
  }

  const app = document.getElementById('app');
  const scrollPos = app.scrollTop;
  app.innerHTML = renderMangaDetail(state.currentManga, state.categories, state.chapterListPage);
  app.scrollTop = scrollPos;

  // Re-run checks
  checkForCbzFiles(mangaId);
  checkForMissingCover(mangaId);

  // Reload CBZ list in modal if still open (clear old data if renamed)
  if (document.getElementById('cbz-modal')?.classList.contains('active')) {
    if (renamed > 0) {
      delete window.cbzFilesData;
    }
    await loadCbzFiles(mangaId);
  }
}

// Check if manga has no cover but has downloaded chapters
function checkForMissingCover(mangaId) {
  const manga = state.currentManga;
  if (!manga) return;

  // If manga has no cover and has downloaded chapters, show the Set Cover button
  const hasCover = manga.cover || manga.localCover;
  const hasDownloads = (manga.downloadedChapters || []).length > 0;

  if (!hasCover && hasDownloads) {
    const btn = document.querySelector('.set-cover-btn');
    if (btn) {
      btn.style.display = 'inline-flex';
    }
  }
}

async function setFirstImageAsCover(mangaId) {
  try {
    showToast('Setting cover from first chapter...', 'info');
    const result = await API.setCoverFromChapter(mangaId);

    if (result.success) {
      showToast('Cover set successfully', 'success');

      // Update the cover image on page
      const coverImg = document.getElementById('manga-cover-img');
      if (coverImg && result.coverPath) {
        coverImg.src = result.coverPath + '?t=' + Date.now();
      }

      // Hide the button
      const btn = document.querySelector('.set-cover-btn');
      if (btn) btn.style.display = 'none';

      // Refresh state
      state.currentManga = await API.getBookmark(mangaId);
    } else {
      showToast(result.error || 'Failed to set cover', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Library functions
function openAddModal() {
  document.getElementById('add-modal').classList.add('active');
  document.getElementById('manga-url').value = '';
  document.getElementById('manga-url').focus();
}

function openRenameModal(id, currentName) {
  document.getElementById('rename-modal').classList.add('active');
  document.getElementById('rename-id').value = id;
  document.getElementById('rename-input').value = currentName;
  document.getElementById('rename-input').focus();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

async function addManga() {
  const url = document.getElementById('manga-url').value.trim();
  if (!url) {
    showToast('Please enter a URL', 'error');
    return;
  }

  closeModal('add-modal');

  // Add loading card
  const grid = document.getElementById('library-grid');
  if (grid) {
    grid.insertAdjacentHTML('afterbegin', createLoadingCard(url));
  }

  try {
    const result = await API.addBookmark(url);

    // Remove loading card
    const loadingCard = document.getElementById('loading-card');
    if (loadingCard) loadingCard.remove();

    if (result.success) {
      showToast(`Added: ${result.bookmark.title} (${result.bookmark.totalChapters} chapters)`, 'success');
      showLibrary(); // Refresh
    } else {
      showToast(result.message || 'Failed to add manga', 'error');
    }
  } catch (error) {
    const loadingCard = document.getElementById('loading-card');
    if (loadingCard) loadingCard.remove();
    showToast(error.message, 'error');
  }
}

async function renameManga() {
  const id = document.getElementById('rename-id').value;
  const alias = document.getElementById('rename-input').value.trim();

  try {
    const result = await API.updateBookmark(id, { alias });
    closeModal('rename-modal');

    if (result.folderRenamed) {
      showToast('Renamed successfully (folder renamed)', 'success');
    } else {
      showToast('Renamed successfully', 'success');
    }

    // Refresh current view - need to reload to get updated paths
    if (state.currentManga && state.currentManga.id === id) {
      showMangaDetail([id]);
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteManga(id) {
  // Show delete confirmation modal
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.id = 'delete-confirm-modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 400px;">
      <h3>Delete Manga</h3>
      <p style="margin: 15px 0; color: var(--text-muted);">How would you like to delete this manga?</p>
      <div class="modal-actions" style="flex-direction: column; gap: 10px;">
        <button class="btn btn-primary" id="delete-db-only" style="width: 100%;">
          Remove from Library
          <small style="display: block; opacity: 0.7; font-weight: normal;">Keep downloaded files</small>
        </button>
        <button class="btn btn-danger" id="delete-with-folder" style="width: 100%;">
          Delete Everything
          <small style="display: block; opacity: 0.7; font-weight: normal;">Remove from library and delete files</small>
        </button>
        <button class="btn btn-secondary" id="delete-cancel" style="width: 100%;">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle button clicks
  modal.querySelector('#delete-db-only').onclick = async () => {
    modal.remove();
    try {
      await API.deleteBookmark(id, false);
      showToast('Removed from library', 'success');
      router.navigate('/');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  modal.querySelector('#delete-with-folder').onclick = async () => {
    modal.remove();
    try {
      await API.deleteBookmark(id, true);
      showToast('Deleted manga and files', 'success');
      router.navigate('/');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  modal.querySelector('#delete-cancel').onclick = () => {
    modal.remove();
  };

  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

async function checkMangaUpdates(id) {
  showToast('Checking for updates...', 'info');

  try {
    const result = await API.checkUpdates(id);

    if (result.newChaptersCount > 0) {
      showToast(`Found ${result.newChaptersCount} new chapters!`, 'success');
      showMangaDetail([id]); // Refresh
    } else {
      showToast('No new chapters', 'info');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Quick check for new chapters (first page only - faster)
async function quickCheckUpdates(id) {
  showToast('Quick checking for new chapters...', 'info');

  try {
    const result = await API.quickCheckUpdates(id);

    if (result.error) {
      if (result.supportsQuickCheck === false) {
        showToast('Quick check not supported, use full check', 'info');
      } else {
        showToast(result.error, 'error');
      }
      return;
    }

    if (result.hasUpdates) {
      showToast(`Found ${result.newChaptersCount} new chapters!`, 'success');
      showMangaDetail([id]); // Refresh to show new chapters
    } else {
      showToast('No new chapters on first page', 'info');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function checkAllUpdates() {
  showToast('Checking all manga for updates...', 'info');

  try {
    const results = await API.checkAllUpdates();
    const withUpdates = results.filter(r => r.newChapters > 0);

    if (withUpdates.length > 0) {
      showToast(`Found updates in ${withUpdates.length} manga!`, 'success');
    } else {
      showToast('No new chapters found', 'info');
    }

    showLibrary(); // Refresh
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Quick check all manga for updates (first page only - faster)
async function quickCheckAllUpdates() {
  showToast('Quick checking all manga for updates...', 'info');

  try {
    const bookmarks = await API.getBookmarks();
    const results = [];
    let checkedCount = 0;
    let updatesFound = 0;

    for (const bookmark of bookmarks) {
      // Skip local-only manga
      if (bookmark.source === 'local' || bookmark.website === 'Local') continue;

      try {
        const result = await API.quickCheckUpdates(bookmark.id);
        checkedCount++;

        if (result.hasUpdates) {
          updatesFound++;
          results.push({
            id: bookmark.id,
            title: bookmark.alias || bookmark.title,
            newCount: result.newChaptersCount
          });
        }
      } catch (e) {
        // Skip manga that don't support quick check
        console.log(`Quick check skipped for ${bookmark.title}: ${e.message}`);
      }
    }

    if (updatesFound > 0) {
      const titles = results.map(r => `${r.title} (+${r.newCount})`).join(', ');
      showToast(`Found updates: ${titles}`, 'success');
      showLibrary(); // Refresh library to show updated data
    } else {
      showToast(`Checked ${checkedCount} manga, no updates found`, 'info');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function scanAllLocal() {
  showToast('Scanning downloads folder...', 'info');

  try {
    const response = await fetch('/api/scan-local', { method: 'POST' });
    const result = await response.json();

    // Also check for local-only manga folders
    const localManga = await API.getLocalManga();

    if (localManga.length > 0) {
      // Show modal to add local manga
      showLocalMangaDiscovery(localManga);
    } else if (result.found > 0) {
      showToast(`Found ${result.found} manga folder(s), synced ${result.synced}`, 'success');
      showLibrary(); // Refresh
    } else {
      showToast('No new manga folders found', 'info');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function showLocalMangaDiscovery(localManga) {
  // Create modal if not exists
  let modal = document.getElementById('local-manga-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'local-manga-modal';
    modal.className = 'modal';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-content" style="max-width: 600px;">
      <div class="modal-header">
        <h3>📁 Local Manga Found</h3>
        <button class="close-btn" onclick="closeModal('local-manga-modal')">×</button>
      </div>
      <div class="modal-body">
        <p style="margin-bottom:15px;color:var(--text-muted);">Found ${localManga.length} folder(s) with manga not in your library:</p>
        <div class="local-manga-list">
          ${localManga.map(m => `
            <div class="local-manga-item" data-folder="${m.folderName}">
              <div class="local-manga-cover">
                ${m.coverImage ? `<img src="${m.coverImage}" alt="${m.folderName}" onerror="this.parentElement.innerHTML='📚'">` : '📚'}
              </div>
              <div class="local-manga-info">
                <span class="local-manga-name">${m.folderName}</span>
                <span class="local-manga-meta">
                  ${m.chapterCount > 0 ? `${m.chapterCount} chapters` : ''}
                  ${m.chapterCount > 0 && m.cbzCount > 0 ? ' • ' : ''}
                  ${m.cbzCount > 0 ? `${m.cbzCount} CBZ files` : ''}
                </span>
              </div>
              <button class="btn btn-small btn-primary" onclick="addLocalMangaToLibrary('${m.folderName.replace(/'/g, "\\'")}')">
                Add
              </button>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal('local-manga-modal')">Close</button>
        <button class="btn btn-primary" onclick="addAllLocalManga()">Add All</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

async function addLocalMangaToLibrary(folderName) {
  try {
    showToast(`Adding ${folderName}...`, 'info');
    const result = await API.addLocalManga(folderName);

    if (result.success) {
      showToast(`Added "${folderName}" to library`, 'success');

      // Remove from the list
      const item = document.querySelector(`.local-manga-item[data-folder="${folderName}"]`);
      if (item) item.remove();

      // If no more items, close modal and refresh
      const remaining = document.querySelectorAll('.local-manga-item');
      if (remaining.length === 0) {
        closeModal('local-manga-modal');
        showLibrary();
      }

      // If has CBZ files, notify
      if (result.cbzFiles > 0) {
        showToast(`${result.cbzFiles} CBZ file(s) found - extract them from the manga page`, 'info');
      }
    } else {
      showToast(result.error || 'Failed to add manga', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function addAllLocalManga() {
  const items = document.querySelectorAll('.local-manga-item');
  let added = 0;

  for (const item of items) {
    const folderName = item.dataset.folder;
    try {
      const result = await API.addLocalManga(folderName);
      if (result.success) {
        added++;
        item.remove();
      }
    } catch (e) {
      // Continue with others
    }
  }

  showToast(`Added ${added} manga to library`, 'success');
  closeModal('local-manga-modal');
  showLibrary();
}

// Get chapters to download based on selection mode
// For each chapter number, picks one version or all
function getChaptersForDownload(chapters, mode) {
  // Group chapters by number
  const chaptersByNum = {};
  chapters.forEach(c => {
    if (!chaptersByNum[c.number]) {
      chaptersByNum[c.number] = [];
    }
    chaptersByNum[c.number].push(c);
  });

  const result = [];

  for (const [num, versions] of Object.entries(chaptersByNum)) {
    if (mode === 'all') {
      // Download all versions
      result.push(...versions);
    } else {
      // Most recent = first in array (scraped order from page)
      result.push(versions[0]);
    }
  }

  return result;
}

// Show download options modal for comix manga (has multiple versions per chapter)
function showDownloadOptionsModal(manga, availableChapters, onSelect) {
  // Group chapters by number to count
  const chaptersByNum = {};
  availableChapters.forEach(c => {
    if (!chaptersByNum[c.number]) {
      chaptersByNum[c.number] = [];
    }
    chaptersByNum[c.number].push(c);
  });

  const uniqueChapterCount = Object.keys(chaptersByNum).length;
  const hasMultipleVersions = availableChapters.length > uniqueChapterCount;

  // If no duplicates, just download directly
  if (!hasMultipleVersions) {
    onSelect({ mode: 'recent' });
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'release-group-modal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <div class="modal-content release-group-dialog">
      <h2>Download Options</h2>
      <p>${uniqueChapterCount} chapters available (${availableChapters.length} total versions)</p>
      
      <div class="release-group-list">
        <button class="btn btn-primary release-group-btn" data-mode="recent">
          ⏱️ Most Recent Only (${uniqueChapterCount} chapters)
        </button>
        <button class="btn btn-secondary release-group-btn" data-mode="all">
          📦 All Versions (${availableChapters.length} total)
        </button>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeReleaseGroupModal()">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Handle selection
  modal.querySelectorAll('.release-group-btn').forEach(btn => {
    btn.onclick = () => {
      const mode = btn.dataset.mode;
      closeReleaseGroupModal();
      onSelect({ mode });
    };
  });
}

function closeReleaseGroupModal() {
  const modal = document.getElementById('release-group-modal');
  if (modal) modal.remove();
}

async function downloadAllChapters(id) {
  try {
    // Get the bookmark to find undownloaded chapters
    const manga = await API.getBookmark(id);
    const downloadedChapters = new Set(manga.downloadedChapters || []);
    const deletedUrls = new Set(manga.deletedChapterUrls || []);
    const excludedChapters = new Set(manga.excludedChapters || []);

    // Find chapters not downloaded, not deleted, and not excluded
    const availableChapters = manga.chapters
      .filter(c => !downloadedChapters.has(c.number) && !deletedUrls.has(c.url) && !excludedChapters.has(c.number));

    if (availableChapters.length === 0) {
      showToast('No chapters to download', 'info');
      return;
    }

    // For comix.to manga, show options if there are multiple versions
    if (manga.website === 'comix.to') {
      showDownloadOptionsModal(manga, availableChapters, async (selection) => {
        if (!selection) return; // cancelled

        const chaptersToDownload = getChaptersForDownload(availableChapters, selection.mode);
        executeDownloadAll(id, chaptersToDownload);
      });
    } else {
      // Non-comix manga: download all directly
      executeDownloadAll(id, availableChapters);
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function executeDownloadAll(id, chapters, label = '') {
  if (chapters.length === 0) {
    showToast('No chapters to download', 'info');
    return;
  }

  const labelText = label ? ` ${label}` : '';
  showToast(`Queuing ${chapters.length}${labelText} chapters for download...`, 'info');

  // Start each chapter as its own download task
  for (const ch of chapters) {
    const chapterNum = typeof ch === 'number' ? ch : ch.number;
    const result = await API.startDownload(id, { chapters: [chapterNum] });
    if (result.taskId) {
      trackDownload(result.taskId, id, [chapterNum]);
    }
  }
}

async function downloadChapter(mangaId, chapterNum) {
  showToast(`Downloading chapter ${chapterNum}...`, 'info');

  try {
    const result = await API.startDownload(mangaId, { chapters: [chapterNum] });
    if (result.taskId) {
      trackDownload(result.taskId, mangaId, result.chapters || [chapterNum]);
    } else {
      showToast(result.message || 'Already downloaded', 'info');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteChapterDownload(mangaId, chapterNum) {
  if (!confirm(`Delete downloaded files for chapter ${chapterNum}?`)) return;

  showToast(`Deleting chapter ${chapterNum}...`, 'info');

  try {
    // Use delete-download endpoint which only deletes files, not metadata
    const response = await fetch(`/api/bookmarks/${mangaId}/delete-download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber: chapterNum })
    });
    const result = await response.json();

    if (result.success) {
      showToast('Chapter files deleted', 'success');
      // Update UI in-place
      updateChapterDeletedStatus(chapterNum);
    } else {
      showToast(result.message || 'Failed to delete', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Update chapter UI after deletion
function updateChapterDeletedStatus(chapterNum) {
  const groups = document.querySelectorAll(`.chapter-group[data-chapter="${chapterNum}"]`);
  groups.forEach(group => {
    const item = group.querySelector('.chapter-item');
    if (item) {
      item.classList.remove('downloaded');
      // Update download button
      const actions = item.querySelector('.chapter-actions');
      if (actions) {
        const dlBtn = actions.querySelector('button[title*="Download"]');
        if (dlBtn) {
          dlBtn.classList.remove('success');
          dlBtn.innerHTML = '↓';
          dlBtn.title = 'Download';
        }
        // Remove trash button if exists
        const trashBtn = actions.querySelector('button[title="Delete download"]');
        if (trashBtn) trashBtn.remove();
      }
    }
    // Update version rows
    group.querySelectorAll('.version-row').forEach(row => {
      row.classList.remove('downloaded');
    });
  });
}

async function scanLocalChapters(mangaId) {
  showToast('Scanning local chapters...', 'info');

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/scan-local`, {
      method: 'POST'
    });
    const result = await response.json();

    if (result.success) {
      // Build a detailed message about what changed
      let message = `Found ${result.count} downloaded chapters`;

      if (result.removedChapters && result.removedChapters.length > 0) {
        const removedList = result.removedChapters.slice(0, 5).join(', ');
        const more = result.removedChapters.length > 5 ? ` (+${result.removedChapters.length - 5} more)` : '';
        message += ` | Removed: ${removedList}${more}`;
        showToast(`${result.removedChapters.length} chapter(s) no longer on disk - status updated`, 'warning');
      }

      if (result.addedChapters && result.addedChapters.length > 0) {
        const addedList = result.addedChapters.slice(0, 5).join(', ');
        const more = result.addedChapters.length > 5 ? ` (+${result.addedChapters.length - 5} more)` : '';
        message += ` | Added: ${addedList}${more}`;
      }

      if (result.addedToData && result.addedToData.length > 0) {
        showToast(`${result.addedToData.length} chapter(s) added to chapter list from local files`, 'success');
      }

      if (!result.changed) {
        showToast(message, 'success');
      } else {
        showToast(message, 'success');
      }

      // Also check for CBZ files
      const cbzFiles = await API.getCbzFiles(mangaId);
      const unextracted = cbzFiles.filter(f => !f.isExtracted);
      if (unextracted.length > 0) {
        showToast(`Found ${unextracted.length} CBZ file(s) - click "📦 CBZ Files" to extract`, 'info');
      }

      // Refresh the page
      if (state.currentManga && state.currentManga.id === mangaId) {
        showMangaDetail([mangaId]);
      }
    } else {
      showToast('Failed to scan local chapters', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function trackDownload(taskId, mangaId, chapters = []) {
  // Add to download manager - background sync will pick up details from server
  const manga = state.bookmarks.find(b => b.id === mangaId) || state.currentManga;
  downloadManager.tasks.set(taskId, {
    taskId,
    mangaId,
    mangaTitle: manga?.alias || manga?.title || 'Unknown',
    status: 'queued',  // Start as queued, sync will update to running
    total: chapters.length,
    completed: 0,
    current: null,
    chapters: chapters,
    remainingChapters: chapters,
    completedChapters: [],
    errors: [],
    startTime: Date.now()
  });

  // Disable download buttons for this manga
  updateDownloadButtonsState();

  // Show download manager
  showDownloadManagerButton();
  updateDownloadManagerUI();
}

// Update download buttons to show downloading state across all devices
function updateDownloadButtonsState() {
  // Get all manga IDs currently downloading
  const downloadingMangaIds = new Set();
  downloadManager.tasks.forEach(task => {
    if (task.status === 'running' || task.status === 'queued' || task.status === 'paused') {
      downloadingMangaIds.add(task.mangaId);
    }
  });

  // Update "Download All" and "Download Unread" buttons in manga detail
  if (state.currentManga && downloadingMangaIds.has(state.currentManga.id)) {
    // Disable buttons
    document.querySelectorAll('[onclick*="downloadAllChapters"], [onclick*="downloadUnreadChapters"]').forEach(btn => {
      btn.disabled = true;
      btn.classList.add('downloading');
      if (!btn.dataset.originalText) {
        btn.dataset.originalText = btn.innerHTML;
      }
      btn.innerHTML = '⏳ Downloading...';
    });
  } else if (state.currentManga) {
    // Re-enable buttons - let refreshMangaChapterList handle the text update
    document.querySelectorAll('[onclick*="downloadAllChapters"], [onclick*="downloadUnreadChapters"]').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('downloading');
      // Clear the stored original text since it may be outdated
      delete btn.dataset.originalText;
    });
  }

  // Update individual chapter download buttons
  document.querySelectorAll('.chapter-group').forEach(group => {
    const chapterNum = parseFloat(group.dataset.chapter);
    const chapterItem = group.querySelector('.chapter-item');
    if (!chapterItem) return;

    // Check if this chapter is in any download task (downloading, queued, or paused)
    let isInDownloadQueue = false;
    let isCurrentlyDownloading = false;

    downloadManager.tasks.forEach(task => {
      // Check all tasks, not just for current manga (to support cross-device sync)
      if (task.status === 'running' || task.status === 'queued' || task.status === 'paused') {
        // Check if it's the current chapter being actively downloaded
        if (task.mangaId === state.currentManga?.id && task.current === chapterNum) {
          isCurrentlyDownloading = true;
          isInDownloadQueue = true;
        }
        // Check if it's in any task's chapters list (remaining or all)
        if (task.mangaId === state.currentManga?.id) {
          const allTaskChapters = task.chapters || [];
          const completedChapters = task.completedChapters || [];
          // If chapter is in task but not yet completed, show hourglass
          if (allTaskChapters.includes(chapterNum) && !completedChapters.includes(chapterNum)) {
            isInDownloadQueue = true;
          }
        }
      }
    });

    const dlBtn = chapterItem.querySelector('.chapter-actions button[data-chapter]');
    if (dlBtn && isInDownloadQueue) {
      dlBtn.innerHTML = '⏳';
      dlBtn.title = isCurrentlyDownloading ? 'Downloading...' : 'Queued...';
      dlBtn.disabled = true;
    }

    // Also update version row download buttons
    if (isInDownloadQueue) {
      const versionRows = group.querySelectorAll('.version-row');
      versionRows.forEach(row => {
        const btns = row.querySelector('.version-btns');
        if (btns) {
          const versionDlBtn = btns.querySelector('button[title="Download"]');
          if (versionDlBtn) {
            versionDlBtn.innerHTML = '⏳';
            versionDlBtn.title = 'Queued...';
            versionDlBtn.disabled = true;
          }
        }
      });
    }
  });
}

// Update chapter status without full page refresh
function updateChapterDownloadStatus(mangaId, chapterNum) {
  // Update the chapter item in the list
  const chapterGroups = document.querySelectorAll(`.chapter-group[data-chapter="${chapterNum}"]`);
  chapterGroups.forEach(group => {
    const chapterItem = group.querySelector('.chapter-item');
    if (chapterItem && !chapterItem.classList.contains('downloaded')) {
      chapterItem.classList.add('downloaded');
      // Update download button in main row
      const actions = chapterItem.querySelector('.chapter-actions');
      if (actions) {
        const dlBtn = actions.querySelector('button[title*="Download"], button[title*="Downloaded"], button[title*="Queued"]');
        if (dlBtn) {
          dlBtn.classList.add('success');
          dlBtn.classList.remove('downloading');
          dlBtn.innerHTML = '✓';
          dlBtn.title = 'Downloaded';
          dlBtn.disabled = false;
        }
      }
    }

    // Update version rows too
    const versionRows = group.querySelectorAll('.version-row');
    versionRows.forEach(row => {
      const rowUrl = row.dataset.url;
      if (!row.classList.contains('downloaded') && rowUrl) {
        row.classList.add('downloaded');
        // Update version row buttons - replace download button with delete
        const btns = row.querySelector('.version-btns');
        if (btns) {
          const dlBtn = btns.querySelector('button[title="Download"]');
          if (dlBtn && state.currentManga) {
            // Create new delete button with proper onclick
            const newBtn = document.createElement('button');
            newBtn.className = 'btn-icon small danger';
            newBtn.innerHTML = '🗑️';
            newBtn.title = 'Delete from disk';
            newBtn.onclick = (e) => {
              e.stopPropagation();
              deleteDownloadedVersion(state.currentManga.id, chapterNum, rowUrl);
            };
            dlBtn.replaceWith(newBtn);
          }
        }
        // Update version label
        const label = row.querySelector('.version-label');
        if (label) {
          label.textContent = '✓ DL';
          label.classList.add('ours');
        }
      }
    });
  });
}


// Refresh just the chapter list, not the whole page
async function refreshMangaChapterList(mangaId) {
  try {
    const manga = await API.getBookmark(mangaId);
    state.currentManga = manga;

    const downloadedChapters = manga.downloadedChapters || [];
    const downloadedCount = downloadedChapters.length;

    // Update header meta items
    const metaItems = document.querySelectorAll('.manga-detail-meta .meta-item');
    metaItems.forEach(item => {
      if (item.textContent.includes('Downloaded')) {
        item.textContent = `${downloadedCount} Downloaded`;
      }
    });

    // Update chapter header filter button "Downloaded (X)"
    const filterBtns = document.querySelectorAll('.chapter-filters .filter-btn');
    filterBtns.forEach(btn => {
      if (btn.dataset.filter === 'downloaded') {
        btn.textContent = `Downloaded (${downloadedCount})`;
      }
    });

    // Update "Download All" button
    const deletedUrls = new Set(Object.keys(manga.deletedVersions || {}));
    const chapters = manga.chapters || [];
    const undownloadedCount = chapters.filter(c =>
      !downloadedChapters.includes(c.number) && !deletedUrls.has(c.url)
    ).length;

    const downloadAllBtn = document.querySelector('.manga-detail-actions button[onclick*="downloadAllChapters"]');
    if (downloadAllBtn) {
      downloadAllBtn.disabled = undownloadedCount === 0;
      downloadAllBtn.innerHTML = `↓ Download All ${undownloadedCount > 0 ? `(${undownloadedCount})` : ''}`;
    }

    // Mark all downloaded chapters
    downloadedChapters.forEach(num => {
      updateChapterDownloadStatus(mangaId, num);
    });

    // Also update page counts for downloaded chapters
    updateAllPageCounts(manga);
  } catch (error) {
    console.error('Failed to refresh chapter list:', error);
  }
}

// Update page counts for all downloaded chapters
function updateAllPageCounts(manga) {
  const downloadedVersions = manga.downloadedVersions || {};

  for (const [url, versions] of Object.entries(downloadedVersions)) {
    if (!Array.isArray(versions)) continue;

    versions.forEach(version => {
      if (version.pageCount) {
        const encodedUrl = encodeURIComponent(url);

        // Find all rows with this URL (works for both version-row and duplicate-version-row)
        const allRows = document.querySelectorAll(`[data-url="${encodedUrl}"]`);
        allRows.forEach(row => {
          const pageCountSpan = row.querySelector('.version-pages');
          if (pageCountSpan && !pageCountSpan.textContent) {
            pageCountSpan.textContent = `${version.pageCount} pages`;
          }
        });
      }
    });
  }
}

function showDownloadManagerButton() {
  let btn = document.getElementById('download-manager-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'download-manager-btn';
    btn.className = 'download-manager-fab';
    btn.onclick = toggleDownloadManager;
    btn.innerHTML = '⬇️';
    btn.title = 'Download Manager';
    document.body.appendChild(btn);
  }
  btn.style.display = 'flex';
  updateDownloadFabBadge();
}

function updateDownloadFabBadge() {
  const btn = document.getElementById('download-manager-btn');
  if (!btn) return;

  // Count active download tasks
  const activeDownloads = Array.from(downloadManager.tasks.values())
    .filter(t => t.status === 'running' || t.status === 'paused' || t.status === 'queued').length;

  // Count active scrape tasks
  const activeScrapes = Array.from(downloadManager.scrapeTasks.values())
    .filter(t => t.status === 'running' || t.status === 'queued').length;

  const activeCount = activeDownloads + activeScrapes;

  let badge = btn.querySelector('.fab-badge');
  if (activeCount > 0) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'fab-badge';
      btn.appendChild(badge);
    }
    badge.textContent = activeCount;
  } else if (badge) {
    badge.remove();
  }

  // Hide button if no tasks (downloads or scrapes)
  if (downloadManager.tasks.size === 0 && downloadManager.scrapeTasks.size === 0) {
    btn.style.display = 'none';
    localStorage.removeItem('downloadManagerOpen');
  }
}

// Restore download manager state on page load and sync with server
async function restoreDownloadManager() {
  // Start background sync to detect downloads from other devices
  startBackgroundSync();
}

// Background sync - periodically check server for downloads from any device
function startBackgroundSync() {
  // Check immediately
  syncDownloadsFromServer();

  // Then check every 5 seconds
  setInterval(syncDownloadsFromServer, 5000);
}

async function syncDownloadsFromServer() {
  try {
    const downloads = await API.getAllDownloads();
    const serverTaskIds = new Set(Object.keys(downloads));
    const localTaskIds = new Set(downloadManager.tasks.keys());

    // Add new tasks from server (started on other devices)
    for (const [taskId, task] of Object.entries(downloads)) {
      if (!downloadManager.tasks.has(taskId)) {
        // New task from another device
        downloadManager.tasks.set(taskId, {
          taskId,
          mangaId: task.bookmarkId,
          mangaTitle: task.mangaTitle || 'Unknown',
          status: task.status,
          total: task.total,
          completed: task.completed,
          current: task.current,
          chapters: task.chapters || [],
          remainingChapters: task.remainingChapters || [],
          completedChapters: task.completedChapters || [],
          errors: task.errors || [],
          startTime: Date.now()
        });

        // If task is already complete (fast download), refresh if viewing this manga
        if (task.status === 'complete' && state.currentManga && state.currentManga.id === task.bookmarkId) {
          refreshMangaChapterList(task.bookmarkId);
        }
      } else {
        // Update existing task
        const localTask = downloadManager.tasks.get(taskId);
        const oldCompleted = localTask.completed;
        const oldStatus = localTask.status;

        localTask.status = task.status;
        localTask.total = task.total;
        localTask.completed = task.completed;
        localTask.current = task.current;
        localTask.chapters = task.chapters || localTask.chapters || [];
        localTask.remainingChapters = task.remainingChapters || [];
        localTask.completedChapters = task.completedChapters || [];
        localTask.errors = task.errors || [];

        // If a chapter completed, update UI
        if (task.completed > oldCompleted) {
          updateChapterDownloadStatus(localTask.mangaId, task.current || localTask.current);
        }

        // If task just completed, show toast and refresh chapter list
        if (task.status === 'complete' && oldStatus !== 'complete') {
          showToast(`✓ ${localTask.mangaTitle}: ${task.completed} chapters downloaded`, 'success');
          if (state.currentManga && state.currentManga.id === localTask.mangaId) {
            refreshMangaChapterList(localTask.mangaId);
          }
        }
      }
    }

    // Remove tasks that no longer exist on server
    for (const taskId of localTaskIds) {
      if (!serverTaskIds.has(taskId)) {
        const task = downloadManager.tasks.get(taskId);
        // Only remove if it was running/paused (completed tasks are kept locally until cleared)
        if (task && (task.status === 'running' || task.status === 'paused')) {
          task.status = 'complete';
        }
      }
    }

    // Also sync scrape tasks
    await syncScrapeTasksFromServer();

    // Show/hide FAB based on tasks
    if (downloadManager.tasks.size > 0 || downloadManager.scrapeTasks.size > 0) {
      showDownloadManagerButton();
      updateDownloadManagerUI();
    }

    // Update download buttons state across devices
    updateDownloadButtonsState();

    // Restore open state on first sync
    if (!downloadManager.initialSyncDone) {
      downloadManager.initialSyncDone = true;
      if (localStorage.getItem('downloadManagerOpen') === 'true' && (downloadManager.tasks.size > 0 || downloadManager.scrapeTasks.size > 0)) {
        downloadManager.isOpen = false;
        toggleDownloadManager();
      }
    }
  } catch (error) {
    // Silent fail - don't spam console on network errors
  }
}

// Sync scrape tasks from server
async function syncScrapeTasksFromServer() {
  try {
    const scrapeTasks = await API.getQueueTasks();
    const serverTaskIds = new Set(Object.keys(scrapeTasks));
    const localTaskIds = new Set(downloadManager.scrapeTasks.keys());

    // Add/update tasks from server
    for (const [taskId, task] of Object.entries(scrapeTasks)) {
      if (!downloadManager.scrapeTasks.has(taskId)) {
        // New scrape task
        downloadManager.scrapeTasks.set(taskId, {
          taskId,
          type: task.type,
          description: task.description,
          mangaId: task.mangaId,
          mangaTitle: task.mangaTitle,
          status: task.status,
          createdAt: task.createdAt,
          startedAt: task.startedAt,
          completedAt: task.completedAt,
          error: task.error
        });
      } else {
        // Update existing task
        const localTask = downloadManager.scrapeTasks.get(taskId);
        localTask.status = task.status;
        localTask.startedAt = task.startedAt;
        localTask.completedAt = task.completedAt;
        localTask.error = task.error;
      }
    }

    // Remove tasks that no longer exist on server
    for (const taskId of localTaskIds) {
      if (!serverTaskIds.has(taskId)) {
        downloadManager.scrapeTasks.delete(taskId);
      }
    }
  } catch (error) {
    // Silent fail
  }
}

function toggleDownloadManager() {
  downloadManager.isOpen = !downloadManager.isOpen;

  // Save state
  localStorage.setItem('downloadManagerOpen', downloadManager.isOpen);

  let panel = document.getElementById('download-manager-panel');
  let backdrop = document.getElementById('download-manager-backdrop');
  const btn = document.getElementById('download-manager-btn');

  if (downloadManager.isOpen) {
    // Create backdrop for closing on outside tap
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'download-manager-backdrop';
      backdrop.className = 'download-manager-backdrop';
      backdrop.onclick = toggleDownloadManager;
      document.body.appendChild(backdrop);
    }
    backdrop.classList.add('open');

    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'download-manager-panel';
      panel.className = 'download-manager-panel';
      document.body.appendChild(panel);
    }
    updateDownloadManagerUI();
    panel.classList.add('open');
    if (btn) btn.classList.add('panel-open');
    // Position button above panel
    positionFabAbovePanel();
  } else {
    if (backdrop) {
      backdrop.remove();  // Remove from DOM to prevent touch blocking
    }
    if (panel) panel.classList.remove('open');
    if (btn) {
      btn.classList.remove('panel-open');
      btn.style.bottom = '';
    }
  }
}

function positionFabAbovePanel() {
  const btn = document.getElementById('download-manager-btn');
  const panel = document.getElementById('download-manager-panel');
  if (!btn || !panel) return;

  // Wait for panel to render, then position button above it
  requestAnimationFrame(() => {
    const panelRect = panel.getBoundingClientRect();
    const panelHeight = panelRect.height;
    // 90px is original bottom of panel, add panel height + gap
    btn.style.bottom = (90 + panelHeight + 10) + 'px';
  });
}

function updateDownloadManagerUI() {
  const panel = document.getElementById('download-manager-panel');
  if (!panel) return;

  // Download tasks
  const tasks = Array.from(downloadManager.tasks.values());
  const activeTasks = tasks.filter(t => t.status === 'running' || t.status === 'paused' || t.status === 'queued');
  const completedTasks = tasks.filter(t => t.status === 'complete');
  const failedTasks = tasks.filter(t => t.status === 'error');

  // Scrape tasks
  const scrapeTasks = Array.from(downloadManager.scrapeTasks.values());
  const activeScrapeTasks = scrapeTasks.filter(t => t.status === 'running' || t.status === 'queued');
  const completedScrapeTasks = scrapeTasks.filter(t => t.status === 'complete');
  const failedScrapeTasks = scrapeTasks.filter(t => t.status === 'error');

  const hasAnyTasks = tasks.length > 0 || scrapeTasks.length > 0;
  const hasActiveDownloads = activeTasks.length > 0;

  panel.innerHTML = `
    <div class="dm-header">
      <h3>Task Queue</h3>
      <div class="dm-header-actions">
        ${hasActiveDownloads ? `
          <button class="btn btn-xs btn-secondary" onclick="pauseAllDownloads()" title="Pause all">⏸️ Pause All</button>
          <button class="btn btn-xs btn-danger" onclick="cancelAllDownloads()" title="Cancel all">⏹️ Stop All</button>
        ` : ''}
        <button class="btn btn-xs btn-secondary" onclick="clearCompletedTasks()" title="Clear completed">🗑️ Clear</button>
        <button class="btn-icon xs" onclick="toggleDownloadManager()">✕</button>
      </div>
    </div>
    <div class="dm-content">
      ${!hasAnyTasks ? `
        <div class="dm-empty">No tasks</div>
      ` : `
        ${activeScrapeTasks.map(task => renderScrapeTask(task)).join('')}
        ${activeTasks.map(task => renderDownloadTask(task)).join('')}
        ${completedTasks.length > 0 || completedScrapeTasks.length > 0 ? `
          <div class="dm-section-header">Completed (${completedTasks.length + completedScrapeTasks.length})</div>
          ${completedScrapeTasks.map(task => renderScrapeTask(task)).join('')}
          ${completedTasks.map(task => renderDownloadTask(task)).join('')}
        ` : ''}
        ${failedTasks.length > 0 || failedScrapeTasks.length > 0 ? `
          <div class="dm-section-header">Failed (${failedTasks.length + failedScrapeTasks.length})</div>
          ${failedScrapeTasks.map(task => renderScrapeTask(task)).join('')}
          ${failedTasks.map(task => renderDownloadTask(task)).join('')}
        ` : ''}
      `}
    </div>
  `;

  updateDownloadFabBadge();

  // Reposition FAB if panel is open
  if (downloadManager.isOpen) {
    positionFabAbovePanel();
  }
}

function renderDownloadTask(task) {
  const progress = task.total > 0 ? Math.round((task.completed / task.total) * 100) : 0;
  const statusIcon = {
    'queued': '🕐',
    'running': '⏳',
    'paused': '⏸️',
    'complete': '✅',
    'error': '❌'
  }[task.status] || '⏳';

  // Build chapter info - simplified for single-chapter tasks
  let chapterInfo = '';
  const allChapters = task.chapters || [];
  const isSingleChapter = allChapters.length === 1;

  if (isSingleChapter) {
    // Single chapter task - show simple status
    const chapterNum = allChapters[0];
    if (task.status === 'queued') {
      chapterInfo = `Chapter ${chapterNum} • Queued`;
    } else if (task.status === 'running') {
      chapterInfo = `Chapter ${chapterNum} • Downloading...`;
    } else if (task.status === 'paused') {
      chapterInfo = `Chapter ${chapterNum} • Paused`;
    } else if (task.status === 'complete') {
      chapterInfo = `Chapter ${chapterNum} • Complete`;
    } else {
      chapterInfo = `Chapter ${chapterNum}`;
    }
  } else {
    // Multi-chapter task (legacy support)
    const completedChapters = task.completedChapters || [];
    const remainingChapters = task.remainingChapters || [];

    if (task.status === 'queued') {
      const chapterList = allChapters.length > 5
        ? `Ch. ${allChapters.slice(0, 5).join(', ')}... (+${allChapters.length - 5} more)`
        : `Ch. ${allChapters.join(', ')}`;
      chapterInfo = `${task.total} chapters: ${chapterList}`;
    } else if (task.status === 'running' || task.status === 'paused') {
      chapterInfo = `Chapter ${task.current || '?'} • ${task.completed}/${task.total}`;
      if (remainingChapters.length > 0) {
        const nextChapters = remainingChapters.slice(0, 3);
        chapterInfo += ` • Next: ${nextChapters.join(', ')}${remainingChapters.length > 3 ? '...' : ''}`;
      }
    } else if (task.status === 'complete') {
      const chapterList = completedChapters.length > 5
        ? `Ch. ${completedChapters.slice(0, 5).join(', ')}... (+${completedChapters.length - 5} more)`
        : `Ch. ${completedChapters.join(', ')}`;
      chapterInfo = `${task.completed} chapters: ${chapterList}`;
    } else {
      chapterInfo = `${task.completed}/${task.total} chapters`;
    }
  }

  return `
    <div class="dm-task ${task.status}">
      <div class="dm-task-info">
        <div class="dm-task-title">
          <span class="dm-status-icon">${statusIcon}</span>
          <span class="dm-manga-title" onclick="router.navigate('/manga/${task.mangaId}')" style="cursor:pointer;">${task.mangaTitle}</span>
        </div>
        <div class="dm-task-progress">
          ${chapterInfo}
          ${task.errors.length > 0 ? `<span class="dm-errors">(${task.errors.length} errors)</span>` : ''}
        </div>
        ${task.status === 'running' || task.status === 'paused' ? `
          <div class="dm-progress-bar">
            <div class="dm-progress-fill" style="width: ${progress}%"></div>
          </div>
        ` : ''}
      </div>
      <div class="dm-task-actions">
        ${task.status === 'running' ? `
          <button class="btn-icon xs" onclick="pauseDownload('${task.taskId}')" title="Pause">⏸️</button>
          <button class="btn-icon xs danger" onclick="cancelDownload('${task.taskId}')" title="Cancel">⏹️</button>
        ` : task.status === 'paused' ? `
          <button class="btn-icon xs" onclick="resumeDownload('${task.taskId}')" title="Resume">▶️</button>
          <button class="btn-icon xs danger" onclick="cancelDownload('${task.taskId}')" title="Cancel">⏹️</button>
        ` : task.status === 'queued' ? `
          <button class="btn-icon xs danger" onclick="cancelDownload('${task.taskId}')" title="Cancel">⏹️</button>
        ` : `
          <button class="btn-icon xs" onclick="removeDownloadTask('${task.taskId}')" title="Remove">✕</button>
        `}
      </div>
    </div>
  `;
}

function renderScrapeTask(task) {
  const statusIcon = {
    'queued': '🕐',
    'running': '🔄',
    'complete': '✅',
    'error': '❌'
  }[task.status] || '🔄';

  // Format elapsed time if running
  let timeInfo = '';
  if (task.status === 'running' && task.startedAt) {
    const elapsed = Math.round((Date.now() - task.startedAt) / 1000);
    timeInfo = elapsed < 60 ? `${elapsed}s` : `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
  }

  return `
    <div class="dm-task scrape ${task.status}">
      <div class="dm-task-info">
        <div class="dm-task-title">
          <span class="dm-status-icon">${statusIcon}</span>
          <span class="dm-task-type">Scraping</span>
          ${task.mangaTitle ? `<span class="dm-manga-title" onclick="router.navigate('/manga/${task.mangaId}')" style="cursor:pointer;">${task.mangaTitle}</span>` : ''}
        </div>
        <div class="dm-task-progress">
          ${task.description || 'Scraping...'}
          ${timeInfo ? ` • ${timeInfo}` : ''}
          ${task.error ? `<span class="dm-errors">${task.error}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

async function pauseDownload(taskId) {
  try {
    await API.pauseDownload(taskId);
    const task = downloadManager.tasks.get(taskId);
    if (task) task.status = 'paused';
    updateDownloadManagerUI();
    showToast('Download paused', 'info');
  } catch (error) {
    showToast('Failed to pause: ' + error.message, 'error');
  }
}

async function resumeDownload(taskId) {
  try {
    await API.resumeDownload(taskId);
    const task = downloadManager.tasks.get(taskId);
    if (task) task.status = 'running';
    if (!downloadManager.pollInterval) {
      startDownloadPolling();
    }
    updateDownloadManagerUI();
    showToast('Download resumed', 'info');
  } catch (error) {
    showToast('Failed to resume: ' + error.message, 'error');
  }
}

async function cancelDownload(taskId) {
  try {
    await API.cancelDownload(taskId);
    const task = downloadManager.tasks.get(taskId);
    if (task) task.status = 'cancelled';
    updateDownloadManagerUI();
    showToast('Download cancelled', 'info');
  } catch (error) {
    showToast('Failed to cancel: ' + error.message, 'error');
  }
}

function removeDownloadTask(taskId) {
  downloadManager.tasks.delete(taskId);
  updateDownloadManagerUI();
}

async function pauseAllDownloads() {
  const activeTasks = Array.from(downloadManager.tasks.values())
    .filter(t => t.status === 'running');

  for (const task of activeTasks) {
    await pauseDownload(task.taskId);
  }
}

async function cancelAllDownloads() {
  if (!confirm('Cancel all downloads?')) return;

  const activeTasks = Array.from(downloadManager.tasks.values())
    .filter(t => t.status === 'running' || t.status === 'paused');

  for (const task of activeTasks) {
    await cancelDownload(task.taskId);
  }
}

function clearCompletedDownloads() {
  clearCompletedTasks();
}

function clearCompletedTasks() {
  // Clear completed downloads
  const completedDownloadIds = Array.from(downloadManager.tasks.entries())
    .filter(([_, t]) => t.status === 'complete' || t.status === 'cancelled' || t.status === 'error')
    .map(([id]) => id);

  completedDownloadIds.forEach(id => downloadManager.tasks.delete(id));

  // Clear completed scrape tasks
  const completedScrapeIds = Array.from(downloadManager.scrapeTasks.entries())
    .filter(([_, t]) => t.status === 'complete' || t.status === 'error')
    .map(([id]) => id);

  completedScrapeIds.forEach(id => downloadManager.scrapeTasks.delete(id));

  updateDownloadManagerUI();
}

// Keyboard shortcuts (chapter nav only - page nav handled by setupKeyboardNavigation)
document.addEventListener('keydown', (e) => {
  // Only in reader
  if (!document.getElementById('reader')) return;

  switch (e.key) {
    case 'Escape':
      closeReader();
      break;
    case '[':
      prevChapter();
      break;
    case ']':
      nextChapter();
      break;
  }
});

// Handle Enter key in modals
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    if (document.getElementById('add-modal').classList.contains('active')) {
      addManga();
    } else if (document.getElementById('rename-modal').classList.contains('active')) {
      renameManga();
    }
  }
});

// Category management functions
function filterByCategory(category) {
  state.activeCategory = category;
  const app = document.getElementById('app');
  app.innerHTML = renderLibrary(state.bookmarks, state.categories, state.activeCategory, state.artistFilter, state.viewMode, state.series);
}

// View mode toggle (manga vs series)
function setViewMode(mode) {
  state.viewMode = mode;
  const app = document.getElementById('app');
  app.innerHTML = renderLibrary(state.bookmarks, state.categories, state.activeCategory, state.artistFilter, state.viewMode, state.series);
}

// ==================== SERIES MANAGEMENT ====================

// Open create series modal
function openCreateSeriesModal() {
  // Add modal to DOM if not present
  let modal = document.getElementById('create-series-modal');
  if (!modal) {
    const modalHtml = renderCreateSeriesModal();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    modal = document.getElementById('create-series-modal');
  }
  modal.classList.add('active');
  document.getElementById('new-series-title').focus();
}

// Create a new series
async function createSeries() {
  const title = document.getElementById('new-series-title').value.trim();
  const alias = document.getElementById('new-series-alias').value.trim();

  if (!title) {
    showToast('Please enter a series title', 'error');
    return;
  }

  try {
    const series = await API.createSeries(title, alias || null);
    showToast(`Series "${alias || title}" created!`, 'success');
    closeModal('create-series-modal');

    // Refresh series list and navigate to it
    state.series = await API.getSeries();
    router.navigate(`/series/${series.id}`);
  } catch (error) {
    showToast('Failed to create series', 'error');
  }
}

// Delete a series
async function deleteSeries(seriesId) {
  if (!confirm('Delete this series? The manga entries will not be deleted.')) return;

  try {
    await API.deleteSeries(seriesId);
    showToast('Series deleted', 'success');
    state.series = await API.getSeries();
    router.navigate('/');
  } catch (error) {
    showToast('Failed to delete series', 'error');
  }
}

// Set chapter filter
function setChapterFilter(filter) {
  state.chapterFilter = filter;
  state.chapterListPage = 0; // Reset pagination
  const app = document.getElementById('app');
  if (state.currentManga) {
    app.innerHTML = renderMangaDetail(state.currentManga, state.categories, state.chapterListPage, state.selectionMode, state.chapterFilter);
    // Re-bind listeners or other setup if needed
    setupChapterLongPress();
  }
}

// Open add to series modal
// Store available bookmarks for filtering
let availableBookmarksCache = [];
let currentAddSeriesId = null;

async function openAddToSeriesModal(seriesId) {
  const modal = document.getElementById('add-to-series-modal');
  if (!modal) return;

  currentAddSeriesId = seriesId;
  modal.classList.add('active');

  // Clear search input
  const searchInput = document.getElementById('add-story-search');
  if (searchInput) searchInput.value = '';

  const list = document.getElementById('available-bookmarks-list');
  list.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const bookmarks = await API.getAvailableBookmarksForSeries();
    availableBookmarksCache = bookmarks || [];

    renderAvailableBookmarks(availableBookmarksCache, seriesId);
  } catch (error) {
    list.innerHTML = '<p style="color:var(--danger);">Failed to load available manga</p>';
  }
}

function renderAvailableBookmarks(bookmarks, seriesId) {
  const list = document.getElementById('available-bookmarks-list');

  if (!bookmarks || bookmarks.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No matching manga found.</p>';
    return;
  }

  list.innerHTML = bookmarks.map(b => {
    const displayName = b.alias || b.title;
    const coverUrl = b.localCover
      ? `/api/public/covers/${b.id}/${encodeURIComponent(b.localCover.split(/[/\\]/).pop())}`
      : b.cover;
    return `
      <div class="available-bookmark-item" onclick="addToSeries('${seriesId}', '${b.id}')">
        <div class="available-bookmark-cover">
          ${coverUrl ? `<img src="${coverUrl}" alt="${displayName}">` : '<div class="placeholder">📚</div>'}
        </div>
        <div class="available-bookmark-title">${displayName}</div>
      </div>
    `;
  }).join('');
}

function filterAvailableBookmarks(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    renderAvailableBookmarks(availableBookmarksCache, currentAddSeriesId);
    return;
  }

  const filtered = availableBookmarksCache.filter(b => {
    const title = (b.title || '').toLowerCase();
    const alias = (b.alias || '').toLowerCase();
    return title.includes(term) || alias.includes(term);
  });

  renderAvailableBookmarks(filtered, currentAddSeriesId);
}

// Add manga to series
async function addToSeries(seriesId, bookmarkId) {
  try {
    await API.addSeriesEntry(seriesId, bookmarkId);
    showToast('Added to series!', 'success');

    // Refresh the series detail
    const series = await API.getSeriesById(seriesId);
    state.currentSeries = series;
    const app = document.getElementById('app');
    app.innerHTML = renderSeriesDetail(series);

    closeModal('add-to-series-modal');
  } catch (error) {
    showToast('Failed to add to series', 'error');
  }
}

// Remove entry from series
async function removeSeriesEntry(seriesId, entryId) {
  if (!confirm('Remove this story from the series?')) return;

  try {
    await API.removeSeriesEntry(seriesId, entryId);
    showToast('Removed from series', 'success');

    // Refresh
    const series = await API.getSeriesById(seriesId);
    state.currentSeries = series;
    const app = document.getElementById('app');
    app.innerHTML = renderSeriesDetail(series);
  } catch (error) {
    showToast('Failed to remove from series', 'error');
  }
}

// Move series entry up or down
async function moveSeriesEntry(seriesId, entryId, direction) {
  const series = state.currentSeries;
  if (!series || !series.entries) return;

  const currentIndex = series.entries.findIndex(e => e.id === entryId);
  if (currentIndex === -1) return;

  const newIndex = currentIndex + direction;
  if (newIndex < 0 || newIndex >= series.entries.length) return;

  // Swap in the order
  const newOrder = series.entries.map(e => e.id);
  [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

  try {
    await API.reorderSeriesEntries(seriesId, newOrder);

    // Refresh
    const updatedSeries = await API.getSeriesById(seriesId);
    state.currentSeries = updatedSeries;
    const app = document.getElementById('app');
    app.innerHTML = renderSeriesDetail(updatedSeries);
  } catch (error) {
    showToast('Failed to reorder', 'error');
  }
}

// Set series cover entry
async function setSeriesCoverEntry(seriesId, entryId) {
  try {
    await API.setSeriesCover(seriesId, entryId);
    showToast('Cover updated', 'success');

    // Refresh
    const series = await API.getSeriesById(seriesId);
    state.currentSeries = series;
    state.series = await API.getSeries();
    const app = document.getElementById('app');
    app.innerHTML = renderSeriesDetail(series);
  } catch (error) {
    showToast('Failed to set cover', 'error');
  }
}

// Rename series modal
function openRenameSeriesModal(seriesId, currentName) {
  const newName = prompt('Enter new name for series:', currentName);
  if (newName && newName.trim() && newName !== currentName) {
    renameSeriesEntry(seriesId, newName.trim());
  }
}

async function renameSeriesEntry(seriesId, newName) {
  try {
    await API.updateSeries(seriesId, { alias: newName });
    showToast('Series renamed', 'success');

    // Refresh
    const series = await API.getSeriesById(seriesId);
    state.currentSeries = series;
    state.series = await API.getSeries();
    const app = document.getElementById('app');
    app.innerHTML = renderSeriesDetail(series);
  } catch (error) {
    showToast('Failed to rename series', 'error');
  }
}

// Cover gallery mode
async function openGalleryMode(seriesId) {
  const modal = document.getElementById('cover-gallery-modal');
  if (!modal) return;

  modal.classList.add('active');
  const grid = document.getElementById('cover-gallery-grid');
  grid.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const series = state.currentSeries || await API.getSeriesById(seriesId);
    const entries = series.entries || [];

    if (entries.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:var(--text-muted);">No stories in this series</p>';
      return;
    }

    grid.innerHTML = entries.map(entry => {
      const entryName = entry.alias || entry.title;
      const coverUrl = entry.localCover
        ? `/api/public/covers/${entry.bookmark_id}/${encodeURIComponent(entry.localCover.split(/[/\\]/).pop())}`
        : entry.cover;

      return `
        <div class="gallery-cover-item" onclick="setSeriesCoverEntry('${seriesId}', '${entry.id}'); closeModal('cover-gallery-modal');">
          ${coverUrl
          ? `<img src="${coverUrl}" alt="${entryName}">`
          : `<div class="placeholder">📚</div>`
        }
          <div class="gallery-cover-title">${entryName}</div>
        </div>
      `;
    }).join('');
  } catch (error) {
    grid.innerHTML = '<p style="color:var(--danger);">Failed to load covers</p>';
  }
}

function toggleCategoryMenu() {
  const menu = document.getElementById('category-fab-menu');
  if (menu) {
    menu.classList.toggle('open');
  }
}

function toggleMobileActions() {
  const actions = document.getElementById('manga-actions');
  if (actions) {
    actions.classList.toggle('expanded');
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.querySelector('.hamburger-btn');
  if (menu && btn) {
    menu.classList.toggle('open');
    btn.classList.toggle('active');
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.querySelector('.hamburger-btn');
  if (menu) menu.classList.remove('open');
  if (btn) btn.classList.remove('active');
}

function toggleCategoryDropdown(event) {
  event.stopPropagation();
  // Support both .category-add-dropdown (library page) and .category-add-badge (detail page)
  const dropdown = event.target.closest('.category-add-dropdown') || event.target.closest('.category-add-badge');
  if (dropdown) {
    const menu = dropdown.querySelector('.category-dropdown-menu');
    if (menu) {
      const isOpen = menu.classList.contains('open');
      closeCategoryDropdowns();
      if (!isOpen) {
        menu.classList.add('open');
      }
    }
  }
}

function closeCategoryDropdowns() {
  document.querySelectorAll('.category-dropdown-menu.open').forEach(m => m.classList.remove('open'));
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.category-add-dropdown') && !e.target.closest('.category-add-badge')) {
    closeCategoryDropdowns();
  }
  if (!e.target.closest('.category-fab')) {
    const menu = document.getElementById('category-fab-menu');
    if (menu) menu.classList.remove('open');
  }
});

function openCategoryManager() {
  document.getElementById('category-modal').classList.add('active');
}

async function addNewCategory() {
  const input = document.getElementById('new-category-input');
  const name = input.value.trim();
  if (!name) return;

  try {
    const result = await API.addCategory(name);
    if (result.success) {
      input.value = '';
      state.categories.push(result.category);
      // Refresh the category list in modal
      const list = document.getElementById('category-list');
      list.innerHTML = state.categories.map(cat => `
        <div class="category-item">
          <span>${cat}</span>
          <button class="btn-icon small danger" onclick="deleteCategoryItem('${cat.replace(/'/g, "\\'")}')">×</button>
        </div>
      `).join('');
      showToast('Category added', 'success');
    } else {
      showToast(result.message || 'Failed to add category', 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteCategoryItem(name) {
  if (!confirm(`Delete category "${name}"? It will be removed from all manga.`)) return;

  try {
    await API.deleteCategory(name);
    state.categories = state.categories.filter(c => c !== name);
    // Refresh the category list in modal
    const list = document.getElementById('category-list');
    list.innerHTML = state.categories.length === 0
      ? '<p class="text-muted">No categories yet</p>'
      : state.categories.map(cat => `
        <div class="category-item">
          <span>${cat}</span>
          <button class="btn-icon small danger" onclick="deleteCategoryItem('${cat.replace(/'/g, "\\'")}')">×</button>
        </div>
      `).join('');

    // If we deleted the active filter, reset it
    if (state.activeCategory === name) {
      state.activeCategory = null;
    }
    showToast('Category deleted', 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function toggleMangaCategory(mangaId, category, add) {
  try {
    const manga = state.currentManga || state.bookmarks.find(b => b.id === mangaId);
    if (!manga) return;

    let categories = [...(manga.categories || [])];
    if (add) {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    } else {
      categories = categories.filter(c => c !== category);
    }

    await API.setBookmarkCategories(mangaId, categories);

    // Update local state
    manga.categories = categories;
    if (state.currentManga && state.currentManga.id === mangaId) {
      state.currentManga.categories = categories;
    }

    // Re-render the category badges in the meta row
    const addBadge = document.getElementById(`category-add-${mangaId}`);
    if (addBadge) {
      // Find all category badges and the add button, replace them
      const metaRow = addBadge.closest('.manga-detail-meta');
      if (metaRow) {
        // Remove old category badges
        metaRow.querySelectorAll('.category-badge').forEach(el => el.remove());
        // Remove old add badge
        addBadge.remove();
        // Append new ones
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = renderCategoryBadges(manga, state.categories);
        while (tempDiv.firstChild) {
          metaRow.appendChild(tempDiv.firstChild);
        }
      }
    }

    showToast(add ? `Added to ${category}` : `Removed from ${category}`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    // On mobile, don't close if an input/textarea inside the modal is focused
    // This prevents closing when user taps outside to dismiss keyboard
    const activeElement = document.activeElement;
    const isInputFocused = activeElement &&
      (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') &&
      e.target.contains(activeElement);

    if (!isInputFocused) {
      e.target.classList.remove('active');
    }
  }
});

// ==================== ARTIST FUNCTIONS ====================

let artistSelectorMangaId = null;
let allArtists = [];

// Clear artist filter and refresh library
function clearArtistFilter() {
  state.artistFilter = null;
  showLibrary();
}

// Navigate to library filtered by artist
async function navigateToArtist(mangaId) {
  const manga = state.currentManga || state.bookmarks.find(b => b.id === mangaId);
  if (!manga) return;

  const artists = manga.artists || [];

  // If no artists, open the selector instead
  if (artists.length === 0) {
    openArtistSelector(mangaId);
    return;
  }

  // If one artist, filter by that artist
  if (artists.length === 1) {
    // Navigate to home with artist filter
    state.artistFilter = artists[0];
    router.navigate('/');
    return;
  }

  // Multiple artists - show a quick picker
  const picked = await showArtistPicker(artists);
  if (picked) {
    state.artistFilter = picked;
    router.navigate('/');
  }
}

// Show a simple picker for multiple artists
function showArtistPicker(artists) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 300px;">
        <h3>Select Artist</h3>
        <div class="artist-picker-list">
          ${artists.map(a => `
            <button class="artist-picker-item" data-artist="${a}">${a}</button>
          `).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </div>
    `;

    modal.querySelectorAll('.artist-picker-item').forEach(btn => {
      btn.onclick = () => {
        modal.remove();
        resolve(btn.dataset.artist);
      };
    });

    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
        resolve(null);
      }
    };

    document.body.appendChild(modal);
  });
}

// Open artist selector modal
async function openArtistSelector(mangaId) {
  artistSelectorMangaId = mangaId;

  const modal = document.getElementById('artist-modal');
  if (!modal) return;

  modal.classList.add('active');

  // Load artists
  try {
    const result = await API.getArtists();
    allArtists = result.artists || [];

    // Get current manga artists
    const manga = state.currentManga || state.bookmarks.find(b => b.id === mangaId);
    const currentArtists = manga?.artists || [];

    renderArtistList(allArtists, currentArtists);
    renderCurrentArtists(currentArtists);

    // Focus search input
    const input = document.getElementById('artist-search-input');
    if (input) {
      input.value = '';
      input.focus();
    }
  } catch (error) {
    showToast('Failed to load artists', 'error');
  }
}

// Render artist list in modal
function renderArtistList(artists, currentArtists = []) {
  const list = document.getElementById('artist-list');
  if (!list) return;

  if (artists.length === 0) {
    list.innerHTML = '<div class="artist-no-results">No artists found. Type a name and click Add to create one.</div>';
    return;
  }

  list.innerHTML = artists.map(artist => {
    const isSelected = currentArtists.includes(artist.name);
    return `
      <div class="artist-list-item ${isSelected ? 'selected' : ''}" 
           onclick="toggleArtistSelection('${artist.name.replace(/'/g, "\\'")}', ${artist.id})"
           data-artist-id="${artist.id}"
           data-artist-name="${artist.name}">
        <span class="artist-name">${artist.name}</span>
        <span class="artist-count">${artist.bookmarkCount || 0}</span>
      </div>
    `;
  }).join('');
}

// Render current artists for the manga
function renderCurrentArtists(artists) {
  const container = document.getElementById('artist-current');
  if (!container) return;

  if (artists.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `
    <div class="artist-current-title">Current Artists:</div>
    <div class="artist-current-tags">
      ${artists.map(name => `
        <span class="artist-current-tag">
          ${name}
          <span class="remove-x" onclick="removeArtistFromManga('${name.replace(/'/g, "\\'")}')">×</span>
        </span>
      `).join('')}
    </div>
  `;
}

// Filter artist list based on search
function filterArtistList() {
  const input = document.getElementById('artist-search-input');
  const addBtn = document.getElementById('artist-add-btn');
  const query = (input?.value || '').toLowerCase().trim();

  const manga = state.currentManga || state.bookmarks.find(b => b.id === artistSelectorMangaId);
  const currentArtists = manga?.artists || [];

  const filtered = allArtists.filter(a => a.name.toLowerCase().includes(query));
  renderArtistList(filtered, currentArtists);

  // Show add button if query doesn't match any existing artist exactly
  const exactMatch = allArtists.some(a => a.name.toLowerCase() === query);
  if (addBtn) {
    addBtn.style.display = (query && !exactMatch) ? 'block' : 'none';
  }
}

// Add new artist from search input
async function addNewArtistFromSearch() {
  const input = document.getElementById('artist-search-input');
  const name = (input?.value || '').trim();
  if (!name) return;

  try {
    // Create artist and add to current manga
    await API.addArtistToBookmark(artistSelectorMangaId, name);

    // Refresh artist list
    const result = await API.getArtists();
    allArtists = result.artists || [];

    // Update manga state
    const manga = state.currentManga || state.bookmarks.find(b => b.id === artistSelectorMangaId);
    if (manga) {
      if (!manga.artists) manga.artists = [];
      if (!manga.artists.includes(name)) {
        manga.artists.push(name);
      }
    }

    // Re-render
    renderArtistList(allArtists, manga?.artists || []);
    renderCurrentArtists(manga?.artists || []);
    refreshArtistCard();

    // Clear input
    input.value = '';
    document.getElementById('artist-add-btn').style.display = 'none';

    showToast(`Added artist: ${name}`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Toggle artist selection
async function toggleArtistSelection(artistName, artistId) {
  const manga = state.currentManga || state.bookmarks.find(b => b.id === artistSelectorMangaId);
  if (!manga) return;

  const currentArtists = manga.artists || [];
  const isSelected = currentArtists.includes(artistName);

  try {
    if (isSelected) {
      // Remove artist
      await API.removeArtistFromBookmark(artistSelectorMangaId, artistId);
      manga.artists = currentArtists.filter(a => a !== artistName);
    } else {
      // Add artist
      await API.addArtistToBookmark(artistSelectorMangaId, artistName);
      if (!manga.artists) manga.artists = [];
      manga.artists.push(artistName);
    }

    // Re-render list and current
    renderArtistList(allArtists, manga.artists);
    renderCurrentArtists(manga.artists);
    refreshArtistCard();

    showToast(isSelected ? `Removed: ${artistName}` : `Added: ${artistName}`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Remove artist from current manga
async function removeArtistFromManga(artistName) {
  const manga = state.currentManga || state.bookmarks.find(b => b.id === artistSelectorMangaId);
  if (!manga) return;

  const artist = allArtists.find(a => a.name === artistName);
  if (!artist) return;

  try {
    await API.removeArtistFromBookmark(artistSelectorMangaId, artist.id);
    manga.artists = (manga.artists || []).filter(a => a !== artistName);

    renderArtistList(allArtists, manga.artists);
    renderCurrentArtists(manga.artists);
    refreshArtistCard();

    showToast(`Removed: ${artistName}`, 'success');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Refresh artist badge in manga detail
function refreshArtistCard() {
  const manga = state.currentManga || state.bookmarks.find(b => b.id === artistSelectorMangaId);
  if (!manga) return;

  const badge = document.getElementById(`artist-badge-${artistSelectorMangaId}`);
  if (badge) {
    const artists = manga.artists || [];
    const hasArtists = artists.length > 0;
    badge.innerHTML = `🎨 ${hasArtists ? artists.join(', ') : '+'}`;
  }
}

// Long press handler for artist badge
function setupArtistCardLongPress() {
  document.addEventListener('pointerdown', (e) => {
    const badge = e.target.closest('.artist-badge');
    if (!badge) return;

    const mangaId = badge.dataset.mangaId;
    if (!mangaId) return;

    let longPressTimer = setTimeout(() => {
      e.preventDefault();
      openArtistSelector(mangaId);
    }, 500);

    const cleanup = () => {
      clearTimeout(longPressTimer);
      document.removeEventListener('pointerup', cleanup);
      document.removeEventListener('pointercancel', cleanup);
      document.removeEventListener('pointermove', cleanup);
    };

    document.addEventListener('pointerup', cleanup);
    document.addEventListener('pointercancel', cleanup);
    document.addEventListener('pointermove', cleanup);
  });
}

// Initialize artist long press
setupArtistCardLongPress();

// Read counter badge for single-chapter manga
// Click to increase, long-press to decrease (not below 1)
function setupReadCounterBadge() {
  let isProcessing = false;

  document.addEventListener('pointerdown', (e) => {
    const badge = e.target.closest('.read-counter-badge');
    if (!badge || isProcessing) return;

    const mangaId = badge.dataset.mangaId;
    if (!mangaId) return;

    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    let isLongPress = false;
    let longPressTimer = setTimeout(() => {
      isLongPress = true;
      longPressTimer = null;
      // Visual feedback for long press
      badge.style.opacity = '0.6';
    }, 500);

    const handleMove = (ev) => {
      // Only cancel if moved more than 10px
      const dx = Math.abs(ev.clientX - startX);
      const dy = Math.abs(ev.clientY - startY);
      if (dx > 10 || dy > 10) {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
        badge.style.opacity = '';
        document.removeEventListener('pointerup', handleUp);
        document.removeEventListener('pointercancel', handleUp);
        document.removeEventListener('pointermove', handleMove);
      }
    };

    const handleUp = async (ev) => {
      document.removeEventListener('pointerup', handleUp);
      document.removeEventListener('pointercancel', handleUp);
      document.removeEventListener('pointermove', handleMove);

      badge.style.opacity = '';

      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      if (ev.type !== 'pointerup' || isProcessing) return;

      isProcessing = true;
      try {
        // Parse current count from badge text
        const currentText = badge.textContent.trim();
        const currentCount = parseInt(currentText) || 1;

        if (isLongPress) {
          // Long press - decrease read count (not below 1)
          if (currentCount > 1) {
            const newCount = currentCount - 1;
            const newReadChapters = Array.from({ length: newCount }, (_, i) => i + 1);
            await API.updateBookmark(mangaId, { readChapters: newReadChapters });
            badge.textContent = `${newCount} Read`;
            showToast(`Read count: ${newCount}`, 'success');
          } else {
            showToast('Cannot decrease below 1', 'warning');
          }
        } else {
          // Short click - increase read count
          const newCount = currentCount + 1;
          const newReadChapters = Array.from({ length: newCount }, (_, i) => i + 1);
          await API.updateBookmark(mangaId, { readChapters: newReadChapters });
          badge.textContent = `${newCount} Read`;
          showToast(`Read count: ${newCount}`, 'success');
        }
      } catch (error) {
        showToast(error.message, 'error');
      }
      isProcessing = false;
    };

    document.addEventListener('pointerup', handleUp);
    document.addEventListener('pointercancel', handleUp);
    document.addEventListener('pointermove', handleMove);
  });
}

// Initialize read counter badge
setupReadCounterBadge();

// Start app
init();

// --- Volume Grouping Functions ---

function updateMangaDetailView() {
  const app = document.getElementById('app');
  if (state.currentManga) {
    app.innerHTML = renderMangaDetail(state.currentManga, state.categories, state.chapterListPage, state.selectionMode);

    // Re-initialize any dynamic elements (covers, etc if needed)
    checkForMultipleCovers(state.currentManga.id);
    loadVersionDetails(state.currentManga.id);
    checkForCbzFiles(state.currentManga.id);
    checkForMissingCover(state.currentManga.id);
  }
}

function toggleSelectionMode() {
  state.selectionMode.active = !state.selectionMode.active;
  // Clear selection when deactivating
  if (!state.selectionMode.active) {
    state.selectionMode.selected.clear();
  }
  updateMangaDetailView();
}

function toggleChapterSelection(chapterNum, checked) {
  if (checked) {
    state.selectionMode.selected.add(chapterNum);
  } else {
    state.selectionMode.selected.delete(chapterNum);
  }

  // Re-render button state (enable/disable create volume)
  // We can optimize this by just updating the button, but re-render is safer for now
  const createBtn = document.querySelector('button[onclick^="createVolumeFromSelection"]');
  if (createBtn) {
    createBtn.disabled = state.selectionMode.selected.size === 0;
    createBtn.textContent = `Create Volume (${state.selectionMode.selected.size})`;
  }
}

async function createVolumeFromSelection(mangaId) {
  if (state.selectionMode.selected.size === 0) return;

  const name = prompt('Enter a name for this volume (e.g. "Volume 1"):');
  if (!name) return;

  const chapters = Array.from(state.selectionMode.selected).sort((a, b) => a - b);

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/volumes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, chapters })
    });

    if (response.ok) {
      showToast('Volume created successfully', 'success');
      // Refresh manga data
      state.currentManga = await API.getBookmark(mangaId);
      state.selectionMode.active = false;
      state.selectionMode.selected.clear();
      updateMangaDetailView();
    } else {
      const err = await response.json();
      showToast('Failed to create volume: ' + err.error, 'error');
    }
  } catch (e) {
    showToast('Error creating volume: ' + e.message, 'error');
  }
}

async function deleteVolume(mangaId, volumeId) {
  if (!confirm('Are you sure you want to ungroup this volume? The chapters will remain.')) return;

  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/volumes/${volumeId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showToast('Volume deleted', 'success');
      state.currentManga = await API.getBookmark(mangaId);
      updateMangaDetailView();
    } else {
      const err = await response.json();
      showToast('Failed to delete volume: ' + err.error, 'error');
    }
  } catch (e) {
    showToast('Error deleting volume: ' + e.message, 'error');
  }
}

// Edit volume modal (rename + reorder)
function openVolumeEditModal(mangaId, volumeId, currentName) {
  const modalHtml = `
    <div class="modal-overlay" id="volume-edit-modal" onclick="closeVolumeEditModal(event)" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1100;">
      <div class="modal-content" onclick="event.stopPropagation()" style="background:#1e1e1e; border-radius:8px; width:90%; max-width: 400px; padding:20px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div class="modal-header" style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">Edit Volume</h3>
          <button class="btn-icon" onclick="closeVolumeEditModal()">✕</button>
        </div>
        
        <div class="modal-body">
          <div style="margin-bottom: 20px;">
            <label style="display:block; margin-bottom:8px; font-weight:500;">Volume Name</label>
            <input type="text" id="volume-name-input" value="${currentName}" style="width:100%; padding:8px; background:#2a2a2a; border:1px solid #444; border-radius:4px; color:white;">
          </div>
          
          <div style="margin-bottom: 20px;">
            <label style="display:block; margin-bottom:8px; font-weight:500;">Reorder</label>
            <div style="display:flex; gap:10px;">
              <button class="btn btn-secondary" onclick="reorderVolume('${mangaId}', '${volumeId}', 'up'); closeVolumeEditModal();" style="flex:1;">
                ↑ Move Up
              </button>
              <button class="btn btn-secondary" onclick="reorderVolume('${mangaId}', '${volumeId}', 'down'); closeVolumeEditModal();" style="flex:1;">
                ↓ Move Down
              </button>
            </div>
          </div>
          
          <div style="display:flex; gap:10px; justify-content:flex-end;">
            <button class="btn btn-secondary" onclick="closeVolumeEditModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveVolumeName('${mangaId}', '${volumeId}')">Save</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove existing if any
  const existing = document.getElementById('volume-edit-modal');
  if (existing) existing.remove();

  const temp = document.createElement('div');
  temp.innerHTML = modalHtml;
  document.body.appendChild(temp.firstElementChild);

  // Focus the input
  setTimeout(() => {
    const input = document.getElementById('volume-name-input');
    if (input) {
      input.focus();
      input.select();
    }
  }, 100);
}

function closeVolumeEditModal(event) {
  if (event && event.target.id !== 'volume-edit-modal') return;
  const modal = document.getElementById('volume-edit-modal');
  if (modal) modal.remove();
}

function saveVolumeName(mangaId, volumeId) {
  const input = document.getElementById('volume-name-input');
  const newName = input?.value?.trim();
  if (newName && newName !== input.defaultValue) {
    renameVolume(mangaId, volumeId, newName);
  }
  closeVolumeEditModal();
}

// Rename volume (old function, kept for compatibility)
function openRenameVolumeModal(mangaId, volumeId, currentName) {
  openVolumeEditModal(mangaId, volumeId, currentName);
}

async function renameVolume(mangaId, volumeId, newName) {
  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/volumes/${volumeId}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName })
    });

    if (response.ok) {
      showToast('Volume renamed', 'success');
      state.currentManga = await API.getBookmark(mangaId);
      updateMangaDetailView();
    } else {
      const err = await response.json();
      showToast('Failed to rename volume: ' + err.error, 'error');
    }
  } catch (e) {
    showToast('Error renaming volume: ' + e.message, 'error');
  }
}

// Reorder volume
async function reorderVolume(mangaId, volumeId, direction) {
  try {
    const response = await fetch(`/api/bookmarks/${mangaId}/volumes/${volumeId}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ direction })
    });

    if (response.ok) {
      state.currentManga = await API.getBookmark(mangaId);
      updateMangaDetailView();
    } else {
      const err = await response.json();
      showToast('Failed to reorder volume: ' + err.error, 'error');
    }
  } catch (e) {
    showToast('Error reordering volume: ' + e.message, 'error');
  }
}


function viewVolume(mangaId, volumeId) {
  const manga = state.currentManga;
  if (!manga) return;
  const vol = manga.volumes.find(v => v.id === volumeId);
  if (!vol) return;

  // Render a simple modal with chapter list
  const chaptersHtml = vol.chapters.sort((a, b) => a - b).map(num => {
    const ch = manga.chapters.find(c => c.number === num);
    const isDownloaded = manga.downloadedChapters.includes(num);
    const isRead = manga.readChapters.includes(num);
    const progress = manga.readingProgress ? manga.readingProgress[num] : null;

    // Page count logic
    let pageCount = 0;
    if (manga.downloadedPageCounts && manga.downloadedPageCounts[num]) {
      pageCount = manga.downloadedPageCounts[num];
    } else if (progress && progress.totalPages) {
      pageCount = progress.totalPages;
    }
    const pageCountText = pageCount > 0 ? `<span style="font-size:0.8em; color:#aaa; margin-left:10px;">(${pageCount} pgs)</span>` : '';

    const progressText = progress && progress.page < progress.totalPages
      ? `<span style="font-size:0.8em; color:#aaa; margin-left:10px;">(Pg ${progress.page}/${progress.totalPages})</span>`
      : '';

    const isExtra = !Number.isInteger(num);
    const extraBadge = isExtra ? `<span class="chapter-tag" style="margin-left:8px;">EXTRA</span>` : '';

    return `
      <div class="chapter-item ${isRead ? 'read' : ''}" 
           onclick="closeVolumeModal(); readManga('${mangaId}', '${num}')" 
           style="cursor:pointer; padding: 12px; border-bottom: 1px solid #333; display:flex; justify-content:space-between; align-items:center;">
        <div style="flex-grow:1; display:flex; align-items:center;">
          <span style="font-weight:bold; margin-right:10px; min-width:60px;">Ch. ${num}</span>
          <span style="opacity:0.8;">${ch ? ch.title : ''}</span>
          ${pageCountText}
          ${progressText}
          ${extraBadge}
        </div>
        <div style="display:flex; gap:10px;">
          ${isDownloaded ? '<span title="Downloaded">💾</span>' : ''}
          ${isRead
        ? `<span title="Mark Unread" onclick="event.stopPropagation(); toggleChapterRead('${mangaId}', ${num}, false)">👁️</span>`
        : `<span title="Mark Read" onclick="event.stopPropagation(); toggleChapterRead('${mangaId}', ${num}, true)" style="opacity:0.3;">○</span>`}
        </div>
      </div>
    `;
  }).join('');

  const modalHtml = `
    <div class="modal-overlay" id="volume-modal" onclick="closeVolumeModal(event)" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1000;">
      <div class="modal-content" onclick="event.stopPropagation()" style="background:#1e1e1e; border-radius:8px; width:90%; max-width: 600px; max-height: 80vh; display:flex; flex-direction:column; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div class="modal-header" style="padding: 15px; border-bottom: 1px solid #333; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:1.2em;">${vol.name}</h3>
          <button class="btn-icon" onclick="closeVolumeModal()" style="font-size:1.2em; cursor:pointer; background:none; border:none; color:white;">✕</button>
        </div>
        <div class="modal-body" style="padding: 0; overflow-y:auto; flex-grow:1;">
          <div class="volume-chapter-list">
            ${chaptersHtml}
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove existing if any
  const existing = document.getElementById('volume-modal');
  if (existing) existing.remove();

  const temp = document.createElement('div');
  temp.innerHTML = modalHtml;
  document.body.appendChild(temp.firstElementChild);
}

function closeVolumeModal(event) {
  if (event && event.target.id !== 'volume-modal' && !event.target.closest('.btn-icon')) return;
  const modal = document.getElementById('volume-modal');
  if (modal) modal.remove();
}

// Open Volume Cover Modal
function openVolumeCoverSelector(mangaId, volumeId) {
  const manga = state.currentManga;
  const vol = manga.volumes.find(v => v.id === volumeId);
  if (!vol) return;

  const modalHtml = `
    <div class="modal-overlay" id="cover-modal" onclick="closeCoverModal(event)" style="display:flex; align-items:center; justify-content:center; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:1100;">
      <div class="modal-content" onclick="event.stopPropagation()" style="background:#1e1e1e; border-radius:8px; width:90%; max-width: 500px; padding:20px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div class="modal-header" style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0;">Set Volume Cover</h3>
          <button class="btn-icon" onclick="closeCoverModal()">✕</button>
        </div>
        
        <div class="modal-body">
          <div style="margin-bottom: 20px;">
            <label style="display:block; margin-bottom:10px; font-weight:bold;">Option 1: Upload Image</label>
            <input type="file" id="cover-upload-input" accept="image/*" style="width:100%">
          </div>

          <div style="border-top:1px solid #333; margin: 20px 0;"></div>

          <div>
            <label style="display:block; margin-bottom:10px; font-weight:bold;">Option 2: Select from Chapter</label>
            <div class="chapter-list-scroll" style="max-height: 200px; overflow-y: auto; border: 1px solid #333; border-radius: 4px;">
              ${vol.chapters.sort((a, b) => a - b).map(num => `
                <div class="chapter-item" onclick="setCoverFromChapter('${mangaId}', '${volumeId}', ${num})" style="padding:10px; cursor:pointer; border-bottom:1px solid #333;">
                  Ch. ${num}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Remove existing
  const existing = document.getElementById('cover-modal');
  if (existing) existing.remove();

  const temp = document.createElement('div');
  temp.innerHTML = modalHtml;
  document.body.appendChild(temp.firstElementChild);

  // Bind file input
  document.getElementById('cover-upload-input').onchange = (e) => handleCoverUpload(e, mangaId, volumeId);
}

function closeCoverModal(event) {
  if (event && event.target.id !== 'cover-modal' && !event.target.closest('.btn-icon')) return;
  const modal = document.getElementById('cover-modal');
  if (modal) modal.remove();
}

async function handleCoverUpload(e, mangaId, volumeId) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('cover', file);

  try {
    showToast('Uploading cover...', 'info');
    const response = await fetch(`/api/bookmarks/${mangaId}/volumes/${volumeId}/cover`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      showToast('Volume cover updated', 'success');
      closeCoverModal();
      state.currentManga = await API.getBookmark(mangaId);
      updateMangaDetailView();
    } else {
      const err = await response.json();
      showToast('Failed to upload cover: ' + (err.error || 'Unknown error'), 'error');
    }
  } catch (error) {
    showToast('Error uploading cover: ' + error.message, 'error');
  }
}

async function setCoverFromChapter(mangaId, volumeId, chapterNumber) {
  try {
    showToast(`Loading images for Chapter ${chapterNumber}...`, 'info');
    const result = await API.getChapterImages(mangaId, chapterNumber);
    const images = Array.isArray(result) ? result : (result.images || []);

    if (!images || images.length === 0) {
      showToast('No images found or chapter not downloaded.', 'warning');
      return;
    }

    // Update Modal Content with Grid
    const modalBody = document.querySelector('#cover-modal .modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
            <div style="margin-bottom:10px; display:flex; align-items:center;">
                <button class="btn btn-secondary btn-small" onclick="openVolumeCoverSelector('${mangaId}', '${volumeId}')">← Back</button>
                <span style="font-weight:bold; margin-left:10px;">Select Page (Ch. ${chapterNumber})</span>
            </div>
            <div class="cover-grid-selection" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:10px; max-height:400px; overflow-y:auto; padding-right:5px;">
                ${images.map(img => {
      // Handle both string URLs (legacy/simple) and object structure ({ url: '...' })
      const imgUrl = typeof img === 'string' ? img : img.url;
      return `
                    <div class="cover-selection-item" onclick="setCoverFromImage('${mangaId}', '${volumeId}', ${chapterNumber}, '${encodeURIComponent(imgUrl)}')" style="cursor:pointer; border:1px solid #333; border-radius:4px; overflow:hidden; transition: transform 0.1s;">
                        <img src="${imgUrl}" style="width:100%; height:140px; object-fit:cover;" loading="lazy">
                    </div>
                    `;
    }).join('')}
            </div>
        `;
  } catch (e) {
    showToast('Error loading images: ' + e.message, 'error');
  }
}

async function setCoverFromImage(mangaId, volumeId, chapterNumber, encodedUrl) {
  const url = decodeURIComponent(encodedUrl);
  // Extract filename from URL (e.g. /downloads/.../01.jpg -> 01.jpg)
  const filename = url.split('/').pop();

  try {
    showToast(`Setting cover...`, 'info');
    const response = await fetch(`/api/bookmarks/${mangaId}/volumes/${volumeId}/cover/from-chapter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterNumber, filename })
    });

    if (response.ok) {
      showToast('Volume cover updated', 'success');
      closeCoverModal();
      state.currentManga = await API.getBookmark(mangaId);
      updateMangaDetailView();
    } else {
      const text = await response.text();
      try {
        const err = JSON.parse(text);
        showToast('Failed to set cover: ' + (err.error || 'Unknown error'), 'error');
      } catch (e) {
        console.error('Server response:', text);
        showToast('Server error (check console): ' + text.substring(0, 50), 'error');
      }
    }
  } catch (error) {
    showToast('Error setting cover: ' + error.message, 'error');
  }
}
