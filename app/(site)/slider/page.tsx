'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileProjectCard } from '@/components/composition/MobileProjectCard'
import { Media } from '@/components/shared/Media'
import { getProjects } from '@/lib/content'
import type { Project } from '@/types/content'

export default function SliderPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1) // -1 = collapsed, 0+ = expanded with that card selected
  const [dragProgress, setDragProgress] = useState(0) // 0 to 1, tracks drag progress for smooth animation
  const touchStart = useRef<{ y: number; time: number; startIndex: number; currentY: number } | null>(null)
  const isDragging = useRef(false)
  const dragDirection = useRef<'up' | 'down' | null>(null)

  // Load projects
  useEffect(() => {
    const projectsData = getProjects()
    setProjects(projectsData)
  }, [])

  // Real-time drag tracking: smooth finger-following animation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = {
        y: e.touches[0].clientY,
        currentY: e.touches[0].clientY,
        time: Date.now(),
        startIndex: selectedIndex
      }
      isDragging.current = true
      dragDirection.current = null
      setDragProgress(0)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || !isDragging.current) return

      const currentY = e.touches[0].clientY
      const dragDistance = touchStart.current.y - currentY // Positive = dragging up
      const dragThreshold = 150 // Distance to complete transition

      // Update current Y position for direction tracking
      touchStart.current.currentY = currentY

      // Determine drag direction
      if (Math.abs(dragDistance) > 10) {
        dragDirection.current = dragDistance > 0 ? 'up' : 'down'
      }

      // Calculate progress (0 to 1) based on drag distance
      const progress = Math.max(0, Math.min(1, Math.abs(dragDistance) / dragThreshold))
      setDragProgress(progress)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return

      isDragging.current = false
      const touchEnd = e.changedTouches[0].clientY
      const distance = touchStart.current.y - touchEnd
      const swipeThreshold = 50 // Minimum distance to trigger card change

      // Determine if we should change cards based on drag distance
      if (distance > swipeThreshold) {
        // Swipe up - advance to next card
        if (selectedIndex < projects.length - 1) {
          setSelectedIndex(prev => prev + 1)
          setDragProgress(0)
        } else {
          // At last card, snap back
          setDragProgress(0)
        }
      } else if (distance < -swipeThreshold) {
        // Swipe down - go back to previous card or collapse
        if (selectedIndex > 0) {
          setSelectedIndex(prev => prev - 1)
          setDragProgress(0)
        } else if (selectedIndex === 0) {
          // Collapse back to stacked view
          setSelectedIndex(-1)
          setDragProgress(0)
        } else {
          // Already collapsed, snap back
          setDragProgress(0)
        }
      } else {
        // Didn't swipe far enough, snap back to current state
        setDragProgress(0)
      }

      touchStart.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [selectedIndex, projects.length])

  // Handle click on thumbnails
  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index)
  }

  // Calculate heights: text bars are fixed size, only selected card shows image
  const getTextBarHeight = () => {
    // All text bars are fixed at 50px (reduced from 60px)
    return '50px'
  }

  const getImageHeight = (index: number) => {
    // Reduced to fit: 5 text bars (300px ~= 37vh) + 4 gaps (32px) + top/bottom margins (16px)
    // = ~40vh used by text/gaps, leaving ~60vh for image, but use 50vh for safety
    const maxHeight = 50 // vh - reduced from 58vh to ensure everything fits

    // No images when collapsed
    if (selectedIndex === -1) {
      // During drag from collapsed, first card grows
      if (isDragging.current && dragProgress > 0 && index === 0) {
        return `${maxHeight * dragProgress}vh`
      }
      return '0px'
    }

    // When expanded and dragging
    if (isDragging.current && dragProgress > 0 && dragDirection.current) {
      const isDraggingUp = dragDirection.current === 'up'
      const nextIndex = isDraggingUp ? selectedIndex + 1 : selectedIndex - 1

      // Current selected card - shrinks as you drag
      if (index === selectedIndex) {
        const shrinkHeight = maxHeight * (1 - dragProgress)
        return `${shrinkHeight}vh`
      }

      // Next card in drag direction - grows as you drag
      if (index === nextIndex && nextIndex >= 0 && nextIndex < projects.length) {
        const growHeight = maxHeight * dragProgress
        return `${growHeight}vh`
      }

      return '0px'
    }

    // Not dragging - only selected card shows full image
    if (index === selectedIndex) {
      return `${maxHeight}vh`
    }

    return '0px'
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* TikTok-style Vertical Carousel - Swipe up/down to navigate */}
      <div
        className="flex-1 flex flex-col px-4 overflow-hidden"
        style={{
          justifyContent: 'flex-end', // Always anchor to bottom, cards grow upward
          gap: '8px',
          paddingTop: '16px', // Top margin above first element
          paddingBottom: '16px' // Bottom margin to match
        }}
      >
        {projects.map((project, index) => {
          const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
            ? project.thumbnails[0]
            : project.cover

          return (
            <div
              key={`${project.slug}-${index}`}
              className="w-full cursor-pointer flex-shrink-0 flex flex-col"
              style={{
                transition: isDragging.current ? 'none' : 'all 0.5s ease-out'
              }}
              onClick={() => handleThumbnailClick(index)}
            >
              {/* Image - shows when selected OR when transitioning */}
              {(() => {
                const imageHeight = getImageHeight(index)
                const shouldShowImage = imageHeight !== '0px'

                if (!shouldShowImage) return null

                return (
                  <div
                    className="w-full relative overflow-hidden"
                    style={{
                      height: imageHeight,
                      borderRadius: '24px',
                      marginBottom: '4px', // Reduced gap between image and text bar
                      transition: isDragging.current ? 'none' : 'height 0.5s ease-out'
                    }}
                  >
                    <Media
                      media={thumbnailMedia}
                      className="w-full h-full object-cover"
                      alt={project.title}
                    />
                  </div>
                )
              })()}

              {/* Text bar - always visible, fixed size, auto-width based on text */}
              <div
                className="bg-black text-white font-ui flex items-center ml-auto"
                style={{
                  height: getTextBarHeight(),
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  fontSize: '1rem',
                  fontWeight: 'normal', // Not bold on mobile
                  borderTopLeftRadius: '24px',
                  borderBottomLeftRadius: '24px',
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px',
                  marginTop: index === selectedIndex && selectedIndex !== -1 ? '8px' : '0px',
                  width: 'fit-content', // Only as wide as text + padding
                  textAlign: 'right'
                }}
              >
                {project.title}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
