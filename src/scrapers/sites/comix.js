import { BaseScraper } from '../base.js';
import { fetchPage, toPuppeteerCookies } from '../util/flaresolverr.js';
import { deduplicateChapters } from '../util/chapters.js';
import { extractChapterImages } from '../features/chapter-images.js';
import { search } from '../features/search.js';

const DOMAIN = '.comix.to';
const BASE_URL = 'https://comix.to';

// ─── HTML Parsing Helpers ────────────────────────────────────────────

/**
 * Puppeteer page.evaluate function to extract chapters from the rendered
 * chapter list (`ul.mchap-list`). Each row links to a specific chapter
 * version; a manga number can appear multiple times (one per scan group).
 */
async function extractChaptersFromDom(page) {
  return page.evaluate(() => {
    const chapters = [];
    // Scope to the chapter list so we never pick up "Start reading"/related
    // links elsewhere on the page; fall back to the whole document just in case.
    const list = document.querySelector('ul.mchap-list');
    const links = (list || document).querySelectorAll('a[href*="chapter-"]');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const numMatch = href.match(/chapter-(\d+(?:\.\d+)?)/i);
      if (!numMatch) return;

      const row = link.closest('.mchap-row') || link.parentElement;
      const titleEl = link.querySelector('.mchap-row__title');
      const title = titleEl && titleEl.textContent.trim()
        ? titleEl.textContent.trim()
        : (link.textContent.trim() || `Chapter ${numMatch[1]}`);
      const groupEl = row ? row.querySelector('.mchap-row__group') : null;
      const releaseGroup = groupEl ? groupEl.textContent.trim() : '';
      const timeEl = row ? (row.querySelector('time') || row.querySelector('.mchap-row__time')) : null;
      const uploadedAt = timeEl ? timeEl.textContent.trim() : '';

      chapters.push({
        number: parseFloat(numMatch[1]),
        title,
        url: href.startsWith('http') ? href : window.location.origin + href,
        releaseGroup,
        uploadedAt
      });
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

  // Refresh path. Walks the chapter list page-by-page (newest first) and stops
  // as soon as it reaches a page where every chapter is already known — so a
  // manga with many new chapters spread across several pages is fully covered,
  // while an up-to-date manga still only loads page one.
  async quickCheckUpdates(url, knownChapterUrls = []) {
    console.log(`  Quick check (paginated): ${url}`);
    const knownUrlSet = new Set(knownChapterUrls);

    await this.createPage();
    try {
      await setupFlareSolverr(url, this.page);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(500, 1000);
      await this.page.waitForSelector('ul.mchap-list a[href*="chapter-"]', { timeout: 15000 }).catch(() => { });

      const allChapters = await this.collectChaptersByPaging({
        // Chapters are listed newest-first, so once a whole page is already
        // known every later page is known too — safe to stop early.
        stopWhen: (pageChapters) =>
          pageChapters.length > 0 && pageChapters.every(ch => knownUrlSet.has(ch.url)),
      });

      const newChapters = allChapters.filter(ch => !knownUrlSet.has(ch.url));
      const latestChapter = allChapters.length > 0
        ? Math.max(...allChapters.map(c => c.number)) : null;

      console.log(`  Found ${allChapters.length} chapters across pages, ${newChapters.length} new`);
      return { hasUpdates: newChapters.length > 0, latestChapter, newChapters, firstPageChapters: allChapters };
    } finally {
      await this.closePage();
    }
  }

  /**
   * Walk the chapter list page-by-page using the site's button-based pager
   * (`nav.npager`). Collects chapters from every page until the "Next page"
   * button disappears (last page reached) or `stopWhen(pageChapters, all)`
   * returns true. Requires `this.page` to already be on a manga title page.
   */
  async collectChaptersByPaging({ stopWhen = null, maxPages = 100 } = {}) {
    const LIST_SEL = 'ul.mchap-list a[href*="chapter-"]';
    let all = [];
    let prevFirstHref = null;

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      await this.page.waitForSelector(LIST_SEL, { timeout: 15000 }).catch(() => { });

      const beforeHref = await this.page.evaluate(
        (sel) => document.querySelector(sel)?.getAttribute('href') || null, LIST_SEL
      );

      // Safety: if the list didn't change after a click, stop to avoid looping.
      if (prevFirstHref !== null && beforeHref === prevFirstHref) {
        console.log(`  [COMIX] Page ${pageNum} unchanged, stopping pagination`);
        break;
      }
      prevFirstHref = beforeHref;

      const pageChapters = await extractChaptersFromDom(this.page);
      all = all.concat(pageChapters);
      console.log(`  [COMIX] Page ${pageNum}: ${pageChapters.length} chapters (total ${all.length})`);

      if (stopWhen && stopWhen(pageChapters, all)) {
        console.log(`  [COMIX] Stop condition met after page ${pageNum}`);
        break;
      }

      // Advance via the "Next page" button; it is removed from the DOM on the
      // last page, which is our signal to stop.
      const advanced = await this.page.evaluate(() => {
        const btn = document.querySelector('nav.npager button[aria-label="Next page"]');
        if (!btn || btn.disabled) return false;
        btn.click();
        return true;
      });
      if (!advanced) {
        console.log(`  [COMIX] No more pages after page ${pageNum}`);
        break;
      }

      // Wait for the list to re-render (first chapter link changes).
      await this.page.waitForFunction((b) => {
        const el = document.querySelector('ul.mchap-list a[href*="chapter-"]');
        return el && el.getAttribute('href') !== b;
      }, { timeout: 10000 }, beforeHref).catch(() => { });
      await this.randomDelay(300, 600);
    }

    return all;
  }

  // ── Get Manga Info ──

  async getMangaInfo(url) {
    await this.createPage();

    try {
      const fsUserAgent = await setupFlareSolverr(url, this.page);

      console.log(`  Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.randomDelay(1000, 2000);
      await this.page.waitForSelector('ul.mchap-list a[href*="chapter-"]', { timeout: 15000 }).catch(() => { });
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

      // Paginate through the chapter list and collect every chapter
      const allChapters = await this.collectChaptersByPaging();

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
    // Get FlareSolverr cookies first using the lightweight homepage to avoid double-loading chapter pages
    let fsCookies = [];
    let fsUserAgent = '';
    try {
      console.log(`  [COMIX] Fetching homepage via FlareSolverr to get Cloudflare cookies...`);
      const fsResult = await fetchPage(BASE_URL);
      fsCookies = toPuppeteerCookies(fsResult.cookies, DOMAIN);
      fsUserAgent = fsResult.userAgent;
    } catch (error) {
      console.log(`  FlareSolverr cookie fetch failed: ${error.message}, trying direct...`);
    }

    await this.createPageClean();

    // Bypasses canvas anti-scraping monkey-patches by saving pristine toDataURL reference
    await this.page.evaluateOnNewDocument(() => {
      window.__cleanToDataURL = HTMLCanvasElement.prototype.toDataURL;
    });

    if (fsCookies.length > 0) {
      await this.page.setCookie(...fsCookies);
      console.log(`  Set ${fsCookies.length} cookies from FlareSolverr`);
    }
    if (fsUserAgent) await this.page.setUserAgent(fsUserAgent);

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

      // Wait for mode-specific interactive elements to fully render
      await this.page.waitForFunction(() => {
        const isLongStrip = document.querySelector('main.rpage-main--long-strip') || 
                           (document.querySelector('.rpage-settings__panel') && 
                            /STRIP MARGIN/i.test(document.querySelector('.rpage-settings__panel').textContent));
        if (isLongStrip) {
          return document.querySelectorAll('img.rpage-page__img').length > 0 || 
                 document.querySelector('main.rpage-main');
        } else {
          return document.querySelectorAll('.rpage-progress__seg').length > 0;
        }
      }, { timeout: 15000 }).catch((e) => {
        console.warn(`  [COMIX] Wait for reader elements timed out: ${e.message}`);
      });

      // Brief settle time
      await new Promise(r => setTimeout(r, 1000));

      // Detect reader mode with maximum robustness (using textContent, class checks, and #initial-data JSON parsing)
      const isLongStrip = await this.page.evaluate(() => {
        const main = document.querySelector('main.rpage-main');
        if (main && main.classList.contains('rpage-main--long-strip')) return true;
        const panel = document.querySelector('.rpage-settings__panel');
        if (panel && /STRIP MARGIN/i.test(panel.textContent)) return true;
        
        const el = document.querySelector('#initial-data');
        if (el) {
          try {
            const data = JSON.parse(el.textContent);
            const queries = data.queries || {};
            for (const key of Object.keys(queries)) {
              const val = queries[key];
              if (val && val.type) return val.type !== 'manga'; // manhwa/manhua = webtoon/strip
            }
          } catch(e) {}
        }
        return false;
      });

      console.log(`  Reader mode: ${isLongStrip ? 'long-strip (webtoon)' : 'paged (manga)'}`);

      // Walk through the chapter to extract every image/canvas
      let images = [];
      if (isLongStrip) {
        images = await this.walkLongStrip();
      } else {
        images = await this.walkPagedReader();
      }

      console.log(`  Found ${images.length} images (DOM & Canvas-borrowed extraction)`);

      // Extract headers for authenticated downloads
      const cookies = await this.page.cookies();
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const ua = fsUserAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

      return images.map(img => ({
        ...img,
        headers: {
          'Cookie': cookieString,
          'Referer': chapterUrl,
          'User-Agent': ua
        }
      }));

    } finally {
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

  /**
   * Try to dismiss any popup/dialog that blocks the reader.
   * Clicks the "Got it" button on `.rpage-hint` and the "Close settings" button.
   * Also force-hides all modal/settings panel overlays via direct DOM style injections to prevent blocking clicks.
   */
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
      const closeSettings = document.querySelector('button[aria-label="Close settings"]') 
                         || document.querySelector('.rpage-settings__close');
      if (closeSettings) {
        closeSettings.click();
        actions.push('settings-closed-via-btn');
      } else {
        const panel = document.querySelector('.rpage-settings__panel');
        if (panel && getComputedStyle(panel).display !== 'none') {
          const settingsBtn = document.querySelector('button[aria-label="Settings"]') 
                           || document.querySelector('.rpage-bottombar__settings');
          if (settingsBtn) {
            settingsBtn.click();
            actions.push('settings-closed-via-toggle');
          }
        }
      }
      // Force hide overlays
      const selectors = ['.rpage-hint', '.rpage-settings__panel', '.modal', '[class*="overlay"]', '[class*="backdrop"]'];
      selectors.forEach(sel => {
        const els = document.querySelectorAll(sel);
        els.forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        });
      });

      // Inject CSS style block to permanently hide all overlays and disable their mouse interactions
      const style = document.createElement('style');
      style.innerHTML = `
        .rpage-hint, .rpage-settings__panel, .modal, [class*="overlay"], [class*="backdrop"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
      return actions;
    });
    if (result.length) console.log(`  [COMIX] Dismissed: ${result.join(', ')}`);
    await new Promise(r => setTimeout(r, 500));
  }

  // The long-strip reader lazy-mounts page <img> tags around the current
  // scroll position, and hijacks scrolling with smooth scroll-behavior /
  // scroll-snap so naive scrollTop writes never advance. Working approach:
  // kill smooth scrolling and snapping, then walk the page wrappers in order —
  // scrollIntoView({behavior:'instant'}) each one and wait for its image to
  // mount and finish loading before capturing it.
  async walkLongStrip() {
    console.log('  Walking long-strip (webtoon) reader with per-page capture...');

    await this.page.evaluate(() => {
      for (const el of [document.documentElement, document.body,
        ...document.querySelectorAll('main, [class*="rpage"]')]) {
        if (!el || !el.style) continue;
        el.style.scrollBehavior = 'auto';
        el.style.scrollSnapType = 'none';
      }

      // In-page helper: extract wrapper n's loaded image URL / painted canvas.
      // requireLoaded=true only accepts a fully loaded img (used before deciding
      // whether scrolling is needed); false accepts any real src.
      window.__comixExtractPage = (n, requireLoaded) => {
        const w = document.querySelector(`.rpage-page[data-page="${n}"]`);
        if (!w) return null;
        const canvas = w.querySelector('canvas');
        if (canvas && canvas.width > 100) {
          try {
            const fn = window.__cleanToDataURL || HTMLCanvasElement.prototype.toDataURL;
            return fn.call(canvas, 'image/png');
          } catch (e) { /* tainted — fall through to img */ }
        }
        const img = w.querySelector('img');
        if (img && img.src && !img.src.startsWith('data:image/svg')) {
          if (!requireLoaded || (img.complete && img.naturalWidth > 100)) return img.src;
        }
        return null;
      };
    });

    const totalPages = await this.page.evaluate(
      () => document.querySelectorAll('.rpage-page').length
    );
    console.log(`  Long-strip: ${totalPages} pages`);

    const captured = new Map(); // data-page (int) -> image url

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // Already loaded from a previous page's prefetch? Capture without scrolling.
      let url = await this.page.evaluate(
        (n) => window.__comixExtractPage(n, true), pageNum
      );

      if (!url) {
        // Bring the wrapper into view so the reader mounts + loads its image.
        await this.page.evaluate((n) => {
          const w = document.querySelector(`.rpage-page[data-page="${n}"]`);
          if (w) w.scrollIntoView({ block: 'center', behavior: 'instant' });
        }, pageNum);

        // Poll until the image finishes loading (or canvas is painted).
        await this.page.waitForFunction((n) => {
          const w = document.querySelector(`.rpage-page[data-page="${n}"]`);
          if (!w) return false;
          const canvas = w.querySelector('canvas');
          if (canvas && canvas.width > 100) return true;
          const img = w.querySelector('img');
          return !!(img && img.complete && img.naturalWidth > 100 && img.src && !img.src.startsWith('data:image/svg'));
        }, { timeout: 15000, polling: 300 }, pageNum).catch(() => { });

        url = await this.page.evaluate(
          (n) => window.__comixExtractPage(n, false), pageNum
        );
      }

      if (url) {
        captured.set(pageNum, url);
      } else {
        console.warn(`  Page ${pageNum}: no image captured`);
      }
    }

    const images = [...captured.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, url], i) => ({ index: i + 1, url }));

    console.log(`  Long-strip: captured ${images.length} pages total`);
    return images;
  }

  // Paged manga: click through Swiper progress segment buttons in order, extracting img or painted canvas
  async walkPagedReader() {
    const totalPages = await this.page.evaluate(
      () => document.querySelectorAll('.rpage-progress__seg').length
    );
    console.log(`  Paged reader: ${totalPages} pages`);
    if (totalPages === 0) return [];

    const images = [];

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

      // Wait for image/canvas to load and paint
      await this.page.waitForFunction((n) => {
        const slide = document.querySelector('.swiper-slide-active');
        if (!slide) return false;
        const canvas = slide.querySelector('canvas');
        if (canvas && canvas.width > 100) return true;
        const img = slide.querySelector('img');
        return img && img.complete && img.naturalWidth > 100;
      }, { timeout: 8000 }, pageNum).catch(() => {});

      // Settle time for painting
      await new Promise(r => setTimeout(r, 200));

      // Extract image/canvas data
      const pageResult = await this.page.evaluate((n) => {
        const slide = document.querySelector('.swiper-slide-active');
        if (!slide) return null;

        const canvas = slide.querySelector('canvas');
        if (canvas) {
          try {
            const cleanToDataURL = window.__cleanToDataURL || canvas.toDataURL;
            return {
              index: n,
              url: cleanToDataURL.call(canvas, 'image/png')
            };
          } catch (e) {
            console.error('Canvas extraction failed:', e);
          }
        }

        const img = slide.querySelector('img');
        if (img) {
          return {
            index: n,
            url: img.src
          };
        }

        return null;
      }, pageNum);

      if (pageResult) {
        images.push(pageResult);
      } else {
        console.warn(`  Page ${pageNum}: extraction returned null`);
      }
    }

    return images;
  }
}

export default ComixScraper;
