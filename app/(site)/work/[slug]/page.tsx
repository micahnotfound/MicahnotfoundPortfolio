'use client'

import { notFound } from 'next/navigation'
import { useRef, useEffect, useCallback } from 'react'
import { ProjectRail } from '@/components/composition/ProjectRail'
import { Gallery } from '@/components/composition/Gallery'
import { Media } from '@/components/shared/Media'
import { getProjectBySlug, getProjectNavigation } from '@/lib/content'

interface ProjectPageProps {
  params: { slug: string }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)
  const navigation = getProjectNavigation(params.slug)
  const railSyncRef = useRef<((progress: number) => void) | null>(null)
  const gallerySyncRef = useRef<((progress: number) => void) | null>(null)

  if (!project) {
    notFound()
  }

  // Collect all media from elements for the rail
  const allMedia = project.elements.flatMap(element => [
    ...element.detail,
    ...element.profile
  ])

  const handleRailScroll = useCallback((progress: number) => {
    if (gallerySyncRef.current) {
      gallerySyncRef.current(progress)
    }
  }, [])

  const handleGalleryScroll = useCallback((progress: number) => {
    if (railSyncRef.current) {
      railSyncRef.current(progress)
    }
  }, [])

  useEffect(() => {
    railSyncRef.current = handleRailScroll
    gallerySyncRef.current = handleGalleryScroll
  }, [handleRailScroll, handleGalleryScroll])

  return (
    <>
      <ProjectRail items={allMedia} onRailScroll={handleRailScroll} />
      <main className="min-h-screen pt-20">
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
            <h1 className="text-5xl md:text-7xl font-bold mb-4">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              {project.year} • {project.role}
            </p>
            {project.summary && (
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                {project.summary}
              </p>
            )}
          </div>
        </section>

        {/* Project Content */}
        <section className="py-16 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="hidden md:block">
              <Gallery items={allMedia} onScroll={handleGalleryScroll} />
            </div>
            
            <div className="md:hidden space-y-8">
              {allMedia.map((item, index) => (
                <div key={index} className="relative">
                  <Media
                    media={item}
                    className="w-full"
                    loading={index < 3 ? 'eager' : 'lazy'}
                    priority={index === 0}
                  />
                  {item.caption && (
                    <div className="mt-2 text-sm text-gray-600 text-center">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">About This Project</h2>
                {project.description && (
                  <div className="prose prose-lg">
                    {project.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-6">Project Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="font-semibold text-gray-900">Year</dt>
                    <dd className="text-gray-600">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-gray-900">Role</dt>
                    <dd className="text-gray-600">{project.role}</dd>
                  </div>
                  {project.client && (
                    <div>
                      <dt className="font-semibold text-gray-900">Client</dt>
                      <dd className="text-gray-600">{project.client}</dd>
                    </div>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <dt className="font-semibold text-gray-900">Technologies</dt>
                      <dd className="text-gray-600">
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
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
        </section>

        {/* Navigation */}
        <section className="py-16 px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
              {navigation.previous && (
                <a
                  href={`/work/${navigation.previous.slug}`}
                  className="group flex items-center space-x-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-500">Previous Project</p>
                    <p className="font-semibold">{navigation.previous.title}</p>
                  </div>
                </a>
              )}
              
              {navigation.next && (
                <a
                  href={`/work/${navigation.next.slug}`}
                  className="group flex items-center space-x-4 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Next Project</p>
                    <p className="font-semibold">{navigation.next.title}</p>
                  </div>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
