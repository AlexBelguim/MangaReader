import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    await page.goto('https://nhentai.net/api/gallery/644135', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    const data = await page.evaluate(() => document.body.innerText);
    try {
       const json = JSON.parse(data);
       console.log("Success! Media ID:", json.media_id, "Pages:", json.images.pages.length);
       console.log("Page 1:", json.images.pages[0]);
    } catch(e) {
       console.log("Not JSON:", data.substring(0, 200));
    }
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
