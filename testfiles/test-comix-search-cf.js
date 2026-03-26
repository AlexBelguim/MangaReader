import puppeteer from 'puppeteer';

async function testComixSearch() {
  const browser = await puppeteer.launch({ 
    headless: false, // Use non-headless to see if it bypasses CF better
    args: ['--no-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  console.log('Navigating to comix.to...');
  await page.goto('https://comix.to/', { waitUntil: 'domcontentloaded' });
  
  console.log('Waiting for Cloudflare...');
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Starting search...');
  await page.goto('https://comix.to/search?q=dandadan', { waitUntil: 'networkidle2' });
  
  const html = await page.content();
  console.log(`Page size: ${html.length}`);
  
  const isCloudflare = html.includes('Ray ID:') || html.includes('cloudflare');
  console.log(`Is Cloudflare challenge? ${isCloudflare}`);
  
  const items = await page.evaluate(() => {
    const list = document.querySelectorAll('a[href*="/title/"]');
    return Array.from(list).map(a => a.href);
  });
  
  console.log(`Found ${items.length} titles.`);
  
  await browser.close();
}

testComixSearch().catch(console.error);
