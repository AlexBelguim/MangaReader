import puppeteer from 'puppeteer';

async function testSearch() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Test Comix search
  await page.goto('https://comix.to/search?q=piece', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  
  const data = await page.evaluate(() => {
    return {
      title: document.title,
      links: Array.from(document.querySelectorAll('a')).map(a => a.href + ' | ' + a.textContent.trim()).slice(0, 15),
      html: document.body.innerHTML.substring(0, 1500)
    };
  });
  
  console.log("Comix Search:", data.title);
  console.log(data.links);
  
  await browser.close();
}
testSearch().catch(console.error);
