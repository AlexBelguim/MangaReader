import puppeteer from 'puppeteer';

async function testHeadless() {
  console.log('Testing with headless mode...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,  // Same as the app
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();
  
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
  console.log('Scrolling slowly to trigger lazy loading...');
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
      }, 200); // 200ms between scrolls
    });
  });

  console.log('Waiting after scroll...');
  await new Promise(r => setTimeout(r, 3000));

  // Check again
  count = await page.evaluate(() => document.querySelectorAll('img.fit-w').length);
  console.log(`After scroll images found: ${count}`);

  // Scroll to bottom and back
  console.log('Scroll to bottom and back...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));

  count = await page.evaluate(() => document.querySelectorAll('img.fit-w').length);
  console.log(`After scroll cycle: ${count}`);

  // Get detailed image info
  const images = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img.fit-w');
    return Array.from(imgs).map(img => ({
      src: img.src,
      naturalWidth: img.naturalWidth,
      loaded: img.complete && img.naturalWidth > 0
    }));
  });

  console.log('\nImages found:');
  images.forEach((img, i) => {
    console.log(`  ${i + 1}. loaded: ${img.loaded}, size: ${img.naturalWidth}, src: ${img.src.substring(0, 60)}...`);
  });

  // Check all images on page
  const allImagesInfo = await page.evaluate(() => {
    const allImgs = document.querySelectorAll('img');
    return {
      total: allImgs.length,
      withFitW: document.querySelectorAll('img.fit-w').length,
      withWowpic: document.querySelectorAll('img[src*="wowpic"]').length,
      classes: Array.from(new Set(Array.from(allImgs).map(img => img.className)))
    };
  });

  console.log('\nAll images info:');
  console.log('  Total img tags:', allImagesInfo.total);
  console.log('  With fit-w class:', allImagesInfo.withFitW);
  console.log('  With wowpic src:', allImagesInfo.withWowpic);
  console.log('  Unique classes:', allImagesInfo.classes.filter(c => c).join(', '));

  await browser.close();
  console.log('\nDone!');
}

testHeadless().catch(console.error);
