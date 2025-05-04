/**
 * AVI to MP4 converter component
 * 
 * This component handles the conversion of AVI videos to MP4 format using browser-based processing.
 * 
 * @author HEICFlip Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { AviConverter } from '@utils/converters/aviToMp4';
import { DropZone } from '@components/ui/DropZone';
import { Button } from '@components/ui/Button';
import { FileList } from '@components/FileList';

const ACCEPTED_MIME_TYPES = ['video/x-msvideo', 'video/avi'];
const ACCEPTED_EXTENSIONS = ['.avi', '.AVI'];

/**
 * Convert AVI videos to MP4 format using browser-based processing
 */
export const AviToMp4Converter = () => {
  const [files, setFiles] = useState([]);
  const [convertedFiles, setConvertedFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  
  // Handle file drops for AVI videos
  const handleFileDrop = (acceptedFiles) => {
    // Filter for only AVI files
    const aviFiles = acceptedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === 'avi' || file.type === 'video/x-msvideo';
    });
    
    setFiles(aviFiles);
    setConvertedFiles([]);
    setConversionProgress(0);
  };
  
  // Start the AVI to MP4 conversion process
  const handleConversion = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    setConversionProgress(0);
    
    try {
      const results = await AviConverter.convertFiles(files, (progress) => {
        setConversionProgress(Math.round(progress * 100));
      });
      
      setConvertedFiles(results.map(result => ({
        name: result.fileName.replace('.avi', '.mp4'),
        url: result.dataUrl,
        size: result.size
      })));
    } catch (error) {
      console.error('Error converting AVI to MP4:', error);
      alert('Failed to convert some AVI files to MP4 format. Please try again.');
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
    <div className="avi-to-mp4-converter">
      <h1 className="text-2xl font-bold text-center mb-6">AVI to MP4 Converter</h1>
      
      <div className="mb-6">
        <p className="text-center text-gray-600">
          Convert your AVI videos to standard MP4 format. All processing happens in your browser - your videos never leave your device.
        </p>
      </div>
      
      <DropZone 
        onDrop={handleFileDrop}
        accept={ACCEPTED_MIME_TYPES}
        maxFiles={10}
        maxSize={209715200} // 200MB
      >
        <div className="text-center p-6">
          <p className="font-medium mb-2">Drop AVI files here</p>
          <p className="text-sm text-gray-500">or click to select files</p>
          <p className="text-xs text-gray-400 mt-2">Maximum 10 files, 200MB each</p>
        </div>
      </DropZone>
      
      {files.length > 0 && (
        <>
          <div className="my-4">
            <h3 className="font-medium mb-2">Selected AVI Files:</h3>
            <FileList files={files} />
          </div>
          
          <div className="flex gap-4 my-6">
            <Button 
              onClick={handleConversion} 
              disabled={isConverting}
              variant="primary"
              className="flex-1"
            >
              {isConverting ? `Converting... ${conversionProgress}%` : 'Convert to MP4'}
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
          <h3 className="font-medium mb-2">Your MP4 files are ready:</h3>
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
              Download All MP4 Files
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};