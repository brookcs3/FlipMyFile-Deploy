#!/bin/bash

# This script removes all unnecessary zip files, templates, and temporary files
# from the project root to keep only essential files

echo "Cleaning up project files..."

# Remove all zip files
echo "Removing zip files..."
find . -maxdepth 1 -name "*.zip" -type f -delete

# Remove temporary and backup files
echo "Removing temporary and backup files..."
find . -maxdepth 1 -name "temp-*" -type f -delete
find . -maxdepth 1 -name "*_BAK.*" -type f -delete
find . -maxdepth 1 -name "*.bak" -type f -delete

# Remove template and content files
echo "Removing template content files..."
find . -maxdepth 1 -name "*-content.txt" -type f -delete
find . -maxdepth 1 -name "temp-*.*" -type f -delete
find . -maxdepth 1 -name "TEMPLATE-*" -type f -delete

# Remove old scripts that are no longer needed
echo "Removing unused scripts..."
find . -maxdepth 1 -name "delete_files.sh" -type f -delete
find . -maxdepth 1 -name "deploy-*.sh" -type f -delete
find . -maxdepth 1 -name "fix_*.sh" -type f -delete
find . -maxdepth 1 -name "setup_*.sh" -type f -delete
find . -maxdepth 1 -name "update_*.sh" -type f -delete
find . -maxdepth 1 -name "upload_*.sh" -type f -delete
find . -maxdepth 1 -name "prepare-*.sh" -type f -delete
find . -maxdepth 1 -name "run_*.sh" -type f -delete
find . -maxdepth 1 -name "remove_*.sh" -type f -delete
find . -maxdepth 1 -name "optimize_*.sh" -type f -delete

# Keep only the most important README and markdown files
echo "Cleaning up documentation files..."
find . -maxdepth 1 -name "README_*.md" -type f -delete

echo "Project cleanup complete. Only essential files remain."