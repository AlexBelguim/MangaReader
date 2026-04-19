import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    const response = await page.goto('https://i3.nhentai.net/galleries/3891442/1.jpg');
    console.log("Status for 1.jpg:", response.status());
    const response2 = await page.goto('https://i3.nhentai.net/galleries/3891442/1.webp');
    console.log("Status for 1.webp:", response2.status());
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
