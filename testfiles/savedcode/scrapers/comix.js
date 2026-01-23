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

    try {
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
      }, { timeout: 15000 }).catch(() => {});

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
