# Visual Identity Transformation System

This document details how the Enhanced Variant Generator handles visual identity elements to ensure complete replacement across all formats.

## Visual Identity Components

The following elements comprise the visual identity of a converter variant and require comprehensive transformation:

### 1. Theme-Specific CSS Values

| Element Type | HEICFlip Elements | Transformation Approach |
|--------------|-------------------|-------------------------|
| **Primary Colors** | Orange (#F28500, #DD7230) | Direct color replacement via theme configuration |
| **Secondary Colors** | Darker oranges (#D67E00, #B85A25) | Generated from primary via color relationships |
| **Accent Colors** | Lighter oranges (#FFA033, #F39C6B) | Generated from primary via color relationships |
| **RGBA Variations** | rgba(242, 133, 0, 0.x) | Parsed and rebuilt with new RGB values |
| **Named Colors** | .orange-button, .orange-highlight | Class name replacement using color name extraction |
| **Gradients** | linear-gradient(to right, #F28500, #FFA033) | Pattern matching and component replacement |
| **Shadows** | box-shadow: 0 2px 8px rgba(242, 133, 0, 0.4) | Pattern matching with opacity preservation |
| **Borders** | border: 2px dashed #F28500 | Direct property replacement |

### 2. SVG/Icon Assets

| Element Type | HEICFlip Elements | Transformation Approach |
|--------------|-------------------|-------------------------|
| **Logo SVG** | Orange circular icon | AST-based color and shape modification |
| **UI Icons** | Conversion direction arrows | Color replacement and optional shape modification |
| **Decorative Elements** | Stylized drop zone borders | Color and pattern replacement |
| **Embedded Text** | "HEIC → JPG" in SVGs | Text node replacement in SVG AST |
| **CSS Classes in SVGs** | .heic-icon, .jpg-output | Class name replacement with format detection |
| **SVG Patterns** | Pattern fills using orange colors | Pattern reconfiguration with new colors |

### 3. Image Assets with Embedded Text

| Element Type | HEICFlip Elements | Transformation Approach |
|--------------|-------------------|-------------------------|
| **Raster Logos** | PNG/JPG logos with "HEICFlip" text | OCR detection and regeneration |
| **Tutorial Images** | Screenshots with format references | OCR analysis and flagging for manual review |
| **Marketing Images** | Feature illustrations with format labels | OCR analysis and regeneration or flagging |
| **Favicons** | Browser icons using orange theme | Automatic regeneration with new colors |

## Comprehensive Visual Identity Transformation Process

Our enhanced system applies a multi-layered approach to ensure complete visual identity transformation:

### 1. CSS/SCSS Processing

The `processStylesheet` function in `asset-transformer.js` handles:

```javascript
// Original HEICFlip theme colors (all variations)
const originalColors = {
  // Primary orange color and variations
  primary: ['#F28500', '#DD7230', '#f28500', '#dd7230', 'rgb(242, 133, 0)', 'rgb(221, 114, 48)'],
  // Secondary darker orange
  secondary: ['#D67E00', '#B85A25', '#d67e00', '#b85a25', 'rgb(214, 126, 0)', 'rgb(184, 90, 37)'],
  // Accent lighter orange
  accent: ['#FFA033', '#F39C6B', '#ffa033', '#f39c6b', 'rgb(255, 160, 51)', 'rgb(243, 156, 107)']
};

// RGBA variations with any opacity
const rgbaPatterns = [
  /rgba\(\s*242\s*,\s*133\s*,\s*0\s*,\s*([\d.]+)\s*\)/g, // Primary
  /rgba\(\s*221\s*,\s*114\s*,\s*48\s*,\s*([\d.]+)\s*\)/g, // Primary alt
  // ...
];
```

The system:
- Identifies all color formats (hex, RGB, RGBA, named)
- Preserves opacity values in RGBA transformations
- Updates CSS variables and custom properties
- Handles gradients by decomposing them and replacing components

Special handling is provided for:
- Shadow effects (box-shadow, text-shadow, drop-shadow)
- Border colors and styles (especially dashed borders used in drop zones)
- Format-specific class names (.heic-container → .mkv-container)
- Animation keyframes that reference theme colors

### 2. SVG Transformation

The `transformSvgAsset` function performs AST-based SVG transformation:

```javascript
// Process the SVG recursively
function processNode(node) {
  // If this is a text node, check for format references
  if (node.type === 'text' && node.value) {
    // Replace format references in text
    node.value = replaceFormatReferences(node.value, formatConfig);
  }
  
  // Process attributes
  if (node.attributes) {
    // Replace colors in attributes
    Object.keys(node.attributes).forEach(attr => {
      if (['fill', 'stroke'].includes(attr)) {
        const value = node.attributes[attr];
        if (originalColors.includes(value)) {
          // Determine which color to use
          if (value.toLowerCase() === '#f28500' || value.toLowerCase() === '#dd7230') {
            node.attributes[attr] = newColors.primary;
          // ...
```

This approach:
- Preserves SVG structure while updating colors and format references
- Handles SVG path data to modify shapes based on format type (image vs. video)
- Processes embedded text nodes within SVGs
- Updates IDs and classes that might have format-specific names

### 3. Image Content Analysis

For raster images that might contain embedded text references to formats:

```javascript
// Extract text from image using OCR
const config = {
  lang: 'eng',
  oem: 1,
  psm: 3,
};

const text = await tesseract.recognize(filePath, config);

// Check for format references
const { sourceFormat, targetFormat, sourceTargetFormat, targetTargetFormat } = formatConfig;

const foundReferences = [];

// Check for format variations
[...sourceFormat.variations, ...sourceTargetFormat.variations].forEach(variant => {
  if (text.includes(variant)) {
    foundReferences.push({
      type: 'imageText',
      value: variant,
      file: filePath
    });
  }
});
```

This system:
- Uses OCR (Tesseract) to detect text in images
- Identifies format-specific references
- Flags images that require manual attention
- Can optionally regenerate simple images (like logos) with new formats and colors

### 4. Dynamic Asset Generation

For core branding elements, the system can generate new assets specific to each variant:

```javascript
async function generateVariantLogo(outputPath, themeConfig, formatConfig) {
  // Create a blank canvas
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  
  // Fill background with primary theme color
  ctx.fillStyle = themeConfig.primaryColor;
  ctx.beginPath();
  ctx.arc(100, 100, 80, 0, Math.PI * 2);
  ctx.fill();
  
  // Add format-specific text
  const sourceName = formatConfig.sourceFormat.name.slice(0, 4);
  const targetName = formatConfig.targetTargetFormat.name.slice(0, 4);
  
  ctx.fillText(`${sourceName}`, 100, 80);
  ctx.fillText('→', 100, 100);
  ctx.fillText(`${targetName}`, 100, 120);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}
```

This approach:
- Creates consistent, format-appropriate logos and icons
- Ensures visual consistency across variants
- Eliminates manual graphics work for new variants

## Verification and Quality Assurance

To ensure all visual identity elements are properly transformed:

1. **Visual Diffing**: Automated screenshot comparison between original and transformed pages
2. **Color Extraction**: Analysis of rendered pages to identify any remaining original theme colors
3. **OCR Verification**: Checking rendered pages for any remaining textual format references
4. **Manual Review Queue**: Flagging complex images or SVGs that need human verification

## Future Enhancements

Planned enhancements to the visual identity transformation system:

1. **Machine Learning Image Generation**: Using ML to generate more sophisticated variant-specific imagery
2. **Animation Transformation**: Handling CSS and SVG animations that might contain format-specific elements
3. **Custom Font Support**: Handling variants that might use different typography as part of their branding
4. **Theme Relationship Preservation**: Ensuring color relationships are maintained across different color schemes

---

Last updated: April 30, 2025