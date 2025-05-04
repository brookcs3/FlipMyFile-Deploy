# Converter Variants

This directory contains documentation and tools for managing multiple converter variants. Each variant is a separate deployment of the conversion engine with specific configuration for different file format conversions.

## Overview

The HEICFlip project is designed to support multiple converter variants, each specializing in different file format conversions:

- **HEICFlip**: Converts HEIC files to JPG
- **JPGFlip**: Converts JPG files to HEIC
- **AVIFlip**: Converts AVI files to MP4
- *(and more potential variants)*

## Documentation

This directory contains the following resources:

- **[HEICFLIP-500]_converter_variants.md**: Configuration details for all converter variants
- **[HEICFLIP-501]_deployment_guide.md**: Step-by-step guide for creating new variant deployments
- **Scripts**: *(Coming soon)* Automation scripts for deploying variants

## Benefits of the Multi-Variant Approach

1. **Focused User Experience**: Each site focuses on a specific conversion type
2. **SEO Optimization**: Domain names match the specific conversion type
3. **Independent Development**: Changes to one variant don't affect others
4. **Simplified Codebase**: Each deployment contains only what it needs

## Adding a New Variant

To add a new converter variant:

1. Create a new configuration in `client/src/config.ts`
2. Update the `getSiteConfig()` function to detect the new domain
3. Document the new variant in `[HEICFLIP-500]_converter_variants.md`
4. Follow the deployment guide in `[HEICFLIP-501]_deployment_guide.md`

## Variant Management Strategy

Our approach to managing variants:

1. **Base Project**: Contains the core conversion engine and shared components
2. **Variant Repositories**: Separate repositories for each converter type
3. **Configuration System**: Centralized configuration handles branding differences
4. **Selective Updates**: Improvements to the core engine can be propagated to all variants

---

Last updated: April 30, 2025