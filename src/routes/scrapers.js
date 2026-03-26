import express from 'express';
import { scraperFactory } from '../scrapers/index.js';

const router = express.Router();

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
