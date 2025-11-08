'use client'

import { useState, useEffect, useRef } from 'react'
import { ProjectCard } from '@/components/composition/ProjectCard'
import { ProjectCardSkeleton } from '@/components/composition/ProjectCardSkeleton'
import { getProjects } from '@/lib/content'
import { siteSettings } from '@/config/siteSettings'
import type { Project } from '@/types/content'
import { useHover } from '@/contexts/HoverContext'

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { hoverArea, setHoverArea } = useHover() // Use context for hoverArea
  const carouselRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

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


  // Handle wheel events for horizontal scrolling - Homepage only
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Always prevent default to stop vertical scrolling on homepage
      e.preventDefault()
      e.stopPropagation()

      // Check if carousel ref exists
      if (!carouselRef.current) return

      // Convert vertical scroll to horizontal scroll
      const scrollAmount = e.deltaY * 2
      carouselRef.current.scrollLeft += scrollAmount
    }

    // Add wheel listener to both carousel and document for full page coverage
    const carouselElement = carouselRef.current

    if (carouselElement) {
      carouselElement.addEventListener('wheel', handleWheel, { passive: false })
    }

    // Always add document listener for page-wide scrolling
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      if (carouselElement) {
        carouselElement.removeEventListener('wheel', handleWheel)
      }
      document.removeEventListener('wheel', handleWheel)
    }
  }, [isLoading, projects]) // Re-run when data is loaded

  // Generate skeleton placeholders
  const skeletonCount = 6 // Show 6 skeleton cards while loading

  return (
    <div className="h-full flex flex-col">
      {/* Projects Horizontal Row Section - Takes remaining space between header and footer */}
      <section className="flex-1 flex flex-col overflow-hidden min-h-0 px-20 xl:px-[100px] relative mb-10">
        <div className="w-full max-w-[2000px] flex-1 flex flex-col justify-start min-h-0">
          {/* Single row with horizontal scroll - shows about 4 projects at once */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto flex-1 items-end pb-6 min-h-0 scrollbar-hide"
            style={{
              gap: '0.6rem', // 4x wider: 0.15rem * 4 = 0.6rem
            }}
          >
            {isLoading ? (
              // Show skeleton loading animation
              Array.from({ length: skeletonCount }).map((_, index) => (
                <ProjectCardSkeleton key={`skeleton-${index}`} index={index} />
              ))
            ) : (
              // Show actual project cards with fade-in animation, plus two placeholder projects
              [...projects, ...projects.slice(0, 2)].map((project, index) => {
                const totalCards = projects.length + 2
                const isHovered = hoveredIndex === index
                const someoneIsHovered = hoveredIndex !== null
                const distance = hoveredIndex !== null ? Math.abs(index - hoveredIndex) : 0

                const handleMouseEnter = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  setHoveredIndex(index)
                  setHoverArea('card') // Card state: hovering over photo card
                }

                const handleMouseLeave = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredIndex(null)
                    setHoverArea(null) // Return to home state
                  }, 50)
                }

                const handleTextboxAreaEnter = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  setHoveredIndex(index)
                  setHoverArea('textbox') // Textbox state: hovering over text box
                }

                const handleTextboxAreaLeave = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredIndex(null)
                    setHoverArea(null) // Return to home state
                  }, 50)
                }

                return (
                  <ProjectCard
                    key={`${project.slug}-${index}`}
                    project={project}
                    index={index}
                    isHovered={isHovered}
                    someoneIsHovered={someoneIsHovered}
                    distanceFromHovered={distance}
                    totalCards={totalCards}
                    hoverArea={hoverArea}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onTextboxAreaEnter={handleTextboxAreaEnter}
                    onTextboxAreaLeave={handleTextboxAreaLeave}
                  />
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
