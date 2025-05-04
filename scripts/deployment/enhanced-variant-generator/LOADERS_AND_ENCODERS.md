# Loaders and Encoders System

## Overview

The Loaders and Encoders system is a Python PIL-inspired approach for handling various file formats with automatic format detection and conversion capabilities. This system is designed to be flexible, extensible, and maintainable.

## Core Concepts

### Format Registry

The Format Registry is the central component that manages all supported file formats and their associated metadata. It provides a lookup mechanism for:

- Identifying formats by file extension
- Automatic format detection from filenames
- Finding appropriate converters between formats

### Formats and Conversions

Formats are registered with minimal configuration, similar to how Python's PIL works:

```typescript
registerFormat('heic', {
  name: 'HEIC Image',
  ext: '.heic',
  mime: 'image/heic',
  variations: ['HEIC', 'heic', 'Heic'],
  description: 'High Efficiency Image Container'
});
```

Conversions between formats can be registered manually or created dynamically:

```typescript
// Manually register a conversion
registerConversion('heicToJpg', {
  name: 'HEIC to JPG',
  source: 'heic',
  target: 'jpg',
  namingVariations: [...],
  description: 'Convert HEIC images to JPG format'
});

// Or dynamically create a conversion
const conversionKey = createConverter('heic', 'jpg');
```

## Key Features

### Automatic Format Detection

The system can automatically detect the format of a file based on its extension:

```typescript
const formatKey = identifyFormat('vacation_photo.heic');
// Returns 'heic'
```

### Dynamic Conversion Creation

Conversions between formats can be created on demand:

```typescript
// Create a conversion from HEIC to WEBP
const heicToWebpKey = createConverter('heic', 'webp');
```

### Code Generation Utilities

Utilities for generating registration code make it easy to add new formats:

```typescript
const codeSnippet = generateFormatCode(
  'avif',
  'AVIF Image',
  '.avif',
  'image/avif',
  ['AVIF', 'avif', 'Avif']
);

// Returns TypeScript code to register the format
```

## Implementation Details

### Extension Lists

Format entries can have multiple extensions to support variations:

```typescript
registerFormat('jpg', {
  name: 'JPEG Image',
  ext: ['.jpg', '.jpeg'],  // Supports both extensions
  mime: 'image/jpeg',
  variations: ['JPG', 'jpg', 'JPEG', 'jpeg']
});
```

### MIME Type Lists

Formats can have multiple MIME types:

```typescript
registerFormat('jpg', {
  name: 'JPEG Image',
  ext: ['.jpg', '.jpeg'],
  mime: ['image/jpeg', 'image/jpg'],  // Multiple MIME types
  variations: ['JPG', 'jpg', 'JPEG', 'jpeg']
});
```

## Usage Example

A complete workflow for format identification and conversion:

```typescript
// Identify the format of a file
const sourceFormatKey = identifyFormat('photo.heic');

// Find or create a conversion to the target format
const targetFormatKey = 'jpg';
const conversionKey = createConverter(sourceFormatKey, targetFormatKey);

// In a real implementation:
// 1. Load the source file using the source format's handler
// 2. Process the image data
// 3. Save using the target format's handler
const outputFilename = 'photo.jpg';
```

## Extending The System

### Adding a New Format

To add support for a new file format:

1. Register the format with its metadata
2. Create converters to/from existing formats as needed

### Creating Custom Loaders/Encoders

In a full implementation:

1. Create the loader (decoder) module for your format
2. Create the encoder (saver) module for your format
3. Register the format with references to these modules

## Benefits Over the Previous Approach

- **Simplified Architecture**: Reduces complexity by focusing on formats rather than transformations
- **Automatic Detection**: Format detection works out of the box based on file extensions
- **Dynamic Conversions**: Conversions can be created on demand rather than pre-defined
- **Extensibility**: New formats can be added without modifying existing code
- **Maintainability**: Clearer separation of concerns between format definitions and processing logic
