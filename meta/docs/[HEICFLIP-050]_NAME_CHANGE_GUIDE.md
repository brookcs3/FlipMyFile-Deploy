# [HEICFLIP-050] Project Name Change Guide

## Overview

This document explains how to rename the project from "HEICFLIP" to another name, updating all documentation, file names, and code references throughout the codebase.

## Automated Rename Process

The project includes a specialized script to handle the renaming process for documentation files and prefixes:

```bash
./meta/tools/[HEICFLIP-010]_PROJECT_RENAME.sh HEICFLIP NEWNAME
```

Replace `NEWNAME` with your desired project name (all uppercase).

### What The Script Updates

The rename script will:

1. Update all file names containing `[HEICFLIP-XXX]` to use the new prefix
2. Replace all text instances of `[HEICFLIP-XXX]` inside files with the new prefix
3. Create a backup before making changes
4. Provide a summary of changes made

## Manual Updates Required

After running the rename script, you'll still need to manually update:

### 1. Application Configuration

Update the site configuration in `client/src/config.ts`:

```typescript
// From
const heicFlipConfig: SiteConfig = {
  siteName: "HEICFlip",
  defaultConversionMode: "heicToJpg",
  ...
};

// To 
const newNameConfig: SiteConfig = {
  siteName: "NewName",
  defaultConversionMode: "heicToJpg",
  ...
};
```

### 2. Package.json

Update project name in `package.json`:

```json
{
  "name": "newname",
  "version": "1.0.0",
  ...
}
```

### 3. README and Documentation Content

While the script updates the file numbering prefix, you should manually review and update:

- Main heading in README.md
- Project descriptions
- Website URLs and domains
- GitHub repository references

### 4. Domain References

Update any domain references in:
- `client/src/config.ts`
- Deployment configurations
- Documentation referring to the live site

## Testing After Rename

After renaming, thoroughly test:

1. Build and start the application
2. Check for any hardcoded references to the old name
3. Verify all functionality works correctly
4. Test any CI/CD pipelines that might reference the project name

## Deployment Considerations

When renaming a deployed project, you'll need to:

1. Update any GitHub repository names
2. Update deployment configurations in Vercel, Cloudflare Pages, etc.
3. Consider domain name changes and DNS updates
4. Update any external services that reference the project

## Rollback Plan

If anything goes wrong during the rename process:

1. Use the backup created by the rename script
2. Or restore from the most recent backup point using `./restore_from_save.sh`

Last Updated: April 30, 2025