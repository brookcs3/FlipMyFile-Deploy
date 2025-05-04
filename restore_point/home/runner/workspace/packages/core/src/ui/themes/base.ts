/**
 * Base theme configuration for all converters
 * This defines the common theme interface and provides default values
 */

// Define conversion mode type
export type ConversionMode = 'heicToJpg' | 'jpgToHeic' | 'aviToMp4' | 'mp4ToAvi';

// Base theme interface that all themes must implement
export interface BaseTheme {
  siteName: string;
  defaultConversionMode: ConversionMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoText: string;
  domain: string;
}

// Default base theme (using HEICFlip as the foundation)
export const baseTheme: BaseTheme = {
  siteName: "HEICFlip",
  defaultConversionMode: "heicToJpg",
  primaryColor: "#DD7230",    // Pantone 16-1255 Amberglow 
  secondaryColor: "#B85A25",  // Darker shade
  accentColor: "#F39C6B",     // Lighter accent
  logoText: "HEICFlip",
  domain: "heicflip.com"
};

// Type for theme overrides (partial theme)
export type ThemeOverrides = Partial<BaseTheme>;

/**
 * Creates a complete theme by merging overrides with the base theme
 * @param overrides - Partial theme properties to override base theme
 * @returns Complete theme with all properties
 */
export function createTheme(overrides: ThemeOverrides = {}): BaseTheme {
  return {
    ...baseTheme,
    ...overrides
  };
}