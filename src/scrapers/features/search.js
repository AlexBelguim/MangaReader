/**
 * Search feature — standardized manga search across scrapers.
 * 
 * Scrapers provide config functions for site-specific behavior
 * (URL building, page setup, result extraction, post-processing).
 */

/**
 * @param {import('../base.js').BaseScraper} scraper - Scraper instance
 * @param {string} query - Search query
 * @param {object} config
 * @param {Function} config.buildSearchUrl - (query) => string — build the search URL
 * @param {Function} [config.setupPage] - async (page) => void — cookies, UA, request interception, etc.
 * @param {Function} [config.waitForResults] - async (page) => void — wait for results to render (React, lazy load, etc.)
 * @param {Function} config.extractResults - async (page) => Array<{ title, url, cover, chapterCount }> — extract results from DOM
 * @param {Function} [config.postProcess] - async (results, page, scraper) => Array — post-processing (cover caching, HTML fallback, etc.)
 * @param {boolean} [config.useCleanPage=false] - Use createPageClean instead of createPage
 * @param {number} [config.timeout=60000] - Navigation timeout
 * @returns {Array<{ title, url, cover, chapterCount, website }>}
 */
export async function search(scraper, query, config) {
  const {
    buildSearchUrl,
    setupPage,
    waitForResults,
    extractResults,
    postProcess,
    useCleanPage = false,
    timeout = 60000,
  } = config;

  const searchUrl = buildSearchUrl(query);
  console.log(`  [${scraper.websiteName}] Searching: ${searchUrl}`);

  if (useCleanPage) {
    await scraper.createPageClean();
  } else {
    await scraper.createPage();
  }

  try {
    // Site-specific page setup (cookies, UA, request interception)
    if (setupPage) {
      await setupPage(scraper.page);
    }

    // Navigate to search URL
    await scraper.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout });
    await scraper.randomDelay(1000, 2000);

    // Wait for results to render (React apps, lazy loading, etc.)
    if (waitForResults) {
      await waitForResults(scraper.page);
    }

    // Extract results from DOM
    let results = await extractResults(scraper.page);

    // Post-processing (cover caching, HTML fallback, etc.)
    if (postProcess) {
      results = await postProcess(results, scraper.page, scraper);
    }

    // Tag results with website name
    results.forEach(r => r.website = scraper.websiteName);

    console.log(`  [${scraper.websiteName}] Total: ${results.length} results`);
    return results;

  } finally {
    await scraper.closePage();
  }
}
