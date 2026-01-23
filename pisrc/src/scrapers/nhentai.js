import { BaseScraper } from './base.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CONFIG } from '../config.js';

// Add stealth plugin to avoid Cloudflare detection
puppeteer.use(StealthPlugin());

/**
 * Scraper for nhentai.net website
 * 
 * URL format: https://nhentai.net/g/[gallery_id]/
 * Page format: https://nhentai.net/g/[gallery_id]/[page_number]/
 * 
 * These are typically single "chapters" with many pages.
 * The title is used as-is, but we store the gallery ID as the identifier.
 * Artists are extracted from tags.
 */
export class NhentaiScraper extends BaseScraper {
  get websiteName() {
    return 'nhentai.net';
  }

  get urlPatterns() {
    return ['nhentai.net/g/'];
  }

  // Extract gallery ID from URL
  getGalleryId(url) {
    const match = url.match(/\/g\/(\d+)/);
    return match ? match[1] : null;
  }

  // Wait for Cloudflare challenge to complete
  async waitForCloudflare(page, maxWait = 30000) {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      const isCloudflare = await page.evaluate(() => {
        // Check for common Cloudflare challenge indicators
        const title = document.title.toLowerCase();
        const body = document.body?.innerText?.toLowerCase() || '';
        return title.includes('just a moment') ||
          title.includes('checking your browser') ||
          body.includes('checking your browser') ||
          body.includes('ray id');
      });

      if (!isCloudflare) {
        console.log('  Cloudflare check passed');
        return true;
      }

      console.log('  Waiting for Cloudflare...');
      await this.randomDelay(2000, 3000);
    }

    console.log('  Cloudflare wait timeout - continuing anyway');
    return false;
  }

  async getMangaInfo(url) {
    // Use puppeteer-extra with stealth plugin for Cloudflare bypass
    const browser = await puppeteer.launch(CONFIG.puppeteer);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    try {
      const galleryId = this.getGalleryId(url);
      if (!galleryId) {
        throw new Error('Invalid nhentai URL - could not extract gallery ID');
      }

      console.log(`  Navigating to: ${url}`);
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Wait for Cloudflare challenge to complete if present
      await this.waitForCloudflare(page);

      await this.randomDelay(1000, 2000);

      // Extract all info from page
      const info = await page.evaluate(() => {
        // Title - usually in h1 or h2
        const titleEl = document.querySelector('#info h1, #info h2, .title');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';

        // Cover image
        const coverEl = document.querySelector('#cover img, .cover img');
        let cover = null;
        if (coverEl) {
          cover = coverEl.getAttribute('data-src') || coverEl.src;
        }

        // Page count - look for "X pages" text
        const pageCountEl = document.querySelector('.tag-container:has(i.fa-file) .name, a[href*="/pages/"] .name');
        let pageCount = 1;
        const pageMatch = document.body.innerText.match(/(\d+)\s*pages?/i);
        if (pageMatch) {
          pageCount = parseInt(pageMatch[1]);
        }

        // Extract artists from tags
        const artists = [];
        const artistTags = document.querySelectorAll('a[href*="/artist/"] .name, .tag-container:has(a[href*="/artist/"]) .name');
        artistTags.forEach(el => {
          const name = el.textContent.trim();
          if (name && !artists.includes(name)) {
            artists.push(name);
          }
        });

        // Also try alternative selector
        if (artists.length === 0) {
          const tagContainers = document.querySelectorAll('.tag-container');
          tagContainers.forEach(container => {
            const label = container.querySelector('.tags, span');
            if (label && label.textContent.toLowerCase().includes('artist')) {
              const tags = container.querySelectorAll('.tag .name');
              tags.forEach(tag => {
                const name = tag.textContent.trim();
                if (name && !artists.includes(name)) {
                  artists.push(name);
                }
              });
            }
          });
        }

        // Extract groups
        const groups = [];
        const groupTags = document.querySelectorAll('a[href*="/group/"] .name');
        groupTags.forEach(el => {
          const name = el.textContent.trim();
          if (name && !groups.includes(name)) {
            groups.push(name);
          }
        });

        // Extract parody/series
        const parodies = [];
        const parodyTags = document.querySelectorAll('a[href*="/parody/"] .name');
        parodyTags.forEach(el => {
          const name = el.textContent.trim();
          if (name && !parodies.includes(name)) {
            parodies.push(name);
          }
        });

        // All tags for description
        const allTags = [];
        document.querySelectorAll('.tag-container .tag .name').forEach(el => {
          allTags.push(el.textContent.trim());
        });

        return {
          title,
          cover,
          pageCount,
          artists,
          tags: allTags
        };
      });

      console.log(`  Title: ${info.title}`);
      console.log(`  Gallery ID: ${galleryId}`);
      console.log(`  Pages: ${info.pageCount}`);
      console.log(`  Artists: ${info.artists.join(', ') || 'Unknown'}`);

      // For nhentai, we treat the entire gallery as a single chapter
      const chapters = [{
        number: 1,
        title: info.title,
        url: url,
        pageCount: info.pageCount
      }];

      return {
        url: url,
        title: info.title,
        displayId: galleryId, // Store the gallery ID for display
        website: this.websiteName,
        cover: info.cover,
        description: '', // No description - artist shown separately
        artists: info.artists,
        totalChapters: 1,
        uniqueChapters: 1,
        chapters: chapters,
        duplicateChapters: [],
        pageCount: info.pageCount
      };

    } finally {
      await browser.close();
    }
  }

  async getChapterImages(chapterUrl) {
    // Use puppeteer-extra with stealth plugin for Cloudflare bypass
    const browser = await puppeteer.launch(CONFIG.puppeteer);

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    try {
      const galleryId = this.getGalleryId(chapterUrl);
      if (!galleryId) {
        throw new Error('Invalid nhentai URL');
      }

      console.log(`  Fetching images for gallery ${galleryId}...`);

      // First, go to page 1 to get total page count
      const firstPageUrl = `https://nhentai.net/g/${galleryId}/1/`;
      await page.goto(firstPageUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      // Wait for Cloudflare
      await this.waitForCloudflare(page);

      // Get total page count from the "X of Y" indicator
      const totalPages = await page.evaluate(() => {
        const numPagesEl = document.querySelector('.num-pages');
        if (numPagesEl) {
          return parseInt(numPagesEl.textContent.trim()) || 0;
        }
        return 0;
      });

      if (totalPages === 0) {
        throw new Error('Could not determine total page count');
      }

      console.log(`  Total pages: ${totalPages}`);

      const images = [];
      const failedPages = [];
      const maxRetries = 3;

      // Fetch all pages
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (pageNum % 10 === 1) {
          console.log(`  Fetching pages ${pageNum}-${Math.min(pageNum + 9, totalPages)}...`);
        }

        const imageUrl = await this.fetchPageImage(page, galleryId, pageNum);

        if (imageUrl) {
          images.push({
            index: pageNum,
            url: imageUrl
          });
        } else {
          failedPages.push(pageNum);
        }

        // Small delay between pages
        await this.randomDelay(50, 100);
      }

      // Retry failed pages with longer delays
      if (failedPages.length > 0) {
        console.log(`  Retrying ${failedPages.length} failed pages...`);

        for (let retry = 1; retry <= maxRetries && failedPages.length > 0; retry++) {
          console.log(`  Retry attempt ${retry}/${maxRetries}...`);
          await this.randomDelay(1000, 2000); // Wait before retry

          const stillFailed = [];
          for (const pageNum of failedPages) {
            const imageUrl = await this.fetchPageImage(page, galleryId, pageNum);

            if (imageUrl) {
              images.push({
                index: pageNum,
                url: imageUrl
              });
            } else {
              stillFailed.push(pageNum);
            }

            await this.randomDelay(200, 400);
          }

          failedPages.length = 0;
          failedPages.push(...stillFailed);
        }
      }

      // Sort by index
      images.sort((a, b) => a.index - b.index);

      console.log(`  Found ${images.length}/${totalPages} images`);

      if (images.length < totalPages) {
        const missing = totalPages - images.length;
        throw new Error(`Failed to fetch ${missing} images (got ${images.length}/${totalPages})`);
      }

      return images;

    } finally {
      await browser.close();
    }
  }

  // Helper to fetch a single page image
  async fetchPageImage(page, galleryId, pageNum) {
    const pageUrl = `https://nhentai.net/g/${galleryId}/${pageNum}/`;

    try {
      const response = await page.goto(pageUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      if (response.status() === 404) {
        return null;
      }

      // Get the full image URL from this page
      const imageUrl = await page.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        for (const img of imgs) {
          if (img.src && img.src.includes('.nhentai.net/galleries/')) {
            return img.src;
          }
        }
        return null;
      });

      return imageUrl;
    } catch (error) {
      console.log(`  Error fetching page ${pageNum}: ${error.message}`);
      return null;
    }
  }
}

export default NhentaiScraper;
