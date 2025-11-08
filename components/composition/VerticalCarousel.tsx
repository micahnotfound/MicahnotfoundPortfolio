'use client'

import { useState, useRef, useEffect } from 'react'
import { VerticalCarouselRow } from './VerticalCarouselRow'
import { ProjectHeader } from '@/components/shared/ProjectHeader'
import type { MediaItem } from '@/types/content'

interface CarouselSection {
  title: string
  images: MediaItem[]
  videoPublicId?: string
}

interface VerticalCarouselProps {
  sections: CarouselSection[]
  projectTitle: string
  projectDescription?: string
}

export function VerticalCarousel({ sections, projectTitle, projectDescription }: VerticalCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [edgeHover, setEdgeHover] = useState<'top' | 'bottom' | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll when hovering near edges
  useEffect(() => {
    if (!edgeHover || !containerRef.current) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
      return
    }

    const scrollSpeed = 3 // pixels per frame

    scrollIntervalRef.current = setInterval(() => {
      if (!containerRef.current) return

      if (edgeHover === 'top') {
        containerRef.current.scrollTop -= scrollSpeed
      } else if (edgeHover === 'bottom') {
        containerRef.current.scrollTop += scrollSpeed
      }

      // Check if we've scrolled to a new section and should expand it
      const container = containerRef.current
      const scrollPosition = container.scrollTop + container.clientHeight / 2

      // Find which section is in the center
      const rows = container.querySelectorAll('[data-row-index]')
      rows.forEach((row, index) => {
        const rect = row.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const rowCenter = rect.top - containerRect.top + rect.height / 2

        if (Math.abs(rowCenter - container.clientHeight / 2) < 100) {
          if (hoveredIndex !== index) {
            setHoveredIndex(index)
          }
        }
      })
    }, 16) // ~60fps

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
        scrollIntervalRef.current = null
      }
    }
  }, [edgeHover, hoveredIndex])

  // Handle wheel events for smoother scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current) return

      e.preventDefault()
      containerRef.current.scrollTop += e.deltaY
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [])

  return (
    <>
      {/* Project Header */}
      <ProjectHeader
        projectTitle={projectTitle}
        projectDescription={projectDescription}
        onScroll={setIsScrolled}
      />

      {/* Vertical Carousel with dynamic padding for header */}
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-auto snap-y snap-proximity"
        style={{
          scrollBehavior: edgeHover ? 'auto' : 'smooth',
          paddingTop: isScrolled ? '100px' : '280px', // Dynamic padding based on header state
          scrollbarWidth: 'thin',
          scrollbarColor: '#000000 #D1D5DB'
        }}
      >
        <div className="flex flex-col">
          {sections.map((section, index) => (
            <div
              key={index}
              data-row-index={index}
              className="snap-center"
            >
              <VerticalCarouselRow
                title={section.title}
                images={section.images}
                videoPublicId={section.videoPublicId}
                index={index}
                isHovered={hoveredIndex === index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onEdgeHover={setEdgeHover}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
