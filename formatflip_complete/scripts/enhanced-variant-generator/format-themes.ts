/**
 * Format Themes
 * 
 * This file contains the visual identity themign for all supported formats.
 * Each format category has its own color palette for consistent styling.
 */

import { FormatVisualIdentity } from './visual-identity';

/**
 * Generate a lighter shade of a color
 */
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  
  return `#${
    (0x1000000 + (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
     (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
     (B < 255 ? (B < 0 ? 0 : B) : 255))
     .toString(16).slice(1)
  }`;
}

/**
 * Generate a darker shade of a color
 */
function darkenColor(hex: string, percent: number): string {
  return lightenColor(hex, -percent);
}

/**
 * Create a visual identity for a format
 */
function createFormatIdentity(key: string, primaryColor: string, iconShape: 'circle' | 'square' | 'rounded' | 'diamond' = 'rounded'): FormatVisualIdentity {
  return {
    formatKey: key,
    primaryColor,
    secondaryColor: darkenColor(primaryColor, 10),
    accentColor: lightenColor(primaryColor, 20),
    cssPrefix: key,
    dataAttribute: `data-format-${key}`,
    iconShape,
  };
}

/**
 * Image Format Themes
 * 
 * Color palette uses blue/green hues for consistency
 */
export const imageFormatThemes: Record<string, FormatVisualIdentity> = {
  // Core image formats (already defined)
  heic: createFormatIdentity('heic', '#FF8C00', 'rounded'), // Orange
  jpg: createFormatIdentity('jpg', '#1E90FF', 'square'),   // Blue
  webp: createFormatIdentity('webp', '#8A2BE2', 'circle'), // Purple
  png: createFormatIdentity('png', '#2E8B57', 'square'),   // Green
  
  // Additional image formats
  apng: createFormatIdentity('apng', '#3CB371', 'square'),  // Medium Sea Green
  bmp: createFormatIdentity('bmp', '#4682B4', 'square'),   // Steel Blue
  gif: createFormatIdentity('gif', '#9370DB', 'rounded'),  // Medium Purple
  tiff: createFormatIdentity('tiff', '#20B2AA', 'square'), // Light Sea Green
  ico: createFormatIdentity('ico', '#5F9EA0', 'square'),   // Cadet Blue
  svg: createFormatIdentity('svg', '#48D1CC', 'circle'),   // Medium Turquoise
  tga: createFormatIdentity('tga', '#66CDAA', 'square'),   // Medium Aquamarine
  dds: createFormatIdentity('dds', '#4169E1', 'square'),   // Royal Blue
  exr: createFormatIdentity('exr', '#6495ED', 'square'),   // Cornflower Blue
};

/**
 * Video Format Themes
 * 
 * Color palette uses red/orange hues for consistency
 */
export const videoFormatThemes: Record<string, FormatVisualIdentity> = {
  // Core video formats (already defined)
  avi: createFormatIdentity('avi', '#CD5C5C', 'diamond'),  // Indian Red
  mp4: createFormatIdentity('mp4', '#20B2AA', 'rounded'), // Light Sea Green
  
  // Additional video formats
  mov: createFormatIdentity('mov', '#FF7F50', 'rounded'),  // Coral
  webm: createFormatIdentity('webm', '#FF6347', 'circle'), // Tomato
  mkv: createFormatIdentity('mkv', '#F08080', 'diamond'),  // Light Coral
  flv: createFormatIdentity('flv', '#E9967A', 'square'),   // Dark Salmon
  wmv: createFormatIdentity('wmv', '#FA8072', 'rounded'),  // Salmon
  '3gp': createFormatIdentity('3gp', '#FFA07A', 'rounded'),  // Light Salmon
  ts: createFormatIdentity('ts', '#DC143C', 'square'),     // Crimson
  mpeg: createFormatIdentity('mpeg', '#B22222', 'rounded'), // Fire Brick
};

/**
 * Audio Format Themes
 * 
 * Color palette uses purple/violet hues for consistency
 */
export const audioFormatThemes: Record<string, FormatVisualIdentity> = {
  mp3: createFormatIdentity('mp3', '#9932CC', 'rounded'),  // Dark Orchid
  wav: createFormatIdentity('wav', '#8A2BE2', 'square'),   // Blue Violet
  flac: createFormatIdentity('flac', '#9370DB', 'diamond'), // Medium Purple
  ogg: createFormatIdentity('ogg', '#BA55D3', 'circle'),   // Medium Orchid
  aac: createFormatIdentity('aac', '#DA70D6', 'rounded'),  // Orchid
  wma: createFormatIdentity('wma', '#DDA0DD', 'square'),   // Plum
};

/**
 * Get all format themes
 */
export function getAllFormatThemes(): Record<string, FormatVisualIdentity> {
  return {
    ...imageFormatThemes,
    ...videoFormatThemes,
    ...audioFormatThemes,
  };
}

/**
 * Register all format themes with the visual identity registry
 */
export function registerAllFormatThemes(registry: any): void {
  // First, preserve any existing themes
  const existingThemes = { ...registry.formats };
  
  // Register all new themes
  const allThemes = getAllFormatThemes();
  registry.formats = {
    ...existingThemes,
    ...allThemes,
  };
  
  console.log(`Registered ${Object.keys(allThemes).length} format themes with the registry.`);
}
