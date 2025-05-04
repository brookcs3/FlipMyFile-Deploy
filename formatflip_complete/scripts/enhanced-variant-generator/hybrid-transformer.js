/**
 * Hybrid Transformation Wrapper
 * 
 * This module integrates both AST-based and text-based transformers into a single
 * unified API that automatically switches based on configuration and fallbacks.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isASTEnabled } from './config/transformer-mode.js';
import { transformWithAST } from './lib/ast-transformer.js';
import { transformWithSimplifiedAST } from './lib/simplified-ast-transformer.js';

// Try importing acorn transformer but don't fail if not available
let transformWithAcorn;
try {
  const acornModule = await import('./lib/acorn-transformer.js');
  transformWithAcorn = acornModule.transformWithAcorn;
} catch (error) {
  console.log('Acorn transformer not available:', error.message);
}

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
 * Text-based transformation function
 * 
 * @param {string} sourceCode - Source code to transform
 * @param {string} sourceMode - Source conversion mode
 * @param {string} targetMode - Target conversion mode
 * @param {Object} registry - Format registry
 * @returns {Object} - Object containing transformed code and replacement count
 */
function transformWithText(sourceCode, sourceMode, targetMode, registry) {
  console.log('Using text-based transformation (fallback mode)');

  // Get format configurations
  const sourceConfig = registry.conversionModes[sourceMode];
  const targetConfig = registry.conversionModes[targetMode];
  
  if (!sourceConfig || !targetConfig) {
    throw new Error(`Invalid conversion mode: ${sourceMode} or ${targetMode}`);
  }
  
  // Get format details
  const sourceFormat = registry.formats[sourceConfig.source];
  const targetFormat = registry.formats[targetConfig.source];
  const sourceTargetFormat = registry.formats[sourceConfig.target];
  const targetTargetFormat = registry.formats[targetConfig.target];
  
  if (!sourceFormat || !targetFormat || !sourceTargetFormat || !targetTargetFormat) {
    throw new Error(`Invalid format configuration for ${sourceMode} or ${targetMode}`);
  }
  
  // Track replacements
  let replacementCount = 0;
  let transformedCode = sourceCode;
  
  // Replace naming variations (variable names, function names, etc.)
  sourceConfig.namingVariations.forEach((variation, index) => {
    const targetVariation = targetConfig.namingVariations[index] || targetConfig.namingVariations[0];
    
    // Create a case-sensitive regex
    const regex = new RegExp(escapeRegExp(variation), 'g');
    
    // Count replacements
    const matches = (transformedCode.match(regex) || []).length;
    replacementCount += matches;
    
    // Replace all occurrences
    transformedCode = transformedCode.replace(regex, targetVariation);
  });
  
  // Replace source format variations
  sourceFormat.variations.forEach((variation, index) => {
    const targetVariation = targetFormat.variations[index] || targetFormat.variations[0];
    
    // Create a case-sensitive regex
    const regex = new RegExp(escapeRegExp(variation), 'g');
    
    // Count replacements
    const matches = (transformedCode.match(regex) || []).length;
    replacementCount += matches;
    
    // Replace all occurrences
    transformedCode = transformedCode.replace(regex, targetVariation);
  });
  
  // Replace target format variations
  sourceTargetFormat.variations.forEach((variation, index) => {
    const targetVariation = targetTargetFormat.variations[index] || targetTargetFormat.variations[0];
    
    // Create a case-sensitive regex
    const regex = new RegExp(escapeRegExp(variation), 'g');
    
    // Count replacements
    const matches = (transformedCode.match(regex) || []).length;
    replacementCount += matches;
    
    // Replace all occurrences
    transformedCode = transformedCode.replace(regex, targetVariation);
  });
  
  // Replace MIME types
  sourceFormat.mimeTypes.forEach((mimeType, index) => {
    const targetMimeType = targetFormat.mimeTypes[index] || targetFormat.mimeTypes[0];
    
    // Create a case-sensitive regex
    const regex = new RegExp(escapeRegExp(mimeType), 'g');
    
    // Count replacements
    const matches = (transformedCode.match(regex) || []).length;
    replacementCount += matches;
    
    // Replace all occurrences
    transformedCode = transformedCode.replace(regex, targetMimeType);
  });
  
  // Replace file extensions in the code
  sourceFormat.extensions.forEach((extension, index) => {
    const targetExtension = targetFormat.extensions[index] || targetFormat.extensions[0];
    
    // Create a case-sensitive regex
    const regex = new RegExp(escapeRegExp(extension), 'g');
    
    // Count replacements
    const matches = (transformedCode.match(regex) || []).length;
    replacementCount += matches;
    
    // Replace all occurrences
    transformedCode = transformedCode.replace(regex, targetExtension);
  });
  
  // Apply additional transformations for specific conversion types
  if (sourceMode === 'heicToJpg' && targetMode === 'aviToMp4') {
    // Change max file size references
    const mbMatches = transformedCode.match(/20MB/g) || [];
    replacementCount += mbMatches.length;
    transformedCode = transformedCode.replace(/20MB/g, '200MB');
    
    // Remove iPhone references for video formats
    const iphoneMatches = transformedCode.match(/iPhone\s+AVI/g) || [];
    replacementCount += iphoneMatches.length;
    transformedCode = transformedCode.replace(/iPhone\s+AVI/g, 'AVI');
  }
  
  console.log(`Text-based transformation complete with ${replacementCount} replacements`);
  
  // Return both the transformed code and metadata
  return {
    code: transformedCode,
    replacementCount: replacementCount,
    transformations: {
      namingVariations: sourceConfig.namingVariations.length,
      formatVariations: sourceFormat.variations.length + sourceTargetFormat.variations.length,
      mimeTypes: sourceFormat.mimeTypes.length,
      extensions: sourceFormat.extensions.length
    }
  };
}

/**
 * Helper function to escape regex special characters
 * 
 * @param {string} string - String to escape
 * @returns {string} - Escaped string safe for regex
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Transform source code using the appropriate method (AST or text)
 * 
 * @param {string} sourceCode - Source code to transform
 * @param {string} sourceMode - Source conversion mode
 * @param {string} targetMode - Target conversion mode
 * @returns {string} - Transformed code
 */
// Transformation result tracking
const transformerResults = {
  method: 'none',
  success: false,
  babelAttempted: false,
  babelSuccess: false,
  acornAttempted: false,
  acornSuccess: false,
  textAttempted: false,
  textSuccess: false,
  transformationCount: 0,
  errors: []
};

/**
 * Transform source code using the appropriate method (AST or text)
 * 
 * @param {string} sourceCode - Source code to transform
 * @param {string} sourceMode - Source conversion mode
 * @param {string} targetMode - Target conversion mode
 * @returns {string} - Transformed code
 */
export async function transformCode(sourceCode, sourceMode, targetMode) {
  console.log(`Transforming from ${sourceMode} to ${targetMode}...`);
  
  // Reset transformation results
  transformerResults.method = 'none';
  transformerResults.success = false;
  transformerResults.babelAttempted = false;
  transformerResults.babelSuccess = false;
  transformerResults.acornAttempted = false;
  transformerResults.acornSuccess = false;
  transformerResults.simplifiedAstAttempted = false;
  transformerResults.simplifiedAstSuccess = false;
  transformerResults.textAttempted = false;
  transformerResults.textSuccess = false;
  transformerResults.transformationCount = 0;
  transformerResults.errors = [];
  
  try {
    // Try AST-based transformation first if enabled
    if (isASTEnabled()) {
      console.log('Attempting AST-based transformation...');
      
      // Use try/catch for each transformation method to handle errors gracefully
      
      // Try Babel-based AST transformation first
      try {
        console.log('Trying Babel AST transformation...');
        transformerResults.babelAttempted = true;
        
        const transformedCode = await transformWithAST(sourceCode, sourceMode, targetMode, formatRegistry);
        
        if (transformedCode) {
          console.log('Babel AST transformation succeeded!');
          transformerResults.method = 'babel';
          transformerResults.success = true;
          transformerResults.babelSuccess = true;
          return transformedCode;
        }
      } catch (babelError) {
        console.warn('Babel AST transformation failed:', babelError.message);
        transformerResults.errors.push({
          transformer: 'babel', 
          message: babelError.message
        });
      }
      
      // Try Acorn-based AST transformation as a backup if available
      if (transformWithAcorn) {
        try {
          console.log('Trying Acorn AST transformation...');
          transformerResults.acornAttempted = true;
          
          const acornTransformedCode = transformWithAcorn(sourceCode, sourceMode, targetMode, formatRegistry);
          
          if (acornTransformedCode) {
            console.log('Acorn AST transformation succeeded!');
            transformerResults.method = 'acorn';
            transformerResults.success = true;
            transformerResults.acornSuccess = true;
            return acornTransformedCode;
          }
        } catch (acornError) {
          console.warn('Acorn AST transformation failed:', acornError.message);
          transformerResults.errors.push({
            transformer: 'acorn', 
            message: acornError.message
          });
        }
      } else {
        console.log('Acorn transformer not available. To enable it, install acorn and acorn-walk packages.');
      }
      
      // Try our simplified AST transformer as a last resort before text-based fallback
      try {
        console.log('Trying simplified AST transformation...');
        transformerResults.simplifiedAstAttempted = true;
        
        const simplifiedAstTransformedCode = transformWithSimplifiedAST(sourceCode, sourceMode, targetMode, formatRegistry);
        
        if (simplifiedAstTransformedCode) {
          console.log('Simplified AST transformation succeeded!');
          transformerResults.method = 'simplified-ast';
          transformerResults.success = true;
          transformerResults.simplifiedAstSuccess = true;
          return simplifiedAstTransformedCode;
        }
      } catch (simplifiedAstError) {
        console.warn('Simplified AST transformation failed:', simplifiedAstError.message);
        transformerResults.errors.push({
          transformer: 'simplified-ast',
          message: simplifiedAstError.message
        });
      }
      
      console.warn('All AST-based transformations failed, falling back to text-based transformation.');
    } else {
      console.log('AST-based transformation disabled, using text-based transformation.');
    }
    
    // Fallback to text-based transformation
    transformerResults.textAttempted = true;
    const textResult = transformWithText(sourceCode, sourceMode, targetMode, formatRegistry);
    transformerResults.method = 'text';
    transformerResults.success = true;
    transformerResults.textSuccess = true;
    transformerResults.transformationCount = textResult.replacementCount || 0;
    
    // Print transformation summary
    printTransformationSummary();
    
    return textResult.code;
  } catch (error) {
    console.error('Code transformation error:', error);
    transformerResults.errors.push({
      transformer: 'unknown', 
      message: error.message
    });
    
    // Print transformation summary even on error
    printTransformationSummary();
    
    throw error;
  }
}

/**
 * Print a summary of the transformation process
 */
function printTransformationSummary() {
  console.log('\n===== Transformation Summary =====');
  console.log(`Success: ${transformerResults.success ? '✅ Yes' : '❌ No'}`);
  console.log(`Method Used: ${transformerResults.method}`);
  
  console.log('\nTransformer Attempts:');
  console.log(`- Babel:         ${transformerResults.babelAttempted ? (transformerResults.babelSuccess ? '✅ Success' : '❌ Failed') : '⬜ Not Attempted'}`);
  console.log(`- Acorn:         ${transformerResults.acornAttempted ? (transformerResults.acornSuccess ? '✅ Success' : '❌ Failed') : '⬜ Not Attempted'}`);
  console.log(`- Simplified AST: ${transformerResults.simplifiedAstAttempted ? (transformerResults.simplifiedAstSuccess ? '✅ Success' : '❌ Failed') : '⬜ Not Attempted'}`);
  console.log(`- Text:          ${transformerResults.textAttempted ? (transformerResults.textSuccess ? '✅ Success' : '❌ Failed') : '⬜ Not Attempted'}`);
  
  if (transformerResults.transformationCount > 0) {
    console.log(`\nReplacements: ${transformerResults.transformationCount}`);
  }
  
  if (transformerResults.errors.length > 0) {
    console.log('\nErrors:');
    transformerResults.errors.forEach(err => {
      console.log(`- ${err.transformer}: ${err.message}`);
    });
  }
  
  console.log('=================================\n');
}

/**
 * Transform a file using the appropriate method (AST or text)
 * 
 * @param {string} inputPath - Path to the input file
 * @param {string} outputPath - Path to the output file
 * @param {string} sourceMode - Source conversion mode
 * @param {string} targetMode - Target conversion mode
 * @returns {boolean} - True if successful, false otherwise
 */
export async function transformFile(inputPath, outputPath, sourceMode, targetMode) {
  try {
    console.log(`Transforming file: ${inputPath} → ${outputPath}`);
    
    // Read input file
    const sourceCode = fs.readFileSync(inputPath, 'utf8');
    
    // Transform the code
    const transformedCode = await transformCode(sourceCode, sourceMode, targetMode);
    
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
 * @returns {string[]} - Array of available conversion modes
 */
export function getAvailableModes() {
  return Object.keys(formatRegistry.conversionModes);
}

// Command line interface if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Handle command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.error('Usage: node hybrid-transformer.js <inputPath> <outputPath> <sourceMode> <targetMode>');
    process.exit(1);
  }
  
  const [inputPath, outputPath, sourceMode, targetMode] = args;
  
  // Run the transformation
  transformFile(inputPath, outputPath, sourceMode, targetMode)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Transformation failed:', error);
      process.exit(1);
    });
}