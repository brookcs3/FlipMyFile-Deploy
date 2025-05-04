#!/bin/bash
# Proxy script to call the actual restore script from its location
# This provides a simple interface at the project root

# Get script directory (regardless of where it's called from)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
RESTORE_SCRIPT="$SCRIPT_DIR/meta/tools/backup/[HEICFLIP-911]_restore_version.sh"

# Make sure the script is executable
chmod +x "$RESTORE_SCRIPT"

# Call the actual script
"$RESTORE_SCRIPT"

# If the above call fails, try to inform the user
if [ $? -ne 0 ]; then
    echo "Error: Failed to execute the restore script."
    echo "Please check that the script exists at: $RESTORE_SCRIPT"
fi