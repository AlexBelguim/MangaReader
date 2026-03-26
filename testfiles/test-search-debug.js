import { scraperFactory } from '../src/scrapers/index.js';

async function testSingle() {
  await scraperFactory.init();
  const query = 'piece'; // "piece" for One Piece

  console.log('Testing Comix...');
  const comix = scraperFactory.scrapers.find(s => s.websiteName === 'comix.to');
  try {
    const cRes = await comix.search(query);
    console.log(`Comix: ${cRes.length} results. First:`, cRes[0] || 'None');
  } catch (e) {
    console.error('Comix error', e);
  }

  console.log('\nTesting MangaHere...');
  const mangahere = scraperFactory.scrapers.find(s => s.websiteName === 'mangahere.cc');
  try {
    const mRes = await mangahere.search(query);
    console.log(`MangaHere: ${mRes.length} results. First:`, mRes[0] || 'None');
  } catch (e) {
    console.error('MangaHere error', e);
  }
  
  await scraperFactory.close();
  process.exit(0);
}

testSingle();
