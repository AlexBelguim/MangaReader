import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    await page.goto('https://nhentai.net/g/644135/', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    const data = await page.evaluate(() => {
      return typeof window._gallery !== 'undefined' ? window._gallery : null;
    });
    console.log(data ? "Has window._gallery" : "No window._gallery");
    if (data) {
        console.log(`Media ID: ${data.media_id}, Pages: ${data.images.pages.length}`);
        console.log(`Format of page 1: ${data.images.pages[0].t}`);
    } else {
        // Look for any script with _gallery
        const scriptContent = await page.evaluate(() => {
           for (const s of document.scripts) {
              if (s.textContent.includes('_gallery')) return s.textContent.substring(0, 100);
           }
           return null;
        });
        console.log("Script content:", scriptContent);
    }
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
