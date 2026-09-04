/**
 * Live exercise of the weebcentral.com scraper: search, browse (two sorts,
 * plus a second page), getMangaInfo, getChapterImages for the first chapter,
 * quickCheckUpdates with all but the two newest chapters known (and once
 * with everything known), and one image download with the headers the
 * scraper returns.
 *
 *   DATA_DIR=<scratch>/data DOWNLOADS_DIR=<scratch>/downloads PUPPETEER_PROFILE_DIR=<scratch>/profile \
 *     node testfiles/debug-weebcentral.mjs [series url] [search query]
 */
import { scraperFactory } from '../src/scrapers/index.js';

const mangaUrl = process.argv[2] || 'https://weebcentral.com/series/01J76XYCRVY3QGYAMRR3STW941/Chainsaw-Man';
const query = process.argv[3] || 'chainsaw man';

const show = (label, list) => {
  console.log(`${label}: ${list.length}`);
  for (const item of list.slice(0, 2)) console.log('   ', item);
};

await scraperFactory.init();
const scraper = scraperFactory.getScraperForUrl(mangaUrl);
try {
  console.log('\n== search ==');
  show(`search(${JSON.stringify(query)})`, await scraper.search(query));

  console.log('\n== browse ==');
  console.log('browseOptions:', scraper.browseOptions);
  for (const sort of ['Popularity', 'Latest Updates']) {
    const data = await scraper.browse(sort, 1, '');
    console.log(`browse(${sort}, page 1) -> totalPages=${data.totalPages} currentPage=${data.currentPage}`);
    show('  results', data.results);
  }
  const page2 = await scraper.browse('Popularity', 2, '');
  console.log(`browse(Popularity, page 2) -> totalPages=${page2.totalPages} currentPage=${page2.currentPage}`);
  show('  results', page2.results);
  const cached = await scraper.browse('Popularity', 2, '');
  console.log(`browse(Popularity, page 2) again -> same object from cache: ${cached === page2}`);

  console.log('\n== getMangaInfo ==');
  const info = await scraper.getMangaInfo(mangaUrl);
  console.log(`title=${JSON.stringify(info.title)} website=${info.website}`);
  console.log(`totalChapters=${info.totalChapters} uniqueChapters=${info.uniqueChapters} duplicateChapters=${info.duplicateChapters.length}`);
  console.log(`cover=${info.cover}`);
  console.log(`description=${JSON.stringify(info.description.slice(0, 160))}...`);
  show('chapters', info.chapters);
  console.log('    last:', info.chapters.at(-1));
  const ascending = info.chapters.every((ch, i) => i === 0 || ch.number >= info.chapters[i - 1].number);
  console.log(`chapters sorted ascending: ${ascending}`);

  console.log('\n== getChapterImages (first chapter) ==');
  const first = info.chapters[0];
  const images = await scraper.getChapterImages(first.url);
  show(`getChapterImages(${first.title} ${first.url})`, images);
  console.log('    last:', images.at(-1));

  console.log('\n== image download with returned headers ==');
  const response = await fetch(images[0].url, { headers: images[0].headers });
  const bytes = (await response.arrayBuffer()).byteLength;
  console.log(`GET ${images[0].url}`);
  console.log(`  headers sent: ${JSON.stringify(images[0].headers)}`);
  console.log(`  -> HTTP ${response.status} ${response.headers.get('content-type')} ${bytes} bytes`);

  console.log('\n== quickCheckUpdates ==');
  const allUrls = info.chapters.map(ch => ch.url);
  const check = await scraper.quickCheckUpdates(mangaUrl, allUrls.slice(0, -2));
  console.log(`all but the two newest known -> hasUpdates=${check.hasUpdates} latestChapter=${check.latestChapter} newChapters=${check.newChapters.length} firstPageChapters=${check.firstPageChapters.length}`);
  console.log('  new:', check.newChapters.map(ch => `${ch.title} (${ch.url})`));
  const none = await scraper.quickCheckUpdates(mangaUrl, allUrls);
  console.log(`everything known -> hasUpdates=${none.hasUpdates} latestChapter=${none.latestChapter} newChapters=${none.newChapters.length} firstPageChapters=${none.firstPageChapters.length}`);
} finally {
  await scraperFactory.close();
}
