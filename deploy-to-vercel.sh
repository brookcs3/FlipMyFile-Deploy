#!/bin/bash

# Deploy FlipMyFile to Vercel
# This script prepares and deploys the application to Vercel

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting FlipMyFile deployment to Vercel...${NC}"

# Step 1: Verify the build
echo -e "${YELLOW}Verifying build...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Please fix the errors before deploying.${NC}"
  exit 1
fi
echo -e "${GREEN}Build successful.${NC}"

# Step 2: Check if Vercel CLI is installed
echo -e "${YELLOW}Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
  echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
  npm install -g vercel
fi
echo -e "${GREEN}Vercel CLI is available.${NC}"

# Step 3: Deploy to Vercel
echo -e "${YELLOW}Deploying to Vercel...${NC}"
echo -e "${YELLOW}Please follow the prompts to complete the deployment.${NC}"

# Check if this is a production deployment
read -p "Is this a production deployment? (y/n): " prod_deploy

if [[ $prod_deploy == "y" || $prod_deploy == "Y" ]]; then
  vercel --prod
else
  vercel
fi

echo -e "${GREEN}Deployment process complete!${NC}"
echo -e "${YELLOW}Note: You may need to configure additional settings in the Vercel dashboard.${NC}"

# Provide instructions for testing
echo -e "\n${GREEN}=== Post-Deployment Steps ===${NC}"
echo -e "1. Test the following routes on your deployed site:"
echo -e "   - /"
echo -e "   - /experimental"
echo -e "   - /any-format"
echo -e "   - /auto-detect"
echo -e "   - /ffmpeg-demo"
echo -e "2. Verify file conversion functionality"
echo -e "3. Check FFmpeg demo functionality"
echo -e "\nThank you for using FlipMyFile deployment script!"