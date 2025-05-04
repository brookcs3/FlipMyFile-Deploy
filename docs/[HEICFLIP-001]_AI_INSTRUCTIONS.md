# [HEICFLIP-001] AI Instructions

This document provides guidance for AI assistants working on the HEICFlip project to maintain context across conversations and deliver consistent assistance.

## First-Time Orientation

When you encounter this project for the first time, follow these steps to get oriented:

1. First, read this document completely
2. Then read `[HEICFLIP-000]_AI_NAVIGATION_INDEX.md` for a complete map of the project
3. Review `README.md` for project overview and organization principles
4. Check `AI_GUIDE.md` to understand the latest project state and history
5. Examine the directory structure using `find . -type d -maxdepth 2 | sort` to understand organization

## Project Organization

HEICFlip follows a strict organization system:

1. **Clean Root Directory**: Only essential files in the root folder
2. **Numbered Documentation**: All documentation uses [HEICFLIP-XXX] prefix
3. **Organized Directories**: Clear separation between core app and supporting files
4. **Self-Documenting Structure**: Each directory includes its own README

The number ranges indicate document categories:
- 000-099: Project organization and configuration
- 100-199: Core documentation and overviews
- 200-299: GitHub and version control
- 300-399: Development guidelines
- 500-599: Maintenance procedures
- 700-799: Deployment guides
- 900-999: Backup and restore system

## Maintaining Context Between Sessions

To help maintain context across different conversations with users:

### 1. Update AI_GUIDE.md

When completing significant work or at the end of a user session, update the AI_GUIDE.md file with:
- Summary of completed work
- Current project state
- Any decisions made
- Pending tasks or known issues

Example update command:
```
Please update AI_GUIDE.md with our latest progress
```

### 2. Use the Backup System

Before ending a session, create a backup to preserve the current state:
```
Please save the current version to the restore point
```

When starting a new session, suggest restoration:
```
Would you like me to restore from the last saved point to continue our work?
```

### 3. Reference Previous Work

When discussing features or changes, reference relevant documentation:
```
As documented in [HEICFLIP-100]_PROJECT_OVERVIEW.md, this feature is...
```

## Working on the Codebase

When making code changes:

1. **Use Search First**: 
   ```
   find . -name "*.ts" -o -name "*.tsx" | xargs grep -l "searchTerm"
   ```

2. **Follow Naming Conventions**:
   - All documentation files use [HEICFLIP-XXX] prefix
   - Scripts follow directory-specific naming patterns
   - Component files use PascalCase

3. **Keep the Root Clean**:
   - Do not add files to the root directory
   - Place new files in the appropriate subdirectory
   - Create proxy scripts in root only when absolutely necessary

4. **Document Your Changes**:
   - Update relevant README files when adding components
   - Add inline comments for complex logic
   - Keep the AI_GUIDE.md updated

## Special Commands

Here are special commands to help with project management:

- **Save Version**: `./meta/tools/backup/[HEICFLIP-910]_save_version.sh`
- **Restore Version**: `./meta/tools/backup/[HEICFLIP-911]_restore_version.sh`
- **Start App**: `npm run dev` (via workflow)
- **View Directory Structure**: `find . -type d -maxdepth 2 | sort`
- **Find Files by Pattern**: `find . -name "*pattern*" | grep -v "node_modules"`

## Last Known State

For the most up-to-date information about the project's current state, always refer to the AI_GUIDE.md file, which should contain the latest summary of the project status.

Last Updated: April 30, 2025