/**
 * AST-based Transformation Integration Module
 * 
 * This module integrates the AST transformer with the format registry
 * to provide a comprehensive code transformation system for variant generation.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformWithAST } from './lib/ast-transformer.js';

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

/**
 * Transform source code from one conversion mode to another
 * 
 * @param {string} sourceCode - The source code to transform
 * @param {string} sourceMode - The source conversion mode (e.g., 'heicToJpg')
 * @param {string} targetMode - The target conversion mode (e.g., 'aviToMp4')
 * @returns {string|null} - The transformed code or null if transformation failed
 */
export async function transformCode(sourceCode, sourceMode, targetMode) {
  try {
    // Validate conversion modes
    if (!formatRegistry.conversionModes[sourceMode]) {
      throw new Error(`Invalid source conversion mode: ${sourceMode}`);
    }
    
    if (!formatRegistry.conversionModes[targetMode]) {
      throw new Error(`Invalid target conversion mode: ${targetMode}`);
    }
    
    console.log(`Transforming from ${sourceMode} to ${targetMode}...`);
    
    // Perform transformation
    const transformedCode = transformWithAST(sourceCode, sourceMode, targetMode, formatRegistry);
    
    if (!transformedCode) {
      throw new Error('AST transformation failed');
    }
    
    return transformedCode;
  } catch (error) {
    console.error('Code transformation error:', error);
    return null;
  }
}

/**
 * Transform a file from one conversion mode to another
 * 
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to the output file
 * @param {string} sourceMode - The source conversion mode (e.g., 'heicToJpg')
 * @param {string} targetMode - The target conversion mode (e.g., 'aviToMp4')
 * @returns {boolean} - True if transformation succeeded, false otherwise
 */
export async function transformFile(inputPath, outputPath, sourceMode, targetMode) {
  try {
    // Read input file
    const sourceCode = fs.readFileSync(inputPath, 'utf8');
    
    // Transform code
    const transformedCode = await transformCode(sourceCode, sourceMode, targetMode);
    
    if (!transformedCode) {
      throw new Error('Code transformation failed');
    }
    
    // Write output file
    fs.writeFileSync(outputPath, transformedCode);
    console.log(`Transformed file written to: ${outputPath}`);
    
    return true;
  } catch (error) {
    console.error('File transformation error:', error);
    return false;
  }
}

/**
 * Get available conversion modes from the registry
 * 
 * @returns {string[]} - Array of available conversion mode names
 */
export function getAvailableModes() {
  return Object.keys(formatRegistry.conversionModes);
}

/**
 * Get branding information for a specific conversion mode
 * 
 * @param {string} mode - The conversion mode (e.g., 'heicToJpg')
 * @returns {Object|null} - Branding information or null if mode is invalid
 */
export function getBranding(mode) {
  const modeConfig = formatRegistry.conversionModes[mode];
  if (!modeConfig) {
    console.error(`Invalid conversion mode: ${mode}`);
    return null;
  }
  
  return {
    ...modeConfig.branding,
    colorScheme: modeConfig.colorScheme
  };
}

// Command line interface if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Handle command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.error('Usage: node ast-transform.js <inputPath> <outputPath> <sourceMode> <targetMode>');
    process.exit(1);
  }
  
  const [inputPath, outputPath, sourceMode, targetMode] = args;
  
  // Run transformation
  transformFile(inputPath, outputPath, sourceMode, targetMode)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}