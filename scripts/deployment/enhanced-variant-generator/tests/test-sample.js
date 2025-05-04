/**
 * HEIC to JPG converter component
 * 
 * This component handles the conversion of HEIC images to JPG format using browser-based processing.
 * 
 * @author HEICFlip Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { HeicConverter } from '@utils/converters/heicToJpg';
import { DropZone } from '@components/ui/DropZone';
import { Button } from '@components/ui/Button';
import { FileList } from '@components/FileList';

const ACCEPTED_MIME_TYPES = ['image/heic', 'application/octet-stream'];
const ACCEPTED_EXTENSIONS = ['.heic', '.HEIC'];

/**
 * Convert HEIC images to JPG format using browser-based processing
 */
export const HeicToJpgConverter = () => {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  
  // Handle file drops for HEIC images
  const handleFileDrop = (acceptedFiles) => {
    // Filter for only HEIC files
    const heicFiles = acceptedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === 'heic' || file.type === 'image/heic';
    });
    
    setFiles(heicFiles);
    setConvertedFiles([]);
    setConversionProgress(0);
  };
  
  // Start the HEIC to JPG conversion process
  const handleConversion = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setConversionProgress(0);
    
    try {
      const results = await HeicConverter.convertFiles(files, (progress) => {
        setConversionProgress(Math.round(progress * 100));
      });
      
      setConvertedFiles(results.map(result => ({
        name: result.fileName.replace('.heic', '.jpg'),
        url: result.dataUrl,
        size: result.size
      })));
    } catch (error) {
      console.error('Error converting HEIC to JPG:', error);
      alert('Failed to convert some HEIC files to JPG format. Please try again.');
    } finally {
      setIsConverting(false);
      setConversionProgress(100);
    }
  };
  
  // Clear all files and reset the converter
  const handleClearFiles = () => {
    setFiles([]);
    setConvertedFiles([]);
    setConversionProgress(0);
  };
  
  return (
    <div className="heic-to-jpg-converter">
      <h1 className="text-2xl font-bold text-center mb-6">HEIC to JPG Converter</h1>
      
      <div className="mb-6">
        <p className="text-center text-gray-600">
          Convert your iPhone HEIC photos to standard JPG format. All processing happens in your browser - your photos never leave your device.
        </p>
      </div>
      
      <DropZone 
        onDrop={handleFileDrop}
        accept={ACCEPTED_MIME_TYPES}
        maxFiles={10}
        maxSize={20971520} // 20MB
      >
        <div className="text-center p-6">
          <p className="font-medium mb-2">Drop HEIC files here</p>
          <p className="text-sm text-gray-500">or click to select files</p>
          <p className="text-xs text-gray-400 mt-2">Maximum 10 files, 20MB each</p>
        </div>
      </DropZone>
      
      {files.length > 0 && (
        <>
          <div className="my-4">
            <h3 className="font-medium mb-2">Selected HEIC Files:</h3>
            <FileList files={files} />
          </div>
          
          <div className="flex gap-4 my-6">
            <Button 
              onClick={handleConversion} 
              disabled={isConverting}
              variant="primary"
              className="flex-1"
            >
              {isConverting ? `Converting... ${conversionProgress}%` : 'Convert to JPG'}
            </Button>
            
            <Button 
              onClick={handleClearFiles}
              variant="outline"
            >
              Clear Files
            </Button>
          </div>
        </>
      )}
      
      {convertedFiles.length > 0 && (
        <div className="my-6">
          <h3 className="font-medium mb-2">Your JPG files are ready:</h3>
          <FileList 
            files={convertedFiles} 
            downloadable={true}
            previewable={true}
          />
          
          <div className="mt-4">
            <Button 
              onClick={() => {
                // Download all converted files as a batch
                convertedFiles.forEach(file => {
                  const link = document.createElement('a');
                  link.href = file.url;
                  link.download = file.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                });
              }}
              variant="success"
              className="w-full"
            >
              Download All JPG Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};