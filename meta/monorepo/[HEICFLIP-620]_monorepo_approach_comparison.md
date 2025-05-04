# Monorepo Implementation Approaches: Npm Workspaces vs. Subdirectories

This document compares the two primary approaches for implementing a monorepo structure and explains why npm workspaces is the recommended approach for this project.

## Approach 1: Simple Subdirectories

### Overview
In this approach, you organize code into subdirectories, but each directory isn't treated as a separate package. There's typically one package.json at the root level.

### Example Structure
```
/
├── package.json
├── tsconfig.json
├── heicflip/
│   ├── src/
│   └── ...
├── jpgflip/
│   ├── src/
│   └── ...
└── shared/
    ├── src/
    └── ...
```

### Pros
- Simpler initial setup
- No need to manage multiple package.json files
- Easier to understand for developers unfamiliar with workspaces
- Single node_modules folder

### Cons
- No clear boundaries between packages
- Harder to manage dependencies for specific variants
- Can't build or run variants independently
- Can't publish variants as separate packages
- No isolation of package dependencies

## Approach 2: Npm Workspaces

### Overview
Npm workspaces treat each subdirectory as a separate package with its own package.json, while sharing a single node_modules folder at the root.

### Example Structure
```
/
├── package.json (with "workspaces" field)
├── packages/
│   ├── core/
│   │   ├── package.json
│   │   └── src/
│   ├── heicflip/
│   │   ├── package.json
│   │   └── src/
│   └── jpgflip/
│       ├── package.json
│       └── src/
└── shared/
    └── schema.ts
```

### Pros
- Clear package boundaries and ownership
- Can run commands on specific variants (`npm run build --workspace=packages/heicflip`)
- Proper dependency management between packages
- Single node_modules folder (avoids duplication)
- Can deploy variants independently
- Better support for scaling with many variants
- Each variant can specify its own dependencies

### Cons
- Slightly more complex setup
- Multiple package.json files to maintain
- More complex build configuration

## Recommended Approach: Npm Workspaces

For the converter monorepo project, **npm workspaces** is strongly recommended for these reasons:

1. **Independent Deployments**: Each variant can be built and deployed independently to different domains.

2. **Dependency Isolation**: Each variant can specify different dependencies if needed (e.g., if JPGFlip needs a specific library that HEICFlip doesn't).

3. **Clear Boundaries**: The core shared functionality is clearly separated from variant-specific code.

4. **Scalability**: As you add more converter variants, the workspace structure scales more effectively.

5. **Vercel Compatibility**: Vercel has excellent support for monorepos using workspaces, making deployment simpler.

6. **Better Development Experience**: Developers can work on one variant without affecting others.

## Implementation Details

For npm workspaces:

1. **Root package.json**:
```json
{
  "name": "flip-converters",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:heicflip": "npm run dev --workspace=packages/heicflip",
    "dev:jpgflip": "npm run dev --workspace=packages/jpgflip",
    "build:all": "node scripts/build-all.js",
    "build:heicflip": "npm run build --workspace=packages/heicflip",
    "build:jpgflip": "npm run build --workspace=packages/jpgflip"
  }
}
```

2. **Package references**: Packages can reference each other:
```json
// packages/heicflip/package.json
{
  "name": "@flip/heicflip",
  "dependencies": {
    "@flip/core": "1.0.0"
  }
}
```

3. **Import statements**: Import directly from packages:
```typescript
// In packages/heicflip/src/App.tsx
import { AdBanner } from '@flip/core';
```

## Specific Benefits for Your Project

1. **Multi-domain Deployment**: With npm workspaces, deploying to different domains (heicflip.com, jpgflip.com, etc.) becomes much simpler.

2. **Maintenance**: When you need to update shared functionality, you make changes in one place (core package) and all variants benefit.

3. **Ad Configuration**: Each variant can have its own ad configuration while using shared ad components.

4. **Version Control**: Easier to track changes across variants.

5. **Development Efficiency**: Focus on developing or fixing one variant without affecting others.

---

Last updated: April 30, 2025