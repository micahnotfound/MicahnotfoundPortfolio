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
  hoverArea?: 'card' | 'textbox' | null
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
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonTextRef = useRef<HTMLDivElement>(null)
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 })
  const velocityRef = useRef({ x: 0, y: 0, speed: 0 })

  // Use thumbnail if available, otherwise fall back to cover image
  const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover

  const handleClick = () => {
    setIsLoading(true)
  }

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
      return '1 1 50%' // ALL cards shrink when textbox state
    } else if (hoverArea === 'card') {
      return '1 1 70%' // ALL cards grow when card state
    } else {
      return '1 1 60%' // Home state default size
    }
  }

  // Textbox height - GLOBAL effect, shrinks when card hovered, grows when textbox hovered
  const getTextboxHeight = () => {
    if (hoverArea === 'textbox') {
      return '280px' // ALL textboxes grow when textbox state
    } else if (hoverArea === 'card') {
      return '140px' // ALL textboxes shrink when card state
    } else if (hoverArea === null) {
      return '320px' // Extra tall in home state to compress carousel
    } else {
      return '210px' // Default size
    }
  }

  // Calculate textbox padding based on hover states - only for hovered card
  const getTextboxPadding = () => {
    if (someoneIsHovered && isHovered) {
      if (hoverArea === 'textbox') {
        return '11px calc(1rem + 7px) 160px calc(1rem + 7px)' // Large padding with extra 7px on sides
      } else {
        return '11px calc(1rem + 7px) 80px calc(1rem + 7px)' // Smaller padding with extra 7px on sides
      }
    }
    return '0'
  }

  // Calculate flex-grow with progressive falloff based on distance from hovered card
  const getFlexGrow = () => {
    if (!someoneIsHovered) {
      return 1.2 // Wider default - more breathing room for all cards
    }
    if (isHovered) {
      return 2.2 // Hovered card expands much wider for textbox visibility
    }

    // Progressive width falloff based on distance from hovered card
    if (distanceFromHovered === 1) {
      return 1.0
    }
    if (distanceFromHovered === 2) {
      return 0.8
    }
    if (distanceFromHovered === 3) {
      return 0.6
    }
    if (distanceFromHovered === 4) {
      return 0.45
    }
    if (distanceFromHovered === 5) {
      return 0.3
    }
    return 0.2 // Distance 6+
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
          border: 'none', // No border - invisible until image reveals
          backgroundColor: '#D1D5DB', // Light grey background
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
          if (onTextboxAreaEnter) onTextboxAreaEnter()
        }}
        onMouseLeave={() => {
          if (onTextboxAreaLeave) onTextboxAreaLeave()
        }}
        className={`block cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
        aria-label={`View ${project.title} project`}
        data-cursor-hover
      >
        <div
          className={`
            relative font-ui font-bold overflow-hidden
            bg-core-dark text-white
            ${isLoading ? 'animate-pulse' : ''}
          `}
          style={{
            border: 'none',
            width: someoneIsHovered && isHovered ? `${buttonWidth}px` : '0px',
            height: getTextboxHeight(),
            padding: getTextboxPadding(),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            // Left side is half-circle (height/2), right side is flat (0)
            borderRadius: someoneIsHovered && isHovered
              ? `${parseInt(getTextboxHeight()) / 2}px 0 0 ${parseInt(getTextboxHeight()) / 2}px`
              : '27px',
            transition: 'width 150ms linear, padding 150ms linear, height 300ms ease-out, border-radius 300ms ease-out'
          }}
        >
          {/* Loading Border Animation */}
          {isLoading && (
            <div className="absolute inset-0 border-[5px] border-core-dark animate-ping opacity-20" />
          )}

          {/* Textbox Content */}
          <div className="relative z-10 w-full">
            {/* Title */}
            <div
              ref={buttonTextRef}
              className="font-bold"
              style={{
                fontSize: '1.075em', // Increased by 2 points from 0.95em
                opacity: 1,
                marginBottom: someoneIsHovered && isHovered && hoverArea === 'textbox' && project.description ? '0.5rem' : '0',
                transition: 'margin-bottom 150ms linear'
              }}
            >
              {isLoading ? 'Loading...' : project.title}
            </div>

            {/* Description - appears only when textbox is fully expanded */}
            {project.description && someoneIsHovered && isHovered && hoverArea === 'textbox' && (
              <div
                className="font-normal"
                style={{
                  fontSize: '0.75em', // Smaller font for description
                  lineHeight: '1.4',
                  whiteSpace: 'normal',
                  animation: 'fadeIn 300ms ease-out forwards',
                  animationDelay: '150ms',
                  opacity: 0
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
