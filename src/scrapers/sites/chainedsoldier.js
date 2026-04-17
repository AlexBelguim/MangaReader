import { BaseScraper } from '../base.js';
import { launchBrowser } from '../util/stealth-browser.js';
import { scrollToBottom } from '../util/scrolling.js';

/**
 * Scraper for chained-soldier.live website
 * Only supports chapter image extraction (no getMangaInfo, no search).
 * Uses a dedicated browser instance with specific viewport.
 */
export class ChainedSoldierScraper extends BaseScraper {
  get websiteName() { return 'chained-soldier.live'; }
  get urlPatterns() { return ['chained-soldier.live']; }

  async getMangaInfo(url) {
    throw new Error('Manga info scraping not supported for this site. Use specific chapter URLs.');
  }

  async getChapterImages(url) {
    console.log('  Launching dedicated browser for Chained Soldier...');

    const { browser, page } = await launchBrowser({
      stealth: false,
      viewport: { width: 1920, height: 1080 },
      launchOverrides: { headless: true },
    });

    try {
      console.log(`  Scraping chapter images from: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await this.randomDelay(2000, 4000);

      await page.waitForSelector('.images-container img', { timeout: 15000 })
        .catch(() => console.log('  Warning: Main selector not found immediately'));

      // Scroll to trigger lazy loading
      console.log('  Scrolling to trigger lazy load...');
      await scrollToBottom(page, { step: 300, stableThreshold: 10 });

      await this.randomDelay(2000, 3000);

      // Wait for images to appear
      await page.waitForFunction(() => {
        const imgs = document.querySelectorAll('.images-container img');
        return imgs.length > 1;
      }, { timeout: 10000 }).catch(() => console.log('  Warning: Wait for images timeout'));

      // Extract images
      const images = await page.evaluate(() => {
        let imgElements = document.querySelectorAll('.images-container img');
        if (imgElements.length === 0) {
          imgElements = document.querySelectorAll('.entry-content img, .chapter-content img, img[lazyload]');
        }

        const imageUrls = [];
        const seenUrls = new Set();
        let index = 1;

        imgElements.forEach((img) => {
          let src = img.getAttribute('src') || img.getAttribute('data-src') || img.src;
          if (img.offsetParent === null) return;

          if (src &&
            !src.includes('loading') &&
            !src.includes('placeholder') &&
            !src.includes('pixel') &&
            !img.classList.contains('kofiimg') &&
            !src.includes('ko-fi.com') &&
            !seenUrls.has(src)) {

            seenUrls.add(src);
            if (src.startsWith('//')) src = 'https:' + src;
            else if (src.startsWith('/')) src = window.location.origin + src;

            try {
              const urlObj = new URL(src);
              if (urlObj.search && urlObj.search.includes('time')) src = src.split('?')[0];
            } catch (e) { }

            imageUrls.push({ index: index++, url: src });
          }
        });

        return imageUrls;
      });

      console.log(`  Found ${images.length} images`);
      return images;
    } finally {
      if (page) await page.close().catch(() => { });
      await browser.close().catch(() => { });
    }
  }
}

export default ChainedSoldierScraper;
