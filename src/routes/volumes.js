/**
 * Volumes Routes - Create, manage, and cover volumes
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import multer from 'multer';
import { bookmarkDb } from '../database.js';
import { downloader } from '../downloader.js';
import { CONFIG } from '../config.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();

// Create a volume
router.post('/:id/volumes', async (req, res) => {
    try {
        const { name, chapters } = req.body;
        if (!name || !chapters || !Array.isArray(chapters)) {
            return res.status(400).json({ error: 'Name and chapters array required' });
        }

        const volume = bookmarkDb.createVolume(req.params.id, name, chapters);
        res.json({ success: true, volume });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload volume cover
router.post('/:id/volumes/:volumeId/cover', upload.single('cover'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { volumeId } = req.params;
        const ext = path.extname(req.file.originalname) || '.jpg';
        const filename = `volume_${volumeId}_${Date.now()}${ext}`;

        const coversDir = path.join(CONFIG.dataDir, 'covers', 'volumes');
        await fs.ensureDir(coversDir);

        const filePath = path.join(coversDir, filename);

        await sharp(req.file.buffer)
            .resize(600)
            .jpeg({ quality: 90 })
            .toFile(filePath);

        const urlPath = `/covers/volumes/${filename}`;
        bookmarkDb.updateVolume(volumeId, { cover: urlPath });

        res.json({ success: true, cover: urlPath });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Set volume cover from chapter
router.post('/:id/volumes/:volumeId/cover/from-chapter', async (req, res) => {
    try {
        const { volumeId } = req.params;
        const { chapterNumber, filename } = req.body;

        if (chapterNumber === undefined) {
            return res.status(400).json({ error: 'Chapter number required' });
        }

        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        const versions = await downloader.getExistingVersions(bookmark.title, chapterNumber, bookmark.alias);
        const validVersion = versions.find(v => v.imageCount > 0);

        if (!validVersion) {
            return res.status(404).json({ error: 'Chapter not downloaded or empty. Please download it first.' });
        }

        const files = await fs.readdir(validVersion.path);
        const images = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        images.sort(collator.compare);

        if (images.length === 0) {
            return res.status(404).json({ error: 'No images found in chapter folder' });
        }

        let sourceFile = images[0];
        if (filename) {
            const found = images.find(f => f === filename);
            if (found) {
                sourceFile = found;
            } else {
                console.warn(`Requested cover filename '${filename}' not found in chapter, defaulting to first page.`);
            }
        }

        const sourcePath = path.join(validVersion.path, sourceFile);

        const ext = path.extname(sourcePath);
        const dstFilename = `volume_${volumeId}_${Date.now()}${ext}`;
        const coversDir = path.join(CONFIG.dataDir, 'covers', 'volumes');
        await fs.ensureDir(coversDir);
        const destPath = path.join(coversDir, dstFilename);

        await sharp(sourcePath)
            .resize(600)
            .jpeg({ quality: 90 })
            .toFile(destPath);

        const urlPath = `/covers/volumes/${dstFilename}`;
        bookmarkDb.updateVolume(volumeId, { cover: urlPath });

        res.json({ success: true, cover: urlPath });

    } catch (error) {
        console.error('Set cover from chapter error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rename a volume
router.put('/:id/volumes/:volumeId/rename', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Volume name required' });
        }

        bookmarkDb.updateVolume(req.params.volumeId, { name: name.trim() });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reorder a volume
router.post('/:id/volumes/:volumeId/reorder', async (req, res) => {
    try {
        const { direction } = req.body;
        if (!direction || !['up', 'down'].includes(direction)) {
            return res.status(400).json({ error: 'Direction must be "up" or "down"' });
        }

        bookmarkDb.reorderVolume(req.params.id, req.params.volumeId, direction);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a volume
router.delete('/:id/volumes/:volumeId', async (req, res) => {
    try {
        bookmarkDb.deleteVolume(req.params.volumeId);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
