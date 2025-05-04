/**
 * Complex Structure AST Advantage Test
 * 
 * This test demonstrates the advantages of AST-based transformation
 * with complex nested structures that would be challenging for text-based approaches.
 */

import { transformCode } from '../hybrid-transformer.js';
import { 
  setTransformerMode, 
  getTransformerMode 
} from '../config/transformer-mode.js';

// Complex code sample without JSX for simpler testing
const complexCodeSample = `
import { heicConverterUtils } from './utils';

// A complex nested configuration object
const APP_CONFIG = {
  converters: {
    heic: {
      name: 'HEIC Converter',
      targetFormat: 'jpg',
      options: {
        quality: 0.85,
        preserveMetadata: true,
        maxSizeLimit: 20 * 1024 * 1024, // 20MB for HEIC files
        acceptedMimeTypes: ['image/heic'],
        processingQueue: {
          maxConcurrent: 3,
          retryCount: 2,
          // Function with a 'heic' string that shouldn't be replaced
          shouldRetry: (error) => {
            return error.code !== 'HEIC_CORRUPTED' && error.retries < 3;
          }
        }
      }
    }
  },
  // A function that would be hard to properly transform with regex
  getHeicStatsForFileName(filename) {
    // Shouldn't transform this occurrence as it's in parameter position
    return filename.endsWith('.heic') 
      ? { type: 'heic', canConvert: true }
      : { type: 'unknown', canConvert: false };
  }
};

class HeicProcessor {
  constructor() {
    this.heicFiles = [];
    this.convertedJpgs = [];
  }
  
  async processHeicBatch(files) {
    const results = await Promise.all(
      files.map(file => heicConverterUtils.convert(file, APP_CONFIG.converters.heic.options))
    );
    return results.filter(result => result.success);
  }
  
  getHeicQuality() {
    return APP_CONFIG.converters.heic.options.quality;
  }
  
  logFileStats() {
    console.log("HEIC files:", this.heicFiles.length);
    console.log("JPG outputs:", this.convertedJpgs.length);
    
    this.heicFiles.forEach(file => {
      console.log(\`HEIC file: \${file.name}, size: \${(file.size/1024/1024).toFixed(2)}MB\`);
    });
  }
}

export { HeicProcessor, APP_CONFIG };
`;

async function runComplexStructureTest() {
  console.log('=== Running Complex Structure Test ===\n');
  
  // Test with both transformer modes
  const modes = ['ast', 'text'];
  
  for (const mode of modes) {
    const modeName = mode === 'ast' ? 'AST-based' : 'Text-based';
    console.log(`\n--- Testing with ${modeName} transformer ---\n`);
    
    // Set the transformer mode
    setTransformerMode(mode);
    console.log(`Mode set to: ${getTransformerMode()}`);
    
    try {
      // Transform from HEIC to AVI format
      const result = await transformCode(
        complexCodeSample,
        'heicToJpg',
        'aviToMp4'
      );
      
      // Analyze results
      const incorrectTransformations = analyzeIncorrectTransformations(result);
      const contextAwareness = analyzeContextAwareness(result);
      
      // Count occurrences
      const heicCount = countOccurrences(result, /heic/gi);
      const jpgCount = countOccurrences(result, /jpg|jpeg/gi);
      const aviCount = countOccurrences(result, /avi/gi);
      const mp4Count = countOccurrences(result, /mp4/gi);
      
      // Log results
      console.log('\nFormat Occurrences After Transformation:');
      console.log(`- HEIC remaining: ${heicCount}`);
      console.log(`- JPG remaining: ${jpgCount}`);
      console.log(`- AVI added: ${aviCount}`);
      console.log(`- MP4 added: ${mp4Count}`);
      
      console.log('\nTransformation Quality Analysis:');
      if (incorrectTransformations.length > 0) {
        console.log('❌ Incorrect Transformations Detected:');
        incorrectTransformations.forEach((item, i) => {
          console.log(`  ${i+1}. ${item}`);
        });
      } else {
        console.log('✅ No obviously incorrect transformations detected');
      }
      
      console.log('\nContext Awareness Analysis:');
      if (contextAwareness.preserved.length > 0) {
        console.log('✅ Correctly preserved context-sensitive format references:');
        contextAwareness.preserved.forEach((item, i) => {
          console.log(`  ${i+1}. ${item}`);
        });
      }
      
      if (contextAwareness.transformed.length > 0) {
        console.log('✅ Correctly transformed format references in context:');
        contextAwareness.transformed.forEach((item, i) => {
          console.log(`  ${i+1}. ${item}`);
        });
      }
      
      // Display key advantages of the approach
      if (mode === 'ast') {
        console.log('\nAST-based Transformation Advantages:');
        console.log('- Better preservation of code structure and formatting');
        console.log('- More context-aware transformations with fewer false positives');
        console.log('- Selective transformation within nested object structures');
      } else {
        console.log('\nText-based Transformation Characteristics:');
        console.log('- Faster processing with simpler implementation');
        console.log('- Potentially more comprehensive replacement coverage');
        console.log('- May transform content that should be preserved in specific contexts');
      }
      
    } catch (error) {
      console.error(`Error during ${modeName} transformation:`, error);
    }
  }
  
  console.log('\n=== Complex Structure Test Complete ===');
}

// Helper functions
function countOccurrences(text, regex) {
  return (text.match(regex) || []).length;
}

function analyzeIncorrectTransformations(code) {
  const issues = [];
  
  // Look for parameter names that shouldn't have been transformed
  if (code.includes('(aviname)') || code.includes('(mp4name)')) {
    issues.push('Transformed parameter name that should have been preserved');
  }
  
  // Look for error code strings that shouldn't have been transformed
  if (code.includes('AVI_CORRUPTED')) {
    issues.push('Transformed error code string that should have been preserved');
  }
  
  // Look for partially transformed elements
  if (code.includes('heic-avi-') || code.includes('jpg-mp4-')) {
    issues.push('Partially transformed class or attribute name');
  }
  
  return issues;
}

function analyzeContextAwareness(code) {
  const preserved = [];
  const transformed = [];
  
  // Check for preserved elements
  if (code.includes('error.code !== \'HEIC_CORRUPTED\'')) {
    preserved.push('Correctly preserved error code string');
  }
  
  if (!code.includes('aviname')) {
    preserved.push('Correctly preserved parameter names');
  }
  
  // Check for correctly transformed elements
  if (code.includes('getAviStatsForFileName')) {
    transformed.push('Properly transformed method names');
  }
  
  if (code.includes('AVI files:')) {
    transformed.push('Correctly transformed string literals in console.log');
  }
  
  if (code.includes('converters.avi.options')) {
    transformed.push('Correctly transformed object property access');
  }
  
  return { preserved, transformed };
}

// Run the test
runComplexStructureTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});