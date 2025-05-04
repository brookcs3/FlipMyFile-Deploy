# FormatFlip GitHub Repository Summary

## Overview

This document summarizes the FormatFlip GitHub repository structure, components, and integration strategy. FormatFlip is a web application that allows users to convert between multiple file formats, including images, videos, and audio files, using FFmpeg WASM for client-side processing.

## Repository Structure

```
FormatFlip/
├── .github/              # GitHub-specific files
│   ├── workflows/        # CI/CD workflows
│   │   └── ci.yml        # Continuous integration workflow
│   └── PULL_REQUEST_TEMPLATE.md  # PR template
├── client/               # Frontend code
│   ├── public/           # Static assets
│   └── src/              # React source files
├── server/               # Backend API code
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Storage interface
│   └── vite.ts           # Vite configuration
├── shared/               # Shared code between client and server
│   └── schema.ts         # Database schema and types
├── scripts/              # Utility scripts
├── packages/             # Monorepo packages
├── meta/                 # Documentation and metadata
├── format-transformation-demo.html  # Format conversion demo
├── push_to_formatflip.sh  # GitHub API push script
├── push_to_github.sh     # Enhanced GitHub push script
├── .gitignore           # Git ignore file
├── drizzle.config.ts    # Drizzle ORM configuration
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vercel.json          # Vercel deployment configuration
└── vite.config.ts       # Vite build configuration
```

## Key Components

### Database Schema

The application uses a PostgreSQL database with the following main entities:

- **Users**: Store user information and authentication details
- **Conversions**: Track file conversion history and metadata
- **ConversionSettings**: Store user preferences for conversions

### GitHub Integration

Due to Replit's restrictions on direct Git operations, we've implemented a custom GitHub API-based approach for repository management:

1. **Creation Scripts**: Create necessary directory structure
2. **Push Scripts**: Upload individual files with proper version tracking
3. **Update Scripts**: Handle updating existing files with proper SHA tracking

### CI/CD Workflow

The repository includes a GitHub Actions workflow that:

1. Builds the application
2. Runs linting checks
3. Executes tests

### Deployment

The application is configured for deployment on Vercel with:

- Node.js server for the backend API
- Static serving for frontend assets
- Environment variable configuration

## Development Workflow

1. Make changes in the Replit environment
2. Run tests and verify locally
3. Use `push_to_github.sh` to upload changed files
4. GitHub Actions validates the changes
5. Vercel automatically deploys from the main branch

## Future Improvements

- Implement more comprehensive test suite
- Add database migration scripts
- Enhance CI pipeline with additional checks
- Configure multi-environment deployments
