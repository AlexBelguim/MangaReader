/**
 * Reader Routes - Chapter images, page manipulation, versions
 */

import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { bookmarkDb, chapterSettingsDb } from '../database.js';
import { downloader } from '../downloader.js';
import { CONFIG } from '../config.js';

const router = express.Router();

// Get images for a chapter (for cover selection)
router.get('/:id/chapters/:chapterNumber/images', async (req, res) => {
    try {
        const { id, chapterNumber } = req.params;
        const bookmark = await bookmarkDb.getById(id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const versions = await downloader.getExistingVersions(bookmark.title, parseFloat(chapterNumber), bookmark.alias);
        const validVersion = versions.find(v => v.imageCount > 0);
        if (!validVersion) return res.status(404).json({ error: 'Chapter not downloaded' });

        const files = await fs.readdir(validVersion.path);
        const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        images.sort(collator.compare);

        const imageUrls = images.map(filename =>
            `/api/public/chapter-images/${id}/${chapterNumber}/${encodeURIComponent(filename)}`
        );
        res.json({ images: imageUrls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve a specific chapter image
router.get('/:id/chapters/:chapterNumber/images/:filename', async (req, res) => {
    try {
        const { id, chapterNumber, filename } = req.params;
        const bookmark = await bookmarkDb.getById(id);
        if (!bookmark) return res.status(404).send('Not Found');

        const versions = await downloader.getExistingVersions(bookmark.title, parseFloat(chapterNumber), bookmark.alias);
        const validVersion = versions.find(v => v.imageCount > 0);
        if (!validVersion) return res.status(404).send('Not Found');

        const filePath = path.join(validVersion.path, filename);
        if (!filePath.startsWith(validVersion.path)) return res.status(403).send('Forbidden');

        if (await fs.pathExists(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).send('Not Found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get chapter images for reader
router.get('/:id/chapters/:num/reader-images', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const chapterNum = parseFloat(req.params.num);
        const versionUrl = req.query.version ? decodeURIComponent(req.query.version) : null;
        const chapter = bookmark.chapters.find(c => c.number === chapterNum);

        console.log(`Loading chapter ${chapterNum} for "${bookmark.title}" (alias: ${bookmark.alias}), version: ${versionUrl || 'default'}`);
        const localImages = await downloader.getLocalChapterImages(bookmark.title, chapterNum, bookmark.alias, versionUrl);
        console.log(`Found ${localImages ? localImages.length : 0} local images`);

        if (localImages && localImages.length > 0) {
            return res.json({
                chapter: chapterNum,
                title: chapter ? chapter.title : `Chapter ${chapterNum}`,
                images: localImages,
                source: 'local'
            });
        }
        res.status(404).json({ error: 'Chapter not downloaded. Please download it first.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get version details for a chapter
router.get('/:id/chapters/:num/versions', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const chapterNum = parseFloat(req.params.num);
        const versions = await downloader.getExistingVersions(bookmark.title, chapterNum, bookmark.alias);

        const downloadedVersions = bookmark.downloadedVersions?.[chapterNum] || [];
        const urlList = Array.isArray(downloadedVersions) ? downloadedVersions : [downloadedVersions];

        const versionDetails = versions.map(v => {
            const hashMatch = v.folder.match(/ v([a-z0-9]+)$/i);
            const folderHash = hashMatch ? hashMatch[1] : null;
            let matchedUrl = null;
            for (const url of urlList) {
                const urlHash = downloader.getVersionFromUrl(url);
                if (folderHash && urlHash === folderHash) { matchedUrl = url; break; }
            }
            if (!matchedUrl && !v.isVersioned && urlList.length > 0) {
                for (const url of urlList) {
                    const urlHash = downloader.getVersionFromUrl(url);
                    const hasMatchingFolder = versions.some(ver => {
                        const verHashMatch = ver.folder.match(/ v([a-z0-9]+)$/i);
                        return verHashMatch && verHashMatch[1] === urlHash;
                    });
                    if (!hasMatchingFolder) { matchedUrl = url; break; }
                }
            }
            return { folder: v.folder, imageCount: v.imageCount, isVersioned: v.isVersioned, hash: folderHash, url: matchedUrl };
        });

        res.json({ versions: versionDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a downloaded chapter
router.delete('/:id/chapters/:num/download', async (req, res) => {
    try {
        const bookmark = await bookmarkDb.getById(req.params.id);
        if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

        const chapterNum = parseFloat(req.params.num);
        const allSettings = chapterSettingsDb.getAll();
        const settings = allSettings[bookmark.id]?.[chapterNum];
        if (settings?.locked) return res.status(403).json({ error: 'Chapter is locked and cannot be deleted' });

        const chapter = bookmark.chapters.find(c => c.number === chapterNum);
        const result = await downloader.deleteChapter(bookmark.title, chapterNum, bookmark.alias);

        if (result.success) {
            await bookmarkDb.markChapterDeleted(bookmark.id, chapterNum, chapter?.url);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
