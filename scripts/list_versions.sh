#!/bin/bash

# List all available versions with details
if [ ! -d "versions" ]; then
  echo "No versions available yet. Create one with scripts/create_version.sh"
  exit 0
fi

echo "=== Available Versions ==="

for version_dir in versions/version_*; do
  if [ -d "$version_dir" ]; then
    echo "\n[$version_dir]"
    if [ -f "$version_dir/VERSION_INFO.txt" ]; then
      cat "$version_dir/VERSION_INFO.txt"
    else
      echo "No version info available"
    fi
  fi
done
