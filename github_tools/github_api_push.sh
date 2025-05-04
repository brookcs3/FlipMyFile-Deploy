#!/bin/bash

# This script uses the GitHub API to create or update repositories
# without directly using Git commands

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
REPO_DESCRIPTION="A sophisticated developer toolchain for intelligent code and visual asset transformation"
OWNER="brookcs3" # Your GitHub username

# Function to create a new repository
create_repo() {
  echo "Creating repository $REPO_NAME..."
  
  # Create repo via GitHub API
  curl -s -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/user/repos \
    -d '{"name":"'"$REPO_NAME"'","description":"'"$REPO_DESCRIPTION"'","private":false}'
    
  if [ $? -eq 0 ]; then
    echo "Repository created successfully."
  else
    echo "Failed to create repository. It might already exist."
  fi
}

# Function to create a file via GitHub API
create_file() {
  local file_path=$1
  local file_content=$(cat "$file_path" | base64 -w 0)
  local commit_message="Add $file_path via API"
  
  echo "Uploading $file_path..."
  
  # Create file via GitHub API
  curl -s -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$file_path \
    -d '{"message":"'"$commit_message"'","content":"'"$file_content"'"}'
    
  if [ $? -eq 0 ]; then
    echo "File $file_path uploaded successfully."
  else
    echo "Failed to upload $file_path."
  fi
}

# Main execution
echo "Starting GitHub API-based repository setup..."

# Step 1: Create the repository (if it doesn't exist)
create_repo

# Step 2: Upload key files
create_file "README.md"
create_file "LICENSE"
create_file ".gitignore"
create_file "GITHUB_INSTRUCTIONS.md"

# Step 3: Upload config files
create_file "package.json"
create_file "tsconfig.json"
create_file "vite.config.ts"
create_file "tailwind.config.ts"
create_file "drizzle.config.ts"
create_file "postcss.config.js"

# Step 4: Upload demo files
create_file "format-transformation-demo.html"

# Don't upload node_modules or other large directories
echo "Repository setup complete."
echo "Main files have been uploaded to GitHub."
echo "To upload additional files or directories, run this script again with modified file paths."
