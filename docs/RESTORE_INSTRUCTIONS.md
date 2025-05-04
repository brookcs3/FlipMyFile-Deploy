# Simple Restore System for HEICFlip

This project includes a simple restore system that allows you to save and restore the project state. This is useful if Replit's built-in rollback features aren't working properly.

## How to Use

### Saving the Current Version

To save the current version of the project, just ask the agent:

```
Please save this current version to the restore file
```

The agent will run the `save_current_version.sh` script, which will:
1. Clear the previous restore point
2. Copy all current project files to the `restore_point/` directory
3. Save a timestamp of when the backup was created

### Restoring a Saved Version

To restore from a saved version, ask the agent:

```
Please restore from the saved restore point
```

The agent will run the `restore_from_save.sh` script, which will:
1. Create a backup of the current state (just in case)
2. Copy all files from the `restore_point/` directory back to the project
3. Let you know when the restore is complete

## Additional Information

- The system keeps only one restore point (the most recent save)
- Each time you save, the previous save is overwritten
- A timestamp file (`SAVE_TIMESTAMP.txt`) is included in the restore point to show when it was created
- The system automatically creates a backup of the current state before restoring, in case you need to undo the restore

## Manual Usage

You can also run the scripts directly:

```bash
# To save the current version
./save_current_version.sh

# To restore from a saved version
./restore_from_save.sh
```

## Important Note

This restore system is a simple solution meant to work alongside Replit. It doesn't handle dependencies (node_modules), so you may need to run `npm install` after restoring if dependencies have changed.

The current version was saved on: Wed 30 Apr 2025 12:29:09 AM UTC