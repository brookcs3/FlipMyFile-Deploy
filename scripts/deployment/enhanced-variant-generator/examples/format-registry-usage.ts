/**
 * Format Registry Usage Examples
 * 
 * Shows how to leverage the PIL-inspired format registry system
 * for automatic format detection and conversion.
 */

import {
  registry,
  getFormatByExtension,
  getConversionMode,
  identifyFormat,
  registerFormat,
  registerConversion,
  createConverter,
  generateFormatCode,
  generateConverterCode
} from '../format-registry';

// Example 1: Basic Format Detection
function detectFileFormat(filename: string) {
  console.log(`\n---\nDetecting format for file: ${filename}`);
  
  const formatKey = identifyFormat(filename);
  if (formatKey) {
    const format = registry.formats[formatKey];
    console.log(`Detected format: ${format.name} (${formatKey})`);
    console.log(`MIME type: ${format.mime}`);
    return formatKey;
  } else {
    console.log(`Unknown format for file: ${filename}`);
    return null;
  }
}

// Example 2: Registering a new format
function registerNewFormat() {
  console.log('\n---\nRegistering new AVIF format');
  
  // Using the code generator to create appropriate registration code
  const codeSnippet = generateFormatCode(
    'avif',
    'AVIF Image',
    '.avif',
    'image/avif',
    ['AVIF', 'avif', 'Avif'],
    'AV1 Image File Format'
  );
  
  console.log('Generated code:');
  console.log(codeSnippet);
  
  // Actually register the format
  registerFormat('avif', {
    name: 'AVIF Image',
    ext: '.avif',
    mime: 'image/avif',
    variations: ['AVIF', 'avif', 'Avif'],
    description: 'AV1 Image File Format'
  });
  
  console.log('Format registered! Available formats:');
  console.log(Object.keys(registry.formats).join(', '));
  
  return 'avif';
}

// Example 3: Create a converter between formats
function createNewConverter(source: string, target: string) {
  console.log(`\n---\nCreating converter from ${source} to ${target}`);
  
  // Generate code for the conversion
  const codeSnippet = generateConverterCode(source, target);
  console.log('Generated code:');
  console.log(codeSnippet);
  
  // Actually create the converter
  const key = createConverter(source, target);
  
  if (key) {
    console.log(`Converter created with key: ${key}`);
    console.log('Converter details:', registry.conversions[key]);
    return key;
  } else {
    console.log(`Failed to create converter from ${source} to ${target}`);
    return null;
  }
}

// Example 4: Automatic conversion pipeline
function demonstrateConversionPipeline(filename: string, targetFormat: string) {
  console.log(`\n---\nConversion pipeline: ${filename} → ${targetFormat}`);
  
  // Step 1: Identify the source format
  const sourceFormatKey = identifyFormat(filename);
  if (!sourceFormatKey) {
    console.log(`Error: Could not identify format of ${filename}`);
    return;
  }
  
  console.log(`Source format identified: ${sourceFormatKey}`);
  
  // Step 2: Normalize target format (handle both extensions and format keys)
  let targetFormatKey = targetFormat;
  if (targetFormat.startsWith('.')) {
    const format = getFormatByExtension(targetFormat);
    if (!format) {
      console.log(`Error: Unknown target format ${targetFormat}`);
      return;
    }
    targetFormatKey = Object.keys(registry.formats).find(key => registry.formats[key] === format) || '';
  }
  
  console.log(`Target format identified: ${targetFormatKey}`);
  
  // Step 3: Find or create a conversion mode
  let conversionKey = Object.keys(registry.conversions).find(key => {
    const conversion = registry.conversions[key];
    return conversion.source === sourceFormatKey && conversion.target === targetFormatKey;
  });
  
  if (!conversionKey) {
    console.log(`No existing conversion found, creating one...`);
    conversionKey = createConverter(sourceFormatKey, targetFormatKey);
    if (!conversionKey) {
      console.log(`Error: Failed to create converter from ${sourceFormatKey} to ${targetFormatKey}`);
      return;
    }
  }
  
  console.log(`Using conversion: ${conversionKey}`);
  
  // Step 4: In a real implementation, we would now:
  // - Open the source file using the source format's loader
  // - Process the data
  // - Save using the target format's encoder
  console.log(
    `Conversion process would use: \n` +
    `- Source format handler: ${registry.formats[sourceFormatKey].name}\n` +
    `- Target format handler: ${registry.formats[targetFormatKey].name}\n` +
    `- Conversion settings: ${registry.conversions[conversionKey].name}`
  );
  
  const outputFilename = filename.replace(/\.[^.]+$/, '') + registry.formats[targetFormatKey].ext;
  console.log(`Output would be saved as: ${outputFilename}`);
}

// Run the examples
export function runExamples() {
  // Example 1: Detect formats for various files
  detectFileFormat('vacation_photo.heic');
  detectFileFormat('document.jpg');
  detectFileFormat('screenshot.png');
  detectFileFormat('unknown.xyz'); // Unknown format
  
  // Example 2: Register a new format
  const avifFormat = registerNewFormat();
  
  // Example 3: Create new converters
  createNewConverter('heic', 'avif');
  createNewConverter('avif', 'jpg');
  
  // Example 4: Demonstrate conversion pipeline
  demonstrateConversionPipeline('family_photo.heic', 'jpg');
  demonstrateConversionPipeline('screenshot.png', '.avif'); // Using extension instead of key
}

// Uncomment to run examples directly
// runExamples();
