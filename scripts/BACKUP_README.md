# HEICFlip Backup System

This directory contains scripts for creating, managing, and restoring backups of the HEICFlip project.

## Available Scripts

### 1. Create a Backup

```bash
./scripts/create_backup.sh
```

This script will create a backup of critical project files in the `backups/` directory. Each backup is stored in a timestamped folder (e.g., `backups/backup_20250501_155018`).

The backup includes:
- Configuration files (drizzle.config.ts, postcss.config.js, tailwind.config.ts, etc.)
- Server files
- Shared files
- Enhanced variant generator scripts
- Client files (if they exist)
- Demo HTML files

### 2. List Available Backups

```bash
./scripts/list_backups.sh
```

This script displays all available backups in reverse chronological order (newest first), showing:
- Backup directory path
- Creation date and time
- Number of files in the backup
- Summary information

### 3. Restore from a Backup

```bash
./scripts/restore_backup.sh backups/backup_YYYYMMDD_HHMMSS
```

This script restores files from a specified backup. It will prompt for confirmation before proceeding, as this action will overwrite existing files.

To view available backups to restore from, run the `list_backups.sh` script or omit the backup directory parameter:

```bash
./scripts/restore_backup.sh
```

## Important Notes

- Backups are stored in the `backups/` directory within the project
- After restoring from a backup, you may need to restart the application for changes to take effect
- These backup scripts focus on code and configuration files, not database content
- For complete project backup, consider also backing up any database content separately
