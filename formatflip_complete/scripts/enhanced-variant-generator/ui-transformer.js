/**
 * UI Transformer Module
 * 
 * This module handles UI-specific transformations, including:
 * - Color scheme updates
 * - CSS/Tailwind class transformations
 * - Component styling adjustments
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
 * Transform CSS variables for a specific conversion mode
 * 
 * @param {string} cssContent - The CSS content to transform
 * @param {string} targetMode - The target conversion mode (e.g., 'aviToMp4')
 * @returns {string} - The transformed CSS content
 */
export function transformCssVariables(cssContent, targetMode) {
  const modeConfig = formatRegistry.conversionModes[targetMode];
  if (!modeConfig) {
    console.error(`Invalid conversion mode: ${targetMode}`);
    return cssContent;
  }
  
  // Get color scheme
  const { primary, secondary, accent, background } = modeConfig.colorScheme;
  
  // Replace color variables
  let transformedCss = cssContent;
  
  // Replace primary color
  transformedCss = transformedCss.replace(
    /--primary(?:-color)?:\s*#[0-9A-Fa-f]{6};/g,
    `--primary: ${primary};`
  );
  
  // Replace secondary color
  transformedCss = transformedCss.replace(
    /--secondary(?:-color)?:\s*#[0-9A-Fa-f]{6};/g,
    `--secondary: ${secondary};`
  );
  
  // Replace accent color
  transformedCss = transformedCss.replace(
    /--accent(?:-color)?:\s*#[0-9A-Fa-f]{6};/g,
    `--accent: ${accent};`
  );
  
  // Replace background color
  transformedCss = transformedCss.replace(
    /--background(?:-color)?:\s*#[0-9A-Fa-f]{6};/g,
    `--background: ${background};`
  );
  
  return transformedCss;
}

/**
 * Generate Tailwind theme configuration from a conversion mode
 * 
 * @param {string} targetMode - The target conversion mode (e.g., 'aviToMp4')
 * @returns {Object} - Tailwind theme configuration object
 */
export function generateTailwindTheme(targetMode) {
  const modeConfig = formatRegistry.conversionModes[targetMode];
  if (!modeConfig) {
    console.error(`Invalid conversion mode: ${targetMode}`);
    return null;
  }
  
  // Get color scheme
  const { primary, secondary, accent, background } = modeConfig.colorScheme;
  
  // Generate lighter and darker variations
  const primaryLight = lightenColor(primary, 0.2);
  const primaryDark = darkenColor(primary, 0.2);
  const secondaryLight = lightenColor(secondary, 0.2);
  const secondaryDark = darkenColor(secondary, 0.2);
  
  // Generate Tailwind theme config
  return {
    extend: {
      colors: {
        primary: {
          DEFAULT: primary,
          light: primaryLight,
          dark: primaryDark
        },
        secondary: {
          DEFAULT: secondary,
          light: secondaryLight,
          dark: secondaryDark
        },
        accent: {
          DEFAULT: accent
        },
        background: {
          DEFAULT: background
        }
      }
    }
  };
}

/**
 * Transform Tailwind config file for a specific conversion mode
 * 
 * @param {string} configContent - The Tailwind config file content
 * @param {string} targetMode - The target conversion mode (e.g., 'aviToMp4')
 * @returns {string} - The transformed config content
 */
export function transformTailwindConfig(configContent, targetMode) {
  const theme = generateTailwindTheme(targetMode);
  if (!theme) {
    return configContent;
  }
  
  // Find the theme section in the config
  const themeRegex = /(theme\s*:\s*{)([\s\S]*?)(}\s*,)/g;
  
  // Replace with our new theme
  return configContent.replace(themeRegex, (match, prefix, content, suffix) => {
    // Generate the new theme content
    const themeContent = JSON.stringify(theme, null, 2)
      .replace('{', '')
      .replace('}', '')
      .replace(/"/g, '');
    
    return `${prefix}${themeContent}${suffix}`;
  });
}

/**
 * Helper function to lighten a hex color
 * 
 * @param {string} hex - The hex color to lighten
 * @param {number} amount - The amount to lighten (0-1)
 * @returns {string} - The lightened hex color
 */
function lightenColor(hex, amount) {
  return adjustColor(hex, amount);
}

/**
 * Helper function to darken a hex color
 * 
 * @param {string} hex - The hex color to darken
 * @param {number} amount - The amount to darken (0-1)
 * @returns {string} - The darkened hex color
 */
function darkenColor(hex, amount) {
  return adjustColor(hex, -amount);
}

/**
 * Helper function to adjust a hex color
 * 
 * @param {string} hex - The hex color to adjust
 * @param {number} amount - The amount to adjust (-1 to 1)
 * @returns {string} - The adjusted hex color
 */
function adjustColor(hex, amount) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust RGB values
  const adjustValue = (value) => {
    const adjusted = Math.round(value + (value * amount));
    return Math.min(255, Math.max(0, adjusted));
  };
  
  const adjustedR = adjustValue(r);
  const adjustedG = adjustValue(g);
  const adjustedB = adjustValue(b);
  
  // Convert back to hex
  const toHex = (value) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
}

// Command line interface if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Handle command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node ui-transformer.js <command> <inputPath> <targetMode>');
    console.error('  Commands: css, tailwind');
    process.exit(1);
  }
  
  const [command, inputPath, targetMode] = args;
  
  try {
    // Read input file
    const content = fs.readFileSync(inputPath, 'utf8');
    
    let transformedContent;
    
    // Apply transformation based on command
    switch (command) {
      case 'css':
        transformedContent = transformCssVariables(content, targetMode);
        break;
      case 'tailwind':
        transformedContent = transformTailwindConfig(content, targetMode);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
    
    // Write output
    console.log(transformedContent);
    
    process.exit(0);
  } catch (error) {
    console.error('UI transformation error:', error);
    process.exit(1);
  }
}