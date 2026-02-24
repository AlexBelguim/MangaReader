/**
 * Settings Routes - Application settings management
 */

import express from 'express';
import { readerSettingsDb } from '../database.js';

const router = express.Router();

/**
 * Get all settings
 */
router.get('/', (req, res) => {
    try {
        const settings = readerSettingsDb.getAll();
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
        const { key, value } = req.body;
        if (!key) {
            return res.status(400).json({ error: 'Key is required' });
        }

        readerSettingsDb.set(key, value);
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
        const settings = req.body;
        if (typeof settings !== 'object') {
            return res.status(400).json({ error: 'Invalid settings object' });
        }

        const results = [];
        for (const [key, value] of Object.entries(settings)) {
            readerSettingsDb.set(key, value);
            results.push(key);
        }

        res.json({ success: true, updated: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
