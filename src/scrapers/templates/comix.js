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
    // Strategy: Get FlareSolverr cookies to bypass Cloudflare, then use
    // Puppeteer with click-based pagination (the approach that actually works
    // because comix.to uses client-side React pagination with hash fragments).
    let fsCookies = [];
    let fsUserAgent = '';

    try {
      console.log(`  [COMIX] Getting FlareSolverr cookies for getMangaInfo...`);
      const { cookies, userAgent } = await fetchPage(url);
      fsCookies = toPuppeteerCookies(cookies, '.comix.to');
      fsUserAgent = userAgent;
      console.log(`  [COMIX] Got ${fsCookies.length} cookies from FlareSolverr`);
    } catch (error) {
      console.log(`  [COMIX] FlareSolverr cookie fetch failed: ${error.message}, trying direct...`);
    }

    await this.createPage();

    try {
      // Set FlareSolverr cookies/UA before navigating
      if (fsCookies.length > 0) {
        await this.page.setCookie(...fsCookies);
        console.log(`  Set ${fsCookies.length} cookies from FlareSolverr`);
      }
      if (fsUserAgent) {
        await this.page.setUserAgent(fsUserAgent);
      }

      console.log(`  Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);

      // Wait for chapter list to load
      await this.page.waitForSelector('a[href*="chapter"]', { timeout: 10000 }).catch(() => { });
      await this.randomDelay(500, 1000);

      // Get title and total chapter count from page
      const { title, totalFromPage } = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';
        const showingText = document.body.innerText.match(/of\s+(\d+)\s+items/i);
        const totalFromPage = showingText ? parseInt(showingText[1]) : 0;
        return { title, totalFromPage };
      });

      console.log(`  Title: ${title}`);
      if (totalFromPage > 0) {
        console.log(`  Total chapters from page: ${totalFromPage}`);
      }

      // Get cover and description
      const { cover, description } = await this.page.evaluate(() => {
        const allImages = document.querySelectorAll('img[src*="static.comix.to"]');
        let coverEl = null;
        for (const img of allImages) {
          if (img.src && !img.src.includes('avatar') && !img.src.includes('icon') && !img.src.includes('svg')) {
            coverEl = img;
            break;
          }
        }
        if (!coverEl) {
          coverEl = document.querySelector('figure img, img.rounded-lg, article img');
        }
        const descEl = document.querySelector('.description, .summary, .synopsis, p.text-sm, .prose p');
        return {
          cover: coverEl ? coverEl.src : null,
          description: descEl ? descEl.textContent.trim() : ''
        };
      });

      // Collect chapters from all pages using click-based pagination
      let allChapters = [];
      let pageNum = 1;
      let previousFirstChapter = null;

      while (true) {
        console.log(`  Scraping page ${pageNum}...`);

        const pageChapters = await this.page.evaluate(() => {
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
              let releaseGroup = '';
              let uploadedAt = '';
              let sibling = link.nextElementSibling;
              const siblingSpans = [];
              while (sibling) {
                if (sibling.tagName === 'SPAN') {
                  siblingSpans.push(sibling.textContent?.trim() || '');
                }
                sibling = sibling.nextElementSibling;
              }
              if (siblingSpans.length >= 2) uploadedAt = siblingSpans[1] || '';
              if (siblingSpans.length >= 3) releaseGroup = siblingSpans[2] || '';

              chapters.push({
                number: parseFloat(numMatch[1]),
                title: text || `Chapter ${numMatch[1]}`,
                url: href.startsWith('http') ? href : window.location.origin + href,
                releaseGroup,
                uploadedAt
              });
            }
          });

          return chapters;
        });

        // Check if we're seeing the same page again (pagination didn't work)
        const currentFirstChapter = pageChapters.length > 0 ? pageChapters[0].number : null;
        if (previousFirstChapter !== null && currentFirstChapter === previousFirstChapter) {
          console.log(`  Detected duplicate page, stopping pagination`);
          break;
        }
        previousFirstChapter = currentFirstChapter;

        allChapters = allChapters.concat(pageChapters);
        console.log(`    Found ${pageChapters.length} chapters on page ${pageNum}`);

        // Check if there's a next page by clicking the Next button
        const hasNextPage = await this.page.evaluate(() => {
          const pageLinks = document.querySelectorAll('a.page-link, .pagination a, nav a');
          for (const link of pageLinks) {
            const text = link.textContent.trim();
            if (text === 'Next' || text === '›' || text === '>') {
              const href = link.getAttribute('href');
              const currentPageMatch = href ? href.match(/#(\d+)/) : null;
              const currentPageNum = currentPageMatch ? parseInt(currentPageMatch[1]) : 0;
              const activePageEl = document.querySelector('a.page-link.active, .pagination .active');
              const activePage = activePageEl ? parseInt(activePageEl.textContent.trim()) : 1;
              if (currentPageNum > activePage || (!currentPageMatch && href !== '#')) {
                link.click();
                return true;
              }
              return false;
            }
          }
          return false;
        });

        if (!hasNextPage) {
          console.log(`  No more pages after page ${pageNum}`);
          break;
        }

        pageNum++;
        await this.randomDelay(1000, 1500);
        // Wait for content to update after click
        await this.page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => { });
      }

      // Process chapters - keep ALL versions but track duplicates
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
            chapters.push({
              ...v,
              version: i + 1,
              totalVersions: versions.length,
              originalNumber: num
            });
          });
          duplicateChapters.push({
            number: num,
            versions: versions.map((v, i) => ({ ...v, version: i + 1 }))
          });
        }
      }

      chapters.sort((a, b) => a.number - b.number);

      const uniqueCount = chaptersByNumber.size;
      console.log(`  Found ${chapters.length} total chapters (${uniqueCount} unique, ${duplicateChapters.length} have duplicates)`);

      return {
        url,
        website: this.websiteName,
        title,
        totalChapters: totalFromPage || chapters.length,
        uniqueChapters: uniqueCount,
        chapters,
        duplicateChapters,
        cover,
        description
      };

    } finally {
      await this.closePage();
    }
  }

  // Direct puppeteer fallback for getMangaInfo (no FlareSolverr cookies)
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
            coverEl = img;
            break;
          }
        }
        if (!coverEl) {
          coverEl = document.querySelector('figure img, img.rounded-lg, article img');
        }
        const descEl = document.querySelector('.description, .summary, .synopsis, p.text-sm, .prose p');
        return {
          cover: coverEl ? coverEl.src : null,
          description: descEl ? descEl.textContent.trim() : ''
        };
      });

      // Collect chapters from all pages using click-based pagination
      let allChapters = [];
      let pageNum = 1;
      let previousFirstChapter = null;

      while (true) {
        console.log(`  Scraping page ${pageNum}...`);

        const pageChapters = await this.page.evaluate(() => {
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
              let releaseGroup = '';
              let uploadedAt = '';
              let sibling = link.nextElementSibling;
              const siblingSpans = [];
              while (sibling) {
                if (sibling.tagName === 'SPAN') {
                  siblingSpans.push(sibling.textContent?.trim() || '');
                }
                sibling = sibling.nextElementSibling;
              }
              if (siblingSpans.length >= 2) uploadedAt = siblingSpans[1] || '';
              if (siblingSpans.length >= 3) releaseGroup = siblingSpans[2] || '';

              chapters.push({
                number: parseFloat(numMatch[1]),
                title: text || `Chapter ${numMatch[1]}`,
                url: href.startsWith('http') ? href : window.location.origin + href,
                releaseGroup,
                uploadedAt
              });
            }
          });

          return chapters;
        });

        const currentFirstChapter = pageChapters.length > 0 ? pageChapters[0].number : null;
        if (previousFirstChapter !== null && currentFirstChapter === previousFirstChapter) {
          console.log(`  Detected duplicate page, stopping pagination`);
          break;
        }
        previousFirstChapter = currentFirstChapter;

        allChapters = allChapters.concat(pageChapters);
        console.log(`    Found ${pageChapters.length} chapters on page ${pageNum}`);

        const hasNextPage = await this.page.evaluate(() => {
          const pageLinks = document.querySelectorAll('a.page-link, .pagination a, nav a');
          for (const link of pageLinks) {
            const text = link.textContent.trim();
            if (text === 'Next' || text === '›' || text === '>') {
              const href = link.getAttribute('href');
              const currentPageMatch = href ? href.match(/#(\d+)/) : null;
              const currentPageNum = currentPageMatch ? parseInt(currentPageMatch[1]) : 0;
              const activePageEl = document.querySelector('a.page-link.active, .pagination .active');
              const activePage = activePageEl ? parseInt(activePageEl.textContent.trim()) : 1;
              if (currentPageNum > activePage || (!currentPageMatch && href !== '#')) {
                link.click();
                return true;
              }
              return false;
            }
          }
          return false;
        });

        if (!hasNextPage) {
          console.log(`  No more pages after page ${pageNum}`);
          break;
        }

        pageNum++;
        await this.randomDelay(1000, 1500);
        await this.page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => { });
      }

      // Process chapters - keep ALL versions but track duplicates
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
            chapters.push({
              ...v,
              version: i + 1,
              totalVersions: versions.length,
              originalNumber: num
            });
          });
          duplicateChapters.push({
            number: num,
            versions: versions.map((v, i) => ({ ...v, version: i + 1 }))
          });
        }
      }

      chapters.sort((a, b) => a.number - b.number);

      const uniqueCount = chaptersByNumber.size;
      console.log(`  Found ${chapters.length} total chapters (${uniqueCount} unique, ${duplicateChapters.length} have duplicates)`);

      return {
        url,
        website: this.websiteName,
        title,
        totalChapters: totalFromPage || chapters.length,
        uniqueChapters: uniqueCount,
        chapters,
        duplicateChapters,
        cover,
        description
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
