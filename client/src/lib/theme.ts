/**
 * Theme utilities for dynamically setting colors based on site configuration
 */
import { siteConfig } from '../config';

/**
 * Apply the theme colors to CSS variables
 */
export function applyThemeColors(): void {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  // Get the CSS root element
  const root = document.documentElement;
  
  // Set primary color from site config (Amber/Orange theme)
  root.style.setProperty('--primary-color', siteConfig.primaryColor);
  
  // Set secondary color (darker amber)
  root.style.setProperty('--secondary-color', siteConfig.secondaryColor);
  
  // Set accent color (lighter amber)
  root.style.setProperty('--accent-color', siteConfig.accentColor);
}