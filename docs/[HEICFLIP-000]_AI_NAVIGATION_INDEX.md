# [HEICFLIP-000] Master Navigation Index

This document serves as the primary navigation index for the HEICFlip project, providing a comprehensive overview of all documentation, scripts, and project components.

## Project Organization Overview

The HEICFlip project follows a strict organization system with these key principles:
1. **Clean Root Directory**: Only essential files in the root folder
2. **Numbered Documentation**: All documentation uses [HEICFLIP-XXX] prefix
3. **Organized Directories**: Clear separation between core app and supporting files
4. **Self-Documenting Structure**: Each directory includes its own README

## Directory Structure

```
/
├── client/            # Frontend React application
├── server/            # Backend Express server
├── shared/            # Shared types and utilities
├── meta/              # All supporting files (not part of core app)
│   ├── docs/          # Documentation organized by topic
│   ├── tools/         # Utility scripts organized by purpose
│   │   ├── github/    # GitHub and version control scripts
│   │   ├── backup/    # Backup and restore system
│   │   ├── project/   # Project management scripts
│   │   ├── deployment/# Deployment and release scripts
│   │   └── maintenance/ # Code maintenance scripts
│   └── assets/        # Supporting assets not part of the app
└── [Essential Files]  # Only configuration and entry points
```

## Documentation Index

### Project Organization (000-099)
- `[HEICFLIP-000]_AI_NAVIGATION_INDEX.md`: This master navigation index
- `[HEICFLIP-001]_AI_INSTRUCTIONS.md`: Instructions for AI assistants
- `[HEICFLIP-010]_PROJECT_RENAME.sh`: Project renaming script
- `[HEICFLIP-050]_NAME_CHANGE_GUIDE.md`: Guide for renaming the project

### Core Documentation (100-199)
- `[HEICFLIP-100]_PROJECT_OVERVIEW.md`: Comprehensive project overview
- `[HEICFLIP-101]_ARCHITECTURE.md`: System architecture documentation
- `[HEICFLIP-110]_USER_GUIDE.md`: End-user documentation

### GitHub Scripts (200-299)
- `[HEICFLIP-200]_github_helper.sh`: Core GitHub helper functions
- `[HEICFLIP-201]_push_to_github.sh`: Push changes to GitHub
- *See `meta/tools/github/README.md` for full list*

### Development (300-399)
- `[HEICFLIP-300]_DEVELOPMENT_GUIDE.md`: Developer onboarding guide
- `[HEICFLIP-301]_CONTRIBUTION_GUIDELINES.md`: How to contribute
- `[HEICFLIP-310]_CODE_STYLE.md`: Coding standards and style guide

### Maintenance (500-599)
- `[HEICFLIP-500]_MAINTENANCE_GUIDE.md`: System maintenance procedures
- *See `meta/tools/maintenance/README.md` for maintenance scripts*

### Deployment (700-799)
- `[HEICFLIP-700]_DEPLOYMENT_GUIDE.md`: Deployment instructions
- *See `meta/tools/deployment/README.md` for deployment scripts*

### Backup System (900-999)
- `[HEICFLIP-900]_BACKUP_SYSTEM.md`: Backup system documentation
- `[HEICFLIP-910]_save_version.sh`: Save current project state
- `[HEICFLIP-911]_restore_version.sh`: Restore from saved project state

## Core Application Components

### Client-Side Components
- React frontend with Vite
- HEIC/JPG conversion using browser APIs
- Web Worker processing for responsiveness

### Server-Side Components
- Express.js server for static file serving
- Minimal API endpoints

## Development Workflow

1. **Start Here**: Read README.md and [HEICFLIP-100]_PROJECT_OVERVIEW.md
2. **Development**: Follow guidelines in [HEICFLIP-300]_DEVELOPMENT_GUIDE.md
3. **Backups**: Create regular backups with [HEICFLIP-910]_save_version.sh
4. **Deployment**: Use deployment scripts as documented in [HEICFLIP-700]_DEPLOYMENT_GUIDE.md

## For AI Assistants

When working with this codebase:
1. Use this index as your starting point for navigation
2. Reference specific documentation based on the task at hand
3. Follow the established organization and naming conventions
4. Maintain the clean root directory principle

Last Updated: April 30, 2025