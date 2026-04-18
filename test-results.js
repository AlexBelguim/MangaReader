import { launchBrowser } from './src/scrapers/util/stealth-browser.js';
import { waitForCloudflare } from './src/scrapers/util/cloudflare.js';

async function test() {
  const { browser, page } = await launchBrowser({ stealth: true });
  try {
    await page.goto('https://nhentai.net/search/?q=english&sort=popular-today', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    const todayIds = await page.evaluate(() => Array.from(document.querySelectorAll('.gallery')).map(g => g.querySelector('a').href).slice(0, 5));
    
    await page.goto('https://nhentai.net/search/?q=english&sort=popular-week', { waitUntil: 'networkidle2' });
    await waitForCloudflare(page);
    const weekIds = await page.evaluate(() => Array.from(document.querySelectorAll('.gallery')).map(g => g.querySelector('a').href).slice(0, 5));
    
    console.log("Today:", todayIds);
    console.log("Week:", weekIds);
    console.log("Are they same?", JSON.stringify(todayIds) === JSON.stringify(weekIds));
  } finally {
    await browser.close();
    process.exit(0);
  }
}
test();
