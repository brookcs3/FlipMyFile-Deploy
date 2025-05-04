#!/usr/bin/env node

/**
 * HEICFlip Vercel Deployment Script
 * 
 * This script automates the deployment of HEICFlip to Vercel.
 * Run with: node vercel-deploy.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Log with formatting
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Execute a command and return its output
function execute(command, options = {}) {
  try {
    return execSync(command, { 
      stdio: 'inherit',
      ...options
    });
  } catch (error) {
    log(`Error executing command: ${command}`, colors.red);
    log(error.message, colors.red);
    process.exit(1);
  }
}

// Check if a command exists
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Main deployment function
async function deploy() {
  log('🚀 Starting Vercel deployment for HEICFlip...', colors.bright + colors.cyan);
  
  // Check if Vercel CLI is installed
  if (!commandExists('vercel')) {
    log('Vercel CLI not found, installing globally...', colors.yellow);
    execute('npm install -g vercel');
  }
  
  // Log into Vercel if not already authenticated
  try {
    execSync('vercel whoami', { stdio: 'ignore' });
    log('✅ Already logged in to Vercel', colors.green);
  } catch (error) {
    log('Please log in to Vercel:', colors.yellow);
    execute('vercel login');
  }
  
  // Build the project
  log('📦 Building HEICFlip...', colors.bright);
  execute('npm run build');
  
  // Verify build output exists
  if (!fs.existsSync(path.join(process.cwd(), 'dist'))) {
    log('Build failed - dist directory not found', colors.red);
    process.exit(1);
  }
  
  // Deploy to Vercel
  log('🚀 Deploying to Vercel...', colors.magenta);
  
  // Check if this is a first-time deployment or an update
  let isFirstDeploy = true;
  try {
    execSync('vercel list', { stdio: 'ignore' });
    isFirstDeploy = false;
  } catch (error) {
    // If vercel list fails, it's likely a first-time deployment
  }
  
  if (isFirstDeploy) {
    log('Performing initial deployment...', colors.yellow);
    execute('vercel --yes'); // Auto-confirm prompts for first deploy
  }
  
  // Deploy to production
  log('🚀 Deploying to production...', colors.bright + colors.magenta);
  execute('vercel --prod');
  
  log('✅ Deployment completed successfully!', colors.bright + colors.green);
  log('To deploy again in the future, simply run: vercel --prod', colors.cyan);
}

// Run the deployment
deploy().catch(error => {
  log(`Deployment failed: ${error.message}`, colors.red);
  process.exit(1);
});