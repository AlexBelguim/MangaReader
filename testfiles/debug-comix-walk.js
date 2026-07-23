import { scraperFactory } from '../src/scrapers/index.js';
import { fetchPage, toPuppeteerCookies } from '../src/scrapers/util/flaresolverr.js';
import fs from 'fs';

const URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';

await scraperFactory.init();
const page = await scraperFactory.browser.newPage();

const fsResult = await fetchPage('https://comix.to');
const cookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');
if (cookies.length) await page.setCookie(...cookies);
if (fsResult.userAgent) await page.setUserAgent(fsResult.userAgent);

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));

const snapshot = () => page.evaluate(() => {
  const out = [];
  for (const w of document.querySelectorAll('.rpage-page')) {
    const idx = w.getAttribute('data-page');
    const canvas = w.querySelector('canvas');
    const img = w.querySelector('img');
    out.push({
      idx,
      h: w.offsetHeight,
      canvas: canvas ? { w: canvas.width, h: canvas.height } : null,
      img: img ? {
        src: img.src ? img.src.slice(0, 60) : null,
        complete: img.complete,
        nw: img.naturalWidth,
      } : null,
    });
  }
  return { scrollY: window.scrollY, docH: document.documentElement.scrollHeight, pages: out };
});

const log = [];
for (let step = 0; step < 40; step++) {
  const s = await snapshot();
  log.push(s);
  console.log(`step ${step}: scrollY=${s.scrollY} pages=${s.pages.length} ` +
    s.pages.map(p => `${p.idx}:${p.img ? (p.img.complete && p.img.nw > 100 ? 'IMG-OK' : 'img-lazy') : '-'}${p.canvas && p.canvas.w > 100 ? '+CV' : ''}`).join(' '));
  const done = await page.evaluate(() => {
    const before = window.scrollY;
    window.scrollBy(0, 400);
    return window.scrollY === before && before > 0;
  });
  await new Promise(r => setTimeout(r, 700));
  if (done) break;
}

fs.writeFileSync('testfiles/comix-walk-diag.json', JSON.stringify(log, null, 2));
await page.close();
await scraperFactory.close();
process.exit(0);
