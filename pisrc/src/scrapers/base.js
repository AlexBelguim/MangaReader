/**
 * Base scraper class that all website scrapers should extend
 */
export class BaseScraper {
  constructor(browser) {
    this.browser = browser;
    this.page = null;
  }

  // Website identifier
  get websiteName() {
    throw new Error('websiteName must be implemented');
  }

  // URL patterns this scraper handles
  get urlPatterns() {
    throw new Error('urlPatterns must be implemented');
  }
  
  // Whether this scraper supports quick update checks (first page only)
  get supportsQuickCheck() {
    return false;
  }

  // Check if this scraper can handle the given URL
  canHandle(url) {
    return this.urlPatterns.some(pattern => url.includes(pattern));
  }

  async createPage() {
    this.page = await this.browser.newPage();
    
    // Set user agent to avoid detection
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Block unnecessary resources for faster loading
    await this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      const resourceType = req.resourceType();
      if (['stylesheet', 'font', 'media'].includes(resourceType)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    return this.page;
  }

  // Create page without blocking anything - for chapter reading where lazy loading needs full page
  async createPageClean() {
    this.page = await this.browser.newPage();
    
    // Set user agent to avoid detection
    await this.page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    return this.page;
  }

  async closePage() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
  }

  // Get manga info from URL - must be implemented by subclasses
  async getMangaInfo(url) {
    throw new Error('getMangaInfo must be implemented');
  }

  // Get chapter images - must be implemented by subclasses
  async getChapterImages(chapterUrl) {
    throw new Error('getChapterImages must be implemented');
  }
  
  // Quick check for new chapters (first page only) - optional, override in subclass
  // Returns: { hasUpdates: boolean, latestChapter: number|null, newChapters: array }
  async quickCheckUpdates(url, knownChapters = []) {
    throw new Error('quickCheckUpdates not supported by this scraper');
  }

  // Helper to wait with random delay
  async randomDelay(min = 500, max = 1500) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // Helper to retry failed operations
  async retry(fn, maxAttempts = 3, delay = 2000) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError;
  }

  // Helper to scroll page to load lazy content
  async autoScroll() {
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
}

export default BaseScraper;
