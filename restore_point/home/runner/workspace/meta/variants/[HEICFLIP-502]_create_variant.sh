#!/bin/bash
# [HEICFLIP-502] Create Variant Script
# This script automates the creation of a new converter variant

# Display help information
show_help() {
  echo "Usage: $0 [OPTIONS]"
  echo "Create a new converter variant based on the base project."
  echo
  echo "Options:"
  echo "  -n, --name NAME       Name of the variant (e.g., heicflip, jpgflip)"
  echo "  -d, --domain DOMAIN   Domain for the variant (e.g., heicflip.com)"
  echo "  -m, --mode MODE       Default conversion mode (e.g., heicToJpg)"
  echo "  -h, --help            Display this help message"
  echo
  echo "Example:"
  echo "  $0 --name heicflip --domain heicflip.com --mode heicToJpg"
}

# Check if no arguments were provided
if [ $# -eq 0 ]; then
  show_help
  exit 1
fi

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -n|--name)
      VARIANT_NAME="$2"
      shift 2
      ;;
    -d|--domain)
      VARIANT_DOMAIN="$2"
      shift 2
      ;;
    -m|--mode)
      CONVERSION_MODE="$2"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Validate required arguments
if [ -z "$VARIANT_NAME" ] || [ -z "$VARIANT_DOMAIN" ] || [ -z "$CONVERSION_MODE" ]; then
  echo "Error: Missing required arguments"
  show_help
  exit 1
fi

# Create the variant directory
VARIANT_DIR="variants/$VARIANT_NAME"
mkdir -p "$VARIANT_DIR"

echo "Creating variant: $VARIANT_NAME"
echo "Domain: $VARIANT_DOMAIN"
echo "Conversion mode: $CONVERSION_MODE"

# Copy base project files (excluding git and variant-specific files)
echo "Copying base project files..."
# Note: This is a placeholder - actual implementation would copy relevant files

# Create a custom README for the variant
cat > "$VARIANT_DIR/README.md" << EOF
# $VARIANT_NAME

A specialized file converter for $CONVERSION_MODE conversion.

## Domain

$VARIANT_DOMAIN

## Configuration

This variant uses the following configuration:

\`\`\`
{
  "siteName": "$VARIANT_NAME",
  "defaultConversionMode": "$CONVERSION_MODE",
  "domain": "$VARIANT_DOMAIN"
}
\`\`\`

## Deployment

Follow the instructions in [HEICFLIP-501]_deployment_guide.md to deploy this variant.
EOF

echo "Variant created successfully!"
echo "Next steps:"
echo "1. Review and update the configuration in client/src/config.ts"
echo "2. Test the variant locally"
echo "3. Deploy following the deployment guide"