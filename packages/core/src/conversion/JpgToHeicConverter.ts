/**
 * JPG to HEIC Converter implementation
 * Converts JPG files to HEIC format using FFmpeg
 */

import { BaseConverter } from './BaseConverter';
import { ConversionOptions, ConversionResult } from './types';
import { initializeFFmpeg, prepareInputFile, readOutputFile, cleanupFiles } from '../utils/ffmpeg';

/**
 * Converter for JPG to HEIC conversion
 */
export class JpgToHeicConverter extends BaseConverter {
  /**
   * Convert a JPG file to HEIC
   * @param file The JPG file to convert
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
      const inputFileName = `input_${Date.now()}.jpg`;
      const outputFileName = `output_${Date.now()}.heic`;
      const outputName = file.name.replace(/\.(jpg|jpeg)$/i, '.heic');
      
      // Set quality (default: 90%)
      const quality = options.quality || 90;
      
      this.reportProgress(20, 'preparing', 'Loading file...');
      
      // Prepare the input file
      await prepareInputFile(ffmpeg, file, inputFileName);
      
      this.reportProgress(40, 'converting', 'Converting JPG to HEIC...');
      
      // Run the FFmpeg conversion command
      // Note: HEIC encoding requires libx265 and is more complex than JPG encoding
      await ffmpeg.exec([
        '-i', inputFileName,
        '-c:v', 'libx265',
        '-crf', Math.round(50 - (quality * 0.4)).toString(), // Convert quality to CRF (lower is better)
        '-tag:v', 'hvc1', // Makes the HEIC file compatible with Apple devices
        '-f', 'hevc', // Force HEVC format
        outputFileName
      ]);
      
      this.reportProgress(80, 'finalizing', 'Processing output file...');
      
      // Read the output file
      const outputFile = await readOutputFile(
        ffmpeg, 
        outputFileName, 
        'image/heic',
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
      console.error('JPG to HEIC conversion error:', error);
      return this.createErrorResult(error instanceof Error ? error : String(error));
    }
  }

  /**
   * Get supported input formats
   * @returns Array of supported MIME types
   */
  getSupportedInputFormats(): string[] {
    return ['image/jpeg', 'image/jpg'];
  }

  /**
   * Get output format
   * @returns The MIME type of the output format
   */
  getOutputFormat(): string {
    return 'image/heic';
  }
}