/**
 * Color Utilities for Variant Generation
 * 
 * This module provides helper functions for working with colors in the variant
 * generation process, including color manipulation, conversion between formats,
 * and color relationship calculation.
 */

/**
 * Convert a hex color to RGB values
 * @param {string} hex Hex color code (with or without #)
 * @returns {Object} Object with r, g, b properties
 */
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse the hex values
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}

/**
 * Convert RGB values to a hex color
 * @param {Object} rgb Object with r, g, b properties
 * @returns {string} Hex color code with leading #
 */
function rgbToHex(rgb) {
  const { r, g, b } = rgb;
  
  // Ensure values are within 0-255 range
  const validR = Math.max(0, Math.min(255, r));
  const validG = Math.max(0, Math.min(255, g));
  const validB = Math.max(0, Math.min(255, b));
  
  // Convert to hex
  return '#' + ((1 << 24) + (validR << 16) + (validG << 8) + validB).toString(16).slice(1);
}

/**
 * Convert RGB values to HSL (Hue, Saturation, Lightness)
 * @param {Object} rgb Object with r, g, b properties
 * @returns {Object} Object with h, s, l properties
 */
function rgbToHsl(rgb) {
  let { r, g, b } = rgb;
  
  // Convert RGB to 0-1 range
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    // Achromatic (gray)
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  // Convert to degrees and percentages
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL values to RGB
 * @param {Object} hsl Object with h, s, l properties
 * @returns {Object} Object with r, g, b properties
 */
function hslToRgb(hsl) {
  let { h, s, l } = hsl;
  
  // Convert to 0-1 range
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;
  
  if (s === 0) {
    // Achromatic (gray)
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  // Convert to 0-255 range
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Convert a hex color to HSL
 * @param {string} hex Hex color code
 * @returns {Object} Object with h, s, l properties
 */
function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb);
}

/**
 * Convert HSL to hex color
 * @param {Object} hsl Object with h, s, l properties
 * @returns {string} Hex color code with leading #
 */
function hslToHex(hsl) {
  const rgb = hslToRgb(hsl);
  return rgbToHex(rgb);
}

/**
 * Adjust a color's lightness
 * @param {string} hex Hex color code
 * @param {number} amount Amount to adjust (-100 to 100)
 * @returns {string} Adjusted hex color
 */
function adjustLightness(hex, amount) {
  const hsl = hexToHsl(hex);
  hsl.l = Math.max(0, Math.min(100, hsl.l + amount));
  return hslToHex(hsl);
}

/**
 * Adjust a color's saturation
 * @param {string} hex Hex color code
 * @param {number} amount Amount to adjust (-100 to 100)
 * @returns {string} Adjusted hex color
 */
function adjustSaturation(hex, amount) {
  const hsl = hexToHsl(hex);
  hsl.s = Math.max(0, Math.min(100, hsl.s + amount));
  return hslToHex(hsl);
}

/**
 * Create a tint of a color (lighter version)
 * @param {string} hex Hex color code
 * @param {number} amount Amount to lighten (0-100)
 * @returns {string} Tinted hex color
 */
function tint(hex, amount) {
  return adjustLightness(hex, amount);
}

/**
 * Create a shade of a color (darker version)
 * @param {string} hex Hex color code
 * @param {number} amount Amount to darken (0-100)
 * @returns {string} Shaded hex color
 */
function shade(hex, amount) {
  return adjustLightness(hex, -amount);
}

/**
 * Generate a color scheme based on a primary color
 * @param {string} primaryColor Hex color code for the primary color
 * @returns {Object} Object with various related colors
 */
function generateColorScheme(primaryColor) {
  return {
    primary: primaryColor,
    secondary: shade(primaryColor, 20),
    accent: tint(adjustSaturation(primaryColor, 10), 15),
    light: tint(primaryColor, 40),
    dark: shade(primaryColor, 40),
    analogous1: rotateHue(primaryColor, 30),
    analogous2: rotateHue(primaryColor, -30),
    complementary: rotateHue(primaryColor, 180)
  };
}

/**
 * Rotate the hue of a color
 * @param {string} hex Hex color code
 * @param {number} degrees Degrees to rotate the hue
 * @returns {string} Hue-rotated hex color
 */
function rotateHue(hex, degrees) {
  const hsl = hexToHsl(hex);
  hsl.h = (hsl.h + degrees) % 360;
  if (hsl.h < 0) hsl.h += 360;
  return hslToHex(hsl);
}

/**
 * Check if a color is considered "light" (for determining text color)
 * @param {string} hex Hex color code
 * @returns {boolean} True if the color is light
 */
function isLightColor(hex) {
  const rgb = hexToRgb(hex);
  // Perceived brightness formula
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 155;
}

/**
 * Get the appropriate text color (black or white) for a background color
 * @param {string} backgroundColor Hex color code of the background
 * @returns {string} '#000000' for dark text or '#ffffff' for light text
 */
function getTextColor(backgroundColor) {
  return isLightColor(backgroundColor) ? '#000000' : '#ffffff';
}

/**
 * Get a descriptive name for a color
 * @param {string} hex Hex color code
 * @returns {string} Simple name of the color
 */
function getColorName(hex) {
  const hsl = hexToHsl(hex);
  const { h, s, l } = hsl;
  
  // For grays (low saturation)
  if (s < 15) {
    if (l < 20) return 'black';
    if (l < 40) return 'darkgray';
    if (l < 60) return 'gray';
    if (l < 80) return 'lightgray';
    return 'white';
  }
  
  // For colors
  let name;
  if (h < 30) name = 'red';
  else if (h < 60) name = 'orange';
  else if (h < 90) name = 'yellow';
  else if (h < 150) name = 'green';
  else if (h < 210) name = 'cyan';
  else if (h < 270) name = 'blue';
  else if (h < 330) name = 'purple';
  else name = 'red';
  
  // Add intensity modifiers
  if (l < 40) name = 'dark' + name;
  else if (l > 70) name = 'light' + name;
  
  return name;
}

/**
 * Convert a color to rgba string with specified opacity
 * @param {string} hex Hex color code
 * @param {number} opacity Opacity value (0-1)
 * @returns {string} rgba color string
 */
function hexToRgba(hex, opacity) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Generate a CSS gradient string from two colors
 * @param {string} color1 First hex color
 * @param {string} color2 Second hex color
 * @param {string} direction Direction of gradient ('to right', 'to bottom', etc.)
 * @returns {string} CSS gradient string
 */
function createGradient(color1, color2, direction = 'to right') {
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
}

module.exports = {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  adjustLightness,
  adjustSaturation,
  tint,
  shade,
  generateColorScheme,
  rotateHue,
  isLightColor,
  getTextColor,
  getColorName,
  hexToRgba,
  createGradient
};