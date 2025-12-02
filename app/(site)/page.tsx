'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ProjectCard } from '@/components/composition/ProjectCard'
import { MobileProjectCard } from '@/components/composition/MobileProjectCard'
import { ProjectCardSkeleton } from '@/components/composition/ProjectCardSkeleton'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { getProjects } from '@/lib/content'
import { siteSettings } from '@/config/siteSettings'
import type { Project } from '@/types/content'
import { useHover } from '@/contexts/HoverContext'

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { hoverArea, setHoverArea } = useHover() // Use context for hoverArea
  const carouselRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0) // Track selected card on mobile
  const [touchStart, setTouchStart] = useState<{ y: number; time: number } | null>(null)
  const [touchVelocity, setTouchVelocity] = useState(0)
  const [scrollY, setScrollY] = useState(0) // Track scroll position for M logo shrinking
  const mobileContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Reset hover state to home state when component mounts
    setHoverArea(null)

    // Simulate loading time for the cool skeleton effect
    const loadProjects = async () => {
      const projectsData = getProjects()

      // Add a minimum loading time to show the skeleton animation
      await new Promise(resolve => setTimeout(resolve, 2000))

      setProjects(projectsData)
      setIsLoading(false)
    }

    loadProjects()
  }, [setHoverArea])

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // Standard mobile breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track scroll position on mobile to shrink M logo
  useEffect(() => {
    if (!isMobile || !mobileContainerRef.current) return

    const handleScroll = () => {
      if (mobileContainerRef.current) {
        setScrollY(mobileContainerRef.current.scrollTop)
      }
    }

    const container = mobileContainerRef.current
    container.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [isMobile])

  // Handle wheel events for horizontal scrolling - Desktop only
  useEffect(() => {
    if (isMobile) return // Skip on mobile

    const handleWheel = (e: WheelEvent) => {
      // Always prevent default to stop vertical scrolling on homepage
      e.preventDefault()
      e.stopPropagation()

      // Check if carousel ref exists
      if (!carouselRef.current) return

      // Convert vertical scroll to horizontal scroll
      const scrollAmount = e.deltaY * 2
      carouselRef.current.scrollLeft += scrollAmount
    }

    // Add wheel listener to both carousel and document for full page coverage
    const carouselElement = carouselRef.current

    if (carouselElement) {
      carouselElement.addEventListener('wheel', handleWheel, { passive: false })
    }

    // Always add document listener for page-wide scrolling
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('wheel', handleWheel)
      }
      document.removeEventListener('wheel', handleWheel)
    }
  }, [isLoading, projects, isMobile]) // Re-run when data is loaded

  // Handle touch events for mobile vertical carousel
  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        y: e.touches[0].clientY,
        time: Date.now()
      })
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return

      const touchEnd = e.changedTouches[0].clientY
      const touchTime = Date.now() - touchStart.time
      const distance = touchStart.y - touchEnd
      const velocity = Math.abs(distance / touchTime) // pixels per ms

      setTouchVelocity(velocity)

      // Calculate how many cards to skip based on velocity
      const skipCount = velocity > 1 ? Math.ceil(velocity / 0.5) : 1

      if (distance > 50) {
        // Swiped up - go to next
        setSelectedIndex(prev => Math.min(prev + skipCount, projects.length - 1))
      } else if (distance < -50) {
        // Swiped down - go to previous
        setSelectedIndex(prev => Math.max(prev - skipCount, 0))
      }

      setTouchStart(null)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isMobile, touchStart, projects.length])

  // Generate skeleton placeholders
  const skeletonCount = 6 // Show 6 skeleton cards while loading

  // Mobile header animation calculations (similar to project pages)
  const animationCompleteScroll = 300 // Complete shrinking animation after 300px scroll
  const scrollProgress = Math.min(1, scrollY / animationCompleteScroll)

  // Logo state heights (actual rendered heights from MorphingHeaderLogo component)
  const logoState1Height = 454 // State 1 tall height (~454px)
  const logoState3Height = 130 // State 3 short height (~130px)

  // Calculate current logo height based on scroll progress
  const currentLogoHeight = logoState1Height - ((logoState1Height - logoState3Height) * scrollProgress)

  // Header padding - starts larger, shrinks to compact
  const initialPaddingTop = 20
  const finalPaddingTop = 8 // Tighter padding when compact
  const currentPaddingTop = initialPaddingTop - ((initialPaddingTop - finalPaddingTop) * scrollProgress)

  const initialPaddingBottom = 20
  const finalPaddingBottom = 8 // Tighter padding when compact
  const currentPaddingBottom = initialPaddingBottom - ((initialPaddingBottom - finalPaddingBottom) * scrollProgress)

  // Buttons vertical position - starts to the right of M logo, moves up as M shrinks
  // Move up by 100px from one-third position to be beside the M logo initially
  // One-third down state 1 logo: ~151px, minus 100px = ~51px (beside M)
  // When fully scrolled, buttons should be centered vertically with the compact M logo
  const initialButtonsTop = (logoState1Height / 3) - 100 // To the right of tall M (~51px)
  const finalButtonsTop = (logoState3Height / 2) - 20 // Centered with compact M logo (half height minus half button height)
  const calculatedButtonsTop = (currentLogoHeight / 3) - 100 // Proportional to current M height
  const currentButtonsTop = scrollProgress >= 0.66 ? finalButtonsTop : calculatedButtonsTop // Lock to center when state 3

  // Calculate M logo state based on scroll progress - transition from 1 to 3
  const getMobileLogoState = (): 1 | 2 | 3 => {
    if (scrollProgress === 0) return 1 // State 1 at top
    if (scrollProgress < 0.33) return 1 // Stay in state 1
    if (scrollProgress < 0.66) return 2 // Transition through state 2
    return 3 // Lock to state 3 when scrolled
  }

  // Mobile carousel rendering
  if (isMobile) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Mobile Header - Shrinks as user scrolls, then sticks */}
        <div
          className="sticky top-0 w-full px-4 bg-[#D1D5DB]/90 backdrop-blur-sm z-10 transition-all duration-300"
          style={{
            paddingTop: `${currentPaddingTop}px`,
            paddingBottom: `${currentPaddingBottom}px`,
            maxHeight: scrollProgress >= 0.66 ? `${logoState3Height + finalPaddingTop + finalPaddingBottom}px` : 'none'
          }}
        >
          <div className="relative">
            {/* M Logo - shrinks from state 1 to state 3 as user scrolls */}
            <Link href="/" className="flex-shrink-0 block">
              <MorphingHeaderLogo
                state={getMobileLogoState()}
                style={{
                  width: '120px',
                  height: 'auto'
                }}
              />
            </Link>

            {/* About and Contact buttons - start lower, scroll up and stick */}
            <div
              className="absolute left-[140px] flex items-center gap-4 transition-all duration-300"
              style={{
                top: `${currentButtonsTop}px`
              }}
            >
              <Link
                href="/about"
                className="px-4 py-2 bg-black text-white font-ui font-bold text-sm rounded-full hover:bg-gray-800 transition-colors text-center whitespace-nowrap"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 bg-black text-white font-ui font-bold text-sm rounded-full hover:bg-gray-800 transition-colors text-center whitespace-nowrap"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Carousel - Scrollable */}
        <section ref={mobileContainerRef} className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          {isLoading ? (
            // Show skeleton loading animation
            <div className="flex flex-col px-4 gap-4">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <ProjectCardSkeleton key={`skeleton-${index}`} index={index} />
              ))}
            </div>
          ) : (
            // Show mobile project cards - all visible at once (pie chart style)
            <div className="flex flex-col px-4 pb-20">
              {projects.map((project, index) => (
                <MobileProjectCard
                  key={`${project.slug}-${index}`}
                  project={project}
                  index={index}
                  selectedIndex={selectedIndex}
                  totalCards={projects.length}
                  onSelect={(index) => setSelectedIndex(index)}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    )
  }

  // Desktop rendering
  return (
    <div className="h-full flex flex-col">
      {/* Projects Horizontal Row Section - Takes remaining space between header and footer */}
      <section
        className="flex-1 flex flex-col overflow-hidden min-h-0 px-20 xl:px-[100px] relative transition-all duration-500 ease-out"
        style={{
          marginTop: (hoverArea === 'card' || hoverArea === 'textbox') ? '40px' : '0px',
          marginBottom: '10px' // Small bottom margin matching top border
        }}
      >
        <div className="w-full max-w-[2000px] flex-1 flex flex-col justify-start min-h-0">
          {/* Single row with horizontal scroll - shows about 4 projects at once */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto flex-1 items-end min-h-0 scrollbar-hide"
            style={{
              gap: '0.6rem', // 4x wider: 0.15rem * 4 = 0.6rem
              paddingBottom: '10px' // Small bottom padding matching top border
            }}
          >
            {isLoading ? (
              // Show skeleton loading animation
              Array.from({ length: skeletonCount }).map((_, index) => (
                <ProjectCardSkeleton key={`skeleton-${index}`} index={index} />
              ))
            ) : (
              // Show actual project cards with fade-in animation, plus two placeholder projects
              [...projects, ...projects.slice(0, 2)].map((project, index) => {
                const totalCards = projects.length + 2
                const isHovered = hoveredIndex === index
                const someoneIsHovered = hoveredIndex !== null
                const distance = hoveredIndex !== null ? Math.abs(index - hoveredIndex) : 0

                const handleMouseEnter = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  setHoveredIndex(index)
                  setHoverArea('card') // Card state: hovering over photo card
                }

                const handleMouseLeave = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredIndex(null)
                    setHoverArea(null) // Return to home state
                  }, 50)
                }

                const handleTextboxAreaEnter = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  setHoveredIndex(index)
                  setHoverArea('textbox') // Textbox state: hovering over text box
                }

                const handleTextboxAreaLeave = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredIndex(null)
                    setHoverArea(null) // Return to home state
                  }, 50)
                }

                return (
                  <ProjectCard
                    key={`${project.slug}-${index}`}
                    project={project}
                    index={index}
                    isHovered={isHovered}
                    someoneIsHovered={someoneIsHovered}
                    distanceFromHovered={distance}
                    totalCards={totalCards}
                    hoverArea={hoverArea}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTextboxAreaEnter={handleTextboxAreaEnter}
                    onTextboxAreaLeave={handleTextboxAreaLeave}
                  />
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
