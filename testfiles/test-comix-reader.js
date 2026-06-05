/**
 * Quick test script to verify the comix.to chapter image scraper
 * in headed (visible) mode for both webtoon and manga readers.
 * 
 * Usage: node testfiles/test-comix-reader.js
 */

import puppeteer from 'puppeteer';
import { ComixScraper } from '../src/scrapers/sites/comix.js';

// Override config to headed mode
process.env.NODE_ENV = 'test';

const WEBTOON_URL = 'https://comix.to/title/7lz5e-the-circumstances-of-being-chosen-as-the-villainesss-favorite/9893424-chapter-36';
const MANGA_URL = 'https://comix.to/title/pvry-one-piece/9895591-chapter-1183';

async function test() {
  // Launch headless browser matching the real app environment
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
  });

  const scraper = new ComixScraper(browser);

  try {
    // --- Test 1: Manga (paged) mode ---
    console.log('\n========================================');
    console.log('TEST 1: MANGA (PAGED) — One Piece Ch.1183');
    console.log('========================================\n');

    const mangaImages = await scraper.getChapterImages(MANGA_URL);
    console.log(`\n✅ Manga result: ${mangaImages.length} images found`);
    mangaImages.slice(0, 5).forEach(img => {
      console.log(`   Page ${img.index}: ${img.url.substring(0, 80)}...`);
    });
    if (mangaImages.length > 5) {
      console.log(`   ... and ${mangaImages.length - 5} more`);
    }

    // Pause so you can see the browser
    console.log('\n⏸  Pausing 5s before next test...');
    await new Promise(r => setTimeout(r, 5000));

    // --- Test 2: Webtoon (scroll) mode ---
    console.log('\n========================================');
    console.log('TEST 2: WEBTOON (SCROLL) — Villainess Ch.36');
    console.log('========================================\n');

    const webtoonImages = await scraper.getChapterImages(WEBTOON_URL);
    console.log(`\n✅ Webtoon result: ${webtoonImages.length} images found`);
    webtoonImages.slice(0, 5).forEach(img => {
      console.log(`   Page ${img.index}: ${img.url.substring(0, 80)}...`);
    });
    if (webtoonImages.length > 5) {
      console.log(`   ... and ${webtoonImages.length - 5} more`);
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

test();
