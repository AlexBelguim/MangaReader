#!/bin/bash
# Backup local manga data to SMB network share
# Safe for SQLite WAL mode - backs up to temp file first, then copies to SMB

SOURCE_DIR="/home/alexw/MangaReader/manga-reader/Data"
BACKUP_DIR="/mnt/smb/Apps/manga/data/backup"
DB_FILE="$SOURCE_DIR/manga.db"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="/home/alexw/MangaReader/manga-reader/backup.log"
TEMP_DIR="/tmp/manga-backup"

# Ensure directories exist
mkdir -p "$BACKUP_DIR" "$TEMP_DIR"

echo "[$TIMESTAMP] Starting backup..." | tee -a "$LOG_FILE"

# 1. Safe SQLite backup to local temp first, then copy to SMB
if command -v sqlite3 &> /dev/null; then
    echo "[$TIMESTAMP] Backing up database via sqlite3 .backup..." | tee -a "$LOG_FILE"
    sqlite3 "$DB_FILE" ".backup '$TEMP_DIR/manga.db'"
    RESULT=$?
    if [ $RESULT -eq 0 ]; then
        cp "$TEMP_DIR/manga.db" "$BACKUP_DIR/manga.db"
    fi
else
    echo "[$TIMESTAMP] sqlite3 not found, falling back to file copy..." | tee -a "$LOG_FILE"
    cp "$DB_FILE" "$BACKUP_DIR/manga.db"
    [ -f "$DB_FILE-wal" ] && cp "$DB_FILE-wal" "$BACKUP_DIR/manga.db-wal"
    [ -f "$DB_FILE-shm" ] && cp "$DB_FILE-shm" "$BACKUP_DIR/manga.db-shm"
    RESULT=$?
fi

# 2. Sync other data files (covers etc.) - skip Unix permissions for SMB compatibility
rsync -a --no-perms --no-owner --no-group --chmod=ugo=rwX \
    --exclude='manga.db' --exclude='manga.db-wal' --exclude='manga.db-shm' \
    "$SOURCE_DIR/" "$BACKUP_DIR/"

# 3. Keep a timestamped copy of the DB (rotate: keep last 7)
if [ $RESULT -eq 0 ]; then
    cp "$TEMP_DIR/manga.db" "$BACKUP_DIR/manga_$TIMESTAMP.db" 2>/dev/null
    
    # Remove old timestamped backups, keep last 7
    ls -t "$BACKUP_DIR"/manga_*.db 2>/dev/null | tail -n +8 | xargs -r rm --
    
    echo "[$TIMESTAMP] Backup completed successfully" | tee -a "$LOG_FILE"
else
    echo "[$TIMESTAMP] Backup failed with error code $RESULT" | tee -a "$LOG_FILE"
fi

# Cleanup temp
rm -rf "$TEMP_DIR"

# Keep log file manageable (last 200 lines)
tail -200 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
