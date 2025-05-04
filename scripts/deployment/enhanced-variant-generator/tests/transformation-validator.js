/**
 * Transformation Validator
 * 
 * This script tests the transformation process against various test cases
 * and validates the results for completeness and correctness.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformCode } from '../hybrid-transformer.js';
import { setTransformerMode } from '../config/transformer-mode.js';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create output directory
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Test case with mixed format references
 */
const mixedFormatTestCase = `
/**
 * HEIC to JPG Converter Component
 * 
 * This component handles conversion from iPhone HEIC photos to standard JPG format
 * for better compatibility across devices.
 */

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { convertHeicToJpg } from '../utils/converters';

// Accepted MIME types
const ACCEPTED_MIME_TYPES = ['image/heic', 'application/octet-stream'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const HeicToJpgConverter = () => {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState([]);
  
  // Handle dropped files
  const onDrop = (acceptedFiles) => {
    // Filter for HEIC files only
    const heicFiles = acceptedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === 'heic' || file.type === 'image/heic';
    });
    
    setFiles(heicFiles);
  };
  
  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    maxSize: MAX_FILE_SIZE
  });
  
  // Convert all files
  const handleConversion = async () => {
    setConverting(true);
    
    try {
      const results = await Promise.all(
        files.map(file => convertHeicToJpg(file))
      );
      
      setConverted(results);
    } catch (error) {
      console.error('HEIC conversion error:', error);
    } finally {
      setConverting(false);
    }
  };
  
  return (
    <div className="heic-to-jpg-converter">
      <h2>Convert HEIC to JPG</h2>
      
      <div 
        {...getRootProps()} 
        className={\`dropzone \${isDragActive ? 'active' : ''}\`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your HEIC images here...</p>
        ) : (
          <p>Drop your iPhone HEIC images here or click to select files</p>
        )}
        <small>Maximum size: 20MB each</small>
      </div>
      
      {files.length > 0 && (
        <div className="file-list">
          <h3>Selected Files</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index}>
                {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
              </li>
            ))}
          </ul>
          
          <button 
            onClick={handleConversion}
            disabled={converting}
            className="convert-btn"
          >
            {converting ? 'Converting...' : 'Convert to JPG'}
          </button>
        </div>
      )}
      
      {converted.length > 0 && (
        <div className="converted-files">
          <h3>Converted JPG Files</h3>
          <ul>
            {converted.map((result, index) => (
              <li key={index}>
                <a 
                  href={result.url} 
                  download={\`\${result.filename}.jpg\`}
                >
                  {result.filename}.jpg ({(result.size / (1024 * 1024)).toFixed(2)}MB)
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Add some metadata for component identification
HeicToJpgConverter.displayName = 'HeicToJpgConverter';
HeicToJpgConverter.description = 'Converts HEIC images to JPG format';
HeicToJpgConverter.fileExtensions = ['.heic', '.HEIC'];
HeicToJpgConverter.targetExtension = '.jpg';
`;

/**
 * Count format references in a string
 * 
 * @param {string} content - The content to search
 * @param {string[]} formatVariations - The format variations to count
 * @returns {number} - The number of occurrences
 */
function countFormatReferences(content, formatVariations) {
  let count = 0;
  
  formatVariations.forEach(variation => {
    const regex = new RegExp(variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex) || [];
    count += matches.length;
  });
  
  return count;
}

/**
 * Run tests with both AST and text-based transformers
 */
async function runTransformationTests() {
  // Define test cases and expected transformations
  const testCases = [
    {
      name: 'heic-to-jpg-to-avi-to-mp4',
      sourceCode: mixedFormatTestCase,
      sourceMode: 'heicToJpg',
      targetMode: 'aviToMp4'
    }
  ];
  
  // Test with both transformation modes
  const modes = [
    { name: 'AST-based', useAST: true },
    { name: 'Text-based', useAST: false }
  ];
  
  for (const mode of modes) {
    console.log(`\n===== Testing ${mode.name} Transformer =====`);
    
    // Set transformer mode
    setTransformerMode(mode.useAST);
    
    for (const testCase of testCases) {
      console.log(`\n--- Test Case: ${testCase.name} ---`);
      
      // Get important format variations to check for
      const sourceFormat = testCase.sourceMode === 'heicToJpg' ? 
        ['heic', 'HEIC', 'Heic', 'HeicToJpg', 'heicToJpg'] : 
        ['avi', 'AVI', 'Avi', 'AviToMp4', 'aviToMp4'];
      
      const targetFormat = testCase.targetMode === 'aviToMp4' ? 
        ['avi', 'AVI', 'Avi', 'AviToMp4', 'aviToMp4'] : 
        ['heic', 'HEIC', 'Heic', 'HeicToJpg', 'heicToJpg'];
      
      // Count original format references
      const originalSourceRefs = countFormatReferences(testCase.sourceCode, sourceFormat);
      console.log(`Original source format references: ${originalSourceRefs}`);
      
      // Transform the code
      const startTime = Date.now();
      const transformedCode = await transformCode(
        testCase.sourceCode, 
        testCase.sourceMode, 
        testCase.targetMode
      );
      const endTime = Date.now();
      
      // Save transformed code
      const outputPath = path.join(outputDir, `${testCase.name}-${mode.useAST ? 'ast' : 'text'}.js`);
      fs.writeFileSync(outputPath, transformedCode);
      
      // Count remaining source format references
      const remainingSourceRefs = countFormatReferences(transformedCode, sourceFormat);
      
      // Count new target format references
      const targetRefs = countFormatReferences(transformedCode, targetFormat);
      
      // Calculate statistics
      const replacedRefs = originalSourceRefs - remainingSourceRefs;
      const transformPercentage = (replacedRefs / originalSourceRefs) * 100;
      const timeElapsed = endTime - startTime;
      
      // Log statistics
      console.log(`Transformation time: ${timeElapsed}ms`);
      console.log(`Original references: ${originalSourceRefs}`);
      console.log(`Replaced references: ${replacedRefs}`);
      console.log(`Remaining source format references: ${remainingSourceRefs}`);
      console.log(`New target format references: ${targetRefs}`);
      console.log(`Transformation completion: ${transformPercentage.toFixed(2)}%`);
      
      if (remainingSourceRefs > 0) {
        console.warn('⚠️ INCOMPLETE TRANSFORMATION: Some source format references remain');
      } else {
        console.log('✅ COMPLETE TRANSFORMATION: All source format references replaced');
      }
      
      console.log(`Transformed code saved to: ${outputPath}`);
    }
  }
}

// Run the tests
runTransformationTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});