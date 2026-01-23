import fs from 'fs-extra';
import path from 'path';
import https from 'https';
import http from 'http';
import AdmZip from 'adm-zip';
import { CONFIG } from './config.js';

class Downloader {
  constructor() {
    this.downloadsDir = CONFIG.downloadsDir;
  }

  async ensureDir(dirPath) {
    await fs.ensureDir(dirPath);
  }

  sanitizeFileName(name) {
    // Remove or replace invalid characters for file names
    return name
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200); // Limit length
  }

  getMangaDir(mangaTitle, alias = null) {
    const folderName = this.sanitizeFileName(alias || mangaTitle);
    return path.join(this.downloadsDir, folderName);
  }

  getChapterDir(mangaTitle, chapterNumber, alias = null, version = null) {
    const mangaDir = this.getMangaDir(mangaTitle, alias);
    let chapterFolder = `Chapter ${String(chapterNumber).padStart(5, '0')}`;
    if (version) {
      chapterFolder += ` v${version}`;
    }
    return path.join(mangaDir, chapterFolder);
  }

  // Get version number for a chapter based on URL hash
  getVersionFromUrl(url) {
    // Create a short hash from URL to identify version
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).substring(0, 4);
  }

  // Find existing version folders for a chapter
  async getExistingVersions(mangaTitle, chapterNumber, alias = null) {
    const mangaDir = this.getMangaDir(mangaTitle, alias);
    const chapterPrefix = `Chapter ${String(chapterNumber).padStart(5, '0')}`;
    
    if (!await fs.pathExists(mangaDir)) {
      return [];
    }
    
    const entries = await fs.readdir(mangaDir, { withFileTypes: true });
    const versions = [];
    
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith(chapterPrefix)) {
        const versionPath = path.join(mangaDir, entry.name);
        // Count image files in this version
        const files = await fs.readdir(versionPath);
        const imageCount = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).length;
        
        versions.push({
          folder: entry.name,
          path: versionPath,
          isVersioned: entry.name.includes(' v'),
          imageCount
        });
      }
    }
    
    return versions;
  }

  async downloadImage(url, filePath) {
    // Handle protocol-relative URLs
    let fullUrl = url;
    if (url.startsWith('//')) {
      fullUrl = 'https:' + url;
    }
    
    return new Promise((resolve, reject) => {
      const protocol = fullUrl.startsWith('https') ? https : http;
      
      const request = protocol.get(fullUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': new URL(fullUrl).origin,
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
        }
      }, (response) => {
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          this.downloadImage(response.headers.location, filePath)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode}`));
          return;
        }

        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve(filePath);
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
      });

      request.on('error', reject);
      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error('Download timeout'));
      });
    });
  }

  async downloadChapter(mangaTitle, chapterNumber, images, alias = null, onProgress = null, chapterUrl = null) {
    // Determine if we need versioning
    let version = null;
    
    if (chapterUrl) {
      // Check if there are existing downloads for this chapter
      const existingVersions = await this.getExistingVersions(mangaTitle, chapterNumber, alias);
      
      if (existingVersions.length > 0) {
        // There's already a download - use version suffix for new one
        version = this.getVersionFromUrl(chapterUrl);
        
        // Check if this exact version already exists
        const versionFolder = `Chapter ${String(chapterNumber).padStart(5, '0')} v${version}`;
        const exists = existingVersions.some(v => v.folder === versionFolder);
        
        if (exists) {
          // Already downloaded this version
          return { success: 0, failed: 0, skipped: images.length, files: [], alreadyExists: true };
        }
      }
    }
    
    const chapterDir = this.getChapterDir(mangaTitle, chapterNumber, alias, version);
    await this.ensureDir(chapterDir);

    const results = {
      success: 0,
      failed: 0,
      skipped: 0,
      files: [],
      version: version
    };

    for (const image of images) {
      const ext = this.getImageExtension(image.url);
      const fileName = `${String(image.index).padStart(3, '0')}${ext}`;
      const filePath = path.join(chapterDir, fileName);

      // Skip if already downloaded
      if (await fs.pathExists(filePath)) {
        results.skipped++;
        results.files.push(filePath);
        if (onProgress) onProgress(image.index, images.length, 'skipped');
        continue;
      }

      try {
        await this.downloadImage(image.url, filePath);
        results.success++;
        results.files.push(filePath);
        if (onProgress) onProgress(image.index, images.length, 'success');
        
        // Small delay between downloads
        await new Promise(r => setTimeout(r, CONFIG.delays.betweenImages));
      } catch (error) {
        results.failed++;
        if (onProgress) onProgress(image.index, images.length, 'failed');
        console.error(`    Failed to download image ${image.index}: ${error.message}`);
      }
    }

    return results;
  }

  getImageExtension(url) {
    // Handle protocol-relative URLs
    let urlToParse = url;
    if (url.startsWith('//')) {
      urlToParse = 'https:' + url;
    }
    const urlPath = new URL(urlToParse).pathname.toLowerCase();
    if (urlPath.includes('.png')) return '.png';
    if (urlPath.includes('.gif')) return '.gif';
    if (urlPath.includes('.webp')) return '.webp';
    return '.jpg'; // Default to jpg
  }

  async getDownloadedChapters(mangaTitle, alias = null) {
    const mangaDir = this.getMangaDir(mangaTitle, alias);
    
    if (!await fs.pathExists(mangaDir)) {
      return [];
    }

    const entries = await fs.readdir(mangaDir, { withFileTypes: true });
    const chapters = [];

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('Chapter')) {
        const match = entry.name.match(/Chapter\s*(\d+(?:\.\d+)?)/i);
        if (match) {
          chapters.push(parseFloat(match[1]));
        }
      }
    }

    return chapters.sort((a, b) => a - b);
  }

  async isChapterDownloaded(mangaTitle, chapterNumber, alias = null, chapterUrl = null) {
    // If URL provided, check for that specific version
    if (chapterUrl) {
      const version = this.getVersionFromUrl(chapterUrl);
      const versionedDir = this.getChapterDir(mangaTitle, chapterNumber, alias, version);
      if (await this._dirHasImages(versionedDir)) {
        return true;
      }
    }
    
    // Check base chapter dir
    const chapterDir = this.getChapterDir(mangaTitle, chapterNumber, alias);
    if (await this._dirHasImages(chapterDir)) {
      return true;
    }
    
    // Check any versioned folders
    const existingVersions = await this.getExistingVersions(mangaTitle, chapterNumber, alias);
    return existingVersions.length > 0;
  }

  async _dirHasImages(dir) {
    if (!await fs.pathExists(dir)) {
      return false;
    }
    const files = await fs.readdir(dir);
    return files.some(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  }

  // Get local chapter images for the reader
  async getLocalChapterImages(mangaTitle, chapterNumber, alias = null, chapterUrl = null) {
    // First try to find the specific version if URL provided
    if (chapterUrl) {
      const version = this.getVersionFromUrl(chapterUrl);
      const versionedDir = this.getChapterDir(mangaTitle, chapterNumber, alias, version);
      
      if (await fs.pathExists(versionedDir)) {
        return await this._getImagesFromDir(versionedDir);
      }
    }
    
    // Try base chapter dir (no version)
    const baseDir = this.getChapterDir(mangaTitle, chapterNumber, alias);
    if (await fs.pathExists(baseDir)) {
      return await this._getImagesFromDir(baseDir);
    }
    
    // Try any versioned folder for this chapter
    const existingVersions = await this.getExistingVersions(mangaTitle, chapterNumber, alias);
    if (existingVersions.length > 0) {
      return await this._getImagesFromDir(existingVersions[0].path);
    }
    
    return null;
  }

  async _getImagesFromDir(chapterDir) {
    const files = await fs.readdir(chapterDir);
    const imageFiles = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .sort((a, b) => {
        // Sort by number prefix
        const numA = parseInt(a.match(/^(\d+)/)?.[1] || '0');
        const numB = parseInt(b.match(/^(\d+)/)?.[1] || '0');
        return numA - numB;
      });

    if (imageFiles.length === 0) {
      return null;
    }

    const relativeChapterDir = path.relative(this.downloadsDir, chapterDir);
    
    return imageFiles.map((file, index) => ({
      index: index + 1,
      url: `/downloads/${relativeChapterDir.replace(/\\/g, '/')}/${file}`,
      isLocal: true
    }));
  }

  // Cover management
  getCoverDir(mangaTitle, alias = null) {
    const mangaDir = this.getMangaDir(mangaTitle, alias);
    return path.join(mangaDir, 'covers');
  }

  async downloadCover(mangaTitle, coverUrl, alias = null) {
    if (!coverUrl) return null;
    
    // Handle protocol-relative URLs
    let fullCoverUrl = coverUrl;
    if (coverUrl.startsWith('//')) {
      fullCoverUrl = 'https:' + coverUrl;
    }
    
    const coverDir = this.getCoverDir(mangaTitle, alias);
    await this.ensureDir(coverDir);
    
    // Generate a unique filename based on URL hash and timestamp
    const urlHash = this.hashString(fullCoverUrl);
    const ext = this.getImageExtension(fullCoverUrl);
    const fileName = `cover_${urlHash}${ext}`;
    const filePath = path.join(coverDir, fileName);
    
    // Check if this exact cover already exists
    if (await fs.pathExists(filePath)) {
      return { path: filePath, isNew: false };
    }
    
    try {
      await this.downloadImage(fullCoverUrl, filePath);
      return { path: filePath, isNew: true };
    } catch (error) {
      console.error(`Failed to download cover: ${error.message}`);
      return null;
    }
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 8);
  }

  async getCovers(mangaTitle, alias = null) {
    const coverDir = this.getCoverDir(mangaTitle, alias);
    
    if (!await fs.pathExists(coverDir)) {
      return [];
    }
    
    const files = await fs.readdir(coverDir);
    const covers = files
      .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
      .map(f => ({
        filename: f,
        path: path.join(coverDir, f)
      }));
    
    // Sort by modification time (newest first)
    for (const cover of covers) {
      const stat = await fs.stat(cover.path);
      cover.mtime = stat.mtime;
    }
    
    return covers.sort((a, b) => b.mtime - a.mtime);
  }

  async setActiveCover(mangaTitle, coverFilename, alias = null) {
    const coverDir = this.getCoverDir(mangaTitle, alias);
    const activeFile = path.join(coverDir, 'active.txt');
    await fs.writeFile(activeFile, coverFilename);
    return true;
  }

  async getActiveCover(mangaTitle, alias = null) {
    const coverDir = this.getCoverDir(mangaTitle, alias);
    const activeFile = path.join(coverDir, 'active.txt');
    
    try {
      if (await fs.pathExists(activeFile)) {
        const activeName = (await fs.readFile(activeFile, 'utf8')).trim();
        const activePath = path.join(coverDir, activeName);
        if (await fs.pathExists(activePath)) {
          return { filename: activeName, path: activePath };
        }
      }
    } catch (e) {}
    
    // Default to newest cover
    const covers = await this.getCovers(mangaTitle, alias);
    return covers.length > 0 ? covers[0] : null;
  }

  async deleteChapter(mangaTitle, chapterNumber, alias = null, chapterUrl = null) {
    let chapterDir;
    
    if (chapterUrl) {
      // Delete specific version
      const version = this.getVersionFromUrl(chapterUrl);
      chapterDir = this.getChapterDir(mangaTitle, chapterNumber, alias, version);
      
      // If versioned dir doesn't exist, check all existing versions to find the right one
      if (!await fs.pathExists(chapterDir)) {
        const existingVersions = await this.getExistingVersions(mangaTitle, chapterNumber, alias);
        
        // If there's only one version (unversioned base folder), delete that
        if (existingVersions.length === 1 && !existingVersions[0].version) {
          chapterDir = existingVersions[0].path;
        } else {
          // Can't find the specific version folder
          return { success: false, message: 'Version folder not found' };
        }
      }
    } else {
      // Delete base chapter (old behavior)
      chapterDir = this.getChapterDir(mangaTitle, chapterNumber, alias);
      
      // If base doesn't exist, delete all versions
      if (!await fs.pathExists(chapterDir)) {
        const versions = await this.getExistingVersions(mangaTitle, chapterNumber, alias);
        if (versions.length === 0) {
          return { success: false, message: 'Chapter not found' };
        }
        
        // Delete all versions
        for (const ver of versions) {
          await fs.remove(ver.path);
        }
        return { success: true, message: `Deleted ${versions.length} version(s)` };
      }
    }
    
    if (!await fs.pathExists(chapterDir)) {
      return { success: false, message: 'Chapter not found' };
    }

    try {
      await fs.remove(chapterDir);
      return { success: true, message: 'Chapter deleted' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async scanLocalChapters(mangaTitle, alias = null) {
    const mangaDir = this.getMangaDir(mangaTitle, alias);
    
    if (!await fs.pathExists(mangaDir)) {
      return [];
    }

    const entries = await fs.readdir(mangaDir, { withFileTypes: true });
    const chapters = [];

    for (const entry of entries) {
      if (entry.isDirectory() && entry.name.startsWith('Chapter')) {
        // Match both "Chapter 00001" and "Chapter 00001 v1234"
        const match = entry.name.match(/Chapter\s*(\d+(?:\.\d+)?)/i);
        if (match) {
          const chapterNumber = parseFloat(match[1]);
          const isVersioned = entry.name.includes(' v');
          const versionMatch = entry.name.match(/ v([a-z0-9]+)$/i);
          const version = versionMatch ? versionMatch[1] : null;
          
          const chapterDir = path.join(mangaDir, entry.name);
          const files = await fs.readdir(chapterDir);
          const imageCount = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)).length;
          
          if (imageCount > 0) {
            chapters.push({
              number: chapterNumber,
              folder: entry.name,
              imageCount,
              isVersioned,
              version
            });
          }
        }
      }
    }

    return chapters.sort((a, b) => a.number - b.number);
  }

  // CBZ Support Methods
  
  // Find CBZ files in a manga directory
  async findCbzFiles(mangaTitle, alias = null) {
    const mangaDir = this.getMangaDir(mangaTitle, alias);
    
    if (!await fs.pathExists(mangaDir)) {
      return [];
    }
    
    const entries = await fs.readdir(mangaDir, { withFileTypes: true });
    const cbzFiles = [];
    
    for (const entry of entries) {
      if (entry.isFile() && /\.cbz$/i.test(entry.name)) {
        const filePath = path.join(mangaDir, entry.name);
        const stats = await fs.stat(filePath);
        
        // Try to extract chapter number from filename
        const chapterMatch = entry.name.match(/(?:chapter|ch\.?|#)\s*(\d+(?:\.\d+)?)/i) ||
                            entry.name.match(/(\d+(?:\.\d+)?)/);
        const chapterNumber = chapterMatch ? parseFloat(chapterMatch[1]) : null;
        
        // Check if already extracted (folder exists with images)
        let isExtracted = false;
        if (chapterNumber !== null) {
          const chapterDir = this.getChapterDir(mangaTitle, chapterNumber, alias);
          isExtracted = await this._dirHasImages(chapterDir);
        }
        
        cbzFiles.push({
          name: entry.name,
          path: filePath,
          size: stats.size,
          chapterNumber,
          isExtracted
        });
      }
    }
    
    return cbzFiles.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
  }
  
  // Get images from CBZ without extracting (for preview/reading)
  async getCbzImages(cbzPath) {
    if (!await fs.pathExists(cbzPath)) {
      return null;
    }
    
    try {
      const zip = new AdmZip(cbzPath);
      const entries = zip.getEntries();
      
      const imageEntries = entries
        .filter(e => !e.isDirectory && /\.(jpg|jpeg|png|gif|webp)$/i.test(e.entryName))
        .sort((a, b) => {
          // Sort by name
          const nameA = path.basename(a.entryName);
          const nameB = path.basename(b.entryName);
          const numA = parseInt(nameA.match(/(\d+)/)?.[1] || '0');
          const numB = parseInt(nameB.match(/(\d+)/)?.[1] || '0');
          return numA - numB;
        });
      
      return imageEntries.map((entry, index) => ({
        index: index + 1,
        entryName: entry.entryName,
        name: path.basename(entry.entryName)
      }));
    } catch (error) {
      console.error(`Error reading CBZ: ${error.message}`);
      return null;
    }
  }
  
  // Extract CBZ to chapter folder
  async extractCbz(cbzPath, mangaTitle, chapterNumber, alias = null, options = {}) {
    const { deleteAfter = false, forceReExtract = false, renameCbz = true } = options;
    
    if (!await fs.pathExists(cbzPath)) {
      throw new Error('CBZ file not found');
    }
    
    const chapterDir = this.getChapterDir(mangaTitle, chapterNumber, alias);
    
    // If force re-extract, delete existing folder first
    if (forceReExtract && await fs.pathExists(chapterDir)) {
      await fs.remove(chapterDir);
    }
    
    await this.ensureDir(chapterDir);
    
    try {
      const zip = new AdmZip(cbzPath);
      const entries = zip.getEntries();
      
      const imageEntries = entries
        .filter(e => !e.isDirectory && /\.(jpg|jpeg|png|gif|webp)$/i.test(e.entryName))
        .sort((a, b) => {
          const nameA = path.basename(a.entryName);
          const nameB = path.basename(b.entryName);
          const numA = parseInt(nameA.match(/(\d+)/)?.[1] || '0');
          const numB = parseInt(nameB.match(/(\d+)/)?.[1] || '0');
          return numA - numB;
        });
      
      let extracted = 0;
      for (let i = 0; i < imageEntries.length; i++) {
        const entry = imageEntries[i];
        const ext = path.extname(entry.entryName).toLowerCase();
        const newFileName = `${String(i + 1).padStart(3, '0')}${ext}`;
        const destPath = path.join(chapterDir, newFileName);
        
        const data = entry.getData();
        await fs.writeFile(destPath, data);
        extracted++;
      }
      
      // Rename CBZ to match chapter folder name
      let newCbzPath = cbzPath;
      let renamed = false;
      if (renameCbz && !deleteAfter) {
        const chapterFolderName = path.basename(chapterDir);
        const cbzDir = path.dirname(cbzPath);
        const newCbzName = `${chapterFolderName}.cbz`;
        newCbzPath = path.join(cbzDir, newCbzName);
        
        // Only rename if different and new name doesn't exist
        if (cbzPath !== newCbzPath && !await fs.pathExists(newCbzPath)) {
          await fs.rename(cbzPath, newCbzPath);
          renamed = true;
        }
      }
      
      // Optionally delete CBZ after extraction
      if (deleteAfter) {
        await fs.unlink(cbzPath);
      }
      
      return {
        success: true,
        extracted,
        chapterDir,
        deleted: deleteAfter,
        renamed,
        newCbzPath: renamed ? newCbzPath : null,
        newCbzName: renamed ? path.basename(newCbzPath) : null
      };
    } catch (error) {
      throw new Error(`Failed to extract CBZ: ${error.message}`);
    }
  }
  
  // Extract all CBZ files in manga folder
  async extractAllCbz(mangaTitle, alias = null, options = {}) {
    const { deleteAfter = false, forceReExtract = false, renameCbz = true } = options;
    const cbzFiles = await this.findCbzFiles(mangaTitle, alias);
    const results = [];
    
    for (const cbz of cbzFiles) {
      if (cbz.chapterNumber === null) {
        results.push({
          file: cbz.name,
          success: false,
          error: 'Could not determine chapter number from filename'
        });
        continue;
      }
      
      // Skip already extracted unless forcing re-extract
      if (cbz.isExtracted && !forceReExtract) {
        results.push({
          file: cbz.name,
          success: true,
          skipped: true,
          message: 'Already extracted'
        });
        continue;
      }
      
      try {
        const result = await this.extractCbz(cbz.path, mangaTitle, cbz.chapterNumber, alias, { deleteAfter, forceReExtract, renameCbz });
        results.push({
          file: cbz.name,
          chapterNumber: cbz.chapterNumber,
          ...result
        });
      } catch (error) {
        results.push({
          file: cbz.name,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }
  
  // Get cover from first CBZ file
  async getCoverFromCbz(cbzPath) {
    try {
      const zip = new AdmZip(cbzPath);
      const entries = zip.getEntries();
      
      const imageEntry = entries
        .filter(e => !e.isDirectory && /\.(jpg|jpeg|png|gif|webp)$/i.test(e.entryName))
        .sort((a, b) => {
          const nameA = path.basename(a.entryName);
          const nameB = path.basename(b.entryName);
          const numA = parseInt(nameA.match(/(\d+)/)?.[1] || '0');
          const numB = parseInt(nameB.match(/(\d+)/)?.[1] || '0');
          return numA - numB;
        })[0];
      
      if (imageEntry) {
        return {
          data: imageEntry.getData(),
          ext: path.extname(imageEntry.entryName).toLowerCase()
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Scan downloads folder for all manga folders (for discovering local-only manga)
  async scanAllMangaFolders() {
    if (!await fs.pathExists(this.downloadsDir)) {
      return [];
    }
    
    const entries = await fs.readdir(this.downloadsDir, { withFileTypes: true });
    const mangaFolders = [];
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      
      const folderPath = path.join(this.downloadsDir, entry.name);
      const folderContents = await fs.readdir(folderPath, { withFileTypes: true });
      
      // Check for chapter folders or CBZ files
      const chapterFolders = folderContents.filter(e => 
        e.isDirectory() && /^Chapter\s+\d/i.test(e.name)
      );
      const cbzFiles = folderContents.filter(e => 
        e.isFile() && /\.cbz$/i.test(e.name)
      );
      
      // Also check for a covers folder or any image that could be a cover
      const hasCoverFolder = folderContents.some(e => 
        e.isDirectory() && e.name.toLowerCase() === 'covers'
      );
      
      // Get cover image if available
      let coverImage = null;
      if (hasCoverFolder) {
        const coversPath = path.join(folderPath, 'covers');
        const coverFiles = await fs.readdir(coversPath);
        const activeCover = coverFiles.find(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));
        if (activeCover) {
          coverImage = `/downloads/${encodeURIComponent(entry.name)}/covers/${encodeURIComponent(activeCover)}`;
        }
      }
      
      // If no cover folder, try to get from first chapter or CBZ
      if (!coverImage && chapterFolders.length > 0) {
        const firstChapter = chapterFolders.sort()[0];
        const chapterPath = path.join(folderPath, firstChapter.name);
        const chapterFiles = await fs.readdir(chapterPath);
        const firstImage = chapterFiles
          .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
          .sort()[0];
        if (firstImage) {
          coverImage = `/downloads/${encodeURIComponent(entry.name)}/${encodeURIComponent(firstChapter.name)}/${encodeURIComponent(firstImage)}`;
        }
      }
      
      if (chapterFolders.length > 0 || cbzFiles.length > 0) {
        mangaFolders.push({
          folderName: entry.name,
          path: folderPath,
          chapterCount: chapterFolders.length,
          cbzCount: cbzFiles.length,
          coverImage
        });
      }
    }
    
    return mangaFolders;
  }

  // Rename manga folder when alias changes
  async renameMangaFolder(oldTitle, oldAlias, newAlias) {
    const oldFolderName = this.sanitizeFileName(oldAlias || oldTitle);
    const newFolderName = this.sanitizeFileName(newAlias || oldTitle);
    
    console.log(`[Folder Rename] Title: "${oldTitle}"`);
    console.log(`[Folder Rename] Old alias: "${oldAlias}" -> New alias: "${newAlias}"`);
    console.log(`[Folder Rename] Old folder name: "${oldFolderName}"`);
    console.log(`[Folder Rename] New folder name: "${newFolderName}"`);
    
    // If names are the same, nothing to do
    if (oldFolderName === newFolderName) {
      console.log(`[Folder Rename] Names are the same, skipping`);
      return { success: true, renamed: false, message: 'Folder name unchanged' };
    }
    
    const oldPath = path.join(this.downloadsDir, oldFolderName);
    const newPath = path.join(this.downloadsDir, newFolderName);
    
    console.log(`[Folder Rename] Old path: "${oldPath}"`);
    console.log(`[Folder Rename] New path: "${newPath}"`);
    
    // Check if old folder exists
    if (!await fs.pathExists(oldPath)) {
      console.log(`[Folder Rename] Old folder does not exist`);
      return { success: true, renamed: false, message: 'No existing folder to rename' };
    }
    
    // Check if new folder name already exists
    if (await fs.pathExists(newPath)) {
      console.log(`[Folder Rename] New folder already exists`);
      return { success: false, renamed: false, message: 'A folder with the new name already exists' };
    }
    
    try {
      await fs.rename(oldPath, newPath);
      console.log(`[Folder Rename] Successfully renamed folder`);
      return { success: true, renamed: true, oldPath, newPath, oldFolderName, newFolderName };
    } catch (error) {
      console.error(`[Folder Rename] Error:`, error);
      return { success: false, renamed: false, message: error.message };
    }
  }
}

export const downloader = new Downloader();
export default downloader;
