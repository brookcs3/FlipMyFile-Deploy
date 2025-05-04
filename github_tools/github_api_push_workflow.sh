#!/bin/bash

# This script uploads GitHub workflow for CI

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
OWNER="brookcs3" # Your GitHub username

# Function to create directory
create_directory() {
  local dir_path=$1
  local commit_message="Create directory $dir_path"
  
  echo "Creating directory $dir_path..."
  
  # GitHub requires a file to be created to make a directory
  # We'll create a .gitkeep file in the directory
  curl -s -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$dir_path/.gitkeep \
    -d '{"message":"'"$commit_message"'","content":"'"$(echo -n "" | base64 -w 0)"'"}'
    
  if [ $? -eq 0 ]; then
    echo "Directory $dir_path created successfully."
  else
    echo "Failed to create directory $dir_path. It might already exist."
  fi
  
  # Small delay to avoid rate limiting
  sleep 1
}

# Function to upload a file
upload_file() {
  local file_path=$1
  local file_content=$(cat "$file_path" | base64 -w 0)
  local commit_message="Add GitHub CI workflow"
  
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
echo "Starting GitHub workflow upload..."

# Create necessary directories
create_directory ".github"
create_directory ".github/workflows"

# Upload workflow file
upload_file ".github/workflows/ci.yml"

echo "GitHub workflow upload process complete."
