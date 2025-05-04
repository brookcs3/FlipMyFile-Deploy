# Image Conversion Process

This document outlines the standard pattern for handling image conversion in HEICFlip.

## Core Process Flow

1. **File Selection**:
   - User drops files or selects them via file browser
   - Files are filtered by accepted types (.heic, .jpg, .jpeg, .png)

2. **Conversion Mode**:
   - Based on `jpgToHeic` state (or equivalent variable for other conversions)
   - Determines input/output formats (HEIC→JPG or JPG→HEIC)

3. **Processing**:
   - Single files are processed directly
   - Multiple files are processed in batches and packaged as a ZIP
   - Web Workers are used when available for better performance

4. **Download**:
   - Single files download with correct extension
   - Multiple files download as ZIP
   - Auto-download triggers after successful conversion

## Code Structure

- **UI Component**: `DropConvert.tsx` handles the user interface
- **Worker Logic**: `conversion.worker.ts` performs the conversion
- **Utilities**: `utils.ts` provides helper functions for file operations

## Adding New Conversion Types

When adding a new conversion type:

1. Update `config.ts` to add the new conversion mode
2. Modify the worker to handle the new file types
3. Update the UI to show appropriate messaging
4. Add file type acceptance in the dropzone configuration

Follow the existing pattern in `DropConvert.tsx` and `conversion.worker.ts`.
