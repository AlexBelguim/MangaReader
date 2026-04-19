/**
 * Browse feature — standardized catalog browsing across scrapers.
 * 
 * Scrapers provide config functions for site-specific behavior
 * (URL building, page setup, result extraction).
 * 
 * Includes a per-scraper, per-filter results cache to avoid
 * redundant Puppeteer sessions for recently viewed pages.
 */

// In-memory cache: keyed by "scraperName:sort:query:page"
const _browseCache = new Map();

/**
 * Build a cache key for a browse request
 */
function cacheKey(scraperName, sort, pageNum, query) {
  return `${scraperName}:${sort}:${query}:${pageNum}`;
}

/**
 * Get a cached browse result if it exists and hasn't expired.
 * @param {string} scraperName 
 * @param {string} sort 
 * @param {number} pageNum 
 * @param {string} query 
 * @param {number} ttlMs - Cache TTL in milliseconds
 * @returns {object|null} Cached result or null
 */
export function getCached(scraperName, sort, pageNum, query, ttlMs) {
  const key = cacheKey(scraperName, sort, pageNum, query);
  const entry = _browseCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    _browseCache.delete(key);
    return null;
  }
  console.log(`  [${scraperName}] Cache HIT for ${sort}/${query}/p${pageNum}`);
  return entry.data;
}

/**
 * Store a browse result in the cache.
 */
export function setCache(scraperName, sort, pageNum, query, data) {
  const key = cacheKey(scraperName, sort, pageNum, query);
  _browseCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Invalidate all cached entries for a specific scraper, or all if no name given.
 */
export function invalidateCache(scraperName) {
  if (!scraperName) {
    _browseCache.clear();
    return;
  }
  for (const key of _browseCache.keys()) {
    if (key.startsWith(scraperName + ':')) {
      _browseCache.delete(key);
    }
  }
}

/**
 * @param {import('../base.js').BaseScraper} scraper - Scraper instance
 * @param {string} sort - Sort parameter 
 * @param {number} pageNum - Page number
 * @param {string} query - Query or category string
 * @param {object} config
 * @param {Function} config.buildBrowseUrl - (sort, pageNum, query) => string — build the browse URL
 * @param {Function} [config.setupPage] - async (page) => void — cookies, UA, request interception, etc.
 * @param {Function} [config.waitForResults] - async (page) => void — wait for results to render
 * @param {Function} config.extractResults - async (page) => { results: Array, totalPages: number }
 * @param {boolean} [config.useCleanPage=false] - Use createPageClean instead of createPage
 * @param {number} [config.timeout=60000] - Navigation timeout
 * @param {number} [config.cacheTtl=0] - Cache TTL in ms. 0 = no caching.
 * @returns {{ results: Array, totalPages: number, currentPage: number }}
 */
export async function browse(scraper, sort, pageNum, query, config) {
  const {
    buildBrowseUrl,
    setupPage,
    waitForResults,
    extractResults,
    useCleanPage = false,
    timeout = 60000,
    cacheTtl = 0,
  } = config;

  // Check cache first
  if (cacheTtl > 0) {
    const cached = getCached(scraper.websiteName, sort, pageNum, query, cacheTtl);
    if (cached) return cached;
  }

  const browseUrl = buildBrowseUrl(sort, pageNum, query);
  console.log(`  [${scraper.websiteName}] Browse: ${browseUrl}`);

  if (useCleanPage) {
    await scraper.createPageClean();
  } else {
    await scraper.createPage();
  }

  try {
    if (setupPage) {
      await setupPage(scraper.page);
    }

    await scraper.page.goto(browseUrl, { waitUntil: 'networkidle2', timeout });
    
    // Add small randomized delay to simulate human timing
    await scraper.randomDelay(1000, 2000);

    if (waitForResults) {
      await waitForResults(scraper.page);
    }

    const extracted = await extractResults(scraper.page);
    
    // Tag results with website name
    if (extracted.results) {
      extracted.results.forEach(r => r.website = scraper.websiteName);
    }

    console.log(`  [${scraper.websiteName}] Found ${extracted.results?.length || 0} results on page ${pageNum}`);
    
    const result = {
      results: extracted.results || [],
      totalPages: extracted.totalPages || 1,
      currentPage: pageNum
    };

    // Store in cache
    if (cacheTtl > 0) {
      setCache(scraper.websiteName, sort, pageNum, query, result);
    }

    return result;

  } finally {
    await scraper.closePage();
  }
}
