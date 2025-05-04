/**
 * Encoder Interface
 * 
 * This defines the interface for all format encoders in the system.
 * An encoder is responsible for encoding data into a specific file format.
 */

/**
 * File Encoder interface
 * All format encoders must implement this interface
 */
export interface IEncoder {
  /**
   * Supported formats this encoder can output
   */
  supportedFormats: string[];
  
  /**
   * Encode data to the desired format
   * 
   * @param data - The data to encode (internal representation)
   * @param options - Format-specific options for encoding
   * @returns Promise resolving to the encoded data (typically Blob or Buffer)
   */
  encode(data: any, options?: any): Promise<any>;
  
  /**
   * Default encoding options for this encoder
   */
  defaultOptions: Record<string, any>;
}

/**
 * Base Encoder abstract class
 * Provides some common functionality for all encoders
 */
export abstract class BaseEncoder implements IEncoder {
  /**
   * Supported formats this encoder can output
   */
  supportedFormats: string[] = [];
  
  /**
   * Default encoding options for this encoder
   */
  defaultOptions: Record<string, any> = {};
  
  /**
   * Encode data to the desired format
   * Must be implemented by concrete classes
   */
  abstract encode(data: any, options?: any): Promise<any>;
  
  /**
   * Merge provided options with default options
   * 
   * @param options - User-provided options
   * @returns Merged options
   */
  protected mergeOptions(options?: any): Record<string, any> {
    return { ...this.defaultOptions, ...(options || {}) };
  }
  
  /**
   * Create a Blob from data with the correct MIME type
   * 
   * @param data - The data to convert to a Blob
   * @param mimeType - The MIME type for the Blob
   * @returns A Blob containing the data
   */
  protected createBlob(data: any, mimeType: string): Blob {
    // If data is already a Blob, set the correct type
    if (data instanceof Blob) {
      return new Blob([data], { type: mimeType });
    }
    
    // If data is an ArrayBuffer or similar, convert to Blob
    if (data instanceof ArrayBuffer || 
        data instanceof Uint8Array ||
        data instanceof Uint16Array ||
        data instanceof Uint32Array) {
      return new Blob([data], { type: mimeType });
    }
    
    // If data is a string, convert to Blob
    if (typeof data === 'string') {
      return new Blob([data], { type: mimeType });
    }
    
    throw new Error('Unsupported data type for Blob creation');
  }
}
