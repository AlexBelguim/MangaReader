import { BaseScraper } from './base.js';

/**
 * Scraper for comix.to website
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
  
  // Quick check - only scrapes the first page to find new chapters
  async quickCheckUpdates(url, knownChapterUrls = []) {
    await this.createPage();

    try {
      console.log(`  Quick check: ${url}`);
      await this.page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      await this.randomDelay(500, 1000);
      await this.page.waitForSelector('a[href*="chapter"]', { timeout: 10000 }).catch(() => {});

      // Get chapters from first page only
      const firstPageChapters = await this.page.evaluate(() => {
        const chapters = [];
        const links = document.querySelectorAll('a[href*="chapter-"]');
        
        links.forEach((link) => {
          const href = link.getAttribute('href');
          if (!href) return;
          
          const text = link.textContent.trim();
          // Extract chapter number - prefer URL as it's more reliable
          // Text can have issues like "Ch. 1048" + "20 Years" being concatenated as "Ch. 104820 Years"
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

    } finally {
      await this.closePage();
    }
  }

  async getMangaInfo(url) {
    await this.createPage();

    try {
      console.log(`  Navigating to: ${url}`);
      await this.page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      await this.randomDelay(1000, 2000);

      // Wait for chapter list to load - comix.to uses 'chapter' in the URL
      await this.page.waitForSelector('a[href*="chapter"]', { timeout: 10000 }).catch(() => {});
      await this.randomDelay(500, 1000);

      // Get title and total chapter count from page
      const { title, totalFromPage } = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';
        
        // Try to get total count from "Showing X to Y of Z items" text
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
        // comix.to uses static.comix.to for images
        const allImages = document.querySelectorAll('img[src*="static.comix.to"]');
        let coverEl = null;
        for (const img of allImages) {
          // Skip small icons/avatars
          if (img.src && !img.src.includes('avatar') && !img.src.includes('icon') && !img.src.includes('svg')) {
            coverEl = img;
            break;
          }
        }
        
        // Fallback selectors
        if (!coverEl) {
          coverEl = document.querySelector('figure img, img.rounded-lg, article img');
        }
        
        const descEl = document.querySelector('.description, .summary, .synopsis, p.text-sm, .prose p');
        return {
          cover: coverEl ? coverEl.src : null,
          description: descEl ? descEl.textContent.trim() : ''
        };
      });

      // Collect chapters from all pages
      let allChapters = [];
      let pageNum = 1;
      let previousFirstChapter = null;

      while (true) {
        console.log(`  Scraping page ${pageNum}...`);
        
        // Get chapters from current page - comix.to uses 'chapter' in URL
        const pageChapters = await this.page.evaluate(() => {
          const chapters = [];
          // Match links containing 'chapter' in the href
          const links = document.querySelectorAll('a[href*="chapter-"]');
          
          links.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            const text = link.textContent.trim();
            
            // Extract chapter number - prefer URL as it's more reliable
            // Text can have issues like "Ch. 1048" + "20 Years" being concatenated as "Ch. 104820 Years"
            const numMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i) ||
                            text.match(/ch\.?\s*(\d+(?:\.\d+)?)(?!\d)/i) ||
                            text.match(/^(\d+(?:\.\d+)?)(?!\d)/);
            
            if (numMatch) {
              // Find sibling spans after the link
              // Structure: <a>Ch. X</a><span>pageCount</span><span>time ago</span><span>release group</span>
              let releaseGroup = '';
              let uploadedAt = '';
              
              // Get all sibling spans that come after the link
              let sibling = link.nextElementSibling;
              const siblingSpans = [];
              while (sibling) {
                if (sibling.tagName === 'SPAN') {
                  siblingSpans.push(sibling.textContent?.trim() || '');
                }
                sibling = sibling.nextElementSibling;
              }
              
              // siblingSpans[0] = page count (number)
              // siblingSpans[1] = time ago (e.g., "6 days ago")
              // siblingSpans[2] = release group (can be empty)
              if (siblingSpans.length >= 2) {
                uploadedAt = siblingSpans[1] || '';
              }
              if (siblingSpans.length >= 3) {
                releaseGroup = siblingSpans[2] || '';
              }
              
              chapters.push({
                number: parseFloat(numMatch[1]),
                title: text || `Chapter ${numMatch[1]}`,
                url: href.startsWith('http') ? href : window.location.origin + href,
                releaseGroup: releaseGroup,
                uploadedAt: uploadedAt
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

        // Check if there's a next page by looking at pagination state
        const hasNextPage = await this.page.evaluate(() => {
          // Find all pagination links
          const pageLinks = document.querySelectorAll('a.page-link, .pagination a, nav a');
          
          for (const link of pageLinks) {
            const text = link.textContent.trim();
            // Look for "Next" button
            if (text === 'Next' || text === '›' || text === '>') {
              const href = link.getAttribute('href');
              // Check if this is the last page - Next button might link to current page
              // Extract page number from href like "#15"
              const currentPageMatch = href ? href.match(/#(\d+)/) : null;
              const currentPageNum = currentPageMatch ? parseInt(currentPageMatch[1]) : 0;
              
              // If we're already at this page, we're at the end
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
        // Wait for content to update
        await this.page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 }).catch(() => {});
      }

      // Process chapters - keep ALL versions but track duplicates
      const chaptersByNumber = new Map();
      for (const ch of allChapters) {
        // Skip exact URL duplicates (same scrape from pagination)
        const existing = chaptersByNumber.get(ch.number) || [];
        const isDuplicateUrl = existing.some(e => e.url === ch.url);
        if (!isDuplicateUrl) {
          existing.push(ch);
          chaptersByNumber.set(ch.number, existing);
        }
      }

      // Build final chapter list with version info
      const chapters = [];
      const duplicateChapters = []; // Chapters with multiple versions
      
      for (const [num, versions] of chaptersByNumber) {
        if (versions.length === 1) {
          chapters.push(versions[0]);
        } else {
          // Multiple versions - add all with version suffix
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
            versions: versions.map((v, i) => ({
              ...v,
              version: i + 1
            }))
          });
        }
      }
      
      chapters.sort((a, b) => a.number - b.number);

      // Use the count from page if available, otherwise use scraped count
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
    // Use clean page without blocking - needed for lazy loading to work
    await this.createPageClean();

    // Capture chapter image URLs at the network layer. The new reader
    // renders every 3rd page as a <canvas> (anti-scrape) so DOM-only
    // extraction misses them, but the browser still fetches every webp.
    const captured = [];
    const onResponse = (res) => {
      const url = res.url();
      // Chapter images live on the wowpic CDN under /si/<token>/NN.<ext>
      if (!/wowpic\d*\.\w+\/si\/[^/]+\/\d+\.(webp|jpe?g|png|avif)(\?|$)/i.test(url)) return;
      if (res.status() !== 200) return;
      captured.push(url);
    };
    this.page.on('response', onResponse);

    try {
      console.log(`  Loading chapter: ${chapterUrl}`);
      await this.page.goto(chapterUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Wait for initial render
      await new Promise(r => setTimeout(r, 3000));

      // Dismiss the "Reader controls" hint overlay and any open settings panel
      await this.dismissReaderOverlays();

      // Wait for the reader skeleton (either the long-strip main or progress bar)
      await this.page.waitForSelector('main.rpage-main, .rpage-progress__seg', { timeout: 15000 })
        .catch(() => {});

      // Detect reader mode. Comix.to wraps webtoons in main.rpage-main--long-strip
      // and paginated manga in a Swiper carousel.
      const isLongStrip = await this.page.evaluate(() => {
        const main = document.querySelector('main.rpage-main');
        if (main && main.classList.contains('rpage-main--long-strip')) return true;
        const panel = document.querySelector('.rpage-settings__panel');
        if (panel && /STRIP MARGIN/i.test(panel.innerText)) return true;
        return false;
      });

      console.log(`  Reader mode: ${isLongStrip ? 'long-strip (webtoon)' : 'paged (manga)'}`);

      // Walk through the chapter to trigger every image fetch
      if (isLongStrip) {
        await this.walkLongStrip();
      } else {
        await this.walkPagedReader();
      }

      // Give any in-flight requests a moment to settle
      await new Promise(r => setTimeout(r, 1500));

      const images = this.orderCapturedImages(captured);
      console.log(`  Found ${images.length} images (network-captured)`);
      return images;

    } finally {
      this.page.off('response', onResponse);
      await this.closePage();
    }
  }

  // Deduplicate captured URLs and order them by the numeric portion of the
  // filename (01.webp -> 1, 19.webp -> 19). Ties or unparseable filenames
  // fall back to capture order.
  orderCapturedImages(captured) {
    const seen = new Map(); // url -> first-seen position
    captured.forEach((url, i) => {
      if (!seen.has(url)) seen.set(url, i);
    });
    const list = [...seen.entries()].map(([url, captureOrder]) => {
      const m = url.match(/\/(\d+)\.(?:webp|jpe?g|png|avif)(?:\?|$)/i);
      return { url, captureOrder, num: m ? parseInt(m[1], 10) : null };
    });
    list.sort((a, b) => {
      if (a.num !== null && b.num !== null) return a.num - b.num;
      if (a.num !== null) return -1;
      if (b.num !== null) return 1;
      return a.captureOrder - b.captureOrder;
    });
    return list.map((item, i) => ({ index: i + 1, url: item.url }));
  }

  async dismissReaderOverlays() {
    const result = await this.page.evaluate(() => {
      let actions = [];
      const hint = document.querySelector('.rpage-hint');
      if (hint) {
        const gotIt = Array.from(hint.querySelectorAll('button'))
          .find(b => /got it/i.test(b.innerText || ''));
        if (gotIt) {
          gotIt.click();
          actions.push('hint-dismissed');
        }
      }
      const closeSettings = document.querySelector('button[aria-label="Close settings"]');
      if (closeSettings) {
        const r = closeSettings.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          closeSettings.click();
          actions.push('settings-closed');
        }
      }
      return actions;
    });
    if (result.length) console.log(`  Dismissed: ${result.join(', ')}`);
    await new Promise(r => setTimeout(r, 500));
  }

  // Webtoon: scroll the long-strip <main> from top to bottom so the lazy
  // loader fetches every page image. We don't read URLs here — the network
  // listener handles capture.
  async walkLongStrip() {
    console.log('  Scrolling long-strip reader...');
    await this.page.evaluate(async () => {
      const scroller = document.querySelector('main.rpage-main--long-strip')
                    || document.querySelector('main.rpage-main');
      if (!scroller) return;
      scroller.scrollTop = 0;
      await new Promise(r => setTimeout(r, 300));
      let lastTop = -1;
      let same = 0;
      for (let i = 0; i < 500; i++) {
        scroller.scrollTop += 800;
        await new Promise(r => setTimeout(r, 250));
        if (scroller.scrollTop === lastTop) {
          same++;
          if (same >= 4) break;
        } else {
          same = 0;
        }
        lastTop = scroller.scrollTop;
      }
    });
  }

  // Paged manga: Swiper carousel only renders the active slide + neighbors,
  // so we click through every progress segment to force each page's image
  // to be fetched. We don't extract src here — the network listener does.
  async walkPagedReader() {
    const totalPages = await this.page.evaluate(
      () => document.querySelectorAll('.rpage-progress__seg').length
    );
    console.log(`  Paged reader: ${totalPages} pages`);
    if (totalPages === 0) return;

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const clicked = await this.page.evaluate((n) => {
        const btn = document.querySelector(`button[aria-label="Go to page ${n}"]`);
        if (!btn) return false;
        btn.click();
        return true;
      }, pageNum);
      if (!clicked) {
        console.warn(`  Page ${pageNum}: no progress button`);
        continue;
      }
      // Short pause is enough — we don't need the DOM to settle, just
      // enough time for Swiper to schedule the network fetch.
      await new Promise(r => setTimeout(r, 350));
    }
  }
}

export default ComixScraper;
