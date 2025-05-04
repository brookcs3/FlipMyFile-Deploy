# [HEICFLIP-900] Backup System Guide

This document explains HEICFlip's backup and restore system, which provides a safety net during development and helps preserve AI context across conversations.

## Overview

The backup system consists of two main scripts:

1. `[HEICFLIP-910]_save_version.sh` - Saves the current project state
2. `[HEICFLIP-911]_restore_version.sh` - Restores from a saved project state

These scripts are designed to be run **manually** before making significant changes or when you want to preserve the current project state for future reference.

## When to Create Backups

Create a backup in these situations:

- **Before major changes**: Save a restore point before making significant code changes
- **After completing features**: Save a working state when you've completed a feature
- **To preserve AI context**: Save before ending a session to help the AI remember progress
- **Before testing risky changes**: Save before experimenting with changes that might break functionality
- **Once per active development day**: A daily backup provides a good fallback point

## How to Use the Backup System

### Creating a Backup

To save the current project state:

```bash
./meta/tools/backup/[HEICFLIP-910]_save_version.sh
```

Or simply ask the AI:

```
Please save the current version to the restore point
```

### Restoring from a Backup

To restore from a previously saved state:

```bash
./meta/tools/backup/[HEICFLIP-911]_restore_version.sh
```

Or simply ask the AI:

```
Please restore from the saved restore point
```

## Preserving AI Context

One of the key benefits of the backup system is preserving AI context across conversations. Here's how to make the most of it:

1. **Save state at session end**:
   Before ending a conversation with the AI, create a backup to save the current state.

2. **Document progress in AI_GUIDE.md**:
   Ask the AI to update the AI_GUIDE.md file with a summary of what has been done so far.

3. **Restore at session start**:
   When starting a new session, restore the backup to help the AI recall the context.

4. **Reference the navigation index**:
   Direct the AI to check the `[HEICFLIP-000]_AI_NAVIGATION_INDEX.md` file for orientation.

## What Gets Backed Up

The backup system saves:

- All source code in `client/`, `server/`, and `shared/` directories
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation in `meta/docs/`
- Tools and scripts in `meta/tools/`
- Essential root-level files like README.md

## Recovery from Failed Restoration

If a restore operation fails or causes problems, a temporary backup is automatically created before restoration begins. The path to this backup is displayed at the end of the restore operation.

## Keeping the System Updated

As the project evolves:

1. Update the backup scripts if new directories or essential files are added
2. Ensure all new documentation follows the [HEICFLIP-XXX] naming convention
3. Keep the AI_GUIDE.md updated with the latest project status

## Troubleshooting

If you encounter issues with the backup system:

1. **Backup seems empty**:
   Check that you're running the script from the project root directory.

2. **Restoration doesn't include recent files**:
   Ensure you've created a fresh backup before trying to restore.

3. **Script permissions issues**:
   Run `chmod +x meta/tools/backup/*.sh` to ensure the scripts are executable.

Last Updated: April 30, 2025