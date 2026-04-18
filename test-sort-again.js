import { NhentaiScraper } from './src/scrapers/sites/nhentai.js';

async function test() {
  const scraper = new NhentaiScraper();
  try {
    const today = await scraper.browse('popular-today', 1, 'english');
    const week = await scraper.browse('popular-week', 1, 'english');
    console.log("Today length:", today.results.length);
    console.log("Week length:", week.results.length);
    console.log("Today first 3:", today.results.slice(0, 3).map(r => r.galleryId));
    console.log("Week first 3:", week.results.slice(0, 3).map(r => r.galleryId));
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
test();
