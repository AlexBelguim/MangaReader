// Probe v2: confirm webtoon = scroll, manga = pagination
import puppeteer from 'puppeteer';

const URLS = {
  WEBTOON: 'https://comix.to/title/7lz5e-the-circumstances-of-being-chosen-as-the-villainesss-favorite/9893424-chapter-36',
  MANGA: 'https://comix.to/title/pvry-one-piece/9895591-chapter-1183'
};

async function probe(label, url) {
  console.log(`\n========== ${label} ==========`);
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  // Step A: Identify reader mode from settings panel content
  const modeInfo = await page.evaluate(() => {
    const panel = document.querySelector('.rpage-settings__panel');
    const text = panel ? panel.innerText : '';
    return {
      hasStripMargin: /STRIP MARGIN/i.test(text),
      hasPageLayout: /PAGE LAYOUT/i.test(text),
      panelText: text.replace(/\s+/g, ' ').slice(0, 400)
    };
  });
  console.log('Mode detection:', modeInfo);

  // Step B: Try dismissing the rpage-hint popup
  const dismissed = await page.evaluate(() => {
    const hint = document.querySelector('.rpage-hint');
    if (!hint) return 'no hint';
    const buttons = Array.from(hint.querySelectorAll('button'));
    const gotIt = buttons.find(b => /got it/i.test(b.innerText || ''));
    if (gotIt) { gotIt.click(); return 'clicked Got it'; }
    return 'no Got it button: ' + buttons.map(b => b.innerText).join('|');
  });
  console.log('Dismiss result:', dismissed);
  await new Promise(r => setTimeout(r, 800));

  // Step C: Also close the settings panel if it's blocking
  await page.evaluate(() => {
    const closeBtn = document.querySelector('button[aria-label="Close settings"]');
    if (closeBtn) closeBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Step D: Identify the scroller — for webtoon, scrolling happens inside which container?
  const scrollerInfo = await page.evaluate(() => {
    // candidates
    const out = {};
    const candidates = [
      ['.rpage-reader', document.querySelector('.rpage-reader')],
      ['.rpage-strip', document.querySelector('.rpage-strip')],
      ['.rpage-scroller', document.querySelector('.rpage-scroller')],
      ['.swiper-wrapper', document.querySelector('.swiper-wrapper')],
      ['.swiper', document.querySelector('.swiper')],
      ['main', document.querySelector('main')],
      ['document', document.documentElement]
    ];
    for (const [name, el] of candidates) {
      if (el) {
        out[name] = {
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight,
          scrollTop: el.scrollTop,
          overflow: getComputedStyle(el).overflow,
          overflowY: getComputedStyle(el).overflowY
        };
      } else {
        out[name] = null;
      }
    }
    // also: find any element whose scrollHeight >> clientHeight
    const all = document.querySelectorAll('*');
    const scrollables = [];
    for (const el of all) {
      if (el.scrollHeight > el.clientHeight + 100) {
        const cs = getComputedStyle(el);
        if (cs.overflowY === 'auto' || cs.overflowY === 'scroll') {
          scrollables.push({
            tag: el.tagName,
            id: el.id,
            className: (el.className || '').toString().slice(0, 100),
            scrollHeight: el.scrollHeight,
            clientHeight: el.clientHeight
          });
        }
      }
    }
    out._scrollables = scrollables.slice(0, 10);
    return out;
  });
  console.log('Scroller info:', JSON.stringify(scrollerInfo, null, 2));

  // Step E: For webtoon, scroll inside the right scroller and watch img count grow
  if (modeInfo.hasStripMargin) {
    console.log('\n-- WEBTOON: trying to scroll inside reader container --');
    // Find the scrollable element programmatically
    const result = await page.evaluate(async () => {
      // find the scrollable child of the reader
      const all = document.querySelectorAll('*');
      let scroller = null;
      let bestScroll = 0;
      for (const el of all) {
        const cs = getComputedStyle(el);
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') &&
            el.scrollHeight > el.clientHeight + 100 &&
            el.scrollHeight > bestScroll) {
          scroller = el;
          bestScroll = el.scrollHeight;
        }
      }
      if (!scroller) return { error: 'no scroller found' };
      const info = {
        tag: scroller.tagName,
        className: (scroller.className || '').toString().slice(0, 100),
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight
      };
      // Now scroll it down to the bottom
      const counts = [];
      let lastTop = -1, same = 0;
      for (let i = 0; i < 200; i++) {
        scroller.scrollTop += 1500;
        await new Promise(r => setTimeout(r, 200));
        const imgs = document.querySelectorAll('img.rpage-page__img').length;
        counts.push({ top: scroller.scrollTop, imgs, scrollH: scroller.scrollHeight });
        if (scroller.scrollTop === lastTop) {
          same++;
          if (same >= 3) break;
        } else { same = 0; }
        lastTop = scroller.scrollTop;
      }
      // Now count all images
      const allImgs = Array.from(document.querySelectorAll('img.rpage-page__img'))
        .filter(i => i.naturalWidth > 100)
        .map(i => i.src);
      return { scrollerInfo: info, scrollSteps: counts.slice(0, 5).concat(counts.slice(-5)), uniqueImgs: new Set(allImgs).size, totalImgs: allImgs.length, firstThree: allImgs.slice(0, 3), lastThree: allImgs.slice(-3) };
    });
    console.log('Webtoon scroll result:', JSON.stringify(result, null, 2));
  } else {
    console.log('\n-- MANGA: testing pagination by clicking Go to page N --');
    const totalSegs = await page.evaluate(() => document.querySelectorAll('.rpage-progress__seg').length);
    console.log('Total progress segments:', totalSegs);

    const collected = [];
    for (let i = 1; i <= totalSegs; i++) {
      const clicked = await page.evaluate((n) => {
        const btn = document.querySelector(`button[aria-label="Go to page ${n}"]`);
        if (!btn) return false;
        btn.click();
        return true;
      }, i);
      if (!clicked) { console.log(`  Page ${i}: no button`); continue; }
      await new Promise(r => setTimeout(r, 500));
      await page.waitForFunction(() => {
        const img = document.querySelector('.swiper-slide-active img');
        return img && img.complete && img.naturalWidth > 100;
      }, { timeout: 10000 }).catch(() => {});
      const src = await page.evaluate(() => {
        const img = document.querySelector('.swiper-slide-active img');
        return img ? img.src : null;
      });
      collected.push(src);
      if (i <= 3 || i >= totalSegs - 1) console.log(`  Page ${i}: ${src ? src.slice(0, 90) : 'NULL'}`);
    }
    console.log(`Collected ${collected.length} pages, unique=${new Set(collected).size}, with-null=${collected.filter(x => !x).length}`);
  }

  await browser.close();
}

(async () => {
  await probe('WEBTOON', URLS.WEBTOON);
  await probe('MANGA', URLS.MANGA);
})().catch(e => { console.error(e); process.exit(1); });
