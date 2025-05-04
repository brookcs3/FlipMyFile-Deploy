/**
 * Loader Interface
 * 
 * This defines the interface for all format loaders in the system.
 * A loader is responsible for decoding a file format into an internal representation.
 */

/**
 * File Loader interface
 * All format loaders must implement this interface
 */
export interface ILoader {
  /**
   * Supported formats this loader can handle
   */
  supportedFormats: string[];
  
  /**
   * Load and decode a file from the given source
   * 
   * @param source - The source file or data to load (File, Blob, URL, etc.)
   * @param options - Format-specific options for loading
   * @returns Promise resolving to the loaded and decoded data
   */
  load(source: any, options?: any): Promise<any>;
  
  /**
   * Check if this loader can handle the given source
   * 
   * @param source - The source to check
   * @returns Boolean indicating if this loader can handle the source
   */
  canLoad(source: any): boolean;
  
  /**
   * Get information about a file without fully loading it
   * 
   * @param source - The source to get information about
   * @returns Promise resolving to metadata about the source
   */
  getInfo?(source: any): Promise<any>;
}

/**
 * Base Loader abstract class
 * Provides some common functionality for all loaders
 */
export abstract class BaseLoader implements ILoader {
  /**
   * Supported formats this loader can handle
   */
  supportedFormats: string[] = [];
  
  /**
   * Load and decode a file from the given source
   * Must be implemented by concrete classes
   */
  abstract load(source: any, options?: any): Promise<any>;
  
  /**
   * Check if this loader can handle the given source
   * Default implementation checks file extension against supported formats
   */
  canLoad(source: any): boolean {
    // If source has a name property, check extension
    if (source.name) {
      const extension = source.name.substring(source.name.lastIndexOf('.')).toLowerCase();
      return this.supportedFormats.some(format => `.${format.toLowerCase()}` === extension);
    }
    
    // If source is a string URL, check extension
    if (typeof source === 'string') {
      const extension = source.substring(source.lastIndexOf('.')).toLowerCase();
      return this.supportedFormats.some(format => `.${format.toLowerCase()}` === extension);
    }
    
    // By default, assume we can't load it
    return false;
  }
  
  /**
   * Convert a source to a blob for processing
   * Utility method to handle different source types
   */
  protected async sourceToBlob(source: any): Promise<Blob> {
    // If source is already a blob, return it
    if (source instanceof Blob) {
      return source;
    }
    
    // If source is a File, it's also a Blob
    if (source instanceof File) {
      return source;
    }
    
    // If source is a URL string, fetch it
    if (typeof source === 'string') {
      try {
        const response = await fetch(source);
        return await response.blob();
      } catch (error) {
        throw new Error(`Failed to fetch URL: ${error}`);
      }
    }
    
    // If source is an ArrayBuffer or similar, convert to Blob
    if (source instanceof ArrayBuffer || 
        source instanceof Uint8Array ||
        source instanceof Uint16Array ||
        source instanceof Uint32Array) {
      return new Blob([source]);
    }
    
    throw new Error('Unsupported source type');
  }
}
