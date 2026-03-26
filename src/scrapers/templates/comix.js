import { BaseScraper } from '../base.js';
import { fetchPage, toPuppeteerCookies } from '../flaresolverr.js';

/**
 * Scraper for comix.to website
 * 
 * Uses FlareSolverr to bypass Cloudflare challenges for page fetching.
 * For chapter images, uses FlareSolverr cookies passed to puppeteer for lazy-load scrolling.
 */
export class ComixScraper extends BaseScraper {
  get websiteName() {
    return 'comix.to';
  }

  get urlPatterns() {
    return ['comix.to'];
  }

  get supportsQuickCheck() {
    return true;
  }

  /**
   * Parse chapter links from HTML string
   */
  parseChaptersFromHtml(html) {
    const chapters = [];
    const linkRegex = /<a[^>]*href="([^"]*chapter-[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim();

      const numMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i) ||
        text.match(/ch\.?\s*(\d+(?:\.\d+)?)(?!\d)/i) ||
        text.match(/^(\d+(?:\.\d+)?)(?!\d)/);

      if (numMatch) {
        const fullUrl = href.startsWith('http') ? href : `https://comix.to${href}`;
        chapters.push({
          number: parseFloat(numMatch[1]),
          title: text || `Chapter ${numMatch[1]}`,
          url: fullUrl
        });
      }
    }

    return chapters;
  }

  /**
   * Parse chapters with metadata (release group, upload time)
   */
  parseChaptersWithMetadata(html) {
    const chapters = [];
    const linkRegex = /<a[^>]*href="([^"]*chapter-[^"]*)"[^>]*>([\s\S]*?)<\/a>([\s\S]*?)(?=<a[^>]*href="[^"]*chapter-|$)/gi;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      const afterLink = match[3];

      const numMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i) ||
        text.match(/ch\.?\s*(\d+(?:\.\d+)?)(?!\d)/i) ||
        text.match(/^(\d+(?:\.\d+)?)(?!\d)/);

      if (numMatch) {
        const fullUrl = href.startsWith('http') ? href : `https://comix.to${href}`;

        const spanRegex = /<span[^>]*>([\s\S]*?)<\/span>/gi;
        const spans = [];
        let spanMatch;
        while ((spanMatch = spanRegex.exec(afterLink)) !== null) {
          const spanText = spanMatch[1].replace(/<[^>]*>/g, '').trim();
          if (spanText) spans.push(spanText);
        }

        let releaseGroup = '';
        let uploadedAt = '';
        if (spans.length >= 2) uploadedAt = spans[1] || '';
        if (spans.length >= 3) releaseGroup = spans[2] || '';

        chapters.push({
          number: parseFloat(numMatch[1]),
          title: text || `Chapter ${numMatch[1]}`,
          url: fullUrl,
          releaseGroup,
          uploadedAt
        });
      }
    }

    return chapters;
  }

  // Quick check - only scrapes the first page to find new chapters
  async quickCheckUpdates(url, knownChapterUrls = []) {
    console.log(`  Quick check: ${url}`);
    console.log(`  [COMIX] Attempting FlareSolverr fetch...`);

    try {
      const { html } = await fetchPage(url);
      console.log(`  [COMIX] FlareSolverr returned ${html.length} chars`);

      // Debug: log page title
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      console.log(`  [COMIX] Page title: "${titleMatch ? titleMatch[1] : 'no title'}"`);

      const firstPageChapters = this.parseChaptersFromHtml(html);

      if (firstPageChapters.length === 0) {
        console.log(`  [COMIX] WARNING: 0 chapters parsed from ${html.length} chars`);
        const hasChapterHref = html.includes('chapter-');
        console.log(`  [COMIX] HTML contains 'chapter-': ${hasChapterHref}`);
        if (!hasChapterHref) {
          const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,500})/i);
          console.log(`  [COMIX] Body start: ${bodyMatch ? bodyMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 300) : 'no body'}`);
        }
      }

      const knownUrlSet = new Set(knownChapterUrls);
      const newChapters = firstPageChapters.filter(ch => !knownUrlSet.has(ch.url));

      const latestChapter = firstPageChapters.length > 0
        ? Math.max(...firstPageChapters.map(c => c.number))
        : null;

      console.log(`  Found ${firstPageChapters.length} chapters on first page, ${newChapters.length} new`);

      return {
        hasUpdates: newChapters.length > 0,
        latestChapter,
        newChapters,
        firstPageChapters
      };

    } catch (error) {
      console.log(`  [COMIX] FlareSolverr FAILED: ${error.message}`);
      console.log(`  [COMIX] Falling back to direct puppeteer...`);
      return this.quickCheckUpdatesDirect(url, knownChapterUrls);
    }
  }

  // Direct puppeteer fallback
  async quickCheckUpdatesDirect(url, knownChapterUrls = []) {
    await this.createPage();
    try {
      console.log(`  Quick check (direct fallback): ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(500, 1000);
      await this.page.waitForSelector('a[href*="chapter"]', { timeout: 10000 }).catch(() => { });

      const firstPageChapters = await this.page.evaluate(() => {
        const chapters = [];
        const links = document.querySelectorAll('a[href*="chapter-"]');
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (!href) return;
          const text = link.textContent.trim();
          const numMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i) ||
            text.match(/ch\.?\s*(\d+(?:\.\d+)?)(?!\d)/i) ||
            text.match(/^(\d+(?:\.\d+)?)(?!\d)/);
          if (numMatch) {
            const fullUrl = href.startsWith('http') ? href : window.location.origin + href;
            chapters.push({ number: parseFloat(numMatch[1]), title: text || `Chapter ${numMatch[1]}`, url: fullUrl });
          }
        });
        return chapters;
      });

      const knownUrlSet = new Set(knownChapterUrls);
      const newChapters = firstPageChapters.filter(ch => !knownUrlSet.has(ch.url));
      const latestChapter = firstPageChapters.length > 0 ? Math.max(...firstPageChapters.map(c => c.number)) : null;

      console.log(`  Found ${firstPageChapters.length} chapters on first page, ${newChapters.length} new`);
      return { hasUpdates: newChapters.length > 0, latestChapter, newChapters, firstPageChapters };
    } finally {
      await this.closePage();
    }
  }

  async getMangaInfo(url) {
    try {
      console.log(`  Navigating to: ${url}`);
      console.log(`  [COMIX] Using FlareSolverr for getMangaInfo...`);

      const { html, cookies, userAgent } = await fetchPage(url);
      console.log(`  [COMIX] FlareSolverr returned ${html.length} chars`);

      // Parse title
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown Title';
      console.log(`  Title: ${title}`);

      // Parse total chapter count
      const showingMatch = html.match(/of\s+(\d+)\s+items/i);
      const totalFromPage = showingMatch ? parseInt(showingMatch[1]) : 0;
      if (totalFromPage > 0) console.log(`  Total chapters from page: ${totalFromPage}`);

      // Parse cover image
      let cover = null;
      const coverMatch = html.match(/<img[^>]*src="(https?:\/\/static\.comix\.to\/[^"]*)"[^>]*>/i);
      if (coverMatch && !coverMatch[1].includes('avatar') && !coverMatch[1].includes('icon')) {
        cover = coverMatch[1];
      }
      if (!cover) {
        const figMatch = html.match(/<figure[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*>/i);
        if (figMatch) cover = figMatch[1];
      }

      // Parse description
      let description = '';
      const descMatch = html.match(/<(?:div|p)[^>]*class="[^"]*(?:description|summary|synopsis|prose)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/i);
      if (descMatch) description = descMatch[1].replace(/<[^>]*>/g, '').trim();

      // Collect chapters from first page
      let allChapters = this.parseChaptersWithMetadata(html);
      console.log(`    Found ${allChapters.length} chapters on page 1`);

      // Handle pagination
      let pageNum = 1;
      const pageUrlRegex = /href="([^"]*#(\d+))"/g;
      const pageNumbers = new Set();
      let pageMatch;
      while ((pageMatch = pageUrlRegex.exec(html)) !== null) {
        pageNumbers.add(parseInt(pageMatch[2]));
      }
      const maxPage = pageNumbers.size > 0 ? Math.max(...pageNumbers) : 1;

      if (maxPage > 1) {
        console.log(`  Found ${maxPage} pages of chapters`);
        for (let p = 2; p <= maxPage; p++) {
          try {
            console.log(`  Scraping page ${p}...`);
            const pageUrl = `${url}?page=${p}`;
            const { html: pageHtml } = await fetchPage(pageUrl);
            const pageChapters = this.parseChaptersWithMetadata(pageHtml);
            console.log(`    Found ${pageChapters.length} chapters on page ${p}`);
            if (pageChapters.length === 0) break;
            if (allChapters.length > 0 && pageChapters.length > 0 &&
              pageChapters[0].number === allChapters[0].number) {
              console.log(`  Detected duplicate page, stopping pagination`);
              break;
            }
            allChapters = allChapters.concat(pageChapters);
            await this.randomDelay(1000, 1500);
          } catch (err) {
            console.log(`  Error fetching page ${p}: ${err.message}`);
            break;
          }
        }
      }

      // Process chapters - deduplicate and track versions
      const chaptersByNumber = new Map();
      for (const ch of allChapters) {
        const existing = chaptersByNumber.get(ch.number) || [];
        const isDuplicateUrl = existing.some(e => e.url === ch.url);
        if (!isDuplicateUrl) {
          existing.push(ch);
          chaptersByNumber.set(ch.number, existing);
        }
      }

      const chapters = [];
      const duplicateChapters = [];
      for (const [num, versions] of chaptersByNumber) {
        if (versions.length === 1) {
          chapters.push(versions[0]);
        } else {
          versions.forEach((v, i) => {
            chapters.push({ ...v, version: i + 1, totalVersions: versions.length, originalNumber: num });
          });
          duplicateChapters.push({ number: num, versions: versions.map((v, i) => ({ ...v, version: i + 1 })) });
        }
      }

      chapters.sort((a, b) => a.number - b.number);
      const uniqueCount = chaptersByNumber.size;
      console.log(`  Found ${chapters.length} total chapters (${uniqueCount} unique, ${duplicateChapters.length} have duplicates)`);

      return {
        url, website: this.websiteName, title,
        totalChapters: totalFromPage || chapters.length,
        uniqueChapters: uniqueCount, chapters, duplicateChapters, cover, description
      };

    } catch (error) {
      console.log(`  [COMIX] FlareSolverr getMangaInfo failed: ${error.message}`);
      console.log(`  [COMIX] Falling back to direct puppeteer...`);
      return this.getMangaInfoDirect(url);
    }
  }

  // Direct puppeteer fallback for getMangaInfo
  async getMangaInfoDirect(url) {
    await this.createPage();
    try {
      console.log(`  getMangaInfo (direct fallback): ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);
      await this.page.waitForSelector('a[href*="chapter"]', { timeout: 10000 }).catch(() => { });
      await this.randomDelay(500, 1000);

      const { title, totalFromPage } = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';
        const showingText = document.body.innerText.match(/of\s+(\d+)\s+items/i);
        const totalFromPage = showingText ? parseInt(showingText[1]) : 0;
        return { title, totalFromPage };
      });

      const { cover, description } = await this.page.evaluate(() => {
        const allImages = document.querySelectorAll('img[src*="static.comix.to"]');
        let coverEl = null;
        for (const img of allImages) {
          if (img.src && !img.src.includes('avatar') && !img.src.includes('icon') && !img.src.includes('svg')) {
            coverEl = img; break;
          }
        }
        if (!coverEl) coverEl = document.querySelector('figure img, img.rounded-lg, article img');
        const descEl = document.querySelector('.description, .summary, .synopsis, p.text-sm, .prose p');
        return { cover: coverEl ? coverEl.src : null, description: descEl ? descEl.textContent.trim() : '' };
      });

      const chapters = await this.page.evaluate(() => {
        const chapters = [];
        const links = document.querySelectorAll('a[href*="chapter-"]');
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (!href) return;
          const text = link.textContent.trim();
          const numMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i) ||
            text.match(/ch\.?\s*(\d+(?:\.\d+)?)(?!\d)/i) ||
            text.match(/^(\d+(?:\.\d+)?)(?!\d)/);
          if (numMatch) {
            chapters.push({
              number: parseFloat(numMatch[1]),
              title: text || `Chapter ${numMatch[1]}`,
              url: href.startsWith('http') ? href : window.location.origin + href
            });
          }
        });
        return chapters;
      });

      chapters.sort((a, b) => a.number - b.number);
      return {
        url, website: this.websiteName, title,
        totalChapters: totalFromPage || chapters.length,
        uniqueChapters: chapters.length, chapters,
        duplicateChapters: [], cover, description
      };
    } finally {
      await this.closePage();
    }
  }

  async getChapterImages(chapterUrl) {
    // Strategy: Use FlareSolverr to get cookies, then pass them to puppeteer
    let fsCookies = [];
    let fsUserAgent = '';

    try {
      console.log(`  [COMIX] Getting FlareSolverr cookies for chapter images...`);
      const fsResult = await fetchPage(chapterUrl);
      fsCookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');
      fsUserAgent = fsResult.userAgent;
      console.log(`  [COMIX] Got ${fsCookies.length} cookies from FlareSolverr`);
    } catch (error) {
      console.log(`  [COMIX] FlareSolverr cookie fetch failed: ${error.message}, trying direct...`);
    }

    // Use clean page without blocking - needed for lazy loading to work
    await this.createPageClean();

    try {
      // Set cookies from FlareSolverr if available
      if (fsCookies.length > 0) {
        await this.page.setCookie(...fsCookies);
        console.log(`  Set ${fsCookies.length} cookies from FlareSolverr`);
      }
      if (fsUserAgent) {
        await this.page.setUserAgent(fsUserAgent);
      }

      console.log(`  Loading chapter: ${chapterUrl}`);
      await this.page.goto(chapterUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Wait for initial load
      await new Promise(r => setTimeout(r, 3000));

      // Scroll until we truly reach the bottom
      console.log('  Scrolling to load all images...');
      await this.page.evaluate(async () => {
        await new Promise((resolve) => {
          let lastScrollY = -1;
          let sameCount = 0;
          const timer = setInterval(() => {
            window.scrollBy(0, 1500);
            if (window.scrollY === lastScrollY) {
              sameCount++;
              if (sameCount >= 3) { clearInterval(timer); resolve(); }
            } else { sameCount = 0; }
            lastScrollY = window.scrollY;
          }, 200);
          setTimeout(() => { clearInterval(timer); resolve(); }, 60000);
        });
      });

      await new Promise(r => setTimeout(r, 2000));

      await this.page.waitForFunction(() => {
        const imgs = document.querySelectorAll('img.fit-w');
        if (imgs.length === 0) return false;
        return Array.from(imgs).every(img => img.src && img.naturalWidth > 0);
      }, { timeout: 15000 }).catch(() => { });

      // Extract images
      const images = await this.page.evaluate(() => {
        let imgElements = document.querySelectorAll('img.fit-w');
        if (imgElements.length === 0) {
          imgElements = document.querySelectorAll(
            '.reader-content img, .chapter-content img, .page-container img, ' +
            '.reading-content img, #readerarea img, .chapter-images img, ' +
            '[class*="page"] img, img[src*="cdn"], img[data-src*="cdn"]'
          );
        }

        const imageUrls = [];
        const seenUrls = new Set();
        imgElements.forEach((img) => {
          let src = img.src || img.dataset.src || img.getAttribute('data-lazy-src');
          if (src && !src.includes('loading') && !src.includes('placeholder') &&
            !src.includes('static.comix.to') && img.naturalWidth > 100 && !seenUrls.has(src)) {
            seenUrls.add(src);
            if (src.startsWith('//')) src = 'https:' + src;
            else if (src.startsWith('/')) src = window.location.origin + src;
            imageUrls.push({ index: imageUrls.length + 1, url: src });
          }
        });
        return imageUrls;
      });

      console.log(`  Found ${images.length} images`);

      // Extract cookies and referer for download authentication
      const cookies = await this.page.cookies();
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const referer = chapterUrl;

      const imagesWithHeaders = images.map(img => ({
        ...img,
        headers: {
          'Cookie': cookieString,
          'Referer': referer,
          'User-Agent': fsUserAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }));

      return imagesWithHeaders;

    } finally {
      await this.closePage();
    }
  }
}

export default ComixScraper;
