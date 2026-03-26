import { BaseScraper } from './base.js';

export class MangaHereScraper extends BaseScraper {
  get websiteName() {
    return 'mangahere.cc';
  }

  get urlPatterns() {
    return ['mangahere.cc', 'newm.mangahere.cc'];
  }

  get supportsQuickCheck() {
    return true;
  }

  get supportsSearch() {
    return true;
  }

  async getMangaInfo(url) {
    await this.createPage();
    try {
      console.log(`  [MangaHere] Navigating to: ${url}`);
      // MangaHere might have an adult cookie needed
      await this.page.setCookie({ name: 'isAdult', value: '1', domain: '.mangahere.cc' });

      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);

      const info = await this.page.evaluate(() => {
        console.log('Page Title:', document.title);
        // Extract Title
        const titleEl = document.querySelector('h1') || document.querySelector('.detail-info-right-title-font') || document.querySelector('.detail-top-bar-info-title');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';

        // Extract Cover
        const coverEl = document.querySelector('img.detail-info-cover-img') || document.querySelector('.detail-top-bar-cover img');
        const cover = coverEl ? coverEl.src : null;

        // Extract Description
        const descEl = document.querySelector('.fullcontent') || document.querySelector('.detail-info-right-content');
        let description = '';
        if (descEl) {
          // Sometimes it has a "Show less" text inside an <a>, we can just grab textContent
          description = descEl.textContent.replace(/Show less/i, '').trim();
        }

        // Extract Chapters
        const chapters = [];
        const links = document.querySelectorAll('ul.detail-main-list > li > a, a[href*="/c"]');
        const seenUrls = new Set();
        
        links.forEach(link => {
          const href = link.href;
          if (!href || !href.includes('.html')) return;
          if (seenUrls.has(href)) return;
          seenUrls.add(href);
          
          // e.g. "Ch.315"
          const titleText = link.querySelector('p.title3')?.textContent.trim() || link.title || link.textContent.trim();
          
          // parse number
          let numMatch = titleText.match(/Ch\.?.*?(\d+(?:\.\d+)?)/i) || href.match(/\/c(\d+(?:\.\d+)?)\//i);
          let number = numMatch ? parseFloat(numMatch[1]) : 0;
          
          chapters.push({
            number,
            title: titleText,
            url: href.startsWith('http') ? href : window.location.origin + href
          });
        });
        
        return { 
          title, cover, description, chapters,
          htmlPreview: document.body.innerHTML.substring(0, 300)
        };
      });

      console.log('  [MangaHere DEBUG] Preview HTML:', info.htmlPreview);

      info.chapters.sort((a, b) => a.number - b.number);

      return {
        url,
        website: this.websiteName,
        title: info.title,
        totalChapters: info.chapters.length,
        uniqueChapters: info.chapters.length,
        chapters: info.chapters,
        duplicateChapters: [],
        cover: info.cover,
        description: info.description
      };
    } finally {
      await this.closePage();
    }
  }

  async quickCheckUpdates(url, knownChapterUrls = []) {
    await this.createPage();
    try {
      console.log(`  [MangaHere] Quick check: ${url}`);
      await this.page.setCookie({ name: 'isAdult', value: '1', domain: '.mangahere.cc' });
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(500, 1000);

      const firstPageChapters = await this.page.evaluate(() => {
        const chapters = [];
        const links = document.querySelectorAll('ul.detail-main-list > li > a, a[href*="/c"]');
        const seenUrls = new Set();

        links.forEach(link => {
          const href = link.href;
          if (!href || !href.includes('.html')) return;
          if (seenUrls.has(href)) return;
          seenUrls.add(href);

          const titleText = link.querySelector('p.title3')?.textContent.trim() || link.textContent.trim();
          let numMatch = titleText.match(/Ch\.?.*?(\d+(?:\.\d+)?)/i) || href.match(/\/c(\d+(?:\.\d+)?)\//i);
          let number = numMatch ? parseFloat(numMatch[1]) : 0;
          
          chapters.push({
            number,
            title: titleText,
            url: href.startsWith('http') ? href : window.location.origin + href
          });
        });
        return chapters;
      });

      const knownUrlSet = new Set(knownChapterUrls);
      const newChapters = firstPageChapters.filter(ch => !knownUrlSet.has(ch.url));
      const latestChapter = firstPageChapters.length > 0
        ? Math.max(...firstPageChapters.map(c => c.number))
        : null;

      console.log(`  Found ${firstPageChapters.length} chapters, ${newChapters.length} new`);
      return { hasUpdates: newChapters.length > 0, latestChapter, newChapters, firstPageChapters };
    } finally {
      await this.closePage();
    }
  }

  async search(query) {
    await this.createPage();
    try {
      const searchUrl = `https://newm.mangahere.cc/search?title=${encodeURIComponent(query)}`;
      console.log(`  [MangaHere] Searching: ${searchUrl}`);
      await this.page.setCookie({ name: 'isAdult', value: '1', domain: '.mangahere.cc' });
      await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);

      const results = await this.page.evaluate(() => {
        // Fallback for both desktop and mobile views
        const items = document.querySelectorAll('.manga-list-4-list > li, .manga-list-2 > li, .manga-list-1-list > li');
        const list = [];
        items.forEach(li => {
          // Mobile usually has .manga-list-2-title > a, desktop has .manga-list-4-item-title > a
          const a = li.querySelector('.manga-list-4-item-title > a, .manga-list-2-title > a, .manga-list-1-item-title > a');
          if (!a) return;
          const url = a.href.startsWith('http') ? a.href : window.location.origin + a.getAttribute('href');
          const title = a.textContent.trim() || a.title;
          
          let img = li.querySelector('img.manga-list-4-cover, .manga-list-2-cover img, .manga-list-1-cover img, .manga-list-2-cover-bg');
          const cover = img ? (img.src || img.dataset.src || img.getAttribute('data-src')) : null;
          
          let chapterCount = 0;
          const sub = li.querySelector('.manga-list-4-item-subtitle > a, .manga-list-2-item-subtitle > a, .manga-list-1-item-subtitle > a');
          if (sub) {
            const match = sub.textContent.match(/(\d+(?:\.\d+)?)/);
            if (match) chapterCount = parseFloat(match[1]);
          }

          list.push({ title, url, cover, chapterCount });
        });
        return list;
      });

      return results.map(r => ({ ...r, website: this.websiteName }));
    } finally {
      await this.closePage();
    }
  }

  async getChapterImages(chapterUrl) {
    // For images, MangaHere has window.newImgs, so it's best to use createPageClean to not break any embedded scripts
    await this.createPageClean();
    try {
      console.log(`  [MangaHere] Loading chapter: ${chapterUrl}`);
      // MangaHere might have an adult cookie needed
      await this.page.setCookie({ name: 'isAdult', value: '1', domain: '.mangahere.cc' });

      await this.page.goto(chapterUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await this.randomDelay(1000, 2000);

      const images = await this.page.evaluate(() => {
        // MangaHere puts the images list in window.newImgs array natively via their scripteval
        if (typeof window.newImgs !== 'undefined' && Array.isArray(window.newImgs)) {
          return window.newImgs.map((src, index) => {
             // Ensure absolute URL
            let url = src;
            if (url.startsWith('//')) {
              url = 'https:' + url;
            } else if (url.startsWith('/')) {
              url = window.location.origin + url;
            }
            return { index: index + 1, url };
          });
        }
        
        // Fallback: looking for normal img tags that look like chapter pages
        const imgElements = document.querySelectorAll('img.reader-page, img#image, div.reader-main img');
        const imageUrls = [];
        const seenUrls = new Set();
        
        imgElements.forEach((img, index) => {
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
