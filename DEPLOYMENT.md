# FlipMyFile Deployment Guide

This guide provides step-by-step instructions for deploying FlipMyFile to Vercel.

## Deployment Prerequisites

Before starting the deployment process, ensure you have:

1. Node.js installed (v16 or higher recommended)
2. npm installed
3. Vercel account set up
4. Vercel CLI installed (`npm install -g vercel`)

## Deployment Steps

### Option 1: Using the Deployment Script

The simplest way to deploy is using the provided deployment script:

```bash
# Make the script executable
chmod +x deploy-to-vercel.sh

# Run the deployment script
./deploy-to-vercel.sh
```

The script will:
1. Verify the build works locally
2. Check if Vercel CLI is installed
3. Deploy to Vercel (with prompts for configuration)

### Option 2: Manual Deployment

If you prefer to deploy manually, follow these steps:

1. Build the project locally:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   # For a preview deployment
   vercel

   # For a production deployment
   vercel --prod
   ```

## Important Configuration Notes

1. **Output Directory**: The `vercel.json` file is configured to use `dist` as the output directory, which matches the configuration in `vite.config.ts`.

2. **Routes Configuration**: The following routes are configured in `vercel.json`:
   - `/ffmpeg-demo` → `/ffmpeg-demo/index.html`
   - `/ffmpeg-demo.html` → `/ffmpeg-demo/index.html`
   - `/experimental` → `/index.html`
   - `/auto-detect` → `/index.html`
   - `/any-format` → `/index.html`
   - `/*` → `/index.html` (catch-all)

3. **FFmpeg Assets**: The FFmpeg assets are included in the `client/public/ffmpeg-assets` directory and will be copied to the build output automatically.

## Post-Deployment Verification

After deployment, verify the following:

1. **Core Routes**: Check that all routes work correctly:
   - `/` (Home)
   - `/experimental` (Experimental Interface)
   - `/any-format` (Any Format Converter)
   - `/auto-detect` (Auto-Detect Converter)
   - `/ffmpeg-demo` (FFmpeg Demo)

2. **File Conversion**: Test the file conversion functionality with different file types.

3. **FFmpeg Integration**: Verify that the FFmpeg demo page loads correctly and works as expected.

## Troubleshooting

If you encounter issues during deployment:

1. **Build Errors**: Check the build output for specific error messages.

2. **Missing Assets**: Ensure all FFmpeg assets are correctly included in the `client/public/ffmpeg-assets` directory.

3. **Route Issues**: Verify that the routes in `vercel.json` match your application's routing requirements.

4. **Performance Issues**: If the app is slow, consider optimizing the FFmpeg assets and implementing caching strategies.

## Custom Domain Setup

To use a custom domain with your deployment:

1. Add the domain in Vercel dashboard
2. Configure DNS according to Vercel's instructions
3. Verify the domain setup

## Contact and Support

If you need assistance with the deployment, please refer to:

- [Vercel Documentation](https://vercel.com/docs)
- Project maintainers at [support@flipmyfile.com](mailto:support@flipmyfile.com)