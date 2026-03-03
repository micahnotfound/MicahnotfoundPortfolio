import { siteSettings } from '@/config/siteSettings'
import type { MediaItem } from '@/types/content'

/**
 * Build a Cloudinary URL with transformations
 */
export function buildCloudinaryUrl(
  publicId: string,
  transforms: string = 'q_auto:good,f_auto',
  format?: string
): string {
  const baseUrl = `https://res.cloudinary.com/${siteSettings.cloudName}/image/upload`
  const transformString = transforms ? `/${transforms}` : ''
  const formatString = format ? `/${format}` : ''

  return `${baseUrl}${transformString}${formatString}/${publicId}`
}

/**
 * Build a responsive srcset for an image
 */
export function buildSrcSet(
  publicId: string,
  widths: number[] = [400, 800, 1200, 1600],
  transforms: string = 'q_auto:good,f_auto'
): string {
  return widths
    .map(width => {
      const url = buildCloudinaryUrl(publicId, `${transforms},w_${width}`)
      return `${url} ${width}w`
    })
    .join(', ')
}

/**
 * Build a thumbnail URL for a MediaItem
 */
export function buildThumbnailUrl(mediaItem: MediaItem, width: number = 600): string {
  return buildCloudinaryUrl(
    mediaItem.public_id,
    `w_${width},h_${Math.round(width * 0.75)},c_fill,q_auto:good,f_auto`
  )
}

/**
 * Build a full-size URL for a MediaItem
 */
export function buildFullSizeUrl(mediaItem: MediaItem, width: number = 1600): string {
  // For videos, use video/upload path with optimized video transformations
  if (mediaItem.kind === 'video') {
    const baseUrl = `https://res.cloudinary.com/${siteSettings.cloudName}/video/upload`
    // Add .mp4 extension if not already present
    const publicId = mediaItem.public_id.endsWith('.mp4') ? mediaItem.public_id : `${mediaItem.public_id}.mp4`
    // Optimizations for fast loading:
    // - w_1920: Max width 1920px (enough for most screens, reduces file size significantly)
    // - q_auto:good: Good quality with smaller file size
    // - f_auto: Automatic format (WebM for Chrome, MP4 for Safari)
    // - vc_auto: Automatic codec selection
    // - br_2m: Limit bitrate to 2Mbps for faster loading on mobile
    return `${baseUrl}/w_1920,q_auto:good,f_auto,vc_auto,br_2m/${publicId}`
  }

  return buildCloudinaryUrl(
    mediaItem.public_id,
    `w_${width},q_auto:good,f_auto`
  )
}

/**
 * Build a logo URL
 */
export function buildLogoUrl(type: 'logoWithText' | 'logoIconOnly' | 'textOnly'): string {
  const publicId = siteSettings.logoAssets[type]
  return buildCloudinaryUrl(publicId, 'q_auto,f_auto')
}

/**
 * Get optimized image props for Next.js Image component
 */
export function getOptimizedImageProps(
  mediaItem: MediaItem,
  options: {
    width?: number
    height?: number
    priority?: boolean
    className?: string
  } = {}
): {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
} {
  const { width = 1600, height = 1200, priority = false, className } = options
  
  return {
    src: buildFullSizeUrl(mediaItem, width),
    alt: mediaItem.alt || '',
    width,
    height,
    priority,
    className
  }
}

/**
 * Get responsive image props with srcset
 */
export function getResponsiveImageProps(
  mediaItem: MediaItem,
  options: {
    sizes?: string
    priority?: boolean
    className?: string
  } = {}
): {
  src: string
  srcSet: string
  alt: string
  sizes: string
  priority?: boolean
  className?: string
} {
  const { sizes = '100vw', priority = false, className } = options
  
  return {
    src: buildFullSizeUrl(mediaItem),
    srcSet: buildSrcSet(mediaItem.public_id),
    alt: mediaItem.alt || '',
    sizes,
    priority,
    className
  }
}
