import puppeteer from 'puppeteer';
import { CONFIG } from '../config.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITES_DIR = path.join(__dirname, 'sites');

/**
 * Auto-discover all scraper files in the sites/ directory.
 * Skips files starting with _ (like _template.js).
 * Each file must export a class that extends BaseScraper as its default export.
 */
async function loadScrapers() {
  const files = fs.readdirSync(SITES_DIR)
    .filter(f => f.endsWith('.js') && !f.startsWith('_'));

  const scraperClasses = [];

  for (const file of files) {
    try {
      const mod = await import(`./sites/${file}`);
      // Use the default export, or the first exported class
      const ScraperClass = mod.default || Object.values(mod).find(v => typeof v === 'function');
      if (ScraperClass) {
        scraperClasses.push(ScraperClass);
      } else {
        console.warn(`[ScraperFactory] No scraper class found in sites/${file}, skipping`);
      }
    } catch (e) {
      console.error(`[ScraperFactory] Failed to load sites/${file}: ${e.message}`);
    }
  }

  console.log(`[ScraperFactory] Auto-loaded ${scraperClasses.length} scrapers from ${files.length} files`);
  return scraperClasses;
}

class ScraperFactory {
  constructor() {
    this.browser = null;
    this.scrapers = [];
    this.initPromise = null;
  }

  async init() {
    if (this.browser) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        if (!this.browser) {
          const userDataDir = path.join(os.tmpdir(), 'puppeteer_main_profile');
          
          // Ensure directory exists
          if (!fs.existsSync(userDataDir)) {
            fs.mkdirSync(userDataDir, { recursive: true });
          }

          // Clean up stale lock files
          const lockFiles = ['SingletonLock', 'SingletonSocket', 'SingletonCookie'];
          for (const f of lockFiles) {
            const lockPath = path.join(userDataDir, f);
            if (fs.existsSync(lockPath)) {
              try {
                console.log(`[ScraperFactory] Removing stale lock file: ${lockPath}`);
                fs.unlinkSync(lockPath);
              } catch (e) {
                console.warn(`[ScraperFactory] Could not remove puppeteer lock file ${f}: ${e.message}`);
              }
            }
          }

          this.browser = await puppeteer.launch({
            ...CONFIG.puppeteer,
            userDataDir
          });
        }

        // Auto-discover and initialize all scrapers from the sites/ directory
        const scraperClasses = await loadScrapers();
        this.scrapers = scraperClasses.map(ScraperClass => new ScraperClass(this.browser));
        
        console.log(`[ScraperFactory] Registered: ${this.scrapers.map(s => s.websiteName).join(', ')}`);
      } catch (error) {
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
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

  getBrowsableScrapers() {
    return this.scrapers.filter(s => s.supportsBrowse);
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
