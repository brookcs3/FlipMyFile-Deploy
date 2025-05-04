#!/bin/bash

# GitHub configuration
GITHUB_TOKEN="$GITHUB_TOKEN"
GITHUB_USERNAME="brookcs3"
REPO_NAME="heicflip"
REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

# Create a temporary directory
TEMP_DIR="temp_github_push"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy current client directory and supporting files to temp directory
echo "Copying client files to temporary directory..."
cp -r client $TEMP_DIR/
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/
cp vite.config.ts $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp vercel.json $TEMP_DIR/
cp -r server $TEMP_DIR/
cp -r shared $TEMP_DIR/
cp -r public $TEMP_DIR/ 2>/dev/null || mkdir -p $TEMP_DIR/public

# Navigate to the temp directory
cd $TEMP_DIR

# Initialize git and configure
git init
git config user.name "${GITHUB_USERNAME}"
git config user.email "${GITHUB_USERNAME}@users.noreply.github.com"

# Add all files
git add .

# Commit changes
git commit -m "Update HEICFlip with amber/orange theme and direct HEX colors

- Replaced HSL colors with direct HEX values (#DD7230, #B85A25, #F39C6B)
- Simplified config.ts to always use heicFlipConfig for consistency
- Updated gradient styling for better visual appearance
- Ensured consistent styling across all environments"

# Add remote and push
git remote add origin $REPO_URL
git push -f origin main

# Clean up
cd ..
echo "Push to GitHub completed. Repository updated with client directory."