// UI Components

function showToast(message, type = 'info') {
  // Suppress toasts on mobile when in reader mode
  const isMobile = window.matchMedia('(max-width: 768px) and (pointer: coarse)').matches;
  if (isMobile && document.body.classList.contains('reader-active')) {
    return;
  }

  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Build spread map for manga mode - accounts for firstPageSingle, lastPageSingle, and trophy pages
// Returns array of spreads, each spread has { pages: [pageIndex, ...] }
// trophyInfo is an object: { pageIndex: { isSingle: bool, pages: [indices] } }
// firstPageSingle applies to the first NON-TROPHY page(s), not absolute page 0
// lastPageSingle makes the last page display alone (for pairing with next chapter)
function buildSpreadMap(totalPages, firstPageSingle, trophyInfo = {}, lastPageSingle = false) {
  const spreads = [];
  let pageIdx = 0;
  const processedTrophyPages = new Set(); // Track pages already handled as part of a trophy spread
  let appliedFirstPageRule = false; // Track if we've applied the firstPageSingle rule
  const lastPage = totalPages - 1;

  while (pageIdx < totalPages) {
    // Skip if already processed as part of a trophy double
    if (processedTrophyPages.has(pageIdx)) {
      pageIdx++;
      continue;
    }

    // Check if this page is a trophy
    const trophyData = trophyInfo[pageIdx];
    if (trophyData) {
      if (trophyData.isSingle) {
        // Trophy marked as single - show alone
        spreads.push({ pages: [pageIdx] });
        pageIdx++;
      } else {
        // Trophy marked as double - show with its paired page
        const pairedPages = trophyData.pages || [pageIdx];
        spreads.push({ pages: [...pairedPages] });
        // Mark all pages in this spread as processed
        pairedPages.forEach(p => processedTrophyPages.add(p));
        pageIdx = Math.max(...pairedPages) + 1;
      }
      continue;
    }

    // First non-trophy page - apply firstPageSingle rule
    if (!appliedFirstPageRule) {
      appliedFirstPageRule = true;
      if (firstPageSingle) {
        // Show first non-trophy page alone
        spreads.push({ pages: [pageIdx] });
        pageIdx++;
        continue;
      }
      // If not firstPageSingle, fall through to normal pairing logic
    }

    // Check if next page is a trophy (can't pair with it if it's single)
    const nextTrophy = trophyInfo[pageIdx + 1];
    if (pageIdx + 1 < totalPages && nextTrophy && nextTrophy.isSingle) {
      spreads.push({ pages: [pageIdx] });
      pageIdx++;
      continue;
    }

    // Check if next page is part of a double trophy (skip it for pairing)
    if (pageIdx + 1 < totalPages && nextTrophy && !nextTrophy.isSingle) {
      spreads.push({ pages: [pageIdx] });
      pageIdx++;
      continue;
    }

    // If lastPageSingle is enabled and next page is the last page, don't pair with it
    if (lastPageSingle && pageIdx + 1 === lastPage) {
      spreads.push({ pages: [pageIdx] });
      pageIdx++;
      continue;
    }

    // Normal pair
    if (pageIdx + 1 < totalPages) {
      spreads.push({ pages: [pageIdx, pageIdx + 1] });
      pageIdx += 2;
    } else {
      // Last odd page (or lastPageSingle enabled)
      spreads.push({ pages: [pageIdx] });
      pageIdx++;
    }
  }

  return spreads;
}

// Header component
function renderHeader(viewMode = 'manga') {
  return `
    <header>
      <div class="header-content">
        <a href="#/" class="logo">📚 Manga<span>Scraper</span></a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${viewMode === 'manga' ? 'active' : ''}" onclick="setViewMode('manga')" title="Manga view">📚</button>
            <button class="view-toggle-btn ${viewMode === 'series' ? 'active' : ''}" onclick="setViewMode('series')" title="Series view">📖</button>
          </div>
          <button class="btn btn-secondary" onclick="openFavoritesViewer()" title="View favorites">⭐ Favorites</button>
          <button class="btn btn-secondary" onclick="scanAllLocal()" title="Scan downloads folder">📁 Scan Folder</button>
          <button class="btn btn-secondary" onclick="quickCheckAllUpdates()" title="Quick check first page for updates">⚡ Quick Check</button>
          <button class="btn btn-secondary" onclick="checkAllUpdates()" title="Full update check (all pages)">🔍 Full Check</button>
          <button class="btn btn-primary" onclick="openAddModal()" title="Add manga">+ Add Manga</button>
        </div>
        <button class="hamburger-btn mobile-only" onclick="toggleMobileMenu()" title="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${viewMode === 'manga' ? 'active' : ''}" onclick="setViewMode('manga'); closeMobileMenu();">📚 Manga</button>
          <button class="view-toggle-btn ${viewMode === 'series' ? 'active' : ''}" onclick="setViewMode('series'); closeMobileMenu();">📖 Series</button>
        </div>
        <button class="mobile-menu-item" onclick="openFavoritesViewer(); closeMobileMenu();">⭐ Favorites</button>
        <button class="mobile-menu-item" onclick="scanAllLocal(); closeMobileMenu();">📁 Scan Folder</button>
        <button class="mobile-menu-item" onclick="quickCheckAllUpdates(); closeMobileMenu();">⚡ Quick Check</button>
        <button class="mobile-menu-item" onclick="checkAllUpdates(); closeMobileMenu();">🔍 Full Check</button>
        <button class="mobile-menu-item primary" onclick="openAddModal(); closeMobileMenu();">+ Add Manga</button>
      </div>
    </header>
  `;
}

// Library view (grid of manga cards)
function renderLibrary(bookmarks, categories = [], activeCategory = null, artistFilter = null, viewMode = 'manga', series = []) {
  // Filter bookmarks by category if one is selected
  let filteredBookmarks = activeCategory
    ? bookmarks.filter(m => (m.categories || []).includes(activeCategory))
    : bookmarks;

  // Filter by artist if one is selected
  if (artistFilter) {
    filteredBookmarks = filteredBookmarks.filter(m =>
      (m.artists || []).includes(artistFilter)
    );
  }

  // Manga cards
  const mangaCards = filteredBookmarks.map(manga => {
    const displayName = manga.alias || manga.title;
    const downloadedCount = manga.downloadedChapters?.length || 0;
    const totalCount = manga.uniqueChapters || manga.totalChapters || 0;
    const readCount = manga.readChapters?.length || 0;
    const hasUpdates = (manga.updatedChapters || []).length > 0;

    // Use local cover API endpoint if available, fallback to remote
    const coverUrl = manga.localCover
      ? `/api/bookmarks/${manga.id}/covers/${encodeURIComponent(manga.localCover.split(/[/\\]/).pop())}`
      : manga.cover;

    // For local-only sources, show different badges
    const isLocal = manga.source === 'local';
    const folderCount = manga.folderChapters || 0;
    const cbzCount = manga.cbzChapters || 0;

    return `
      <div class="manga-card" onclick="router.navigate('/manga/${manga.id}')">
        <div class="manga-card-cover">
          ${coverUrl
        ? `<img src="${coverUrl}" alt="${displayName}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`
        : `<div class="placeholder">${isLocal ? '💾' : '📚'}</div>`
      }
          <div class="manga-card-badges">
            ${isLocal ? `
              ${readCount > 0 ? `<span class="badge badge-read" title="Read chapters">📖${readCount}</span>` : ''}
              ${folderCount > 0 ? `<span class="badge badge-folders" title="Chapter folders">📁${folderCount}</span>` : ''}
              ${cbzCount > 0 ? `<span class="badge badge-cbz" title="CBZ files">📦${cbzCount}</span>` : ''}
            ` : `
              ${readCount > 0 ? `<span class="badge badge-read" title="Read chapters">${readCount}</span>` : ''}
              <span class="badge badge-chapters" title="Total chapters">${totalCount}</span>
              ${downloadedCount > 0 ? `<span class="badge badge-downloaded" title="Downloaded">${downloadedCount}</span>` : ''}
              ${hasUpdates ? `<span class="badge badge-warning" title="Updated chapters detected">!</span>` : ''}
            `}
          </div>
        </div>
        <div class="manga-card-title">${displayName}</div>
      </div>
    `;
  }).join('');

  // Category filter FAB (bottom left)
  const categoryFab = `
    <div class="category-fab" id="category-fab">
      <button class="category-fab-btn ${activeCategory ? 'has-filter' : ''}" onclick="toggleCategoryMenu()" title="Filter by category">
        ${activeCategory ? activeCategory : '🏷️'}
      </button>
      <div class="category-fab-menu" id="category-fab-menu">
        <div class="category-fab-menu-header">
          <span>Filter by Category</span>
          <button class="btn-icon small" onclick="openCategoryManager()" title="Manage categories">⚙️</button>
        </div>
        <div class="category-fab-menu-items">
          <button class="category-menu-item ${!activeCategory ? 'active' : ''}" onclick="filterByCategory(null); toggleCategoryMenu();">All</button>
          ${categories.map(cat => `
            <button class="category-menu-item ${activeCategory === cat ? 'active' : ''}" onclick="filterByCategory('${cat.replace(/'/g, "\\'")}'); toggleCategoryMenu();">
              ${cat}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Artist filter indicator (if active)
  const artistFilterBadge = artistFilter ? `
    <div class="artist-filter-badge" onclick="clearArtistFilter()">
      <span class="artist-filter-icon">🎨</span>
      <span class="artist-filter-name">${artistFilter}</span>
      <span class="artist-filter-clear">×</span>
    </div>
  ` : '';

  // Series cards
  const seriesCards = series.map(s => {
    const displayName = s.alias || s.title;
    // Construct proper cover URL using API endpoint
    const coverUrl = s.cover && s.coverBookmarkId
      ? `/api/bookmarks/${s.coverBookmarkId}/covers/${encodeURIComponent(s.cover.split(/[/\\]/).pop())}`
      : s.cover;
    return `
      <div class="manga-card series-card" onclick="router.navigate('/series/${s.id}')">
        <div class="manga-card-cover">
          ${coverUrl
        ? `<img src="${coverUrl}" alt="${displayName}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📖</div>'">`
        : `<div class="placeholder">📖</div>`
      }
          <div class="manga-card-badges">
            <span class="badge badge-series" title="Stories in series">${s.entry_count || 0} stories</span>
            <span class="badge badge-chapters" title="Total chapters">${s.total_chapters || 0}</span>
          </div>
        </div>
        <div class="manga-card-title">${displayName}</div>
      </div>
    `;
  }).join('');

  // Choose which cards to show
  const cards = viewMode === 'series' ? seriesCards : mangaCards;
  const emptyMessage = viewMode === 'series'
    ? `<div class="empty-state" style="grid-column: 1/-1;"><h2>No series created</h2><p>Create a series to group related manga together!</p><button class="btn btn-primary" onclick="openCreateSeriesModal()">+ Create Series</button></div>`
    : `<div class="empty-state" style="grid-column: 1/-1;"><h2>No manga in your library</h2><p>Click "Add Manga" to get started!</p></div>`;

  // Series action FAB (only in series view)
  const seriesActionFab = viewMode === 'series' ? `
    <div class="series-fab">
      <button class="btn btn-primary" onclick="openCreateSeriesModal()" title="Create new series">+ New Series</button>
    </div>
  ` : '';

  return `
    ${renderHeader(viewMode)}
    <div class="container">
      ${artistFilterBadge}
      <div class="library-grid" id="library-grid">
        ${cards || emptyMessage}
      </div>
    </div>
    ${renderAddModal()}
    ${renderCategoryManagerModal(categories)}
    ${categoryFab}
    ${seriesActionFab}
  `;
}

// Manga detail page
const CHAPTERS_PER_PAGE = 50;

function renderMangaDetail(manga, allCategories = [], currentPage = 0) {
  const displayName = manga.alias || manga.title;
  const chapters = manga.chapters || [];
  const downloadedChapters = manga.downloadedChapters || [];
  const downloadedVersions = manga.downloadedVersions || {};
  const deletedUrls = new Set(manga.deletedChapterUrls || []);
  const updatedChaptersMap = new Map((manga.updatedChapters || []).map(u => [u.number, u]));
  const newDuplicates = new Set(manga.newDuplicates || []);
  const readChapters = new Set(manga.readChapters || []);
  const readingProgress = manga.readingProgress || {};
  const excludedChaptersSet = new Set(manga.excludedChapters || []);

  // Filter out excluded chapters from the main list
  const visibleChapters = chapters.filter(c => !excludedChaptersSet.has(c.number));

  // Sort chapters ascending for pagination (page 1 = chapters 0-50)
  const sortedChaptersAsc = [...visibleChapters].sort((a, b) => a.number - b.number);

  // Detect chapter types
  const wholeChapters = visibleChapters.filter(c => Number.isInteger(c.number));
  const extraChapters = visibleChapters.filter(c => !Number.isInteger(c.number));

  // Get duplicates from manga data
  const duplicateChapters = manga.duplicateChapters || [];

  // Always calculate unique count from visible chapters (excludes excluded chapters)
  const uniqueCount = new Set(visibleChapters.map(c => c.number)).size;
  const totalCount = manga.totalChapters || uniqueCount;
  const downloadedCount = downloadedChapters.filter(n => !excludedChaptersSet.has(n)).length;
  const downloadedSet = new Set(downloadedChapters);

  // Count unread downloaded chapters (for "Start Reading" logic) - exclude excluded
  const unreadDownloaded = downloadedChapters.filter(n => !readChapters.has(n) && !excludedChaptersSet.has(n));

  // Count unread chapters that are NOT downloaded (for "Download Unread" button) - exclude excluded
  const unreadNotDownloaded = visibleChapters.filter(c => !readChapters.has(c.number) && !downloadedSet.has(c.number));

  // Group chapters by number for display
  const chapterGroups = new Map();
  sortedChaptersAsc.forEach(ch => {
    const key = ch.number;
    if (!chapterGroups.has(key)) {
      chapterGroups.set(key, []);
    }
    chapterGroups.get(key).push(ch);
  });

  // Pagination - apply to unique chapter groups (ascending order: page 1 = 0-50, page 2 = 51-100)
  const allChapterGroups = Array.from(chapterGroups.entries());
  const totalPages = Math.ceil(allChapterGroups.length / CHAPTERS_PER_PAGE);
  const startIdx = currentPage * CHAPTERS_PER_PAGE;
  const endIdx = Math.min(startIdx + CHAPTERS_PER_PAGE, allChapterGroups.length);
  const paginatedGroups = allChapterGroups.slice(startIdx, endIdx);

  // Sort the paginated groups descending for display (newest first within the page)
  const displayGroups = [...paginatedGroups].sort((a, b) => b[0] - a[0]);

  // Helper to check if a URL is downloaded (handles both old string and new array format)
  const isUrlDownloaded = (chapterNum, url) => {
    const versions = downloadedVersions[chapterNum];
    if (!versions) return false;
    if (typeof versions === 'string') return versions === url;
    if (Array.isArray(versions)) return versions.includes(url);
    return false;
  };

  const chapterItems = displayGroups.map(([num, versions]) => {
    const isDownloaded = downloadedChapters.includes(num);
    const isRead = readChapters.has(num);
    const progress = readingProgress[num];
    const isExtra = !Number.isInteger(num);

    // Count visible (non-hidden) versions only
    const visibleVersions = versions.filter(v => !deletedUrls.has(v.url));
    const hiddenVersions = versions.filter(v => deletedUrls.has(v.url));
    const hasHidden = hiddenVersions.length > 0;
    const hasDupes = visibleVersions.length > 1;
    const isDeleted = versions.every(v => deletedUrls.has(v.url));

    // Check if this is an updated/new duplicate chapter
    const updateInfo = updatedChaptersMap.get(num);
    const hasNewDuplicate = newDuplicates.has(num);
    const hasUpdate = updateInfo && isDownloaded; // Only show warning if we downloaded it

    // Find the longest title among versions
    const longestTitle = versions.reduce((longest, v) =>
      v.title.length > longest.length ? v.title : longest
      , '');
    const displayTitle = longestTitle !== `Chapter ${num}` && longestTitle !== `Ch. ${num}` ? longestTitle : '';

    const chapterClasses = [
      'chapter-item',
      isDownloaded ? 'downloaded' : '',
      isRead ? 'read' : '',
      isExtra ? 'extra' : '',
      isDeleted ? 'deleted' : '',
      hasUpdate ? 'has-update' : '',
      hasHidden ? 'has-hidden' : ''
    ].filter(Boolean).join(' ');

    // Progress indicator for partially read chapters
    const progressText = progress && !isRead ? ` (${progress.page}/${progress.totalPages})` : '';

    if (hasDupes) {
      // Build version rows for dropdown with downloaded indicator
      const versionRows = versions.map((v, i) => {
        const isThisDownloaded = isUrlDownloaded(num, v.url);
        const isHidden = deletedUrls.has(v.url);
        const isOldVersion = v.isOldVersion || v.urlChanged;
        const isLocalOnly = v.removedFromRemote;
        if (isHidden) return ''; // Don't show hidden versions

        // Determine label
        let label = `V${i + 1}`;
        let labelClass = '';
        if (isThisDownloaded) {
          label = '✓ DL';
          labelClass = 'ours';
        } else if (isOldVersion) {
          label = 'OLD';
          labelClass = 'old-version';
        } else if (isLocalOnly) {
          label = 'LOCAL';
          labelClass = 'local-only';
        }

        return `
          <div class="version-row ${isThisDownloaded ? 'downloaded' : ''} ${isOldVersion ? 'old-version' : ''} ${isLocalOnly ? 'local-only' : ''}" data-url="${encodeURIComponent(v.url)}" onclick="readManga('${manga.id}', ${v.number}, '${encodeURIComponent(v.url)}')">
            <span class="version-label ${labelClass}">${label}</span>
            <span class="version-title-text">${v.title}</span>
            <span class="version-pages"></span>
            <div class="version-btns">
              ${isThisDownloaded ? `
                <button class="btn-icon small danger" onclick="event.stopPropagation(); deleteDownloadedVersion('${manga.id}', ${v.number}, '${encodeURIComponent(v.url)}')" title="Delete from disk">🗑️</button>
              ` : isLocalOnly || isOldVersion ? `
                <span class="btn-icon small muted" title="Only available locally">💾</span>
              ` : `
                <button class="btn-icon small" onclick="event.stopPropagation(); downloadSpecificVersion('${manga.id}', ${v.number}, '${encodeURIComponent(v.url)}')" title="Download">↓</button>
              `}
              <button class="btn-icon small muted" onclick="event.stopPropagation(); hideChapterVersion('${manga.id}', ${v.number}, '${encodeURIComponent(v.url)}')" title="Hide from list">×</button>
            </div>
          </div>
        `;
      }).filter(Boolean).join('');

      return `
        <div class="chapter-group" data-chapter="${num}" data-type="${isExtra ? 'extra' : 'main'}">
          <div class="${chapterClasses}" onclick="toggleVersions(${num})">
            <span class="chapter-number">Chapter ${num}</span>
            <span class="chapter-title">${displayTitle}${hasHidden ? ' <span class="hidden-indicator" title="Has hidden versions">👁️‍🗨️</span>' : ''}</span>
            ${isExtra ? '<span class="chapter-tag">Extra</span>' : ''}
            <div class="chapter-actions">
              ${progressText ? `<span class="chapter-progress">${progressText}</span>` : ''}
              <button class="btn-icon small ${isRead ? 'success' : 'muted'}" 
                      onclick="event.stopPropagation(); toggleChapterRead('${manga.id}', ${num}, ${!isRead})"
                      oncontextmenu="event.preventDefault(); event.stopPropagation(); markAllReadBelow('${manga.id}', ${num}); return false;"
                      title="${isRead ? 'Mark unread' : 'Mark read'} (right-click: mark all below)">
                ${isRead ? '👁️' : '○'}
              </button>
              ${hasUpdate ? `
                <button class="btn-icon small warning" 
                        onclick="event.stopPropagation(); toggleVersions(${num})"
                        title="New version available">!</button>
              ` : ''}
              <button class="btn-icon small" onclick="event.stopPropagation(); toggleVersions(${num})" title="${visibleVersions.length} versions">
                ${visibleVersions.length} <span class="arrow" id="arrow-${num}">▶</span>
              </button>
              <button class="btn-icon small ${isDownloaded ? 'success' : ''}" 
                      onclick="event.stopPropagation(); downloadChapter('${manga.id}', ${num})"
                      title="${isDownloaded ? 'Downloaded' : 'Download all versions'}" data-chapter="${num}">
                ${isDownloaded ? '✓' : '↓'}
              </button>
            </div>
          </div>
          <div class="versions-dropdown" id="versions-${num}" style="display:none;">
            ${versionRows}
          </div>
        </div>
      `;
    } else {
      // Single visible version - use the first visible version, not necessarily versions[0]
      const ch = visibleVersions[0] || versions[0];
      return `
        <div class="chapter-group" data-chapter="${ch.number}" data-type="${isExtra ? 'extra' : 'main'}">
          <div class="${chapterClasses}" onclick="readManga('${manga.id}', ${ch.number})">
            <span class="chapter-number">Chapter ${ch.number}</span>
            <span class="chapter-title">${ch.title !== `Chapter ${ch.number}` ? ch.title : ''}${hasHidden ? ' <span class="hidden-indicator" title="Has hidden versions">👁️‍🗨️</span>' : ''}</span>
            ${isExtra ? '<span class="chapter-tag">Extra</span>' : ''}
            <div class="chapter-actions">
              ${progressText ? `<span class="chapter-progress">${progressText}</span>` : ''}
              <button class="btn-icon small ${isRead ? 'success' : 'muted'}" 
                      onclick="event.stopPropagation(); toggleChapterRead('${manga.id}', ${ch.number}, ${!isRead})"
                      oncontextmenu="event.preventDefault(); event.stopPropagation(); markAllReadBelow('${manga.id}', ${ch.number}); return false;"
                      title="${isRead ? 'Mark unread' : 'Mark read'} (right-click: mark all below)">
                ${isRead ? '👁️' : '○'}
              </button>
              ${isDownloaded ? `
                <button class="btn-icon small danger" 
                        onclick="event.stopPropagation(); deleteChapterDownload('${manga.id}', ${ch.number})"
                        title="Delete download">🗑️</button>
              ` : ''}
              <button class="btn-icon small ${isDownloaded ? 'success' : ''}" 
                      onclick="event.stopPropagation(); downloadChapter('${manga.id}', ${ch.number})"
                      title="${isDownloaded ? 'Downloaded' : 'Download'}" data-chapter="${ch.number}">
                ${isDownloaded ? '✓' : '↓'}
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }).join('');

  // Duplicate management section - show when we have downloaded chapters that have multiple versions on disk
  // Find downloaded chapters that are also duplicates (multiple versions exist)
  const downloadedDuplicates = [];
  for (const [num, versions] of chapterGroups) {
    if (versions.length > 1 && downloadedChapters.includes(num)) {
      // Count how many versions are downloaded
      const dlCount = versions.filter(v => isUrlDownloaded(num, v.url)).length;
      if (dlCount >= 2) {
        // Only show if 2+ versions are actually downloaded
        downloadedDuplicates.push({ number: num, versions, dlCount });
      }
    }
  }

  let duplicateSection = '';
  if (downloadedDuplicates.length > 0) {
    duplicateSection = `
      <div class="duplicate-manager">
        <div class="duplicate-header-bar" onclick="toggleDuplicateManager()">
          <span>📦 ${downloadedDuplicates.length} chapter(s) have multiple versions downloaded</span>
          <span class="expand-icon" id="dup-manager-icon">▼</span>
        </div>
        <div class="duplicate-content" id="duplicate-manager-content" style="display:none;">
          ${downloadedDuplicates.map(({ number, versions, dlCount }) => {
      // Only show versions that are actually downloaded
      const downloadedVersionsList = versions.filter(v => isUrlDownloaded(number, v.url));
      // Create URL params for compare
      const compareUrls = downloadedVersionsList.map(v => encodeURIComponent(v.url)).join(',');
      return `
              <div class="duplicate-group" id="dup-group-${number}">
                <div class="duplicate-group-header" onclick="toggleDuplicateGroup(${number})">
                  <strong>Chapter ${number}</strong> - ${dlCount} versions downloaded
                  <button class="btn btn-xs btn-secondary" onclick="event.stopPropagation(); openCompareView('${manga.id}', ${number}, '${compareUrls}')" title="Compare versions side by side">
                    ⚖️ Compare
                  </button>
                  <span class="expand-icon" id="dup-icon-${number}">▼</span>
                </div>
                <div class="duplicate-versions-list" id="dup-versions-${number}">
                  ${downloadedVersionsList.map((v, i) => {
        return `
                      <div class="duplicate-version-row downloaded" data-url="${encodeURIComponent(v.url)}">
                        <div class="version-info">
                          <span class="version-badge ours">✓ DL</span>
                          <span class="version-title">${v.title}</span>
                          <span class="version-pages"></span>
                        </div>
                        <div class="version-actions">
                          <button class="btn-icon small" onclick="readManga('${manga.id}', ${v.number}, '${encodeURIComponent(v.url)}')" title="Read">
                            👁️
                          </button>
                          <button class="btn-icon small danger" onclick="deleteChapterVersion('${manga.id}', ${v.number}, '${encodeURIComponent(v.url)}')" title="Delete from disk">
                            🗑️
                          </button>
                          <button class="btn-icon small muted" onclick="deleteAndHideVersion('${manga.id}', ${v.number}, '${encodeURIComponent(v.url)}')" title="Delete and hide">
                            ×
                          </button>
                        </div>
                      </div>
                    `;
      }).join('')}
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>
    `;
  }

  // Build cover URL - prefer local
  const coverUrl = manga.localCover
    ? `/api/bookmarks/${manga.id}/covers/${encodeURIComponent(manga.localCover.split(/[/\\]/).pop())}`
    : manga.cover;

  // Count undownloaded (excluding deleted and excluded)
  const undownloadedCount = visibleChapters.filter(c =>
    !downloadedChapters.includes(c.number) && !deletedUrls.has(c.url)
  ).length;

  return `
    ${renderHeader()}
    <div class="container">
      <div class="manga-detail">
        <div class="manga-detail-header">
          <div class="manga-detail-cover" id="manga-cover-container">
            <div class="cover-wrapper">
              ${coverUrl
      ? `<img src="${coverUrl}" alt="${displayName}" id="manga-cover-img">`
      : `<div class="placeholder" style="aspect-ratio:2/3;border-radius:12px;background:var(--bg-card);display:flex;align-items:center;justify-content:center;font-size:4rem;">📚</div>`
    }
              <button class="cover-change-btn" id="cover-change-btn" onclick="openCoverSelector('${manga.id}')" title="Change cover">
                🖼️
              </button>
            </div>
          </div>
          <div class="manga-detail-info">
            <h1>${displayName}</h1>
            ${manga.alias ? `<p style="color:var(--text-muted);margin-bottom:10px;">Original: ${manga.title}</p>` : ''}
            <div class="manga-detail-meta">
              <span class="meta-item accent">${manga.website || 'Local'}</span>
              <span class="meta-item" style="color:var(--accent)">${uniqueCount} Chapters</span>
              <span class="meta-item" style="color:var(--badge-downloaded)">${downloadedCount} Downloaded</span>
              ${uniqueCount === 1 && readChapters.size > 0 ? `
              <span class="meta-item read-counter-badge" data-manga-id="${manga.id}" title="Click +1, long-press -1">${readChapters.size} Read</span>
              ` : `
              <span class="meta-item" style="color:var(--text-muted)">${readChapters.size} Read</span>
              `}
              ${unreadDownloaded.length > 0 ? `<span class="meta-item" style="color:var(--warning)">${unreadDownloaded.length} Unread</span>` : ''}
              ${extraChapters.length > 0 ? `<span class="meta-item">${extraChapters.length} Extras</span>` : ''}
              ${renderArtistBadge(manga)}
              ${renderCategoryBadges(manga, allCategories)}
            </div>
            <div class="manga-detail-actions" id="manga-actions">
              <div class="primary-action-row">
                <button class="btn btn-primary" onclick="continueReading('${manga.id}')">
                  ▶ ${manga.lastReadChapter ? 'Continue' : 'Start'} Reading
                </button>
                <button class="btn btn-secondary more-actions-btn" onclick="toggleMobileActions()">▼</button>
              </div>
              <div class="more-actions">
              <button class="btn btn-secondary" onclick="openMangaFavorites('${manga.id}')">
                ⭐ View Favorites
              </button>
              ${manga.website !== 'Local' ? `
              <button class="btn btn-primary" onclick="downloadAllChapters('${manga.id}')" ${undownloadedCount === 0 ? 'disabled' : ''}>
                ↓ Download All ${undownloadedCount > 0 ? `(${undownloadedCount})` : ''}
              </button>
              ${unreadNotDownloaded.length > 0 ? `
              <button class="btn btn-secondary" onclick="downloadUnreadChapters('${manga.id}')">
                ↓ Download Unread (${unreadNotDownloaded.length})
              </button>
              ` : ''}
              <button class="btn btn-secondary" onclick="quickCheckUpdates('${manga.id}')" title="Quick check first page only">
                ⚡ Quick Check
              </button>
              <button class="btn btn-secondary" onclick="checkMangaUpdates('${manga.id}')" title="Full update check (all pages)">
                🔍 Full Check
              </button>
              ` : ''}
              <button class="btn btn-secondary" onclick="scanLocalChapters('${manga.id}')">
                📁 Check Local
              </button>
              <button class="btn btn-secondary cbz-extract-btn" onclick="showCbzManager('${manga.id}')" style="display:none;">
                📦 CBZ Files
              </button>
              ${!coverUrl && (manga.downloadedChapters || []).length > 0 ? `
              <button class="btn btn-secondary" onclick="setFirstImageAsCover('${manga.id}')">
                🖼️ Set Cover
              </button>
              ` : !coverUrl ? `
              <button class="btn btn-secondary set-cover-btn" onclick="setFirstImageAsCover('${manga.id}')" style="display:none;">
                🖼️ Set Cover
              </button>
              ` : ''}
              <span class="btn-group">
                <button class="btn btn-secondary" onclick="openRenameModal('${manga.id}', '${displayName.replace(/'/g, "\\'")}')">
                  ✏️ Rename
                </button>
                <button class="btn btn-danger" onclick="deleteManga('${manga.id}')">
                  🗑️ Delete
                </button>
              </span>
              </div>
            </div>
          </div>
        </div>

        ${duplicateSection}

        <div class="chapter-section">
          <div class="chapter-header">
            <h2>${uniqueCount} Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn active" data-filter="all" onclick="filterChapters('all', this)">All</button>
              <button class="filter-btn" data-filter="main" onclick="filterChapters('main', this)">Main (${wholeChapters.length})</button>
              ${extraChapters.length > 0 ? `<button class="filter-btn" data-filter="extra" onclick="filterChapters('extra', this)">Extras (${extraChapters.length})</button>` : ''}
              <button class="filter-btn" data-filter="downloaded" onclick="filterChapters('downloaded', this)">Downloaded (${downloadedCount})</button>
            </div>
          </div>
          ${totalPages > 1 ? `
          <div class="chapter-pagination">
            <button class="btn btn-icon" onclick="goToFirstChapterPage()" ${currentPage === 0 ? 'disabled' : ''} title="First page">«</button>
            <button class="btn btn-icon" onclick="goToPrevChapterPage()" ${currentPage === 0 ? 'disabled' : ''} title="Previous page">‹</button>
            <select class="chapter-page-select" onchange="onChapterPageSelect(this)">
              ${Array.from({ length: totalPages }, (_, i) => {
      const pageStart = i * CHAPTERS_PER_PAGE + 1;
      const pageEnd = Math.min((i + 1) * CHAPTERS_PER_PAGE, allChapterGroups.length);
      return `<option value="${i}" ${i === currentPage ? 'selected' : ''}>Ch. ${allChapterGroups[i * CHAPTERS_PER_PAGE][0]} - ${allChapterGroups[Math.min((i + 1) * CHAPTERS_PER_PAGE - 1, allChapterGroups.length - 1)][0]}</option>`;
    }).join('')}
            </select>
            <span class="pagination-info">Page ${currentPage + 1} of ${totalPages}</span>
            <button class="btn btn-icon" onclick="goToNextChapterPage()" ${currentPage === totalPages - 1 ? 'disabled' : ''} title="Next page">›</button>
            <button class="btn btn-icon" onclick="goToLastChapterPage()" ${currentPage === totalPages - 1 ? 'disabled' : ''} title="Last page">»</button>
          </div>
          ` : ''}
          <div class="chapter-list">
            ${chapterItems}
          </div>
          ${totalPages > 1 ? `
          <div class="chapter-pagination bottom">
            <button class="btn btn-icon" onclick="goToFirstChapterPage()" ${currentPage === 0 ? 'disabled' : ''} title="First page">«</button>
            <button class="btn btn-icon" onclick="goToPrevChapterPage()" ${currentPage === 0 ? 'disabled' : ''} title="Previous page">‹</button>
            <select class="chapter-page-select" onchange="onChapterPageSelect(this)">
              ${Array.from({ length: totalPages }, (_, i) => {
      return `<option value="${i}" ${i === currentPage ? 'selected' : ''}>Ch. ${allChapterGroups[i * CHAPTERS_PER_PAGE][0]} - ${allChapterGroups[Math.min((i + 1) * CHAPTERS_PER_PAGE - 1, allChapterGroups.length - 1)][0]}</option>`;
    }).join('')}
            </select>
            <span class="pagination-info">Page ${currentPage + 1} of ${totalPages}</span>
            <button class="btn btn-icon" onclick="goToNextChapterPage()" ${currentPage === totalPages - 1 ? 'disabled' : ''} title="Next page">›</button>
            <button class="btn btn-icon" onclick="goToLastChapterPage()" ${currentPage === totalPages - 1 ? 'disabled' : ''} title="Last page">»</button>
          </div>
          ` : ''}
        </div>

        ${renderExcludedChaptersSection(manga, chapters, excludedChaptersSet)}
      </div>
    </div>
    ${renderRenameModal()}
    ${renderArtistModal()}
    ${renderCategoryManagerModal(allCategories)}
  `;
}

// Render excluded chapters section
function renderExcludedChaptersSection(manga, allChapters, excludedChaptersSet) {
  if (excludedChaptersSet.size === 0) return '';

  // Get info about excluded chapters from the full chapter list
  const excludedList = [];
  const excludedNumbers = Array.from(excludedChaptersSet).sort((a, b) => b - a);

  for (const num of excludedNumbers) {
    const chapter = allChapters.find(c => c.number === num);
    excludedList.push({
      number: num,
      title: chapter?.title || `Chapter ${num}`
    });
  }

  return `
    <div class="excluded-manager">
      <div class="excluded-header-bar" onclick="toggleExcludedManager()">
        <span>🚫 ${excludedList.length} excluded chapter(s)</span>
        <span class="expand-icon" id="excluded-manager-icon">▼</span>
      </div>
      <div class="excluded-content" id="excluded-manager-content" style="display:none;">
        ${excludedList.map(({ number, title }) => `
          <div class="excluded-chapter-row">
            <div class="excluded-chapter-info">
              <span class="excluded-chapter-number">Chapter ${number}</span>
              <span class="excluded-chapter-title">${title !== `Chapter ${number}` ? title : ''}</span>
            </div>
            <button class="btn btn-xs btn-secondary" onclick="unexcludeChapter('${manga.id}', ${number})">
              ↩️ Restore
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Series detail page
function renderSeriesDetail(series) {
  const displayName = series.alias || series.title;
  const entries = series.entries || [];

  // Calculate totals
  const totalChapters = entries.reduce((sum, e) => sum + (e.chapter_count || 0), 0);
  const downloadedChapters = entries.reduce((sum, e) => sum + (e.downloadedChapters?.length || 0), 0);

  // Get proper series cover URL
  const coverEntry = series.cover_entry_id
    ? entries.find(e => e.id === series.cover_entry_id)
    : entries[0];
  const seriesCoverUrl = coverEntry
    ? (coverEntry.localCover
      ? `/api/bookmarks/${coverEntry.bookmark_id}/covers/${encodeURIComponent(coverEntry.localCover.split(/[/\\]/).pop())}`
      : coverEntry.cover)
    : null;

  // Entry cards (like manga cards but with actions)
  const entryCards = entries.map((entry, index) => {
    const entryName = entry.alias || entry.title;
    const coverUrl = entry.localCover
      ? `/api/bookmarks/${entry.bookmark_id}/covers/${encodeURIComponent(entry.localCover.split(/[/\\]/).pop())}`
      : entry.cover;

    return `
      <div class="series-entry-card" data-entry-id="${entry.id}">
        <div class="series-entry-cover" onclick="router.navigate('/manga/${entry.bookmark_id}')">
          ${coverUrl
        ? `<img src="${coverUrl}" alt="${entryName}" onerror="this.parentElement.innerHTML='<div class=\\'placeholder\\'>📚</div>'">`
        : `<div class="placeholder">📚</div>`
      }
          <div class="series-entry-badges">
            <span class="badge badge-chapters">${entry.chapter_count || 0} ch</span>
            ${entry.downloadedChapters?.length > 0 ? `<span class="badge badge-downloaded">${entry.downloadedChapters.length}</span>` : ''}
          </div>
        </div>
        <div class="series-entry-info">
          <div class="series-entry-title" onclick="router.navigate('/manga/${entry.bookmark_id}')">${entryName}</div>
          <div class="series-entry-actions">
            <button class="btn-icon small" onclick="setSeriesCoverEntry('${series.id}', '${entry.id}')" title="Set as cover">🖼️</button>
            <button class="btn-icon small" onclick="moveSeriesEntry('${series.id}', '${entry.id}', -1)" ${index === 0 ? 'disabled' : ''} title="Move up">↑</button>
            <button class="btn-icon small" onclick="moveSeriesEntry('${series.id}', '${entry.id}', 1)" ${index === entries.length - 1 ? 'disabled' : ''} title="Move down">↓</button>
            <button class="btn-icon small danger" onclick="removeSeriesEntry('${series.id}', '${entry.id}')" title="Remove from series">×</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    ${renderHeader('series')}
    <div class="container manga-detail-container">
      <div class="manga-detail">
        <div class="manga-detail-header">
          <button class="btn-back" onclick="router.navigate('/')">← Back</button>
          <div class="manga-detail-cover">
            ${seriesCoverUrl
      ? `<img src="${seriesCoverUrl}" alt="${displayName}">`
      : `<div class="placeholder">📖</div>`
    }
          </div>
          <div class="manga-detail-info">
            <h1 class="manga-detail-title">${displayName}</h1>
            <div class="manga-detail-meta">
              <span class="meta-item" style="color:var(--accent)">${entries.length} Stories</span>
              <span class="meta-item">${totalChapters} Chapters</span>
              <span class="meta-item" style="color:var(--badge-downloaded)">${downloadedChapters} Downloaded</span>
            </div>
            <div class="manga-detail-actions">
              <button class="btn btn-primary" onclick="openAddToSeriesModal('${series.id}')">
                + Add Story
              </button>
              <button class="btn btn-secondary" onclick="openGalleryMode('${series.id}')">
                🖼️ Cover Gallery
              </button>
              <button class="btn btn-secondary" onclick="openRenameSeriesModal('${series.id}', '${displayName.replace(/'/g, "\\'")}')">
                ✏️ Rename
              </button>
              <button class="btn btn-danger" onclick="deleteSeries('${series.id}')">
                🗑️ Delete Series
              </button>
            </div>
          </div>
        </div>
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>${entries.length} Stories</h2>
          </div>
          <div class="series-entries-grid">
            ${entryCards || '<p class="empty-state">No stories in this series. Click "Add Story" to add manga.</p>'}
          </div>
        </div>
      </div>
    </div>
    ${renderAddToSeriesModal(series.id)}
    ${renderCoverGalleryModal()}
  `;
}

// Add to series modal
function renderAddToSeriesModal(seriesId) {
  return `
    <div class="modal" id="add-to-series-modal">
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h3>Add Story to Series</h3>
          <button class="close-btn" onclick="closeModal('add-to-series-modal')">×</button>
        </div>
        <div class="modal-body">
          <div class="search-box" style="margin-bottom: 1rem;">
            <input type="text" id="add-story-search" class="form-input" placeholder="Search manga..." oninput="filterAvailableBookmarks(this.value)">
          </div>
          <div id="available-bookmarks-list">
            <div class="loading-spinner"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('add-to-series-modal')">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Cover gallery modal
function renderCoverGalleryModal() {
  return `
    <div class="modal" id="cover-gallery-modal">
      <div class="modal-content" style="max-width: 900px;">
        <div class="modal-header">
          <h3>Cover Gallery</h3>
          <button class="close-btn" onclick="closeModal('cover-gallery-modal')">×</button>
        </div>
        <div class="modal-body">
          <div id="cover-gallery-grid" class="cover-gallery-grid">
            <div class="loading-spinner"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('cover-gallery-modal')">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Create series modal
function renderCreateSeriesModal() {
  return `
    <div class="modal" id="create-series-modal">
      <div class="modal-content" style="max-width: 450px;">
        <div class="modal-header">
          <h3>Create New Series</h3>
          <button class="close-btn" onclick="closeModal('create-series-modal')">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Series Title</label>
            <input type="text" id="new-series-title" class="form-input" placeholder="Enter series title...">
          </div>
          <div class="form-group">
            <label>Alias (optional)</label>
            <input type="text" id="new-series-alias" class="form-input" placeholder="Display name...">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeModal('create-series-modal')">Cancel</button>
          <button class="btn btn-primary" onclick="createSeries()">Create Series</button>
        </div>
      </div>
    </div>
  `;
}

// Reader component
// trophyInfo is an object: { pageIndex: { isSingle: bool, pages: [indices] } }
// lastPageSingle marks the last page to pair with next chapter's first page during transition
// nextChapterFirstImage is the URL of the next chapter's first image (for link mode)
function renderReader(manga, chapter, images, settings, trophyInfo = {}, lastPageSingle = false, nextChapterFirstImage = null) {
  const { mode, direction, firstPageSingle, singlePageMode = false, currentPage = 0, zoom = 100 } = settings;
  const modeClass = mode === 'webtoon' ? 'webtoon' : `manga ${direction}${firstPageSingle ? ' single-first' : ''}${singlePageMode ? ' single-page' : ''}`;

  let imageHtml = '';
  let totalPages = images.length;
  let displayPage = currentPage;

  // Check if current page is a trophy page
  const isTrophyPage = (pageIdx) => trophyInfo[pageIdx] !== undefined;

  if (mode === 'webtoon') {
    // Webtoon: vertical scroll, one image per row
    imageHtml = images.map((img, i) => {
      const trophy = isTrophyPage(i) ? ' trophy' : '';
      return `<img src="${img.url}" alt="Page ${i + 1}" class="${trophy}" data-page="${i}" loading="lazy" style="max-width:${zoom}%">`;
    }).join('');
  } else if (singlePageMode) {
    // Single page mode: show one page at a time, BUT trophy doubles always show as doubles
    const trophyData = trophyInfo[currentPage];
    if (trophyData && !trophyData.isSingle && trophyData.pages && trophyData.pages.length === 2) {
      // This is a trophy double - render as spread using saved order
      const [page1, page2] = trophyData.pages;
      const img1 = images[page1];
      const img2 = images[page2];
      if (img1 && img2) {
        // Use the saved order - page1 on left, page2 on right (as saved)
        imageHtml = `<img src="${img1.url}" alt="Page" class="manga-page left trophy" data-page="${page1}"><img src="${img2.url}" alt="Page" class="manga-page right trophy" data-page="${page2}">`;
      }
    } else {
      // Regular single page
      const currentImg = images[currentPage];
      const trophy = isTrophyPage(currentPage) ? ' trophy' : '';
      if (currentImg) {
        imageHtml = `<img src="${currentImg.url}" alt="Page ${currentPage + 1}" class="manga-page single${trophy}" data-page="${currentPage}">`;
      }
    }
  } else {
    // Manga: show 2 pages at a time, but trophy pages shown based on how they were marked
    // Build a spread map that accounts for firstPageSingle and trophy pages
    const spreads = buildSpreadMap(images.length, firstPageSingle, trophyInfo, lastPageSingle);
    const currentSpread = spreads[currentPage] || { pages: [] };
    const isLastSpread = currentPage === spreads.length - 1;
    const lastPageIdx = images.length - 1;

    let leftImg = null;
    let rightImg = null;
    let leftIdx = -1;
    let rightIdx = -1;
    let nextChapterImg = null; // For link mode

    if (currentSpread.pages.length === 1) {
      // Single page spread (cover, trophy, or last odd page)
      const pageIdx = currentSpread.pages[0];

      // Check if this is the last page and link mode is active with next chapter image
      if (isLastSpread && lastPageSingle && nextChapterFirstImage && pageIdx === lastPageIdx) {
        // Pair last page with next chapter's first image
        if (direction === 'rtl') {
          // RTL: current last page on right, next chapter first on left
          rightImg = images[pageIdx];
          rightIdx = pageIdx;
          nextChapterImg = nextChapterFirstImage;
        } else {
          // LTR: current last page on left, next chapter first on right
          leftImg = images[pageIdx];
          leftIdx = pageIdx;
          nextChapterImg = nextChapterFirstImage;
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
      imageHtml = rightHtml + leftHtml;
    } else {
      imageHtml = leftHtml + rightHtml;
    }
  }

  // Calculate total "spreads" for manga mode
  let totalSpreads = totalPages;
  if (mode === 'manga') {
    if (singlePageMode) {
      totalSpreads = totalPages;
    } else {
      const spreads = buildSpreadMap(images.length, firstPageSingle, trophyInfo, lastPageSingle);
      totalSpreads = spreads.length;
    }
  }

  const pageIndicator = mode === 'webtoon'
    ? `Page 1 / ${totalPages}`
    : `${currentPage + 1} / ${totalSpreads}`;

  // Build controls based on mode
  const modeToggle = `
    <button class="reader-control-btn toggle-btn" onclick="toggleReaderMode()" title="${mode === 'webtoon' ? 'Switch to Manga mode' : 'Switch to Webtoon mode'}">
      ${mode === 'webtoon' ? '📜' : '📚'}
    </button>
  `;

  // Check if current page is a trophy
  const trophyPageIndices = Object.keys(trophyInfo).map(k => parseInt(k, 10));
  const currentPageIsTrophy = trophyPageIndices.some(p => {
    if (singlePageMode) return p === currentPage;
    const spreads = buildSpreadMap(images.length, firstPageSingle, trophyInfo, lastPageSingle);
    const spread = spreads[currentPage];
    return spread && spread.pages.includes(p);
  });

  const mangaControls = mode === 'manga' ? `
    <button class="reader-control-btn toggle-btn" onclick="openFavoriteDialog()" title="Add to favorites">
      ⭐
    </button>
    <button class="reader-control-btn toggle-btn" onclick="toggleDirection()" title="${direction === 'rtl' ? 'Japanese (RTL)' : 'Western (LTR)'}">
      ${direction === 'rtl' ? 'あ' : 'A'}
    </button>
    <button class="reader-control-btn toggle-btn" onclick="toggleSinglePageMode()" title="${singlePageMode ? 'Single page (tap for double)' : 'Double page (tap for single)'}">
      ${singlePageMode ? '1️⃣' : '2️⃣'}
    </button>
    <button class="reader-control-btn toggle-btn ${singlePageMode ? 'disabled' : ''}" onclick="${singlePageMode ? '' : 'toggleFirstPageSingle()'}" title="${firstPageSingle ? 'Cover separate' : 'Cover paired'}">
      ${firstPageSingle ? '🔖' : '📑'}
    </button>
    <button class="reader-control-btn toggle-btn ${lastPageSingle ? 'active' : ''}" onclick="toggleLastPageSingle()" title="${lastPageSingle ? 'Last page linked to next chapter' : 'Link last page to next chapter'}">
      🔗
    </button>
    <button class="reader-control-btn toggle-btn ${currentPageIsTrophy ? 'active' : ''}" onclick="toggleCurrentPageTrophy()" title="${currentPageIsTrophy ? 'Unmark as trophy' : 'Mark as trophy page'}">
      🏆
    </button>
    <button class="reader-control-btn toggle-btn" onclick="rotateCurrentPage()" title="Rotate page 90°">
      🔄
    </button>
    <button class="reader-control-btn toggle-btn" onclick="swapCurrentPages()" title="Swap page order">
      ⇄
    </button>
    <button class="reader-control-btn toggle-btn" onclick="splitCurrentImage()" title="Split combined image into two pages">
      ✂️
    </button>
    <button class="reader-control-btn toggle-btn danger" onclick="deleteCurrentPage()" title="Delete current page">
      🗑️
    </button>
  ` : '';

  const webtoonControls = mode === 'webtoon' ? `
    <button class="reader-control-btn toggle-btn" onclick="openFavoriteDialog()" title="Add to favorites">
      ⭐
    </button>
    <div class="zoom-control">
      <span class="zoom-label">🔍</span>
      <input type="range" min="30" max="100" value="${zoom}" class="zoom-slider" onchange="setZoom(this.value)" oninput="previewZoom(this.value)">
      <span class="zoom-value" id="zoom-value">${zoom}%</span>
    </div>
    <button class="reader-control-btn toggle-btn" onclick="rotateCurrentPage()" title="Rotate page 90°">
      🔄
    </button>
    <button class="reader-control-btn toggle-btn" onclick="splitCurrentImage()" title="Split combined image into two pages">
      ✂️
    </button>
    <button class="reader-control-btn toggle-btn danger" onclick="deleteCurrentPage()" title="Delete current page">
      🗑️
    </button>
  ` : '';

  return `
    <div class="reader" id="reader">
      <div class="reader-header" id="reader-header">
        <div class="reader-title">
          <a href="#/manga/${manga.id}" style="color:var(--accent);">← ${manga.alias || manga.title}</a>
          <span style="margin-left:15px;">Chapter ${chapter.number}</span>
        </div>
        <div class="reader-controls">
          ${modeToggle}
          ${mangaControls}
          ${webtoonControls}
          <button class="reader-control-btn" onclick="toggleFullscreen()" title="Fullscreen" id="fullscreen-btn">
            ⛶
          </button>
          <button class="reader-control-btn" onclick="closeReader()" title="Close">
            ✕
          </button>
        </div>
      </div>
      
      <div class="reader-content ${modeClass}" id="reader-content" onclick="handleReaderClick(event)">
        ${imageHtml}
      </div>
      

      
      <div class="reader-footer" id="reader-footer">
        <button class="btn btn-secondary btn-small" onclick="prevChapter()">← Prev</button>
        <div class="page-slider-container">
          <input type="range" 
            class="page-slider" 
            id="page-slider"
            min="0" 
            max="${mode === 'webtoon' ? totalPages - 1 : totalSpreads - 1}" 
            value="${currentPage}"
            oninput="previewPageSlider(this.value)"
            onchange="goToPage(this.value)"
          >
          <span class="page-indicator" id="page-indicator">${pageIndicator}</span>
        </div>
        <button class="btn btn-secondary btn-small" onclick="nextChapter()">Next →</button>
      </div>
    </div>
  `;
}

// Add manga modal
function renderAddModal() {
  return `
    <div id="add-modal" class="modal">
      <div class="modal-content">
        <h2>Add New Manga</h2>
        <input type="text" id="manga-url" placeholder="Enter manga URL (e.g., https://comix.to/title/...)">
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="closeModal('add-modal')">Cancel</button>
          <button class="btn btn-primary" onclick="addManga()">Add Manga</button>
        </div>
      </div>
    </div>
  `;
}

// Rename modal
function renderRenameModal() {
  return `
    <div id="rename-modal" class="modal">
      <div class="modal-content" style="max-width: 600px;">
        <h2>Rename Manga</h2>
        <textarea id="rename-input" placeholder="Enter new name" rows="3"></textarea>
        <input type="hidden" id="rename-id">
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="closeModal('rename-modal')">Cancel</button>
          <button class="btn btn-primary" onclick="renameManga()">Save</button>
        </div>
      </div>
    </div>
    <div id="cover-modal" class="modal">
      <div class="modal-content cover-modal-content">
        <h2>Select Cover</h2>
        <div class="cover-grid" id="cover-grid">
          <div class="loading-spinner"></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="closeModal('cover-modal')">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Category manager modal
function renderCategoryManagerModal(categories = []) {
  return `
    <div id="category-modal" class="modal">
      <div class="modal-content">
        <h2>Manage Categories</h2>
        <div class="category-manager">
          <div class="category-add">
            <input type="text" id="new-category-input" placeholder="New category name">
            <button class="btn btn-primary" onclick="addNewCategory()">Add</button>
          </div>
          <div class="category-list" id="category-list">
            ${categories.length === 0
      ? '<p class="text-muted">No categories yet</p>'
      : categories.map(cat => `
                <div class="category-item">
                  <span>${cat}</span>
                  <button class="btn-icon small danger" onclick="deleteCategoryItem('${cat.replace(/'/g, "\\'")}')">×</button>
                </div>
              `).join('')}
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="closeModal('category-modal')">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Category selector for manga detail page - shows only active categories + add button
function renderCategorySelector(manga, allCategories = []) {
  const mangaCategories = manga.categories || [];
  const availableToAdd = allCategories.filter(cat => !mangaCategories.includes(cat));

  return `
    <div class="category-selector-inline">
      ${mangaCategories.map(cat => `
        <span class="category-tag-active" onclick="toggleMangaCategory('${manga.id}', '${cat.replace(/'/g, "\\'")}', false)" title="Click to remove">
          ${cat} <span class="remove-x">×</span>
        </span>
      `).join('')}
      <div class="category-add-dropdown">
        <button class="category-add-btn" onclick="toggleCategoryDropdown(event)" title="Add category">+</button>
        <div class="category-dropdown-menu" id="category-dropdown-${manga.id}">
          ${availableToAdd.length > 0 ? availableToAdd.map(cat => `
            <button class="category-dropdown-item" onclick="toggleMangaCategory('${manga.id}', '${cat.replace(/'/g, "\\'")}', true); closeCategoryDropdowns();">
              ${cat}
            </button>
          `).join('') : '<div class="category-dropdown-empty">No more categories</div>'}
          <div class="category-dropdown-divider"></div>
          <button class="category-dropdown-item manage" onclick="openCategoryManager(); closeCategoryDropdowns();">⚙️ Manage Categories</button>
        </div>
      </div>
    </div>
  `;
}

// Category badges inline with meta items
function renderCategoryBadges(manga, allCategories = []) {
  const mangaCategories = manga.categories || [];
  const availableToAdd = allCategories.filter(cat => !mangaCategories.includes(cat));

  const categoryBadges = mangaCategories.map(cat => `
    <span class="meta-item category-badge" onclick="toggleMangaCategory('${manga.id}', '${cat.replace(/'/g, "\\'")}', false)" title="Click to remove ${cat}">
      ${cat} ×
    </span>
  `).join('');

  const addButton = `
    <span class="category-add-badge" id="category-add-${manga.id}">
      <span class="category-add-trigger" onclick="toggleCategoryDropdown(event)" title="Add category">+</span>
      <div class="category-dropdown-menu" id="category-dropdown-${manga.id}" onclick="event.stopPropagation()">
        ${availableToAdd.length > 0 ? availableToAdd.map(cat => `
          <button class="category-dropdown-item" onclick="event.stopPropagation(); toggleMangaCategory('${manga.id}', '${cat.replace(/'/g, "\\'")}', true); closeCategoryDropdowns();">
            ${cat}
          </button>
        `).join('') : '<div class="category-dropdown-empty">No more categories</div>'}
        <div class="category-dropdown-divider"></div>
        <button class="category-dropdown-item manage" onclick="event.stopPropagation(); openCategoryManager(); closeCategoryDropdowns();">⚙️ Manage Categories</button>
      </div>
    </span>
  `;

  return categoryBadges + addButton;
}

// Artist badge for manga detail meta row
function renderArtistBadge(manga) {
  const artists = manga.artists || [];
  const hasArtists = artists.length > 0;

  return `
    <span class="meta-item artist-badge" id="artist-badge-${manga.id}" 
         onclick="event.stopPropagation(); navigateToArtist('${manga.id}')"
         data-manga-id="${manga.id}"
         data-longpress="openArtistSelector"
         title="${hasArtists ? 'Click to filter by artist, long-press to edit' : 'Long-press to add artist'}">
      🎨 ${hasArtists ? artists.join(', ') : '+'}
    </span>
  `;
}

// Artist selector modal
function renderArtistModal() {
  return `
    <div id="artist-modal" class="modal">
      <div class="modal-content">
        <h2>Select Artist</h2>
        <div class="artist-manager">
          <div class="artist-search">
            <input type="text" id="artist-search-input" placeholder="Search or add new artist..." oninput="filterArtistList()">
            <button class="btn btn-primary" onclick="addNewArtistFromSearch()" id="artist-add-btn" style="display:none;">Add</button>
          </div>
          <div class="artist-list" id="artist-list">
            <p class="text-muted">Loading artists...</p>
          </div>
          <div class="artist-current" id="artist-current">
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="closeModal('artist-modal')">Close</button>
        </div>
      </div>
    </div>
  `;
}

// Loading card for library
function createLoadingCard(url) {
  let domain = 'Unknown';
  try { domain = new URL(url).hostname; } catch (e) { }

  return `
    <div class="manga-card loading-card" id="loading-card">
      <div class="manga-card-cover">
        <div class="loading-overlay">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading from ${domain}...</div>
        </div>
      </div>
      <div class="manga-card-title">Loading...</div>
    </div>
  `;
}
