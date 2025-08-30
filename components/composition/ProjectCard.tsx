'use client'

import Link from 'next/link'
import { Media } from '@/components/shared/Media'
import type { Project } from '@/types/content'

interface ProjectCardProps {
  project: Project
  className?: string
}

export function ProjectCard({ project, className = '' }: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
      tabIndex={0}
      aria-label={`View ${project.title} project - ${project.summary || 'Creative project'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.currentTarget.click()
        }
      }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Media
          media={project.cover}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          alt={`${project.title} project cover image`}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {project.title}
          </h3>
          <span className="text-sm text-gray-500 font-medium" aria-label={`Year: ${project.year}`}>
            {project.year}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 font-medium mb-2">
            {project.role}
          </p>
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  role="listitem"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full" role="listitem">
                  +{project.technologies.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
        
        {project.summary && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.summary}
          </p>
        )}
        
        <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
          <span>View Project</span>
          <svg
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}
