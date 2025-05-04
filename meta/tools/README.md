# HEICFlip Project Tools Directory

This directory contains all utility scripts and tools for the HEICFlip project, organized by purpose and function.

## Directory Structure

```
meta/tools/
├── github/         # GitHub version control and deployment scripts
├── backup/         # Backup and restore system scripts
├── deployment/     # Deployment and release management scripts
├── project/        # Project management and renaming scripts
├── maintenance/    # Code maintenance and cleanup scripts 
└── dev/            # Development utility scripts
```

## Organization Rules

All scripts must follow these organization rules:

1. **Categorization**: Place each script in the most appropriate subdirectory based on its primary purpose
2. **Naming Convention**: All scripts should follow the `[HEICFLIP-XXX]_descriptive_name.sh` format
3. **Numbering Scheme**:
   - Scripts in `github/`: 200-299
   - Scripts in `backup/`: 900-999
   - Scripts in `deployment/`: 700-799
   - Scripts in `project/`: 000-099
   - Scripts in `maintenance/`: 500-599
   - Scripts in `dev/`: 300-399
4. **Documentation**: Each script must include a header comment explaining its purpose and usage
5. **Permissions**: All scripts must have execute permissions (`chmod +x`)

## File List by Directory

### GitHub Scripts (`github/`)

GitHub-related scripts for version control, pushing changes, and repository management:

| Script | Purpose |
|--------|---------|
| `[HEICFLIP-200]_github_helper.sh` | Core GitHub helper functions |
| `[HEICFLIP-201]_push_to_github.sh` | Push current changes to GitHub |
| `[HEICFLIP-202]_push_clean_to_github.sh` | Push a clean version to GitHub |
| `[HEICFLIP-210]_push_heicflip_to_github.sh` | Push HEICFlip-specific changes |
| `[HEICFLIP-211]_push_jpgflip_to_github.sh` | Push JPGFlip-specific changes |
| `[HEICFLIP-220]_git_reset_push.sh` | Reset and push fresh changes |

### Backup Scripts (`backup/`)

Scripts for creating and restoring backups of the project state:

| Script | Purpose |
|--------|---------|
| `[HEICFLIP-910]_save_version.sh` | Save current project state |
| `[HEICFLIP-911]_restore_version.sh` | Restore from saved project state |

### Project Scripts (`project/`)

Scripts for project setup, configuration, and management:

| Script | Purpose |
|--------|---------|
| `[HEICFLIP-010]_project_rename.sh` | Rename project across all files |
| `[HEICFLIP-020]_prepare_heicflip.sh` | Prepare HEICFlip configuration |

### Maintenance Scripts (`maintenance/`)

Scripts for code maintenance, cleanup, and health checks:

| Script | Purpose |
|--------|---------|
| `[HEICFLIP-500]_push_css_fix.sh` | Fix and update CSS |
| `[HEICFLIP-510]_push_better.sh` | Apply optimizations and improvements |
| `[HEICFLIP-520]_push_title_updates.sh` | Update titles and metadata |

### Deployment Scripts (`deployment/`)

Scripts for deployment and release management:

| Script | Purpose |
|--------|---------|
| `[HEICFLIP-700]_push_client_to_github.sh` | Deploy client changes |
| `[HEICFLIP-710]_push_complete_heicflip.sh` | Deploy complete application |
| `[HEICFLIP-720]_push_current_to_github.sh` | Deploy current working version |

## Usage Guidelines

1. **Running Scripts**: Scripts should be run from the project root directory
2. **Script Creation**: When creating a new script, use the appropriate directory and number prefix
3. **Maintenance**: Keep this README updated when adding or modifying scripts

For any script that needs to be easily accessible from the project root, create a proxy script that calls the actual script from its organized location.

Last Updated: April 30, 2025