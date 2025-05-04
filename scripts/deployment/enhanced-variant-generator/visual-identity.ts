/**
 * Visual Identity Management System
 * 
 * Handles transformation of visual identity elements when converting between format variants.
 * This module works with the format registry to ensure proper visual styling.
 */

import { registry } from './format-registry';
import type { Format, Converter } from './format-registry';

/**
 * Visual identity elements representing a format
 */
export interface FormatVisualIdentity {
  // Format key this visual identity belongs to
  formatKey: string;
  // Primary brand color for this format
  primaryColor: string;
  // Secondary/darker variation of primary color
  secondaryColor: string;
  // Accent/lighter variation of primary color
  accentColor: string;
  // CSS class prefix for format-specific styling
  cssPrefix: string;
  // Data attribute name for format-specific elements
  dataAttribute: string;
  // Icon shape characteristics (for SVG generation)
  iconShape: 'circle' | 'square' | 'rounded' | 'diamond';
  // Additional visual properties
  [key: string]: any;
}

/**
 * Visual identity for format conversion
 */
export interface ConversionVisualIdentity {
  // Conversion key this visual identity belongs to
  conversionKey: string;
  // Primary brand color for this conversion
  primaryColor: string;
  // Secondary/darker variation of primary color
  secondaryColor: string;
  // Accent/lighter variation of primary color
  accentColor: string;
  // CSS class prefix for conversion-specific styling
  cssPrefix: string;
  // Data attribute name for conversion-specific elements
  dataAttribute: string;
  // Gradient using source and target format colors
  gradient: string;
  // Additional visual properties
  [key: string]: any;
}

/**
 * Storage for all visual identity definitions
 */
export interface VisualIdentityRegistry {
  formats: Record<string, FormatVisualIdentity>;
  conversions: Record<string, ConversionVisualIdentity>;
}

/**
 * The registry of all visual identities
 */
export const visualIdentityRegistry: VisualIdentityRegistry = {
  formats: {
    heic: {
      formatKey: 'heic',
      primaryColor: '#FF8C00', // Orange
      secondaryColor: '#E67E00',
      accentColor: '#FFB04D',
      cssPrefix: 'heic',
      dataAttribute: 'data-format-heic',
      iconShape: 'rounded',
    },
    jpg: {
      formatKey: 'jpg',
      primaryColor: '#1E90FF', // Blue
      secondaryColor: '#1A7AD9',
      accentColor: '#5FACFF',
      cssPrefix: 'jpg',
      dataAttribute: 'data-format-jpg',
      iconShape: 'square',
    },
    webp: {
      formatKey: 'webp',
      primaryColor: '#8A2BE2', // Purple
      secondaryColor: '#7425BF',
      accentColor: '#A95EED',
      cssPrefix: 'webp',
      dataAttribute: 'data-format-webp',
      iconShape: 'circle',
    },
    png: {
      formatKey: 'png',
      primaryColor: '#2E8B57', // Green
      secondaryColor: '#24694A',
      accentColor: '#4EB37F',
      cssPrefix: 'png',
      dataAttribute: 'data-format-png',
      iconShape: 'square',
    },
    avi: {
      formatKey: 'avi',
      primaryColor: '#CD5C5C', // Reddish
      secondaryColor: '#B24D4D',
      accentColor: '#DE8A8A',
      cssPrefix: 'avi',
      dataAttribute: 'data-format-avi',
      iconShape: 'diamond',
    },
    mp4: {
      formatKey: 'mp4',
      primaryColor: '#20B2AA', // Teal
      secondaryColor: '#188F87',
      accentColor: '#4DCBC4',
      cssPrefix: 'mp4',
      dataAttribute: 'data-format-mp4',
      iconShape: 'rounded',
    },
  },
  conversions: {},
};

/**
 * Generate a visual identity for a conversion based on source and target formats
 * 
 * @param sourceFormatKey - The source format key
 * @param targetFormatKey - The target format key
 * @returns A visual identity for the conversion
 */
export function generateConversionVisualIdentity(
  sourceFormatKey: string,
  targetFormatKey: string,
  conversionKey: string
): ConversionVisualIdentity | undefined {
  // Check that both formats exist in the registry
  const sourceFormat = visualIdentityRegistry.formats[sourceFormatKey];
  const targetFormat = visualIdentityRegistry.formats[targetFormatKey];
  
  if (!sourceFormat || !targetFormat) {
    console.error(`Cannot generate conversion visual identity: format not found`);
    return undefined;
  }
  
  // Blend colors to create a new color scheme for the conversion
  function blendColors(color1: string, color2: string): string {
    // Simple blending algorithm - in a real implementation this would be more sophisticated
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    
    const r = Math.round((r1 * 0.6) + (r2 * 0.4));
    const g = Math.round((g1 * 0.6) + (g2 * 0.4));
    const b = Math.round((b1 * 0.6) + (b2 * 0.4));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  // Generate blended colors
  const primaryColor = blendColors(sourceFormat.primaryColor, targetFormat.primaryColor);
  const secondaryColor = blendColors(sourceFormat.secondaryColor, targetFormat.secondaryColor);
  const accentColor = blendColors(sourceFormat.accentColor, targetFormat.accentColor);
  
  // Create CSS gradient
  const gradient = `linear-gradient(135deg, ${sourceFormat.primaryColor} 0%, ${targetFormat.primaryColor} 100%)`;
  
  // Generate conversion visual identity
  return {
    conversionKey,
    primaryColor,
    secondaryColor,
    accentColor,
    cssPrefix: `${sourceFormatKey}-to-${targetFormatKey}`,
    dataAttribute: `data-conversion-${sourceFormatKey}-to-${targetFormatKey}`,
    gradient,
  };
}

/**
 * Generate visual identities for all registered conversions
 */
export function generateAllConversionVisualIdentities(): void {
  // Clear existing conversion identities
  visualIdentityRegistry.conversions = {};
  
  // Generate for each registered conversion
  for (const conversionKey in registry.conversions) {
    const conversion = registry.conversions[conversionKey];
    const identity = generateConversionVisualIdentity(
      conversion.source,
      conversion.target,
      conversionKey
    );
    
    if (identity) {
      visualIdentityRegistry.conversions[conversionKey] = identity;
    }
  }
}

/**
 * Get CSS variables for a format visual identity
 * 
 * @param formatKey - The format key
 * @returns CSS variable definitions
 */
export function getFormatCSSVariables(formatKey: string): string {
  const identity = visualIdentityRegistry.formats[formatKey];
  if (!identity) {
    return '';
  }
  
  return `--${identity.cssPrefix}-primary-color: ${identity.primaryColor};
      --${identity.cssPrefix}-secondary-color: ${identity.secondaryColor};
      --${identity.cssPrefix}-accent-color: ${identity.accentColor};`;
}

/**
 * Get CSS variables for a conversion visual identity
 * 
 * @param conversionKey - The conversion key
 * @returns CSS variable definitions
 */
export function getConversionCSSVariables(conversionKey: string): string {
  const identity = visualIdentityRegistry.conversions[conversionKey];
  if (!identity) {
    return '';
  }
  
  return `--${identity.cssPrefix}-primary-color: ${identity.primaryColor};
      --${identity.cssPrefix}-secondary-color: ${identity.secondaryColor};
      --${identity.cssPrefix}-accent-color: ${identity.accentColor};
      --${identity.cssPrefix}-gradient: ${identity.gradient};`;
}

/**
 * Generate CSS attribute selectors for format elements
 * 
 * @param formatKey - The format key
 * @returns CSS selector for format elements
 */
export function getFormatSelector(formatKey: string): string {
  const identity = visualIdentityRegistry.formats[formatKey];
  if (!identity) {
    return '';
  }
  
  return `[${identity.dataAttribute}]`;
}

/**
 * Generate CSS attribute selectors for conversion elements
 * 
 * @param conversionKey - The conversion key
 * @returns CSS selector for conversion elements
 */
export function getConversionSelector(conversionKey: string): string {
  const identity = visualIdentityRegistry.conversions[conversionKey];
  if (!identity) {
    return '';
  }
  
  return `[${identity.dataAttribute}]`;
}

/**
 * Attach visual identity information to registry formats
 */
export function attachVisualIdentityAttributes(): void {
  // Generate visual identities for all conversions
  generateAllConversionVisualIdentities();
  
  // Attach visual identity information to formats in the registry
  for (const formatKey in registry.formats) {
    const format = registry.formats[formatKey];
    const identity = visualIdentityRegistry.formats[formatKey];
    
    if (identity) {
      format.visualIdentity = {
        primaryColor: identity.primaryColor,
        cssPrefix: identity.cssPrefix,
        dataAttribute: identity.dataAttribute,
        iconShape: identity.iconShape,
      };
    }
  }
  
  // Attach visual identity information to conversions in the registry
  for (const conversionKey in registry.conversions) {
    const conversion = registry.conversions[conversionKey];
    const identity = visualIdentityRegistry.conversions[conversionKey];
    
    if (identity) {
      conversion.visualIdentity = {
        primaryColor: identity.primaryColor,
        cssPrefix: identity.cssPrefix,
        dataAttribute: identity.dataAttribute,
        gradient: identity.gradient,
      };
    }
  }
}