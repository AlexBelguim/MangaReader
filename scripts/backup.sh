#!/bin/bash
# Backup local manga data to SMB network share
# Safe for SQLite WAL mode - uses sqlite3 .backup for consistent snapshots

SOURCE_DIR="/home/alexw/MangaReader/manga-reader/Data"
BACKUP_DIR="/mnt/smb/Apps/manga/data/backup"
DB_FILE="$SOURCE_DIR/manga.db"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="$BACKUP_DIR/backup.log"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "[$TIMESTAMP] Starting backup..." | tee -a "$LOG_FILE"

# 1. Safe SQLite backup (works even while app is running)
if command -v sqlite3 &> /dev/null; then
    echo "[$TIMESTAMP] Backing up database via sqlite3 .backup..." | tee -a "$LOG_FILE"
    sqlite3 "$DB_FILE" ".backup '$BACKUP_DIR/manga.db'"
    RESULT=$?
else
    echo "[$TIMESTAMP] sqlite3 not found, falling back to file copy..." | tee -a "$LOG_FILE"
    # Copy all SQLite files together (.db, .db-wal, .db-shm)
    cp "$DB_FILE" "$BACKUP_DIR/manga.db"
    [ -f "$DB_FILE-wal" ] && cp "$DB_FILE-wal" "$BACKUP_DIR/manga.db-wal"
    [ -f "$DB_FILE-shm" ] && cp "$DB_FILE-shm" "$BACKUP_DIR/manga.db-shm"
    RESULT=$?
fi

# 2. Sync any other data files (excludes the db since we handled it above)
rsync -a --exclude='manga.db' --exclude='manga.db-wal' --exclude='manga.db-shm' \
    "$SOURCE_DIR/" "$BACKUP_DIR/"
RSYNC_RESULT=$?

# 3. Keep a timestamped copy of the DB (rotate: keep last 7)
if [ $RESULT -eq 0 ]; then
    cp "$BACKUP_DIR/manga.db" "$BACKUP_DIR/manga_$TIMESTAMP.db"
    
    # Remove old timestamped backups, keep last 7
    ls -t "$BACKUP_DIR"/manga_*.db 2>/dev/null | tail -n +8 | xargs -r rm --
    
    echo "[$TIMESTAMP] Backup completed successfully" | tee -a "$LOG_FILE"
else
    echo "[$TIMESTAMP] Backup failed with error code $RESULT" | tee -a "$LOG_FILE"
fi

# Keep log file manageable (last 200 lines)
if [ -f "$LOG_FILE" ]; then
    tail -200 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
fi
