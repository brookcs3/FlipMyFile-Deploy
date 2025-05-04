# AST-Based Code Transformation

This document details how the Enhanced Variant Generator uses Abstract Syntax Tree (AST) parsing to perform intelligent, context-aware format transformations across the codebase.

## Why AST-Based Transformation Is Superior

When creating new format variants, a naive approach using simple string replacement would lead to numerous problems:

1. **Over-replacement**: Turning unrelated occurrences (like "cheaper" becoming "cmpvper" when replacing "heic" with "mpv")
2. **Under-replacement**: Missing format references in complex contexts like template strings or JSX
3. **Context loss**: Failing to preserve code structure and formatting during replacement
4. **Case preservation**: Not matching the right case pattern in different contexts

The AST-based approach solves these problems by parsing code into a structured tree representation, allowing for precise, context-aware transformations.

## Implementation Details

The AST transformation process works in three stages:

### 1. Parsing

```javascript
// Parse the source code to generate an AST
const ast = parser.parse(sourceCode, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript', 'classProperties', 'decorators-legacy'],
  attachComments: true
});
```

This creates a complete tree representation of the code, including:
- Variable and function declarations
- Class definitions
- Import/export statements
- JSX elements
- Comments (both block and line comments)

### 2. Tree Traversal and Transformation

The transformer uses Babel's traverse API to visit different node types and apply context-appropriate transformations:

```javascript
// Example: Transform identifiers (variable names, function names, etc.)
Identifier(path) {
  const name = path.node.name;
  
  // Only match whole words or parts of camelCase/PascalCase identifiers
  const regex = new RegExp(
    `(^|[^a-zA-Z0-9])${escapeRegExp(variant)}($|[^a-zA-Z0-9])|` +
    `([a-z])${escapeRegExp(variant)}([A-Z]|$)|` +
    `([A-Z])${escapeRegExp(variant)}([A-Z]|$)`,
    'g'
  );
  
  if (regex.test(name)) {
    // Apply transformation with case-preservation
    if (variant === variant.toUpperCase()) {
      // All uppercase: HEIC → MKV
      newName = newName.replace(
        new RegExp(escapeRegExp(variant), 'g'),
        targetVariant.toUpperCase()
      );
    } else if (variant[0] === variant[0].toUpperCase()) {
      // Pascal case: Heic → Mkv
      newName = newName.replace(
        new RegExp(escapeRegExp(variant), 'g'),
        targetVariant[0].toUpperCase() + targetVariant.slice(1)
      );
    } else {
      // Camel case: heic → mkv
      newName = newName.replace(
        new RegExp(escapeRegExp(variant), 'g'),
        targetVariant.toLowerCase()
      );
    }
  }
}
```

The system processes various node types:

| Node Type | Description | Examples | Transformation Approach |
|-----------|-------------|----------|-------------------------|
| Identifier | Variable/function/class names | `heicFile`, `HeicToJpgConverter` | Case-aware replacement with word boundary detection |
| StringLiteral | String constants | `"Convert your HEIC files"` | Direct replacement with context preservation |
| TemplateLiteral | Template strings | `` `Process ${count} HEIC files` `` | Replace in both static and dynamic parts |
| JSXText | Text in JSX elements | `<p>HEIC to JPG converter</p>` | Format-aware replacement |
| Comments | Code comments | `// Convert HEIC to JPG` | Context-aware replacement |

### 3. Code Generation

After transformation, the modified AST is converted back to code with formatting preserved:

```javascript
// Generate code from the transformed AST
const output = generate(ast, {
  comments: true,
  retainLines: true,
  compact: false
});

// Format the code using prettier
const formattedCode = prettier.format(output.code, {
  parser: 'babel',
  singleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  semi: true,
  printWidth: 100
});
```

## Fallback Strategy

Since not all files can be parsed as valid JavaScript/TypeScript (e.g., JSON, MD files), the system includes a fallback to simpler text-based replacement:

```javascript
function textBasedTransform(sourceCode, sourceMode, targetMode) {
  // Get format information from registry
  const registry = loadFormatRegistry();
  // ...
  
  // Apply transformations with proper escaping
  sourceFormat.variations.forEach((variant, index) => {
    const targetVariant = index < targetFormat.variations.length
      ? targetFormat.variations[index]
      : targetFormat.variations[0];
    
    transformedCode = transformedCode.replace(
      new RegExp(escapeRegExp(variant), 'g'),
      targetVariant
    );
  });
  
  // ...
}
```

This ensures that all files can be processed, even if the optimal AST-based approach isn't applicable.

## Real-World Example: Converting HeicToJpgConverter to MkvToMp4Converter

### Original Code

```typescript
/**
 * HeicToJpgConverter class
 * Converts HEIC images to the more widely supported JPG format.
 */
export class HeicToJpgConverter extends BaseConverter {
  /**
   * Process a HEIC file and convert it to JPG
   * @param heicFile The input HEIC file to convert
   * @returns Promise containing the converted JPG file
   */
  async convert(heicFile: File): Promise<File> {
    console.log(`Converting ${heicFile.name} from HEIC to JPG format`);
    
    // Check if the input is actually a HEIC file
    if (!this.isHeicFile(heicFile)) {
      throw new Error("Input is not a valid HEIC file");
    }
    
    // Convert using HEIC-specific settings
    const jpgBlob = await this.processHeicToJpg(heicFile);
    return new File(
      [jpgBlob], 
      heicFile.name.replace(".heic", ".jpg"),
      { type: "image/jpeg" }
    );
  }
  
  /**
   * Check if a file is in HEIC format
   */
  private isHeicFile(file: File): boolean {
    return file.type === "image/heic" || 
           file.name.toLowerCase().endsWith(".heic");
  }
}
```

### Transformed Code

```typescript
/**
 * MkvToMp4Converter class
 * Converts MKV videos to the more widely supported MP4 format.
 */
export class MkvToMp4Converter extends BaseConverter {
  /**
   * Process a MKV file and convert it to MP4
   * @param mkvFile The input MKV file to convert
   * @returns Promise containing the converted MP4 file
   */
  async convert(mkvFile: File): Promise<File> {
    console.log(`Converting ${mkvFile.name} from MKV to MP4 format`);
    
    // Check if the input is actually a MKV file
    if (!this.isMkvFile(mkvFile)) {
      throw new Error("Input is not a valid MKV file");
    }
    
    // Convert using MKV-specific settings
    const mp4Blob = await this.processMkvToMp4(mkvFile);
    return new File(
      [mp4Blob], 
      mkvFile.name.replace(".mkv", ".mp4"),
      { type: "video/mp4" }
    );
  }
  
  /**
   * Check if a file is in MKV format
   */
  private isMkvFile(file: File): boolean {
    return file.type === "video/x-matroska" || 
           file.name.toLowerCase().endsWith(".mkv");
  }
}
```

Notice how the transformation correctly handled:
- Class name: `HeicToJpgConverter` → `MkvToMp4Converter`
- Method names: `processHeicToJpg` → `processMkvToMp4`
- Variable names: `heicFile` → `mkvFile`, `jpgBlob` → `mp4Blob`
- Comment text: "HEIC images" → "MKV videos"
- String literals: "Input is not a valid HEIC file" → "Input is not a valid MKV file"
- File extensions: ".heic" → ".mkv", ".jpg" → ".mp4"
- MIME types: "image/heic" → "video/x-matroska", "image/jpeg" → "video/mp4"

## Benefits of the AST Approach

1. **Precision**: Only transforms format-specific elements, not unrelated code
2. **Context awareness**: Understands the role of each code element (variable, string, comment)
3. **Case preservation**: Maintains appropriate casing for identifiers
4. **Structure preservation**: Keeps code structure and formatting intact
5. **Comment handling**: Properly transforms format references in comments
6. **Comprehensive coverage**: Catches all format references in various contexts
7. **Fallback capability**: Provides simpler transformations when AST parsing isn't possible

## Limitations and Edge Cases

While the AST approach is powerful, it has some limitations:

1. **Dynamic code**: Code generated at runtime (via eval or Function constructor) can't be transformed
2. **Non-standard syntax**: Some experimental JS/TS features might not parse correctly
3. **Embedded formats in strings**: Format references within larger strings might be missed
4. **Generated code quality**: Very complex transformations might result in slightly different formatting

The system addresses these with:
- Fallback mechanisms for unparseable files
- Comprehensive format registry with variations
- Careful regex patterns for string replacement
- Code formatting with Prettier post-transformation

---

Last updated: April 30, 2025