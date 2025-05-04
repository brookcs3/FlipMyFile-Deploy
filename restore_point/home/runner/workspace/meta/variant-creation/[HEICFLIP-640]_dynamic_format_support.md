# Dynamic Format Support in HEICFlip Monorepo

This document explains how the monorepo structure enables adding new conversion formats without modifying core code.

## Extensible Type System

The core package defines an extensible type system that allows each variant to register its own conversion modes:

```typescript
// Base conversion modes supported in core package
export type CoreConversionMode = 
  | 'heicToJpg'  // HEIC to JPG conversion
  | 'jpgToHeic'  // JPG to HEIC conversion 
  | 'aviToMp4'   // AVI to MP4 conversion
  | 'mp4ToAvi';  // MP4 to AVI conversion

// Extension point for additional conversion modes
export interface ExtendedConversionModes {}

// Combined type for all conversion modes
export type ConversionMode = CoreConversionMode | keyof ExtendedConversionModes;
```

## Dynamic Converter Registry

A factory pattern allows registering new converters at runtime:

```typescript
// Register a new converter in a variant package
import { registerConverter } from '@flip/core';
import { MKVToMP4Converter } from './MKVToMP4Converter';

// Register the converter for the specific conversion mode
registerConverter('mkvToMp4', MKVToMP4Converter);
```

## Template-Based Code Generation

The variant creation script uses templates to generate format-specific code:

1. **Format Configuration**: A central `formats.json` file defines all supported formats and conversion modes, including FFmpeg parameters
2. **Converter Template**: A template file defines the converter structure with placeholders for format-specific details
3. **Type Extension**: Each variant extends the core types to add its specific conversion mode

## Example: Creating an MKVFlip Variant

When creating a new variant like MKVFlip:

1. Run the variant creation script with specific parameters:
   ```
   node scripts/create-variant.js --name=mkvflip --mode=mkvToMp4 --color=#00A878
   ```

2. The script automatically:
   - Creates a directory structure for the variant
   - Generates an `MKVToMP4Converter.ts` class using the template
   - Sets up proper type extensions for TypeScript
   - Registers the converter with the core registry
   - Updates the variant's UI to show MKV-specific details

3. The variant works without any HEIC/JPG references in its code

## Adding New Formats

To add support for a new format (e.g., TIFF):

1. Update `scripts/converter-templates/formats.json` to add the format:
   ```json
   "tiff": {
     "name": "TIFF",
     "mimeTypes": ["image/tiff"],
     "extensions": [".tiff", ".tif"]
   }
   ```

2. Define new conversion modes:
   ```json
   "tiffToJpg": {
     "source": "tiff",
     "target": "jpg",
     "ffmpegOptions": ["-quality", "90"],
     "description": "Convert TIFF images to JPG format"
   }
   ```

3. Create a variant with the new mode:
   ```
   node scripts/create-variant.js --name=tiffflip --mode=tiffToJpg --color=#4B296B
   ```

## Format-Specific FFmpeg Parameters

Each conversion mode includes custom FFmpeg parameters optimized for that specific format:

```json
"mkvToMp4": {
  "source": "mkv",
  "target": "mp4",
  "ffmpegOptions": [
    "-c:v", "libx264",
    "-crf", "Math.round(30 - (quality * 0.2)).toString()",
    "-preset", "medium", 
    "-c:a", "aac",
    "-b:a", "128k"
  ],
  "description": "Convert MKV videos to MP4 format"
}
```

This ensures each converter uses the optimal settings for its specific format pair.

## Benefits

This architecture provides several advantages:

1. **No Cross-Contamination**: Each variant only contains code for its specific formats
2. **Easy Extension**: Adding new formats requires no changes to existing code
3. **Optimal Parameters**: Each conversion pair uses format-specific FFmpeg parameters
4. **Type Safety**: TypeScript ensures proper type checking across the monorepo
5. **Dynamic Registration**: The registry system handles format discovery at runtime

---

Last updated: April 30, 2025