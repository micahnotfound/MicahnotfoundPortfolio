'use client'

import { useCallback } from 'react'
import { Media } from '@/components/shared/Media'
import type { Project, MediaItem } from '@/types/content'

interface ProjectPageClientProps {
  project: Project
  allMedia: MediaItem[]
}

export function ProjectPageClient({ project, allMedia }: ProjectPageClientProps) {
  // Split media into two groups for the two sub-columns
  const midPoint = Math.ceil(allMedia.length / 2)
  const column1A = allMedia.slice(0, midPoint)
  const column1B = allMedia.slice(midPoint)

  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Media
            media={project.cover}
            className="w-full h-full object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-8">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-4">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl mb-6 font-body">
            {project.year} • {project.role}
          </p>
          {project.summary && (
            <p className="text-lg md:text-xl max-w-2xl mx-auto font-body">
              {project.summary}
            </p>
          )}
        </div>
      </section>

      {/* Project Content - Two Column Layout */}
      <section className="py-16 px-8">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Column 1: Content (Two Sub-columns) */}
            <div className="space-y-8">
              {/* Column 1A: Primary Project Images */}
              {column1A.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Project Images</h2>
                  <div className="space-y-4">
                    {column1A.map((item, index) => (
                      <div key={index} className="relative">
                        <Media
                          media={item}
                          className="w-full"
                          loading={index < 3 ? 'eager' : 'lazy'}
                          priority={index === 0}
                        />
                        {item.caption && (
                          <div className="mt-2 text-sm text-gray-600 font-body">
                            {item.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Column 1B: Additional Project Images */}
              {column1B.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Additional Views</h2>
                  <div className="space-y-4">
                    {column1B.map((item, index) => (
                      <div key={index} className="relative">
                        <Media
                          media={item}
                          className="w-full"
                          loading="lazy"
                        />
                        {item.caption && (
                          <div className="mt-2 text-sm text-gray-600 font-body">
                            {item.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fallback if no images */}
              {allMedia.length === 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-heading font-bold text-gray-900">Project Images</h2>
                  <p className="text-gray-600 font-body">No images available for this project.</p>
                </div>
              )}
            </div>

            {/* Column 2: Project Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-heading font-bold mb-6 text-gray-900">About This Project</h2>
                {project.description && (
                  <div className="prose prose-lg">
                    {project.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700 font-body leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-heading font-bold mb-6 text-gray-900">Project Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="font-semibold text-gray-900 font-ui">Year</dt>
                    <dd className="text-gray-600 font-body">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900 font-ui">Role</dt>
                    <dd className="text-gray-600 font-body">{project.role}</dd>
                  </div>
                  {project.client && (
                    <div>
                      <dt className="font-semibold text-gray-900 font-ui">Client</dt>
                      <dd className="text-gray-600 font-body">{project.client}</dd>
                    </div>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <dt className="font-semibold text-gray-900 font-ui">Technologies</dt>
                      <dd className="text-gray-600 font-body">
                        <div className="flex flex-wrap gap-2 mt-1">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <a
              href="/work"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 font-ui"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Work
            </a>

            <div className="flex space-x-4">
              <button className="inline-flex items-center text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200 font-ui">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <button className="inline-flex items-center text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200 font-ui">
                Next
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
