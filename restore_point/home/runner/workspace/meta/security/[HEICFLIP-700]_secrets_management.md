# Secure Secrets Management Guide

This document outlines best practices for securely storing and using sensitive information (API keys, passwords, etc.) in your development and deployment environments.

## Never Store Secrets in Code or Git Repositories

The most important rule: **Never store any secrets or credentials directly in your code or push them to GitHub**. This includes:

- API keys
- Database credentials
- Authentication tokens
- Passwords
- Private keys
- Environment files (.env)

## Secure Options for Storing Secrets

### 1. Vercel Environment Variables (Recommended for Production)

Vercel provides a secure way to store environment variables:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each secret as a key-value pair
4. Optionally scope variables to specific environments (production, preview, development)

These variables are encrypted at rest and securely injected into your application at runtime.

### 2. GitHub Secrets (For GitHub Actions)

If using GitHub Actions for CI/CD:

1. Go to your GitHub repository
2. Navigate to "Settings" → "Secrets and variables" → "Actions"
3. Add repository secrets
4. Reference them in workflows using `${{ secrets.SECRET_NAME }}`

### 3. Environment Files (.env) for Local Development

For local development:

1. Create a `.env` file in your project root
2. Add your secrets in KEY=VALUE format
3. Add `.env` to your `.gitignore` file to prevent accidental commits
4. Create a `.env.example` file with placeholder values for documentation

Example `.env` file:
```
API_KEY=your_actual_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

Example `.env.example` file (safe to commit):
```
API_KEY=your_api_key_here
DATABASE_URL=postgresql://username:password@localhost:5432/database
```

### 4. For Replit Development Environment

When using Replit:

1. Go to the "Secrets" tab (lock icon) in your Replit project
2. Add your secrets as key-value pairs
3. Access them in your code via environment variables

## Accessing Secrets in Your Application

### In JavaScript/TypeScript:

```javascript
// Access environment variables
const apiKey = process.env.API_KEY;
const databaseUrl = process.env.DATABASE_URL;

// For client-side code (must be prefixed with VITE_ for Vite projects)
// Only include public/non-sensitive keys here
const publicApiKey = import.meta.env.VITE_PUBLIC_API_KEY;
```

> **IMPORTANT**: Only environment variables prefixed with `VITE_` are exposed to client-side code. Never prefix sensitive variables with `VITE_`.

## Managing Different Environment Variables Across Variants

For your monorepo with multiple variants, you may need different secrets for each:

### Variant-Specific Variables in Vercel

1. Create separate Vercel projects for each variant
2. Configure environment variables specific to each project
3. Use naming conventions to keep variables organized:
   ```
   HEICFLIP_API_KEY=xxxxx
   JPGFLIP_API_KEY=yyyyy
   ```

## External API Operations

When performing operations that require sensitive data:

1. Store API keys and credentials securely using methods above
2. Create backend API routes that use these credentials server-side
3. Call these routes from frontend code instead of directly calling external APIs
4. Implement proper authentication for your API routes

Example backend route (server-side):
```javascript
app.post("/api/external-operation", async (req, res) => {
  // Get the API key from environment variables (not exposed to client)
  const apiKey = process.env.EXTERNAL_API_KEY;
  
  try {
    // Use the API key to call external service
    const result = await callExternalService(apiKey, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Operation failed" });
  }
});
```

## Periodic Secret Rotation

Improve security by regularly updating your secrets:

1. Set calendar reminders to update API keys every 90-180 days
2. Use different keys for development and production environments
3. Document the rotation process for each type of secret

## Security Checklist

- [ ] No secrets in code or GitHub repositories
- [ ] Environment variables configured in Vercel
- [ ] `.env` files added to `.gitignore`
- [ ] Provided `.env.example` with placeholder values
- [ ] Client-side code only accesses non-sensitive environment variables
- [ ] Backend routes created for operations requiring sensitive data
- [ ] Secret rotation schedule established

---

Last updated: April 30, 2025