import puppeteer from 'puppeteer';

const URL = 'https://comix.to/title/pvry-one-piece/9895591-chapter-1183';

async function testNavigation() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  console.log('Navigating to chapter...');
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  // Dismiss modal
  await page.evaluate(() => {
    const hint = document.querySelector('.rpage-hint');
    if (hint) {
      const gotIt = Array.from(hint.querySelectorAll('button')).find(b => /got it/i.test(b.innerText || ''));
      if (gotIt) gotIt.click();
    }
    const closeSettings = document.querySelector('button[aria-label="Close settings"]') || document.querySelector('.rpage-settings__close');
    if (closeSettings) closeSettings.click();
    
    // Force hide
    const selectors = ['.rpage-hint', '.rpage-settings__panel', '.modal'];
    selectors.forEach(sel => {
      const els = document.querySelectorAll(sel);
      els.forEach(el => { el.style.display = 'none'; });
    });
  });
  console.log('Overlays dismissed.');
  await new Promise(r => setTimeout(r, 1000));

  const getActiveState = async () => {
    return page.evaluate(() => {
      const activeSeg = document.querySelector('.rpage-progress__seg.is-active');
      const allSegs = Array.from(document.querySelectorAll('.rpage-progress__seg'));
      const activeIndex = allSegs.indexOf(activeSeg) + 1;
      
      const activeImg = document.querySelector('.swiper-slide-active img, img.rpage-page__img');
      const activeImgSrc = activeImg ? activeImg.src.substring(0, 100) : 'none';
      
      return {
        activeIndex,
        totalSegs: allSegs.length,
        activeImgSrc
      };
    });
  };

  console.log('Initial State:', await getActiveState());

  // Test 1: Press ArrowRight
  console.log('\nTesting ArrowRight key...');
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 1000));
  console.log('State after ArrowRight:', await getActiveState());

  // Test 2: Press ArrowLeft
  console.log('\nTesting ArrowLeft key...');
  await page.keyboard.press('ArrowLeft');
  await new Promise(r => setTimeout(r, 1000));
  console.log('State after ArrowLeft:', await getActiveState());

  // Test 3: Click on left side (0.25 width)
  console.log('\nTesting click on Left side (0.25, 0.5)...');
  await page.mouse.click(1280 * 0.25, 900 * 0.5);
  await new Promise(r => setTimeout(r, 1000));
  console.log('State after Left click:', await getActiveState());

  // Test 4: Click on right side (0.75 width)
  console.log('\nTesting click on Right side (0.75, 0.5)...');
  await page.mouse.click(1280 * 0.75, 900 * 0.5);
  await new Promise(r => setTimeout(r, 1000));
  console.log('State after Right click:', await getActiveState());

  await browser.close();
}

testNavigation().catch(console.error);
