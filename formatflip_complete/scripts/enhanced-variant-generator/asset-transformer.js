/**
 * Asset Transformer Module
 * 
 * This module handles asset transformations for variant generation, including:
 * - Logo and favicon transformations
 * - Image color adjustments
 * - SVG generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load format registry
let formatRegistry;
try {
  const registryPath = path.join(__dirname, 'format-registry.json');
  const registryData = fs.readFileSync(registryPath, 'utf8');
  formatRegistry = JSON.parse(registryData);
} catch (error) {
  console.error('Error loading format registry:', error);
  process.exit(1);
}

/**
 * Generate a simple SVG logo for the specified conversion mode
 * 
 * @param {string} conversionMode - The conversion mode (e.g., 'heicToJpg')
 * @param {number} size - Size of the SVG in pixels
 * @returns {string} - SVG content as a string
 */
export function generateLogoSvg(conversionMode, size = 256) {
  const modeConfig = formatRegistry.conversionModes[conversionMode];
  if (!modeConfig) {
    console.error(`Invalid conversion mode: ${conversionMode}`);
    return null;
  }
  
  const { primary, secondary, accent } = modeConfig.colorScheme;
  const { logoText } = modeConfig.branding;
  
  // Create simple logo SVG
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${secondary}" rx="20" ry="20" />
  <rect x="20" y="20" width="${size - 40}" height="${size - 40}" fill="${primary}" rx="10" ry="10" />
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 4}" fill="${accent}" />
  <text x="${size / 2}" y="${size / 2 + 10}" font-family="Arial, sans-serif" font-size="${size / 10}" fill="white" text-anchor="middle">${logoText}</text>
</svg>`;
  
  return svg;
}

/**
 * Generate a simple SVG favicon for the specified conversion mode
 * 
 * @param {string} conversionMode - The conversion mode (e.g., 'heicToJpg')
 * @param {number} size - Size of the favicon in pixels
 * @returns {string} - SVG content as a string
 */
export function generateFaviconSvg(conversionMode, size = 32) {
  const modeConfig = formatRegistry.conversionModes[conversionMode];
  if (!modeConfig) {
    console.error(`Invalid conversion mode: ${conversionMode}`);
    return null;
  }
  
  const { primary, accent } = modeConfig.colorScheme;
  
  // Get initial from logo text
  const { logoText } = modeConfig.branding;
  const initial = logoText[0] || 'F';
  
  // Create simple favicon SVG
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${primary}" rx="8" ry="8" />
  <text x="${size / 2}" y="${size / 2 + 5}" font-family="Arial, sans-serif" font-size="${size / 1.5}" fill="${accent}" text-anchor="middle" font-weight="bold">${initial}</text>
</svg>`;
  
  return svg;
}

/**
 * Generate conversion mode icon showing from/to formats
 * 
 * @param {string} conversionMode - The conversion mode (e.g., 'heicToJpg')
 * @param {number} size - Size of the icon in pixels
 * @returns {string} - SVG content as a string
 */
export function generateConversionIconSvg(conversionMode, size = 128) {
  const modeConfig = formatRegistry.conversionModes[conversionMode];
  if (!modeConfig) {
    console.error(`Invalid conversion mode: ${conversionMode}`);
    return null;
  }
  
  const { primary, secondary, accent } = modeConfig.colorScheme;
  const sourceFormat = formatRegistry.formats[modeConfig.source];
  const targetFormat = formatRegistry.formats[modeConfig.target];
  
  if (!sourceFormat || !targetFormat) {
    console.error(`Invalid format configuration for ${conversionMode}`);
    return null;
  }
  
  // Get format extensions for display
  const sourceExt = sourceFormat.extensions[0].replace('.', '').toUpperCase();
  const targetExt = targetFormat.extensions[0].replace('.', '').toUpperCase();
  
  // Create conversion icon SVG
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size / 2 - 10}" height="${size / 2 - 10}" x="5" y="5" fill="${secondary}" rx="8" ry="8" />
  <text x="${size / 4}" y="${size / 4 + 5}" font-family="Arial, sans-serif" font-size="${size / 6}" fill="white" text-anchor="middle" font-weight="bold">${sourceExt}</text>
  
  <rect width="${size / 2 - 10}" height="${size / 2 - 10}" x="${size / 2 + 5}" y="${size / 2 + 5}" fill="${primary}" rx="8" ry="8" />
  <text x="${size * 3 / 4}" y="${size * 3 / 4 + 5}" font-family="Arial, sans-serif" font-size="${size / 6}" fill="white" text-anchor="middle" font-weight="bold">${targetExt}</text>
  
  <path d="M ${size / 2 - 15} ${size / 2} L ${size / 2 + 15} ${size / 2} M ${size / 2 + 5} ${size / 2 - 10} L ${size / 2 + 15} ${size / 2} L ${size / 2 + 5} ${size / 2 + 10}" stroke="${accent}" stroke-width="4" fill="none" />
</svg>`;
  
  return svg;
}

/**
 * Generate a simple color-adjusted SVG background for the specified conversion mode
 * 
 * @param {string} conversionMode - The conversion mode (e.g., 'heicToJpg')
 * @param {number} width - Width of the background
 * @param {number} height - Height of the background
 * @returns {string} - SVG content as a string
 */
export function generateBackgroundSvg(conversionMode, width = 1920, height = 1080) {
  const modeConfig = formatRegistry.conversionModes[conversionMode];
  if (!modeConfig) {
    console.error(`Invalid conversion mode: ${conversionMode}`);
    return null;
  }
  
  const { primary, secondary, accent, background } = modeConfig.colorScheme;
  
  // Lighten colors for better background
  const lightPrimary = lightenColor(primary, 0.7);
  const lightSecondary = lightenColor(secondary, 0.7);
  const lightAccent = lightenColor(accent, 0.5);
  
  // Create background pattern SVG
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${background}" />
  
  <circle cx="${width * 0.1}" cy="${height * 0.9}" r="${Math.min(width, height) * 0.15}" fill="${lightPrimary}" opacity="0.5" />
  <circle cx="${width * 0.85}" cy="${height * 0.15}" r="${Math.min(width, height) * 0.2}" fill="${lightSecondary}" opacity="0.4" />
  <circle cx="${width * 0.75}" cy="${height * 0.8}" r="${Math.min(width, height) * 0.1}" fill="${lightAccent}" opacity="0.3" />
  
  <path d="M0,${height * 0.7} C${width * 0.2},${height * 0.65} ${width * 0.4},${height * 0.8} ${width * 0.6},${height * 0.75} S${width * 0.8},${height * 0.9} ${width},${height * 0.8}" stroke="${lightPrimary}" stroke-width="2" fill="none" opacity="0.2" />
  <path d="M0,${height * 0.5} C${width * 0.25},${height * 0.45} ${width * 0.5},${height * 0.6} ${width * 0.75},${height * 0.55} S${width},${height * 0.7} ${width},${height * 0.6}" stroke="${lightSecondary}" stroke-width="3" fill="none" opacity="0.2" />
</svg>`;
  
  return svg;
}

/**
 * Save an SVG file for the specified conversion mode
 * 
 * @param {string} svgContent - The SVG content to save
 * @param {string} outputPath - The path where to save the SVG file
 * @returns {boolean} - True if successful, false otherwise
 */
export function saveSvgFile(svgContent, outputPath) {
  try {
    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write SVG file
    fs.writeFileSync(outputPath, svgContent);
    console.log(`SVG file saved to: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error('Error saving SVG file:', error);
    return false;
  }
}

/**
 * Helper function to lighten a hex color
 * 
 * @param {string} hex - The hex color to lighten
 * @param {number} amount - The amount to lighten (0-1)
 * @returns {string} - The lightened hex color
 */
function lightenColor(hex, amount) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Lighten RGB values
  const lighten = (value) => {
    return Math.round(value + (255 - value) * amount);
  };
  
  const lightenedR = lighten(r);
  const lightenedG = lighten(g);
  const lightenedB = lighten(b);
  
  // Convert back to hex
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(lightenedR)}${toHex(lightenedG)}${toHex(lightenedB)}`;
}

// Command line interface if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Handle command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node asset-transformer.js <type> <conversionMode> <outputPath> [size]');
    console.error('  Types: logo, favicon, conversion-icon, background');
    process.exit(1);
  }
  
  const [type, conversionMode, outputPath] = args;
  const size = args[4] ? parseInt(args[4], 10) : undefined;
  
  try {
    let svgContent;
    
    // Generate SVG based on type
    switch (type) {
      case 'logo':
        svgContent = generateLogoSvg(conversionMode, size);
        break;
      case 'favicon':
        svgContent = generateFaviconSvg(conversionMode, size);
        break;
      case 'conversion-icon':
        svgContent = generateConversionIconSvg(conversionMode, size);
        break;
      case 'background':
        const width = size || 1920;
        const height = args[5] ? parseInt(args[5], 10) : 1080;
        svgContent = generateBackgroundSvg(conversionMode, width, height);
        break;
      default:
        console.error(`Unknown asset type: ${type}`);
        process.exit(1);
    }
    
    if (!svgContent) {
      console.error('Failed to generate SVG content');
      process.exit(1);
    }
    
    // Save SVG file or print to console
    if (outputPath === '-') {
      console.log(svgContent);
    } else {
      saveSvgFile(svgContent, outputPath);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Asset transformation error:', error);
    process.exit(1);
  }
}