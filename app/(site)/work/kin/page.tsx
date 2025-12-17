'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'

export default function KinPage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Mobile-specific states
  const [swipeProgress, setSwipeProgress] = useState(0)
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

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    setIsReady(true)

    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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

  // Kin Festival images and data
  const heroImage1 = {
    public_id: "v1765922612/PreservationPark_Mocks_fp2i3e",
    kind: "image" as const,
    alt: "Kin Festival header image 1"
  }

  const heroImage2 = {
    public_id: "v1765920441/DSC_1445_ecalzy",
    kind: "image" as const,
    alt: "Kin Festival header image 2"
  }

  const heroImage3 = {
    public_id: "v1765922612/PreservationPark_Mocks_fp2i3e",
    kind: "image" as const,
    alt: "Kin Festival header image 3"
  }

  // Exhibition photos - using placeholder from Exhibit folder
  const exhibitionPhoto1 = { public_id: "v1765920441/DSC_1445_ecalzy", kind: "image" as const, alt: "Kin Festival exhibition view 1" }
  const exhibitionPhoto2 = { public_id: "v1765920441/DSC_1445_ecalzy", kind: "image" as const, alt: "Kin Festival exhibition view 2" }
  const exhibitionPhoto3 = { public_id: "v1765920441/DSC_1445_ecalzy", kind: "image" as const, alt: "Kin Festival exhibition view 3" }
  const exhibitionPhoto4 = { public_id: "v1765920441/DSC_1445_ecalzy", kind: "image" as const, alt: "Kin Festival exhibition view 4" }

  const videoPublicId = "v1765922400/KIN_Reel_tfv4qr"
  const projectTitle = "KIN Festival"
  const projectDescription = "KIN Festival is a celebration of community, connection, and culture. Through immersive experiences and artistic expression, the festival brings people together to explore themes of identity, belonging, and shared humanity."

  // Mobile gallery images
  const mobileGalleryImages = [
    exhibitionPhoto1, exhibitionPhoto2, exhibitionPhoto3, exhibitionPhoto4
  ]

  const kinReel = { public_id: videoPublicId, kind: "video" as const, alt: "Kin Festival reel" }
  const displayMedia = kinReel
  const fallbackImage = heroImage1

  // MOBILE RENDER
  if (isMobile) {
    return (
      <>
        {!isReady && (
          <div className="fixed inset-0 bg-black z-[9999]" />
        )}

        <div className="h-screen w-full relative bg-black" style={{ overflow: swipeProgress < 1 ? 'hidden' : 'visible' }}>
        <div
          className="fixed left-0 w-full z-50 pointer-events-none"
          style={{
            top: '20px',
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
                  height: 'auto',
                  filter: 'invert(1) brightness(2)'
                }}
              />
            </div>
          </div>
        </div>

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
                fallbackImage={fallbackImage}
                isVisible={true}
                isAdjacent={false}
                className="object-cover w-full h-full"
                alt={projectTitle}
                priority={true}
              />
            )}
          </div>

          {swipeProgress < 0.1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70">
              Swipe up for more
            </div>
          )}
        </div>

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
            <div className="px-6 mb-8 text-right">
              <h1 className="font-ui text-2xl font-bold mb-3 text-black">{projectTitle}</h1>
              <div className="mb-4 text-black font-ui text-sm">
                <p><strong>Year:</strong> 2025</p>
                <p><strong>Role:</strong> Art Director & Exhibition Lead</p>
                <p><strong>Client:</strong> Kinfolk</p>
              </div>
              <div className="text-black leading-relaxed font-ui text-sm">
                {projectDescription}
              </div>
            </div>

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

  // DESKTOP RENDER
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

  const phase1Progress = Math.min(1, scrollY / phase1End)
  const mLogoTop = 52 - (40 * phase1Progress)

  const phase2Scroll = Math.max(0, scrollY - phase1End)
  const shrinkDistance = mHeight - minMHeight
  const shrinkDuration = phase2End - phase1End
  const mShrinkProgress = Math.min(1, phase2Scroll / shrinkDuration)
  const currentMHeight = mHeight - (shrinkDistance * mShrinkProgress)
  const currentMWidth = mWidth

  const phase3Scroll = Math.max(0, scrollY - phase2End)
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
      {!isReady && (
        <div className="fixed inset-0 bg-black z-[9999]" />
      )}

      <div className="min-h-screen bg-[#D1D5DB]">
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

      <div className="h-screen relative">
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
          <div className="flex-1 flex flex-col" style={{ gap: '25px' }}>
            <div className="flex-1 overflow-hidden" style={{ borderRadius: '24px' }}>
              <Media media={heroImage1} className="w-full h-full object-cover" alt={heroImage1.alt || 'Kin Header 1'} />
            </div>
            <div className="flex-1 overflow-hidden" style={{ borderRadius: '24px' }}>
              <Media media={heroImage2} className="w-full h-full object-cover" alt={heroImage2.alt || 'Kin Header 2'} />
            </div>
            <div className="flex-1 overflow-hidden" style={{ borderRadius: '24px' }}>
              <Media media={heroImage3} className="w-full h-full object-cover" alt={heroImage3.alt || 'Kin Header 3'} />
            </div>
          </div>

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
        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto1} className="w-full h-full object-cover" alt={exhibitionPhoto1.alt} />
          </div>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto2} className="w-full h-full object-cover" alt={exhibitionPhoto2.alt} />
          </div>
        </div>

        <div className="flex" style={{ gap: '25px' }}>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto3} className="w-full h-full object-cover" alt={exhibitionPhoto3.alt} />
          </div>
          <div className="overflow-hidden" style={{ flexBasis: '50%', borderRadius: '24px', height: '600px' }}>
            <Media media={exhibitionPhoto4} className="w-full h-full object-cover" alt={exhibitionPhoto4.alt} />
          </div>
        </div>
      </div>

      <div style={{ height: '2000px' }} aria-hidden="true" />
    </div>
    </>
  )
}
