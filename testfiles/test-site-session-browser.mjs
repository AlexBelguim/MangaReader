/**
 * Proves the puppeteer side of src/scrapers/util/site-session.js against a
 * real headless Chrome: host-only and domain cookies set via toCookieParams
 * land in the browser as intended, and what the browser reports back
 * (page.cookies()) round-trips through normaliseCookie / refreshSiteSession
 * without changing the cookies. Needs CHROME_EXECUTABLE_PATH (or puppeteer's
 * bundled Chrome). No network access; nothing is loaded from any site.
 *
 *   DATA_DIR=<scratch dir> node testfiles/test-site-session-browser.mjs
 */
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer';
import { CONFIG } from '../src/config.js';
import { toCookieParams, normaliseCookie } from '../src/scrapers/util/site-session.js';

const SITE = 'comix.to';
const FUTURE = Math.floor(Date.now() / 1000) + 3600;

const browser = await puppeteer.launch({ ...CONFIG.puppeteer, headless: true });
try {
  const page = await browser.newPage();
  const stored = [
    { name: 'domain_cookie', value: 'd', domain: '.comix.to', path: '/', httpOnly: true, secure: true, sameSite: 'Lax', expires: FUTURE, hostOnly: false },
    { name: 'host_cookie', value: 'h', domain: 'comix.to', path: '/', httpOnly: true, secure: true, hostOnly: true },
    { name: '__Host-strict', value: 's', domain: 'comix.to', path: '/', httpOnly: false, secure: true, hostOnly: true }
  ];
  await page.setCookie(...toCookieParams(stored));

  // What the browser would send to https://comix.to/
  const seen = await page.cookies('https://comix.to/');
  const byName = new Map(seen.map(c => [c.name, c]));
  assert.equal(byName.size, 3, `expected 3 cookies, browser holds ${[...byName.keys()].join(', ')}`);
  assert.equal(byName.get('domain_cookie').domain, '.comix.to', 'domain cookie keeps its leading dot');
  assert.equal(byName.get('host_cookie').domain, 'comix.to', 'host-only cookie has no leading dot');
  assert.equal(byName.get('__Host-strict').domain, 'comix.to', '__Host- cookie accepted as host-only');
  assert.equal(byName.get('domain_cookie').expires, FUTURE);
  assert.equal(byName.get('host_cookie').expires, -1, 'session cookie reported as -1');
  console.log('  ok   setCookie: domain, host-only and __Host- cookies all land as intended');

  // Round trip: the refresh path normalises page.cookies() output
  for (const c of seen) {
    const { cookie } = normaliseCookie({ ...c, expires: c.expires === -1 ? undefined : c.expires }, SITE);
    const original = stored.find(s => s.name === c.name);
    assert.ok(cookie, `${c.name} normalises`);
    assert.equal(cookie.hostOnly, original.hostOnly, `${c.name} keeps hostOnly=${original.hostOnly}`);
    assert.equal(cookie.domain, original.domain, `${c.name} keeps domain`);
    assert.equal(cookie.value, original.value);
    assert.equal(cookie.expires, original.expires, `${c.name} keeps expiry`);
  }
  console.log('  ok   page.cookies() round-trips through normaliseCookie unchanged');

  // Re-applying the round-tripped cookies is a no-op for the browser
  const again = seen.map(c => normaliseCookie({ ...c, expires: c.expires === -1 ? undefined : c.expires }, SITE).cookie);
  await page.setCookie(...toCookieParams(again));
  const after = await page.cookies('https://comix.to/');
  assert.equal(after.length, 3, 're-applying does not duplicate cookies');
  console.log('  ok   re-applying refreshed cookies does not duplicate them');

  // A user agent set on the page is what navigator reports
  await page.setUserAgent('Mozilla/5.0 (Test) HandOver/1.0');
  assert.equal(await page.evaluate(() => navigator.userAgent), 'Mozilla/5.0 (Test) HandOver/1.0');
  console.log('  ok   setUserAgent applies');

  // Purge path: browser-level cookies() sees them, deleteCookie removes them
  const all = (await browser.cookies()).filter(c => c.domain.endsWith('comix.to'));
  assert.equal(all.length, 3);
  await browser.deleteCookie(...all);
  assert.equal((await page.cookies('https://comix.to/')).length, 0, 'purge removes every cookie');
  console.log('  ok   browser.cookies()/deleteCookie purge the site');

  console.log('\nall browser checks passed');
} finally {
  await browser.close();
}
