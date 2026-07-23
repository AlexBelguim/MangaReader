import { scraperFactory } from '../src/scrapers/index.js';
import { fetchPage, toPuppeteerCookies } from '../src/scrapers/util/flaresolverr.js';

const URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';

await scraperFactory.init();
const page = await scraperFactory.browser.newPage();

const fsResult = await fetchPage('https://comix.to');
const cookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');
if (cookies.length) await page.setCookie(...cookies);
if (fsResult.userAgent) await page.setUserAgent(fsResult.userAgent);

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));

// What's persisted for reader prefs?
const storage = await page.evaluate(() => ({
  localStorage: Object.entries(localStorage),
  mainClass: document.querySelector('main.rpage-main')?.className,
}));
console.log('storage:', JSON.stringify(storage, null, 1));

// Open the settings panel and dump its options
const opened = await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label="Settings"]')
    || document.querySelector('.rpage-bottombar__settings');
  if (btn) { btn.click(); return true; }
  return false;
});
console.log('settings opened:', opened);
await new Promise(r => setTimeout(r, 1000));

const panel = await page.evaluate(() => {
  const p = document.querySelector('.rpage-settings__panel');
  if (!p) return null;
  const buttons = [...p.querySelectorAll('button, [role="radio"], [role="tab"], select, input')]
    .map(b => ({
      tag: b.tagName,
      label: (b.getAttribute('aria-label') || b.textContent || '').trim().slice(0, 40),
      pressed: b.getAttribute('aria-pressed'),
      checked: b.getAttribute('aria-checked') ?? b.checked,
    }));
  return { text: p.textContent.replace(/\s+/g, ' ').slice(0, 400), buttons };
});
console.log('panel:', JSON.stringify(panel, null, 1));

await page.close();
await scraperFactory.close();
process.exit(0);
