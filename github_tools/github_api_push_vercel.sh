#!/bin/bash

# This script uploads vercel.json to GitHub

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
OWNER="brookcs3" # Your GitHub username

# First get the SHA of the file if it exists
echo "Checking if vercel.json exists..."
FILE_INFO=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$OWNER/$REPO_NAME/contents/vercel.json)

SHA=$(echo $FILE_INFO | grep -o '"sha":"[^"]*"' | head -1 | cut -d ':' -f 2 | tr -d '"')

# Function to create or update a file via GitHub API
create_file() {
  local file_path="vercel.json"
  local file_content=$(cat "$file_path" | base64 -w 0)
  local commit_message="Add vercel.json configuration"
  
  echo "Uploading vercel.json..."
  
  # Create or update file via GitHub API
  if [ -z "$SHA" ]; then
    # File doesn't exist, create it
    curl -s -X PUT \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/repos/$OWNER/$REPO_NAME/contents/vercel.json \
      -d '{"message":"'"$commit_message"'","content":"'"$file_content"'"}'
  else
    # File exists, update it
    curl -s -X PUT \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/repos/$OWNER/$REPO_NAME/contents/vercel.json \
      -d '{"message":"'"$commit_message"'","content":"'"$file_content"'","sha":"'"$SHA"'"}'
  fi
    
  if [ $? -eq 0 ]; then
    echo "File vercel.json uploaded successfully."
  else
    echo "Failed to upload vercel.json."
  fi
}

# Main execution
echo "Starting GitHub API vercel.json upload..."

# Upload vercel.json
create_file

echo "vercel.json upload process complete."
