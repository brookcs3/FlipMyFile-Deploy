# Converter Variants Configuration Guide

This document tracks all converter variants and their configurations. Use this as a reference when creating new deployments.

## Current Variants

### HEICFlip
- **Primary conversion**: HEIC to JPG
- **Domain**: heicflip.com
- **Config**:
  ```json
  {
    "siteName": "HEICFlip",
    "defaultConversionMode": "heicToJpg",
    "primaryColor": "#DD7230",
    "secondaryColor": "#B85A25", 
    "accentColor": "#F39C6B",
    "logoText": "HEICFlip",
    "domain": "heicflip.com"
  }
  ```

### JPGFlip
- **Primary conversion**: JPG to HEIC
- **Domain**: jpgflip.com
- **Config**:
  ```json
  {
    "siteName": "JPGFlip",
    "defaultConversionMode": "jpgToHeic",
    "primaryColor": "#3066BE",
    "secondaryColor": "#1E5693",
    "accentColor": "#5D89D0",
    "logoText": "JPGFlip",
    "domain": "jpgflip.com"
  }
  ```

### AVIFlip
- **Primary conversion**: AVI to MP4
- **Domain**: aviflip.com
- **Config**:
  ```json
  {
    "siteName": "AVIFlip",
    "defaultConversionMode": "aviToMp4",
    "primaryColor": "#119DA4",
    "secondaryColor": "#0D7A7F",
    "accentColor": "#3CBFC5",
    "logoText": "AVIFlip",
    "domain": "aviflip.com"
  }
  ```

## How to Add a New Variant

1. Add a new configuration object to `client/src/config.ts`
2. Update the `getSiteConfig()` function to detect the new domain
3. Add the configuration details to this document
4. Create a new repository following the deployment guide

## Required Files for Each Deployment

- All core application code
- Updated configuration for the specific variant
- Domain-specific assets (if any)
- Deployment configuration (vercel.json, etc.)

---

Last updated: April 30, 2025