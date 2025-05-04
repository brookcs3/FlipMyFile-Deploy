# HEICFlip Format Transformation System

## Overview

The Format Transformation System is a sophisticated architecture for working with different file formats, enabling loading, transforming, and saving files with a consistent interface. Inspired by the Python Imaging Library (PIL), this system allows for seamless conversion between formats while also supporting visual identity transformations for different variant sites.

## Key Features

1. **Format Detection**: Automatic detection of file formats based on extensions
2. **Open/Save Architecture**: PIL-inspired approach to loading and saving files
3. **Visual Identity**: Consistent theming system for different formats
4. **Dynamic Registration**: Runtime registration of new formats and converters
5. **Variant Generation**: Ability to transform between different format pairs
6. **Theming Transformation**: Automatic adjustment of visual identities when switching variants

## System Architecture

The system is organized into several layers:

### Registry Layer

- **Format Registry**: Centralized storage of all format definitions and converters
- **Visual Identity Registry**: Stores visual styling elements for each format and conversion
- **Format Manager**: Manages the registration and retrieval of formats and converters

### Loader Layer

- **BaseLoader**: Abstract class implementing common functionality for all loaders
- **ILoader Interface**: Defines the contract for format loaders
- **Format-Specific Loaders**: Concrete implementations for each supported format (HEIC, JPEG, etc.)

### Transformer Layer

- **Internal Representation**: Common data structure for representing loaded files
- **Color Transformation**: Utilities for adjusting visual identities
- **Format Adaptation**: Adjustments needed for specific format conversions

### Encoder Layer

- **BaseEncoder**: Abstract class implementing common functionality for all encoders
- **IEncoder Interface**: Defines the contract for format encoders
- **Format-Specific Encoders**: Concrete implementations for each supported format

### Output Layer

- **File Output**: Mechanisms for saving to files
- **Blob Output**: Utilities for creating blobs and handling downloads

## Format Registry

The Format Registry is the central hub for managing supported formats and conversions:

```typescript
export interface Format {
  key: string;         // Unique identifier (e.g., 'heic')
  name: string;        // Display name (e.g., 'HEIC')
  extensions: string[]; // File extensions (e.g., ['.heic', '.heif'])
  mimeTypes: string[]; // MIME types (e.g., ['image/heic'])
  description: string; // Human-readable description
  loader?: any;        // Reference to loader implementation
  encoder?: any;       // Reference to encoder implementation
}

export interface Converter {
  key: string;         // Unique identifier (e.g., 'heicToJpg')
  source: string;      // Source format key
  target: string;      // Target format key
  name: string;        // Display name
  description: string; // Human-readable description
  strategies: string[]; // Available conversion strategies
  defaultStrategy: string; // Default strategy to use
}
```

## Visual Identity System

Each format and conversion has an associated visual identity:

```typescript
export interface FormatVisualIdentity {
  formatKey: string;       // Format this identity belongs to
  primaryColor: string;    // Primary brand color
  secondaryColor: string;  // Secondary/darker variation
  accentColor: string;     // Accent/lighter variation
  cssPrefix: string;       // CSS class prefix for styling
  dataAttribute: string;   // Data attribute for format-specific elements
  iconShape: 'circle' | 'square' | 'rounded' | 'diamond'; // Icon shape
}

export interface ConversionVisualIdentity {
  conversionKey: string;   // Conversion this identity belongs to
  primaryColor: string;    // Primary brand color
  secondaryColor: string;  // Secondary/darker variation
  accentColor: string;     // Accent/lighter variation
  cssPrefix: string;       // CSS class prefix for styling
  dataAttribute: string;   // Data attribute for conversion-specific elements
  gradient: string;        // Gradient using source and target colors
}
```

## Loader and Encoder System

The system uses a loader/encoder architecture for handling different formats:

### Loaders

Loaders are responsible for decoding file formats into an internal representation:

```typescript
export interface ILoader {
  supportedFormats: string[];
  load(source: any, options?: any): Promise<any>;
  canLoad(source: any): boolean;
  getInfo?(source: any): Promise<any>;
}
```

### Encoders

Encoders are responsible for encoding the internal representation into a specific file format:

```typescript
export interface IEncoder {
  supportedFormats: string[];
  encode(data: any, options?: any): Promise<any>;
  defaultOptions: Record<string, any>;
}
```

## Format Manager

The Format Manager provides a high-level API for working with formats and conversions:

```typescript
export class FormatManager {
  // Load a file from a source
  async open(source: any, formatHint?: string): Promise<any>;
  
  // Save data to a specific format
  async save(data: any, format: string, options?: any): Promise<any>;
  
  // Convert data from one format to another
  async convert(source: any, targetFormat: string, options?: any): Promise<any>;
  
  // Register a loader for a format
  registerLoader(formatKey: string, loader: any): void;
  
  // Register an encoder for a format
  registerEncoder(formatKey: string, encoder: any): void;
}
```

## Variant Generation

The Variant Generation system allows for transforming sites between different format pairs:

```typescript
interface TransformationConfig {
  sourceSourceFormat: string;  // Current source format (e.g., 'heic')
  sourceTargetFormat: string;  // Current target format (e.g., 'jpg')
  targetSourceFormat: string;  // New source format (e.g., 'png')
  targetTargetFormat: string;  // New target format (e.g., 'webp')
  inputDir: string;           // Directory containing the original site
  outputDir: string;          // Directory to write the transformed site
}

export async function transformSite(config: TransformationConfig): Promise<void>;
```

This process includes:

1. Identifying color transformations between formats
2. Updating CSS variables and selectors
3. Replacing format names in text content
4. Updating visual assets to match the new formats

## Usage Example

```typescript
// Detect format from file extension
const format = detectFormatFromExtension('image.heic'); // Returns 'heic'

// Load a HEIC file
const imageData = await formatManager.open('image.heic');

// Save as JPEG
const jpegBlob = await formatManager.save(imageData, 'jpg', { quality: 90 });

// Direct conversion
const jpegBlob = await formatManager.convert('image.heic', 'jpg', { quality: 90 });

// Transform a site from HEIC→JPG to WebP→PNG
const config = {
  sourceSourceFormat: 'heic',
  sourceTargetFormat: 'jpg',
  targetSourceFormat: 'webp',
  targetTargetFormat: 'png',
  inputDir: './original-site',
  outputDir: './transformed-site'
};
await transformSite(config);
```

## Visual Identity Transformation

The system enables transformation between different format pairs, including visual identity changes:

- **HEIC** (Orange) ↔ **JPG** (Blue)
- **HEIC** (Orange) ↔ **WebP** (Purple)
- **WebP** (Purple) ↔ **PNG** (Green)
- **AVI** (Red) ↔ **MP4** (Teal)

This allows for generating different variants of the same site with consistent branding for each format pair.

## Extending the System

To add support for a new format:

1. Add the format definition to the registry
2. Create a loader implementation
3. Create an encoder implementation
4. Add visual identity for the format
5. Register with the format manager

```typescript
// Add format to registry
registry.formats.avif = {
  key: 'avif',
  name: 'AVIF',
  extensions: ['.avif'],
  mimeTypes: ['image/avif'],
  description: 'AV1 Image File Format with excellent compression',
};

// Create and register loader
const avifLoader = new AvifLoader();
formatManager.registerLoader('avif', avifLoader);

// Create and register encoder
const avifEncoder = new AvifEncoder();
formatManager.registerEncoder('avif', avifEncoder);

// Add visual identity
visualIdentityRegistry.formats.avif = {
  formatKey: 'avif',
  primaryColor: '#6A5ACD', // Slate blue
  secondaryColor: '#5A4ABD',
  accentColor: '#8A7AED',
  cssPrefix: 'avif',
  dataAttribute: 'data-format-avif',
  iconShape: 'diamond',
};
```

## Conclusion

The Format Transformation System provides a robust and extensible framework for working with different file formats and creating variant sites. By using a consistent loader/encoder architecture and a well-defined visual identity system, it enables seamless transformation between different format pairs while maintaining consistent branding and styling.