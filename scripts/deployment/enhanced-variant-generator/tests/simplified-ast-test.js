/**
 * Simplified AST Transformer Test
 * 
 * This script tests the simplified AST transformer implementation
 * that doesn't rely on external dependencies like Babel or Acorn.
 */

import { transformCode } from '../hybrid-transformer.js';
import { setTransformerMode } from '../config/transformer-mode.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_OUTPUT_DIR = path.join(__dirname, 'output');

// Ensure output directory exists
if (!fs.existsSync(TEST_OUTPUT_DIR)) {
  fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
}

// Sample code for transformation
const sampleCode = `
/**
 * HEIC File Processor
 * 
 * This component handles processing of HEIC files and converting them to JPG format.
 */

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { convertHeicToJpg } from '../../utils/heicConverter';
import { HEICDropzone } from '../dropzone/HEICDropzone';
import { ProcessingStatus } from '../status/ProcessingStatus';
import { FileList } from '../files/FileList';

// Constants
const MAX_SIZE = 20 * 1024 * 1024; // 20MB for HEIC files
const ACCEPTED_MIME_TYPES = ['image/heic'];

const HeicProcessor = () => {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const onDrop = useCallback(acceptedFiles => {
    // Filter only valid HEIC files
    const heicFiles = acceptedFiles.filter(file => 
      file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')
    );
    
    if (heicFiles.length === 0) {
      setErrorMessage('No valid HEIC files selected. Please select HEIC image files.');
      return;
    }
    
    // Check file size limits
    const oversizedFiles = heicFiles.filter(file => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      setErrorMessage(`Some files exceed the 20MB size limit: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    setErrorMessage('');
    setFiles(heicFiles);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/heic': [] },
    maxSize: MAX_SIZE,
    multiple: true
  });
  
  const processHeicFiles = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    setErrorMessage('');
    setConvertedFiles([]);
    
    try {
      const results = [];
      
      for (const heicFile of files) {
        try {
          const jpgBlob = await convertHeicToJpg(heicFile);
          const convertedFile = new File(
            [jpgBlob],
            heicFile.name.replace(/\.heic$/i, '.jpg'),
            { type: 'image/jpeg' }
          );
          results.push({
            originalFile: heicFile,
            convertedFile,
            success: true
          });
        } catch (err) {
          console.error('HEIC conversion error:', err);
          results.push({
            originalFile: heicFile,
            error: err.message || 'HEIC_CONVERSION_FAILED',
            success: false
          });
        }
      }
      
      setConvertedFiles(results);
    } catch (err) {
      setErrorMessage(`Error processing HEIC files: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="heic-processor">
      <h2>HEIC to JPG Converter</h2>
      
      <HEICDropzone 
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        files={files}
      />
      
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
      
      {files.length > 0 && (
        <div className="file-actions">
          <button 
            onClick={processHeicFiles}
            disabled={isProcessing}
            className="convert-heic-button"
          >
            {isProcessing ? 'Converting...' : `Convert ${files.length} HEIC ${files.length === 1 ? 'file' : 'files'} to JPG`}
          </button>
          
          <button
            onClick={() => {
              setFiles([]);
              setConvertedFiles([]);
              setErrorMessage('');
            }}
            className="clear-button"
          >
            Clear
          </button>
        </div>
      )}
      
      {isProcessing && (
        <ProcessingStatus fileCount={files.length} />
      )}
      
      {convertedFiles.length > 0 && (
        <FileList 
          files={convertedFiles}
          title="Converted JPG Files"
        />
      )}
    </div>
  );
};

export default HeicProcessor;
`;

// Run the transformation test
async function runTransformationTest() {
  console.log('=== Running Simplified AST Transformer Test ===\n');
  
  // Force AST mode
  setTransformerMode('ast');
  
  try {
    console.log('Original code sample has HEIC/JPG references:\n');
    const countHeic = (sampleCode.match(/heic/gi) || []).length;
    const countJpg = (sampleCode.match(/jpg|jpeg/gi) || []).length;
    console.log(`- HEIC references: ${countHeic}`);
    console.log(`- JPG references: ${countJpg}\n`);
    
    // Transform from HEIC to AVI
    console.log('Transforming from HEIC/JPG to AVI/MP4...');
    const transformedCode = await transformCode(sampleCode, 'heicToJpg', 'aviToMp4');
    
    // Write the transformed code to a file for inspection
    const outputPath = path.join(TEST_OUTPUT_DIR, 'simplified-ast-transformed.js');
    fs.writeFileSync(outputPath, transformedCode, 'utf8');
    console.log(`Transformed code written to: ${outputPath}\n`);
    
    // Check replacement counts
    const countAvi = (transformedCode.match(/avi/gi) || []).length;
    const countMp4 = (transformedCode.match(/mp4/gi) || []).length;
    const remainingHeic = (transformedCode.match(/heic/gi) || []).length;
    const remainingJpg = (transformedCode.match(/jpg|jpeg/gi) || []).length;
    
    console.log('Transformation results:');
    console.log(`- AVI references found: ${countAvi}`);
    console.log(`- MP4 references found: ${countMp4}`);
    console.log(`- HEIC references remaining: ${remainingHeic}`);
    console.log(`- JPG references remaining: ${remainingJpg}\n`);
    
    // Calculate replacement percentages
    const originalReferences = countHeic + countJpg;
    const newReferences = countAvi + countMp4;
    const remainingReferences = remainingHeic + remainingJpg;
    const replacementRate = (newReferences / (newReferences + remainingReferences)) * 100;
    
    console.log(`Transformation rate: ${replacementRate.toFixed(2)}%`);
    console.log(`(${newReferences} transformed references out of ${newReferences + remainingReferences} total references)\n`);
    
    // Check for quality issues
    const parameterTransformations = transformedCode.includes('aviFile') || transformedCode.includes('mp4File');
    const errorCodeTransformations = transformedCode.includes('AVI_CONVERSION_FAILED');
    
    console.log('Transformation quality check:');
    console.log(`- Parameter names transformed: ${parameterTransformations ? '❌ Yes (potential issue)' : '✅ No (good)'}`);
    console.log(`- Error codes transformed: ${errorCodeTransformations ? '❌ Yes (potential issue)' : '✅ No (good)'}\n`);
    
    console.log('=== Simplified AST Transformer Test Complete ===');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
runTransformationTest().catch(error => {
  console.error('Test execution error:', error);
});
