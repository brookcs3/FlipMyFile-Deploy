/**
 * Test Asset Generator
 * 
 * This script generates test assets for each conversion mode to validate
 * the asset transformer functionality.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  generateLogoSvg,
  generateFaviconSvg,
  generateConversionIconSvg,
  generateBackgroundSvg,
  saveSvgFile
} from './asset-transformer.js';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load format registry
let formatRegistry;
try {
  const registryPath = path.join(__dirname, 'format-registry.json');
  const registryData = fs.readFileSync(registryPath, 'utf8');
  formatRegistry = JSON.parse(registryData);
  console.log('Format registry loaded successfully');
} catch (error) {
  console.error('Error loading format registry:', error);
  process.exit(1);
}

// Create output directory
const outputDir = path.join(__dirname, 'test-output', 'assets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate assets for each conversion mode
async function generateTestAssets() {
  const modes = Object.keys(formatRegistry.conversionModes);
  
  for (const mode of modes) {
    console.log(`\nGenerating assets for ${mode}...`);
    
    // Create mode-specific directory
    const modeDir = path.join(outputDir, mode);
    if (!fs.existsSync(modeDir)) {
      fs.mkdirSync(modeDir, { recursive: true });
    }
    
    // Generate and save logo
    const logo = generateLogoSvg(mode, 256);
    saveSvgFile(logo, path.join(modeDir, 'logo.svg'));
    
    // Generate and save favicon
    const favicon = generateFaviconSvg(mode, 32);
    saveSvgFile(favicon, path.join(modeDir, 'favicon.svg'));
    
    // Generate and save conversion icon
    const conversionIcon = generateConversionIconSvg(mode, 128);
    saveSvgFile(conversionIcon, path.join(modeDir, 'conversion-icon.svg'));
    
    // Generate and save background
    const background = generateBackgroundSvg(mode, 800, 600);
    saveSvgFile(background, path.join(modeDir, 'background.svg'));
  }
  
  console.log('\nAsset generation complete!');
}

// Run the generator
generateTestAssets().catch(error => {
  console.error('Asset generation failed:', error);
  process.exit(1);
});