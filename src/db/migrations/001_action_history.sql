-- Migration 001: Add action_history table for undo functionality
-- Run: sqlite3 manga.db < migrations/001_action_history.sql

CREATE TABLE IF NOT EXISTS action_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action_type TEXT NOT NULL,        -- 'delete_chapter', 'hide_version', 'update_volume', 'lock_chapter', etc.
  entity_type TEXT NOT NULL,        -- 'chapter', 'bookmark', 'volume', 'series'
  entity_id TEXT NOT NULL,          -- The ID of the affected entity
  bookmark_id TEXT,                 -- Parent bookmark for context
  before_state TEXT,                -- JSON snapshot before change
  after_state TEXT,                 -- JSON snapshot after change  
  description TEXT,                 -- Human-readable description
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  undone_at TEXT,                   -- When undone (NULL if not undone)
  FOREIGN KEY (bookmark_id) REFERENCES bookmarks(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_action_history_bookmark ON action_history(bookmark_id);
CREATE INDEX IF NOT EXISTS idx_action_history_type ON action_history(action_type);
CREATE INDEX IF NOT EXISTS idx_action_history_created ON action_history(created_at DESC);
