#!/bin/bash

# Create a timestamped version of the project
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
VERSION_DIR="versions/version_${TIMESTAMP}"

# Create version directory
mkdir -p "$VERSION_DIR"

# Copy important files to the version directory
cp -r --parents $(find . -type f -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*") "$VERSION_DIR/"

# Create a version info file
echo "Version created on $(date)" > "$VERSION_DIR/VERSION_INFO.txt"
echo "Description: $1" >> "$VERSION_DIR/VERSION_INFO.txt"

echo "Version saved to $VERSION_DIR"

# List all versions
echo "Available versions:"
ls -la versions/
