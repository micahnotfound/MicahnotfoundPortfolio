'use client'

import { useState, useEffect } from 'react'
import { ProjectCard } from '@/components/composition/ProjectCard'
import { ProjectCardSkeleton } from '@/components/composition/ProjectCardSkeleton'
import { getProjects } from '@/lib/content'
import { siteSettings } from '@/config/siteSettings'
import type { Project } from '@/types/content'

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time for the cool skeleton effect
    const loadProjects = async () => {
      const projectsData = getProjects()
      
      // Add a minimum loading time to show the skeleton animation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setProjects(projectsData)
      setIsLoading(false)
    }

    loadProjects()
  }, [])

  // Generate skeleton placeholders
  const skeletonCount = 6 // Show 6 skeleton cards while loading

  return (
    <div className="flex flex-col">
      {/* Projects Horizontal Row Section - Fixed height, no vertical scroll */}
      <section className="flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto flex justify-center">
          {/* Single row with horizontal scroll - shows about 4 projects at once */}
          <div className="flex overflow-x-auto space-x-3 md:space-x-4 lg:space-x-5 pb-6 snap-x snap-mandatory ml-6">
            {isLoading ? (
              // Show skeleton loading animation
              Array.from({ length: skeletonCount }).map((_, index) => (
                <ProjectCardSkeleton key={`skeleton-${index}`} index={index} />
              ))
            ) : (
              // Show actual project cards with fade-in animation
              projects.map((project, index) => (
                <div
                  key={project.slug}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard project={project} index={index} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
