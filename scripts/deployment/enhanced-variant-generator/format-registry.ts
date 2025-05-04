/**
 * Format Registry
 * 
 * A registry of supported file formats and conversions using a loader/encoder architecture.
 */

import { attachVisualIdentityAttributes } from './visual-identity';

/**
 * Format information
 */
export interface Format {
  // Unique identifier for this format (lowercase, e.g. 'heic')
  key: string;
  // Full name (e.g. 'High Efficiency Image Container')
  name: string;
  // Common file extensions (.xxx)
  extensions: string[];
  // MIME type(s)
  mimeTypes: string[];
  // Typical uses or characteristics of this format
  description: string;
  // Reference to loader implementation
  loader?: any;
  // Reference to encoder implementation
  encoder?: any;
  // Additional format-specific properties
  [key: string]: any;
}

/**
 * Converter (from source format to target format)
 */
export interface Converter {
  // Unique identifier for this conversion (e.g. 'heicToJpg')
  key: string;
  // Source format key
  source: string;
  // Target format key
  target: string;
  // Display name for this conversion
  name: string;
  // Description of this conversion
  description: string;
  // Strategies for performing this conversion
  strategies: string[];
  // Default strategy
  defaultStrategy: string;
  // Additional converter properties
  [key: string]: any;
}

/**
 * Registry of all formats and conversion modes
 */
export interface Registry {
  formats: Record<string, Format>;
  conversions: Record<string, Converter>;
}

/**
 * The global registry of formats and conversions
 */
export const registry: Registry = {
  formats: {
    heic: {
      key: 'heic',
      name: 'HEIC',
      extensions: ['.heic', '.heif'],
      mimeTypes: ['image/heic', 'image/heif'],
      description: 'High Efficiency Image Container format developed by MPEG',
    },
    jpg: {
      key: 'jpg',
      name: 'JPEG',
      extensions: ['.jpg', '.jpeg'],
      mimeTypes: ['image/jpeg'],
      description: 'Joint Photographic Experts Group format, common for photos',
    },
    webp: {
      key: 'webp',
      name: 'WebP',
      extensions: ['.webp'],
      mimeTypes: ['image/webp'],
      description: 'Modern format developed by Google with good compression',
    },
    png: {
      key: 'png',
      name: 'PNG',
      extensions: ['.png'],
      mimeTypes: ['image/png'],
      description: 'Portable Network Graphics format with lossless compression',
    },
    avi: {
      key: 'avi',
      name: 'AVI',
      extensions: ['.avi'],
      mimeTypes: ['video/x-msvideo'],
      description: 'Audio Video Interleave format',
    },
    mp4: {
      key: 'mp4',
      name: 'MP4',
      extensions: ['.mp4'],
      mimeTypes: ['video/mp4'],
      description: 'MPEG-4 Part 14 video container format',
    },
  },
  conversions: {
    heicToJpg: {
      key: 'heicToJpg',
      source: 'heic',
      target: 'jpg',
      name: 'HEIC to JPEG Converter',
      description: 'Convert HEIC images to JPEG format',
      strategies: ['browser', 'worker'],
      defaultStrategy: 'browser',
    },
    heicToWebp: {
      key: 'heicToWebp',
      source: 'heic',
      target: 'webp',
      name: 'HEIC to WebP Converter',
      description: 'Convert HEIC images to WebP format',
      strategies: ['browser', 'worker'],
      defaultStrategy: 'browser',
    },
    aviToMp4: {
      key: 'aviToMp4',
      source: 'avi',
      target: 'mp4',
      name: 'AVI to MP4 Converter',
      description: 'Convert AVI videos to MP4 format',
      strategies: ['browser', 'worker'],
      defaultStrategy: 'worker',
    },
  },
};

/**
 * Create a new converter and add it to the registry
 */
export function createConverter(sourceFormat: string, targetFormat: string): string | undefined {
  // Check if formats exist
  if (!registry.formats[sourceFormat] || !registry.formats[targetFormat]) {
    console.error(`Cannot create converter: format not found (${sourceFormat} or ${targetFormat})`);
    return undefined;
  }
  
  // Generate a key and check if it already exists
  const key = `${sourceFormat}To${targetFormat.charAt(0).toUpperCase() + targetFormat.slice(1)}`;
  if (registry.conversions[key]) {
    console.log(`Converter ${key} already exists`);
    return key;
  }
  
  // Create a new converter
  const converter: Converter = {
    key,
    source: sourceFormat,
    target: targetFormat,
    name: `${registry.formats[sourceFormat].name} to ${registry.formats[targetFormat].name} Converter`,
    description: `Convert ${registry.formats[sourceFormat].name} to ${registry.formats[targetFormat].name} format`,
    strategies: ['browser', 'worker'],
    defaultStrategy: 'browser',
  };
  
  // Add to registry
  registry.conversions[key] = converter;
  console.log(`Created new converter: ${key}`);
  
  // Attach visual identity attributes
  attachVisualIdentityAttributes();
  
  return key;
}

/**
 * Get a loader for a specific format
 */
export function getLoader(format: string): any {
  const formatInfo = registry.formats[format];
  if (!formatInfo) {
    console.error(`Format not found: ${format}`);
    return null;
  }
  
  if (!formatInfo.loader) {
    console.error(`No loader available for format: ${format}`);
    return null;
  }
  
  return formatInfo.loader;
}

/**
 * Get an encoder for a specific format
 */
export function getEncoder(format: string): any {
  const formatInfo = registry.formats[format];
  if (!formatInfo) {
    console.error(`Format not found: ${format}`);
    return null;
  }
  
  if (!formatInfo.encoder) {
    console.error(`No encoder available for format: ${format}`);
    return null;
  }
  
  return formatInfo.encoder;
}

/**
 * Detect format from file extension
 */
export function detectFormatFromExtension(filename: string): string | null {
  const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  
  for (const formatKey in registry.formats) {
    const format = registry.formats[formatKey];
    if (format.extensions.includes(extension)) {
      return formatKey;
    }
  }
  
  return null;
}

/**
 * Initialize the registry by registering any default formats and conversions
 */
export function initializeRegistry(): void {
  // In a real implementation, this would dynamically load format plugins
  console.log('Initializing format registry...');
  
  // The registry is already populated with default formats and conversions
  
  // Attach visual identity attributes to all formats and conversions
  attachVisualIdentityAttributes();
}

// Initialize the registry
initializeRegistry();
