/**
 * Verification Suite for Variant Generation
 * 
 * This script performs a full end-to-end test of the variant generation process,
 * verifying that all transformations are applied correctly with the specified
 * transformer mode.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Constants
const TEST_VARIANT_NAME = 'testflip';
const TEST_CONVERSION_MODE = 'aviToMp4';
const TEST_COLOR = '#3066BE';
const AST_TRANSFORMER_MODE = 'ast';

// Paths to check
const projectRoot = process.cwd();
const packagesDirPath = path.join(projectRoot, 'packages');
const testVariantPath = path.join(packagesDirPath, TEST_VARIANT_NAME);

// Cleanup previous test runs
function cleanup() {
  console.log('Cleaning up previous test runs...');
  if (fs.existsSync(testVariantPath)) {
    try {
      execSync(`rm -rf ${testVariantPath}`);
      console.log(`Removed existing directory: ${testVariantPath}`);
    } catch (error) {
      console.error(`Failed to remove directory: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run variant generation with AST transformer
function generateVariant() {
  console.log(`Generating test variant with AST transformer...`);
  try {
    const command = `node scripts/create-variant.js --name=${TEST_VARIANT_NAME} --mode=${TEST_CONVERSION_MODE} --color=${TEST_COLOR} --transformer=${AST_TRANSFORMER_MODE}`;
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Variant generation failed: ${error.message}`);
    process.exit(1);
  }
}

// Verify transformation results
function verifyTransformation() {
  if (!fs.existsSync(testVariantPath)) {
    console.error(`Test variant directory not created: ${testVariantPath}`);
    process.exit(1);
  }

  console.log('\n=== Verification Results ===');

  // Files to check
  const filesToCheck = [
    { path: path.join(testVariantPath, 'src', 'App.tsx'), name: 'App.tsx' },
    { path: path.join(testVariantPath, 'src', 'config', 'theme.ts'), name: 'theme.ts' },
    { path: path.join(testVariantPath, 'src', 'conversion', 'register.ts'), name: 'register.ts' }
  ];
  
  // Format names to search for
  const sourceFormat = 'avi';
  const targetFormat = 'mp4';
  
  // Check each file
  let allPassed = true;
  let totalRefs = 0;
  let totalMatchingRefs = 0;
  
  filesToCheck.forEach(file => {
    if (!fs.existsSync(file.path)) {
      console.error(`File not found: ${file.path}`);
      allPassed = false;
      return;
    }
    
    const content = fs.readFileSync(file.path, 'utf8');
    
    // Check for source format references
    const sourceRefs = (content.match(new RegExp(sourceFormat, 'gi')) || []).length;
    
    // Check for target format references
    const targetRefs = (content.match(new RegExp(targetFormat, 'gi')) || []).length;
    
    // Track totals
    totalRefs += sourceRefs + targetRefs;
    totalMatchingRefs += targetRefs;
    
    console.log(`\nFile: ${file.name}`);
    console.log(`- Found ${targetRefs} references to '${targetFormat}'`);
    
    // Check if any unexpected source format references remain
    if (sourceRefs > 0) {
      console.log(`⚠️ WARNING: ${sourceRefs} unexpected references to '${sourceFormat}' found`);
      console.log(`  This might indicate incomplete transformation.`);
      allPassed = false;
    } else {
      console.log(`✓ No unexpected references to '${sourceFormat}' found`);
    }
  });
  
  // Calculate coverage
  const coverage = totalRefs > 0 ? (totalMatchingRefs / totalRefs) * 100 : 0;
  
  console.log('\n=== Summary ===');
  console.log(`Transformer Mode: ${AST_TRANSFORMER_MODE.toUpperCase()}`);
  console.log(`Transformation Coverage: ${Math.round(coverage)}%`);
  console.log(`Verification Result: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (!allPassed) {
    console.log('\nSuggestions:');
    console.log('1. Check the AST transformer for proper handling of all format references');
    console.log('2. Look for complex code structures that might be challenging for transformation');
    console.log('3. Consider additional test cases to improve transformation coverage');
  }
  
  return allPassed;
}

// Main function
async function main() {
  console.log('=== Variant Generation Verification Suite ===\n');
  
  // Run the tests
  cleanup();
  generateVariant();
  const result = verifyTransformation();
  
  // Final cleanup 
  console.log('\nCleaning up test variant...');
  cleanup();
  
  console.log('\n=== Verification Complete ===');
  process.exit(result ? 0 : 1);
}

// Run the main function
main().catch(error => {
  console.error('Verification failed with error:', error);
  process.exit(1);
});