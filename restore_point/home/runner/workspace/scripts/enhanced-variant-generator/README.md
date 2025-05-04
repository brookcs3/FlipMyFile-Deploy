# Enhanced Variant Generator

This is an advanced code generation and transformation system for creating new format-specific converter variants in the HEICFlip monorepo.

## Overview

The Enhanced Variant Generator uses Abstract Syntax Tree (AST) based transformation to ensure comprehensive and accurate format reference replacement throughout the entire codebase, including:

- Variable and function names
- Type declarations
- Class definitions
- Comments and documentation
- String literals and messages
- Error handling code

## Components

### 1. Format Registry

The `format-registry.json` file contains a comprehensive database of:

- Format names and variations (e.g., HEIC, heic, Heic)
- Format-specific compound terms (e.g., heicToJpg, HeicConverter)
- Naming patterns for different contexts (PascalCase for classes, camelCase for functions)
- Format-specific text in comments and documentation

### 2. AST Transformer

The `ast-transform.js` module provides AST-based code transformation:

- Parses code into an Abstract Syntax Tree
- Traverses the tree, identifying format-specific references
- Replaces references based on context-aware rules
- Preserves code structure and formatting
- Handles comments and documentation separately

### 3. Verification System

The verification system ensures no source format references remain after transformation:

- Scans transformed code for potential missed references
- Reports specific locations and contexts for any remaining references
- Provides confidence in the completeness of the transformation

## Usage

The enhanced variant creation process works as follows:

1. Run the enhanced variant generator with source and target formats:

```bash
node scripts/enhanced-variant-generator/create-variant.js \
  --name=mkvflip \
  --mode=mkvToMp4 \
  --color=#00A878
```

2. The generator will:
   - Create the basic directory structure for the variant
   - Generate template files using format-specific registry data
   - Transform all code using AST-based processing
   - Verify the completeness of the transformation
   - Generate format-specific tests

3. After generation, review the verification report to ensure no format references were missed

## Dependencies

- `@babel/parser`: For parsing code into AST
- `@babel/traverse`: For traversing and manipulating AST
- `@babel/generator`: For generating code from transformed AST
- `@babel/types`: For working with AST node types

## Development

To maintain and enhance this system:

1. When adding new formats, update the `format-registry.json` file with the new format details
2. For complex naming patterns, add pattern recognition rules to the AST transformer
3. Add verification rules for new format-specific patterns

## Limitations

- Complex multi-format references might require manual verification
- Some naming patterns could be ambiguous and might need human review
- Extremely complex type definitions might need manual adjustment

---

Last updated: April 30, 2025