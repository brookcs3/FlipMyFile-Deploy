/**
 * Script to create a new converter variant
 * Usage: node scripts/create-variant.js --name=aviflip --mode=aviToMp4 --color=#119DA4 --transformer=ast
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const nameArg = args.find(arg => arg.startsWith('--name='));
const modeArg = args.find(arg => arg.startsWith('--mode='));
const colorArg = args.find(arg => arg.startsWith('--color='));
const transformerArg = args.find(arg => arg.startsWith('--transformer='));

// Validate required arguments
if (!nameArg) {
  console.error('Error: Missing --name parameter');
  console.log('Usage: node create-variant.js --name=variantname --mode=conversionMode --color=#HEXCOLOR --transformer=ast|text');
  process.exit(1);
}

// Extract values
const variantName = nameArg.split('=')[1];
const conversionMode = modeArg ? modeArg.split('=')[1] : 'jpgToHeic'; // Default mode
const primaryColor = colorArg ? colorArg.split('=')[1] : '#3066BE'; // Default color
const transformerMode = transformerArg ? transformerArg.split('=')[1] : 'ast'; // Default to AST

// Validate variant name
if (!/^[a-z0-9]+$/.test(variantName)) {
  console.error('Error: Variant name must contain only lowercase letters and numbers');
  process.exit(1);
}

// Validate color format
if (primaryColor && !/#[0-9A-Fa-f]{6}/.test(primaryColor)) {
  console.error('Error: Color must be a valid hex color (e.g., #FF5500)');
  process.exit(1);
}

// Validate transformer mode
if (transformerMode !== 'ast' && transformerMode !== 'text') {
  console.error('Error: Transformer mode must be either "ast" or "text"');
  process.exit(1);
}

// Set transformer mode as environment variable
process.env.TRANSFORMER_MODE = transformerMode;
console.log(`Using ${transformerMode.toUpperCase()} transformer mode`);

// Load format configuration
const formatsConfigPath = path.join(__dirname, 'converter-templates', 'formats.json');
if (!fs.existsSync(formatsConfigPath)) {
  console.error('Error: Formats configuration file not found. Run setup script first.');
  process.exit(1);
}

const formatsConfig = JSON.parse(fs.readFileSync(formatsConfigPath, 'utf8'));
const { formats, conversionModes } = formatsConfig;

// Validate conversion mode
if (!conversionModes[conversionMode]) {
  console.error(`Error: Unsupported conversion mode: ${conversionMode}`);
  console.log('Supported modes:');
  Object.keys(conversionModes).forEach(mode => {
    console.log(`  ${mode} - ${conversionModes[mode].description}`);
  });
  process.exit(1);
}

// Get format details
const modeConfig = conversionModes[conversionMode];
const sourceFormat = formats[modeConfig.source];
const targetFormat = formats[modeConfig.target];

if (!sourceFormat || !targetFormat) {
  console.error(`Error: Missing format definition for ${modeConfig.source} or ${modeConfig.target}`);
  process.exit(1);
}

// Prepare paths
const packagesDir = path.join(__dirname, '../packages');
const variantDir = path.join(packagesDir, variantName);

// Check if variant already exists
if (fs.existsSync(variantDir)) {
  console.error(`Error: Variant "${variantName}" already exists`);
  process.exit(1);
}

// Create variant directory structure
console.log(`Creating new variant: ${variantName}`);
fs.mkdirSync(variantDir);
fs.mkdirSync(path.join(variantDir, 'src'));
fs.mkdirSync(path.join(variantDir, 'src', 'config'));
fs.mkdirSync(path.join(variantDir, 'src', 'conversion'));
fs.mkdirSync(path.join(variantDir, 'public'));

// Create variant package.json
const packageJson = {
  name: `@flip/${variantName}`,
  version: "1.0.0",
  private: true,
  type: "module",
  scripts: {
    dev: "vite",
    build: "vite build",
    preview: "vite preview"
  },
  dependencies: {
    "@flip/core": "1.0.0",
    "@ffmpeg/core": "^0.12.10",
    "@ffmpeg/ffmpeg": "^0.12.15",
    "@ffmpeg/util": "^0.12.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-dropzone": "^14.3.8",
    "wouter": "^3.3.5"
  },
  devDependencies: {
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.17",
    "typescript": "5.6.3",
    "vite": "^5.4.18"
  }
};

fs.writeFileSync(
  path.join(variantDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// Create vite.config.ts
const viteConfig = `import { defineConfig } from 'vite';
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
`;

fs.writeFileSync(
  path.join(variantDir, 'vite.config.ts'),
  viteConfig
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

// Create theme configuration
const formatVariantName = name => name.charAt(0).toUpperCase() + name.slice(1);

const themeContent = `import { createTheme, ThemeOverrides } from '@flip/core';

const ${variantName}Theme: ThemeOverrides = {
  siteName: "${formatVariantName(variantName)}",
  defaultConversionMode: "${conversionMode}",
  primaryColor: "${primaryColor}",
  secondaryColor: "${adjustColor(primaryColor, -20)}", // Darker shade
  accentColor: "${adjustColor(primaryColor, 20)}", // Lighter shade
  logoText: "${formatVariantName(variantName)}",
  domain: "${variantName}.com"
};

export const theme = createTheme(${variantName}Theme);

// Helper function to compute secondary/accent colors
function adjustColor(hex, percent) {
  // Simple implementation - in production, use a proper color adjustment function
  return hex; // Placeholder
}`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'config', 'theme.ts'),
  themeContent
);

// Create ad configuration
const adConfigContent = `import { AdConfig } from '@flip/core';

export const adConfig: AdConfig = {
  enabled: true,
  provider: 'adsense',
  clientId: 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with your publisher ID
  slots: {
    header: '1234567890', // Replace with actual ad slot IDs
    sidebar: '0987654321',
    footer: '1122334455',
    postConversion: '5566778899'
  }
};`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'config', 'ads.ts'),
  adConfigContent
);

// Create extension of types
const typeExtensionContent = `// Type extensions for ${formatVariantName(variantName)}
// This file extends the core conversion types

import '@flip/core';

// Extend the ConversionModes interface to add the ${conversionMode} mode
declare module '@flip/core' {
  export interface ExtendedConversionModes {
    ${conversionMode}: '${conversionMode}';
  }
}
`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'conversion', 'types.ts'),
  typeExtensionContent
);

// Create converter implementation
const converterTemplatePath = path.join(__dirname, 'converter-templates', 'TemplateConverter.ts');
if (!fs.existsSync(converterTemplatePath)) {
  console.error('Error: Converter template file not found');
  process.exit(1);
}

let converterTemplate = fs.readFileSync(converterTemplatePath, 'utf8');

// Format the FFmpeg options
const ffmpegOptionsString = modeConfig.ffmpegOptions.map(opt => {
  // If it contains a formula, keep it as is, otherwise wrap in quotes
  return opt.includes('.') ? opt : `'${opt}'`;
}).join(',\n        ');

// Prepare replacements
const replacements = {
  '{{SourceFormat}}': sourceFormat.name,
  '{{TargetFormat}}': targetFormat.name,
  '{{sourceLower}}': modeConfig.source,
  '{{targetLower}}': modeConfig.target,
  '{{inputMimeTypes}}': sourceFormat.mimeTypes.map(type => `'${type}'`).join(', '),
  '{{outputMimeType}}': targetFormat.mimeTypes[0],
  '{{FFmpegOptions}}': ffmpegOptionsString
};

// Apply replacements
Object.keys(replacements).forEach(key => {
  converterTemplate = converterTemplate.replace(new RegExp(key, 'g'), replacements[key]);
});

// Write the converter file
const converterClassName = `${sourceFormat.name}To${targetFormat.name}Converter`;
fs.writeFileSync(
  path.join(variantDir, 'src', 'conversion', `${converterClassName}.ts`),
  converterTemplate
);

// Create converter registration
const converterRegistrationContent = `// Register the ${converterClassName} with the core library
import { registerConverter } from '@flip/core';
import { ${converterClassName} } from './${converterClassName}';

// Register the converter for this variant's primary conversion mode
registerConverter('${conversionMode}', ${converterClassName});

// This makes the converter available via the ConverterFactory
`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'conversion', 'register.ts'),
  converterRegistrationContent
);

// Create main.tsx with converter registration
const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { theme } from './config/theme';
import { adConfig } from './config/ads';
import { initializeAds } from '@flip/core';

// Register the variant's converters
import './conversion/register';

console.log('Running in ${formatVariantName(variantName)} mode with configuration:', theme);

// Initialize ads based on configuration
if (import.meta.env.PROD) {
  initializeAds(adConfig);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'main.tsx'),
  mainContent
);

// Create App.tsx with conversion-specific content
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
      <p>Convert your ${modeConfig.description.toLowerCase()} easily.</p>
      <div>
        <h2>Supported Formats</h2>
        <div>
          <h3>Input: ${sourceFormat.name}</h3>
          <p>Supported extensions: ${sourceFormat.extensions.join(', ')}</p>
        </div>
        <div>
          <h3>Output: ${targetFormat.name}</h3>
          <p>Output extension: ${targetFormat.extensions[0]}</p>
        </div>
      </div>
    </div>
  );
}

export default App;`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'App.tsx'),
  appContent
);

// Create minimal CSS
const cssContent = `
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
}

body {
  margin: 0;
  display: flex;
  min-width: 320px;
  min-height: 100vh;
}

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}
`;

fs.writeFileSync(
  path.join(variantDir, 'src', 'index.css'),
  cssContent
);

// Update root package.json to add scripts for the new variant
const rootPackageJsonPath = path.join(__dirname, '../monorepo-package.json');
if (fs.existsSync(rootPackageJsonPath)) {
  const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));

  rootPackageJson.scripts[`dev:${variantName}`] = `npm run dev --workspace=packages/${variantName}`;
  rootPackageJson.scripts[`build:${variantName}`] = `npm run build --workspace=packages/${variantName}`;

  fs.writeFileSync(
    rootPackageJsonPath,
    JSON.stringify(rootPackageJson, null, 2)
  );
}

// Create a verification report
console.log('\n=== Variant Generation Report ===');
console.log(`Variant Name: ${variantName}`);
console.log(`Conversion Mode: ${conversionMode}`);
console.log(`Source Format: ${sourceFormat.name}, Target Format: ${targetFormat.name}`);
console.log(`Converter Class: ${converterClassName}`);
console.log(`Transformer Mode: ${transformerMode.toUpperCase()}`);

// Verify no format references were missed (simplified verification)
const verification = {
  total: 0,
  replaced: 0
};

// Verify key files for proper transformation
const verifyFiles = [
  { path: path.join(variantDir, 'src', 'conversion', `${converterClassName}.ts`), source: sourceFormat.name.toLowerCase(), target: targetFormat.name.toLowerCase() },
  { path: path.join(variantDir, 'src', 'App.tsx'), source: sourceFormat.name, target: targetFormat.name }
];

verifyFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file.path, 'utf8');
    const sourceMatches = (content.match(new RegExp(file.source, 'gi')) || []).length;
    const targetMatches = (content.match(new RegExp(file.target, 'gi')) || []).length;
    
    verification.total += sourceMatches;
    verification.replaced += targetMatches;
    
    console.log(`\nVerification for ${path.basename(file.path)}:`);
    console.log(`- Found ${targetMatches} occurrences of '${file.target}'`);
    
    if (sourceMatches > 0) {
      console.log(`⚠️ WARNING: ${sourceMatches} occurrences of '${file.source}' still present`);
    } else {
      console.log(`✓ No occurrences of '${file.source}' remain`);
    }
  } catch (err) {
    console.error(`Error verifying file ${file.path}: ${err.message}`);
  }
});

console.log('\n=== Generation Summary ===');
console.log(`Variant "${variantName}" created successfully!`);
console.log(`Transformer Mode: ${transformerMode.toUpperCase()}`);
console.log(`Transformation Coverage: ${Math.round(verification.replaced / (verification.replaced + verification.total) * 100)}%`);
console.log(`Run "npm run dev:${variantName}" to start the development server.`);

// Utility function to adjust color
function adjustColor(hex, percent) {
  // Actual implementation for color adjustment
  const num = parseInt(hex.slice(1), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  
  const factor = 1 + (percent / 100);
  
  const newR = Math.min(255, Math.floor(r * factor));
  const newG = Math.min(255, Math.floor(g * factor));
  const newB = Math.min(255, Math.floor(b * factor));
  
  const newHex = "#" + 
    ((1 << 24) + (newR << 16) + (newG << 8) + newB)
      .toString(16)
      .slice(1);
  
  return newHex;
}