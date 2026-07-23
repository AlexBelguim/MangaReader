import puppeteer from 'puppeteer';
import { fetchPage, toPuppeteerCookies } from '../src/scrapers/util/flaresolverr.js';
import fs from 'fs';

const URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';

const fsResult = await fetchPage('https://comix.to');
const cookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');
console.log('cookies:', cookies.map(c => c.name));

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
if (cookies.length) await page.setCookie(...cookies);
if (fsResult.userAgent) await page.setUserAgent(fsResult.userAgent);

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));

const info = await page.evaluate(() => {
  const pick = (sel) => document.querySelectorAll(sel).length;
  return {
    title: document.title,
    url: location.href,
    counts: {
      'main.rpage-main': pick('main.rpage-main'),
      'rpage-progress__seg': pick('.rpage-progress__seg'),
      'rpage-page__img': pick('img.rpage-page__img'),
      '.rpage-page': pick('.rpage-page'),
      canvas: pick('canvas'),
      'img (all)': pick('img'),
      '#initial-data': pick('#initial-data'),
      '[class*="rpage"]': pick('[class*="rpage"]'),
      '[class*="reader"]': pick('[class*="reader"]'),
      '[class*="chapter"]': pick('[class*="chapter"]'),
    },
    bodyClasses: document.body.className,
    mainHtmlSample: (document.querySelector('main') || document.body).innerHTML.slice(0, 3000),
  };
});
console.log(JSON.stringify({ ...info, mainHtmlSample: undefined }, null, 2));
fs.writeFileSync('testfiles/comix-page-sample.html', info.mainHtmlSample);
await page.screenshot({ path: 'testfiles/comix-page.png' });
const html = await page.content();
fs.writeFileSync('testfiles/comix-page-full.html', html);
console.log('saved testfiles/comix-page-full.html (' + html.length + ' chars) + screenshot');
await browser.close();
