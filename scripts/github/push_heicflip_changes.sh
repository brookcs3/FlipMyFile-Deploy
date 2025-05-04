#!/bin/bash

# Set GitHub credentials from environment variables
GH_USERNAME=$GITHUB_USERNAME
GH_TOKEN=$GITHUB_TOKEN
REPO_URL="https://${GH_USERNAME}:${GH_TOKEN}@github.com/brookcs3/heicflip.git"

# Navigate to the heicflip-improved directory
cd heicflip-improved

# Configure Git
git config --global user.name "$GH_USERNAME"
git config --global user.email "$GH_USERNAME@users.noreply.github.com"

# Check if the directory is a Git repository
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
  git remote add origin $REPO_URL
fi

# Stage all changes
echo "Staging changes..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Update HEICFlip with bidirectional conversion and improved documentation

- Added JPG to HEIC conversion support
- Improved conversion quality settings
- Removed debug panel from UI
- Added comprehensive documentation
- Fixed event listener issues"

# Push to GitHub
echo "Pushing changes to GitHub..."
git push -u origin main

echo "Done! Changes pushed to GitHub repository."