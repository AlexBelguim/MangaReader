/**
 * Quick-check feature — fetches the first page of a manga and compares
 * chapters against a known list to detect new updates.
 * 
 * Scrapers provide a fetchChapters function (FlareSolverr, Puppeteer, etc.)
 * and optionally a fallback strategy.
 */

/**
 * @param {string} url - Manga URL to check
 * @param {Array<string>} knownChapterUrls - Previously known chapter URLs
 * @param {object} config
 * @param {Function} config.fetchChapters - async (url) => Array<{ number, title, url }>
 * @param {Function} [config.fallback] - async (url, knownChapterUrls) => result
 * @param {Function} [config.cleanup] - async () => void
 * @returns {{ hasUpdates: boolean, latestChapter: number|null, newChapters: Array, firstPageChapters: Array }}
 */
export async function quickCheck(url, knownChapterUrls, { fetchChapters, fallback, cleanup }) {
  try {
    const firstPageChapters = await fetchChapters(url);

    const knownUrlSet = new Set(knownChapterUrls);
    const newChapters = firstPageChapters.filter(ch => !knownUrlSet.has(ch.url));
    const latestChapter = firstPageChapters.length > 0
      ? Math.max(...firstPageChapters.map(c => c.number))
      : null;

    console.log(`  Found ${firstPageChapters.length} chapters on first page, ${newChapters.length} new`);

    return {
      hasUpdates: newChapters.length > 0,
      latestChapter,
      newChapters,
      firstPageChapters
    };
  } catch (error) {
    if (fallback) {
      console.log(`  Primary fetch failed: ${error.message}, trying fallback...`);
      return fallback(url, knownChapterUrls);
    }
    throw error;
  } finally {
    if (cleanup) await cleanup();
  }
}
