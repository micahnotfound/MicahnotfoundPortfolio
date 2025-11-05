'use client'

import { useRef, useState } from 'react'
import { siteSettings } from '@/config/siteSettings'

interface VideoPlayerProps {
  publicId: string
  width?: number
  height?: number
  className?: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  portrait?: boolean
}

export function VideoPlayer({
  publicId,
  width = 16,
  height = 9,
  className = '',
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false,
  portrait = false
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)

  // Build Cloudinary video URL
  const videoUrl = `https://res.cloudinary.com/${siteSettings.cloudName}/video/upload/q_auto,f_auto/${publicId}`

  // Use portrait mode (9:16) if specified, otherwise use the provided dimensions
  const aspectRatio = portrait ? '9/16' : `${width}/${height}`

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
      setShowPlayButton(false)
    }
  }

  const handlePlayEvent = () => {
    setIsPlaying(true)
    setShowPlayButton(false)
  }

  const handlePauseEvent = () => {
    setIsPlaying(false)
    setShowPlayButton(true)
  }

  const handleEndedEvent = () => {
    setIsPlaying(false)
    setShowPlayButton(true)
  }

  // Don't show play button if autoplay is enabled
  const shouldShowPlayButton = showPlayButton && !autoPlay

  return (
    <div className={`w-full relative ${className}`} style={{ aspectRatio }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover shadow-lg"
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        onPlay={handlePlayEvent}
        onPause={handlePauseEvent}
        onEnded={handleEndedEvent}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        <source src={videoUrl.replace('.mp4', '.ogv')} type="video/ogg" />
        Your browser does not support the video tag.
      </video>

      {/* Play Button Overlay */}
      {shouldShowPlayButton && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-300 group z-10"
          aria-label="Play video"
        >
          <div className="relative">
            {/* Circular play button */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/90 hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg flex items-center justify-center">
              {/* Play triangle */}
              <svg
                className="w-10 h-10 md:w-12 md:h-12 text-gray-900 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
