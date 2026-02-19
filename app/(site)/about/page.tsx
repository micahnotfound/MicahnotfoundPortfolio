'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'

export default function AboutPage() {
  // Desktop state
  const [logoScale, setLogoScale] = useState(1) // Start at normal homepage scale

  // Mobile states
  const [headerTopPosition, setHeaderTopPosition] = useState(106)
  const [logoState, setLogoState] = useState<0 | 1 | 2 | 3>(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [contentPosition, setContentPosition] = useState(0) // 0 = bottom, 1 = revealed
  const mobileTouchStart = useRef<{ y: number; time: number } | null>(null)
  const isDragging = useRef(false)
  const dragDirection = useRef<'up' | 'down' | null>(null)

  const aboutText = "Kinfolk Tech leverages over six years of leadership in AR and XR innovation to design award-winning educational and cultural experiences. As Chief Strategy Officer, the focus centers on directing creative vision and strategy for public exhibitions and immersive educational tools. Collaborating with schools, cultural institutions, and global brands, the team curates dynamic digital narratives, extending the reach of underrepresented stories in impactful ways.\n\nBy managing multidisciplinary teams and fostering cross-sector partnerships, Kinfolk Tech creates engaging digital monuments and exhibitions featured in prestigious spaces like MoMA and Tribeca Festival. The mission is to integrate art, equity, and technology into transformative experiences, reimagining how audiences connect with history and culture. Values of inclusion and collaboration drive efforts to amplify diverse narratives in public and educational contexts."

  // Desktop: Trigger grow animation on mount
  useEffect(() => {
    if (window.innerWidth >= 768) {
      const timer = setTimeout(() => {
        setLogoScale(1.136)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [])

  // Track viewport height for mobile
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  // Mobile: Scroll handling - M shrinks as you scroll
  useEffect(() => {
    if (window.innerWidth >= 768) return

    let scrollY = 0
    const maxScroll = 400 // Distance to fully shrink M and move content

    const handleScroll = (e: WheelEvent | TouchEvent) => {
      e.preventDefault()

      if (e.type === 'wheel') {
        const wheelEvent = e as WheelEvent
        scrollY = Math.max(0, Math.min(maxScroll, scrollY + wheelEvent.deltaY))
      } else if (e.type === 'touchmove') {
        if (!mobileTouchStart.current || !isDragging.current) return
        const touchEvent = e as TouchEvent
        const currentY = touchEvent.touches[0].clientY
        const dragDistance = mobileTouchStart.current.y - currentY
        scrollY = Math.max(0, Math.min(maxScroll, dragDistance))
      }

      const progress = scrollY / maxScroll

      // Update logo state based on scroll progress
      if (progress < 0.33) {
        setLogoState(0)
      } else if (progress < 0.66) {
        setLogoState(1)
      } else {
        setLogoState(3)
      }

      // Update header position
      const newTop = 106 - (progress * 56) // 106 to 50
      setHeaderTopPosition(newTop)

      // Update content position
      setContentPosition(progress)
    }

    const handleTouchStart = (e: TouchEvent) => {
      mobileTouchStart.current = {
        y: e.touches[0].clientY,
        time: Date.now()
      }
      isDragging.current = true
      scrollY = contentPosition * maxScroll // Start from current position
    }

    const handleTouchEnd = () => {
      isDragging.current = false
      mobileTouchStart.current = null
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      handleScroll(e)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handleScroll(e)
    }

    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('touchstart', handleTouchStart, { passive: false })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [contentPosition])

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

  // Calculate content translateY - starts right under extended M, moves up as M shrinks
  const getContentTranslateY = () => {
    if (viewportHeight === 0) return '0px'
    // M logo starts at headerTopPosition (106px) with height based on logoState
    // When logoState = 0: header is at 106px top + ~434px height = ~540px from top
    // When logoState = 3: header is at 50px top + ~110px height = ~160px from top
    const initialHeaderBottom = 106 + 434 // Position under extended M
    const finalHeaderBottom = 50 + 110   // Position under shrunk M

    // Content should start at initialHeaderBottom and move up to finalHeaderBottom
    const currentOffset = initialHeaderBottom - ((initialHeaderBottom - finalHeaderBottom) * contentPosition)
    return `${currentOffset}px`
  }

  // Calculate photo height to fit all content without scrolling
  // When M is at top (state 3), header is ~110px, so content area is viewportHeight - 110px
  // We need: photo + title + text to fit in that space
  const getPhotoHeight = () => {
    if (viewportHeight === 0) return '300px'
    const headerHeight = 110 // Height when M is at top (state 3)
    const padding = 40 // Top and bottom padding (20px each)
    const titleHeight = 60 // Approximate title height with margin
    const textHeight = 650 // Approximate text height (measured roughly)
    const gap = 24 // Gap between photo and text (mb-6 = 24px)
    
    const availableHeight = viewportHeight - headerHeight
    const contentArea = availableHeight - padding
    const availableForPhoto = contentArea - titleHeight - textHeight - gap
    
    // Ensure photo is at least 200px but not more than 50% of viewport
    const photoHeight = Math.max(200, Math.min(availableForPhoto, viewportHeight * 0.5))
    return `${photoHeight}px`
  }

  return (
    <>
      {/* Mobile View - visible on mobile only */}
      <div className="block md:hidden h-screen w-full relative overflow-hidden bg-[#D1D5DB]">
        {/* Mobile Header with M Logo */}
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

        {/* Content: Photo and Text - starts at bottom, moves up */}
        <div
          className="absolute left-0 w-full z-10"
          style={{
            transform: `translateY(${getContentTranslateY()})`,
            transition: isDragging.current ? 'none' : 'transform 500ms ease-out',
            paddingLeft: '30px',
            paddingRight: '30px',
            paddingTop: '20px',
            paddingBottom: '20px',
            minHeight: '100vh'
          }}
        >
          {/* Photo */}
          <div className="w-full mb-6" style={{ height: getPhotoHeight() }}>
            <img
              src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680394/micah_j75jbv.png"
              alt="Micah Milner"
              className="w-full h-full object-cover"
              style={{ borderRadius: '24px' }}
            />
          </div>

          {/* Text */}
          <div className="w-full">
            <h1 className="text-4xl font-body font-bold text-core-dark leading-none mb-6">
              About
            </h1>
            <p className="font-ui text-gray-700 leading-relaxed text-base whitespace-pre-line">
              {aboutText}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop View - unchanged */}
      <div className="hidden md:block min-h-screen bg-[#D1D5DB]">
        {/* M Logo - positioned absolutely like homepage */}
        <div className="absolute left-0" style={{ top: '145px', paddingLeft: '100px', zIndex: 10 }}>
          <Link href="/">
            <div
              style={{
                transformOrigin: 'top center',
                transform: `scaleY(${logoScale})`,
                transition: 'transform 800ms ease-out'
              }}
            >
              <MorphingHeaderLogo
                state={0}
                style={{
                  width: '325px',
                  height: 'auto'
                }}
              />
            </div>
          </Link>
        </div>

        <div style={{ paddingTop: '52px', paddingLeft: '100px', paddingRight: '80px' }}>
          <div className="flex" style={{ gap: '40px' }}>
            {/* Left side: M logo space */}
            <div className="flex-shrink-0" style={{ width: '325px' }}>
              {/* Empty space for M logo */}
            </div>

            {/* Right side: Title, Text, and Photo */}
            <div className="flex" style={{ gap: '40px', paddingTop: '101px', paddingLeft: '20px' }}>
              {/* Text column */}
              <div className="flex flex-col" style={{ width: '615px' }}>
                {/* About Title */}
                <h1 className="text-5xl font-body font-bold text-core-dark leading-none" style={{ fontSize: '3.45rem', marginBottom: '37px' }}>
                  About
                </h1>

                {/* About Text */}
                <p className="font-ui text-gray-700 leading-relaxed" style={{ fontSize: '18.4px' }}>
                  {aboutText}
                </p>
              </div>

              {/* Photo - aligned to bottom of M (grown by 80px: 637 + 80 = 717px) */}
              <div className="flex items-end" style={{ height: '717px' }}>
                <img
                  src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680394/micah_j75jbv.png"
                  alt="Micah Milner"
                  style={{ maxWidth: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
