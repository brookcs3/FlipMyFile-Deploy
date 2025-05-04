#!/bin/bash

# Script to push the latest text changes to GitHub
# This script uses GITHUB_ACCESS_TOKEN directly

# Exit on error
set -e

# GitHub details
TOKEN="YOUR_GITHUB_TOKEN"
USERNAME="brookcs3"
REPO_NAME="heicflip"
REPO_URL="https://${TOKEN}@github.com/${USERNAME}/${REPO_NAME}.git"
TEMP_DIR="./temp_heicflip_repo"

echo "Starting GitHub push for text updates..."

# Create temp directory
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Try to clone the repository
echo "Cloning existing repository..."
git clone $REPO_URL $TEMP_DIR

# Get important files to copy
echo "Copying important files to temporary directory..."

# Copy updated files
cp -r ./client/src/pages/Home.tsx $TEMP_DIR/client/src/pages/
cp ./client/index.html $TEMP_DIR/client/

# Go to temp directory
cd $TEMP_DIR

# Configure Git
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Add the changed files
echo "Staging changes..."
git add client/src/pages/Home.tsx client/index.html

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "No changes to commit"
  exit 0
fi

# Commit
echo "Committing changes..."
git commit -m "Update page title and main heading

- Changed page title to 'Free HEIC to JPG Converter - Instant Online Conversion'
- Simplified main heading to 'Convert HEIC to JPG'
- Updated dynamic title setting in JavaScript code"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "----------------------------------------"
echo "🎉 Success! Text updates have been pushed to:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo "----------------------------------------"

# Return to original directory
cd ..

echo "Cleaning up temporary directory..."
rm -rf $TEMP_DIR