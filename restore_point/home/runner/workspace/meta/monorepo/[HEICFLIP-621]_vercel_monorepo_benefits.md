# Vercel and npm Workspaces: Perfect Integration

This document explains why Vercel's platform works exceptionally well with npm workspace-based monorepos and the specific benefits for your converter project.

## Vercel's Built-in Monorepo Support

Vercel has built-in, first-class support for monorepos using npm workspaces. Here's why:

### 1. Automatic Project Detection

Vercel automatically detects npm workspaces in your repository and offers to create separate projects for each workspace. This makes it easy to deploy multiple applications from a single repository.

### 2. Turborepo Integration

Vercel (which acquired Turborepo) has deep integration with modern monorepo tooling. While we're using basic npm workspaces, the platform is optimized for this exact structure.

### 3. Intelligent Build Caching

Vercel uses dependency analysis to:
- Only rebuild packages that have changed
- Cache build artifacts for faster deployments
- Optimize CI/CD pipelines for monorepos

### 4. Project-Specific Environment Variables

Each project (variant) can have its own environment variables, which is perfect for:
- Different ad network configurations per variant
- Domain-specific settings
- API keys that might differ between variants

## Deployment Benefits for Your Converters

For your specific project with multiple themed converters:

### 1. Domain Mapping

Each variant can be easily deployed to its own domain:
- heicflip.com → packages/heicflip
- jpgflip.com → packages/jpgflip
- aviflip.com → packages/aviflip

### 2. Independent Updates

You can update one converter variant without affecting others:
- Fix a bug in HEICFlip while JPGFlip remains untouched
- Roll out new features to one variant at a time
- Test changes in isolation

### 3. Shared Core Updates

When you update the core package:
- Vercel intelligently rebuilds all dependent projects
- Ensures consistent functionality across all variants
- Properly resolves dependencies

### 4. Preview Deployments

For each pull request:
- Vercel creates preview deployments for affected variants
- You can test changes on actual domains before merging
- Stakeholders can review changes with real URLs

## Vercel-Specific Configuration for npm Workspaces

Vercel uses the following key configurations that align perfectly with npm workspaces:

### 1. Project Settings

For each variant, Vercel will use:
- **Root Directory**: `packages/[variant-name]`
- **Build Command**: From the variant's package.json or vercel.json
- **Output Directory**: Default `dist` or from configuration

### 2. Vercel.json Configuration (Per Variant)

Each variant should have its own `vercel.json` file:

```json
{
  "buildCommand": "cd ../.. && npm run build:[variant-name]",
  "outputDirectory": "packages/[variant-name]/dist",
  "framework": "vite"
}
```

This allows Vercel to build the projects correctly, handling workspace dependencies.

## Practical Example

Here's how our monorepo will be deployed on Vercel:

1. Push the monorepo to GitHub
2. Connect Vercel to the GitHub repository
3. Vercel detects the workspace structure
4. Create projects for each variant:
   - HEICFlip project points to packages/heicflip
   - JPGFlip project points to packages/jpgflip
5. Configure domains for each project:
   - heicflip.com → HEICFlip project
   - jpgflip.com → JPGFlip project
6. When you push changes:
   - Changes to core → all projects rebuild
   - Changes to just one variant → only that project rebuilds

## Additional Vercel Optimizations

To further optimize your Vercel deployment with npm workspaces:

1. **Build Cache**: Add `.vercel/output` to `.gitignore`
2. **Dependency Installation**: Vercel will respect your workspace setup
3. **Edge Functions**: Available per-project for any variant-specific optimizations

---

Last updated: April 30, 2025