import { api } from '../api.js';

class ScraperView {
  constructor() {
    this.container = null;
    this.scrapers = [];
    this.currentQuery = '';
    this.currentTarget = 'all';
    this.isSearching = false;
    this.results = [];
    this.activeSection = 'list'; // 'list' or 'search'
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
    const hashMatches = window.location.hash.match(/\?q=([^&]*)/);
    if (hashMatches && hashMatches[1]) {
      this.currentQuery = decodeURIComponent(hashMatches[1]);
      const scraperMatch = window.location.hash.match(/&scraper=([^&]*)/);
      if (scraperMatch && scraperMatch[1]) {
         this.currentTarget = decodeURIComponent(scraperMatch[1]);
      }
      this.activeSection = 'search';
      this.render();
      await this.loadScrapers();
      this.bindEvents();
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
        this.scrapers = data.scrapers;
        this.renderScraperList();
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
          <h1>🔌 Scrapers</h1>
          <p class="subtitle">All available manga scrapers and their capabilities.</p>
        </div>

        <div class="scrapers-tabs">
          <button class="scraper-tab-btn ${this.activeSection === 'list' ? 'active' : ''}" data-tab="list">
            <span class="tab-icon">📋</span> All Scrapers
          </button>
          <button class="scraper-tab-btn ${this.activeSection === 'search' ? 'active' : ''}" data-tab="search">
            <span class="tab-icon">🔍</span> Search
          </button>
        </div>

        ${this.activeSection === 'list' ? this.renderListSection() : this.renderSearchSection()}
      </div>
    `;
  }

  renderListSection() {
    return `
      <div id="scrapers-list-section" class="scrapers-section">
        <div class="scrapers-legend">
          <div class="legend-item">
            <span class="capability-pill capability-yes">✓</span>
            <span>Supported</span>
          </div>
          <div class="legend-item">
            <span class="capability-pill capability-no">✗</span>
            <span>Not available</span>
          </div>
          <div class="legend-item">
            <span class="capability-pill capability-soon">Soon</span>
            <span>Coming soon</span>
          </div>
        </div>
        <div id="scraper-cards-list" class="scraper-cards-grid">
          <div class="loading-state"><div class="spinner"></div><p>Loading scrapers...</p></div>
        </div>
      </div>
    `;
  }

  renderSearchSection() {
    return `
      <div id="scrapers-search-section" class="scrapers-section">
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

  renderScraperList() {
    const container = document.getElementById('scraper-cards-list');
    if (!container) return;

    if (this.scrapers.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔌</div>
          <p>No scrapers found.</p>
        </div>
      `;
      return;
    }

    // Determine capabilities for each scraper
    const scraperData = this.scrapers.map(s => {
      const name = s.name.toLowerCase();
      return {
        ...s,
        // Search: only comix.to and mangahere.cc
        canSearch: s.supportsSearch === true,
        // Adding: all scrapers support adding manga by URL
        canAdd: true,
        // Browsing: not yet implemented for any
        canBrowse: false
      };
    });

    let html = '';
    scraperData.forEach(s => {
      const domainIcon = this.getDomainIcon(s.name);
      html += `
        <div class="scraper-info-card">
          <div class="scraper-card-header">
            <div class="scraper-card-icon">${domainIcon}</div>
            <div class="scraper-card-name">
              <h3>${s.name}</h3>
              <span class="scraper-card-patterns">${s.urlPatterns.join(', ')}</span>
            </div>
          </div>
          <div class="scraper-card-capabilities">
            <div class="capability-row">
              <span class="capability-label">🔍 Search</span>
              ${s.canSearch 
                ? '<span class="capability-pill capability-yes">✓ Supported</span>' 
                : '<span class="capability-pill capability-no">✗ Not available</span>'}
            </div>
            <div class="capability-row">
              <span class="capability-label">➕ Adding</span>
              <span class="capability-pill capability-yes">✓ Supported</span>
            </div>
            <div class="capability-row">
              <span class="capability-label">📖 Browsing</span>
              <span class="capability-pill capability-soon">🚧 Coming soon</span>
            </div>
          </div>
          ${s.canSearch ? `<button class="btn btn-primary scraper-search-btn" data-scraper="${s.name}" style="width:100%; margin-top: 12px; font-size: 0.85rem;">🔍 Search ${s.name}</button>` : ''}
        </div>
      `;
    });

    container.innerHTML = html;

    // Bind search buttons on cards
    container.querySelectorAll('.scraper-search-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scraperName = e.target.dataset.scraper;
        this.currentTarget = scraperName;
        this.activeSection = 'search';
        this.render();
        this.loadScrapers();
        this.bindEvents();
        // Pre-select the scraper in the dropdown
        setTimeout(() => {
          const select = document.getElementById('scraper-target');
          if (select) select.value = scraperName;
          const input = document.getElementById('scraper-query');
          if (input) input.focus();
        }, 100);
      });
    });
  }

  getDomainIcon(name) {
    const lower = name.toLowerCase();
    if (lower.includes('comix')) return '📚';
    if (lower.includes('mangahere')) return '📖';
    if (lower.includes('nhentai')) return '🔞';
    if (lower.includes('chained')) return '⛓️';
    return '🌐';
  }

  renderScraperOptions() {
    const select = document.getElementById('scraper-target');
    if (!select) return;

    // Keep the "All Sites" option
    select.innerHTML = '<option value="all">🌐 All Sites</option>';
    
    const searchable = this.scrapers.filter(s => s.supportsSearch);
    searchable.forEach(s => {
      const option = document.createElement('option');
      option.value = s.name;
      option.textContent = s.name;
      if (this.currentTarget === s.name) option.selected = true;
      select.appendChild(option);
    });
  }

  bindEvents() {
    // Tab switching
    document.querySelectorAll('.scraper-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeSection = e.currentTarget.dataset.tab;
        this.render();
        this.loadScrapers();
        this.bindEvents();
      });
    });

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
      const rawCover = result.cover || '';
      // Use local cached path if available, otherwise proxy external URLs
      let coverUrl = '';
      if (rawCover.startsWith('/covers/')) {
        coverUrl = rawCover;
      } else if (rawCover) {
        coverUrl = `/api/scrapers/proxy-cover?url=${encodeURIComponent(rawCover)}`;
      }
      const coverHtml = coverUrl 
        ? `<img src="${coverUrl}" alt="Cover" loading="lazy" onerror="this.outerHTML='<div class=\\'placeholder\\'>📖</div>'">`
        : `<div class="placeholder">📖</div>`;
      html += `
        <div class="manga-card scraper-result-card" data-url="${result.url}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${coverHtml}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${result.website}</span>
              ${result.chapterCount ? `<span class="badge badge-chapters">${result.chapterCount} ch</span>` : ''}
            </div>
          </div>
          <div class="manga-card-title" title="${result.title}">${result.title}</div>
          <div style="padding: 0 8px 8px;">
            <button class="btn btn-primary add-from-search-btn" data-url="${result.url}" style="width: 100%; font-size: 0.8rem;">+ Add to Library</button>
          </div>
        </div>
      `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Bind card clicks - open URL in new tab
    setTimeout(() => {
      document.querySelectorAll('.scraper-result-card').forEach(card => {
        card.addEventListener('click', (e) => {
          // Don't navigate if they clicked the Add button
          if (e.target.closest('.add-from-search-btn')) return;
          window.open(card.dataset.url, '_blank');
        });
      });

      document.querySelectorAll('.add-from-search-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
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
