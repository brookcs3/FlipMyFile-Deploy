/**
 * Script to copy demo files to the build output directory
 */
import fs from 'fs';
import path from 'path';

// Define paths
const rootDir = new URL('..', import.meta.url).pathname;
const sourceFile = path.join(rootDir, 'format-transformation-demo.html');
const destDir = path.join(rootDir, 'dist/public');
const destFile = path.join(destDir, 'format-transformation-demo.html');

// Ensure the destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy the demo HTML file
fs.copyFileSync(sourceFile, destFile);

console.log(`Successfully copied ${sourceFile} to ${destFile}`);
