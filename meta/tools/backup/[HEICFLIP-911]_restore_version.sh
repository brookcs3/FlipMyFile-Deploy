#!/bin/bash
# HEICFlip Project Restore System
# This script restores a project backup from the restore_point directory

# Get script directory (regardless of where it's called from)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
BACKUP_DIR="$PROJECT_ROOT/restore_point"

echo "==== HEICFlip Restore System ===="

# Check if backup exists
if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ Error: Backup directory not found at $BACKUP_DIR"
  exit 1
fi

# Check if timestamp file exists to verify it's a valid backup
if [ ! -f "$BACKUP_DIR/SAVE_TIMESTAMP.txt" ]; then
  echo "❌ Error: Not a valid backup (missing timestamp file)"
  exit 1
fi

# Get backup timestamp
TIMESTAMP=$(head -n 1 "$BACKUP_DIR/SAVE_TIMESTAMP.txt")

echo "Found backup from: $TIMESTAMP"
echo ""
echo "⚠️  WARNING: This will overwrite your current project state with the backup!"
echo "All unsaved changes will be lost."
echo ""
read -p "Continue with restore? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Restore canceled. No changes were made."
  exit 0
fi

echo "Restoring project from backup..."

# Create a list of files to exclude from restore
cat > /tmp/restore_exclude.txt << EOL
node_modules/
.git/
restore_point/
EOL

# Copy backup files to project directory using basic cp commands
echo "Copying files from backup to project..."

# Copy directories first
find "$BACKUP_DIR" -type d -not -path "$BACKUP_DIR/node_modules*" -not -path "$BACKUP_DIR/.git*" -not -path "$BACKUP_DIR/restore_point*" | while read -r dir; do
    # Get relative path from backup dir
    rel_path="${dir#$BACKUP_DIR/}"
    if [ "$rel_path" != "" ]; then
        # Create directory in project
        mkdir -p "$PROJECT_ROOT/$rel_path"
    fi
done

# Now copy all files
find "$BACKUP_DIR" -type f -not -path "$BACKUP_DIR/node_modules*" -not -path "$BACKUP_DIR/.git*" -not -path "$BACKUP_DIR/restore_point*" | while read -r file; do
    # Get relative path from backup dir
    rel_path="${file#$BACKUP_DIR/}"
    if [ "$rel_path" != "" ]; then
        # Copy file to project
        cp "$file" "$PROJECT_ROOT/$rel_path"
    fi
done

# Remove temporary files
rm /tmp/restore_exclude.txt

echo "✅ Restore completed successfully!"
echo "Project has been restored to state from: $TIMESTAMP"