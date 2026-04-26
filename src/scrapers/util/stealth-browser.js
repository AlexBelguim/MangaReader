import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { CONFIG } from '../../config.js';

// Register stealth plugin once at module load
puppeteerExtra.use(StealthPlugin());

let browserInstance = null;
let browserPromise = null;

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
  // Prevent race condition if multiple calls happen at once
  if (browserInstance) {
    return createPageResponse(browserInstance, userAgent, viewport);
  }

  if (browserPromise) {
    const browser = await browserPromise;
    return createPageResponse(browser, userAgent, viewport);
  }

  browserPromise = (async () => {
    try {
      const baseLaunchOpts = stealth
        ? { headless: 'new', defaultViewport: null, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
        : { ...CONFIG.puppeteer };

      if (viewport) {
        baseLaunchOpts.defaultViewport = viewport;
      }

      const userDataDir = path.join(os.tmpdir(), 'puppeteer_stealth_profile');
      
      // Ensure directory exists
      if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
      }

      // Clean up stale lock files which often happen on network shares or after crashes
      const lockFiles = ['SingletonLock', 'SingletonSocket', 'SingletonCookie'];
      for (const f of lockFiles) {
        const lockPath = path.join(userDataDir, f);
        if (fs.existsSync(lockPath)) {
          try {
            console.log(`[StealthBrowser] Removing stale lock file: ${lockPath}`);
            fs.unlinkSync(lockPath);
          } catch (e) {
            console.warn(`[StealthBrowser] Could not remove puppeteer lock file ${f}: ${e.message}`);
          }
        }
      }

      const finalOpts = {
        ...baseLaunchOpts,
        ...launchOverrides,
        userDataDir
      };
      
      const launcher = stealth ? puppeteerExtra : puppeteer;
      
      console.log(`[StealthBrowser] Launching browser...`);
      const browser = await launcher.launch(finalOpts);
      
      browser.on('disconnected', () => {
        console.log(`[StealthBrowser] Browser disconnected`);
        browserInstance = null;
        browserPromise = null;
      });

      browserInstance = browser;
      return browser;
    } catch (error) {
      browserPromise = null;
      throw error;
    }
  })();

  const browser = await browserPromise;
  return createPageResponse(browser, userAgent, viewport);
}

async function createPageResponse(browser, userAgent, viewport) {
  const page = await browser.newPage();

  if (userAgent) {
    await page.setUserAgent(userAgent);
  }

  if (viewport) {
    await page.setViewport(viewport);
  }

  return {
    // Return a mock browser that only closes the page
    browser: {
      close: async () => {
        try {
          if (!page.isClosed()) await page.close();
        } catch (e) {
          // Ignore
        }
      }
    },
    page
  };
}

export { DEFAULT_USER_AGENT };
