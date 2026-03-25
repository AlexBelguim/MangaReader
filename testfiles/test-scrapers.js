/**
 * Test script to verify comix.to and nhentai.net scrapers
 * Tests whether Cloudflare is blocking requests
 * 
 * Usage: node testfiles/test-scrapers.js
 */
import puppeteer from 'puppeteer';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CONFIG } from '../src/config.js';

puppeteerExtra.use(StealthPlugin());

const COMIX_TEST_URL = 'https://comix.to/title/pvry-one-piece';
const NHENTAI_TEST_URL = 'https://nhentai.net/g/1/';

async function checkCloudflare(page) {
  return await page.evaluate(() => {
    const title = document.title.toLowerCase();
    const body = document.body?.innerText?.toLowerCase() || '';
    return {
      isCloudflare: title.includes('just a moment') ||
        title.includes('checking your browser') ||
        body.includes('checking your browser') ||
        body.includes('attention required'),
      title: document.title,
      bodySnippet: document.body?.innerText?.substring(0, 500) || ''
    };
  });
}

async function testWithPlainPuppeteer(url, label) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${label} with PLAIN puppeteer: ${url}`);
  console.log('='.repeat(60));

  const browser = await puppeteer.launch({
    ...CONFIG.puppeteer,
    headless: true
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log('  Navigating...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => {
      console.log(`  Navigation error: ${e.message}`);
    });

    // Wait a bit
    await new Promise(r => setTimeout(r, 3000));

    const cfCheck = await checkCloudflare(page);
    console.log(`  Page title: "${cfCheck.title}"`);
    console.log(`  Cloudflare detected: ${cfCheck.isCloudflare}`);

    if (cfCheck.isCloudflare) {
      console.log(`  ❌ BLOCKED by Cloudflare!`);
      console.log(`  Body snippet: ${cfCheck.bodySnippet.substring(0, 200)}`);
    } else {
      // Try to find chapter links (comix) or content (nhentai)
      const hasContent = await page.evaluate(() => {
        const chapterLinks = document.querySelectorAll('a[href*="chapter-"]');
        const galleryContent = document.querySelector('#info, .gallery');
        return {
          chapterLinksCount: chapterLinks.length,
          hasGalleryContent: !!galleryContent,
          h1: document.querySelector('h1')?.textContent?.trim() || 'none'
        };
      });
      console.log(`  ✅ Page loaded successfully`);
      console.log(`  H1: ${hasContent.h1}`);
      console.log(`  Chapter links found: ${hasContent.chapterLinksCount}`);
      console.log(`  Has gallery content: ${hasContent.hasGalleryContent}`);
    }

    return !cfCheck.isCloudflare;
  } finally {
    await browser.close();
  }
}

async function testWithStealthPuppeteer(url, label) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${label} with STEALTH puppeteer: ${url}`);
  console.log('='.repeat(60));

  const browser = await puppeteerExtra.launch({
    ...CONFIG.puppeteer,
    headless: true
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    console.log('  Navigating...');
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }).catch(e => {
      console.log(`  Navigation error: ${e.message}`);
    });

    // Wait a bit and check for Cloudflare
    await new Promise(r => setTimeout(r, 3000));

    let cfCheck = await checkCloudflare(page);
    
    // If cloudflare detected, wait longer
    if (cfCheck.isCloudflare) {
      console.log('  Cloudflare challenge detected, waiting up to 30s...');
      const startTime = Date.now();
      while (Date.now() - startTime < 30000) {
        await new Promise(r => setTimeout(r, 3000));
        cfCheck = await checkCloudflare(page);
        if (!cfCheck.isCloudflare) break;
        console.log('  Still waiting for Cloudflare...');
      }
    }

    console.log(`  Page title: "${cfCheck.title}"`);
    console.log(`  Cloudflare detected: ${cfCheck.isCloudflare}`);

    if (cfCheck.isCloudflare) {
      console.log(`  ❌ Still BLOCKED by Cloudflare even with stealth!`);
      console.log(`  Body snippet: ${cfCheck.bodySnippet.substring(0, 200)}`);
    } else {
      const hasContent = await page.evaluate(() => {
        const chapterLinks = document.querySelectorAll('a[href*="chapter-"]');
        const galleryContent = document.querySelector('#info, .gallery');
        return {
          chapterLinksCount: chapterLinks.length,
          hasGalleryContent: !!galleryContent,
          h1: document.querySelector('h1')?.textContent?.trim() || 'none'
        };
      });
      console.log(`  ✅ Page loaded successfully`);
      console.log(`  H1: ${hasContent.h1}`);
      console.log(`  Chapter links found: ${hasContent.chapterLinksCount}`);
      console.log(`  Has gallery content: ${hasContent.hasGalleryContent}`);
    }

    return !cfCheck.isCloudflare;
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Scraper Cloudflare Test');
  console.log('Testing both plain and stealth puppeteer against comix.to and nhentai.net\n');

  const results = {};

  // Test comix.to
  results.comixPlain = await testWithPlainPuppeteer(COMIX_TEST_URL, 'comix.to');
  results.comixStealth = await testWithStealthPuppeteer(COMIX_TEST_URL, 'comix.to');

  // Test nhentai
  results.nhentaiPlain = await testWithPlainPuppeteer(NHENTAI_TEST_URL, 'nhentai.net');
  results.nhentaiStealth = await testWithStealthPuppeteer(NHENTAI_TEST_URL, 'nhentai.net');

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`comix.to   - Plain:   ${results.comixPlain ? '✅ OK' : '❌ BLOCKED'}`);
  console.log(`comix.to   - Stealth: ${results.comixStealth ? '✅ OK' : '❌ BLOCKED'}`);
  console.log(`nhentai    - Plain:   ${results.nhentaiPlain ? '✅ OK' : '❌ BLOCKED'}`);
  console.log(`nhentai    - Stealth: ${results.nhentaiStealth ? '✅ OK' : '❌ BLOCKED'}`);
  
  if (!results.comixPlain && results.comixStealth) {
    console.log('\n⚠️  comix.to needs stealth plugin (like nhentai already uses)');
  }
  if (!results.comixPlain && !results.comixStealth) {
    console.log('\n⚠️  comix.to blocks even stealth puppeteer - may need additional bypass');
  }
  if (!results.nhentaiStealth) {
    console.log('\n⚠️  nhentai blocks even stealth puppeteer - may need additional bypass');
  }
}

main().catch(console.error);
