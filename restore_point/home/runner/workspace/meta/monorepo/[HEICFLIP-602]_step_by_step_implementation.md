# Comprehensive Step-by-Step Monorepo Implementation Guide

This guide provides a detailed, executable plan to transform the current project into a monorepo structure and create new themed variants with different conversion types.

## Phase 1: Analyze Current Structure

### Step 1: Examine the current project structure
- Review file organization
- Identify shared code vs. variant-specific code
- Map theme-related code and configuration

### Step 2: Create inventory of current dependencies
- Document all npm packages used
- Note which packages are essential for core functionality
- Identify UI/theme-related packages

## Phase 2: Create Monorepo Foundation

### Step 3: Create the basic directory structure
```bash
# Create root directory structure
mkdir -p packages/core/src
mkdir -p packages/heicflip/src
mkdir -p scripts
```

### Step 4: Create root package.json with workspaces
```bash
# Create root package.json with workspace configuration
cat > package.json << 'EOF'
{
  "name": "flip-converters",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:heicflip": "npm run dev --workspace=packages/heicflip",
    "build:all": "node scripts/build-all.js",
    "build:heicflip": "npm run build --workspace=packages/heicflip",
    "create-variant": "node scripts/create-variant.js"
  }
}
EOF
```

## Phase 3: Extract Core Package

### Step 5: Identify core functionality
- Conversion logic
- Base UI components
- Utility functions
- Type definitions

### Step 6: Create core package structure
```bash
# Create core package.json
cat > packages/core/package.json << 'EOF'
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
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

# Create core tsconfig
cat > packages/core/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

### Step 7: Extract core conversion functionality
```bash
# Create conversion module structure
mkdir -p packages/core/src/conversion
```

### Step 8: Extract theme system
```bash
# Create theme system structure
mkdir -p packages/core/src/ui/themes

# Create base theme definition file
cat > packages/core/src/ui/themes/base.ts << 'EOF'
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
EOF
```

### Step 9: Create core exports
```bash
# Create index file to export all core functionality
cat > packages/core/src/index.ts << 'EOF'
// Re-export everything from the theme system
export * from './ui/themes/base';

// Add other exports as they are created
EOF
```

## Phase 4: Create HEICFlip Variant

### Step 10: Setup HEICFlip package
```bash
# Create heicflip package.json
cat > packages/heicflip/package.json << 'EOF'
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
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
EOF

# Create vite configuration
cat > packages/heicflip/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
EOF
```

### Step 11: Create HEICFlip theme configuration
```bash
# Create theme configuration
mkdir -p packages/heicflip/src/config

cat > packages/heicflip/src/config/theme.ts << 'EOF'
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
EOF
```

### Step 12: Create HEICFlip entry point
```bash
# Create main entry file
cat > packages/heicflip/src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { theme } from './config/theme';

console.log('Running in HEICFlip mode with configuration:', theme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

# Create a placeholder App component
cat > packages/heicflip/src/App.tsx << 'EOF'
import React from 'react';
import { theme } from './config/theme';

function App() {
  return (
    <div style={{ 
      color: theme.primaryColor,
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1>{theme.siteName}</h1>
      <p>Convert your {theme.defaultConversionMode === 'heicToJpg' ? 'HEIC files to JPG' : 'files'} easily.</p>
    </div>
  );
}

export default App;
EOF
```

## Phase 5: Create Build and Helper Scripts

### Step 13: Create build script
```bash
# Create build script
mkdir -p scripts

cat > scripts/build-all.js << 'EOF'
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
EOF
```

### Step 14: Create variant generator script
```bash
# Create script to generate new variants
cat > scripts/create-variant.js << 'EOF'
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

// Create App.tsx
const appContent = `import React from 'react';
import { theme } from './config/theme';

function App() {
  return (
    <div style={{ 
      color: theme.primaryColor,
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem'
    }}>
      <h1>{theme.siteName}</h1>
      <p>Convert your ${getConversionDescription(conversionMode)} easily.</p>
    </div>
  );
}

function getConversionDescription(mode) {
  switch(mode) {
    case 'jpgToHeic': return 'JPG files to HEIC';
    case 'heicToJpg': return 'HEIC files to JPG';
    case 'aviToMp4': return 'AVI files to MP4';
    default: return 'files';
  }
}

export default App;`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'App.tsx'),
  appContent
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
  // This is a simplified version
  // In a real implementation, this would convert hex to RGB, adjust, and convert back
  return hex;
}
EOF
```

## Phase 6: Testing the Monorepo Structure

### Step 15: Setup npm workspaces and install dependencies
```bash
# Install dependencies
npm install
```

### Step 16: Build the core package
```bash
# Build the core package
cd packages/core
npm run build
cd ../..
```

### Step 17: Run HEICFlip development server
```bash
# Start the HEICFlip variant
npm run dev:heicflip
```

## Phase 7: Creating a New Variant

### Step 18: Use the create-variant script to generate a new variant
```bash
# Create a new JPGFlip variant
node scripts/create-variant.js --name=jpgflip --mode=jpgToHeic --color=#3066BE
```

### Step 19: Customize the new variant
- Adjust colors if needed
- Modify conversion specific UI elements
- Test specific conversion functionality

### Step 20: Run the new variant
```bash
# Start the JPGFlip variant
npm run dev:jpgflip
```

## Finishing Touches

### Step 21: Create deployment configurations
- Create vercel.json (or other deployment platform configs) for each variant
- Set up custom domain configurations

### Step 22: Document the process
- Update README files
- Create developer documentation

---

## Summary: Creating a New Clone with Different Colors and Conversion Pair

To create a new clone with different colors and conversion type:

1. **Run the variant creator script**:
   ```bash
   node scripts/create-variant.js --name=aviflip --mode=aviToMp4 --color=#119DA4
   ```

2. **Customize the theme** (optional):
   ```bash
   # Edit packages/aviflip/src/config/theme.ts to fine-tune colors
   ```

3. **Test the new variant**:
   ```bash
   npm run dev:aviflip
   ```

4. **Deploy to a unique URL**:
   ```bash
   npm run build:aviflip
   # Deploy the build output in packages/aviflip/dist to your hosting provider
   ```

Following these steps creates a new variant with its own conversion type and theme, while sharing the core functionality with all other variants in the monorepo.

---

Last updated: April 30, 2025