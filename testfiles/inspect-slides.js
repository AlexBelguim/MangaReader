import puppeteer from 'puppeteer';

const URL = 'https://comix.to/title/pvry-one-piece/9895591-chapter-1183';

async function test() {
  console.log('Launching browser with --disable-web-security to bypass tainted canvas...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });
  
  const page = await browser.newPage();

  // Capture pristine functions before anti-bot loads
  await page.evaluateOnNewDocument(() => {
    window.__cleanToDataURL = HTMLCanvasElement.prototype.toDataURL;
    window.__cleanGetImageData = CanvasRenderingContext2D.prototype.getImageData;
  });

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('Navigating...');
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss overlays
  await page.evaluate(() => {
    // Inject permanent style to hide overlays
    const style = document.createElement('style');
    style.innerHTML = `
      .rpage-hint, .rpage-settings__panel, .modal, [class*="overlay"], [class*="backdrop"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  });

  const totalSegs = await page.evaluate(() => document.querySelectorAll('.rpage-progress__seg').length);
  console.log(`Total pages: ${totalSegs}`);

  for (let i = 1; i <= Math.min(totalSegs, 5); i++) {
    console.log(`\n--- Page ${i} ---`);
    
    // Click page button
    const clicked = await page.evaluate((n) => {
      const btn = document.querySelector(`button[aria-label="Go to page ${n}"]`);
      if (!btn) return false;
      btn.click();
      return true;
    }, i);
    
    if (!clicked) {
      console.log(`  No button for page ${i}`);
      continue;
    }

    // Wait 4 seconds for image to load and paint on canvas
    await new Promise(r => setTimeout(r, 4000));

    // Wait for slide active and element inside
    await page.waitForFunction(() => {
      const slide = document.querySelector('.swiper-slide-active');
      if (!slide) return false;
      const canvas = slide.querySelector('canvas');
      if (canvas && canvas.width > 100) return true;
      const img = slide.querySelector('img');
      return img && img.complete && img.naturalWidth > 100;
    }, { timeout: 8000 }).catch(() => {});

    // Inspect elements and try to get data url
    const result = await page.evaluate(() => {
      const slide = document.querySelector('.swiper-slide-active');
      if (!slide) return { error: 'No active slide' };

      const canvas = slide.querySelector('canvas');
      const img = slide.querySelector('img');

      let info = {
        hasCanvas: !!canvas,
        hasImg: !!img,
        slideHtml: slide.innerHTML.substring(0, 1000)
      };

      if (canvas) {
        info.canvasWidth = canvas.width;
        info.canvasHeight = canvas.height;
        info.canvasStyle = canvas.getAttribute('style') || '';
        info.canvasAttrs = Array.from(canvas.attributes).map(a => `${a.name}=${a.value}`);
        info.toDataURL_toString = canvas.toDataURL.toString();

        try {
          info.dataUrlLength = canvas.toDataURL('image/png').length;
          info.dataUrlPrefix = canvas.toDataURL('image/png').substring(0, 80);
          info.success = true;
        } catch (e) {
          info.success = false;
          info.error = e.message;
        }

        // Try using captured clean toDataURL
        try {
          if (window.__cleanToDataURL) {
            const cleanDataUrl = window.__cleanToDataURL.call(canvas, 'image/png');
            info.cleanDataUrlLength = cleanDataUrl.length;
            info.cleanDataUrlPrefix = cleanDataUrl.substring(0, 80);
            info.cleanSuccess = true;
          } else {
            info.cleanSuccess = false;
            info.cleanError = 'window.__cleanToDataURL not defined';
          }
        } catch (e) {
          info.cleanSuccess = false;
          info.cleanError = e.message;
        }
      }

      if (img) {
        info.imgSrc = img.src.substring(0, 100);
        info.imgWidth = img.naturalWidth;
        info.imgHeight = img.naturalHeight;
        info.imgAttrs = Array.from(img.attributes).map(a => `${a.name}=${a.value}`);
      }

      return info;
    });

    console.log('Result:', result);
  }

  await browser.close();
}

test();
