'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface HorizontalReelProps {
  children: React.ReactNode
  className?: string
  itemWidth?: number
  gap?: number
  showArrows?: boolean
}

export function HorizontalReel({ 
  children, 
  className = '',
  itemWidth = 300,
  gap = 24,
  showArrows = true
}: HorizontalReelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Check scroll position
  const checkScrollPosition = useCallback(() => {
    if (!containerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }, [])

  useEffect(() => {
    checkScrollPosition()
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollPosition)
      return () => container.removeEventListener('scroll', checkScrollPosition)
    }
  }, [checkScrollPosition])

  // Scroll functions
  const scrollLeft = useCallback(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scrollAmount = itemWidth + gap
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  }, [itemWidth, gap])

  const scrollRight = useCallback(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scrollAmount = itemWidth + gap
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }, [itemWidth, gap])

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (isMobile) return // Disable on mobile
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        scrollLeft()
        break
      case 'ArrowRight':
        event.preventDefault()
        scrollRight()
        break
    }
  }, [scrollLeft, scrollRight, isMobile])

  // Wheel to horizontal scroll (desktop only)
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (isMobile) return // Disable on mobile
    
    event.preventDefault()
    const container = containerRef.current
    if (!container) return
    
    const scrollAmount = event.deltaY > 0 ? itemWidth + gap : -(itemWidth + gap)
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }, [itemWidth, gap, isMobile])

  // Mobile fallback - use standard vertical scroll
  if (isMobile) {
    return (
      <div className={`grid grid-cols-1 gap-6 ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        tabIndex={0}
        role="region"
        aria-label="Horizontal scrolling content"
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{
              width: itemWidth,
              scrollSnapAlign: 'start'
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Arrow buttons */}
      {showArrows && (
        <>
          {/* Left arrow */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 ${
              canScrollLeft 
                ? 'opacity-100 hover:scale-110' 
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
          </button>

          {/* Right arrow */}
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 ${
              canScrollRight 
                ? 'opacity-100 hover:scale-110' 
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
