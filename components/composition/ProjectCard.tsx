'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Media } from '@/components/shared/Media'
import type { Project } from '@/types/content'

interface ProjectCardProps {
  project: Project
  index?: number // Add index prop for staggered layout
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Use thumbnail if available, otherwise fall back to cover image
  const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover

  const handleClick = () => {
    setIsLoading(true)
    // The loading state will be cleared when the page navigation completes
  }

  // Determine if this card should have title at top (odd indices) or bottom (even indices)
  const isTitleAtTop = index % 2 === 1

  return (
    <div className="flex-shrink-0 snap-start animate-fadeIn flex flex-col h-full" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Thumbnail - Portrait aspect ratio - scales with available height, maintaining aspect ratio */}
      <Link
        href={`/work/${project.slug}`}
        onClick={handleClick}
        className={`
          block cursor-pointer mb-3 flex-1 min-h-0
          ${isLoading ? 'pointer-events-none' : ''}
        `}
        aria-label={`View ${project.title} project`}
        style={{ width: '15rem' }} // Fixed width (240px / w-60)
      >
        <Media
          media={thumbnailMedia}
          className="w-full h-full object-cover object-top"
          alt={`${project.title} thumbnail`}
        />
      </Link>

      {/* Title button below image - fixed size, always visible */}
      <Link
        href={`/work/${project.slug}`}
        onClick={handleClick}
        className={`
          block cursor-pointer group flex-shrink-0
          ${isLoading ? 'pointer-events-none' : ''}
        `}
        aria-label={`View ${project.title} project`}
      >
        <div
          className={`
            relative border-[5px] border-core-dark px-4 py-1 text-left font-ui font-bold bg-core-dark text-white
            group-hover:bg-white group-hover:text-core-dark transition-all duration-300 ease-out
            inline-block text-[0.95em] whitespace-nowrap
            ${isLoading ? 'animate-pulse' : ''}
          `}
        >
          {/* Loading Border Animation */}
          {isLoading && (
            <div className="absolute inset-0 border-[5px] border-core-dark animate-ping opacity-20" />
          )}

          {/* Button Content */}
          <span className="relative z-10 italic">
            {isLoading ? 'Loading...' : project.title}
          </span>
        </div>
      </Link>
    </div>
  )
}
