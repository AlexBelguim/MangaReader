import { scraperFactory } from '../src/scrapers/index.js';
import { downloader } from '../src/downloader.js';
import fs from 'fs-extra';
import path from 'path';

const CASES = [
  { name: 'comix', url: 'https://comix.to/title/pvry-one-piece/6553444-chapter-1168', chapter: 991 },
  { name: 'mangahere', url: 'https://www.mangahere.cc/manga/one_piece/v98/c1186/1.html', chapter: 992 },
];

await scraperFactory.init();

for (const c of CASES) {
  console.log(`\n===== E2E ${c.name}: ${c.url} =====`);
  const scraper = scraperFactory.getScraperForUrl(c.url);
  if (!scraper) { console.log('  NO SCRAPER'); continue; }

  const images = await scraper.getChapterImages(c.url);
  console.log(`  scraped: ${images.length} images`);
  if (images.length === 0) { console.log('  FAIL: 0 images'); continue; }

  const res = await downloader.downloadChapter('TEST_e2e_delete_me', c.chapter, images);
  console.log(`  download: success=${res.success} failed=${res.failed} skipped=${res.skipped}`);

  // Verify files on disk
  const dir = downloader.getChapterDir('TEST_e2e_delete_me', c.chapter);
  const files = (await fs.pathExists(dir)) ? await fs.readdir(dir) : [];
  const stats = [];
  for (const f of files.slice(0, 3)) {
    const st = await fs.stat(path.join(dir, f));
    stats.push(`${f}=${(st.size / 1024).toFixed(0)}KB`);
  }
  console.log(`  on disk: ${files.length} files [${stats.join(', ')}]`);
  console.log(files.length >= images.length && res.failed === 0 ? '  PASS' : '  FAIL');

  await fs.remove(downloader.getMangaDir('TEST_e2e_delete_me'));
}

await scraperFactory.close();
process.exit(0);
