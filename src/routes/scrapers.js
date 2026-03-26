import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { scraperFactory } from '../scrapers/index.js';
import { CONFIG } from '../config.js';

const router = express.Router();

// Search cover cache directory
const SEARCH_CACHE_DIR = path.join(CONFIG.dataDir, 'covers', 'search-cache');

/**
 * Download a cover image to the search cache directory
 * Returns the local URL path or null on failure
 */
async function cacheSearchCover(coverUrl, index) {
  if (!coverUrl) return null;

  try {
    let fullUrl = coverUrl;
    if (coverUrl.startsWith('//')) fullUrl = 'https:' + coverUrl;

    // Determine file extension from URL
    const urlPath = new URL(fullUrl).pathname.toLowerCase();
    let ext = '.jpg';
    if (urlPath.includes('.png')) ext = '.png';
    else if (urlPath.includes('.webp')) ext = '.webp';
    else if (urlPath.includes('.gif')) ext = '.gif';

    const fileName = `search_${index}${ext}`;
    const filePath = path.join(SEARCH_CACHE_DIR, fileName);

    // Use the parent site as referer, not the CDN host
    // e.g. for static.comix.to images, referer should be comix.to
    const urlObj = new URL(fullUrl);
    const hostParts = urlObj.hostname.split('.');
    const parentDomain = hostParts.length > 2 
      ? hostParts.slice(-2).join('.') 
      : urlObj.hostname;
    const referer = `https://${parentDomain}/`;

    const response = await fetch(fullUrl, {
      headers: {
        'Referer': referer,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return `/covers/search-cache/${fileName}`;
  } catch (e) {
    return null;
  }
}

/**
 * Clear all cached search covers
 */
async function clearSearchCache() {
  try {
    if (await fs.pathExists(SEARCH_CACHE_DIR)) {
      await fs.emptyDir(SEARCH_CACHE_DIR);
    }
  } catch (e) {
    console.warn('[API] Failed to clear search cache:', e.message);
  }
}

/**
 * @route GET /api/scrapers/search
 * @desc Search across scrapers for manga titles
 * @access Public/Private
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q;
    const targetScraper = req.query.scraper || 'all';
    
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    console.log(`[API] Scraper search for: "${query}" (Target: ${targetScraper})`);
    
    // Clear previous search cover cache
    await clearSearchCache();
    await fs.ensureDir(SEARCH_CACHE_DIR);
    
    let results = [];
    
    if (targetScraper === 'all') {
      results = await scraperFactory.searchAll(query);
    } else {
      const scraper = scraperFactory.getScraperForUrl(targetScraper);
      // Fallback: if they just provided the name instead of a URL
      const actualScraper = scraper || scraperFactory.scrapers.find(s => s.websiteName === targetScraper);
      
      if (!actualScraper) {
        return res.status(404).json({ error: `Scraper not found: ${targetScraper}` });
      }
      
      if (!actualScraper.supportsSearch) {
        return res.status(400).json({ error: `Scraper does not support search: ${targetScraper}` });
      }
      
      const rawResults = await actualScraper.search(query);
      results = rawResults.map(r => ({ ...r, website: actualScraper.websiteName }));
    }
    
    // Sort results by chapter count descending
    results.sort((a, b) => (b.chapterCount || 0) - (a.chapterCount || 0));
    
    // Download covers in parallel and replace with local paths
    console.log(`[API] Caching ${results.length} search cover images...`);
    await Promise.all(results.map(async (result, i) => {
      const localPath = await cacheSearchCover(result.cover, i);
      if (localPath) {
        result.cover = localPath;
      }
    }));
    
    res.json({
      success: true,
      query,
      targetScraper,
      count: results.length,
      results
    });
  } catch (error) {
    console.error('[API] Scraper search error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/scrapers/list
 * @desc Get list of all available scrapers and if they support search
 */
router.get('/list', (req, res) => {
  try {
    const list = scraperFactory.scrapers.map(s => ({
      name: s.websiteName,
      supportsSearch: s.supportsSearch,
      urlPatterns: s.urlPatterns
    }));
    
    res.json({ success: true, scrapers: list });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/scrapers/proxy-cover
 * @desc Proxy external cover images to bypass hotlink protection
 */
router.get('/proxy-cover', async (req, res) => {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send('Missing url');
    
    const response = await fetch(imageUrl, {
      headers: {
        'Referer': new URL(imageUrl).origin + '/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) return res.status(response.status).send('Failed to fetch image');
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (e) {
    res.status(500).send('Proxy error');
  }
});

export default router;
