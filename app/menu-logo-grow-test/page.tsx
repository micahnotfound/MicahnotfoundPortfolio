'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'

/**
 * MENU LOGO GROW TEST PAGE
 *
 * Testing CSS position: sticky with logo and menu components
 *
 * POTENTIAL ISSUES & GOTCHAS:
 *
 * 1. STICKY POSITIONING REQUIREMENTS:
 *    - Parent container must NOT have overflow: hidden/auto/scroll
 *    - Parent must have defined height (not auto)
 *    - Sticky element needs top/bottom/left/right value to know where to stick
 *    - Won't work inside flex/grid containers unless container has defined height
 *
 * 2. Z-INDEX STACKING:
 *    - Sticky elements create new stacking context
 *    - May conflict with other positioned elements (modals, dropdowns, etc.)
 *    - Need to ensure sticky header is above content but below modals
 *
 * 3. SCROLL BEHAVIOR:
 *    - Sticky starts as "relative" until scroll threshold is reached
 *    - Can cause layout shift if not properly sized
 *    - May interact weirdly with smooth scroll or scroll-snap
 *
 * 4. BROWSER COMPATIBILITY:
 *    - Well supported but may need -webkit- prefix for older Safari
 *    - Different behavior in different browsers for edge cases
 *
 * 5. PERFORMANCE:
 *    - Sticky positioning triggers repaints on scroll
 *    - Can impact performance with complex sticky elements
 *    - Use transform/opacity for animations instead of position changes
 *
 * 6. MORPHING LOGO ISSUES:
 *    - SVG morphing uses CSS transitions which may conflict with scroll
 *    - Fixed viewBox may cause clipping issues (see "broken arches effect")
 *    - State changes should be debounced to avoid jank
 *
 * 7. HEADER HEIGHT CHANGES:
 *    - Growing/shrinking header can cause content jump
 *    - Need smooth transitions to avoid jarring user experience
 *    - May need to account for header height in page layout
 *
 * 8. TRADEOFFS:
 *    - Sticky vs Fixed: Sticky is better for inline flow, but fixed gives more control
 *    - CSS-only vs JS scroll detection: CSS is more performant but less flexible
 *    - Transform animations vs position changes: Transform is GPU-accelerated
 */

export default function MenuLogoGrowTestPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isStuck, setIsStuck] = useState(false)

  // Track scroll position for state changes
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      // Consider "stuck" after scrolling 100px
      setIsStuck(currentScrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate logo state based on scroll
  // Start at State 1 (tall), shrink to State 3 (short) when stuck
  const getLogoState = (): 1 | 2 | 3 => {
    if (scrollY < 50) return 1 // Initial tall state
    if (scrollY < 100) return 2 // Transitioning
    return 3 // Compact state when stuck
  }

  return (
    <div className="min-h-screen bg-[#D1D5DB]">
      {/*
        STICKY HEADER
        - position: sticky allows it to scroll with content until it reaches top
        - top: 0 defines where it sticks
        - z-50 ensures it's above content
        - transition-all for smooth height changes
      */}
      <header
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm transition-all duration-500 ease-out"
        style={{
          // Dynamic height based on logo state
          height: getLogoState() === 1 ? '280px' : getLogoState() === 2 ? '180px' : '100px'
        }}
      >
        <div className="w-full px-20 xl:px-[100px] h-full">
          <div
            className="flex justify-between items-start h-full transition-all duration-500 ease-out"
            style={{
              // Adjust padding based on state
              paddingTop: getLogoState() === 1 ? '52px' : '12px'
            }}
          >
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <MorphingHeaderLogo
                  state={getLogoState()}
                  className="transition-all duration-500 ease-out"
                  style={{
                    width: '250px',
                    height: 'auto'
                  }}
                />
              </Link>
            </div>

            {/* Right: Menu buttons */}
            <nav
              className="flex items-center gap-6 transition-all duration-500 ease-out"
              style={{
                // Align with logo state
                marginTop: getLogoState() === 1 ? '0px' : '0px'
              }}
            >
              <Link
                href="/about"
                className="font-ui bg-core-dark text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-ui bg-core-dark text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>

        {/* Debug info */}
        <div className="absolute bottom-2 left-2 text-xs font-mono bg-black/50 text-white px-2 py-1 rounded">
          ScrollY: {scrollY}px | State: {getLogoState()} | Stuck: {isStuck ? 'Yes' : 'No'}
        </div>
      </header>

      {/* Main content - lots of scrollable content to test sticky behavior */}
      <main className="px-20 xl:px-[100px] py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl font-bold">Menu Logo Grow Test</h1>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="text-lg">
              Scroll down to see the sticky header behavior. The logo morphs from tall (State 1) to short (State 3) as you scroll.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>0-50px scroll: Logo State 1 (tall)</li>
              <li>50-100px scroll: Logo State 2 (medium)</li>
              <li>100px+ scroll: Logo State 3 (short, stuck to top)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold text-red-600">Known Issues & Gotchas</h2>

            <div className="bg-yellow-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">1. Parent Container Overflow</h3>
              <p>If any parent has overflow: hidden/auto/scroll, sticky won&apos;t work. This page has no such parent.</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">2. Height Changes Cause Layout Shift</h3>
              <p>When the header shrinks from 280px to 100px, content below may jump. Use smooth transitions to minimize this.</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">3. Z-Index Conflicts</h3>
              <p>Header is z-50. Make sure modals/dropdowns use higher z-index (z-[100]+).</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">4. Broken Arches Effect</h3>
              <p>If logo height is constrained with overflow:hidden, the M arches will be clipped. Avoid this by using natural state heights.</p>
            </div>

            <div className="bg-yellow-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">5. Performance on Scroll</h3>
              <p>Sticky positioning triggers repaints. Keep header simple to avoid jank.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Tradeoffs</h2>

            <div className="bg-blue-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">Sticky vs Fixed Position</h3>
              <ul className="list-disc list-inside ml-4">
                <li><strong>Sticky:</strong> Starts in flow, sticks when threshold reached. Better for inline headers.</li>
                <li><strong>Fixed:</strong> Always positioned relative to viewport. More predictable but needs margin-top on content.</li>
              </ul>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">CSS-only vs JavaScript Detection</h3>
              <ul className="list-disc list-inside ml-4">
                <li><strong>CSS-only:</strong> More performant, but limited control over state.</li>
                <li><strong>JS Detection:</strong> More flexible, but requires scroll event listeners (use passive: true).</li>
              </ul>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg space-y-2">
              <h3 className="font-bold">This Implementation</h3>
              <p>Uses sticky positioning with JS scroll detection for logo state changes. Combines best of both: performant sticky behavior with flexible state control.</p>
            </div>
          </section>

          {/* Dummy content for scrolling */}
          <section className="space-y-4">
            <h2 className="text-3xl font-bold">Scroll Test Content</h2>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-2">Section {i + 1}</h3>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
