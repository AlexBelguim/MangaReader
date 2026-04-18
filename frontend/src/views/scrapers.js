import { api } from '../api.js';

class ScraperView {
  constructor() {
    this.container = null;
    this.scrapers = [];
    this.currentQuery = '';
    this.currentTarget = 'all';
    this.isSearching = false;
    this.results = [];
    
    // Browse State
    this.viewMode = 'main'; // 'main' | 'browse'
    this.browseScraper = null;
    this.browseQuery = 'english'; // Default for nhentai
    this.browseSort = 'popular-today';
    this.browsePage = 1;
    this.browseTotalPages = 1;
    this.isBrowsing = false;
    this.browseResults = [];
    
    // Preview State
    this.previewInfo = null;
    this.previewImages = [];
    this.previewIndex = 0;
  }

  async mount(params) {
    this.container = document.getElementById('app');
    
    // Set view layout if needed
    document.body.className = 'scrapers-mode';

    this.updateView();
    
    // Fetch available scrapers
    await this.loadScrapers();
    
    // Automatically search if there's a 'q' query param in the hash
    const hashMatches = window.location.hash.match(/\?q=([^&]*)/);
    if (hashMatches && hashMatches[1]) {
      this.currentQuery = decodeURIComponent(hashMatches[1]);
      this.updateView();
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
        this.updateView();
      }
    } catch (e) {
      console.error('Failed to load scrapers', e);
    }
  }

  updateView() {
    this.render();
    this.renderScraperList();
    if (this.results.length > 0 || this.isSearching) {
      this.renderResults();
    }
    this.bindEvents();
  }

  render() {
    this.container.innerHTML = `
      <div class="view-container scrapers-container" style="${this.viewMode === 'main' ? '' : 'display: none;'}">
        <div class="view-header">
          <h1>🔌 Scrapers</h1>
          <p class="subtitle">All available manga scrapers and their capabilities.</p>
        </div>

        <div class="scrapers-section" style="margin-bottom: 2rem;">
          <div class="scraper-search-box">
            <form id="scraper-search-form" class="search-form" style="display: flex; gap: 8px; flex-direction: column;">
              ${this.currentTarget !== 'all' ? `
                <div class="search-target-badge" style="align-self: flex-start; margin-bottom: 4px;">
                  <span class="badge" style="background-color: var(--primary-color); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
                    Searching: ${this.currentTarget} 
                    <button type="button" id="clear-target-btn" style="background: none; border: none; color: white; cursor: pointer; font-weight: bold; font-size: 1rem; padding: 0; line-height: 1;">×</button>
                  </span>
                </div>
              ` : ''}
              <div style="display: flex; gap: 8px; width: 100%;">
                <input type="text" id="scraper-query" placeholder="Enter manga title to search${this.currentTarget !== 'all' ? ` in ${this.currentTarget}` : ' all sites'}..." value="${this.currentQuery}" required style="flex: 1;">
                <button type="submit" class="btn btn-primary" id="scraper-search-btn">Search</button>
              </div>
            </form>
          </div>
          
          <div id="scraper-results-container" class="scraper-results" style="${this.results.length > 0 || this.isSearching ? '' : 'display: none; margin-top: 1.5rem;'}">
             <div class="empty-state">
               <div class="empty-icon">🔎</div>
               <p>Type a title above to search across available scrapers.</p>
             </div>
          </div>
        </div>

        <div id="scrapers-list-section" class="scrapers-section">
          <h2 style="margin-bottom: 1rem;">Available Scrapers</h2>
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
      </div>

      <!-- BROWSE VIEW -->
      <div id="browse-container" class="view-container" style="${this.viewMode === 'browse' ? '' : 'display: none;'}">
        <div class="view-header" style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <button id="exit-browse-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem;">← Back</button>
          <h1 style="margin: 0; display: flex; align-items: center; gap: 0.5rem;">
             ${this.browseScraper ? this.getDomainIcon(this.browseScraper) : '🌐'} Browse: ${this.browseScraper}
          </h1>
        </div>

        <div class="browse-controls" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; background: var(--card-bg); padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="flex: 1; min-width: 200px;">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 0.3rem; color: var(--text-muted);">Query / Filters</label>
            <input type="text" id="browse-query" value="${this.browseQuery}" placeholder="e.g. english, parody, etc." style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
          </div>
          <div style="min-width: 150px;">
            <label style="display: block; font-size: 0.85rem; margin-bottom: 0.3rem; color: var(--text-muted);">Sort By</label>
            <select id="browse-sort" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-color); background: var(--bg-color); color: var(--text-color);">
              <option value="popular-today" ${this.browseSort === 'popular-today' ? 'selected' : ''}>Popular Today</option>
              <option value="popular-week" ${this.browseSort === 'popular-week' ? 'selected' : ''}>Popular This Week</option>
              <option value="popular" ${this.browseSort === 'popular' ? 'selected' : ''}>Popular All Time</option>
              <option value="date" ${this.browseSort === 'date' ? 'selected' : ''}>Latest</option>
            </select>
          </div>
          <div style="display: flex; align-items: flex-end;">
            <button id="browse-apply-btn" class="btn btn-primary" style="height: 38px;">Apply Filters</button>
          </div>
        </div>

        <div id="browse-results-container" class="library-grid" style="margin-bottom: 2rem;">
          <!-- Results will go here -->
        </div>

        <div id="browse-pagination" style="text-align: center; margin-top: 1rem; margin-bottom: 2rem; display: none;">
          <button id="browse-load-more-btn" class="btn btn-secondary" style="min-width: 200px; padding: 0.75rem;">Load Next Page</button>
          <div id="browse-loading-indicator" style="display: none; margin-top: 1rem;">
             <div class="spinner" style="margin: 0 auto;"></div>
             <p style="margin-top: 0.5rem;">Loading page <span id="browse-loading-page"></span>...</p>
          </div>
        </div>
      </div>

      <!-- INFO MODAL -->
      <div id="preview-info-modal" class="modal-overlay" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center;">
        <div class="modal-content" style="background: var(--card-bg); max-width: 600px; width: 90%; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;">
           <div id="preview-info-body" style="padding: 1.5rem; overflow-y: auto;">
              <!-- Info content -->
           </div>
           <div style="padding: 1rem 1.5rem; background: var(--bg-color); display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-color);">
              <button id="preview-close-btn" class="btn btn-secondary">Close</button>
              <button id="preview-add-btn" class="btn btn-primary">Add to Library</button>
              <button id="preview-read-btn" class="btn btn-primary" style="background: var(--success-color);">📖 Read Now</button>
           </div>
        </div>
      </div>

      <!-- TEMPORARY READER FULLSCREEN -->
      <div id="temp-reader-overlay" style="display: none; position: fixed; inset: 0; background: #000; z-index: 2000; flex-direction: column;">
        <div class="reader-toolbar" style="background: rgba(0,0,0,0.8); color: white; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333;">
           <div style="display: flex; align-items: center; gap: 1rem;">
             <button id="temp-reader-close" style="background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer; padding: 0;">←</button>
             <h3 id="temp-reader-title" style="margin: 0; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 60vw;">Preview</h3>
           </div>
           <div id="temp-reader-counter" style="font-size: 0.9rem; color: #aaa;">0 / 0</div>
        </div>
        <div id="temp-reader-scroll" style="flex: 1; overflow-y: auto; text-align: center; padding: 20px 0; scroll-behavior: smooth;">
           <div id="temp-reader-images" style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
             <!-- Images go here -->
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
      return {
        ...s,
        canSearch: s.supportsSearch === true,
        canAdd: true,
        canBrowse: s.supportsBrowse === true
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
              ${s.canBrowse 
                ? '<span class="capability-pill capability-yes">✓ Supported</span>' 
                : '<span class="capability-pill capability-soon">🚧 Coming soon</span>'}
            </div>
          </div>
          <div class="scraper-card-actions" style="margin-top: 16px; display: flex; gap: 8px;">
            <button class="btn btn-secondary scraper-search-card-btn" data-scraper="${s.name}" ${!s.canSearch ? 'disabled' : ''} style="flex: 1; font-size: 0.85rem;" title="${s.canSearch ? `Search in ${s.name}` : 'Search not supported'}">
              🔍 Search
            </button>
            <button class="btn btn-secondary scraper-browse-card-btn" data-scraper="${s.name}" ${!s.canBrowse ? 'disabled' : ''} style="flex: 1; font-size: 0.85rem;" title="${s.canBrowse ? `Browse ${s.name}` : 'Browsing coming soon'}">
              📖 Browse
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  getDomainIcon(name) {
    const lower = name.toLowerCase();
    if (lower.includes('comix')) return '📚';
    if (lower.includes('mangahere')) return '📖';
    if (lower.includes('nhentai')) return '🔞';
    if (lower.includes('chained')) return '⛓️';
    return '🌐';
  }

  bindEvents() {
    const form = document.getElementById('scraper-search-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const queryInput = document.getElementById('scraper-query');
        
        if (queryInput && queryInput.value.trim()) {
          this.currentQuery = queryInput.value.trim();
          // We don't reset currentTarget to 'all' here, so they can keep searching the current target
          this.performSearch();
        }
      });
    }

    const clearTargetBtn = document.getElementById('clear-target-btn');
    if (clearTargetBtn) {
      clearTargetBtn.addEventListener('click', () => {
        this.currentTarget = 'all';
        this.updateView();
        
        const queryInput = document.getElementById('scraper-query');
        if (queryInput) {
          queryInput.focus();
        }
      });
    }

      document.querySelectorAll('.scraper-search-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scraperName = e.target.dataset.scraper;
        this.currentTarget = scraperName;
        
        const queryInput = document.getElementById('scraper-query');
        // Save current query if user was typing
        if (queryInput) {
          this.currentQuery = queryInput.value.trim();
        }

        this.updateView();

        const updatedQueryInput = document.getElementById('scraper-query');
        if (updatedQueryInput) {
           updatedQueryInput.focus();
           window.scrollTo({ top: 0, behavior: 'smooth' });
           
           if (this.currentQuery) {
             this.performSearch();
           }
        }
      });
    });

    document.querySelectorAll('.scraper-browse-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scraperName = e.target.dataset.scraper;
        this.browseScraper = scraperName;
        this.viewMode = 'browse';
        this.browsePage = 1;
        this.browseResults = [];
        this.browseTotalPages = 1;
        this.updateView();
        this.performBrowse();
      });
    });

    // Browse Events
    const exitBrowseBtn = document.getElementById('exit-browse-btn');
    if (exitBrowseBtn) {
      exitBrowseBtn.addEventListener('click', () => {
        this.viewMode = 'main';
        this.updateView();
      });
    }

    const browseApplyBtn = document.getElementById('browse-apply-btn');
    if (browseApplyBtn) {
      browseApplyBtn.addEventListener('click', () => {
        this.browseQuery = document.getElementById('browse-query').value.trim();
        this.browseSort = document.getElementById('browse-sort').value;
        this.browsePage = 1;
        this.browseResults = [];
        this.performBrowse();
      });
    }

    const browseQueryInput = document.getElementById('browse-query');
    if (browseQueryInput) {
       browseQueryInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            browseApplyBtn.click();
          }
       });
    }

    const loadMoreBtn = document.getElementById('browse-load-more-btn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        if (!this.isBrowsing && this.browsePage < this.browseTotalPages) {
          this.browsePage++;
          this.performBrowse(true);
        }
      });
    }

    // Modal Events
    const previewCloseBtn = document.getElementById('preview-close-btn');
    if (previewCloseBtn) {
       previewCloseBtn.addEventListener('click', () => {
          document.getElementById('preview-info-modal').style.display = 'none';
       });
    }

    const previewAddBtn = document.getElementById('preview-add-btn');
    if (previewAddBtn) {
       previewAddBtn.addEventListener('click', () => {
          if (this.previewInfo && this.previewInfo.url) {
             this.openAddModal(this.previewInfo.url);
             document.getElementById('preview-info-modal').style.display = 'none';
          }
       });
    }

    const previewReadBtn = document.getElementById('preview-read-btn');
    if (previewReadBtn) {
       previewReadBtn.addEventListener('click', () => {
          this.openTempReader();
       });
    }

    const readerCloseBtn = document.getElementById('temp-reader-close');
    if (readerCloseBtn) {
       readerCloseBtn.addEventListener('click', () => {
          document.getElementById('temp-reader-overlay').style.display = 'none';
       });
    }
    
    // Intersection Observer for images in temp reader
    this.setupReaderObserver();
  }

  async performSearch() {
    const container = document.getElementById('scraper-results-container');
    const btn = document.getElementById('scraper-search-btn');
    
    if (!container || !btn) return;
    
    this.isSearching = true;
    container.style.display = 'block';
    
    btn.textContent = 'Searching...';
    btn.disabled = true;
    
    const targetDisplay = this.currentTarget === 'all' ? 'all sites' : this.currentTarget;
    
    container.innerHTML = `
      <div class="loading-state" style="margin-top: 2rem;">
        <div class="spinner"></div>
        <p>Searching ${targetDisplay} for "${this.currentQuery}"...</p>
        <p class="subtitle">This may take a minute...</p>
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
      container.innerHTML = `<div class="error-state" style="margin-top: 2rem;">Failed to perform search: ${e.message}</div>`;
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
        <div class="empty-state" style="margin-top: 2rem;">
          <div class="empty-icon">🤷</div>
          <p>No results found for "${this.currentQuery}".</p>
        </div>
      `;
      return;
    }

    let html = '<div class="library-grid" style="margin-top: 2rem;">';

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
  async performBrowse(append = false) {
    const container = document.getElementById('browse-results-container');
    const loadBtn = document.getElementById('browse-load-more-btn');
    const loadingIndicator = document.getElementById('browse-loading-indicator');
    const pagination = document.getElementById('browse-pagination');
    
    if (!container) return;
    
    this.isBrowsing = true;
    
    if (!append) {
      container.innerHTML = `
        <div class="loading-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="spinner"></div>
          <p>Browsing ${this.browseScraper}...</p>
        </div>
      `;
      pagination.style.display = 'none';
    } else {
      loadBtn.style.display = 'none';
      loadingIndicator.style.display = 'block';
      document.getElementById('browse-loading-page').textContent = this.browsePage;
    }

    try {
      const url = `/scrapers/browse?scraper=${encodeURIComponent(this.browseScraper)}&q=${encodeURIComponent(this.browseQuery)}&sort=${encodeURIComponent(this.browseSort)}&page=${this.browsePage}`;
      const data = await api.get(url);
      
      if (data.success) {
        if (append) {
           this.browseResults = [...this.browseResults, ...(data.results || [])];
        } else {
           this.browseResults = data.results || [];
        }
        this.browseTotalPages = data.totalPages || 1;
        this.renderBrowseResults(append);
      } else {
        throw new Error(data.error || 'Failed to browse');
      }
      
    } catch (e) {
      console.error('Browse error', e);
      if (!append) {
        container.innerHTML = `<div class="error-state" style="grid-column: 1/-1; margin-top: 2rem;">Failed to load browse results: ${e.message}</div>`;
      } else {
        alert("Failed to load more results: " + e.message);
      }
    } finally {
      this.isBrowsing = false;
      if (append) {
        loadBtn.style.display = 'inline-block';
        loadingIndicator.style.display = 'none';
      }
    }
  }

  renderBrowseResults(append) {
    const container = document.getElementById('browse-results-container');
    const pagination = document.getElementById('browse-pagination');
    
    if (this.browseResults.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; margin-top: 2rem;">
          <div class="empty-icon">🤷</div>
          <p>No results found.</p>
        </div>
      `;
      pagination.style.display = 'none';
      return;
    }

    let html = '';
    
    // We only need to generate HTML for the new items if appending, but for simplicity we re-render the whole list
    // A better approach is to append children, but since this is an admin/tool UI, full re-render is usually fine up to a few hundred items.
    this.browseResults.forEach((result, idx) => {
      const rawCover = result.cover || '';
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
        <div class="manga-card browse-result-card" data-index="${idx}" style="cursor: pointer;">
          <div class="manga-card-cover">
            ${coverHtml}
            <div class="manga-card-badges">
              <span class="badge badge-scraper">${result.website || this.browseScraper}</span>
            </div>
          </div>
          <div class="manga-card-title" title="${result.title}">${result.title}</div>
        </div>
      `;
    });

    container.innerHTML = html;
    
    if (this.browsePage < this.browseTotalPages) {
       pagination.style.display = 'block';
    } else {
       pagination.style.display = 'none';
    }

    // Bind clicks to open Info Modal
    setTimeout(() => {
      document.querySelectorAll('.browse-result-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.dataset.index);
          const result = this.browseResults[idx];
          if (result) {
            this.openInfoModal(result);
          }
        });
      });
    }, 100);
  }

  async openInfoModal(result) {
    const modal = document.getElementById('preview-info-modal');
    const body = document.getElementById('preview-info-body');
    const readBtn = document.getElementById('preview-read-btn');
    
    this.previewInfo = result; // basic info from search result
    
    modal.style.display = 'flex';
    body.innerHTML = `
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap;">
         <div style="flex: 0 0 200px; max-width: 100%;">
            <div class="manga-card-cover" style="height: 280px; border-radius: 8px;">
               ${result.cover ? `<img src="${result.cover.startsWith('/covers/') ? result.cover : '/api/scrapers/proxy-cover?url=' + encodeURIComponent(result.cover)}" style="width: 100%; height: 100%; object-fit: cover;">` : '<div class="placeholder">📖</div>'}
            </div>
         </div>
         <div style="flex: 1; min-width: 250px;">
            <h2 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.5rem;">${result.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 1rem;">${result.website || this.browseScraper}</p>
            <div id="preview-extended-info" class="loading-state" style="padding: 1rem 0; min-height: 100px; justify-content: flex-start; align-items: flex-start;">
               <div class="spinner" style="width: 24px; height: 24px; margin-bottom: 0.5rem;"></div>
               <p style="font-size: 0.9rem;">Fetching details...</p>
            </div>
         </div>
      </div>
    `;
    
    readBtn.disabled = true;

    try {
       const data = await api.get(`/scrapers/info?url=${encodeURIComponent(result.url)}`);
       if (data.success && data.info) {
          this.previewInfo = { ...this.previewInfo, ...data.info };
          
          let tagsHtml = '';
          if (data.info.tags && data.info.tags.length > 0) {
             tagsHtml = `
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Tags</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${data.info.tags.map(t => `<span class="badge" style="background: var(--bg-color); border: 1px solid var(--border-color); color: var(--text-color); font-weight: normal; font-size: 0.75rem;">${t}</span>`).join('')}
                 </div>
               </div>
             `;
          }
          
          let artistsHtml = '';
          if (data.info.artists && data.info.artists.length > 0) {
             artistsHtml = `
               <div style="margin-top: 1rem;">
                 <h4 style="margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">Artists</h4>
                 <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${data.info.artists.map(a => `<span class="badge badge-chapters">${a}</span>`).join('')}
                 </div>
               </div>
             `;
          }

          document.getElementById('preview-extended-info').innerHTML = `
             <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; background: var(--bg-color); padding: 1rem; border-radius: 8px;">
               <div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">Pages / Ch</div>
                  <div style="font-weight: bold;">${data.info.pageCount || data.info.totalChapters || '?'}</div>
               </div>
               ${data.info.displayId ? `
                 <div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">Gallery ID</div>
                    <div style="font-weight: bold;">${data.info.displayId}</div>
                 </div>
               ` : ''}
             </div>
             ${artistsHtml}
             ${tagsHtml}
          `;
          
          readBtn.disabled = false;
       } else {
          document.getElementById('preview-extended-info').innerHTML = `<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Could not fetch extra details.</p>`;
          // Still allow reading if it's nhentai because we can use galleryId directly if it was parsed
          if (this.previewInfo.galleryId || this.previewInfo.url) {
             readBtn.disabled = false;
          }
       }
    } catch (e) {
       console.error("Info error:", e);
       document.getElementById('preview-extended-info').innerHTML = `<p class="error-state" style="margin:0; padding:1rem; text-align:left;">Failed to load details: ${e.message}</p>`;
       readBtn.disabled = false; // Let them try
    }
  }

  async openTempReader() {
    const readerOverlay = document.getElementById('temp-reader-overlay');
    const imagesContainer = document.getElementById('temp-reader-images');
    const counter = document.getElementById('temp-reader-counter');
    const title = document.getElementById('temp-reader-title');
    
    if (!this.previewInfo) return;
    
    // Hide info modal, show reader
    document.getElementById('preview-info-modal').style.display = 'none';
    readerOverlay.style.display = 'flex';
    title.textContent = this.previewInfo.title || 'Loading...';
    counter.textContent = 'Starting stream...';
    imagesContainer.innerHTML = `<div id="stream-spinner" class="spinner" style="margin: 50px auto;"></div><div id="stream-status" style="color:white;text-align:center;">Connecting to scraper...</div>`;
    
    try {
       // Close existing SSE connection if active
       if (this.previewEventSource) {
           this.previewEventSource.close();
       }
       
       this.previewImages = [];
       
       let apiUrl = `/api/scrapers/preview-images-stream?scraper=${encodeURIComponent(this.browseScraper || this.previewInfo.website)}`;
       if (this.previewInfo.galleryId) {
          apiUrl += `&galleryId=${this.previewInfo.galleryId}`;
       } else if (this.previewInfo.displayId) {
          apiUrl += `&galleryId=${this.previewInfo.displayId}`;
       } else {
          apiUrl += `&url=${encodeURIComponent(this.previewInfo.url)}`;
       }
       
       // Append token manually since EventSource doesn't use standard fetch headers
       const token = localStorage.getItem('manga_auth_token');
       if (token) {
          // This allows backend auth to pass if it checks query string, though we bypassed it for proxy.
          // Wait, preview-images-stream IS protected by auth! We must send the token.
          // In express, we usually don't accept tokens in query string by default.
       }
       
       // Actually, EventSource might hit 401. Let's use fetch API to stream!
       const fetchStreamUrl = apiUrl.replace('/api', ''); // remove /api to use the api wrapper
       
       // Because api.get doesn't stream, we'll do a custom fetch with auth headers
       const headers = { 'Authorization': `Bearer ${token || ''}` };
       
       // We'll use a standard SSE EventSource since Vite proxy sends cookies/etc,
       // but wait, JWT is usually in headers. Let's use fetch and read the stream manually!
       
       const response = await fetch('/api' + fetchStreamUrl, { headers });
       
       if (!response.ok) {
           throw new Error(`Failed to start stream: ${response.statusText}`);
       }
       
       const reader = response.body.getReader();
       const decoder = new TextDecoder();
       let buffer = '';
       let totalImagesCount = '?';
       
       // Setup observer once
       setTimeout(() => {
          this.setupReaderObserver();
       }, 100);

       while (true) {
           const { value, done } = await reader.read();
           if (done) break;
           
           buffer += decoder.decode(value, { stream: true });
           const lines = buffer.split('\n\n');
           buffer = lines.pop(); // Keep incomplete chunk in buffer
           
           for (const line of lines) {
               if (line.startsWith('data: ')) {
                   const jsonStr = line.substring(6);
                   try {
                       const data = JSON.parse(jsonStr);
                       
                       if (data.type === 'metadata') {
                           totalImagesCount = data.pageCount;
                           title.textContent = data.title;
                           document.getElementById('stream-status').textContent = `Found ${totalImagesCount} pages. Fetching...`;
                           counter.textContent = `0 / ${totalImagesCount}`;
                       } else if (data.type === 'image') {
                           // Remove spinner on first image
                           const spinner = document.getElementById('stream-spinner');
                           if (spinner) spinner.remove();
                           const status = document.getElementById('stream-status');
                           if (status) status.remove();
                           
                           this.previewImages.push(data.url);
                           
                           const proxiedUrl = `/api/scrapers/proxy-cover?url=${encodeURIComponent(data.url)}`;
                           const imgContainer = document.createElement('div');
                           imgContainer.className = "reader-page-container";
                           imgContainer.style.cssText = "min-height: 50vh; display: flex; align-items: center; justify-content: center;";
                           
                           imgContainer.innerHTML = `<img class="reader-preview-img" data-index="${data.index}" data-src="${proxiedUrl}" style="max-width: 100vw; max-height: 100vh; object-fit: contain;">`;
                           
                           imagesContainer.appendChild(imgContainer);
                           
                           // Observe new image
                           const newImg = imgContainer.querySelector('img');
                           if (this.imageObserver) {
                               this.imageObserver.observe(newImg);
                           }
                           
                           counter.textContent = `${data.index} / ${totalImagesCount}`;
                       } else if (data.type === 'error') {
                           throw new Error(data.message);
                       } else if (data.type === 'done') {
                           // Done!
                           break;
                       }
                   } catch (e) {
                       console.error("Parse error for SSE data:", e);
                   }
               }
           }
       }
       
    } catch (e) {
       console.error("Preview reader error:", e);
       imagesContainer.innerHTML = `<div style="color:red; padding: 50px;">Failed to load images: ${e.message}</div>`;
    }
  }

  setupReaderObserver() {
    this.imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Lazy load
          if (img.dataset.src && !img.src) {
             img.src = img.dataset.src;
             // Don't remove dataset.src so we can track it
          }
          // Update counter (take highest visible index)
          const index = parseInt(img.dataset.index);
          const total = this.previewImages ? this.previewImages.length : '?';
          document.getElementById('temp-reader-counter').textContent = `${index} / ${total}`;
        }
      });
    }, {
      root: document.getElementById('temp-reader-scroll'),
      rootMargin: '100% 0px 100% 0px', // Pre-load 1 screen above and below
      threshold: 0.1
    });
  }
}

export default new ScraperView();
