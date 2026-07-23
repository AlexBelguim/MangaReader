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

// Disable smooth scrolling / scroll snapping, then step through absolutely
await page.evaluate(() => {
  for (const el of [document.documentElement, document.body, ...document.querySelectorAll('main, [class*="rpage"]')]) {
    if (!el || !el.style) continue;
    el.style.scrollBehavior = 'auto';
    el.style.scrollSnapType = 'none';
  }
});

const captured = new Map();
for (let step = 0; step < 40; step++) {
  const s = await page.evaluate((step) => {
    const docH = document.documentElement.scrollHeight;
    const y = Math.round((docH - window.innerHeight) * (step / 39));
    window.scrollTo({ top: y, behavior: 'instant' });
    return { target: y, actual: window.scrollY, docH };
  }, step);

  await new Promise(r => setTimeout(r, 800));

  const loaded = await page.evaluate(() => {
    const out = [];
    for (const w of document.querySelectorAll('.rpage-page')) {
      const img = w.querySelector('img');
      if (img && img.src && img.complete && img.naturalWidth > 100) {
        out.push({ idx: parseInt(w.getAttribute('data-page'), 10), src: img.src });
      }
    }
    return out;
  });
  for (const p of loaded) if (!captured.has(p.idx)) captured.set(p.idx, p.src);
  console.log(`step ${step}: target=${s.target} actual=${s.actual} docH=${s.docH} loadedNow=${loaded.length} total=${captured.size}`);
  if (captured.size >= 15) { console.log('ALL 15 CAPTURED'); break; }
}
console.log('final:', captured.size, 'pages:', [...captured.keys()].sort((a, b) => a - b).join(','));

await page.close();
await scraperFactory.close();
process.exit(0);
