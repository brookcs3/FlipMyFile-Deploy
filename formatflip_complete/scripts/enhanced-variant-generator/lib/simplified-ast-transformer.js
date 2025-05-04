/**
 * Simplified AST-like Transformer
 * 
 * A self-contained implementation that doesn't rely on external dependencies.
 * This provides basic AST-like capabilities without needing Babel or Acorn.
 */

/**
 * Tokenizer for creating a simple token stream from JavaScript
 * @param {string} code - The source code
 * @returns {Array} Array of tokens
 */
function tokenize(code) {
  // Token types
  const STRING = 'string';
  const IDENTIFIER = 'identifier';
  const KEYWORD = 'keyword';
  const PUNCTUATION = 'punctuation';
  const OPERATOR = 'operator';
  const NUMBER = 'number';
  const WHITESPACE = 'whitespace';
  const COMMENT = 'comment';
  
  // JavaScript keywords
  const keywords = new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
    'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
    'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch',
    'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
    'let', 'static', 'enum', 'await', 'implements', 'package', 'protected',
    'interface', 'private', 'public', 'null', 'true', 'false', 'from', 'as'
  ]);
  
  const tokens = [];
  let pos = 0;
  
  while (pos < code.length) {
    let char = code[pos];
    
    // Whitespace
    if (/\s/.test(char)) {
      const start = pos;
      while (pos < code.length && /\s/.test(code[pos])) {
        pos++;
      }
      tokens.push({ type: WHITESPACE, value: code.slice(start, pos), start, end: pos });
      continue;
    }
    
    // Comments
    if (char === '/' && code[pos + 1] === '/') {
      const start = pos;
      pos += 2; // Skip '//' 
      while (pos < code.length && code[pos] !== '\n') {
        pos++;
      }
      tokens.push({ type: COMMENT, value: code.slice(start, pos), start, end: pos });
      continue;
    }
    
    if (char === '/' && code[pos + 1] === '*') {
      const start = pos;
      pos += 2; // Skip '/*'
      while (pos < code.length && !(code[pos] === '*' && code[pos + 1] === '/')) {
        pos++;
      }
      pos += 2; // Skip '*/'
      tokens.push({ type: COMMENT, value: code.slice(start, pos), start, end: pos });
      continue;
    }
    
    // String literals
    if (char === '"' || char === "'" || char === '`') {
      const quote = char;
      const start = pos;
      pos++; // Skip opening quote
      
      while (pos < code.length) {
        if (code[pos] === '\\') {
          pos += 2; // Skip escape character and the escaped character
          continue;
        }
        if (code[pos] === quote) {
          pos++; // Include closing quote
          break;
        }
        pos++;
      }
      
      tokens.push({ type: STRING, value: code.slice(start, pos), start, end: pos });
      continue;
    }
    
    // Numbers
    if (/\d/.test(char)) {
      const start = pos;
      while (pos < code.length && /[\d.xe]/i.test(code[pos])) {
        pos++;
      }
      tokens.push({ type: NUMBER, value: code.slice(start, pos), start, end: pos });
      continue;
    }
    
    // Identifiers and keywords
    if (/[a-z_$]/i.test(char)) {
      const start = pos;
      while (pos < code.length && /[\w$]/i.test(code[pos])) {
        pos++;
      }
      const value = code.slice(start, pos);
      const type = keywords.has(value) ? KEYWORD : IDENTIFIER;
      tokens.push({ type, value, start, end: pos });
      continue;
    }
    
    // Operators and punctuation
    const operatorsAndPunctuation = new Set([
      '+', '-', '*', '/', '%', '++', '--', '=', '+=', '-=', '*=', '/=', '%=',
      '==', '===', '!=', '!==', '>', '<', '>=', '<=', '&&', '||', '!', '&', '|', '^', '~',
      '<<', '>>', '>>>', '?', ':', '=>', '.', ',', ';', '(', ')', '[', ']', '{', '}'
    ]);
    
    // Try to match multi-character operators first
    let matched = false;
    for (let i = 3; i >= 1; i--) {
      const potential = code.slice(pos, pos + i);
      if (operatorsAndPunctuation.has(potential)) {
        tokens.push({ type: /[()\[\]{}.,;]/.test(potential) ? PUNCTUATION : OPERATOR, value: potential, start: pos, end: pos + i });
        pos += i;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      // Skip over any unrecognized characters
      console.warn(`Unrecognized character at position ${pos}: ${char}`);
      pos++;
    }
  }
  
  return tokens;
}

/**
 * Find identifiers and string literals in the code that match the format patterns
 * @param {string} code - Source code
 * @param {Object} sourceConfig - Source format configuration
 * @param {Object} targetConfig - Target format configuration
 * @param {Object} registry - Format registry
 * @returns {Array} Array of transformations to apply
 */
function findMatches(code, sourceConfig, targetConfig, registry) {
  const tokens = tokenize(code);
  const transformations = [];
  
  // Get format details
  const sourceFormat = registry.formats[sourceConfig.source];
  const targetFormat = registry.formats[targetConfig.source];
  const sourceTargetFormat = registry.formats[sourceConfig.target];
  const targetTargetFormat = registry.formats[targetConfig.target];
  
  if (!sourceFormat || !targetFormat || !sourceTargetFormat || !targetTargetFormat) {
    throw new Error(`Invalid format configuration`);
  }
  
  // Process all tokens
  tokens.forEach(token => {
    if (token.type === 'identifier') {
      // Look for format-specific naming patterns in identifiers
      let modified = token.value;
      let changedName = false;
      
      // Skip identifiers in parameter positions
      const tokenIndex = tokens.indexOf(token);
      if (tokenIndex > 0 && tokens[tokenIndex - 1].value === '(' && 
          tokens.slice(0, tokenIndex).some(t => t.value === 'function' || t.value === '=>')) {
        return; // Skip parameter names
      }
      
      // Check naming variations
      sourceConfig.namingVariations.forEach((variation, i) => {
        if (token.value.includes(variation)) {
          const targetVariation = targetConfig.namingVariations[i] || targetConfig.namingVariations[0];
          modified = modified.replace(new RegExp(escapeRegExp(variation), 'g'), targetVariation);
          changedName = true;
        }
      });
      
      if (changedName) {
        transformations.push({
          start: token.start,
          end: token.end,
          value: modified,
          type: 'identifier'
        });
      }
    }
    
    if (token.type === 'string') {
      // Get the actual string content without quotes
      const quoteChar = token.value[0];
      const stringContent = token.value.slice(1, -1); // Remove quotes
      let modified = stringContent;
      let changedString = false;
      
      // Check for error codes which should not be transformed
      if (stringContent.includes('_CORRUPTED') || 
          stringContent.includes('_ERROR') || 
          stringContent.includes('_FAILED')) {
        return; // Skip error codes
      }
      
      // Transform source format variations in strings
      sourceFormat.variations.forEach((variation, i) => {
        if (stringContent.includes(variation)) {
          const targetVariation = targetFormat.variations[i] || targetFormat.variations[0];
          modified = modified.replace(new RegExp(escapeRegExp(variation), 'g'), targetVariation);
          changedString = true;
        }
      });
      
      // Transform target format variations in strings
      sourceTargetFormat.variations.forEach((variation, i) => {
        if (stringContent.includes(variation)) {
          const targetVariation = targetTargetFormat.variations[i] || targetTargetFormat.variations[0];
          modified = modified.replace(new RegExp(escapeRegExp(variation), 'g'), targetVariation);
          changedString = true;
        }
      });
      
      // Transform MIME types
      sourceFormat.mimeTypes.forEach((mimeType, i) => {
        if (stringContent.includes(mimeType)) {
          const targetMimeType = targetFormat.mimeTypes[i] || targetFormat.mimeTypes[0];
          modified = modified.replace(new RegExp(escapeRegExp(mimeType), 'g'), targetMimeType);
          changedString = true;
        }
      });
      
      // Transform file extensions
      sourceFormat.extensions.forEach((extension, i) => {
        if (stringContent.includes(extension)) {
          const targetExtension = targetFormat.extensions[i] || targetFormat.extensions[0];
          modified = modified.replace(new RegExp(escapeRegExp(extension), 'g'), targetExtension);
          changedString = true;
        }
      });
      
      if (changedString) {
        // Adjust positions to account for quotes
        transformations.push({
          start: token.start + 1, // +1 to skip opening quote
          end: token.end - 1,    // -1 to skip closing quote
          value: modified,
          type: 'string'
        });
      }
    }
  });
  
  return transformations;
}

/**
 * Helper function to escape regex special characters
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Apply transformations to source code
 * @param {string} code - Source code
 * @param {Array} transformations - Transformations to apply
 * @returns {string} - Transformed code
 */
function applyTransformations(code, transformations) {
  // Sort transformations in reverse order to avoid position shifts
  transformations.sort((a, b) => b.start - a.start);
  
  let result = code;
  transformations.forEach(transform => {
    result = 
      result.substring(0, transform.start) + 
      transform.value + 
      result.substring(transform.end);
  });
  
  return result;
}

/**
 * Apply format-specific transformations based on the conversion type
 * @param {string} code - Transformed code
 * @param {string} sourceMode - Source conversion mode
 * @param {string} targetMode - Target conversion mode
 * @returns {string} - Further transformed code
 */
function applyFormatSpecificTransformations(code, sourceMode, targetMode) {
  let result = code;
  
  // Apply specific transformations for HEIC to AVI/MP4 conversion
  if (sourceMode === 'heicToJpg' && targetMode === 'aviToMp4') {
    // Handle file size references
    result = result.replace(/20\s*MB/g, '200MB');
    result = result.replace(/20\s*\*\s*1024\s*\*\s*1024/g, '200 * 1024 * 1024');
    
    // Handle device-specific phrases
    result = result.replace(/iPhone\s+AVI/gi, 'AVI');
    result = result.replace(/iOS.+?AVI/gi, 'AVI');
    
    // Fix conversion UI text
    result = result.replace(
      /Convert your AVI videos to mp4 format/gi,
      'Convert your AVI videos to MP4 format'
    );
    
    // Fix button text
    result = result.replace(
      /Select AVI Videos/gi,
      'Select AVI Videos'
    );
    
    // Fix headers and titles
    result = result.replace(
      /<h1[^>]*>AVI to MP4 Converter<\/h1>/gi,
      '<h1>AVI to MP4 Converter</h1>'
    );
    
    // Fix meta descriptions
    result = result.replace(
      /content="Convert AVI videos to MP4 format/gi,
      'content="Convert AVI videos to MP4 format'
    );
  }
  
  return result;
}

/**
 * Transform code using simplified AST-like approach
 * @param {string} sourceCode - Source code to transform
 * @param {string} sourceMode - Source conversion mode (e.g., 'heicToJpg')
 * @param {string} targetMode - Target conversion mode (e.g., 'aviToMp4')
 * @param {Object} registry - Format registry with conversion configurations
 * @returns {string} - Transformed code
 */
export function transformWithSimplifiedAST(sourceCode, sourceMode, targetMode, registry) {
  try {
    // Get format configurations
    const sourceConfig = registry.conversionModes[sourceMode];
    const targetConfig = registry.conversionModes[targetMode];
    
    if (!sourceConfig || !targetConfig) {
      throw new Error(`Invalid conversion mode: ${sourceMode} or ${targetMode}`);
    }
    
    // Find matches using our tokenizer
    const transformations = findMatches(sourceCode, sourceConfig, targetConfig, registry);
    
    // Log transformation stats
    const identifiers = transformations.filter(t => t.type === 'identifier').length;
    const strings = transformations.filter(t => t.type === 'string').length;
    console.log(`Found ${transformations.length} transformations: ${identifiers} identifiers, ${strings} strings`);
    
    // Apply transformations to source code
    let transformedCode = applyTransformations(sourceCode, transformations);
    
    // Apply additional format-specific transformations
    transformedCode = applyFormatSpecificTransformations(transformedCode, sourceMode, targetMode);
    
    return transformedCode;
  } catch (error) {
    console.error('Simplified AST transformation error:', error);
    return null; // Return null to indicate failure
  }
}
