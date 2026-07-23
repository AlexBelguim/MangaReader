import puppeteer from 'puppeteer';
import { fetchPage, toPuppeteerCookies } from '../src/scrapers/util/flaresolverr.js';

const URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';

const fsResult = await fetchPage('https://comix.to');
const cookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
if (cookies.length) await page.setCookie(...cookies);
if (fsResult.userAgent) await page.setUserAgent(fsResult.userAgent);

page.on('console', m => console.log('[console]', m.type(), m.text().slice(0, 200)));
page.on('pageerror', e => console.log('[pageerror]', String(e).slice(0, 300)));
page.on('requestfailed', r => console.log('[reqfail]', r.url().slice(0, 120), r.failure()?.errorText));
page.on('response', r => {
  const u = r.url();
  if (u.includes('/api/') || u.includes('image') || u.includes('chapter')) {
    console.log('[resp]', r.status(), u.slice(0, 140));
  }
});

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
console.log('--- loaded, waiting 15s for app to render/fetch ---');
await new Promise(r => setTimeout(r, 15000));

const state = await page.evaluate(() => ({
  appRootChildren: document.getElementById('app-root')?.children.length,
  rpageEls: document.querySelectorAll('[class*="rpage"]').length,
  segs: document.querySelectorAll('.rpage-progress__seg').length,
  imgs: document.querySelectorAll('img').length,
}));
console.log('state:', JSON.stringify(state));
await browser.close();
