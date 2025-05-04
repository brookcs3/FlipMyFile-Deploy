/**
 * Branding and UI Validation System
 * 
 * This module provides tools to validate that all branding and UI elements
 * have been properly transformed when creating a new variant.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');
const { parse } = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const postcss = require('postcss');

/**
 * Load format registry
 */
function loadFormatRegistry() {
  const registryPath = path.join(__dirname, 'format-registry.json');
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

/**
 * Check a directory for any remaining references to the source format
 * @param {string} directory Directory to scan
 * @param {string} sourceMode Source conversion mode
 * @returns {Object} Report of remaining references
 */
function validateDirectory(directory, sourceMode) {
  const registry = loadFormatRegistry();
  const sourceConfig = registry.conversionModes[sourceMode];
  const sourceFormat = registry.formats[sourceConfig.source];
  const sourceTargetFormat = registry.formats[sourceConfig.target];
  
  // Initialize results
  const results = {
    total: 0,
    byFileType: {
      js: { count: 0, files: {} },
      jsx: { count: 0, files: {} },
      tsx: { count: 0, files: {} },
      css: { count: 0, files: {} },
      svg: { count: 0, files: {} },
      html: { count: 0, files: {} },
      md: { count: 0, files: {} },
      json: { count: 0, files: {} }
    }
  };
  
  // Build list of terms to check
  const termsToCheck = [
    ...sourceFormat.variations,
    ...sourceTargetFormat.variations,
    ...sourceConfig.namingVariations
  ];
  
  // Find all files in the directory
  const files = glob.sync(`${directory}/**/*.{js,jsx,tsx,css,svg,html,md,json}`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
  });
  
  // Process each file
  files.forEach(file => {
    const extension = path.extname(file).slice(1);
    if (!results.byFileType[extension]) {
      results.byFileType[extension] = { count: 0, files: {} };
    }
    
    const content = fs.readFileSync(file, 'utf8');
    const fileResults = validateFile(file, content, termsToCheck);
    
    if (fileResults.length > 0) {
      results.byFileType[extension].count += fileResults.length;
      results.byFileType[extension].files[file] = fileResults;
      results.total += fileResults.length;
    }
  });
  
  return results;
}

/**
 * Validate a single file for format references
 * @param {string} filePath Path to the file
 * @param {string} content File content
 * @param {Array} termsToCheck Terms to check for
 * @returns {Array} Array of found references
 */
function validateFile(filePath, content, termsToCheck) {
  const extension = path.extname(filePath).slice(1);
  const foundReferences = [];
  
  // Different validation strategies based on file type
  switch (extension) {
    case 'js':
    case 'jsx':
    case 'tsx':
      foundReferences.push(...validateJavaScript(content, termsToCheck));
      break;
    case 'css':
      foundReferences.push(...validateCSS(content, termsToCheck));
      break;
    case 'svg':
      foundReferences.push(...validateSVG(content, termsToCheck));
      break;
    case 'html':
      foundReferences.push(...validateHTML(content, termsToCheck));
      break;
    case 'md':
      foundReferences.push(...validateMarkdown(content, termsToCheck));
      break;
    case 'json':
      foundReferences.push(...validateJSON(content, termsToCheck));
      break;
  }
  
  return foundReferences;
}

/**
 * Validate JavaScript/TypeScript/JSX files
 * @param {string} content File content
 * @param {Array} termsToCheck Terms to check for
 * @returns {Array} Array of found references
 */
function validateJavaScript(content, termsToCheck) {
  const foundReferences = [];
  
  try {
    // Parse the code
    const ast = parse(content, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      attachComments: true
    });
    
    // Check identifiers
    traverse(ast, {
      Identifier(path) {
        const name = path.node.name;
        
        termsToCheck.forEach(term => {
          if (name.includes(term)) {
            foundReferences.push({
              type: 'identifier',
              value: name,
              term,
              location: path.node.loc,
              context: getNodeContext(path)
            });
          }
        });
      },
      
      StringLiteral(path) {
        const value = path.node.value;
        
        termsToCheck.forEach(term => {
          if (value.includes(term)) {
            foundReferences.push({
              type: 'string',
              value,
              term,
              location: path.node.loc,
              context: getNodeContext(path)
            });
          }
        });
      },
      
      JSXText(path) {
        const text = path.node.value.trim();
        if (!text) return;
        
        termsToCheck.forEach(term => {
          if (text.includes(term)) {
            foundReferences.push({
              type: 'jsxText',
              value: text,
              term,
              location: path.node.loc,
              context: getNodeContext(path)
            });
          }
        });
      }
    });
    
    // Check comments
    if (ast.comments) {
      ast.comments.forEach(comment => {
        termsToCheck.forEach(term => {
          if (comment.value.includes(term)) {
            foundReferences.push({
              type: 'comment',
              value: comment.value,
              term,
              location: comment.loc
            });
          }
        });
      });
    }
  } catch (error) {
    // If parsing fails, fall back to simple string matching
    foundReferences.push(...validateWithRegex(content, termsToCheck));
  }
  
  return foundReferences;
}

/**
 * Validate CSS files
 * @param {string} content File content
 * @param {Array} termsToCheck Terms to check for
 * @returns {Array} Array of found references
 */
function validateCSS(content, termsToCheck) {
  const foundReferences = [];
  
  try {
    // Parse CSS
    const root = postcss.parse(content);
    
    // Check selectors
    root.walkRules(rule => {
      termsToCheck.forEach(term => {
        if (rule.selector.includes(term)) {
          foundReferences.push({
            type: 'cssSelector',
            value: rule.selector,
            term,
            location: rule.source.start
          });
        }
      });
    });
    
    // Check property values
    root.walkDecls(decl => {
      termsToCheck.forEach(term => {
        if (decl.value.includes(term)) {
          foundReferences.push({
            type: 'cssProperty',
            value: decl.value,
            term,
            location: decl.source.start
          });
        }
      });
    });
    
    // Check comments
    root.walkComments(comment => {
      termsToCheck.forEach(term => {
        if (comment.text.includes(term)) {
          foundReferences.push({
            type: 'cssComment',
            value: comment.text,
            term,
            location: comment.source.start
          });
        }
      });
    });
  } catch (error) {
    // If parsing fails, fall back to simple string matching
    foundReferences.push(...validateWithRegex(content, termsToCheck));
  }
  
  return foundReferences;
}

/**
 * Validate SVG files
 * @param {string} content File content
 * @param {Array} termsToCheck Terms to check for
 * @returns {Array} Array of found references
 */
function validateSVG(content, termsToCheck) {
  const foundReferences = [];
  
  try {
    // Parse SVG as HTML
    const $ = cheerio.load(content, { xmlMode: true });
    
    // Check attributes
    $('*').each((i, el) => {
      const attribs = $(el).attr();
      
      Object.keys(attribs).forEach(attr => {
        const value = attribs[attr];
        
        termsToCheck.forEach(term => {
          if (value.includes(term)) {
            foundReferences.push({
              type: 'svgAttribute',
              value,
              term,
              element: el.name,
              attribute: attr
            });
          }
        });
      });
      
      // Check text content
      const text = $(el).text().trim();
      if (text) {
        termsToCheck.forEach(term => {
          if (text.includes(term)) {
            foundReferences.push({
              type: 'svgText',
              value: text,
              term,
              element: el.name
            });
          }
        });
      }
    });
  } catch (error) {
    // If parsing fails, fall back to simple string matching
    foundReferences.push(...validateWithRegex(content, termsToCheck));
  }
  
  return foundReferences;
}

/**
 * Validate HTML files
 * @param {string} content File content
 * @param {Array} termsToCheck Terms to check for
 * @returns {Array} Array of found references
 */
function validateHTML(content, termsToCheck) {
  const foundReferences = [];
  
  try {
    // Parse HTML
    const $ = cheerio.load(content);
    
    // Check all elements
    $('*').each((i, el) => {
      const attribs = $(el).attr();
      
      // Check attributes
      if (attribs) {
        Object.keys(attribs).forEach(attr => {
          const value = attribs[attr];
          
          termsToCheck.forEach(term => {
            if (value.includes(term)) {
              foundReferences.push({
                type: 'htmlAttribute',
                value,
                term,
                element: el.name,
                attribute: attr
              });
            }
          });
        });
      }
      
      // Check text content if it's not a script or style tag
      if (el.name !== 'script' && el.name !== 'style') {
        const text = $(el).text().trim();
        if (text) {
          termsToCheck.forEach(term => {
            if (text.includes(term)) {
              foundReferences.push({
                type: 'htmlText',
                value: text,
                term,
                element: el.name
              });
            }
          });
        }
      }
    });
    
    // Handle scripts separately
    $('script').each((i, el) => {
      const scriptContent = $(el).html();
      if (scriptContent) {
        foundReferences.push(...validateWithRegex(scriptContent, termsToCheck, 'scriptText'));
      }
    });
    
    // Handle styles separately
    $('style').each((i, el) => {
      const styleContent = $(el).html();
      if (styleContent) {
        foundReferences.push(...validateWithRegex(styleContent, termsToCheck, 'styleText'));
      }
    });
  } catch (error) {
    // If parsing fails, fall back to simple string matching
    foundReferences.push(...validateWithRegex(content, termsToCheck));
  }
  
  return foundReferences;
}

/**
 * Validate Markdown files
 * @param {string} content File content
 * @param {Array} termsToCheck Terms to check for
 * @returns {Array} Array of found references
 */
function validateMarkdown(content, termsToCheck) {
  // Use simple regex matching for markdown
  return validateWithRegex(content, termsToCheck, 'markdown');
}

/**
 * Validate JSON files
 * @param {string} content File content
 * @param {Array} termsToCheck Terms to check for
 * @returns {Array} Array of found references
 */
function validateJSON(content, termsToCheck) {
  const foundReferences = [];
  
  try {
    // Parse JSON
    const jsonData = JSON.parse(content);
    
    // Recursively check JSON object
    function checkJsonNode(node, path = '') {
      if (typeof node === 'string') {
        termsToCheck.forEach(term => {
          if (node.includes(term)) {
            foundReferences.push({
              type: 'jsonValue',
              value: node,
              term,
              path
            });
          }
        });
      } else if (Array.isArray(node)) {
        node.forEach((item, index) => {
          checkJsonNode(item, `${path}[${index}]`);
        });
      } else if (typeof node === 'object' && node !== null) {
        Object.keys(node).forEach(key => {
          // Check keys
          termsToCheck.forEach(term => {
            if (key.includes(term)) {
              foundReferences.push({
                type: 'jsonKey',
                value: key,
                term,
                path
              });
            }
          });
          
          // Check values recursively
          checkJsonNode(node[key], path ? `${path}.${key}` : key);
        });
      }
    }
    
    checkJsonNode(jsonData);
  } catch (error) {
    // If parsing fails, fall back to simple string matching
    foundReferences.push(...validateWithRegex(content, termsToCheck));
  }
  
  return foundReferences;
}

/**
 * Validate content using regex
 * @param {string} content Content to check
 * @param {Array} termsToCheck Terms to check for
 * @param {string} type Type of content
 * @returns {Array} Array of found references
 */
function validateWithRegex(content, termsToCheck, type = 'text') {
  const foundReferences = [];
  
  termsToCheck.forEach(term => {
    // Create regex to match the term
    const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'gi');
    let match;
    
    // Find all matches
    while ((match = regex.exec(content)) !== null) {
      // Get the context (line containing the match)
      const lineStart = content.lastIndexOf('\n', match.index) + 1;
      const lineEnd = content.indexOf('\n', match.index);
      const line = content.substring(
        lineStart, 
        lineEnd > -1 ? lineEnd : content.length
      );
      
      foundReferences.push({
        type,
        value: match[0],
        term,
        position: match.index,
        line,
        lineNumber: countLines(content.substring(0, match.index)) + 1
      });
    }
  });
  
  return foundReferences;
}

/**
 * Get context of an AST node
 * @param {Object} path Node path
 * @returns {string} Context description
 */
function getNodeContext(path) {
  let context = '';
  
  if (path.parent.type === 'VariableDeclarator') {
    context = `Variable declaration: ${path.parent.id.name}`;
  } else if (path.parent.type === 'FunctionDeclaration') {
    context = `Function declaration: ${path.parent.id ? path.parent.id.name : 'anonymous'}`;
  } else if (path.parent.type === 'ClassDeclaration') {
    context = `Class declaration: ${path.parent.id ? path.parent.id.name : 'anonymous'}`;
  } else if (path.parent.type === 'MemberExpression') {
    context = 'Object property access';
  } else if (path.parent.type === 'JSXAttribute') {
    context = `JSX attribute: ${path.parent.name.name}`;
  } else if (path.parent.type === 'ImportDeclaration') {
    context = 'Import statement';
  } else if (path.parent.type === 'ExportNamedDeclaration') {
    context = 'Export statement';
  } else {
    context = path.parent.type;
  }
  
  return context;
}

/**
 * Count number of lines in a string
 * @param {string} str String to count lines in
 * @returns {number} Number of lines
 */
function countLines(str) {
  return (str.match(/\n/g) || []).length;
}

/**
 * Escape special characters in a string for use in a regex
 * @param {string} string String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = {
  validateDirectory,
  validateFile
};