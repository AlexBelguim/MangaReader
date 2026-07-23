import { scraperFactory } from '../src/scrapers/index.js';

const URL = 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168';

await scraperFactory.init();
const scraper = scraperFactory.getScraperForUrl(URL);
if (!scraper) { console.log('NO SCRAPER'); process.exit(1); }

const images = await scraper.getChapterImages(URL);
console.log(`RESULT: ${images.length} images`);
images.slice(0, 3).forEach(i => console.log(`  p${i.index}: ${String(i.url).slice(0, 100)}`));
await scraperFactory.close();
process.exit(0);
