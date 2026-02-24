/**
 * Series Routes - Manage manga series (groups of bookmarks)
 */

import express from 'express';
import { seriesDb } from '../database.js';

const router = express.Router();

// Get all series
router.get('/', (req, res) => {
    try {
        const series = seriesDb.getAll();
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bookmarks not in any series
router.get('/available-bookmarks', (req, res) => {
    try {
        const bookmarks = seriesDb.getBookmarksNotInSeries();
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new series
router.post('/', (req, res) => {
    try {
        const { title, alias } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ error: 'Title required' });
        }
        const series = seriesDb.create(title.trim(), alias?.trim() || null);
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a series by ID
router.get('/:id', (req, res) => {
    try {
        const series = seriesDb.getById(req.params.id);
        if (!series) {
            return res.status(404).json({ error: 'Series not found' });
        }
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a series
router.patch('/:id', (req, res) => {
    try {
        const { title, alias, cover_entry_id } = req.body;
        const series = seriesDb.update(req.params.id, { title, alias, cover_entry_id });
        res.json(series);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a series
router.delete('/:id', (req, res) => {
    try {
        seriesDb.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add entry to series
router.post('/:id/entries', (req, res) => {
    try {
        const { bookmarkId, order } = req.body;
        if (!bookmarkId) {
            return res.status(400).json({ error: 'Bookmark ID required' });
        }
        const entry = seriesDb.addEntry(req.params.id, bookmarkId, order);
        res.json(entry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove entry from series
router.delete('/:id/entries/:entryId', (req, res) => {
    try {
        seriesDb.removeEntry(req.params.entryId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reorder entries in a series
router.post('/:id/reorder', (req, res) => {
    try {
        const { entryIds } = req.body;
        if (!entryIds || !Array.isArray(entryIds)) {
            return res.status(400).json({ error: 'Entry IDs array required' });
        }
        seriesDb.reorderEntries(req.params.id, entryIds);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Set cover entry for series
router.post('/:id/cover', (req, res) => {
    try {
        const { entryId } = req.body;
        seriesDb.setCoverEntry(req.params.id, entryId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
