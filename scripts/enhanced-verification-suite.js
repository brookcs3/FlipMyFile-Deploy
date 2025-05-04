/**
 * Enhanced Verification Suite for Variant Generation
 * 
 * This script performs a full end-to-end test of the variant generation process,
 * verifying that all transformations are applied correctly with the specified
 * transformer mode.
 * 
 * This version uses a simpler text-based approach that avoids Babel dependencies.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const TEST_VARIANT_NAME = 'testflip';
const TEST_CONVERSION_MODE = 'aviToMp4';
const TEST_COLOR = '#3066BE';
const TEXT_TRANSFORMER_MODE = 'text';

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

// Basic text transformation function (simplified for verification only)
function transformText(sourceText, sourceFormat, targetFormat) {
  // Simple case-insensitive replacement with word boundary detection
  const sourcePattern = new RegExp(`\\b${sourceFormat}\\b`, 'gi');
  return sourceText.replace(sourcePattern, targetFormat);
}

// Run variant generation with text transformer
function generateVariant() {
  console.log(`Generating test variant with text transformer...`);
  try {
    const command = `node scripts/create-variant.js --name=${TEST_VARIANT_NAME} --mode=${TEST_CONVERSION_MODE} --color=${TEST_COLOR} --transformer=${TEXT_TRANSFORMER_MODE}`;
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
    
    // Display file content for analysis
    console.log(`\n=== File: ${file.name} ===`);
    
    // Check for source format references (case insensitive)
    const sourcePattern = new RegExp(`\\b${sourceFormat}\\b`, 'gi');
    let sourceMatch;
    let sourceRefs = 0;
    let sourceLines = [];
    
    // Find all source format references with context
    while ((sourceMatch = sourcePattern.exec(content)) !== null) {
      sourceRefs++;
      
      // Extract context (line where match occurs)
      const beforeMatch = content.substring(0, sourceMatch.index);
      const lineNumber = beforeMatch.split('\n').length;
      const line = content.split('\n')[lineNumber - 1].trim();
      
      sourceLines.push({
        lineNumber,
        content: line,
        matchIndex: line.toLowerCase().indexOf(sourceFormat.toLowerCase())
      });
    }
    
    // Check for target format references
    const targetPattern = new RegExp(`\\b${targetFormat}\\b`, 'gi');
    let targetMatch;
    let targetRefs = 0;
    let targetLines = [];
    
    // Find all target format references with context
    while ((targetMatch = targetPattern.exec(content)) !== null) {
      targetRefs++;
      
      // Extract context
      const beforeMatch = content.substring(0, targetMatch.index);
      const lineNumber = beforeMatch.split('\n').length;
      const line = content.split('\n')[lineNumber - 1].trim();
      
      targetLines.push({
        lineNumber,
        content: line,
        matchIndex: line.toLowerCase().indexOf(targetFormat.toLowerCase())
      });
    }
    
    // Track totals
    totalRefs += sourceRefs + targetRefs;
    totalMatchingRefs += targetRefs;
    
    console.log(`- Found ${targetRefs} references to '${targetFormat}'`);
    
    // Check if any unexpected source format references remain
    if (sourceRefs > 0) {
      console.log(`⚠️ WARNING: ${sourceRefs} unexpected references to '${sourceFormat}' found`);
      console.log(`  This might indicate incomplete transformation.`);
      
      // Show problematic lines
      console.log(`\n  Problematic lines containing '${sourceFormat}':`);
      sourceLines.forEach(({ lineNumber, content }) => {
        console.log(`  Line ${lineNumber}: ${content}`);
      });
      
      allPassed = false;
    } else {
      console.log(`✓ No unexpected references to '${sourceFormat}' found`);
    }
  });
  
  // Calculate coverage
  const coverage = totalRefs > 0 ? (totalMatchingRefs / totalRefs) * 100 : 0;
  
  console.log('\n=== Summary ===');
  console.log(`Transformer Mode: ${TEXT_TRANSFORMER_MODE.toUpperCase()}`);
  console.log(`Transformation Coverage: ${Math.round(coverage)}%`);
  console.log(`Verification Result: ${allPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  if (!allPassed) {
    console.log('\nSuggestions:');
    console.log('1. Review text-based transformation patterns');
    console.log('2. Check for case-sensitivity issues');
    console.log('3. Look for complex patterns that might be missed');
  }
  
  return allPassed;
}

// Main function
async function main() {
  console.log('=== Enhanced Variant Generation Verification Suite ===\n');
  
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