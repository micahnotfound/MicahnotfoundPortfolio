'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { Media } from '@/components/shared/Media'
import type { MediaItem } from '@/types/content'

interface ProjectRailProps {
  items: MediaItem[]
  onRailScroll?: (progress: number) => void
  className?: string
}

export function ProjectRail({ items, onRailScroll, className = '' }: ProjectRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleScroll = useCallback(() => {
    if (!railRef.current || !onRailScroll) return

    const { scrollLeft, scrollWidth, clientWidth } = railRef.current
    const maxScroll = scrollWidth - clientWidth
    const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollLeft / maxScroll)) : 0

    onRailScroll(progress)
  }, [onRailScroll])

  useEffect(() => {
    const rail = railRef.current
    if (rail) {
      rail.addEventListener('scroll', handleScroll)
      return () => rail.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // Mouse drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!railRef.current) return
    
    setIsDragging(true)
    setStartX(e.pageX - railRef.current.offsetLeft)
    setScrollLeft(railRef.current.scrollLeft)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !railRef.current) return
    
    e.preventDefault()
    const x = e.pageX - railRef.current.offsetLeft
    const walk = (x - startX) * 2
    railRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Touch functionality
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!railRef.current) return
    
    setIsDragging(true)
    setStartX(e.touches[0].pageX - railRef.current.offsetLeft)
    setScrollLeft(railRef.current.scrollLeft)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || !railRef.current) return
    
    e.preventDefault()
    const x = e.touches[0].pageX - railRef.current.offsetLeft
    const walk = (x - startX) * 2
    railRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div className={`hidden md:block fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-200 z-50 ${className}`}>
      <div
        ref={railRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-16 h-16"
            style={{ scrollSnapAlign: 'start' }}
          >
            <Media
              media={item}
              className="w-full h-full object-cover rounded"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
