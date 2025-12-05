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
  const [viewportHeight, setViewportHeight] = useState(0)
  const touchStart = useRef<{ y: number; time: number; startIndex: number; currentY: number } | null>(null)
  const isDragging = useRef(false)
  const dragDirection = useRef<'up' | 'down' | null>(null)

  // Load projects
  useEffect(() => {
    const projectsData = getProjects()
    setProjects(projectsData)
  }, [])

  // Track viewport height for accurate calculations
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
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

  // Calculate line/bar height: thin when unselected, taller when selected
  const getLineHeight = (index: number) => {
    const thinLineHeight = 9 // 45px / 5 = 9px thin line for unselected
    const textBarHeight = 45 // Full height when selected

    if (index === selectedIndex && selectedIndex !== -1) {
      return textBarHeight
    }
    return thinLineHeight
  }

  // Calculate available height for image based on position in stack
  // Lower cards (higher index) get more height because fewer cards below take up space
  const getContainerHeight = (index: number) => {
    const thinLineHeight = 9 // Height of unselected text bars in pixels
    const textBarHeight = 45 // Height of selected text bar in pixels
    const gap = 7.2 // Gap between cards in pixels
    const paddingTop = 14.4 // Top padding in pixels
    const paddingBottom = 14.4 // Bottom padding in pixels

    // Helper function to calculate full available height in pixels for a given index
    const calculateFullHeightPx = (idx: number) => {
      const cardsBelow = projects.length - 1 - idx
      const textBarsHeight = cardsBelow * thinLineHeight + textBarHeight
      const gapsHeight = cardsBelow * gap
      const totalFixedHeight = paddingTop + paddingBottom + textBarsHeight + gapsHeight
      return viewportHeight > 0 ? viewportHeight - totalFixedHeight : 0
    }

    // No images when collapsed
    if (selectedIndex === -1) {
      if (isDragging.current && dragProgress > 0 && index === 0) {
        // Calculate available height for first card when dragging from collapsed
        const fullHeightPx = calculateFullHeightPx(index)
        const currentHeight = fullHeightPx * dragProgress
        return `${currentHeight}px`
      }
      return '0px'
    }

    // When expanded and dragging
    if (isDragging.current && dragProgress > 0 && dragDirection.current) {
      const isDraggingUp = dragDirection.current === 'up'
      const nextIndex = isDraggingUp ? selectedIndex + 1 : selectedIndex - 1

      // Current selected card - shrinks as you drag
      if (index === selectedIndex) {
        const fullHeightPx = calculateFullHeightPx(index)
        const currentHeight = fullHeightPx * (1 - dragProgress)
        return `${currentHeight}px`
      }

      // Next card in drag direction - grows as you drag
      if (index === nextIndex && nextIndex >= 0 && nextIndex < projects.length) {
        const fullHeightPx = calculateFullHeightPx(index)
        const currentHeight = fullHeightPx * dragProgress
        return `${currentHeight}px`
      }

      return '0px'
    }

    // Not dragging - calculate full available height for selected card
    // Lower cards get more height because fewer cards below
    if (index === selectedIndex) {
      const fullHeightPx = calculateFullHeightPx(index)
      if (fullHeightPx > 0) {
        return `${fullHeightPx}px`
      }
      // Fallback to calc if viewport height not yet available
      const cardsBelow = projects.length - 1 - index
      const textBarsHeight = cardsBelow * thinLineHeight + textBarHeight
      const gapsHeight = cardsBelow * gap
      const totalFixedHeight = paddingTop + paddingBottom + textBarsHeight + gapsHeight
      return `calc(100vh - ${totalFixedHeight}px)`
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
          gap: '7.2px', // Reduced by 10% from 8px
          paddingTop: '14.4px', // Reduced by 10% from 16px
          paddingBottom: '14.4px' // Reduced by 10% from 16px
        }}
      >
        {projects.map((project, index) => {
          const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
            ? project.thumbnails[0]
            : project.cover

          const containerHeight = getContainerHeight(index)
          const isSelected = index === selectedIndex && selectedIndex !== -1
          const lineHeight = getLineHeight(index)

          return (
            <div
              key={`${project.slug}-${index}`}
              className="w-full cursor-pointer flex-shrink-0 flex flex-col items-end"
              style={{
                transition: isDragging.current ? 'none' : 'all 0.5s ease-out'
              }}
              onClick={() => handleThumbnailClick(index)}
            >
              {/* Container that holds image (if selected) + text line/bar */}
              <div
                className="relative flex flex-col"
                style={{
                  width: 'fit-content',
                  minWidth: isSelected ? '100%' : 'fit-content'
                }}
              >
                {/* Image container with beveled edges - only when selected */}
                {containerHeight !== '0px' && (
                  <div
                    className="relative overflow-hidden mb-1"
                    style={{
                      height: containerHeight,
                      width: '100%',
                      borderRadius: '24px',
                      transition: isDragging.current ? 'none' : 'all 0.5s ease-out'
                    }}
                  >
                    <Media
                      media={thumbnailMedia}
                      className="w-full h-full object-cover"
                      alt={project.title}
                    />
                  </div>
                )}

                {/* Text line/bar - thin line when unselected, text bar when selected */}
                <div
                  className="bg-black font-ui flex items-center ml-auto"
                  style={{
                    height: `${lineHeight}px`,
                    paddingLeft: isSelected ? '16px' : '0px',
                    paddingRight: isSelected ? '16px' : '0px',
                    fontSize: '1rem',
                    fontWeight: 'normal',
                    borderTopLeftRadius: '24px',
                    borderBottomLeftRadius: '24px',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px',
                    width: 'fit-content',
                    minWidth: isSelected ? '200px' : `${project.title.length * 8 + 32}px`, // Maintain width based on text length
                    textAlign: 'right',
                    color: isSelected ? 'white' : 'transparent', // Hide text when not selected
                    transition: isDragging.current ? 'none' : 'all 0.5s ease-out'
                  }}
                >
                  {isSelected ? project.title : ''}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
