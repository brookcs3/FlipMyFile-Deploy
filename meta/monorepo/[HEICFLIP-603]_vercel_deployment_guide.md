# Vercel Deployment Guide for Monorepo Variants

This guide provides specific instructions for deploying multiple converter variants from a monorepo to Vercel, with domains managed through CloudFlare.

## Vercel Monorepo Configuration

Vercel has built-in support for monorepos, which makes it ideal for our multi-variant converter project.

## Prerequisites

- GitHub repository with the monorepo structure
- Vercel account connected to GitHub
- CloudFlare account with registered domains

## Setup Process for Each Variant

### 1. Create Vercel Configuration Files

Create a `vercel.json` file in each variant package:

**For HEICFlip (`packages/heicflip/vercel.json`):**
```json
{
  "buildCommand": "cd ../.. && npm run build:heicflip",
  "outputDirectory": "packages/heicflip/dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**For JPGFlip (`packages/jpgflip/vercel.json`):**
```json
{
  "buildCommand": "cd ../.. && npm run build:jpgflip",
  "outputDirectory": "packages/jpgflip/dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Set Up Projects on Vercel

For each variant:

1. Log in to the Vercel dashboard
2. Select "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Project Name**: `heicflip` (or variant name)
   - **Framework Preset**: Choose "Other"
   - **Root Directory**: Set to the specific variant directory (e.g., `packages/heicflip`)
   - **Build Command**: Leave empty (uses vercel.json)
   - **Output Directory**: Leave empty (uses vercel.json)
   - **Environment Variables**: Add any required env variables

5. Click "Deploy"

### 3. Configure Domains on Vercel

After the initial deployment:

1. Go to the project settings in Vercel dashboard
2. Select "Domains"
3. Add your domain (e.g., `heicflip.com`)
4. Vercel will provide DNS configuration instructions

### 4. Configure DNS on CloudFlare

1. Log in to your CloudFlare dashboard
2. Select your domain
3. Go to DNS settings
4. Add the DNS records provided by Vercel:
   - Usually a CNAME record pointing to `cname.vercel-dns.com`
   - For apex domains, you might need to use CloudFlare's CNAME flattening feature

### 5. SSL Configuration

1. In CloudFlare, set SSL/TLS encryption mode to "Full" or "Full (strict)"
2. In Vercel, ensure SSL is enabled for your domain

## Automated Deployment Process

Once set up, the deployment process becomes seamless:

1. Push changes to GitHub
2. Vercel automatically detects changes
3. Each variant project only rebuilds if its files changed
4. Deployment proceeds without disrupting other variants

## Efficient Preview Deployments

Vercel creates preview deployments for pull requests:

1. Create a branch for changes to a specific variant
2. Make changes and create a pull request
3. Vercel will create a preview deployment automatically
4. Test the variant on the preview URL before merging

## Managing Multiple Variant Deployments

To keep track of all your variant deployments:

1. Create a `deployments.md` file in your repo:
   ```markdown
   # Deployment URLs
   
   | Variant | Production URL | GitHub Repository | Vercel Dashboard |
   |---------|---------------|-------------------|------------------|
   | HEICFlip | [heicflip.com](https://heicflip.com) | [GitHub](https://github.com/yourusername/converter-monorepo) | [Vercel](https://vercel.com/yourusername/heicflip) |
   | JPGFlip | [jpgflip.com](https://jpgflip.com) | [GitHub](https://github.com/yourusername/converter-monorepo) | [Vercel](https://vercel.com/yourusername/jpgflip) |
   ```

2. Add each new variant to this table as you create it

## Adding a New Variant Deployment

When creating a new variant:

1. Create the variant in your monorepo
2. Add the appropriate `vercel.json` file
3. Push to GitHub
4. Create a new project in Vercel following the steps above
5. Configure the domain in Vercel and CloudFlare
6. Update your `deployments.md` file

## Handling Domain Configuration for Multiple Variants

When using multiple domains with CloudFlare:

1. Register each domain in CloudFlare
2. Set up DNS records for each domain pointing to the appropriate Vercel deployment
3. Configure SSL/TLS settings for each domain
4. Verify domain ownership in Vercel

## Troubleshooting Common Issues

### Build Fails for Specific Variant

If a build fails for a specific variant:

1. Check the Vercel build logs
2. Ensure the variant's build command works locally
3. Verify the `vercel.json` configuration is correct

### Domain Configuration Issues

If your domain isn't connecting properly:

1. Verify DNS records in CloudFlare match Vercel's requirements
2. Check for DNS propagation delays (can take up to 48 hours)
3. Ensure CloudFlare's proxy settings are configured correctly

---

Last updated: April 30, 2025