import puppeteer from 'puppeteer';

async function testMangaHere() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setCookie({ name: 'isAdult', value: '1', domain: '.mangahere.cc' });
  
  await page.goto('https://newm.mangahere.cc/search?title=piece', { waitUntil: 'networkidle2' });
  
  const data = await page.evaluate(() => {
    // Find first list item with a manga link
    const item = document.querySelector('a[href*="/manga/"]').closest('li');
    return {
      classes: item ? item.className : 'null',
      parentClasses: item && item.parentElement ? item.parentElement.className : 'null',
      html: item ? item.innerHTML : 'No item found'
    };
  });
  
  console.log(data);
  await browser.close();
}

testMangaHere().catch(console.error);
