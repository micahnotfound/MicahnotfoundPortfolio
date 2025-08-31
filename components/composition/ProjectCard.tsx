'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Media } from '@/components/shared/Media'
import type { Project } from '@/types/content'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Use thumbnail if available, otherwise fall back to cover image
  const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover

  const handleClick = () => {
    setIsLoading(true)
    // The loading state will be cleared when the page navigation completes
  }

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
          {/* Date - Larger and Bold */}
          <div className="text-2xl font-ui font-bold text-gray-600 mb-4 group-hover:text-gray-800 transition-colors duration-200">
            {project.year}
          </div>

          {/* Thumbnail - Portrait aspect ratio with hover effect */}
          <div className="mb-6 overflow-hidden">
            <Media
              media={thumbnailMedia}
              className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
              alt={`${project.title} thumbnail`}
            />
          </div>

          {/* Thick Square Border Button - Full Width, Left Aligned */}
          <div
            className={`
              relative border-4 border-black px-6 py-4 text-left font-ui font-bold text-black 
              group-hover:bg-black group-hover:text-white transition-all duration-300 ease-out
              ${isLoading ? 'animate-pulse' : ''}
            `}
          >
            {/* Loading Border Animation */}
            {isLoading && (
              <div className="absolute inset-0 border-4 border-black animate-ping opacity-20" />
            )}
            
            {/* Button Content */}
            <span className="relative z-10">
              {isLoading ? 'Loading...' : project.title}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
