#!/bin/bash

# Script to prepare files for Vercel deployment

# Build the project
npm run build

# Create deployment directory if it doesn't exist
mkdir -p deployment

# Copy the Vercel configuration
cp vercel.json deployment/

# Copy the format-transformation-demo.html file
cp format-transformation-demo.html deployment/

# Copy the built files
cp -r dist deployment/

# Create a zip file of the deployment directory
cd deployment
zip -r ../formatflip-deployment.zip .
cd ..

echo "Deployment files prepared in formatflip-deployment.zip"
echo "Upload this file to Vercel for deployment."
