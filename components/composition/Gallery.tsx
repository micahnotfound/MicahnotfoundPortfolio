'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Media } from '@/components/shared/Media'
import type { MediaItem } from '@/types/content'

interface GalleryProps {
  items: MediaItem[]
  onScroll?: (progress: number) => void
  className?: string
}

export function Gallery({ items, onScroll, className = '' }: GalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    if (!containerRef.current || !onScroll) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const maxScroll = scrollHeight - clientHeight
    const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0

    onScroll(progress)
  }, [onScroll])

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return (
    <div
      ref={containerRef}
      className={`space-y-8 overflow-y-auto ${className}`}
      style={{ height: 'calc(100vh - 200px)' }}
    >
      {items.map((item, index) => (
        <div key={index} className="relative">
          <Media
            media={item}
            className="w-full"
            loading={index < 3 ? 'eager' : 'lazy'}
            priority={index === 0}
          />
          {item.caption && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {item.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
