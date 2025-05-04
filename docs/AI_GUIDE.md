# HEICFlip AI Guide

This document tracks the current state of the HEICFlip project and serves as a memory aid for AI assistants working on the project. It is continuously updated as development progresses.

## Project Status

**Current State**: Project organization and documentation structure implementation
**Last Updated**: April 30, 2025

## Recent Development History

1. **Project Organization System** (April 30, 2025)
   - Created project-wide numbering system for documentation (000-999)
   - Established clear naming conventions with [HEICFLIP-XXX] prefixes
   - Organized scripts and documentation into logical directories
   - Setup consistent README files in each directory
   - Added master navigation index for improved discoverability

2. **Backup and Restore System** (April 30, 2025)
   - Implemented comprehensive backup and restore scripts
   - Added UI/theme file preservation in backups
   - Created documentation on proper backup usage
   - Setup system for maintaining AI context between sessions

3. **Core Application Structure** (Earlier)
   - Implemented browser-based HEIC/JPG conversion
   - Created responsive UI with Tailwind CSS
   - Built file upload and conversion workflow
   - Added multiple file support

## Current Features

- Convert HEIC files to JPG format
- Convert JPG files to HEIC format
- Client-side processing for privacy
- Multiple file conversion support
- Responsive UI design

## Implementation Notes

- **File Processing**: All conversion happens client-side in Web Workers
- **Project Structure**: Files organized in client, server, shared directories
- **Supporting Files**: All non-essential files stored in meta/ directory
- **Organization System**: Documentation follows [HEICFLIP-XXX] naming convention

## Pending Tasks

- Complete script organization with consistent naming
- Finalize all directory READMEs
- Review UI for potential improvements
- Add comprehensive error handling
- Consider adding additional file formats

## Context Preservation System

The project includes multiple mechanisms for maintaining context across different AI sessions:

1. **AI_GUIDE.md**: This file (the one you're reading) tracks project status
2. **Backup System**: Saves/restores project state with `[HEICFLIP-910]_save_version.sh`
3. **Navigation Index**: Master index in `[HEICFLIP-000]_AI_NAVIGATION_INDEX.md`
4. **AI Instructions**: Guidelines in `[HEICFLIP-001]_AI_INSTRUCTIONS.md`

## Technical Specifications

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Framework**: Custom components built on shadcn/ui
- **State Management**: React hooks and context
- **File Processing**: Web Workers with ffmpeg.wasm
- **Server**: Minimal Express.js for static file serving

## Next Development Focus

The next phase of development will focus on:
1. UI improvements and theme refinements
2. Enhanced error handling
3. Performance optimizations
4. Additional file format support

## For AI Assistants

When working on this project:
1. Always update this file with significant changes
2. Follow the established organizational principles
3. Keep the root directory clean - only essential files
4. Use consistent naming conventions for all documentation
5. Create backups before major changes

---

Last updated: April 30, 2025