#!/bin/bash

# This script uploads key schema and database files to GitHub

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
OWNER="brookcs3" # Your GitHub username

# Function to upload a file
upload_file() {
  local file_path=$1
  local file_content=$(cat "$file_path" | base64 -w 0)
  local commit_message="Add $file_path"
  
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
  
  # Small delay to avoid rate limiting
  sleep 1
}

# Main execution
echo "Starting GitHub file uploads..."

# List of key files to upload
files=(
  "shared/schema.ts"
  "server/storage.ts"
  "server/db.ts"
  "server/index.ts"
  "server/routes.ts"
  "server/vite.ts"
)

# Upload each file
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    upload_file "$file"
  else
    echo "Warning: $file not found, skipping."
  fi
done

echo "GitHub file uploads complete."
