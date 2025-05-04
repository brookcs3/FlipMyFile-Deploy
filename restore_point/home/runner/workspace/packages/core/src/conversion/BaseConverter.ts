/**
 * Base abstract converter class
 * All specific converters should extend this class
 */

import { ConverterInterface, ConversionOptions, ConversionResult, ConversionProgress } from './types';

/**
 * Abstract base class for all converters
 * Provides common functionality and enforces the ConverterInterface
 */
export abstract class BaseConverter implements ConverterInterface {
  /**
   * Optional progress callback
   */
  protected progressCallback?: (progress: ConversionProgress) => void;

  /**
   * Constructor
   * @param progressCallback Optional callback to report conversion progress
   */
  constructor(progressCallback?: (progress: ConversionProgress) => void) {
    this.progressCallback = progressCallback;
  }

  /**
   * Convert a file
   * This is an abstract method that must be implemented by subclasses
   * @param file The file to convert
   * @param options Options for the conversion
   */
  abstract convert(file: File, options?: ConversionOptions): Promise<ConversionResult>;

  /**
   * Get supported input formats
   * This is an abstract method that must be implemented by subclasses
   */
  abstract getSupportedInputFormats(): string[];

  /**
   * Get the default output format
   * This is an abstract method that must be implemented by subclasses
   */
  abstract getOutputFormat(): string;

  /**
   * Report progress during conversion
   * @param percent Percentage complete (0-100)
   * @param stage Current conversion stage
   * @param message Optional message
   */
  protected reportProgress(
    percent: number, 
    stage: ConversionProgress['stage'] = 'converting',
    message?: string
  ): void {
    if (this.progressCallback) {
      this.progressCallback({
        percent,
        stage,
        message
      });
    }
  }

  /**
   * Validate that a file is of a supported type
   * @param file The file to validate
   * @returns true if supported, false otherwise
   */
  protected validateFileType(file: File): boolean {
    const supportedFormats = this.getSupportedInputFormats();
    return supportedFormats.includes(file.type);
  }

  /**
   * Create a standardized error result
   * @param error Error message or Error object
   * @returns ConversionResult with error information
   */
  protected createErrorResult(error: string | Error): ConversionResult {
    const errorMessage = typeof error === 'string' ? error : error.message;
    return {
      success: false,
      error: errorMessage
    };
  }

  /**
   * Create a standardized success result
   * @param outputFile The converted file
   * @param metadata Optional metadata about the conversion
   * @returns ConversionResult with success information
   */
  protected createSuccessResult(
    outputFile: File, 
    metadata?: ConversionResult['metadata']
  ): ConversionResult {
    return {
      success: true,
      outputFile,
      metadata
    };
  }
}