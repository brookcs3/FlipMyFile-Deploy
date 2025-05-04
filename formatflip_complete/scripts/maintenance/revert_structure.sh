#!/bin/bash

# Script to revert the directory structure changes and restore the original setup

echo "Reverting directory structure changes..."

# Move files from config back to root if they don't already exist
# Check if the symlinks exist and remove them first
if [ -L tailwind.config.ts ]; then
  rm tailwind.config.ts
  cp config/tailwind.config.ts ./
fi

if [ -L postcss.config.js ]; then
  rm postcss.config.js
  cp config/postcss.config.js ./
fi

if [ -L tsconfig.json ]; then
  rm tsconfig.json
  cp config/tsconfig.json ./
fi

if [ -L tsconfig.node.json ]; then
  rm tsconfig.node.json
  cp config/tsconfig.node.json ./
fi

if [ -L vite.config.ts ]; then
  rm vite.config.ts
  cp config/vite.config.ts ./
fi

if [ -L vercel.json ]; then
  rm vercel.json
  cp config/vercel.json ./
fi

if [ -L drizzle.config.ts ]; then
  rm drizzle.config.ts
  cp config/drizzle.config.ts ./
fi

if [ -L README.md ]; then
  rm README.md
  cp docs/README.md ./
fi

# Copy components.json if it doesn't exist
if [ ! -f components.json ] && [ -f config/components.json ]; then
  cp config/components.json ./
fi

# Keep the scripts directory for organization, but leave other essential files in root

echo "Directory structure reverted. Configuration files restored to root directory."