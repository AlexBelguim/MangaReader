/**
 * Data Routes - Chapter settings, trophy pages, reader settings, push notifications
 */

import express from 'express';
import { bookmarkDb, chapterSettingsDb, trophyDb, readerSettingsDb, getDb } from '../database.js';
import { getPrimaryAdminId } from '../db/connection.js';
import { getChallenges, clearChallenge } from '../scrapers/util/challenge.js';
import {
    parseCookieInput, sanitiseUserAgent, setSiteSession, clearSiteSession, markSiteSessionStale,
    listSiteSessions, purgeSiteCookiesFromBrowser, hasSiteSession
} from '../scrapers/util/site-session.js';
import { scraperFactory } from '../scrapers/index.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ==================== SITE STATUS ====================

// Sites currently showing a human-verification check (see
// scrapers/util/challenge.js) and the sessions an admin handed over for
// sites (scrapers/util/site-session.js). Never cookie values; cookie names
// and the admin's browser user agent only for admins.
router.get('/site-status', (req, res) => {
    const detailed = req.user?.role === 'admin';
    res.json({ challenges: getChallenges(), sessions: listSiteSessions({ detailed }) });
});

// Try the cookies already saved for a site. The app flags a session when
// its stored expiry passes or the site showed its check once, but the site
// often still accepts it (it renews the cookie while it is used). This
// loads the site with the saved cookies and, if real content comes back,
// lifts the block - no puzzle needed.
router.post('/site-status/verify', requireAdmin, async (req, res) => {
    try {
        const { site } = req.body || {};
        if (!site || typeof site !== 'string') return res.status(400).json({ error: 'site is required' });
        const scraper = findScraper(site);
        if (!scraper || typeof scraper.checkAccess !== 'function') {
            return res.status(400).json({ error: `${site} cannot be tested` });
        }
        if (!hasSiteSession(site)) {
            return res.status(400).json({ error: `No saved cookies for ${site} to try` });
        }
        const probe = await probeSite(scraper);
        if (probe.ok) {
            clearChallenge(site);
        } else if (probe.blocked) {
            markSiteSessionStale(site, 'The site showed its check when the saved cookies were tried');
        }
        res.json({ success: true, probe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// The user completed the check in their browser: resume automated checks
router.post('/site-status/clear', (req, res) => {
    const { site } = req.body || {};
    if (!site) return res.status(400).json({ error: 'site is required' });
    res.json({ success: true, cleared: clearChallenge(site) });
});

// Only sites we scrape can have a session; the name is also used as a key
// in the store, so it must be one of ours rather than free text.
function findScraper(site) {
    return scraperFactory.scrapers.find(s => s.websiteName === site) || null;
}

// One access probe per site at a time. A second import while one is running
// queues behind it (rather than sharing its result, which would judge the
// new cookies by the old paste), so each import gets its own verdict.
const probesInFlight = new Map();
function probeSite(scraper) {
    const site = scraper.websiteName;
    const previous = probesInFlight.get(site) || Promise.resolve();
    const run = previous.catch(() => { }).then(async () => {
        if (!scraperFactory.browser) await scraperFactory.init();
        return scraper.checkAccess();
    });
    probesInFlight.set(site, run);
    run.finally(() => {
        if (probesInFlight.get(site) === run) probesInFlight.delete(site);
    }).catch(() => { });
    return run;
}

// The user completed the site's check in their own browser and pasted that
// browser's cookies (and, usually, its user agent). Save them for the
// scrapers, then load the site once to see whether it accepts them.
// Admin only: the cookies act for every user's downloads and are stored on
// the server.
router.post('/site-status/session', requireAdmin, async (req, res) => {
    try {
        const { site, cookies, userAgent, probe = true } = req.body || {};
        if (!site || typeof site !== 'string') return res.status(400).json({ error: 'site is required' });
        const scraper = findScraper(site);
        if (!scraper || !scraper.supportsSession) {
            return res.status(400).json({ error: `${site} does not take a handed-over session` });
        }
        if (cookies === undefined || cookies === null || cookies === '') {
            return res.status(400).json({ error: 'cookies are required' });
        }
        if (typeof cookies === 'string' && cookies.length > 200_000) {
            return res.status(400).json({ error: 'That is too much text to be a cookie export' });
        }

        const parsed = parseCookieInput(cookies, site);
        if (parsed.cookies.length === 0) {
            const { foreign, expired, invalid } = parsed.ignored;
            let why = 'No cookies recognised in the pasted text. Paste a Cookie-Editor export (JSON or Header String), a cookies.txt, or name=value pairs.';
            if (foreign && !expired && !invalid) {
                why = foreign === 1
                    ? `That cookie belongs to another site, not ${site}. Export from the ${site} tab.`
                    : `Those ${foreign} cookies belong to other sites; none are for ${site}. Export from the ${site} tab.`;
            }
            else if (expired && !foreign && !invalid) why = `Every ${site} cookie in the paste has already expired. Complete the check again and export right away.`;
            return res.status(400).json({ error: why, ignored: parsed.ignored, format: parsed.format });
        }

        // The shared browser's profile may still hold this site's cookies
        // from earlier scrapes (FlareSolverr's Cloudflare clearance, bound
        // to another identity). Clear them so the page presents only the
        // handed-over identity, and nothing foreign gets merged back into
        // the saved session later.
        if (scraperFactory.browser) await purgeSiteCookiesFromBrowser(scraperFactory.browser, site);

        const session = setSiteSession(site, {
            cookies: parsed.cookies,
            userAgent: sanitiseUserAgent(userAgent),
            source: `import:${parsed.format}`
        });

        let probeResult = null;
        if (probe && typeof scraper.checkAccess === 'function') {
            probeResult = await probeSite(scraper);
            if (probeResult.ok) {
                clearChallenge(site);
            } else if (probeResult.blocked) {
                // The site saw the cookies and still asked for the check:
                // say so everywhere the session is shown, not just here.
                markSiteSessionStale(site, 'The site showed its check to the server right after these cookies were saved');
            }
            // Otherwise (load error, Cloudflare not cleared, HTTP error)
            // nothing is known about the cookies yet; the session stays as is.
        }

        // The probe may have flagged the session; report its current state.
        const current = listSiteSessions().find(s => s.site === site) || session;
        res.json({ success: true, session: current, ignored: parsed.ignored, format: parsed.format, probe: probeResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Forget a site's saved session, and scrub its cookies from the shared browser
router.delete('/site-status/session', requireAdmin, async (req, res) => {
    try {
        const { site } = req.body || {};
        if (!site || typeof site !== 'string') return res.status(400).json({ error: 'site is required' });
        if (!findScraper(site)) return res.status(400).json({ error: `Unknown site: ${site}` });
        const cleared = clearSiteSession(site);
        // The cookies also sit in the shared browser's profile; take them out
        // of there too (start it if needed so the purge can run).
        if (!scraperFactory.browser) {
            await scraperFactory.init().catch(e => console.warn(`[SiteSession] Browser unavailable for purge: ${e.message}`));
        }
        const purged = await purgeSiteCookiesFromBrowser(scraperFactory.browser, site);
        res.json({
            success: true,
            cleared,
            purged,
            warning: purged === null ? 'Cookies may remain in the scraper browser until it restarts' : undefined
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== VOLUMES (whole library) ====================

// All volumes grouped per manga — only manga that actually have volumes.
// Powers the slideshow settings picker and the slideshow view.
router.get('/volumes', async (req, res) => {
    try {
        const userId = req.user.role === 'demo' ? getPrimaryAdminId() : req.user.id;
        let manga = bookmarkDb.getAllVolumes(userId);
        // Demo visitors only ever see demo-flagged bookmarks
        if (req.user.role === 'demo') manga = manga.filter(m => m.isDemo);
        res.json(manga);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== CHAPTER SETTINGS ====================

router.get('/chapter-settings', async (req, res) => {
    try {
        const data = chapterSettingsDb.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/chapter-settings/:mangaId', async (req, res) => {
    try {
        const allSettings = chapterSettingsDb.getAll();
        res.json(allSettings[req.params.mangaId] || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/chapter-settings/:mangaId/:chapterNum', async (req, res) => {
    try {
        chapterSettingsDb.save(req.params.mangaId, parseFloat(req.params.chapterNum), req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/chapter-settings', async (req, res) => {
    try {
        chapterSettingsDb.saveAll(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== TROPHY PAGES ====================

router.get('/trophy-pages', async (req, res) => {
    try {
        res.json(trophyDb.getAll(req.user.id));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/trophy-pages', async (req, res) => {
    try {
        trophyDb.saveAll(req.user.id, req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/trophy-pages/:mangaId/:chapterNum', async (req, res) => {
    try {
        trophyDb.save(req.user.id, req.params.mangaId, parseFloat(req.params.chapterNum), req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/trophy-pages/:mangaId/all', async (req, res) => {
    try {
        res.json(trophyDb.getForManga(req.user.id, req.params.mangaId));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/trophy-pages/:mangaId/:chapterNum', async (req, res) => {
    try {
        res.json(trophyDb.getForChapter(req.user.id, req.params.mangaId, parseFloat(req.params.chapterNum)));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== READER SETTINGS ====================

router.get('/reader-settings', async (req, res) => {
    try {
        // Demo tokens (id 0, no users row) read the primary admin's settings
        const userId = req.user.role === 'demo' ? getPrimaryAdminId() : req.user.id;
        res.json(readerSettingsDb.getAll(userId));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/reader-settings', async (req, res) => {
    try {
        for (const [key, value] of Object.entries(req.body)) {
            readerSettingsDb.set(req.user.id, key, value);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PUSH NOTIFICATIONS ====================

router.post('/push/subscribe', async (req, res) => {
    try {
        const { endpoint, keys } = req.body;
        if (!endpoint) return res.status(400).json({ error: 'Endpoint required' });

        const db = getDb();
        const now = new Date().toISOString();
        db.prepare('INSERT OR REPLACE INTO push_subscriptions (endpoint, keys, created_at) VALUES (?, ?, ?)')
            .run(endpoint, JSON.stringify(keys || {}), now);

        console.log('[Push] Subscription saved:', endpoint.substring(0, 50) + '...');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/push/unsubscribe', async (req, res) => {
    try {
        const { endpoint } = req.body;
        if (!endpoint) return res.status(400).json({ error: 'Endpoint required' });

        const db = getDb();
        db.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').run(endpoint);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/push/status', (req, res) => {
    try {
        const db = getDb();
        const count = db.prepare('SELECT COUNT(*) as count FROM push_subscriptions').get();
        res.json({ subscriptionCount: count.count, pushEnabled: count.count > 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/push/pending', (req, res) => {
    const notifications = global.pendingNotifications || [];
    global.pendingNotifications = [];
    res.json({ notifications });
});

export default router;
