// E2E test of the updated ComixScraper against both reader modes
import puppeteer from 'puppeteer';
import { ComixScraper } from '../pisrc/src/scrapers/comix.js';

const URLS = {
  WEBTOON: 'https://comix.to/title/7lz5e-the-circumstances-of-being-chosen-as-the-villainesss-favorite/9893424-chapter-36',
  MANGA: 'https://comix.to/title/pvry-one-piece/9895591-chapter-1183'
};

async function test(label, url) {
  console.log(`\n========== ${label} ==========`);
  console.log(`URL: ${url}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const scraper = new ComixScraper(browser);
  try {
    const t0 = Date.now();
    const images = await scraper.getChapterImages(url);
    const dur = ((Date.now() - t0) / 1000).toFixed(1);
    console.log(`\n→ Got ${images.length} images in ${dur}s`);
    images.forEach(img => {
      console.log(`  ${String(img.index).padStart(3)}: ${img.url}`);
    });

    // Quick sanity checks
    const filenames = images.map(i => i.url.split('/').pop().replace('.webp', ''));
    console.log(`Filenames in order: ${filenames.join(', ')}`);
    const allUnique = new Set(images.map(i => i.url)).size === images.length;
    console.log(`All unique: ${allUnique}`);
  } catch (e) {
    console.error('TEST FAILED:', e);
  } finally {
    await browser.close();
  }
}

(async () => {
  await test('WEBTOON', URLS.WEBTOON);
  await test('MANGA', URLS.MANGA);
})();
