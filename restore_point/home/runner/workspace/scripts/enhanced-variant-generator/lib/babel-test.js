/**
 * Babel Test Module
 * 
 * This script tests the compatibility of Babel with the current environment
 * to diagnose and resolve any module-related issues.
 */

import { loadBabelModules } from './babel-wrapper.js';

async function testBabelCompat() {
  console.log('Testing Babel compatibility...');
  
  try {
    // Try to dynamically import the babel modules
    const { parser, traverse, generate, t } = await loadBabelModules();
    
    if (!parser || !traverse || !generate || !t) {
      console.error('One or more Babel modules failed to load.');
      return false;
    }
    
    // Test basic parsing and code generation
    const sourceCode = "const test = () => { console.log('hello world'); };";
    
    console.log('Parsing source code...');
    const ast = parser.parse(sourceCode, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    
    console.log('Traversing AST...');
    traverse(ast, {
      Identifier(path) {
        console.log(`Found identifier: ${path.node.name}`);
      }
    });
    
    console.log('Generating code...');
    const output = generate(ast, { comments: true });
    
    console.log('Generated code:', output.code);
    console.log('Babel is working correctly!');
    return true;
  } catch (error) {
    console.error('Babel compatibility test failed:', error);
    return false;
  }
}

// Execute the test
testBabelCompat().then(success => {
  if (success) {
    console.log('✅ Babel compatibility test passed');
  } else {
    console.log('❌ Babel compatibility test failed');
  }
});