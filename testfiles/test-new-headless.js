import puppeteer from 'puppeteer';

async function testNewHeadless() {
  console.log('Testing with new headless mode (headless: "new")...\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',  // New headless mode - more like real browser
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--disable-blink-features=AutomationControlled']
  });
  const page = await browser.newPage();
  
  // Override detection methods
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const chapterUrl = 'https://comix.to/title/69l6g-chained-soldier/5358475-chapter-6';
  
  console.log('Navigating to:', chapterUrl);
  await page.goto(chapterUrl, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('Page loaded, initial wait...');
  await new Promise(r => setTimeout(r, 3000));

  // Check initial image count
  let count = await page.evaluate(() => document.querySelectorAll('img.fit-w').length);
  console.log(`Initial images found: ${count}`);

  // Scroll slowly through the page
  console.log('Scrolling slowly...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight + 500) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });

  await new Promise(r => setTimeout(r, 3000));

  count = await page.evaluate(() => document.querySelectorAll('img.fit-w').length);
  console.log(`After scroll images found: ${count}`);

  // Get images
  const images = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img.fit-w');
    return Array.from(imgs).map(img => ({
      src: img.src,
      loaded: img.complete && img.naturalWidth > 0
    }));
  });

  console.log(`\nFound ${images.length} images with fit-w class`);
  
  await browser.close();
}

testNewHeadless().catch(console.error);
