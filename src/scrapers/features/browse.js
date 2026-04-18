/**
 * Browse feature — standardized catalog browsing across scrapers.
 * 
 * Scrapers provide config functions for site-specific behavior
 * (URL building, page setup, result extraction).
 */

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
  } = config;

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
    
    return {
      results: extracted.results || [],
      totalPages: extracted.totalPages || 1,
      currentPage: pageNum
    };

  } finally {
    await scraper.closePage();
  }
}
