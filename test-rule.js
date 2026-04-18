import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    await page.goto('https://nhentai.net/g/644135/', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    const data = await page.evaluate(() => {
      const thumbs = Array.from(document.querySelectorAll('.gallerythumb img'))
         .map(img => img.getAttribute('data-src') || img.src)
         .filter(src => src && src.includes('nhentai.net'));
      return thumbs.slice(0, 3);
    });
    console.log("Thumbs:", data);
    
    // Now check the actual page 1
    await page.goto('https://nhentai.net/g/644135/1/', { waitUntil: 'networkidle2' });
    const full1 = await page.evaluate(() => document.querySelector('#image-container img').src);
    console.log("Full 1:", full1);
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
