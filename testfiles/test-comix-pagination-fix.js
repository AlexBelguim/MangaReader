// E2E test of the fixed ComixScraper pagination (add + refresh paths)
import puppeteer from 'puppeteer';
import { ComixScraper } from '../src/scrapers/sites/comix.js';

const URL = 'https://comix.to/title/8w59d-solo-leveling-ragnarok';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const scraper = new ComixScraper(browser);
  try {
    console.log('\n===== getMangaInfo (ADD path) =====');
    const info = await scraper.getMangaInfo(URL);
    console.log(`Title: ${info.title}`);
    console.log(`chapters returned: ${info.chapters.length}, uniqueChapters: ${info.uniqueChapters}, totalChapters: ${info.totalChapters}`);
    const nums = info.chapters.map(c => c.number);
    console.log(`number range: ${Math.min(...nums)} .. ${Math.max(...nums)}`);

    console.log('\n===== quickCheckUpdates: simulate FRESH manga (no known) =====');
    const fresh = await scraper.quickCheckUpdates(URL, []);
    console.log(`hasUpdates: ${fresh.hasUpdates}, newChapters: ${fresh.newChapters.length}, latest: ${fresh.latestChapter}`);

    console.log('\n===== quickCheckUpdates: simulate UP-TO-DATE (all known) =====');
    const knownAll = info.chapters.map(c => c.url);
    const upToDate = await scraper.quickCheckUpdates(URL, knownAll);
    console.log(`hasUpdates: ${upToDate.hasUpdates}, newChapters: ${upToDate.newChapters.length} (expect 0, should stop after page 1)`);

    console.log('\n===== quickCheckUpdates: simulate KNOW only oldest (missing many across pages) =====');
    // Pretend we only know the oldest ~250 chapters -> ~60 new spread across early pages
    const knownPartial = info.chapters.filter(c => c.number <= 60).map(c => c.url);
    const partial = await scraper.quickCheckUpdates(URL, knownPartial);
    console.log(`known: ${knownPartial.length}, hasUpdates: ${partial.hasUpdates}, newChapters: ${partial.newChapters.length}`);
    const newNums = partial.newChapters.map(c => c.number);
    console.log(`new number range: ${Math.min(...newNums)} .. ${Math.max(...newNums)} (expect ~61..68)`);
  } catch (e) {
    console.error('TEST FAILED:', e);
  } finally {
    await browser.close();
  }
})();
