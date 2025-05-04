# HEICFlip

A modern web application for converting between HEIC and JPG image formats with client-side processing for maximum privacy and security.

## Project Organization

This project follows strict organization principles to maintain clarity and discoverability:

1. **Clean Root Directory**: The root directory contains ONLY essential files required for the application to run. All supporting files, documentation, and tools are organized in their respective subdirectories.

2. **Numbered Documentation System**: All documentation files follow the `[HEICFLIP-XXX]` naming convention where XXX is a numeric identifier that indicates its category:
   - 000-099: Project organization and configuration
   - 100-199: Core documentation and overviews
   - 200-299: GitHub and version control
   - 300-399: Development guidelines
   - 500-599: Maintenance procedures
   - 700-799: Deployment guides
   - 900-999: Backup and restore system

3. **Directory Structure**:
   ```
   /
   ├── client/            # Frontend React application
   ├── server/            # Backend Express server
   ├── shared/            # Shared types and utilities
   ├── meta/              # All supporting files (not part of core app)
   │   ├── docs/          # Documentation organized by topic
   │   ├── tools/         # Utility scripts organized by purpose
   │   └── assets/        # Supporting assets not part of the app
   └── [Essential Files]  # Only configuration and entry points
   ```

4. **Self-Documenting Structure**: Each directory contains its own README explaining its purpose and organization.

## Getting Started

1. **Installation**:
   ```bash
   npm install
   ```

2. **Development**:
   ```bash
   npm run dev
   ```

3. **Build**:
   ```bash
   npm run build
   ```

## Key Features

- Convert HEIC images to JPG format
- Convert JPG images to HEIC format
- Browser-based processing for privacy
- Batch conversion support
- No file size limits beyond browser constraints
- Customizable output quality

## Project Management

### Backup and Restore

The project includes a comprehensive backup system to save and restore project states:

- To save the current state: `./meta/tools/backup/[HEICFLIP-910]_save_version.sh`
- To restore a saved state: `./meta/tools/backup/[HEICFLIP-911]_restore_version.sh`

### Documentation Navigation

Start with these key documents:

1. `[HEICFLIP-000]_AI_NAVIGATION_INDEX.md`: Master index of all documentation
2. `meta/docs/[HEICFLIP-100]_PROJECT_OVERVIEW.md`: Comprehensive project overview

## Development Guidelines

1. Follow the established file organization - keep the root directory clean
2. Use the appropriate numbering prefix for new documentation
3. Update relevant README files when adding new components
4. Create backups before major changes
5. Run tests before committing changes

## License

[MIT License](./LICENSE)

Last Updated: April 30, 2025