# Comprehensive Format Reference Replacement

## The Problem

The current approach to variant creation has several critical weaknesses:

1. **Hidden Format References**: Format-specific strings may be embedded throughout the codebase in:
   - Variable and function names
   - Type definitions and interfaces
   - Comments and documentation 
   - Helper methods and utility functions
   - Error messages and user-facing text

2. **Inconsistent Replacement**: Simple string replacement is inadequate because:
   - It fails to understand code context
   - It might replace portions of unrelated words
   - It misses references in camelCase or other variations
   - It doesn't handle format combinations correctly

3. **Documentation/Code Mismatch**: Even if the code works functionally, having documentation reference the wrong formats leads to:
   - Developer confusion
   - Debugging difficulties
   - Maintenance problems
   - Loss of trust in the codebase

## Comprehensive Solution

We will implement a more sophisticated format replacement system that operates at multiple levels:

### 1. AST-Based Code Analysis and Transformation

Rather than simple string replacement, we'll use Abstract Syntax Tree (AST) analysis to understand code context:

```javascript
// Using a JavaScript parser like babel or typescript to parse code into an AST
const ast = parser.parse(sourceCode);

// Use AST traversal to find identifiers in context
traverse(ast, {
  Identifier(path) {
    // Check if identifier contains format reference
    if (containsFormatReference(path.node.name)) {
      // Replace with appropriate variant while preserving casing and context
      path.node.name = transformFormatReference(path.node.name, sourceFormat, targetFormat);
    }
  },
  StringLiteral(path) {
    // Handle string literals that might contain format references
    if (containsFormatReference(path.node.value)) {
      path.node.value = transformFormatReference(path.node.value, sourceFormat, targetFormat);
    }
  },
  // Add handlers for JSDoc, comments, etc.
});
```

### 2. Comment and Documentation Scanning

We'll specifically scan comments and documentation, understanding their context:

```javascript
// Process comments in the AST
ast.comments.forEach(comment => {
  // Replace format references in comments while preserving structure
  comment.value = replaceFormatReferencesInText(
    comment.value,
    sourceFormat,
    targetFormat,
    { preserveCodeBlocks: true }
  );
});
```

### 3. Comprehensive Format Registry

We'll maintain a comprehensive registry of format-related terms and their variations:

```json
{
  "heic": {
    "variations": ["HEIC", "heic", "Heic", "HEIF", "heif"],
    "compounds": ["heicToJpg", "HeicToJpg", "HEIC_TO_JPG"],
    "codeReferences": ["HeicConverter", "processHeic"],
    "naturalLanguage": ["HEIC file", "High Efficiency Image Container"]
  }
}
```

### 4. Context-Aware Replacement Rules

Different replacement strategies for different contexts:

- **Type Names**: Follow PascalCase convention (`HeicToJpgConverter` → `MkvToMp4Converter`)
- **Variables**: Follow camelCase convention (`heicFile` → `mkvFile`)
- **Comments**: Preserve sentence structure and formatting
- **String Literals**: Maintain quotes and escaping

### 5. Verification Stage

After transformation, perform verification to catch missed replacements:

```javascript
// Scan generated code for any remaining source format references
const remainingReferences = findAllFormatReferences(generatedCode, sourceFormat);

if (remainingReferences.length > 0) {
  console.warn("Warning: Found potential missed format references:", remainingReferences);
  // Provide detailed location information for manual review
}
```

### 6. Test Case Generation

For each variant, automatically generate tests that verify:

- All references to the original format are gone
- The new format is correctly referenced throughout 
- Documentation accurately describes the current format
- Error messages mention the correct formats

## Implementation Plan

1. **Create Format Reference Database**:
   - Document all format names and variations
   - Map relationships between formats
   - Identify context-specific patterns

2. **Build AST Transformation Tools**:
   - Implement AST-based code scanning
   - Create context-aware replacement rules
   - Build a verification system

3. **Enhance Variant Creation Script**:
   - Integrate AST transformation
   - Add verification stage
   - Generate variant-specific tests

4. **Documentation Update**:
   - Document the transformation process
   - Provide guidelines for adding new formats
   - Create troubleshooting guide for edge cases

## Conclusion

This comprehensive approach ensures that when creating a new variant (e.g., MP4ToMOV), all references to the original formats are properly replaced throughout the codebase, including code, comments, and documentation. This significantly reduces the risk of confusion, bugs, and maintenance issues in the future.

---

Last updated: April 30, 2025