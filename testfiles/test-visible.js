import puppeteer from 'puppeteer';

async function testVisible() {
  console.log('Testing with visible browser (headless: false)...\n');
  
  const browser = await puppeteer.launch({ 
    headless: false,
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

  let count = await page.evaluate(() => document.querySelectorAll('img.fit-w').length);
  console.log(`Initial images found: ${count}`);

  // Scroll slowly
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

  // List all image URLs
  const images = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img.fit-w');
    return Array.from(imgs).map((img, i) => `${i+1}. ${img.src}`);
  });
  
  console.log('\nImages:');
  images.forEach(img => console.log(img));
  
  // Wait a bit then close
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
}

testVisible().catch(console.error);
