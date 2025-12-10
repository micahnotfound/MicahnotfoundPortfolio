'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { getProjects } from '@/lib/content'
import type { Project } from '@/types/content'
import { useHover } from '@/contexts/HoverContext'

export default function TestPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(null) // Current visible video
  const [previousVideoIndex, setPreviousVideoIndex] = useState<number | null>(null) // Previous video for animation
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null) // Track swipe direction
  const { hoverArea, setHoverArea } = useHover()
  const carouselRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // M logo animation states
  const [logoState, setLogoState] = useState<0 | 1 | 2 | 3>(0)
  const [logoTopPosition, setLogoTopPosition] = useState(80) // Starts at 80px, moves to 20px
  const [isMouseNearLogo, setIsMouseNearLogo] = useState(false) // Track if mouse is within 200px of M logo

  useEffect(() => {
    setHoverArea(null)
    const loadProjects = async () => {
      const projectsData = getProjects()
      await new Promise(resolve => setTimeout(resolve, 2000))
      setProjects(projectsData)
      setIsLoading(false)
    }
    loadProjects()
  }, [setHoverArea])

  // Handle wheel events for horizontal scrolling
  useEffect(() => {
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

  // Track mouse position to detect if near M logo
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Check if mouse is within extended area around M logo and buttons
      const distanceFromTop = e.clientY
      const distanceFromLeft = e.clientX

      // M logo is at paddingLeft: 100px, width ~295px, top position 80px (when expanded)
      // About/Contact buttons are stacked vertically next to M, total height ~100px
      // Extended area:
      // - Top: 300px from top (to include M logo at 80px + buttons below + margin)
      // - Left: 600px from left (M logo + buttons + 200px extension to the right)
      const isNear = distanceFromTop < 300 && distanceFromLeft < 600

      // Debug logging
      if (isNear !== isMouseNearLogo) {
        console.log('Mouse near logo:', isNear, 'Position:', distanceFromLeft, distanceFromTop)
      }

      setIsMouseNearLogo(isNear)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isMouseNearLogo])

  // M logo animation based on video state and mouse position
  useEffect(() => {
    console.log('Logo state update - videoIndex:', currentVideoIndex, 'mouseNear:', isMouseNearLogo)

    if (currentVideoIndex === null) {
      // No video playing - M logo expanded at bottom
      console.log('Setting logo: state 0, position 80')
      setLogoState(0)
      setLogoTopPosition(80)
    } else {
      // Video is playing
      if (isMouseNearLogo) {
        // Mouse near logo - expand it
        console.log('Video playing + mouse near: state 0, position 80')
        setLogoState(0)
        setLogoTopPosition(80)
      } else {
        // Mouse not near - shrink to corner
        console.log('Video playing + mouse away: state 3, position 20')
        setLogoState(3)
        setLogoTopPosition(20)
      }
    }
  }, [currentVideoIndex, isMouseNearLogo])

  const skeletonCount = 6

  // Update video index and direction when hovering
  useEffect(() => {
    if (hoveredIndex !== null) {
      // Determine swipe direction
      if (currentVideoIndex !== null) {
        if (hoveredIndex > currentVideoIndex) {
          setSlideDirection('left') // Moving right in carousel = video slides left
        } else if (hoveredIndex < currentVideoIndex) {
          setSlideDirection('right') // Moving left in carousel = video slides right
        }
        setPreviousVideoIndex(currentVideoIndex)
      }

      setCurrentVideoIndex(hoveredIndex)
    }
  }, [hoveredIndex, currentVideoIndex])

  return (
    <div className="h-screen w-full bg-[#D1D5DB] relative overflow-hidden">
      {/* Background video container - full screen - horizontal carousel */}
      {/* Only show videos if something has been hovered, otherwise stay gray */}
      {currentVideoIndex !== null && (
        <div className="absolute inset-0 w-full h-full z-10 overflow-hidden">
          {/* Video carousel - all videos in a horizontal line */}
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

              // Only render videos that are current or adjacent (for performance)
              const shouldRender = Math.abs(index - currentVideoIndex) <= 1

              return (
                <div
                  key={`video-${index}`}
                  className="w-screen h-full flex-shrink-0"
                  style={{ width: '100vw' }}
                >
                  {shouldRender && (
                    <CarouselMedia
                      media={displayMedia}
                      fallbackImage={hasReel ? fallbackImage : undefined}
                      isVisible={index === currentVideoIndex}
                      isAdjacent={Math.abs(index - currentVideoIndex) === 1}
                      className="object-cover"
                      alt={project.title}
                      priority={index === 0}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Header with M Logo and Buttons */}
      <div
        className="absolute left-0 w-full z-50 transition-all duration-[900ms] ease-out"
        style={{
          top: `${logoTopPosition}px`,
          paddingLeft: '100px', // Align with text bubbles (80px padding + 20px offset)
          paddingRight: '30px'
        }}
      >
        <div className="flex items-center justify-start gap-8">
          {/* M Logo - WHITE - 58% larger (1.44 * 1.1 = 1.584 total), clickable to home */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
            <MorphingHeaderLogo
              state={logoState}
              className="transition-all duration-[900ms] ease-out"
              style={{
                width: '325px', // 205px * 1.584 = 324.72px (10% larger than 295px)
                height: 'auto',
                filter: 'invert(1) brightness(2)'
              }}
            />
          </div>

          {/* About/Contact buttons - disappear in state 3 */}
          <div
            className="flex flex-col gap-4 transition-opacity duration-[900ms] ease-out"
            style={{
              opacity: logoState === 3 ? 0 : 1,
              pointerEvents: logoState === 3 ? 'none' : 'auto'
            }}
          >
            <Link
              href="/about"
              className="text-center font-ui bg-core-dark text-white text-base whitespace-nowrap px-4 h-9 rounded-full flex items-center justify-center"
            >
              about
            </Link>

            <Link
              href="/contact"
              className="text-center font-ui bg-core-dark text-white text-base whitespace-nowrap px-4 h-9 rounded-full flex items-center justify-center"
            >
              contact
            </Link>
          </div>
        </div>
      </div>

      {/* Text bubbles - horizontal arrangement two-thirds down the page */}
      <div
        className="fixed left-0 z-40 flex flex-row"
        style={{
          top: '66.67%',
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
                  style={{ width: '200px', height: '60px' }}
                >
                  <div className="bg-gray-300 rounded-full h-full w-full" />
                </div>
              ))
            ) : (
              projects.map((project, index) => {
                const isHovered = hoveredIndex === index
                const someoneIsHovered = hoveredIndex !== null

                // Use acronyms for specific projects when not hovered
                const getDisplayTitle = () => {
                  if (isHovered) return project.title

                  // Map full titles to acronyms
                  const acronymMap: { [key: string]: string } = {
                    'Dreaming With The Archives': 'DWTA',
                    'NYC AIDS Memorial': 'NYCAM'
                  }

                  return acronymMap[project.title] || project.title
                }

                // Calculate max width for expanded bubble based on available space
                const getExpandedWidth = () => {
                  if (typeof window === 'undefined') return 800
                  const viewportWidth = window.innerWidth
                  // Account for left margin (80px) and right margin (80px) and some buffer
                  const availableWidth = viewportWidth - 160 - 40 // 160px for margins, 40px buffer
                  // Calculate space used by other bubbles (200px each + 0.6rem gap)
                  const otherBubblesWidth = (projects.length - 1) * 200 + (projects.length - 1) * 10 // ~0.6rem = 10px
                  // Available width for expanded bubble
                  const maxExpandedWidth = availableWidth - otherBubblesWidth
                  // Cap at reasonable maximum
                  return Math.max(200, Math.min(800, maxExpandedWidth))
                }

                const handleMouseEnter = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
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

                return (
                  <div
                    key={`${project.slug}-${index}`}
                    className="flex-shrink-0 relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Title bubble - only changes width, not height - STAYS AT FIXED POSITION */}
                    <Link
                      href={`/work/${project.slug}`}
                      className="relative block transition-all duration-[900ms] ease-out"
                      style={{
                        width: isHovered ? getExpandedWidth() : '200px',
                        height: '60px'
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center font-ui font-medium transition-all duration-[900ms] ease-out"
                        style={{
                          backgroundColor: someoneIsHovered && !isHovered ? '#D1D5DB' : '#000000',
                          color: someoneIsHovered && !isHovered ? '#000000' : '#FFFFFF',
                          opacity: someoneIsHovered && !isHovered ? 0.3 : 1
                        }}
                      >
                        <span className="px-4 text-base">{getDisplayTitle()}</span>
                      </div>
                    </Link>
                  </div>
                )
              })
            )}
          </div>
        </div>
    </div>
  )
}
