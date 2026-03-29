import puppeteer from 'puppeteer';
import { CONFIG } from '../config.js';
import { ComixScraper } from './comix.js';
import { ChainedSoldierScraper } from './chainedsoldier.js';
import { NhentaiScraper } from './nhentai.js';
import { MangaHereScraper } from './mangahere.js';


// Add more scrapers here as you add support for more websites
const SCRAPERS = [
  ComixScraper,
  ChainedSoldierScraper,
  NhentaiScraper,
  MangaHereScraper,
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
    console.log(`[ScraperFactory] Finding scraper for URL: ${url} (${this.scrapers.length} scrapers registered)`);
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

  getSearchableScrapers() {
    return this.scrapers.filter(s => s.supportsSearch);
  }

  async searchAll(query) {
    const searchable = this.getSearchableScrapers();
    if (searchable.length === 0) return [];

    const promises = searchable.map(async scraper => {
      try {
        const results = await scraper.search(query);
        // Tag each result with the website name
        return results.map(r => ({ ...r, website: scraper.websiteName }));
      } catch (e) {
        console.error(`[ScraperFactory] search failed for ${scraper.websiteName}: ${e.message}`);
        return [];
      }
    });

    const resultsArray = await Promise.all(promises);
    return resultsArray.flat();
  }
}

export const scraperFactory = new ScraperFactory();
export default scraperFactory;
