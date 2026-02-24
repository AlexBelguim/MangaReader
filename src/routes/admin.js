/**
 * Admin Routes - Database viewing and action history management
 */

import express from 'express';
import { getDb } from '../database.js';
import { actionHistoryService, ActionTypes, EntityTypes } from '../services/ActionHistoryService.js';

const router = express.Router();

// ==================== DATABASE VIEWER ENDPOINTS ====================

/**
 * Get list of all tables in the database
 */
router.get('/tables', (req, res) => {
    try {
        const db = getDb();
        const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `).all();

        // Get row counts for each table
        const tableInfo = tables.map(t => {
            const count = db.prepare(`SELECT COUNT(*) as count FROM "${t.name}"`).get();
            return {
                name: t.name,
                rowCount: count.count
            };
        });

        res.json({ tables: tableInfo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get schema for a specific table
 */
router.get('/tables/:table/schema', (req, res) => {
    try {
        const db = getDb();
        const tableName = req.params.table;

        // Verify table exists
        const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name = ?
    `).get(tableName);

        if (!tableExists) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Get column info
        const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all();

        // Get foreign keys
        const foreignKeys = db.prepare(`PRAGMA foreign_key_list("${tableName}")`).all();

        // Get indexes
        const indexes = db.prepare(`PRAGMA index_list("${tableName}")`).all();

        res.json({
            table: tableName,
            columns,
            foreignKeys,
            indexes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get rows from a table with pagination
 */
router.get('/tables/:table', (req, res) => {
    try {
        const db = getDb();
        const tableName = req.params.table;

        // Verify table exists (prevent SQL injection)
        const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name = ?
    `).get(tableName);

        if (!tableExists) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Pagination
        const page = Math.max(0, parseInt(req.query.page) || 0);
        const limit = Math.min(100, Math.max(10, parseInt(req.query.limit) || 50));
        const offset = page * limit;

        // Optional filter by column
        const filterColumn = req.query.filterColumn;
        const filterValue = req.query.filterValue;

        let sql = `SELECT * FROM "${tableName}"`;
        const params = [];

        if (filterColumn && filterValue) {
            // Verify column exists
            const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all();
            const columnExists = columns.some(c => c.name === filterColumn);

            if (columnExists) {
                sql += ` WHERE "${filterColumn}" LIKE ?`;
                params.push(`%${filterValue}%`);
            }
        }

        // Get total count
        const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as count');
        const total = db.prepare(countSql).get(...params).count;

        // Add pagination
        sql += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const rows = db.prepare(sql).all(...params);

        res.json({
            table: tableName,
            rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get a single row by ID
 */
router.get('/tables/:table/:id', (req, res) => {
    try {
        const db = getDb();
        const tableName = req.params.table;
        const id = req.params.id;

        // Verify table exists
        const tableExists = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name = ?
    `).get(tableName);

        if (!tableExists) {
            return res.status(404).json({ error: 'Table not found' });
        }

        // Get primary key column
        const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all();
        const pkColumn = columns.find(c => c.pk === 1);

        if (!pkColumn) {
            return res.status(400).json({ error: 'Table has no primary key' });
        }

        const row = db.prepare(`SELECT * FROM "${tableName}" WHERE "${pkColumn.name}" = ?`).get(id);

        if (!row) {
            return res.status(404).json({ error: 'Row not found' });
        }

        res.json(row);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ACTION HISTORY ENDPOINTS ====================

/**
 * Get recent actions for undo list
 */
router.get('/actions', (req, res) => {
    try {
        const bookmarkId = req.query.bookmarkId;
        const limit = Math.min(100, parseInt(req.query.limit) || 50);
        const includeUndone = req.query.includeUndone === 'true';

        const actions = actionHistoryService.getRecent({ bookmarkId, limit, includeUndone });
        const undoableCount = actionHistoryService.getUndoableCount(bookmarkId);

        res.json({
            actions,
            undoableCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get a specific action
 */
router.get('/actions/:id', (req, res) => {
    try {
        const action = actionHistoryService.get(parseInt(req.params.id));

        if (!action) {
            return res.status(404).json({ error: 'Action not found' });
        }

        // Check if can be undone
        const undoStatus = actionHistoryService.canUndo(action);

        res.json({
            ...action,
            ...undoStatus
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Undo an action
 * This is the main undo endpoint - it will restore the before state
 */
router.post('/actions/:id/undo', async (req, res) => {
    try {
        const action = actionHistoryService.get(parseInt(req.params.id));

        if (!action) {
            return res.status(404).json({ error: 'Action not found' });
        }

        const undoStatus = actionHistoryService.canUndo(action);
        if (!undoStatus.canUndo) {
            return res.status(400).json({ error: undoStatus.reason });
        }

        const db = getDb();

        // Handle different action types
        switch (action.action_type) {
            case ActionTypes.HIDE_CHAPTER:
            case ActionTypes.HIDE_VERSION:
                // Unhide by removing from deleted_chapter_urls
                if (action.beforeState?.url) {
                    db.prepare('DELETE FROM deleted_chapter_urls WHERE bookmark_id = ? AND url = ?')
                        .run(action.bookmark_id, action.beforeState.url);
                }
                break;

            case ActionTypes.UNHIDE_CHAPTER:
            case ActionTypes.UNHIDE_VERSION:
                // Re-hide by adding back to deleted_chapter_urls
                if (action.beforeState?.url) {
                    db.prepare('INSERT OR IGNORE INTO deleted_chapter_urls (bookmark_id, url) VALUES (?, ?)')
                        .run(action.bookmark_id, action.beforeState.url);
                }
                break;

            case ActionTypes.LOCK_CHAPTER:
                // Unlock the chapter
                if (action.beforeState?.chapterNumber !== undefined) {
                    db.prepare('UPDATE chapters SET locked = 0 WHERE bookmark_id = ? AND number = ?')
                        .run(action.bookmark_id, action.beforeState.chapterNumber);
                }
                break;

            case ActionTypes.UNLOCK_CHAPTER:
                // Re-lock the chapter
                if (action.beforeState?.chapterNumber !== undefined) {
                    db.prepare('UPDATE chapters SET locked = 1 WHERE bookmark_id = ? AND number = ?')
                        .run(action.bookmark_id, action.beforeState.chapterNumber);
                }
                break;

            case ActionTypes.ADD_TO_VOLUME:
                // Remove from volume
                if (action.afterState?.volumeId && action.afterState?.chapterNumber !== undefined) {
                    db.prepare('DELETE FROM volume_chapters WHERE volume_id = ? AND chapter_number = ?')
                        .run(action.afterState.volumeId, action.afterState.chapterNumber);
                    db.prepare('UPDATE chapters SET in_volume_id = NULL WHERE bookmark_id = ? AND number = ?')
                        .run(action.bookmark_id, action.afterState.chapterNumber);
                }
                break;

            case ActionTypes.REMOVE_FROM_VOLUME:
                // Add back to volume
                if (action.beforeState?.volumeId && action.beforeState?.chapterNumber !== undefined) {
                    db.prepare('INSERT OR IGNORE INTO volume_chapters (volume_id, chapter_number) VALUES (?, ?)')
                        .run(action.beforeState.volumeId, action.beforeState.chapterNumber);
                    db.prepare('UPDATE chapters SET in_volume_id = ? WHERE bookmark_id = ? AND number = ?')
                        .run(action.beforeState.volumeId, action.bookmark_id, action.beforeState.chapterNumber);
                }
                break;

            default:
                return res.status(400).json({
                    error: `Undo not implemented for action type: ${action.action_type}`
                });
        }

        // Mark action as undone
        actionHistoryService.markUndone(action.id);

        res.json({
            success: true,
            message: `Action "${action.description || action.action_type}" undone`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Clean up old action history
 */
router.post('/actions/cleanup', (req, res) => {
    try {
        const daysOld = parseInt(req.body.daysOld) || 90;
        const deleted = actionHistoryService.cleanup(daysOld);

        res.json({
            success: true,
            deleted,
            message: `Deleted ${deleted} actions older than ${daysOld} days`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export action types for frontend reference
router.get('/action-types', (req, res) => {
    res.json({
        actionTypes: ActionTypes,
        entityTypes: EntityTypes
    });
});

export default router;
