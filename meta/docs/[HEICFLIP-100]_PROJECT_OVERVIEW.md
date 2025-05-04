# [HEICFLIP-100] Project Overview

## Introduction

HEICFlip is a web-based tool that enables users to convert image files between different formats, primarily focusing on HEIC (High-Efficiency Image Container) and JPG conversions. The application processes files entirely in the browser, maintaining privacy by ensuring that user files never leave their device.

## Purpose

Apple devices save photos in the HEIC format, which offers excellent compression while maintaining high image quality. However, HEIC files are not universally supported across all platforms and applications. HEICFlip solves this compatibility problem by providing a simple, browser-based converter that works across devices without requiring software installation.

## Key Features

- **HEIC to JPG Conversion**: Convert Apple's HEIC photos to widely compatible JPG format
- **JPG to HEIC Conversion**: Convert standard JPG images to space-efficient HEIC format
- **Batch Processing**: Convert multiple files simultaneously
- **Privacy-First Approach**: All processing happens locally in the browser
- **No Installation Required**: Works on any modern web browser
- **Simple Interface**: Drag-and-drop functionality with clear visual feedback

## Technical Approach

HEICFlip uses several modern web technologies:

- **Client-Side Processing**: Leverages Web Workers for non-blocking conversion
- **Modern JavaScript APIs**: Uses File API, Blob API, and Canvas API
- **React Framework**: Provides a responsive, component-based user interface
- **TypeScript**: Ensures type safety and better code organization

## Project Configuration

The application is designed to work with multiple domains and configurations:

- **HEICFlip.com**: Primary site focusing on HEIC to JPG conversion
- **JPGFlip.com**: Alternative configuration focusing on JPG to HEIC conversion
- **AVIFlip.com**: Redirects to HEICFlip (potential future expansion)

Each site configuration has its own branding, default conversion direction, and color scheme, all managed through a central configuration system.

## Related Documentation

For more detailed information, please refer to:

- [HEICFLIP-110] Architecture Overview - Detailed system design
- [HEICFLIP-200] Core Components - Key components and their functions
- [HEICFLIP-300] Development Guide - Guide for developers
- [HEICFLIP-400] User Guide - End-user instructions

## Project Status

HEICFlip is an actively maintained project with ongoing improvements to:

- User interface and experience
- Conversion quality and performance
- Browser compatibility
- Error handling and recovery

## Future Plans

The project roadmap includes:

- Additional format support (PNG, WebP, etc.)
- Enhanced compression options
- Metadata preservation controls
- Progressive Web App capabilities

Last Updated: April 30, 2025