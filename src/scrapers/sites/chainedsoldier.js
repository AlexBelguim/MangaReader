import { BaseScraper } from '../base.js';
import { extractChapterImages } from '../features/chapter-images.js';

/**
 * Scraper for chained-soldier.live website
 * Only supports chapter image extraction (no getMangaInfo, no search).
 * 
 * Uses the chapter-images feature with site-specific config for:
 * - Custom viewport via stealth browser
 * - .images-container img selector
 * - Filtering out ko-fi donation images
 */
export class ChainedSoldierScraper extends BaseScraper {
  get websiteName() { return 'chained-soldier.live'; }
  get urlPatterns() { return ['chained-soldier.live']; }

  async getMangaInfo(url) {
    throw new Error('Manga info scraping not supported for this site. Use specific chapter URLs.');
  }

  async getChapterImages(url) {
    console.log('  Launching dedicated browser for Chained Soldier...');

    return extractChapterImages(this, url, {
      useCleanPage: true,
      imgSelector: '.images-container img',
      fallbackSelectors: '.entry-content img, .chapter-content img, img[lazyload]',
      scrollConfig: { step: 300, stableThreshold: 10 },
      preScrollDelay: 2000,
      postScrollDelay: 2000,
      setupPage: async (page) => {
        await page.setViewport({ width: 1920, height: 1080 });
      },
    });
  }
}

export default ChainedSoldierScraper;
