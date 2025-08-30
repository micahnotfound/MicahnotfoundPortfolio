'use client'

import Image from 'next/image'
import { buildFullSizeUrl, buildSrcSet } from '@/lib/cloudinary'
import type { MediaItem } from '@/types/content'

interface MediaProps {
  media: MediaItem
  priority?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  alt?: string
}

export function Media({
  media,
  priority = false,
  loading = 'lazy',
  className = '',
  sizes = '100vw',
  fill = false,
  width = 1600,
  height = 1200,
  alt
}: MediaProps) {
  if (media.kind === 'video') {
    return (
      <video
        className={className}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
      >
        <source src={buildFullSizeUrl(media)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    )
  }

  const imageProps = {
    src: buildFullSizeUrl(media),
    alt: alt || media.alt || 'Media content',
    srcSet: buildSrcSet(media.public_id),
    sizes,
    priority,
    ...(priority ? {} : { loading }), // Apply loading only if not priority
    ...(fill ? { fill } : { width, height }),
    className
  }

  return <Image {...imageProps} />
}
