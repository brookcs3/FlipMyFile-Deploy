import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS support
 * @param inputs - Array of class names
 * @returns Merged class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format file size to human-readable string
 * @param bytes - File size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Check browser capabilities for image processing
 * @returns Object with browser capability flags
 */
export function getBrowserCapabilities() {
  const isModernBrowser = typeof window !== 'undefined' && 'SharedArrayBuffer' in window;
  const isChrome = typeof navigator !== 'undefined' && navigator.userAgent.indexOf('Chrome') > -1;
  const isSafari = typeof navigator !== 'undefined' && 
    navigator.userAgent.indexOf('Safari') > -1 && 
    navigator.userAgent.indexOf('Chrome') === -1;
  
  return {
    isModernBrowser,
    isChrome,
    isSafari,
    hasSharedArrayBuffer: typeof SharedArrayBuffer === 'function',
    // Add other capability checks as needed
  };
}

/**
 * Read file with the most efficient method available
 * @param file - File object to read
 * @returns Promise with the file data
 */
export async function readFileOptimized(file: File): Promise<ArrayBuffer> {
  // Use a more efficient approach if available
  if ('arrayBuffer' in file) {
    return file.arrayBuffer();
  }
  
  // Fallback to FileReader
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Create download URL for file or blob
 * @param data - Blob or File object
 * @param filename - Optional filename for download
 * @returns Object with URL and cleanup function
 */
export function createDownloadUrl(data: Blob, filename?: string) {
  const url = URL.createObjectURL(data);
  
  return {
    url,
    download: filename || 'download',
    cleanup: () => {
      // Always revoke object URLs to prevent memory leaks
      URL.revokeObjectURL(url);
    },
  };
}