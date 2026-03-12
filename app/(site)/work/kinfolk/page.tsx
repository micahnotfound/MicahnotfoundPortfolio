'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import { useMobile } from '@/contexts/MobileContext'

export default function KinfolkPage() {
  const router = useRouter()
  const { isMobile, isLoading } = useMobile()
  const [isReady, setIsReady] = useState(false)

  // Mobile-specific states
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartRef = useRef<{ y: number; time: number } | null>(null)
  const lastTouchY = useRef<number>(0)

  // Desktop-specific states
  const [scrollY, setScrollY] = useState(0)
  const [hoveredCarousel, setHoveredCarousel] = useState<number | null>(null)
  const [hoveredHeader, setHoveredHeader] = useState<number | null>(null)
  const [laggedScrollY, setLaggedScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(1000)
  const [textHeight, setTextHeight] = useState(200)
  const [isMounted, setIsMounted] = useState(false)
  const textRef = useRef<HTMLDivElement>(null)

  // Set ready state after mount
  useEffect(() => {
    setIsReady(true)
  }, [])

  // Desktop: Track viewport height
  useEffect(() => {
    if (isMobile) return
    const updateHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [isMobile])

  // Desktop: Measure text height
  useEffect(() => {
    if (isMobile) return
    const measureText = () => {
      if (textRef.current) {
        setTextHeight(textRef.current.offsetHeight)
        setIsMounted(true)
      }
    }

    measureText()
    window.addEventListener('resize', measureText)
    return () => window.removeEventListener('resize', measureText)
  }, [isMobile])

  // Desktop: Smooth scroll tracking
  useEffect(() => {
    if (isMobile) return
    let ticking = false
    let currentScroll = 0

    const handleScroll = () => {
      currentScroll = window.scrollY

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(currentScroll)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Desktop: Apply lag to scroll
  useEffect(() => {
    if (isMobile) return
    const lagAmount = 0.15
    let animationFrame: number

    const updateLaggedScroll = () => {
      setLaggedScrollY(prev => {
        const diff = scrollY - prev
        return prev + diff * lagAmount
      })
      animationFrame = requestAnimationFrame(updateLaggedScroll)
    }

    animationFrame = requestAnimationFrame(updateLaggedScroll)
    return () => cancelAnimationFrame(animationFrame)
  }, [scrollY, isMobile])

  // Mobile: Swipe handling
  useEffect(() => {
    if (!isMobile) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = { y: touch.clientY, time: Date.now() }
      lastTouchY.current = touch.clientY
      setIsDragging(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return
      const touch = e.touches[0]
      const deltaY = touchStartRef.current.y - touch.clientY
      const progress = Math.max(0, Math.min(1, deltaY / (window.innerHeight * 0.8)))
      setSwipeProgress(progress)
      lastTouchY.current = touch.clientY
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
      if (swipeProgress > 0.3) {
        setSwipeProgress(1)
      } else {
        setSwipeProgress(0)
      }
      touchStartRef.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [swipeProgress, isMobile])

  // Header photos - three photos from Cloudinary
  const heroImage1 = {
    public_id: "v1772841772/image_6_va00dr",
    kind: "image" as const,
    alt: "Kinfolk header image 1"
  }

  const heroImage2 = {
    public_id: "v1773112323/image_21_ihz34v",
    kind: "image" as const,
    alt: "Kinfolk header image 2"
  }

  const heroImage3 = {
    public_id: "v1772841770/image_7_wwsttn",
    kind: "image" as const,
    alt: "Kinfolk header image 3"
  }

  // Gallery photos
  const exhibitionPhoto1 = { public_id: "v1772852218/DSC00327-Recovered_paufag", kind: "image" as const, alt: "Kinfolk exhibition view 1" }
  // Row 2 - New 5 images
  const exhibitionPhoto2 = { public_id: "v1773098237/1_0009_Layer-Comp-11_wzfrq4", kind: "image" as const, alt: "Kinfolk exhibition view 2" }
  const exhibitionPhoto3 = { public_id: "v1773098236/1_0005_Layer-Comp-7_vi5dsu", kind: "image" as const, alt: "Kinfolk exhibition view 3" }
  const exhibitionPhoto4 = { public_id: "v1773098234/1_0008_Layer-Comp-10_h0pbqc", kind: "image" as const, alt: "Kinfolk exhibition view 4" }
  const exhibitionPhoto5 = { public_id: "v1773098234/1_0012_Layer-Comp-14_fykw9f", kind: "image" as const, alt: "Kinfolk exhibition view 5" }
  const exhibitionPhoto6 = { public_id: "v1773098237/1_0011_Layer-Comp-13_glr2jy", kind: "image" as const, alt: "Kinfolk exhibition view 6" }
  // Row 3 - Two photos
  const exhibitionPhoto7 = { public_id: "v1772841111/Mellon_MoversShakers-1246_2_1_rvg1x9", kind: "image" as const, alt: "Kinfolk exhibition view 7" }
  const exhibitionPhoto8 = { public_id: "v1772841102/DSC_0072_1_dh3d5g", kind: "image" as const, alt: "Kinfolk exhibition view 8" }
  // Row 4 - Old row 2 images (5 photos)
  const exhibitionPhoto9 = { public_id: "v1772840957/1_0000_Layer-Comp-1_xmiex0", kind: "image" as const, alt: "Kinfolk exhibition view 9" }
  const exhibitionPhoto10 = { public_id: "v1772840960/1_0003_Layer-Comp-6_z5ldi0", kind: "image" as const, alt: "Kinfolk exhibition view 10" }
  const exhibitionPhoto11 = { public_id: "v1773098234/1_0006_Layer-Comp-8_kfhp3n", kind: "image" as const, alt: "Kinfolk exhibition view 11" }
  const exhibitionPhoto12 = { public_id: "v1772840958/1_0001_Layer-Comp-3_xdil9h", kind: "image" as const, alt: "Kinfolk exhibition view 12" }
  const exhibitionPhoto13 = { public_id: "v1772840959/1_0003_Layer-Comp-8_cxmjky", kind: "image" as const, alt: "Kinfolk exhibition view 13" }
  // Row 5 - Three photos
  const exhibitionPhoto14 = { public_id: "v1772683276/DSC00388-Recovered_josqyd", kind: "image" as const, alt: "Kinfolk exhibition view 14" }
  const exhibitionPhoto15 = { public_id: "v1772683274/Kinfolk_0000s_0012_Layer-29_iavbcg", kind: "image" as const, alt: "Kinfolk exhibition view 15" }
  const exhibitionPhoto16 = { public_id: "v1772841101/Kinfolk_Dreaming_With_The_Archives_Outside_-19_1_kstxbx", kind: "image" as const, alt: "Kinfolk exhibition view 16" }
  // Row 6 - Two photos
  const exhibitionPhoto17 = { public_id: "v1773100429/Kinfolk_Dreaming_With_The_Archives_Outside_-12_1_wikdzk", kind: "image" as const, alt: "Kinfolk exhibition view 17" }
  const exhibitionPhoto18 = { public_id: "v1773100428/Kinfolk_Dreaming_With_The_Archives_Outside_-51_11_aaihdi", kind: "image" as const, alt: "Kinfolk exhibition view 18" }
  // Row 7 - Single photo
  const exhibitionPhoto19 = { public_id: "v1773100428/kin_0001s_0001_Layer-71_kfmjiu", kind: "image" as const, alt: "Kinfolk exhibition view 19" }

  const videoPublicId = "v1766161331/Kinfolk_Reel_famm9n"
  const projectTitle = "Kinfolk"
  const projectDescription = "Kinfolk Tech is a nonprofit using immersive technology, public art, and community-led design to help displaced and excluded communities tell their own stories—and shape their own legacies.\nKinfolk is our flagship product, available for free in the app store. It features a growing library of more than 100 digital monuments. Through AR, users discover place-based stories and educational content co-created with grassroots organizations, while workshops, panels, and public events drive visibility and real-world change."
  const projectRole = "Co-Founder"
  const projectCollaborators = "Glenn Cantave, Idris Brewster"
  const projectDate = "2019"

  const kinfolkReel = { public_id: videoPublicId, kind: "video" as const, alt: "Kinfolk reel" }
  const displayMedia = kinfolkReel

  // Show loading screen while detecting mobile
  if (isLoading) {
    return <div className="fixed inset-0 bg-black z-[9999]" />
  }

  // DESKTOP RENDER
  if (!isMobile) {
    const topMargin = 52
    const bottomMargin = 52
    const paddingBelowLine = 50
    const paddingAboveLine = 20
    const dividerHeight = 3

    const spaceForText = textHeight
    const spaceForPadding = paddingBelowLine + dividerHeight + paddingAboveLine
    const availableSpaceForM = viewportHeight - topMargin - bottomMargin - spaceForText - spaceForPadding + 100
    const minMHeight = 130
    const mHeight = Math.max(minMHeight, availableSpaceForM)
    const mWidth = 250

    // Calculate shrink distance first
    const shrinkDistance = mHeight - minMHeight

    const phase1End = 200
    const phase2Start = phase1End
    const phase2Duration = shrinkDistance
    const phase2End = phase2Start + phase2Duration
    const phase3Start = phase2End

    // Phase 1: M moves from 52px to 12px
    const phase1Progress = Math.min(1, scrollY / phase1End)
    const phase1Top = 52 - (40 * phase1Progress)

    // Phase 2: M shrinks (nothing else moves)
    const phase2Scroll = Math.max(0, Math.min(phase2Duration, scrollY - phase2Start))
    const mShrinkProgress = phase2Scroll / phase2Duration
    const currentMHeight = mHeight - (shrinkDistance * mShrinkProgress)
    const currentMWidth = mWidth

    // Phase 3: Content scrolls (only after M is fully shrunk)
    const phase3Scroll = Math.max(0, scrollY - phase3Start)

    // Phase 3: Content scrolls
    const mLogoTop = phase1Top
    const photoScrollOffset = phase3Scroll
    const textScrollOffset = phase3Scroll

    const getLogoState = (): 0 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 => {
      const state0Height = 525
      const state1Height = 455
      const state1_5Height = 373
      const state2Height = 292
      const state2_5Height = 211
      const state3_5Height = 170
      const state3Height = 130

      if (currentMHeight >= state0Height) return 0
      if (currentMHeight >= (state0Height + state1Height) / 2) return 0
      if (currentMHeight >= (state1Height + state1_5Height) / 2) return 1
      if (currentMHeight >= (state1_5Height + state2Height) / 2) return 1.5
      if (currentMHeight >= (state2Height + state2_5Height) / 2) return 2
      if (currentMHeight >= (state2_5Height + state3_5Height) / 2) return 2.5
      if (currentMHeight >= (state3_5Height + state3Height) / 2) return 3.5
      return 3
    }

    const textBottomY = viewportHeight - bottomMargin
    const dividerY = textBottomY - textHeight - paddingBelowLine

    return (
      <div className="min-h-screen bg-[#D1D5DB]">
      {/* M Logo - z-index 4, width 250px constant */}
      <div
        className="fixed left-0"
        style={{
          top: `${mLogoTop}px`,
          paddingLeft: '80px',
          zIndex: 4
        }}
      >
        <Link href="/" style={{ width: '250px', display: 'block' }}>
          <MorphingHeaderLogo
            state={getLogoState()}
            className={isMounted ? "transition-all duration-500 ease-out" : ""}
            style={{
              width: '250px',
              height: 'auto'
            }}
            disableTransition={!isMounted}
          />
        </Link>
      </div>

      {/* Content Container - scrolls under header */}
      <div className="h-screen relative">
        {/* Left column: M width (250px constant) for dividing line and text */}
        <div
          className="fixed left-0"
          style={{
            paddingLeft: '80px',
            width: '330px',
            height: '100vh',
            transform: `translateY(-${textScrollOffset}px)`,
            transition: 'transform 0ms linear'
          }}
        >
          {/* Dividing line - z-index 1, aligned to right of M, same width as M */}
          <div
            style={{
              position: 'absolute',
              top: `${dividerY}px`,
              left: '80px',
              width: '250px',
              height: '3px',
              backgroundColor: '#000000',
              zIndex: 1
            }}
          />

          {/* Text - z-index 0, bottom-anchored */}
          <div
            ref={textRef}
            style={{
              position: 'absolute',
              bottom: `${bottomMargin}px`,
              left: '80px',
              width: '250px',
              zIndex: 0
            }}
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-body font-bold text-core-dark leading-none">
                {projectTitle}
              </h1>

              <div className="text-sm font-ui text-gray-700 space-y-1">
                <p><strong>Role:</strong> {projectRole}</p>
                <p><strong>Co-Founders:</strong> {projectCollaborators}</p>
                <p><strong>Date:</strong> {projectDate}</p>
              </div>

              <p className="text-base font-ui text-gray-700 leading-relaxed">
                {projectDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Photo and Video container - flex row layout */}
        <div
          className="fixed flex"
          style={{
            left: '370px',
            top: `${topMargin}px`,
            right: '80px',
            height: `calc(100vh - ${topMargin + bottomMargin}px)`,
            zIndex: 3,
            transform: `translateY(-${photoScrollOffset}px)`,
            transition: 'transform 0ms linear',
            gap: '25px'
          }}
        >
          {/* Three stacked photos */}
          <div className="flex-1 flex flex-col" style={{ gap: '25px' }}>
            <div
              className="overflow-hidden transition-all duration-500"
              style={{
                borderRadius: '24px',
                flex: hoveredHeader === 0 ? '6' : hoveredHeader !== null ? '0.5' : '1'
              }}
              onMouseEnter={() => setHoveredHeader(0)}
              onMouseLeave={() => setHoveredHeader(null)}
            >
              <Media media={heroImage1} className="w-full h-full object-cover" alt={heroImage1.alt} />
            </div>
            <div
              className="overflow-hidden transition-all duration-500"
              style={{
                borderRadius: '24px',
                flex: hoveredHeader === 1 ? '6' : hoveredHeader !== null ? '0.5' : '1'
              }}
              onMouseEnter={() => setHoveredHeader(1)}
              onMouseLeave={() => setHoveredHeader(null)}
            >
              <Media media={heroImage2} className="w-full h-full object-cover" alt={heroImage2.alt} />
            </div>
            <div
              className="overflow-hidden transition-all duration-500"
              style={{
                borderRadius: '24px',
                flex: hoveredHeader === 2 ? '6' : hoveredHeader !== null ? '0.5' : '1'
              }}
              onMouseEnter={() => setHoveredHeader(2)}
              onMouseLeave={() => setHoveredHeader(null)}
            >
              <Media
                media={heroImage3}
                className="w-full h-full object-cover"
                alt={heroImage3.alt}
              />
            </div>
          </div>

          {/* Video on the right */}
          <div
            className="overflow-hidden"
            style={{
              borderRadius: '24px',
              height: '100%',
              aspectRatio: '9 / 16',
              flexShrink: 0
            }}
          >
            <CarouselMedia
              media={displayMedia}
              isVisible={true}
              isAdjacent={false}
              className="w-full h-full object-contain"
              alt={projectTitle}
            />
          </div>
        </div>
      </div>

      {/* Gallery section below the fold */}
      <div
        className="fixed bg-[#D1D5DB] space-y-12 left-0 right-0"
        style={{
          top: '100vh',
          paddingTop: '52px',
          paddingBottom: '80px',
          paddingLeft: '80px',
          paddingRight: '80px',
          transform: `translateY(-${phase3Scroll}px)`,
          transition: 'transform 0ms linear'
        }}
      >
        {/* Full-width photo 1 */}
        <div className="overflow-hidden" style={{ borderRadius: '24px', height: '600px', width: '100%' }}>
          <Media media={exhibitionPhoto1} className="w-full h-full object-cover" alt={exhibitionPhoto1.alt} />
        </div>

        {/* Five photo row - special rule to show whole photos */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto2} className="w-full h-full object-contain" alt={exhibitionPhoto2.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto3} className="w-full h-full object-contain" alt={exhibitionPhoto3.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto4} className="w-full h-full object-contain" alt={exhibitionPhoto4.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto5} className="w-full h-full object-contain" alt={exhibitionPhoto5.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto6} className="w-full h-full object-contain" alt={exhibitionPhoto6.alt} />
          </div>
        </div>

        {/* Two photo row - fill container like rest of site */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto7} className="w-full h-full object-cover" alt={exhibitionPhoto7.alt} />
          </div>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto8} className="w-full h-full object-cover" alt={exhibitionPhoto8.alt} />
          </div>
        </div>

        {/* Row 4: Five photo row - old row 2 with special rule to show whole photos */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto9} className="w-full h-full object-contain" alt={exhibitionPhoto9.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto10} className="w-full h-full object-contain" alt={exhibitionPhoto10.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto11} className="w-full h-full object-contain" alt={exhibitionPhoto11.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto12} className="w-full h-full object-contain" alt={exhibitionPhoto12.alt} />
          </div>
          <div className="overflow-hidden" style={{ flex: '1', borderRadius: '24px', height: '630px' }}>
            <Media media={exhibitionPhoto13} className="w-full h-full object-contain" alt={exhibitionPhoto13.alt} />
          </div>
        </div>

        {/* Row 5: Two photo row */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto17} className="w-full h-full object-cover" alt={exhibitionPhoto17.alt} />
          </div>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto18} className="w-full h-full object-cover" alt={exhibitionPhoto18.alt} />
          </div>
        </div>
      </div>

      {/* Spacer to create scroll space for gallery */}
      <div style={{ height: '4080px' }} />
      </div>
    )
  }

  // MOBILE RENDER (placeholder for now)
  return (
    <div className="min-h-screen bg-black text-white">
      <p>Mobile version coming soon...</p>
    </div>
  )
}
