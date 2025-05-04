#!/bin/bash

# This script will push the current working client directory to the GitHub repository
# ensuring that what's running in Replit is what gets deployed to Vercel

# Set GitHub credentials from environment variables
GH_USERNAME=$GITHUB_USERNAME
GH_TOKEN=$GITHUB_TOKEN
REPO_URL="https://${GH_USERNAME}:${GH_TOKEN}@github.com/brookcs3/heicflip.git"

# Configure Git
git config --global user.name "$GH_USERNAME"
git config --global user.email "$GH_USERNAME@users.noreply.github.com"

# Check if we have a .git folder in the root directory
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
  git remote add origin $REPO_URL
fi

# Stage all necessary files
echo "Staging files..."
git add package.json package-lock.json tsconfig.json vite.config.ts server client shared vercel.json tailwind.config.ts postcss.config.js drizzle.config.ts

# Commit changes
echo "Committing changes..."
git commit -m "Update HEICFlip with consistent amber theme and HEIC references

- Using direct HEX color values (#DD7230, #B85A25, #F39C6B) for consistency
- Updated all text references from AVIF to HEIC
- Simplified config to always use heicFlipConfig for consistent theming
- Fixed Vercel deployment output directory"

# Push to GitHub
echo "Pushing changes to GitHub..."
git push -u origin main -f

echo "Done! Current working directory pushed to GitHub repository."