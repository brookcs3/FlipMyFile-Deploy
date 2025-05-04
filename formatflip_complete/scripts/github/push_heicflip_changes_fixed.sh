#!/bin/bash

# Set GitHub credentials from environment variables
GH_USERNAME=$GITHUB_USERNAME
GH_TOKEN=$GITHUB_TOKEN
REPO_URL="https://${GH_USERNAME}:${GH_TOKEN}@github.com/brookcs3/heicflip.git"
REPO_NAME="heicflip"

# Setup temporary directory for cloning
TMP_DIR="temp_clone_heicflip"
rm -rf $TMP_DIR
mkdir -p $TMP_DIR

# Clone existing repository
echo "Cloning existing repository..."
git clone $REPO_URL $TMP_DIR

# Configure Git
git config --global user.name "$GH_USERNAME"
git config --global user.email "$GH_USERNAME@users.noreply.github.com"

# Copy our changes to the cloned repository
echo "Copying changes to the repository..."
cp -r heicflip-improved/* $TMP_DIR/

# Navigate to the cloned repository
cd $TMP_DIR

# Stage all changes
echo "Staging changes..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "No changes to commit"
  exit 0
fi

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
git push origin main

echo "Done! Changes pushed to GitHub repository."