/**
 * Types for the conversion module
 * These types define the interfaces for all conversion operations
 */

/**
 * Base conversion modes supported in core package
 */
export type CoreConversionMode = 
  | 'heicToJpg'  // HEIC to JPG conversion
  | 'jpgToHeic'  // JPG to HEIC conversion 
  | 'aviToMp4'   // AVI to MP4 conversion
  | 'mp4ToAvi';  // MP4 to AVI conversion

/**
 * Extension point for additional conversion modes
 * This allows variant packages to add their own modes
 * Example usage in a variant package:
 * 
 * declare module '@heicflip/core' {
 *   export interface ExtendedConversionModes {
 *     pngToWebp: 'pngToWebp';
 *     webpToPng: 'webpToPng';
 *   }
 * }
 */
export interface ExtendedConversionModes {}

/**
 * Combined type for all conversion modes
 * Will automatically include any modes added to ExtendedConversionModes
 */
export type ConversionMode = CoreConversionMode | keyof ExtendedConversionModes;

/**
 * Options for conversions
 */
export interface ConversionOptions {
  /** Quality level for the output (0-100) */
  quality?: number;
  
  /** Whether to preserve metadata from the original file */
  preserveMetadata?: boolean;
  
  /** Specific output format, if different from the default for the conversion mode */
  outputFormat?: string;
  
  /** Maximum dimension (width or height) for the output */
  maxDimension?: number;
}

/**
 * Result of a conversion operation
 */
export interface ConversionResult {
  /** Whether the conversion was successful */
  success: boolean;
  
  /** The converted file, if successful */
  outputFile?: File;
  
  /** Error message if conversion failed */
  error?: string;
  
  /** Additional metadata about the conversion */
  metadata?: {
    /** Time taken for conversion in milliseconds */
    conversionTime?: number;
    
    /** Original file size in bytes */
    originalSize?: number;
    
    /** Output file size in bytes */
    outputSize?: number;
  };
}

/**
 * Interface for all converters
 */
export interface ConverterInterface {
  /**
   * Convert a file according to the converter's functionality
   * @param file The file to convert
   * @param options Options for the conversion
   * @returns A promise that resolves to the conversion result
   */
  convert(file: File, options?: ConversionOptions): Promise<ConversionResult>;
  
  /**
   * Get a list of input formats supported by this converter
   * @returns Array of supported input formats (e.g., ['image/heic', 'image/heif'])
   */
  getSupportedInputFormats(): string[];
  
  /**
   * Get the default output format for this converter
   * @returns The default output format MIME type
   */
  getOutputFormat(): string;
}

/**
 * Progress information during conversion
 */
export interface ConversionProgress {
  /** Percentage of completion (0-100) */
  percent: number;
  
  /** Current stage of conversion */
  stage: 'preparing' | 'converting' | 'finalizing';
  
  /** Optional message about current operation */
  message?: string;
}