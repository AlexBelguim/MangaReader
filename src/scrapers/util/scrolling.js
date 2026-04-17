/**
 * Page scrolling utilities for triggering lazy-loaded content.
 * Extracted from comix and chainedsoldier scrapers.
 */

/**
 * Scroll the page to the bottom to trigger lazy-loaded content.
 * Keeps scrolling until the scroll position stops changing.
 * 
 * @param {import('puppeteer').Page} page - Puppeteer page instance
 * @param {object} [options]
 * @param {number} [options.step=1500] - Pixels to scroll per step
 * @param {number} [options.interval=200] - Milliseconds between scroll steps
 * @param {number} [options.stableThreshold=3] - How many unchanged checks before stopping
 * @param {number} [options.timeout=60000] - Maximum scroll time in ms
 */
export async function scrollToBottom(page, {
  step = 1500,
  interval = 200,
  stableThreshold = 3,
  timeout = 60000
} = {}) {
  await page.evaluate(async (opts) => {
    await new Promise((resolve) => {
      let lastScrollY = -1;
      let sameCount = 0;

      const timer = setInterval(() => {
        window.scrollBy(0, opts.step);

        if (window.scrollY === lastScrollY) {
          sameCount++;
          if (sameCount >= opts.stableThreshold) {
            clearInterval(timer);
            resolve();
          }
        } else {
          sameCount = 0;
        }
        lastScrollY = window.scrollY;
      }, opts.interval);

      // Safety timeout
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, opts.timeout);
    });
  }, { step, interval, stableThreshold, timeout });
}

/**
 * Simple auto-scroll with fixed distance increments.
 * Scrolls until totalHeight >= scrollHeight.
 * 
 * @param {import('puppeteer').Page} page - Puppeteer page instance
 * @param {object} [options]
 * @param {number} [options.distance=100] - Pixels per scroll step
 * @param {number} [options.interval=100] - Milliseconds between steps
 */
export async function autoScroll(page, { distance = 100, interval = 100 } = {}) {
  await page.evaluate(async (opts) => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, opts.distance);
        totalHeight += opts.distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, opts.interval);
    });
  }, { distance, interval });
}
