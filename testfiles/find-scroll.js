import puppeteer from 'puppeteer';

async function findScrollContainer() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  const chapterUrl = 'https://comix.to/title/69l6g-chained-soldier/5358475-chapter-6';
  
  console.log('Navigating to:', chapterUrl);
  await page.goto(chapterUrl, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 3000));

  // Find scrollable containers
  const scrollInfo = await page.evaluate(() => {
    const results = [];
    
    // Check common containers
    const selectors = [
      'body', 'html', '#wrapper', '.read-inner', '.main-wrap', 
      '.reader', '.pages', '[class*="read"]', '[class*="page"]'
    ];
    
    // Also find all elements with overflow scroll/auto
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const style = getComputedStyle(el);
      if (style.overflowY === 'scroll' || style.overflowY === 'auto') {
        if (el.scrollHeight > el.clientHeight) {
          results.push({
            tag: el.tagName,
            id: el.id,
            class: el.className.toString().substring(0, 50),
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight,
            scrollTop: el.scrollTop,
            canScroll: el.scrollHeight > el.clientHeight
          });
        }
      }
    });
    
    return results;
  });

  console.log('\nScrollable containers found:');
  scrollInfo.forEach(info => {
    console.log(`  ${info.tag}#${info.id}.${info.class}`);
    console.log(`    scrollHeight: ${info.scrollHeight}, clientHeight: ${info.clientHeight}`);
  });

  // Try scrolling different containers
  console.log('\nTrying to scroll .read-inner...');
  const scrolled = await page.evaluate(() => {
    const container = document.querySelector('.read-inner');
    if (container) {
      const before = container.scrollTop;
      container.scrollTop = 5000;
      return { before, after: container.scrollTop, found: true };
    }
    return { found: false };
  });
  console.log('Result:', scrolled);

  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
}

findScrollContainer().catch(console.error);
