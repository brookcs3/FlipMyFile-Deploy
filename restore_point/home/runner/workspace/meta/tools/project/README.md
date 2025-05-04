# Project Management Scripts

This directory contains scripts for managing the HEICFlip project's configuration, setup, and maintenance.

## Purpose

These scripts provide tools for:
- Project renaming and rebranding
- Configuration management
- Setting up development environments

## Scripts Overview

### Core Project Scripts

- `[HEICFLIP-010]_project_rename.sh`: Comprehensive script for renaming the project across all files
- `[HEICFLIP-020]_prepare_heicflip.sh`: Script to prepare and configure the HEICFlip environment

## Project Rename System

The project rename script provides comprehensive renaming capabilities:

1. Allows changing the project name across all files (e.g., "HEICFlip" to "ImageConverter")
2. Updates file names, contents, directory names, and configuration files
3. Preserves the functionality while updating the branding
4. Includes safety checks to prevent accidental changes

### When to Use Project Rename

Use the rename script when:
- Forking the project for a different purpose
- White-labeling the application
- Creating a specialized version with different branding

## Usage Guidelines

1. Before running rename scripts:
   - Create a backup using the backup system
   - Review the changes that will be made
   - Ensure the new name follows naming conventions

2. After renaming:
   - Verify all functionality still works
   - Update documentation to reflect the new name
   - Commit the changes to version control

## Adding New Scripts

When adding new project management scripts:

1. Follow the numbering convention (000-099)
2. Include comprehensive header documentation
3. Update this README with the new script information
4. Ensure the script has executable permissions (`chmod +x`)

For detailed instructions on renaming the project, see:
`meta/docs/[HEICFLIP-050]_NAME_CHANGE_GUIDE.md`

Last Updated: April 30, 2025