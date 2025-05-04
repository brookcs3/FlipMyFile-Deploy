#!/bin/bash

# This script helps deploy the FlipMyFile app to GitHub
# Run this script from your local environment after pulling changes from Replit

# Step 1: Make sure you're on the right branch
echo "Checking current branch..."
git branch

# Step 2: Stage all changes
echo "\nStaging all changes..."
git add .

# Step 3: Commit the changes with a meaningful message
echo "\nCommitting changes..."
git commit -m "Update FlipMyFile with document format support"

# Step 4: Push to the remote repository
echo "\nPushing to remote repository..."
git push origin main

echo "\nDeployment complete! Check your GitHub repository for the changes."
