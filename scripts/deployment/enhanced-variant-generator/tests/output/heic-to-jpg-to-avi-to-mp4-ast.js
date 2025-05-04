
/**
 * AVI to MP4 Converter Component
 * 
 * This component handles conversion from AVI photos to standard MP4 format
 * for better compatibility across devices.
 */

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { convertAviToMp4 } from '../utils/converters';

// Accepted MIME types
const ACCEPTED_MIME_TYPES = ['image/avi', 'video/avi'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 200MB

export const AviToMp4Converter = () => {
  const [files, setFiles] = useState([]);
  const [converting, setConverting] = useState(false);
  const [converted, setConverted] = useState([]);
  
  // Handle dropped files
  const onDrop = (acceptedFiles) => {
    // Filter for AVI files only
    const aviFiles = acceptedFiles.filter(file => {
      const extension = file.name.split('.').pop().toLowerCase();
      return extension === 'avi' || file.type === 'image/avi';
    });
    
    setFiles(aviFiles);
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
        files.map(file => convertAviToMp4(file))
      );
      
      setConverted(results);
    } catch (error) {
      console.error('AVI conversion error:', error);
    } finally {
      setConverting(false);
    }
  };
  
  return (
    <div className="avi-to-mp4-converter">
      <h2>Convert AVI to MP4</h2>
      
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop your AVI images here...</p>
        ) : (
          <p>Drop your AVI images here or click to select files</p>
        )}
        <small>Maximum size: 200MB each</small>
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
            {converting ? 'Converting...' : 'Convert to MP4'}
          </button>
        </div>
      )}
      
      {converted.length > 0 && (
        <div className="converted-files">
          <h3>Converted MP4 Files</h3>
          <ul>
            {converted.map((result, index) => (
              <li key={index}>
                <a 
                  href={result.url} 
                  download={`${result.filename}.mp4`}
                >
                  {result.filename}.mp4 ({(result.size / (1024 * 1024)).toFixed(2)}MB)
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
AviToMp4Converter.displayName = 'AviToMp4Converter';
AviToMp4Converter.description = 'Converts AVI images to MP4 format';
AviToMp4Converter.fileExtensions = ['.avi', '.AVI'];
AviToMp4Converter.targetExtension = '.mp4';
