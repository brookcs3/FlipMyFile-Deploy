#!/bin/bash

# This script keeps only the essential directories and files
# while removing all other project directories

# Define directories to remove (all project directories except the primary ones)
dirs_to_remove=(
  "aviflip"
  "fixed_css"
  "fresh_repo"
  "heicflip-clean"
  "heicflip-improved"
  "heicflip-new"
  "heicflip-project"
  "heicflip-scripts"
  "heicflip_clean_extract"
  "heicflip_clean_package"
  "heicflip_extract"
  "heicflip_latest"
  "temp-extract"
  "temp_check"
  "temp_clone_heicflip"
  "temp_fix"
  "temp_github_upload"
  "temp_vercel_update"
  "vercel_check"
  "temp_github_push"
)

echo "Cleaning up workspace..."

# Remove each directory
for dir in "${dirs_to_remove[@]}"; do
  if [ -d "$dir" ]; then
    echo "Removing $dir directory..."
    rm -rf "$dir"
  fi
done

echo "Workspace cleanup complete. Only essential files and directories remain."
echo "The client directory is now the primary source for the project."