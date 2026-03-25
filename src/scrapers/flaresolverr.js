import { CONFIG } from '../config.js';

/**
 * FlareSolverr helper - bypasses Cloudflare challenges via the FlareSolverr proxy.
 * FlareSolverr uses a real browser to solve challenges and returns the page HTML + cookies.
 * 
 * API docs: https://github.com/FlareSolverr/FlareSolverr
 */

const FLARESOLVERR_URL = CONFIG.flareSolverrUrl;

/**
 * Check if FlareSolverr is available
 */
export async function isAvailable() {
  try {
    const response = await fetch(FLARESOLVERR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd: 'sessions.list' }),
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Fetch a page through FlareSolverr, bypassing Cloudflare challenges.
 * Returns the solved page HTML, cookies, and user agent.
 * 
 * @param {string} url - URL to fetch
 * @param {number} maxTimeout - Max time to wait for challenge solving (ms)
 * @returns {{ html: string, cookies: Array, userAgent: string, status: number, url: string }}
 */
export async function fetchPage(url, maxTimeout = 60000) {
  console.log(`  [FlareSolverr] Fetching: ${url}`);

  const response = await fetch(FLARESOLVERR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cmd: 'request.get',
      url: url,
      maxTimeout: maxTimeout
    })
  });

  if (!response.ok) {
    throw new Error(`FlareSolverr request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== 'ok') {
    throw new Error(`FlareSolverr error: ${data.message || 'Unknown error'}`);
  }

  const solution = data.solution;
  console.log(`  [FlareSolverr] Got response (status ${solution.status}, ${solution.response.length} chars)`);

  return {
    html: solution.response,
    cookies: solution.cookies || [],
    userAgent: solution.userAgent || '',
    status: solution.status,
    url: solution.url
  };
}

/**
 * Convert FlareSolverr cookies to Puppeteer cookie format.
 * Useful for setting cookies on a puppeteer page after FlareSolverr solves the challenge.
 * 
 * @param {Array} fsCookies - Cookies from FlareSolverr response
 * @param {string} domain - Domain to set cookies for (e.g. '.comix.to')
 * @returns {Array} Puppeteer-compatible cookie objects
 */
export function toPuppeteerCookies(fsCookies, domain) {
  return fsCookies.map(c => ({
    name: c.name,
    value: c.value,
    domain: c.domain || domain,
    path: c.path || '/',
    httpOnly: c.httpOnly || false,
    secure: c.secure || false,
    sameSite: c.sameSite || 'Lax'
  }));
}

export default { isAvailable, fetchPage, toPuppeteerCookies };
