#!/bin/bash

# This script recursively uploads all files in a directory to GitHub

# Check if directory is provided
if [ -z "$1" ]; then
  echo "Error: No directory specified."
  echo "Usage: $0 <directory>"
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

# Directory to upload
DIRECTORY=$1

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

# Function to process a directory
process_directory() {
  local dir=$1
  
  # Create this directory in GitHub
  if [ "$dir" != "." ]; then
    create_directory "$dir"
  fi
  
  # Process all files in the directory
  find "$dir" -maxdepth 1 -type f | while read file; do
    # Skip certain files
    if [[ "$file" != *".git"* && "$file" != *"node_modules"* && "$file" != *"package-lock.json"* ]]; then
      upload_file "$file"
    fi
  done
  
  # Process all subdirectories
  find "$dir" -maxdepth 1 -type d | while read subdir; do
    # Skip current directory, .git, and node_modules
    if [[ "$subdir" != "$dir" && "$subdir" != *".git"* && "$subdir" != *"node_modules"* ]]; then
      process_directory "$subdir"
    fi
  done
}

# Main execution
echo "Starting GitHub directory upload for: $DIRECTORY"

# Check if directory exists
if [ ! -d "$DIRECTORY" ]; then
  echo "Error: Directory $DIRECTORY does not exist."
  exit 1
fi

# Start processing from the specified directory
process_directory "$DIRECTORY"

echo "GitHub directory upload complete for: $DIRECTORY"
