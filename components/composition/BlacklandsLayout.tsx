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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Exhibition photos
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

  // Scroll calculations
  // Calculate when hero section has scrolled off screen
  const heroScrollOffPoint = typeof window !== 'undefined' ? window.innerHeight : 1000

  // Phase 1: Logo moves up from 52px to 12px (40px movement) - happens quickly in first 100px of scroll
  const logoMoveDistance = 40 // 52px - 12px
  const logoMoveScrollRange = 100
  const logoShouldBeFixed = scrollY >= logoMoveScrollRange // Logo becomes fixed once it reaches top

  // Phase 2: Logo morphs from State 0 to State 3 - starts after logo reaches top, continues until hero scrolls off
  const morphStartScroll = 100 // Start morphing once logo reaches top
  const morphEndScroll = heroScrollOffPoint - 100 // Finish morphing just before hero scrolls off
  const morphProgress = Math.min(1, Math.max(0, (scrollY - morphStartScroll) / (morphEndScroll - morphStartScroll)))

  // Determine logo state based on morph progress (smooth transition through states)
  const getLogoState = (): 0 | 1 | 2 | 3 => {
    if (morphProgress === 0) return 0
    if (morphProgress < 0.33) return 1
    if (morphProgress < 0.66) return 2
    return 3
  }

  // Text fade out - only starts AFTER logo finishes morphing to State 3
  const textFadeStartScroll = morphEndScroll // Start fading after morph is complete
  const textFadeEndScroll = heroScrollOffPoint - 50
  const textOpacity = Math.max(0, 1 - ((scrollY - textFadeStartScroll) / (textFadeEndScroll - textFadeStartScroll)))

  // Header background becomes visible ONLY after hero section has scrolled completely off screen
  const showHeaderBackground = scrollY >= heroScrollOffPoint

  return (
    <div className="min-h-screen bg-[#D1D5DB]">
      {/* Single Logo - transitions from absolute to fixed position */}
      <div
        className="z-50"
        style={{
          position: logoShouldBeFixed ? 'fixed' : 'absolute',
          top: logoShouldBeFixed ? '12px' : `${52 - (scrollY / logoMoveScrollRange) * logoMoveDistance}px`,
          left: 0,
          paddingLeft: '80px' // px-20
        }}
      >
        <div style={{
          width: '265px', // 250px + 15px extra to the right
          backgroundColor: '#D1D5DB', // Opaque background only behind logo
          paddingTop: logoShouldBeFixed ? '12px' : `${52 - (scrollY / logoMoveScrollRange) * logoMoveDistance}px`, // Extends to top of page
          paddingBottom: '16px',
          marginTop: logoShouldBeFixed ? '-12px' : `-${52 - (scrollY / logoMoveScrollRange) * logoMoveDistance}px` // Negative margin to offset padding
        }}>
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
      </div>

      {/* Hero section */}
      <div className="h-screen px-20 xl:px-[100px] pb-12 pt-[52px]">
        <div className="w-full h-full flex gap-10 items-end">
          {/* Left Side: Text only (logo is now separate) */}
          <div className="flex flex-col items-start flex-shrink-0 h-full" style={{ width: '250px' }}>
            {/* Spacer to push text to bottom */}
            <div style={{ flex: 1 }} />

            {/* Title and Description - fades out with gradient as you scroll */}
            <div
              className="space-y-4"
              style={{
                width: '250px',
                marginBottom: '0',
                maskImage: `linear-gradient(to bottom, transparent 0%, black ${20 + (textOpacity * 30)}%, black 100%)`,
                WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${20 + (textOpacity * 30)}%, black 100%)`,
                transition: 'mask-image 300ms ease-out, -webkit-mask-image 300ms ease-out'
              }}
            >
              <h1 className="text-5xl font-body font-bold text-core-dark leading-none">
                {projectTitle}
              </h1>

              <p className="text-base font-ui text-gray-700 leading-relaxed">
                {projectDescription}
              </p>
            </div>
          </div>

          {/* Right Side: Hero Image and Video */}
          <div className="flex gap-6 flex-grow h-full">
            {/* Hero Image */}
            <div
              className="overflow-hidden h-full"
              style={{
                flexBasis: '65%',
                borderRadius: '24px'
              }}
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

      {/* Exhibition photos section - scrolls under fixed header */}
      <div className="px-20 xl:px-[100px] pb-12 space-y-12" style={{ paddingTop: showHeaderBackground ? '120px' : '0' }}>
        {/* Row 1 */}
        <div className="flex gap-6">
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
        <div className="flex gap-6">
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

        {/* Row 3 */}
        <div className="flex gap-6">
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

        {/* Row 4 */}
        <div className="flex gap-6">
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
      </div>
    </div>
  )
}
