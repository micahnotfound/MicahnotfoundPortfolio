'use client'

import { useState, useEffect, useRef } from 'react'
import { MobileProjectCard } from '@/components/composition/MobileProjectCard'
import { getProjects } from '@/lib/content'
import type { Project } from '@/types/content'

export default function SliderPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0) // Fractional position for ultra-smooth scrolling
  const [expansionProgress, setExpansionProgress] = useState(0) // 0 = collapsed, 1 = fully expanded
  const [isSnapping, setIsSnapping] = useState(false) // Track if we're in snap animation
  const touchStart = useRef<{ y: number; time: number; startExpansion: number; startIndex: number; startScrollPos: number } | null>(null)
  const isDragging = useRef(false)
  const snapAnimationRef = useRef<number | null>(null)

  // Load projects
  useEffect(() => {
    const projectsData = getProjects()
    setProjects(projectsData)
  }, [])

  // Handle drag gestures with smooth expansion
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Cancel any ongoing snap animation
      if (snapAnimationRef.current) {
        cancelAnimationFrame(snapAnimationRef.current)
        snapAnimationRef.current = null
      }
      setIsSnapping(false)

      touchStart.current = {
        y: e.touches[0].clientY,
        time: Date.now(),
        startExpansion: expansionProgress, // Remember where we started
        startIndex: selectedIndex, // Remember which project we started on
        startScrollPos: scrollPosition // Remember exact scroll position
      }
      isDragging.current = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || !isDragging.current) return

      const currentY = e.touches[0].clientY
      const dragDistance = touchStart.current.y - currentY // Positive = dragging up

      // If already fully expanded, handle real-time project navigation during drag
      if (touchStart.current.startExpansion >= 0.95) {
        // Ultra-smooth fractional scrolling - every pixel counts
        const pixelsPerProject = 200 // Increased even more for ultra-fluid scrolling
        const scrollDelta = dragDistance / pixelsPerProject

        // Calculate new fractional scroll position - allow free scrolling
        const newScrollPos = Math.max(0, Math.min(
          projects.length - 1,
          touchStart.current.startScrollPos + scrollDelta
        ))

        setScrollPosition(newScrollPos)

        // Update selectedIndex based on position (more lenient threshold)
        const newSelectedIndex = Math.round(newScrollPos)
        if (newSelectedIndex !== selectedIndex) {
          setSelectedIndex(newSelectedIndex)
        }

        return
      }

      // Still expanding/collapsing - handle accordion motion
      const maxDragDistance = 300 // Smooth feel
      const dragProgress = dragDistance / maxDragDistance
      const newProgress = Math.max(0, Math.min(1, touchStart.current.startExpansion + dragProgress))

      setExpansionProgress(newProgress)

      // If dragging up significantly, select first project
      if (newProgress > 0.1 && selectedIndex !== 0) {
        setSelectedIndex(0)
        setScrollPosition(0)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return

      isDragging.current = false
      const touchEnd = e.changedTouches[0].clientY
      const distance = touchStart.current.y - touchEnd
      const duration = Date.now() - touchStart.current.time
      const velocity = Math.abs(distance) / duration // pixels per millisecond

      // If started fully expanded, handle as carousel navigation
      if (touchStart.current.startExpansion >= 0.95) {
        // Determine target position - only snap if velocity is high OR clearly past midpoint
        let targetIndex = Math.round(scrollPosition)

        // Only apply velocity-based skipping for VERY high velocity
        if (velocity > 2.5) {
          const direction = distance > 0 ? 1 : -1
          const skipAmount = velocity > 4 ? 3 : 2
          targetIndex = scrollPosition + (direction * skipAmount)
        } else {
          // Low velocity - just snap to nearest, but be gentle about it
          // If we're close to current position (within 0.3), be less aggressive
          const fractionalPart = Math.abs(scrollPosition - Math.round(scrollPosition))
          if (fractionalPart < 0.3) {
            // Stay where we are if barely moved
            targetIndex = selectedIndex
          }
        }

        // Clamp to valid range
        targetIndex = Math.max(0, Math.min(projects.length - 1, targetIndex))

        // Check if swiping down at first project - collapse
        if (distance < -50 && scrollPosition < 0.5) {
          // At first project - start collapsing
          const targetProgress = 0
          const startProgress = expansionProgress
          const startScrollPos = scrollPosition
          const startTime = Date.now()
          const animationDuration = 300

          const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

          const animate = () => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / animationDuration, 1)
            const eased = easeOutCubic(progress)
            const currentProgress = startProgress + (targetProgress - startProgress) * eased
            const currentScroll = startScrollPos + (0 - startScrollPos) * eased

            setExpansionProgress(currentProgress)
            setScrollPosition(currentScroll)

            if (progress < 1) {
              snapAnimationRef.current = requestAnimationFrame(animate)
            } else {
              setExpansionProgress(targetProgress)
              setScrollPosition(0)
              setIsSnapping(false)
              snapAnimationRef.current = null
              setSelectedIndex(0)
            }
          }

          setIsSnapping(true)
          animate()
          touchStart.current = null
          return
        }

        // Gentle, fluid snap to target position - longer duration for smoother feel
        const startScrollPos = scrollPosition
        const startTime = Date.now()
        const animationDuration = 400 // Increased from 250ms for more fluid feel

        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / animationDuration, 1)
          const eased = easeOutCubic(progress)
          const currentScroll = startScrollPos + (targetIndex - startScrollPos) * eased

          setScrollPosition(currentScroll)
          setSelectedIndex(Math.round(currentScroll))

          if (progress < 1) {
            snapAnimationRef.current = requestAnimationFrame(animate)
          } else {
            setScrollPosition(targetIndex)
            setSelectedIndex(targetIndex)
            setIsSnapping(false)
            snapAnimationRef.current = null
          }
        }

        setIsSnapping(true)
        animate()
        touchStart.current = null
        return
      }

      // Was expanding/collapsing - determine snap direction
      const velocityThreshold = 0.5
      let targetProgress = 0

      if (velocity > velocityThreshold) {
        targetProgress = distance > 0 ? 1 : 0
      } else {
        targetProgress = expansionProgress > 0.3 ? 1 : 0
      }

      // Smooth snap animation
      const startProgress = expansionProgress
      const startTime = Date.now()
      const animationDuration = 300

      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / animationDuration, 1)
        const eased = easeOutCubic(progress)
        const currentProgress = startProgress + (targetProgress - startProgress) * eased
        setExpansionProgress(currentProgress)

        if (progress < 1) {
          snapAnimationRef.current = requestAnimationFrame(animate)
        } else {
          setExpansionProgress(targetProgress)
          setIsSnapping(false)
          snapAnimationRef.current = null

          if (targetProgress === 0) {
            setSelectedIndex(0)
          }
        }
      }

      setIsSnapping(true)
      animate()
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
  }, [selectedIndex, projects.length, expansionProgress])

  // Handle click on collapsed thumbnails
  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index)
    setExpansionProgress(1)
  }

  // Calculate card heights based on expansion progress (ultra-smooth interpolation)
  const getCardHeight = (index: number) => {
    const collapsedHeight = 8 // vh

    // Use fractional scroll position for buttery-smooth transitions
    const effectiveScrollPos = expansionProgress >= 0.95 ? scrollPosition : selectedIndex
    const relativePosition = index - effectiveScrollPos

    // Smooth interpolation with MUCH smaller size differences to keep all cards visible
    const getHeightForDistance = (distance: number) => {
      const absDist = Math.abs(distance)
      if (absDist < 1) {
        // Interpolate between selected (50vh) and adjacent (20vh) - reduced from 66vh
        return 50 - (50 - 20) * absDist
      } else if (absDist < 2) {
        // Interpolate between adjacent (20vh) and next (12vh)
        return 20 - (20 - 12) * (absDist - 1)
      } else if (absDist < 3) {
        // Interpolate between next (12vh) and minimum (8vh)
        return 12 - (12 - 8) * (absDist - 2)
      }
      return 8 // Minimum for distant cards - keep them visible
    }

    const expandedHeight = getHeightForDistance(relativePosition)

    // Interpolate between collapsed and expanded based on expansion progress
    const currentHeight = collapsedHeight + (expandedHeight - collapsedHeight) * expansionProgress

    return `${currentHeight}vh`
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* Mobile Vertical Carousel - Fixed, no scrolling, all cards always visible */}
      <div
        className="flex-1 flex flex-col px-4 overflow-hidden"
        style={{
          justifyContent: expansionProgress < 0.5 ? 'flex-end' : 'flex-start', // Stack at bottom when collapsed
          gap: '8px', // Standardized gap for all states
          paddingBottom: expansionProgress < 0.5 ? '8px' : '0px' // Minimal bottom padding when collapsed
        }}
      >
        {projects.map((project, index) => (
          <div
            key={`${project.slug}-${index}`}
            className="w-full cursor-pointer flex-shrink-0"
            style={{
              height: getCardHeight(index),
              overflow: 'visible' // Allow text bar to show outside
            }}
            onClick={() => {
              if (expansionProgress < 0.5) {
                handleThumbnailClick(index)
              } else {
                setSelectedIndex(index)
              }
            }}
          >
            <MobileProjectCard
              project={project}
              index={index}
              selectedIndex={selectedIndex}
              totalCards={projects.length}
              scrollPosition={expansionProgress >= 0.95 ? scrollPosition : selectedIndex}
              expansionProgress={expansionProgress}
              onSelect={(idx) => {
                if (expansionProgress < 0.5) {
                  handleThumbnailClick(idx)
                } else {
                  setSelectedIndex(idx)
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
