'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import type { MediaItem } from '@/types/content'

interface BlacklandsLayoutProps {
  projectTitle: string
  projectDescription: string
  heroImage: MediaItem
  videoPublicId: string
}

export function BlacklandsLayout({
  projectTitle,
  projectDescription,
  heroImage,
  videoPublicId
}: BlacklandsLayoutProps) {
  const [scrollY, setScrollY] = useState(0)
  const [laggedScrollY, setLaggedScrollY] = useState(0) // Lagged scroll for smooth morphing
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null)

  // Smooth scroll tracking with requestAnimationFrame
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

  // Apply lag to scroll for smoother morphing animation
  useEffect(() => {
    const lagAmount = 0.15 // 15% lag - adjust for more/less smoothness
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

  // Exhibition photos - all photos on the page for fullscreen gallery
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
    public_id: "v1756775074/Blacklands_R3_example", // Update with actual photo ID
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 3"
  }

  // All photos for fullscreen gallery (10 total - hero + 4 rows x 2 photos + 1 new photo)
  const allPhotos = [
    heroImage, // Hero image first
    exhibitionPhoto1, exhibitionPhoto2, // Row 1
    exhibitionPhoto1, exhibitionPhoto2, // Row 2
    exhibitionPhoto1, exhibitionPhoto2, // Row 3
    exhibitionPhoto1, exhibitionPhoto2, // Row 4
    exhibitionPhoto3 // Row 5 - single photo
  ]

  // Fullscreen handlers
  const handleImageClick = (index: number) => {
    setFullscreenIndex(index)
  }

  const handleFullscreenClose = () => {
    setFullscreenIndex(null)
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (fullscreenIndex !== null) {
      setFullscreenIndex(fullscreenIndex > 0 ? fullscreenIndex - 1 : allPhotos.length - 1)
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (fullscreenIndex !== null) {
      setFullscreenIndex(fullscreenIndex < allPhotos.length - 1 ? fullscreenIndex + 1 : 0)
    }
  }

  // Scroll calculations
  // Calculate when hero section has scrolled off screen
  const heroScrollOffPoint = typeof window !== 'undefined' ? window.innerHeight : 1000

  // Synchronized animation: M shrinks, spacing collapses proportionally
  // Everything happens in unison as user scrolls
  const animationCompleteScroll = heroScrollOffPoint // Complete animation when hero scrolls off
  const scrollProgress = Math.min(1, scrollY / animationCompleteScroll)

  // Logo state heights (no clipping to avoid broken arches)
  // State 0 is the tallest ~655px, State 3 is shortest 112px
  const logoState0Height = 655 // State 0 natural height - TALL M
  const logoState3Height = 112 // State 3 final height

  // Initial spacing values (exactly 100px between M, dividing line, and text)
  const initialSpacing = 100 // Exactly 100px on both sides of dividing line
  const finalSpacing = 10 // Minimal spacing when collapsed

  // Calculate current spacing based on scroll progress
  const currentSpacing = initialSpacing - ((initialSpacing - finalSpacing) * scrollProgress)

  // Calculate current logo height based on scroll progress (smooth interpolation)
  const currentLogoHeight = logoState0Height - ((logoState0Height - logoState3Height) * scrollProgress)

  // Logo top position: starts at 52px, moves to 12px when animation completes
  const logoTopStart = 52
  const logoTopEnd = 12
  const currentLogoTop = logoTopStart - ((logoTopStart - logoTopEnd) * scrollProgress)

  // Dividing line position: currentLogoTop + currentLogoHeight + currentSpacing
  const dividingLineY = currentLogoTop + currentLogoHeight + currentSpacing

  // Text top position: dividingLineY + currentSpacing (another 100px initially)
  const textTopY = dividingLineY + currentSpacing

  // Determine logo state based on scroll progress (using lagged scroll for smooth morphing)
  // Start at State 0 (tallest) to match the screenshot
  const laggedProgress = Math.min(1, Math.max(0, laggedScrollY / animationCompleteScroll))
  const getLogoState = (): 0 | 1 | 2 | 3 => {
    if (laggedProgress === 0) return 0 // Start at State 0 - TALL M
    if (laggedProgress < 0.33) return 0  // Stay in State 0
    if (laggedProgress < 0.66) return 1 // Transition through State 1
    if (laggedProgress < 0.85) return 2 // Transition through State 2
    return 3 // End at State 3
  }

  // Logo becomes fixed when it reaches the top
  const logoShouldBeFixed = scrollProgress >= 1

  // Calculate when the bottom margin rectangle reaches the top and becomes sticky
  const bottomRectangleOffsetFromHero = heroScrollOffPoint
  const bottomRectangleShouldBeSticky = scrollY >= bottomRectangleOffsetFromHero

  return (
    <div className="min-h-screen bg-[#D1D5DB]">
      {/* Bottom margin rectangle - becomes sticky header when scrolled to top (z-40) */}
      <div
        style={{
          position: bottomRectangleShouldBeSticky ? 'fixed' : 'absolute',
          top: bottomRectangleShouldBeSticky ? '0' : `${heroScrollOffPoint}px`,
          left: 0,
          right: 0,
          height: bottomRectangleShouldBeSticky ? '122px' : '60px',
          backgroundColor: '#D1D5DB',
          transition: 'height 300ms ease-out',
          zIndex: 40
        }}
      />

      {/* Blocker rectangle - behind M (z-45), blocks text and dividing line as they scroll up */}
      {/* Height extends from top to just below dividing line */}
      <div
        style={{
          position: logoShouldBeFixed ? 'fixed' : 'absolute',
          top: logoShouldBeFixed ? '0px' : `${currentLogoTop}px`,
          left: '80px',
          width: '250px',
          height: `${currentLogoHeight + currentSpacing + 5}px`, // Cover M + spacing + a bit past dividing line
          backgroundColor: '#D1D5DB',
          zIndex: 45
        }}
      />

      {/* M Logo - highest z-index (z-50) */}
      {/* IMPORTANT: No height constraint or overflow hidden to avoid "broken arches effect" */}
      <div
        style={{
          position: logoShouldBeFixed ? 'fixed' : 'absolute',
          top: logoShouldBeFixed ? '12px' : `${currentLogoTop}px`,
          left: 0,
          paddingLeft: '80px',
          zIndex: 50
        }}
      >
        <Link href="/" style={{ width: '250px', display: 'block' }}>
          <MorphingHeaderLogo
            state={getLogoState()}
            style={{
              width: '100%',
              height: 'auto'
            }}
          />
        </Link>
      </div>

      {/* Dividing line - between M and text, disappears behind blocker (z-30) */}
      <div
        style={{
          position: 'absolute',
          top: `${dividingLineY}px`,
          left: '80px',
          width: '250px',
          height: '3px',
          backgroundColor: '#000000',
          zIndex: 30
        }}
      />

      {/* Text section - positioned dynamically based on scroll */}
      <div
        style={{
          position: 'absolute',
          top: `${textTopY}px`,
          left: '80px',
          width: '250px',
          zIndex: 20 // Below dividing line (z-30) so it goes behind blocker
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

      {/* Hero section - images/video only */}
      <div className="h-screen pb-12 pt-[52px]" style={{ paddingLeft: '80px', paddingRight: '80px' }}>
        <div className="w-full h-full flex gap-10 items-end">
          {/* Left side space reserved for text (now positioned absolutely above) */}
          <div className="flex-shrink-0" style={{ width: '250px' }} />

          {/* Right Side: Hero Image and Video */}
          <div className="flex gap-6 flex-grow h-full">
            {/* Hero Image - clickable for fullscreen */}
            <div
              className="overflow-hidden h-full cursor-pointer"
              style={{
                flexBasis: '65%',
                borderRadius: '24px'
              }}
              onClick={() => handleImageClick(0)}
            >
              <Media
                media={heroImage}
                className="w-full h-full object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center calc(50% + 100px)'
                }}
                alt={heroImage.alt || 'BLACKLANDS Hero'}
              />
            </div>

            {/* Video Player */}
            <div
              className="overflow-hidden h-full"
              style={{
                flexBasis: '35%',
                borderRadius: '24px'
              }}
            >
              <VideoPlayer
                publicId={videoPublicId}
                portrait={true}
                className="w-full h-full"
                controls={true}
                autoPlay={false}
                muted={true}
                loop={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exhibition photos section - scrolls under sticky header */}
      <div className="px-20 xl:px-[100px] pb-12 space-y-12" style={{ paddingTop: bottomRectangleShouldBeSticky ? '200px' : '60px' }}>
        {/* Row 1 */}
        <div className="flex gap-6">
          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(1)}
          >
            <Media
              media={exhibitionPhoto1}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto1.alt}
            />
          </div>

          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(2)}
          >
            <Media
              media={exhibitionPhoto2}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto2.alt}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-6">
          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(3)}
          >
            <Media
              media={exhibitionPhoto1}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto1.alt}
            />
          </div>

          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(4)}
          >
            <Media
              media={exhibitionPhoto2}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto2.alt}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex gap-6">
          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(5)}
          >
            <Media
              media={exhibitionPhoto1}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto1.alt}
            />
          </div>

          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(6)}
          >
            <Media
              media={exhibitionPhoto2}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto2.alt}
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="flex gap-6">
          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(7)}
          >
            <Media
              media={exhibitionPhoto1}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto1.alt}
            />
          </div>

          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(8)}
          >
            <Media
              media={exhibitionPhoto2}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto2.alt}
            />
          </div>
        </div>

        {/* Row 5 - Single new photo */}
        <div className="flex gap-6">
          <div
            className="overflow-hidden cursor-pointer"
            style={{
              flexBasis: '100%',
              borderRadius: '24px',
              height: '600px'
            }}
            onClick={() => handleImageClick(9)}
          >
            <Media
              media={exhibitionPhoto3}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto3.alt}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={handleFullscreenClose}
        >
          {/* Close button - top right */}
          <button
            onClick={handleFullscreenClose}
            className="absolute top-8 right-8 text-white text-4xl hover:opacity-70 transition-opacity"
            style={{ zIndex: 101 }}
          >
            ✕
          </button>

          {/* Previous arrow - left */}
          <button
            onClick={handlePrevious}
            className="absolute left-8 text-white text-6xl hover:opacity-70 transition-opacity"
            style={{ zIndex: 101 }}
          >
            ‹
          </button>

          {/* Current image */}
          <div
            className="max-w-[85vw] max-h-[85vh] overflow-hidden"
            style={{ borderRadius: '24px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Media
              media={allPhotos[fullscreenIndex]}
              className="w-full h-full object-contain"
              alt={allPhotos[fullscreenIndex].alt}
            />
          </div>

          {/* Next arrow - right */}
          <button
            onClick={handleNext}
            className="absolute right-8 text-white text-6xl hover:opacity-70 transition-opacity"
            style={{ zIndex: 101 }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
