/**
 * ─────────────────────────────────────────────────────────────────────
 * SCRAPER TEMPLATE — Copy this file to create a new site scraper.
 * ─────────────────────────────────────────────────────────────────────
 * 
 * How to add a new scraper:
 * 
 * 1. Copy this file to `sites/mysite.js`
 * 2. Rename the class and fill in websiteName + urlPatterns
 * 3. Implement the methods you need (getMangaInfo, getChapterImages, etc.)
 *    using the shared features from `../features/`
 * 4. That's it! The scraper auto-registers on startup.
 *    (Files starting with _ are skipped, so this template won't load)
 * 
 * ─────────────────────────────────────────────────────────────────────
 * 
 * Architecture overview:
 * 
 *   sites/mysite.js        ← You are here (site-specific config)
 *       ↓ uses
 *   features/search.js     ← Shared search logic
 *   features/browse.js     ← Shared browse/catalog logic (with caching)
 *   features/chapter-images.js  ← Shared scroll-based image extraction
 *   features/quick-check.js     ← Shared update checking
 *       ↓ uses
 *   util/cloudflare.js     ← Cloudflare bypass helpers
 *   util/stealth-browser.js ← Stealth Puppeteer launcher
 *   util/scrolling.js      ← Scroll-to-load helpers
 *   util/flaresolverr.js   ← FlareSolverr proxy client
 *   util/pagination.js     ← Multi-page chapter collection
 *   util/chapters.js       ← Chapter deduplication
 * 
 * ─────────────────────────────────────────────────────────────────────
 */

import { BaseScraper } from '../base.js';
// Import only the features you need:
// import { search } from '../features/search.js';
// import { browse } from '../features/browse.js';
// import { extractChapterImages } from '../features/chapter-images.js';
// import { quickCheck } from '../features/quick-check.js';
// Import utilities as needed:
// import { launchBrowser } from '../util/stealth-browser.js';
// import { waitForCloudflare } from '../util/cloudflare.js';

export class MySiteScraper extends BaseScraper {

  // ─── REQUIRED: Identity ───────────────────────────────────────────

  /** Display name shown in the UI */
  get websiteName() { return 'mysite.com'; }

  /** URL patterns this scraper handles. Used for auto-detection. */
  get urlPatterns() { return ['mysite.com']; }

  // ─── OPTIONAL: Capability flags ───────────────────────────────────
  // Set these to true if you implement the corresponding method.

  get supportsSearch() { return false; }
  get supportsBrowse() { return false; }
  get supportsQuickCheck() { return false; }

  // ─── REQUIRED: getMangaInfo ───────────────────────────────────────
  // Fetches title, cover, description, and chapter list from a manga URL.
  // This is called when adding a manga to the library.

  async getMangaInfo(url) {
    await this.createPage();
    try {
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);

      const info = await this.page.evaluate(() => {
        const title = document.querySelector('h1')?.textContent.trim() || 'Unknown';
        const cover = document.querySelector('img.cover')?.src || null;
        const description = document.querySelector('.description')?.textContent.trim() || '';
        
        const chapters = [];
        document.querySelectorAll('a[href*="chapter"]').forEach(link => {
          const href = link.href;
          const text = link.textContent.trim();
          const numMatch = text.match(/(\d+(?:\.\d+)?)/);
          if (numMatch) {
            chapters.push({
              number: parseFloat(numMatch[1]),
              title: text,
              url: href,
            });
          }
        });

        return { title, cover, description, chapters };
      });

      return {
        url, website: this.websiteName, title: info.title,
        totalChapters: info.chapters.length, uniqueChapters: info.chapters.length,
        chapters: info.chapters, duplicateChapters: [],
        cover: info.cover, description: info.description,
      };
    } finally {
      await this.closePage();
    }
  }

  // ─── REQUIRED: getChapterImages ───────────────────────────────────
  // Returns an array of { index, url } for all images in a chapter.
  //
  // Option A: Use the shared feature (recommended for scroll-based sites)
  //
  //   async getChapterImages(chapterUrl) {
  //     return extractChapterImages(this, chapterUrl, {
  //       imgSelector: '.reader-page img',
  //       fallbackSelectors: '.chapter-content img',
  //       setupPage: async (page) => {
  //         // Set cookies, viewport, etc.
  //       },
  //     });
  //   }
  //
  // Option B: Custom implementation (for page-by-page navigation etc.)

  async getChapterImages(chapterUrl) {
    await this.createPageClean();
    try {
      await this.page.goto(chapterUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await this.randomDelay(1000, 2000);

      const images = await this.page.evaluate(() => {
        return Array.from(document.querySelectorAll('.reader img'))
          .map((img, i) => ({
            index: i + 1,
            url: img.src || img.dataset.src,
          }))
          .filter(img => img.url);
      });

      return images;
    } finally {
      await this.closePage();
    }
  }

  // ─── OPTIONAL: search ─────────────────────────────────────────────
  // Return array of { title, url, cover, chapterCount }.
  // Uses features/search.js — just provide config hooks.
  //
  //   async search(query) {
  //     return search(this, query, {
  //       buildSearchUrl: (q) => `https://mysite.com/search?q=${encodeURIComponent(q)}`,
  //       extractResults: async (page) => {
  //         return page.evaluate(() => {
  //           return Array.from(document.querySelectorAll('.search-result')).map(el => ({
  //             title: el.querySelector('.title')?.textContent.trim(),
  //             url: el.querySelector('a')?.href,
  //             cover: el.querySelector('img')?.src,
  //             chapterCount: 0,
  //           }));
  //         });
  //       },
  //       // Optional hooks:
  //       // setupPage: async (page) => { /* cookies, UA */ },
  //       // waitForResults: async (page) => { /* wait for React, lazy load */ },
  //       // postProcess: async (results, page, scraper) => { /* cover caching */ return results; },
  //     });
  //   }

  // ─── OPTIONAL: browse ─────────────────────────────────────────────
  // Catalog browsing with sort/filter/pagination.
  // Uses features/browse.js with built-in caching.
  //
  //   async browse(sort = 'popular', page = 1, query = '') {
  //     const { browse } = await import('../features/browse.js');
  //     return browse(this, sort, page, query, {
  //       cacheTtl: 15 * 60 * 1000, // 15 min cache — set to 0 to disable
  //       buildBrowseUrl: (s, p, q) => `https://mysite.com/browse?sort=${s}&page=${p}&q=${encodeURIComponent(q)}`,
  //       extractResults: async (page) => {
  //         return page.evaluate(() => {
  //           const results = Array.from(document.querySelectorAll('.gallery-item')).map(el => ({
  //             title: el.querySelector('.title')?.textContent.trim() || 'Unknown',
  //             url: el.querySelector('a')?.href,
  //             cover: el.querySelector('img')?.src,
  //           }));
  //           const totalPages = parseInt(document.querySelector('.pagination .last')?.textContent) || 1;
  //           return { results, totalPages };
  //         });
  //       },
  //       // Optional hooks:
  //       // setupPage: async (page) => { /* cookies */ },
  //       // waitForResults: async (page) => { /* cloudflare bypass */ },
  //     });
  //   }

  // ─── OPTIONAL: quickCheckUpdates ──────────────────────────────────
  // Fast check if new chapters exist (doesn't scrape all pages).
  // Uses features/quick-check.js.
  //
  //   async quickCheckUpdates(url, knownChapterUrls = []) {
  //     return quickCheck(url, knownChapterUrls, {
  //       fetchChapters: async (url) => {
  //         await this.createPage();
  //         try {
  //           await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  //           return this.page.evaluate(() => {
  //             return Array.from(document.querySelectorAll('a[href*="chapter"]')).map(link => ({
  //               number: parseFloat(link.textContent.match(/(\d+)/)?.[1] || 0),
  //               title: link.textContent.trim(),
  //               url: link.href,
  //             }));
  //           });
  //         } finally {
  //           await this.closePage();
  //         }
  //       },
  //     });
  //   }

  // ─── OPTIONAL: Site-specific methods ──────────────────────────────
  // You can add any custom methods your scraper needs. For example,
  // nhentai.js has getGalleryImageUrls() and streamChapterImages()
  // for its unique page-by-page and SSE streaming patterns.
  // These can be called from custom API routes if needed.
}

export default MySiteScraper;
