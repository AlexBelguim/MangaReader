/**
 * Detailed test - captures full page content to understand protection
 */
import puppeteer from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CONFIG } from '../src/config.js';

puppeteerExtra.use(StealthPlugin());

const COMIX_TEST_URL = 'https://comix.to/title/pvry-one-piece';

async function testComixDetailed() {
  console.log('=== DETAILED COMIX.TO TEST ===\n');

  // Test 1: Plain puppeteer - capture full response
  console.log('--- Test 1: Plain Puppeteer ---');
  const browser1 = await puppeteer.launch({ ...CONFIG.puppeteer, headless: true });
  try {
    const page = await browser1.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Capture response headers and status
    page.on('response', async (response) => {
      if (response.url().includes('comix.to')) {
        const status = response.status();
        const headers = response.headers();
        if (response.url() === COMIX_TEST_URL || response.url() === COMIX_TEST_URL + '/') {
          console.log(`  Response URL: ${response.url()}`);
          console.log(`  Status: ${status}`);
          console.log(`  Server: ${headers['server'] || 'unknown'}`);
          console.log(`  CF-Ray: ${headers['cf-ray'] || 'none'}`);
          console.log(`  Content-Type: ${headers['content-type'] || 'unknown'}`);
          // Check for DDoS-Guard or Cloudflare headers
          Object.keys(headers).filter(h => 
            h.includes('cf-') || h.includes('ddos') || h.includes('guard') || h.includes('protection')
          ).forEach(h => {
            console.log(`  ${h}: ${headers[h]}`);
          });
        }
      }
    });

    await page.goto(COMIX_TEST_URL, { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => {
      console.log(`  Nav error: ${e.message}`);
    });

    await new Promise(r => setTimeout(r, 3000));

    const pageInfo = await page.evaluate(() => ({
      title: document.title,
      url: window.location.href,
      bodyText: document.body?.innerText?.substring(0, 1000) || '',
      bodyHTML: document.body?.innerHTML?.substring(0, 2000) || '',
      scripts: Array.from(document.querySelectorAll('script')).map(s => ({
        src: s.src || '[inline]',
        content: s.textContent?.substring(0, 200) || ''
      })).slice(0, 5),
      metas: Array.from(document.querySelectorAll('meta')).map(m => ({
        name: m.name || m.httpEquiv || m.getAttribute('property') || '',
        content: m.content || ''
      }))
    }));

    console.log(`\n  Title: "${pageInfo.title}"`);
    console.log(`  Final URL: ${pageInfo.url}`);
    console.log(`  Body text:\n${pageInfo.bodyText}\n`);
    console.log(`  Metas: ${JSON.stringify(pageInfo.metas, null, 2)}`);
    console.log(`  Scripts:`, pageInfo.scripts.map(s => s.src).join(', '));
    console.log(`\n  Body HTML (first 1000 chars):\n${pageInfo.bodyHTML.substring(0, 1000)}`);

  } finally {
    await browser1.close();
  }

  // Test 2: Stealth puppeteer with longer wait
  console.log('\n\n--- Test 2: Stealth Puppeteer (long wait) ---');
  const browser2 = await puppeteerExtra.launch({ ...CONFIG.puppeteer, headless: true });
  try {
    const page = await browser2.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    page.on('response', async (response) => {
      if (response.url().includes('comix.to') && 
          (response.url() === COMIX_TEST_URL || response.url() === COMIX_TEST_URL + '/')) {
        console.log(`  Response Status: ${response.status()}`);
        console.log(`  Server: ${response.headers()['server'] || 'unknown'}`);
      }
    });

    await page.goto(COMIX_TEST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => {
      console.log(`  Nav error: ${e.message}`);
    });

    // Check every 3 seconds for up to 30s
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const check = await page.evaluate(() => ({
        title: document.title,
        url: window.location.href,
        chapterLinks: document.querySelectorAll('a[href*="chapter-"]').length,
        h1: document.querySelector('h1')?.textContent?.trim() || 'none',
        body: document.body?.innerText?.substring(0, 200) || ''
      }));
      console.log(`  [${(i+1)*3}s] Title: "${check.title}" | H1: "${check.h1}" | Chapters: ${check.chapterLinks} | URL: ${check.url}`);
      
      if (check.chapterLinks > 0) {
        console.log('  ✅ Content loaded!');
        break;
      }
    }
  } finally {
    await browser2.close();
  }

  // Test 3: Stealth + headless=false (new headless mode)
  console.log('\n\n--- Test 3: Stealth Puppeteer (headless="shell") ---');
  const browser3 = await puppeteerExtra.launch({ 
    ...CONFIG.puppeteer, 
    headless: 'shell'
  });
  try {
    const page = await browser3.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto(COMIX_TEST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => {
      console.log(`  Nav error: ${e.message}`);
    });

    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const check = await page.evaluate(() => ({
        title: document.title,
        chapterLinks: document.querySelectorAll('a[href*="chapter-"]').length,
        h1: document.querySelector('h1')?.textContent?.trim() || 'none'
      }));
      console.log(`  [${(i+1)*3}s] Title: "${check.title}" | H1: "${check.h1}" | Chapters: ${check.chapterLinks}`);
      
      if (check.chapterLinks > 0) {
        console.log('  ✅ Content loaded!');
        break;
      }
    }
  } finally {
    await browser3.close();
  }
}

testComixDetailed().catch(console.error);
