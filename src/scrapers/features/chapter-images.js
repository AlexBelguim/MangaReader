import { scrollToBottom } from '../util/scrolling.js';

/**
 * Chapter image extraction feature — handles the common pattern of:
 * 1. Set up page (cookies, UA)
 * 2. Navigate to chapter URL
 * 3. Scroll to load lazy images
 * 4. Wait for images to finish loading
 * 5. Extract image URLs from DOM
 * 
 * Used by scrapers that load all images on a single page via scrolling.
 * NOT suitable for page-by-page navigation (e.g. nhentai).
 */

/**
 * @param {import('../base.js').BaseScraper} scraper - Scraper instance
 * @param {string} chapterUrl - Chapter URL to scrape
 * @param {object} config
 * @param {Function} [config.setupPage] - async (page) => void — set cookies, UA, viewport before navigation
 * @param {string} config.imgSelector - Primary CSS selector for chapter images
 * @param {string} [config.fallbackSelectors] - Fallback CSS selectors (comma-separated)
 * @param {Function} [config.filterImg] - Serializable filter function string for page.evaluate context.
 *   Receives (src, img) and returns boolean. Default: filters out loading/placeholder images.
 * @param {object} [config.scrollConfig] - Options for scrollToBottom
 * @param {number} [config.preScrollDelay=3000] - Delay after page load before scrolling (ms)
 * @param {number} [config.postScrollDelay=2000] - Delay after scrolling before extraction (ms)
 * @param {Function} [config.waitForImages] - async (page) => void — custom wait for images to load
 * @param {boolean} [config.extractHeaders=false] - Extract cookies/referer as download headers
 * @param {string} [config.userAgent] - User agent for headers
 * @param {boolean} [config.useCleanPage=true] - Use createPageClean (no resource blocking)
 * @returns {Array<{ index: number, url: string, headers?: object }>}
 */
export async function extractChapterImages(scraper, chapterUrl, config) {
  const {
    setupPage,
    imgSelector,
    fallbackSelectors = '',
    scrollConfig = {},
    preScrollDelay = 3000,
    postScrollDelay = 2000,
    waitForImages,
    extractHeaders = false,
    userAgent = '',
    useCleanPage = true,
  } = config;

  if (useCleanPage) {
    await scraper.createPageClean();
  } else {
    await scraper.createPage();
  }

  try {
    // Custom page setup (cookies, UA, viewport)
    if (setupPage) {
      await setupPage(scraper.page);
    }

    console.log(`  Loading chapter: ${chapterUrl}`);
    await scraper.page.goto(chapterUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Pre-scroll delay for initial page load
    await new Promise(r => setTimeout(r, preScrollDelay));

    // Scroll to load lazy images
    console.log('  Scrolling to load all images...');
    await scrollToBottom(scraper.page, scrollConfig);

    // Post-scroll delay for final image loading
    await new Promise(r => setTimeout(r, postScrollDelay));

    // Wait for images to be loaded (custom or default)
    if (waitForImages) {
      await waitForImages(scraper.page);
    } else {
      await scraper.page.waitForFunction((sel) => {
        const imgs = document.querySelectorAll(sel);
        if (imgs.length === 0) return false;
        return Array.from(imgs).every(img => img.src && img.naturalWidth > 0);
      }, { timeout: 15000 }, imgSelector).catch(() => { });
    }

    // Extract images from DOM
    const images = await scraper.page.evaluate(({ imgSelector, fallbackSelectors }) => {
      let imgElements = document.querySelectorAll(imgSelector);

      // Fallback selectors
      if (imgElements.length === 0 && fallbackSelectors) {
        imgElements = document.querySelectorAll(fallbackSelectors);
      }

      const imageUrls = [];
      const seenUrls = new Set();

      imgElements.forEach((img) => {
        let src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || img.src;

        // Skip invisible elements
        if (img.offsetParent === null && !img.classList.contains('fit-w')) return;

        if (src &&
          !src.includes('loading') &&
          !src.includes('placeholder') &&
          !src.includes('pixel') &&
          !seenUrls.has(src)) {

          seenUrls.add(src);

          // Ensure absolute URL
          if (src.startsWith('//')) {
            src = 'https:' + src;
          } else if (src.startsWith('/')) {
            src = window.location.origin + src;
          }

          // Strip cache-busting query params
          try {
            const urlObj = new URL(src);
            if (urlObj.search && urlObj.search.includes('time')) {
              src = src.split('?')[0];
            }
          } catch (e) { }

          imageUrls.push({
            index: imageUrls.length + 1,
            url: src
          });
        }
      });

      return imageUrls;
    }, { imgSelector, fallbackSelectors });

    console.log(`  Found ${images.length} images`);

    // Optionally extract headers for authenticated downloads
    if (extractHeaders) {
      const cookies = await scraper.page.cookies();
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const ua = userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

      return images.map(img => ({
        ...img,
        headers: {
          'Cookie': cookieString,
          'Referer': chapterUrl,
          'User-Agent': ua
        }
      }));
    }

    return images;

  } finally {
    await scraper.closePage();
  }
}
