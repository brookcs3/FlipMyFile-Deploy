# [HEICFLIP-900] Backup System

This document describes the backup and restore system for the HEICFlip project, designed to provide a simple way to save and restore project states.

## Overview

The backup system consists of two main scripts:
- `[HEICFLIP-910]_save_version.sh` - Creates a backup of the current project state
- `[HEICFLIP-911]_restore_version.sh` - Restores the project from a saved backup

These scripts provide a safety net during development, allowing quick recovery if something goes wrong.

## Script Locations

The backup system scripts are located in:
```
meta/tools/backup/
```

However, for convenience, shortcut scripts are available in the project root:
- `save_current_version.sh` (calls the [HEICFLIP-910] script)
- `restore_from_save.sh` (calls the [HEICFLIP-911] script)

## Creating a Backup

To create a backup of the current project state:

```bash
# Preferred method (direct)
./meta/tools/backup/[HEICFLIP-910]_save_version.sh

# Alternative (using shortcut script)
./save_current_version.sh
```

### What Gets Backed Up

The backup includes:
- All code in `client/`, `server/`, and `shared/` directories
- Documentation in `meta/` and `docs/` directories
- Configuration files (*.json, *.ts, *.js, etc.)
- Documentation files (README.md, [HEICFLIP-XXX]*.md)
- Build output in `dist/` (if present)

### Backup Location

Files are saved to the `restore_point/` directory in the project root. This directory serves as a single restore point, which is overwritten each time you create a new backup.

### Backup Timestamp

Each backup includes a timestamp file (`SAVE_TIMESTAMP.txt`) that records when the backup was created, making it easy to identify the backup's age.

## Restoring from a Backup

To restore the project from a saved backup:

```bash
# Preferred method (direct)
./meta/tools/backup/[HEICFLIP-911]_restore_version.sh

# Alternative (using shortcut script)
./restore_from_save.sh
```

### Restore Process

The restore process:
1. Creates a temporary backup of the current state (in case restoration fails)
2. Copies all files from `restore_point/` back to their original locations
3. Notifies you when the restore is complete

### Safety Features

Before restoring, the system:
- Checks if a restore point exists
- Creates a pre-restore backup as a fallback (in the `backups/` directory)
- Shows the creation date of the backup being restored

## Best Practices

1. **Create Regular Backups**:
   - Before making significant changes
   - After completing a feature
   - When the project is in a known good state

2. **Document Your Backups**:
   - Note what was working when you created the backup
   - Consider adding comments to indicate the state of the project

3. **Test Restored Versions**:
   - After restoring, verify that the application works correctly
   - Restart the development server to ensure changes take effect

## Common Use Cases

- **Before Refactoring**: Save a backup before major refactoring work
- **Development Milestones**: Save backups at key milestones
- **Troubleshooting**: Create backups during debugging to try different approaches
- **Feature Branches**: Use backups as lightweight alternatives to git branches

## Limitations

- The system only maintains a single restore point
- Node modules are not backed up (run `npm install` after restoring if needed)
- Environment variables are not included in backups

## For AI Assistants

When a user requests:
- "Please save this current version to the restore file" → Run `./meta/tools/backup/[HEICFLIP-910]_save_version.sh`
- "Please restore from the saved restore point" → Run `./meta/tools/backup/[HEICFLIP-911]_restore_version.sh`

Last Updated: April 30, 2025