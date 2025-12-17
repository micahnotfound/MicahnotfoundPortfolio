'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import { useMobile } from '@/contexts/MobileContext'

export default function BlacklandsPage() {
  const router = useRouter()
  const { isMobile } = useMobile() // Use global mobile detection
  const [isReady, setIsReady] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [laggedScrollY, setLaggedScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(1000)
  const [textHeight, setTextHeight] = useState(200) // Better initial estimate for text height
  const [isMounted, setIsMounted] = useState(false)
  const [swipeProgress, setSwipeProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const touchStartRef = useRef<{ y: number; time: number } | null>(null)
  const lastTouchY = useRef<number>(0)
  const textRef = useRef<HTMLDivElement>(null)

  // Mobile detection now handled by global MobileContext

  // Set ready state after mount
  useEffect(() => {
    setIsReady(true)
  }, [])

  // Track viewport height (only for desktop)
  useEffect(() => {
    if (isMobile) return
    const updateHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [isMobile])

  // Measure text height (remeasure on viewport resize) - only for desktop
  useEffect(() => {
    if (isMobile) return
    const measureText = () => {
      if (textRef.current) {
        setTextHeight(textRef.current.offsetHeight)
        // Mark as mounted after first measurement
        setIsMounted(true)
      }
    }

    measureText()
    window.addEventListener('resize', measureText)
    return () => window.removeEventListener('resize', measureText)
  }, [isMobile])

  // Smooth scroll tracking (only for desktop)
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

  // Apply lag to scroll for smoother morphing (only for desktop)
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

  // Handle touch events for swipe - mobile only
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
      lastTouchY.current = touch.clientY

      const maxSwipe = window.innerHeight
      const progress = Math.max(0, Math.min(1, swipeProgress + (deltaY / maxSwipe)))
      setSwipeProgress(progress)

      touchStartRef.current.y = touch.clientY
    }

    const handleTouchEnd = () => {
      setIsDragging(false)

      if (swipeProgress > 0.5) {
        setSwipeProgress(1)
      } else {
        setSwipeProgress(0)
      }

      touchStartRef.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [swipeProgress, isMobile])

  // Header image - using Cloudinary face detection and custom focal point
  const heroImage = {
    public_id: "v1756775322/Blacklands_H1_okkjx9",
    kind: "image" as const,
    alt: "BLACKLANDS Header"
  }

  // Exhibition photos - unique images for each position
  const exhibitionPhoto1 = {
    public_id: "v1756775074/Blacklands_R1_cobywl",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 1"
  }

  const exhibitionPhoto2 = {
    public_id: "v1756775074/Blacklands_R2_qaects",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 2"
  }

  const exhibitionPhoto3 = {
    public_id: "v1756775074/Blacklands_R3_fija7f",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 3"
  }

  const exhibitionPhoto4 = {
    public_id: "v1756775074/Blacklands_R1_cobywl",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 4"
  }

  const exhibitionPhoto5 = {
    public_id: "v1756775074/Blacklands_R2_qaects",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 5"
  }

  const exhibitionPhoto6 = {
    public_id: "v1756775074/Blacklands_R3_fija7f",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 6"
  }

  const exhibitionPhoto7 = {
    public_id: "v1756775074/Blacklands_R1_cobywl",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 7"
  }

  const exhibitionPhoto8 = {
    public_id: "v1756775074/Blacklands_R2_qaects",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 8"
  }

  const exhibitionPhoto9 = {
    public_id: "v1756775074/Blacklands_R3_fija7f",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 9"
  }

  // Video
  const videoPublicId = "BLACKLANDS_reel_vpw5br"

  // Project info
  const projectTitle = "Black Lands"
  const projectDescription = "Produced by Kinfolk, Black Lands was an award-winning immersive AR exhibition recognized at the Tribeca Film Festival. The project explored early Black communities in New York history, featuring digital monuments to Sojourner Truth, Manuel de Gerrit de Reus, and Samuel Anderson. Each figure was co-created with nonprofit partners who rooted the stories in authentic community memory. By weaving art, technology, and liberation, Kinfolk ensured these legacies continue to inform and empower the present."

  // Layout calculations - PRIORITY ORDER:
  // 1. Text at bottom (with bottom margin matching top margin = 52px)
  // 2. 50px padding above text
  // 3. Dividing line (3px)
  // 4. 50px padding above dividing line
  // 5. M fills remaining space from top

  const topMargin = 52
  const bottomMargin = 52
  const paddingBelowLine = 50
  const paddingAboveLine = 20 // Minimal padding between M and dividing line
  const dividerHeight = 3

  // Calculate M height based on available space
  // M ALWAYS fills space between top margin and dividing line
  const spaceForText = textHeight
  const spaceForPadding = paddingBelowLine + dividerHeight + paddingAboveLine
  const availableSpaceForM = viewportHeight - topMargin - bottomMargin - spaceForText - spaceForPadding + 100 // Add 100px more space for M (50 + 50)
  const minMHeight = 130 // State 3 height (minimum size)
  const mHeight = Math.max(minMHeight, availableSpaceForM) // NO maximum - can be infinitely tall

  // M width is ALWAYS constant at 250px (never changes)
  const mWidth = 250

  // THREE SEQUENTIAL ANIMATION PHASES:
  // Phase 1: M moves up (0-200px scroll)
  // Phase 2: M shrinks (200-600px scroll)
  // Phase 3: Content scrolls (600px+ scroll)

  const phase1End = 200  // M finishes moving up
  const phase2End = 600  // M finishes shrinking

  // Phase 1: M moves from 52px to 12px
  const phase1Progress = Math.min(1, scrollY / phase1End)
  const mLogoTop = 52 - (40 * phase1Progress)

  // Phase 2: M shrinks (only after phase 1 completes)
  const phase2Scroll = Math.max(0, scrollY - phase1End)
  const shrinkDistance = mHeight - minMHeight
  const shrinkDuration = phase2End - phase1End // 400px of scroll
  const mShrinkProgress = Math.min(1, phase2Scroll / shrinkDuration)
  const currentMHeight = mHeight - (shrinkDistance * mShrinkProgress)
  const currentMWidth = mWidth // Width is ALWAYS constant at 250px

  // Phase 3: Content scrolls (only after phase 2 completes)
  const phase3Scroll = Math.max(0, scrollY - phase2End)
  const photoScrollOffset = phase3Scroll
  const textScrollOffset = phase3Scroll // Text scrolls at same rate as photo
  const contentScrollOffset = phase3Scroll // Content (photo + text) scrolls together

  // Determine logo state based on current height
  // Maps the current M height to the appropriate SVG state
  const getLogoState = (): 0 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 => {
    const state0Height = 525
    const state1Height = 455
    const state1_5Height = 373
    const state2Height = 292
    const state2_5Height = 211
    const state3_5Height = 170
    const state3Height = 130

    // Map current height to closest state (for heights above state 0, always use state 0)
    if (currentMHeight >= state0Height) return 0
    if (currentMHeight >= (state0Height + state1Height) / 2) return 0
    if (currentMHeight >= (state1Height + state1_5Height) / 2) return 1
    if (currentMHeight >= (state1_5Height + state2Height) / 2) return 1.5
    if (currentMHeight >= (state2Height + state2_5Height) / 2) return 2
    if (currentMHeight >= (state2_5Height + state3_5Height) / 2) return 2.5
    if (currentMHeight >= (state3_5Height + state3Height) / 2) return 3.5
    return 3
  }

  // Positions for dividing line and text (from bottom up)
  const textBottomY = viewportHeight - bottomMargin
  const dividerY = textBottomY - textHeight - paddingBelowLine

  // Mobile view
  if (isMobile) {
    const galleryImages = [
      exhibitionPhoto1,
      exhibitionPhoto2,
      exhibitionPhoto3,
      heroImage
    ]

    const displayMedia = {
      public_id: videoPublicId,
      kind: "video" as const,
      alt: "Black Lands video"
    }

    const fallbackImage = heroImage

    return (
      <>
        {!isReady && (<div className="fixed inset-0 bg-black z-[9999]" />)}
        <div className="h-screen w-full relative bg-black" style={{ overflow: swipeProgress < 1 ? 'hidden' : 'visible' }}>
        {/* Video section - slides up, full screen */}
        <div
          className="absolute top-0 left-0 w-full h-screen transition-transform z-10"
          style={{
            transform: `translateY(-${swipeProgress * 100}vh)`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
          }}
        >
          {/* M Logo - transitions from fixed to absolute */}
          <div
            className={swipeProgress >= 1 ? "absolute left-0 w-full z-50 pointer-events-none" : "fixed left-0 w-full z-50 pointer-events-none"}
            style={{
              top: '20px',
              paddingLeft: '30px',
              paddingRight: '30px'
            }}
          >
            <div className="flex items-center justify-start pointer-events-auto">
              <div
                className="flex-shrink-0 cursor-pointer"
                onClick={() => router.push('/')}
              >
                <MorphingHeaderLogo
                  state={3}
                  className="transition-all duration-500 ease-out"
                  style={{
                    width: '205px',
                    height: 'auto',
                    filter: 'none'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="w-full h-full bg-black">
            {displayMedia && (
              <CarouselMedia
                media={displayMedia}
                fallbackImage={fallbackImage}
                isVisible={true}
                isAdjacent={false}
                className="object-cover w-full h-full"
                alt={projectTitle}
                priority={true}
              />
            )}
          </div>

          {/* Swipe up indicator */}
          {swipeProgress < 0.1 && (
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70"
            >
              Swipe up for more
            </div>
          )}
        </div>

        {/* Content section - slides up from below */}
        <div
          className="absolute left-0 w-full bg-[#D1D5DB] transition-transform"
          style={{
            top: '100vh',
            transform: `translateY(-${swipeProgress * 100}vh)`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-out',
            height: 'auto',
            minHeight: '100vh',
            paddingTop: '115px',
            overflowY: swipeProgress >= 1 ? 'auto' : 'hidden',
            overflowX: 'hidden'
          }}
        >
          <div className="pb-12">
            {/* Text content - right aligned with padding */}
            <div className="px-6 mb-8 text-right">
              {/* Project title */}
              <h1 className="font-ui text-2xl font-bold mb-3 text-black">{projectTitle}</h1>

              {/* Description */}
              <div className="text-black leading-relaxed font-ui text-sm">
                {projectDescription}
              </div>
            </div>

            {/* Full width gallery */}
            {galleryImages.length > 0 && (
              <div className="flex flex-col gap-4 px-3">
                {galleryImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-full overflow-hidden"
                    style={{
                      borderRadius: '0px'
                    }}
                  >
                    <Media
                      media={image}
                      className="w-full h-auto"
                      alt={image.alt || `${projectTitle} gallery image`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </>
    )
  }

  // Desktop view
  return (
    <>
      {!isReady && (<div className="fixed inset-0 bg-black z-[9999]" />)}
      <div className="min-h-screen bg-[#D1D5DB]">
      {/* M Logo - z-index 4, width 250px constant */}
      <div
        className="absolute left-0"
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
            width: '330px', // 80px padding + 250px content
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

          {/* Text - z-index 0, bottom-anchored, ragged right */}
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
            left: '370px', // Starts right after M (80px padding + 250px M width + 40px gap)
            top: `${topMargin}px`,
            right: '80px',
            height: `calc(100vh - ${topMargin + bottomMargin}px)`,
            zIndex: 3,
            transform: `translateY(-${photoScrollOffset}px)`,
            transition: 'transform 0ms linear',
            gap: '25px' // Fixed 25px margin between photo and video
          }}
        >
          {/* Photo - fills remaining space */}
          <div
            className="flex-1 overflow-hidden"
            style={{
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px'
            }}
          >
            <Media
              media={heroImage}
              className="w-full h-full object-cover"
              style={{
                objectFit: 'cover',
                objectPosition: '35% 25%'
              }}
              alt={heroImage.alt || 'BLACKLANDS Header'}
            />
          </div>

          {/* Video - fixed aspect ratio */}
          <div
            className="h-full overflow-hidden flex items-center justify-center"
            style={{
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              backgroundColor: '#D1D5DB',
              width: 'auto',
              flexShrink: 0
            }}
          >
            <VideoPlayer
              publicId={videoPublicId}
              portrait={true}
              className="h-full"
              controls={true}
              autoPlay={false}
              muted={true}
              loop={false}
            />
          </div>
        </div>
      </div>

      {/* Exhibition photos section - all rows */}
      <div
        className="fixed bg-[#D1D5DB] pb-12 space-y-12 left-0 right-0"
        style={{
          top: '100vh',
          paddingTop: '52px',
          paddingLeft: '80px',
          paddingRight: '80px',
          transform: `translateY(-${contentScrollOffset}px)`,
          transition: 'transform 0ms linear'
        }}
      >
        {/* Row 1 */}
        <div className="flex" style={{ gap: '25px' }}>
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '50%',
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              aspectRatio: '1/1'
            }}
          >
            <Media
              media={exhibitionPhoto1}
              className="w-full h-full object-cover"
              style={{
                objectFit: 'cover',
                objectPosition: '40% 25%'
              }}
              alt={exhibitionPhoto1.alt}
            />
          </div>

          <div
            className="overflow-hidden"
            style={{
              flexBasis: '50%',
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              aspectRatio: '1/1'
            }}
          >
            <Media
              media={exhibitionPhoto2}
              className="w-full h-full object-cover"
              style={{
                objectFit: 'cover',
                objectPosition: '25% 50%'
              }}
              alt={exhibitionPhoto2.alt}
            />
          </div>
        </div>

        {/* Row 2 - BlackLands R3 full width */}
        <div className="flex" style={{ gap: '25px' }}>
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '100%',
              borderTopLeftRadius: '0px',
              borderBottomLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
              aspectRatio: '1/1'
            }}
          >
            <Media
              media={exhibitionPhoto3}
              className="w-full h-full object-cover"
              style={{
                objectFit: 'cover',
                objectPosition: '15% 50%'
              }}
              alt={exhibitionPhoto3.alt}
            />
          </div>
        </div>
      </div>

      {/* Spacer to enable scrolling - creates document height */}
      <div style={{ height: '1948px' }} aria-hidden="true" />
    </div>
    </>
  )
}
