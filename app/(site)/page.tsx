'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { getProjects } from '@/lib/content'
import type { Project } from '@/types/content'
import { useHover } from '@/contexts/HoverContext'

export default function HomePage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { hoverArea, setHoverArea } = useHover()
  const carouselRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Mobile states
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [dragProgress, setDragProgress] = useState(0)
  const [headerTopPosition, setHeaderTopPosition] = useState(71)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [logoState, setLogoState] = useState<0 | 1 | 2 | 3>(0)
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false)
  const mobileCarouselTouchStart = useRef<{ y: number; time: number; startIndex: number } | null>(null)
  const isDragging = useRef(false)
  const dragDirection = useRef<'up' | 'down' | null>(null)
  const lastTouchY = useRef<number>(0)
  const lastTouchTime = useRef<number>(0)
  const swipeIndicatorTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Desktop states
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(null)
  const [previousVideoIndex, setPreviousVideoIndex] = useState<number | null>(null)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [logoTopPosition, setLogoTopPosition] = useState(145)
  const [isMouseNearLogo, setIsMouseNearLogo] = useState(false)
  const [hasEverHovered, setHasEverHovered] = useState(false)
  const [isContactExpandedMobile, setIsContactExpandedMobile] = useState(false)
  const [isContactExpandedDesktop, setIsContactExpandedDesktop] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(0)

  useEffect(() => {
    setHoverArea(null)
    const loadProjects = async () => {
      const projectsData = getProjects()
      setProjects(projectsData)
      setIsLoading(false)
    }
    loadProjects()
  }, [setHoverArea])

  // Auto-close contact buttons when logo state changes (desktop: when logoState becomes 3, mobile: when logoState becomes 3)
  useEffect(() => {
    if (logoState === 3) {
      setIsContactExpandedMobile(false)
      setIsContactExpandedDesktop(false)
    }
  }, [logoState])

  // Track viewport height for mobile
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  // Track viewport width for desktop button sizing
  useEffect(() => {
    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth)
    }
    updateViewportWidth()
    window.addEventListener('resize', updateViewportWidth)
    return () => window.removeEventListener('resize', updateViewportWidth)
  }, [])

  // Mobile: Show swipe indicator after 5 seconds with video bob animation
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth >= 768) return // Exit on desktop
    if (isLoading || projects.length === 0) return // Wait for projects to load

    console.log('Starting swipe indicator timer...')

    // Start timer to show indicator after 5 seconds
    swipeIndicatorTimerRef.current = setTimeout(() => {
      console.log('Showing swipe indicator')
      setShowSwipeIndicator(true)
      // Hide after animation completes (5 seconds)
      setTimeout(() => {
        console.log('Hiding swipe indicator')
        setShowSwipeIndicator(false)
      }, 5000)
    }, 5000)

    // Hide indicator on any touch interaction
    const hideIndicator = () => {
      console.log('Touch detected, hiding indicator')
      setShowSwipeIndicator(false)
      if (swipeIndicatorTimerRef.current) {
        clearTimeout(swipeIndicatorTimerRef.current)
      }
    }

    document.addEventListener('touchstart', hideIndicator, { once: true })

    return () => {
      if (swipeIndicatorTimerRef.current) {
        clearTimeout(swipeIndicatorTimerRef.current)
      }
      document.removeEventListener('touchstart', hideIndicator)
    }
  }, [isLoading, projects])

  // Desktop: Handle wheel events for horizontal scrolling
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!carouselRef.current) return

      const scrollAmount = e.deltaY * 2
      carouselRef.current.scrollLeft += scrollAmount
    }

    const carouselElement = carouselRef.current
    if (carouselElement) {
      carouselElement.addEventListener('wheel', handleWheel, { passive: false })
    }
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('wheel', handleWheel)
      }
      document.removeEventListener('wheel', handleWheel)
    }
  }, [isLoading, projects])

  // Desktop: Track mouse position to detect if near M logo
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return

    let rafId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return // Throttle to animation frame

      rafId = requestAnimationFrame(() => {
        const distanceFromTop = e.clientY
        const distanceFromLeft = e.clientX
        const isNear = distanceFromTop < 600 && distanceFromLeft < 1000
        setIsMouseNearLogo(isNear)
        rafId = null
      })
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  // Desktop: M logo animation based on video state and mouse position
  useEffect(() => {
    if (currentVideoIndex === null) {
      setLogoState(0)
      setLogoTopPosition(145)
    } else {
      if (isMouseNearLogo) {
        setLogoState(0)
        setLogoTopPosition(100)
      } else {
        setLogoState(3)
        setLogoTopPosition(60)
      }
    }
  }, [currentVideoIndex, isMouseNearLogo])

  // Desktop: Update video index when hovering
  useEffect(() => {
    if (hoveredIndex !== null) {
      if (currentVideoIndex !== null) {
        if (hoveredIndex > currentVideoIndex) {
          setSlideDirection('left')
        } else if (hoveredIndex < currentVideoIndex) {
          setSlideDirection('right')
        }
        setPreviousVideoIndex(currentVideoIndex)
      }
      setCurrentVideoIndex(hoveredIndex)
    }
  }, [hoveredIndex, currentVideoIndex])

  // Mobile: Touch handling
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth >= 768) return

    const handleTouchStart = (e: TouchEvent) => {
      console.log('🔵 Touch Start - Y position:', e.touches[0].clientY)
      setIsAnimating(false)
      mobileCarouselTouchStart.current = {
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
      if (!mobileCarouselTouchStart.current || !isDragging.current) return

      const currentY = e.touches[0].clientY
      const dragDistance = mobileCarouselTouchStart.current.y - currentY
      const dragThreshold = 150

      lastTouchY.current = currentY
      lastTouchTime.current = Date.now()

      if (Math.abs(dragDistance) > 10) {
        dragDirection.current = dragDistance > 0 ? 'up' : 'down'
        console.log(`🔼 Swipe ${dragDirection.current} detected - Distance: ${Math.round(dragDistance)}px`)
      }

      const progress = Math.max(0, Math.min(1, Math.abs(dragDistance) / dragThreshold))
      setDragProgress(progress)

      if (selectedIndex === -1) {
        if (dragDistance > 0) {
          if (dragDistance < 50) {
            const mixProgress = dragDistance / 50
            setLogoState(mixProgress > 0.5 ? 1 : 0)
          } else if (dragDistance < 100) {
            const mixProgress = (dragDistance - 50) / 50
            setLogoState(mixProgress > 0.5 ? 2 : 1)
          } else {
            setLogoState(3)
          }
          const newTop = Math.max(52, 71 - (dragDistance / 150) * 56)
          setHeaderTopPosition(newTop)
        } else {
          setLogoState(0)
          setHeaderTopPosition(71)
        }
      } else if (selectedIndex === 0) {
        if (dragDistance < 0) {
          const absDist = Math.abs(dragDistance)
          if (absDist < 50) {
            const mixProgress = absDist / 50
            setLogoState(mixProgress > 0.5 ? 2 : 3)
          } else if (absDist < 100) {
            const mixProgress = (absDist - 50) / 50
            setLogoState(mixProgress > 0.5 ? 1 : 2)
          } else {
            setLogoState(0)
          }
          const newTop = Math.min(71, 52 + (absDist / 150) * 56)
          setHeaderTopPosition(newTop)
        } else {
          setLogoState(3)
          setHeaderTopPosition(52)
        }
      } else {
        setLogoState(3)
        setHeaderTopPosition(52)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!mobileCarouselTouchStart.current) return

      isDragging.current = false
      const touchEnd = e.changedTouches[0].clientY
      const distance = mobileCarouselTouchStart.current.y - touchEnd
      const timeDiff = Date.now() - mobileCarouselTouchStart.current.time
      const velocity = distance / timeDiff
      const swipeThreshold = 50
      const velocityThreshold = 0.3
      const isSwipe = Math.abs(distance) > swipeThreshold || Math.abs(velocity) > velocityThreshold

      setIsAnimating(true)

      if (isSwipe && distance > 0) {
        if (selectedIndex === -1) {
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(0)
            setLogoState(3)
            setHeaderTopPosition(52)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else if (selectedIndex < projects.length - 1) {
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(prev => prev + 1)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else {
          setDragProgress(0)
          setIsAnimating(false)
        }
      } else if (isSwipe && distance < 0) {
        if (selectedIndex > 0) {
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(prev => prev - 1)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else if (selectedIndex === 0) {
          setDragProgress(0)
          requestAnimationFrame(() => {
            setSelectedIndex(-1)
            setLogoState(0)
            setHeaderTopPosition(71)
            setTimeout(() => setIsAnimating(false), 500)
          })
        }
      } else {
        if (selectedIndex === -1) {
          setLogoState(0)
          setHeaderTopPosition(71)
        } else {
          setLogoState(3)
          setHeaderTopPosition(52)
        }
        setDragProgress(0)
        setIsAnimating(false)
      }

      mobileCarouselTouchStart.current = null
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

  // Mobile helper functions
  const handleThumbnailClick = (index: number, project: Project) => {
    if (selectedIndex === index) {
      window.location.href = `/work/${project.slug}`
    } else {
      setIsAnimating(true)
      requestAnimationFrame(() => {
        setSelectedIndex(index)
        setLogoState(3)
        setHeaderTopPosition(52)
        setTimeout(() => setIsAnimating(false), 500)
      })
    }
  }

  const getButtonsMarginTop = () => {
    if (logoState === 0) return '15px'
    if (logoState === 1) return '15px'
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

  const getImageHeight = () => {
    if (viewportHeight === 0) return '0px'

    const textBubbleHeight = 36
    const gapBetweenImageAndBubble = 7
    const topMargin = 12
    const maxHeightPx = viewportHeight - textBubbleHeight - gapBetweenImageAndBubble - topMargin

    return `${maxHeightPx}px`
  }

  const getTextBubblesBottom = () => {
    if (viewportHeight === 0) return '54.4px'

    if (logoState === 0) {
      return '54.4px'
    } else if (logoState === 3) {
      const bubbleHeight = 36
      const bubbleGap = 16
      const totalBubblesHeight = projects.length * (bubbleHeight + bubbleGap)
      const middleOfScreen = viewportHeight / 2
      return `${middleOfScreen - totalBubblesHeight / 2}px`
    } else {
      const bottomPos = 54.4
      const middlePos = (viewportHeight / 2) - ((projects.length * 52) / 2)
      const progress = logoState / 3
      return `${bottomPos + (middlePos - bottomPos) * progress}px`
    }
  }

  const skeletonCount = 6

  // Calculate skeleton button width based on viewport
  const getSkeletonWidth = () => {
    if (typeof window === 'undefined') return 200
    const currentViewportWidth = viewportWidth || window.innerWidth
    const totalPadding = 160 // 80px left + 80px right
    const expansionBuffer = 100 // room for expansion
    const gapSpace = (skeletonCount - 1) * 10 // 0.6rem gaps
    const availableWidth = currentViewportWidth - totalPadding - expansionBuffer - gapSpace
    const buttonWidth = availableWidth / skeletonCount
    return Math.max(100, Math.min(200, buttonWidth))
  }

  return (
    <>
      {/* Mobile View - visible on mobile only */}
      <div className="block md:hidden h-screen w-full relative overflow-hidden bg-[#D1D5DB]">
        {/* CSS for wave animation on text bubble indicators */}
        <style jsx>{`
          @keyframes bubbleWave {
            0%, 100% {
              width: 12px;
            }
            50% {
              width: 30px;
            }
          }
        `}</style>
        {/* Mobile Header */}
        <div
          className="absolute left-0 w-full z-20 pointer-events-none"
          style={{
            top: `${headerTopPosition}px`,
            height: `${getHeaderHeight()}px`,
            paddingTop: '12px',
            paddingBottom: '8px',
            paddingLeft: '30px',
            paddingRight: '32px',
            transition: isDragging.current ? 'none' : 'top 500ms ease-out'
          }}
        >
          <div className="flex flex-col items-start pointer-events-auto">
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
                style={{
                  width: '205px',
                  height: 'auto'
                }}
              />
            </div>

            {/* Buttons container - positioned underneath M SVG */}
            <div
              className="flex flex-row transition-all duration-500 ease-out"
              style={{
                marginTop: getButtonsMarginTop(),
                gap: getButtonGap(),
                alignItems: 'flex-start'
              }}
            >
                <Link
                  href="/about"
                  className="text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] whitespace-nowrap overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{
                    border: 'none',
                    padding: '0 1rem',
                    borderRadius: '0px',
                    height: getButtonHeight(),
                    width: 'auto',
                    opacity: getButtonOpacity(),
                    maskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                    WebkitMaskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                  }}
                >
                  about
                </Link>

                <div
                  className="relative font-ui bg-core-dark text-white cursor-pointer flex-shrink-0"
                  style={{
                    border: 'none',
                    padding: '0 1rem',
                    paddingBottom: isContactExpandedMobile ? '1rem' : '0',
                    borderRadius: '0px',
                    height: isContactExpandedMobile ? '140px' : getButtonHeight(),
                    minWidth: '85px',
                    width: isContactExpandedMobile ? 'calc(100vw - 30px - 32px - 85px - 16px)' : 'auto',
                    maxWidth: isContactExpandedMobile ? '250px' : 'auto',
                    opacity: getButtonOpacity(),
                    maskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                    WebkitMaskImage: (logoState === 0 || logoState === 1) ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                    overflow: 'hidden',
                    transition: 'width 600ms ease-out, height 600ms ease-out, max-width 600ms ease-out, opacity 500ms ease-out, padding-bottom 600ms ease-out'
                  }}
                  onClick={() => setIsContactExpandedMobile(!isContactExpandedMobile)}
                >
                  {/* Button content container */}
                  <div className="relative w-full h-full">
                    {/* Contact label - always visible at top */}
                    <div
                      className="absolute top-0 left-0 w-full text-[0.95em]"
                      style={{
                        height: getButtonHeight(),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isContactExpandedMobile ? 'flex-start' : 'center'
                      }}
                    >
                      contact
                    </div>

                    {/* Expanded content - fades in below */}
                    <div
                      className="absolute left-0 w-full text-left"
                      style={{
                        top: getButtonHeight(),
                        opacity: isContactExpandedMobile ? 1 : 0,
                        transition: 'opacity 600ms ease-out',
                        pointerEvents: isContactExpandedMobile ? 'auto' : 'none'
                      }}
                    >
                      <div className="space-y-1 text-[0.95em] pt-2">
                        <a href="mailto:Micah@art404.com" className="block hover:underline text-sm">
                          Micah@art404.com
                        </a>
                        <a
                          href="https://www.linkedin.com/in/micah-milner-5bb13729/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:underline text-sm"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="https://www.instagram.com/micahnotfound/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:underline text-sm"
                        >
                          Instagram
                        </a>
                        <div className="text-sm">8636024715</div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="h-full w-full relative overflow-hidden">
          <div
            className="absolute left-0 w-full"
            style={{
              top: '12px',
              paddingLeft: '12px',
              paddingRight: '12px'
            }}
          >
            {projects.map((project, index) => {
              const hasReel = !!project.reel
              const displayMedia = hasReel ? project.reel : (project.thumbnails && project.thumbnails.length > 0
                ? project.thumbnails[0]
                : project.cover)

              const fallbackImage = project.thumbnails && project.thumbnails.length > 0
                ? project.thumbnails[0]
                : project.cover

              const imageHeight = getImageHeight()

              let translateYPx = 0

              if (selectedIndex === -1) {
                if (index === 0) {
                  translateYPx = viewportHeight
                  if (isDragging.current && dragDirection.current === 'up' && dragProgress > 0) {
                    translateYPx = viewportHeight * (1 - dragProgress)
                  }
                } else {
                  return null
                }
              } else {
                const cardSpacing = viewportHeight > 0 ? viewportHeight + 50 : 1000
                translateYPx = (index - selectedIndex) * cardSpacing

                if (isDragging.current && dragProgress > 0 && dragDirection.current) {
                  if (dragDirection.current === 'up') {
                    translateYPx -= dragProgress * cardSpacing
                  } else if (dragDirection.current === 'down') {
                    translateYPx += dragProgress * cardSpacing
                  }
                }

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
                      borderRadius: '24px',
                      width: '100%',
                      transition: isDragging.current ? 'none' : 'height 0.5s ease-out'
                    }}
                  >
                    {imageHeight !== '0px' && displayMedia && (
                      <CarouselMedia
                        media={displayMedia}
                        // When no project is selected yet (selectedIndex === -1), treat the first card
                        // as "adjacent" so its video fully preloads before the user swipes up.
                        isVisible={index === selectedIndex}
                        isAdjacent={
                          Math.abs(index - selectedIndex) === 1 ||
                          (selectedIndex === -1 && index === 0)
                        }
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

          {/* Mobile Text bubbles */}
          <div
            className="absolute flex flex-col-reverse overflow-visible transition-all duration-500 ease-out z-30"
            style={{
              bottom: getTextBubblesBottom(),
              right: '50px',
              gap: '16px'
            }}
          >
            {projects.map((project, index) => {
              const isSelected = selectedIndex === index
              const collapsedHeight = 18
              const collapsedWidth = 12
              const expandedHeight = 36

              return (
                <div
                  key={`${project.slug}-${index}`}
                  className="cursor-pointer flex-shrink-0 flex justify-end items-center transition-all duration-1000 ease-out"
                  onClick={() => handleThumbnailClick(index, project)}
                  style={{
                    height: isSelected ? `${expandedHeight}px` : `${collapsedHeight}px`
                  }}
                >
                  <div
                    className="font-ui flex items-center justify-end transition-all duration-1000 ease-out"
                    style={{
                      height: isSelected ? `${expandedHeight}px` : `${collapsedHeight}px`,
                      width: isSelected ? 'auto' : `${collapsedWidth}px`,
                      paddingLeft: isSelected ? '16px' : '0px',
                      paddingRight: isSelected ? '29px' : '0px',
                      fontSize: '0.85em',
                      fontWeight: 'normal',
                      borderRadius: '0px',
                      backgroundColor: isSelected ? 'white' : 'black',
                      color: isSelected ? 'black' : 'white',
                      overflow: 'visible',
                      whiteSpace: 'nowrap',
                      animation: !isSelected && selectedIndex === -1 ? `bubbleWave 2s ease-in-out infinite` : 'none',
                      animationDelay: `${index * 0.15}s`
                    }}
                  >
                    {isSelected && <span style={{ paddingRight: '12px' }}>{project.title}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Swipe Up Icon and Text - centered above card peek */}
        {showSwipeIndicator && viewportHeight > 0 && (
          <div
            className="fixed z-40 pointer-events-none flex flex-col items-center"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: `${viewportHeight * 0.1 + 50 + 49}px`, // Position above the card peek + 49px up
              animation: 'iconBobAndFade 5s ease-in-out forwards'
            }}
          >
            <img
              src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1772578707/swipeUp_bxdyww.svg"
              alt="Swipe up"
              style={{
                width: '52px',
                height: '52px',
                marginBottom: '8px'
              }}
            />
            <span className="font-ui text-white text-sm">swipe up</span>
          </div>
        )}

        {/* Subtle Card Peek - appears after 5 seconds to hint swipeability */}
        {showSwipeIndicator && viewportHeight > 0 && (
          <div
            className="fixed left-0 right-0 bottom-0 z-30 pointer-events-none"
            style={{
              height: `${viewportHeight * 0.06}px`, // Show 6% of the card (reduced from 10%)
              animation: 'cardPeek 5s ease-in-out forwards',
              transformOrigin: 'bottom'
            }}
          >
            {projects.length > 0 && projects[0] && (
              <div className="w-full h-full px-3">
                <div
                  className="w-full h-full overflow-hidden"
                  style={{
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: `${viewportHeight}px`,
                    transform: 'translateY(-94%)' // Show only top 6%
                  }}>
                    <CarouselMedia
                      media={projects[0].reel || projects[0].cover}
                      isVisible={true}
                      isAdjacent={false}
                      priority={false}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CSS for card peek and swipe indicator animations */}
        <style jsx>{`
          @keyframes cardPeek {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            15% {
              transform: translateY(0);
              opacity: 1;
            }
            35% {
              transform: translateY(8%);
              opacity: 1;
            }
            55% {
              transform: translateY(0);
              opacity: 1;
            }
            75% {
              transform: translateY(8%);
              opacity: 1;
            }
            90% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(100%);
              opacity: 0;
            }
          }
          @keyframes iconBobAndFade {
            0% {
              opacity: 0;
              transform: translateX(-50%) translateY(0px);
            }
            15% {
              opacity: 1;
              transform: translateX(-50%) translateY(0px);
            }
            35% {
              opacity: 1;
              transform: translateX(-50%) translateY(-15px);
            }
            55% {
              opacity: 1;
              transform: translateX(-50%) translateY(0px);
            }
            75% {
              opacity: 1;
              transform: translateX(-50%) translateY(-15px);
            }
            90% {
              opacity: 1;
              transform: translateX(-50%) translateY(0px);
            }
            100% {
              opacity: 0;
              transform: translateX(-50%) translateY(0px);
            }
          }
        `}</style>
      </div>

      {/* Desktop View - visible on desktop only */}
      <div className="hidden md:block h-screen w-full bg-[#D1D5DB] relative overflow-hidden">
        {/* CSS for swaying animation */}
        <style jsx>{`
          @keyframes sway-left {
            0% { transform: translateX(0px); width: 200px; transform-origin: left center; }
            20% { transform: translateX(calc(var(--sway-distance) * -1)); width: calc(200px + var(--stretch-amount)); transform-origin: left center; }
            25% { transform: translateX(calc(var(--sway-distance) * -1)); width: calc(200px + var(--stretch-amount) * 0.5); transform-origin: right center; }
            50% { transform: translateX(var(--sway-distance)); width: 200px; transform-origin: center center; }
            70% { transform: translateX(var(--sway-distance) * 0.5); width: calc(200px + var(--stretch-amount) * 0.3); transform-origin: right center; }
            100% { transform: translateX(0px); width: 200px; transform-origin: left center; }
          }

          @keyframes sway-right {
            0% { transform: translateX(0px); width: 200px; transform-origin: right center; }
            20% { transform: translateX(calc(var(--sway-distance) * -0.5)); width: calc(200px + var(--stretch-amount) * 0.3); transform-origin: left center; }
            50% { transform: translateX(var(--sway-distance)); width: 200px; transform-origin: center center; }
            70% { transform: translateX(var(--sway-distance)); width: calc(200px + var(--stretch-amount)); transform-origin: right center; }
            75% { transform: translateX(var(--sway-distance)); width: calc(200px + var(--stretch-amount) * 0.5); transform-origin: left center; }
            100% { transform: translateX(0px); width: 200px; transform-origin: right center; }
          }

          @keyframes sway-middle {
            0%, 100% { transform: translateX(0px); width: 200px; }
            25% { transform: translateX(calc(var(--sway-distance) * -1)); width: calc(200px + var(--stretch-amount) * 0.6); }
            50% { transform: translateX(0px); width: 200px; }
            75% { transform: translateX(var(--sway-distance)); width: calc(200px + var(--stretch-amount) * 0.6); }
          }

          .sway-button-left { animation: sway-left 6s ease-in-out infinite; }
          .sway-button-right { animation: sway-right 6s ease-in-out infinite; }
          .sway-button-middle { animation: sway-middle 6s ease-in-out infinite; }
        `}</style>

        {/* Background video carousel */}
        {currentVideoIndex !== null && (
          <div className="absolute inset-0 w-full h-full z-10 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full flex transition-transform duration-[900ms] ease-out"
              style={{
                transform: `translateX(-${currentVideoIndex * 100}vw)`,
                width: `${projects.length * 100}vw`
              }}
            >
              {!isLoading && projects.map((project, index) => {
                const hasReel = !!project.reel
                const displayMedia = hasReel ? project.reel : (project.thumbnails && project.thumbnails.length > 0
                  ? project.thumbnails[0]
                  : project.cover)

                const fallbackImage = project.thumbnails && project.thumbnails.length > 0
                  ? project.thumbnails[0]
                  : project.cover

                // Render a slightly wider band of videos so we can preload ahead of the current one
                const distanceFromCurrent = Math.abs(index - currentVideoIndex)
                const shouldRender = distanceFromCurrent <= 2

                // Set custom focal point for specific projects
                const getObjectPosition = () => {
                  if (project.slug === 'moma') return 'center 30%'
                  // All other videos use 20% from top
                  return 'center 20%'
                }

                return (
                  <div
                    key={`video-${index}`}
                    className="w-screen h-full flex-shrink-0"
                    style={{
                      width: '100vw',
                      padding: '40px'
                    }}
                  >
                    <div
                      className="w-full h-full overflow-hidden"
                      style={{
                        borderRadius: '32px'
                      }}
                    >
                      {shouldRender && displayMedia && (
                        <CarouselMedia
                          media={displayMedia}
                          isVisible={index === currentVideoIndex}
                          // Treat nearby videos as adjacent so they fully preload in the background
                          isAdjacent={distanceFromCurrent > 0 && distanceFromCurrent <= 2}
                          className="object-cover"
                          alt={project.title}
                          priority={index === 0}
                          objectPosition={getObjectPosition()}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Desktop Header with M Logo and Buttons */}
        <div
          className="fixed left-0 w-full z-50 transition-all duration-[900ms] ease-out pointer-events-none"
          style={{
            top: `${logoTopPosition}px`,
            paddingLeft: '100px',
            paddingRight: '30px'
          }}
        >
          <div className="flex items-center justify-start gap-8">
            <div className="flex-shrink-0 cursor-pointer pointer-events-auto" onClick={() => router.push('/')}>
              <MorphingHeaderLogo
                state={logoState}
                className="transition-all duration-[900ms] ease-out"
                style={{
                  width: '325px',
                  height: 'auto'
                }}
              />
            </div>

            <div
              className="flex flex-col gap-4 transition-all duration-[900ms] ease-out pointer-events-auto"
              style={{
                opacity: logoState === 3 ? 0 : 1,
                transform: logoState === 3 ? 'translateY(-20px)' : 'translateY(0)',
                pointerEvents: logoState === 3 ? 'none' : 'auto',
                alignItems: 'flex-start'
              }}
            >
              <Link
                href="/about"
                className="text-center font-ui bg-core-dark text-white text-base whitespace-nowrap px-4 h-9 flex items-center justify-center flex-shrink-0"
                style={{ borderRadius: '0px', width: 'auto' }}
                data-cursor-hover
              >
                about
              </Link>

              <div
                className="relative font-ui bg-core-dark text-white cursor-pointer flex-shrink-0"
                style={{
                  border: 'none',
                  borderRadius: '0px',
                  height: isContactExpandedDesktop ? '160px' : '36px',
                  width: isContactExpandedDesktop ? '250px' : '96px',
                  overflow: 'hidden',
                  transition: 'width 450ms ease-out, height 450ms ease-out',
                  display: 'flex',
                  alignItems: 'flex-start',
                  paddingLeft: '1rem',
                  paddingRight: '1rem'
                }}
                onClick={() => setIsContactExpandedDesktop(!isContactExpandedDesktop)}
                data-cursor-hover
              >
                {/* Button content container */}
                <div className="relative w-full h-full">
                  {/* Contact label - always visible at top, always left-aligned */}
                  <div
                    className="text-base"
                    style={{
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start'
                    }}
                  >
                    contact
                  </div>

                  {/* Expanded content - fades in below */}
                  <div
                    className="absolute left-0 w-full text-left"
                    style={{
                      top: '36px',
                      opacity: isContactExpandedDesktop ? 1 : 0,
                      transition: 'opacity 450ms ease-out',
                      pointerEvents: isContactExpandedDesktop ? 'auto' : 'none',
                      paddingBottom: '1rem'
                    }}
                  >
                    <div className="space-y-1 text-base pt-2">
                      <a href="mailto:Micah@art404.com" className="block hover:underline text-sm">
                        Micah@art404.com
                      </a>
                      <a
                        href="https://www.linkedin.com/in/micah-milner-5bb13729/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:underline text-sm"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://www.instagram.com/micahnotfound/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:underline text-sm"
                      >
                        Instagram
                      </a>
                      <div className="text-sm">8636024715</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Text bubbles - horizontal */}
        <div
          className="fixed left-0 z-40 flex flex-row"
          style={{
            top: 'calc(66.67% + 100px)',
            transform: 'translateY(-50%)',
            left: '80px',
            right: '80px',
            gap: '0.6rem'
          }}
        >
          <div
            ref={carouselRef}
            className="flex flex-row overflow-x-visible scrollbar-hide w-full"
            style={{
              gap: '0.6rem'
            }}
          >
            {isLoading ? (
              Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex-shrink-0 animate-pulse"
                  style={{ width: `${getSkeletonWidth()}px`, height: '36px' }}
                >
                  <div className="bg-gray-300 h-full w-full" style={{ borderRadius: '0px' }} />
                </div>
              ))
            ) : (
              projects.map((project, index) => {
                // Button should be expanded if: hovering OR video is playing for this project
                const isHovered = hoveredIndex === index || currentVideoIndex === index
                const someoneIsHovered = hoveredIndex !== null

                const getDisplayTitle = () => {
                  if (isHovered) return project.title

                  const acronymMap: { [key: string]: string } = {
                    'Dreaming With The Archives': 'DWTA',
                    'NYC AIDS Memorial': 'NYCAM',
                    'KIN Festival': 'KIN'
                  }

                  return acronymMap[project.title] || project.title
                }

                // Calculate button widths based on viewport and hover state
                const getButtonWidth = () => {
                  if (typeof window === 'undefined') {
                    return isHovered ? 800 : 200
                  }

                  const currentViewportWidth = viewportWidth || window.innerWidth
                  const totalPadding = 160 // 80px left + 80px right
                  const gapSpace = (projects.length - 1) * 10 // 0.6rem gaps (~10px)

                  // When someone is hovered, calculate expanded and collapsed widths
                  if (someoneIsHovered) {
                    if (isHovered) {
                      // This button is expanded - determine collapsed width first
                      let collapsedWidth: number
                      if (currentViewportWidth < 1000) {
                        collapsedWidth = 60 // Very small - text will be cut off
                      } else if (currentViewportWidth < 1300) {
                        collapsedWidth = 80 // Small - text will be cut off
                      } else {
                        collapsedWidth = 120 // Reasonably small
                      }

                      // Calculate how much space the collapsed buttons take
                      const otherButtonsWidth = (projects.length - 1) * collapsedWidth

                      // This expanded button gets all remaining space
                      const expandedWidth = currentViewportWidth - totalPadding - gapSpace - otherButtonsWidth
                      return Math.max(200, Math.min(800, expandedWidth))
                    } else {
                      // This button is collapsed - make it small
                      if (currentViewportWidth < 1000) {
                        return 60 // Very small - text will be cut off
                      } else if (currentViewportWidth < 1300) {
                        return 80 // Small - text will be cut off
                      } else {
                        return 120 // Reasonably small
                      }
                    }
                  }

                  // When nothing is hovered, distribute space evenly
                  const expansionBuffer = 100 // leave room for future expansion
                  const availableWidth = currentViewportWidth - totalPadding - expansionBuffer - gapSpace
                  const buttonWidth = availableWidth / projects.length
                  return Math.max(100, Math.min(200, buttonWidth))
                }

                const handleMouseEnter = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  setHasEverHovered(true)
                  setHoveredIndex(index)
                  setHoverArea('textbox')
                }

                const handleMouseLeave = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredIndex(null)
                    setHoverArea(null)
                  }, 50)
                }

                const totalButtons = projects.length
                const leftThird = Math.floor(totalButtons / 3)
                const rightThird = totalButtons - Math.floor(totalButtons / 3)

                let animationClass = ''
                let swayDistance = 20
                let stretchAmount = 0

                if (index < leftThird) {
                  animationClass = 'sway-button-left'
                  swayDistance = 30 + (leftThird - index) * 10
                  stretchAmount = 40 + (leftThird - index) * 20
                } else if (index >= rightThird) {
                  animationClass = 'sway-button-right'
                  swayDistance = 30 + (index - rightThird) * 10
                  stretchAmount = 40 + (index - rightThird) * 20
                } else {
                  animationClass = 'sway-button-middle'
                  swayDistance = 20
                  stretchAmount = 30
                }

                return (
                  <div
                    key={`${project.slug}-${index}`}
                    className={`flex-shrink-0 relative ${currentVideoIndex === null && hasEverHovered ? animationClass : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      '--sway-distance': `${swayDistance}px`,
                      '--stretch-amount': `${stretchAmount}px`,
                      animationDelay: `${index * 0.15}s`
                    } as React.CSSProperties}
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      className="relative block transition-all duration-[900ms] ease-out"
                      style={{
                        width: `${getButtonWidth()}px`,
                        height: '36px'
                      }}
                    >
                      <div
                        className="w-full h-full flex items-center justify-center font-ui font-medium transition-all duration-[900ms] ease-out"
                        style={{
                          backgroundColor: someoneIsHovered && !isHovered ? '#D1D5DB' : '#000000',
                          color: someoneIsHovered && !isHovered ? '#000000' : '#FFFFFF',
                          opacity: someoneIsHovered && !isHovered ? 0.3 : 1,
                          borderRadius: '0px',
                          overflow: 'hidden'
                        }}
                      >
                        <span
                          className="px-4 text-base"
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: 'block',
                            width: '100%',
                            textAlign: 'center'
                          }}
                        >
                          {getDisplayTitle()}
                        </span>
                      </div>
                    </Link>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
