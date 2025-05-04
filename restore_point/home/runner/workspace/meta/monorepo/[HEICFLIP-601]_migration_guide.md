# Migration Guide: Converting to Monorepo Structure

This document provides step-by-step instructions for migrating the current project to a monorepo structure that supports multiple converter variants.

## Migration Process Overview

1. Create the monorepo directory structure
2. Extract shared code into the core package
3. Create the HEICFlip variant (using current code as base)
4. Establish the theme system
5. Set up build and deployment configurations
6. Add additional variants (JPGFlip, AVIFlip, etc.)

## Detailed Steps

### Step 1: Create Base Directory Structure

```bash
# Create the monorepo structure
mkdir -p packages/{core,heicflip,jpgflip}/src
mkdir -p scripts
mkdir -p shared

# Copy shared schema
cp shared/schema.ts shared/
```

### Step 2: Set Up Root Configuration

Create a root `package.json` with workspaces configuration:

```json
{
  "name": "flip-converters",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:heicflip": "npm run dev --workspace=packages/heicflip",
    "dev:jpgflip": "npm run dev --workspace=packages/jpgflip",
    "build:all": "node scripts/build-all.js",
    "build:heicflip": "npm run build --workspace=packages/heicflip",
    "build:jpgflip": "npm run build --workspace=packages/jpgflip",
    "create-variant": "node scripts/create-variant.js"
  }
}
```

### Step 3: Extract Core Functionality

1. Identify shared code:
   - Conversion logic
   - UI components
   - Utilities
   - Types

2. Move them to the core package:
   ```bash
   # Create core package.json
   echo '{
     "name": "@flip/core",
     "version": "1.0.0",
     "private": true,
     "main": "dist/index.js",
     "types": "dist/index.d.ts",
     "dependencies": {
       # Copy dependencies from current package.json
     }
   }' > packages/core/package.json
   
   # Create index.ts to export all core functionality
   touch packages/core/src/index.ts
   ```

### Step 4: Create HEICFlip Variant

1. Use the current codebase as the foundation:
   ```bash
   # Copy current client code to the heicflip package
   cp -r client/src/* packages/heicflip/src/
   
   # Create heicflip package.json
   echo '{
     "name": "@flip/heicflip",
     "version": "1.0.0",
     "private": true,
     "dependencies": {
       "@flip/core": "1.0.0",
       # Other dependencies...
     }
   }' > packages/heicflip/package.json
   
   # Copy vite configuration
   cp vite.config.ts packages/heicflip/
   ```

2. Update imports to use the core package:
   ```typescript
   // Before
   import { someUtil } from '../../utils';
   
   // After
   import { someUtil } from '@flip/core';
   ```

### Step 5: Establish Theme System

1. Extract theme configuration:
   ```bash
   mkdir -p packages/core/src/ui/themes
   touch packages/core/src/ui/themes/base.ts
   ```

2. Create theme system in the core:
   ```typescript
   // packages/core/src/ui/themes/base.ts
   export interface BaseTheme {
     siteName: string;
     defaultConversionMode: string;
     primaryColor: string;
     secondaryColor: string;
     accentColor: string;
     logoText: string;
     domain: string;
   }
   
   export const baseTheme: BaseTheme = {
     siteName: "HEICFlip",
     defaultConversionMode: "heicToJpg",
     primaryColor: "#DD7230",
     secondaryColor: "#B85A25",
     accentColor: "#F39C6B",
     logoText: "HEICFlip",
     domain: "heicflip.com"
   };
   ```

### Step 6: Set Up Build and Deployment Scripts

Create scripts for building and deploying:

```javascript
// scripts/build-all.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '../packages');
const packages = fs.readdirSync(packagesDir)
  .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory());

// Build core package first
console.log('Building @flip/core...');
execSync('npm run build', { cwd: path.join(packagesDir, 'core'), stdio: 'inherit' });

// Build variant packages
for (const pkg of packages.filter(p => p !== 'core')) {
  console.log(`Building @flip/${pkg}...`);
  execSync('npm run build', { cwd: path.join(packagesDir, pkg), stdio: 'inherit' });
}

console.log('All packages built successfully!');
```

### Step 7: Create Additional Variants

1. Create a script to generate new variants:
   ```javascript
   // scripts/create-variant.js
   const fs = require('fs');
   const path = require('path');
   const { execSync } = require('child_process');
   
   const args = process.argv.slice(2);
   const nameArg = args.find(arg => arg.startsWith('--name='));
   
   if (!nameArg) {
     console.error('Error: Missing --name parameter');
     console.log('Usage: node create-variant.js --name=variantname');
     process.exit(1);
   }
   
   const variantName = nameArg.split('=')[1];
   const variantDir = path.join(__dirname, '../packages', variantName);
   
   // Create variant directory structure
   fs.mkdirSync(variantDir);
   fs.mkdirSync(path.join(variantDir, 'src'));
   
   // Copy template files from heicflip
   // ... code to copy and modify template files
   
   console.log(`Variant "${variantName}" created successfully!`);
   ```

2. Create JPGFlip variant as an example:
   ```bash
   node scripts/create-variant.js --name=jpgflip
   ```

## Testing the Migration

1. Test the core package:
   ```bash
   cd packages/core
   npm test
   ```

2. Test each variant:
   ```bash
   npm run dev:heicflip
   # In another terminal
   npm run dev:jpgflip
   ```

## Deployment Strategy

For deployment, each variant will need:

1. A unique deployment configuration (vercel.json, etc.)
2. Custom domain settings
3. Environment variables if needed

Example Vercel configuration for HEICFlip:

```json
// packages/heicflip/vercel.json
{
  "name": "heicflip",
  "buildCommand": "cd ../.. && npm run build:heicflip",
  "outputDirectory": "packages/heicflip/dist"
}
```

## Rollback Plan

If the migration encounters issues:

1. Keep the original codebase functional and untouched
2. Develop the monorepo structure in parallel
3. Only switch over when fully tested

---

Last updated: April 30, 2025