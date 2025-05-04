# Monorepo Sample Files

This document provides example files for key components of the monorepo structure. These can be used as templates when implementing the monorepo conversion.

## Root Package.json

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
    "dev:aviflip": "npm run dev --workspace=packages/aviflip",
    "build:all": "node scripts/build-all.js",
    "build:heicflip": "npm run build --workspace=packages/heicflip",
    "build:jpgflip": "npm run build --workspace=packages/jpgflip",
    "build:aviflip": "npm run build --workspace=packages/aviflip",
    "create-variant": "node scripts/create-variant.js"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

## Core Package Files

### packages/core/package.json

```json
{
  "name": "@flip/core",
  "version": "1.0.0",
  "private": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@ffmpeg/core": "^0.11.0",
    "@ffmpeg/ffmpeg": "^0.11.0",
    "@ffmpeg/util": "^0.12.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "typescript": "^5.0.0"
  }
}
```

### packages/core/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "declaration": true,
    "outDir": "./dist",
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### packages/core/src/index.ts

```typescript
// Theme System
export * from './ui/themes/base';

// Conversion Utilities
export * from './conversion/types';
export * from './conversion/converters';

// UI Components
export * from './ui/components';
```

### packages/core/src/ui/themes/base.ts

```typescript
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

export type ThemeOverrides = Partial<BaseTheme>;

export function createTheme(overrides: ThemeOverrides = {}): BaseTheme {
  return {
    ...baseTheme,
    ...overrides
  };
}
```

### packages/core/src/conversion/types.ts

```typescript
export type ConversionMode = 
  | 'heicToJpg' 
  | 'jpgToHeic' 
  | 'aviToMp4' 
  | 'mp4ToAvi'
  | 'pngToJpg'
  | 'jpgToPng';

export interface ConversionOptions {
  quality?: number;
  preserveMetadata?: boolean;
  outputFormat?: string;
}

export interface ConversionResult {
  success: boolean;
  outputFile?: File;
  error?: string;
}

export interface ConverterInterface {
  convert(file: File, options?: ConversionOptions): Promise<ConversionResult>;
  getSupportedInputFormats(): string[];
  getOutputFormat(): string;
}
```

## HEICFlip Variant Files

### packages/heicflip/package.json

```json
{
  "name": "@flip/heicflip",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@flip/core": "1.0.0",
    "@ffmpeg/core": "^0.11.0",
    "@ffmpeg/ffmpeg": "^0.11.0",
    "@ffmpeg/util": "^0.12.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-dropzone": "^14.2.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.27",
    "tailwindcss": "^3.3.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

### packages/heicflip/vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin"
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### packages/heicflip/src/config/theme.ts

```typescript
import { createTheme, ThemeOverrides } from '@flip/core';

const heicflipTheme: ThemeOverrides = {
  siteName: "HEICFlip",
  defaultConversionMode: "heicToJpg",
  primaryColor: "#DD7230",
  secondaryColor: "#B85A25",
  accentColor: "#F39C6B",
  logoText: "HEICFlip",
  domain: "heicflip.com"
};

export const theme = createTheme(heicflipTheme);
```

### packages/heicflip/vercel.json

```json
{
  "buildCommand": "cd ../.. && npm run build:heicflip",
  "outputDirectory": "packages/heicflip/dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Script Examples

### scripts/build-all.js

```javascript
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

### scripts/create-variant.js

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const nameArg = args.find(arg => arg.startsWith('--name='));
const modeArg = args.find(arg => arg.startsWith('--mode='));
const colorArg = args.find(arg => arg.startsWith('--color='));

if (!nameArg) {
  console.error('Error: Missing --name parameter');
  console.log('Usage: node create-variant.js --name=variantname --mode=conversionMode --color=#HEXCOLOR');
  process.exit(1);
}

const variantName = nameArg.split('=')[1];
const conversionMode = modeArg ? modeArg.split('=')[1] : 'jpgToHeic'; // Default mode
const primaryColor = colorArg ? colorArg.split('=')[1] : '#3066BE'; // Default color

const variantDir = path.join(__dirname, '../packages', variantName);

// Create variant directory structure
console.log(`Creating new variant: ${variantName}`);
fs.mkdirSync(variantDir);
fs.mkdirSync(path.join(variantDir, 'src'));
fs.mkdirSync(path.join(variantDir, 'src', 'config'));

// Create package.json
const packageJson = {
  name: `@flip/${variantName}`,
  version: "1.0.0",
  private: true,
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview"
  },
  dependencies: {
    "@flip/core": "1.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  devDependencies: {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
};

fs.writeFileSync(
  path.join(variantDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// Copy vite.config.ts from heicflip
fs.copyFileSync(
  path.join(__dirname, '../packages/heicflip/vite.config.ts'),
  path.join(variantDir, 'vite.config.ts')
);

// Create theme configuration
const themeContent = `import { createTheme, ThemeOverrides } from '@flip/core';

const ${variantName}Theme: ThemeOverrides = {
  siteName: "${variantName.charAt(0).toUpperCase() + variantName.slice(1)}",
  defaultConversionMode: "${conversionMode}",
  primaryColor: "${primaryColor}",
  secondaryColor: "${adjustColor(primaryColor, -20)}", // Darker version
  accentColor: "${adjustColor(primaryColor, 20)}", // Lighter version
  logoText: "${variantName.charAt(0).toUpperCase() + variantName.slice(1)}",
  domain: "${variantName}.com"
};

export const theme = createTheme(${variantName}Theme);

// Helper function to compute secondary/accent colors
function adjustColor(hex, percent) {
  // Simple color adjustment function
  // In a real implementation, this would properly lighten/darken colors
  return hex;
}`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'config', 'theme.ts'),
  themeContent
);

// Create main.tsx
const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { theme } from './config/theme';

console.log('Running in ${variantName.charAt(0).toUpperCase() + variantName.slice(1)} mode with configuration:', theme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'main.tsx'),
  mainContent
);

// Create Vercel config
const vercelConfig = {
  "buildCommand": `cd ../.. && npm run build:${variantName}`,
  "outputDirectory": `packages/${variantName}/dist`,
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
};

fs.writeFileSync(
  path.join(variantDir, 'vercel.json'),
  JSON.stringify(vercelConfig, null, 2)
);

// Update root package.json to add scripts for the new variant
const rootPackageJsonPath = path.join(__dirname, '../package.json');
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));

rootPackageJson.scripts[`dev:${variantName}`] = `npm run dev --workspace=packages/${variantName}`;
rootPackageJson.scripts[`build:${variantName}`] = `npm run build --workspace=packages/${variantName}`;

fs.writeFileSync(
  rootPackageJsonPath,
  JSON.stringify(rootPackageJson, null, 2)
);

console.log(`Variant "${variantName}" created successfully!`);
console.log(`Run "npm run dev:${variantName}" to start development server.`);

// Helper function to adjust colors
function adjustColor(hex, percent) {
  // This is a simplified version that doesn't actually modify the color
  // In a real implementation, this would convert hex to RGB, adjust, and convert back
  return hex;
}
```

---

Last updated: April 30, 2025