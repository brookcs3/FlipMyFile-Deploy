/**
 * HEIC to JPG Converter implementation
 * Converts HEIC/HEIF files to JPG format using FFmpeg
 */

import { BaseConverter } from './BaseConverter';
import { ConversionOptions, ConversionResult } from './types';
import { initializeFFmpeg, prepareInputFile, readOutputFile, cleanupFiles } from '../utils/ffmpeg';

/**
 * Converter for HEIC/HEIF to JPG conversion
 */
export class HeicToJpgConverter extends BaseConverter {
  /**
   * Convert a HEIC/HEIF file to JPG
   * @param file The HEIC/HEIF file to convert
   * @param options Conversion options
   * @returns Promise resolving to the conversion result
   */
  async convert(file: File, options: ConversionOptions = {}): Promise<ConversionResult> {
    // Start timing for performance metrics
    const startTime = performance.now();
    
    // Validate input file type
    if (!this.validateFileType(file)) {
      return this.createErrorResult(
        `Unsupported file type: ${file.type}. Supported types: ${this.getSupportedInputFormats().join(', ')}`
      );
    }

    try {
      this.reportProgress(0, 'preparing', 'Initializing converter...');

      // Initialize FFmpeg
      const ffmpeg = await initializeFFmpeg();
      
      // Generate input and output file names
      const inputFileName = `input_${Date.now()}.heic`;
      const outputFileName = `output_${Date.now()}.jpg`;
      const outputName = file.name.replace(/\.heic$/i, '.jpg');
      
      // Set quality (default: 90%)
      const quality = options.quality || 90;
      
      this.reportProgress(20, 'preparing', 'Loading file...');
      
      // Prepare the input file
      await prepareInputFile(ffmpeg, file, inputFileName);
      
      this.reportProgress(40, 'converting', 'Converting HEIC to JPG...');
      
      // Run the FFmpeg conversion command
      await ffmpeg.exec([
        '-i', inputFileName,
        '-q:v', Math.round(Math.min(Math.max(quality / 10, 1), 10)).toString(),
        outputFileName
      ]);
      
      this.reportProgress(80, 'finalizing', 'Processing output file...');
      
      // Read the output file
      const outputFile = await readOutputFile(
        ffmpeg, 
        outputFileName, 
        'image/jpeg',
        outputName
      );
      
      // Calculate performance metrics
      const endTime = performance.now();
      const conversionTime = endTime - startTime;
      
      this.reportProgress(100, 'finalizing', 'Conversion complete!');
      
      // Clean up temporary files
      await cleanupFiles(ffmpeg, [inputFileName, outputFileName]);
      
      // Return success result with metadata
      return this.createSuccessResult(outputFile, {
        conversionTime,
        originalSize: file.size,
        outputSize: outputFile.size
      });
    } catch (error) {
      console.error('HEIC to JPG conversion error:', error);
      return this.createErrorResult(error instanceof Error ? error : String(error));
    }
  }

  /**
   * Get supported input formats
   * @returns Array of supported MIME types
   */
  getSupportedInputFormats(): string[] {
    return ['image/heic', 'image/heif'];
  }

  /**
   * Get output format
   * @returns The MIME type of the output format
   */
  getOutputFormat(): string {
    return 'image/jpeg';
  }
}