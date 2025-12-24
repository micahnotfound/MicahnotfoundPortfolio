'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import { useMobile } from '@/contexts/MobileContext'

export default function MomaPage() {
  const router = useRouter()
  const { isMobile, isLoading } = useMobile() // Use global mobile detection
  const [isReady, setIsReady] = useState(false)

  // Mobile-specific states
  const [swipeProgress, setSwipeProgress] = useState(0) // 0 = video view, 1 = fully swiped to content
  const [isDragging, setIsDragging] = useState(false)
  const touchStartRef = useRef<{ y: number; time: number } | null>(null)
  const lastTouchY = useRef<number>(0)

  // Desktop-specific states
  const [scrollY, setScrollY] = useState(0)
  const [hoveredCarousel, setHoveredCarousel] = useState<number | null>(null)
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

  // Mobile: Handle touch events for swipe
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

  // Project images and data
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

  const exhibitionPhoto1 = { public_id: "v1756780128/R1_A_awyxgz.png", kind: "image" as const, alt: "MoMA exhibition view 1" }
  const exhibitionPhoto2 = { public_id: "v1756780152/R1_B_tqtykc.png", kind: "image" as const, alt: "MoMA exhibition view 2" }
  const exhibitionPhoto3 = { public_id: "v1756780124/R2_pad3q3.jpg", kind: "image" as const, alt: "MoMA exhibition view 3" }
  const exhibitionPhoto4 = { public_id: "v1756780144/R3_A_iztwci.png", kind: "image" as const, alt: "MoMA exhibition view 4" }
  const exhibitionPhoto5 = { public_id: "v1756780140/R3_B_dbzhsf.png", kind: "image" as const, alt: "MoMA exhibition view 5" }
  const exhibitionPhoto6 = { public_id: "v1756780136/R3_C_qfosmh.png", kind: "image" as const, alt: "MoMA exhibition view 6" }
  const exhibitionPhoto7 = { public_id: "v1756780132/R_4_vdy042.png", kind: "image" as const, alt: "MoMA exhibition view 7" }

  const senecaVillageImages = [
    { public_id: "v1756680394/Image_Sequence_003_0076_gxagjf", kind: "image" as const, alt: "Seneca Village profile 1" },
    { public_id: "v1756680394/Image_Sequence_003_0027_ruews2", kind: "image" as const, alt: "Seneca Village profile 2" },
    { public_id: "v1756680391/Image_Sequence_003_0104_auxzwe", kind: "image" as const, alt: "Seneca Village profile 4" },
    { public_id: "v1756571810/Image_Sequence_003_0046_mxoejx", kind: "image" as const, alt: "Seneca Village profile 8" }
  ]

  const youngLordsImages = [
    { public_id: "v1756680396/image_017_0000_0003_Layer-1_xbqhk2", kind: "image" as const, alt: "Young Lords profile 2" },
    { public_id: "v1756680395/image_017_0000_0002_image_017_0217_ujaosr", kind: "image" as const, alt: "Young Lords profile 1" },
    { public_id: "v1756680389/image_017_0000_0001_image_017_0318_ml64zv", kind: "image" as const, alt: "Young Lords profile 3" },
    { public_id: "v1756680389/image_017_0000_0000_image_017_0114_fjblhc", kind: "image" as const, alt: "Young Lords profile 4" }
  ]

  const davidRugglesImages = [
    { public_id: "v1756680387/Image_Sequence_5_egk7kq", kind: "image" as const, alt: "David Ruggles profile 1" },
    { public_id: "v1756680387/Image_Sequence_6_xbutyf", kind: "image" as const, alt: "David Ruggles profile 2" },
    { public_id: "v1756680387/Image_Sequence_7_mfi5mc", kind: "image" as const, alt: "David Ruggles profile 3" },
    { public_id: "v1756680387/Image_Sequence_8_lscign", kind: "image" as const, alt: "David Ruggles profile 4" }
  ]

  const videoPublicId = "v1756685191/Nested_Sequence_02_lwwymc"
  const projectTitle = "MoMA"
  const projectDescription = "Created by Kinfolk for MoMA's New York, New Publics (2023), The Monuments Project was a five-part installation reimagining the role of monuments in public space. The work centered on Black and Brown enclaves across New York City, honoring communities who cultivated safety, resistance, and belonging. Figures such as Seneca Village, the Young Lords, Toussaint Louverture, and David Ruggles were brought to life through archival research and contemporary storytelling. Anchored on raw red maple pedestals, the sculptures invited viewers to reconsider which histories are remembered and how they endure."
  const projectRole = "Principle Artist and Exhibition Lead"
  const projectCollaborators = "Kinfolk Team"
  const projectDate = "February 2023"

  // Mobile gallery images
  const mobileGalleryImages = [
    exhibitionPhoto1, exhibitionPhoto2, exhibitionPhoto3,
    exhibitionPhoto4, exhibitionPhoto5, exhibitionPhoto6, exhibitionPhoto7,
    ...senecaVillageImages, ...youngLordsImages, ...davidRugglesImages
  ]

  const momaReel = { public_id: videoPublicId, kind: "video" as const, alt: "MoMA reel" }
  const displayMedia = momaReel

  // Show loading screen while detecting mobile
  if (isLoading) {
    return <div className="fixed inset-0 bg-black z-[9999]" />
  }

  // MOBILE RENDER
  if (isMobile) {
    return (
      <>
        {/* Black loading overlay - fades out once ready */}
        {!isReady && (
          <div className="fixed inset-0 bg-black z-[9999]" />
        )}

        <div className="h-screen w-full relative bg-black" style={{ overflow: swipeProgress < 1 ? 'hidden' : 'visible' }}>
        {/* Fixed M Logo at top - white, small */}
        <div
          className="fixed left-0 w-full z-50 pointer-events-none"
          style={{
            top: '45px',
            paddingLeft: '30px',
            paddingRight: '30px'
          }}
        >
          <div className="flex items-center justify-start pointer-events-auto">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => router.push('/')}>
              <MorphingHeaderLogo
                state={3}
                className="transition-all duration-500 ease-out"
                style={{
                  width: '205px',
                  height: 'auto'
                }}
              />
            </div>
          </div>
        </div>

        {/* Video section - slides up */}
        <div
          className="absolute top-0 left-0 w-full h-screen transition-transform z-10"
          style={{
            transform: `translateY(-${swipeProgress * 100}vh)`,
            transition: isDragging ? 'none' : 'transform 0.5s ease-out'
          }}
        >
          <div className="w-full h-full bg-black">
            {displayMedia && (
              <CarouselMedia
                media={displayMedia}
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
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
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
            {/* Text content */}
            <div className="px-6 mb-8 text-right">
              <h1 className="font-ui text-2xl font-bold mb-3 text-black">{projectTitle}</h1>
              <div className="mb-4 text-black font-ui text-sm">
                <p><strong>Role:</strong> {projectRole}</p>
                <p><strong>Collaborators:</strong> {projectCollaborators}</p>
                <p><strong>Date:</strong> {projectDate}</p>
              </div>
              <div className="text-black leading-relaxed font-ui text-sm">
                {projectDescription}
              </div>
            </div>

            {/* Gallery */}
            {mobileGalleryImages.length > 0 && (
              <div className="flex flex-col gap-4 px-3">
                {mobileGalleryImages.map((image, index) => (
                  <div
                    key={index}
                    className="w-full overflow-hidden"
                    style={{ borderRadius: '24px' }}
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

  // DESKTOP RENDER (unchanged from original)
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

  const phase1End = 200
  const phase2End = 600

  // Phase 1: M moves from 52px to 12px
  const phase1Progress = Math.min(1, scrollY / phase1End)
  const phase1Top = 52 - (40 * phase1Progress)

  const phase2Scroll = Math.max(0, scrollY - phase1End)
  const shrinkDistance = mHeight - minMHeight
  const shrinkDuration = phase2End - phase1End
  const mShrinkProgress = Math.min(1, phase2Scroll / shrinkDuration)
  const currentMHeight = mHeight - (shrinkDistance * mShrinkProgress)
  const currentMWidth = mWidth

  const phase3Scroll = Math.max(0, scrollY - phase2End)

  // Phase 3: M continues scrolling up and off the screen
  const mLogoTop = phase1Top - (phase3Scroll * 0.5) // Continues scrolling up in phase 3
  const photoScrollOffset = phase3Scroll
  const textScrollOffset = phase3Scroll
  const contentScrollOffset = phase3Scroll

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
    <>
      {/* Black loading overlay - fades out once ready */}
      {!isReady && (
        <div className="fixed inset-0 bg-black z-[9999]" />
      )}

      <div className="min-h-screen bg-[#D1D5DB]">
      {/* M Logo */}
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

      {/* Content Container */}
      <div className="h-screen relative">
        {/* Left column */}
        <div
          className="absolute left-0"
          style={{
            paddingLeft: '80px',
            width: '330px',
            height: '100vh'
          }}
        >
          {/* Dividing line */}
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

          {/* Text */}
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
                <p><strong>Collaborators:</strong> {projectCollaborators}</p>
                <p><strong>Date:</strong> {projectDate}</p>
              </div>

              <p className="text-base font-ui text-gray-700 leading-relaxed">
                {projectDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Photo and Video container */}
        <div
          className="absolute flex"
          style={{
            left: '370px',
            top: `${topMargin}px`,
            right: '80px',
            height: `calc(100vh - ${topMargin + bottomMargin}px)`,
            zIndex: 3,
            gap: '25px'
          }}
        >
          {/* Three stacked photos */}
          <div className="flex-1 flex flex-col" style={{ gap: '25px' }}>
            <div className="flex-1 overflow-hidden" style={{ borderRadius: '24px' }}>
              <Media media={heroImage1} className="w-full h-full object-cover" alt={heroImage1.alt || 'MoMA Header 1'} />
            </div>
            <div className="flex-1 overflow-hidden" style={{ borderRadius: '24px' }}>
              <Media media={heroImage2} className="w-full h-full object-cover" alt={heroImage2.alt || 'MoMA Header 2'} />
            </div>
            <div className="flex-1 overflow-hidden" style={{ borderRadius: '24px' }}>
              <Media media={heroImage3} className="w-full h-full object-cover" alt={heroImage3.alt || 'MoMA Header 3'} />
            </div>
          </div>

          {/* Video */}
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
              controls={true}
              autoPlay={false}
              muted={true}
              loop={false}
            />
          </div>
        </div>
      </div>

      {/* Exhibition photos section */}
      <div
        className="bg-[#D1D5DB] pb-12 space-y-12"
        style={{
          paddingTop: '52px',
          paddingLeft: '80px',
          paddingRight: '80px',
          marginTop: '100vh'
        }}
      >
        {/* Row 1 */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto1} className="w-full h-full object-cover" alt={exhibitionPhoto1.alt} />
          </div>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto2} className="w-full h-full object-cover" alt={exhibitionPhoto2.alt} />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '100%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto3} className="w-full h-full object-cover" alt={exhibitionPhoto3.alt} />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '33.333%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto4} className="w-full h-full object-cover" alt={exhibitionPhoto4.alt} />
          </div>
          <div className="overflow-hidden" style={{ flexBasis: '33.333%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto5} className="w-full h-full object-cover" alt={exhibitionPhoto5.alt} />
          </div>
          <div className="overflow-hidden" style={{ flexBasis: '33.333%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto6} className="w-full h-full object-cover" alt={exhibitionPhoto6.alt} />
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '100%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto7} className="w-full h-full object-cover" alt={exhibitionPhoto7.alt} />
          </div>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
        {/* Seneca Village */}
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
              <Media media={image} className="w-full h-full object-cover" alt={image.alt} />
            </div>
          ))}
        </div>

        {/* Young Lords */}
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
              <Media media={image} className="w-full h-full object-cover" alt={image.alt} />
            </div>
          ))}
        </div>

        {/* David Ruggles */}
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
              <Media media={image} className="w-full h-full object-cover" alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
