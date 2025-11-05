'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
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
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  if (media.kind === 'video') {
    return (
      <div className={`relative ${className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          controls={false}
          poster={media.posterId ? buildFullSizeUrl({ ...media, public_id: media.posterId }) : undefined}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={buildFullSizeUrl(media)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Halftone play button overlay */}
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 hover:bg-opacity-30 transition-all duration-300 group"
            aria-label="Play video"
          >
            <div className="relative">
              {/* Halftone circle background */}
              <div className="w-20 h-20 rounded-full bg-white relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                {/* Halftone dots pattern */}
                <div 
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 20%, #000 1px, transparent 1px),
                      radial-gradient(circle at 60% 40%, #000 1px, transparent 1px),
                      radial-gradient(circle at 80% 20%, #000 1px, transparent 1px),
                      radial-gradient(circle at 30% 70%, #000 1px, transparent 1px),
                      radial-gradient(circle at 70% 80%, #000 1px, transparent 1px),
                      radial-gradient(circle at 40% 50%, #000 1px, transparent 1px)
                    `,
                    backgroundSize: '8px 8px, 12px 12px, 6px 6px, 10px 10px, 8px 8px, 14px 14px',
                    backgroundPosition: '0 0, 4px 4px, 2px 2px, 6px 6px, 3px 3px, 7px 7px'
                  }}
                />
                
                {/* Play triangle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className="w-8 h-8 text-gray-900 ml-1 drop-shadow-sm" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              
              {/* Outer ring for extra halftone effect */}
              <div 
                className="absolute inset-0 w-24 h-24 rounded-full border-2 border-white opacity-40 -m-2"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 25% 25%, #fff 1px, transparent 1px),
                    radial-gradient(circle at 75% 25%, #fff 1px, transparent 1px),
                    radial-gradient(circle at 25% 75%, #fff 1px, transparent 1px),
                    radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)
                  `,
                  backgroundSize: '6px 6px',
                  backgroundPosition: '0 0, 3px 3px'
                }}
              />
            </div>
          </button>
        )}
      </div>
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
    src: buildFullSizeUrl(media),
    alt: alt || media.alt || 'Media content',
    srcSet: buildSrcSet(media.public_id),
    sizes,
    priority,
    ...(priority ? {} : { loading }), // Apply loading only if not priority
    ...(fill ? { fill } : { width, height }),
    className,
    onError: () => setImageError(true)
  }

  return <Image {...imageProps} />
}
