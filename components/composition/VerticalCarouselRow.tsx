'use client'

import { useState, useRef } from 'react'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import type { MediaItem } from '@/types/content'

interface VerticalCarouselRowProps {
  title: string
  images: MediaItem[]
  videoPublicId?: string
  index: number
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onEdgeHover: (direction: 'top' | 'bottom' | null) => void
}

export function VerticalCarouselRow({
  title,
  images,
  videoPublicId,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onEdgeHover
}: VerticalCarouselRowProps) {
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null)
  const rowRef = useRef<HTMLDivElement>(null)

  // Detect edge hover for auto-scroll
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current || !isHovered || fullscreenIndex !== null) return

    const rect = rowRef.current.getBoundingClientRect()
    const mouseY = e.clientY - rect.top
    const height = rect.height
    const edgeThreshold = 100 // pixels from edge to trigger scroll

    if (mouseY < edgeThreshold) {
      onEdgeHover('top')
    } else if (mouseY > height - edgeThreshold) {
      onEdgeHover('bottom')
    } else {
      onEdgeHover(null)
    }
  }

  // Handle image click for fullscreen
  const handleImageClick = (idx: number) => {
    setFullscreenIndex(idx)
  }

  // Handle fullscreen close
  const handleFullscreenClose = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the image itself
    if (e.target === e.currentTarget) {
      setFullscreenIndex(null)
    }
  }

  // Calculate number of items (images + optional video)
  const totalItems = images.length + (videoPublicId ? 1 : 0)

  return (
    <>
      <div
        ref={rowRef}
        className="relative w-full transition-all duration-700 ease-out overflow-hidden bg-[#D1D5DB]"
        style={{
          height: isHovered ? '90vh' : '25vh',
          minHeight: isHovered ? '90vh' : '25vh',
          flexShrink: 0,
          padding: '20px'
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => {
          onMouseLeave()
          onEdgeHover(null)
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Title at top left - aligned with header logo */}
        <div className="absolute top-6 left-20 xl:left-[100px] z-10">
          <h2 className="text-3xl md:text-4xl font-body font-bold text-core-dark">
            {title}
          </h2>
        </div>

        {/* Images Grid - Horizontally scrolling when many items */}
        <div
          className="flex gap-5 h-full items-center justify-start overflow-x-auto px-20 xl:px-[100px]"
          style={{
            paddingTop: '60px', // Space for title
            scrollbarWidth: 'thin',
            scrollbarColor: '#000000 #D1D5DB'
          }}
        >
          {/* Images with beveled edges */}
          {images.map((image, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02]"
              style={{
                borderRadius: '24px', // Beveled edges
                height: isHovered ? 'calc(90vh - 120px)' : 'calc(25vh - 100px)',
                width: isHovered
                  ? totalItems === 1
                    ? '90%'
                    : `${Math.min(45, 90 / totalItems)}%`
                  : `${Math.min(80, 100 / totalItems)}%`,
                minWidth: isHovered ? '400px' : '200px'
              }}
              onClick={() => handleImageClick(idx)}
            >
              <Media
                media={image}
                className="w-full h-full object-cover"
                alt={image.alt || `${title} image ${idx + 1}`}
              />
            </div>
          ))}

          {/* Video Player if provided */}
          {videoPublicId && (
            <div
              className="flex-shrink-0 overflow-hidden transition-all duration-500"
              style={{
                borderRadius: '24px',
                height: isHovered ? 'calc(90vh - 120px)' : 'calc(25vh - 100px)',
                width: isHovered
                  ? totalItems === 1
                    ? '90%'
                    : `${Math.min(45, 90 / totalItems)}%`
                  : `${Math.min(80, 100 / totalItems)}%`,
                minWidth: isHovered ? '400px' : '200px'
              }}
            >
              <VideoPlayer
                publicId={videoPublicId}
                portrait={true}
                className="w-full h-full"
                controls={isHovered}
                autoPlay={false}
                muted={true}
                loop={false}
              />
            </div>
          )}
        </div>

        {/* Edge hover indicators */}
        {isHovered && fullscreenIndex === null && (
          <>
            {/* Top edge indicator */}
            <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-20">
              <div className="w-full h-full bg-gradient-to-b from-black/10 to-transparent" />
            </div>

            {/* Bottom edge indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-20">
              <div className="w-full h-full bg-gradient-to-t from-black/10 to-transparent" />
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-8"
          onClick={handleFullscreenClose}
        >
          <div
            className="max-w-[90vw] max-h-[90vh] overflow-hidden"
            style={{
              borderRadius: '24px'
            }}
          >
            <Media
              media={images[fullscreenIndex]}
              className="w-full h-full object-contain"
              alt={images[fullscreenIndex].alt || `${title} image ${fullscreenIndex + 1}`}
            />
          </div>

          {/* Close instruction */}
          <div className="absolute top-8 right-8 text-white text-lg font-ui">
            Click anywhere to close
          </div>
        </div>
      )}
    </>
  )
}
