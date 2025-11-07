"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteSettings } from '@/config/siteSettings'
import { buildLogoUrl } from '@/lib/cloudinary'
import { MorphingHeaderLogo } from './MorphingHeaderLogo'
import { useHover } from '@/contexts/HoverContext'

export function Header() {
  const pathname = usePathname()
  const isAboutPage = pathname === '/about'
  const isHomePage = pathname === '/'
  const { hoverArea, setHoverArea } = useHover()

  // Get logo state based on current state
  // State 1 (home state): Extra tall logo with About/Contact buttons visible
  // State 2 (header hover): Medium tall logo
  // State 3 (card/textbox state): Short logo, buttons hidden
  const getLogoState = (): 1 | 2 | 3 => {
    if (!isHomePage) return 3 // Short on other pages
    if (hoverArea === null) return 1 // Home state: extra tall, buttons visible
    if (hoverArea === 'header') return 2 // Header hover: medium tall
    return 3 // Card or textbox state: short, buttons hidden
  }

  return (
    <header
      className={`${isHomePage ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 transition-all duration-500 ease-out`}
      onMouseEnter={() => {
        if (isHomePage) {
          setHoverArea('header')
        }
      }}
      onMouseLeave={() => {
        if (isHomePage) {
          setHoverArea(null) // Return to home state when leaving header
        }
      }}
    >
      {/* Full-width hover area background */}
      <div className="w-full bg-[#D1D5DB]/90 backdrop-blur-sm">
        <div className="w-full max-w-[2000px] mx-auto px-20 xl:px-[100px]">
          <div className="flex justify-between items-start pt-12 pb-6 transition-all duration-500 ease-out">
            {/* Left Side: Logo, Separator, About/Contact */}
            <div className="flex items-start gap-8 lg:gap-16">
              {/* Morphing Logo - anchored to top */}
              <Link href="/" className="flex-shrink-0">
                <MorphingHeaderLogo
                  state={getLogoState()}
                  className="transition-all duration-500 ease-out"
                  style={{
                    width: '250px', // Constant width
                    height: 'auto' // Height morphs based on state
                  }}
                />
              </Link>

              {/* Vertical separator and buttons container */}
              <div className="flex items-start gap-8 lg:gap-16">
                {/* 5px thick vertical separator - visible only in home state */}
                <div
                  className="flex-shrink-0 transition-opacity duration-500 ease-out"
                  style={{
                    opacity: getLogoState() === 1 ? 1 : 0,
                    width: getLogoState() === 1 ? 'auto' : '0px',
                    overflow: 'hidden'
                  }}
                >
                  <div className="w-[5px] h-24 bg-core-dark rounded-full"></div>
                </div>

                {/* About/Contact buttons - visible only in home state */}
                <div className="flex items-start gap-[57px]">
                  {/* About/Work button */}
                  <Link
                    href={isAboutPage ? "/" : "/about"}
                    className="relative text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] overflow-hidden whitespace-nowrap"
                    style={{
                      border: 'none',
                      padding: getLogoState() === 1 ? '0.25rem 1rem' : '0',
                      borderRadius: '39px',
                      opacity: getLogoState() === 1 ? 1 : 0,
                      pointerEvents: getLogoState() === 1 ? 'auto' : 'none'
                    }}
                    data-cursor-hover
                  >
                    {isAboutPage ? "work" : "about"}
                  </Link>

                  {/* Contact button */}
                  <Link
                    href="/contact"
                    className="relative text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] overflow-hidden whitespace-nowrap"
                    style={{
                      border: 'none',
                      padding: getLogoState() === 1 ? '0.25rem 1rem' : '0',
                      borderRadius: '39px',
                      opacity: getLogoState() === 1 ? 1 : 0,
                      pointerEvents: getLogoState() === 1 ? 'auto' : 'none'
                    }}
                    data-cursor-hover
                  >
                    contact
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
