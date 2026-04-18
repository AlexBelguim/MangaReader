import { BaseScraper } from '../base.js';
import { launchBrowser } from '../util/stealth-browser.js';
import { waitForCloudflare } from '../util/cloudflare.js';

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

  async getMangaInfo(url) {
    const { browser, page } = await launchBrowser({ stealth: true });

    try {
      const galleryId = this.getGalleryId(url);
      if (!galleryId) throw new Error('Invalid nhentai URL - could not extract gallery ID');

      console.log(`  Navigating to: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await waitForCloudflare(page, { delayFn: () => this.randomDelay(2000, 3000) });
      await this.randomDelay(1000, 2000);

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
      await browser.close();
    }
  }

  async getChapterImages(chapterUrl) {
    const { browser, page } = await launchBrowser({ stealth: true });

    try {
      const galleryId = this.getGalleryId(chapterUrl);
      if (!galleryId) throw new Error('Invalid nhentai URL');

      console.log(`  Fetching images for gallery ${galleryId}...`);

      // Go to page 1 to get total page count
      await page.goto(`https://nhentai.net/g/${galleryId}/1/`, {
        waitUntil: 'domcontentloaded', timeout: 60000
      });
      await waitForCloudflare(page, { delayFn: () => this.randomDelay(2000, 3000) });

      const totalPages = await page.evaluate(() => {
        const el = document.querySelector('.num-pages');
        return el ? (parseInt(el.textContent.trim()) || 0) : 0;
      });
      if (totalPages === 0) throw new Error('Could not determine total page count');
      console.log(`  Total pages: ${totalPages}`);

      const images = [];
      const failedPages = [];

      // Fetch all pages
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (pageNum % 10 === 1) {
          console.log(`  Fetching pages ${pageNum}-${Math.min(pageNum + 9, totalPages)}...`);
        }
        const imageUrl = await this._fetchPageImage(page, galleryId, pageNum);
        if (imageUrl) { images.push({ index: pageNum, url: imageUrl }); }
        else { failedPages.push(pageNum); }
        await this.randomDelay(50, 100);
      }

      // Retry failed pages
      for (let retry = 1; retry <= 3 && failedPages.length > 0; retry++) {
        console.log(`  Retry attempt ${retry}/3 for ${failedPages.length} failed pages...`);
        await this.randomDelay(1000, 2000);
        const stillFailed = [];
        for (const pageNum of failedPages) {
          const imageUrl = await this._fetchPageImage(page, galleryId, pageNum);
          if (imageUrl) { images.push({ index: pageNum, url: imageUrl }); }
          else { stillFailed.push(pageNum); }
          await this.randomDelay(200, 400);
        }
        failedPages.length = 0;
        failedPages.push(...stillFailed);
      }

      images.sort((a, b) => a.index - b.index);
      console.log(`  Found ${images.length}/${totalPages} images`);

      if (images.length < totalPages) {
        throw new Error(`Failed to fetch ${totalPages - images.length} images (got ${images.length}/${totalPages})`);
      }
      return images;
    } finally {
      await browser.close();
    }
  }

  // Stream chapter images one by one using an async generator
  async *streamChapterImages(chapterUrl) {
    const { waitForCloudflare } = await import('../util/cloudflare.js');
    const { launchBrowser } = await import('../util/stealth-browser.js');
    
    let browser, page;
    try {
      const launched = await launchBrowser({ stealth: true });
      browser = launched.browser;
      page = launched.page;
      
      const galleryId = this.getGalleryId(chapterUrl) || chapterUrl; // Allow passing galleryId directly
      if (!galleryId) throw new Error('Invalid nhentai URL');

      console.log(`  [Stream] Fetching images for gallery ${galleryId}...`);

      await page.goto(`https://nhentai.net/g/${galleryId}/1/`, {
        waitUntil: 'domcontentloaded', timeout: 60000
      });
      await waitForCloudflare(page, { delayFn: () => this.randomDelay(2000, 3000) });

      const info = await page.evaluate(() => {
        const el = document.querySelector('.num-pages');
        const totalPages = el ? (parseInt(el.textContent.trim()) || 0) : 0;
        const infoLink = document.querySelector('a#info');
        const titleEl = infoLink || document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown';
        return { totalPages, title };
      });
      
      if (info.totalPages === 0) throw new Error('Could not determine total page count');
      
      yield { type: 'metadata', pageCount: info.totalPages, title: info.title };

      // Fetch all pages
      for (let pageNum = 1; pageNum <= info.totalPages; pageNum++) {
        let imageUrl = null;
        try {
           const response = await page.goto(`https://nhentai.net/g/${galleryId}/${pageNum}/`, {
             waitUntil: 'domcontentloaded', timeout: 30000
           });
           if (response.status() !== 404) {
              imageUrl = await page.evaluate(() => {
                for (const img of document.querySelectorAll('img')) {
                  if (img.src && img.src.includes('.nhentai.net/galleries/')) return img.src;
                }
                return null;
              });
           }
        } catch (err) {
           console.log(`[SSE] Error fetching page ${pageNum}: ${err.message}`);
        }
        
        if (imageUrl) {
           yield { type: 'image', index: pageNum, url: imageUrl };
        }
        await this.randomDelay(50, 100);
      }
    } finally {
      if (browser) await browser.close();
    }
  }

  async _fetchPageImage(page, galleryId, pageNum) {
    try {
      const response = await page.goto(`https://nhentai.net/g/${galleryId}/${pageNum}/`, {
        waitUntil: 'domcontentloaded', timeout: 30000
      });
      if (response.status() === 404) return null;

      return await page.evaluate(() => {
        for (const img of document.querySelectorAll('img')) {
          if (img.src && img.src.includes('.nhentai.net/galleries/')) return img.src;
        }
        return null;
      });
    } catch (error) {
      console.log(`  Error fetching page ${pageNum}: ${error.message}`);
      return null;
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
  async browse(sort = 'popular-today', page = 1, query = 'english') {
    const { browse } = await import('../features/browse.js');
    const { waitForCloudflare } = await import('../util/cloudflare.js');

    return browse(this, sort, page, query, {
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
    });
  }

  /**
   * Get all image URLs for a gallery (for inline viewing without download).
   * @param {string} galleryId - The nhentai gallery ID
   * @returns {{ images: string[], title: string, pageCount: number }}
   */
  async getGalleryImageUrls(galleryId) {
    const { browser, page } = await launchBrowser({ stealth: true });

    try {
      console.log(`  [nhentai] Fast fetching images for gallery ${galleryId} via thumbnails...`);

      let totalPages = 1;
      let title = 'Unknown';
      let allThumbs = [];
      let currentPage = 1;
      let hasMoreThumbPages = true;

      while (hasMoreThumbPages) {
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
         
         allThumbs = allThumbs.concat(data.thumbs);
         hasMoreThumbPages = data.hasNext;
         currentPage++;
         
         if (hasMoreThumbPages) {
            await this.randomDelay(500, 1000);
         }
      }

      if (allThumbs.length === 0) {
        throw new Error('Could not extract thumbnails');
      }

      // Convert thumbnail URLs to full image URLs
      // Thumbnail: https://t3.nhentai.net/galleries/3891442/1t.webp or 1t.jpg
      // Full: https://i3.nhentai.net/galleries/3891442/1.webp or 1.jpg
      const images = allThumbs.map(thumbUrl => {
         return thumbUrl
            .replace(/\/\/t\d+\.nhentai\.net/, '//i3.nhentai.net')
            .replace(/(\d+)t\./, '$1.');
      });

      console.log(`  [nhentai] Gallery ${galleryId}: Extracted ${images.length} fast image URLs`);

      return {
        galleryId,
        title: title,
        pageCount: totalPages,
        images
      };
    } finally {
      await browser.close();
    }
  }
}

export default NhentaiScraper;
