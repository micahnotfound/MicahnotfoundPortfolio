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
    <div className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start">
      <Link
        href={`/work/${project.slug}`}
        onClick={handleClick}
        className={`
          block group cursor-pointer
          ${isLoading ? 'pointer-events-none' : ''}
        `}
        aria-label={`View ${project.title} project`}
      >
        <div className="flex flex-col">
          {/* Mobile Layout: Title at top for odd indices */}
          {isTitleAtTop && (
            <div className="md:hidden mb-4">
              <div
                className={`
                  relative border-[7px] border-core-dark px-6 py-2 text-left font-ui font-bold text-core-dark 
                  group-hover:bg-core-dark group-hover:text-white transition-all duration-300 ease-out
                  w-fit inline-block
                  ${isLoading ? 'animate-pulse' : ''}
                `}
              >
                {/* Loading Border Animation */}
                {isLoading && (
                  <div className="absolute inset-0 border-[7px] border-core-dark animate-ping opacity-20" />
                )}
                
                {/* Button Content */}
                <span className="relative z-10 italic whitespace-pre-line">
                  {isLoading ? 'Loading...' : project.title}
                </span>
              </div>
            </div>
          )}

          {/* Thumbnail - Portrait aspect ratio with hover effect */}
          <div className="mb-6 overflow-hidden">
            <Media
              media={thumbnailMedia}
              className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
              alt={`${project.title} thumbnail`}
            />
          </div>

          {/* Desktop Layout: Title always at bottom */}
          <div className="hidden md:block">
            <div
              className={`
                relative border-[7px] border-core-dark px-6 py-2 text-left font-ui font-bold text-core-dark 
                group-hover:bg-core-dark group-hover:text-white transition-all duration-300 ease-out
                w-fit inline-block
                ${isLoading ? 'animate-pulse' : ''}
              `}
            >
              {/* Loading Border Animation */}
              {isLoading && (
                <div className="absolute inset-0 border-[7px] border-core-dark animate-ping opacity-20" />
              )}
              
              {/* Button Content */}
              <span className="relative z-10 italic whitespace-pre-line">
                {isLoading ? 'Loading...' : project.title}
              </span>
            </div>
          </div>

          {/* Mobile Layout: Title at bottom for even indices */}
          {!isTitleAtTop && (
            <div className="md:hidden">
              <div
                className={`
                  relative border-[7px] border-core-dark px-6 py-2 text-left font-ui font-bold text-core-dark 
                  group-hover:bg-core-dark group-hover:text-white transition-all duration-300 ease-out
                  w-fit inline-block
                  ${isLoading ? 'animate-pulse' : ''}
                `}
              >
                {/* Loading Border Animation */}
                {isLoading && (
                  <div className="absolute inset-0 border-[7px] border-core-dark animate-ping opacity-20" />
                )}
                
                {/* Button Content */}
                <span className="relative z-10 italic whitespace-pre-line">
                  {isLoading ? 'Loading...' : project.title}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
