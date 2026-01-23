import puppeteer from 'puppeteer';

async function testDownload() {
  // Launch browser exactly like debug-chapter.js
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const chapterUrl = 'https://comix.to/title/69l6g-chained-soldier/5358475-chapter-6';
  
  console.log('Loading chapter:', chapterUrl);
  await page.goto(chapterUrl, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // Scroll until we truly reach the bottom (scroll position stops changing)
  console.log('Scrolling to load all images...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let lastScrollY = -1;
      let sameCount = 0;
      
      const timer = setInterval(() => {
        window.scrollBy(0, 1500);
        
        // Check if scroll position changed
        if (window.scrollY === lastScrollY) {
          sameCount++;
          // If position hasn't changed for 3 checks, we're at the bottom
          if (sameCount >= 3) {
            clearInterval(timer);
            resolve();
          }
        } else {
          sameCount = 0;
        }
        lastScrollY = window.scrollY;
      }, 200);
      
      // Safety timeout
      setTimeout(() => {
        clearInterval(timer);
        resolve();
      }, 60000);
    });
  });

  await new Promise(r => setTimeout(r, 2000));

  // Get images
  const images = await page.evaluate(() => {
    const imgs = document.querySelectorAll('img.fit-w');
    return Array.from(imgs).map((img, i) => ({
      index: i + 1,
      url: img.src
    }));
  });

  console.log(`\nFound ${images.length} images:\n`);
  images.forEach(img => {
    console.log(`  ${img.index}. ${img.url}`);
  });

  await new Promise(r => setTimeout(r, 3000));
  await browser.close();
}

testDownload().catch(console.error);
