"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from './MorphingHeaderLogo'

interface ProjectHeaderProps {
  projectTitle: string
  projectDescription?: string
  onScroll?: (isScrolled: boolean) => void
}

export function ProjectHeader({ projectTitle, projectDescription, onScroll }: ProjectHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      setIsScrolled(scrolled)
      if (onScroll) {
        onScroll(scrolled)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [onScroll])

  // State 1: tall header with description, State 3: compact header with only title
  const logoState = isScrolled ? 3 : 1
  const showDescription = !isScrolled

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out overflow-hidden"
      style={{
        maxHeight: isScrolled ? '100px' : '280px' // State 3: 100px, State 1: 280px
      }}
    >
      <div className="w-full bg-[#D1D5DB]/90 backdrop-blur-sm h-full">
        <div className="w-full px-20 xl:px-[100px] h-full">
          <div
            className="flex justify-start items-start transition-all duration-500 ease-out h-full gap-12 lg:gap-20"
            style={{
              paddingTop: isScrolled ? '12px' : '52px',
              paddingBottom: '24px'
            }}
          >
            {/* Morphing Logo */}
            <Link href="/" className="flex-shrink-0">
              <MorphingHeaderLogo
                state={logoState}
                className="transition-all duration-500 ease-out"
                style={{
                  width: '250px',
                  height: 'auto'
                }}
              />
            </Link>

            {/* Project Title and Description - Aligned with logo left edge */}
            <div
              className="flex flex-col justify-start transition-all duration-500 ease-out overflow-hidden"
              style={{
                marginTop: isScrolled ? '0px' : '0px',
                opacity: 1,
                maxHeight: isScrolled ? '60px' : '300px'
              }}
            >
              {/* Project Title - Always visible */}
              <h1
                className="text-3xl font-body font-bold text-core-dark leading-none transition-all duration-500"
                style={{
                  fontSize: isScrolled ? '1.5rem' : '1.875rem',
                  marginBottom: showDescription ? '8px' : '0'
                }}
              >
                {projectTitle}
              </h1>

              {/* Project Description - Fades out in state 3 */}
              {projectDescription && (
                <p
                  className="text-base font-ui text-gray-600 leading-snug max-w-3xl transition-all duration-500"
                  style={{
                    opacity: showDescription ? 1 : 0,
                    maxHeight: showDescription ? '200px' : '0',
                    marginTop: showDescription ? '0' : '0'
                  }}
                >
                  {projectDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
