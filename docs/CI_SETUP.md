# CI/CD Pipeline Setup Guide

## Files Created

1. `.github/workflows/ci.yml` - Continuous Integration pipeline
2. `.github/workflows/deploy.yml` - Production deployment pipeline
3. `docker-compose.ci.yml` - Local CI testing environment
4. `Dockerfile.ci` - CI build container

## CI Pipeline Features

- Runs on push/pull request to `main` and `develop` branches
- Tests against Node.js 18.x and 20.x
- PostgreSQL service for database testing
- Runs linting, type checking, and builds
- Matrix testing for multiple Node versions

## Local Testing

Test the CI pipeline locally:

```bash
docker-compose -f docker-compose.ci.yml up --build
```

## Deployment Configuration

The deployment workflow needs platform-specific configuration:

### For Vercel (User/Merchant Apps):
1. Create a Vercel account
2. Install Vercel CLI: `npm i -g vercel`
3. Link your projects using `vercel link`
4. Generate token in Vercel dashboard
5. Add `VERCEL_TOKEN` secret in GitHub repo settings

### For Bank Webhook Handler (Render.com):
1. Create a Render account
2. Create a new Web Service for the bank_webhook_handler
3. Set up a Deploy Hook in Render (Settings -> Advanced Settings)
4. Copy the Deploy Hook URL
5. Add `RENDER_DEPLOY_HOOK_URL` secret in GitHub repo settings

## Required GitHub Secrets

Add these secrets in your repository settings:

- `VERCEL_TOKEN` (for Vercel deployments)
- `RENDER_DEPLOY_HOOK_URL` (for Render deployments)
- `DATABASE_URL` (production database URL)

## Environment Variables

Create `.env.production` files in each app directory with production configs.

## Next Steps

1. Configure your deployment platform
2. Add required secrets to GitHub
3. Test deployment manually first
4. Push to `main` branch to trigger automated deployment
