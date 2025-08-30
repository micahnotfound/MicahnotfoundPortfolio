'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Media } from '@/components/shared/Media'
import { VisuallyHidden } from '@/components/shared/VisuallyHidden'
import type { MediaItem } from '@/types/content'

interface CarouselWindowProps {
  items: MediaItem[]
  autoplay?: boolean
  autoplaySpeed?: number
  showArrows?: boolean
  showIndicators?: boolean
  className?: string
  'aria-label'?: string
}

export function CarouselWindow({
  items,
  autoplay = true,
  autoplaySpeed = 5000,
  showArrows = true,
  showIndicators = true,
  className = '',
  'aria-label': ariaLabel = 'Image carousel'
}: CarouselWindowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      goToPrevious()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      goToNext()
    } else if (e.key === ' ') {
      e.preventDefault()
      setIsPlaying(!isPlaying)
    } else if (e.key === 'Home') {
      e.preventDefault()
      goToIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      goToIndex(items.length - 1)
    }
  }, [goToNext, goToPrevious, isPlaying, goToIndex, items.length])

  // Handle wheel events for horizontal scrolling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (prefersReducedMotion) return
    
    e.preventDefault()
    if (e.deltaY > 0) {
      goToNext()
    } else {
      goToPrevious()
    }
  }, [goToNext, goToPrevious, prefersReducedMotion])

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || !isPlaying || prefersReducedMotion) {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
        autoplayRef.current = null
      }
      return
    }

    autoplayRef.current = setTimeout(() => {
      goToNext()
    }, autoplaySpeed)

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
      }
    }
  }, [autoplay, isPlaying, autoplaySpeed, goToNext, prefersReducedMotion])

  // Pause autoplay on hover
  const handleMouseEnter = useCallback(() => {
    if (autoplay) {
      setIsPlaying(false)
    }
  }, [autoplay])

  const handleMouseLeave = useCallback(() => {
    if (autoplay) {
      setIsPlaying(true)
    }
  }, [autoplay])

  if (items.length === 0) return null

  // For reduced motion, show static first item
  if (prefersReducedMotion) {
    return (
      <div className={`relative ${className}`}>
        <Media media={items[0]} className="w-full" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
      aria-live="polite"
      aria-roledescription="carousel"
      aria-atomic="false"
    >
      {/* Desktop: Horizontal carousel */}
      <div className="hidden md:block">
        <div className="flex transition-transform duration-500 ease-in-out">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              aria-hidden={index !== currentIndex}
            >
              <Media media={item} className="w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical stack */}
      <div className="md:hidden space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`transition-opacity duration-300 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 hidden'
            }`}
            aria-hidden={index !== currentIndex}
          >
            <Media media={item} className="w-full" />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Previous image"
            aria-controls={`carousel-${containerRef.current?.id || 'default'}`}
          >
            <VisuallyHidden>Previous image</VisuallyHidden>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Next image"
            aria-controls={`carousel-${containerRef.current?.id || 'default'}`}
          >
            <VisuallyHidden>Next image</VisuallyHidden>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && items.length > 1 && (
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
          role="tablist"
          aria-label="Carousel navigation"
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to image ${index + 1} of ${items.length}`}
              aria-controls={`carousel-${containerRef.current?.id || 'default'}`}
            />
          ))}
        </div>
      )}

      {/* Play/Pause Button */}
      {autoplay && items.length > 1 && (
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
          aria-pressed={isPlaying}
        >
          <VisuallyHidden>
            {isPlaying ? 'Pause autoplay' : 'Start autoplay'}
          </VisuallyHidden>
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      )}

      {/* Status for screen readers */}
      <VisuallyHidden>
        Image {currentIndex + 1} of {items.length}
      </VisuallyHidden>
    </div>
  )
}
