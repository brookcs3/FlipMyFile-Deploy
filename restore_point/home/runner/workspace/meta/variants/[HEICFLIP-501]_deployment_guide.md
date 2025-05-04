# Deployment Guide for Converter Variants

This document provides step-by-step instructions for creating and deploying new converter variants from the base project.

## Creating a New Deployment

### Step 1: Create a New Repository

1. Create a new private GitHub repository (e.g., `heicflip`, `jpgflip`, etc.)
2. Initialize it with a README file

### Step 2: Clone the Base Project

1. Clone your base project repository:
   ```bash
   git clone https://github.com/yourusername/base-converter.git new-variant
   cd new-variant
   ```

2. Remove the existing git history:
   ```bash
   rm -rf .git
   ```

3. Initialize a new git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Base converter project"
   ```

4. Connect to your new repository:
   ```bash
   git remote add origin https://github.com/yourusername/new-variant.git
   git push -u origin main
   ```

### Step 3: Customize the Configuration

1. Update the `client/src/config.ts` file:
   - Ensure your variant configuration is defined
   - Verify the `getSiteConfig()` function will return the correct configuration

2. If needed, update the domain in `vercel.json` and any other deployment-specific files

### Step 4: Deploy the Application

1. Connect your GitHub repository to your deployment platform (Vercel, Cloudflare Pages, etc.)
2. Configure the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Add any required environment variables
4. Deploy!

## Maintaining Multiple Variants

### Syncing Updates from Base Project

When you make improvements to the base conversion engine or shared components:

1. Save the changes to a specific directory or branch in your base project
2. In each variant repository, pull in these changes:
   ```bash
   # Option 1: Manual copy (for small changes)
   cp -r /path/to/base-project/updated-files /path/to/variant/destination
   
   # Option 2: Add base as a remote (for larger changes)
   git remote add base https://github.com/yourusername/base-converter.git
   git fetch base
   git cherry-pick <commit-hash> # or merge specific changes
   ```

### Variant-Specific Customizations

For features specific to a particular variant:

1. Create a branch for the custom feature
2. Implement and test the changes
3. Merge to the main branch only in that variant's repository

## Recommended Workflow

1. Develop and test core functionality in the base project
2. Once stable, deploy to variant-specific repositories
3. For each variant:
   - Customize configuration and branding
   - Perform variant-specific testing
   - Deploy to production

---

Last updated: April 30, 2025