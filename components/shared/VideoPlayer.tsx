'use client'

import { useEffect, useRef } from 'react'

interface VideoPlayerProps {
  publicId: string
  width?: number
  height?: number
  className?: string
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
}

export function VideoPlayer({ 
  publicId, 
  width = 16, 
  height = 9, 
  className = '',
  controls = true,
  autoPlay = false,
  muted = true,
  loop = false
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cloudinaryRef = useRef<any>()
  const playerRef = useRef<any>()

  useEffect(() => {
    // Check if Cloudinary is already loaded
    if (cloudinaryRef.current) return

    // Wait for Cloudinary to be available
    const checkCloudinary = () => {
      if (window.cloudinary) {
        cloudinaryRef.current = window.cloudinary
        
        if (videoRef.current) {
          playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
            cloud_name: 'dxmq5ewnv',
            secure: true,
            responsive: true,
            fluid: true
          })
        }
      } else {
        // Retry after a short delay
        setTimeout(checkCloudinary, 100)
      }
    }

    checkCloudinary()

    // Cleanup function
    return () => {
      if (playerRef.current && playerRef.current.dispose) {
        playerRef.current.dispose()
      }
    }
  }, [publicId])

  return (
    <div className={`w-full ${className}`} style={{ aspectRatio: `${width}/${height}` }}>
      <video
        ref={videoRef}
        className="cld-video-player cld-fluid w-full h-full object-cover"
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        data-cld-public-id={publicId}
      />
    </div>
  )
}
