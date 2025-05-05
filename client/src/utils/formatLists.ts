/**
 * Comprehensive format lists for FFmpeg conversion support
 */

export const imageFormats = {
  // Standard formats
  jpg: { label: 'JPG', description: 'Standard image format', extension: 'jpg' },
  jpeg: { label: 'JPEG', description: 'Standard image format', extension: 'jpeg' },
  png: { label: 'PNG', description: 'Lossless format with transparency', extension: 'png' },
  webp: { label: 'WebP', description: 'Modern format with better compression', extension: 'webp' },
  heic: { label: 'HEIC', description: 'Apple high-efficiency format', extension: 'heic' },
  avif: { label: 'AVIF', description: 'Newest high-efficiency format', extension: 'avif' },
  
  // Less common formats
  bmp: { label: 'BMP', description: 'Uncompressed bitmap format', extension: 'bmp' },
  tiff: { label: 'TIFF', description: 'High-quality professional format', extension: 'tiff' },
  tga: { label: 'TGA', description: 'Used in animation and VFX', extension: 'tga' },
  jp2: { label: 'JPEG 2000', description: 'Advanced JPEG version', extension: 'jp2' },
  ppm: { label: 'PPM', description: 'Portable pixmap format', extension: 'ppm' },
  gif: { label: 'GIF', description: 'Simple animated format', extension: 'gif' },
};

export const videoFormats = {
  // Standard formats
  mp4: { label: 'MP4', description: 'Universal video format (H.264)', extension: 'mp4' },
  webm: { label: 'WebM', description: 'Open web video format (VP9)', extension: 'webm' },
  mov: { label: 'MOV', description: 'Apple QuickTime format', extension: 'mov' },
  avi: { label: 'AVI', description: 'Microsoft video format', extension: 'avi' },
  mkv: { label: 'MKV', description: 'Matroska multimedia container', extension: 'mkv' },
  
  // Less common formats
  ts: { label: 'TS', description: 'MPEG transport stream', extension: 'ts' },
  flv: { label: 'FLV', description: 'Flash video format', extension: 'flv' },
  wmv: { label: 'WMV', description: 'Windows Media Video', extension: 'wmv' },
  mpeg: { label: 'MPEG', description: 'Standard video format', extension: 'mpeg' },
  '3gp': { label: '3GP', description: 'Mobile phone video format', extension: '3gp' },
  ogv: { label: 'OGV', description: 'Ogg video format', extension: 'ogv' },
  gif: { label: 'GIF', description: 'Animated image format', extension: 'gif' },
};

export const audioFormats = {
  // Standard formats
  mp3: { label: 'MP3', description: 'Universal audio format', extension: 'mp3' },
  wav: { label: 'WAV', description: 'Uncompressed audio format', extension: 'wav' },
  aac: { label: 'AAC', description: 'Advanced audio coding', extension: 'aac' },
  ogg: { label: 'OGG', description: 'Open source audio format', extension: 'ogg' },
  flac: { label: 'FLAC', description: 'Lossless audio format', extension: 'flac' },
  
  // Less common formats
  m4a: { label: 'M4A', description: 'iTunes audio format', extension: 'm4a' },
  opus: { label: 'OPUS', description: 'Modern low-latency format', extension: 'opus' },
  wma: { label: 'WMA', description: 'Windows Media Audio', extension: 'wma' },
  aiff: { label: 'AIFF', description: 'Apple audio interchange format', extension: 'aiff' },
  amr: { label: 'AMR', description: 'Mobile phone audio format', extension: 'amr' },
};

// Helper function to detect file type from file extension
export function detectFileType(fileName: string): 'image' | 'video' | 'audio' | 'unknown' {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  if (Object.keys(imageFormats).includes(extension)) {
    return 'image';
  } else if (Object.keys(videoFormats).includes(extension)) {
    return 'video';
  } else if (Object.keys(audioFormats).includes(extension)) {
    return 'audio';
  }
  
  return 'unknown';
}

// Helper function to determine file type from a File object
export function getFileType(file: File): 'image' | 'video' | 'audio' | 'unknown' {
  // First try to use the MIME type
  if (file.type.startsWith('image/')) {
    return 'image';
  } else if (file.type.startsWith('video/')) {
    return 'video';
  } else if (file.type.startsWith('audio/')) {
    return 'audio';
  }
  
  // Fall back to extension-based detection
  return detectFileType(file.name);
}

// Helper function to get compatible target formats based on source file type
export function getCompatibleFormats(fileType: 'image' | 'video' | 'audio' | 'unknown'): string[] {
  switch (fileType) {
    case 'image':
      return Object.keys(imageFormats).map(key => imageFormats[key as keyof typeof imageFormats].label);
    case 'video':
      return Object.keys(videoFormats).map(key => videoFormats[key as keyof typeof videoFormats].label);
    case 'audio':
      return Object.keys(audioFormats).map(key => audioFormats[key as keyof typeof audioFormats].label);
    default:
      return [];
  }
}

// Get a combined list of all formats
export function getAllFormats() {
  return {
    ...imageFormats,
    ...videoFormats,
    ...audioFormats
  };
}