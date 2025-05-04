/**
 * AST Transformer Test Script (ES Modules version)
 * 
 * This script tests the AST-based transformer using ES Modules
 * to ensure compatibility with the project's module system.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transformWithAST } from './ast-transformer.js';

// Get current file directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock format registry for testing
const mockRegistry = {
  conversionModes: {
    'heicToJpg': {
      source: 'heic',
      target: 'jpg',
      namingVariations: ['heicToJpg', 'convertHeicToJpg', 'heicJpgConverter']
    },
    'aviToMp4': {
      source: 'avi',
      target: 'mp4',
      namingVariations: ['aviToMp4', 'convertAviToMp4', 'aviMp4Converter']
    }
  },
  formats: {
    'heic': {
      variations: ['heic', 'HEIC', 'Heic'],
      extensions: ['.heic', '.HEIC'],
      mimeTypes: ['image/heic', 'application/octet-stream'],
      inComments: ['HEIC images', 'iPhone HEIC files']
    },
    'jpg': {
      variations: ['jpg', 'JPG', 'Jpg', 'jpeg', 'JPEG'],
      extensions: ['.jpg', '.JPG', '.jpeg', '.JPEG'],
      mimeTypes: ['image/jpeg', 'image/jpg'],
      inComments: ['JPG images', 'JPEG files']
    },
    'avi': {
      variations: ['avi', 'AVI', 'Avi'],
      extensions: ['.avi', '.AVI'],
      mimeTypes: ['video/x-msvideo', 'video/avi'],
      inComments: ['AVI videos', 'AVI files']
    },
    'mp4': {
      variations: ['mp4', 'MP4', 'Mp4'],
      extensions: ['.mp4', '.MP4'],
      mimeTypes: ['video/mp4'],
      inComments: ['MP4 videos', 'MP4 files']
    }
  }
};

// Test code snippet
const testCode = `
/**
 * HEIC to JPG converter component
 * 
 * This component handles the conversion of HEIC images to JPG format using browser-based processing.
 */

const HeicToJpgConverter = () => {
  const [files, setFiles] = useState([]);
  
  // Filter for HEIC files only
  const handleFileDrop = (acceptedFiles) => {
    const heicFiles = acceptedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === 'heic' || file.type === 'image/heic';
    });
    
    setFiles(heicFiles);
  };
  
  return (
    <div className="heic-to-jpg-converter">
      <h2>Convert HEIC to JPG</h2>
      <p>Drop your iPhone HEIC images here. Maximum size: 20MB each</p>
    </div>
  );
};
`;

// Run the test
function runASTTest() {
  console.log('Testing AST-based transformation...');
  
  try {
    // Transform the test code
    const transformedCode = transformWithAST(testCode, 'heicToJpg', 'aviToMp4', mockRegistry);
    
    if (transformedCode) {
      console.log('\nTransformation successful! Result:');
      console.log('-----------------------------------');
      console.log(transformedCode);
      console.log('-----------------------------------');
      
      // Write to output file for inspection
      const outputPath = path.join(__dirname, 'ast-output-test.js');
      fs.writeFileSync(outputPath, transformedCode);
      console.log(`\nOutput written to: ${outputPath}`);
      
      return true;
    } else {
      console.error('AST transformation failed - no code returned.');
      return false;
    }
  } catch (error) {
    console.error('Error running AST test:', error);
    return false;
  }
}

// Execute the test
const success = runASTTest();
process.exit(success ? 0 : 1);