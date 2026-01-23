import puppeteer from 'puppeteer';
import { ChainedSoldierScraper } from '../src/scrapers/chainedsoldier.js';

async function debugChapter() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  try {
    const scraper = new ChainedSoldierScraper(browser);
    const chapterUrl = 'https://chained-soldier.live/comic/chained-soldier-chapter-116/';

    console.log(`Starting scrap for: ${chapterUrl}`);
    const images = await scraper.getChapterImages(chapterUrl);

    console.log('\n--- SCRAPE RESULTS ---');
    console.log(`Found ${images.length} images:`);
    images.forEach(img => {
      console.log(`  [${img.index}] ${img.url}`);
    });

    console.log('\nSuccess! Browser will close in 30 seconds...');
    await new Promise(r => setTimeout(r, 30000));

  } catch (err) {
    console.error('Scrape failed:', err);
  } finally {
    await browser.close();
  }
}

debugChapter().catch(console.error);
