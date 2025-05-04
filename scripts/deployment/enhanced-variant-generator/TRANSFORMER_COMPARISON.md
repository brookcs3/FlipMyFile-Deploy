# AST vs Text-Based Transformer Comparison

This document summarizes the key differences between AST-based and text-based code transformation approaches in the HEICFlip variant generator.

## Overview

The transformer system supports two modes of operation:

1. **AST-based transformation**: Uses Babel's Abstract Syntax Tree parsing to understand code structure
2. **Text-based transformation**: Uses regex-based string replacement for simpler but less precise transformations

## Comparative Analysis

| Aspect | AST-Based Transformer | Text-Based Transformer |
|--------|----------------------|------------------------|
| **Transformation Rate** | ~56% (more selective) | ~100% (more comprehensive) |
| **Context Preservation** | High | Low |
| **Parameter Handling** | Preserves parameter names | May transform parameter names incorrectly |
| **String Replacement** | Only in string contexts | In all contexts |
| **Template Literals** | Limited handling | Full replacement |
| **Error Handling** | May fail on complex syntax | More resilient to syntax errors |
| **Performance** | Slower (parsing overhead) | Faster (direct replacement) |

## Specific Strengths

### AST-Based Transformer

✓ **Context-aware**: Understands code structure and only transforms appropriate elements
✓ **Scope-sensitive**: Preserves variables in parameter scope 
✓ **Structure-preserving**: Maintains code structure and formatting
✓ **Selective transformation**: Avoids incorrect transformations in sensitive contexts

### Text-Based Transformer

✓ **Comprehensive**: Transforms all occurrences of target strings
✓ **Resilient**: Works even with invalid or complex code structures
✓ **Fast**: No parsing overhead
✓ **Template handling**: Better at transforming template literal content

## Current Limitations

### AST-Based Transformer

- Limited transformation of template literals
- Doesn't transform some object properties consistently
- May fail to parse some complex syntax patterns
- Error code strings are sometimes incorrectly transformed

### Text-Based Transformer

- Transforms parameter names inappropriately
- Doesn't respect variable scoping
- Context-insensitive replacements can cause errors
- May transform reserved words or constants that should be preserved

## When to Use Each Approach

- **AST-based transformer**: For production-quality transformations where context preservation is critical
- **Text-based transformer**: For quick prototyping or when AST parsing fails

## Hybrid Approach Benefits

The system uses a hybrid approach that:

1. Attempts AST-based transformation first for precision
2. Falls back to text-based transformation if parsing fails
3. Provides detailed statistics about the transformation process

This approach combines the context-awareness of AST with the resilience of text-based replacement.

## Test Results

Test results consistently show that:

- AST transformation preserves ~8-14 HEIC/JPG occurrences in appropriate contexts
- Text transformation replaces all HEIC/JPG occurrences regardless of context
- Both approaches successfully transform most format references
- AST excels at context preservation, text excels at comprehensive replacement

## Recommendation

For most use cases, the hybrid approach provides the best balance of precision and completeness. Users can explicitly set the transformer mode based on their specific needs.