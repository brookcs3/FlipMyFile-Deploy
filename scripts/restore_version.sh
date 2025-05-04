#!/bin/bash

# Restore a specific version of the project
if [ -z "$1" ]; then
  echo "Error: No version specified"
  echo "Usage: scripts/restore_version.sh <version_folder>"
  echo "Available versions:"
  ls -la versions/
  exit 1
fi

VERSION_DIR="$1"

if [ ! -d "$VERSION_DIR" ]; then
  echo "Error: Version directory $VERSION_DIR does not exist"
  echo "Available versions:"
  ls -la versions/
  exit 1
fi

# Create a backup of the current state before restoring
CURRENT_TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="backups/before_restore_${CURRENT_TIMESTAMP}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Copy important files to the backup directory
cp -r --parents $(find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/versions/*" -not -path "*/backups/*") "$BACKUP_DIR/"

echo "Current state backed up to $BACKUP_DIR"

# Restore from the version directory
echo "Restoring from $VERSION_DIR..."

# Find all files in the version directory and copy them to the current directory
find "$VERSION_DIR" -type f -not -name "VERSION_INFO.txt" | while read file; do
  # Get the relative path from the version directory
  rel_path=${file#$VERSION_DIR/}
  # Create the directory structure if it doesn't exist
  mkdir -p $(dirname "$rel_path")
  # Copy the file
  cp "$file" "$rel_path"
done

echo "Restore completed from $VERSION_DIR"
