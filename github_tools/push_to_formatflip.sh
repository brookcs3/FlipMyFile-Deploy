#!/bin/bash

# This script serves as a simple wrapper for pushing files to GitHub

# Check if file is provided
if [ -z "$1" ]; then
  echo "Error: No file specified."
  echo "Usage: $0 <file_path>"
  exit 1
fi

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
OWNER="brookcs3" # Your GitHub username

# File to upload
FILE_PATH=$1

# Function to upload a file
upload_file() {
  local file_path=$1
  
  # Check if file exists
  if [ ! -f "$file_path" ]; then
    echo "Error: File $file_path does not exist."
    exit 1
  fi
  
  local file_content=$(cat "$file_path" | base64 -w 0)
  local commit_message="Add $file_path"
  
  echo "Uploading $file_path..."
  
  # Check if the file already exists in the repository
  echo "Checking if file exists in repository..."
  FILE_INFO=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$file_path)
  
  SHA=$(echo $FILE_INFO | grep -o '"sha":"[^"]*"' | head -1 | cut -d ':' -f 2 | tr -d '"')
  
  # Create or update file via GitHub API
  if [ -z "$SHA" ]; then
    # File doesn't exist, create it
    curl -s -X PUT \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$file_path \
      -d '{"message":"'"$commit_message"'","content":"'"$file_content"'"}'
  else
    # File exists, update it
    curl -s -X PUT \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$file_path \
      -d '{"message":"'"$commit_message"'","content":"'"$file_content"'","sha":"'"$SHA"'"}'
  fi
    
  if [ $? -eq 0 ]; then
    echo "File $file_path uploaded successfully."
  else
    echo "Failed to upload $file_path."
  fi
}

# Main execution
echo "Starting GitHub file upload for: $FILE_PATH"

# Upload the file
upload_file "$FILE_PATH"

echo "GitHub file upload complete."
