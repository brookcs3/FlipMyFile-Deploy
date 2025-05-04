#!/bin/bash

# This script uploads a single file to GitHub with proper SHA handling

# Check for input parameters
if [ $# -ne 1 ]; then
  echo "Usage: $0 <file_path>"
  exit 1
fi

FILE_PATH=$1

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
  echo "Error: File $FILE_PATH does not exist"
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
OWNER="brookcs3"

# First, get the existing file's SHA if it exists
echo "Getting SHA for $FILE_PATH..."
RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$FILE_PATH")

# Check if file exists and extract SHA
if echo "$RESPONSE" | grep -q '"sha"'; then
  SHA=$(echo "$RESPONSE" | grep -o '"sha":"[^"]*"' | head -1 | cut -d '"' -f 4)
  echo "Found SHA: $SHA"
  SHA_PARAM=",\"sha\":\"$SHA\""
else
  echo "File does not exist yet, creating new file"
  SHA_PARAM=""
fi

# Upload the file
echo "Uploading $FILE_PATH..."
FILE_CONTENT=$(cat "$FILE_PATH" | base64 -w 0)
COMMIT_MESSAGE="Add $FILE_PATH"

# Create or update file via GitHub API
RESPONSE=$(curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$FILE_PATH" \
  -d '{"message":"'"$COMMIT_MESSAGE"'","content":"'"$FILE_CONTENT"'"'"$SHA_PARAM"'}')

# Check response for success or failure
if echo "$RESPONSE" | grep -q '"content"'; then
  echo "Successfully uploaded $FILE_PATH"
  exit 0
else
  echo "Failed to upload $FILE_PATH"
  echo "Response: $RESPONSE"
  exit 1
fi
