# Monorepo Structure for Conversion Tools

This document outlines the structure and organization of our monorepo, which houses multiple file conversion tools under a unified codebase.

## Directory Structure

```
/
├── package.json             # Root package.json with workspaces config
├── tsconfig.json            # Base TypeScript configuration
├── packages/
│   ├── core/                # Shared core functionality
│   │   ├── package.json
│   │   ├── src/
│   │   │   ├── conversion/  # Conversion engines
│   │   │   ├── ui/          # Shared UI components
│   │   │   └── utils/       # Shared utilities
│   │
│   ├── heicflip/            # HEIC to JPG converter (default theme)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── src/
│   │   │   ├── config.ts    # HEICFlip-specific configuration
│   │   │   ├── themes/      # Theme definitions
│   │   │   └── main.tsx     # Entry point
│   │
│   ├── jpgflip/             # JPG to HEIC converter
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── src/
│   │   │   ├── config.ts    # JPGFlip-specific configuration
│   │   │   └── main.tsx     # Entry point
│   │
│   └── other-variants/      # Additional converter variants
│
├── scripts/                 # Build and deployment scripts
│   ├── create-variant.js    # Script to create a new variant
│   ├── build-all.js         # Build all packages
│   └── deploy.js            # Deploy specific or all variants
│
└── shared/                  # Truly shared code across all packages
    ├── schema.ts            # Database schema definitions
    └── types.ts             # Shared TypeScript types
```

## Package Structure

### Core Package

The `core` package contains all shared functionality that is used across all variants:

- Conversion engines for different file formats
- Base UI components 
- Design system
- Utility functions
- API interfaces

This package is imported by all variant packages.

### Variant Packages

Each variant package (heicflip, jpgflip, etc.) contains:

- Specific configuration (theme colors, conversion settings)
- Custom assets (logos, icons)
- Variant-specific pages or components (if needed)
- Independent deployment configuration

Each variant imports the core package and customizes it through configuration.

## Theme System

HEICFlip serves as the default theme and foundation. The theme system includes:

1. **Base Theme Definition**: Located in `packages/core/src/ui/themes/base.ts`
2. **Variant Overrides**: Each variant can override specific theme values
3. **Style Isolation**: CSS modules or CSS-in-JS ensures styles don't leak between variants

## Configuration System

The configuration system is designed to be:

1. **Type-Safe**: All configuration options have TypeScript definitions
2. **Hierarchical**: Default values that can be overridden by variants
3. **Feature-Flagged**: Easily turn features on/off for specific variants

## Build & Deployment

Each variant can be:

1. **Built Independently**: `npm run build --workspace=packages/heicflip`
2. **Deployed to a Unique URL**: Using deployment platform configurations
3. **Tested in Isolation**: `npm run test --workspace=packages/heicflip`

## Development Workflow

1. Make changes to shared code in the `core` package
2. Test changes by running a specific variant
3. Build and deploy individual variants as needed

## Adding a New Variant

To add a new variant:

1. Run `node scripts/create-variant.js --name=newvariant`
2. Modify the generated configuration in `packages/newvariant/src/config.ts`
3. Test locally with `npm run dev --workspace=packages/newvariant`
4. Deploy with `node scripts/deploy.js --variant=newvariant`

---

Last updated: April 30, 2025