#!/bin/bash

echo "Available Backups:"
echo "----------------"

# Find all backup directories and sort them in reverse order (newest first)
BACKUPS=$(find backups -maxdepth 1 -type d -name "backup_*" | sort -r)

if [ -z "$BACKUPS" ]; then
  echo "No backups found."
  exit 0
fi

# For each backup, display information
for BACKUP in $BACKUPS; do
  # Extract timestamp from directory name
  TIMESTAMP=$(echo "$BACKUP" | grep -o 'backup_[0-9]\+_[0-9]\+')
  TIMESTAMP=${TIMESTAMP#backup_}
  
  # Format date for display
  YEAR=${TIMESTAMP:0:4}
  MONTH=${TIMESTAMP:4:2}
  DAY=${TIMESTAMP:6:2}
  HOUR=${TIMESTAMP:9:2}
  MINUTE=${TIMESTAMP:11:2}
  SECOND=${TIMESTAMP:13:2}
  
  FORMATTED_DATE="$YEAR-$MONTH-$DAY $HOUR:$MINUTE:$SECOND"
  
  # Get file count
  FILE_COUNT=$(find "$BACKUP" -type f | wc -l)
  
  # Display backup info
  echo "$BACKUP (Created: $FORMATTED_DATE, Files: $FILE_COUNT)"
  
  # If backup info file exists, show it
  if [ -f "$BACKUP/BACKUP_INFO.txt" ]; then
    echo "  Summary: $(head -n 1 "$BACKUP/BACKUP_INFO.txt")"
  fi
  
  echo ""
done

echo "To restore a backup, run: ./scripts/restore_backup.sh [BACKUP_DIRECTORY]"
echo "Example: ./scripts/restore_backup.sh $(echo "$BACKUPS" | head -n 1)"
