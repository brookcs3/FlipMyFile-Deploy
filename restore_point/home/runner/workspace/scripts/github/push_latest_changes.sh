#!/bin/bash

# Script to push the latest changes to GitHub
# This script uses GITHUB_ACCESS_TOKEN directly

# Exit on error
set -e

# GitHub details
TOKEN="YOUR_GITHUB_TOKEN"
USERNAME="brookcs3"
REPO_NAME="heicflip"
REPO_URL="https://${TOKEN}@github.com/${USERNAME}/${REPO_NAME}.git"

echo "Starting GitHub push for latest HEICFlip changes..."

# Configure Git
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Check if origin remote exists, update it if it does
if git remote | grep -q "^origin$"; then
  echo "Updating origin remote URL..."
  git remote set-url origin $REPO_URL
else
  echo "Adding origin remote..."
  git remote add origin $REPO_URL
fi

# Add all files
echo "Staging changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "No changes to commit"
  exit 0
fi

# Commit
echo "Committing changes..."
git commit -m "Add SEO enhancements to HEICFlip

- Added Open Graph meta tags for better social media sharing
- Added Twitter Card meta tags for Twitter preview support
- Added structured data JSON-LD for WebApplication schema
- Created a new FAQ section with common questions about HEIC/JPG conversion
- Added FAQPage JSON-LD schema for better search engine rich results"

# Push to GitHub
echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo "----------------------------------------"
echo "🎉 Success! Latest changes have been pushed to:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo "----------------------------------------"