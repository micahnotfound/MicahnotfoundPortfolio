'use client'

import { Media } from '@/components/shared/Media'
import type { MediaItem } from '@/types/content'

interface MasonryGalleryProps {
  media: MediaItem[]
  className?: string
}

export function MasonryGallery({ media, className = '' }: MasonryGalleryProps) {
  if (!media || media.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-gray-600 font-body">No images available for this project.</p>
      </div>
    )
  }

  // Split images into two columns
  const column1 = media.filter((_, index) => index % 2 === 0)
  const column2 = media.filter((_, index) => index % 2 === 1)

  const renderImage = (image: MediaItem, index: number) => (
    <div key={index} className="relative mb-6">
      <Media
        media={image}
        className="w-full h-auto"
        loading={index < 3 ? 'eager' : 'lazy'}
        priority={index === 0}
      />
      {image.caption && (
        <div className="mt-2 text-sm text-gray-600 font-body">
          {image.caption}
        </div>
      )}
    </div>
  )

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* Left Column */}
      <div className="space-y-6">
        {column1.map((image, index) => renderImage(image, index * 2))}
      </div>
      
      {/* Right Column */}
      <div className="space-y-6">
        {column2.map((image, index) => renderImage(image, index * 2 + 1))}
      </div>
    </div>
  )
}
