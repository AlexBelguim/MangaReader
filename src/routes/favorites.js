/**
 * Favorites Routes - Manage favorite page collections
 */

import express from 'express';
import { favoritesDb } from '../database.js';

const router = express.Router();

// Get all favorites
router.get('/', (req, res) => {
    try {
        const data = favoritesDb.getAll();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save all favorites (full replace)
router.put('/', async (req, res) => {
    try {
        const { favorites, listOrder } = req.body;
        favoritesDb.saveAll({ favorites: favorites || {}, listOrder: listOrder || [] });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create list
router.post('/lists', (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'List name required' });
        }
        const result = favoritesDb.createList(name);
        if (!result.success) return res.status(400).json({ error: result.error });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete list
router.delete('/lists/:name', (req, res) => {
    try {
        const name = decodeURIComponent(req.params.name);
        favoritesDb.deleteList(name);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rename list
router.patch('/lists/:name', (req, res) => {
    try {
        const oldName = decodeURIComponent(req.params.name);
        const { newName } = req.body;
        if (!newName) {
            return res.status(400).json({ error: 'New name required' });
        }
        const result = favoritesDb.renameList(oldName, newName);
        if (!result.success) return res.status(400).json({ error: result.error });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a favorite to a list
router.post('/lists/:name/items', (req, res) => {
    try {
        const listName = decodeURIComponent(req.params.name);
        const favorite = req.body;
        favoritesDb.addFavorite(listName, favorite);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove a favorite from a list
router.delete('/lists/:name/items/:index', (req, res) => {
    try {
        const listName = decodeURIComponent(req.params.name);
        const index = parseInt(req.params.index, 10);
        const result = favoritesDb.removeFavorite(listName, index);
        if (!result.success) return res.status(400).json({ error: result.error });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
