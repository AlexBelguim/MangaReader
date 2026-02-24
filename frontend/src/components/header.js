/**
 * Header Component
 * Navigation bar with actions
 */

/**
 * Render the header
 */
export function renderHeader(viewMode = 'manga') {
  return `
    <header>
      <div class="header-content">
        <a href="#/" class="logo">📚 Manga<span>Reader</span></a>
        <div class="header-actions desktop-only">
          <div class="view-toggle">
            <button class="view-toggle-btn ${viewMode === 'manga' ? 'active' : ''}" data-view="manga" title="Manga view">📚</button>
            <button class="view-toggle-btn ${viewMode === 'series' ? 'active' : ''}" data-view="series" title="Series view">📖</button>
          </div>
          <button class="btn btn-secondary" id="favorites-btn">⭐ Favorites</button>
          <button class="btn btn-secondary" id="scan-btn">📁 Scan Folder</button>
          <button class="btn btn-primary" id="add-manga-btn">+ Add Manga</button>
          <button class="btn btn-secondary" id="logout-btn">🚪</button>
          <a href="#/admin" class="btn btn-secondary" title="Admin">🔧</a>
          <a href="#/settings" class="btn btn-secondary" title="Settings">⚙️</a>
        </div>
        <button class="hamburger-btn mobile-only" id="hamburger-btn">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu hidden" id="mobile-menu">
        <div class="mobile-view-toggle">
          <button class="view-toggle-btn ${viewMode === 'manga' ? 'active' : ''}" data-view="manga">📚 Manga</button>
          <button class="view-toggle-btn ${viewMode === 'series' ? 'active' : ''}" data-view="series">📖 Series</button>
        </div>
        <button class="mobile-menu-item" id="mobile-favorites-btn">⭐ Favorites</button>
        <button class="mobile-menu-item" id="mobile-scan-btn">📁 Scan Folder</button>
        <button class="mobile-menu-item primary" id="mobile-add-btn">+ Add Manga</button>
        <button class="mobile-menu-item" id="mobile-logout-btn">🚪 Logout</button>
        <a href="#/admin" class="mobile-menu-item">🔧 Admin</a>
        <a href="#/settings" class="mobile-menu-item">⚙️ Settings</a>
      </div>
    </header>
  `;
}

/**
 * Setup header event listeners
 */
export function setupHeaderListeners() {
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

  // Home/Logo click - Clear filters
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      // Clear persistence
      localStorage.removeItem('library_active_category');

      // Dispatch event to clear filters in library
      window.dispatchEvent(new CustomEvent('clearFilters'));
    });
  }
}

export default { renderHeader, setupHeaderListeners };
