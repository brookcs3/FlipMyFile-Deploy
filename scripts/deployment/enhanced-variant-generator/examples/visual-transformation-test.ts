/**
 * Visual Identity Transformation Test
 * 
 * This script demonstrates how to transform between different format visual identities.
 * It shows the transformation from HEIC (orange) to WebP (purple) formats.
 */

import { registry } from '../format-registry';
import { visualIdentityRegistry, getFormatCSSVariables, getConversionCSSVariables } from '../visual-identity';
import { formatManager } from '../format-manager';

/**
 * Generate a simple HTML page with the visual identity of a format
 */
function generateFormatHTMLPage(formatKey: string): string {
  const formatInfo = registry.formats[formatKey];
  const identity = visualIdentityRegistry.formats[formatKey];
  
  if (!formatInfo || !identity) {
    return `<html><body><h1>Error: Format ${formatKey} not found</h1></body></html>`;
  }
  
  // CSS variables for this format
  const cssVars = getFormatCSSVariables(formatKey);
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>${formatInfo.name} Converter</title>
  <style>
    :root {
      ${cssVars}
    }
    
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    
    header {
      background-color: var(--${identity.cssPrefix}-primary-color);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .converter-box {
      background-color: white;
      border: 2px dashed var(--${identity.cssPrefix}-primary-color);
      border-radius: 8px;
      padding: 30px;
      text-align: center;
    }
    
    .upload-button {
      background-color: var(--${identity.cssPrefix}-primary-color);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    
    .upload-button:hover {
      background-color: var(--${identity.cssPrefix}-secondary-color);
    }
    
    .format-icon {
      display: inline-block;
      width: 60px;
      height: 60px;
      background-color: var(--${identity.cssPrefix}-primary-color);
      border-radius: ${identity.iconShape === 'circle' ? '50%' : 
                     identity.iconShape === 'square' ? '0' : 
                     identity.iconShape === 'diamond' ? '0' : '10px'};
      margin: 10px;
      transform: ${identity.iconShape === 'diamond' ? 'rotate(45deg)' : 'none'};
    }
    
    footer {
      margin-top: 40px;
      text-align: center;
      color: #666;
    }
  </style>
</head>
<body>
  <header ${identity.dataAttribute}>
    <h1>${formatInfo.name} Converter</h1>
    <p>Convert your ${formatInfo.name} files easily</p>
  </header>
  
  <main>
    <div class="converter-box" ${identity.dataAttribute}>
      <div class="format-icon"></div>
      <h2>Drop your ${formatInfo.name} files here</h2>
      <p>or</p>
      <button class="upload-button">Choose Files</button>
      <p>Maximum size: 50MB</p>
    </div>
  </main>
  
  <footer>
    <p>&copy; 2025 ${formatKey.toUpperCase()}Flip - Convert ${formatInfo.name} files with ease</p>
  </footer>
</body>
</html>`;
}

/**
 * Generate a simple HTML page with the visual identity of a conversion
 */
function generateConversionHTMLPage(sourceFormat: string, targetFormat: string): string {
  // Find the conversion key
  const conversionKey = Object.keys(registry.conversions).find(key => {
    const conversion = registry.conversions[key];
    return conversion.source === sourceFormat && conversion.target === targetFormat;
  });
  
  if (!conversionKey) {
    return `<html><body><h1>Error: Conversion from ${sourceFormat} to ${targetFormat} not found</h1></body></html>`;
  }
  
  const conversion = registry.conversions[conversionKey];
  const sourceInfo = registry.formats[sourceFormat];
  const targetInfo = registry.formats[targetFormat];
  const identity = visualIdentityRegistry.conversions[conversionKey];
  
  if (!conversion || !sourceInfo || !targetInfo || !identity) {
    return `<html><body><h1>Error: Missing information for conversion</h1></body></html>`;
  }
  
  // CSS variables for this conversion
  const cssVars = getConversionCSSVariables(conversionKey);
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>${conversion.name}</title>
  <style>
    :root {
      ${cssVars}
    }
    
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
    }
    
    header {
      background: var(--${identity.cssPrefix}-gradient);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .converter-box {
      background-color: white;
      border: 2px dashed var(--${identity.cssPrefix}-primary-color);
      border-radius: 8px;
      padding: 30px;
      text-align: center;
    }
    
    .upload-button {
      background-color: var(--${identity.cssPrefix}-primary-color);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    
    .upload-button:hover {
      background-color: var(--${identity.cssPrefix}-secondary-color);
    }
    
    .format-icons {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0;
    }
    
    .source-icon {
      display: inline-block;
      width: 60px;
      height: 60px;
      background-color: ${visualIdentityRegistry.formats[sourceFormat].primaryColor};
      border-radius: ${visualIdentityRegistry.formats[sourceFormat].iconShape === 'circle' ? '50%' : 
                      visualIdentityRegistry.formats[sourceFormat].iconShape === 'square' ? '0' : 
                      visualIdentityRegistry.formats[sourceFormat].iconShape === 'diamond' ? '0' : '10px'};
      margin: 10px;
      transform: ${visualIdentityRegistry.formats[sourceFormat].iconShape === 'diamond' ? 'rotate(45deg)' : 'none'};
    }
    
    .arrow {
      font-size: 24px;
      margin: 0 10px;
    }
    
    .target-icon {
      display: inline-block;
      width: 60px;
      height: 60px;
      background-color: ${visualIdentityRegistry.formats[targetFormat].primaryColor};
      border-radius: ${visualIdentityRegistry.formats[targetFormat].iconShape === 'circle' ? '50%' : 
                      visualIdentityRegistry.formats[targetFormat].iconShape === 'square' ? '0' : 
                      visualIdentityRegistry.formats[targetFormat].iconShape === 'diamond' ? '0' : '10px'};
      margin: 10px;
      transform: ${visualIdentityRegistry.formats[targetFormat].iconShape === 'diamond' ? 'rotate(45deg)' : 'none'};
    }
    
    footer {
      margin-top: 40px;
      text-align: center;
      color: #666;
    }
  </style>
</head>
<body>
  <header ${identity.dataAttribute}>
    <h1>${conversion.name}</h1>
    <p>Convert your ${sourceInfo.name} files to ${targetInfo.name} format</p>
  </header>
  
  <main>
    <div class="converter-box" ${identity.dataAttribute}>
      <div class="format-icons">
        <div class="source-icon"></div>
        <div class="arrow">→</div>
        <div class="target-icon"></div>
      </div>
      <h2>Drop your ${sourceInfo.name} files here</h2>
      <p>or</p>
      <button class="upload-button">Choose Files</button>
      <p>Maximum size: 50MB</p>
    </div>
  </main>
  
  <footer>
    <p>&copy; 2025 ${sourceFormat.toUpperCase()}Flip - Convert ${sourceInfo.name} to ${targetInfo.name} with ease</p>
  </footer>
</body>
</html>`;
}

/**
 * Run the visual identity transformation test
 */
export function runVisualTransformationTest(): void {
  console.log('\n--- Visual Identity Transformation Test ---\n');
  
  console.log('Generating HEIC format page (Orange theme)...');
  const heicHTML = generateFormatHTMLPage('heic');
  
  console.log('Generating WebP format page (Purple theme)...');
  const webpHTML = generateFormatHTMLPage('webp');
  
  console.log('Generating HEIC to WebP conversion page (Blended theme)...');
  const conversionHTML = generateConversionHTMLPage('heic', 'webp');
  
  // In a real implementation, we'd write these to files
  // For this test, we'll just log information about the pages
  console.log('\nHEIC Theme Colors (Orange):');
  console.log(`Primary: ${visualIdentityRegistry.formats['heic'].primaryColor}`);
  console.log(`Secondary: ${visualIdentityRegistry.formats['heic'].secondaryColor}`);
  console.log(`Accent: ${visualIdentityRegistry.formats['heic'].accentColor}`);
  console.log(`Data Attribute: ${visualIdentityRegistry.formats['heic'].dataAttribute}`);
  
  console.log('\nWebP Theme Colors (Purple):');
  console.log(`Primary: ${visualIdentityRegistry.formats['webp'].primaryColor}`);
  console.log(`Secondary: ${visualIdentityRegistry.formats['webp'].secondaryColor}`);
  console.log(`Accent: ${visualIdentityRegistry.formats['webp'].accentColor}`);
  console.log(`Data Attribute: ${visualIdentityRegistry.formats['webp'].dataAttribute}`);
  
  // Get the conversion key
  const conversionKey = Object.keys(registry.conversions).find(key => {
    const conversion = registry.conversions[key];
    return conversion.source === 'heic' && conversion.target === 'webp';
  });
  
  if (conversionKey && visualIdentityRegistry.conversions[conversionKey]) {
    console.log('\nHEIC to WebP Conversion Theme Colors (Blended):');
    console.log(`Primary: ${visualIdentityRegistry.conversions[conversionKey].primaryColor}`);
    console.log(`Secondary: ${visualIdentityRegistry.conversions[conversionKey].secondaryColor}`);
    console.log(`Accent: ${visualIdentityRegistry.conversions[conversionKey].accentColor}`);
    console.log(`Gradient: ${visualIdentityRegistry.conversions[conversionKey].gradient}`);
    console.log(`Data Attribute: ${visualIdentityRegistry.conversions[conversionKey].dataAttribute}`);
  }
  
  console.log('\n--- End of Visual Identity Transformation Test ---');
}

// Export so we can import in the demo script
export default runVisualTransformationTest;
