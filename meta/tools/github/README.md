# GitHub Scripts

This directory contains all scripts related to GitHub operations, version control, and repository management for the HEICFlip project.

## Purpose

These scripts handle various GitHub operations including:
- Pushing changes to GitHub repositories
- Managing different project configurations (HEICFlip vs JPGFlip)
- Cleaning and preparing repositories for deployment
- Handling Git reset and branch management

## Scripts Organization

All GitHub scripts follow the `[HEICFLIP-2XX]` numbering convention for clear identification:

| Number Range | Purpose |
|--------------|---------|
| 200-209 | Core GitHub utility scripts |
| 210-219 | Project-specific push scripts |
| 220-229 | Git operations and maintenance |
| 230-239 | Branch management |
| 240-249 | CI/CD pipeline scripts |

## Scripts Inventory

### Core GitHub Scripts (200-209)

- `[HEICFLIP-200]_github_helper.sh`: Core utility functions used by other GitHub scripts
- `[HEICFLIP-201]_push_to_github.sh`: Main script for pushing changes to GitHub
- `[HEICFLIP-202]_push_to_github_clean.sh`: Push a clean version with temporary files removed

### Project-Specific Push Scripts (210-219)

- `[HEICFLIP-210]_push_heicflip_to_github.sh`: Push HEICFlip-specific configurations
- `[HEICFLIP-211]_push_jpgflip_to_github.sh`: Push JPGFlip-specific configurations
- `[HEICFLIP-212]_push_client_to_github.sh`: Push client-side changes only
- `[HEICFLIP-213]_push_heicflip_changes.sh`: Push HEICFlip specific changes
- `[HEICFLIP-214]_push_heicflip_changes_fixed.sh`: Push HEICFlip changes with fixes

### Git Operations (220-229)

- `[HEICFLIP-220]_git_reset_push.sh`: Reset local repository and push fresh changes
- `[HEICFLIP-221]_push_current_to_github.sh`: Push current working version

### Component-Specific Scripts (230-239)

- `[HEICFLIP-230]_push_css_fix.sh`: Push CSS-specific fixes
- `[HEICFLIP-231]_push_title_updates.sh`: Push title and metadata updates
- `[HEICFLIP-232]_push_complete_heicflip.sh`: Push complete HEICFlip application
- `[HEICFLIP-233]_push_better.sh`: Push optimized version

## Script Documentation

Each script includes a standard header:

```bash
#!/bin/bash
#
# [HEICFLIP-2XX] Script Name
#
# Purpose: Brief description of what this script does
#
# Usage: ./meta/tools/github/[HEICFLIP-2XX]_script_name.sh [options]
#
# Options:
#   -h, --help     Display this help message
#   -v, --verbose  Display detailed output during execution
#
# Author: Your Name
# Date: Creation/Last Update Date
```

## Usage Guidelines

1. All scripts should be run from the project root directory
2. Scripts follow the numbering convention `[HEICFLIP-2XX]` for GitHub operations
3. Scripts that need to update specific parts of the codebase should be named descriptively

## Adding New Scripts

When adding a new GitHub-related script:

1. Follow the numbering convention (200-299)
2. Include comprehensive header documentation
3. Update this README with the new script information
4. Ensure the script has executable permissions (`chmod +x`)

Last Updated: April 30, 2025