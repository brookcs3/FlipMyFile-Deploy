/**
 * Core package exports
 * This file exports all the shared functionality that variant packages can use
 */

// Export theme system
export * from './ui/themes/base';

// Export ad-related components and utilities
// Uncomment when these are implemented
// export * from './ui/components/ads';
// export * from './utils/ads';

// Conversion utilities
// export * from './conversion/types';
// export * from './conversion/converters';

// Export types
export type AdProvider = 'adsense' | 'ezoic' | 'media.net' | 'carbon';

export interface AdConfig {
  enabled: boolean;
  provider: AdProvider;
  clientId: string;
  slots: Record<string, string>;
  customScript?: string;
}

/**
 * Placeholder for ad initialization function
 * This will be implemented fully later
 */
export function initializeAds(config: AdConfig): void {
  if (!config.enabled) return;
  console.log('Ad initialization would happen here with config:', config);
}