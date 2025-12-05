'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { buildFullSizeUrl, buildSrcSet } from '@/lib/cloudinary'
import type { MediaItem } from '@/types/content'

interface CarouselMediaProps {
  media: MediaItem
  fallbackImage?: MediaItem // Fallback image to show while video loads
  isVisible: boolean // Is this the currently selected item
  isAdjacent: boolean // Is this next or previous (for preloading)
  priority?: boolean
  className?: string
  alt?: string
}

export function CarouselMedia({
  media,
  fallbackImage,
  isVisible,
  isAdjacent,
  priority = false,
  className = '',
  alt
}: CarouselMediaProps) {
  const [videoError, setVideoError] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle video loading and playback
  useEffect(() => {
    const video = videoRef.current
    if (!video || media.kind !== 'video') return

    const handleCanPlay = () => {
      // Video can play smoothly - mark as ready
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA or better
        setVideoReady(true)
      }
    }

    const handleError = () => {
      console.error('Video loading error:', media.public_id)
      setVideoError(true)
    }

    const handleLoadedData = () => {
      setVideoReady(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
    }
  }, [media.kind, media.public_id])

  // Auto-play when visible and ready
  useEffect(() => {
    const video = videoRef.current
    if (!video || media.kind !== 'video') return

    if (isVisible && videoReady && !videoError) {
      // Play the video
      video.play().catch((err) => {
        console.warn('Video autoplay prevented:', err)
      })
    } else if (!isVisible) {
      // Pause when not visible
      video.pause()
    }
  }, [isVisible, videoReady, videoError, media.kind])

  // For videos: always render video (so it can load), show fallback image on top until ready
  if (media.kind === 'video') {
    return (
      <div className={`relative w-full h-full ${className}`}>
        {/* Video element - always present so it can load in background */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover absolute inset-0"
          loop
          muted
          playsInline
          preload={isVisible || isAdjacent ? 'auto' : 'none'}
          style={{
            opacity: videoReady && !videoError ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          <source src={buildFullSizeUrl(media)} type="video/mp4" />
        </video>

        {/* Fallback image - shows while video loads, fades out when video ready */}
        {(!videoReady || videoError) && fallbackImage && (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={buildFullSizeUrl(fallbackImage)}
              alt={alt || media.alt || 'Media content'}
              fill
              className={className}
              style={{ objectFit: 'cover' }}
              priority={priority}
            />
          </div>
        )}
      </div>
    )
  }

  // For images: standard Image component
  return (
    <Image
      src={buildFullSizeUrl(media)}
      alt={alt || media.alt || 'Media content'}
      srcSet={buildSrcSet(media.public_id)}
      sizes="100vw"
      fill
      className={className}
      style={{ objectFit: 'cover' }}
      priority={priority || isVisible}
    />
  )
}
