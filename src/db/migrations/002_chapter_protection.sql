-- Migration 002: Add chapter protection columns
-- Adds locking support and volume association tracking

-- Add locked column to chapters (protects from auto-updates)
ALTER TABLE chapters ADD COLUMN locked INTEGER DEFAULT 0;

-- Add in_volume_id for direct volume association (denormalized for query performance)
ALTER TABLE chapters ADD COLUMN in_volume_id TEXT REFERENCES volumes(id) ON DELETE SET NULL;

-- Add locked column to chapter_settings if not exists (for cases where settings exist but not chapter)
-- This is handled in lazy migration in database.js

-- Create index for faster volume lookups
CREATE INDEX IF NOT EXISTS idx_chapters_volume ON chapters(in_volume_id);
