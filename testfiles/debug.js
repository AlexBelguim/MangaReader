import puppeteer from 'puppeteer';

async function debug() {
  const browser = await puppeteer.launch({ headless: false }); // Show browser
  const page = await browser.newPage();
  
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  console.log('Navigating to page...');
  await page.goto('https://comix.to/title/69l6g-chained-soldier', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 3000));

  // Debug: Get all links on the page
  const debug = await page.evaluate(() => {
    const results = {
      title: document.querySelector('h1')?.textContent,
      allLinks: [],
      chapterLinks: [],
      pagination: [],
      images: []
    };

    // Get all <a> tags
    document.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const text = a.textContent.trim().substring(0, 50);
      if (href.includes('ch') || text.toLowerCase().includes('ch')) {
        results.allLinks.push({ href, text });
      }
    });

    // Specifically look for chapter patterns
    document.querySelectorAll('a[href*="ch-"], a[href*="chapter"]').forEach(a => {
      results.chapterLinks.push({
        href: a.getAttribute('href'),
        text: a.textContent.trim()
      });
    });

    // Look for pagination
    document.querySelectorAll('nav a, button').forEach(el => {
      const text = el.textContent.trim();
      if (text.match(/^[\d›»‹«<>]$/) || text === 'Next' || text === 'Prev') {
        results.pagination.push({
          tag: el.tagName,
          text,
          href: el.getAttribute('href'),
          classes: el.className
        });
      }
    });

    // Get images
    document.querySelectorAll('img').forEach(img => {
      if (img.src && !img.src.includes('data:')) {
        results.images.push(img.src.substring(0, 100));
      }
    });

    return results;
  });

  console.log('\n=== DEBUG INFO ===\n');
  console.log('Title:', debug.title);
  console.log('\nChapter Links found:', debug.chapterLinks.length);
  debug.chapterLinks.slice(0, 5).forEach(l => console.log('  ', l));
  console.log('\nAll CH links:', debug.allLinks.length);
  debug.allLinks.slice(0, 10).forEach(l => console.log('  ', l));
  console.log('\nPagination elements:', debug.pagination.length);
  debug.pagination.forEach(p => console.log('  ', p));
  console.log('\nImages:', debug.images.length);
  debug.images.slice(0, 3).forEach(i => console.log('  ', i));

  // Keep browser open for manual inspection
  console.log('\n\nBrowser is open for inspection. Press Ctrl+C to close.');
  await new Promise(r => setTimeout(r, 60000));
  
  await browser.close();
}

debug().catch(console.error);
