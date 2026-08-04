/**
 * Settings Routes - Application settings management
 */

import express from 'express';
import { readerSettingsDb } from '../database.js';
import { getPrimaryAdminId } from '../db/connection.js';

const router = express.Router();

// Demo tokens (id 0, no users row) read the primary admin's settings so the
// demo page keeps working; writes are blocked upstream, but guard anyway.
const settingsUserId = (req) =>
    req.user.role === 'demo' ? getPrimaryAdminId() : req.user.id;

/**
 * Get all settings
 */
router.get('/', (req, res) => {
    try {
        const settings = readerSettingsDb.getAll(settingsUserId(req));
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update a setting
 */
router.post('/', (req, res) => {
    try {
        if (req.user.role === 'demo') {
            return res.status(403).json({ error: 'Not available in the demo', demo: true });
        }
        const { key, value } = req.body;
        if (!key) {
            return res.status(400).json({ error: 'Key is required' });
        }

        readerSettingsDb.set(req.user.id, key, value);
        res.json({ success: true, key, value });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Bulk update settings
 */
router.post('/bulk', (req, res) => {
    try {
        if (req.user.role === 'demo') {
            return res.status(403).json({ error: 'Not available in the demo', demo: true });
        }
        const settings = req.body;
        if (typeof settings !== 'object') {
            return res.status(400).json({ error: 'Invalid settings object' });
        }

        const results = [];
        for (const [key, value] of Object.entries(settings)) {
            readerSettingsDb.set(req.user.id, key, value);
            results.push(key);
        }

        res.json({ success: true, updated: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
