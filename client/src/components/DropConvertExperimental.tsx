import { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Cloud,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  X,
  FileImage,
  Download,
  Loader,
  Zap,
  Info,
  ArrowLeftRight,
  Upload,
  Eye,
  FileVideo,
  FileAudio,
  File
} from 'lucide-react';
import {
  formatFileSize,
  getBrowserCapabilities,
  readFileOptimized,
  createDownloadUrl
} from '@/lib/utils';
import { siteConfig } from '../config';
import { 
  imageFormats,
  videoFormats,
  audioFormats,
  getFileType,
  getCompatibleFormats
} from '@/utils/formatLists';

// Type for our accepted files
interface AcceptedFile extends File {
  path?: string;
  preview?: string; // For image preview URLs
}

// Additional type for conversion options
interface ConversionOptions {
  quality: 'low' | 'medium' | 'high';
  resize: 'none' | 'small' | 'medium' | 'large';
}

// The main component (without memo yet)
function DropConvertExperimentalInner() {
  const [isReady, setIsReady] = useState(true); // For MVP, set this to true directly
  const [files, setFiles] = useState<AcceptedFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [processingFile, setProcessingFile] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState<number>(0); // Store file count for later reference
  
  // New state for file type and format handling
  const [selectedFileType, setSelectedFileType] = useState<'image' | 'video' | 'audio' | 'unknown'>('image');
  const [selectedFormat, setSelectedFormat] = useState('jpg'); // New format selection
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // For file preview
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);
  
  // Conversion options
  const [conversionOptions, setConversionOptions] = useState<ConversionOptions>({
    quality: 'medium',
    resize: 'none'
  });
  
  // Mode selection: false = HEIC to JPG, true = JPG to HEIC
  // Use site configuration to determine default conversion mode
  const [jpgToAvif, setJpgToAvif] = useState(
    siteConfig.defaultConversionMode === 'jpgToHeic'
  );
  
  // Update available formats when file type changes
  useEffect(() => {
    const formats = getCompatibleFormats(selectedFileType);
    setAvailableFormats(formats);
    
    // Set the default format for the selected file type if there are available formats
    if (formats.length > 0 && (!selectedFormat || !formats.includes(selectedFormat.toUpperCase()))) {
      setSelectedFormat(formats[0].toLowerCase());
    }
  }, [selectedFileType]);
  
  // Generate file previews when files are selected
  useEffect(() => {
    if (files.length > 0) {
      // Detect the file type
      const detectedType = getFileType(files[0]);
      setSelectedFileType(detectedType);
      
      // Only create preview for the first file
      const firstFile = files[0];
      
      // Create preview based on file type
      if (firstFile.type.startsWith('image/')) {
        // For HEIC files we can't preview directly, so show a placeholder
        if (firstFile.name.toLowerCase().endsWith('.heic')) {
          setPreviewUrl(null);
        } else {
          // For JPG/PNG/other image formats we can create a preview
          const objectUrl = URL.createObjectURL(firstFile);
          setPreviewUrl(objectUrl);
          
          // Free memory when component unmounts
          return () => {
            URL.revokeObjectURL(objectUrl);
            setPreviewUrl(null);
          };
        }
      } else if (firstFile.type.startsWith('video/') || 
                firstFile.name.toLowerCase().match(/\.(mp4|webm|mov|gif)$/)) {
        // Create video preview
        const videoUrl = URL.createObjectURL(firstFile);
        setPreviewUrl(videoUrl);
        
        // Free memory when component unmounts
        return () => {
          URL.revokeObjectURL(videoUrl);
          setPreviewUrl(null);
        };
      } else {
        // No preview for other file types
        setPreviewUrl(null);
      }
    } else {
      // Clear preview when no files
      setPreviewUrl(null);
    }
  }, [files]);
  
  // Update the page title when conversion mode changes
  useEffect(() => {
    document.title = jpgToAvif
      ? `${siteConfig.siteName} - Convert JPG to HEIC in your browser`
      : `${siteConfig.siteName} - Convert HEIC to JPG in your browser`;
  }, [jpgToAvif]);
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Reset state if we had a download before
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    // Set status to 'ready' when files are added
    setFiles(acceptedFiles);
    setStatus('ready'); // This ensures the user needs to click convert
    setProgress(0);
    
    // Auto-detect file type from the first file
    if (acceptedFiles.length > 0) {
      const detectedType = getFileType(acceptedFiles[0]);
      setSelectedFileType(detectedType);
    }
  }, [downloadUrl]);
  
  // Create accept object for dropzone based on selected file type
  const getAcceptConfig = useMemo(() => {
    // Return accept object for all supported file types
    return {
      'image/*': Object.keys(imageFormats).map(format => `.${format}`),
      'video/*': Object.keys(videoFormats).map(format => `.${format}`),
      'audio/*': Object.keys(audioFormats).map(format => `.${format}`),
    };
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptConfig,
  });
  
  // Check browser capabilities for optimized processing
  const capabilities = useMemo(() => getBrowserCapabilities(), []);
  
  // Check if Web Workers are supported
  const hasWebWorker = useMemo(() => typeof Worker !== 'undefined', []);
  
  // Use Web Workers for faster conversion if available
  const workerRef = useRef<Worker | null>(null);
  
  // Initialize worker if supported
  useEffect(() => {
    // Cleanup any previous worker
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    
    // Only create worker if browser supports it
    if (hasWebWorker) {
      try {
        // Create worker in try-catch since it may fail in some environments
        const worker = new Worker(new URL('../workers/conversion.worker.ts', import.meta.url), {
          type: 'module'
        });
        
        // Set up message handler
        worker.onmessage = (event) => {
          // Get current jpgToAvif state for debugging
          const currentJpgToAvifState = jpgToAvif;
          
          const {
            status: workerStatus,
            progress: workerProgress,
            file,
            result,
            error,
            isZipFile,
            outputMimeType,
            extension,
            originalFileName,
            type: messageType,
            fileCount: workerFileCount,
            isSingleFile: workerIsSingleFile,
            isMultiFile: workerIsMultiFile
          } = event.data;
          
          if (workerStatus === 'progress') {
            setProgress(workerProgress);
            setProcessingFile(file);
          } else if (workerStatus === 'success') {
            setProgress(100);
            const url = URL.createObjectURL(result);
            setDownloadUrl(url);
            setStatus('success');
            
            // Store the original file count in a local variable
            const originalFiles = [...files];
            const originalCount = originalFiles.length;
            
            // Store information for the download button
            if (result instanceof Blob) {
              // Default to octet-stream to force download in all browsers
              let downloadMimeType = 'application/octet-stream';
              
              // Use ZIP MIME type for multiple files
              if (files.length > 1) {
                downloadMimeType = 'application/zip';
              } 
              
              // Create a new blob with the download MIME type
              const forceDownloadBlob = new Blob([result], { type: downloadMimeType });
              const forceUrl = URL.createObjectURL(forceDownloadBlob);
              setDownloadUrl(forceUrl);
              
              // FINAL DECISION LOGIC:
              // 1. Use worker's isZipFile flag as our primary indicator (most reliable)
              // 2. Fall back to worker's file count
              // 3. Fall back to our closure variable (less reliable but better than files.length)
              // 4. Last resort: fall back to fileCount state
              
              // First check if worker is explicitly marking this as a ZIP file
              let shouldUseZip = isZipFile === true;
              
              // If worker didn't specify, use worker's file count or flags
              if (shouldUseZip === undefined) {
                if (workerIsMultiFile === true) {
                  shouldUseZip = true;
                } else if (workerIsSingleFile === true) {
                  shouldUseZip = false;
                } else if (workerFileCount && workerFileCount > 1) {
                  shouldUseZip = true;
                } else if (workerFileCount === 1) {
                  shouldUseZip = false;
                }
              }
              
              // If still undefined, use our local tracking
              if (shouldUseZip === undefined) {
                shouldUseZip = originalCount > 1;
              }
              
              // Success state ready for the download button to use
            } else {
              setStatus('error');
              setErrorMessage('Conversion failed - invalid result');
            }
          } else if (workerStatus === 'error') {
            setStatus('error');
            setErrorMessage(error || 'Conversion failed');
          }
        };
        
        workerRef.current = worker;
      } catch (err) {
        console.warn('Web Workers not fully supported, falling back to main thread processing', err);
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [hasWebWorker, jpgToAvif]); // Add jpgToAvif to the dependency array so the worker updates when it changes
  
  // Optimized conversion function with fallbacks for different browsers
  const convertFiles = async () => {
    if (files.length === 0 || status === 'processing') return;
    
    // IMPORTANT: Save the file count immediately when we start conversion
    // This ensures we maintain the correct count throughout the entire process
    const totalFiles = files.length;
    setFileCount(totalFiles);
    
    setStatus('processing');
    setProgress(0);
    setProcessingFile(0);
    
    try {
      // Try to use Web Worker for processing
      if (workerRef.current) {
        // Always use correct type based on file count 
        // Single file = direct download, multiple files = ZIP
        const processingType = totalFiles === 1 ? 'single' : 'batch';
        
        // Send data to worker for processing
        // CRITICAL: Pass the totalFiles value to the worker as we know it's accurate at this point
        workerRef.current.postMessage({
          type: processingType,
          files,
          jpgToAvif, // Include conversion mode
          selectedFormat, // Add selected format to the message
          totalFiles, // Pass the actual file count to ensure worker has it
          isSingleFile: totalFiles === 1,
          conversionOptions // Pass quality and resize options
        });
        return; // Worker will handle the rest via onmessage
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Conversion failed: ' + (error instanceof Error ? error.message : String(error)));
    }
  };
  
  // Function to clear the current files
  const clearFiles = () => {
    setFiles([]);
    setStatus('idle');
    setProgress(0);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
    setErrorMessage('');
  };
  
  // Function to handle file type selection change
  const handleFileTypeChange = (type: string) => {
    setSelectedFileType(type as 'image' | 'video' | 'audio' | 'unknown');
  };
  
  // Function to handle format selection change
  const handleFormatChange = (format: string) => {
    setSelectedFormat(format.toLowerCase());
    
    // Update jpgToAvif based on format (legacy support)
    setJpgToAvif(format.toLowerCase() === 'heic');
  };
  
  // Function to handle quality selection
  const handleQualityChange = (quality: string) => {
    setConversionOptions(prev => ({
      ...prev,
      quality: quality as 'low' | 'medium' | 'high'
    }));
  };
  
  // Function to handle resize selection
  const handleResizeChange = (resize: string) => {
    setConversionOptions(prev => ({
      ...prev,
      resize: resize as 'none' | 'small' | 'medium' | 'large'
    }));
  };
  
  // Get the appropriate icon based on file type
  const getFileTypeIcon = () => {
    switch (selectedFileType) {
      case 'image':
        return <FileImage className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <FileVideo className="h-6 w-6 text-purple-500" />;
      case 'audio':
        return <FileAudio className="h-6 w-6 text-green-500" />;
      default:
        return <File className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Render the modern experimental UI
  return (
    <div className="flex flex-col space-y-4 w-full max-w-4xl mx-auto">
      {/* Main Card */}
      <Card className="w-full overflow-hidden border-2 border-gray-100 shadow-md">
        <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                {getFileTypeIcon()}
                Convert Media Files
              </CardTitle>
              <CardDescription className="mt-1">
                Transform images and videos between formats with privacy and speed
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-blue-200"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Cloud className="h-4 w-4" />
                Select Files
              </Button>
              {files.length > 0 && status === 'ready' && (
                <Button 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                  onClick={convertFiles}
                  disabled={files.length === 0 || status !== 'ready'}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Convert
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-100">
            {/* Left Side - File Preview and Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Media Files</h3>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-blue-200"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <Cloud className="h-4 w-4" />
                  Select Files
                </Button>
              </div>
              
              {/* File Preview Area */}
              <div
                className={`
                  border-2 rounded-lg overflow-hidden mb-4 min-h-[240px] flex items-center justify-center
                  ${status === 'error' ? 'border-red-300' : 'border-gray-200'}
                `}
              >
                {files.length === 0 ? (
                  <div className="w-full h-full min-h-[240px] p-6 text-center flex flex-col items-center justify-center bg-gray-50">
                    <FileImage className="mx-auto h-16 w-16 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No files selected</p>
                    <p className="text-gray-400 text-sm mt-1">Use the Select Files button to choose media for conversion</p>
                  </div>
                ) : previewUrl && !files[0]?.type?.startsWith('video/') && 
                   !files[0]?.name?.toLowerCase().match(/\.(mp4|webm|mov|gif)$/) ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 p-2">
                    <img 
                      src={previewUrl} 
                      alt="File preview" 
                      className="max-w-full max-h-[300px] object-contain"
                    />
                  </div>
                ) : files[0]?.type?.startsWith('video/') || 
                   files[0]?.name?.toLowerCase().match(/\.(mp4|webm|mov|gif)$/) ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-100">
                    <div className="p-4 bg-gray-800 rounded-lg mb-3">
                      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9ca3af" strokeWidth="1.5"/>
                        <path d="M15.9996 12L10.4996 15.4641V8.5359L15.9996 12Z" fill="#9ca3af"/>
                      </svg>
                    </div>
                    <p className="text-gray-600 font-medium">{files[0].name}</p>
                    <p className="text-gray-400 text-xs mt-2">Video preview disabled</p>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-50">
                    {getFileTypeIcon()}
                    <p className="text-gray-600 font-medium mt-3">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {files.map(f => f.name).join(', ')}
                    </p>
                    <p className="text-gray-400 text-xs mt-3">
                      Preview not available for this file type
                    </p>
                  </div>
                )}
              </div>
              
              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2 px-3">
                    <h4 className="text-sm font-medium text-gray-700">Selected Files</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFiles}
                      disabled={files.length === 0 || status !== 'ready'}
                      className="h-8 px-2"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                  {files.map((file, index) => (
                    <div key={`${file.name}-${index}`} className="flex items-center justify-between py-2 px-3 text-sm border-b last:border-0 border-gray-100">
                      <div className="flex items-center gap-2 truncate pr-2">
                        {selectedFileType === 'image' && <FileImage className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                        {selectedFileType === 'video' && <FileVideo className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                        {selectedFileType === 'audio' && <FileAudio className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                        {selectedFileType === 'unknown' && <File className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs flex-shrink-0">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Error message */}
              {status === 'error' && (
                <div className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
            
            {/* Right Side - Conversion Options & Preview */}
            <div className="p-6">
              <Tabs defaultValue="options" className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="options">Convert</TabsTrigger>
                  <TabsTrigger value="preview">Advanced Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="options" className="mt-0">
                  <div className="space-y-6">
                    {/* Select File Type */}
                    <div>
                      <h2 className="text-lg font-medium mb-4">File Type</h2>
                      <Select value={selectedFileType} onValueChange={handleFileTypeChange}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Detected automatically" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500 mt-2">File type is detected automatically from your selection</p>
                    </div>
                    
                    {/* Format Conversion */}
                    <div>
                      <h2 className="text-lg font-medium mb-4">Convert To</h2>
                      <Select value={selectedFormat} onValueChange={handleFormatChange}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select target format" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedFileType === 'image' && (
                            <SelectGroup>
                              <SelectLabel>Images</SelectLabel>
                              {Object.values(imageFormats).map(format => (
                                <SelectItem key={format.extension} value={format.extension}>
                                  {format.label} - {format.description}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          
                          {selectedFileType === 'video' && (
                            <SelectGroup>
                              <SelectLabel>Videos</SelectLabel>
                              {Object.values(videoFormats).map(format => (
                                <SelectItem key={format.extension} value={format.extension}>
                                  {format.label} - {format.description}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                          
                          {selectedFileType === 'audio' && (
                            <SelectGroup>
                              <SelectLabel>Audio</SelectLabel>
                              {Object.values(audioFormats).map(format => (
                                <SelectItem key={format.extension} value={format.extension}>
                                  {format.label} - {format.description}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-12">
                      {files.length > 0 && status === 'ready' && (
                        <Button 
                          size="lg"
                          className="flex-1 h-14 text-base bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                          onClick={convertFiles}
                        >
                          Convert
                        </Button>
                      )}
                      
                      {status === 'success' && (
                        <Button 
                          size="lg"
                          className="flex-1 h-14 text-base bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
                          onClick={() => {
                            if (downloadUrl) {
                              // Create proper file name based on input file and selected format
                              let fileName = files[0].name;
                              const baseFileName = fileName.substr(0, fileName.lastIndexOf('.'));
                              
                              // Use the selected format for the extension
                              fileName = baseFileName + '.' + selectedFormat;
                              
                              // Create and trigger download
                              const link = document.createElement('a');
                              link.href = downloadUrl;
                              link.download = fileName;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                        >
                          Download File
                        </Button>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preview" className="mt-0">
                  <div className="space-y-6">
                    {/* Quality Settings */}
                    <div>
                      <h2 className="text-lg font-medium mb-4">Quality</h2>
                      <Select value={conversionOptions.quality} onValueChange={handleQualityChange}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Resize */}
                    <div>
                      <h2 className="text-lg font-medium mb-4">Resize</h2>
                      <Select value={conversionOptions.resize} onValueChange={handleResizeChange}>
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select resize option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Resize</SelectItem>
                          <SelectItem value="small">Small (800px)</SelectItem>
                          <SelectItem value="medium">Medium (1200px)</SelectItem>
                          <SelectItem value="large">Large (1600px)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Future Settings */}
                    <div className="mt-8 border-t pt-6">
                      <h2 className="text-lg font-medium mb-3">Coming Soon</h2>
                      <div className="text-sm text-gray-500">
                        <p>More advanced options will be available in future updates:</p>
                        <ul className="list-disc pl-5 mt-3 space-y-2">
                          <li>Batch renaming options</li>
                          <li>Metadata preservation settings</li>
                          <li>Custom compression profiles</li>
                          <li>Format-specific optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        
        {/* Format specific pages notice */}
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 flex-shrink-0 mt-1">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Format-specific landing pages coming soon</h3>
              <p className="text-sm text-blue-700 mt-1">
                While this multi-format converter handles all your conversion needs, we're creating dedicated pages for each format pair that will be optimized for specific conversions (like HEIC to JPG, MP4 to WebM, etc.).
              </p>
            </div>
          </div>
        </div>
        
        <CardFooter className="flex flex-col md:flex-row gap-3 justify-between border-t bg-gray-50 p-4">
          {/* Processing progress */}
          {status === 'processing' && (
            <div className="w-full mb-3">
              <Progress value={progress} className="h-2 w-full mb-1" />
              <p className="text-xs text-gray-500 text-center">
                Processing file {processingFile + 1} of {files.length}...
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 w-full justify-center">
            {/* Processing status */}
            {status === 'processing' && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Converting your files...
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Memoize the component for better performance
const DropConvertExperimental = memo(DropConvertExperimentalInner);

export default DropConvertExperimental;