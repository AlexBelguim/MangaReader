/**
 * Artists Routes - Manage artists and artist-bookmark associations
 */

import express from 'express';
import { artistDb } from '../database.js';

const router = express.Router();

// Get all artists
router.get('/', (req, res) => {
    try {
        const artists = artistDb.getAll();
        res.json({ artists });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bookmarks by artist
router.get('/:id/bookmarks', (req, res) => {
    try {
        const bookmarks = artistDb.getBookmarksByArtist(parseInt(req.params.id));
        res.json({ bookmarks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create artist
router.post('/', (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Artist name required' });
        }
        const artist = artistDb.create(name);
        res.json({ success: true, artist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rename artist
router.patch('/:id', (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Artist name required' });
        }
        artistDb.rename(parseInt(req.params.id), name);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete artist
router.delete('/:id', (req, res) => {
    try {
        artistDb.delete(parseInt(req.params.id));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
