/**
 * Format Manager
 * 
 * Manages format loaders, encoders, and conversion operations.
 * This module provides a PIL-inspired open/save architecture for working with files.
 */

import { registry, detectFormatFromExtension } from './format-registry';
import type { Format, Converter } from './format-registry';

/**
 * Format Manager class for handling format registration and conversion operations
 */
export class FormatManager {
  /**
   * Load a file from a source and return its decoded representation
   * 
   * @param source - The source file or data to load (could be File, Blob, URL, etc.)
   * @param formatHint - Optional hint about the format (used if format can't be detected automatically)
   * @returns Promise resolving to the loaded data
   */
  async open(source: any, formatHint?: string): Promise<any> {
    // Detect format
    let formatKey: string | null = null;
    
    // If source is a file or has a name property, try to detect from extension
    if (source.name) {
      formatKey = detectFormatFromExtension(source.name);
    }
    
    // If still not detected, use the hint
    if (!formatKey && formatHint) {
      formatKey = formatHint;
    }
    
    // Ensure format is valid
    if (!formatKey || !registry.formats[formatKey]) {
      throw new Error(`Unsupported or undetected format: ${formatKey || 'unknown'}`);
    }
    
    const format = registry.formats[formatKey];
    
    // Check if loader is available
    if (!format.loader) {
      console.log(`No loader registered for ${formatKey}, attempting to use default loader`);
      // In real implementation, we would try to dynamically load the loader here
      throw new Error(`No loader available for format: ${formatKey}`);
    }
    
    // Call the loader
    try {
      return await format.loader.load(source);
    } catch (error) {
      console.error(`Error loading ${formatKey} file:`, error);
      throw error;
    }
  }
  
  /**
   * Save data to a specific format
   * 
   * @param data - The data to encode and save 
   * @param format - The target format to save as
   * @param options - Options for the encoding process
   * @returns Promise resolving to the encoded data
   */
  async save(data: any, format: string, options: any = {}): Promise<any> {
    // Ensure format is valid
    if (!registry.formats[format]) {
      throw new Error(`Unsupported format: ${format}`);
    }
    
    const formatInfo = registry.formats[format];
    
    // Check if encoder is available
    if (!formatInfo.encoder) {
      console.log(`No encoder registered for ${format}, attempting to use default encoder`);
      // In real implementation, we would try to dynamically load the encoder here
      throw new Error(`No encoder available for format: ${format}`);
    }
    
    // Call the encoder
    try {
      return await formatInfo.encoder.encode(data, options);
    } catch (error) {
      console.error(`Error saving to ${format} format:`, error);
      throw error;
    }
  }
  
  /**
   * Convert data from one format to another
   * 
   * @param source - The source file or data to convert
   * @param targetFormat - The target format to convert to
   * @param options - Options for the conversion process
   * @returns Promise resolving to the converted data
   */
  async convert(source: any, targetFormat: string, options: any = {}): Promise<any> {
    // Detect source format
    let sourceFormat: string | null = null;
    
    // If source is a file or has a name property, try to detect from extension
    if (source.name) {
      sourceFormat = detectFormatFromExtension(source.name);
    }
    
    if (!sourceFormat) {
      throw new Error('Could not detect source format');
    }
    
    // Find the appropriate conversion
    const conversionKey = Object.keys(registry.conversions).find(key => {
      const conversion = registry.conversions[key];
      return conversion.source === sourceFormat && conversion.target === targetFormat;
    });
    
    if (!conversionKey) {
      console.log(`No direct conversion from ${sourceFormat} to ${targetFormat} found.`);
      console.log('Using generic open/save pipeline...');
      
      // Use generic open/save pipeline
      try {
        // Load the source data
        const data = await this.open(source, sourceFormat);
        
        // Save to target format
        return await this.save(data, targetFormat, options);
      } catch (error) {
        console.error(`Error in conversion pipeline:`, error);
        throw error;
      }
    }
    
    // Use registered conversion
    const conversion = registry.conversions[conversionKey];
    console.log(`Using registered conversion: ${conversion.name}`);
    console.log(`Using strategy: ${options.strategy || conversion.defaultStrategy}`);
    
    // In a real implementation, we would execute the conversion based on the selected strategy
    // For this demo, we'll just simulate the process
    
    // Mimic conversion process
    try {
      // 1. Load the source data
      const data = await this.open(source, sourceFormat);
      
      // 2. Apply any transformation needed
      console.log(`Transforming data from ${sourceFormat} to ${targetFormat}...`);
      
      // 3. Save to target format
      return await this.save(data, targetFormat, options);
    } catch (error) {
      console.error(`Error in conversion process:`, error);
      throw error;
    }
  }
  
  /**
   * Register a loader for a format
   * 
   * @param formatKey - The format key to register the loader for
   * @param loader - The loader implementation
   */
  registerLoader(formatKey: string, loader: any): void {
    if (!registry.formats[formatKey]) {
      console.error(`Cannot register loader: format ${formatKey} not found in registry`);
      return;
    }
    
    registry.formats[formatKey].loader = loader;
    console.log(`Registered loader for format: ${formatKey}`);
  }
  
  /**
   * Register an encoder for a format
   * 
   * @param formatKey - The format key to register the encoder for
   * @param encoder - The encoder implementation
   */
  registerEncoder(formatKey: string, encoder: any): void {
    if (!registry.formats[formatKey]) {
      console.error(`Cannot register encoder: format ${formatKey} not found in registry`);
      return;
    }
    
    registry.formats[formatKey].encoder = encoder;
    console.log(`Registered encoder for format: ${formatKey}`);
  }
}

// Export a singleton instance of the format manager
export const formatManager = new FormatManager();
