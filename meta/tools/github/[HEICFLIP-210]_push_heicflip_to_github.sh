#!/bin/bash

# Script to push HEICFlip to GitHub
# This script will create a new GitHub repository and push the HEICFlip code to it

# Exit on error
set -e

echo "Starting GitHub repository setup for HEICFlip..."

# GitHub credentials are stored in environment variables
USERNAME="${GITHUB_USERNAME}"
TOKEN="${GITHUB_TOKEN}"
REPO_NAME="heicflip"

# Check if credentials are available
if [ -z "$USERNAME" ] || [ -z "$TOKEN" ]; then
  echo "ERROR: GitHub credentials are missing. Please set GITHUB_USERNAME and GITHUB_TOKEN."
  exit 1
fi

# Create a GitHub repository
echo "Creating GitHub repository: $REPO_NAME..."
curl -s -X POST -H "Authorization: token $TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user/repos \
     -d "{\"name\":\"$REPO_NAME\",\"description\":\"HEIC to JPG converter with amber theme\",\"private\":false}"

echo "GitHub repository created. Setting up local Git repository..."

# Initialize Git if not already initialized
if [ ! -d .git ]; then
  git init
fi

# Set Git user details
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Ensure we have a README
if [ ! -f README.md ]; then
  cp README_heicflip.md README.md
fi

# Clean up unnecessary files
echo "Cleaning up before commit..."
# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
  echo "node_modules" > .gitignore
  echo "dist" >> .gitignore
  echo ".cache" >> .gitignore
  echo ".env" >> .gitignore
fi

# Add all files
git add .

# Commit
git commit -m "Initial commit of HEICFlip - HEIC to JPG converter with amber theme"

# Add remote and push
echo "Pushing to GitHub..."
git remote add origin https://$TOKEN@github.com/$USERNAME/$REPO_NAME.git
git branch -M main
git push -u origin main

echo "----------------------------------------"
echo "🎉 Success! HEICFlip has been pushed to:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo "----------------------------------------"