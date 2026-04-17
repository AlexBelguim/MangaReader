import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer';
import { CONFIG } from '../../config.js';

// Register stealth plugin once at module load
puppeteerExtra.use(StealthPlugin());

const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

/**
 * Launch a browser with optional stealth mode.
 * Returns { browser, page } — caller is responsible for closing the browser.
 * 
 * @param {object} [options]
 * @param {boolean} [options.stealth=false] - Use puppeteer-extra with StealthPlugin
 * @param {string} [options.userAgent] - Custom user agent (defaults to Chrome 120)
 * @param {{ width: number, height: number }} [options.viewport] - Custom viewport
 * @param {object} [options.launchOverrides] - Extra puppeteer launch options
 * @returns {{ browser: import('puppeteer').Browser, page: import('puppeteer').Page }}
 */
export async function launchBrowser({
  stealth = false,
  userAgent = DEFAULT_USER_AGENT,
  viewport = null,
  launchOverrides = {}
} = {}) {
  const baseLaunchOpts = stealth
    ? { headless: 'new', defaultViewport: null, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    : { ...CONFIG.puppeteer };

  if (viewport) {
    baseLaunchOpts.defaultViewport = viewport;
  }

  const finalOpts = { ...baseLaunchOpts, ...launchOverrides };
  const launcher = stealth ? puppeteerExtra : puppeteer;
  const browser = await launcher.launch(finalOpts);
  const page = await browser.newPage();

  if (userAgent) {
    await page.setUserAgent(userAgent);
  }

  if (viewport) {
    await page.setViewport(viewport);
  }

  return { browser, page };
}

export { DEFAULT_USER_AGENT };
