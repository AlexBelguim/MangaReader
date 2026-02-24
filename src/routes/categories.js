/**
 * Categories Routes - Manage bookmark categories
 */

import express from 'express';
import { categoryDb, bookmarkDb } from '../database.js';

const router = express.Router();

// Get all categories
router.get('/', (req, res) => {
    try {
        const categories = categoryDb.getAll();
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a category
router.post('/', (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Category name required' });
        }
        const result = categoryDb.add(name);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a category
router.delete('/:name', (req, res) => {
    try {
        const result = categoryDb.delete(decodeURIComponent(req.params.name));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
