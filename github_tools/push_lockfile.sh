#!/bin/bash

# This script uploads just the package-lock.json file to GitHub

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
OWNER="brookcs3"

# Create file via GitHub API
create_file() {
  local file_path=$1
  local file_content=$(cat "$file_path" | base64 -w 0)
  local commit_message="Add $file_path via API"
  
  echo "Uploading $file_path..."
  
  # First, get the existing file's SHA if it exists
  local existing_sha=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$file_path" \
    | grep -o '"sha":"[^"]*"' | head -1 | cut -d '"' -f 4)
  
  local sha_param=""
  if [ ! -z "$existing_sha" ]; then
    sha_param=",\"sha\":\"$existing_sha\""
  fi
  
  # Create or update file via GitHub API
  curl -s -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$file_path" \
    -d '{"message":"'"$commit_message"'","content":"'"$file_content"'"'"$sha_param"'}'
    
  if [ $? -eq 0 ]; then
    echo "File $file_path uploaded successfully."
  else
    echo "Failed to upload $file_path."
  fi
}

# Main execution
echo "Uploading package-lock.json to GitHub..."
create_file "package-lock.json"
echo "Done!"
