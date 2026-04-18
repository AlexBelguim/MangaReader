import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    await page.goto('https://nhentai.net/search/?q=english', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    
    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('.sort-dropdown a, .sort a'));
      return anchors.map(a => a.href);
    });
    console.log("Sort links found:", links);
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
