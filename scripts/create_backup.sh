#!/bin/bash

# Create a timestamp for the backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/backup_${TIMESTAMP}"

# Create the backup directory
mkdir -p "$BACKUP_DIR"

# Copy important files to the backup directory
echo "Creating backup in $BACKUP_DIR..."

# Backup configuration files
cp -r drizzle.config.ts "$BACKUP_DIR/" 2>/dev/null || echo "No drizzle.config.ts to backup"
cp -r postcss.config.js "$BACKUP_DIR/" 2>/dev/null || echo "No postcss.config.js to backup"
cp -r tailwind.config.ts "$BACKUP_DIR/" 2>/dev/null || echo "No tailwind.config.ts to backup"
cp -r vite.config.ts "$BACKUP_DIR/" 2>/dev/null || echo "No vite.config.ts to backup"
cp -r tsconfig.json "$BACKUP_DIR/" 2>/dev/null || echo "No tsconfig.json to backup"
cp -r package.json "$BACKUP_DIR/" 2>/dev/null || echo "No package.json to backup"

# Backup server files
mkdir -p "$BACKUP_DIR/server"
cp -r server/* "$BACKUP_DIR/server/" 2>/dev/null || echo "No server files to backup"

# Backup shared files
mkdir -p "$BACKUP_DIR/shared"
cp -r shared/* "$BACKUP_DIR/shared/" 2>/dev/null || echo "No shared files to backup"

# Backup scripts
mkdir -p "$BACKUP_DIR/scripts"
cp -r scripts/enhanced-variant-generator "$BACKUP_DIR/scripts/" 2>/dev/null || echo "No enhanced-variant-generator to backup"

# Backup client files if they exist
if [ -d "client" ]; then
  mkdir -p "$BACKUP_DIR/client"
  cp -r client/* "$BACKUP_DIR/client/" 2>/dev/null || echo "No client files to backup"
fi

# Backup demo files
cp -r format-transformation-demo.html "$BACKUP_DIR/" 2>/dev/null || echo "No format-transformation-demo.html to backup"

# Create a manifest file
echo "Backup created on $(date)" > "$BACKUP_DIR/BACKUP_INFO.txt"
echo "Contains:" >> "$BACKUP_DIR/BACKUP_INFO.txt"
find "$BACKUP_DIR" -type f | grep -v "BACKUP_INFO.txt" | sort >> "$BACKUP_DIR/BACKUP_INFO.txt"

echo "Backup completed successfully in $BACKUP_DIR"
echo "Total files backed up: $(find "$BACKUP_DIR" -type f | wc -l)"
