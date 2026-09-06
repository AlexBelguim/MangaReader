/**
 * Volumes Routes - Create, manage, and cover volumes
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import multer from 'multer';
import { bookmarkDb } from '../database.js';
import { getPrimaryAdminId } from '../db/connection.js';
import { downloader } from '../downloader.js';
import { CONFIG } from '../config.js';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const router = express.Router();

// Library owner this request acts on: demo tokens (id 0) read the primary
// admin's library, everyone else their own.
const ownerId = (req) => req.user?.role === 'demo' ? getPrimaryAdminId() : req.user.id;

// ==================== RELEASE VOLUMES (own pages) ====================

// Pages of a volume release for the reader, with the caller's position
router.get('/:id/volumes/:volumeId/pages', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id, ownerId(req));
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });
        const volume = bookmarkDb.getVolumeById(req.params.volumeId);
        if (!volume || volume.bookmarkId !== bookmark.id) return res.status(404).json({ error: 'Volume not found' });
        if (volume.kind !== 'release' || !volume.folder) return res.status(400).json({ error: 'This volume has no pages of its own; open its chapters instead' });

        const dir = path.join(downloader.getMangaDir(bookmark.title, bookmark.alias), volume.folder);
        const images = await downloader.getImagesFromDir(dir);
        if (!images || images.length === 0) return res.status(404).json({ error: 'The volume folder has no pages on disk' });

        // Neighbouring release volumes, for next/previous in the reader
        const releases = (bookmark.volumes || []).filter(v => v.kind === 'release' && v.folder)
            .sort((a, b) => (a.number ?? 0) - (b.number ?? 0) || a.displayOrder - b.displayOrder);
        const idx = releases.findIndex(v => v.id === volume.id);
        const progress = req.user?.id ? (bookmarkDb.getVolumeProgress(req.user.id, bookmark.id)[volume.id] || null) : null;

        res.json({
            volume: { id: volume.id, name: volume.name, number: volume.number, chapters: volume.chapters, releaseName: volume.releaseName },
            title: volume.name,
            images,
            source: 'local',
            progress,
            prev: idx > 0 ? { id: releases[idx - 1].id, name: releases[idx - 1].name } : null,
            next: idx >= 0 && idx < releases.length - 1 ? { id: releases[idx + 1].id, name: releases[idx + 1].name } : null
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Reading position in a volume release; the last page marks its chapters read
router.post('/:id/volumes/:volumeId/progress', (req, res) => {
    try {
        if (req.user?.role === 'demo') return res.status(403).json({ error: 'Not available in the demo', demo: true });
        const { page, totalPages } = req.body || {};
        const volume = bookmarkDb.getVolumeById(req.params.volumeId);
        if (!volume || volume.bookmarkId !== req.params.id) return res.status(404).json({ error: 'Volume not found' });
        const result = bookmarkDb.updateVolumeProgress(req.user.id, volume.id, Math.max(1, parseInt(page, 10) || 1), Math.max(1, parseInt(totalPages, 10) || 1));
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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

        const bookmark = await bookmarkDb.getById(req.params.id, ownerId(req));
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

// Get volume chapters
router.get('/:id/volumes/:volumeId/chapters', async (req, res) => {
    try {
        const volume = bookmarkDb.getVolumes(req.params.id).find(v => v.id === req.params.volumeId);
        if (!volume) return res.status(404).json({ error: 'Volume not found' });
        res.json({ success: true, chapters: volume.chapters });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update volume chapters
router.post('/:id/volumes/:volumeId/chapters', async (req, res) => {
    try {
        const { chapterNumbers } = req.body;
        if (!chapterNumbers || !Array.isArray(chapterNumbers)) {
            return res.status(400).json({ error: 'Chapter numbers array required' });
        }

        bookmarkDb.updateVolumeChapters(req.params.volumeId, chapterNumbers);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a volume
router.delete('/:id/volumes/:volumeId', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id, ownerId(req));
        const volume = bookmarkDb.getVolumeById(req.params.volumeId);
        if (!bookmark || !volume || volume.bookmarkId !== bookmark.id) return res.status(404).json({ error: 'Volume not found' });

        // A release volume owns its pages; they go with it (a chapter
        // collection owns nothing on disk).
        let removedPages = false;
        if (volume.kind === 'release' && volume.folder) {
            const mangaDir = downloader.getMangaDir(bookmark.title, bookmark.alias);
            const dir = path.resolve(mangaDir, volume.folder);
            if (dir.startsWith(path.resolve(mangaDir) + path.sep)) {
                await fs.remove(dir);
                removedPages = true;
            }
        }
        if (volume.cover && volume.cover.startsWith('/covers/volumes/')) {
            await fs.remove(path.join(CONFIG.dataDir, 'covers', 'volumes', path.basename(volume.cover))).catch(() => { });
        }
        bookmarkDb.deleteVolume(volume.id);
        res.json({ success: true, removedPages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
