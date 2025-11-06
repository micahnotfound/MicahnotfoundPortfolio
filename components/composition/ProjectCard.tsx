'use client'

import Link from 'next/link'
import { useState } from 'react'
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

  // Use thumbnail if available, otherwise fall back to cover image
  const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover

  const handleClick = () => {
    setIsLoading(true)
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
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`block cursor-pointer mb-3 flex-1 min-h-0 overflow-hidden ${isLoading ? 'pointer-events-none' : ''}`}
        aria-label={`View ${project.title} project`}
      >
        <div className="w-full h-full relative">
          <Media
            media={thumbnailMedia}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ transform: 'scale(2)', transformOrigin: 'center' }}
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
      >
        <div
          className={`
            relative font-ui font-bold overflow-hidden
            border-[5px] border-core-dark bg-white text-core-dark hover:bg-core-dark hover:text-white
            ${isLoading ? 'animate-pulse' : ''}
          `}
          style={{
            width: someoneIsHovered && isHovered ? 'auto' : '0.5rem',
            height: '45px',
            padding: someoneIsHovered && isHovered ? '0 1rem' : '0',
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            transition: someoneIsHovered && isHovered
              ? 'all 600ms linear'
              : 'all 1000ms linear'
          }}
        >
          {/* Loading Border Animation */}
          {isLoading && (
            <div className="absolute inset-0 border-[5px] border-core-dark animate-ping opacity-20" />
          )}

          {/* Button Content */}
          <span
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
