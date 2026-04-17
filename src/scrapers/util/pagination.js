/**
 * Click-based pagination utility.
 * Extracted from comix scraper's getMangaInfo pagination loop.
 */

/**
 * Paginate through pages by clicking "Next" and collecting items from each page.
 * Detects when pagination stops working (duplicate first item) and stops.
 * 
 * @param {import('puppeteer').Page} page - Puppeteer page instance
 * @param {Function} extractFn - Function called with `page` that returns items array via page.evaluate.
 *                                Each item must have a `.number` property for duplicate detection.
 * @param {object} [options]
 * @param {Function} [options.delayFn] - Async delay between page navigations
 * @param {number} [options.maxPages=100] - Maximum pages to scrape
 * @returns {Array} All collected items across all pages
 */
export async function paginateAndCollect(page, extractFn, {
  delayFn = () => new Promise(r => setTimeout(r, 1250)),
  maxPages = 100
} = {}) {
  let allItems = [];
  let pageNum = 1;
  let previousFirstItem = null;

  while (pageNum <= maxPages) {
    console.log(`  Scraping page ${pageNum}...`);

    const pageItems = await extractFn(page);

    // Detect duplicate page (pagination didn't work)
    const currentFirst = pageItems.length > 0 ? pageItems[0].number : null;
    if (previousFirstItem !== null && currentFirst === previousFirstItem) {
      console.log(`  Detected duplicate page, stopping pagination`);
      break;
    }
    previousFirstItem = currentFirst;

    allItems = allItems.concat(pageItems);
    console.log(`    Found ${pageItems.length} items on page ${pageNum}`);

    // Try to click Next button
    const hasNext = await page.evaluate(() => {
      const pageLinks = document.querySelectorAll('a.page-link, .pagination a, nav a');
      for (const link of pageLinks) {
        const text = link.textContent.trim();
        if (text === 'Next' || text === '›' || text === '>') {
          const href = link.getAttribute('href');
          const currentPageMatch = href ? href.match(/#(\d+)/) : null;
          const currentPageNum = currentPageMatch ? parseInt(currentPageMatch[1]) : 0;
          const activePageEl = document.querySelector('a.page-link.active, .pagination .active');
          const activePage = activePageEl ? parseInt(activePageEl.textContent.trim()) : 1;
          if (currentPageNum > activePage || (!currentPageMatch && href !== '#')) {
            link.click();
            return true;
          }
          return false;
        }
      }
      return false;
    });

    if (!hasNext) {
      console.log(`  No more pages after page ${pageNum}`);
      break;
    }

    pageNum++;
    await delayFn();
    await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => { });
  }

  return allItems;
}
