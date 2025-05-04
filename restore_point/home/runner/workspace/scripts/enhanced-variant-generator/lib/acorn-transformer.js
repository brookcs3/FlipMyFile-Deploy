/**
 * Acorn-based AST Transformer
 * 
 * This transformer uses acorn instead of Babel to avoid ES module compatibility issues.
 * It's a simpler implementation but should be more reliable in the Replit environment.
 */

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper function to escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Transform JavaScript code using Acorn AST
 * 
 * @param {string} sourceCode - Source code to transform
 * @param {string} sourceMode - Source conversion mode (e.g., 'heicToJpg')
 * @param {string} targetMode - Target conversion mode (e.g., 'aviToMp4')
 * @param {Object} registry - Format registry with conversion configurations
 * @returns {string} - Transformed code or null if transformation failed
 */
export function transformWithAcorn(sourceCode, sourceMode, targetMode, registry) {
  try {
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
    
    // Track transformations
    const transformations = {
      identifiers: 0,
      strings: 0,
      literals: 0
    };
    
    // Parse the source code to AST
    const ast = acorn.parse(sourceCode, {
      ecmaVersion: 2020,
      sourceType: 'module'
    });
    
    // Track all transformations needed
    const codeTransformations = [];
    
    // Apply transformations
    walk.full(ast, (node) => {
      // Transform string literals
      if (node.type === 'Literal' && typeof node.value === 'string') {
        let newValue = node.value;
        let modified = false;
        
        // Replace format names in strings
        sourceFormat.variations.forEach((variant, index) => {
          if (newValue.includes(variant)) {
            const targetVariant = index < targetFormat.variations.length
              ? targetFormat.variations[index]
              : targetFormat.variations[0];
            
            newValue = newValue.replace(
              new RegExp(escapeRegExp(variant), 'g'), 
              targetVariant
            );
            modified = true;
          }
        });
        
        sourceTargetFormat.variations.forEach((variant, index) => {
          if (newValue.includes(variant)) {
            const targetVariant = index < targetTargetFormat.variations.length
              ? targetTargetFormat.variations[index]
              : targetTargetFormat.variations[0];
            
            newValue = newValue.replace(
              new RegExp(escapeRegExp(variant), 'g'), 
              targetVariant
            );
            modified = true;
          }
        });
        
        // Replace MIME types
        sourceFormat.mimeTypes.forEach((type, index) => {
          if (newValue.includes(type)) {
            const targetType = index < targetFormat.mimeTypes.length
              ? targetFormat.mimeTypes[index]
              : targetFormat.mimeTypes[0];
            
            newValue = newValue.replace(
              new RegExp(escapeRegExp(type), 'g'), 
              targetType
            );
            modified = true;
          }
        });
        
        // Record transformation if modified
        if (modified) {
          codeTransformations.push({
            start: node.start + 1, // +1 to account for the quote
            end: node.end - 1,     // -1 to account for the quote
            value: newValue,
            type: 'string'
          });
          transformations.strings++;
        }
      }
      
      // Transform identifiers
      if (node.type === 'Identifier') {
        const name = node.name;
        let newName = name;
        let modified = false;
        
        // Check for format-specific identifiers
        sourceConfig.namingVariations.forEach((variant, index) => {
          if (name.includes(variant)) {
            const targetVariant = index < targetConfig.namingVariations.length
              ? targetConfig.namingVariations[index]
              : targetConfig.namingVariations[0];
            
            newName = newName.replace(
              new RegExp(escapeRegExp(variant), 'g'), 
              targetVariant
            );
            modified = true;
          }
        });
        
        // Record transformation if modified
        if (modified) {
          codeTransformations.push({
            start: node.start,
            end: node.end,
            value: newName,
            type: 'identifier'
          });
          transformations.identifiers++;
        }
      }
    });
    
    // Sort transformations in reverse order to avoid position shifts
    codeTransformations.sort((a, b) => b.start - a.start);
    
    // Apply transformations to the source code
    let transformedCode = sourceCode;
    codeTransformations.forEach(transform => {
      transformedCode = 
        transformedCode.substring(0, transform.start) + 
        transform.value + 
        transformedCode.substring(transform.end);
    });
    
    // Apply additional transformations for specific conversion types
    if (sourceMode === 'heicToJpg' && targetMode === 'aviToMp4') {
      // Fix MIME types 
      transformedCode = transformedCode.replace(
        /const ACCEPTED_MIME_TYPES = \[\s*['"]video\/avi['"],\s*['"]video\/avi['"]\s*\];/g, 
        "const ACCEPTED_MIME_TYPES = ['video/x-msvideo', 'video/avi'];"
      );
      
      // Fix variable name for file filtering
      transformedCode = transformedCode.replace(
        /heicFiles = acceptedFiles\.filter\(file =>/g,
        "aviFiles = acceptedFiles.filter(file =>"
      );
      
      // Fix MIME type in condition
      transformedCode = transformedCode.replace(
        /file\.type === ['"]video\/avi['"];/g,
        "file.type === 'video/x-msvideo';"
      );
      
      // Fix variable name in setFiles
      transformedCode = transformedCode.replace(
        /setFiles\(heicFiles\);/g,
        "setFiles(aviFiles);"
      );
      
      // Remove iPhone reference
      transformedCode = transformedCode.replace(
        /iPhone AVI videos to standard MP4 format/g,
        "AVI videos to standard MP4 format"
      );
      
      // Fix file size
      transformedCode = transformedCode.replace(/20MB/g, '200MB');
    }
    
    console.log(`Acorn-based transformation complete:
- Identifiers: ${transformations.identifiers}
- Strings: ${transformations.strings}
Total transformations: ${transformations.identifiers + transformations.strings}`);
    
    return transformedCode;
  } catch (error) {
    console.error('Acorn transformation error:', error);
    return null; // Return null to indicate failure
  }
}