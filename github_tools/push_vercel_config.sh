#!/bin/bash

# This script uploads vercel.json to GitHub with proper SHA handling

# Check if GitHub token is provided
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GitHub token not found."
  echo "Please set your GITHUB_TOKEN environment variable."
  exit 1
fi

# Repository settings
REPO_NAME="FormatFlip"
OWNER="brookcs3"
FILE_PATH="vercel.json"

# First, get the existing file's SHA if it exists
echo "Getting SHA for $FILE_PATH..."
SHA=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$FILE_PATH" \
  | grep -o '"sha":"[^"]*"' | head -1 | cut -d '"' -f 4)

if [ -z "$SHA" ]; then
  echo "SHA not found. File may not exist yet."
  SHA_PARAM=""
else
  echo "Found SHA: $SHA"
  SHA_PARAM=",\"sha\":\"$SHA\""
fi

# Upload the file
echo "Uploading $FILE_PATH..."
FILE_CONTENT=$(cat "$FILE_PATH" | base64 -w 0)
COMMIT_MESSAGE="Update vercel.json build command to use npm install"

# Create or update file via GitHub API
RESPONSE=$(curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$FILE_PATH" \
  -d '{"message":"'"$COMMIT_MESSAGE"'","content":"'"$FILE_CONTENT"'"'"$SHA_PARAM"'}')

echo "$RESPONSE"

# Check for success
if echo "$RESPONSE" | grep -q '"content"'; then
  echo "Successfully uploaded $FILE_PATH"
else
  echo "Failed to upload $FILE_PATH"
  exit 1
fi
