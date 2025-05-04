# Maintenance Scripts

This directory contains scripts for code maintenance, cleanup, and health checks for the HEICFlip project.

## Purpose

These scripts provide tools for:
- Code quality improvements
- CSS and styling fixes
- Performance optimizations
- Content and text updates

## Scripts Overview

### Styling and UI Maintenance

- `[HEICFLIP-500]_push_css_fix.sh`: Fixes and updates CSS styles across the application
- `[HEICFLIP-520]_push_title_updates.sh`: Updates titles and metadata throughout the project

### Performance and Optimization

- `[HEICFLIP-510]_push_better.sh`: Applies various optimizations and improvements to the codebase

## Usage Guidelines

1. Before running maintenance scripts:
   - Create a backup using the backup system
   - Run tests to establish a baseline
   - Understand what changes the script will make

2. After running maintenance scripts:
   - Verify all functionality still works
   - Test performance if relevant
   - Commit the changes to version control

## Script Naming Conventions

Maintenance scripts should follow these naming patterns:

- CSS/styling scripts: `[HEICFLIP-50X]_push_css_*.sh`
- Performance scripts: `[HEICFLIP-51X]_push_performance_*.sh`
- Content scripts: `[HEICFLIP-52X]_push_content_*.sh`
- Code quality scripts: `[HEICFLIP-53X]_push_quality_*.sh`
- Test scripts: `[HEICFLIP-54X]_push_test_*.sh`

## Adding New Scripts

When adding new maintenance scripts:

1. Follow the numbering convention (500-599)
2. Include comprehensive header documentation
3. Update this README with the new script information
4. Ensure the script has executable permissions (`chmod +x`)

Last Updated: April 30, 2025