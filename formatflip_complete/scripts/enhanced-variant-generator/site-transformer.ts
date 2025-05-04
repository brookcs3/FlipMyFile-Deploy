/**
 * Site Transformer
 * 
 * A command-line tool to transform a site from one format pair to another,
 * including visual identity transformation.
 */

import { registry, createConverter } from './format-registry';
import { visualIdentityRegistry, getFormatCSSVariables, getConversionCSSVariables } from './visual-identity';
import { formatManager } from './format-manager';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Color transformation configuration
 */
interface ColorTransformation {
  originalColor: string;
  newColor: string;
}

/**
 * Site transformation configuration
 */
interface TransformationConfig {
  sourceSourceFormat: string;     // Current source format (e.g., 'heic')
  sourceTargetFormat: string;     // Current target format (e.g., 'jpg')
  targetSourceFormat: string;     // New source format (e.g., 'png')
  targetTargetFormat: string;     // New target format (e.g., 'webp')
  inputDir: string;              // Directory containing the original site
  outputDir: string;             // Directory to write the transformed site
}

/**
 * Transform a website from one format pair to another
 */
export async function transformSite(config: TransformationConfig): Promise<void> {
  console.log(`\n--- Transforming site from ${config.sourceSourceFormat.toUpperCase()}→${config.sourceTargetFormat.toUpperCase()} to ${config.targetSourceFormat.toUpperCase()}→${config.targetTargetFormat.toUpperCase()} ---\n`);
  
  // Verify that all formats exist in the registry
  const requiredFormats = [config.sourceSourceFormat, config.sourceTargetFormat, 
                         config.targetSourceFormat, config.targetTargetFormat];
                         
  for (const format of requiredFormats) {
    if (!registry.formats[format]) {
      throw new Error(`Format not found in registry: ${format}`);
    }
  }
  
  // Find or create conversion modes
  const sourceConversionKey = getConversionKey(config.sourceSourceFormat, config.sourceTargetFormat);
  const targetConversionKey = getConversionKey(config.targetSourceFormat, config.targetTargetFormat);
  
  if (!sourceConversionKey || !targetConversionKey) {
    throw new Error('Failed to find or create conversion modes');
  }
  
  console.log(`Source conversion: ${sourceConversionKey}`);
  console.log(`Target conversion: ${targetConversionKey}`);
  
  // Get visual identities
  const sourceSourceIdentity = visualIdentityRegistry.formats[config.sourceSourceFormat];
  const sourceTargetIdentity = visualIdentityRegistry.formats[config.sourceTargetFormat];
  const sourceConversionIdentity = visualIdentityRegistry.conversions[sourceConversionKey];
  
  const targetSourceIdentity = visualIdentityRegistry.formats[config.targetSourceFormat];
  const targetTargetIdentity = visualIdentityRegistry.formats[config.targetTargetFormat];
  const targetConversionIdentity = visualIdentityRegistry.conversions[targetConversionKey];
  
  if (!sourceSourceIdentity || !sourceTargetIdentity || !sourceConversionIdentity ||
      !targetSourceIdentity || !targetTargetIdentity || !targetConversionIdentity) {
    throw new Error('Missing visual identity information');
  }
  
  // Create color transformation map
  const colorTransformations: ColorTransformation[] = [
    // Source format colors
    { originalColor: sourceSourceIdentity.primaryColor, newColor: targetSourceIdentity.primaryColor },
    { originalColor: sourceSourceIdentity.secondaryColor, newColor: targetSourceIdentity.secondaryColor },
    { originalColor: sourceSourceIdentity.accentColor, newColor: targetSourceIdentity.accentColor },
    
    // Target format colors
    { originalColor: sourceTargetIdentity.primaryColor, newColor: targetTargetIdentity.primaryColor },
    { originalColor: sourceTargetIdentity.secondaryColor, newColor: targetTargetIdentity.secondaryColor },
    { originalColor: sourceTargetIdentity.accentColor, newColor: targetTargetIdentity.accentColor },
    
    // Conversion colors
    { originalColor: sourceConversionIdentity.primaryColor, newColor: targetConversionIdentity.primaryColor },
    { originalColor: sourceConversionIdentity.secondaryColor, newColor: targetConversionIdentity.secondaryColor },
    { originalColor: sourceConversionIdentity.accentColor, newColor: targetConversionIdentity.accentColor },
  ];
  
  // Log transformation details
  console.log('\nColor transformations:');
  colorTransformations.forEach(t => {
    console.log(`${t.originalColor} → ${t.newColor}`);
  });
  
  // Get attribute transformations
  const attributeTransformations = [
    { originalAttribute: sourceSourceIdentity.dataAttribute, newAttribute: targetSourceIdentity.dataAttribute },
    { originalAttribute: sourceTargetIdentity.dataAttribute, newAttribute: targetTargetIdentity.dataAttribute },
    { originalAttribute: sourceConversionIdentity.dataAttribute, newAttribute: targetConversionIdentity.dataAttribute },
  ];
  
  console.log('\nAttribute transformations:');
  attributeTransformations.forEach(t => {
    console.log(`${t.originalAttribute} → ${t.newAttribute}`);
  });
  
  // Get CSS class transformations
  const classTransformations = [
    { originalPrefix: sourceSourceIdentity.cssPrefix, newPrefix: targetSourceIdentity.cssPrefix },
    { originalPrefix: sourceTargetIdentity.cssPrefix, newPrefix: targetTargetIdentity.cssPrefix },
    { originalPrefix: sourceConversionIdentity.cssPrefix, newPrefix: targetConversionIdentity.cssPrefix },
  ];
  
  console.log('\nCSS prefix transformations:');
  classTransformations.forEach(t => {
    console.log(`${t.originalPrefix} → ${t.newPrefix}`);
  });
  
  // Get format name transformations
  const nameTransformations = [
    { originalName: registry.formats[config.sourceSourceFormat].name, newName: registry.formats[config.targetSourceFormat].name },
    { originalName: registry.formats[config.sourceTargetFormat].name, newName: registry.formats[config.targetTargetFormat].name },
  ];
  
  console.log('\nFormat name transformations:');
  nameTransformations.forEach(t => {
    console.log(`${t.originalName} → ${t.newName}`);
  });
  
  // In a real implementation, we would process all files in the input directory
  // For this demo, we'll just show the transformation details
  console.log('\nIn a full implementation, the following would happen:');
  console.log(`1. All HTML/CSS/JS files in ${config.inputDir} would be processed`);
  console.log('2. Colors would be replaced according to the transformation map');
  console.log('3. Data attributes would be updated');
  console.log('4. CSS class prefixes would be replaced');
  console.log('5. Format names in text would be replaced');
  console.log(`6. The transformed site would be written to ${config.outputDir}`);
  console.log('7. SVG and image assets would be regenerated with new colors');
  
  // Generate and save a sample transformed page as proof of concept
  const sampleHTML = generateSamplePage(config);
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(config.outputDir)) {
    console.log(`Creating output directory: ${config.outputDir}`);
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  // Write sample page to output directory
  const samplePath = path.join(config.outputDir, 'sample-transformed-page.html');
  console.log(`\nWriting sample transformed page to: ${samplePath}`);
  fs.writeFileSync(samplePath, sampleHTML);
  
  console.log('\nTransformation complete!');
}

/**
 * Get the conversion key for a format pair, creating it if needed
 */
function getConversionKey(sourceFormat: string, targetFormat: string): string | undefined {
  // First try to find existing conversion
  const existingKey = Object.keys(registry.conversions).find(key => {
    const conversion = registry.conversions[key];
    return conversion.source === sourceFormat && conversion.target === targetFormat;
  });
  
  if (existingKey) {
    return existingKey;
  }
  
  // Create new conversion if needed
  return createConverter(sourceFormat, targetFormat);
}

/**
 * Generate a sample transformed page
 */
function generateSamplePage(config: TransformationConfig): string {
  const sourceFormat = registry.formats[config.targetSourceFormat];
  const targetFormat = registry.formats[config.targetTargetFormat];
  const identity = visualIdentityRegistry.formats[config.targetSourceFormat];
  
  // Create a simple HTML page with the new format's styling
  return `<!DOCTYPE html>
<html>
<head>
  <title>${sourceFormat.name} to ${targetFormat.name} Converter</title>
  <style>
    :root {
      --primary-color: ${identity.primaryColor};
      --secondary-color: ${identity.secondaryColor};
      --accent-color: ${identity.accentColor};
    }
    
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    
    header {
      background-color: var(--primary-color);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .converter-box {
      background-color: white;
      border: 2px dashed var(--primary-color);
      border-radius: 8px;
      padding: 30px;
      text-align: center;
    }
    
    .format-info {
      margin: 20px 0;
      padding: 15px;
      background-color: var(--accent-color);
      border-radius: 8px;
      color: #333;
    }
    
    .upload-button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    
    .upload-button:hover {
      background-color: var(--secondary-color);
    }
  </style>
</head>
<body>
  <header ${identity.dataAttribute}>
    <h1>${sourceFormat.name} to ${targetFormat.name} Converter</h1>
    <p>Transform your ${sourceFormat.name} files with ease!</p>
  </header>
  
  <main>
    <div class="format-info">
      <h3>Transformation Details</h3>
      <p><strong>Original Conversion:</strong> ${config.sourceSourceFormat.toUpperCase()} → ${config.sourceTargetFormat.toUpperCase()}</p>
      <p><strong>New Conversion:</strong> ${config.targetSourceFormat.toUpperCase()} → ${config.targetTargetFormat.toUpperCase()}</p>
      <p><strong>Theme Color:</strong> ${identity.primaryColor}</p>
    </div>
    
    <div class="converter-box" ${identity.dataAttribute}>
      <h2>Drop your ${sourceFormat.name} files here</h2>
      <p>We'll convert them to ${targetFormat.name} format instantly</p>
      <button class="upload-button">Choose Files</button>
    </div>
  </main>
  
  <footer>
    <p>Generated by HEICFlip Site Transformer - Using Loaders and Encoders system</p>
  </footer>
</body>
</html>`;
}

/**
 * Command line interface for the site transformer
 */
export function runSiteTransformer(): void {
  // This would normally parse command line arguments
  // For this demo, we'll use hardcoded values
  
  // Default transformation: HEIC→JPG to WebP→PNG
  const config: TransformationConfig = {
    sourceSourceFormat: 'heic',
    sourceTargetFormat: 'jpg',
    targetSourceFormat: 'webp',
    targetTargetFormat: 'png',
    inputDir: './original-site',
    outputDir: './transformed-site'
  };
  
  // Display transformation options
  console.log('\nSite Transformer - Format Options:');
  console.log('Available formats:');
  Object.keys(registry.formats).forEach(format => {
    const identity = visualIdentityRegistry.formats[format];
    console.log(`  - ${format}: ${registry.formats[format].name} (${identity.primaryColor})`);
  });
  
  // In a real implementation, we would parse command line arguments here
  // For now, we'll just run the transformation with the default config
  transformSite(config);
}

// Export so we can import in the demo script
export default runSiteTransformer;
