#!/bin/bash
# HEICFlip Project Backup System
# This script creates a comprehensive backup of the current project state 
# in the restore_point directory

# Get script directory (regardless of where it's called from)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/restore_point"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "==== HEICFlip Backup System ===="
echo "Creating backup at: $TIMESTAMP"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Remove previous backup contents
rm -rf "$BACKUP_DIR"/*

# Create a list of directories/files to exclude from backup
cat > /tmp/backup_exclude.txt << EOL
node_modules/
.git/
dist/
**/node_modules/
**/dist/
**/.cache/
**/.DS_Store
**/coverage/
**/.nyc_output/
**/.eslintcache
**/.env
EOL

# Create a timestamp file to identify this backup
echo "$TIMESTAMP" > "$BACKUP_DIR/SAVE_TIMESTAMP.txt"
echo "Project state saved on: $(date)" >> "$BACKUP_DIR/SAVE_TIMESTAMP.txt"

# Copy the project files to the backup location using cp (more compatible than rsync)
# First, create a list of directories to copy
DIRS_TO_COPY=(
    "client"
    "meta"
    "packages"
    "scripts"
    "server"
    "shared"
)

# Copy each directory, excluding node_modules
for dir in "${DIRS_TO_COPY[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        echo "Copying $dir..."
        # Create the directory in the backup
        mkdir -p "$BACKUP_DIR/$dir"
        # Copy files, excluding node_modules
        find "$PROJECT_ROOT/$dir" -type f -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" \
            -exec cp --parents {} "$BACKUP_DIR/" \;
    fi
done

# Copy individual files from the root directory
echo "Copying root files..."
find "$PROJECT_ROOT" -maxdepth 1 -type f -not -name "restore_point" \
    -exec cp {} "$BACKUP_DIR/" \;

# Remove temporary files
rm /tmp/backup_exclude.txt

echo "✅ Backup completed successfully!"
echo "Backup stored in: $BACKUP_DIR"
echo "Timestamp: $TIMESTAMP"
echo ""
echo "To restore this version, run: ./restore_from_save.sh"