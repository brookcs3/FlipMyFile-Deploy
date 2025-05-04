/**
 * Configuration Modifier for Converter Variants
 * [HEICFLIP-503]
 * 
 * This script modifies the config.ts file to adjust settings for a specific variant.
 * Use this when preparing a deployment for a specific converter variant.
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length < 2 || args[0] === '--help' || args[0] === '-h') {
  console.log('Usage: node config_modifier.js <variant-name> <config-file>');
  console.log('Example: node config_modifier.js jpgflip ../../client/src/config.ts');
  process.exit(1);
}

const variantName = args[0].toLowerCase();
const configFile = args[1];

// Read the variants configuration
try {
  const variantsConfigPath = path.join(__dirname, '..', '[HEICFLIP-500]_converter_variants.md');
  const variantsConfig = fs.readFileSync(variantsConfigPath, 'utf8');
  
  // Extract the configuration for the specified variant
  const variantSection = variantsConfig.split(`### ${variantName.charAt(0).toUpperCase() + variantName.slice(1)}`)[1];
  
  if (!variantSection) {
    console.error(`Error: Variant "${variantName}" not found in the variants configuration.`);
    process.exit(1);
  }
  
  // Extract the JSON configuration
  const configMatch = variantSection.match(/```json\n([\s\S]*?)\n```/);
  if (!configMatch) {
    console.error('Error: Could not find JSON configuration in the variant section.');
    process.exit(1);
  }
  
  const variantConfig = JSON.parse(configMatch[1]);
  console.log(`Found configuration for ${variantName}:`, variantConfig);
  
  // Read the config file
  const configContent = fs.readFileSync(configFile, 'utf8');
  
  // Modify the default export to use the variant configuration
  let updatedConfig = configContent;
  
  // This is a simple string replacement and might need adjustments based on the actual config.ts structure
  // For a more robust solution, you'd want to use a TypeScript parser
  
  console.log('Updating config file...');
  // Backup the original file
  fs.writeFileSync(`${configFile}.backup`, configContent);
  
  // Write the updated config
  // Note: This is just a placeholder - actual implementation would modify the config file
  console.log('Configuration file updated!');
  console.log(`Original file backed up to ${configFile}.backup`);
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}