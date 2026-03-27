import { BaseScraper } from './base.js';
import { fetchPage, isAvailable, toPuppeteerCookies } from './flaresolverr.js';

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

  get supportsSearch() {
    return true;
  }

  /**
   * Parse chapter links from HTML string
   * @param {string} html - Page HTML
   * @returns {Array} chapters found
   */
  parseChaptersFromHtml(html) {
    const chapters = [];
    // Match all <a> tags with href containing "chapter-"
    const linkRegex = /<a[^>]*href="([^"]*chapter-[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      const text = match[2].replace(/<[^>]*>/g, '').trim(); // Strip inner HTML tags

      // Extract chapter number from URL (most reliable)
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
   * Parse release group and upload time from HTML for chapters
   * Each chapter link is followed by sibling spans with metadata
   */
  parseChaptersWithMetadata(html) {
    const chapters = [];
    // Match chapter link blocks - each chapter row has similar structure
    // <a href="...chapter-X...">Ch. X</a><span>pages</span><span>time</span><span>group</span>
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

        // Extract sibling spans for metadata
        const spanRegex = /<span[^>]*>([\s\S]*?)<\/span>/gi;
        const spans = [];
        let spanMatch;
        while ((spanMatch = spanRegex.exec(afterLink)) !== null) {
          const spanText = spanMatch[1].replace(/<[^>]*>/g, '').trim();
          if (spanText) spans.push(spanText);
        }

        let releaseGroup = '';
        let uploadedAt = '';

        // spans[0] = page count, spans[1] = time ago, spans[2] = release group
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

      // Debug: log page title from the HTML
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      console.log(`  [FlareSolverr] Page title: "${titleMatch ? titleMatch[1] : 'no title'}"`);

      const firstPageChapters = this.parseChaptersFromHtml(html);

      // Debug: if no chapters found, log a snippet of the HTML for diagnosis
      if (firstPageChapters.length === 0) {
        console.log(`  [FlareSolverr] WARNING: 0 chapters parsed from ${html.length} chars of HTML`);
        // Check if we got past Cloudflare
        const hasChapterHref = html.includes('chapter-');
        console.log(`  [FlareSolverr] HTML contains 'chapter-': ${hasChapterHref}`);
        if (!hasChapterHref) {
          // Log first 500 chars of body for debugging
          const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,500})/i);
          console.log(`  [FlareSolverr] Body start: ${bodyMatch ? bodyMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200) : 'no body'}`);
        }
      }

      // Find new chapters (URLs we haven't seen before)
      const knownUrlSet = new Set(knownChapterUrls);
      const newChapters = firstPageChapters.filter(ch => !knownUrlSet.has(ch.url));

      // Get the highest chapter number from first page
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


  async search(query) {
    const searchUrl = `https://comix.to/browser?keyword=${encodeURIComponent(query)}&order=relevance%3Adesc&genres_mode=and`;
    console.log(`  [COMIX] Searching: ${searchUrl}`);
    
    try {
      let fsCookies = [];
      let fsUserAgent = '';
      
      try {
        console.log(`  [COMIX] Getting CF cookies via FlareSolverr...`);
        const fsResult = await fetchPage(searchUrl);
        fsCookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');
        fsUserAgent = fsResult.userAgent;
        console.log(`  [COMIX] Got ${fsCookies.length} cookies from FlareSolverr`);
      } catch (error) {
        console.log(`  [COMIX] FlareSolverr failed: ${error.message}`);
      }
      
      await this.createPageClean();
      
      try {
        await this.page.setViewport({ width: 1920, height: 1080 });
        if (fsCookies.length > 0) await this.page.setCookie(...fsCookies);
        if (fsUserAgent) await this.page.setUserAgent(fsUserAgent);
        
        // Clear localStorage BEFORE page loads to prevent comix.to from applying
        // saved genre exclusion filters (genres=-87264,-87266,-87268,-87265)
        // that hide results like Dandadan
        await this.page.evaluateOnNewDocument(() => {
          localStorage.clear();
        });
        
        console.log(`  [COMIX] Loading search page in Puppeteer...`);
        await this.page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        const pageTitle = await this.page.title();
        console.log(`  [COMIX] Page title: "${pageTitle}"`);
        if (pageTitle.includes('moment') || pageTitle.includes('Checking')) {
          console.log(`  [COMIX] CF challenge, waiting...`);
          await this.page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
          await new Promise(r => setTimeout(r, 3000));
        }
        
        // Wait for React render
        await new Promise(r => setTimeout(r, 5000));
        await this.page.waitForSelector('.item a.title', { timeout: 15000 }).catch(() => {});
        
        // Scroll to trigger lazy rendering
        let prevCount = 0;
        let stableScrolls = 0;
        for (let i = 0; i < 20; i++) {
          const count = await this.page.evaluate(() => document.querySelectorAll('.item a.title').length);
          if (count > prevCount) {
            console.log(`  [COMIX] Items: ${count} (was ${prevCount})`);
            prevCount = count;
            stableScrolls = 0;
          } else {
            stableScrolls++;
            if (stableScrolls >= 4) break;
          }
          await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
          await new Promise(r => setTimeout(r, 500));
        }
        
        // Scroll for images: top -> bottom -> top
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await new Promise(r => setTimeout(r, 500));
        await this.page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 300) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 150));
          }
          window.scrollTo(0, 0);
        });
        await new Promise(r => setTimeout(r, 2000));
        
        // Extract results from DOM
        const domResults = await this.page.evaluate(() => {
          const items = document.querySelectorAll('.item');
          const results = [];
          const seen = new Set();
          items.forEach(item => {
            const titleEl = item.querySelector('a.title');
            if (!titleEl) return;
            const href = titleEl.getAttribute('href');
            const title = titleEl.textContent.trim();
            if (!title || !href) return;
            const url = href.startsWith('http') ? href : 'https://comix.to' + href;
            if (seen.has(url)) return;
            seen.add(url);
            let cover = null;
            const img = item.querySelector('.poster img');
            if (img) {
              const src = img.src || img.getAttribute('data-src') || '';
              if (src.startsWith('http') && !src.endsWith('.svg')) cover = src;
            }
            let chapterCount = 0;
            const metachip = item.querySelector('.metachip');
            if (metachip) {
              for (const span of metachip.querySelectorAll('span')) {
                const m = span.textContent.trim().match(/^Ch\.(\d+)/i);
                if (m) { chapterCount = parseInt(m[1]); break; }
              }
            }
            results.push({ title, url, cover, chapterCount });
          });
          return results;
        });
        
        console.log(`  [COMIX] DOM results: ${domResults.length}`);
        
        // Check full page HTML for items that React didn't render
        const pageHtml = await this.page.content();
        const htmlItemCount = (pageHtml.match(/class="item"/g) || []).length;
        console.log(`  [COMIX] HTML item count: ${htmlItemCount}`);
        
        const results = [...domResults];
        
        // Parse missing items from raw HTML
        if (htmlItemCount > domResults.length) {
          console.log(`  [COMIX] Parsing ${htmlItemCount - domResults.length} extra items from HTML...`);
          const existingUrls = new Set(results.map(r => r.url));
          const itemBlocks = pageHtml.split(/class="item"/g);
          
          for (let i = 1; i < itemBlocks.length; i++) {
            const block = itemBlocks[i];
            const titleMatch = block.match(/<a[^>]*class="title"[^>]*href="(\/title\/[^"]+)"[^>]*>([^<]+)<\/a>/i);
            if (!titleMatch) continue;
            
            const url = 'https://comix.to' + titleMatch[1];
            if (existingUrls.has(url)) continue;
            
            const title = titleMatch[2].trim();
            if (!title) continue;
            
            let cover = null;
            const imgMatch = block.match(/<img[^>]*src="(https:\/\/static\.comix\.to\/[^"]+)"/i);
            if (imgMatch) cover = imgMatch[1];
            
            let chapterCount = 0;
            const chMatch = block.match(/Ch\.(\d+)/i);
            if (chMatch) chapterCount = parseInt(chMatch[1]);
            
            results.push({ title, url, cover, chapterCount });
            existingUrls.add(url);
            console.log(`    + "${title}" (Ch.${chapterCount})`);
          }
        }
        
        // Capture cover images
        const { default: fsx } = await import('fs-extra');
        const { default: pathMod } = await import('path');
        const { CONFIG } = await import('../config.js');
        
        const cacheDir = pathMod.join(CONFIG.dataDir, 'covers', 'search-cache');
        await fsx.emptyDir(cacheDir);
        const ts = Date.now();
        
        console.log(`  [COMIX] Capturing cover images...`);
        
        // Screenshot covers for DOM-rendered items
        const imgElements = await this.page.$$('.item .poster img');
        const domCaptured = Math.min(domResults.length, imgElements.length);
        
        for (let i = 0; i < domCaptured; i++) {
          try {
            const filePath = pathMod.join(cacheDir, `search_${i}_${ts}.jpg`);
            await imgElements[i].screenshot({ path: filePath, type: 'jpeg', quality: 85 });
            results[i].cover = `/covers/search-cache/search_${i}_${ts}.jpg`;
          } catch (e) {
            console.log(`  [COMIX] Cover screenshot ${i} failed: ${e.message}`);
          }
        }
        
        // For HTML-only items, use browser fetch to download covers (has CF cookies)
        for (let i = domCaptured; i < results.length; i++) {
          if (!results[i].cover || !results[i].cover.startsWith('http')) continue;
          try {
            const base64 = await this.page.evaluate(async (imgUrl) => {
              try {
                const resp = await fetch(imgUrl);
                if (!resp.ok) return null;
                const blob = await resp.blob();
                return new Promise(resolve => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result.split(',')[1]);
                  reader.readAsDataURL(blob);
                });
              } catch { return null; }
            }, results[i].cover);
            
            if (base64) {
              const filePath = pathMod.join(cacheDir, `search_${i}_${ts}.jpg`);
              await fsx.writeFile(filePath, Buffer.from(base64, 'base64'));
              results[i].cover = `/covers/search-cache/search_${i}_${ts}.jpg`;
            }
          } catch (e) {
            console.log(`  [COMIX] Cover download ${i} failed: ${e.message}`);
          }
        }
        
        results.forEach(r => r.website = this.websiteName);
        
        console.log(`  [COMIX] Total: ${results.length} results`);
        results.forEach((r, i) => console.log(`    ${i}: "${r.title}" Ch.${r.chapterCount} cover:${r.cover ? 'yes' : 'no'}`));
        
        return results;
      } finally {
        await this.closePage();
      }
    } catch (e) {
      console.error(`  [COMIX] Search failed: ${e.message}`);
      return [];
    }
  }


  // Direct puppeteer fallback for quickCheck
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
            chapters.push({
              number: parseFloat(numMatch[1]),
              title: text || `Chapter ${numMatch[1]}`,
              url: fullUrl
            });
          }
        });
        return chapters;
      });

      const knownUrlSet = new Set(knownChapterUrls);
      const newChapters = firstPageChapters.filter(ch => !knownUrlSet.has(ch.url));
      const latestChapter = firstPageChapters.length > 0
        ? Math.max(...firstPageChapters.map(c => c.number))
        : null;

      console.log(`  Found ${firstPageChapters.length} chapters on first page, ${newChapters.length} new`);
      return { hasUpdates: newChapters.length > 0, latestChapter, newChapters, firstPageChapters };
    } finally {
      await this.closePage();
    }
  }

  async getMangaInfo(url) {
    try {
      console.log(`  Navigating to: ${url}`);

      // Fetch the first page via FlareSolverr
      const { html, cookies, userAgent } = await fetchPage(url);

      // Parse title
      const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Unknown Title';
      console.log(`  Title: ${title}`);

      // Parse total chapter count from "Showing X to Y of Z items"
      const showingMatch = html.match(/of\s+(\d+)\s+items/i);
      const totalFromPage = showingMatch ? parseInt(showingMatch[1]) : 0;
      if (totalFromPage > 0) {
        console.log(`  Total chapters from page: ${totalFromPage}`);
      }

      // Parse cover image - look for img with static.comix.to
      let cover = null;
      const coverMatch = html.match(/<img[^>]*src="(https?:\/\/static\.comix\.to\/[^"]*)"[^>]*>/i);
      if (coverMatch && !coverMatch[1].includes('avatar') && !coverMatch[1].includes('icon')) {
        cover = coverMatch[1];
      }
      // Fallback: look for any img in a figure tag
      if (!cover) {
        const figMatch = html.match(/<figure[^>]*>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*>/i);
        if (figMatch) cover = figMatch[1];
      }

      // Parse description
      let description = '';
      const descMatch = html.match(/<(?:div|p)[^>]*class="[^"]*(?:description|summary|synopsis|prose)[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/i);
      if (descMatch) {
        description = descMatch[1].replace(/<[^>]*>/g, '').trim();
      }

      // Collect chapters from first page
      let allChapters = this.parseChaptersWithMetadata(html);
      console.log(`    Found ${allChapters.length} chapters on page 1`);

      // Handle pagination - check for page links and fetch subsequent pages
      let pageNum = 1;
      const pageUrlRegex = /href="([^"]*#(\d+))"/g;
      const pageNumbers = new Set();
      let pageMatch;
      while ((pageMatch = pageUrlRegex.exec(html)) !== null) {
        pageNumbers.add(parseInt(pageMatch[2]));
      }

      // Also check for "Next" pagination patterns
      const maxPage = pageNumbers.size > 0 ? Math.max(...pageNumbers) : 1;

      if (maxPage > 1) {
        console.log(`  Found ${maxPage} pages of chapters`);

        // Pagination on comix.to uses hash-based navigation (#2, #3, etc.)
        // These are client-side rendered, so we need to fetch each page URL
        // For hash-based pagination, the server may use query params instead
        // Try fetching with page parameter
        for (let p = 2; p <= maxPage; p++) {
          try {
            console.log(`  Scraping page ${p}...`);
            // comix.to typically uses the same URL with different page hash
            // FlareSolverr may need the page URL with query params
            const pageUrl = `${url}?page=${p}`;
            const { html: pageHtml } = await fetchPage(pageUrl);
            const pageChapters = this.parseChaptersWithMetadata(pageHtml);
            console.log(`    Found ${pageChapters.length} chapters on page ${p}`);

            if (pageChapters.length === 0) break;

            // Check for duplicate page (same first chapter)
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

      // Build final chapter list with version info
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

    } catch (error) {
      console.error(`  FlareSolverr getMangaInfo failed: ${error.message}`);
      // Fallback to direct puppeteer
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

      // Get chapters from first page only (simplified fallback)
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
        url,
        website: this.websiteName,
        title,
        totalChapters: totalFromPage || chapters.length,
        uniqueChapters: chapters.length,
        chapters,
        duplicateChapters: [],
        cover,
        description
      };

    } finally {
      await this.closePage();
    }
  }

  async getChapterImages(chapterUrl) {
    // Strategy: Use FlareSolverr to get cookies, then pass them to puppeteer
    // for scrolling and lazy-loaded image extraction
    let fsCookies = [];
    let fsUserAgent = '';

    try {
      // Get cookies from FlareSolverr first
      const fsResult = await fetchPage(chapterUrl);
      fsCookies = toPuppeteerCookies(fsResult.cookies, '.comix.to');
      fsUserAgent = fsResult.userAgent;
    } catch (error) {
      console.log(`  FlareSolverr cookie fetch failed: ${error.message}, trying direct...`);
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

      // Scroll until we truly reach the bottom (scroll position stops changing)
      console.log('  Scrolling to load all images...');
      await this.page.evaluate(async () => {
        await new Promise((resolve) => {
          let lastScrollY = -1;
          let sameCount = 0;

          const timer = setInterval(() => {
            window.scrollBy(0, 1500);

            // Check if scroll position changed
            if (window.scrollY === lastScrollY) {
              sameCount++;
              // If position hasn't changed for 3 checks, we're at the bottom
              if (sameCount >= 3) {
                clearInterval(timer);
                resolve();
              }
            } else {
              sameCount = 0;
            }
            lastScrollY = window.scrollY;
          }, 200);

          // Safety timeout
          setTimeout(() => {
            clearInterval(timer);
            resolve();
          }, 60000);
        });
      });

      // Wait for images to finish loading
      await new Promise(r => setTimeout(r, 2000));

      // Wait for all images to be loaded
      await this.page.waitForFunction(() => {
        const imgs = document.querySelectorAll('img.fit-w');
        if (imgs.length === 0) return false;
        return Array.from(imgs).every(img => img.src && img.naturalWidth > 0);
      }, { timeout: 15000 }).catch(() => { });

      // Extract images - comix.to uses img.fit-w for chapter pages
      const images = await this.page.evaluate(() => {
        // First try the specific comix.to selector
        let imgElements = document.querySelectorAll('img.fit-w');

        // Fallback to other common selectors if none found
        if (imgElements.length === 0) {
          imgElements = document.querySelectorAll(
            '.reader-content img, .chapter-content img, .page-container img, ' +
            '.reading-content img, #readerarea img, .chapter-images img, ' +
            '[class*="page"] img, img[src*="cdn"], img[data-src*="cdn"]'
          );
        }

        const imageUrls = [];
        const seenUrls = new Set();

        imgElements.forEach((img, index) => {
          // Get src or data-src
          let src = img.src || img.dataset.src || img.getAttribute('data-lazy-src');

          // Skip small images (likely icons/avatars), placeholders, and duplicates
          if (src &&
            !src.includes('loading') &&
            !src.includes('placeholder') &&
            !src.includes('static.comix.to') && // Skip cover/avatar images
            img.naturalWidth > 100 &&
            !seenUrls.has(src)) {

            seenUrls.add(src);

            // Ensure absolute URL
            if (src.startsWith('//')) {
              src = 'https:' + src;
            } else if (src.startsWith('/')) {
              src = window.location.origin + src;
            }

            imageUrls.push({
              index: imageUrls.length + 1,
              url: src
            });
          }
        });

        return imageUrls;
      });

      console.log(`  Found ${images.length} images`);
      return images;

    } finally {
      await this.closePage();
    }
  }
}

export default ComixScraper;
