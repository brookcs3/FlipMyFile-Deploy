/**
 * Converter Factory
 * Creates and manages converter instances
 */

import { ConversionMode, ConversionProgress, ConverterInterface } from './types';
import { HeicToJpgConverter } from './HeicToJpgConverter';
import { JpgToHeicConverter } from './JpgToHeicConverter';

/**
 * Type for converter constructors
 */
type ConverterConstructor = new (
  progressCallback?: (progress: ConversionProgress) => void
) => ConverterInterface;

/**
 * Registry for all converters
 * This allows dynamically registering new converters
 */
export class ConverterRegistry {
  private static converters: Map<ConversionMode, ConverterConstructor> = new Map();

  /**
   * Register a converter for a specific conversion mode
   * @param mode The conversion mode
   * @param converterClass The converter class constructor
   */
  static register(mode: ConversionMode, converterClass: ConverterConstructor): void {
    ConverterRegistry.converters.set(mode, converterClass);
  }

  /**
   * Get a converter constructor for a specific mode
   * @param mode The conversion mode
   * @returns The converter constructor, or undefined if not found
   */
  static getConverter(mode: ConversionMode): ConverterConstructor | undefined {
    return ConverterRegistry.converters.get(mode);
  }

  /**
   * Check if a converter is registered for a specific mode
   * @param mode The conversion mode
   * @returns True if a converter is registered, false otherwise
   */
  static hasConverter(mode: ConversionMode): boolean {
    return ConverterRegistry.converters.has(mode);
  }

  /**
   * Get all registered conversion modes
   * @returns Array of registered conversion modes
   */
  static getRegisteredModes(): ConversionMode[] {
    return Array.from(ConverterRegistry.converters.keys()) as ConversionMode[];
  }
}

/**
 * Factory for creating converters
 */
export class ConverterFactory {
  /**
   * Create a converter for a specific conversion mode
   * @param mode The conversion mode
   * @param progressCallback Optional callback for conversion progress
   * @returns A converter instance, or throws an error if no converter is registered for the mode
   */
  static createConverter(
    mode: ConversionMode,
    progressCallback?: (progress: ConversionProgress) => void
  ): ConverterInterface {
    const ConverterClass = ConverterRegistry.getConverter(mode);
    
    if (!ConverterClass) {
      throw new Error(`No converter registered for mode: ${mode}`);
    }

    return new ConverterClass(progressCallback);
  }

  /**
   * Check if a conversion mode is supported
   * @param mode The conversion mode to check
   * @returns True if the mode is supported, false otherwise
   */
  static supportsMode(mode: ConversionMode): boolean {
    return ConverterRegistry.hasConverter(mode);
  }

  /**
   * Get all supported conversion modes
   * @returns Array of supported conversion modes
   */
  static getSupportedModes(): ConversionMode[] {
    return ConverterRegistry.getRegisteredModes();
  }
}

// Register core converters
ConverterRegistry.register('heicToJpg', HeicToJpgConverter);
ConverterRegistry.register('jpgToHeic', JpgToHeicConverter);

// Export a convenience function for registering additional converters in variants
export function registerConverter(mode: ConversionMode, converterClass: ConverterConstructor): void {
  ConverterRegistry.register(mode, converterClass);
}