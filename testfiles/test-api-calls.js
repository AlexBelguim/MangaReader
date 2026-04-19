import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    const urls = [];
    page.on('request', request => {
      if (request.url().includes('api')) urls.push(request.url());
    });
    await page.goto('https://nhentai.net/g/644135/', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    console.log("API calls:", urls);
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
