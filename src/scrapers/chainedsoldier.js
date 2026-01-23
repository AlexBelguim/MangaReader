import puppeteer from 'puppeteer';
import { CONFIG } from '../config.js';
import { BaseScraper } from './base.js';

/**
 * Scraper for chained-soldier.live website
 */
export class ChainedSoldierScraper extends BaseScraper {
    get websiteName() {
        return 'chained-soldier.live';
    }

    get urlPatterns() {
        return ['chained-soldier.live'];
    }

    get supportsQuickCheck() {
        return false;
    }

    // Not implemented as the user requested only chapter scraping
    async getMangaInfo(url) {
        throw new Error('Manga info scraping not supported for this site. Use specific chapter URLs.');
    }

    async getChapterImages(url) {
        // Launch specific browser for this scraper to use "headless: new" and specific viewport
        // This isolates the configuration from other scrapers
        console.log('  Launching dedicated browser for Chained Soldier (Headless: New)...');

        // Merge config but override headless and viewport
        const launchOptions = {
            ...CONFIG.puppeteer,
            headless: true,
            defaultViewport: { width: 1920, height: 1080 }
        };

        const browser = await puppeteer.launch(launchOptions);
        let page = null;

        try {
            page = await browser.newPage();

            // Set User Agent explicitly (copied from BaseScraper for consistency)
            await page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            );

            // Set a fixed large viewport (redundant with launch arg but good for safety)
            await page.setViewport({ width: 1920, height: 1080 });

            console.log(`  Scraping chapter images from: ${url}`);
            await page.goto(url, {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            // Wait for cloudflare/browser check if any
            await this.randomDelay(2000, 4000);

            // Check for selector found during research
            await page.waitForSelector('.images-container img', { timeout: 15000 }).catch(e => console.log('  Warning: Main selector not found immediately'));

            // Robust scrolling logic
            console.log('  Scrolling to trigger lazy load...');
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let lastScrollY = window.scrollY;
                    let sameCount = 0;
                    const distance = 300;

                    const timer = setInterval(() => {
                        window.scrollBy(0, distance);

                        // Check if we are stuck or at bottom
                        if (window.scrollY === lastScrollY) {
                            sameCount++;
                            if (sameCount > 10) { // 2 seconds of no movement
                                clearInterval(timer);
                                resolve();
                            }
                        } else {
                            sameCount = 0;
                        }
                        lastScrollY = window.scrollY;
                    }, 200);

                    // Safety timeout
                    setTimeout(() => {
                        clearInterval(timer);
                        resolve();
                    }, 60000);
                });
            });

            // Wait a bit after scroll for final images
            await this.randomDelay(2000, 3000);

            // Wait function to ensure images look loaded
            await page.waitForFunction(() => {
                const imgs = document.querySelectorAll('.images-container img');
                if (imgs.length <= 1) return false;
                return true;
            }, { timeout: 10000 }).catch(() => console.log('  Warning: Wait for images timeout'));

            // Extract images
            const images = await page.evaluate(() => {
                let imgElements = document.querySelectorAll('.images-container img');

                // Fallback
                if (imgElements.length === 0) {
                    imgElements = document.querySelectorAll('.entry-content img, .chapter-content img, img[lazyload]');
                }

                const imageUrls = [];
                const seenUrls = new Set();
                let index = 1;

                imgElements.forEach((img) => {
                    let src = img.getAttribute('src') || img.getAttribute('data-src') || img.src;

                    if (img.offsetParent === null) return;

                    if (src &&
                        !src.includes('loading') &&
                        !src.includes('placeholder') &&
                        !src.includes('pixel') &&
                        !img.classList.contains('kofiimg') &&
                        !src.includes('ko-fi.com') &&
                        !seenUrls.has(src)) {

                        seenUrls.add(src);

                        if (src.startsWith('//')) {
                            src = 'https:' + src;
                        } else if (src.startsWith('/')) {
                            src = window.location.origin + src;
                        }

                        try {
                            const urlObj = new URL(src);
                            if (urlObj.search && urlObj.search.includes('time')) {
                                src = src.split('?')[0];
                            }
                        } catch (e) { }

                        imageUrls.push({
                            index: index++,
                            url: src
                        });
                    }
                });

                return imageUrls;
            });

            console.log(`  Found ${images.length} images`);
            return images;

        } finally {
            if (page) await page.close().catch(() => { });
            await browser.close().catch(() => { });
        }
    }
}
