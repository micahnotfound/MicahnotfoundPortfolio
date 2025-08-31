'use client'

import Image from 'next/image'
import { useState } from 'react'
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
  const [imageError, setImageError] = useState(false)

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

  // Fallback placeholder if image fails to load
  if (imageError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
      >
        <div className="text-gray-500 text-center p-4">
          <div className="text-sm font-ui">Image not available</div>
          <div className="text-xs">{alt || media.alt || 'Media content'}</div>
        </div>
      </div>
    )
  }

  const imageProps = {
    src: media.public_id,
    alt: alt || media.alt || 'Media content',
    sizes,
    priority,
    ...(priority ? {} : { loading }), // Apply loading only if not priority
    ...(fill ? { fill } : { width, height }),
    className,
    onError: () => setImageError(true)
  }

  return <Image {...imageProps} />
}
