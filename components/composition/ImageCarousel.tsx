'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface ImageCarouselProps {
  images: string[]
  title?: string
  type?: 'detail' | 'profile' | 'header-clips'
  className?: string
}

export function ImageCarousel({ images, title, type, className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-advance carousel every 5 seconds (only when not dragging)
  useEffect(() => {
    if (images.length <= 1 || isDragging) return
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, images.length, isDragging])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Touch/Mouse event handlers for dragging
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    setDragStartX(clientX)
  }

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const dragDistance = clientX - dragStartX
    setDragOffset(dragDistance)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) {
        prevSlide()
      } else {
        nextSlide()
      }
    }
    setDragOffset(0)
  }

  const preventDefault = (e: React.TouchEvent) => {
    e.preventDefault()
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'detail': return 'Detail'
      case 'profile': return 'Profile'
      case 'header-clips': return 'Installation Clips'
      default: return 'Images'
    }
  }

  return (
    <div className={`relative w-full ${className}`}>

      {/* Carousel Container */}
      <div
        className="relative overflow-hidden bg-white cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onTouchCancel={handleDragEnd}
        onTouchStartCapture={preventDefault}
        onTouchMoveCapture={preventDefault}
      >
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-in-out',
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 select-none" style={{ width: '100%' }}>
              <img
                src={image}
                alt={`${title || 'Image'} ${index + 1}`}
                className="w-full h-auto object-cover pointer-events-none"
                style={{ aspectRatio: '16/9' }}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent text-core-dark p-2 transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-8 h-8" strokeWidth={3} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-transparent text-core-dark p-2 transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-8 h-8" strokeWidth={3} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Drag Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            Drag to navigate
          </div>
        )}
      </div>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-core-dark scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
