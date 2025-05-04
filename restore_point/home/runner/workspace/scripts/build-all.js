/**
 * Script to build all packages in the correct order
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the packages directory path
const packagesDir = path.join(__dirname, '../packages');

// Get all package directories
const packageDirs = fs.readdirSync(packagesDir)
  .filter(dir => fs.statSync(path.join(packagesDir, dir)).isDirectory());

console.log('Building packages in the following order:');

// Build the core package first
if (packageDirs.includes('core')) {
  console.log('1. @flip/core');
  try {
    execSync('npm run build', { 
      cwd: path.join(packagesDir, 'core'), 
      stdio: 'inherit' 
    });
    console.log('✓ Successfully built @flip/core');
  } catch (error) {
    console.error('✗ Failed to build @flip/core');
    process.exit(1);
  }
}

// Then build all other packages
const variantPackages = packageDirs.filter(dir => dir !== 'core');
variantPackages.forEach((packageDir, index) => {
  console.log(`${index + 2}. @flip/${packageDir}`);
  try {
    execSync('npm run build', { 
      cwd: path.join(packagesDir, packageDir), 
      stdio: 'inherit'
    });
    console.log(`✓ Successfully built @flip/${packageDir}`);
  } catch (error) {
    console.error(`✗ Failed to build @flip/${packageDir}`);
    // Continue building other packages even if one fails
  }
});

console.log('Build process completed!');