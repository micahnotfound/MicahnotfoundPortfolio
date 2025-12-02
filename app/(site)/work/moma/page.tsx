'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'

export default function MomaPage() {
  const [scrollY, setScrollY] = useState(0)
  const [hoveredCarousel, setHoveredCarousel] = useState<number | null>(null)
  const [laggedScrollY, setLaggedScrollY] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(1000)
  const [textHeight, setTextHeight] = useState(200) // Better initial estimate for text height
  const [isMounted, setIsMounted] = useState(false)
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

  // Header images - three stacked images
  const heroImage1 = {
    public_id: "v1756571817/BL_horizontal_0002_Layer-Comp-3_zfyhau",
    kind: "image" as const,
    alt: "MoMA header image 1"
  }

  const heroImage2 = {
    public_id: "v1756779854/H2_r0fekk",
    kind: "image" as const,
    alt: "MoMA header image 2"
  }

  const heroImage3 = {
    public_id: "v1756571818/BL_horizontal_0000_Layer-Comp-1_wolars",
    kind: "image" as const,
    alt: "MoMA header image 3"
  }

  // Exhibition photos
  const exhibitionPhoto1 = {
    public_id: "v1756780128/R1_A_awyxgz.png",
    kind: "image" as const,
    alt: "MoMA exhibition view 1"
  }

  const exhibitionPhoto2 = {
    public_id: "v1756780152/R1_B_tqtykc.png",
    kind: "image" as const,
    alt: "MoMA exhibition view 2"
  }

  const exhibitionPhoto3 = {
    public_id: "v1756780124/R2_pad3q3.jpg",
    kind: "image" as const,
    alt: "MoMA exhibition view 3"
  }

  const exhibitionPhoto4 = {
    public_id: "v1756780144/R3_A_iztwci.png",
    kind: "image" as const,
    alt: "MoMA exhibition view 4"
  }

  const exhibitionPhoto5 = {
    public_id: "v1756780140/R3_B_dbzhsf.png",
    kind: "image" as const,
    alt: "MoMA exhibition view 5"
  }

  const exhibitionPhoto6 = {
    public_id: "v1756780136/R3_C_qfosmh.png",
    kind: "image" as const,
    alt: "MoMA exhibition view 6"
  }

  const exhibitionPhoto7 = {
    public_id: "v1756780132/R_4_vdy042.png",
    kind: "image" as const,
    alt: "MoMA exhibition view 7"
  }

  // Carousel data for profiles
  const senecaVillageImages = [
    {
      public_id: "v1756680394/Image_Sequence_003_0076_gxagjf",
      kind: "image" as const,
      alt: "Seneca Village profile 1"
    },
    {
      public_id: "v1756680394/Image_Sequence_003_0027_ruews2",
      kind: "image" as const,
      alt: "Seneca Village profile 2"
    },
    {
      public_id: "v1756680391/Image_Sequence_003_0104_auxzwe",
      kind: "image" as const,
      alt: "Seneca Village profile 4"
    },
    {
      public_id: "v1756571810/Image_Sequence_003_0046_mxoejx",
      kind: "image" as const,
      alt: "Seneca Village profile 8"
    }
  ]

  const youngLordsImages = [
    {
      public_id: "v1756680396/image_017_0000_0003_Layer-1_xbqhk2",
      kind: "image" as const,
      alt: "Young Lords profile 2"
    },
    {
      public_id: "v1756680395/image_017_0000_0002_image_017_0217_ujaosr",
      kind: "image" as const,
      alt: "Young Lords profile 1"
    },
    {
      public_id: "v1756680389/image_017_0000_0001_image_017_0318_ml64zv",
      kind: "image" as const,
      alt: "Young Lords profile 3"
    },
    {
      public_id: "v1756680389/image_017_0000_0000_image_017_0114_fjblhc",
      kind: "image" as const,
      alt: "Young Lords profile 4"
    }
  ]

  const davidRugglesImages = [
    {
      public_id: "v1756680387/Image_Sequence_5_egk7kq",
      kind: "image" as const,
      alt: "David Ruggles profile 1"
    },
    {
      public_id: "v1756680387/Image_Sequence_6_xbutyf",
      kind: "image" as const,
      alt: "David Ruggles profile 2"
    },
    {
      public_id: "v1756680387/Image_Sequence_7_mfi5mc",
      kind: "image" as const,
      alt: "David Ruggles profile 3"
    },
    {
      public_id: "v1756680387/Image_Sequence_8_lscign",
      kind: "image" as const,
      alt: "David Ruggles profile 4"
    }
  ]

  // Video
  const videoPublicId = "BLACKLANDS_reel_vpw5br"

  // Project info
  const projectTitle = "MoMA"
  const projectDescription = "Created by Kinfolk for MoMA's New York, New Publics (2023), The Monuments Project was a five-part installation reimagining the role of monuments in public space. The work centered on Black and Brown enclaves across New York City, honoring communities who cultivated safety, resistance, and belonging. Figures such as Seneca Village, the Young Lords, Toussaint Louverture, and David Ruggles were brought to life through archival research and contemporary storytelling. Anchored on raw red maple pedestals, the sculptures invited viewers to reconsider which histories are remembered and how they endure."

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
          {/* Three stacked photos - fills remaining space */}
          <div
            className="flex-1 flex flex-col"
            style={{
              gap: '25px' // Gap between stacked photos
            }}
          >
            {/* Photo 1 */}
            <div
              className="flex-1 overflow-hidden"
              style={{
                borderRadius: '24px'
              }}
            >
              <Media
                media={heroImage1}
                className="w-full h-full object-cover"
                alt={heroImage1.alt || 'MoMA Header 1'}
              />
            </div>

            {/* Photo 2 */}
            <div
              className="flex-1 overflow-hidden"
              style={{
                borderRadius: '24px'
              }}
            >
              <Media
                media={heroImage2}
                className="w-full h-full object-cover"
                alt={heroImage2.alt || 'MoMA Header 2'}
              />
            </div>

            {/* Photo 3 */}
            <div
              className="flex-1 overflow-hidden"
              style={{
                borderRadius: '24px'
              }}
            >
              <Media
                media={heroImage3}
                className="w-full h-full object-cover"
                alt={heroImage3.alt || 'MoMA Header 3'}
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

        {/* Row 2 - Full width */}
        <div className="flex" style={{ gap: '25px' }}>
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '100%',
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
        </div>

        {/* Row 3 - Three photos horizontal */}
        <div className="flex" style={{ gap: '25px' }}>
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '33.333%',
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

          <div
            className="overflow-hidden"
            style={{
              flexBasis: '33.333%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto5}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto5.alt}
            />
          </div>

          <div
            className="overflow-hidden"
            style={{
              flexBasis: '33.333%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto6}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto6.alt}
            />
          </div>
        </div>

        {/* Row 4 - Full width */}
        <div className="flex" style={{ gap: '25px' }}>
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '100%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto7}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto7.alt}
            />
          </div>
        </div>
      </div>

      {/* Spacer to enable scrolling - creates document height */}
      <div style={{ height: '3244px' }} aria-hidden="true" />

      {/* Carousel Section - Seneca Village, Young Lords, David Ruggles */}
      <div className="w-full" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
        {/* Seneca Village Carousel */}
        <div className="flex" style={{ gap: '25px', marginBottom: '48px', height: '600px' }}>
          {senecaVillageImages.map((image, idx) => (
            <div
              key={idx}
              className="overflow-hidden transition-all duration-500"
              style={{
                borderRadius: '24px',
                height: '600px',
                flex: hoveredCarousel === 0 && idx === hoveredCarousel ? '3' : '1'
              }}
              onMouseEnter={() => setHoveredCarousel(idx)}
              onMouseLeave={() => setHoveredCarousel(null)}
            >
              <Media
                media={image}
                className="w-full h-full object-cover"
                alt={image.alt}
              />
            </div>
          ))}
        </div>

        {/* Young Lords Carousel */}
        <div className="flex" style={{ gap: '25px', marginBottom: '48px', height: '600px' }}>
          {youngLordsImages.map((image, idx) => (
            <div
              key={idx}
              className="overflow-hidden transition-all duration-500"
              style={{
                borderRadius: '24px',
                height: '600px',
                flex: hoveredCarousel === 100 + idx ? '3' : '1'
              }}
              onMouseEnter={() => setHoveredCarousel(100 + idx)}
              onMouseLeave={() => setHoveredCarousel(null)}
            >
              <Media
                media={image}
                className="w-full h-full object-cover"
                alt={image.alt}
              />
            </div>
          ))}
        </div>

        {/* David Ruggles Carousel */}
        <div className="flex" style={{ gap: '25px', marginBottom: '48px', height: '600px' }}>
          {davidRugglesImages.map((image, idx) => (
            <div
              key={idx}
              className="overflow-hidden transition-all duration-500"
              style={{
                borderRadius: '24px',
                height: '600px',
                flex: hoveredCarousel === 200 + idx ? '3' : '1'
              }}
              onMouseEnter={() => setHoveredCarousel(200 + idx)}
              onMouseLeave={() => setHoveredCarousel(null)}
            >
              <Media
                media={image}
                className="w-full h-full object-cover"
                alt={image.alt}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
