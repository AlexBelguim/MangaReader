/**
 * Exercises the cookie paste parser in src/scrapers/util/site-session.js
 * with every export format the UI tells the user about.
 *
 *   DATA_DIR=<scratch> DOWNLOADS_DIR=<scratch> node testfiles/test-site-session-parse.mjs
 *
 * (The two dirs only matter because importing the module loads config,
 * which creates them; the parser itself touches no files.)
 */
import assert from 'node:assert/strict';
import { parseCookieInput, normaliseCookie, sanitiseUserAgent, cookieDomainMatchesSite, toCookieParams } from '../src/scrapers/util/site-session.js';

const SITE = 'comix.to';
const NOW = Date.parse('2026-09-04T12:00:00Z');
const FUTURE = Math.floor(NOW / 1000) + 86400;
const PAST = Math.floor(NOW / 1000) - 86400;

let passed = 0;
function check(label, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok   ${label}`);
  } catch (e) {
    console.log(`  FAIL ${label}\n       ${e.message}`);
    process.exitCode = 1;
  }
}

check('domain matching', () => {
  assert.equal(cookieDomainMatchesSite('.comix.to', SITE), true);
  assert.equal(cookieDomainMatchesSite('comix.to', SITE), true);
  assert.equal(cookieDomainMatchesSite('www.comix.to', SITE), true);
  assert.equal(cookieDomainMatchesSite('notcomix.to', SITE), false);
  assert.equal(cookieDomainMatchesSite('comix.to.evil.com', SITE), false);
  assert.equal(cookieDomainMatchesSite('', SITE), false);
});

check('header string', () => {
  const r = parseCookieInput('waf_token=abc.def; __cf_bm=xyz', SITE, NOW);
  assert.equal(r.format, 'header');
  assert.deepEqual(r.cookies.map(c => [c.name, c.value, c.domain, c.path]), [
    ['waf_token', 'abc.def', '.comix.to', '/'],
    ['__cf_bm', 'xyz', '.comix.to', '/']
  ]);
  assert.equal(r.cookies[0].expires, undefined);
});

check('header string with "Cookie:" prefix and quotes', () => {
  const r = parseCookieInput('"Cookie: a=1; b=2=3"', SITE, NOW);
  assert.deepEqual(r.cookies.map(c => [c.name, c.value]), [['a', '1'], ['b', '2=3']]);
});

check('Cookie-Editor JSON export', () => {
  const json = JSON.stringify([
    { domain: '.comix.to', expirationDate: FUTURE + 0.5, hostOnly: false, httpOnly: true, name: 'waf', path: '/', sameSite: 'lax', secure: true, session: false, storeId: null, value: 'tok' },
    { domain: 'comix.to', hostOnly: true, httpOnly: false, name: 'sess', path: '/', sameSite: 'no_restriction', secure: false, session: true, value: 'sid' },
    { domain: '.google.com', name: 'NID', value: 'nope', path: '/' },
    { domain: '.comix.to', name: 'old', value: 'gone', path: '/', expirationDate: PAST }
  ]);
  const r = parseCookieInput(json, SITE, NOW);
  assert.equal(r.format, 'json');
  assert.equal(r.cookies.length, 2);
  const waf = r.cookies.find(c => c.name === 'waf');
  assert.equal(waf.expires, FUTURE);
  assert.equal(waf.httpOnly, true);
  assert.equal(waf.secure, true);
  assert.equal(waf.sameSite, 'Lax');
  assert.equal(waf.hostOnly, false);
  const sess = r.cookies.find(c => c.name === 'sess');
  assert.equal(sess.expires, undefined);
  assert.equal(sess.sameSite, 'None');
  assert.equal(sess.secure, true, 'SameSite=None forces Secure');
  assert.equal(sess.hostOnly, true, 'domain without leading dot / hostOnly flag');
  assert.equal(sess.domain, 'comix.to');
  assert.deepEqual(r.ignored, { foreign: 1, expired: 1, invalid: 0 });
});

check('host-only cookies become url-addressed setCookie params', () => {
  const params = toCookieParams([
    { name: 'a', value: '1', domain: '.comix.to', path: '/', hostOnly: false },
    { name: 'b', value: '2', domain: 'comix.to', path: '/', hostOnly: true, secure: true }
  ]);
  assert.deepEqual(params[0], { name: 'a', value: '1', domain: '.comix.to', path: '/' });
  assert.deepEqual(params[1], { name: 'b', value: '2', path: '/', secure: true, url: 'https://comix.to/' });
});

check('puppeteer-style JSON with millisecond expiry', () => {
  const r = parseCookieInput([{ name: 'a', value: 'b', domain: '.comix.to', expires: FUTURE * 1000 }], SITE, NOW);
  assert.equal(r.cookies[0].expires, FUTURE);
});

check('name/value object map', () => {
  const r = parseCookieInput({ one: '1', two: '2' }, SITE, NOW);
  assert.deepEqual(r.cookies.map(c => c.name), ['one', 'two']);
});

check('Netscape cookies.txt', () => {
  const txt = [
    '# Netscape HTTP Cookie File',
    `.comix.to\tTRUE\t/\tTRUE\t${FUTURE}\twaf\ttok`,
    `.example.org\tTRUE\t/\tFALSE\t${FUTURE}\tfoo\tbar`
  ].join('\n');
  const r = parseCookieInput(txt, SITE, NOW);
  assert.equal(r.format, 'netscape');
  assert.equal(r.cookies.length, 1);
  assert.equal(r.cookies[0].name, 'waf');
  assert.equal(r.cookies[0].secure, true);
  assert.equal(r.cookies[0].expires, FUTURE);
  assert.equal(r.ignored.foreign, 1);
});

check('devtools table rows (tab separated, header row skipped)', () => {
  const txt = [
    'Name\tValue\tDomain\tPath\tExpires / Max-Age\tSize',
    'waf\ttok\t.comix.to\t/\t2026-09-05T12:00:00.000Z\t7',
    'sid\tabc\tcomix.to\t/\tSession\t6'
  ].join('\r\n');
  const r = parseCookieInput(txt, SITE, NOW);
  assert.equal(r.format, 'table');
  assert.deepEqual(r.cookies.map(c => [c.name, c.value]), [['waf', 'tok'], ['sid', 'abc']]);
  assert.equal(r.cookies[0].expires, Math.floor(Date.parse('2026-09-05T12:00:00.000Z') / 1000));
  assert.equal(r.cookies[1].expires, undefined);
});

check('Set-Cookie lines', () => {
  const txt = [
    'waf=tok; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600',
    'sid=abc; Domain=.comix.to; Path=/; Expires=Wed, 21 Oct 2026 07:28:00 GMT'
  ].join('\n');
  const r = parseCookieInput(txt, SITE, NOW);
  assert.equal(r.format, 'set-cookie');
  assert.equal(r.cookies.length, 2);
  assert.equal(r.cookies[0].httpOnly, true);
  assert.equal(r.cookies[0].expires, Math.floor(NOW / 1000) + 3600);
  assert.equal(r.cookies[1].expires, Math.floor(Date.parse('Wed, 21 Oct 2026 07:28:00 GMT') / 1000));
});

check('garbage and injection attempts are rejected', () => {
  assert.equal(parseCookieInput('', SITE, NOW).cookies.length, 0);
  assert.equal(parseCookieInput('just some words', SITE, NOW).cookies.length, 0);
  const r = parseCookieInput([
    { name: 'bad name', value: 'x' },
    { name: 'ok', value: 'line\nbreak' },
    { name: 'ok2', value: 'semi;colon' },
    { name: '"><script>x</script>', value: 'x' },
    { name: 'ok3', value: 'non-ascii-é' }
  ], SITE, NOW);
  assert.equal(r.cookies.length, 0);
  assert.equal(r.ignored.invalid, 5);
  // Legal but unusual characters stay
  const ok = parseCookieInput('tok="quoted,value\\x"; b=a=b', SITE, NOW);
  assert.deepEqual(ok.cookies.map(c => c.value), ['"quoted,value\\x"', 'a=b']);
});

check('domain and path cannot re-address the cookie URL', () => {
  const bad = parseCookieInput([
    { name: 'a', value: '1', domain: 'evil.com/.comix.to' },
    { name: 'b', value: '1', domain: 'evil.com#.comix.to' },
    { name: 'c', value: '1', domain: 'comix.to', path: '@evil.com/' },
    { name: 'd', value: '1', domain: 'comix.to', path: 'relative' },
    { name: 'e', value: '1', domain: ' comix.to' }
  ], SITE, NOW);
  assert.equal(bad.cookies.length, 1, 'only the trimmed plain domain survives');
  assert.equal(bad.cookies[0].name, 'e');
  assert.equal(bad.ignored.invalid, 4);
  const params = toCookieParams(parseCookieInput([{ name: 'h', value: '1', domain: 'www.comix.to', path: '/x/y' }], SITE, NOW).cookies);
  assert.equal(params[0].url, 'https://www.comix.to/x/y');
});

check('duplicate names: last one wins', () => {
  const r = parseCookieInput('a=1; a=2', SITE, NOW);
  assert.deepEqual(r.cookies.map(c => c.value), ['2']);
});

check('CDP-shaped cookies from page.cookies() normalise for the refresh path', () => {
  // What puppeteer returns: expires -1 for session cookies, extra fields,
  // and the domain's leading dot deciding domain vs host-only.
  const cdpDomain = { name: 'waf', value: 't', domain: '.comix.to', path: '/', expires: -1, size: 5, httpOnly: true, secure: true, session: true, sameSite: 'Lax', priority: 'Medium', sameParty: false, sourceScheme: 'Secure' };
  const a = normaliseCookie({ ...cdpDomain, expires: cdpDomain.expires === -1 ? undefined : cdpDomain.expires }, SITE, NOW).cookie;
  assert.equal(a.expires, undefined);
  assert.equal(a.hostOnly, false);
  assert.equal(a.domain, '.comix.to');
  assert.equal(a.sameSite, 'Lax');
  const b = normaliseCookie({ ...cdpDomain, domain: 'comix.to', expires: FUTURE }, SITE, NOW).cookie;
  assert.equal(b.hostOnly, true);
  assert.equal(b.domain, 'comix.to');
  assert.equal(b.expires, FUTURE);
});

check('__Host- prefix requirements', () => {
  const { cookie } = normaliseCookie({ name: '__Host-x', value: '1', domain: '.comix.to', path: '/foo' }, SITE, NOW);
  assert.equal(cookie.secure, true);
  assert.equal(cookie.path, '/');
  assert.equal(cookie.domain, 'comix.to');
  assert.equal(cookie.hostOnly, true);
});

check('user agent sanitising', () => {
  assert.equal(sanitiseUserAgent(' Mozilla/5.0\r\nX-Injected: 1 '), 'Mozilla/5.0 X-Injected: 1');
  assert.equal(sanitiseUserAgent('Mozilla/5.0 (Ünïcode)'), 'Mozilla/5.0 ( n code)');
  assert.equal(sanitiseUserAgent(null), '');
  assert.equal(sanitiseUserAgent('x'.repeat(1000)).length, 512);
});

console.log(`\n${passed} check(s) passed${process.exitCode ? ', some FAILED' : ''}`);
