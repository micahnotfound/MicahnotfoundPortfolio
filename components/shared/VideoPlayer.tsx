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
          // Use the correct Cloudinary Video Player API for version 3.x
          playerRef.current = cloudinaryRef.current.videoPlayer(videoRef.current, {
            cloudName: 'dxmq5ewnv'
          })
          
          // Set the video source after player initialization
          if (playerRef.current && playerRef.current.source) {
            playerRef.current.source(publicId)
          }
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
      />
    </div>
  )
}
