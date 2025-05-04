#!/bin/bash

# Script to reset git state and push to GitHub using a temporary directory
# This script handles complex git states by creating a fresh clone

# Exit on error
set -e

# GitHub details
TOKEN="YOUR_GITHUB_TOKEN"
USERNAME="brookcs3"
REPO_NAME="heicflip"
REPO_URL="https://${TOKEN}@github.com/${USERNAME}/${REPO_NAME}.git"
TEMP_DIR="./temp_heicflip_repo"

echo "Starting GitHub push with fresh repository..."

# Create temp directory
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Try to clone the repository (this may fail if it doesn't exist yet)
if git clone $REPO_URL $TEMP_DIR; then
  echo "Successfully cloned existing repository"
else
  echo "Repository doesn't exist yet, creating a fresh one"
  mkdir -p $TEMP_DIR
  cd $TEMP_DIR
  git init
  cd ..
fi

# Get important files to copy
echo "Copying important files to temporary directory..."

# Copy client directory
cp -r ./client $TEMP_DIR/

# Copy server directory
cp -r ./server $TEMP_DIR/

# Copy shared directory
cp -r ./shared $TEMP_DIR/

# Copy configuration files
cp ./package.json $TEMP_DIR/
cp ./package-lock.json $TEMP_DIR/
cp ./tsconfig.json $TEMP_DIR/
cp ./tsconfig.node.json $TEMP_DIR/
cp ./vite.config.ts $TEMP_DIR/
cp ./tailwind.config.ts $TEMP_DIR/
cp ./postcss.config.js $TEMP_DIR/
cp ./components.json $TEMP_DIR/
cp ./drizzle.config.ts $TEMP_DIR/
cp ./vercel.json $TEMP_DIR/
cp ./README.md $TEMP_DIR/
cp ./.replit $TEMP_DIR/
cp ./.gitignore $TEMP_DIR/

# Go to temp directory
cd $TEMP_DIR

# Configure Git
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Add all files
echo "Staging changes..."
git add .

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
if git remote | grep -q "^origin$"; then
  echo "Remote origin already exists"
else
  git remote add origin $REPO_URL
fi

git branch -M main
git push -f origin main

echo "----------------------------------------"
echo "🎉 Success! HEICFlip has been pushed to:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo "----------------------------------------"

# Return to original directory
cd ..

echo "Cleaning up temporary directory..."
rm -rf $TEMP_DIR