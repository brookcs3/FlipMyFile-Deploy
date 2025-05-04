#!/bin/bash

# This script will push the complete HEICFlip project structure to GitHub
# First, set up Git credentials
git config --global user.name "brookcs3"
git config --global user.email "brooksc3@oregonstate.edu"

# Create a temporary directory for our clean repo
TEMP_DIR=$(mktemp -d)
cd $TEMP_DIR

# Initialize a fresh repository
git init
git remote add origin https://github.com/brookcs3/heicflip.git

# Copy the proper structure from the project directory
echo "Copying project files..."
mkdir -p client/src server shared

# Store the current project directory
PROJECT_DIR=$(pwd)
cd -

# Copy the client directory structure
cp -r client/* $TEMP_DIR/client/
cp -r server/* $TEMP_DIR/server/
cp -r shared/* $TEMP_DIR/shared/

# Copy root configuration files
cp *.json $TEMP_DIR/
cp *.ts $TEMP_DIR/
cp .replit $TEMP_DIR/ 2>/dev/null || echo "No .replit file to copy"
cp README.md $TEMP_DIR/ 2>/dev/null || echo "No README.md file to copy"
cp -r .github $TEMP_DIR/ 2>/dev/null || echo "No .github directory to copy"

cd $TEMP_DIR

# Create a proper README.md if not already present
if [ ! -f "README.md" ]; then
  echo "# HEICFlip" > README.md
  echo "HEIC to JPG converter with amber/orange theme" >> README.md
  echo "" >> README.md
  echo "A modern, client-side image converter that transforms HEIC files to JPG and vice versa." >> README.md
fi

# Add all files
git add .

# Commit
git commit -m "Replace broken files with deploy-ready structure"

# Use GitHub token for authentication
git remote set-url origin https://$GITHUB_TOKEN@github.com/brookcs3/heicflip.git

# Force push to overwrite the remote repository
echo "Pushing to GitHub..."
git push -f origin main

# Go back to the original directory
cd -
echo "Done! The repository should now have the correct structure for deployment."