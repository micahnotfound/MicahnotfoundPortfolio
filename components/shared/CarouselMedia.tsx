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
  delayVideoTransition?: number // Delay in ms before showing video after becoming visible (desktop homepage only)
  objectPosition?: string // Custom object-position for focal point (e.g., "center 20%")
}

export function CarouselMedia({
  media,
  fallbackImage,
  isVisible,
  isAdjacent,
  priority = false,
  className = '',
  alt,
  delayVideoTransition = 0,
  objectPosition = 'center center'
}: CarouselMediaProps) {
  const [videoError, setVideoError] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [showVideo, setShowVideo] = useState(false) // Control when to show video (after delay)
  const videoRef = useRef<HTMLVideoElement>(null)
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Handle delayed video transition (desktop homepage only)
  useEffect(() => {
    if (media.kind !== 'video') return

    // Clear any existing timer
    if (delayTimerRef.current) {
      clearTimeout(delayTimerRef.current)
      delayTimerRef.current = null
    }

    if (isVisible && delayVideoTransition > 0) {
      // Start delay timer when visible
      delayTimerRef.current = setTimeout(() => {
        setShowVideo(true)
      }, delayVideoTransition)
    } else if (isVisible && delayVideoTransition === 0) {
      // No delay - show video immediately when ready
      setShowVideo(true)
    } else if (!isVisible) {
      // Not visible - hide video and reset
      setShowVideo(false)
    }

    return () => {
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current)
        delayTimerRef.current = null
      }
    }
  }, [isVisible, delayVideoTransition, media.kind])

  // Auto-play when visible, video is ready, and delay has passed
  useEffect(() => {
    const video = videoRef.current
    if (!video || media.kind !== 'video') return

    if (isVisible && videoReady && !videoError && showVideo) {
      // Play the video after delay
      video.play().catch((err) => {
        console.warn('Video autoplay prevented:', err)
      })
    } else if (!isVisible || !showVideo) {
      // Pause when not visible or before delay
      video.pause()
      video.currentTime = 0 // Reset to start
    }
  }, [isVisible, videoReady, videoError, showVideo, media.kind])

  // For videos: always render video (so it can load), show fallback image on top until ready and delay passed
  if (media.kind === 'video') {
    // Determine if we should show the video (both ready AND delay passed)
    const shouldShowVideo = videoReady && !videoError && showVideo

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
            opacity: shouldShowVideo ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            objectPosition: objectPosition
          }}
        >
          <source src={buildFullSizeUrl(media)} type="video/mp4" />
        </video>

        {/* Fallback image - shows while video loads OR before delay passes */}
        {!shouldShowVideo && fallbackImage && (
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
      sizes="100vw"
      fill
      className={className}
      style={{ objectFit: 'cover' }}
      priority={priority || isVisible}
    />
  )
}
