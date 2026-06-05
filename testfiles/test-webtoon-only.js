import puppeteer from 'puppeteer';
import { ComixScraper } from '../src/scrapers/sites/comix.js';

process.env.NODE_ENV = 'test';

const WEBTOON_URL = 'https://comix.to/title/7lz5e-the-circumstances-of-being-chosen-as-the-villainesss-favorite/9893424-chapter-36';

async function testWebtoon() {
  console.log('Launching browser (headed)...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const scraper = new ComixScraper(browser);

  try {
    console.log('Starting Webtoon/Scroll extraction test...');
    const images = await scraper.getChapterImages(WEBTOON_URL);
    console.log(`\n✅ Webtoon result: ${images.length} images found`);
    images.slice(0, 5).forEach(img => {
      console.log(`   Page ${img.index}: ${img.url.substring(0, 90)}...`);
    });
    if (images.length > 5) {
      console.log(`   ... and ${images.length - 5} more`);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error(error.stack);
  } finally {
    console.log('\n⏸  Keeping browser open for 10s so you can inspect...');
    await new Promise(r => setTimeout(r, 10000));
    await browser.close();
    console.log('Done.');
  }
}

testWebtoon();
