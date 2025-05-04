#!/bin/bash
# [HEICFLIP-010] Project Rename Utility
#
# This script allows you to rename all project-specific prefixes in filenames and file content
# Usage: ./[HEICFLIP-010]_PROJECT_RENAME.sh OLDNAME NEWNAME
# Example: ./[HEICFLIP-010]_PROJECT_RENAME.sh HEICFLIP AVIFCONVERT

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if correct arguments are provided
if [ $# -ne 2 ]; then
    echo -e "${RED}Error: Incorrect number of arguments${NC}"
    echo "Usage: $0 OLDNAME NEWNAME"
    echo "Example: $0 HEICFLIP AVIFCONVERT"
    exit 1
fi

OLD_NAME=$1
NEW_NAME=$2

# Validate input - ensure they're all uppercase
if [[ ! $OLD_NAME =~ ^[A-Z0-9_]+$ ]]; then
    echo -e "${RED}Error: OLDNAME must be uppercase letters, numbers, and underscores only${NC}"
    exit 1
fi

if [[ ! $NEW_NAME =~ ^[A-Z0-9_]+$ ]]; then
    echo -e "${RED}Error: NEWNAME must be uppercase letters, numbers, and underscores only${NC}"
    exit 1
fi

# Confirm the operation
echo -e "${YELLOW}This will rename all occurrences of [${OLD_NAME}-XXX] to [${NEW_NAME}-XXX]${NC}"
echo -e "${YELLOW}in both filenames and file contents.${NC}"
echo ""
echo -e "${RED}WARNING: This operation cannot be easily undone. Make sure you have a backup.${NC}"
read -p "Are you sure you want to continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Operation cancelled."
    exit 0
fi

# Create a backup first
echo -e "${BLUE}Creating backup before proceeding...${NC}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="rename_backup_${TIMESTAMP}"
mkdir -p $BACKUP_DIR

# Run the save script if it exists
if [ -f "./save_current_version.sh" ]; then
    echo "Running save_current_version.sh for safety..."
    ./save_current_version.sh
fi

# Copy everything to backup directory
echo "Copying all files to $BACKUP_DIR..."
cp -r . $BACKUP_DIR 2>/dev/null || true
echo -e "${GREEN}Backup created at $BACKUP_DIR${NC}"

# Count the number of files that will be affected
FILE_COUNT=$(find . -type f -not -path "*/node_modules/*" -not -path "*/\.*" | xargs grep -l "\[${OLD_NAME}-" 2>/dev/null | wc -l)
FILENAME_COUNT=$(find . -type f -name "*\[${OLD_NAME}-*" | wc -l)

echo -e "${BLUE}Found $FILE_COUNT files with content references${NC}"
echo -e "${BLUE}Found $FILENAME_COUNT files with naming pattern to rename${NC}"

# Function to handle progress bar
progress_bar() {
    local current=$1
    local total=$2
    local percent=$(( 100 * $current / $total ))
    local completed=$(( percent / 2 ))
    local remaining=$(( 50 - completed ))
    
    printf "\r["
    printf "%${completed}s" | tr ' ' '#'
    printf "%${remaining}s" | tr ' ' ' '
    printf "] %d%% (%d/%d)" $percent $current $total
}

# Step 1: Rename file content
echo -e "\n${BLUE}Step 1: Updating file content...${NC}"
COUNT=0
FILES_TO_UPDATE=$(find . -type f -not -path "*/node_modules/*" -not -path "*/\.*" | xargs grep -l "\[${OLD_NAME}-" 2>/dev/null || true)

for file in $FILES_TO_UPDATE; do
    # Skip binary files and certain extensions
    if [[ -z "$(file -b --mime-type "$file" | grep -E 'text|javascript|json|xml')" && ! "$file" =~ \.(md|txt|js|jsx|ts|tsx|html|css|json|yml|yaml|xml)$ ]]; then
        continue
    fi
    
    sed -i "s/\[${OLD_NAME}-/\[${NEW_NAME}-/g" "$file"
    COUNT=$((COUNT + 1))
    progress_bar $COUNT $FILE_COUNT
done

echo -e "\n${GREEN}Updated content in $COUNT files${NC}"

# Step 2: Rename filenames
echo -e "\n${BLUE}Step 2: Renaming files...${NC}"
COUNT=0
FILES_TO_RENAME=$(find . -type f -name "*\[${OLD_NAME}-*" || true)
TOTAL_RENAME=$(echo "$FILES_TO_RENAME" | wc -l)

for file in $FILES_TO_RENAME; do
    new_filename=$(echo "$file" | sed "s/\[${OLD_NAME}-/\[${NEW_NAME}-/g")
    if [ "$file" != "$new_filename" ]; then
        mv "$file" "$new_filename"
        COUNT=$((COUNT + 1))
        progress_bar $COUNT $TOTAL_RENAME
    fi
done

echo -e "\n${GREEN}Renamed $COUNT files${NC}"

# Step 3: Update the rename script itself if it was renamed
if [[ "$0" == *"[${OLD_NAME}-"* ]]; then
    NEW_SCRIPT=$(echo "$0" | sed "s/\[${OLD_NAME}-/\[${NEW_NAME}-/g")
    echo -e "\n${BLUE}This script was renamed to $NEW_SCRIPT${NC}"
fi

echo -e "\n${GREEN}Project rename complete!${NC}"
echo -e "${YELLOW}Project prefix changed from [${OLD_NAME}-XXX] to [${NEW_NAME}-XXX]${NC}"
echo -e "${BLUE}A backup was created at $BACKUP_DIR${NC}"
echo ""
echo -e "${YELLOW}Important: This script only changed the documentation prefixes.${NC}"
echo -e "${YELLOW}You may still need to update:${NC}"
echo "- Package names in package.json"
echo "- Import statements in code"
echo "- Project name references in code logic"
echo "- Domain names and URLs"
echo "- GitHub repository links"
echo ""
echo -e "${GREEN}Rename process completed successfully!${NC}"