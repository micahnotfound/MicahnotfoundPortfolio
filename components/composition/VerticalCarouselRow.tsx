'use client'

import { useState, useRef, useEffect } from 'react'
import { Media } from '@/components/shared/Media'
import type { MediaItem } from '@/types/content'

interface VerticalCarouselRowProps {
  title: string
  images: MediaItem[]
  index: number
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onEdgeHover: (direction: 'top' | 'bottom' | null) => void
}

export function VerticalCarouselRow({
  title,
  images,
  index,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onEdgeHover
}: VerticalCarouselRowProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const rowRef = useRef<HTMLDivElement>(null)

  // Auto-advance images when hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 2000) // Change image every 2 seconds

    return () => clearInterval(interval)
  }, [isHovered, images.length])

  // Detect edge hover for auto-scroll
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current || !isHovered) return

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

  return (
    <div
      ref={rowRef}
      className="relative w-full transition-all duration-700 ease-out overflow-hidden"
      style={{
        height: isHovered ? '90vh' : '25vh',
        minHeight: isHovered ? '90vh' : '25vh',
        flexShrink: 0
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        onMouseLeave()
        onEdgeHover(null)
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Media
          media={images[currentImageIndex]}
          className="w-full h-full object-cover"
          alt={images[currentImageIndex].alt || `${title} image ${currentImageIndex + 1}`}
        />
      </div>

      {/* Overlay gradient for text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-700"
        style={{
          opacity: isHovered ? 1 : 0.5
        }}
      />

      {/* Title */}
      <div
        className="absolute bottom-0 left-0 right-0 p-8 transition-all duration-700"
        style={{
          transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
          opacity: isHovered ? 1 : 0.8
        }}
      >
        <h2 className="text-4xl md:text-6xl font-body font-bold text-white">
          {title}
        </h2>

        {/* Image counter when hovered */}
        {isHovered && images.length > 1 && (
          <div className="mt-4 text-white/80 text-lg font-ui">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Edge hover indicators */}
      {isHovered && (
        <>
          {/* Top edge indicator */}
          <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-b from-white/10 to-transparent" />
          </div>

          {/* Bottom edge indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-t from-white/10 to-transparent" />
          </div>
        </>
      )}
    </div>
  )
}
