'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'

export default function ThereGoesNikkiPage() {
  const [scrollY, setScrollY] = useState(0)
  const [laggedScrollY, setLaggedScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(1000)
  const [textHeight, setTextHeight] = useState(200) // Better initial estimate for text height
  const [isMounted, setIsMounted] = useState(false)
  const [hoveredHeroImage, setHoveredHeroImage] = useState<number | null>(null) // Track which hero image is hovered (0, 1, or 2)
  const textRef = useRef<HTMLDivElement>(null)

  // Track viewport height
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  // Measure text height (remeasure on viewport resize)
  useEffect(() => {
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
  }, [])

  // Smooth scroll tracking
  useEffect(() => {
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
  }, [])

  // Apply lag to scroll for smoother morphing
  useEffect(() => {
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
  }, [scrollY])

  // Header images - three stacked images (using first 3 gallery images)
  const heroImage1 = {
    public_id: "v1756781737/R1_A_ddfamw",
    kind: "image" as const,
    alt: "There Goes Nikki header image 1"
  }

  const heroImage2 = {
    public_id: "v1756781922/There_Goes_Nikki_060725_ZhenQIN_20_njdf38",
    kind: "image" as const,
    alt: "There Goes Nikki header image 2"
  }

  const heroImage3 = {
    public_id: "v1756781721/R2_kapahy",
    kind: "image" as const,
    alt: "There Goes Nikki header image 3"
  }

  // Exhibition photos (using gallery images 4-7)
  const exhibitionPhoto1 = {
    public_id: "v1756781690/R3_A_vwwayn",
    kind: "image" as const,
    alt: "There Goes Nikki exhibition view 1"
  }

  const exhibitionPhoto2 = {
    public_id: "v1756781710/R3_BB_csskos",
    kind: "image" as const,
    alt: "There Goes Nikki exhibition view 2"
  }

  const exhibitionPhoto3 = {
    public_id: "v1756781705/R3_C_ht9cog",
    kind: "image" as const,
    alt: "There Goes Nikki exhibition view 3"
  }

  const exhibitionPhoto4 = {
    public_id: "v1756781726/R4_whegdf",
    kind: "image" as const,
    alt: "There Goes Nikki exhibition view 4"
  }

  // Video - using placeholder for now
  const videoPublicId = "ThereGoesNikki_reel"

  // Project info
  const projectTitle = "There Goes Nikki"
  const projectDescription = "Brought to life by Kinfolk, There Goes Nikki is an augmented reality ode to the late poet Nikki Giovanni. Her voice, reciting Quilting the Black-Eyed Pea (We're Going to Mars), carries viewers through a cosmic expanse into a lush spiral landscape. The spiral embodies infinity and the life journey, entwined with florals that evoke mourning, memory, and return to earth. Here, the celestial and terrestrial mirror one another, and poetry becomes the vessel that opens into the universe Giovanni envisioned—for herself, and for all of us."

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

  // Calculate flex values for hero images based on hover state
  // When middle (index 1) is hovered: it gets 70%, others split 30% (15% each)
  // When top (index 0) is hovered: top gets 70%, middle gets 20%, bottom gets 10%
  // When bottom (index 2) is hovered: bottom gets 70%, middle gets 20%, top gets 10%
  // When no hover: all equal at 33.33% each
  const getHeroImageFlex = (index: number): number => {
    if (hoveredHeroImage === null) {
      return 1 // Equal distribution when no hover
    }

    if (hoveredHeroImage === index) {
      return 7 // 70% for hovered image
    }

    if (hoveredHeroImage === 1) {
      // Middle is hovered, other two split 30% equally
      return 1.5 // 15% each
    }

    // Top or bottom is hovered - create gradient
    const distance = Math.abs(hoveredHeroImage - index)
    if (distance === 1) {
      return 2 // 20% for adjacent image
    }
    return 1 // 10% for furthest image
  }

  return (
    <div className="min-h-screen bg-[#D1D5DB]">
      {/* Fixed Header - full width, z-index 2, always taller than State 3 (130px) */}
      <div
        className="fixed top-0 left-0 right-0 bg-[#D1D5DB]"
        style={{
          height: '110px',
          zIndex: 2
        }}
      />

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
            gap: '25px' // Fixed 25px margin between photos and video
          }}
        >
          {/* Three stacked photos - fills remaining space with vertical carousel behavior */}
          <div
            className="flex-1 flex flex-col"
            style={{
              gap: '25px' // Gap between stacked photos
            }}
          >
            {/* Photo 1 - Top */}
            <div
              className="overflow-hidden transition-all duration-500 ease-out"
              style={{
                borderRadius: '24px',
                flex: getHeroImageFlex(0)
              }}
              onMouseEnter={() => setHoveredHeroImage(0)}
              onMouseLeave={() => setHoveredHeroImage(null)}
            >
              <Media
                media={heroImage1}
                className="w-full h-full object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: '5% 50%'
                }}
                alt={heroImage1.alt || 'There Goes Nikki Header 1'}
              />
            </div>

            {/* Photo 2 - Middle */}
            <div
              className="overflow-hidden transition-all duration-500 ease-out"
              style={{
                borderRadius: '24px',
                flex: getHeroImageFlex(1)
              }}
              onMouseEnter={() => setHoveredHeroImage(1)}
              onMouseLeave={() => setHoveredHeroImage(null)}
            >
              <Media
                media={heroImage2}
                className="w-full h-full object-cover"
                alt={heroImage2.alt || 'There Goes Nikki Header 2'}
              />
            </div>

            {/* Photo 3 - Bottom */}
            <div
              className="overflow-hidden transition-all duration-500 ease-out"
              style={{
                borderRadius: '24px',
                flex: getHeroImageFlex(2)
              }}
              onMouseEnter={() => setHoveredHeroImage(2)}
              onMouseLeave={() => setHoveredHeroImage(null)}
            >
              <Media
                media={heroImage3}
                className="w-full h-full object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: '35% 50%'
                }}
                alt={heroImage3.alt || 'There Goes Nikki Header 3'}
              />
            </div>
          </div>

          {/* Video - fixed aspect ratio */}
          <div
            className="h-full overflow-hidden flex items-center justify-center"
            style={{
              borderRadius: '24px',
              backgroundColor: '#D1D5DB',
              width: 'auto',
              flexShrink: 0
            }}
          >
            <VideoPlayer
              publicId={videoPublicId}
              portrait={true}
              className="h-full"
              style={{
                objectFit: 'contain',
                width: 'auto',
                height: '100%'
              }}
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
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto1}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto1.alt}
            />
          </div>

          <div
            className="overflow-hidden"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto2}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto2.alt}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex" style={{ gap: '25px' }}>
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto3}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto3.alt}
            />
          </div>

          <div
            className="overflow-hidden"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto4}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto4.alt}
            />
          </div>
        </div>
      </div>

      {/* Spacer to enable scrolling - creates document height */}
      <div style={{ height: '2598px' }} aria-hidden="true" />
    </div>
  )
}
