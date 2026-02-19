'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import type { MediaItem } from '@/types/content'

interface KinfolkLayoutProps {
  projectTitle: string
  projectDescription: string
  heroImage: MediaItem
  videoPublicId: string
}

export function KinfolkLayout({
  projectTitle,
  projectDescription,
  heroImage,
  videoPublicId
}: KinfolkLayoutProps) {
  // Mobile states - matching homepage positioning
  const [headerTopPosition, setHeaderTopPosition] = useState(106)
  const [logoState, setLogoState] = useState<0 | 1 | 2 | 3>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [contentPosition, setContentPosition] = useState(0) // 0 = bottom, 1 = revealed
  const mobileTouchStart = useRef<{ y: number; time: number } | null>(null)
  const isDragging = useRef(false)

  // Track viewport height for mobile
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  // Mobile: Touch handling - only allow scrolling up (matching homepage behavior)
  useEffect(() => {
    if (window.innerWidth >= 768) return

    const handleTouchStart = (e: TouchEvent) => {
      setIsAnimating(false)
      mobileTouchStart.current = {
        y: e.touches[0].clientY,
        time: Date.now()
      }
      isDragging.current = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!mobileTouchStart.current || !isDragging.current) return

      const currentY = e.touches[0].clientY
      const dragDistance = mobileTouchStart.current.y - currentY // Positive = scrolling up

      // Only allow scrolling up (dragDistance > 0)
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
        const newTop = Math.max(50, 106 - (dragDistance / 150) * 56)
        setHeaderTopPosition(newTop)
        
        // Move content up as M moves up
        const contentProgress = Math.min(1, dragDistance / 150)
        setContentPosition(contentProgress)
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!mobileTouchStart.current) return

      isDragging.current = false
      const touchEnd = e.changedTouches[0].clientY
      const distance = mobileTouchStart.current.y - touchEnd
      const timeDiff = Date.now() - mobileTouchStart.current.time
      const velocity = distance / timeDiff
      const swipeThreshold = 50
      const velocityThreshold = 0.3
      const isSwipe = Math.abs(distance) > swipeThreshold || Math.abs(velocity) > velocityThreshold

      setIsAnimating(true)

      if (isSwipe && distance > 0) {
        // Scrolled up - lock into revealed state
        requestAnimationFrame(() => {
          setLogoState(3)
          setHeaderTopPosition(50)
          setContentPosition(1)
          setTimeout(() => setIsAnimating(false), 500)
        })
      } else {
        // Snap back or stay
        if (distance > 25) {
          // More than halfway, go to revealed
          setLogoState(3)
          setHeaderTopPosition(50)
          setContentPosition(1)
        } else {
          // Less than halfway, snap back
          setLogoState(0)
          setHeaderTopPosition(106)
          setContentPosition(0)
        }
        setTimeout(() => setIsAnimating(false), 500)
      }

      mobileTouchStart.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

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

  // Calculate content translateY - starts at bottom, moves up as contentPosition goes from 0 to 1
  const getContentTranslateY = () => {
    if (viewportHeight === 0) return `${viewportHeight}px`
    const headerBottom = 160 // Position where content should start when revealed
    const startOffset = viewportHeight // Start completely below
    const endOffset = headerBottom // End position (below header)
    const currentOffset = startOffset - ((startOffset - endOffset) * contentPosition)
    return `${currentOffset}px`
  }

  return (
    <>
      {/* Mobile View - visible on mobile only */}
      <div className="block md:hidden h-screen w-full relative overflow-hidden bg-[#D1D5DB]">
        {/* Mobile Header with M Logo - matching homepage positioning */}
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
          <div className="flex items-center justify-start gap-8 pointer-events-auto">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <MorphingHeaderLogo
                state={logoState}
                className="transition-all duration-500 ease-out"
                style={{
                  width: '205px',
                  height: 'auto'
                }}
              />
            </Link>
          </div>
        </div>

        {/* Text Bubble - matching homepage style */}
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
          <Link
            href="/work/kinfolk"
            className="relative block transition-all duration-[900ms] ease-out"
            style={{
              width: '200px',
              height: '36px'
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center font-ui font-medium transition-all duration-[900ms] ease-out"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '0px'
              }}
            >
              <span className="px-4 text-base">{projectTitle}</span>
            </div>
          </Link>
        </div>

        {/* Content: Video - starts at bottom, moves up */}
        <div
          className="absolute left-0 w-full z-10"
          style={{
            transform: `translateY(${getContentTranslateY()})`,
            transition: isDragging.current ? 'none' : 'transform 500ms ease-out',
            paddingLeft: '30px',
            paddingRight: '30px',
            paddingTop: '20px',
            paddingBottom: '20px'
          }}
        >
          {/* Video Player */}
          <div className="w-full">
            <VideoPlayer
              publicId={videoPublicId}
              width={16}
              height={9}
              className="w-full shadow-lg"
              controls={true}
              autoPlay={false}
              muted={true}
              loop={false}
            />
          </div>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block min-h-screen bg-[#D1D5DB]">
        {/* Desktop Header with M Logo */}
        <div className="absolute left-0" style={{ top: '145px', paddingLeft: '100px', zIndex: 10 }}>
          <Link href="/">
            <MorphingHeaderLogo
              state={0}
              style={{
                width: '325px',
                height: 'auto'
              }}
            />
          </Link>
        </div>

        {/* Desktop Text Bubble - matching homepage style */}
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
          <Link
            href="/work/kinfolk"
            className="relative block transition-all duration-[900ms] ease-out"
            style={{
              width: '200px',
              height: '36px'
            }}
          >
            <div
              className="w-full h-full flex items-center justify-center font-ui font-medium transition-all duration-[900ms] ease-out"
              style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                borderRadius: '0px'
              }}
            >
              <span className="px-4 text-base">{projectTitle}</span>
            </div>
          </Link>
        </div>

        {/* Desktop Content */}
        <div className="pt-32 pb-20 px-20 xl:px-[100px]">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Project Title and Description */}
            <div className="space-y-6">
              <h1 className="text-5xl font-body font-bold text-core-dark leading-tight">
                {projectTitle}
              </h1>
              <p className="text-base font-ui text-gray-700 leading-relaxed max-w-3xl">
                {projectDescription}
              </p>
            </div>

            {/* Video Player */}
            <div className="w-full">
              <VideoPlayer
                publicId={videoPublicId}
                width={16}
                height={9}
                className="w-full shadow-lg"
                controls={true}
                autoPlay={false}
                muted={true}
                loop={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}



