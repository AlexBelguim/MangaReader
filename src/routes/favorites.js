/**
 * Favorites Routes - Manage favorite page collections
 */

import express from 'express';
import { favoritesDb } from '../database.js';

const router = express.Router();

// Get all favorites
router.get('/', (req, res) => {
    try {
        const data = favoritesDb.getAll(req.user.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save all favorites (full replace)
router.put('/', async (req, res) => {
    try {
        const { favorites, listOrder } = req.body;
        favoritesDb.saveAll(req.user.id, { favorites: favorites || {}, listOrder: listOrder || [] });
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
        const result = favoritesDb.createList(req.user.id, name);
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
        favoritesDb.deleteList(req.user.id, name);
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
        const result = favoritesDb.renameList(req.user.id, oldName, newName);
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
        favoritesDb.addFavorite(req.user.id, listName, favorite);
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
        const result = favoritesDb.removeFavorite(req.user.id, listName, index);
        if (!result.success) return res.status(400).json({ error: result.error });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
