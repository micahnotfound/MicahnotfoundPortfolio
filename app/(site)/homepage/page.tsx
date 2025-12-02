'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { Media } from '@/components/shared/Media'

export default function HomepagePage() {
  const [logoState, setLogoState] = useState<1 | 2 | 3>(1)
  const [touchStart, setTouchStart] = useState<{ y: number; time: number } | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [manualControl, setManualControl] = useState(false) // Track if user manually swiped

  // Handle scroll to shrink M logo (only if no manual control)
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate logo state based on scroll (only if not manually controlled)
  useEffect(() => {
    if (manualControl) return // Don't change state if user manually swiped

    const animationCompleteScroll = 100 // Very short distance for quick response
    const scrollProgress = Math.min(1, scrollY / animationCompleteScroll)

    // Start shrinking immediately from first scroll pixel
    if (scrollY <= 1) {
      setLogoState(1)
    } else if (scrollProgress < 0.5) {
      setLogoState(2)
    } else {
      setLogoState(3)
    }
  }, [scrollY, manualControl])

  // Handle swipe gestures - takes priority over scroll
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStart({
        y: e.touches[0].clientY,
        time: Date.now()
      })
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStart) return

      const touchEnd = e.changedTouches[0].clientY
      const distance = touchStart.y - touchEnd

      // Swipe up detection (distance > 50px)
      if (distance > 50) {
        // Swipe up - shrink to state 3
        setLogoState(3)
        setManualControl(true) // User took manual control
      } else if (distance < -50) {
        // Swipe down - expand back to state 1
        setLogoState(1)
        setManualControl(true) // User took manual control
      }

      setTouchStart(null)
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [touchStart])

  // Calculate button positioning and sizing based on logo state
  const getButtonsMarginTop = () => {
    if (logoState === 1) return '0px' // Centered with tall M
    if (logoState === 3) return '-150px' // Move up when M shrinks
    return '-75px' // Transition state
  }

  const getButtonHeight = () => {
    if (logoState === 1) return '36px' // Full height
    if (logoState === 3) return '0px' // Completely collapsed
    return '18px' // Transition state
  }

  const getButtonGap = () => {
    if (logoState === 1) return '16px' // Full gap (gap-4)
    if (logoState === 3) return '0px' // No gap
    return '8px' // Transition state
  }

  const getButtonOpacity = () => {
    if (logoState === 1) return 1
    if (logoState === 3) return 0
    return 0.5
  }

  // Calculate header height based on logo state
  const getHeaderHeight = () => {
    // Logo heights for each state
    const logoState1Height = 454
    const logoState2Height = 292
    const logoState3Height = 130

    let currentLogoHeight = logoState1Height
    if (logoState === 2) currentLogoHeight = logoState2Height
    if (logoState === 3) currentLogoHeight = logoState3Height

    // State 1: -100px
    // State 2: -40px
    // State 3: -15px (25px taller than previous 90px, so 115px)
    if (logoState === 1) {
      return currentLogoHeight - 100
    } else if (logoState === 2) {
      return currentLogoHeight - 40
    } else {
      return currentLogoHeight - 15
    }
  }

  // MoMA thumbnail image
  const momaThumbnail = {
    public_id: "v1756571817/BL_horizontal_0002_Layer-Comp-3_zfyhau",
    kind: "image" as const,
    alt: "MoMA thumbnail"
  }

  return (
    <>
      {/* Sticky Header with M Logo and Buttons - shrinks dynamically with M logo */}
      <div
        className="sticky top-0 w-full bg-[#D1D5DB] z-10 transition-all duration-500 ease-out"
        style={{
          height: `${getHeaderHeight()}px`,
          paddingTop: '12px',
          paddingBottom: '8px',
          paddingLeft: '32px',
          paddingRight: '32px'
        }}
      >
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-8 max-w-full">
            {/* M Logo - shrinks from state 1 to state 3 on scroll */}
            <Link href="/" className="flex-shrink-1 min-w-0">
              <MorphingHeaderLogo
                state={logoState}
                className="transition-all duration-500 ease-out"
                style={{
                  width: '100%',
                  maxWidth: '250px',
                  height: 'auto'
                }}
              />
            </Link>

            {/* About/Contact buttons - shrink vertically and fade out as M shrinks */}
            <div
              className="flex flex-col flex-shrink-0 transition-all duration-500 ease-out"
              style={{
                marginTop: getButtonsMarginTop(),
                gap: getButtonGap()
              }}
            >
              <Link
                href="/about"
                className="relative text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] whitespace-nowrap overflow-hidden"
                style={{
                  border: 'none',
                  padding: '0.25rem 1rem',
                  borderRadius: '39px',
                  height: getButtonHeight(),
                  opacity: getButtonOpacity(),
                  maskImage: logoState === 1 ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                  WebkitMaskImage: logoState === 1 ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                }}
              >
                about
              </Link>

              <Link
                href="/contact"
                className="relative text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] whitespace-nowrap overflow-hidden"
                style={{
                  border: 'none',
                  padding: '0.25rem 1rem',
                  borderRadius: '39px',
                  height: getButtonHeight(),
                  opacity: getButtonOpacity(),
                  maskImage: logoState === 1 ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)',
                  WebkitMaskImage: logoState === 1 ? 'none' : 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)'
                }}
              >
                contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MoMA Thumbnail Image - full width, auto height */}
      <div className="w-full">
        <Media
          media={momaThumbnail}
          className="w-full h-auto"
          alt={momaThumbnail.alt}
        />
      </div>
    </>
  )
}
