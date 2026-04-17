import { BaseScraper } from '../base.js';
import { quickCheck } from '../features/quick-check.js';
import { search } from '../features/search.js';

const ADULT_COOKIE = { name: 'isAdult', value: '1', domain: '.mangahere.cc' };

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

    links.forEach(link => {
      const href = link.href;
      if (!href || !href.includes('.html')) return;
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

  // ── Get Manga Info ──

  async getMangaInfo(url) {
    await this.createPage();
    try {
      console.log(`  [MangaHere] Navigating to: ${url}`);
      await this.page.setCookie(ADULT_COOKIE);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);

      const info = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1') || document.querySelector('.detail-info-right-title-font');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';
        const coverEl = document.querySelector('img.detail-info-cover-img') || document.querySelector('.detail-top-bar-cover img');
        const cover = coverEl ? coverEl.src : null;
        const descEl = document.querySelector('.fullcontent') || document.querySelector('.detail-info-right-content');
        const description = descEl ? descEl.textContent.replace(/Show less/i, '').trim() : '';
        return { title, cover, description };
      });

      const chapters = await extractChaptersFromPage(this.page);
      chapters.sort((a, b) => a.number - b.number);

      return {
        url, website: this.websiteName, title: info.title,
        totalChapters: chapters.length, uniqueChapters: chapters.length,
        chapters, duplicateChapters: [],
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
