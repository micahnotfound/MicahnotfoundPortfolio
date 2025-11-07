'use client'

import { useEffect, useState } from 'react'

interface MorphingLogoProps {
  hoverArea?: 'photo' | 'button' | null
  isHomePage?: boolean
}

export function MorphingLogo({ hoverArea = null, isHomePage = false }: MorphingLogoProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Define the tall version (initial state on homepage)
  const tallPath = `
    M10,140 L10,40 Q10,20 30,20 L30,140
    M50,140 L50,40 Q50,20 70,20 L70,140
    M90,140 L90,40 Q90,20 110,20 L110,140
  `

  // Define the short version (when cards are hovered or default on other pages)
  const shortPath = `
    M10,100 L10,40 Q10,20 30,20 L30,100
    M50,100 L50,40 Q50,20 70,20 L70,100
    M90,100 L90,40 Q90,20 110,20 L110,100
  `

  // Determine which path to use based on state
  const getCurrentPath = () => {
    if (!isHomePage) {
      return shortPath // Always short on other pages
    }

    if (hoverArea === 'photo' || hoverArea === null) {
      return tallPath // Tall when photo area hovered or no hover
    } else {
      return shortPath // Short when button area hovered
    }
  }

  const currentHeight = (isHomePage && (hoverArea === 'photo' || hoverArea === null)) ? 160 : 120

  return (
    <svg
      viewBox="0 0 120 160"
      className="transition-all duration-500 ease-out"
      style={{
        height: `${currentHeight}px`,
        width: 'auto'
      }}
    >
      <defs>
        <style>
          {`
            @media (prefers-reduced-motion: reduce) {
              .morphing-path {
                transition: none !important;
              }
            }
          `}
        </style>
      </defs>

      {/* Main path */}
      <path
        className="morphing-path"
        fill="none"
        stroke="#2A033F"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={getCurrentPath()}
        style={{
          transition: isClient ? 'd 500ms ease-out' : 'none'
        }}
      />

      {/* Inner path for double-line effect */}
      <path
        className="morphing-path"
        fill="none"
        stroke="#2A033F"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        d={getCurrentPath()}
        style={{
          transition: isClient ? 'd 500ms ease-out' : 'none'
        }}
      />
    </svg>
  )
}
