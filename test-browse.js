import { scraperFactory } from './src/scrapers/index.js';

async function test() {
  await scraperFactory.init();
  const targetScraper = 'nhentai.net';
  const scraper = scraperFactory.getScraperForUrl(targetScraper) || 
                  scraperFactory.scrapers.find(s => s.websiteName === targetScraper);
  console.log("Scraper found:", !!scraper);
  if (scraper) {
    console.log("supportsBrowse:", scraper.supportsBrowse);
    try {
      const data = await scraper.browse('popular-today', 1, 'english');
      console.log("Browse success. Total items:", data.results.length);
    } catch (e) {
      console.error("Browse failed:", e);
    }
  }
  process.exit(0);
}
test();
