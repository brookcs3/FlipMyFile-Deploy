/**
 * FFmpeg Formats Registry
 * 
 * This file contains all the formats supported by FFmpeg that we can use in our transformation system.
 * Formats are categorized by type (image, video, audio) for easier management.
 */

import { Format } from './format-registry';

/**
 * Image formats supported by FFmpeg
 */
export const imageFormats: Record<string, Format> = {
  // Already implemented formats
  heic: {
    key: 'heic',
    name: 'HEIC',
    extensions: ['.heic', '.heif'],
    mimeTypes: ['image/heic', 'image/heif'],
    description: 'High Efficiency Image Container format developed by MPEG',
  },
  jpg: {
    key: 'jpg',
    name: 'JPEG',
    extensions: ['.jpg', '.jpeg'],
    mimeTypes: ['image/jpeg'],
    description: 'Joint Photographic Experts Group format, common for photos',
  },
  webp: {
    key: 'webp',
    name: 'WebP',
    extensions: ['.webp'],
    mimeTypes: ['image/webp'],
    description: 'Modern format developed by Google with good compression',
  },
  png: {
    key: 'png',
    name: 'PNG',
    extensions: ['.png'],
    mimeTypes: ['image/png'],
    description: 'Portable Network Graphics format with lossless compression',
  },
  
  // Additional image formats supported by FFmpeg
  apng: {
    key: 'apng',
    name: 'APNG',
    extensions: ['.apng'],
    mimeTypes: ['image/apng'],
    description: 'Animated PNG format for lossless animation',
  },
  bmp: {
    key: 'bmp',
    name: 'BMP',
    extensions: ['.bmp'],
    mimeTypes: ['image/bmp'],
    description: 'Bitmap image format used by Windows',
  },
  gif: {
    key: 'gif',
    name: 'GIF',
    extensions: ['.gif'],
    mimeTypes: ['image/gif'],
    description: 'Graphics Interchange Format for simple animations',
  },
  tiff: {
    key: 'tiff',
    name: 'TIFF',
    extensions: ['.tif', '.tiff'],
    mimeTypes: ['image/tiff'],
    description: 'Tagged Image File Format for high-quality images',
  },
  ico: {
    key: 'ico',
    name: 'ICO',
    extensions: ['.ico'],
    mimeTypes: ['image/x-icon'],
    description: 'Windows Icon format for application icons',
  },
  svg: {
    key: 'svg',
    name: 'SVG',
    extensions: ['.svg'],
    mimeTypes: ['image/svg+xml'],
    description: 'Scalable Vector Graphics format for resolution-independent images',
  },
  tga: {
    key: 'tga',
    name: 'TGA',
    extensions: ['.tga'],
    mimeTypes: ['image/x-tga'],
    description: 'Truevision Graphics Adapter format for high-quality images',
  },
  dds: {
    key: 'dds',
    name: 'DDS',
    extensions: ['.dds'],
    mimeTypes: ['image/vnd.ms-dds'],
    description: 'DirectDraw Surface format used for textures in games',
  },
  exr: {
    key: 'exr',
    name: 'EXR',
    extensions: ['.exr'],
    mimeTypes: ['image/x-exr'],
    description: 'OpenEXR high dynamic range image format used in film production',
  },
};

/**
 * Video formats supported by FFmpeg
 */
export const videoFormats: Record<string, Format> = {
  // Already implemented formats
  avi: {
    key: 'avi',
    name: 'AVI',
    extensions: ['.avi'],
    mimeTypes: ['video/x-msvideo'],
    description: 'Audio Video Interleave format',
  },
  mp4: {
    key: 'mp4',
    name: 'MP4',
    extensions: ['.mp4'],
    mimeTypes: ['video/mp4'],
    description: 'MPEG-4 Part 14 video container format',
  },
  
  // Additional video formats supported by FFmpeg
  mov: {
    key: 'mov',
    name: 'MOV',
    extensions: ['.mov'],
    mimeTypes: ['video/quicktime'],
    description: 'QuickTime movie format developed by Apple',
  },
  webm: {
    key: 'webm',
    name: 'WebM',
    extensions: ['.webm'],
    mimeTypes: ['video/webm'],
    description: 'Open, royalty-free video format for the web',
  },
  mkv: {
    key: 'mkv',
    name: 'MKV',
    extensions: ['.mkv'],
    mimeTypes: ['video/x-matroska'],
    description: 'Matroska Multimedia Container format',
  },
  flv: {
    key: 'flv',
    name: 'FLV',
    extensions: ['.flv'],
    mimeTypes: ['video/x-flv'],
    description: 'Flash Video format used for internet streaming',
  },
  wmv: {
    key: 'wmv',
    name: 'WMV',
    extensions: ['.wmv'],
    mimeTypes: ['video/x-ms-wmv'],
    description: 'Windows Media Video format',
  },
  '3gp': {
    key: '3gp',
    name: '3GP',
    extensions: ['.3gp'],
    mimeTypes: ['video/3gpp'],
    description: 'Third Generation Partnership Project format for mobile phones',
  },
  ts: {
    key: 'ts',
    name: 'TS',
    extensions: ['.ts', '.m2ts', '.mts'],
    mimeTypes: ['video/mp2t'],
    description: 'MPEG Transport Stream used for broadcasting',
  },
  mpeg: {
    key: 'mpeg',
    name: 'MPEG',
    extensions: ['.mpeg', '.mpg'],
    mimeTypes: ['video/mpeg'],
    description: 'Moving Picture Experts Group video format',
  },
};

/**
 * Audio formats supported by FFmpeg
 */
export const audioFormats: Record<string, Format> = {
  mp3: {
    key: 'mp3',
    name: 'MP3',
    extensions: ['.mp3'],
    mimeTypes: ['audio/mpeg'],
    description: 'MPEG Audio Layer III format for audio compression',
  },
  wav: {
    key: 'wav',
    name: 'WAV',
    extensions: ['.wav'],
    mimeTypes: ['audio/wav', 'audio/x-wav'],
    description: 'Waveform Audio File Format, uncompressed audio',
  },
  flac: {
    key: 'flac',
    name: 'FLAC',
    extensions: ['.flac'],
    mimeTypes: ['audio/flac'],
    description: 'Free Lossless Audio Codec for lossless audio compression',
  },
  ogg: {
    key: 'ogg',
    name: 'OGG',
    extensions: ['.ogg'],
    mimeTypes: ['audio/ogg'],
    description: 'Ogg Vorbis Audio format, free and open container format',
  },
  aac: {
    key: 'aac',
    name: 'AAC',
    extensions: ['.aac', '.m4a'],
    mimeTypes: ['audio/aac', 'audio/x-m4a'],
    description: 'Advanced Audio Coding format, designed to be the successor to MP3',
  },
  wma: {
    key: 'wma',
    name: 'WMA',
    extensions: ['.wma'],
    mimeTypes: ['audio/x-ms-wma'],
    description: 'Windows Media Audio format developed by Microsoft',
  },
};

/**
 * Get all formats from all categories
 */
export function getAllFormats(): Record<string, Format> {
  return {
    ...imageFormats,
    ...videoFormats,
    ...audioFormats,
  };
}

/**
 * Register all formats with the format registry
 */
export function registerAllFormats(registry: any): void {
  // First, clear any existing formats
  registry.formats = {};
  
  // Register all formats
  const allFormats = getAllFormats();
  for (const key in allFormats) {
    registry.formats[key] = allFormats[key];
  }
  
  console.log(`Registered ${Object.keys(allFormats).length} formats with the registry.`);
}

/**
 * Get format by file extension
 */
export function getFormatByExtension(extension: string): Format | undefined {
  const allFormats = getAllFormats();
  const normalizedExtension = extension.toLowerCase();
  
  for (const key in allFormats) {
    const format = allFormats[key];
    if (format.extensions.some(ext => ext.toLowerCase() === normalizedExtension)) {
      return format;
    }
  }
  
  return undefined;
}

/**
 * Detect if format is an image format
 */
export function isImageFormat(formatKey: string): boolean {
  return formatKey in imageFormats;
}

/**
 * Detect if format is a video format
 */
export function isVideoFormat(formatKey: string): boolean {
  return formatKey in videoFormats;
}

/**
 * Detect if format is an audio format
 */
export function isAudioFormat(formatKey: string): boolean {
  return formatKey in audioFormats;
}

/**
 * Get format category
 */
export function getFormatCategory(formatKey: string): 'image' | 'video' | 'audio' | 'unknown' {
  if (isImageFormat(formatKey)) return 'image';
  if (isVideoFormat(formatKey)) return 'video';
  if (isAudioFormat(formatKey)) return 'audio';
  return 'unknown';
}
