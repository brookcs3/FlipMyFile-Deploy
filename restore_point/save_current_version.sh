#!/bin/bash
# Proxy script to call the actual backup script from its location
# This provides a simple interface at the project root

# Get script directory (regardless of where it's called from)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
BACKUP_SCRIPT="$SCRIPT_DIR/meta/tools/backup/[HEICFLIP-910]_save_version.sh"

# Make sure the script is executable
chmod +x "$BACKUP_SCRIPT"

# Call the actual script
"$BACKUP_SCRIPT"

# If the above call fails, try to inform the user
if [ $? -ne 0 ]; then
    echo "Error: Failed to execute the backup script."
    echo "Please check that the script exists at: $BACKUP_SCRIPT"
fi