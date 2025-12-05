'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { Media } from '@/components/shared/Media'
import { getProjects } from '@/lib/content'
import type { Project } from '@/types/content'

export default function Complete2Page() {
  // Header state
  const [logoState, setLogoState] = useState<0 | 1 | 2 | 3>(0)

  // Carousel state
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1) // -1 = collapsed, 0+ = expanded
  const [dragProgress, setDragProgress] = useState(0)
  const [headerTopPosition, setHeaderTopPosition] = useState(75) // Track header vertical position in real-time (moved up 5px)
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

          // Move header up in real-time: from 75px to 15px over 150px drag
          const newTop = Math.max(15, 75 - (dragDistance / 150) * 60)
          setHeaderTopPosition(newTop)
        } else {
          setLogoState(0) // Dragging down, keep at state 0
          setHeaderTopPosition(75) // Keep at bottom position
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

          // Move header down in real-time: from 15px to 75px over 150px drag
          const newTop = Math.min(75, 15 + (absDist / 150) * 60)
          setHeaderTopPosition(newTop)
        } else {
          setLogoState(3) // Dragging up, keep at state 3
          setHeaderTopPosition(15) // Keep at top position with margin
        }
      }

      // Rubber band effect at last card - pull from bottom when swiping down
      if (selectedIndex === projects.length - 1 && dragDistance < 0) {
        // At last card, swiping down - show rubber band pull from bottom
        const absDist = Math.abs(dragDistance)
        const rubberBandProgress = -Math.min(0.3, absDist / 500) // Negative for downward pull, max 30%
        setDragProgress(rubberBandProgress)
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
            setHeaderTopPosition(75)
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
          setHeaderTopPosition(75)
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
    return 45 // pixels - constant
  }

  const getImageHeight = () => {
    if (viewportHeight === 0) return '0px' // Wait for viewport height to be set

    // ALL images are ALWAYS at full height - no growing/shrinking animations
    const textBubbleHeight = 45
    const gapBetweenImageAndBubble = 7 // Consistent 7px gap

    const maxHeightPx = viewportHeight - textBubbleHeight - gapBetweenImageAndBubble

    // When collapsed, images are height 0
    if (selectedIndex === -1) {
      return '0px'
    }

    // When expanded, ALL images are at full height
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
                setHeaderTopPosition(75)
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
      {selectedIndex === -1 ? (
        // Collapsed state: show all text bubbles in a stack at bottom
        <div
          className="h-full flex flex-col px-4 overflow-hidden transition-all duration-500 ease-out"
          style={{
            justifyContent: 'flex-end',
            gap: '7px', // Consistent 7px gap between bubbles
            paddingTop: '14.4px',
            paddingBottom: '54.4px',
            marginBottom: '-40px'
          }}
        >
          {projects.map((project, index) => (
            <div
              key={`${project.slug}-${index}`}
              className="w-full cursor-pointer flex-shrink-0 flex justify-end"
              onClick={() => handleThumbnailClick(index, project)}
            >
              <div
                className="bg-black text-white font-ui flex items-center"
                style={{
                  height: `${getTextBarHeight()}px`,
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  fontSize: '1.14rem',
                  fontWeight: 'normal',
                  borderRadius: '39px',
                  width: 'fit-content',
                  textAlign: 'right',
                  marginRight: '16px'
                }}
              >
                {project.title}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Expanded state: cards positioned absolutely, can slide from off-screen
        <div className="h-full w-full absolute top-0 left-0 overflow-hidden">
          {projects.map((project, index) => {
            const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
              ? project.thumbnails[0]
              : project.cover

            // Calculate vertical position for this card
            // ALL cards in a continuous vertical stack - just slide up/down with drag
            const imageHeight = getImageHeight()
            const textBubbleHeight = 45
            const gap = 7
            const cardHeight = imageHeight === '0px' ? textBubbleHeight : parseFloat(imageHeight) + textBubbleHeight + gap

            // Base position: cards stacked vertically from selectedIndex
            let translateY = (index - selectedIndex) * 100

            // During drag, ALL cards move together in real-time with finger
            if (isDragging.current && dragProgress > 0 && dragDirection.current) {
              if (dragDirection.current === 'up') {
                // Swiping up: all cards move up together
                translateY -= dragProgress * 100
              } else if (dragDirection.current === 'down') {
                // Swiping down: all cards move down together
                translateY += dragProgress * 100
              }
            }

            return (
              <div
                key={`${project.slug}-${index}`}
                className="w-full h-full absolute top-0 left-0 cursor-pointer"
                style={{
                  transform: `translateY(${translateY}%)`,
                  transition: isDragging.current ? 'none' : 'transform 0.5s ease-out',
                  paddingBottom: '14.4px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end'
                }}
                onClick={() => handleThumbnailClick(index, project)}
              >
                {/* Image container - ALL images at full height, no animations */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    height: imageHeight, // ALL images always at full height
                    borderTopLeftRadius: '24px',
                    borderBottomLeftRadius: '24px',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px',
                    marginLeft: '16px',
                    marginRight: '16px',
                    marginBottom: '7px', // Consistent 7px gap to text bubble
                    width: 'calc(100% - 32px)'
                  }}
                >
                  {/* Image is always full size when expanded */}
                  {imageHeight !== '0px' && (
                    <Media
                      media={thumbnailMedia}
                      className="w-full h-full object-cover"
                      alt={project.title}
                    />
                  )}
                </div>

                {/* Text bar wrapper - ensures consistent right alignment */}
                <div className="w-full flex justify-end">
                  <div
                    className="bg-black text-white font-ui flex items-center"
                    style={{
                      height: `${getTextBarHeight()}px`,
                      paddingLeft: '20px',
                      paddingRight: '20px',
                      fontSize: '1.14rem',
                      fontWeight: 'normal',
                      borderRadius: '39px',
                      width: 'fit-content',
                      textAlign: 'right',
                      marginRight: '16px'
                    }}
                  >
                    {project.title}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
