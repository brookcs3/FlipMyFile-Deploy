/**
 * Transformer Mode Configuration
 * 
 * This module allows toggling between AST-based and text-based transformers.
 * It respects environment variables and provides a clean API for switching.
 */

// Default transformer mode
// - true: Use AST-based transformation (with fallback to text-based if AST fails)
// - false: Use text-based transformation only (more reliable but less precise)
let useAST = true;

// Check environment variable for transformer mode
if (typeof process !== 'undefined' && process.env) {
  // Environment-based configuration (useful for CI/CD)
  const envMode = process.env.TRANSFORMER_MODE;
  if (envMode === 'ast') {
    useAST = true;
    console.log('Using AST-based transformation mode (from environment)');
  } else if (envMode === 'text') {
    useAST = false;
    console.log('Using text-based transformation mode (from environment)');
  } else if (envMode) {
    console.warn(`Unknown transformer mode "${envMode}", using default`);
  } else {
    console.log('Using AST-based transformation mode');
  }
}

/**
 * Check if AST-based transformation is enabled
 * 
 * @returns {boolean} - True if AST-based transformation is enabled
 */
export function isASTEnabled() {
  return useAST;
}

/**
 * Get the current transformer mode
 * 
 * @returns {string} - 'ast' or 'text'
 */
export function getTransformerMode() {
  return useAST ? 'ast' : 'text';
}

/**
 * Set the transformer mode
 * 
 * @param {boolean|string} useASTMode - Whether to use AST-based transformation
 *    Can be boolean, or string 'ast'|'text'
 */
export function setTransformerMode(useASTMode) {
  if (typeof useASTMode === 'string') {
    // Handle string values
    useAST = useASTMode === 'ast';
  } else {
    // Handle boolean values
    useAST = !!useASTMode;
  }
  console.log(`Transformer mode set to: ${getTransformerMode()}`);
}

// Command line interface if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`Current transformer mode: ${getTransformerMode()}`);
    process.exit(0);
  }
  
  if (args[0] === 'ast') {
    setTransformerMode('ast');
    console.log('Transformer mode set to AST-based');
  } else if (args[0] === 'text') {
    setTransformerMode('text');
    console.log('Transformer mode set to text-based');
  } else {
    console.error('Usage: node transformer-mode.js [ast|text]');
    process.exit(1);
  }
}