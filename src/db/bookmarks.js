import { getDb, generateId } from './connection.js';

export const bookmarkDb = {
    generateId() {
        return generateId();
    },

    getAll(userId) {
        const db = getDb();
        if (userId === undefined || userId === null) return [];
        const bookmarks = db.prepare('SELECT * FROM bookmarks WHERE user_id = ? ORDER BY updated_at DESC').all(userId);

        // Enrich with related data
        return bookmarks.map(b => this.enrichBookmark(b, userId));
    },

    // Lightweight listing for the library grid — bulk queries instead of N×11
    getAllSummary(userId) {
        const db = getDb();
        if (userId === undefined || userId === null) return [];
        const bookmarks = db.prepare('SELECT * FROM bookmarks WHERE user_id = ? ORDER BY updated_at DESC').all(userId);
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

        // Bulk: read chapter counts (per user; empty without a user)
        const readCounts = new Map();
        // Bulk: last-read chapter per bookmark (most recent reading_progress
        // row of this user; bare column rides along with MAX in SQLite)
        const lastReadMap = new Map();
        if (userId) {
            db.prepare(`
                SELECT bookmark_id, COUNT(*) as cnt
                FROM read_chapters
                WHERE user_id = ?
                GROUP BY bookmark_id
            `).all(userId).forEach(r => readCounts.set(r.bookmark_id, r.cnt));

            db.prepare(`
                SELECT bookmark_id, chapter_number, MAX(last_read) AS last_read
                FROM reading_progress
                WHERE user_id = ?
                GROUP BY bookmark_id
            `).all(userId).forEach(r => lastReadMap.set(r.bookmark_id, {
                chapter: r.chapter_number,
                at: r.last_read
            }));
        }

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

        // Bulk: the series each bookmark belongs to (the library filters on it)
        const seriesMap = new Map();
        db.prepare(`
            SELECT se.bookmark_id, s.id AS series_id, COALESCE(s.alias, s.title) AS name
            FROM series_entries se
            JOIN series s ON s.id = se.series_id
        `).all().forEach(r => {
            if (!seriesMap.has(r.bookmark_id)) seriesMap.set(r.bookmark_id, { id: r.series_id, name: r.name });
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
            lastReadChapter: lastReadMap.get(b.id)?.chapter ?? null,
            lastReadAt: lastReadMap.get(b.id)?.at ?? null,
            updatedAt: b.updated_at,
            autoCheck: !!b.auto_check,
            autoDownload: !!b.auto_download,
            checkSchedule: b.check_schedule || null,
            checkDay: b.check_day || null,
            checkTime: b.check_time || null,
            nextCheck: b.next_check || null,
            isDemo: !!b.is_demo,
            // Counts instead of full arrays
            downloadedCount: downloadedCounts.get(b.id) || 0,
            readCount: readCounts.get(b.id) || 0,
            updatedCount: updatedCounts.get(b.id) || 0,
            // Arrays still needed for filtering/display
            chapters: chaptersMap.get(b.id) || [],
            excludedChapters: excludedMap.get(b.id) || [],
            categories: categoriesMap.get(b.id) || [],
            artists: artistsMap.get(b.id) || [],
            series: seriesMap.get(b.id) || null,
        }));
    },

    getById(id, userId) {
        const db = getDb();
        const bookmark = db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(id);
        if (!bookmark) return null;
        // Ownership: with a user id, only the owner may see the row (routes
        // pass the admin's id for demo visitors). Without one the caller is
        // system-level/public (e.g. the unauthenticated cover routes) and
        // gets the raw row.
        if (userId !== undefined && userId !== null && bookmark.user_id !== userId) return null;
        return this.enrichBookmark(bookmark, userId);
    },

    getByUrl(url, userId) {
        const db = getDb();
        const bookmark = (userId !== undefined && userId !== null)
            ? db.prepare('SELECT * FROM bookmarks WHERE url = ? AND user_id = ?').get(url, userId)
            : db.prepare('SELECT * FROM bookmarks WHERE url = ?').get(url);
        if (!bookmark) return null;
        return this.enrichBookmark(bookmark, userId);
    },

    enrichBookmark(bookmark, userId) {
        const db = getDb();
        const id = bookmark.id;

        // Get chapters
        const chapters = db.prepare(`
      SELECT number, title, url, version, total_versions, original_number,
             removed_from_remote, is_old_version, url_changed, release_group, uploaded_at, locked
      FROM chapters WHERE bookmark_id = ? ORDER BY number, version
    `).all(id);

        // Build chapterSettings (lock state) from the durable chapter_settings
        // table. chapters.locked is reset whenever a re-scrape REPLACEs chapter
        // rows, so it drifts out of sync; chapter_settings persists across
        // re-scrapes and is the source of truth the UI reads to keep locks
        // sticky across refreshes.
        const chapterSettings = {};
        const lockedSettings = db.prepare(
            'SELECT chapter_number FROM chapter_settings WHERE bookmark_id = ? AND locked = 1'
        ).all(id);
        for (const row of lockedSettings) {
            chapterSettings[row.chapter_number] = { locked: true };
        }

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

        // Get read chapters (per user; empty without a user)
        const readChapters = userId ? db.prepare(
            'SELECT chapter_number FROM read_chapters WHERE bookmark_id = ? AND user_id = ?'
        ).all(id, userId).map(r => r.chapter_number) : [];

        // Get reading progress (per user; empty without a user)
        const progressRaw = userId ? db.prepare(
            'SELECT chapter_number, page, total_pages, last_read FROM reading_progress WHERE bookmark_id = ? AND user_id = ?'
        ).all(id, userId) : [];
        const readingProgress = {};
        for (const p of progressRaw) {
            readingProgress[p.chapter_number] = {
                page: p.page,
                totalPages: p.total_pages,
                lastRead: p.last_read
            };
        }

        // Last-read chapter is per user too: their most recent progress row.
        const lastReadRow = userId ? db.prepare(
            'SELECT chapter_number, last_read FROM reading_progress WHERE bookmark_id = ? AND user_id = ? ORDER BY last_read DESC LIMIT 1'
        ).get(id, userId) : null;

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

        // Combined chapters (their titles override the row titles below)
        const mergedChapters = this.getMergedChapters(id);

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
            lastReadChapter: lastReadRow?.chapter_number ?? null,
            lastReadAt: lastReadRow?.last_read ?? null,
            preferredReleaseGroup: bookmark.preferred_release_group,
            createdAt: bookmark.created_at,
            updatedAt: bookmark.updated_at,
            chapters: chapters.map(c => ({
                number: c.number,
                // A combined chapter's chosen name applies to every row of
                // that number (12 + 12.5 -> 12 keeps 12's remote row too).
                title: mergedChapters[c.number]?.title || c.title,
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
            chapterSettings,
            mergedChapters,
            autoCheck: !!bookmark.auto_check,
            autoDownload: !!bookmark.auto_download,
            checkSchedule: bookmark.check_schedule || null,
            checkDay: bookmark.check_day || null,
            checkTime: bookmark.check_time || null,
            nextCheck: bookmark.next_check || null,
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

        const volumesRaw = db.prepare('SELECT * FROM volumes WHERE bookmark_id = ? ORDER BY display_order, created_at').all(bookmarkId);
        return volumesRaw.map(vol => this.rowToVolume(vol));
    },

    // Two kinds of volume: 'chapters' (a grouping of chapters, the original
    // kind) and 'release' (a volume with its own pages, e.g. from a torrent
    // or an archive), which the reader opens directly.
    rowToVolume(vol) {
        const db = getDb();
        const chapters = db.prepare('SELECT chapter_number FROM volume_chapters WHERE volume_id = ? ORDER BY chapter_number').all(vol.id);
        return {
            id: vol.id,
            bookmarkId: vol.bookmark_id,
            name: vol.name,
            cover: vol.cover,
            displayOrder: vol.display_order || 0,
            createdAt: vol.created_at,
            kind: vol.kind || 'chapters',
            number: vol.number ?? null,
            folder: vol.folder || null,
            pageCount: vol.page_count || 0,
            source: vol.source || null,
            releaseName: vol.release_name || null,
            chapters: chapters.map(c => c.chapter_number)
        };
    },

    getVolumeById(volumeId) {
        const row = getDb().prepare('SELECT * FROM volumes WHERE id = ?').get(volumeId);
        return row ? this.rowToVolume(row) : null;
    },

    /**
     * Create or replace the release volume with this number for a bookmark.
     * Keeps the row (id, cover, assigned chapters) when it already exists,
     * so re-importing a better release does not lose what the user set up.
     */
    upsertReleaseVolume(bookmarkId, { number, name, folder, pageCount, source, releaseName }) {
        const db = getDb();
        const existing = db.prepare("SELECT * FROM volumes WHERE bookmark_id = ? AND kind = 'release' AND number = ?").get(bookmarkId, number)
            || db.prepare('SELECT * FROM volumes WHERE bookmark_id = ? AND folder = ?').get(bookmarkId, folder);
        if (existing) {
            db.prepare(`UPDATE volumes SET kind = 'release', number = ?, folder = ?, page_count = ?, source = ?, release_name = ?, name = COALESCE(NULLIF(name, ''), ?) WHERE id = ?`)
                .run(number, folder, pageCount, source || null, releaseName || null, name, existing.id);
            return this.getVolumeById(existing.id);
        }
        const id = generateId();
        db.prepare(`
            INSERT INTO volumes (id, bookmark_id, name, created_at, display_order, kind, number, folder, page_count, source, release_name)
            VALUES (?, ?, ?, ?, ?, 'release', ?, ?, ?, ?, ?)
        `).run(id, bookmarkId, name, new Date().toISOString(), Math.round(number * 10), number, folder, pageCount, source || null, releaseName || null);
        return this.getVolumeById(id);
    },

    // ---- reading position inside a release volume (per user) ----

    getVolumeProgress(userId, bookmarkId) {
        const rows = getDb().prepare(`
            SELECT vp.volume_id, vp.page, vp.total_pages, vp.finished, vp.last_read
            FROM volume_progress vp JOIN volumes v ON v.id = vp.volume_id
            WHERE vp.user_id = ? AND v.bookmark_id = ?
        `).all(userId, bookmarkId);
        const out = {};
        for (const r of rows) out[r.volume_id] = { page: r.page, totalPages: r.total_pages, finished: !!r.finished, lastRead: r.last_read };
        return out;
    },

    /** Save the position; reaching the last page also marks the volume's chapters read. */
    updateVolumeProgress(userId, volumeId, page, totalPages) {
        const db = getDb();
        const volume = this.getVolumeById(volumeId);
        if (!volume) return null;
        const finished = totalPages > 0 && page >= totalPages;
        const now = new Date().toISOString();
        db.prepare(`
            INSERT OR REPLACE INTO volume_progress (volume_id, user_id, page, total_pages, finished, last_read)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(volumeId, userId, page, totalPages, finished ? 1 : 0, now);
        if (finished) {
            const markRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number, user_id) VALUES (?, ?, ?)');
            for (const n of volume.chapters) markRead.run(volume.bookmarkId, n, userId);
        }
        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(now, volume.bookmarkId);
        return { page, totalPages, finished };
    },

    // All volumes across a user's library, grouped per bookmark.
    // Only bookmarks that have at least one volume come back — this powers
    // the slideshow settings picker and the slideshow itself.
    getAllVolumes(userId) {
        const db = getDb();

        // Auto-migrate: Check for cover column (same lazy ALTER as getVolumes)
        try {
            db.prepare('SELECT cover FROM volumes LIMIT 1').get();
        } catch (e) {
            if (e.message.includes('no such column')) {
                try {
                    db.prepare('ALTER TABLE volumes ADD COLUMN cover TEXT').run();
                } catch (e2) {
                    console.error('Failed to add cover column to volumes (getAllVolumes):', e2);
                }
            }
        }

        const rows = db.prepare(`
            SELECT v.id, v.name, v.cover, b.id AS bookmark_id, b.title, b.alias,
                   b.cover AS manga_cover, b.local_cover, b.is_demo
            FROM volumes v
            JOIN bookmarks b ON b.id = v.bookmark_id
            WHERE b.user_id = ?
            ORDER BY COALESCE(b.alias, b.title) COLLATE NOCASE, v.display_order, v.created_at
        `).all(userId);

        const byBookmark = new Map();
        for (const row of rows) {
            let entry = byBookmark.get(row.bookmark_id);
            if (!entry) {
                entry = {
                    id: row.bookmark_id,
                    title: row.title,
                    alias: row.alias,
                    cover: row.manga_cover,
                    localCover: row.local_cover,
                    isDemo: !!row.is_demo,
                    volumes: []
                };
                byBookmark.set(row.bookmark_id, entry);
            }
            entry.volumes.push({ id: row.id, name: row.name, cover: row.cover });
        }
        return [...byBookmark.values()];
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

        // Release-volume fields (see rowToVolume)
        const extra = { kind: 'kind', number: 'number', folder: 'folder', pageCount: 'page_count', source: 'source', releaseName: 'release_name' };
        for (const [k, col] of Object.entries(extra)) {
            if (data[k] !== undefined) {
                fields.push(`${col} = ?`);
                values.push(data[k]);
            }
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

    // ==================== COMBINED CHAPTERS ====================

    // { [chapterNumber]: { title, sources: [numbers in page order], createdAt } }
    getMergedChapters(bookmarkId) {
        const db = getDb();
        const out = {};
        for (const r of db.prepare('SELECT chapter_number, title, source_numbers, created_at FROM chapter_merges WHERE bookmark_id = ?').all(bookmarkId)) {
            let sources = [];
            try { sources = JSON.parse(r.source_numbers) || []; } catch (e) { /* unreadable row: treat as no sources */ }
            out[r.chapter_number] = { title: r.title, sources, createdAt: r.created_at };
        }
        return out;
    },

    mergedChapterUrl(bookmarkId, chapterNumber) {
        return `local://${bookmarkId}/merged-${chapterNumber}`;
    },

    /**
     * Register a combined chapter after its folder was built: a local://
     * chapter row that is downloaded, the sources excluded (still listed under
     * "hidden", never re-added as new by a re-scrape), volume membership
     * carried over, and read state carried over when every source was read.
     */
    createMergedChapter(bookmarkId, userId, { target, title, sources }) {
        const db = getDb();
        const url = this.mergedChapterUrl(bookmarkId, target);
        const now = new Date().toISOString();
        const run = db.transaction(() => {
            db.prepare(`
                INSERT OR REPLACE INTO chapters (bookmark_id, number, title, url, version, total_versions, original_number, removed_from_remote, is_old_version, url_changed, release_group, uploaded_at)
                VALUES (?, ?, ?, ?, 1, 1, NULL, 0, 0, 0, '', '')
            `).run(bookmarkId, target, title, url);
            db.prepare('INSERT OR IGNORE INTO downloaded_chapters (bookmark_id, chapter_number) VALUES (?, ?)').run(bookmarkId, target);
            db.prepare('INSERT OR IGNORE INTO downloaded_versions (bookmark_id, chapter_number, url) VALUES (?, ?, ?)').run(bookmarkId, target, url);
            db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ? AND url = ?').run(bookmarkId, url);
            // 12 + 12.5 -> 12: chapter 12's own pages were folded into the
            // combined folder, so its remote version is no longer a separate
            // download (it can be fetched again as another version later).
            if (sources.includes(target)) {
                db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ? AND url != ?').run(bookmarkId, target, url);
            }
            db.prepare(`
                INSERT OR REPLACE INTO chapter_merges (bookmark_id, chapter_number, title, source_numbers, created_at)
                VALUES (?, ?, ?, ?, ?)
            `).run(bookmarkId, target, title, JSON.stringify(sources), now);

            const exclude = db.prepare('INSERT OR REPLACE INTO excluded_chapters (bookmark_id, chapter_number, excluded_at) VALUES (?, ?, ?)');
            for (const n of sources) {
                if (n !== target) exclude.run(bookmarkId, n, now);
            }

            // Keep it in the volume its sources were in
            const volumeRow = db.prepare(`
                SELECT vc.volume_id FROM volume_chapters vc
                JOIN volumes v ON v.id = vc.volume_id
                WHERE v.bookmark_id = ? AND vc.chapter_number IN (${sources.map(() => '?').join(',')})
                LIMIT 1
            `).get(bookmarkId, ...sources);
            if (volumeRow) {
                db.prepare('INSERT OR IGNORE INTO volume_chapters (volume_id, chapter_number) VALUES (?, ?)').run(volumeRow.volume_id, target);
            }

            if (userId) {
                const readCount = db.prepare(`
                    SELECT COUNT(*) AS n FROM read_chapters
                    WHERE bookmark_id = ? AND user_id = ? AND chapter_number IN (${sources.map(() => '?').join(',')})
                `).get(bookmarkId, userId, ...sources).n;
                if (readCount === sources.length) {
                    db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number, user_id) VALUES (?, ?, ?)').run(bookmarkId, target, userId);
                }
            }
            db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(now, bookmarkId);
        });
        run();
        return { url };
    },

    /** Undo createMergedChapter in the database (the folder is the caller's job). */
    removeMergedChapter(bookmarkId, target) {
        const db = getDb();
        const merge = this.getMergedChapters(bookmarkId)[target];
        if (!merge) return null;
        const url = this.mergedChapterUrl(bookmarkId, target);
        const run = db.transaction(() => {
            db.prepare('DELETE FROM chapters WHERE bookmark_id = ? AND url = ?').run(bookmarkId, url);
            db.prepare('DELETE FROM downloaded_versions WHERE bookmark_id = ? AND url = ?').run(bookmarkId, url);
            // Only a merged chapter that was nothing but the merge loses its
            // downloaded flag (the target may also be a real chapter, 12 + 12.5 -> 12).
            const otherVersions = db.prepare('SELECT COUNT(*) AS n FROM downloaded_versions WHERE bookmark_id = ? AND chapter_number = ?').get(bookmarkId, target).n;
            if (otherVersions === 0) {
                db.prepare('DELETE FROM downloaded_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(bookmarkId, target);
                db.prepare('DELETE FROM read_chapters WHERE bookmark_id = ? AND chapter_number = ?').run(bookmarkId, target);
                db.prepare('DELETE FROM reading_progress WHERE bookmark_id = ? AND chapter_number = ?').run(bookmarkId, target);
                db.prepare(`
                    DELETE FROM volume_chapters WHERE chapter_number = ?
                    AND volume_id IN (SELECT id FROM volumes WHERE bookmark_id = ?)
                `).run(target, bookmarkId);
            }
            const unexclude = db.prepare('DELETE FROM excluded_chapters WHERE bookmark_id = ? AND chapter_number = ?');
            for (const n of merge.sources) unexclude.run(bookmarkId, n);
            db.prepare('DELETE FROM chapter_merges WHERE bookmark_id = ? AND chapter_number = ?').run(bookmarkId, target);
            db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), bookmarkId);
        });
        run();
        return { url, sources: merge.sources };
    },

    add(mangaInfo, userId) {
        const db = getDb();
        if (userId === undefined || userId === null) {
            throw new Error('bookmarkDb.add requires a userId (bookmarks are per-user)');
        }

        // Check if already exists (per user — different users may track the same URL)
        const existing = db.prepare('SELECT id FROM bookmarks WHERE url = ? AND user_id = ?').get(mangaInfo.url, userId);
        if (existing) {
            return { success: false, message: 'Manga already bookmarked', bookmark: this.getById(existing.id, userId) };
        }

        const id = this.generateId();
        const now = new Date().toISOString();

        const insertBookmark = db.prepare(`
      INSERT INTO bookmarks 
      (id, user_id, url, title, alias, website, source, cover, description, 
       total_chapters, unique_chapters, last_checked, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertChapter = db.prepare(`
      INSERT INTO chapters (bookmark_id, number, title, url, version, total_versions, original_number, release_group, uploaded_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        db.transaction(() => {
            insertBookmark.run(
                id,
                userId,
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

        return { success: true, message: 'Bookmark added', bookmark: this.getById(id, userId) };
    },

    update(id, updates, userId) {
        const db = getDb();
        const now = new Date().toISOString();

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
            preferredReleaseGroup: 'preferred_release_group',
            autoCheck: 'auto_check',
            autoDownload: 'auto_download',
            checkSchedule: 'check_schedule',
            checkDay: 'check_day',
            checkTime: 'check_time',
            nextCheck: 'next_check'
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
            // Ownership: callers acting on a user's behalf pass their id so a
            // bookmark row can never be written through someone else's id
            // (auto-check and the scrape processor pass the owner's id).
            // Callers without a userId are system-level and stay id-keyed.
            const scoped = userId !== undefined && userId !== null;
            const sql = `UPDATE bookmarks SET ${fields.join(', ')} WHERE id = ?${scoped ? ' AND user_id = ?' : ''}`;
            db.prepare(sql).run(...values, ...(scoped ? [userId] : []));
        }

        // Update chapters if provided - MERGE instead of replace to prevent data loss
        if (updates.chapters) {
            // Get existing chapters
            const existingChapters = db.prepare('SELECT * FROM chapters WHERE bookmark_id = ?').all(id);
            const existingByUrl = new Map(existingChapters.map(ch => [ch.url, ch]));

            // Track which URLs are in the new scrape
            const newUrls = new Set(updates.chapters.map(ch => ch.url));

            // Locked chapters are a safeguard: they must NOT be modified by a
            // re-scrape. Lock state lives in chapter_settings (durable across
            // re-scrapes) keyed by chapter number, so freeze every row whose
            // number is locked - keeping all versions of that chapter frozen.
            const lockedNumbers = new Set(
                db.prepare('SELECT chapter_number FROM chapter_settings WHERE bookmark_id = ? AND locked = 1')
                    .all(id).map(r => r.chapter_number)
            );

            // Prepare statements - carry locked/in_volume_id through the REPLACE
            // so an unlocked chapter's protection flags survive an update.
            const insertChapter = db.prepare(`
        INSERT OR REPLACE INTO chapters (bookmark_id, number, title, url, version, total_versions, original_number, removed_from_remote, is_old_version, url_changed, release_group, uploaded_at, locked, in_volume_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
            const updateRemoved = db.prepare(`
        UPDATE chapters SET removed_from_remote = 1 WHERE bookmark_id = ? AND url = ?
      `);

            // Insert/update new chapters
            for (const ch of updates.chapters) {
                // Never overwrite a locked chapter - it is frozen by the lock.
                if (lockedNumbers.has(ch.number)) continue;

                const prev = existingByUrl.get(ch.url);
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
                    ch.uploadedAt || '',
                    prev?.locked ? 1 : 0,
                    prev?.in_volume_id ?? null
                );
            }

            // Mark chapters not in new scrape as "removed_from_remote" but DON'T delete them.
            // Locked chapters are exempt - their state must not change. So are
            // local:// rows (extracted files, combined chapters): they were
            // never on the remote to begin with.
            for (const existing of existingChapters) {
                if (!newUrls.has(existing.url) && !lockedNumbers.has(existing.number) && !String(existing.url).startsWith('local://')) {
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

        // Update read chapters if provided (per user — scoped to user_id)
        if (updates.readChapters !== undefined && userId) {
            db.prepare('DELETE FROM read_chapters WHERE bookmark_id = ? AND user_id = ?').run(id, userId);
            const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number, user_id) VALUES (?, ?, ?)');
            for (const num of updates.readChapters) {
                insertRead.run(id, num, userId);
            }
        }

        return { success: true, message: 'Bookmark updated', bookmark: this.getById(id, userId) };
    },

    remove(id, userId) {
        const db = getDb();
        const bookmark = this.getById(id, userId);
        if (!bookmark) {
            return { success: false, message: 'Bookmark not found' };
        }

        // CASCADE will handle related tables
        if (userId !== undefined && userId !== null) {
            db.prepare('DELETE FROM bookmarks WHERE id = ? AND user_id = ?').run(id, userId);
        } else {
            // System-level caller (no user context) — stays id-keyed.
            db.prepare('DELETE FROM bookmarks WHERE id = ?').run(id);
        }
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

    updateReadingProgress(userId, id, chapterNumber, page, totalPages) {
        const db = getDb();
        const now = new Date().toISOString();

        db.prepare(`
      INSERT OR REPLACE INTO reading_progress (bookmark_id, chapter_number, user_id, page, total_pages, last_read)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, chapterNumber, userId, page, totalPages, now);

        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(now, id);

        // Auto-mark as read if on last page
        if (page >= totalPages) {
            db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number, user_id) VALUES (?, ?, ?)').run(id, chapterNumber, userId);
        }

        return { success: true };
    },

    markChapterRead(userId, id, chapterNumber, isRead = true) {
        const db = getDb();

        if (isRead) {
            db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number, user_id) VALUES (?, ?, ?)').run(id, chapterNumber, userId);
        } else {
            db.prepare('DELETE FROM read_chapters WHERE bookmark_id = ? AND chapter_number = ? AND user_id = ?').run(id, chapterNumber, userId);
        }

        db.prepare('UPDATE bookmarks SET updated_at = ? WHERE id = ?').run(new Date().toISOString(), id);

        return { success: true };
    },

    markChaptersReadBelow(userId, id, chapterNumber) {
        const db = getDb();

        const chapters = db.prepare('SELECT DISTINCT number FROM chapters WHERE bookmark_id = ? AND number <= ?').all(id, chapterNumber);

        const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number, user_id) VALUES (?, ?, ?)');

        db.transaction(() => {
            for (const ch of chapters) {
                insertRead.run(id, ch.number, userId);
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
