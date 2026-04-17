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
        const pageMatch = document.body.innerText.match(/(\d+)\s*pages?/i);
        if (pageMatch) pageCount = parseInt(pageMatch[1]);

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

  // ==================== BROWSE FEATURE ====================

  get supportsBrowse() { return true; }

  /**
   * Browse nhentai search results with sort & pagination.
   * @param {string} sort - One of: 'date', 'popular-today', 'popular-week', 'popular'
   * @param {number} page - Page number (1-based)
   * @param {string} query - Search query (default: 'english')
   * @returns {{ results: Array, totalPages: number, currentPage: number }}
   */
  async browse(sort = 'popular-today', page = 1, query = 'english') {
    const { browser, page: browserPage } = await launchBrowser({ stealth: true });

    try {
      const url = `https://nhentai.net/search/?q=${encodeURIComponent(query)}&sort=${sort}&page=${page}`;
      console.log(`  [nhentai] Browse: ${url}`);

      await browserPage.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await waitForCloudflare(browserPage, { delayFn: () => this.randomDelay(2000, 3000) });
      await this.randomDelay(1000, 2000);

      const data = await browserPage.evaluate(() => {
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

        // Get total pages from pagination
        let totalPages = 1;
        const lastPageLink = document.querySelector('.pagination .last');
        if (lastPageLink) {
          const hrefMatch = lastPageLink.getAttribute('href')?.match(/page=(\d+)/);
          if (hrefMatch) totalPages = parseInt(hrefMatch[1]);
        } else {
          // Fallback: find highest page number in pagination
          const pageLinks = document.querySelectorAll('.pagination a');
          pageLinks.forEach(a => {
            const match = a.getAttribute('href')?.match(/page=(\d+)/);
            if (match) totalPages = Math.max(totalPages, parseInt(match[1]));
          });
        }

        return { results, totalPages };
      });

      console.log(`  [nhentai] Found ${data.results.length} results on page ${page}/${data.totalPages}`);

      return {
        results: data.results,
        totalPages: data.totalPages,
        currentPage: page,
        website: this.websiteName
      };
    } finally {
      await browser.close();
    }
  }

  /**
   * Get all image URLs for a gallery (for inline viewing without download).
   * @param {string} galleryId - The nhentai gallery ID
   * @returns {{ images: string[], title: string, pageCount: number }}
   */
  async getGalleryImageUrls(galleryId) {
    const { browser, page } = await launchBrowser({ stealth: true });

    try {
      console.log(`  [nhentai] Fetching images for gallery ${galleryId}...`);

      // Go to page 1 to get total page count and title
      await page.goto(`https://nhentai.net/g/${galleryId}/1/`, {
        waitUntil: 'domcontentloaded', timeout: 60000
      });
      await waitForCloudflare(page, { delayFn: () => this.randomDelay(2000, 3000) });

      const info = await page.evaluate(() => {
        const numPagesEl = document.querySelector('.num-pages');
        const totalPages = numPagesEl ? parseInt(numPagesEl.textContent.trim()) : 0;
        // Get title from the gallery info link
        const infoLink = document.querySelector('a#info');
        const titleEl = infoLink || document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown';
        return { totalPages, title };
      });

      if (info.totalPages === 0) {
        throw new Error('Could not determine total page count');
      }

      console.log(`  [nhentai] Gallery ${galleryId}: ${info.totalPages} pages`);

      const images = [];
      const failedPages = [];

      // Fetch all pages
      for (let pageNum = 1; pageNum <= info.totalPages; pageNum++) {
        if (pageNum % 10 === 1) {
          console.log(`  [nhentai] Fetching pages ${pageNum}-${Math.min(pageNum + 9, info.totalPages)}...`);
        }
        const imageUrl = await this._fetchPageImage(page, galleryId, pageNum);
        if (imageUrl) {
          images.push(imageUrl);
        } else {
          failedPages.push(pageNum);
        }
        await this.randomDelay(50, 100);
      }

      // Retry failed pages once
      if (failedPages.length > 0) {
        console.log(`  [nhentai] Retrying ${failedPages.length} failed pages...`);
        await this.randomDelay(1000, 2000);
        for (const pageNum of failedPages) {
          const imageUrl = await this._fetchPageImage(page, galleryId, pageNum);
          if (imageUrl) {
            // Insert at correct position
            images.splice(pageNum - 1, 0, imageUrl);
          }
          await this.randomDelay(200, 400);
        }
      }

      console.log(`  [nhentai] Got ${images.length}/${info.totalPages} images`);

      return {
        galleryId,
        title: info.title,
        pageCount: info.totalPages,
        images
      };
    } finally {
      await browser.close();
    }
  }
}

export default NhentaiScraper;
