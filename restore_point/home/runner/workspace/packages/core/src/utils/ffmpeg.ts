/**
 * FFmpeg utility for handling conversions
 * Provides helper functions for initializing and using FFmpeg
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let isLoading = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Initialize FFmpeg for use in the browser
 * This handles loading the WebAssembly files and preparing FFmpeg
 * 
 * @returns A promise that resolves when FFmpeg is ready to use
 */
export async function initializeFFmpeg(): Promise<FFmpeg> {
  // If FFmpeg is already loaded, return it
  if (ffmpeg !== null && ffmpeg.loaded) {
    return ffmpeg;
  }

  // If FFmpeg is currently loading, wait for it to finish
  if (isLoading && loadingPromise) {
    await loadingPromise;
    return ffmpeg!;
  }

  // Start loading FFmpeg
  isLoading = true;
  ffmpeg = new FFmpeg();

  // Create a promise that will resolve when loading is complete
  loadingPromise = (async () => {
    try {
      // Ensure we have the required COOP/COEP headers
      checkSecurityHeaders();

      // Load the FFmpeg core
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg!.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      console.log('FFmpeg loaded successfully');
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      // Reset state in case of error
      ffmpeg = null;
      throw error;
    } finally {
      isLoading = false;
      loadingPromise = null;
    }
  })();

  await loadingPromise;
  return ffmpeg!;
}

/**
 * Check if the required security headers are set for SharedArrayBuffer
 * FFmpeg requires SharedArrayBuffer, which requires specific headers
 */
function checkSecurityHeaders(): void {
  // In production, these headers should be set by the server
  if (typeof window !== 'undefined' && window.crossOriginIsolated === false) {
    console.warn(
      'Warning: Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy headers ' +
      'are not set. This may cause FFmpeg to fail in some browsers. ' +
      'These headers are required for SharedArrayBuffer support.'
    );
  }
}

/**
 * Create a Blob URL from a File or Blob
 * @param file The file to convert to a Blob URL
 * @returns A string Blob URL
 */
export async function createBlobURL(file: File | Blob): Promise<string> {
  return URL.createObjectURL(file);
}

/**
 * Convert a file to an FFmpeg-compatible format
 * @param ffmpeg The FFmpeg instance
 * @param file The file to prepare
 * @param inputFileName The name to give the file in FFmpeg
 * @returns A promise that resolves when the file is ready
 */
export async function prepareInputFile(
  ffmpeg: FFmpeg, 
  file: File, 
  inputFileName: string
): Promise<void> {
  const fileData = await fetchFile(file);
  await ffmpeg.writeFile(inputFileName, fileData);
}

/**
 * Read an output file from FFmpeg
 * @param ffmpeg The FFmpeg instance
 * @param outputFileName The name of the file in FFmpeg
 * @param mimeType The MIME type of the output file
 * @param outputName The name to give the output File
 * @returns A File object containing the output data
 */
export async function readOutputFile(
  ffmpeg: FFmpeg, 
  outputFileName: string, 
  mimeType: string,
  outputName: string
): Promise<File> {
  const data = await ffmpeg.readFile(outputFileName);
  
  // Convert Uint8Array to Blob
  const blob = new Blob([data], { type: mimeType });
  
  // Convert Blob to File
  return new File([blob], outputName, { type: mimeType });
}

/**
 * Clean up temporary files in FFmpeg
 * @param ffmpeg The FFmpeg instance
 * @param fileNames Array of file names to delete
 */
export async function cleanupFiles(
  ffmpeg: FFmpeg, 
  fileNames: string[]
): Promise<void> {
  for (const fileName of fileNames) {
    try {
      await ffmpeg.deleteFile(fileName);
    } catch (error) {
      console.warn(`Failed to delete file ${fileName}:`, error);
    }
  }
}