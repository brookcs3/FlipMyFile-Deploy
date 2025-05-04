# HEICFlip Backup System

This document describes the backup and restore system for the HEICFlip project, designed to provide a safety net during development and experimentation.

## Overview

The backup system creates point-in-time snapshots of the project in the `restore_point` directory, allowing developers to revert to a known good state if something goes wrong.

## Key Features

- **Reliable Path Resolution**: Uses absolute paths based on script location, ensuring scripts work regardless of the current working directory.
- **Selective Backup**: Excludes large directories like `node_modules` to keep backups efficient.
- **Timestamp Tracking**: Each backup includes a timestamp for easy identification.
- **Safety Confirmations**: Restore operations require explicit confirmation to prevent accidental data loss.
- **Preservation of Critical Data**: Handles .git directory and other essential metadata appropriately.

## Usage

### Creating a Backup

To create a backup of the current project state:

```bash
./save_current_version.sh
```

This will:
1. Create a backup in the `restore_point` directory
2. Generate a timestamp file with the backup date/time
3. Exclude large directories like `node_modules`

### Restoring from Backup

To restore the project to the previously saved state:

```bash
./restore_from_save.sh
```

This will:
1. Prompt for confirmation before proceeding
2. Restore all files from the backup
3. Preserve important directories like `.git` and `node_modules`

## File Structure

```
├── save_current_version.sh     # Root-level script for easy access
├── restore_from_save.sh        # Root-level script for easy access
├── meta/
│   └── tools/
│       └── backup/
│           ├── [HEICFLIP-910]_save_version.sh    # Main backup implementation
│           └── [HEICFLIP-911]_restore_version.sh # Main restore implementation
└── restore_point/              # Backup storage location
    └── SAVE_TIMESTAMP.txt      # Records when the backup was created
```

## Implementation Details

### Backup Process

The backup script:
1. Determines the project root directory using path resolution
2. Creates a timestamp for the backup
3. Sets up a list of directories/files to exclude
4. Uses `rsync` to efficiently copy files to the backup location

### Restore Process

The restore script:
1. Verifies that a valid backup exists
2. Gets the timestamp of the backup
3. Prompts for confirmation
4. Uses `rsync` to copy files from the backup location to the project directory

## Best Practices

- Create backups before making major changes to the codebase
- Create backups before trying experimental features
- Create backups before upgrading dependencies
- Use descriptive names for manual backups (via the timestamp file)

## Future Improvements

- Multiple backup slots
- Automatic periodic backups
- Backup compression
- Cloud backup integration

## Troubleshooting

If you encounter issues with the backup system:

1. Ensure all scripts have execute permissions: `chmod +x *.sh`
2. Check that the required directories exist
3. Verify that `rsync` is installed in your environment
4. Check available disk space if backups are failing

For persistent issues, you can manually create backups by copying the relevant files.