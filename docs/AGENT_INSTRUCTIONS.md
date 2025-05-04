# Agent Instructions for HEICFlip Project

This document contains instructions and guidelines for AI agents working on this project. Reference this file at the beginning of new conversations to ensure consistent behavior.

## Backup and Restore

1. **When asked to save the current version**:
   - Run `./save_current_version.sh`
   - This saves all project files to the `restore_point/` directory

2. **When asked to restore from the saved version**:
   - Run `./restore_from_save.sh`
   - This restores all files from the `restore_point/` directory

## Project Structure

This project is a web application for converting between image formats (primarily HEIC and JPG). Key components:

- `client/src/config.ts`: Configuration for different conversion modes
- `client/src/workers/conversion.worker.ts`: Core conversion logic
- `client/src/components/DropConvert.tsx`: Main UI component
- `server/`: Backend Express server
- `shared/`: Shared types and schemas

## Regular Tasks

1. **When making code changes**:
   - Always save a backup before significant changes
   - Test changes by restarting the application with `restart_workflow`
   - Verify the application works correctly using the feedback tool

2. **Before implementing new features**:
   - Ask for confirmation before making major changes
   - Create a backup first
   - Explain what files will be modified

3. **After implementing changes**:
   - Test thoroughly
   - Report progress with a summary of changes made

## Common Commands

- Start the application: `restart_workflow` with name "Start application"
- View project files: `str_replace_editor` with command "view"
- Search code: `search_filesystem` with appropriate query
- Create a backup: `./save_current_version.sh`
- Restore from backup: `./restore_from_save.sh`

## Special Instructions

1. Always use the packager_tool for installing dependencies, not bash commands
2. Respect the project architecture and follow existing patterns
3. Update documentation when making significant changes
4. Use 0.0.0.0 for port bindings instead of localhost

Last updated: April 30, 2025