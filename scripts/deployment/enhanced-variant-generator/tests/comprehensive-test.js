/**
 * Comprehensive Transformer Test
 * 
 * This script tests both AST-based and text-based transformers
 * against multiple real format conversions to verify integrity.
 */

import { transformCode } from '../hybrid-transformer.js';
import { 
  setTransformerMode,
  getTransformerMode
} from '../config/transformer-mode.js';

/**
 * Test cases for various format conversions
 */
const TEST_CASES = [
  {
    name: 'HEIC to JPG',
    sourceMode: 'heicToJpg',
    targetMode: 'aviToMp4',
    code: `
    /**
     * HEIC to JPG Converter
     * Convert your iPhone photos easily
     */
    function convertHeicToJpg(heicFile) {
      if (!heicFile || !heicFile.name.endsWith('.heic')) {
        throw new Error('Invalid HEIC file');
      }
      
      console.log('Converting HEIC image to JPG format');
      const outputFileName = heicFile.name.replace('.heic', '.jpg');
      
      // Process file
      const maxSize = 20; // 20MB max for HEIC files
      
      return {
        name: outputFileName,
        type: 'image/jpeg',
        size: heicFile.size * 0.8 // JPG is typically smaller
      };
    }
    
    // UI elements
    const heicDropZone = document.getElementById('heic-dropzone');
    const convertHeicButton = document.getElementById('convert-heic-button');
    `
  },
  {
    name: 'WebP to PNG',
    sourceMode: 'webpToPng',
    targetMode: 'heicToJpg',
    code: `
    /**
     * WebP to PNG Converter
     * Convert Google WebP format to universal PNG
     */
    class WebpConverter {
      constructor() {
        this.supportedInput = ['image/webp', '.webp'];
        this.outputFormat = 'image/png';
      }
      
      async convertWebpToPng(webpFile) {
        console.log('Processing WebP image');
        
        if (!webpFile.name.endsWith('.webp')) {
          throw new Error('Not a WebP file');
        }
        
        // Output file details
        return {
          name: webpFile.name.replace('.webp', '.png'),
          type: this.outputFormat
        };
      }
    }
    
    document.querySelector('.webp-preview').addEventListener('click', () => {
      console.log('WebP preview clicked');
    });
    `
  }
];

/**
 * Count format-specific terms in code
 * 
 * @param {string} code - The code to search in
 * @param {string} formatKey - The format to search for (e.g., 'heic', 'webp')
 * @returns {number} - Number of occurrences
 */
function countFormatOccurrences(code, formatKey) {
  const regex = new RegExp(formatKey, 'gi');
  return (code.match(regex) || []).length;
}

/**
 * Run the test cases with different transformer modes
 */
async function runComprehensiveTests() {
  console.log('=== Running Comprehensive Transformer Tests ===\n');
  
  // Test with both transformer modes
  for (const useAST of [true, false]) {
    const modeName = useAST ? 'AST-based' : 'Text-based';
    console.log(`\n--- Testing with ${modeName} transformer ---\n`);
    
    // Set the transformer mode
    setTransformerMode(useAST);
    console.log(`Transformer mode set to: ${getTransformerMode()}`);
    
    // Run all test cases
    for (const testCase of TEST_CASES) {
      console.log(`\nTest Case: ${testCase.name}`);
      console.log(`Converting from ${testCase.sourceMode} to ${testCase.targetMode}`);
      
      try {
        // Get the original format keys for counting - extract source and target from sourceMode and targetMode
        const [sourceFormat, sourceTarget] = testCase.sourceMode.split('To');
        const [targetFormat, targetTarget] = testCase.targetMode.split('To');
        
        // Count original occurrences for both source format and target format in original code
        const originalSourceCount = countFormatOccurrences(testCase.code, sourceFormat.toLowerCase());
        
        // Perform the transformation
        const transformedCode = await transformCode(
          testCase.code,
          testCase.sourceMode,
          testCase.targetMode
        );
        
        // Count transformed occurrences
        const transformedTargetCount = countFormatOccurrences(transformedCode, targetFormat.toLowerCase());
        
        // Basic validation
        if (originalSourceCount > 0 && transformedTargetCount > 0) {
          console.log('✅ Success: Format conversion looks correct');
          console.log(`   Original '${sourceFormat}' occurrences: ${originalSourceCount}`);
          console.log(`   Transformed '${targetFormat}' occurrences: ${transformedTargetCount}`);
        } else {
          console.log('❌ Warning: Format conversion might be incomplete');
          console.log(`   Original '${sourceFormat}' occurrences: ${originalSourceCount}`);
          console.log(`   Transformed '${targetFormat}' occurrences: ${transformedTargetCount}`);
        }
      } catch (error) {
        console.error(`❌ Error with test case ${testCase.name}:`, error);
      }
    }
  }
  
  console.log('\n=== Comprehensive Test Complete ===');
}

// Run the tests
runComprehensiveTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});