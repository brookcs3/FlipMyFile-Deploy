#!/bin/bash

# Create-Variant Script
# This script creates a new version of the converter application with different:
# 1. Colors
# 2. File format conversions
# 3. Branding

set -e  # Exit immediately if a command exits with a non-zero status

# Text colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to display colored messages
log() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Function to confirm before proceeding
confirm() {
  read -p "Continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log $RED "Operation canceled by user"
    exit 1
  fi
}

# Input parameters
if [ "$#" -lt 3 ]; then
  log $RED "Usage: $0 <new_name> <primary_color> <secondary_color> <accent_color> <new_format_from> <new_format_to>"
  log $YELLOW "Example: $0 WebPFlip \"#4CAF50\" \"#2E7D32\" \"#81C784\" webp jpg"
  exit 1
fi

NEW_NAME=$1
PRIMARY_COLOR=$2
SECONDARY_COLOR=$3
ACCENT_COLOR=$4
FORMAT_FROM=${5:-webp}  # Default to webp if not provided
FORMAT_TO=${6:-jpg}     # Default to jpg if not provided
FORMAT_FROM_UPPER=$(echo "$FORMAT_FROM" | tr '[:lower:]' '[:upper:]')
FORMAT_TO_UPPER=$(echo "$FORMAT_TO" | tr '[:lower:]' '[:upper:]')

REPO_NAME=$(echo $NEW_NAME | tr '[:upper:]' '[:lower:]')  # Repository name in lowercase

log $CYAN "==== Project Variant Creator ===="
log $CYAN "This script will create a new variant of the converter application"
log $CYAN "New project name: $NEW_NAME"
log $GREEN "Primary color: $PRIMARY_COLOR"
log $GREEN "Secondary color: $SECONDARY_COLOR"
log $GREEN "Accent color: $ACCENT_COLOR"
log $YELLOW "Converting from: $FORMAT_FROM_UPPER to $FORMAT_TO_UPPER"
log $CYAN "=============================="
confirm

# Create a temp directory for the new project
TEMP_DIR="temp_${REPO_NAME}_new"
log $BLUE "Creating temporary directory: $TEMP_DIR"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy all current files
log $BLUE "Copying current project files..."
cp -r client $TEMP_DIR/
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/
cp vite.config.ts $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp vercel.json $TEMP_DIR/
cp -r server $TEMP_DIR/
cp -r shared $TEMP_DIR/
cp -r public $TEMP_DIR/ 2>/dev/null || mkdir -p $TEMP_DIR/public
cp -r scripts $TEMP_DIR/
cp README.md $TEMP_DIR/
cp TROUBLESHOOTING.md $TEMP_DIR/ 2>/dev/null || touch $TEMP_DIR/TROUBLESHOOTING.md
cp AI_GUIDE.md $TEMP_DIR/ 2>/dev/null || touch $TEMP_DIR/AI_GUIDE.md
cp .ai-instructions $TEMP_DIR/ 2>/dev/null || touch $TEMP_DIR/.ai-instructions
cp tailwind.config.ts $TEMP_DIR/
cp postcss.config.js $TEMP_DIR/

# Ensure ads.txt is included
log $BLUE "Setting up ads.txt for Ezoic integration..."
mkdir -p $TEMP_DIR/client/public/
if [ -f "client/public/ads.txt" ]; then
  cp client/public/ads.txt $TEMP_DIR/client/public/
else
  # Create a default ads.txt file if it doesn't exist
  cat > $TEMP_DIR/client/public/ads.txt << EOF
# Redirecting to Ezoic's ads.txt manager
# This file will be copied to the correct location during build

# Placeholder entries that will be overwritten by the redirect in production
google.com, pub-2197574694656004, DIRECT, f08c47fec0942fa0
infolinks.com, 3435623, DIRECT
EOF
fi

# Ensure the ads.txt route is in server/index.ts
log $BLUE "Verifying ads.txt redirection route exists in server code..."
if ! grep -q "app.get('/ads.txt'" "$TEMP_DIR/server/index.ts"; then
  # If the route doesn't exist, add it before the Vite setup
  sed -i '/\/\/ importantly only setup vite in development/i \
  // Handle ads.txt request for Ezoic integration\
  app.get(\x27/ads.txt\x27, (req, res) => {\
    // Get the host from the request header\
    const host = req.headers.host || \x27'$REPO_DOMAIN'\x27;\
    const domain = host.replace(/:\\d+$/, \x27\x27); // Remove port if present\
    \
    // Redirect to Ezoic\x27s ads.txt manager\
    log(`Redirecting ads.txt request to Ezoic for domain: ${domain}`);\
    res.redirect(301, `https://srv.adstxtmanager.com/19390/${domain}`);\
  });\
\
' "$TEMP_DIR/server/index.ts"
fi

# Change to the temp directory for all operations
cd $TEMP_DIR

# Update config.ts with new colors and name
log $BLUE "Updating configuration with new colors and converter types..."
CONFIG_FILE="client/src/config.ts"

# First, create a backup
cp $CONFIG_FILE ${CONFIG_FILE}.bak

# Create a new config object for the new format
REPO_DOMAIN=$(echo $REPO_NAME | tr '[:upper:]' '[:lower:]').com

# Define the conversion mode based on formats
FROM_TO_MODE="${FORMAT_FROM}To${FORMAT_TO}"
TO_FROM_MODE="${FORMAT_TO}To${FORMAT_FROM}"

# Create the new config section
NEW_CONFIG="const ${REPO_NAME}Config: SiteConfig = {
  siteName: \"${NEW_NAME}\",
  defaultConversionMode: '${FROM_TO_MODE}',
  primaryColor: \"${PRIMARY_COLOR}\",
  secondaryColor: \"${SECONDARY_COLOR}\",
  accentColor: \"${ACCENT_COLOR}\",
  logoText: \"${NEW_NAME}\",
  domain: \"${REPO_DOMAIN}\"
};"

# Add the new config to the file and update getSiteConfig
sed -i "/export type ConversionMode =/c\export type ConversionMode = '${FROM_TO_MODE}' | '${TO_FROM_MODE}';" $CONFIG_FILE
sed -i "/const heicFlipConfig: SiteConfig/i\\$NEW_CONFIG\n" $CONFIG_FILE
sed -i "s/return heicFlipConfig;/return ${REPO_NAME}Config;/g" $CONFIG_FILE

# Update component files to reference the new formats
log $BLUE "Updating component files to reference new formats..."

# Define files to update
FILES_TO_UPDATE=(
  "client/src/components/Header.tsx"
  "client/src/components/TechnicalDetails.tsx"
  "client/src/components/DropConvert.tsx"
  "client/src/components/Footer.tsx"
  "client/src/workers/conversion.worker.ts"
  "client/index.html"
  "README.md"
)

for file in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$file" ]; then
    log $YELLOW "Updating references in $file"
    # Keep a backup
    cp "$file" "${file}.bak"
    
    # Replace HEIC with new format (preserve case)
    sed -i "s/HEIC to JPG/${FORMAT_FROM_UPPER} to ${FORMAT_TO_UPPER}/g" "$file"
    sed -i "s/JPG to HEIC/${FORMAT_TO_UPPER} to ${FORMAT_FROM_UPPER}/g" "$file"
    sed -i "s/heic to jpg/${FORMAT_FROM} to ${FORMAT_TO}/g" "$file"
    sed -i "s/jpg to heic/${FORMAT_TO} to ${FORMAT_FROM}/g" "$file"
    sed -i "s/\\.heic/.${FORMAT_FROM}/g" "$file"
    sed -i "s/\\.jpg/.${FORMAT_TO}/g" "$file"
    
    # Also replace title/project name references
    sed -i "s/HEICFlip/${NEW_NAME}/g" "$file"
    sed -i "s/heicflip/${REPO_NAME}/g" "$file"
  else
    log $RED "Warning: File $file not found, skipping"
  fi
done

# Special update for worker file which may need format-specific code
WORKER_FILE="client/src/workers/conversion.worker.ts"
if [ -f "$WORKER_FILE" ]; then
  log $PURPLE "Updating conversion worker with format-specific logic..."
  # This is where you would add special handling for different formats
  # For now, we'll just adjust the mime types
  
  # For webp, PNG, gif, etc.
  case $FORMAT_FROM in
    webp)
      sed -i "s/'image\/heic'/'image\/webp'/g" "$WORKER_FILE"
      ;;
    png)
      sed -i "s/'image\/heic'/'image\/png'/g" "$WORKER_FILE"
      ;;
    gif)
      sed -i "s/'image\/heic'/'image\/gif'/g" "$WORKER_FILE"
      ;;
    *)
      sed -i "s/'image\/heic'/'image\/${FORMAT_FROM}'/g" "$WORKER_FILE"
      ;;
  esac
  
  case $FORMAT_TO in
    jpg|jpeg)
      # Already targets JPG, no change needed
      ;;
    png)
      sed -i "s/'image\/jpeg'/'image\/png'/g" "$WORKER_FILE"
      ;;
    webp)
      sed -i "s/'image\/jpeg'/'image\/webp'/g" "$WORKER_FILE"
      ;;
    *)
      sed -i "s/'image\/jpeg'/'image\/${FORMAT_TO}'/g" "$WORKER_FILE"
      ;;
  esac
fi

# Update package.json with new project name
log $BLUE "Updating package.json with new project name..."
sed -i "s/\"name\": \".*\"/\"name\": \"${REPO_NAME}\"/g" package.json

# Create a new README.md with updated project description
log $BLUE "Generating new README.md..."
cat > README.md << EOF
# ${NEW_NAME}

${NEW_NAME} is a browser-based image converter that transforms photos between ${FORMAT_FROM_UPPER} and ${FORMAT_TO_UPPER} formats with complete privacy. All processing happens locally in your browser—no uploads required.

> [!IMPORTANT]
> **FOR AI ASSISTANTS**: Please check the [AI_GUIDE.md](./AI_GUIDE.md) file for detailed information about this project's structure, available scripts, and deployment configuration.

## Features

- Convert ${FORMAT_FROM_UPPER} to ${FORMAT_TO_UPPER} and ${FORMAT_TO_UPPER} to ${FORMAT_FROM_UPPER}
- 100% client-side processing for maximum privacy
- Batch conversion support
- Drag-and-drop interface
- No file size limits (browser memory permitting)
- Cross-platform compatibility

## Technology

- React with TypeScript for the UI
- FFmpeg WASM for image processing
- Tailwind CSS for styling
- Vite for build tooling

## Development

\`\`\`
npm install
npm run dev
\`\`\`

## Project Structure and Scripts

This project includes several utility scripts located in the \`scripts/\` directory:

- **For creating new variants**: \`./scripts/templates/create-variant.sh\`
- **For GitHub operations**: Scripts in \`scripts/github/\` directory
- **For maintenance**: Scripts in \`scripts/maintenance/\` directory

See [AI_GUIDE.md](./AI_GUIDE.md) for detailed documentation.

## License

MIT
EOF

# Update vercel.json with new project name
log $BLUE "Updating vercel.json..."
sed -i "s/\"name\": \".*\"/\"name\": \"${REPO_NAME}\"/g" vercel.json

# Create a custom GitHub push script for the new repository
log $BLUE "Creating GitHub push script for the new repository..."
mkdir -p scripts/github
cat > scripts/github/push_${REPO_NAME}_to_github.sh << EOF
#!/bin/bash

# GitHub configuration
GITHUB_ACCESS_TOKEN="\${GITHUB_ACCESS_TOKEN:-\$1}"  # Try to get from environment or first parameter
if [ -z "\$GITHUB_ACCESS_TOKEN" ]; then
  echo "Error: GitHub token not provided. Please specify as first parameter or set GITHUB_ACCESS_TOKEN environment variable."
  exit 1
fi

GITHUB_USERNAME="brookcs3"
REPO_NAME="${REPO_NAME}"
REPO_URL="https://\${GITHUB_ACCESS_TOKEN}@github.com/\${GITHUB_USERNAME}/\${REPO_NAME}.git"

# Get the commit message from the second parameter or use a default
COMMIT_MESSAGE="\${2:-Update ${NEW_NAME} project files}"

# Create a temporary directory
TEMP_DIR="temp_github_push"
rm -rf \$TEMP_DIR
mkdir -p \$TEMP_DIR

# Copy essential files to temp directory
echo "Copying project files to temporary directory..."
cp -r client \$TEMP_DIR/
cp package.json \$TEMP_DIR/
cp package-lock.json \$TEMP_DIR/
cp vite.config.ts \$TEMP_DIR/
cp tsconfig.json \$TEMP_DIR/
cp vercel.json \$TEMP_DIR/
cp -r server \$TEMP_DIR/
cp -r shared \$TEMP_DIR/
cp -r public \$TEMP_DIR/ 2>/dev/null || mkdir -p \$TEMP_DIR/public
cp README.md \$TEMP_DIR/
cp TROUBLESHOOTING.md \$TEMP_DIR/ 2>/dev/null || touch \$TEMP_DIR/TROUBLESHOOTING.md
cp AI_GUIDE.md \$TEMP_DIR/ 2>/dev/null || touch \$TEMP_DIR/AI_GUIDE.md
cp .ai-instructions \$TEMP_DIR/ 2>/dev/null || touch \$TEMP_DIR/.ai-instructions
cp tailwind.config.ts \$TEMP_DIR/
cp postcss.config.js \$TEMP_DIR/

# Ensure ads.txt is included for monetization
mkdir -p \$TEMP_DIR/client/public/
if [ -f "client/public/ads.txt" ]; then
  cp client/public/ads.txt \$TEMP_DIR/client/public/
fi

# Navigate to the temp directory
cd \$TEMP_DIR

# Initialize git and configure
git init
git config user.name "\${GITHUB_USERNAME}"
git config user.email "\${GITHUB_USERNAME}@users.noreply.github.com"

# Add all files
git add .

# Commit changes
git commit -m "\$COMMIT_MESSAGE"

# Add remote and push
git remote add origin \$REPO_URL
git push -f origin main

# Clean up
cd ..
rm -rf \$TEMP_DIR
echo "Push to GitHub completed. Repository updated with latest files."
EOF

chmod +x scripts/github/push_${REPO_NAME}_to_github.sh

# Go back to the main directory
cd ..

log $GREEN "===== Transformation Complete ====="
log $GREEN "New variant created in directory: $TEMP_DIR"
log $YELLOW "To finalize and use this variant:"
log $YELLOW "1. Review the changes in $TEMP_DIR"
log $YELLOW "2. Test the application locally"
log $YELLOW "3. Create a new GitHub repository named '$REPO_NAME'"
log $YELLOW "4. Use scripts/github/push_${REPO_NAME}_to_github.sh to push to GitHub"
log $YELLOW "5. Set up a new Vercel project pointing to the GitHub repository"
log $GREEN "=================================="