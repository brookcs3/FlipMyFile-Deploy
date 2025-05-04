# Deployment Scripts

This directory contains scripts for deployment, release management, and publishing for the HEICFlip project.

## Purpose

These scripts handle various deployment operations including:
- Publishing to hosting platforms
- Managing release versions
- Configuring deployment environments
- Preparing distribution packages

## Scripts Organization

All deployment scripts follow the `[HEICFLIP-7XX]` numbering convention for clear identification:

| Number Range | Purpose |
|--------------|---------|
| 700-709 | Core deployment utility scripts |
| 710-719 | Environment-specific deployment |
| 720-729 | Release management |
| 730-739 | Distribution packaging |
| 740-749 | Post-deployment verification |

## Scripts Inventory

### Core Deployment Scripts (700-709)

- `[HEICFLIP-700]_deploy_helper.sh`: Core utility functions used by other deployment scripts

### Environment Deployment Scripts (710-719)

- `[HEICFLIP-710]_deploy_production.sh`: Deploy to production environment
- `[HEICFLIP-711]_deploy_staging.sh`: Deploy to staging environment

### Release Management (720-729)

- `[HEICFLIP-720]_create_release.sh`: Create a new release with proper versioning
- `[HEICFLIP-721]_tag_release.sh`: Tag a release in Git

### Distribution Packaging (730-739)

- `[HEICFLIP-730]_package_distribution.sh`: Create distribution packages
- `[HEICFLIP-731]_create_artifacts.sh`: Generate deployment artifacts

## Script Documentation

Each script includes a standard header:

```bash
#!/bin/bash
#
# [HEICFLIP-7XX] Script Name
#
# Purpose: Brief description of what this script does
#
# Usage: ./meta/tools/deployment/[HEICFLIP-7XX]_script_name.sh [options]
#
# Options:
#   -h, --help     Display this help message
#   -v, --verbose  Display detailed output during execution
#   -e, --env      Specify deployment environment
#
# Author: Your Name
# Date: Creation/Last Update Date
```

## Usage Guidelines

1. All scripts should be run from the project root directory
2. Scripts follow the numbering convention `[HEICFLIP-7XX]` for deployment operations
3. When deploying to production, always test on staging first
4. Create backup points before deployment operations

## Adding New Scripts

When adding a new deployment-related script:

1. Follow the numbering convention (700-799)
2. Include comprehensive header documentation
3. Update this README with the new script information
4. Ensure the script has executable permissions (`chmod +x`)

Last Updated: April 30, 2025