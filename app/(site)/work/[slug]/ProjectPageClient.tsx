'use client'

import { useCallback } from 'react'
import { Media } from '@/components/shared/Media'
import type { Project, MediaItem } from '@/types/content'

interface ProjectPageClientProps {
  project: Project
  allMedia: MediaItem[]
}

export function ProjectPageClient({ project, allMedia }: ProjectPageClientProps) {
  // Distribute images evenly across two columns
  const column1 = allMedia.filter((_, index) => index % 3 === 0)
  const column2 = allMedia.filter((_, index) => index % 3 === 1)

  return (
    <main className="pt-32">
      {/* Project Content - Three Column Layout */}
      <section className="py-16 px-8">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-16">
            {/* Column 1: Project Images */}
            <div className="space-y-6">
              {column1.length > 0 ? (
                <div className="space-y-4">
                  {column1.map((item: any, index: number) => (
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
              ) : (
                <p className="text-gray-600 font-body">No images available for this project.</p>
              )}
            </div>

            {/* Column 2: Project Images */}
            <div className="space-y-6">
              {column2.length > 0 ? (
                <div className="space-y-4">
                  {column2.map((item: any, index: number) => (
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
              ) : (
                <p className="text-gray-600 font-body">No additional images available.</p>
              )}
            </div>

            {/* Column 3: Project Information (Sticky) */}
            <div className="space-y-8">
              {/* Sticky About This Project Section */}
              <div className="lg:sticky lg:top-32">
                <h2 className="text-3xl font-body font-bold mb-6 text-gray-900">About This Project</h2>
                {project.description && (
                  <div className="prose prose-lg">
                    {project.description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 text-gray-700 font-body leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

<h3 className="text-3xl font-body font-bold mb-6 text-gray-900">Project Details</h3>
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


    </main>
  )
}
