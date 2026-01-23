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
          <button class="btn btn-secondary" onclick="logout()" title="Logout">🚪 Logout</button>
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
        <button class="mobile-menu-item" onclick="logout(); closeMobileMenu();">🚪 Logout</button>
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
    // Calculate unique chapters excluding excluded ones (on the fly to ensure accuracy)
    const excludedSet = new Set(manga.excludedChapters || []);
    const visibleChapters = (manga.chapters || []).filter(c => !excludedSet.has(c.number));
    const totalCount = new Set(visibleChapters.map(c => c.number)).size || manga.uniqueChapters || manga.totalChapters || 0;
    const readCount = manga.readChapters?.length || 0;
    const hasUpdates = (manga.updatedChapters || []).length > 0;

    // Use local cover API endpoint if available, fallback to remote
    const coverUrl = manga.localCover
      ? `/api/public/covers/${manga.id}/${encodeURIComponent(manga.localCover.split(/[/\\]/).pop())}`
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

// Helper: Render category badges for manga
function renderCategoryBadges(manga, allCategories) {
  const mangaCategories = manga.categories || [];
  const badges = mangaCategories.map(cat =>
    `<span class="category-badge" onclick="event.stopPropagation(); filterByCategory('${cat.replace(/'/g, "\\'")}')"
           style="cursor:pointer;">${cat}</span>`
  ).join('');

  const addBadge = `<span class="category-add-trigger" id="category-add-${manga.id}" 
                         onclick="event.stopPropagation(); openCategorySelector('${manga.id}')" 
                         title="Add to category">+</span>`;

  return badges + addBadge;
}

// Manga detail page
const CHAPTERS_PER_PAGE = 50;

function renderMangaDetail(manga, allCategories = [], currentPage = 0, selectionState = { active: false, selected: new Set() }, filter = 'all') {
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
  const volumes = manga.volumes || [];

  // Identify chapters that are in a volume
  const volumeChapterNumbers = new Set();
  volumes.forEach(v => v.chapters.forEach(c => volumeChapterNumbers.add(c)));

  // Filter out excluded chapters AND hidden/deleted versions from the main list
  const visibleChapters = chapters.filter(c => !excludedChaptersSet.has(c.number) && !deletedUrls.has(c.url));

  // Determine which chapters to show in the list (Loose Chapters)
  // Loose = Visible AND Not in a Volume
  const looseChapters = visibleChapters.filter(c => !volumeChapterNumbers.has(c.number));

  // Sort loose chapters ascending for pagination
  const sortedChaptersAsc = [...looseChapters].sort((a, b) => a.number - b.number);

  // Detect chapter types
  const wholeChapters = visibleChapters.filter(c => Number.isInteger(c.number));
  const extraChapters = visibleChapters.filter(c => !Number.isInteger(c.number));

  // Get duplicates from manga data
  const duplicateChapters = manga.duplicateChapters || [];

  // Always calculate unique count from visible chapters (excludes excluded chapters)
  const uniqueCount = new Set(visibleChapters.map(c => c.number)).size;
  const totalCount = uniqueCount; // Use calculated count, not manga.totalChapters which may include excluded
  const downloadedCount = downloadedChapters.filter(n => !excludedChaptersSet.has(n)).length;
  const downloadedSet = new Set(downloadedChapters);

  // Group loose chapters by number for display
  const chapterGroups = new Map();
  sortedChaptersAsc.forEach(ch => {
    const key = ch.number;
    if (!chapterGroups.has(key)) {
      chapterGroups.set(key, []);
    }
    chapterGroups.get(key).push(ch);
  });

  // Pagination - apply to loose chapter groups
  const allChapterGroups = Array.from(chapterGroups.entries());
  const totalPages = Math.ceil(allChapterGroups.length / CHAPTERS_PER_PAGE);
  const startIdx = currentPage * CHAPTERS_PER_PAGE;
  const endIdx = Math.min(startIdx + CHAPTERS_PER_PAGE, allChapterGroups.length);
  const paginatedGroups = allChapterGroups.slice(startIdx, endIdx);

  // Apply filter before pagination
  let filteredGroups = allChapterGroups;
  if (filter === 'main') {
    filteredGroups = allChapterGroups.filter(([num]) => Number.isInteger(num));
  } else if (filter === 'extra') {
    filteredGroups = allChapterGroups.filter(([num]) => !Number.isInteger(num));
  } else if (filter === 'downloaded') {
    filteredGroups = allChapterGroups.filter(([num]) => downloadedSet.has(num));
  } else if (filter === 'not-downloaded') {
    filteredGroups = allChapterGroups.filter(([num]) => !downloadedSet.has(num));
  }

  // Recalculate pagination based on filtered results
  const filteredTotalPages = Math.ceil(filteredGroups.length / CHAPTERS_PER_PAGE);
  const filteredStartIdx = currentPage * CHAPTERS_PER_PAGE;
  const filteredEndIdx = Math.min(filteredStartIdx + CHAPTERS_PER_PAGE, filteredGroups.length);
  const filteredPaginatedGroups = filteredGroups.slice(filteredStartIdx, filteredEndIdx);

  // Sort the paginated groups descending for display
  const displayGroups = [...filteredPaginatedGroups].sort((a, b) => b[0] - a[0]);

  // Helper to check if a URL is downloaded
  const isUrlDownloaded = (chapterNum, url) => {
    const versions = downloadedVersions[chapterNum];
    if (!versions) return false;
    if (typeof versions === 'string') return versions === url;
    if (Array.isArray(versions)) return versions.includes(url);
    return false;
  };

  // --- RENDER VOLUMES ---
  const volumeCards = volumes.map(vol => {
    const volChapters = vol.chapters.sort((a, b) => a - b);
    const volMainChapters = volChapters.filter(n => Number.isInteger(n));
    const volExtraChapters = volChapters.filter(n => !Number.isInteger(n));

    // Build subtitle showing chapters and extras separately
    let subtitle = '';
    if (volMainChapters.length > 0) {
      subtitle = `${volMainChapters.length} Chapter${volMainChapters.length !== 1 ? 's' : ''}`;
    }
    if (volExtraChapters.length > 0) {
      subtitle += (subtitle ? ' • ' : '') + `${volExtraChapters.length} Extra${volExtraChapters.length !== 1 ? 's' : ''}`;
    }
    if (!subtitle) {
      subtitle = 'Empty';
    }

    const volDownloadedCount = volChapters.filter(n => downloadedSet.has(n)).length;

    // Volume cover logic
    const coverHtml = vol.cover
      ? `<img src="${vol.cover}" alt="${vol.name}" style="width:100%;height:100%;object-fit:cover;">`
      : `<div class="placeholder">📚</div>`;

    return `
      <div class="series-entry-card volume-card">
        <div class="series-entry-cover volume-cover" onclick="viewVolume('${manga.id}', '${vol.id}')" style="position:relative;">
           ${coverHtml}
           <div class="series-entry-badges">
             <span class="badge badge-chapters">${volChapters.length} ch</span>
             ${volDownloadedCount > 0 ? `<span class="badge badge-downloaded">${volDownloadedCount}</span>` : ''}
           </div>
        </div>
        <div class="series-entry-info">
          <div class="series-entry-title">${vol.name}</div>
          <div class="series-entry-actions">
            <button class="btn-icon small" onclick="event.stopPropagation(); openVolumeEditModal('${manga.id}', '${vol.id}', '${vol.name.replace(/'/g, "\\'")}')" title="Edit Volume">
              ✏️
            </button>
            <button class="btn-icon small" onclick="event.stopPropagation(); openVolumeCoverSelector('${manga.id}', '${vol.id}')" title="Set Cover">
              🖼️
            </button>
            <button class="btn-icon small danger" onclick="event.stopPropagation(); deleteVolume('${manga.id}', '${vol.id}')" title="Ungroup Volume">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // --- RENDER CHAPTERS ---
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

    const updateInfo = updatedChaptersMap.get(num);
    const hasUpdate = updateInfo && isDownloaded;

    // Selection State
    const isSelected = selectionState.selected.has(num);
    const checkboxHtml = selectionState.active
      ? `<div class="chapter-select-container" onclick="event.stopPropagation()">
           <input type="checkbox" class="chapter-checkbox" 
             ${isSelected ? 'checked' : ''} 
             onchange="toggleChapterSelection(${num}, this.checked)">
         </div>`
      : '';

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

    // Progress indicator for partially read chapters or just total pages for downloaded
    let progressText = '';
    if (progress && !isRead) {
      progressText = ` (${progress.page}/${progress.totalPages})`;
    } else if (isDownloaded) {
      // Show total pages if downloaded but not read
      const pageCount = manga.downloadedPageCounts?.[num];
      if (pageCount) {
        progressText = ` (${pageCount})`;
      }
    }

    // onclick handler - strict check for selection mode
    const itemClickAction = selectionState.active
      ? `toggleChapterSelection(${num}, !${isSelected})`
      : (hasDupes ? `toggleVersions(${num})` : `readManga('${manga.id}', ${versions[0].number})`);

    // Check lock status
    const chapterSettings = manga.chapterSettings || {};
    const isLocked = chapterSettings[num]?.locked;

    const actionButtons = selectionState.active ? '' : `
             <div class="chapter-actions">
              ${progressText ? `<span class="chapter-progress">${progressText}</span>` : ''}
              <button class="btn-icon small chapter-lock-btn ${isLocked ? 'locked' : ''}" 
                      onclick="event.stopPropagation(); toggleChapterLock('${manga.id}', ${num})"
                      title="${isLocked ? 'Unlock Chapter (Prevent updates)' : 'Lock Chapter'}"
                      style="opacity: ${isLocked ? '1' : '0.3'}">
                ${isLocked ? '🔒' : '🔓'}
              </button>
              <button class="btn-icon small ${isRead ? 'success' : 'muted'}" 
                      onclick="event.stopPropagation(); toggleChapterRead('${manga.id}', ${num}, ${!isRead})"
                      title="${isRead ? 'Mark unread' : 'Mark read'}">
                ${isRead ? '👁️' : '○'}
              </button>
              ${hasDupes ? `
              <button class="btn-icon small" onclick="event.stopPropagation(); toggleVersions(${num})">
                ${visibleVersions.length} <span class="arrow" id="arrow-${num}">▶</span>
              </button>` : ''}
              <button class="btn-icon small ${isDownloaded ? 'success' : ''}" 
                      onclick="event.stopPropagation(); downloadChapter('${manga.id}', ${num})"
                      title="${isDownloaded ? 'Downloaded' : 'Download'}">
                ${isDownloaded ? '✓' : '↓'}
              </button>
            </div>`;

    return `
      <div class="chapter-group" data-chapter="${num}">
        <div class="${chapterClasses}" onclick="${itemClickAction}">
          ${checkboxHtml}
          <span class="chapter-number">Chapter ${num}</span>
          <span class="chapter-title">${displayTitle}${hasHidden ? ' 👁️‍🗨️' : ''}</span>
          ${isExtra ? '<span class="chapter-tag">Extra</span>' : ''}
          ${actionButtons}
        </div>
        ${hasDupes ? `<div class="versions-dropdown" id="versions-${num}" style="display:none;">
           ${visibleVersions.map(v => {
      const versionUrl = encodeURIComponent(v.url);
      const isVersionDownloaded = isUrlDownloaded(num, v.url);
      const versionClasses = ['version-row', isVersionDownloaded ? 'downloaded' : ''].filter(Boolean).join(' ');

      return `
               <div class="${versionClasses}" 
                    onclick="readManga('${manga.id}', ${num}, '${versionUrl}')"
                    oncontextmenu="event.preventDefault(); event.stopPropagation(); openChapterContextMenu(event, '${manga.id}', ${num}, '${versionUrl}'); return false;">
                 <span class="version-title">${v.title}</span>
                 <div class="version-btns" onclick="event.stopPropagation()">
                   ${isVersionDownloaded
          ? `<button class="btn-icon small danger" onclick="deleteDownloadedVersion('${manga.id}', ${num}, '${versionUrl}')" title="Delete from disk">🗑️</button>`
          : `<button class="btn-icon small" onclick="downloadSpecificVersion('${manga.id}', ${num}, '${versionUrl}')" title="Download this version">↓</button>`
        }
                   <button class="btn-icon small" onclick="hideChapterVersion('${manga.id}', ${num}, '${versionUrl}')" title="Hide this version">👁️‍🗨️</button>
                 </div>
               </div>
             `;
    }).join('')}
        </div>` : ''}
      </div>
    `;
  }).join('');

  // Duplicate section logic (omitted for brevity, assume similar structure or kept from before)
  const duplicateSection = ''; // Simplified for this replacement

  // Cover URL
  const coverUrl = manga.localCover
    ? `/api/public/covers/${manga.id}/${encodeURIComponent(manga.localCover.split(/[/\\]/).pop())}`
    : manga.cover;

  // Count unread downloaded chapters (for "Start Reading" logic)
  const unreadDownloaded = downloadedChapters.filter(n => !readChapters.has(n) && !excludedChaptersSet.has(n));

  // Count unread chapters that are NOT downloaded
  const unreadNotDownloaded = visibleChapters.filter(c => !readChapters.has(c.number) && !downloadedSet.has(c.number));

  // Count undownloaded
  const undownloadedCount = visibleChapters.filter(c => !downloadedChapters.includes(c.number) && !deletedUrls.has(c.url)).length;

  // Pagination HTML (use filtered counts)
  const paginationHtml = filteredTotalPages > 1 ? `
    <div class="chapter-pagination" style="margin-bottom: 10px;">
      <button class="btn btn-icon" onclick="goToFirstChapterPage()" ${currentPage === 0 ? 'disabled' : ''} title="First page">«</button>
      <button class="btn btn-icon" onclick="goToPrevChapterPage()" ${currentPage === 0 ? 'disabled' : ''} title="Previous page">‹</button>
      <select class="chapter-page-select" onchange="onChapterPageSelect(this)">
        ${Array.from({ length: filteredTotalPages }, (_, i) => {
    const groupStart = filteredGroups[i * CHAPTERS_PER_PAGE];
    const groupEnd = filteredGroups[Math.min((i + 1) * CHAPTERS_PER_PAGE - 1, filteredGroups.length - 1)];
    const startNum = groupStart ? groupStart[0] : '?';
    const endNum = groupEnd ? groupEnd[0] : '?';
    return `<option value="${i}" ${i === currentPage ? 'selected' : ''}>Ch. ${startNum} - ${endNum}</option>`;
  }).join('')}
      </select>
      <span class="pagination-info">Page ${currentPage + 1} of ${filteredTotalPages}</span>
      <button class="btn btn-icon" onclick="goToNextChapterPage()" ${currentPage === filteredTotalPages - 1 ? 'disabled' : ''} title="Next page">›</button>
      <button class="btn btn-icon" onclick="goToLastChapterPage()" ${currentPage === filteredTotalPages - 1 ? 'disabled' : ''} title="Last page">»</button>
    </div>
  ` : '';

  return `
    ${renderHeader()}
    <div class="container">
      <div class="manga-detail">
        <div class="manga-detail-header">
          <div class="manga-detail-cover">
             <div class="cover-wrapper">
               ${coverUrl ? `<img src="${coverUrl}">` : `<div class="placeholder">📚</div>`}
             </div>
          </div>
          <div class="manga-detail-info">
            <h1>${displayName}</h1>
            <div class="manga-detail-meta">
               <span class="meta-item" style="color:var(--accent)">${manga.website || manga.source || 'Unknown'}</span>
               <span class="meta-item">${totalCount} Chapters</span>
               ${downloadedCount > 0 ? `<span class="meta-item" style="color:var(--badge-downloaded)">${downloadedCount} Downloaded</span>` : ''}
               ${readChapters.size > 0 ? `<span class="meta-item">${readChapters.size} Read</span>` : ''}
               ${downloadedCount - readChapters.size > 0 ? `<span class="meta-item" style="color:var(--warning)">${downloadedCount - readChapters.size} Unread</span>` : ''}
               ${extraChapters.length > 0 ? `<span class="meta-item">${extraChapters.length} Extras</span>` : ''}
               ${renderCategoryBadges(manga, allCategories)}
            </div>
            <div class="manga-detail-actions" id="manga-actions">
              <div class="primary-action-row">
                <button class="btn btn-primary" onclick="readManga('${manga.id}')">
                   ▶ ${manga.lastReadChapter ? 'Continue' : 'Start'} Reading
                </button>
                ${selectionState.active ? `
                <button class="btn btn-accent" onclick="createVolumeFromSelection('${manga.id}')" ${selectionState.selected.size === 0 ? 'disabled' : ''}>
                  Create Volume (${selectionState.selected.size})
                </button>
                <button class="btn btn-secondary" onclick="toggleSelectionMode()">Cancel</button>
                ` : ''}
                <button class="btn btn-secondary more-actions-btn" onclick="toggleMobileActions()">▼</button>
              </div>
              <div class="more-actions">
              ${!selectionState.active ? `
              <button class="btn btn-secondary" onclick="toggleSelectionMode()">
                Select Chapters
              </button>
              ` : ''}
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
              <button class="btn btn-secondary" onclick="addManualChapter('${manga.id}')" title="Manually add a missing chapter by link">
                ➕ Add Chapter
              </button>
              <button class="btn btn-secondary" onclick="hideUndownloadedVersions('${manga.id}')" title="Hide all non-downloaded versions for chapters with downloads">
                🧹 Hide Dupes
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

        ${volumes.length > 0 ? `
        <div class="volumes-section">
           <h2>Volumes</h2>
           <div class="series-entries-grid">
             ${volumeCards}
           </div>
        </div>` : ''}
        
        <div class="chapter-section">
          <div class="chapter-header">
            <h2>Chapters</h2>
            <div class="chapter-filters">
              <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="setChapterFilter('all')">All (${allChapterGroups.length})</button>
              <button class="filter-btn ${filter === 'main' ? 'active' : ''}" onclick="setChapterFilter('main')">Main (${wholeChapters.length})</button>
              <button class="filter-btn ${filter === 'extra' ? 'active' : ''}" onclick="setChapterFilter('extra')">Extras (${extraChapters.length})</button>
              <button class="filter-btn ${filter === 'downloaded' ? 'active' : ''}" onclick="setChapterFilter('downloaded')">Downloaded (${downloadedCount})</button>
              <button class="filter-btn ${filter === 'not-downloaded' ? 'active' : ''}" onclick="setChapterFilter('not-downloaded')">Not Downloaded (${allChapterGroups.filter(([num]) => !downloadedSet.has(num)).length})</button>
            </div>
          </div>
          ${paginationHtml}
          <div class="chapter-list">
            ${chapterItems}
          </div>
          
          <!-- Pagination Controls -->
          ${paginationHtml}
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
      ? `/api/public/covers/${coverEntry.bookmark_id}/${encodeURIComponent(coverEntry.localCover.split(/[/\\]/).pop())}`
      : coverEntry.cover)
    : null;

  // Entry cards (like manga cards but with actions)
  const entryCards = entries.map((entry, index) => {
    const entryName = entry.alias || entry.title;
    const coverUrl = entry.localCover
      ? `/api/public/covers/${entry.bookmark_id}/${encodeURIComponent(entry.localCover.split(/[/\\]/).pop())}`
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

  const pageIndicator = `${currentPage + 1} / ${mode === 'webtoon' ? totalPages : totalSpreads}`;

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
