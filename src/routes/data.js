/**
 * Data Routes - Chapter settings, trophy pages, reader settings, push notifications
 */

import express from 'express';
import { chapterSettingsDb, trophyDb, readerSettingsDb, getDb } from '../database.js';

const router = express.Router();

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
        res.json(trophyDb.getAll());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/trophy-pages', async (req, res) => {
    try {
        trophyDb.saveAll(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/trophy-pages/:mangaId/:chapterNum', async (req, res) => {
    try {
        trophyDb.save(req.params.mangaId, parseFloat(req.params.chapterNum), req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/trophy-pages/:mangaId/:chapterNum', async (req, res) => {
    try {
        res.json(trophyDb.getForChapter(req.params.mangaId, parseFloat(req.params.chapterNum)));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== READER SETTINGS ====================

router.get('/reader-settings', async (req, res) => {
    try {
        res.json(readerSettingsDb.getAll());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/reader-settings', async (req, res) => {
    try {
        for (const [key, value] of Object.entries(req.body)) {
            readerSettingsDb.set(key, value);
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
