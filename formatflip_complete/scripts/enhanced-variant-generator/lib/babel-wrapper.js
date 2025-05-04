/**
 * Babel Wrapper Module
 * 
 * This module provides a consistent interface to Babel packages,
 * handling the differences between ES modules and CommonJS modules.
 */

/**
 * Load Babel modules
 * 
 * @returns {Object} Object containing Babel modules
 */
export async function loadBabelModules() {
  try {
    // Import Babel modules with dynamic import
    const parserModule = await import('@babel/parser');
    const traverseModule = await import('@babel/traverse');
    const generateModule = await import('@babel/generator');
    const typesModule = await import('@babel/types');
    
    // Log module formats to help debug
    console.log('Traverse module type:', typeof traverseModule);
    if (typeof traverseModule === 'object') {
      console.log('Traverse module keys:', Object.keys(traverseModule));
    }
    
    // Special handling for @babel/traverse which has a different export pattern
    // In ESM environments we've observed different patterns
    let traverse;
    
    // Log the structure for debugging
    console.log('Traverse module structure:');
    if (traverseModule.default) {
      console.log('- Has default export');
      traverse = traverseModule.default;
    } else if (typeof traverseModule === 'function') {
      console.log('- Is a function directly');
      traverse = traverseModule;
    } else if (traverseModule.traverse) {
      console.log('- Has traverse property');
      traverse = traverseModule.traverse;
    } else if (traverseModule.__esModule && traverseModule.default) {
      console.log('- Is an ES module with default export');
      traverse = traverseModule.default;
    }
    
    // If traverse is still not a function but we have the module,
    // create a custom implementation that handles object structure
    if (typeof traverse !== 'function' && typeof traverseModule === 'object') {
      console.log('- Creating custom traverse wrapper around object structure');
      
      // Create wrapper that works with the object structure
      traverse = function customTraverse(ast, visitors) {
        // If we have visitors.default, use that (for compatibility)
        const finalVisitors = visitors.default ? visitors.default : visitors;
        
        // Implementation that walks the AST nodes
        function traverseNode(node, parent) {
          if (!node || typeof node !== 'object') return;
          
          // Apply visitor for this node type if available
          const visitorForType = finalVisitors[node.type];
          if (visitorForType) {
            // Create a more comprehensive path object similar to Babel's
            const path = {
              node: node,
              parent: parent,
              parentPath: parent ? { node: parent } : null,
              
              // Common path methods
              traverse: (subNode) => traverseNode(subNode, node),
              
              // Mutation methods
              replaceWith: (newNode) => { 
                // Copy properties from newNode to node
                Object.keys(node).forEach(key => {
                  delete node[key];
                });
                Object.assign(node, newNode);
              },
              
              // Simple method to replace a string
              replaceWithSourceString: (sourceString) => {
                if (node.type === 'StringLiteral') {
                  node.value = sourceString;
                } else if (node.type === 'Identifier') {
                  node.name = sourceString;
                }
              }
            };
            
            // Call the visitor
            if (typeof visitorForType === 'function') {
              visitorForType(path);
            } else if (visitorForType.enter) {
              visitorForType.enter(path);
            }
          }
          
          // Traverse child nodes
          for (const key in node) {
            if (key === 'type' || key === 'loc' || !node[key]) continue;
            
            if (Array.isArray(node[key])) {
              // Traverse array of nodes
              node[key].forEach(child => {
                if (child && typeof child === 'object' && child.type) {
                  traverseNode(child, node);
                }
              });
            } else if (node[key].type) {
              // Traverse single node
              traverseNode(node[key], node);
            }
          }
          
          // Apply exit visitor if available
          if (visitorForType && visitorForType.exit) {
            // Use the same path API for consistency
            const path = {
              node: node,
              parent: parent,
              parentPath: parent ? { node: parent } : null,
              
              // Common path methods
              traverse: (subNode) => traverseNode(subNode, node),
              
              // Mutation methods
              replaceWith: (newNode) => { 
                // Copy properties from newNode to node
                Object.keys(node).forEach(key => {
                  delete node[key];
                });
                Object.assign(node, newNode);
              },
              
              // Simple method to replace a string
              replaceWithSourceString: (sourceString) => {
                if (node.type === 'StringLiteral') {
                  node.value = sourceString;
                } else if (node.type === 'Identifier') {
                  node.name = sourceString;
                }
              }
            };
            
            visitorForType.exit(path);
          }
        }
        
        // Start traversing from the root
        traverseNode(ast, null);
      };
      
      console.log('Custom traverse wrapper created');
    }
    
    // Extract other exports correctly
    const parser = parserModule.default || parserModule;
    
    // Handle generator module specially
    let generate;
    if (typeof generateModule === 'function') {
      generate = generateModule;
    } else if (generateModule.default && typeof generateModule.default === 'function') {
      generate = generateModule.default;
    } else if (generateModule.generate && typeof generateModule.generate === 'function') {
      generate = generateModule.generate;
    } else {
      // Create a simple generator if none available
      console.log('Creating custom generator function');
      generate = (ast, options = {}) => {
        // Simple generator that converts AST back to code
        // This is limited but serves as a fallback
        let code = '';
        function traverse(node) {
          if (!node || typeof node !== 'object') return '';
          
          if (node.type === 'StringLiteral') {
            return `"${node.value}"`;
          } else if (node.type === 'NumericLiteral') {
            return node.value.toString();
          } else if (node.type === 'Identifier') {
            return node.name;
          } else if (node.type === 'Program') {
            return node.body.map(traverse).join('\n');
          }
          
          // Default case - return original source if available
          return node.source || '';
        }
        
        // Return code and map
        return {
          code: traverse(ast),
          map: null
        };
      };
    }
    
    const types = typesModule.default || typesModule;
    
    // Validate the traverse function
    if (typeof traverse !== 'function') {
      throw new Error(`Traverse is not a function, got ${typeof traverse}`);
    }
    
    return {
      parser,
      traverse,
      generate,
      types
    };
  } catch (error) {
    console.error('Error loading Babel modules:', error);
    throw error;
  }
}

/**
 * Parse code with Babel parser
 * 
 * @param {Object} parser - Babel parser module
 * @param {string} code - Code to parse
 * @param {Object} options - Parser options
 * @returns {Object} AST object
 */
export function parseCode(parser, code, options = {}) {
  const defaultOptions = {
    sourceType: 'module',
    plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy'],
    attachComments: true
  };
  
  return parser.parse(code, { ...defaultOptions, ...options });
}

/**
 * Generate code from AST
 * 
 * @param {Object} generate - Babel generator module
 * @param {Object} ast - AST to generate code from
 * @param {Object} options - Generator options
 * @returns {Object} Generated code with sourcemap
 */
export function generateCode(generate, ast, options = {}) {
  const defaultOptions = {
    comments: true,
    compact: false,
    jsescOption: {
      quotes: 'single'
    }
  };
  
  return generate(ast, { ...defaultOptions, ...options });
}

/**
 * Traverse AST with visitors
 * 
 * @param {Object} traverse - Babel traverse module
 * @param {Object} ast - AST to traverse
 * @param {Object} visitors - Visitor functions
 * @returns {void}
 */
export function traverseAst(traverse, ast, visitors) {
  if (typeof traverse !== 'function') {
    throw new Error(`Expected traverse to be a function, got ${typeof traverse}`);
  }
  
  traverse(ast, visitors);
}