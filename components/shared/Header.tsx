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
  const isHomepagePage = pathname === '/homepage'
  const isHeaderPage = pathname === '/header'
  const isSliderPage = pathname === '/slider'
  const isCompletePage = pathname === '/complete'
  const isProjectPage = pathname.startsWith('/work/') && pathname !== '/work'
  const { hoverArea, setHoverArea } = useHover()

  // Don't render this header on project detail pages, /homepage, /header, /slider, or /complete pages
  if (isProjectPage || isHomepagePage || isHeaderPage || isSliderPage || isCompletePage) {
    return null
  }

  // Get logo state based on current state
  // State 1 (home/header state): Extra tall logo with About/Contact buttons visible
  // State 3 (card/textbox state): Short logo, buttons hidden
  // State 2 has been removed to fix animation clipping issues
  const getLogoState = (): 1 | 2 | 3 => {
    if (!isHomePage) return 3 // Short on other pages
    if (hoverArea === null || hoverArea === 'header') return 1 // Home/header state: extra tall, buttons visible
    return 3 // Card or textbox state: short, buttons hidden
  }

  // Get header max-height based on logo state to physically shrink header
  const getHeaderMaxHeight = () => {
    const logoState = getLogoState()
    if (logoState === 1) return '380px' // Extra tall for state 1 (100px taller than before)
    return '100px' // Compact for state 3
  }

  return (
    <header
      className={`${isHomePage ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 transition-all duration-500 ease-out overflow-hidden`}
      style={{
        maxHeight: getHeaderMaxHeight()
      }}
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
      <div className="w-full bg-[#D1D5DB]/90 backdrop-blur-sm h-full">
        <div className="w-full px-20 xl:px-[100px] h-full">
          <div
            className="flex justify-start items-start pb-6 transition-all duration-500 ease-out h-full"
            style={{
              paddingTop: getLogoState() === 1 ? '52px' : '12px' // 40px lower in home state (52px vs 12px)
            }}
          >
            {/* Left Side: Logo, Separator, About/Contact */}
            {/* Use items-start to anchor logo to top, then center separator/buttons relative to logo */}
            <div className="flex items-start gap-12 lg:gap-20">
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

              {/* Vertical separator and buttons container - centered vertically with M */}
              <div
                className="flex items-center gap-8 lg:gap-16 transition-all duration-500 ease-out"
                style={{
                  // Center vertically relative to logo height
                  // State 1 logo is now ~454px tall (100px taller), State 3 is ~130px tall
                  marginTop: getLogoState() === 1 ? '165px' : '43px' // Centers in middle of logo
                }}
              >
                {/* 5px thick vertical separator - visible only in home state */}
                <div
                  className="flex-shrink-0 transition-all duration-500 ease-out overflow-hidden"
                  style={{
                    width: getLogoState() === 1 ? 'auto' : '0px',
                    height: getLogoState() === 1 ? 'auto' : '0px',
                    transform: getLogoState() === 1 ? 'translateY(0)' : 'translateY(-20px)'
                  }}
                >
                  <div className="w-[5px] h-24 bg-core-dark rounded-full"></div>
                </div>

                {/* About/Contact buttons - visible only in home state */}
                <div className="flex items-center gap-[57px]">
                  {/* About/Work button */}
                  <Link
                    href={isAboutPage ? "/" : "/about"}
                    className="relative text-center font-ui bg-core-dark text-white transition-all duration-500 ease-out text-[0.95em] overflow-hidden whitespace-nowrap"
                    style={{
                      border: 'none',
                      padding: getLogoState() === 1 ? '0.25rem 1rem' : '0',
                      borderRadius: '39px',
                      height: getLogoState() === 1 ? 'auto' : '0px',
                      transform: getLogoState() === 1 ? 'translateY(0)' : 'translateY(-20px)',
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
                      height: getLogoState() === 1 ? 'auto' : '0px',
                      transform: getLogoState() === 1 ? 'translateY(0)' : 'translateY(-20px)',
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
