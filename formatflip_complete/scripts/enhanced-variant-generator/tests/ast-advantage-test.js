/**
 * AST Advantage Test
 * 
 * This test demonstrates the advantages of AST-based transformation 
 * over simple text replacement in complex scenarios.
 */

import { transformCode } from '../hybrid-transformer.js';
import { 
  setTransformerMode, 
  getTransformerMode 
} from '../config/transformer-mode.js';

// Code sample with complex structures that benefit from AST parsing
const complexCodeSample = `
import React from 'react';
import { HeicDropzone } from './components/HeicDropzone';
import { convertHeicToJpg, processHeicFile } from './utils/heic-converter';

// Configuration settings for HEIC conversion
const CONFIG = {
  maxFileSize: 20 * 1024 * 1024, // 20MB limit for HEIC files
  acceptedFormats: ['image/heic', '.heic'],
  outputFormat: 'image/jpeg',
  conversion: {
    heicToJpg: {
      quality: 0.85,
      metadata: true,
      // Function with a nested format reference
      process: (file) => {
        console.log(\`Processing HEIC file: \${file.name}\`);
        return file.name.replace('.heic', '.jpg');
      }
    }
  }
};

// Complex JSX with format references in props and nested components
function HeicConverter() {
  const [files, setFiles] = React.useState([]);
  
  return (
    <div className="heic-converter">
      <h1>HEIC to JPG Converter</h1>
      
      <HeicDropzone 
        acceptedFormats={CONFIG.acceptedFormats}
        maxSize={CONFIG.maxFileSize}
        onDrop={(heicFiles) => {
          // This comment contains HEIC and JPG references
          setFiles(heicFiles);
        }}
        fileTypeDescription="HEIC images (iPhone photos)"
      />
      
      {files.length > 0 && (
        <div className="heic-file-list">
          {files.map(file => (
            <div key={file.name} className="heic-file-item">
              {file.name}
              <button 
                onClick={() => convertHeicToJpg(file)}
                data-filetype="heic"
                aria-label="Convert HEIC to JPG">
                Convert
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HeicConverter;
`;

// Test both transformation methods and compare
async function runAstAdvantageTest() {
  console.log('=== Running AST Advantage Test ===\n');
  
  // Test with both modes
  for (const useAST of [true, false]) {
    const modeName = useAST ? 'AST' : 'Text';
    console.log(`\n--- Using ${modeName}-based transformation ---`);
    
    // Set the transformation mode
    setTransformerMode(useAST);
    
    try {
      // Transform from HEIC to AVI
      const result = await transformCode(
        complexCodeSample,
        'heicToJpg',
        'aviToMp4'
      );
      
      // Count occurrences of formats in the result
      const heicCount = countOccurrences(result, /heic/gi);
      const jpgCount = countOccurrences(result, /jpg|jpeg/gi);
      const aviCount = countOccurrences(result, /avi/gi);
      const mp4Count = countOccurrences(result, /mp4/gi);
      
      // Check nested code blocks (better handled by AST)
      const configBlock = extractConfigBlock(result);
      const jsxProps = extractJsxProps(result);
      
      // Print results
      console.log('\nFormat Occurrences in Result:');
      console.log(`- HEIC: ${heicCount}`);
      console.log(`- JPG/JPEG: ${jpgCount}`);
      console.log(`- AVI: ${aviCount}`);
      console.log(`- MP4: ${mp4Count}`);
      
      // Log interesting AST-specific advantages
      if (configBlock) {
        console.log('\nTransformed Config Object:');
        console.log(configBlock);
      }
      
      if (jsxProps && jsxProps.length > 0) {
        console.log('\nTransformed JSX Props:');
        jsxProps.forEach(prop => console.log(`- ${prop}`));
      }
      
      // Indicate expected advantages
      if (useAST) {
        if (configBlock && configBlock.includes('avi') && configBlock.includes('mp4')) {
          console.log('\n✅ AST Advantage: Correctly transformed nested object properties');
        }
        
        if (jsxProps && jsxProps.some(prop => prop.includes('avi') || prop.includes('mp4'))) {
          console.log('✅ AST Advantage: Correctly transformed JSX attribute values');
        }
      }
    } catch (error) {
      console.error(`Error during ${modeName} transformation:`, error);
    }
  }
  
  console.log('\n=== AST Advantage Test Complete ===');
}

// Helper functions
function countOccurrences(text, regex) {
  const matches = text.match(regex) || [];
  return matches.length;
}

function extractConfigBlock(code) {
  const configMatch = code.match(/const CONFIG = \{[\s\S]*?\};/);
  return configMatch ? configMatch[0] : null;
}

function extractJsxProps(code) {
  const propsRegex = /(\w+)=\{.*?\}|(\w+)=".*?"/g;
  const matches = [...code.matchAll(propsRegex)];
  return matches.map(m => m[0]).filter(Boolean);
}

// Run the test
runAstAdvantageTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});