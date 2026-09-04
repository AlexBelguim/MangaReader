/**
 * Saved site sessions.
 *
 * When a site (comix.to) stops serving pages to automated browsers and shows
 * a human-verification puzzle instead, the user completes it in their own
 * browser. The site then trusts THAT browser: a cookie it set, presented by
 * the same identity (user agent). Nothing in this app can read another
 * browser's cookies for another origin, so the user hands them over by
 * pasting an export; this module keeps them, gives them to the headless
 * scraper pages (cookies + user agent), and keeps them fresh when the site
 * rotates them during a successful scrape. FlareSolverr is bypassed while a
 * session exists: its own browser identity would not match the cookies.
 *
 * Cookie values are stored in plain text in DATA_DIR/site-sessions.json and
 * are never sent back to the UI - only names, counts and timestamps are.
 */

import path from 'path';
import fs from 'fs-extra';
import { emitToAll } from '../../services/socketService.js';
import { CONFIG } from '../../config.js';

const STATE_FILE = path.join(CONFIG.dataDir, 'site-sessions.json');

export const SITE_SESSION_EVENT = 'site:session';

// Longest user agent we accept from the client; real ones are ~100-200 chars.
const MAX_USER_AGENT_LENGTH = 512;

function loadState() {
  try {
    const raw = fs.readJsonSync(STATE_FILE);
    return new Map(Object.entries(raw || {}));
  } catch (e) {
    return new Map();
  }
}

function saveState(map) {
  try {
    // Owner-only: the file holds live cookie values (mode is ignored on Windows).
    fs.writeJsonSync(STATE_FILE, Object.fromEntries(map), { spaces: 2, mode: 0o600 });
  } catch (e) {
    console.warn(`[SiteSession] Could not persist state: ${e.message}`);
  }
}

// site -> { site, cookies, userAgent, source, importedAt, updatedAt, stale, staleAt, staleReason }
const sessions = loadState();

// ─── Cookie normalisation ────────────────────────────────────────────

const SAME_SITE = {
  strict: 'Strict',
  lax: 'Lax',
  none: 'None',
  no_restriction: 'None' // Cookie-Editor / chrome.cookies spelling
};

/** True when `domain` (with or without a leading dot) is the site or a subdomain of it. */
export function cookieDomainMatchesSite(domain, site) {
  const host = String(domain || '').trim().replace(/^\./, '').toLowerCase();
  const s = String(site || '').trim().toLowerCase();
  if (!host || !s) return false;
  return host === s || host.endsWith(`.${s}`);
}

// Cookie names must be an RFC 6265 token and values printable ASCII without
// whitespace or ';'. Anything else either breaks when the value is joined
// into a Cookie: header for image downloads (Node rejects non-ASCII header
// values) or could smuggle extra syntax/markup through the store into the
// UI, so it is refused rather than escaped.
const NAME_RE = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
const VALUE_RE = /^[\x21-\x3a\x3c-\x7e]*$/; // 0x3b is ';'
// Domain: dotted labels only (a leading dot allowed); path: an absolute path
// of printable ASCII. Both end up in a URL handed to the browser, so nothing
// that could re-address it (`@`, `#`, `/` inside the domain) gets through.
const DOMAIN_RE = /^\.?[a-z0-9-]+(?:\.[a-z0-9-]+)+$/;
const PATH_RE = /^\/[\x21-\x3a\x3c-\x7e]*$/;

function toEpochSeconds(raw) {
  if (raw === undefined || raw === null || raw === '' || raw === false) return undefined;
  let n = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(n)) {
    // "Expires=Wed, 21 Oct 2026 07:28:00 GMT" style
    const t = Date.parse(String(raw));
    if (!Number.isFinite(t)) return undefined;
    n = t / 1000;
  }
  if (n <= 0) return undefined; // -1 / 0 mean "session cookie"
  if (n > 1e12) n = n / 1000; // milliseconds
  return Math.floor(n);
}

/**
 * Normalise one raw cookie (any of the supported export shapes) into the
 * object puppeteer's setCookie expects. Returns { cookie } or
 * { reason: 'invalid' | 'foreign' | 'expired' }.
 */
export function normaliseCookie(raw, site, now = Date.now()) {
  if (!raw || typeof raw !== 'object') return { reason: 'invalid' };
  const name = String(raw.name ?? raw.key ?? '').trim();
  let value = raw.value === undefined || raw.value === null ? '' : String(raw.value);
  // A whole-value wrapped in double quotes is legal cookie syntax; keep it,
  // but strip the stray whitespace some exports add around it.
  value = value.trim();
  if (!NAME_RE.test(name) || !VALUE_RE.test(value)) return { reason: 'invalid' };

  let domain = String(raw.domain ?? '').trim().toLowerCase();
  // A cookie the origin set without a Domain attribute is host-only; exports
  // show that as an explicit flag or as a domain without the leading dot.
  // Re-creating it as a domain cookie would still be sent to the site, but
  // Chrome refuses domain cookies for __Host- names, so keep the distinction.
  const hostOnly = raw.hostOnly === true || (!!domain && !domain.startsWith('.'));
  if (!domain) domain = `.${site}`;
  if (!DOMAIN_RE.test(domain)) return { reason: 'invalid' };
  if (!cookieDomainMatchesSite(domain, site)) return { reason: 'foreign' };
  const path = String(raw.path || '/').trim() || '/';
  if (!PATH_RE.test(path)) return { reason: 'invalid' };

  const expires = toEpochSeconds(raw.expirationDate ?? raw.expires ?? raw.expiry);
  if (expires !== undefined && expires * 1000 < now) return { reason: 'expired' };

  const cookie = {
    name,
    value,
    domain: hostOnly ? domain.replace(/^\./, '') : domain,
    path,
    httpOnly: !!raw.httpOnly,
    secure: !!raw.secure,
    hostOnly
  };
  if (expires !== undefined) cookie.expires = expires;

  const sameSiteKey = String(raw.sameSite ?? raw.samesite ?? '').trim().toLowerCase();
  if (SAME_SITE[sameSiteKey]) cookie.sameSite = SAME_SITE[sameSiteKey];
  if (cookie.sameSite === 'None') cookie.secure = true; // browsers require it

  // Prefixed names carry requirements Chrome enforces on set; meet them or
  // the cookie is silently dropped.
  if (/^__secure-/i.test(name)) cookie.secure = true;
  if (/^__host-/i.test(name)) {
    cookie.secure = true;
    cookie.path = '/';
    cookie.hostOnly = true;
    cookie.domain = cookie.domain.replace(/^\./, '');
  }
  return { cookie };
}

/**
 * The stored cookies as puppeteer `page.setCookie` parameters. Host-only
 * cookies are addressed by URL (CDP creates a domain cookie whenever a
 * `domain` is given, which is wrong for them and rejected for __Host- names).
 */
export function toCookieParams(cookies = []) {
  return cookies.map(c => {
    const { hostOnly, ...param } = c;
    if (hostOnly) {
      delete param.domain;
      param.url = `https://${c.domain}${c.path || '/'}`;
    }
    return param;
  });
}

// Attribute names that can follow the name=value pair on a Set-Cookie line.
const SET_COOKIE_ATTRS = new Set(['path', 'domain', 'expires', 'max-age', 'secure', 'httponly', 'samesite', 'priority', 'partitioned']);

function isSetCookieLine(segments) {
  if (segments.length < 2) return false;
  return segments.slice(1).every(seg => {
    const key = seg.split('=')[0].trim().toLowerCase();
    return SET_COOKIE_ATTRS.has(key);
  });
}

function parsePair(segment) {
  const eq = segment.indexOf('=');
  if (eq <= 0) return null;
  return { name: segment.slice(0, eq).trim(), value: segment.slice(eq + 1).trim() };
}

function parseSetCookieLine(segments, now) {
  const first = parsePair(segments[0]);
  if (!first) return null;
  const raw = { ...first };
  for (const seg of segments.slice(1)) {
    const [k, ...rest] = seg.split('=');
    const key = k.trim().toLowerCase();
    const val = rest.join('=').trim();
    if (key === 'path') raw.path = val;
    else if (key === 'domain') raw.domain = val;
    else if (key === 'expires') raw.expires = val;
    else if (key === 'max-age' && Number.isFinite(Number(val))) raw.expires = now / 1000 + Number(val);
    else if (key === 'secure') raw.secure = true;
    else if (key === 'httponly') raw.httpOnly = true;
    else if (key === 'samesite') raw.sameSite = val;
  }
  return raw;
}

function looksLikeHeaderRow(cols) {
  const a = cols[0].trim().toLowerCase();
  const b = (cols[1] || '').trim().toLowerCase();
  return a === 'name' && b === 'value';
}

/**
 * Turn whatever the user pasted into a list of raw cookie objects plus the
 * format that was recognised. Supported:
 *  - JSON array / object (Cookie-Editor, EditThisCookie, puppeteer, {name: value} map)
 *  - Cookie header string: `a=b; c=d` (optionally prefixed with "Cookie:", optionally quoted)
 *  - Set-Cookie lines: `a=b; Path=/; HttpOnly; Secure; Expires=...` one per line
 *  - Netscape cookies.txt lines: domain, flag, path, secure, expiry, name, value
 *  - Tab-separated rows copied from a devtools cookie table (name, value, domain, path, expires...)
 */
function extractRawCookies(input, now) {
  if (Array.isArray(input)) return { raws: input, format: 'json' };
  if (input && typeof input === 'object') {
    if ('name' in input) return { raws: [input], format: 'json' };
    return { raws: Object.entries(input).map(([name, value]) => ({ name, value })), format: 'json' };
  }

  let text = String(input ?? '').replace(/\r\n?/g, '\n').trim();
  if (!text) return { raws: [], format: 'empty' };

  // JSON pasted as text
  if (text[0] === '[' || text[0] === '{') {
    try {
      return extractRawCookies(JSON.parse(text), now);
    } catch (e) {
      // fall through - maybe it's a header string that happens to start with a brace
    }
  }

  // Whole thing wrapped in quotes (copied from a console)
  if (text.length > 1 && ((text[0] === '"' && text.at(-1) === '"') || (text[0] === "'" && text.at(-1) === "'"))) {
    text = text.slice(1, -1).trim();
  }

  const raws = [];
  let format = 'header';
  for (let line of text.split('\n')) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;
    line = line.replace(/^(?:set-)?cookie\s*:\s*/i, '');

    if (line.includes('\t')) {
      const cols = line.split('\t');
      if (looksLikeHeaderRow(cols)) continue;
      if (cols.length >= 7 && /^(true|false)$/i.test(cols[1].trim())) {
        format = 'netscape';
        raws.push({
          domain: cols[0], path: cols[2], secure: /^true$/i.test(cols[3].trim()),
          expires: cols[4], name: cols[5], value: cols[6]
        });
      } else if (cols.length >= 2) {
        format = 'table';
        raws.push({ name: cols[0], value: cols[1], domain: cols[2], path: cols[3], expires: cols[4] });
      }
      continue;
    }

    const segments = line.split(';').map(s => s.trim()).filter(Boolean);
    if (isSetCookieLine(segments)) {
      format = 'set-cookie';
      const raw = parseSetCookieLine(segments, now);
      if (raw) raws.push(raw);
      continue;
    }
    for (const seg of segments) {
      const pair = parsePair(seg);
      if (pair) raws.push(pair);
    }
  }
  return { raws, format };
}

/**
 * Parse user-pasted cookies for a site.
 * @returns {{ cookies: object[], ignored: { foreign: number, expired: number, invalid: number }, format: string }}
 */
export function parseCookieInput(input, site, now = Date.now()) {
  const { raws, format } = extractRawCookies(input, now);
  const ignored = { foreign: 0, expired: 0, invalid: 0 };
  const byKey = new Map(); // name|domain|path -> cookie (last one wins)
  for (const raw of raws) {
    const result = normaliseCookie(raw, site, now);
    if (!result.cookie) {
      ignored[result.reason]++;
      continue;
    }
    const c = result.cookie;
    byKey.set(`${c.name}|${c.domain}|${c.path}`, c);
  }
  return { cookies: [...byKey.values()], ignored, format };
}

export function sanitiseUserAgent(ua) {
  // Header values must be printable ASCII (Node refuses anything else), and
  // a real user agent never contains more.
  const s = String(ua ?? '').replace(/[^\x20-\x7e]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  return s.slice(0, MAX_USER_AGENT_LENGTH);
}

// ─── Store ───────────────────────────────────────────────────────────

function liveCookies(entry, now = Date.now()) {
  return (entry?.cookies || []).filter(c => c.expires === undefined || c.expires * 1000 >= now);
}

/**
 * Public, value-free view of a session (what the UI gets). Cookie names and
 * the user agent - the admin's own browser fingerprint - are only included
 * with `detailed`; other users just see that a session exists.
 */
export function sessionSummary(entry, { detailed = true, now = Date.now() } = {}) {
  if (!entry) return null;
  const cookies = liveCookies(entry, now);
  const expiries = cookies.map(c => c.expires).filter(e => e !== undefined);
  return {
    site: entry.site,
    cookieCount: cookies.length,
    cookieNames: detailed ? cookies.map(c => c.name) : undefined,
    userAgent: detailed ? (entry.userAgent || '') : (entry.userAgent ? '(set)' : ''),
    source: entry.source || 'import',
    importedAt: entry.importedAt,
    updatedAt: entry.updatedAt,
    expiresAt: expiries.length ? new Date(Math.min(...expiries) * 1000).toISOString() : null,
    stale: !!entry.stale,
    staleAt: entry.staleAt || null,
    staleReason: entry.staleReason || null
  };
}

// Socket clients are not authenticated, so the live event carries only what
// the UI needs to know something changed; names and the user agent come
// from the authenticated GET /api/site-status.
function emitSession(site) {
  const entry = sessions.get(site);
  if (!entry) {
    emitToAll(SITE_SESSION_EVENT, { site, cleared: true });
    return;
  }
  const s = sessionSummary(entry);
  emitToAll(SITE_SESSION_EVENT, { site, cookieCount: s.cookieCount, stale: s.stale, updatedAt: s.updatedAt });
}

/** The saved session for a site with only its unexpired cookies, or null. */
export function getSiteSession(site) {
  const entry = sessions.get(site);
  if (!entry) return null;
  const cookies = liveCookies(entry);
  if (cookies.length === 0) return null;
  return { ...entry, cookies };
}

export function hasSiteSession(site) {
  return !!getSiteSession(site);
}

export function listSiteSessions({ detailed = true } = {}) {
  return [...sessions.values()].map(e => sessionSummary(e, { detailed }));
}

/**
 * Replace the saved session for a site.
 * @param {string} site
 * @param {{ cookies: object[], userAgent?: string, source?: string }} data - cookies already normalised
 */
export function setSiteSession(site, { cookies, userAgent = '', source = 'import' }) {
  const now = new Date().toISOString();
  const previous = sessions.get(site);
  const entry = {
    site,
    cookies: [...cookies],
    userAgent: sanitiseUserAgent(userAgent),
    source,
    importedAt: now,
    updatedAt: now,
    stale: false,
    staleAt: null,
    staleReason: null
  };
  sessions.set(site, entry);
  saveState(sessions);
  console.log(`[SiteSession] ${site}: saved ${cookies.length} cookie(s)${entry.userAgent ? ' + user agent' : ''}${previous ? ' (replaced)' : ''}`);
  emitSession(site);
  return sessionSummary(entry);
}

export function clearSiteSession(site) {
  if (!sessions.delete(site)) return false;
  saveState(sessions);
  console.log(`[SiteSession] ${site}: forgotten`);
  emitSession(site);
  return true;
}

/** The site rejected the saved cookies (showed its check again). Keep them, but flag it. */
export function markSiteSessionStale(site, reason = 'The site showed its verification check again') {
  const entry = sessions.get(site);
  if (!entry || entry.stale) return false;
  entry.stale = true;
  entry.staleAt = new Date().toISOString();
  entry.staleReason = reason;
  saveState(sessions);
  console.warn(`[SiteSession] ${site}: saved cookies no longer accepted`);
  emitSession(site);
  return true;
}

/**
 * A scrape with the saved session succeeded: merge the cookies the browser
 * now holds for the site's domain back into the store and lift any stale
 * flag. That keeps rotated verification tokens (newest value wins by name)
 * and anything else the site or its CDN set while trusting this identity,
 * so the session stays valid as long as the site keeps extending it.
 * Cookies for other domains are left alone.
 */
export function refreshSiteSession(site, pageCookies = []) {
  const entry = sessions.get(site);
  if (!entry) return false;
  const now = Date.now();
  let changed = false;
  const known = new Map(entry.cookies.map(c => [c.name, c]));

  for (const raw of pageCookies) {
    if (!raw || !cookieDomainMatchesSite(raw.domain, site)) continue;
    // CDP reports domain cookies with a leading dot and host-only ones
    // without; normaliseCookie reads that distinction from the domain.
    const result = normaliseCookie({ ...raw, expires: raw.expires === -1 ? undefined : raw.expires }, site, now);
    if (!result.cookie) continue;
    const c = result.cookie;
    const existing = known.get(c.name);
    if (existing && existing.value === c.value && existing.expires === c.expires) continue;
    known.set(c.name, c);
    changed = true;
  }

  if (entry.stale) {
    entry.stale = false;
    entry.staleAt = null;
    entry.staleReason = null;
    changed = true;
  }
  if (!changed) return false;

  entry.cookies = [...known.values()];
  entry.updatedAt = new Date().toISOString();
  saveState(sessions);
  emitSession(site);
  return true;
}

/**
 * Put the saved session onto a puppeteer page (cookies + user agent).
 * @returns the session that was applied, or null when there is none.
 */
export async function applySiteSession(page, site) {
  const session = getSiteSession(site);
  if (!session) return null;
  await page.setCookie(...toCookieParams(session.cookies));
  if (session.userAgent) await page.setUserAgent(session.userAgent);
  console.log(`  [SiteSession] ${site}: applied ${session.cookies.length} saved cookie(s)${session.userAgent ? ' and user agent' : ''}${session.stale ? ' (flagged stale, trying anyway)' : ''}`);
  return session;
}

/**
 * Remove a site's cookies from the shared browser (they sit in its on-disk
 * profile as well as in our store), so a forgotten session does not linger.
 * @returns the number removed, or null when the purge could not run.
 */
export async function purgeSiteCookiesFromBrowser(browser, site) {
  if (!browser) return null;
  try {
    const all = await browser.cookies();
    const mine = all.filter(c => cookieDomainMatchesSite(c.domain, site));
    if (mine.length) await browser.deleteCookie(...mine);
    return mine.length;
  } catch (e) {
    console.warn(`[SiteSession] Could not purge ${site} cookies from the browser: ${e.message}`);
    return null;
  }
}

export default {
  parseCookieInput,
  normaliseCookie,
  toCookieParams,
  sanitiseUserAgent,
  getSiteSession,
  hasSiteSession,
  listSiteSessions,
  setSiteSession,
  clearSiteSession,
  markSiteSessionStale,
  refreshSiteSession,
  applySiteSession,
  purgeSiteCookiesFromBrowser,
  sessionSummary,
  SITE_SESSION_EVENT
};
