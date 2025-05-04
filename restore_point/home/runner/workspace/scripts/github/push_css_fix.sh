#!/bin/bash

# Set GitHub credentials from environment variables
GH_USERNAME=$GITHUB_USERNAME
GH_TOKEN=$GITHUB_TOKEN
REPO_URL="https://${GH_USERNAME}:${GH_TOKEN}@github.com/brookcs3/heicflip.git"
REPO_NAME="heicflip"

# Setup temporary directory for cloning
TMP_DIR="temp_clone_fix"
rm -rf $TMP_DIR
mkdir -p $TMP_DIR

# Clone existing repository
echo "Cloning existing repository..."
git clone $REPO_URL $TMP_DIR

# Configure Git
git config --global user.name "$GH_USERNAME"
git config --global user.email "$GH_USERNAME@users.noreply.github.com"

# Copy our fixed CSS file to the cloned repository
echo "Copying CSS fix to the repository..."
mkdir -p $TMP_DIR/client/src
cp heicflip-improved/client/src/index.css $TMP_DIR/client/src/

# Navigate to the cloned repository
cd $TMP_DIR

# Stage changes
echo "Staging changes..."
git add client/src/index.css

# Commit changes
echo "Committing changes..."
git commit -m "Fix: Update border CSS to fix Tailwind build error

- Replace border-border with explicit HSL value
- Fix deployment build error on Vercel"

# Push to GitHub
echo "Pushing changes to GitHub..."
git push origin main

echo "Done! CSS fix pushed to GitHub repository."