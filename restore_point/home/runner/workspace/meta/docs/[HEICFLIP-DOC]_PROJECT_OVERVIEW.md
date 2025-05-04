# [HEICFLIP-DOC] Project Overview

## Project Purpose

HEICFlip is a web-based application that converts images between different formats, with a primary focus on:

1. Converting HEIC images (from Apple devices) to JPG format
2. Converting JPG images to the more efficient HEIC format

All conversion happens entirely in the browser using client-side JavaScript, ensuring user privacy as files never leave the device.

## Core Functionality

- **File Upload**: Users drag-and-drop or select image files through the browser
- **Format Detection**: The system identifies file formats and prepares for conversion
- **In-Browser Conversion**: Using Web Workers and browser APIs to process files
- **Download**: Converted files are automatically downloaded with appropriate file extensions

## Technical Architecture

HEICFlip follows a client-centric architecture:

- **Frontend**: React application built with TypeScript
- **Processing**: Web Workers handle CPU-intensive conversion tasks
- **Backend**: Minimal Express.js server primarily serving static files
- **Configuration**: Supports multiple branded versions (HEICFlip, JPGFlip, AVIFlip)

## Key Features

- **Privacy-First Design**: No server uploads, all processing happens locally
- **Multi-File Support**: Convert individual files or batches
- **Progress Feedback**: Real-time conversion progress indicators
- **Responsive Design**: Works on desktop and mobile devices

## Code Organization

```
/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # React UI components
│   │   ├── workers/      # Web Worker conversion logic
│   │   └── config.ts     # Site configuration
├── server/               # Express backend server
├── shared/               # Shared code and types
├── meta/                 # Project support files
│   ├── docs/             # Documentation
│   └── backup-system/    # Backup and restore utilities
└── [config files]        # Configuration files
```

## Development Status

HEICFlip is an active project with ongoing improvements to both the user interface and conversion engine.

## Project Website

When deployed, the application will be accessible through multiple domains:
- heicflip.com - Primary site with HEIC to JPG conversion
- jpgflip.com - Alternate site focusing on JPG to HEIC conversion

## For AI Agents

If you're an AI assistant working on this project:

1. Key code files to examine:
   - `client/src/workers/conversion.worker.ts` - Core conversion logic
   - `client/src/components/DropConvert.tsx` - Main UI component
   - `client/src/config.ts` - Site configuration

2. Important documentation:
   - `meta/docs/architecture/` - System design details
   - `meta/docs/patterns/` - Coding patterns to follow

3. When adding features:
   - Ensure browser-based processing (no server-side conversion)
   - Maintain the existing responsive UI approach
   - Follow established error handling patterns