/**
 * Site configuration
 * This file contains site-specific settings that change based on which
 * domain/brand is being displayed.
 */

// Define conversion mode type
export type ConversionMode = 'heicToJpg' | 'jpgToHeic';

// Define site configuration types
export interface SiteConfig {
  siteName: string;
  defaultConversionMode: ConversionMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoText: string;
  domain: string;
}

// Configuration for JPGFlip
const jpgFlipConfig: SiteConfig = {
  siteName: 'JPGFlip',
  defaultConversionMode: 'jpgToHeic',
  primaryColor: '#10b981',
  secondaryColor: '#059669',
  accentColor: '#34d399',
  logoText: 'JPGFlip',
  domain: 'jpgflip.com'
};

// Configuration for aviflip.com (redirects to HEICFlip)
const aviFlipConfig: SiteConfig = {
  siteName: 'HEICFlip',
  defaultConversionMode: 'heicToJpg',
  primaryColor: '#DD7230',    // Pantone 16-1255 Amberglow 
  secondaryColor: '#B85A25',  // Darker shade
  accentColor: '#F39C6B',     // Lighter accent
  logoText: 'HEICFlip',
  domain: 'heicflip.com'
};

// Configuration for HEICFlip
const heicFlipConfig: SiteConfig = {
  siteName: 'HEICFlip',
  defaultConversionMode: 'heicToJpg',
  primaryColor: '#DD7230',    // Pantone 16-1255 Amberglow 
  secondaryColor: '#B85A25',  // Darker shade
  accentColor: '#F39C6B',     // Lighter accent
  logoText: 'HEICFlip',
  domain: 'heicflip.com'
};

// Determine which configuration to use based on hostname and URL parameters
export function getSiteConfig(): SiteConfig {
  // First check URL parameter (any of ?site=jpgflip or ?jpgflip or ?mode=jpgflip)
  const urlParams = new URLSearchParams(window.location.search);
  const forceSite = urlParams.get('site')?.toLowerCase();
  
  // Check for site parameter
  if (forceSite === 'jpgflip') {
    console.log('USING JPGFLIP CONFIG: URL site parameter override');
    return jpgFlipConfig;
  }
  
  if (forceSite === 'aviflip') {
    console.log('USING AVIFLIP CONFIG: URL site parameter override');
    return aviFlipConfig;
  }
  
  if (forceSite === 'heicflip') {
    console.log('USING HEICFLIP CONFIG: URL site parameter override');
    return heicFlipConfig;
  }
  
  // Check for direct parameter (no value needed)
  if (urlParams.has('jpgflip')) {
    console.log('USING JPGFLIP CONFIG: Direct URL parameter override');
    return jpgFlipConfig;
  }
  
  if (urlParams.has('heicflip')) {
    console.log('USING HEICFLIP CONFIG: Direct URL parameter override');
    return heicFlipConfig;
  }
  
  // Check for mode parameter
  const mode = urlParams.get('mode')?.toLowerCase();
  if (mode === 'jpgflip') {
    console.log('USING JPGFLIP CONFIG: URL mode parameter override');
    return jpgFlipConfig;
  }
  
  if (mode === 'heicflip') {
    console.log('USING HEICFLIP CONFIG: URL mode parameter override');
    return heicFlipConfig;
  }
  
  // Then check hostname exactly
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname === 'jpgflip.com' || hostname === 'www.jpgflip.com') {
    console.log('USING JPGFLIP CONFIG: Hostname match');
    return jpgFlipConfig;
  }
  
  if (hostname === 'aviflip.com' || hostname === 'www.aviflip.com') {
    console.log('USING AVIFLIP CONFIG: Hostname match');
    return aviFlipConfig;
  }
  
  if (hostname === 'heicflip.com' || hostname === 'www.heicflip.com') {
    console.log('USING HEICFLIP CONFIG: Hostname match');
    return heicFlipConfig;
  }
  
  // For testing purposes, we'll default to heicflip to preview the new config
  // This can be changed back to aviflip after testing
  console.log('USING HEICFLIP CONFIG: Default fallback for testing');
  return heicFlipConfig;
}

// Export the current site configuration
export const siteConfig = getSiteConfig();