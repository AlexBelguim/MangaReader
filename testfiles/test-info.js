import { NhentaiScraper } from './src/scrapers/sites/nhentai.js';

async function test() {
  const scraper = new NhentaiScraper();
  try {
    const info = await scraper.getMangaInfo('https://nhentai.net/g/644135/');
    console.log(info);
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
test();
