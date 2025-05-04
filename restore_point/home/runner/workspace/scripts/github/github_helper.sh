#!/bin/bash

# Helper script for GitHub operations
# This script ensures we always use the correct GitHub token

# Function to perform GitHub API calls
github_api_call() {
  local method=$1
  local endpoint=$2
  local data=$3
  
  # Always use GITHUB_ACCESS_TOKEN
  curl -s \
    -X "$method" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Authorization: token $GITHUB_ACCESS_TOKEN" \
    ${data:+-d "$data"} \
    "https://api.github.com/$endpoint"
}

# Function to get file SHA
get_file_sha() {
  local repo=$1
  local filepath=$2
  
  local response=$(github_api_call "GET" "repos/$repo/contents/$filepath")
  echo "$response" | grep -o '"sha": "[^"]*"' | cut -d'"' -f4
}

# Function to update a file
update_github_file() {
  local repo=$1
  local filepath=$2
  local message=$3
  local content_file=$4
  
  # Get the SHA
  local sha=$(get_file_sha "$repo" "$filepath")
  
  # Base64 encode the content
  local content=$(base64 -w 0 "$content_file")
  
  # Create JSON payload
  local data="{\"message\": \"$message\", \"content\": \"$content\", \"sha\": \"$sha\"}"
  
  # Make the API call
  github_api_call "PUT" "repos/$repo/contents/$filepath" "$data"
}

# Function to get a list of files in a directory
list_github_directory() {
  local repo=$1
  local directory=$2
  
  github_api_call "GET" "repos/$repo/contents/$directory"
}

# If this script is being executed directly, show help
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "GitHub Helper Script"
  echo "-------------------"
  echo "This script provides helper functions for GitHub operations."
  echo ""
  echo "Functions:"
  echo "  github_api_call METHOD ENDPOINT [DATA]"
  echo "  get_file_sha REPO FILEPATH"
  echo "  update_github_file REPO FILEPATH COMMIT_MESSAGE CONTENT_FILE"
  echo "  list_github_directory REPO DIRECTORY"
  echo ""
  echo "Example usage:"
  echo "  source ./github_helper.sh"
  echo "  update_github_file 'brookcs3/heicflip' 'vercel.json' 'Update config' '/tmp/vercel.json'"
fi