/**
 * Data Routes - Chapter settings, trophy pages, reader settings, push notifications
 */

import express from 'express';
import { bookmarkDb, chapterSettingsDb, trophyDb, readerSettingsDb, getDb } from '../database.js';
import { getPrimaryAdminId } from '../db/connection.js';
import { getChallenges, clearChallenge } from '../scrapers/util/challenge.js';

const router = express.Router();

// ==================== SITE STATUS ====================

// Sites currently showing a human-verification check (see scrapers/util/challenge.js)
router.get('/site-status', (req, res) => {
    res.json({ challenges: getChallenges() });
});

// The user completed the check in their browser: resume automated checks
router.post('/site-status/clear', (req, res) => {
    const { site } = req.body || {};
    if (!site) return res.status(400).json({ error: 'site is required' });
    res.json({ success: true, cleared: clearChallenge(site) });
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
