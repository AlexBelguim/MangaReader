/**
 * Live diagnosis of the mangahere reader: what the chapter page exposes and
 * what the scraper extracts from it.
 *
 *   DATA_DIR=<scratch> DOWNLOADS_DIR=<scratch> node testfiles/debug-mangahere-chapter.mjs [manga url] [chapter number]
 */
import { scraperFactory } from '../src/scrapers/index.js';

const mangaUrl = process.argv[2] || 'https://newm.mangahere.cc/manga/ichi_the_witch/';
const wanted = parseFloat(process.argv[3] || '85');

await scraperFactory.init();
const scraper = scraperFactory.getScraperForUrl(mangaUrl);
try {
  const info = await scraper.getMangaInfo(mangaUrl);
  console.log(`title: ${info.title}, chapters: ${info.chapters.length}`);
  const ch = info.chapters.find(c => c.number === wanted) || info.chapters.at(-1);
  console.log('chapter:', ch);

  // Raw look at the reader page
  const page = await scraperFactory.browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setCookie({ name: 'isAdult', value: '1', domain: '.mangahere.cc' });
  const resp = await page.goto(ch.url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 2000));
  const diag = await page.evaluate(() => ({
    url: location.href,
    title: document.title,
    chapterid: typeof window.chapterid !== 'undefined' ? window.chapterid : null,
    imagecount: typeof window.imagecount !== 'undefined' ? window.imagecount : null,
    dm5_key: document.querySelector('#dm5_key')?.value ?? null,
    pagerLinks: document.querySelectorAll('.pager-list a[data-page]').length,
    pagerMax: Math.max(0, ...[...document.querySelectorAll('.pager-list a[data-page]')].map(a => parseInt(a.getAttribute('data-page'), 10) || 0)),
    newImgs: Array.isArray(window.newImgs) ? window.newImgs.length : null,
    imgs: [...document.querySelectorAll('img')].map(i => i.src).filter(s => /jpg|jpeg|png|webp/i.test(s)).slice(0, 5),
    readerImgs: document.querySelectorAll('img.reader-page, img#image, div.reader-main img, .reader-main img').length,
    scripts: [...document.scripts].map(s => s.src).filter(Boolean).slice(0, 12),
    bodySnippet: document.body.innerText.slice(0, 400).replace(/\s+/g, ' ')
  }));
  console.log('status:', resp && resp.status());
  console.log(JSON.stringify(diag, null, 1));

  // Try one chapterfun call the way the scraper does
  if (diag.chapterid) {
    const r = await page.evaluate(async ({ cid, key }) => {
      const resp = await fetch(`chapterfun.ashx?cid=${cid}&page=1&key=${encodeURIComponent(key || '')}`, { credentials: 'include' });
      const text = await resp.text();
      return { status: resp.status, len: text.length, head: text.slice(0, 300) };
    }, { cid: diag.chapterid, key: diag.dm5_key });
    console.log('chapterfun page 1:', r);
  }
  await page.close();

  const images = await scraper.getChapterImages(ch.url);
  console.log(`scraper.getChapterImages -> ${images.length} images`, images.slice(0, 2));
} finally {
  await scraperFactory.close();
}
