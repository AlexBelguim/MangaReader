import { BaseScraper } from '../base.js';
import { fetchPage, toPuppeteerCookies } from '../util/flaresolverr.js';
import { paginateAndCollect } from '../util/pagination.js';
import { deduplicateChapters } from '../util/chapters.js';
import { quickCheck } from '../features/quick-check.js';
import { extractChapterImages } from '../features/chapter-images.js';
import { search } from '../features/search.js';

const DOMAIN = '.comix.to';
const BASE_URL = 'https://comix.to';

// ─── HTML Parsing Helpers ────────────────────────────────────────────

/** Parse chapter links from raw HTML (used with FlareSolverr responses) */
function parseChaptersFromHtml(html) {
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
      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      chapters.push({
        number: parseFloat(numMatch[1]),
        title: text || `Chapter ${numMatch[1]}`,
        url: fullUrl
      });
    }
  }
  return chapters;
}

/** Puppeteer page.evaluate function to extract chapters from DOM */
async function extractChaptersFromDom(page) {
  return page.evaluate(() => {
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
}

// ─── FlareSolverr page setup helper ──────────────────────────────────

/** Get FlareSolverr cookies and set them on a Puppeteer page */
async function setupFlareSolverr(url, page) {
  let fsUserAgent = '';
  try {
    console.log(`  [COMIX] Getting FlareSolverr cookies...`);
    const fsResult = await fetchPage(url);
    const fsCookies = toPuppeteerCookies(fsResult.cookies, DOMAIN);
    fsUserAgent = fsResult.userAgent;
    if (fsCookies.length > 0) {
      await page.setCookie(...fsCookies);
      console.log(`  [COMIX] Set ${fsCookies.length} cookies from FlareSolverr`);
    }
    if (fsUserAgent) await page.setUserAgent(fsUserAgent);
  } catch (error) {
    console.log(`  [COMIX] FlareSolverr failed: ${error.message}, continuing without cookies...`);
  }
  return fsUserAgent;
}

// ─── Scraper ─────────────────────────────────────────────────────────

export class ComixScraper extends BaseScraper {
  get websiteName() { return 'comix.to'; }
  get urlPatterns() { return ['comix.to']; }
  get supportsQuickCheck() { return true; }
  get supportsSearch() { return true; }

  // ── Quick Check ──

  async quickCheckUpdates(url, knownChapterUrls = []) {
    console.log(`  Quick check: ${url}`);
    return quickCheck(url, knownChapterUrls, {
      fetchChapters: async (url) => {
        console.log(`  [COMIX] Attempting FlareSolverr fetch...`);
        const { html } = await fetchPage(url);
        console.log(`  [COMIX] FlareSolverr returned ${html.length} chars`);
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        console.log(`  [FlareSolverr] Page title: "${titleMatch ? titleMatch[1] : 'no title'}"`);

        const chapters = parseChaptersFromHtml(html);
        if (chapters.length === 0) {
          console.log(`  [FlareSolverr] WARNING: 0 chapters parsed from ${html.length} chars`);
          const hasChapterHref = html.includes('chapter-');
          console.log(`  [FlareSolverr] HTML contains 'chapter-': ${hasChapterHref}`);
          if (!hasChapterHref) {
            const bodyMatch = html.match(/<body[^>]*>([\s\S]{0,500})/i);
            console.log(`  [FlareSolverr] Body start: ${bodyMatch ? bodyMatch[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200) : 'no body'}`);
          }
        }
        return chapters;
      },
      fallback: (url, known) => this._quickCheckDirect(url, known),
    });
  }

  async _quickCheckDirect(url, knownChapterUrls) {
    await this.createPage();
    try {
      console.log(`  Quick check (direct fallback): ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(500, 1000);
      await this.page.waitForSelector('a[href*="chapter"]', { timeout: 10000 }).catch(() => { });

      const firstPageChapters = await extractChaptersFromDom(this.page);
      const knownUrlSet = new Set(knownChapterUrls);
      const newChapters = firstPageChapters.filter(ch => !knownUrlSet.has(ch.url));
      const latestChapter = firstPageChapters.length > 0
        ? Math.max(...firstPageChapters.map(c => c.number)) : null;

      console.log(`  Found ${firstPageChapters.length} chapters on first page, ${newChapters.length} new`);
      return { hasUpdates: newChapters.length > 0, latestChapter, newChapters, firstPageChapters };
    } finally {
      await this.closePage();
    }
  }

  // ── Get Manga Info ──

  async getMangaInfo(url) {
    await this.createPage();

    try {
      const fsUserAgent = await setupFlareSolverr(url, this.page);

      console.log(`  Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);
      await this.page.waitForSelector('a[href*="chapter"]', { timeout: 10000 }).catch(() => { });
      await this.randomDelay(500, 1000);

      // Extract title, chapter count, cover, description
      const { title, totalFromPage } = await this.page.evaluate(() => {
        const titleEl = document.querySelector('h1');
        const title = titleEl ? titleEl.textContent.trim() : 'Unknown Title';
        const showingText = document.body.innerText.match(/of\s+(\d+)\s+items/i);
        const totalFromPage = showingText ? parseInt(showingText[1]) : 0;
        return { title, totalFromPage };
      });

      console.log(`  Title: ${title}`);
      if (totalFromPage > 0) console.log(`  Total chapters from page: ${totalFromPage}`);

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
        return {
          cover: coverEl ? coverEl.src : null,
          description: descEl ? descEl.textContent.trim() : ''
        };
      });

      // Paginate and collect all chapters
      const allChapters = await paginateAndCollect(this.page, extractChaptersFromDom, {
        delayFn: () => this.randomDelay(1000, 1500),
      });

      // Deduplicate
      const { chapters, duplicateChapters, uniqueCount } = deduplicateChapters(allChapters);
      console.log(`  Found ${chapters.length} total chapters (${uniqueCount} unique, ${duplicateChapters.length} have duplicates)`);

      return {
        url, website: this.websiteName, title,
        totalChapters: totalFromPage || chapters.length,
        uniqueChapters: uniqueCount,
        chapters, duplicateChapters, cover, description
      };
    } finally {
      await this.closePage();
    }
  }

  // ── Search ──

  async search(query) {
    // Get FlareSolverr cookies ahead of time for the search page
    let fsCookies = [];
    let fsUserAgent = '';
    const searchUrl = `${BASE_URL}/browser?keyword=${encodeURIComponent(query)}&order=relevance%3Adesc&genres_mode=and`;

    try {
      console.log(`  [COMIX] Getting CF cookies via FlareSolverr...`);
      const fsResult = await fetchPage(searchUrl);
      fsCookies = toPuppeteerCookies(fsResult.cookies, DOMAIN);
      fsUserAgent = fsResult.userAgent;
      console.log(`  [COMIX] Got ${fsCookies.length} cookies from FlareSolverr`);
    } catch (error) {
      console.log(`  [COMIX] FlareSolverr failed: ${error.message}`);
    }

    try {
      return await search(this, query, {
        useCleanPage: true,
        buildSearchUrl: (q) => searchUrl,
        timeout: 60000,

        setupPage: async (page) => {
          await page.setViewport({ width: 1920, height: 1080 });
          if (fsCookies.length > 0) await page.setCookie(...fsCookies);
          if (fsUserAgent) await page.setUserAgent(fsUserAgent);

          // Strip comix.to's hardcoded default genre exclusions from API calls
          await page.setRequestInterception(true);
          page.on('request', (req) => {
            const url = req.url();
            if (url.includes('/api/') && url.includes('genres')) {
              const cleaned = url.replace(/[&?]genres(\[\])?=[^&]*/g, '');
              if (cleaned !== url) {
                console.log(`  [COMIX] Stripped genre filters from API call`);
                req.continue({ url: cleaned });
                return;
              }
            }
            req.continue();
          });
        },

        waitForResults: async (page) => {
          // Handle Cloudflare challenge page
          const pageTitle = await page.title();
          if (pageTitle.includes('moment') || pageTitle.includes('Checking')) {
            console.log(`  [COMIX] CF challenge, waiting...`);
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
            await new Promise(r => setTimeout(r, 3000));
          }

          // Wait for React to render items
          await new Promise(r => setTimeout(r, 5000));
          await page.waitForSelector('.item a.title', { timeout: 15000 }).catch(() => {});

          // Scroll to load all lazy items
          let prevCount = 0;
          let stableScrolls = 0;
          for (let i = 0; i < 20; i++) {
            const count = await page.evaluate(() => document.querySelectorAll('.item a.title').length);
            if (count > prevCount) { prevCount = count; stableScrolls = 0; }
            else { stableScrolls++; if (stableScrolls >= 4) break; }
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await new Promise(r => setTimeout(r, 500));
          }

          // Scroll for cover images: top → bottom → top
          await page.evaluate(() => window.scrollTo(0, 0));
          await new Promise(r => setTimeout(r, 500));
          await page.evaluate(async () => {
            for (let y = 0; y < document.body.scrollHeight; y += 300) {
              window.scrollTo(0, y);
              await new Promise(r => setTimeout(r, 150));
            }
            window.scrollTo(0, 0);
          });
          await new Promise(r => setTimeout(r, 2000));
        },

        extractResults: async (page) => {
          return page.evaluate(() => {
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
        },

        postProcess: async (results, page, scraper) => {
          // Parse missing items from raw HTML that React didn't render
          const pageHtml = await page.content();
          const htmlItemCount = (pageHtml.match(/class="item"/g) || []).length;
          if (htmlItemCount > results.length) {
            console.log(`  [COMIX] Parsing ${htmlItemCount - results.length} extra items from HTML...`);
            const existingUrls = new Set(results.map(r => r.url));
            const itemBlocks = pageHtml.split(/class="item"/g);
            for (let i = 1; i < itemBlocks.length; i++) {
              const block = itemBlocks[i];
              const titleMatch = block.match(/<a[^>]*class="title"[^>]*href="(\/title\/[^"]+)"[^>]*>([^<]+)<\/a>/i);
              if (!titleMatch) continue;
              const url = BASE_URL + titleMatch[1];
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
            }
          }

          // Capture cover images via Puppeteer screenshots (has CF cookies)
          const { default: fsx } = await import('fs-extra');
          const { default: pathMod } = await import('path');
          const { CONFIG } = await import('../../config.js');
          const cacheDir = pathMod.join(CONFIG.dataDir, 'covers', 'search-cache');
          await fsx.emptyDir(cacheDir);
          const ts = Date.now();

          const imgElements = await page.$$('.item .poster img');
          const domCaptured = Math.min(results.length, imgElements.length);
          for (let i = 0; i < domCaptured; i++) {
            try {
              const filePath = pathMod.join(cacheDir, `search_${i}_${ts}.jpg`);
              await imgElements[i].screenshot({ path: filePath, type: 'jpeg', quality: 85 });
              results[i].cover = `/covers/search-cache/search_${i}_${ts}.jpg`;
            } catch (e) { /* skip failed screenshots */ }
          }

          // Download covers for HTML-only items via browser fetch (has CF cookies)
          for (let i = domCaptured; i < results.length; i++) {
            if (!results[i].cover || !results[i].cover.startsWith('http')) continue;
            try {
              const base64 = await page.evaluate(async (imgUrl) => {
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
            } catch (e) { /* skip failed downloads */ }
          }

          return results;
        },
      });
    } catch (e) {
      console.error(`  [COMIX] Search failed: ${e.message}`);
      return [];
    }
  }

  // ── Chapter Images ──

  async getChapterImages(chapterUrl) {
    // Get FlareSolverr cookies first, then pass them to the feature
    let fsCookies = [];
    let fsUserAgent = '';
    try {
      const fsResult = await fetchPage(chapterUrl);
      fsCookies = toPuppeteerCookies(fsResult.cookies, DOMAIN);
      fsUserAgent = fsResult.userAgent;
    } catch (error) {
      console.log(`  FlareSolverr cookie fetch failed: ${error.message}, trying direct...`);
    }

    return extractChapterImages(this, chapterUrl, {
      setupPage: async (page) => {
        if (fsCookies.length > 0) {
          await page.setCookie(...fsCookies);
          console.log(`  Set ${fsCookies.length} cookies from FlareSolverr`);
        }
        if (fsUserAgent) await page.setUserAgent(fsUserAgent);
      },
      imgSelector: 'img.fit-w',
      fallbackSelectors: '.reader-content img, .chapter-content img, .page-container img, .reading-content img, #readerarea img, .chapter-images img, [class*="page"] img, img[src*="cdn"], img[data-src*="cdn"]',
      extractHeaders: true,
      userAgent: fsUserAgent,
    });
  }
}

export default ComixScraper;
