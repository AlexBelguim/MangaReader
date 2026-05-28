import { BaseScraper } from '../base.js';
import { launchBrowser } from '../util/stealth-browser.js';
import { waitForCloudflare } from '../util/cloudflare.js';

// Gallery image URLs are immutable, so cache them briefly to avoid relaunching
// a browser every time the same gallery is reopened in the reader.
const GALLERY_URL_CACHE = new Map(); // galleryId -> { ts, data }
const GALLERY_URL_CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const GALLERY_URL_CACHE_MAX = 200;

/**
 * Scraper for nhentai.net website
 * 
 * URL format: https://nhentai.net/g/[gallery_id]/
 * Page format: https://nhentai.net/g/[gallery_id]/[page_number]/
 * 
 * These are single-gallery "chapters" with many pages.
 * Uses puppeteer-extra with stealth plugin for Cloudflare bypass.
 * Page-by-page navigation (not scroll-based), so does NOT use chapter-images feature.
 */
export class NhentaiScraper extends BaseScraper {
  get websiteName() { return 'nhentai.net'; }
  get urlPatterns() { return ['nhentai.net/g/']; }

  getGalleryId(url) {
    const match = url.match(/\/g\/(\d+)/);
    return match ? match[1] : null;
  }

  async getMangaInfo(url, options = {}) {
    const { browser, page } = await launchBrowser({ stealth: true });

    if (options.signal?.aborted) {
      await browser.close();
      throw new Error('Aborted');
    }

    const abortHandler = () => {
      console.log(`  [nhentai] Abort signal received for getMangaInfo. Closing page...`);
      page.close().catch(() => {});
    };

    if (options.signal) {
      options.signal.addEventListener('abort', abortHandler);
    }

    try {
      const galleryId = this.getGalleryId(url);
      if (!galleryId) throw new Error('Invalid nhentai URL - could not extract gallery ID');

      console.log(`  Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await waitForCloudflare(page, { delayFn: () => this.randomDelay(2000, 3000) });
      await this.randomDelay(1000, 2000);

      if (options.signal?.aborted) {
        throw new Error('Aborted');
      }

      const info = await page.evaluate(() => {
        const titleEl = document.querySelector('#info h1, #info h2, .title');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';

        const coverEl = document.querySelector('#cover img, .cover img');
        let cover = null;
        if (coverEl) cover = coverEl.getAttribute('data-src') || coverEl.src;

        let pageCount = 1;
        const pageTags = document.querySelectorAll('.tag-container');
        for (const pt of pageTags) {
          if (pt.textContent.includes('Pages:')) {
             const nameEl = pt.querySelector('.name');
             if (nameEl) pageCount = parseInt(nameEl.textContent) || 1;
             break;
          }
        }

        const artists = [];
        const artistTags = document.querySelectorAll('a[href*="/artist/"] .name, .tag-container:has(a[href*="/artist/"]) .name');
        artistTags.forEach(el => {
          const name = el.textContent.trim();
          if (name && !artists.includes(name)) artists.push(name);
        });
        if (artists.length === 0) {
          document.querySelectorAll('.tag-container').forEach(container => {
            const label = container.querySelector('.tags, span');
            if (label && label.textContent.toLowerCase().includes('artist')) {
              container.querySelectorAll('.tag .name').forEach(tag => {
                const name = tag.textContent.trim();
                if (name && !artists.includes(name)) artists.push(name);
              });
            }
          });
        }

        const allTags = [];
        document.querySelectorAll('.tag-container .tag .name').forEach(el => {
          allTags.push(el.textContent.trim());
        });

        return { title, cover, pageCount, artists, tags: allTags };
      });

      console.log(`  Title: ${info.title}`);
      console.log(`  Gallery ID: ${galleryId}`);
      console.log(`  Pages: ${info.pageCount}`);
      console.log(`  Artists: ${info.artists.join(', ') || 'Unknown'}`);

      return {
        url, title: info.title, displayId: galleryId,
        website: this.websiteName, cover: info.cover,
        description: '', artists: info.artists,
        totalChapters: 1, uniqueChapters: 1,
        chapters: [{ number: 1, title: info.title, url, pageCount: info.pageCount }],
        duplicateChapters: [], pageCount: info.pageCount
      };
    } finally {
      if (options.signal) {
        options.signal.removeEventListener('abort', abortHandler);
      }
      await browser.close();
    }
  }

  async getChapterImages(chapterUrl) {
    const galleryId = this.getGalleryId(chapterUrl) || chapterUrl;
    if (!galleryId) throw new Error('Invalid nhentai URL');

    // Derive full-resolution image URLs from the gallery overview in a single
    // page load. Navigating the per-page reader (one request per page) gets
    // HTTP 429 rate-limited partway through large galleries, leaving pages
    // missing. The derived i*.nhentai.net URLs are the same full-res files the
    // reader serves.
    const { images, pageCount } = await this.getGalleryImageUrls(galleryId);

    if (images.length === 0) throw new Error('Could not extract any images');
    console.log(`  Found ${images.length}/${pageCount || images.length} images`);
    if (pageCount && images.length < pageCount) {
      throw new Error(`Failed to fetch ${pageCount - images.length} images (got ${images.length}/${pageCount})`);
    }

    return images.map((url, i) => ({ index: i + 1, url }));
  }

  // Stream chapter images one by one using an async generator.
  // Derives full-res URLs from the gallery overview in a single page load to
  // avoid the per-page reader 429 rate-limiting that left galleries incomplete.
  async *streamChapterImages(chapterUrl, options = {}) {
    if (options.signal?.aborted) throw new Error('Aborted');

    const galleryId = this.getGalleryId(chapterUrl) || chapterUrl; // Allow passing galleryId directly
    if (!galleryId) throw new Error('Invalid nhentai URL');

    console.log(`  [Stream] Fetching images for gallery ${galleryId}...`);

    let images, title, pageCount;
    try {
      ({ images, title, pageCount } = await this.getGalleryImageUrls(galleryId, { signal: options.signal }));
    } catch (err) {
      // A client-initiated abort tears the browser down mid-navigation, which
      // surfaces as a puppeteer "frame detached" error — not a real failure.
      if (options.signal?.aborted) return;
      throw err;
    }

    if (options.signal?.aborted) return;
    if (images.length === 0) throw new Error('Could not extract any images');

    yield { type: 'metadata', pageCount: pageCount || images.length, title };

    for (let i = 0; i < images.length; i++) {
      if (options.signal?.aborted) {
        console.log(`  [Stream] Client aborted stream for gallery ${galleryId}.`);
        break;
      }
      yield { type: 'image', index: i + 1, url: images[i] };
    }
  }

  // ==================== SEARCH & BROWSE ====================

  get supportsSearch() { return true; }
  get supportsBrowse() { return true; }

  /**
   * Search for galleries by query
   */
  async search(query) {
    // Search is effectively a browse by popular with a text query
    const data = await this.browse('popular', 1, query);
    return data.results.map(r => ({
      title: r.title,
      url: r.url,
      cover: r.cover,
      chapterCount: 1 // nhentai is single gallery
    }));
  }
  /**
   * Browse nhentai search results with sort & pagination.
   * @param {string} sort - One of: 'date', 'popular-today', 'popular-week', 'popular'
   * @param {number} page - Page number (1-based)
   * @param {string} query - Search query (default: 'english')
   * @returns {{ results: Array, totalPages: number, currentPage: number }}
   */
  async browse(sort = 'popular-today', page = 1, query = 'english', refresh = false, options = {}) {
    const { browse } = await import('../features/browse.js');
    const { waitForCloudflare } = await import('../util/cloudflare.js');

    return browse(this, sort, page, query, {
      cacheTtl: 24 * 60 * 60 * 1000, // 24 hour cache per sort/query/page combo
      buildBrowseUrl: (s, p, q) => `https://nhentai.net/search/?q=${encodeURIComponent(q)}&sort=${s}&page=${p}`,
      waitForResults: async (p) => await waitForCloudflare(p, { delayFn: () => this.randomDelay(2000, 3000) }),
      extractResults: async (p) => {
        return await p.evaluate(() => {
          const results = [];
          const galleries = document.querySelectorAll('.gallery');

          galleries.forEach(gallery => {
            const linkEl = gallery.querySelector('a');
            const imgEl = gallery.querySelector('img');
            const captionEl = gallery.querySelector('.caption');

            if (!linkEl) return;

            const href = linkEl.getAttribute('href') || '';
            const galleryIdMatch = href.match(/\/g\/(\d+)\//);
            if (!galleryIdMatch) return;

            // Get cover - prefer data-src (lazy loaded) over src
            let cover = null;
            if (imgEl) {
              cover = imgEl.getAttribute('data-src') || imgEl.src;
            }

            results.push({
              galleryId: galleryIdMatch[1],
              title: captionEl ? captionEl.textContent.trim() : 'Unknown',
              cover,
              url: `https://nhentai.net${href}`
            });
          });

          // Get total pages
          const lastPageLink = document.querySelector('.pagination a.last');
          let totalPages = 1;
          if (lastPageLink) {
             const href = lastPageLink.getAttribute('href');
             const pageMatch = href.match(/page=(\d+)/);
             if (pageMatch) totalPages = parseInt(pageMatch[1]);
          } else {
             // Maybe we're on the last page or only one page
             const currentPageEl = document.querySelector('.pagination .current');
             if (currentPageEl) totalPages = parseInt(currentPageEl.textContent);
          }


        return { results, totalPages };
        });
      }
    }, refresh, options);
  }

  /**
   * Get all image URLs for a gallery (for inline viewing without download).
   * @param {string} galleryId - The nhentai gallery ID
   * @returns {{ images: string[], title: string, pageCount: number }}
   */
  async getGalleryImageUrls(galleryId, options = {}) {
    if (options.signal?.aborted) throw new Error('Aborted');

    const cached = GALLERY_URL_CACHE.get(galleryId);
    if (cached && Date.now() - cached.ts < GALLERY_URL_CACHE_TTL) {
      console.log(`  [nhentai] Gallery ${galleryId}: served ${cached.data.images.length} image URLs from cache`);
      return cached.data;
    }

    const { browser, page } = await launchBrowser({ stealth: true });

    // Tear the browser down immediately if the caller aborts (e.g. the reader
    // is closed mid-fetch) instead of waiting for navigation to finish.
    const abortHandler = () => {
      console.log(`  [nhentai] Abort received for gallery ${galleryId}. Closing browser...`);
      browser.close().catch(() => {});
    };
    if (options.signal) options.signal.addEventListener('abort', abortHandler);

    try {
      console.log(`  [nhentai] Fast fetching images for gallery ${galleryId} via thumbnails...`);

      let totalPages = 1;
      let title = 'Unknown';
      // Dedup by page number — nhentai usually serves every thumbnail on one
      // page, so a pagination "next" widget (if present) can re-serve the same
      // thumbs. Keying by page number prevents duplicates and runaway looping.
      const byPage = new Map(); // page number -> thumbnail URL
      let currentPage = 1;
      let hasMoreThumbPages = true;
      const MAX_THUMB_PAGES = 30; // safety cap against an unbounded "next" link

      while (hasMoreThumbPages && currentPage <= MAX_THUMB_PAGES) {
         if (options.signal?.aborted) throw new Error('Aborted');
         await page.goto(`https://nhentai.net/g/${galleryId}/?page=${currentPage}`, {
           waitUntil: 'domcontentloaded', timeout: 60000
         });
         await waitForCloudflare(page, { delayFn: () => this.randomDelay(2000, 3000) });

         const data = await page.evaluate(() => {
           // On first page load, get total pages and title
           let pCount = 1;
           const pageTags = document.querySelectorAll('.tag-container');
           for (const pt of pageTags) {
             if (pt.textContent.includes('Pages:')) {
                const nameEl = pt.querySelector('.name');
                if (nameEl) pCount = parseInt(nameEl.textContent) || 1;
                break;
             }
           }
           
           const infoLink = document.querySelector('a#info');
           const titleEl = infoLink || document.querySelector('h1');
           const t = titleEl ? titleEl.textContent.trim() : 'Unknown';
           
           // Get thumbnails
           const thumbs = Array.from(document.querySelectorAll('.gallerythumb img'))
               .map(img => img.getAttribute('data-src') || img.src)
               .filter(src => src && src.includes('nhentai.net'));
               
           // Check if there's a next pagination link for thumbs
           const nextBtn = document.querySelector('.pagination a.next');
           const hasNext = !!nextBtn;

           return { pageCount: pCount, title: t, thumbs, hasNext };
         });

         if (currentPage === 1) {
            totalPages = data.pageCount;
            title = data.title;
         }

         // Convert each thumbnail to its full-resolution URL, keyed by page.
         // Thumbnail: https://t3.nhentai.net/galleries/{mediaId}/{n}t.{ext}
         //   (nhentai sometimes serves a doubled extension, e.g. {n}t.webp.webp)
         // Full:      https://i3.nhentai.net/galleries/{mediaId}/{n}.{ext}
         let addedThisPage = 0;
         for (const thumbUrl of data.thumbs) {
            const m = thumbUrl.match(/\/galleries\/(\d+)\/(\d+)t\.([a-zA-Z0-9]+)/);
            if (!m) continue;
            const [, mediaId, pageNum, ext] = m;
            const page = parseInt(pageNum, 10);
            if (byPage.has(page)) continue;
            byPage.set(page, `https://i3.nhentai.net/galleries/${mediaId}/${pageNum}.${ext}`);
            addedThisPage++;
         }

         // Stop if this page contributed no new thumbnails (e.g. nhentai
         // re-served the same single-page grid) to avoid duplicate looping.
         hasMoreThumbPages = data.hasNext && addedThisPage > 0;
         currentPage++;

         if (hasMoreThumbPages) {
            await this.randomDelay(500, 1000);
         }
      }

      if (byPage.size === 0) {
        throw new Error('Could not extract thumbnails');
      }

      const images = [...byPage.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([, url]) => url);

      console.log(`  [nhentai] Gallery ${galleryId}: Extracted ${images.length} full image URLs`);

      const result = { galleryId, title, pageCount: totalPages, images };

      // Cache (immutable URLs); evict oldest entry if over capacity.
      if (GALLERY_URL_CACHE.size >= GALLERY_URL_CACHE_MAX) {
        GALLERY_URL_CACHE.delete(GALLERY_URL_CACHE.keys().next().value);
      }
      GALLERY_URL_CACHE.set(galleryId, { ts: Date.now(), data: result });

      return result;
    } finally {
      if (options.signal) options.signal.removeEventListener('abort', abortHandler);
      await browser.close().catch(() => {});
    }
  }
}

export default NhentaiScraper;
