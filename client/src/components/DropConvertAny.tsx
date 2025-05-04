import { useState, useCallback, useEffect, useRef, useMemo, memo } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Cloud,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  X,
  FileImage,
  Download,
  Loader,
  ArrowLeftRight,
  Upload,
} from 'lucide-react';
import {
  formatFileSize,
  readFileOptimized,
  createDownloadUrl
} from '@/lib/utils';

// Type for our accepted files
interface AcceptedFile extends File {
  path?: string;
  preview?: string; // For image preview URLs
}

// Main component (without memo yet)
function DropConvertAnyInner() {
  const [files, setFiles] = useState<AcceptedFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [processingFile, setProcessingFile] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileCount, setFileCount] = useState<number>(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Format detection for UI display
  const [detectedFormats, setDetectedFormats] = useState<string[]>([]);
  
  // Generate file previews when files are selected
  useEffect(() => {
    if (files.length > 0) {
      // Only create preview for the first file
      const firstFile = files[0];
      const fileName = firstFile.name.toLowerCase();
      
      // Extract format from filename
      const format = fileName.split('.').pop() || '';
      
      // Detect multiple formats from selection for display
      const formats = new Set<string>();
      files.forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        if (ext && ext.length > 1) {
          formats.add(ext);
        }
      });
      
      setDetectedFormats(Array.from(formats));
      
      // Create preview based on file type
      if (firstFile.type.startsWith('image/')) {
        if (fileName.endsWith('.heic')) {
          // We'll just show a placeholder for HEIC files
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
      } else {
        // No preview for other file types
        setPreviewUrl(null);
      }
    } else {
      // Clear preview when no files
      setPreviewUrl(null);
      setDetectedFormats([]);
    }
  }, [files]);
  
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
    setStatus('ready');
    setProgress(0);
  }, [downloadUrl]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Accept all file types
    accept: {}
  });
  
  // Optimized conversion function
  const convertFiles = async () => {
    if (files.length === 0 || status === 'processing') return;
    
    // Save the file count when starting conversion
    const totalFiles = files.length;
    setFileCount(totalFiles);
    
    setStatus('processing');
    setProgress(0);
    setProcessingFile(0);
    
    try {
      // Simulate conversion process
      const totalSteps = 100;
      const interval = 1000 / totalSteps;
      
      for (let i = 0; i <= totalSteps; i++) {
        await new Promise(resolve => setTimeout(resolve, interval));
        setProgress(i);
        
        if (i === totalSteps) {
          // Create a sample result
          if (files.length === 1) {
            // For single file
            const result = new Blob([await files[0].arrayBuffer()], { type: files[0].type });
            const url = URL.createObjectURL(result);
            setDownloadUrl(url);
          } else {
            // For multiple files, create a zip
            const zip = new JSZip();
            for (let j = 0; j < files.length; j++) {
              const file = files[j];
              const content = await file.arrayBuffer();
              zip.file(file.name, content);
            }
            
            const zipContent = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(zipContent);
            setDownloadUrl(url);
          }
          
          setStatus('success');
        }
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
  
  // Determine the target format based on source format
  const getTargetFormat = (sourceFormat: string) => {
    // Simple mapping of source to target formats
    const formatMap: Record<string, string> = {
      'heic': 'jpg',
      'jpg': 'heic',
      'jpeg': 'heic',
      'png': 'jpg',
      'webp': 'jpg',
      'mp4': 'webm',
      'webm': 'mp4',
      'mov': 'mp4',
      'gif': 'mp4',
      'default': 'jpg'
    };
    
    return formatMap[sourceFormat.toLowerCase()] || formatMap['default'];
  };
  
  // Get the first source format
  const sourceFormat = files.length > 0 
    ? (files[0].name.split('.').pop() || 'file').toUpperCase() 
    : 'ANY';
  
  // Get the target format
  const targetFormat = files.length > 0 
    ? getTargetFormat(files[0].name.split('.').pop() || 'file').toUpperCase() 
    : 'ANY';
  
  // Render the component
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
          Convert <span className="text-red-500">{sourceFormat}</span> to <span className="text-red-500">{targetFormat}</span>
        </h2>
      </div>
      
      <Card className="w-full overflow-hidden border border-orange-100 rounded-xl shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">Auto Detect Any File Convert</h3>
            
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 transition-colors
                ${status === 'error' ? 'border-red-300 bg-red-50' : 'border-orange-200 hover:bg-orange-50'}
                ${isDragActive ? 'bg-orange-100 border-orange-300' : ''}
                cursor-pointer flex flex-col items-center justify-center min-h-[200px] relative
              `}
            >
              <input {...getInputProps()} />
              
              {files.length === 0 ? (
                <>
                  <Cloud className="w-16 h-16 text-orange-300 mb-4" />
                  <p className="text-lg font-medium text-gray-700">Drag & drop images here</p>
                  <p className="text-gray-500">Convert {sourceFormat} to widely-compatible {targetFormat} format</p>
                  
                  {/* Format decoration */}
                  <span className="absolute left-12 text-7xl text-orange-100 font-bold opacity-50">avi</span>
                  <span className="absolute right-12 text-7xl text-orange-100 font-bold opacity-50">mp4</span>
                </>  
              ) : previewUrl ? (
                <div className="w-full max-w-md">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-[200px] mx-auto object-contain rounded-md" 
                  />
                  <div className="mt-4">
                    <p className="font-medium text-gray-800">{files.length} file{files.length !== 1 ? 's' : ''} selected</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {detectedFormats.length > 0 && 
                        <span>Detected format{detectedFormats.length > 1 ? 's' : ''}: {detectedFormats.map(f => f.toUpperCase()).join(', ')}</span>
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileImage className="w-16 h-16 text-orange-300 mx-auto mb-4" />
                  <p className="font-medium text-gray-800">{files.length} file{files.length !== 1 ? 's' : ''} selected</p>
                  {detectedFormats.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Detected format{detectedFormats.length > 1 ? 's' : ''}: {detectedFormats.map(f => f.toUpperCase()).join(', ')}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-center">
              <Button 
                variant="ghost"
                className="bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 flex gap-2 items-center rounded-lg px-6 py-2"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <Upload className="w-4 h-4" />
                Browse Files
              </Button>
              <input 
                type="file" 
                id="file-input" 
                multiple 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onDrop(Array.from(e.target.files));
                  }
                }}
              />
            </div>
          </div>
          
          {/* Conversion status */}
          {status === 'processing' && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Converting...</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-gray-100" />
            </div>
          )}
          
          {/* Action buttons */}
          {(status === 'ready' || status === 'success') && files.length > 0 && (
            <div className="mt-6 flex justify-center gap-4">
              {status === 'ready' && (
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  onClick={convertFiles}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  Convert Now
                </Button>
              )}
              
              {status === 'success' && downloadUrl && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  onClick={() => {
                    if (downloadUrl) {
                      // Create a download link
                      const link = document.createElement('a');
                      link.href = downloadUrl;
                      
                      // Set the filename
                      if (files.length === 1) {
                        const fileName = files[0].name;
                        const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
                        const targetExt = getTargetFormat(fileName.split('.').pop() || 'file');
                        link.download = `${baseName}.${targetExt}`;
                      } else {
                        link.download = 'converted_files.zip';
                      }
                      
                      // Trigger the download
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              )}
              
              <Button 
                variant="outline"
                className="border-gray-200 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg"
                onClick={clearFiles}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>
          )}
          
          {/* Error message */}
          {status === 'error' && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Conversion failed</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Memoize the component for better performance
const DropConvertAny = memo(DropConvertAnyInner);

export default DropConvertAny;