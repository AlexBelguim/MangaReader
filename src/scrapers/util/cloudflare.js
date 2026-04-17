/**
 * Cloudflare challenge detection and waiting utilities.
 * Extracted from nhentai scraper for reuse across scrapers.
 */

/**
 * Check if an HTML string contains a Cloudflare challenge page.
 * Useful for validating FlareSolverr responses.
 * 
 * @param {string} html - HTML string to check
 * @returns {boolean}
 */
export function isCloudflareChallenge(html) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  const pageTitle = titleMatch ? titleMatch[1] : '';
  return pageTitle === 'Just a moment...' ||
         pageTitle === 'Even geduld' ||
         pageTitle === 'Checking your browser' ||
         html.includes('cf-browser-verification');
}

/**
 * Wait for a Cloudflare challenge to resolve on a Puppeteer page.
 * Polls the page title/body until the challenge indicators disappear.
 * 
 * @param {import('puppeteer').Page} page - Puppeteer page instance
 * @param {object} [options]
 * @param {number} [options.maxWait=30000] - Maximum wait time in ms
 * @param {Function} [options.delayFn] - Async delay function between polls
 * @returns {boolean} true if challenge passed, false if timeout
 */
export async function waitForCloudflare(page, { maxWait = 30000, delayFn } = {}) {
  const defaultDelay = () => new Promise(r => setTimeout(r, 2500));
  const delay = delayFn || defaultDelay;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWait) {
    const isChallenge = await page.evaluate(() => {
      const title = document.title.toLowerCase();
      const body = document.body?.innerText?.toLowerCase() || '';
      return title.includes('just a moment') ||
        title.includes('checking your browser') ||
        body.includes('checking your browser') ||
        body.includes('ray id');
    });

    if (!isChallenge) {
      console.log('  Cloudflare check passed');
      return true;
    }

    console.log('  Waiting for Cloudflare...');
    await delay();
  }

  console.log('  Cloudflare wait timeout - continuing anyway');
  return false;
}
