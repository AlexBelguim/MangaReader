import { BaseScraper } from '../base.js';
import { fetchPage, toPuppeteerCookies } from '../util/flaresolverr.js';
import { deduplicateChapters } from '../util/chapters.js';
import { extractChapterImages } from '../features/chapter-images.js';
import { search } from '../features/search.js';
import { reportChallenge, clearChallenge, isChallengeError } from '../util/challenge.js';
import { applySiteSession, refreshSiteSession, cookieDomainMatchesSite } from '../util/site-session.js';
import { waitForCloudflare } from '../util/cloudflare.js';

const SITE = 'comix.to';
const CHALLENGE_PATH = '/@waf/challenge';

// comix.to answers automated traffic with its own "Verify you're human"
// puzzle at /@waf/challenge (a redirect from whatever page was requested).
// Nothing here can solve it; detect it, record it, and fail with a message
// that says what to do instead of reporting "no chapters" or "no pages".
function isChallengeUrl(url) {
  return !!url && url.includes(CHALLENGE_PATH);
}

// `usedSession`: the page was carrying the user's handed-over cookies, so
// the check showing up means the site stopped accepting them.
function throwIfChallenge(url, usedSession = false) {
  if (isChallengeUrl(url)) throw reportChallenge(SITE, url, { usedSession });
}

const CF_TITLE_RE = /just a moment|checking your browser|even geduld/i;

const DOMAIN = '.comix.to';
const BASE_URL = 'https://comix.to';
const DEFAULT_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

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

// ─── Page setup: saved session + FlareSolverr ────────────────────────

/**
 * Get a Puppeteer page ready to load comix.to.
 *
 * With a saved session (cookies + user agent from the browser the user
 * completed the site's human check in) the page presents exactly that:
 * same cookies, same identity, nothing else. Both the site's own check and
 * Cloudflare tie their cookies to the browser identity, so FlareSolverr's
 * cookies and user agent would only get in the way - it is skipped. Without
 * a session, FlareSolverr supplies Cloudflare clearance as before, and the
 * human check showing up there is reported straight away.
 *
 * @returns {Promise<{ userAgent: string, session: object|null }>}
 *   the user agent the page now carries (needed for image download headers)
 */
async function prepareComixPage(url, page) {
  const session = await applySiteSession(page, SITE);
  if (session) return { userAgent: session.userAgent || '', session };

  let userAgent = '';
  try {
    console.log(`  [COMIX] Getting FlareSolverr cookies...`);
    const fsResult = await fetchPage(url);
    throwIfChallenge(fsResult.url);
    const fsCookies = toPuppeteerCookies(fsResult.cookies, DOMAIN);
    if (fsCookies.length > 0) {
      await page.setCookie(...fsCookies);
      console.log(`  [COMIX] Set ${fsCookies.length} cookies from FlareSolverr`);
    }
    if (fsResult.userAgent) {
      await page.setUserAgent(fsResult.userAgent);
      userAgent = fsResult.userAgent;
    }
  } catch (error) {
    if (isChallengeError(error)) throw error;
    console.log(`  [COMIX] FlareSolverr failed: ${error.message}, continuing without its cookies...`);
  }
  return { userAgent, session: null };
}

/**
 * After a navigation: give a Cloudflare interstitial (which the stealth
 * browser usually passes on its own) a moment, then fail clearly if the
 * page is still that interstitial or is the site's human check. Scraping
 * an interstitial would otherwise "succeed" with no chapters or pages.
 */
async function settleLanding(page, session = null) {
  const title = await page.title().catch(() => '');
  if (CF_TITLE_RE.test(title)) {
    const passed = await waitForCloudflare(page, { maxWait: 30000 });
    if (!passed) {
      throw new Error(session
        ? 'comix.to: the Cloudflare check did not clear in the headless browser while it was using the saved cookies (FlareSolverr is skipped then). Complete the check in your browser again and paste cookies exported right after it, or forget the saved session on the Scrapers page.'
        : 'comix.to: the Cloudflare check did not clear in the headless browser.');
    }
  }
  throwIfChallenge(page.url(), !!session);
}

/**
 * A page load got real content: the site is not blocking us. Lift any
 * recorded block and, when a saved session is in use, keep whatever
 * cookies the site rotated so it stays valid.
 */
async function noteAccessOk(page, session) {
  clearChallenge(SITE);
  if (!session) return;
  try {
    refreshSiteSession(SITE, await page.cookies());
  } catch (e) {
    console.warn(`  [COMIX] Could not refresh saved session: ${e.message}`);
  }
}

// ─── Scraper ─────────────────────────────────────────────────────────

export class ComixScraper extends BaseScraper {
  get websiteName() { return 'comix.to'; }
  get urlPatterns() { return ['comix.to']; }
  get supportsQuickCheck() { return true; }
  get supportsSearch() { return true; }
  get supportsSession() { return true; }
  get siteUrl() { return `${BASE_URL}/`; }
  // `waf_pass` is what /@waf/challenge hands out (about a day); the site
  // is trusted exactly as long as it lives.
  get sessionCookieNames() { return ['waf_pass']; }
  isChallengeUrl(url) { return isChallengeUrl(url); }

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
      const { session } = await prepareComixPage(url, this.page);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await settleLanding(this.page, session);
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
      if (allChapters.length > 0) await noteAccessOk(this.page, session);
      return { hasUpdates: newChapters.length > 0, latestChapter, newChapters, firstPageChapters: allChapters };
    } finally {
      await this.closePage();
    }
  }

  /**
   * Can the headless browser reach comix.to right now (with the saved
   * session, if any)? Used right after the user hands cookies over, to tell
   * them whether the site accepted them. Loads the lightweight home page
   * only. Three outcomes: `ok` (real content), `blocked` (redirected to the
   * human check: the cookies are not accepted), or neither with `error`
   * (the site could not be loaded or answered with an error, so nothing is
   * known about the cookies yet).
   * @returns {Promise<{ ok: boolean, blocked: boolean, finalUrl: string, status?: number, error?: string }>}
   */
  async checkAccess() {
    const page = await this.browser.newPage();
    try {
      await page.setUserAgent(DEFAULT_UA);
      const session = await applySiteSession(page, SITE);
      const response = await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // The block is a server-side redirect; a Cloudflare interstitial in
      // between needs a moment to clear.
      let cfPassed = true;
      const title = await page.title().catch(() => '');
      if (CF_TITLE_RE.test(title)) cfPassed = await waitForCloudflare(page, { maxWait: 30000 });

      const finalUrl = page.url();
      const blocked = isChallengeUrl(finalUrl);
      const status = response ? response.status() : undefined;
      let error;
      if (!blocked && !cfPassed) error = 'The Cloudflare check did not clear in the headless browser';
      else if (!blocked && status !== undefined && status >= 400) error = `The site answered HTTP ${status}`;
      const ok = !blocked && !error;

      if (ok) await noteAccessOk(page, session);
      console.log(`  [COMIX] Access check: ${ok ? 'reachable' : blocked ? 'blocked by the human check' : `not testable (${error})`} (${finalUrl})`);
      return { ok, blocked, finalUrl, status, error };
    } catch (error) {
      console.warn(`  [COMIX] Access check failed: ${error.message}`);
      return { ok: false, blocked: false, finalUrl: '', error: error.message };
    } finally {
      await page.close().catch(() => { });
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
      const { session } = await prepareComixPage(url, this.page);

      console.log(`  Navigating to: ${url}`);
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await settleLanding(this.page, session);
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
      if (chapters.length > 0) await noteAccessOk(this.page, session);

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
    const searchUrl = `${BASE_URL}/browser?keyword=${encodeURIComponent(query)}&order=relevance%3Adesc&genres_mode=and`;
    let session = null; // set in setupPage, read in waitForResults

    try {
      return await search(this, query, {
        useCleanPage: true,
        buildSearchUrl: (q) => searchUrl,
        timeout: 60000,

        setupPage: async (page) => {
          await page.setViewport({ width: 1920, height: 1080 });
          // Saved session, or FlareSolverr cookies. A human check reported
          // here ends the search with the same clear error as elsewhere.
          ({ session } = await prepareComixPage(searchUrl, page));

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
          // Cloudflare interstitial (waits, then fails if it never clears)
          // and the site's human check, same handling as the other flows.
          await settleLanding(page, session);

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
      // A human check is not "no results": let the caller show it.
      if (isChallengeError(e)) throw e;
      console.error(`  [COMIX] Search failed: ${e.message}`);
      return [];
    }
  }

  // ── Chapter Images ──

  async getChapterImages(chapterUrl) {
    await this.createPageClean();

    // Bypasses canvas anti-scraping monkey-patches by saving pristine toDataURL reference
    await this.page.evaluateOnNewDocument(() => {
      window.__cleanToDataURL = HTMLCanvasElement.prototype.toDataURL;
    });

    let session = null;
    let userAgent = '';
    try {
      // Cookies/identity first. FlareSolverr fetches the lightweight home
      // page rather than the chapter, to avoid loading the reader twice.
      ({ session, userAgent } = await prepareComixPage(BASE_URL, this.page));

      console.log(`  Loading chapter: ${chapterUrl}`);
      await this.page.goto(chapterUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });
      await settleLanding(this.page, session);

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
      if (images.length > 0) await noteAccessOk(this.page, session);

      // Extract headers for authenticated downloads - the same cookies and
      // identity the page used, so image requests look like the same browser.
      // Cookies only go to comix.to hosts, as a browser would do; an image
      // host elsewhere never sees them.
      const cookies = await this.page.cookies();
      const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
      const ua = userAgent || DEFAULT_UA;
      const isSiteHost = (imgUrl) => {
        try { return cookieDomainMatchesSite(new URL(imgUrl).hostname, SITE); } catch (e) { return false; }
      };

      return images.map(img => {
        const headers = { 'Referer': chapterUrl, 'User-Agent': ua };
        if (cookieString && isSiteHost(img.url)) headers['Cookie'] = cookieString;
        return { ...img, headers };
      });

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
