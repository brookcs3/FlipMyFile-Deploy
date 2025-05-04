# Backup System Scripts

This directory contains scripts for the HEICFlip project's backup and restore system.

## Purpose

These scripts provide a safety net during development by:
- Creating snapshots of the project at critical points
- Enabling restoration to previous known-good states
- Preserving work when testing risky changes

## Scripts Overview

### Core Backup Scripts

- `[HEICFLIP-910]_save_version.sh`: Save the current project state to a restore point
- `[HEICFLIP-911]_restore_version.sh`: Restore the project from a saved restore point

## How The Backup System Works

### Save Process

The save script:
1. Creates a `/restore_point` directory (or clears it if it exists)
2. Copies all essential project files (code, config, docs)
3. Saves a timestamp for reference
4. Reports the number of files backed up

### Restore Process

The restore script:
1. Checks if a restore point exists
2. Makes a temporary backup of the current state as a safeguard
3. Copies all files from the restore point back to their original locations
4. Reports completion and includes recovery instructions

## Usage Guidelines

1. Create backups:
   - Before making significant changes
   - After completing important features
   - When the project is in a known good state

2. Restoring backups:
   - When changes introduce unexpected problems
   - To compare current work with previous versions
   - To recover from failed experiments

## Adding New Scripts

When adding new backup-related scripts:

1. Follow the numbering convention (900-999)
2. Include comprehensive header documentation
3. Update this README with the new script information
4. Ensure the script has executable permissions (`chmod +x`)

For comprehensive documentation on the backup system, see:
`meta/docs/backup-system/[HEICFLIP-900]_BACKUP_SYSTEM.md`

Last Updated: April 30, 2025