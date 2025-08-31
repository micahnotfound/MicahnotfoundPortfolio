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
      <div className="flex flex-col">
        {/* Date */}
        <div className="text-sm font-ui text-gray-600 mb-4">
          {project.year}
        </div>

        {/* Thumbnail - Portrait aspect ratio */}
        <div className="mb-6">
          <Media
            media={thumbnailMedia}
            className="w-full aspect-[3/4] object-cover"
            alt={`${project.title} thumbnail`}
          />
        </div>

        {/* Thick Square Border Button with Loading Animation */}
        <Link
          href={`/work/${project.slug}`}
          onClick={handleClick}
          className={`
            relative border-4 border-black px-6 py-4 text-center font-ui font-bold text-black 
            hover:bg-black hover:text-white transition-all duration-300 ease-out
            ${isLoading ? 'animate-pulse' : ''}
          `}
          aria-label={`View ${project.title} project`}
        >
          {/* Loading Border Animation */}
          {isLoading && (
            <div className="absolute inset-0 border-4 border-black animate-ping opacity-20" />
          )}
          
          {/* Button Content */}
          <span className="relative z-10">
            {isLoading ? 'Loading...' : project.title}
          </span>
        </Link>
      </div>
    </div>
  )
}
