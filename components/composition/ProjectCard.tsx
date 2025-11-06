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
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export function ProjectCard({ project, index = 0, isHovered = false, someoneIsHovered = false, distanceFromHovered = 0, totalCards = 8, onMouseEnter, onMouseLeave }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 }) // percentage
  const [entryPoint, setEntryPoint] = useState({ x: 50, y: 50 }) // Store entry point
  const [buttonWidth, setButtonWidth] = useState(0) // Store calculated width
  const cardRef = useRef<HTMLDivElement>(null)
  const buttonTextRef = useRef<HTMLSpanElement>(null)
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

  // Generate full card polygon
  const getFullCard = () => {
    return `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`
  }

  // Calculate flex-grow with progressive falloff based on distance from hovered card
  const getFlexGrow = () => {
    if (!someoneIsHovered) {
      return 1 // Equal distribution when nothing hovered
    }
    if (isHovered) {
      return 1.5 // Hovered card gets 1.5x
    }

    // Progressive width falloff based on distance from hovered card
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
      return 0.25
    }
    return 0.15 // Distance 6+
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

  // Handle mouse leave - will shrink back to entry point
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
        className={`block cursor-pointer mb-3 flex-1 min-h-0 overflow-hidden relative ${isLoading ? 'pointer-events-none' : ''}`}
        aria-label={`View ${project.title} project`}
        data-cursor-hover
        ref={cardRef}
      >
        {/* Dark blue background */}
        <div className="absolute inset-0 w-full h-full bg-core-dark" />

        {/* Image that grows from horizontal line at entry point */}
        <div
          className="absolute w-full h-full transition-all duration-700 ease-out"
          style={{
            clipPath: isHovered
              ? getFullCard()  // Expand to full card
              : `polygon(0% ${entryPoint.y}%, 100% ${entryPoint.y}%, 100% ${entryPoint.y}%, 0% ${entryPoint.y}%)`,  // Horizontal line at entry Y position
          }}
        >
          <Media
            media={thumbnailMedia}
            className="w-full h-full object-cover object-center"
            style={{ transform: 'scale(1.1)' }}
            alt={`${project.title} thumbnail`}
          />
        </div>
      </Link>

      {/* Title button below image - expands when card is hovered, but doesn't trigger hover itself */}
      <Link
        href={`/work/${project.slug}`}
        onClick={handleClick}
        className={`block cursor-pointer ${isLoading ? 'pointer-events-none' : ''}`}
        aria-label={`View ${project.title} project`}
        data-cursor-hover
      >
        <div
          className={`
            relative font-ui font-bold overflow-hidden
            border-[5px] border-core-dark bg-white text-core-dark hover:bg-core-dark hover:text-white
            ${isLoading ? 'animate-pulse' : ''}
          `}
          style={{
            width: someoneIsHovered && isHovered ? `${buttonWidth}px` : '8px',
            height: '65px',
            padding: someoneIsHovered && isHovered ? '4px 1rem 20px 1rem' : '0',
            display: 'flex',
            alignItems: 'flex-start',
            whiteSpace: 'nowrap',
            transition: 'width 150ms linear, padding 150ms linear'
          }}
        >
          {/* Loading Border Animation */}
          {isLoading && (
            <div className="absolute inset-0 border-[5px] border-core-dark animate-ping opacity-20" />
          )}

          {/* Button Content */}
          <span
            ref={buttonTextRef}
            className="relative z-10 text-[0.95em]"
            style={{
              opacity: 1
            }}
          >
            {isLoading ? 'Loading...' : project.title}
          </span>
        </div>
      </Link>
    </div>
  )
}
