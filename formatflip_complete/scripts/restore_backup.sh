#!/bin/bash

# Check if a backup directory was provided
if [ -z "$1" ]; then
  echo "Error: Please provide a backup directory to restore from."
  echo "Usage: ./scripts/restore_backup.sh backups/backup_YYYYMMDD_HHMMSS"
  echo "Available backups:"
  find backups -maxdepth 1 -type d -name "backup_*" | sort -r
  exit 1
fi

BACKUP_DIR="$1"

# Check if the backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo "Error: Backup directory '$BACKUP_DIR' not found."
  echo "Available backups:"
  find backups -maxdepth 1 -type d -name "backup_*" | sort -r
  exit 1
fi

echo "Restoring from backup: $BACKUP_DIR"

# Ask for confirmation
read -p "This will overwrite current files. Continue? (y/n): " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo "Restoration cancelled."
  exit 0
fi

# Restore configuration files
if [ -f "$BACKUP_DIR/drizzle.config.ts" ]; then
  cp "$BACKUP_DIR/drizzle.config.ts" . && echo "Restored drizzle.config.ts"
fi

if [ -f "$BACKUP_DIR/postcss.config.js" ]; then
  cp "$BACKUP_DIR/postcss.config.js" . && echo "Restored postcss.config.js"
fi

if [ -f "$BACKUP_DIR/tailwind.config.ts" ]; then
  cp "$BACKUP_DIR/tailwind.config.ts" . && echo "Restored tailwind.config.ts"
fi

if [ -f "$BACKUP_DIR/vite.config.ts" ]; then
  cp "$BACKUP_DIR/vite.config.ts" . && echo "Restored vite.config.ts"
fi

if [ -f "$BACKUP_DIR/tsconfig.json" ]; then
  cp "$BACKUP_DIR/tsconfig.json" . && echo "Restored tsconfig.json"
fi

if [ -f "$BACKUP_DIR/package.json" ]; then
  cp "$BACKUP_DIR/package.json" . && echo "Restored package.json"
fi

# Restore server files
if [ -d "$BACKUP_DIR/server" ]; then
  cp -r "$BACKUP_DIR/server"/* server/ && echo "Restored server files"
fi

# Restore shared files
if [ -d "$BACKUP_DIR/shared" ]; then
  cp -r "$BACKUP_DIR/shared"/* shared/ && echo "Restored shared files"
fi

# Restore scripts
if [ -d "$BACKUP_DIR/scripts/enhanced-variant-generator" ]; then
  mkdir -p scripts/enhanced-variant-generator
  cp -r "$BACKUP_DIR/scripts/enhanced-variant-generator"/* scripts/enhanced-variant-generator/ && echo "Restored enhanced-variant-generator scripts"
fi

# Restore client files
if [ -d "$BACKUP_DIR/client" ]; then
  mkdir -p client
  cp -r "$BACKUP_DIR/client"/* client/ && echo "Restored client files"
fi

# Restore demo files
if [ -f "$BACKUP_DIR/format-transformation-demo.html" ]; then
  cp "$BACKUP_DIR/format-transformation-demo.html" . && echo "Restored format-transformation-demo.html"
fi

echo "Restoration from $BACKUP_DIR completed."
echo "You may need to restart your application for changes to take effect."
