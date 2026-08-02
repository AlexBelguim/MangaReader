/**
 * Header Component
 * Navigation bar with actions
 */
import { router } from '../router.js';
import { store } from '../store.js';
import { handleScan } from '../utils/scan.js';
import { icon } from '../icons.js';
import { logoLockup } from '../brand.js';
import { session } from '../session.js';

/**
 * Render the header
 *
 * Nav is role-aware:
 *  - demo:  logo + DEMO badge + exit link only (no scrapers/queue/add/scan)
 *  - user:  everything except Admin; Scan needs canDownload, Add needs canEdit
 *  - admin: everything + Admin
 */
export function renderHeader(viewMode = 'manga') {
  if (session.isDemo) {
    return `
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${logoLockup()}</a>
        <div class="header-actions">
          <span class="demo-badge">Demo</span>
          <a href="/login.html" class="btn btn-secondary" title="Exit the demo">${icon('log-out', { title: 'Exit the demo' })} Exit</a>
        </div>
      </div>
    </header>
  `;
  }

  const adminLink = session.isAdmin
    ? `<a href="#/admin" class="btn btn-secondary" title="Admin">${icon('wrench', { title: 'Admin' })}</a>`
    : '';
  const adminLinkMobile = session.isAdmin
    ? `<a href="#/admin" class="mobile-menu-item">${icon('wrench')} Admin</a>`
    : '';
  const scanBtn = session.canDownload
    ? `<button class="btn btn-secondary" id="scan-btn">${icon('folder')} Scan Folder</button>`
    : '';
  const scanBtnMobile = session.canDownload
    ? `<button class="mobile-menu-item" id="mobile-scan-btn">${icon('folder')} Scan Folder</button>`
    : '';
  const addBtn = session.canEdit
    ? (viewMode === 'series'
      ? `<button class="btn btn-primary" id="add-series-btn">${icon('plus')} Add Series</button>`
      : `<button class="btn btn-primary" id="add-manga-btn">${icon('plus')} Add Manga</button>`)
    : '';
  const addBtnMobile = session.canEdit
    ? (viewMode === 'series'
      ? `<button class="mobile-menu-item primary" id="mobile-add-series-btn">${icon('plus')} Add Series</button>`
      : `<button class="mobile-menu-item primary" id="mobile-add-btn">${icon('plus')} Add Manga</button>`)
    : '';

  return `
    <header>
      <div class="header-content">
        <a href="#/" class="logo">${logoLockup()}</a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${viewMode === 'manga' ? 'active' : ''}" data-view="manga" title="Manga view">${icon('library', { title: 'Manga view' })}</button>
            <button class="view-toggle-btn ${viewMode === 'series' ? 'active' : ''}" data-view="series" title="Series view">${icon('book-open', { title: 'Series view' })}</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">${icon('star')} Favorites</button>
          <a href="#/queue" class="btn btn-secondary" id="queue-nav-btn" title="Task Queue">${icon('list-checks')} Queue</a>
          ${scanBtn}
          ${addBtn}
          <button class="btn btn-secondary" id="logout-btn" title="Log out">${icon('log-out', { title: 'Log out' })}</button>
          <a href="#/scrapers" class="btn btn-secondary" title="Search Scrapers">${icon('search', { title: 'Search Scrapers' })}</a>
          ${adminLink}
          <!-- <a href="#/settings" class="btn btn-secondary" title="Settings">${icon('settings')}</a> -->
        </div>
        <button class="hamburger-btn mobile-only" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${viewMode === 'manga' ? 'active' : ''}" data-view="manga">${icon('library')} Manga</button>
          <button class="view-toggle-btn ${viewMode === 'series' ? 'active' : ''}" data-view="series">${icon('book-open')} Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">${icon('star')} Favorites</button>
        <a href="#/queue" class="mobile-menu-item">${icon('list-checks')} Task Queue</a>
        ${scanBtnMobile}
        ${addBtnMobile}
        <button class="mobile-menu-item" id="mobile-logout-btn">${icon('log-out')} Logout</button>
        <a href="#/scrapers" class="mobile-menu-item">${icon('search')} Scrapers</a>
        ${adminLinkMobile}
        <!-- <a href="#/settings" class="mobile-menu-item">${icon('settings')} Settings</a> -->
      </div>
    </header>
  `;
}

/**
 * Setup header event listeners
 */
export function setupHeaderListeners() {
  // Prevent duplicate listeners from being attached
  const header = document.querySelector('header');
  if (header && header.dataset.listenersBound) return;
  if (header) header.dataset.listenersBound = 'true';

  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

  const handleLogout = () => {
    localStorage.removeItem('manga_auth_token');
    window.location.href = '/login.html';
  };

  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);

  // View toggle buttons - switch between manga and series views
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewMode = btn.dataset.view;

      // Store the view mode preference
      localStorage.setItem('library_view_mode', viewMode);

      // Update active states
      document.querySelectorAll('[data-view]').forEach(b => {
        b.classList.toggle('active', b.dataset.view === viewMode);
      });

      // Trigger a custom event that the library can listen to
      window.dispatchEvent(new CustomEvent('viewModeChange', { detail: { mode: viewMode } }));
    });
  });

  // Home/Logo click - clear filters AND refresh library data (like the refresh button)
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      // Clear persistence
      localStorage.removeItem('library_active_category');
      localStorage.removeItem('library_artist_filter');
      localStorage.removeItem('library_search');

      // Force a fresh reload of bookmarks from the server. The library
      // subscribes to the store, so this re-renders the grid with fresh data.
      store.loadBookmarks(true).catch(() => {});

      // Dispatch event to clear filters in library (if it's already mounted)
      window.dispatchEvent(new CustomEvent('clearFilters'));
    });
  }

  // Favorites
  const favBtn = document.getElementById('favorites-btn');
  const mobileFavBtn = document.getElementById('mobile-favorites-btn');
  const handleFav = (e) => {
    e.preventDefault();
    router.go('/favorites');
  };
  if (favBtn) favBtn.addEventListener('click', handleFav);
  if (mobileFavBtn) mobileFavBtn.addEventListener('click', handleFav);

  // Queue
  const queueBtn = document.getElementById('queue-nav-btn');
  if (queueBtn) {
    queueBtn.addEventListener('click', (e) => {
      e.preventDefault();
      router.go('/queue');
    });
  }

  // Add Manga / Add Series — the library binds these to open its modal. On
  // other pages (e.g. scrapers) the modal markup isn't present, so route to the
  // library and signal it to open the modal on arrival.
  const addManga = document.getElementById('add-manga-btn');
  const mobileAddManga = document.getElementById('mobile-add-btn');
  const handleAddFallback = () => {
    if (!document.getElementById('add-modal')) {
      sessionStorage.setItem('open_add_modal', '1');
      router.go('/');
    }
  };
  if (addManga) addManga.addEventListener('click', handleAddFallback);
  if (mobileAddManga) mobileAddManga.addEventListener('click', handleAddFallback);

  // Scan Folder
  const scanBtn = document.getElementById('scan-btn');
  const mobileScanBtn = document.getElementById('mobile-scan-btn');
  if (scanBtn || mobileScanBtn) {
    const handleScanClick = () => {
      handleScan(scanBtn, mobileScanBtn, async () => {
        // Refresh store
        await store.loadBookmarks(true);
        // Refresh current view if needed
        router.reload();
      });
    };
    if (scanBtn) scanBtn.addEventListener('click', handleScanClick);
    if (mobileScanBtn) mobileScanBtn.addEventListener('click', handleScanClick);
  }
}

export default { renderHeader, setupHeaderListeners };
