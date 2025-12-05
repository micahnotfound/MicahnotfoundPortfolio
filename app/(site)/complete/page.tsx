'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { getProjects } from '@/lib/content'
import type { Project } from '@/types/content'

export default function CompletePage() {
  // Header state
  const [logoState, setLogoState] = useState<0 | 1 | 2 | 3>(0)

  // Carousel state
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1) // -1 = collapsed, 0+ = expanded
  const [dragProgress, setDragProgress] = useState(0)
  const [headerTopPosition, setHeaderTopPosition] = useState(71) // Track header vertical position in real-time (moved up 4px from 75)
  const [isAnimating, setIsAnimating] = useState(false) // Track if in momentum animation
  const [viewportHeight, setViewportHeight] = useState(0) // Track viewport height for dynamic calculations
  const touchStart = useRef<{ y: number; time: number; startIndex: number } | null>(null)
  const isDragging = useRef(false)
  const dragDirection = useRef<'up' | 'down' | null>(null)
  const lastTouchY = useRef<number>(0)
  const lastTouchTime = useRef<number>(0)

  // Load projects
  useEffect(() => {
    const projectsData = getProjects()
    setProjects(projectsData)
  }, [])

  // Track viewport height for dynamic image sizing
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  // Unified touch handling for both header and carousel
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setIsAnimating(false) // Stop any ongoing animation
      touchStart.current = {
        y: e.touches[0].clientY,
        time: Date.now(),
        startIndex: selectedIndex
      }
      isDragging.current = true
      dragDirection.current = null
      setDragProgress(0)
      lastTouchY.current = e.touches[0].clientY
      lastTouchTime.current = Date.now()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStart.current || !isDragging.current) return

      const currentY = e.touches[0].clientY
      const currentTime = Date.now()
      const dragDistance = touchStart.current.y - currentY // Positive = dragging up
      const dragThreshold = 150

      // Track velocity
      lastTouchY.current = currentY
      lastTouchTime.current = currentTime

      // Determine drag direction
      if (Math.abs(dragDistance) > 10) {
        dragDirection.current = dragDistance > 0 ? 'up' : 'down'
      }

      // Calculate progress
      const progress = Math.max(0, Math.min(1, Math.abs(dragDistance) / dragThreshold))
      setDragProgress(progress)

      // Real-time header state and position updates during drag
      if (selectedIndex === -1) {
        // Collapsed state: dragging up should shrink M and move it up in real-time
        if (dragDistance > 0) {
          // Map drag distance to logo states
          // 0-50px = state 0->1, 50-100px = state 1->2, 100-150px = state 2->3
          if (dragDistance < 50) {
            const mixProgress = dragDistance / 50
            setLogoState(mixProgress > 0.5 ? 1 : 0)
          } else if (dragDistance < 100) {
            const mixProgress = (dragDistance - 50) / 50
            setLogoState(mixProgress > 0.5 ? 2 : 1)
          } else {
            setLogoState(3)
          }

          // Move header up in real-time: from 71px to 15px over 150px drag
          const newTop = Math.max(15, 71 - (dragDistance / 150) * 56)
          setHeaderTopPosition(newTop)
        } else {
          setLogoState(0) // Dragging down, keep at state 0
          setHeaderTopPosition(71) // Keep at bottom position
        }
      } else if (selectedIndex === 0) {
        // First card expanded: dragging down should expand M and move it down in real-time
        if (dragDistance < 0) {
          const absDist = Math.abs(dragDistance)
          // Map drag distance to logo states in reverse
          // 0-50px = state 3->2, 50-100px = state 2->1, 100-150px = state 1->0
          if (absDist < 50) {
            const mixProgress = absDist / 50
            setLogoState(mixProgress > 0.5 ? 2 : 3)
          } else if (absDist < 100) {
            const mixProgress = (absDist - 50) / 50
            setLogoState(mixProgress > 0.5 ? 1 : 2)
          } else {
            setLogoState(0)
          }

          // Move header down in real-time: from 15px to 71px over 150px drag
          const newTop = Math.min(71, 15 + (absDist / 150) * 56)
          setHeaderTopPosition(newTop)
        } else {
          setLogoState(3) // Dragging up, keep at state 3
          setHeaderTopPosition(15) // Keep at top position with margin
        }
      } else {
        // Middle/last cards: keep header small during swipes between images
        setLogoState(3)
        setHeaderTopPosition(15)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return

      isDragging.current = false
      const touchEnd = e.changedTouches[0].clientY
      const distance = touchStart.current.y - touchEnd
      const timeDiff = Date.now() - touchStart.current.time

      // Calculate velocity (pixels per millisecond)
      const velocity = distance / timeDiff

      // Determine if it's a meaningful swipe based on distance OR velocity
      const swipeThreshold = 50
      const velocityThreshold = 0.3 // px/ms
      const isSwipe = Math.abs(distance) > swipeThreshold || Math.abs(velocity) > velocityThreshold

      setIsAnimating(true)

      if (isSwipe && distance > 0) {
        // Swipe up
        if (selectedIndex === -1) {
          // Collapsed: expand carousel and shrink header to state 3
          // Reset drag progress first to allow smooth CSS transition
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(0)
            setLogoState(3)
            setHeaderTopPosition(15)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else if (selectedIndex < projects.length - 1) {
          // Navigate to next card with momentum
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(prev => prev + 1)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else {
          // Last card, swiping up - no action, just snap back
          setDragProgress(0)
          setIsAnimating(false)
        }
      } else if (isSwipe && distance < 0) {
        // Swipe down
        if (selectedIndex > 0) {
          // Go back to previous card with momentum (including from last card)
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(prev => prev - 1)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else if (selectedIndex === 0) {
          // At first card: collapse carousel and expand header to state 0
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(-1)
            setLogoState(0)
            setHeaderTopPosition(71)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else if (selectedIndex === projects.length - 1) {
          // Last card, swiping down - rubber band back
          setTimeout(() => {
            setDragProgress(0)
            setIsAnimating(false)
          }, 300)
        }
      } else {
        // Didn't swipe far enough, snap back to original state
        if (selectedIndex === -1) {
          setLogoState(0)
          setHeaderTopPosition(71)
        } else {
          setLogoState(3)
          setHeaderTopPosition(15)
        }
        setDragProgress(0)
        setIsAnimating(false)
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

  // Handle click on carousel items
  const handleThumbnailClick = (index: number, project: Project) => {
    if (selectedIndex === index) {
      // Second tap on already selected card: navigate to project page
      window.location.href = `/work/${project.slug}`
    } else {
      // First tap: select this card and shrink header
      setSelectedIndex(index)
      setLogoState(3)
      setHeaderTopPosition(20)
    }
  }

  // Header helper functions
  const getButtonsMarginTop = () => {
    if (logoState === 0) return '0px'
    if (logoState === 1) return '0px'
    if (logoState === 3) return '-150px'
    return '-75px'
  }

  const getButtonHeight = () => {
    if (logoState === 0) return '36px'
    if (logoState === 1) return '36px'
    if (logoState === 3) return '0px'
    return '18px'
  }

  const getButtonGap = () => {
    if (logoState === 0) return '16px'
    if (logoState === 1) return '16px'
    if (logoState === 3) return '0px'
    return '8px'
  }

  const getButtonOpacity = () => {
    if (logoState === 0) return 1
    if (logoState === 1) return 1
    if (logoState === 3) return 0
    return 0.5
  }

  const getHeaderHeight = () => {
    const logoState0Height = 534
    const logoState1Height = 454
    const logoState2Height = 292
    const logoState3Height = 130

    let currentLogoHeight = logoState1Height
    if (logoState === 0) currentLogoHeight = logoState0Height
    if (logoState === 1) currentLogoHeight = logoState1Height
    if (logoState === 2) currentLogoHeight = logoState2Height
    if (logoState === 3) currentLogoHeight = logoState3Height

    if (logoState === 0) {
      return currentLogoHeight - 100
    } else if (logoState === 1) {
      return currentLogoHeight - 100
    } else if (logoState === 2) {
      return currentLogoHeight - 40
    } else {
      return currentLogoHeight - 20
    }
  }

  // Carousel helper functions
  const getTextBarHeight = () => {
    return 36 // pixels - match About/Contact button height
  }

  const getImageHeight = () => {
    if (viewportHeight === 0) return '0px' // Wait for viewport height to be set

    const textBubbleHeight = 36
    const gapBetweenImageAndBubble = 7
    const topMargin = 12 // Match left/right margins
    const maxHeightPx = viewportHeight - textBubbleHeight - gapBetweenImageAndBubble - topMargin

    // Images are always at full height when visible
    return `${maxHeightPx}px`
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#D1D5DB]">
      {/* Header with M Logo and Buttons - floating on top, no background */}
      <div
        className="absolute left-0 w-full z-20 pointer-events-none"
        style={{
          top: `${headerTopPosition}px`, // Real-time position tracking
          height: `${getHeaderHeight()}px`,
          paddingTop: '12px',
          paddingBottom: '8px',
          paddingLeft: '30px', // Increased from 16px to 30px
          paddingRight: '32px',
          transition: isDragging.current ? 'none' : 'top 500ms ease-out' // Smooth transition when not dragging
        }}
      >
        <div className="flex items-center justify-start gap-8 pointer-events-auto">
          <div className="flex items-center gap-8 max-w-full">
            {/* M Logo - white when over image, black when over gray, click to collapse */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                setSelectedIndex(-1)
                setLogoState(0)
                setHeaderTopPosition(71)
              }}
            >
              <MorphingHeaderLogo
                state={logoState}
                className="transition-all duration-500 ease-out"
                style={{
                  width: '205px', // 15% larger: 178 * 1.15 = 204.7
                  height: 'auto',
                  filter: selectedIndex !== -1 ? 'invert(1) brightness(2)' : 'none' // White when image is selected
                }}
              />
            </div>

            {/* About/Contact buttons */}
            <div
              className="flex flex-col flex-shrink-0 transition-all duration-500 ease-out"
              style={{
                marginTop: getButtonsMarginTop(),
                gap: getButtonGap()
              }}
            >
              <Link
                href="/about"
                className="relative text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] whitespace-nowrap overflow-hidden flex items-center justify-center"
                style={{
                  border: 'none',
                  padding: '0 1rem',
                  borderRadius: '39px',
                  height: getButtonHeight(),
                  opacity: getButtonOpacity(),
                  maskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                  WebkitMaskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                }}
              >
                about
              </Link>

              <Link
                href="/contact"
                className="relative text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] whitespace-nowrap overflow-hidden flex items-center justify-center"
                style={{
                  border: 'none',
                  padding: '0 1rem',
                  borderRadius: '39px',
                  height: getButtonHeight(),
                  opacity: getButtonOpacity(),
                  maskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                  WebkitMaskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                }}
              >
                contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel - takes full screen height, positioned based on collapsed/expanded state */}
      <div className="h-full w-full relative overflow-hidden">
        {/* Swipeable image container - ALWAYS present so images can slide from bottom */}
        <div
          className="absolute left-0 w-full"
          style={{
            top: '12px', // Top margin matches left/right margins
            paddingLeft: '12px',
            paddingRight: '12px'
          }}
        >
            {projects.map((project, index) => {
              // Determine what to show: reel video or static image
              const hasReel = !!project.reel
              const displayMedia = hasReel ? project.reel : (project.thumbnails && project.thumbnails.length > 0
                ? project.thumbnails[0]
                : project.cover)

              // Fallback image for videos (always show image while video loads)
              const fallbackImage = project.thumbnails && project.thumbnails.length > 0
                ? project.thumbnails[0]
                : project.cover

              const imageHeight = getImageHeight()

              // Calculate vertical position
              let translateYPx = 0

              if (selectedIndex === -1) {
                // When collapsed, first image starts off-screen at bottom
                if (index === 0) {
                  // Start at bottom of viewport
                  translateYPx = viewportHeight
                  // During drag up, slide up from bottom following finger
                  if (isDragging.current && dragDirection.current === 'up' && dragProgress > 0) {
                    translateYPx = viewportHeight * (1 - dragProgress)
                  }
                } else {
                  // Other images not visible when collapsed
                  return null
                }
              } else {
                // When expanded, position cards with spacing
                const cardSpacing = viewportHeight > 0 ? viewportHeight + 50 : 1000
                translateYPx = (index - selectedIndex) * cardSpacing

                // During drag, shift all images based on drag progress
                if (isDragging.current && dragProgress > 0 && dragDirection.current) {
                  if (dragDirection.current === 'up') {
                    translateYPx -= dragProgress * cardSpacing
                  } else if (dragDirection.current === 'down') {
                    translateYPx += dragProgress * cardSpacing
                  }
                }

                // Only render images near the visible card
                const isNearVisible = Math.abs(index - selectedIndex) <= 1
                if (!isNearVisible) return null
              }

              return (
                <div
                  key={`${project.slug}-${index}`}
                  className="absolute top-0 left-0 w-full cursor-pointer"
                  style={{
                    transform: `translateY(${translateYPx}px)`,
                    transition: isDragging.current ? 'none' : 'transform 0.5s ease-out',
                    paddingLeft: '12px',
                    paddingRight: '12px'
                  }}
                  onClick={() => handleThumbnailClick(index, project)}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height: imageHeight,
                      borderTopLeftRadius: '24px',
                      borderBottomLeftRadius: '24px',
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                      width: '100%',
                      transition: isDragging.current ? 'none' : 'height 0.5s ease-out'
                    }}
                  >
                    {imageHeight !== '0px' && (
                      <CarouselMedia
                        media={displayMedia}
                        fallbackImage={hasReel ? fallbackImage : undefined}
                        isVisible={index === selectedIndex}
                        isAdjacent={Math.abs(index - selectedIndex) === 1 || (selectedIndex === -1 && index === 0)}
                        className="object-cover"
                        alt={project.title}
                        priority={index === 0}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

        {/* Text bubbles container - at bottom of screen - ALWAYS present */}
        <div
          className="absolute bottom-0 left-0 w-full flex flex-col overflow-hidden transition-all duration-500 ease-out"
          style={{
            gap: '7px',
            paddingBottom: '54.4px',
            marginBottom: '-40px',
            paddingLeft: '12px',
            paddingRight: '12px'
          }}
        >
          {projects.map((project, index) => (
            <div
              key={`${project.slug}-${index}`}
              className="w-full cursor-pointer flex-shrink-0 flex justify-end"
              onClick={() => handleThumbnailClick(index, project)}
            >
              <div
                className="font-ui flex items-center"
                style={{
                  height: `${getTextBarHeight()}px`,
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  fontSize: '0.95em',
                  fontWeight: selectedIndex === index ? 'bold' : 'normal',
                  borderTopLeftRadius: '39px',
                  borderBottomLeftRadius: '39px',
                  borderTopRightRadius: '0px',
                  borderBottomRightRadius: '0px',
                  width: 'fit-content',
                  textAlign: 'right',
                  marginRight: '0px',
                  backgroundColor: selectedIndex === index ? '#D1D5DB' : 'black',
                  color: selectedIndex === index ? 'black' : 'white'
                }}
              >
                {project.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
