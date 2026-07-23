/**
 * Diagnose broken chapter-image extraction after comix -> mangahere migration.
 * Tests ComixScraper and MangaHereScraper getChapterImages on real URLs.
 */
import puppeteer from 'puppeteer';
import { ComixScraper } from '../src/scrapers/sites/comix.js';
import { MangaHereScraper } from '../src/scrapers/sites/mangahere.js';

process.env.NODE_ENV = 'test';

const COMIX_URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';
const MANGAHERE_URL = 'https://www.mangahere.cc/manga/one_piece/v98/c1186/1.html';

const browser = await puppeteer.launch({
  headless: 'new',
  defaultViewport: { width: 1280, height: 900 },
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

async function run(name, Scraper, url) {
  console.log(`\n===== ${name}: ${url} =====`);
  const scraper = new Scraper(browser);
  try {
    const images = await scraper.getChapterImages(url);
    console.log(`RESULT: ${images.length} images`);
    images.slice(0, 3).forEach(i => console.log(`  p${i.index}: ${String(i.url).slice(0, 100)}`));
  } catch (e) {
    console.log(`ERROR: ${e.message}`);
  }
}

try {
  await run('COMIX', ComixScraper, COMIX_URL);
  await run('MANGAHERE', MangaHereScraper, MANGAHERE_URL);
} finally {
  await browser.close();
}
