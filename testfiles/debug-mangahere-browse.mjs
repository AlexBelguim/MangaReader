/**
 * Live check of mangahere catalog browsing: two directory sorts on pages 1
 * and 2, one text query, then getMangaInfo on a browse result to prove the
 * URLs it returns are usable.
 *
 *   DATA_DIR=<scratch>/data DOWNLOADS_DIR=<scratch>/downloads PUPPETEER_PROFILE_DIR=<scratch>/profile \
 *     node testfiles/debug-mangahere-browse.mjs [query]
 */
import { scraperFactory } from '../src/scrapers/index.js';

const query = process.argv[2] || 'naruto';

function show(label, data) {
  console.log(`\n${label}: ${data.results.length} results, page ${data.currentPage}/${data.totalPages}`);
  for (const r of data.results.slice(0, 2)) {
    console.log(`   ${r.title} | ch ${r.chapterCount} | ${r.url}\n      cover: ${r.cover}`);
  }
  const noCover = data.results.filter(r => !r.cover).length;
  if (noCover) console.log(`   (${noCover} results without a cover)`);
}

await scraperFactory.init();
const scraper = scraperFactory.getScraperForUrl('https://www.mangahere.cc/manga/onepunch_man/');
try {
  console.log('browseOptions:', JSON.stringify(scraper.browseOptions));

  const runs = [
    ['popular', 1, ''], ['popular', 2, ''],
    ['latest', 1, ''], ['latest', 2, ''],
    ['popular', 1, query],
  ];
  let sample = null;
  for (const [sort, page, q] of runs) {
    const data = await scraper.browse(sort, page, q);
    show(`browse(${sort}, ${page}, ${JSON.stringify(q)})`, data);
    if (q && data.results[0]) sample = data.results[0];
    await scraper.randomDelay(800, 1500);
  }

  // Same request again must come from the cache (no page load).
  const again = await scraper.browse('popular', 1, '');
  console.log(`\ncache re-read: ${again.results.length} results`);

  if (sample) {
    const info = await scraper.getMangaInfo(sample.url);
    console.log(`\ngetMangaInfo(${sample.url})`);
    console.log(`   title: ${info.title} | chapters: ${info.chapters.length} | cover: ${info.cover}`);
    console.log('   first chapter:', info.chapters[0]);
    console.log('   last chapter:', info.chapters.at(-1));
  }
} finally {
  await scraperFactory.close();
}
