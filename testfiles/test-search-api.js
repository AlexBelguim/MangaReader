import { scraperFactory } from '../src/scrapers/index.js';

async function testSearch() {
  console.log('Testing global scraper search...');
  
  try {
    await scraperFactory.init();
    
    const query = 'overgeared';
    console.log(`Searching for: "${query}" across all searchable scrapers...`);
    
    const results = await scraperFactory.searchAll(query);
    
    console.log(`Found ${results.length} total results:`);
    
    results.forEach((r, i) => {
      console.log(`\n--- Result ${i+1} ---`);
      console.log(`Title: ${r.title}`);
      console.log(`URL: ${r.url}`);
      console.log(`Cover: ${r.cover}`);
      console.log(`Chapters: ${r.chapterCount}`);
      console.log(`Source: ${r.website}`);
    });
    
  } catch (err) {
    console.error('Error during search test:', err);
  } finally {
    await scraperFactory.close();
    process.exit(0);
  }
}

testSearch();
