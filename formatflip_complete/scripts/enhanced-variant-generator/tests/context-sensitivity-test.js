/**
 * Context Sensitivity Test
 * 
 * This test specifically demonstrates how AST-based transformation can be more
 * context-aware than text-based replacement, particularly in cases where
 * format references appear in different syntactic contexts.
 */

import { transformCode } from '../hybrid-transformer.js';
import { 
  setTransformerMode, 
  getTransformerMode 
} from '../config/transformer-mode.js';

// Code sample with format references in various syntactic contexts
const contextSensitiveCode = `
/**
 * HEIC File Processor
 * 
 * This module handles processing of HEIC files and converting them to JPG format.
 * The conversion respects metadata and provides optimization options.
 */

// Import utilities
import { processHeicFile } from './utils/heic-converter';
import { optimizeJpg } from './utils/jpg-optimizer';

// Configuration constants - these should be transformed
const CONFIG = {
  INPUT_FORMAT: 'heic',
  OUTPUT_FORMAT: 'jpg',
  MAX_SIZE: 20 * 1024 * 1024, // 20MB for HEIC files
  MIME_TYPES: {
    input: 'image/heic',
    output: 'image/jpeg'
  }
};

// These parameter names should NOT be transformed
function processFile(heicData, jpgQuality = 0.9) {
  console.log('Processing HEIC file...');
  return convertHeicToJpg(heicData, { quality: jpgQuality });
}

// These property names should be transformed
const options = {
  heicOptions: {
    preserveMetadata: true
  },
  jpgOptions: {
    quality: 0.85,
    progressive: true
  }
};

// This error should NOT have its code transformed
class HeicProcessingError extends Error {
  constructor(message) {
    super(message);
    this.code = 'HEIC_PROCESSING_FAILED';
  }
}

// This object literal with shorthand syntax should be transformed
const formats = {
  heic: { extension: '.heic', mimeType: 'image/heic' },
  jpg: { extension: '.jpg', mimeType: 'image/jpeg' }
};

// This template literal should be transformed
const errorMessage = \`Failed to convert HEIC file to JPG format. Error: \${error.message}\`;

// Export utilities
export { processFile, CONFIG, HeicProcessingError };
`;

async function runContextSensitivityTest() {
  console.log('=== Running Context Sensitivity Test ===\n');
  
  // Test with both transformer modes
  const modes = ['ast', 'text'];
  const results = {};
  
  for (const mode of modes) {
    const modeName = mode === 'ast' ? 'AST-based' : 'Text-based';
    console.log(`\n--- Testing with ${modeName} transformer ---\n`);
    
    // Set the transformer mode
    setTransformerMode(mode);
    console.log(`Mode set to: ${getTransformerMode()}`);
    
    try {
      // Transform from HEIC to AVI format
      const result = await transformCode(
        contextSensitiveCode,
        'heicToJpg',
        'aviToMp4'
      );
      
      // Store the result for comparison
      results[mode] = result;
      
      // Analyze the transformation
      analyzeContextSensitivity(result, mode);
      
    } catch (error) {
      console.error(`Error during ${modeName} transformation:`, error);
    }
  }
  
  // Compare the two transformation approaches
  if (results.ast && results.text) {
    compareTransformations(results.ast, results.text);
  }
  
  console.log('\n=== Context Sensitivity Test Complete ===');
}

function analyzeContextSensitivity(code, mode) {
  console.log(`\nAnalyzing ${mode.toUpperCase()} transformation results:\n`);
  
  // Check for parameter names preservation
  const paramNames = [
    { name: 'aviData', context: 'function parameter', expected: false },
    { name: 'mp4Quality', context: 'function parameter', expected: false },
    { name: 'heicData', context: 'function parameter', expected: true },
    { name: 'jpgQuality', context: 'function parameter', expected: true }
  ];
  
  console.log('Parameter names:');
  for (const param of paramNames) {
    const found = code.includes(param.name);
    if (found === param.expected) {
      console.log(`  ✅ ${param.expected ? 'Correctly preserved' : 'Correctly transformed'}: ${param.name}`);
    } else {
      console.log(`  ❌ ${param.expected ? 'Incorrectly transformed' : 'Failed to transform'}: ${param.name}`);
    }
  }
  
  // Check for error code preservation
  const errorCodePreserved = code.includes('HEIC_PROCESSING_FAILED');
  console.log('\nError codes:');
  if (errorCodePreserved) {
    console.log('  ✅ Correctly preserved error code: HEIC_PROCESSING_FAILED');
  } else {
    console.log('  ❌ Incorrectly transformed error code to: AVI_PROCESSING_FAILED');
  }
  
  // Check for object property transformations
  const propertyTransformations = [
    { original: 'heicOptions', transformed: 'aviOptions', context: 'object property' },
    { original: 'jpgOptions', transformed: 'mp4Options', context: 'object property' }
  ];
  
  console.log('\nObject properties:');
  for (const prop of propertyTransformations) {
    const originalFound = code.includes(prop.original);
    const transformedFound = code.includes(prop.transformed);
    
    if (!originalFound && transformedFound) {
      console.log(`  ✅ Correctly transformed: ${prop.original} → ${prop.transformed}`);
    } else if (originalFound && !transformedFound) {
      console.log(`  ❌ Failed to transform: ${prop.original}`);
    } else if (originalFound && transformedFound) {
      console.log(`  ⚠️ Partially transformed: ${prop.original} and ${prop.transformed} both present`);
    }
  }
  
  // Check for template literal transformations
  const templateLiteralTransformed = code.includes('Failed to convert AVI file to MP4 format');
  console.log('\nTemplate literals:');
  if (templateLiteralTransformed) {
    console.log('  ✅ Correctly transformed text in template literal');
  } else {
    console.log('  ❌ Failed to transform text in template literal');
  }
  
  // Check for MIME type transformations
  const mimeTypeTransformations = [
    { original: 'image/heic', transformed: 'video/x-msvideo', context: 'MIME type constant' },
    { original: 'image/jpeg', transformed: 'video/mp4', context: 'MIME type constant' }
  ];
  
  console.log('\nMIME types:');
  for (const mime of mimeTypeTransformations) {
    const originalFound = code.includes(mime.original);
    const transformedFound = code.includes(mime.transformed);
    
    if (!originalFound && transformedFound) {
      console.log(`  ✅ Correctly transformed: ${mime.original} → ${mime.transformed}`);
    } else if (originalFound && !transformedFound) {
      console.log(`  ❌ Failed to transform: ${mime.original}`);
    } else if (originalFound && transformedFound) {
      console.log(`  ⚠️ Partially transformed: both MIME types present`);
    }
  }
}

function compareTransformations(astResult, textResult) {
  console.log('\n=== Transformation Comparison ===\n');
  
  // Count occurrences
  const counts = {
    ast: {
      heic: countOccurrences(astResult, /heic/gi),
      jpg: countOccurrences(astResult, /jpg|jpeg/gi),
      avi: countOccurrences(astResult, /avi/gi),
      mp4: countOccurrences(astResult, /mp4/gi)
    },
    text: {
      heic: countOccurrences(textResult, /heic/gi),
      jpg: countOccurrences(textResult, /jpg|jpeg/gi),
      avi: countOccurrences(textResult, /avi/gi),
      mp4: countOccurrences(textResult, /mp4/gi)
    }
  };
  
  console.log('Format occurrence counts:');
  console.log('                AST    Text');
  console.log(`HEIC remaining: ${counts.ast.heic.toString().padEnd(6)} ${counts.text.heic}`);
  console.log(`JPG remaining:  ${counts.ast.jpg.toString().padEnd(6)} ${counts.text.jpg}`);
  console.log(`AVI added:      ${counts.ast.avi.toString().padEnd(6)} ${counts.text.avi}`);
  console.log(`MP4 added:      ${counts.ast.mp4.toString().padEnd(6)} ${counts.text.mp4}`);
  
  // Calculate metrics
  const metrics = {
    ast: {
      transformationRate: (counts.ast.avi + counts.ast.mp4) / 
                          (counts.ast.heic + counts.ast.jpg + counts.ast.avi + counts.ast.mp4),
      contextPreservation: counts.ast.heic > 0 || counts.ast.jpg > 0 ? 'High' : 'Low'
    },
    text: {
      transformationRate: (counts.text.avi + counts.text.mp4) / 
                          (counts.text.heic + counts.text.jpg + counts.text.avi + counts.text.mp4),
      contextPreservation: counts.text.heic > 0 || counts.text.jpg > 0 ? 'High' : 'Low'
    }
  };
  
  console.log('\nTransformation metrics:');
  console.log(`AST transformation rate: ${(metrics.ast.transformationRate * 100).toFixed(1)}%`);
  console.log(`Text transformation rate: ${(metrics.text.transformationRate * 100).toFixed(1)}%`);
  console.log(`AST context preservation: ${metrics.ast.contextPreservation}`);
  console.log(`Text context preservation: ${metrics.text.contextPreservation}`);
  
  // Key differences
  const astOnly = findDifferences(astResult, textResult);
  const textOnly = findDifferences(textResult, astResult);
  
  if (astOnly.length > 0) {
    console.log('\nUnique to AST transformation:');
    astOnly.slice(0, 3).forEach(line => console.log(`  - ${line.trim()}`));
    if (astOnly.length > 3) console.log(`  - ... and ${astOnly.length - 3} more differences`);
  }
  
  if (textOnly.length > 0) {
    console.log('\nUnique to text-based transformation:');
    textOnly.slice(0, 3).forEach(line => console.log(`  - ${line.trim()}`));
    if (textOnly.length > 3) console.log(`  - ... and ${textOnly.length - 3} more differences`);
  }
}

function countOccurrences(text, regex) {
  return (text.match(regex) || []).length;
}

function findDifferences(text1, text2) {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  
  const uniqueLines = [];
  
  for (const line of lines1) {
    if (!lines2.includes(line) && line.trim() !== '') {
      uniqueLines.push(line);
    }
  }
  
  return uniqueLines;
}

// Run the test
runContextSensitivityTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});