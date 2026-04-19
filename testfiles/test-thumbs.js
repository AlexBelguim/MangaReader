import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    await page.goto('https://nhentai.net/g/644135/', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    const data = await page.evaluate(() => {
      const cover = document.querySelector('#cover img')?.src || '';
      const thumbs = Array.from(document.querySelectorAll('.gallerythumb img'))
         .map(img => img.getAttribute('data-src') || img.src)
         .filter(src => src && src.includes('nhentai.net'));
      return { cover, thumbs: thumbs.slice(0, 3) };
    });
    console.log("Cover:", data.cover);
    console.log("Thumbs:", data.thumbs);
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
