# Version Control System for FormatFlip

This document explains how to use the version control system for the FormatFlip project.

## Version Control Options

### 1. Replit Native Version Control

Replit provides a built-in version control system through its interface:

- Click on the "Version Control" tab in the left sidebar
- Use "Create Checkpoint" to save the current state of your project
- View history and restore previous checkpoints as needed

### 2. Custom Version Management Scripts

The project includes custom scripts for version management:

#### Creating a Version

```bash
bash scripts/create_version.sh "Description of this version"
```

This will create a timestamped version in the `versions/` directory with your provided description.

#### Listing Available Versions

```bash
bash scripts/list_versions.sh
```

This will show all available versions with their timestamps and descriptions.

#### Restoring a Version

```bash
bash scripts/restore_version.sh "versions/version_YYYYMMDD_HHMMSS"
```

This will restore the specified version while creating a backup of the current state.

### 3. GitHub Integration

For GitHub integration:

1. Use Replit's GitHub integration from the Version Control tab
2. Connect to your GitHub repository
3. Push changes directly to GitHub

## Best Practices

1. Create versions before making significant changes
2. Use descriptive messages for each version
3. Regularly push to GitHub for offsite backup
4. Keep the `versions/` directory organized by removing old versions when no longer needed
