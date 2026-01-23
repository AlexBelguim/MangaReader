import puppeteer from 'puppeteer';
import { CONFIG } from '../../config.js';
import { ComixScraper } from './comix.js';
import { ChainedSoldierScraper } from '../chainedsoldier.js';
import { NhentaiScraper } from './nhentai.js';

// Add more scrapers here as you add support for more websites
const SCRAPERS = [
  ComixScraper,
  ChainedSoldierScraper,
  NhentaiScraper,
  // Add more scrapers here:
  // MangadexScraper,
  // MangareaderScraper,
];

class ScraperFactory {
  constructor() {
    this.browser = null;
    this.scrapers = [];
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch(CONFIG.puppeteer);
    }

    // Initialize all scrapers
    this.scrapers = SCRAPERS.map(ScraperClass => new ScraperClass(this.browser));
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  getScraperForUrl(url) {
    console.log(`[ScraperFactory] Finding scraper for URL: ${url}`);
    for (const scraper of this.scrapers) {
      const canHandle = scraper.canHandle(url);
      console.log(`  - ${scraper.websiteName}: ${canHandle ? 'YES' : 'NO'} (patterns: ${scraper.urlPatterns.join(', ')})`);
      if (canHandle) {
        console.log(`  ✓ Selected: ${scraper.websiteName}`);
        return scraper;
      }
    }
    console.log(`  ✗ No scraper found for URL`);
    return null;
  }

  getSupportedWebsites() {
    return this.scrapers.map(s => s.websiteName);
  }
}

export const scraperFactory = new ScraperFactory();
export default scraperFactory;
