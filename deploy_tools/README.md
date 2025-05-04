# Deployment Guide for FlipMyFile

## Recent Changes Summary

1. **Rebranding from HEICFlip to FlipMyFile**
   - Updated page titles and headers
   - Updated meta descriptions

2. **Document Format Support**
   - Added UI for document format conversion (DOC, PDF, PPT, XLS, etc.)
   - Implemented custom icons for different file types
   - Added format selection buttons that appear after file upload

3. **Auto-detection improvements**
   - Enhanced format detection for document files
   - Updated format options based on file type

## Deployment Instructions

### Method 1: Using the deploy script

1. Pull the latest changes from Replit to your local repository
2. Navigate to the project directory
3. Run the deploy script:
   ```bash
   bash deploy_tools/deploy.sh
   ```

### Method 2: Manual deployment

1. Pull the latest changes from Replit to your local repository
2. Stage the changes:
   ```bash
   git add .
   ```
3. Commit the changes:
   ```bash
   git commit -m "Update FlipMyFile with document format support"
   ```
4. Push to GitHub:
   ```bash
   git push origin main
   ```

## Important Notes

- The document format conversion UI is implemented, but the actual conversion functionality is not yet active
- The format detection works automatically based on file extension
- Custom icons are implemented for different document formats

## Next Steps

- Implement actual document format conversion using FFmpeg or other appropriate libraries
- Add support for more document formats
- Create format-specific landing pages for SEO optimization
