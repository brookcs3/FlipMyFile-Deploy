# Supported Formats in HEICFlip Monorepo

This document lists all the formats and conversion modes currently supported in the project.

## Image Formats

| Format | MIME Types | Extensions | Description |
|--------|------------|------------|-------------|
| HEIC | image/heic, image/heif | .heic, .heif | High Efficiency Image Format used by Apple devices |
| JPG | image/jpeg, image/jpg | .jpg, .jpeg | Standard JPEG image format |
| PNG | image/png | .png | Portable Network Graphics format with alpha channel support |
| WebP | image/webp | .webp | Google's WebP format with good compression and quality |
| GIF | image/gif | .gif | Graphics Interchange Format, supports animations |

## Video Formats

| Format | MIME Types | Extensions | Description |
|--------|------------|------------|-------------|
| AVI | video/x-msvideo, video/avi | .avi | Audio Video Interleave, older Microsoft format |
| MP4 | video/mp4 | .mp4 | MPEG-4 container format, widely supported |
| MKV | video/x-matroska | .mkv | Matroska container format, supports many codecs |
| MOV | video/quicktime | .mov | QuickTime container format used by Apple |
| WebM | video/webm | .webm | Google's WebM format based on VP8/VP9 |

## Supported Conversion Modes

### Image Conversions

| Mode | Source | Target | Description |
|------|--------|--------|-------------|
| heicToJpg | HEIC | JPG | Convert HEIC/HEIF images to JPG format |
| jpgToHeic | JPG | HEIC | Convert JPG images to HEIC format |
| pngToWebp | PNG | WebP | Convert PNG images to WebP format |
| webpToPng | WebP | PNG | Convert WebP images to PNG format |

### Video Conversions

| Mode | Source | Target | Description |
|------|--------|--------|-------------|
| aviToMp4 | AVI | MP4 | Convert AVI videos to MP4 format |
| mp4ToAvi | MP4 | AVI | Convert MP4 videos to AVI format |
| mkvToMp4 | MKV | MP4 | Convert MKV videos to MP4 format |
| mp4ToMkv | MP4 | MKV | Convert MP4 videos to MKV format |
| gifToMp4 | GIF | MP4 | Convert GIF animations to MP4 videos |
| movToMp4 | MOV | MP4 | Convert MOV videos to MP4 format |

## FFmpeg Parameter Optimizations

Each conversion mode uses format-specific FFmpeg parameters optimized for quality and performance:

### Image Conversion Parameters

- **HEIC to JPG**: Uses quality scaling from 1-10 based on user quality setting
- **JPG to HEIC**: Uses CRF (Constant Rate Factor) and hvc1 tag for Apple compatibility
- **PNG to WebP**: Uses direct quality parameter mapping
- **WebP to PNG**: Uses lossless conversion

### Video Conversion Parameters

- **AVI to MP4**: Uses H.264 codec with quality-based CRF and AAC audio
- **MP4 to AVI**: Uses Xvid codec with quality parameter and MP3 audio
- **MKV to MP4**: Uses H.264 codec with quality-based CRF and AAC audio
- **MP4 to MKV**: Uses direct stream copy for maximum speed
- **GIF to MP4**: Uses H.264 codec with special settings for animations
- **MOV to MP4**: Uses H.264 codec with quality-based CRF and AAC audio

## Adding New Formats

To add a new format to the system:

1. Update `scripts/converter-templates/formats.json` with format details
2. Define any new conversion modes
3. Create variants using the variant creation script

For format-specific optimization guidance, see the FFmpeg documentation.

---

Last updated: April 30, 2025