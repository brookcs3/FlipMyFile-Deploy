/**
 * {{SourceFormat}} to {{TargetFormat}} Converter implementation
 * Converts {{SourceFormat}} files to {{TargetFormat}} format using FFmpeg
 */

import { BaseConverter } from '@flip/core/src/conversion/BaseConverter';
import { ConversionOptions, ConversionResult } from '@flip/core/src/conversion/types';
import { 
  initializeFFmpeg, 
  prepareInputFile, 
  readOutputFile, 
  cleanupFiles 
} from '@flip/core/src/utils/ffmpeg';

/**
 * Converter for {{SourceFormat}} to {{TargetFormat}} conversion
 */
export class {{SourceFormat}}To{{TargetFormat}}Converter extends BaseConverter {
  /**
   * Convert a {{SourceFormat}} file to {{TargetFormat}}
   * @param file The {{SourceFormat}} file to convert
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
      const inputFileName = `input_${Date.now()}.{{sourceLower}}`;
      const outputFileName = `output_${Date.now()}.{{targetLower}}`;
      const outputName = file.name.replace(/\.{{sourceLower}}$/i, '.{{targetLower}}');
      
      // Set quality (default: 90%)
      const quality = options.quality || 90;
      
      this.reportProgress(20, 'preparing', 'Loading file...');
      
      // Prepare the input file
      await prepareInputFile(ffmpeg, file, inputFileName);
      
      this.reportProgress(40, 'converting', 'Converting {{SourceFormat}} to {{TargetFormat}}...');
      
      // Run the FFmpeg conversion command
      await ffmpeg.exec([
        '-i', inputFileName,
        // {{FFmpegOptions}}
        outputFileName
      ]);
      
      this.reportProgress(80, 'finalizing', 'Processing output file...');
      
      // Read the output file
      const outputFile = await readOutputFile(
        ffmpeg, 
        outputFileName, 
        '{{outputMimeType}}',
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
      console.error('{{SourceFormat}} to {{TargetFormat}} conversion error:', error);
      return this.createErrorResult(error instanceof Error ? error : String(error));
    }
  }

  /**
   * Get supported input formats
   * @returns Array of supported MIME types
   */
  getSupportedInputFormats(): string[] {
    return [{{inputMimeTypes}}];
  }

  /**
   * Get output format
   * @returns The MIME type of the output format
   */
  getOutputFormat(): string {
    return '{{outputMimeType}}';
  }
}