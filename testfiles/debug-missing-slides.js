// Dig into why every 3rd slide's image is missing
import puppeteer from 'puppeteer';

const MANGA_URL = 'https://comix.to/title/pvry-one-piece/9895591-chapter-1183';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Capture all image-like network requests
  const imageRequests = [];
  page.on('response', (res) => {
    const url = res.url();
    const type = res.headers()['content-type'] || '';
    if (/\.(webp|jpe?g|png|avif|gif)(\?|$)/i.test(url) || type.startsWith('image/')) {
      imageRequests.push({ url, status: res.status(), type });
    }
  });

  await page.goto(MANGA_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  // dismiss popup
  await page.evaluate(() => {
    const hint = document.querySelector('.rpage-hint');
    if (hint) {
      const btn = Array.from(hint.querySelectorAll('button')).find(b => /got it/i.test(b.innerText));
      if (btn) btn.click();
    }
    const close = document.querySelector('button[aria-label="Close settings"]');
    if (close) close.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Walk through all 20 pages slowly, dump the FULL slide DOM for each
  for (let i = 1; i <= 20; i++) {
    await page.evaluate((n) => {
      const btn = document.querySelector(`button[aria-label="Go to page ${n}"]`);
      if (btn) btn.click();
    }, i);
    await new Promise(r => setTimeout(r, 1200)); // longer wait

    const dump = await page.evaluate(() => {
      const slides = document.querySelectorAll('.swiper-slide');
      const out = [];
      slides.forEach(s => {
        const isActive = s.classList.contains('swiper-slide-active');
        const idx = s.getAttribute('data-swiper-slide-index') || s.getAttribute('aria-label') || '';
        const imgs = Array.from(s.querySelectorAll('img'));
        const imgInfo = imgs.map(img => ({
          src: img.src || '',
          dataSrc: img.dataset?.src || img.getAttribute('data-src') || '',
          srcset: img.srcset || '',
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          classes: (img.className || '').toString()
        }));
        out.push({ isActive, idx, slideClass: s.className.slice(0, 100), imgs: imgInfo, html: s.outerHTML.slice(0, 500) });
      });
      return out;
    });

    const activeSlide = dump.find(d => d.isActive);
    console.log(`\n--- Page ${i} ---`);
    if (activeSlide) {
      console.log(`active idx="${activeSlide.idx}" class="${activeSlide.slideClass}"`);
      activeSlide.imgs.forEach((img, idx) => {
        console.log(`  img[${idx}] src=${img.src.slice(0, 90)} dataSrc=${img.dataSrc.slice(0, 90)} complete=${img.complete} w=${img.naturalWidth}`);
      });
      if (activeSlide.imgs.length === 0) {
        // dump the slide's html so we can see what IS inside
        console.log('  no images — slide HTML:', activeSlide.html);
      }
    } else {
      console.log('  no active slide found');
      dump.slice(0, 3).forEach((d, idx) => {
        console.log(`  slide[${idx}] idx="${d.idx}" active=${d.isActive} class="${d.slideClass.slice(0, 60)}"`);
      });
    }
  }

  console.log('\n--- Network image requests (deduped) ---');
  const seen = new Set();
  const dedup = imageRequests.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url); return true;
  });
  const chapterCdn = dedup.filter(r => /jloo|wowpic|webp/i.test(r.url) && !/static\.comix/.test(r.url));
  chapterCdn.forEach(r => console.log(`  ${r.status} ${r.url}`));
  console.log(`Total chapter CDN images requested: ${chapterCdn.length}`);

  await browser.close();
})();
