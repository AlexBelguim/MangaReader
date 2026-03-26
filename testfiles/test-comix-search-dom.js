import puppeteer from 'puppeteer';

async function testComix() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  await page.goto('https://comix.to/search?q=piece', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const data = await page.evaluate(() => {
    // Find first list item with a manga link
    const item = document.querySelector('a[href*="/title/"]');
    return {
      classes: item ? item.className : 'null',
      parentClasses: item && item.parentElement ? item.parentElement.className : 'null',
      html: item ? item.innerHTML : 'No item found',
      pageHtml: document.body.innerHTML.substring(0, 500)
    };
  });
  
  console.log(data);
  await browser.close();
}

testComix().catch(console.error);
