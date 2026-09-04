import { BaseScraper } from '../base.js';
import { quickCheck } from '../features/quick-check.js';
import { search } from '../features/search.js';
import { browse } from '../features/browse.js';
import { deduplicateChapters } from '../util/chapters.js';

const ADULT_COOKIE = { name: 'isAdult', value: '1', domain: '.mangahere.cc' };

// Catalog browsing uses the desktop host: www. renders the directory as a
// 70-per-page cover grid with a numbered pager and five sort links, while the
// mobile host (newm.) shows /directory/ as a bare genre chooser.
const DESKTOP_URL = 'https://www.mangahere.cc';

// Directory sorts are a bare query suffix on /directory/<page>.htm ('' = the
// default popularity order). The search endpoint takes numeric sort codes
// instead, and only two of them match a directory sort (1 = A-Z, 4 = latest
// chapter update); 0 is the site's default order and codes 2/3 are ascending
// orders nobody wants (least popular / least recently updated first).
const DIRECTORY_SORT = { popular: '', latest: 'latest', rating: 'rating', news: 'news', az: 'az' };
const SEARCH_SORT = { latest: 4, az: 1 };

/**
 * Scraper for mangahere.cc website
 * Uses standard Puppeteer with adult cookie.
 */

// ─── Shared chapter extraction (used by getMangaInfo + quickCheck) ──

async function extractChaptersFromPage(page) {
  return page.evaluate(() => {
    const chapters = [];
    const links = document.querySelectorAll('ul.detail-main-list > li > a, a[href*="/c"]');
    const seenUrls = new Set();
    // The desktop layout also lists other series' latest chapters in its
    // sidebars; only links under this manga's own path are its chapters.
    const ownPath = location.pathname.replace(/\/+$/, '') + '/';

    links.forEach(link => {
      const href = link.href;
      if (!href || !href.includes('.html')) return;
      if (!link.pathname.startsWith(ownPath)) return;
      if (seenUrls.has(href)) return;
      seenUrls.add(href);

      const titleText = link.querySelector('p.title3')?.textContent.trim() || link.title || link.textContent.trim();
      const numMatch = titleText.match(/Ch\.?.*?(\d+(?:\.\d+)?)/i) || href.match(/\/c(\d+(?:\.\d+)?)\//i);
      const number = numMatch ? parseFloat(numMatch[1]) : 0;

      chapters.push({
        number,
        title: titleText,
        url: href.startsWith('http') ? href : window.location.origin + href
      });
    });
    return chapters;
  });
}

export class MangaHereScraper extends BaseScraper {
  get websiteName() { return 'mangahere.cc'; }
  get urlPatterns() { return ['mangahere.cc', 'newm.mangahere.cc']; }
  get supportsQuickCheck() { return true; }
  get supportsSearch() { return true; }
  get supportsBrowse() { return true; }

  get browseOptions() {
    return {
      sorts: [
        { value: 'popular', label: 'Most popular' },
        { value: 'latest', label: 'Latest chapters' },
        { value: 'rating', label: 'Top rated' },
        { value: 'news', label: 'Newest series' },
        { value: 'az', label: 'A to Z' }
      ],
      defaultSort: 'popular',
      defaultQuery: '',
      queryLabel: 'Search',
      queryPlaceholder: 'Optional: title to search for (site order unless Latest / A to Z)'
    };
  }

  // ── Browse ──

  /**
   * Empty query: the directory in the chosen sort. Non-empty query: a title
   * search, sorted when the search endpoint knows the sort (see SEARCH_SORT),
   * otherwise in the site's default order.
   */
  async browse(sort = 'popular', page = 1, query = '', refresh = false, options = {}) {
    if (!Object.hasOwn(DIRECTORY_SORT, sort)) sort = 'popular';
    return browse(this, sort, page, query, {
      cacheTtl: 3 * 60 * 60 * 1000,
      timeout: 45000,
      buildBrowseUrl: (s, p, q) => {
        const title = (q || '').trim();
        if (title) {
          const code = SEARCH_SORT[s];
          return `${DESKTOP_URL}/search?title=${encodeURIComponent(title)}&page=${p}${code ? `&sort=${code}` : ''}`;
        }
        const suffix = DIRECTORY_SORT[s];
        return `${DESKTOP_URL}/directory/${p}.htm${suffix ? `?${suffix}` : ''}`;
      },
      setupPage: async (p) => {
        await p.setCookie(ADULT_COOKIE);
        // The listing is fully server-rendered. With scripts on, the ad
        // loaders delay networkidle2 and each cover's inline onerror swaps a
        // slow-loading image for the site's nopicture placeholder, losing
        // the real URL.
        await p.setJavaScriptEnabled(false);
      },
      extractResults: async (p) => p.evaluate(() => {
        // Directory items are manga-list-1-*, search items manga-list-4-*;
        // both keep the same inner structure (cover img, item-title, one
        // chapter link), so match on the class suffix.
        const results = [];
        document.querySelectorAll('ul.manga-list-1-list > li, ul.manga-list-4-list > li').forEach(li => {
          const a = li.querySelector('p[class$="-item-title"] > a');
          if (!a) return;
          const title = a.textContent.trim() || a.title;
          const img = li.querySelector('img[class$="-cover"]');
          const cover = img ? (img.src || img.dataset.src || null) : null;
          // "Vol.98 Ch.1192" / "Ch.238" — take the chapter, not the volume.
          const chapterLink = li.querySelector('a[href*="/c"][href$=".html"]');
          const chMatch = chapterLink?.textContent.match(/Ch\.?\s*(\d+(?:\.\d+)?)/i);
          const chapterCount = chMatch ? parseFloat(chMatch[1]) : 0;
          results.push({ title, url: a.href, cover, chapterCount });
        });

        // The pager is numbered anchors, the active page included (as
        // <a class="active">), so the largest number seen is the last page.
        let totalPages = 1;
        document.querySelectorAll('.pager-list-left a').forEach(a => {
          const n = parseInt(a.textContent.trim(), 10);
          if (Number.isFinite(n) && n > totalPages) totalPages = n;
        });
        return { results, totalPages };
      })
    }, refresh, options);
  }

  // ── Get Manga Info ──

  async getMangaInfo(url) {
    await this.createPage();
    try {
      console.log(`  [MangaHere] Navigating to: ${url}`);
      await this.page.setCookie(ADULT_COOKIE);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);

      // Desktop (www.) and mobile (newm.) layouts name things differently:
      // title is .detail-info-right-title-font vs .detail-top-bar-info-title.
      const info = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1')
          || document.querySelector('.detail-info-right-title-font')
          || document.querySelector('.detail-top-bar-info-title');
        let title = titleEl ? titleEl.textContent.trim() : '';
        if (!title) title = document.title.replace(/\s*-\s*MangaHere.*$/i, '').replace(/\s+Manga\s*$/i, '').trim() || 'Unknown Title';
        const coverEl = document.querySelector('img.detail-info-cover-img')
          || document.querySelector('.detail-top-bar-cover img')
          || [...document.querySelectorAll('img')].find(i => /\/store\/manga\/\d+\/cover\./i.test(i.src));
        const cover = coverEl ? coverEl.src : null;
        const descEl = document.querySelector('.fullcontent')
          || document.querySelector('.detail-info-right-content')
          || document.querySelector('[class*="summary"]');
        const description = descEl ? descEl.textContent.replace(/Show less/i, '').trim() : '';
        return { title, cover, description };
      });

      // The site occasionally lists a chapter number twice (e.g. One Piece
      // 1.1 under two volumes); keep both as versions like the other sites.
      const { chapters, duplicateChapters, uniqueCount } = deduplicateChapters(await extractChaptersFromPage(this.page));

      return {
        url, website: this.websiteName, title: info.title,
        totalChapters: chapters.length, uniqueChapters: uniqueCount,
        chapters, duplicateChapters,
        cover: info.cover, description: info.description
      };
    } finally {
      await this.closePage();
    }
  }

  // ── Quick Check ──

  async quickCheckUpdates(url, knownChapterUrls = []) {
    await this.createPage();
    try {
      console.log(`  [MangaHere] Quick check: ${url}`);
      await this.page.setCookie(ADULT_COOKIE);

      return await quickCheck(url, knownChapterUrls, {
        fetchChapters: async (url) => {
          await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
          await this.randomDelay(500, 1000);
          return extractChaptersFromPage(this.page);
        },
      });
    } finally {
      await this.closePage();
    }
  }

  // ── Search ──

  async search(query) {
    return search(this, query, {
      buildSearchUrl: (q) => `https://newm.mangahere.cc/search?title=${encodeURIComponent(q)}`,
      setupPage: async (page) => { await page.setCookie(ADULT_COOKIE); },
      timeout: 30000,
      extractResults: async (page) => page.evaluate(() => {
        const items = document.querySelectorAll('.manga-list-4-list > li, .manga-list-2 > li, .manga-list-1-list > li');
        const list = [];
        items.forEach(li => {
          const a = li.querySelector('.manga-list-4-item-title > a, .manga-list-2-title > a, .manga-list-1-item-title > a');
          if (!a) return;
          const url = a.href.startsWith('http') ? a.href : window.location.origin + a.getAttribute('href');
          const title = a.textContent.trim() || a.title;
          const img = li.querySelector('img.manga-list-4-cover, .manga-list-2-cover img, .manga-list-1-cover img');
          const cover = img ? (img.src || img.dataset.src || img.getAttribute('data-src')) : null;
          let chapterCount = 0;
          const sub = li.querySelector('.manga-list-4-item-subtitle > a, .manga-list-2-item-subtitle > a');
          if (sub) {
            const match = sub.textContent.match(/(\d+(?:\.\d+)?)/);
            if (match) chapterCount = parseFloat(match[1]);
          }
          list.push({ title, url, cover, chapterCount });
        });
        return list;
      }),
    });
  }

  // ── Chapter Images ──

  async getChapterImages(chapterUrl) {
    await this.createPageClean();
    try {
      console.log(`  [MangaHere] Loading chapter: ${chapterUrl}`);
      await this.page.setCookie(ADULT_COOKIE);
      await this.page.goto(chapterUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await this.randomDelay(1000, 2000);

      // Current reader loads pages on demand via chapterfun.ashx (packed JS
      // that defines `d`, an array whose first entry is the page image).
      // Pull the page list ourselves: chapterid, plus the page count. The
      // desktop layout (www.) renders a pager; the mobile layout (newm.) has
      // no pager but sets window.imagecount, so take whichever is present.
      const meta = await this.page.evaluate(() => {
        const cid = typeof window.chapterid !== 'undefined' ? window.chapterid : null;
        const key = document.querySelector('#dm5_key')?.value || '';
        let total = 0;
        document.querySelectorAll('.pager-list a[data-page]').forEach(a => {
          const n = parseInt(a.getAttribute('data-page'), 10);
          if (Number.isFinite(n) && n > total) total = n;
        });
        if (total === 0 && Number.isFinite(Number(window.imagecount))) total = Number(window.imagecount);
        return { cid, key, total };
      });

      if (meta.cid && meta.total > 0) {
        console.log(`  [MangaHere] Fetching ${meta.total} pages via chapterfun.ashx (cid=${meta.cid})`);
        const images = [];
        for (let p = 1; p <= meta.total; p++) {
          const src = await this.page.evaluate(async ({ cid, key, p }) => {
            try {
              const resp = await fetch(`chapterfun.ashx?cid=${cid}&page=${p}&key=${encodeURIComponent(key)}`, { credentials: 'include' });
              const text = await resp.text();
              // NB: don't name this binding `d` — the eval'd payload declares
              // `var d` and a const/let name clash throws SyntaxError.
              const arr = eval(text + '\n;d');
              return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
            } catch { return null; }
          }, { cid: meta.cid, key: meta.key, p });

          if (src) {
            let url = src;
            if (url.startsWith('//')) url = 'https:' + url;
            else if (url.startsWith('/')) url = new URL(chapterUrl).origin + url;
            images.push({ index: images.length + 1, url });
          } else {
            console.warn(`  [MangaHere] Page ${p}: no image returned`);
          }
          await new Promise(r => setTimeout(r, 200));
        }

        console.log(`  [MangaHere] Found ${images.length} images`);
        // CDN rejects requests without a Referer — send the chapter page.
        return images.map(img => ({ ...img, headers: { 'Referer': chapterUrl } }));
      }

      // Fallback for the legacy reader: window.newImgs / DOM extraction
      const images = await this.page.evaluate(() => {
        // MangaHere puts images in window.newImgs array
        if (typeof window.newImgs !== 'undefined' && Array.isArray(window.newImgs)) {
          return window.newImgs.map((src, index) => {
            let url = src;
            if (url.startsWith('//')) url = 'https:' + url;
            else if (url.startsWith('/')) url = window.location.origin + url;
            return { index: index + 1, url };
          });
        }

        // Fallback: DOM image extraction
        const imgElements = document.querySelectorAll('img.reader-page, img#image, div.reader-main img');
        const imageUrls = [];
        const seenUrls = new Set();
        imgElements.forEach((img) => {
          let src = img.src || img.dataset.src;
          if (src && !seenUrls.has(src)) {
            seenUrls.add(src);
            if (src.startsWith('//')) src = 'https:' + src;
            imageUrls.push({ index: imageUrls.length + 1, url: src });
          }
        });
        return imageUrls;
      });

      console.log(`  [MangaHere] Found ${images.length} images`);
      return images;
    } finally {
      await this.closePage();
    }
  }
}

export default MangaHereScraper;
