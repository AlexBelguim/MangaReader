import { getDb, generateId } from './connection.js';

export const bookmarkDb = {
    generateId() {
        return generateId();
    },

    getAll() {
        const db = getDb();
        const bookmarks = db.prepare('SELECT * FROM bookmarks ORDER BY updated_at DESC').all();

        // Enrich with related data
        return bookmarks.map(b => this.enrichBookmark(b));
    },

    // Lightweight listing for the library grid — bulk queries instead of N×11
    getAllSummary() {
        const db = getDb();
        const bookmarks = db.prepare('SELECT * FROM bookmarks ORDER BY updated_at DESC').all();
        if (bookmarks.length === 0) return [];

        // Bulk: chapter counts (unique chapter numbers per bookmark)
        const chapterCounts = new Map();
        db.prepare(`
            SELECT bookmark_id, COUNT(DISTINCT number) as cnt
            FROM chapters
            GROUP BY bookmark_id
        `).all().forEach(r => chapterCounts.set(r.bookmark_id, r.cnt));

        // Bulk: chapters list (needed for filtering by excluded + Favorites category click)
        const chaptersMap = new Map();
        db.prepare(`
            SELECT bookmark_id, number, title, url
            FROM chapters
            ORDER BY bookmark_id, number
        `).all().forEach(r => {
            if (!chaptersMap.has(r.bookmark_id)) chaptersMap.set(r.bookmark_id, []);
            chaptersMap.get(r.bookmark_id).push({ number: r.number, title: r.title, url: r.url });
        });

        // Bulk: downloaded chapter counts
        const downloadedCounts = new Map();
        db.prepare(`
            SELECT bookmark_id, COUNT(*) as cnt
            FROM downloaded_chapters
            GROUP BY bookmark_id
        `).all().forEach(r => downloadedCounts.set(r.bookmark_id, r.cnt));

        // Bulk: read chapter counts
        const readCounts = new Map();
        db.prepare(`
            SELECT bookmark_id, COUNT(*) as cnt
            FROM read_chapters
            GROUP BY bookmark_id
        `).all().forEach(r => readCounts.set(r.bookmark_id, r.cnt));

        // Bulk: excluded chapters per bookmark
        const excludedMap = new Map();
        db.prepare(`
            SELECT bookmark_id, chapter_number
            FROM excluded_chapters
        `).all().forEach(r => {
            if (!excludedMap.has(r.bookmark_id)) excludedMap.set(r.bookmark_id, []);
            excludedMap.get(r.bookmark_id).push(r.chapter_number);
        });

        // Bulk: updated chapter counts (just need presence)
        const updatedCounts = new Map();
        db.prepare(`
            SELECT bookmark_id, COUNT(*) as cnt
            FROM updated_chapters
            GROUP BY bookmark_id
        `).all().forEach(r => updatedCounts.set(r.bookmark_id, r.cnt));

        // Bulk: categories per bookmark
        const categoriesMap = new Map();
        db.prepare(`
            SELECT bc.bookmark_id, c.name
            FROM bookmark_categories bc
            JOIN categories c ON c.id = bc.category_id
        `).all().forEach(r => {
            if (!categoriesMap.has(r.bookmark_id)) categoriesMap.set(r.bookmark_id, []);
            categoriesMap.get(r.bookmark_id).push(r.name);
        });

        // Bulk: artists per bookmark
        const artistsMap = new Map();
        db.prepare(`
            SELECT ba.bookmark_id, a.name
            FROM bookmark_artists ba
            JOIN artists a ON a.id = ba.artist_id
        `).all().forEach(r => {
            if (!artistsMap.has(r.bookmark_id)) artistsMap.set(r.bookmark_id, []);
            artistsMap.get(r.bookmark_id).push(r.name);
        });

        return bookmarks.map(b => ({
            id: b.id,
            url: b.url,
            title: b.title,
            alias: b.alias,
            website: b.website,
            source: b.source,
            cover: b.cover,
            localCover: b.local_cover,
            uniqueChapters: b.unique_chapters,
            lastReadChapter: b.last_read_chapter,
            lastReadAt: b.last_read_at,
            updatedAt: b.updated_at,
            autoCheck: !!b.auto_check,
            autoDownload: !!b.auto_download,
            // Counts instead of full arrays
            downloadedCount: downloadedCounts.get(b.id) || 0,
            readCount: readCounts.get(b.id) || 0,
            updatedCount: updatedCounts.get(b.id) || 0,
            // Arrays still needed for filtering/display
            chapters: chaptersMap.get(b.id) || [],
            excludedChapters: excludedMap.get(b.id) || [],
            categories: categoriesMap.get(b.id) || [],
            artists: artistsMap.get(b.id) || [],
        }));
    },

    getById(id) {
        const db = getDb();
        const bookmark = db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(id);
        if (!bookmark) return null;
        return this.enrichBookmark(bookmark);
    },

    getByUrl(url) {
        const db = getDb();
        const bookmark = db.prepare('SELECT * FROM bookmarks WHERE url = ?').get(url);
        if (!bookmark) return null;
        return this.enrichBookmark(bookmark);
    },

    enrichBookmark(bookmark) {
        const db = getDb();
        const id = bookmark.id;

        // Get chapters
        const chapters = db.prepare(`
      SELECT number, title, url, version, total_versions, original_number,
             removed_from_remote, is_old_version, url_changed, release_group, uploaded_at
      FROM chapters WHERE bookmark_id = ? ORDER BY number, version
    `).all(id);

        // Get downloaded chapters
        const downloadedChapters = db.prepare(
            'SELECT chapter_number FROM downloaded_chapters WHERE bookmark_id = ?'
        ).all(id).map(r => r.chapter_number);

        // Get downloaded versions
        const downloadedVersionsRaw = db.prepare(
            'SELECT chapter_number, url FROM downloaded_versions WHERE bookmark_id = ?'
        ).all(id);
        const downloadedVersions = {};
        for (const dv of downloadedVersionsRaw) {
            if (!downloadedVersions[dv.chapter_number]) {
                downloadedVersions[dv.chapter_number] = [];
            }
            downloadedVersions[dv.chapter_number].push(dv.url);
        }

        // Get deleted URLs
        const deletedChapterUrls = db.prepare(
            'SELECT url FROM deleted_chapter_urls WHERE bookmark_id = ?'
        ).all(id).map(r => r.url);

        // Get read chapters
        const readChapters = db.prepare(
            'SELECT chapter_number FROM read_chapters WHERE bookmark_id = ?'
        ).all(id).map(r => r.chapter_number);

        // Get reading progress
        const progressRaw = db.prepare(
            'SELECT chapter_number, page, total_pages, last_read FROM reading_progress WHERE bookmark_id = ?'
        ).all(id);
        const readingProgress = {};
        for (const p of progressRaw) {
            readingProgress[p.chapter_number] = {
                page: p.page,
                totalPages: p.total_pages,
                lastRead: p.last_read
            };
        }

        // Get new duplicates
        const newDuplicates = db.prepare(
            'SELECT chapter_number FROM new_duplicates WHERE bookmark_id = ?'
        ).all(id).map(r => r.chapter_number);

        // Get duplicate chapters
        const duplicateChapters = db.prepare(
            'SELECT chapter_number, count FROM duplicate_chapters WHERE bookmark_id = ?'
        ).all(id).map(r => ({ number: r.chapter_number, count: r.count }));

        // Get excluded chapters
        const excludedChapters = db.prepare(
            'SELECT chapter_number FROM excluded_chapters WHERE bookmark_id = ?'
        ).all(id).map(r => r.chapter_number);

        // Get updated chapters
        const updatedChapters = db.prepare(
            'SELECT chapter_number, old_url, new_urls, type, detected_at FROM updated_chapters WHERE bookmark_id = ?'
        ).all(id).map(r => ({
            number: r.chapter_number,
            oldUrl: r.old_url,
            newUrls: JSON.parse(r.new_urls || '[]'),
            type: r.type,
            detectedAt: r.detected_at
        }));

        // Get categories
        const categories = db.prepare(`
      SELECT c.name FROM categories c
      JOIN bookmark_categories bc ON c.id = bc.category_id
      WHERE bc.bookmark_id = ?
    `).all(id).map(r => r.name);

        return {
            id: bookmark.id,
            url: bookmark.url,
            title: bookmark.title,
            alias: bookmark.alias,
            website: bookmark.website,
            source: bookmark.source,
            cover: bookmark.cover,
            localCover: bookmark.local_cover,
            description: bookmark.description,
            totalChapters: bookmark.total_chapters,
            uniqueChapters: bookmark.unique_chapters,
            lastChecked: bookmark.last_checked,
            lastReadChapter: bookmark.last_read_chapter,
            lastReadAt: bookmark.last_read_at,
            preferredReleaseGroup: bookmark.preferred_release_group,
            createdAt: bookmark.created_at,
            updatedAt: bookmark.updated_at,
            chapters: chapters.map(c => ({
                number: c.number,
                title: c.title,
                url: c.url,
                version: c.version,
                totalVersions: c.total_versions,
                originalNumber: c.original_number,
                removedFromRemote: !!c.removed_from_remote,
                isOldVersion: !!c.is_old_version,
                urlChanged: !!c.url_changed,
                releaseGroup: c.release_group || '',
                uploadedAt: c.uploaded_at || ''
            })),
            downloadedChapters,
            downloadedVersions,
            deletedChapterUrls,
            readChapters,
            readingProgress,
            newDuplicates,
            duplicateChapters,
            updatedChapters,
            categories,
            excludedChapters,
            autoCheck: !!bookmark.auto_check,
            autoDownload: !!bookmark.auto_download,
            volumes: this.getVolumes(id)
        };
    },

    // Get volumes for a bookmark
    getVolumes(bookmarkId) {
        const db = getDb();

        // Auto-migrate: Check for cover column
        try {
            db.prepare('SELECT cover FROM volumes LIMIT 1').get();
        } catch (e) {
            if (e.message.includes('no such column')) {
                try {
                    db.prepare('ALTER TABLE volumes ADD COLUMN cover TEXT').run();
                } catch (e2) {
                    console.error('Failed to add cover column to volumes (getVolumes):', e2);
                }
            }
        }

        const volumesRaw = db.prepare('SELECT id, name, cover, display_order, created_at FROM volumes WHERE bookmark_id = ? ORDER BY display_order, created_at').all(bookmarkId);

        return volumesRaw.map(vol => {
            const chapters = db.prepare('SELECT chapter_number FROM volume_chapters WHERE volume_id = ? ORDER BY chapter_number').all(vol.id);
            return {
                id: vol.id,
                name: vol.name,
                cover: vol.cover,
                displayOrder: vol.display_order || 0,
                createdAt: vol.created_at,
                chapters: chapters.map(c => c.chapter_number)
            };
        });
    },

    // Create a volume
    createVolume(bookmarkId, name, chapterNumbers) {
        const db = getDb();
        const id = generateId();
        const now = new Date().toISOString();

        const insertVolume = db.prepare('INSERT INTO volumes (id, bookmark_id, name, created_at) VALUES (?, ?, ?, ?)');
        const insertChapter = db.prepare('INSERT INTO volume_chapters (volume_id, chapter_number) VALUES (?, ?)');

        const createTransaction = db.transaction(() => {
            insertVolume.run(id, bookmarkId, name, now);
            for (const num of chapterNumbers) {
                insertChapter.run(id, num);
            }
        });

        createTransaction();
        return { id, name, chapters: chapterNumbers };
    },

    // Delete a volume
    deleteVolume(volumeId) {
        const db = getDb();
        db.prepare('DELETE FROM volumes WHERE id = ?').run(volumeId);
    },

    // Reorder volume (move up or down)
    reorderVolume(bookmarkId, volumeId, direction) {
        const db = getDb();
        const volumes = db.prepare('SELECT id, display_order FROM volumes WHERE bookmark_id = ? ORDER BY display_order, created_at').all(bookmarkId);

        const currentIndex = volumes.findIndex(v => v.id === volumeId);
        if (currentIndex === -1) return;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= volumes.length) return;

        // Swap display_order values
        const currentOrder = currentIndex;
        const newOrder = newIndex;

        db.prepare('UPDATE volumes SET display_order = ? WHERE id = ?').run(newOrder, volumeId);
        db.prepare('UPDATE volumes SET display_order = ? WHERE id = ?').run(currentOrder, volumes[newIndex].id);
    },

    // Update a volume
    updateVolume(volumeId, data) {
        const db = getDb();

        // Auto-migrate: Check for cover column
        try {
            db.prepare('SELECT cover FROM volumes LIMIT 1').get();
        } catch (e) {
            if (e.message.includes('no such column')) {
                try {
                    db.prepare('ALTER TABLE volumes ADD COLUMN cover TEXT').run();
                } catch (e2) {
                    console.error('Failed to add cover column to volumes:', e2);
                }
            }
        }

        const fields = [];
        const values = [];

        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(data.name);
        }

        if (data.cover !== undefined) {
            fields.push('cover = ?');
            values.push(data.cover);
        }

        if (fields.length === 0) return;

        values.push(volumeId);
        db.prepare(`UPDATE volumes SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    },

    // Update volume chapters (replace all)
    updateVolumeChapters(volumeId, chapterNumbers) {
        const db = getDb();
        const insertChapter = db.prepare('INSERT INTO volume_chapters (volume_id, chapter_number) VALUES (?, ?)');
        const deleteChapters = db.prepare('DELETE FROM volume_chapters WHERE volume_id = ?');

        const transaction = db.transaction(() => {
            deleteChapters.run(volumeId);
            for (const num of chapterNumbers) {
                insertChapter.run(volumeId, num);
            }
        });

        transaction();
    },

    deleteChapter(id, chapterNum) {
        const db = getDb();
        // Delete from all tracking tables
        const tables = [
            'downloaded_chapters', 'downloaded_versions', 'deleted_chapter_urls',
            'read_chapters', 'reading_progress', 'new_duplicates',
            'duplicate_chapters', 'updated_chapters', 'excluded_chapters',
            'trophy_pages', 'chapter_settings', 'chapters'
        ];

        const transaction = db.transaction(() => {
            for (const table of tables) {
                db.prepare(`DELETE FROM ${table} WHERE bookmark_id = ? AND chapter_number = ?`).run(id, chapterNum);
            }
        });

        return transaction();
    },

    // Exclude a chapter (permanently hide and prevent download)
    excludeChapter(bookmarkId, chapterNumber) {
        const db = getDb();
        const now = new Date().toISOString();
        db.prepare(`
      INSERT OR REPLACE INTO excluded_chapters (bookmark_id, chapter_number, excluded_at)
      VALUES (?, ?, ?)
    `).run(bookmarkId, chapterNumber, now);
    },

    // Unexclude a chapter
    unexcludeChapter(bookmarkId, chapterNumber) {
        const db = getDb();
        db.prepare('DELETE FROM excluded_chapters WHERE bookmark_id = ? AND chapter_number = ?')
            .run(bookmarkId, chapterNumber);
    },

    // Get excluded chapters for a bookmark
    getExcludedChapters(bookmarkId) {
        const db = getDb();
        return db.prepare('SELECT chapter_number FROM excluded_chapters WHERE bookmark_id = ?')
            .all(bookmarkId).map(r => r.chapter_number);
    },

    add(mangaInfo) {
        const db = getDb();

        // Check if already exists
        const existing = db.prepare('SELECT id FROM bookmarks WHERE url = ?').get(mangaInfo.url);
        if (existing) {
            return { success: false, message: 'Manga already bookmarked', bookmark: this.getById(existing.id) };
        }

        const id = this.generateId();
        const now = new Date().toISOString();

        const insertBookmark = db.prepare(`
      INSERT INTO bookmarks 
      (id, url, title, alias, website, source, cover, description, 
       total_chapters, unique_chapters, last_checked, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertChapter = db.prepare(`
      INSERT INTO chapters (bookmark_id, number, title, url, version, total_versions, original_number, release_group, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        db.transaction(() => {
            insertBookmark.run(
                id,
                mangaInfo.url,
                mangaInfo.title,
                null,
                mangaInfo.website,
                mangaInfo.source || 'remote',
                mangaInfo.cover,
                mangaInfo.description || '',
                mangaInfo.totalChapters || 0,
                mangaInfo.uniqueChapters || mangaInfo.chapters?.length || 0,
                now,
                now,
                now
            );

            for (const ch of (mangaInfo.chapters || [])) {
                insertChapter.run(id, ch.number, ch.title, ch.url, ch.version || 1, ch.totalVersions || 1, ch.originalNumber, ch.releaseGroup || '', ch.uploadedAt || '');
            }
        })();

        return { success: true, message: 'Bookmark added', bookmark: this.getById(id) };
    },

    update(id, updates) {
        const db = getDb();
        const now = new Date().toISOString();

        console.log(`[DB Update] Bookmark ${id}, updates:`, updates);

        const fields = [];
        const values = [];

        const fieldMap = {
            alias: 'alias',
            cover: 'cover',
            localCover: 'local_cover',
            description: 'description',
            totalChapters: 'total_chapters',
            uniqueChapters: 'unique_chapters',
            lastChecked: 'last_checked',
            lastReadChapter: 'last_read_chapter',
            lastReadAt: 'last_read_at',
            preferredReleaseGroup: 'preferred_release_group',
            autoCheck: 'auto_check',
            autoDownload: 'auto_download'
        };

        for (const [key, col] of Object.entries(fieldMap)) {
            if (updates[key] !== undefined) {
                fields.push(`${col} = ?`);
                values.push(updates[key]);
                console.log(`[DB Update] Setting ${col} = ${updates[key]}`);
            }
        }

        fields.push('updated_at = ?');
        values.push(now);
        values.push(id);

        if (fields.length > 1) {
            const sql = `UPDATE bookmarks SET ${fields.join(', ')} WHERE id = ?`;
            console.log(`[DB Update] SQL: ${sql}`);
            console.log(`[DB Update] Values:`, values);
            db.prepare(sql).run(...values);
        }

        // Update chapters if provided - MERGE instead of replace to prevent data loss
        if (updates.chapters) {
            // Get existing chapters
            const existingChapters = db.prepare('SELECT * FROM chapters WHERE bookmark_id = ?').all(id);
            const existingByUrl = new Map(existingChapters.map(ch => [ch.url, ch]));

            // Track which URLs are in the new scrape
            const newUrls = new Set(updates.chapters.map(ch => ch.url));

            // Prepare statements
            const insertChapter = db.prepare(`
        INSERT OR REPLACE INTO chapters (bookmark_id, number, title, url, version, total_versions, original_number, removed_from_remote, is_old_version, url_changed, release_group, uploaded_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const updateRemoved = db.prepare(`
        UPDATE chapters SET removed_from_remote = 1 WHERE bookmark_id = ? AND url = ?
      `);

            // Insert/update new chapters
            for (const ch of updates.chapters) {
                insertChapter.run(
                    id,
                    ch.number,
                    ch.title,
                    ch.url,
                    ch.version || 1,
                    ch.totalVersions || 1,
                    ch.originalNumber,
                    ch.removedFromRemote ? 1 : 0,
                    ch.isOldVersion ? 1 : 0,
                    ch.urlChanged ? 1 : 0,
                    ch.releaseGroup || '',
                    ch.uploadedAt || ''
                );
            }

            // Mark chapters not in new scrape as "removed_from_remote" but DON'T delete them
            for (const existing of existingChapters) {
                if (!newUrls.has(existing.url)) {
                    updateRemoved.run(id, existing.url);
                    console.log(`[DB Update] Marked chapter ${existing.number} as removed_from_remote (preserving data)`);
                }
            }
        }

        // Update duplicate chapters if provided
        if (updates.duplicateChapters) {
            db.prepare('DELETE FROM duplicate_chapters WHERE bookmark_id = ?').run(id);
            const insertDup = db.prepare('INSERT INTO duplicate_chapters (bookmark_id, chapter_number, count) VALUES (?, ?, ?)');
            for (const dup of updates.duplicateChapters) {
                insertDup.run(id, dup.number, dup.count || 2);
            }
        }

        // Update new duplicates if provided
        if (updates.newDuplicates) {
            db.prepare('DELETE FROM new_duplicates WHERE bookmark_id = ?').run(id);
            const insertNewDup = db.prepare('INSERT INTO new_duplicates (bookmark_id, chapter_number) VALUES (?, ?)');
            for (const num of updates.newDuplicates) {
                insertNewDup.run(id, num);
            }
        }

        // Update updated chapters if provided
        if (updates.updatedChapters) {
            db.prepare('DELETE FROM updated_chapters WHERE bookmark_id = ?').run(id);
            const insertUpd = db.prepare('INSERT INTO updated_chapters (bookmark_id, chapter_number, old_url, new_urls, type, detected_at) VALUES (?, ?, ?, ?, ?, ?)');
            for (const upd of updates.updatedChapters) {
                insertUpd.run(id, upd.number, upd.oldUrl, JSON.stringify(upd.newUrls || []), upd.type, upd.detectedAt);
            }
        }

        // Update downloaded chapters if provided (for scan-local sync)
        if (updates.downloadedChapters !== undefined) {
            db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ?').run(id);
            const insertDownloaded = db.prepare('INSERT INTO downloaded_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
            // Deduplicate chapter numbers to avoid UNIQUE constraint errors
            const uniqueChapters = [...new Set(updates.downloadedChapters)];
            for (const num of uniqueChapters) {
                insertDownloaded.run(id, num);
            }
        }

        // Update downloaded versions if provided (for scan-local sync)
        if (updates.downloadedVersions !== undefined) {
            db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ?').run(id);
            const insertVersion = db.prepare('INSERT INTO downloaded_versions (bookmark_id, chapter_number, url) VALUES (?, ?, ?)');
            for (const [numStr, urls] of Object.entries(updates.downloadedVersions)) {
                const num = parseFloat(numStr);
                const urlArray = Array.isArray(urls) ? urls : [urls];
                for (const url of urlArray) {
                    insertVersion.run(id, num, url);
                }
            }
        }

        // Update deleted chapter URLs if provided
        if (updates.deletedChapterUrls !== undefined) {
            db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ?').run(id);
            const insertDeleted = db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)');
            for (const url of updates.deletedChapterUrls) {
                insertDeleted.run(id, url);
            }
        }

        // Update read chapters if provided
        if (updates.readChapters !== undefined) {
            db.prepare('DELETE FROM read_chapters WHERE bookmark_id = ?').run(id);
            const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
            for (const num of updates.readChapters) {
                insertRead.run(id, num);
            }
        }

        return { success: true, message: 'Bookmark updated', bookmark: this.getById(id) };
    },

    remove(id) {
        const db = getDb();
        const bookmark = this.getById(id);
        if (!bookmark) {
            return { success: false, message: 'Bookmark not found' };
        }

        // CASCADE will handle related tables
        db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
        return { success: true, message: 'Bookmark removed', bookmark };
    },

    markChapterDownloaded(id, chapterNumber, chapterUrl = null) {
        const db = getDb();

        db.prepare('INSERT OR IGNORE INTO downloaded_chapters (bookmark_id, chapter_number) VALUES (?, ?)').run(id, chapterNumber);

        if (chapterUrl) {
            db.prepare('INSERT OR IGNORE INTO downloaded_versions (bookmark_id, chapter_number, url) VALUES (?, ?, ?)').run(id, chapterNumber, chapterUrl);
        }

        // Remove from new duplicates
        db.prepare('DELETE FROM new_duplicates WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);

        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

        return { success: true };
    },

    markChapterDeleted(id, chapterNumber, chapterUrl) {
        const db = getDb();

        db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);

        if (chapterUrl) {
            db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)').run(id, chapterUrl);
        }

        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

        return { success: true };
    },

    clearDeletedUrl(id, url) {
        const db = getDb();
        db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ? AND url = ?').run(id, url);
        return { success: true };
    },

    updateReadingProgress(id, chapterNumber, page, totalPages) {
        const db = getDb();
        const now = new Date().toISOString();

        db.prepare(`
      INSERT OR REPLACE INTO reading_progress (bookmark_id, chapter_number, page, total_pages, last_read)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, chapterNumber, page, totalPages, now);

        db.prepare('UPDATE bookmarks SET last_read_chapter = ?, last_read_at = ?, updated_at = ? WHERE id = ?')
            .run(chapterNumber, now, now, id);

        // Auto-mark as read if on last page
        if (page >= totalPages) {
            db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)').run(id, chapterNumber);
        }

        return { success: true };
    },

    markChapterRead(id, chapterNumber, isRead = true) {
        const db = getDb();

        if (isRead) {
            db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)').run(id, chapterNumber);
        } else {
            db.prepare('DELETE FROM read_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);
        }

        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

        return { success: true };
    },

    markChaptersReadBelow(id, chapterNumber) {
        const db = getDb();

        const chapters = db.prepare('SELECT DISTINCT number FROM chapters WHERE bookmark_id = ? AND number <= ?').all(id, chapterNumber);

        const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)');

        db.transaction(() => {
            for (const ch of chapters) {
                insertRead.run(id, ch.number);
            }
        })();

        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

        return { success: true, count: chapters.length };
    },

    clearUpdatedChapter(id, chapterNumber) {
        const db = getDb();
        db.prepare('DELETE FROM updated_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(id, chapterNumber);
        return { success: true };
    },

    setBookmarkCategories(id, categoryNames) {
        const db = getDb();

        // Clear existing
        db.prepare('DELETE FROM bookmark_categories WHERE bookmark_id = ?').run(id);

        // Add new
        const insertCat = db.prepare(`
      INSERT OR IGNORE INTO bookmark_categories (bookmark_id, category_id)
      SELECT ?, id FROM categories WHERE name = ?
    `);

        for (const name of categoryNames) {
            insertCat.run(id, name);
        }

        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

        return { success: true, bookmark: this.getById(id) };
    }
};
