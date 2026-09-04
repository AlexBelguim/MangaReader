import { BaseScraper } from '../base.js';
import { deduplicateChapters } from '../util/chapters.js';
import { quickCheck } from '../features/quick-check.js';
import { getCached, setCache } from '../features/browse.js';

/**
 * Scraper for weebcentral.com
 *
 * The site is server-rendered with HTMX: everything dynamic is a plain HTML
 * fragment behind a GET, and Cloudflare hands those fragments to a plain
 * Node fetch carrying a browser User-Agent (no interstitial, no cookies).
 * So no puppeteer page is opened here at all:
 *
 *   series page ....... /series/<ID>[/<slug>]          title, cover, description, newest chapters
 *   full chapter list . /series/<ID>/full-chapter-list  every chapter, newest first
 *   chapter pages ..... /chapters/<ID>/images?reading_style=long_strip
 *   search / catalog .. /search/data?text=..&sort=..&limit=32&offset=..
 *
 * Unknown IDs redirect to /404, which fetch follows into a non-OK response.
 */

const BASE_URL = 'https://weebcentral.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const PAGE_SIZE = 32;                         // the site's own page size
const BROWSE_CACHE_TTL = 3 * 60 * 60 * 1000;  // 3 hours

// The site's own sort names (radio values of its search form). Alphabet is
// the one sort that reads naturally ascending; every other one descending.
const SORTS = [
  { value: 'Popularity', label: 'Most popular' },
  { value: 'Subscribers', label: 'Most subscribed' },
  { value: 'Latest Updates', label: 'Latest updates' },
  { value: 'Recently Added', label: 'Recently added' },
  { value: 'Alphabet', label: 'A to Z' },
  { value: 'Best Match', label: 'Best match' },
];

// ─── Fetching ────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 60000;

async function fetchHtml(url, signal) {
  // Bounded either way: a stalled edge must not hold an auto-check or an
  // "add manga" request for undici's five-minute default.
  const timeout = AbortSignal.timeout(FETCH_TIMEOUT_MS);
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, 'Accept': 'text/html,*/*;q=0.8' },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) throw new Error(`weebcentral.com answered HTTP ${response.status} for ${url}`);
  // Unknown IDs redirect to a /404 page that itself answers 200.
  if (response.redirected && new URL(response.url).pathname === '/404') {
    throw new Error(`weebcentral.com does not know ${url} (redirected to /404)`);
  }
  return response.text();
}

function seriesIdFrom(url) {
  const match = url.match(/\/series\/([A-Z0-9]+)/i);
  if (!match) throw new Error(`Not a weebcentral.com series URL: ${url}`);
  return match[1];
}

function chapterIdFrom(url) {
  const match = url.match(/\/chapters\/([A-Z0-9]+)/i);
  if (!match) throw new Error(`Not a weebcentral.com chapter URL: ${url}`);
  return match[1];
}

// ─── HTML helpers ────────────────────────────────────────────────────

// Fragments carry text HTML-escaped (&amp;, &#39;, &#34;, ...).
const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, body) => {
    if (body[0] !== '#') return NAMED_ENTITIES[body.toLowerCase()] ?? entity;
    const code = /^#x/i.test(body) ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
    return Number.isFinite(code) ? String.fromCodePoint(code) : entity;
  });
}

// Tags out, entities decoded, whitespace collapsed.
function cleanText(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

// Chapter names are "<kind> <number>": "Chapter 12", "Chapter 12.5",
// "S2 - Chapter 7", "Prologue 3", "Punch 100". The last number in the name
// is the chapter number; the kind stays in the title, which the reader
// shows whenever the title is not the plain "Chapter N". A name without a
// number (a lone "Oneshot") gets 0, as mangahere does for its specials.
function chapterNumberFrom(name) {
  const match = name.match(/(\d+(?:\.\d+)?)(?!.*\d)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Chapter rows, in the site's order (newest first), from a series page or
 * the full-chapter-list fragment. A row is an anchor to /chapters/<ID>
 * whose name sits in an unstyled <span class="">.
 */
function parseChapterRows(html) {
  const chapters = [];
  for (const [, id, inner] of html.matchAll(/<a href="\/chapters\/([A-Z0-9]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const nameMatch = inner.match(/<span class="">\s*([^<]*?)\s*<\/span>/);
    if (!nameMatch) continue;
    const title = decodeEntities(nameMatch[1]);
    chapters.push({ number: chapterNumberFrom(title), title, url: `${BASE_URL}/chapters/${id}` });
  }
  return chapters;
}

/**
 * Result cards from a search/data fragment. Each card is a top-level
 * <article class="bg-base-300 ..."> holding one series link, the cover as
 * a <picture> whose <img> is the universally loadable jpg fallback, and
 * (in "Full Display") the title as a line-clamp link.
 */
function parseSeriesCards(html) {
  const results = [];
  for (const card of html.split('<article class="bg-base-300').slice(1)) {
    const url = (card.match(/href="(https:\/\/weebcentral\.com\/series\/[^"]+)"/) || [])[1];
    if (!url) continue;
    const title = (card.match(/class="line-clamp-1 link link-hover"[^>]*>([^<]*)<\/a>/) || [])[1]
      || (card.match(/alt="([^"]*) cover"/) || [])[1] || '';
    const cover = (card.match(/<img src="(https?:\/\/[^"]+)"/) || [])[1] || null;
    // The cards carry status, year and tags but no chapter count.
    results.push({ title: cleanText(title) || 'Unknown', url, cover, chapterCount: 0 });
  }
  return results;
}

function buildSearchUrl(sort, page, query) {
  const params = new URLSearchParams({
    author: '',
    text: query,
    sort,
    order: sort === 'Alphabet' ? 'Ascending' : 'Descending',
    official: 'Any', anime: 'Any', adult: 'Any',
    display_mode: 'Full Display',
    limit: String(PAGE_SIZE),
    offset: String((page - 1) * PAGE_SIZE),
  });
  return `${BASE_URL}/search/data?${params}`;
}

// ─── Scraper ─────────────────────────────────────────────────────────

export class WeebCentralScraper extends BaseScraper {
  get websiteName() { return 'weebcentral.com'; }
  get urlPatterns() { return ['weebcentral.com']; }
  get supportsQuickCheck() { return true; }
  get supportsSearch() { return true; }
  get supportsBrowse() { return true; }

  get browseOptions() {
    return {
      sorts: SORTS,
      defaultSort: 'Popularity',
      defaultQuery: '',
      queryLabel: 'Search',
      queryPlaceholder: 'Optional: title to search for',
    };
  }

  // ── Get Manga Info ──

  async getMangaInfo(url) {
    const id = seriesIdFrom(url);
    // The ID alone resolves the series; the slug in the URL is decorative.
    const seriesUrl = `${BASE_URL}/series/${id}`;
    console.log(`  [WeebCentral] Fetching series: ${seriesUrl}`);
    const pageHtml = await fetchHtml(seriesUrl);

    const title = cleanText((pageHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1] || '')
      || cleanText((pageHtml.match(/<title>(.*?)\s*\|\s*Weeb Central<\/title>/) || [])[1] || '')
      || 'Unknown Title';
    const cover = (pageHtml.match(/property="og:image" content="(https?:\/\/[^"]+)"/) || [])[1] || null;
    const description = cleanText((pageHtml.match(/<strong>Description<\/strong>\s*<p[^>]*>([\s\S]*?)<\/p>/) || [])[1] || '');

    // The page inlines only a handful of chapters; the full list is its
    // own fragment (the "Show All Chapters" button loads it).
    await this.randomDelay(300, 800);
    const allChapters = parseChapterRows(await fetchHtml(`${seriesUrl}/full-chapter-list`));
    if (allChapters.length === 0) throw new Error(`weebcentral.com: no chapters found for ${seriesUrl}`);

    const { chapters, duplicateChapters, uniqueCount } = deduplicateChapters(allChapters);
    console.log(`  [WeebCentral] ${title}: ${chapters.length} chapters (${uniqueCount} unique, ${duplicateChapters.length} have duplicates)`);

    return {
      url, website: this.websiteName, title,
      totalChapters: chapters.length, uniqueChapters: uniqueCount,
      chapters, duplicateChapters, cover, description,
    };
  }

  // ── Quick Check ──

  // The series page (a few dozen KB) inlines the newest six chapters and the
  // oldest three. When every one of them is already known nothing is new and
  // that is the whole check. When something on it is unknown, more than six
  // chapters may be missing, so the full list is fetched instead: the caller
  // adds `newChapters` straight to the library, so it has to be complete.
  async quickCheckUpdates(url, knownChapterUrls = []) {
    const seriesUrl = `${BASE_URL}/series/${seriesIdFrom(url)}`;
    console.log(`  [WeebCentral] Quick check: ${seriesUrl}`);
    const knownUrlSet = new Set(knownChapterUrls);

    return quickCheck(url, knownChapterUrls, {
      fetchChapters: async () => {
        const inline = parseChapterRows(await fetchHtml(seriesUrl));
        if (inline.length === 0) throw new Error(`weebcentral.com: no chapters found for ${seriesUrl}`);
        if (inline.every(ch => knownUrlSet.has(ch.url))) return inline;

        await this.randomDelay(300, 800);
        const all = parseChapterRows(await fetchHtml(`${seriesUrl}/full-chapter-list`));
        return all.length > 0 ? all : inline;
      },
    });
  }

  // ── Search ──

  // Relevance-sorted first page of the same endpoint browse uses.
  async search(query) {
    const { results } = await this.browse('Best Match', 1, query);
    return results;
  }

  // ── Browse ──

  async browse(sort = 'Popularity', page = 1, query = '', refresh = false, options = {}) {
    if (!refresh) {
      const cached = getCached(this.websiteName, sort, page, query, BROWSE_CACHE_TTL);
      if (cached) return cached;
    }

    const browseUrl = buildSearchUrl(sort, page, query);
    console.log(`  [WeebCentral] Browse: ${browseUrl}`);
    const html = await fetchHtml(browseUrl, options.signal);

    const results = parseSeriesCards(html).map(r => ({ ...r, website: this.websiteName }));
    // The site pages by offset and never says how many results there are;
    // it only appends a "View More Results..." button while another page
    // exists. So the total is a running estimate: one page beyond this one
    // while that button is present, this page once it is gone.
    const totalPages = /View More Results/.test(html) ? page + 1 : page;
    console.log(`  [WeebCentral] Found ${results.length} results on page ${page}`);

    const result = { results, totalPages, currentPage: page };
    setCache(this.websiteName, sort, page, query, result);
    return result;
  }

  // ── Chapter Images ──

  async getChapterImages(chapterUrl) {
    const id = chapterIdFrom(chapterUrl);
    // Same request the reader makes; the long-strip style is the one that
    // lists every page in a single fragment.
    const imagesUrl = `${BASE_URL}/chapters/${id}/images?is_prev=False&current_page=1&reading_style=long_strip`;
    console.log(`  [WeebCentral] Fetching chapter pages: ${imagesUrl}`);
    const html = await fetchHtml(imagesUrl);

    const section = (html.match(/<section\s[^>]*id="chapter-images"[^>]*>([\s\S]*?)<\/section>/) || [])[1];
    if (!section) throw new Error(`weebcentral.com: no reader section in the pages fragment for ${chapterUrl}`);

    const images = [];
    for (const [tag] of section.matchAll(/<img\b[^>]*>/g)) {
      const src = (tag.match(/\ssrc="(https?:\/\/[^"]+)"/) || [])[1];
      if (src) images.push({ index: images.length + 1, url: decodeEntities(src) });
    }
    if (images.length === 0) throw new Error(`weebcentral.com: no pages found for ${chapterUrl}`);
    console.log(`  [WeebCentral] Found ${images.length} images`);

    // The image CDN serves hotlinks today; sending the chapter page as
    // Referer keeps downloads looking like the reader should that change.
    return images.map(img => ({ ...img, headers: { 'Referer': chapterUrl } }));
  }
}

export default WeebCentralScraper;
