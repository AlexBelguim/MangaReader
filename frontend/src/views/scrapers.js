import { api } from '../api.js';

class ScraperView {
  constructor() {
    this.container = null;
    this.scrapers = [];
    this.currentQuery = '';
    this.currentTarget = 'all';
    this.isSearching = false;
    this.results = [];
  }

  async mount(params) {
    this.container = document.getElementById('app');
    
    // Set view layout if needed
    document.body.className = 'scrapers-mode';

    this.render();
    
    // Fetch available scrapers
    await this.loadScrapers();
    this.bindEvents();
    
    // Automatically search if there's a 'q' query param in the hash
    // We can parse it from window.location.hash
    const hashMatches = window.location.hash.match(/\?q=([^&]*)/);
    if (hashMatches && hashMatches[1]) {
      this.currentQuery = decodeURIComponent(hashMatches[1]);
      const scraperMatch = window.location.hash.match(/&scraper=([^&]*)/);
      if (scraperMatch && scraperMatch[1]) {
         this.currentTarget = decodeURIComponent(scraperMatch[1]);
      }
      this.performSearch();
    }
  }

  unmount() {
    this.container.innerHTML = '';
    document.body.className = '';
  }

  async loadScrapers() {
    try {
      const data = await api.get('/scrapers/list');
      if (data.success) {
        this.scrapers = data.scrapers.filter(s => s.supportsSearch);
        this.renderScraperOptions();
      }
    } catch (e) {
      console.error('Failed to load scrapers', e);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="view-container scrapers-container">
        <div class="view-header">
          <h1>🔍 Search Scrapers</h1>
          <p class="subtitle">Search for manga across all available sites.</p>
        </div>

        <div class="scraper-search-box">
          <form id="scraper-search-form" class="search-form">
            <select id="scraper-target" class="scraper-select">
              <option value="all">🌐 All Sites</option>
            </select>
            <input type="text" id="scraper-query" placeholder="Enter manga title..." value="${this.currentQuery}" required>
            <button type="submit" class="btn btn-primary" id="scraper-search-btn">Search</button>
          </form>
        </div>

        <div id="scraper-results-container" class="scraper-results">
           <div class="empty-state">
              <div class="empty-icon">🔎</div>
              <p>Type a title above to search across available scrapers.</p>
           </div>
        </div>
      </div>
    `;
  }

  renderScraperOptions() {
    const select = document.getElementById('scraper-target');
    if (!select) return;

    // Keep the "All Sites" option
    select.innerHTML = '<option value="all">🌐 All Sites</option>';
    
    this.scrapers.forEach(s => {
      const option = document.createElement('option');
      option.value = s.name;
      option.textContent = s.name;
      if (this.currentTarget === s.name) option.selected = true;
      select.appendChild(option);
    });
  }

  bindEvents() {
    const form = document.getElementById('scraper-search-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const queryInput = document.getElementById('scraper-query');
        const targetSelect = document.getElementById('scraper-target');
        
        if (queryInput && queryInput.value.trim()) {
          this.currentQuery = queryInput.value.trim();
          this.currentTarget = targetSelect.value || 'all';
          this.performSearch();
        }
      });
    }
  }

  async performSearch() {
    const container = document.getElementById('scraper-results-container');
    const btn = document.getElementById('scraper-search-btn');
    
    if (!container || !btn) return;
    
    this.isSearching = true;
    btn.textContent = 'Searching...';
    btn.disabled = true;
    
    container.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Searching ${this.currentTarget === 'all' ? 'all sites' : this.currentTarget} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute if multiple sites are being checked.</p>
      </div>
    `;

    try {
      const data = await api.get(`/scrapers/search?q=${encodeURIComponent(this.currentQuery)}&scraper=${encodeURIComponent(this.currentTarget)}`);
      
      if (data.success) {
        this.results = data.results || [];
        this.renderResults();
      } else {
        throw new Error(data.error || 'Failed to search scrapers');
      }
      
    } catch (e) {
      console.error('Search error', e);
      container.innerHTML = `<div class="error-state">Failed to perform search: ${e.message}</div>`;
    } finally {
      this.isSearching = false;
      btn.textContent = 'Search';
      btn.disabled = false;
    }
  }

  renderResults() {
    const container = document.getElementById('scraper-results-container');
    if (!container) return;

    if (this.results.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🤷</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;
      return;
    }

    // Group by website for display if searching "all"
    let html = '<div class="library-grid">';

    this.results.forEach(result => {
      const coverUrl = result.cover || '/icon-192.png';
      html += `
        <div class="manga-card scraper-result-card" style="display: flex; flex-direction: column;">
          <div class="manga-card-cover">
            <img src="${coverUrl}" alt="Cover" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML='<div class=\\'placeholder\\'>🖼️</div>'">
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${result.website}</span>
              ${result.chapterCount ? `<span class="badge badge-chapters">${result.chapterCount} ch</span>` : ''}
            </div>
          </div>
          <div class="manga-info" style="padding: 8px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
            <div class="manga-card-title" title="${result.title}" style="margin-bottom: 8px;">${result.title}</div>
            <button class="btn btn-primary add-from-search-btn" data-url="${result.url}">+ Add</button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Bind add buttons
    setTimeout(() => {
      document.querySelectorAll('.add-from-search-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const url = e.target.dataset.url;
          this.openAddModal(url);
        });
      });
    }, 100);
  }

  openAddModal(url) {
    // In our app, there might be a modal for adding manga, or we just navigate to /add
    // Normally there's an 'add-manga-btn' listener globally.
    // If not, we can manually trigger the UI action.
    const addBtn = document.getElementById('add-manga-btn') || document.getElementById('mobile-add-btn');
    if (addBtn) {
      // Temporarily stash the URL so the modal can pick it up
      window.sessionStorage.setItem('prefillMangaUrl', url);
      addBtn.click();
    } else {
      alert("Please copy the URL and add it manually: " + url);
    }
  }
}

export default new ScraperView();
