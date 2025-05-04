#!/bin/bash
#
# [HEICFLIP-201] Push to GitHub
#
# Purpose: Main script for pushing the HEICFlip project to GitHub
#          Copies essential files and performs a clean push
#
# Usage: ./meta/tools/github/[HEICFLIP-201]_push_to_github.sh [TOKEN] [COMMIT_MESSAGE]
#
# Options:
#   TOKEN           GitHub personal access token (optional if GITHUB_ACCESS_TOKEN env var is set)
#   COMMIT_MESSAGE  Custom commit message (optional, defaults to "Update HEICFlip project files")
#
# Author: HEICFlip Team
# Date: April 30, 2025
#
# GitHub configuration
GITHUB_ACCESS_TOKEN="${GITHUB_ACCESS_TOKEN:-$1}"  # Try to get from environment or first parameter
if [ -z "$GITHUB_ACCESS_TOKEN" ]; then
  echo "Error: GitHub token not provided. Please specify as first parameter or set GITHUB_ACCESS_TOKEN environment variable."
  exit 1
fi

GITHUB_USERNAME="brookcs3"
REPO_NAME="heicflip"
REPO_URL="https://${GITHUB_ACCESS_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Get the commit message from the second parameter or use a default
COMMIT_MESSAGE="${2:-Update HEICFlip project files}"

# Create a temporary directory
TEMP_DIR="temp_github_push"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy essential files to temp directory
echo "Copying project files to temporary directory..."
cp -r client $TEMP_DIR/
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/
cp vite.config.ts $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp vercel.json $TEMP_DIR/
cp -r server $TEMP_DIR/
cp -r shared $TEMP_DIR/
cp -r public $TEMP_DIR/ 2>/dev/null || mkdir -p $TEMP_DIR/public
cp README.md $TEMP_DIR/
cp tailwind.config.ts $TEMP_DIR/
cp postcss.config.js $TEMP_DIR/

# Navigate to the temp directory
cd $TEMP_DIR

# Initialize git and configure
git init
git config user.name "${GITHUB_USERNAME}"
git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"

# Add all files
git add .

# Commit changes
git commit -m "$COMMIT_MESSAGE"

# Add remote and push
git remote add origin $REPO_URL
git push -f origin main

# Clean up
cd ..
rm -rf $TEMP_DIR
echo "Push to GitHub completed. Repository updated with latest files."