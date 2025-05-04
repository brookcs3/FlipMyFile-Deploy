#!/bin/bash

# Use the SHA we already identified
SHA="87f6024702f4b5bbc2561f5ee2aa9595c4b1ad64"
FILE_PATH="vercel.json"
REPO_NAME="FormatFlip"
OWNER="brookcs3"

# Upload the file
echo "Uploading $FILE_PATH with SHA: $SHA"
FILE_CONTENT=$(cat "$FILE_PATH" | base64 -w 0)
COMMIT_MESSAGE="Update vercel.json build command to use npm install"

# Create or update file via GitHub API
RESPONSE=$(curl -s -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$OWNER/$REPO_NAME/contents/$FILE_PATH" \
  -d '{"message":"'"$COMMIT_MESSAGE"'","content":"'"$FILE_CONTENT"'","sha":"'"$SHA"'"}')

echo "$RESPONSE"

# Check for success
if echo "$RESPONSE" | grep -q '"content"'; then
  echo "Successfully uploaded $FILE_PATH"
else
  echo "Failed to upload $FILE_PATH"
  exit 1
fi
