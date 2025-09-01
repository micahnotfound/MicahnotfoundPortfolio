'use client'

import { useRef } from 'react'
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

  // Build Cloudinary video URL
  const videoUrl = `https://res.cloudinary.com/${siteSettings.cloudName}/video/upload/q_auto,f_auto/${publicId}`

  return (
    <div className={`w-full ${className}`} style={{ aspectRatio: `${width}/${height}` }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg shadow-lg"
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
        <source src={videoUrl.replace('.mp4', '.ogv')} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
