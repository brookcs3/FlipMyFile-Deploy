#!/bin/bash

# This is a master script for pushing files to GitHub
# It handles both new files and updates to existing files

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
OWNER="brookcs3" # Your GitHub username

# Function to push a single file
push_file() {
  local file_path=$1
  
  # Check if file exists locally
  if [ ! -f "$file_path" ]; then
    echo "Error: File $file_path does not exist locally."
    return 1
  fi
  
  echo "Processing $file_path..."
  
  # Use the dedicated push script
  ./push_to_formatflip.sh "$file_path"
  
  return $?
}

# Function to create necessary directories for a file
create_directories() {
  local file_path=$1
  local dir_path=$(dirname "$file_path")
  
  # Skip if it's the current directory
  if [ "$dir_path" = "." ]; then
    return 0
  fi
  
  echo "Ensuring directory structure exists for: $dir_path"
  
  # Create all parent directories
  local current_path=""
  IFS='/' read -ra DIRS <<< "$dir_path"
  for dir in "${DIRS[@]}"; do
    if [ -z "$current_path" ]; then
      current_path="$dir"
    else
      current_path="$current_path/$dir"
    fi
    
    # Check if directory exists in GitHub
    echo "Checking if directory exists: $current_path"
    DIR_INFO=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$current_path)
    
    # If directory doesn't exist, create it
    if [[ $DIR_INFO == *"Not Found"* ]] || [[ $DIR_INFO == *"not found"* ]]; then
      echo "Creating directory: $current_path"
      
      curl -s -X PUT \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$current_path/.gitkeep \
        -d '{"message":"Create directory '$current_path'","content":"'"$(echo -n "" | base64 -w 0)"'"}'
      
      sleep 1 # Avoid rate limiting
    fi
  done
  
  return 0
}

# Function to prepare and push a file
prepare_and_push() {
  local file_path=$1
  
  # Create directory structure first
  create_directories "$file_path"
  
  # Push the file
  push_file "$file_path"
  
  return $?
}

# Main execution
if [ $# -eq 0 ]; then
  echo "Error: No files specified."
  echo "Usage: $0 <file_path1> [file_path2 ...]"
  exit 1
fi

echo "Starting GitHub file uploads..."

# Process each file argument
for file in "$@"; do
  prepare_and_push "$file"
done

echo "GitHub file uploads complete."
