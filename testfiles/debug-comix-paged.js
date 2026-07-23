import { scraperFactory } from '../src/scrapers/index.js';
import { fetchPage, toPuppeteerCookies } from '../src/scrapers/util/flaresolverr.js';

const URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';

await scraperFactory.init();
const scraper = scraperFactory.getScraperForUrl(URL);

// Recreate getChapterImages setup manually so we can toggle paged mode
const fsResult = await fetchPage('https://comix.to');
const cookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');

await scraper.createPageClean();
await scraper.page.evaluateOnNewDocument(() => {
  window.__cleanToDataURL = HTMLCanvasElement.prototype.toDataURL;
});
if (cookies.length) await scraper.page.setCookie(...cookies);
if (fsResult.userAgent) await scraper.page.setUserAgent(fsResult.userAgent);

await scraper.page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 3000));
await scraper.dismissReaderOverlays();

// Switch to paged mode: open settings, click "Left to right"
await scraper.page.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Settings"]')
    || document.querySelector('.rpage-bottombar__settings');
  if (btn) btn.click();
});
await new Promise(r => setTimeout(r, 800));
const switched = await scraper.page.evaluate(() => {
  const btn = [...document.querySelectorAll('.rpage-settings__panel button')]
    .find(b => b.textContent.trim() === 'Left to right');
  if (btn) { btn.click(); return true; }
  return false;
});
console.log('switched to paged:', switched);
await new Promise(r => setTimeout(r, 3000));
await scraper.dismissReaderOverlays();

const mode = await scraper.page.evaluate(() => ({
  mainClass: document.querySelector('main.rpage-main')?.className,
  segs: document.querySelectorAll('.rpage-progress__seg').length,
}));
console.log('mode:', JSON.stringify(mode));

const images = await scraper.walkPagedReader();
console.log(`PAGED RESULT: ${images.length} images`);
images.slice(0, 3).forEach(i => console.log(`  p${i.index}: ${String(i.url).slice(0, 90)}`));

await scraper.closePage();
await scraperFactory.close();
process.exit(0);
