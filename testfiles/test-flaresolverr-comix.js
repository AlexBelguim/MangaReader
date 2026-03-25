/**
 * Integration test for FlareSolverr + comix.to scraper
 * 
 * Prerequisites: FlareSolverr must be running on localhost:8191
 *   docker run -d -p 8191:8191 ghcr.io/flaresolverr/flaresolverr:latest
 * 
 * Usage: node testfiles/test-flaresolverr-comix.js
 */
import { isAvailable, fetchPage } from '../src/scrapers/flaresolverr.js';
import { ComixScraper } from '../src/scrapers/comix.js';

const COMIX_TEST_URL = 'https://comix.to/title/pvry-one-piece';

async function main() {
  console.log('=== FlareSolverr + Comix.to Integration Test ===\n');

  // Step 1: Check FlareSolverr
  console.log('1. Checking FlareSolverr availability...');
  const available = await isAvailable();
  if (!available) {
    console.log('   ❌ FlareSolverr is NOT running!');
    console.log('   Start it with: docker run -d -p 8191:8191 ghcr.io/flaresolverr/flaresolverr:latest');
    process.exit(1);
  }
  console.log('   ✅ FlareSolverr is running\n');

  // Step 2: Test raw FlareSolverr fetch
  console.log('2. Fetching comix.to page via FlareSolverr...');
  try {
    const result = await fetchPage(COMIX_TEST_URL);
    console.log(`   ✅ Got response: ${result.html.length} chars, status ${result.status}`);
    console.log(`   Cookies: ${result.cookies.length}`);
    console.log(`   User-Agent: ${result.userAgent.substring(0, 60)}...`);

    // Check if we got past Cloudflare
    if (result.html.includes('Just a moment') || result.html.includes('Even geduld')) {
      console.log('   ❌ Still stuck on Cloudflare challenge page!');
    } else {
      console.log('   ✅ Bypassed Cloudflare challenge!');
    }

    // Check for chapter links
    const chapterCount = (result.html.match(/chapter-\d/g) || []).length;
    console.log(`   Chapter link references in HTML: ${chapterCount}`);
  } catch (err) {
    console.log(`   ❌ FlareSolverr fetch failed: ${err.message}`);
    process.exit(1);
  }
  console.log('');

  // Step 3: Test scraper quickCheck
  console.log('3. Testing ComixScraper.quickCheckUpdates...');
  const scraper = new ComixScraper(null); // browser not needed for FlareSolverr path
  try {
    const result = await scraper.quickCheckUpdates(COMIX_TEST_URL, []);
    console.log(`   ✅ Quick check result:`);
    console.log(`   Latest chapter: ${result.latestChapter}`);
    console.log(`   Chapters on first page: ${result.firstPageChapters.length}`);
    console.log(`   New chapters: ${result.newChapters.length}`);
    if (result.firstPageChapters.length > 0) {
      console.log(`   First: Ch.${result.firstPageChapters[0].number} - ${result.firstPageChapters[0].title}`);
      const last = result.firstPageChapters[result.firstPageChapters.length - 1];
      console.log(`   Last:  Ch.${last.number} - ${last.title}`);
    }
  } catch (err) {
    console.log(`   ❌ quickCheckUpdates failed: ${err.message}`);
  }
  console.log('');

  // Step 4: Test scraper getMangaInfo
  console.log('4. Testing ComixScraper.getMangaInfo...');
  try {
    const info = await scraper.getMangaInfo(COMIX_TEST_URL);
    console.log(`   ✅ Manga info:`);
    console.log(`   Title: ${info.title}`);
    console.log(`   Total chapters: ${info.totalChapters}`);
    console.log(`   Unique chapters: ${info.uniqueChapters}`);
    console.log(`   Cover: ${info.cover ? 'yes' : 'no'}`);
    console.log(`   Description: ${info.description?.substring(0, 80) || 'none'}...`);
    if (info.chapters.length > 0) {
      console.log(`   First chapter: ${info.chapters[0].title} (${info.chapters[0].url})`);
    }
  } catch (err) {
    console.log(`   ❌ getMangaInfo failed: ${err.message}`);
  }

  console.log('\n=== Test Complete ===');
}

main().catch(console.error);
