import { scraperFactory } from '../src/scrapers/index.js';
import { fetchPage, toPuppeteerCookies } from '../src/scrapers/util/flaresolverr.js';

const URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';

await scraperFactory.init();
const page = await scraperFactory.browser.newPage();

const apiBodies = [];
page.on('response', async (r) => {
  const u = r.url();
  if (u.includes('/api/')) {
    let body = null;
    try { body = (await r.text()).slice(0, 800); } catch {}
    apiBodies.push({ status: r.status(), url: u, body });
    console.log('[api]', r.status(), u.slice(0, 140));
  }
});

const fsResult = await fetchPage('https://comix.to');
const cookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');
if (cookies.length) await page.setCookie(...cookies);
if (fsResult.userAgent) await page.setUserAgent(fsResult.userAgent);

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 10000));

const state = await page.evaluate(() => ({
  segs: document.querySelectorAll('.rpage-progress__seg').length,
  pages: document.querySelectorAll('.rpage-page').length,
  mainClass: document.querySelector('main.rpage-main')?.className || null,
  viewport: { w: innerWidth, h: innerHeight },
}));
console.log('state:', JSON.stringify(state));

const fsx = await import('fs');
fsx.writeFileSync('testfiles/comix-api-capture.json', JSON.stringify(apiBodies, null, 2));
console.log('saved testfiles/comix-api-capture.json');
await page.close();
await scraperFactory.close();
process.exit(0);
