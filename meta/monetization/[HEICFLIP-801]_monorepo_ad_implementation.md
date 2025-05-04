# Monorepo Ad Implementation Guide

This guide provides specific implementation steps for integrating advertising into the converter monorepo structure.

## Core Package Ad Components

First, we'll create reusable ad components in the core package that all variants can use.

### Step 1: Create Ad Component Directory Structure

```bash
mkdir -p packages/core/src/ui/components/ads
```

### Step 2: Create Base Ad Components

#### AdUnit.tsx

```typescript
// packages/core/src/ui/components/ads/AdUnit.tsx
import React, { useEffect, useRef } from 'react';
import { AdConfig } from '../../../utils/ads';

export interface AdUnitProps {
  adSlot: string;
  format: 'banner' | 'rectangle' | 'leaderboard' | 'interstitial';
  className?: string;
  provider: AdConfig['provider'];
}

export const AdUnit: React.FC<AdUnitProps> = ({ 
  adSlot, 
  format, 
  className = '',
  provider = 'adsense'
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only attempt to load ads in production
    if (import.meta.env.PROD) {
      try {
        if (provider === 'adsense' && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }
  }, [provider]);

  if (provider === 'adsense') {
    return (
      <div ref={adRef} className={`ad-container ${format} ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block',
            width: format === 'leaderboard' ? '728px' : '300px',
            height: format === 'leaderboard' ? '90px' : '250px',
            maxWidth: '100%',
            overflow: 'hidden'
          }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Will be overridden by variant config
          data-ad-slot={adSlot}
          data-ad-format={format === 'interstitial' ? 'rectangle' : format}
          data-full-width-responsive="true"
        ></ins>
      </div>
    );
  }
  
  if (provider === 'ezoic') {
    return (
      <div 
        ref={adRef} 
        className={`ezoic-ad ${className}`} 
        data-ez-name={adSlot}
        id={`ezoic-pub-ad-placeholder-${adSlot}`}
      ></div>
    );
  }
  
  if (provider === 'carbon') {
    return (
      <div ref={adRef} id="_carbonads_js" className={className}></div>
    );
  }
  
  return null;
};
```

#### AdBanner.tsx

```typescript
// packages/core/src/ui/components/ads/AdBanner.tsx
import React from 'react';
import { AdUnit } from './AdUnit';

export interface AdBannerProps {
  adSlot: string;
  provider: 'adsense' | 'ezoic' | 'media.net' | 'carbon';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ 
  adSlot, 
  provider, 
  className = '' 
}) => {
  return (
    <div className={`ad-banner-container ${className}`}>
      <AdUnit 
        adSlot={adSlot} 
        format="leaderboard" 
        provider={provider} 
        className="w-full mx-auto max-w-[728px] h-[90px] overflow-hidden" 
      />
    </div>
  );
};
```

#### InterstitialAd.tsx

```typescript
// packages/core/src/ui/components/ads/InterstitialAd.tsx
import React, { useState, useEffect } from 'react';
import { AdUnit } from './AdUnit';

export interface InterstitialAdProps {
  adSlot: string;
  provider: 'adsense' | 'ezoic' | 'media.net' | 'carbon';
  onClose?: () => void;
  autoCloseAfter?: number; // in milliseconds
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ 
  adSlot, 
  provider, 
  onClose,
  autoCloseAfter = 5000 // Default 5 seconds
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, autoCloseAfter);
    
    return () => clearTimeout(timer);
  }, [autoCloseAfter, onClose]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Your file is ready!</h3>
          <button 
            onClick={() => {
              setIsVisible(false);
              if (onClose) onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
        
        <AdUnit 
          adSlot={adSlot} 
          format="rectangle" 
          provider={provider} 
          className="w-full h-[250px]" 
        />
        
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsVisible(false);
              if (onClose) onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Continue to Download
          </button>
        </div>
      </div>
    </div>
  );
};
```

#### Index file to export all components

```typescript
// packages/core/src/ui/components/ads/index.ts
export * from './AdUnit';
export * from './AdBanner';
export * from './InterstitialAd';
```

### Step 3: Create Ad Utility Functions

```typescript
// packages/core/src/utils/ads.ts
export type AdProvider = 'adsense' | 'ezoic' | 'media.net' | 'carbon';

export interface AdConfig {
  enabled: boolean;
  provider: AdProvider;
  clientId: string; // e.g., "ca-pub-XXXXXXXXXXXXXXXX" for AdSense
  slots: Record<string, string>;
  customScript?: string;
}

// Declare global AdSense object
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

/**
 * Initializes ad scripts based on the provided configuration
 */
export function initializeAds(config: AdConfig): void {
  if (!config.enabled || !import.meta.env.PROD) return;
  
  switch (config.provider) {
    case 'adsense':
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.clientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
      
      // Initialize AdSense
      window.adsbygoogle = window.adsbygoogle || [];
      break;
    
    case 'ezoic':
      if (config.customScript) {
        const ezoicScript = document.createElement('script');
        ezoicScript.innerHTML = config.customScript;
        document.head.appendChild(ezoicScript);
      }
      break;
    
    case 'media.net':
      if (config.customScript) {
        const mediaNetScript = document.createElement('script');
        mediaNetScript.innerHTML = config.customScript;
        document.head.appendChild(mediaNetScript);
      }
      break;
    
    case 'carbon':
      const carbonScript = document.createElement('script');
      carbonScript.src = `//cdn.carbonads.com/carbon.js?serve=${config.clientId}`;
      carbonScript.id = "_carbonads_js";
      carbonScript.async = true;
      
      // Carbon typically needs to be inserted into a specific element
      const carbonContainer = document.getElementById('carbon-container');
      if (carbonContainer) {
        carbonContainer.appendChild(carbonScript);
      } else {
        document.body.appendChild(carbonScript);
      }
      break;
  }
}

/**
 * Creates ads.txt content based on configuration
 */
export function generateAdsTxt(config: AdConfig): string {
  switch (config.provider) {
    case 'adsense':
      // Format: google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
      return `google.com, ${config.clientId.replace('ca-pub-', '')}, DIRECT, f08c47fec0942fa0`;
      
    case 'ezoic':
      // Would need Ezoic-specific information
      return `# Ezoic ads.txt content would go here`;
      
    // Add other providers as needed
    
    default:
      return `# Please add the correct ads.txt content for your ad provider`;
  }
}
```

### Step 4: Add Ad Components Export to Core Package

```typescript
// packages/core/src/index.ts
// Re-export everything from the theme system
export * from './ui/themes/base';

// Re-export ad components
export * from './ui/components/ads';
export * from './utils/ads';

// Add other exports as they are created
```

## Variant-Specific Ad Implementation

### Step 5: Create Ad Configuration for HEICFlip Variant

```typescript
// packages/heicflip/src/config/ads.ts
import { AdConfig } from '@flip/core';

export const adConfig: AdConfig = {
  enabled: true,
  provider: 'adsense',
  clientId: 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with your AdSense publisher ID
  slots: {
    header: '1234567890', // Replace with actual ad slot IDs
    sidebar: '0987654321',
    footer: '1122334455',
    postConversion: '5566778899'
  }
};
```

### Step 6: Integrate Ads into the HEICFlip Variant

Update the main entry point to initialize ads:

```typescript
// packages/heicflip/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { theme } from './config/theme';
import { adConfig } from './config/ads';
import { initializeAds } from '@flip/core';

console.log('Running in HEICFlip mode with configuration:', theme);

// Initialize ads based on configuration
initializeAds(adConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Add ads to relevant components, for example:

```tsx
// packages/heicflip/src/components/ConversionComplete.tsx
import React from 'react';
import { InterstitialAd } from '@flip/core';
import { adConfig } from '../config/ads';

export const ConversionComplete: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <InterstitialAd 
      adSlot={adConfig.slots.postConversion}
      provider={adConfig.provider}
      onClose={onClose}
      autoCloseAfter={10000} // 10 seconds
    />
  );
};
```

### Step 7: Create ads.txt for Each Variant

```typescript
// scripts/generate-ads-txt.js
const fs = require('fs');
const path = require('path');
const { generateAdsTxt } = require('../packages/core/dist/utils/ads');

// Load configurations from each variant
const heicflipConfig = require('../packages/heicflip/src/config/ads');
const jpgflipConfig = require('../packages/jpgflip/src/config/ads');

// Generate ads.txt content
const heicflipAdsTxt = generateAdsTxt(heicflipConfig);
const jpgflipAdsTxt = generateAdsTxt(jpgflipConfig);

// Write to files
fs.writeFileSync(
  path.join(__dirname, '../packages/heicflip/public/ads.txt'),
  heicflipAdsTxt
);

fs.writeFileSync(
  path.join(__dirname, '../packages/jpgflip/public/ads.txt'),
  jpgflipAdsTxt
);

console.log('Generated ads.txt files for all variants');
```

## Testing Ad Implementation

### Step 8: Create Test Mode for Ads

```typescript
// packages/core/src/utils/ads.ts
// Add to the existing file

/**
 * Toggles ad test mode
 * @param enable Whether to enable test mode
 */
export function enableAdTestMode(enable: boolean = true): void {
  if (!import.meta.env.PROD) {
    console.log(`Ad test mode ${enable ? 'enabled' : 'disabled'}`);
    
    // Create a visual indicator for ad placements
    const adContainers = document.querySelectorAll('.ad-container, .ezoic-ad');
    adContainers.forEach(container => {
      const element = container as HTMLElement;
      if (enable) {
        element.style.border = '2px dashed red';
        element.style.background = '#ffeeee';
        element.style.minHeight = '90px';
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.justifyContent = 'center';
        
        const label = document.createElement('span');
        label.textContent = 'AD PLACEMENT';
        label.style.color = 'red';
        label.style.fontWeight = 'bold';
        
        element.appendChild(label);
      } else {
        element.style.border = '';
        element.style.background = '';
        element.style.minHeight = '';
        
        const label = element.querySelector('span');
        if (label) element.removeChild(label);
      }
    });
  }
}
```

## Privacy and Compliance

### Step 9: Create Cookie Consent Banner Component

```typescript
// packages/core/src/ui/components/CookieConsent.tsx
import React, { useState, useEffect } from 'react';

export interface CookieConsentProps {
  privacyPolicyUrl: string;
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  privacyPolicyUrl,
  onAccept,
  onDecline
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookie-consent');
    
    if (!consentGiven) {
      setIsVisible(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept();
  };
  
  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    onDecline();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-4 shadow-md z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-4 sm:mb-0">
          <p className="text-gray-800">
            We use cookies to improve your experience and show relevant ads. 
            By using our site, you agree to our use of cookies. 
            <a 
              href={privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 ml-1"
            >
              Learn more
            </a>
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Step 10: Implement Privacy Policy Page for Each Variant

Create a privacy policy template that can be customized for each variant:

```typescript
// packages/heicflip/src/pages/PrivacyPolicy.tsx
import React from 'react';
import { theme } from '../config/theme';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{theme.siteName} Privacy Policy</h1>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
        <p className="mb-4">
          This Privacy Policy explains how {theme.siteName} collects, uses, and shares information 
          about you when you use our website at {theme.domain}.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
        <p className="mb-4">
          We collect information that you provide directly to us, such as when you use our 
          conversion tools, contact us, or sign up for our newsletter.
        </p>
        <p className="mb-4">
          We also automatically collect certain information about your device and how you 
          interact with our website, including:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Log information (such as IP address, browser type, pages visited)</li>
          <li>Device information (such as hardware model, operating system)</li>
          <li>Usage information (such as how you use our conversion tools)</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Cookies and Similar Technologies</h2>
        <p className="mb-4">
          We use cookies and similar technologies to collect information about your browsing 
          activities and to personalize content including ads.
        </p>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">How We Use Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Provide and improve our conversion services</li>
          <li>Communicate with you about our services</li>
          <li>Monitor and analyze usage patterns</li>
          <li>Personalize content and advertisements</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Advertising</h2>
        <p className="mb-4">
          We work with third-party advertising companies to show you ads on our website. 
          These companies may use information about your visits to this and other websites 
          to provide advertisements about goods and services that may interest you.
        </p>
        <p className="mb-4">
          We use the following advertising partners:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>Google AdSense</li>
          {/* Add other ad networks as applicable */}
        </ul>
      </section>
      
      {/* Additional sections for sharing info, user choices, data retention, etc. */}
      
      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mb-4">
          Email: privacy@{theme.domain}
        </p>
      </section>
      
      <p className="text-sm text-gray-500">
        Last updated: April 30, 2025
      </p>
    </div>
  );
};
```

## Summary of Files to Create for Ad Implementation

1. Core package:
   - `packages/core/src/ui/components/ads/AdUnit.tsx`
   - `packages/core/src/ui/components/ads/AdBanner.tsx`
   - `packages/core/src/ui/components/ads/InterstitialAd.tsx`
   - `packages/core/src/ui/components/ads/index.ts`
   - `packages/core/src/ui/components/CookieConsent.tsx`
   - `packages/core/src/utils/ads.ts`

2. For each variant:
   - `packages/{variant}/src/config/ads.ts`
   - `packages/{variant}/public/ads.txt`
   - `packages/{variant}/src/pages/PrivacyPolicy.tsx`

3. Script files:
   - `scripts/generate-ads-txt.js`

---

Last updated: April 30, 2025