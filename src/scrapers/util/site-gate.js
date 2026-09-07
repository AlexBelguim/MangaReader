/**
 * Site gate: ties the per-site challenge state (challenge.js) to the saved
 * sessions (site-session.js) and to the scrapers, so the rest of the app
 * can ask one question - "may work for this site run right now?" - and
 * wait for the answer to become yes.
 *
 *  - Which sites are gated at all comes from the scrapers: every scraper
 *    with `supportsSession` (it has a human check the user can pass) is
 *    registered here with its check cookies (`sessionCookieNames`).
 *  - The gate closes when the site shows its check (reported by the
 *    scraper) and, ahead of time, when the saved session's check cookie is
 *    about to expire: a scrape with an expired cookie would only feed the
 *    block, so the site is marked blocked (`reason: 'expired'`) a little
 *    early and the work waits for a fresh solve instead.
 *  - It opens when the challenge is cleared: a solve through the app, a
 *    cookie paste the site accepted, a page that got real content, an
 *    admin's "retry anyway", or the cooldown passing.
 *
 * Several sites can be blocked at once; each has its own gate, timer and
 * queue of waiting work.
 */

import { isChallenged, waitForSite as waitForChallengeClear, reportChallenge, getChallenge } from './challenge.js';
import { sessionEvents, sessionExpiresAt, hasSiteSession } from './site-session.js';

// Close the gate this long before the check cookie actually expires, so no
// scrape is started that would run into the expiry half-way.
export const EXPIRY_LEAD_MS = 3 * 60 * 1000;
// setTimeout cannot take more than ~24.8 days; longer waits are re-armed.
const MAX_TIMER_MS = 2 ** 31 - 1;

// site -> { site, cookieNames, url, scraper }
const gated = new Map();
// site -> expiry timer
const expiryTimers = new Map();
let scrapers = [];
let listening = false;

function clearExpiryTimer(site) {
  const t = expiryTimers.get(site);
  if (t) { clearTimeout(t); expiryTimers.delete(site); }
}

/**
 * (Re-)arm the timer that closes the site's gate when its saved session is
 * about to run out. Nothing is armed without a session, without an expiry,
 * or while the site is already blocked.
 */
function armExpiryTimer(site) {
  clearExpiryTimer(site);
  const g = gated.get(site);
  if (!g || !hasSiteSession(site)) return;
  const at = sessionExpiresAt(site, g.cookieNames);
  if (at === null) return;
  const delay = at - EXPIRY_LEAD_MS - Date.now();
  if (delay > MAX_TIMER_MS) {
    const t = setTimeout(() => armExpiryTimer(site), MAX_TIMER_MS);
    if (typeof t.unref === 'function') t.unref();
    expiryTimers.set(site, t);
    return;
  }
  const fire = () => {
    expiryTimers.delete(site);
    const current = sessionExpiresAt(site, g.cookieNames);
    // Refreshed meanwhile (the site rotated the cookie during a scrape):
    // the 'change' event already re-armed us; nothing to do here.
    if (current === null || current - EXPIRY_LEAD_MS - Date.now() > 1000) return;
    if (isChallenged(site)) return; // blocked already, the timer would only repeat it
    console.warn(`[SiteGate] ${site}: the saved session's check cookie expires ${new Date(current).toISOString()} - closing the gate until it is solved again`);
    reportChallenge(site, g.url, { usedSession: true, reason: 'expired' });
  };
  const t = setTimeout(fire, Math.max(0, delay));
  if (typeof t.unref === 'function') t.unref();
  expiryTimers.set(site, t);
}

/**
 * Register the scrapers whose sites can be gated. Call once after the
 * scraper factory has loaded them; calling again replaces the set.
 */
export function registerGatedSites(list = []) {
  scrapers = list;
  gated.clear();
  for (const scraper of list) {
    if (!scraper.supportsSession) continue;
    const site = scraper.websiteName;
    gated.set(site, {
      site,
      cookieNames: [...(scraper.sessionCookieNames || [])],
      url: scraper.siteUrl,
      scraper
    });
    armExpiryTimer(site);
  }
  if (!listening) {
    listening = true;
    sessionEvents.on('change', site => armExpiryTimer(site));
  }
  if (gated.size) console.log(`[SiteGate] Gated sites: ${[...gated.keys()].join(', ')}`);
}

/** Sites with a human check the user can pass, with what an assisted solve needs. */
export function gatedSites() {
  return [...gated.values()].map(({ site, cookieNames, url }) => ({ site, cookieNames, url }));
}

export function gatedSite(site) {
  return gated.get(site) || null;
}

/** The scraper's site for a URL, quietly (no scraper-factory logging), or null. */
export function siteForUrl(url) {
  if (!url) return null;
  const scraper = scrapers.find(s => s.canHandle(url));
  return scraper ? scraper.websiteName : null;
}

/**
 * The site a queued job belongs to, from what the job carries: an explicit
 * `site`, or the site of its `url`. Null when the job is not site-bound
 * (deletes, scans) and must never wait on a gate.
 */
export function siteForJob(type, data = {}) {
  if (data && typeof data.site === 'string') return data.site;
  if (data && typeof data.url === 'string') return siteForUrl(data.url);
  return null;
}

/** May work for this site run now? (No site, or a site that is not blocked.) */
export function isSiteOpen(site) {
  return !site || !isChallenged(site);
}

/** Resolves when the site may be worked on again (see challenge.js). */
export function waitForSite(site, opts) {
  return waitForChallengeClear(site, opts);
}

/** Why a site is closed right now, for status messages; null when open. */
export function closedBecause(site) {
  if (isSiteOpen(site)) return null;
  const c = getChallenge(site);
  return c ? { site, reason: c.reason || 'check', url: c.url, sessionStale: !!c.sessionStale } : { site, reason: 'check' };
}

export default {
  registerGatedSites, gatedSites, gatedSite, siteForUrl, siteForJob, isSiteOpen, waitForSite, closedBecause, EXPIRY_LEAD_MS
};
