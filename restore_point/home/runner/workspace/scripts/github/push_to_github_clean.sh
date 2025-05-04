#!/bin/bash

# Exit on error
set -e

echo "Starting GitHub repository setup for HEICFlip..."

# GitHub credentials
USERNAME="${GITHUB_USERNAME}"
TOKEN="${GITHUB_TOKEN}"
REPO_NAME="heicflip"

echo "Using username: $USERNAME"

# Create GitHub repository 
echo "Creating GitHub repository: $REPO_NAME..."
curl -s -X POST -H "Authorization: token $TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     https://api.github.com/user/repos \
     -d "{\"name\":\"$REPO_NAME\",\"description\":\"HEIC to JPG converter with amber theme\",\"private\":false}" \
     || echo "Repository may already exist, continuing..."

echo "Setting up local Git repository..."

# Initialize Git if needed
if [ ! -d .git ]; then
  git init
fi

# Configure Git
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Add all files
git add .

# Commit changes
git commit -m "Initial commit of HEICFlip - HEIC to JPG converter with amber theme" || echo "Nothing to commit"

# Push to GitHub
echo "Pushing to GitHub..."
git remote remove origin || true
git remote add origin "https://$USERNAME:$TOKEN@github.com/$USERNAME/$REPO_NAME.git"
git branch -M main
git push -u origin main --force

echo "----------------------------------------"
echo "🎉 Success! HEICFlip has been pushed to:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo "----------------------------------------"
