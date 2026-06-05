// Debug the new comix.to reader (popup + manga vs webtoon)
import puppeteer from 'puppeteer';

const WEBTOON_URL = 'https://comix.to/title/7lz5e-the-circumstances-of-being-chosen-as-the-villainesss-favorite/9893424-chapter-36';
const MANGA_URL = 'https://comix.to/title/pvry-one-piece/9895591-chapter-1183';

async function inspectUrl(label, url) {
  console.log(`\n========== ${label} ==========`);
  console.log(`URL: ${url}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000));

  // Snapshot: top-level body structure (find any modal/dialog)
  const snapshot = await page.evaluate(() => {
    const findCandidates = (selector) => {
      const els = Array.from(document.querySelectorAll(selector));
      return els.map(el => {
        const rect = el.getBoundingClientRect();
        const visible = rect.width > 0 && rect.height > 0 && getComputedStyle(el).display !== 'none';
        return {
          tag: el.tagName,
          id: el.id || '',
          className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 200) : '',
          role: el.getAttribute('role') || '',
          ariaLabel: el.getAttribute('aria-label') || '',
          ariaModal: el.getAttribute('aria-modal') || '',
          textPreview: (el.innerText || '').slice(0, 200).replace(/\s+/g, ' '),
          visible,
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        };
      });
    };

    return {
      title: document.title,
      bodyClasses: document.body.className,
      modalCandidates: [
        ...findCandidates('[role="dialog"]'),
        ...findCandidates('[aria-modal="true"]'),
        ...findCandidates('.modal'),
        ...findCandidates('[class*="modal" i]'),
        ...findCandidates('[class*="dialog" i]'),
        ...findCandidates('[class*="popup" i]'),
        ...findCandidates('[class*="overlay" i]')
      ].filter(c => c.visible).slice(0, 10),
      // Get all button text on page
      visibleButtons: Array.from(document.querySelectorAll('button')).filter(b => {
        const r = b.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }).slice(0, 30).map(b => ({
        text: (b.innerText || '').slice(0, 80).replace(/\s+/g, ' '),
        className: (b.className || '').slice(0, 120),
        ariaLabel: b.getAttribute('aria-label') || ''
      })),
      // What image classes exist
      images: {
        fitW: document.querySelectorAll('img.fit-w').length,
        all: document.querySelectorAll('img').length,
        imageClasses: Array.from(new Set(Array.from(document.querySelectorAll('img')).map(i => i.className).filter(c => c))).slice(0, 30)
      },
      // Pagination indicators (manga reader hints)
      paginationHints: {
        nextButtons: Array.from(document.querySelectorAll('button, a')).filter(el => {
          const t = (el.innerText || '').toLowerCase();
          const a = (el.getAttribute('aria-label') || '').toLowerCase();
          return (t.includes('next') || a.includes('next') || t === '›' || t === '>') && el.getBoundingClientRect().width > 0;
        }).slice(0, 5).map(el => ({
          tag: el.tagName,
          text: (el.innerText || '').slice(0, 60),
          ariaLabel: el.getAttribute('aria-label') || '',
          className: (el.className || '').slice(0, 120)
        })),
        pageIndicator: (() => {
          const all = document.body.innerText.match(/\b\d+\s*\/\s*\d+\b/g);
          return all ? all.slice(0, 5) : [];
        })()
      },
      // Scroll info: webtoon will have very tall body, manga will be ~viewport
      docHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight
    };
  });

  console.log('Title:', snapshot.title);
  console.log('Doc height / viewport:', snapshot.docHeight, '/', snapshot.viewportHeight,
    snapshot.docHeight > snapshot.viewportHeight * 5 ? '→ long-scroll (webtoon-like)' : '→ short (manga-paged-like)');

  console.log('\n--- Modal candidates (visible) ---');
  snapshot.modalCandidates.forEach((m, i) => {
    console.log(`[${i}] <${m.tag}> id="${m.id}" role="${m.role}" aria-modal="${m.ariaModal}" ${m.width}x${m.height}`);
    console.log(`    class="${m.className}"`);
    console.log(`    text="${m.textPreview}"`);
  });

  console.log('\n--- Visible buttons ---');
  snapshot.visibleButtons.forEach((b, i) => {
    console.log(`[${i}] "${b.text}" aria="${b.ariaLabel}" class="${b.className.slice(0, 80)}"`);
  });

  console.log('\n--- Images ---');
  console.log('img.fit-w count:', snapshot.images.fitW);
  console.log('total img:', snapshot.images.all);
  console.log('img classes seen:', snapshot.images.imageClasses);

  console.log('\n--- Pagination hints ---');
  console.log('Next-button candidates:', JSON.stringify(snapshot.paginationHints.nextButtons, null, 2));
  console.log('Page indicator text matches:', snapshot.paginationHints.pageIndicator);

  await browser.close();
}

(async () => {
  await inspectUrl('WEBTOON', WEBTOON_URL);
  await inspectUrl('MANGA', MANGA_URL);
})().catch(e => { console.error(e); process.exit(1); });
