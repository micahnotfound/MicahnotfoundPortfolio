'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Media } from '@/components/shared/Media'
import type { Project } from '@/types/content'

interface ProjectCardProps {
  project: Project
  index?: number
  isHovered?: boolean
  someoneIsHovered?: boolean
  distanceFromHovered?: number
  totalCards?: number
  hoverArea?: 'header' | 'card' | 'textbox' | null
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onTextboxAreaEnter?: () => void
  onTextboxAreaLeave?: () => void
}

export function ProjectCard({ project, index = 0, isHovered = false, someoneIsHovered = false, distanceFromHovered = 0, totalCards = 8, hoverArea = null, onMouseEnter, onMouseLeave, onTextboxAreaEnter, onTextboxAreaLeave }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }) // percentage
  const [entryPoint, setEntryPoint] = useState({ x: 50, y: 50 }) // Store entry point
  const [buttonWidth, setButtonWidth] = useState(0) // Store calculated width
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [isTextboxHovered, setIsTextboxHovered] = useState(false) // LOCAL state for textbox hover
  const [showText, setShowText] = useState(false) // Control text fade-in with delay
  const [showDescription, setShowDescription] = useState(false) // Control description fade separately
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonTextRef = useRef<HTMLDivElement>(null)
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 })
  const velocityRef = useRef({ x: 0, y: 0, speed: 0 })
  const textFadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const descriptionFadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Use thumbnail if available, otherwise fall back to cover image
  const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover

  const handleClick = () => {
    setIsLoading(true)
  }

  // Track window width for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle text fade-in with delay when card is hovered
  useEffect(() => {
    if (someoneIsHovered && isHovered) {
      // Clear any existing timeouts
      if (textFadeTimeoutRef.current) {
        clearTimeout(textFadeTimeoutRef.current)
      }
      if (descriptionFadeTimeoutRef.current) {
        clearTimeout(descriptionFadeTimeoutRef.current)
      }

      // Start with text hidden, then fade in after short delay
      setShowText(false)
      setShowDescription(false)

      textFadeTimeoutRef.current = setTimeout(() => {
        setShowText(true)
      }, 50) // Small delay before starting title fade

      // Description fades in slower and later (after textbox is hovered)
    } else {
      // Immediately hide text when not hovered
      if (textFadeTimeoutRef.current) {
        clearTimeout(textFadeTimeoutRef.current)
      }
      if (descriptionFadeTimeoutRef.current) {
        clearTimeout(descriptionFadeTimeoutRef.current)
      }
      setShowText(false)
      setShowDescription(false)
    }

    return () => {
      if (textFadeTimeoutRef.current) {
        clearTimeout(textFadeTimeoutRef.current)
      }
      if (descriptionFadeTimeoutRef.current) {
        clearTimeout(descriptionFadeTimeoutRef.current)
      }
    }
  }, [someoneIsHovered, isHovered])

  // Handle description fade-in when textbox is hovered
  useEffect(() => {
    if (isTextboxHovered) {
      // Clear any existing timeout
      if (descriptionFadeTimeoutRef.current) {
        clearTimeout(descriptionFadeTimeoutRef.current)
      }

      // Start description fade after delay
      setShowDescription(false)
      descriptionFadeTimeoutRef.current = setTimeout(() => {
        setShowDescription(true)
      }, 200) // Delay before description starts fading
    } else {
      // Hide description when textbox not hovered
      if (descriptionFadeTimeoutRef.current) {
        clearTimeout(descriptionFadeTimeoutRef.current)
      }
      setShowDescription(false)
    }

    return () => {
      if (descriptionFadeTimeoutRef.current) {
        clearTimeout(descriptionFadeTimeoutRef.current)
      }
    }
  }, [isTextboxHovered])

  // Calculate button width to match card width with ResizeObserver
  useEffect(() => {
    if (!cardRef.current) return

    const updateWidth = () => {
      if (cardRef.current) {
        const cardWidth = cardRef.current.offsetWidth
        setButtonWidth(cardWidth)
      }
    }

    // Initial measurement
    updateWidth()

    // Watch for size changes
    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(cardRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [project.title])

  // Generate full card as circle covering entire area
  const getFullCard = () => {
    return `circle(100% at 50% 50%)`
  }

  // Generate small circle at entry point
  const getCircleAtEntry = (x: number, y: number) => {
    return `circle(0% at ${x}% ${y}%)`
  }

  // Calculate image flex - GLOBAL effect based on which state is active
  const getImageFlex = () => {
    if (hoverArea === 'textbox') {
      return '1 1 85%' // ALL cards when textbox state
    } else if (hoverArea === 'card') {
      return '1 1 98.5%' // ALL cards grow EXTREMELY tall when card state - fill almost entire screen
    } else {
      return '1 1 97%' // Home state: photos VERY tall by default, textboxes tiny
    }
  }

  // Textbox height - Always visible at 80px, grows when textbox is hovered
  const getTextboxHeight = () => {
    if (isTextboxHovered) {
      return '220px' // THIS textbox is hovered: grow tall for description (20px taller)
    } else {
      return '80px' // Always visible at 80px height (20px taller)
    }
  }

  // Calculate border-radius for pill shape on right side
  const getBorderRadius = () => {
    const height = isTextboxHovered ? 220 : 80
    const radius = height / 2 // Half the height for perfect pill shape
    return `0 ${radius}px ${radius}px 0` // Only round right side
  }

  // Calculate textbox padding - more margin for better readability
  const getTextboxPadding = () => {
    const leftPadding = '16px' // Comfortable left margin
    const rightPadding = '70px' // Extra wide right margin for pill-shaped bevel (40px + 30px)

    if (someoneIsHovered && isHovered) {
      if (isTextboxHovered) {
        // THIS textbox is hovered: comfortable padding for description
        return `16px ${rightPadding} 16px ${leftPadding}`
      } else {
        // Card state (textbox showing but not hovered): comfortable padding
        return `12px ${rightPadding} 12px ${leftPadding}`
      }
    }
    // Not hovered: comfortable padding for white outline state
    return `10px ${rightPadding} 10px ${leftPadding}`
  }

  // Calculate flex-grow with progressive falloff - targeting ~550px for active card
  const getFlexGrow = () => {
    if (!someoneIsHovered) {
      return 1.2 // Wider default - more breathing room for all cards
    }

    // Active card: Use smaller flex-grow to target ~550px width
    if (isHovered) {
      return 2.0 // Reduced from 3.5 to make active card thinner (~550px)
    }

    // On screens < 500px, shrink non-active cards more aggressively
    if (windowWidth < 500) {
      if (distanceFromHovered === 1) return 0.25
      if (distanceFromHovered === 2) return 0.15
      return 0.08 // Even smaller for furthest cards
    }

    // Progressive width falloff - make furthest cards even smaller
    if (distanceFromHovered === 1) {
      return 0.9
    }
    if (distanceFromHovered === 2) {
      return 0.7
    }
    if (distanceFromHovered === 3) {
      return 0.5
    }
    if (distanceFromHovered === 4) {
      return 0.35
    }
    if (distanceFromHovered === 5) {
      return 0.2
    }
    return 0.12 // Even smaller for distance 6+
  }

  // Track mouse position and calculate velocity
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Calculate velocity
    const now = Date.now()
    const deltaTime = now - lastMousePosRef.current.time

    if (deltaTime > 0) {
      const vx = (e.clientX - lastMousePosRef.current.x) / deltaTime
      const vy = (e.clientY - lastMousePosRef.current.y) / deltaTime
      const speed = Math.sqrt(vx * vx + vy * vy)

      velocityRef.current = { x: vx, y: vy, speed }
    }

    lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now }
    setMousePos({ x, y })
  }

  // Handle mouse enter - store entry point
  const handleEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Store entry point for shrinking back to
    setEntryPoint({ x, y })

    if (onMouseEnter) onMouseEnter()
  }

  // Handle mouse leave
  const handleLeave = () => {
    if (onMouseLeave) onMouseLeave()
  }

  return (
    <div
      className="animate-fadeIn flex flex-col h-full transition-all duration-500 ease-out"
      style={{
        animationDelay: `${index * 100}ms`,
        flexGrow: getFlexGrow(),
        flexShrink: 1,
        flexBasis: 0,
        minWidth: 0
      }}
    >
      <Link
        href={`/work/${project.slug}`}
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={handleMouseMove}
        className={`block cursor-pointer mb-3 overflow-hidden relative ${isLoading ? 'pointer-events-none' : ''}`}
        style={{
          flex: getImageFlex(),
          minHeight: 0,
          transition: 'flex 300ms ease-out',
          borderRadius: '200px', // Pill shape - rounded all sides
          border: 'none', // No border
          backgroundColor: '#D1D5DB', // Grey background - same as page background
        }}
        aria-label={`View ${project.title} project`}
        data-cursor-hover
        ref={cardRef}
      >

        {/* Image that reveals from circle at mouse entry point */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            borderRadius: '200px', // Match parent border radius - pill shape
            clipPath: isHovered
              ? getFullCard()  // Expand to full circle
              : getCircleAtEntry(entryPoint.x, entryPoint.y),  // Small circle at entry point
            transition: isHovered
              ? 'clip-path 700ms ease-out' // Fast expand
              : 'clip-path 1400ms ease-out', // Slow shrink (2x slower)
          }}
        >
          <Media
            media={thumbnailMedia}
            className="w-full h-full object-cover object-center"
            alt={`${project.title} thumbnail`}
          />
        </div>
      </Link>

      {/* Title textbox below image - expands when card is hovered */}
      <Link
        href={`/work/${project.slug}`}
        onClick={handleClick}
        onMouseEnter={(e) => {
          // Set entry point to bottom (100%) when entering textbox area
          setEntryPoint({ x: 50, y: 100 })
          setIsTextboxHovered(true) // Set LOCAL state for THIS textbox
          if (onTextboxAreaEnter) onTextboxAreaEnter()
        }}
        onMouseLeave={() => {
          setIsTextboxHovered(false) // Clear LOCAL state
          if (onTextboxAreaLeave) onTextboxAreaLeave()
        }}
        className={`block cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
        aria-label={`View ${project.title} project`}
        data-cursor-hover
      >
        <div
          className={`
            relative font-ui font-bold overflow-hidden
            ${isLoading ? 'animate-pulse' : ''}
          `}
          style={{
            backgroundColor: (someoneIsHovered && isHovered) ? '#000000' : '#D1D5DB', // Black when active, background gray when inactive
            color: (someoneIsHovered && isHovered) ? '#ffffff' : '#D1D5DB', // White text when active, gray text when inactive (invisible)
            border: '3px solid #D1D5DB', // Border color matches background
            width: (someoneIsHovered && isHovered) ? `${buttonWidth}px` : `${buttonWidth}px`,
            height: getTextboxHeight(),
            padding: getTextboxPadding(),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            // Pill shape on right side - rounded based on height
            borderRadius: getBorderRadius(),
            transition: 'all 300ms ease-out' // Unified transition - no hitch
          }}
        >
          {/* Loading Border Animation */}
          {isLoading && (
            <div className="absolute inset-0 border-[5px] border-core-dark animate-ping opacity-20" />
          )}

          {/* Textbox Content */}
          <div
            className="relative z-10"
            style={{
              width: '100%',
              opacity: showText ? 1 : 0,
              transition: 'opacity 1000ms ease-out' // 1 second fade-in
            }}
          >
            {/* Title */}
            <div
              ref={buttonTextRef}
              className="font-bold"
              style={{
                fontSize: '1.075em',
                marginBottom: someoneIsHovered && isHovered && isTextboxHovered && project.description ? '0.5rem' : '0',
                transition: 'margin-bottom 150ms linear',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                width: '100%'
              }}
            >
              {isLoading ? 'Loading...' : project.title}
            </div>

            {/* Description - appears only when THIS textbox is hovered */}
            {project.description && someoneIsHovered && isHovered && isTextboxHovered && (
              <div
                className="font-normal"
                style={{
                  fontSize: '0.75em',
                  lineHeight: '1.4',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  width: '100%',
                  opacity: showDescription ? 1 : 0,
                  transition: 'opacity 1500ms ease-out', // Slower fade-in for description (1.5 seconds)
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 5,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis'
                }}
              >
                {project.description}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
