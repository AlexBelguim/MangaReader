import { scraperFactory } from './src/scrapers/index.js';

async function test() {
  await scraperFactory.init();
  const scraper = scraperFactory.scrapers.find(s => s.websiteName === 'nhentai.net');
  try {
    const data = await scraper.getGalleryImageUrls('644135');
    console.log("Images fetched:", data.images.length);
    console.log("Title:", data.title);
    console.log("Page count:", data.pageCount);
    console.log("First image:", data.images[0]);
    console.log("Last image:", data.images[data.images.length - 1]);
  } catch (e) {
    console.error("Failed:", e);
  }
  process.exit(0);
}
test();
