#!/bin/bash

# This script creates necessary directories in the GitHub repository

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

# Main execution
echo "Starting GitHub directory structure creation..."

# Create main project directories
directories=(
  "client"
  "client/src"
  "client/public"
  "server"
  "shared"
  "scripts"
  "packages"
  "meta"
)

# Create each directory
for dir in "${directories[@]}"; do
  create_directory "$dir"
done

echo "GitHub directory structure creation complete."
