/**
 * ActionHistoryService - Manages undo/redo functionality
 * Records all modifying actions with before/after state snapshots
 */

import { getDb } from '../database.js';

// Action types enum
export const ActionTypes = {
    // Chapter actions
    HIDE_CHAPTER: 'hide_chapter',
    UNHIDE_CHAPTER: 'unhide_chapter',
    DELETE_CHAPTER: 'delete_chapter',
    LOCK_CHAPTER: 'lock_chapter',
    UNLOCK_CHAPTER: 'unlock_chapter',
    DOWNLOAD_CHAPTER: 'download_chapter',

    // Version actions
    HIDE_VERSION: 'hide_version',
    UNHIDE_VERSION: 'unhide_version',

    // Volume actions
    CREATE_VOLUME: 'create_volume',
    DELETE_VOLUME: 'delete_volume',
    UPDATE_VOLUME: 'update_volume',
    ADD_TO_VOLUME: 'add_to_volume',
    REMOVE_FROM_VOLUME: 'remove_from_volume',

    // Bookmark actions
    UPDATE_BOOKMARK: 'update_bookmark',
    DELETE_BOOKMARK: 'delete_bookmark',

    // Series actions
    CREATE_SERIES: 'create_series',
    DELETE_SERIES: 'delete_series',
    UPDATE_SERIES: 'update_series',
};

// Entity types
export const EntityTypes = {
    CHAPTER: 'chapter',
    BOOKMARK: 'bookmark',
    VOLUME: 'volume',
    SERIES: 'series',
    VERSION: 'version',
};

class ActionHistoryService {
    /**
     * Record an action for undo capability
     * @param {Object} params - Action parameters
     * @param {string} params.actionType - Type of action (from ActionTypes)
     * @param {string} params.entityType - Type of entity (from EntityTypes)
     * @param {string} params.entityId - ID of the affected entity
     * @param {string} params.bookmarkId - Parent bookmark ID (for context)
     * @param {Object} params.beforeState - State before the action
     * @param {Object} params.afterState - State after the action
     * @param {string} params.description - Human-readable description
     * @returns {number} The action ID
     */
    record({ actionType, entityType, entityId, bookmarkId, beforeState, afterState, description }) {
        const db = getDb();

        const result = db.prepare(`
      INSERT INTO action_history 
      (action_type, entity_type, entity_id, bookmark_id, before_state, after_state, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(
            actionType,
            entityType,
            entityId,
            bookmarkId || null,
            beforeState ? JSON.stringify(beforeState) : null,
            afterState ? JSON.stringify(afterState) : null,
            description || null
        );

        return result.lastInsertRowid;
    }

    /**
     * Get an action by ID
     * @param {number} actionId - The action ID
     * @returns {Object|null} The action record
     */
    get(actionId) {
        const db = getDb();
        const action = db.prepare('SELECT * FROM action_history WHERE id = ?').get(actionId);

        if (action) {
            if (action.before_state) action.beforeState = JSON.parse(action.before_state);
            if (action.after_state) action.afterState = JSON.parse(action.after_state);
        }

        return action;
    }

    /**
     * Get recent actions (for undo list)
     * @param {Object} options - Query options
     * @param {string} options.bookmarkId - Filter by bookmark
     * @param {number} options.limit - Max results (default 50)
     * @param {boolean} options.includeUndone - Include already undone actions
     * @returns {Array} List of actions
     */
    getRecent({ bookmarkId, limit = 50, includeUndone = false } = {}) {
        const db = getDb();

        let sql = 'SELECT * FROM action_history WHERE 1=1';
        const params = [];

        if (bookmarkId) {
            sql += ' AND bookmark_id = ?';
            params.push(bookmarkId);
        }

        if (!includeUndone) {
            sql += ' AND undone_at IS NULL';
        }

        sql += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);

        const actions = db.prepare(sql).all(...params);

        return actions.map(action => ({
            ...action,
            beforeState: action.before_state ? JSON.parse(action.before_state) : null,
            afterState: action.after_state ? JSON.parse(action.after_state) : null,
        }));
    }

    /**
     * Mark an action as undone
     * @param {number} actionId - The action ID
     */
    markUndone(actionId) {
        const db = getDb();
        db.prepare(`
      UPDATE action_history 
      SET undone_at = datetime('now') 
      WHERE id = ?
    `).run(actionId);
    }

    /**
     * Get count of undoable actions
     * @param {string} bookmarkId - Optional filter by bookmark
     * @returns {number} Count of undoable actions
     */
    getUndoableCount(bookmarkId = null) {
        const db = getDb();

        if (bookmarkId) {
            return db.prepare(`
        SELECT COUNT(*) as count FROM action_history 
        WHERE bookmark_id = ? AND undone_at IS NULL
      `).get(bookmarkId).count;
        }

        return db.prepare(`
      SELECT COUNT(*) as count FROM action_history 
      WHERE undone_at IS NULL
    `).get().count;
    }

    /**
     * Clean up old history (optional, for maintenance)
     * @param {number} daysOld - Delete actions older than this many days
     */
    cleanup(daysOld = 90) {
        const db = getDb();
        const result = db.prepare(`
      DELETE FROM action_history 
      WHERE created_at < datetime('now', '-' || ? || ' days')
    `).run(daysOld);

        return result.changes;
    }

    /**
     * Check if an action can be undone
     * @param {Object} action - The action record
     * @returns {Object} { canUndo: boolean, reason?: string }
     */
    canUndo(action) {
        // Actions that can't be undone
        const noUndoActions = [
            ActionTypes.DELETE_CHAPTER, // Files deleted, can only re-download
        ];

        if (noUndoActions.includes(action.action_type)) {
            return {
                canUndo: false,
                reason: 'This action cannot be fully undone, but you can re-download the content'
            };
        }

        if (action.undone_at) {
            return { canUndo: false, reason: 'This action has already been undone' };
        }

        return { canUndo: true };
    }
}

export const actionHistoryService = new ActionHistoryService();
export default actionHistoryService;
