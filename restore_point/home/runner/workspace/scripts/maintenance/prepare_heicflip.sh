#!/bin/bash

# Script to prepare the HEICFlip repository for GitHub
echo "Preparing HEICFlip for GitHub push..."

# Copy the README
cp README_heicflip.md README.md

# Create a proper .gitignore file
cat > .gitignore << EOF
node_modules/
dist/
.cache/
.env
.DS_Store
.vscode/
*.log
EOF

# Remove unnecessary files
rm -f aviflip-cloudflare-deploy.zip
rm -f jpgflip-project.zip
rm -rf .git

# Clean up existing non-essential directories to keep the repo focused
rm -rf cloudflare-upload
rm -rf jpgflip-full
rm -rf webp-flip
rm -rf test-example
rm -f *.zip

# Zip the project for backup
zip -r heicflip.zip . -x "node_modules/*" "dist/*" ".cache/*" ".git/*" "*.zip"

echo "HEICFlip preparation complete!"
echo "To push to GitHub, run: ./push_heicflip_to_github.sh"