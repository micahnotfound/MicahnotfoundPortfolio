'use client'

import { useCallback } from 'react'
import { Media } from '@/components/shared/Media'
import { MasonryGallery } from '@/components/composition/MasonryGallery'
import type { Project, MediaItem } from '@/types/content'

interface ProjectPageClientProps {
  project: Project
  allMedia: MediaItem[]
}

export function ProjectPageClient({ project, allMedia }: ProjectPageClientProps) {
  return (
    <main className="pt-32 min-h-screen">
      {/* Project Content - Masonry Layout */}
      <section className="py-16 px-8">
        <div className="container-custom">
          {/* Mobile/Tablet Layout: Full width for both sections */}
          <div className="lg:hidden space-y-12">
            {/* Project Information - Full width on mobile/tablet */}
            <div>
              {/* Project Title */}
              <h1 className="text-4xl md:text-5xl font-body font-bold mb-8 text-gray-900 leading-tight">
                {project.slug === "moma" ? (
                  <>
                    The<br />
                    Monuments<br />
                    Project
                  </>
                ) : (
                  project.title
                )}
              </h1>

              {/* About This Project */}
              {project.description && (
                <div className="prose prose-lg">
                  {project.description.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700 font-body leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Project Details */}
              {/* <h3 className="text-3xl font-body font-bold mb-6 text-gray-900 mt-8">Project Details</h3>
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
              </dl> */}
            </div>

            {/* Masonry Gallery - Full width on mobile/tablet */}
            <div>
              <MasonryGallery media={allMedia} />
            </div>
          </div>

          {/* Desktop Layout: Side-by-side with sticky sidebar */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {/* Masonry Gallery - Takes up 3 columns */}
            <div className="lg:col-span-3">
              <MasonryGallery media={allMedia} />
            </div>

            {/* Project Information (Sticky) - Takes up 1 column */}
            <div className="space-y-8">
              {/* Sticky Project Information Section */}
              <div className="lg:sticky lg:top-32">
                {/* Project Title */}
                <h1 className="text-4xl md:text-5xl font-body font-bold mb-8 text-gray-900 leading-tight">
                  {project.slug === "moma" ? (
                    <>
                      The<br />
                      Monuments<br />
                      Project
                    </>
                  ) : (
                    project.title
                  )}
                </h1>

                {/* About This Project */}
                {project.description && (
                  <div className="prose prose-lg">
                    {project.description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 text-gray-700 font-body leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {/* Project Details */}
                {/* <h3 className="text-3xl font-body font-bold mb-6 text-gray-900">Project Details</h3>
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
                </dl> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
