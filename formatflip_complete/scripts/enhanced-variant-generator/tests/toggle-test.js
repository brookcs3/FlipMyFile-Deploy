/**
 * Transformer Toggle Test
 * 
 * This script tests the transformer toggle mechanism to ensure
 * both AST and text-based transformers can be activated cleanly.
 */

import { transformCode } from '../hybrid-transformer.js';
import { 
  setTransformerMode,
  getTransformerMode,
  isASTEnabled
} from '../config/transformer-mode.js';

// Simple test code with format references
const testCode = `
/**
 * HEIC to JPG Converter
 */
function convertHeicToJpg(heicFile) {
  // Convert HEIC to JPG
  console.log('Converting HEIC image to JPG format');
  return 'converted.jpg';
}
`;

// Run the tests
async function runToggleTests() {
  console.log('=== Testing Transformer Toggle Mechanism ===\n');
  
  // Test with both transformer modes
  for (const mode of [true, false]) {
    console.log(`\n--- Testing with useAST = ${mode} ---`);
    
    // Set the mode
    setTransformerMode(mode);
    
    // Verify the mode is set correctly
    console.log(`Mode set: ${getTransformerMode()}`);
    console.log(`isASTEnabled() returns: ${isASTEnabled()}`);
    
    // Perform a transformation
    console.log('\nRunning transformation:');
    try {
      const result = await transformCode(
        testCode,
        'heicToJpg',
        'aviToMp4'
      );
      
      console.log('\nTransformation succeeded. Result:');
      console.log('-----------------------------------');
      console.log(result);
      console.log('-----------------------------------');
    } catch (error) {
      console.error('Transformation failed:', error);
    }
  }
  
  console.log('\n=== Toggle Test Complete ===');
}

// Run the test
runToggleTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});