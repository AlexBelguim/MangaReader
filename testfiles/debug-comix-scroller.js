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

const result = await page.evaluate(() => {
  const els = [];
  for (const el of document.querySelectorAll('*')) {
    const cs = getComputedStyle(el);
    const scrollable = (cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 50;
    if (scrollable || el === document.documentElement || el === document.body) {
      els.push({
        sel: el.tagName + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').join('.') : ''),
        overflowY: cs.overflowY,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        scrollable,
      });
    }
  }
  return els;
});
console.log(JSON.stringify(result, null, 1));

// Try scrolling each candidate and see which one actually moves + triggers loads
const scrollTest = await page.evaluate(() => {
  const report = [];
  const candidates = [document.documentElement, document.body,
    document.querySelector('main.rpage-main'),
    document.querySelector('.rpage-body') && document.body,
    ...document.querySelectorAll('main, [class*="scroll"], [class*="strip"]')].filter(Boolean);
  const seen = new Set();
  for (const el of candidates) {
    if (seen.has(el)) continue;
    seen.add(el);
    const before = el.scrollTop;
    el.scrollTop = before + 2000;
    report.push({
      sel: el.tagName + '.' + String(el.className).split(' ')[0],
      before, after: el.scrollTop, moved: el.scrollTop !== before,
    });
    el.scrollTop = before; // reset
  }
  return report;
});
console.log(JSON.stringify(scrollTest, null, 1));

await page.close();
await scraperFactory.close();
process.exit(0);
