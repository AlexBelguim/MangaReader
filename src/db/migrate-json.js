import path from 'path';
import fs from 'fs-extra';
import { CONFIG } from '../config.js';
import { getDb } from './connection.js';

export async function migrateFromJson() {
    const db = getDb();

    // Check if already migrated
    const bookmarkCount = db.prepare('SELECT COUNT(*) as count FROM bookmarks').get();
    if (bookmarkCount.count > 0) {
        console.log('📦 Database already has data, skipping migration');
        return;
    }

    console.log('📦 Migrating from JSON files...');

    // Migrate bookmarks.json
    const bookmarksFile = CONFIG.bookmarksFile;
    if (await fs.pathExists(bookmarksFile)) {
        const data = await fs.readJson(bookmarksFile);

        // Migrate categories
        const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)');
        for (const cat of (data.categories || [])) {
            insertCategory.run(cat);
        }

        // Migrate bookmarks
        const insertBookmark = db.prepare(`
      INSERT OR REPLACE INTO bookmarks 
      (id, url, title, alias, website, source, cover, local_cover, description, 
       total_chapters, unique_chapters, last_checked, last_read_chapter, last_read_at,
       created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertChapter = db.prepare(`
      INSERT OR REPLACE INTO chapters 
      (bookmark_id, number, title, url, version, total_versions, original_number, 
       removed_from_remote, is_old_version, url_changed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const insertDownloaded = db.prepare('INSERT OR IGNORE INTO downloaded_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
        const insertDownloadedVersion = db.prepare('INSERT OR IGNORE INTO downloaded_versions (bookmark_id, chapter_number, url) VALUES (?, ?, ?)');
        const insertDeleted = db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)');
        const insertRead = db.prepare('INSERT OR IGNORE INTO read_chapters (bookmark_id, chapter_number) VALUES (?, ?)');
        const insertProgress = db.prepare('INSERT OR REPLACE INTO reading_progress (bookmark_id, chapter_number, page, total_pages, last_read) VALUES (?, ?, ?, ?, ?)');
        const insertNewDup = db.prepare('INSERT OR IGNORE INTO new_duplicates (bookmark_id, chapter_number) VALUES (?, ?)');
        const insertDupChapter = db.prepare('INSERT OR REPLACE INTO duplicate_chapters (bookmark_id, chapter_number, count) VALUES (?, ?, ?)');
        const insertUpdatedChapter = db.prepare('INSERT OR REPLACE INTO updated_chapters (bookmark_id, chapter_number, old_url, new_urls, type, detected_at) VALUES (?, ?, ?, ?, ?, ?)');
        const insertBookmarkCategory = db.prepare('INSERT OR IGNORE INTO bookmark_categories (bookmark_id, category_id) VALUES (?, ?)');

        const getCategoryId = db.prepare('SELECT id FROM categories WHERE name = ?');

        const migrateBookmark = db.transaction((bookmark) => {
            // Insert bookmark
            insertBookmark.run(
                bookmark.id,
                bookmark.url,
                bookmark.title,
                bookmark.alias,
                bookmark.website,
                bookmark.source || 'remote',
                bookmark.cover,
                bookmark.localCover,
                bookmark.description,
                bookmark.totalChapters || 0,
                bookmark.uniqueChapters || 0,
                bookmark.lastChecked,
                bookmark.lastReadChapter || 0,
                bookmark.lastReadAt,
                bookmark.createdAt,
                bookmark.updatedAt
            );

            // Insert chapters
            for (const ch of (bookmark.chapters || [])) {
                insertChapter.run(
                    bookmark.id,
                    ch.number,
                    ch.title,
                    ch.url,
                    ch.version || 1,
                    ch.totalVersions || 1,
                    ch.originalNumber,
                    ch.removedFromRemote ? 1 : 0,
                    ch.isOldVersion ? 1 : 0,
                    ch.urlChanged ? 1 : 0
                );
            }

            // Insert downloaded chapters
            for (const num of (bookmark.downloadedChapters || [])) {
                insertDownloaded.run(bookmark.id, num);
            }

            // Insert downloaded versions
            const versions = bookmark.downloadedVersions || {};
            for (const [chNum, urls] of Object.entries(versions)) {
                const urlArray = Array.isArray(urls) ? urls : [urls];
                for (const url of urlArray) {
                    insertDownloadedVersion.run(bookmark.id, parseFloat(chNum), url);
                }
            }

            // Insert deleted URLs
            for (const url of (bookmark.deletedChapterUrls || [])) {
                insertDeleted.run(bookmark.id, url);
            }

            // Insert read chapters
            for (const num of (bookmark.readChapters || [])) {
                insertRead.run(bookmark.id, num);
            }

            // Insert reading progress
            const progress = bookmark.readingProgress || {};
            for (const [chNum, prog] of Object.entries(progress)) {
                insertProgress.run(bookmark.id, parseFloat(chNum), prog.page, prog.totalPages, prog.lastRead);
            }

            // Insert new duplicates
            for (const num of (bookmark.newDuplicates || [])) {
                insertNewDup.run(bookmark.id, num);
            }

            // Insert duplicate chapters
            for (const dup of (bookmark.duplicateChapters || [])) {
                insertDupChapter.run(bookmark.id, dup.number, dup.count || 2);
            }

            // Insert updated chapters
            for (const upd of (bookmark.updatedChapters || [])) {
                insertUpdatedChapter.run(
                    bookmark.id,
                    upd.number,
                    upd.oldUrl,
                    JSON.stringify(upd.newUrls || []),
                    upd.type,
                    upd.detectedAt
                );
            }

            // Insert bookmark categories
            for (const catName of (bookmark.categories || [])) {
                const cat = getCategoryId.get(catName);
                if (cat) {
                    insertBookmarkCategory.run(bookmark.id, cat.id);
                }
            }
        });

        for (const bookmark of (data.bookmarks || [])) {
            migrateBookmark(bookmark);
        }

        console.log(`  ✓ Migrated ${data.bookmarks?.length || 0} bookmarks`);
    }

    // Migrate favorites.json
    const favoritesFile = path.join(CONFIG.dataDir, 'favorites.json');
    if (await fs.pathExists(favoritesFile)) {
        const data = await fs.readJson(favoritesFile);

        const insertList = db.prepare('INSERT OR IGNORE INTO favorite_lists (name, sort_order) VALUES (?, ?)');
        const getListId = db.prepare('SELECT id FROM favorite_lists WHERE name = ?');
        const insertFavorite = db.prepare(`
      INSERT INTO favorites 
      (list_id, bookmark_id, manga_title, chapter_number, chapter_url, page_indices, 
       display_mode, display_side, image_paths, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        const listOrder = data.listOrder || Object.keys(data.favorites || {});
        let sortOrder = 0;

        for (const listName of listOrder) {
            insertList.run(listName, sortOrder++);
            const list = getListId.get(listName);

            for (const fav of (data.favorites?.[listName] || [])) {
                insertFavorite.run(
                    list.id,
                    fav.mangaId,
                    fav.mangaTitle,
                    fav.chapterNum,
                    fav.chapterUrl,
                    JSON.stringify(fav.pageIndices || []),
                    fav.displayMode,
                    fav.displaySide,
                    JSON.stringify(fav.imagePaths || []),
                    fav.createdAt
                );
            }
        }

        console.log(`  ✓ Migrated ${listOrder.length} favorite lists`);
    }

    // Migrate chapterSettings.json
    const settingsFile = path.join(CONFIG.dataDir, 'chapterSettings.json');
    if (await fs.pathExists(settingsFile)) {
        const data = await fs.readJson(settingsFile);

        const insertSetting = db.prepare(`
      INSERT OR REPLACE INTO chapter_settings 
      (bookmark_id, chapter_number, first_page_single, last_page_single) 
      VALUES (?, ?, ?, ?)
    `);

        let count = 0;
        for (const [mangaId, chapters] of Object.entries(data)) {
            for (const [chNum, settings] of Object.entries(chapters)) {
                insertSetting.run(
                    mangaId,
                    parseFloat(chNum),
                    settings.firstPageSingle ? 1 : 0,
                    settings.lastPageSingle ? 1 : 0
                );
                count++;
            }
        }

        console.log(`  ✓ Migrated ${count} chapter settings`);
    }

    // Migrate trophyPages.json
    const trophyFile = path.join(CONFIG.dataDir, 'trophyPages.json');
    if (await fs.pathExists(trophyFile)) {
        const data = await fs.readJson(trophyFile);

        const insertTrophy = db.prepare(`
      INSERT OR REPLACE INTO trophy_pages 
      (bookmark_id, chapter_number, page_index, is_single, pages) 
      VALUES (?, ?, ?, ?, ?)
    `);

        let count = 0;
        for (const [mangaId, chapters] of Object.entries(data)) {
            for (const [chNum, pages] of Object.entries(chapters)) {
                for (const [pageIdx, info] of Object.entries(pages)) {
                    insertTrophy.run(
                        mangaId,
                        parseFloat(chNum),
                        parseInt(pageIdx),
                        info.isSingle ? 1 : 0,
                        JSON.stringify(info.pages || [])
                    );
                    count++;
                }
            }
        }

        console.log(`  ✓ Migrated ${count} trophy pages`);
    }

    console.log('📦 Migration complete!');
}
