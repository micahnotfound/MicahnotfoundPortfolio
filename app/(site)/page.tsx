'use client'

import { useState, useEffect, useRef } from 'react'
import { ProjectCard } from '@/components/composition/ProjectCard'
import { ProjectCardSkeleton } from '@/components/composition/ProjectCardSkeleton'
import { getProjects } from '@/lib/content'
import { siteSettings } from '@/config/siteSettings'
import type { Project } from '@/types/content'

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const verticalScrollRef = useRef<HTMLDivElement>(null)
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

  // Sync vertical scrollbar with horizontal carousel
  useEffect(() => {
    const carousel = carouselRef.current
    const verticalScroll = verticalScrollRef.current

    if (!carousel || !verticalScroll) return

    // Update vertical scrollbar when carousel scrolls
    const handleCarouselScroll = () => {
      const scrollPercentage = carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth)
      verticalScroll.scrollTop = scrollPercentage * (verticalScroll.scrollHeight - verticalScroll.clientHeight)
    }

    // Update carousel when vertical scrollbar scrolls
    const handleVerticalScroll = () => {
      const scrollPercentage = verticalScroll.scrollTop / (verticalScroll.scrollHeight - verticalScroll.clientHeight)
      carousel.scrollLeft = scrollPercentage * (carousel.scrollWidth - carousel.clientWidth)
    }

    carousel.addEventListener('scroll', handleCarouselScroll)
    verticalScroll.addEventListener('scroll', handleVerticalScroll)

    return () => {
      carousel.removeEventListener('scroll', handleCarouselScroll)
      verticalScroll.removeEventListener('scroll', handleVerticalScroll)
    }
  }, [isLoading, projects])

  // Handle wheel events for horizontal scrolling - Homepage only
  useEffect(() => {
    console.log('Setting up wheel event listener for homepage, carousel ref:', carouselRef.current)

    const handleWheel = (e: WheelEvent) => {
      console.log('WHEEL EVENT CAPTURED!', {
        deltaY: e.deltaY,
        target: e.target,
        currentTarget: e.currentTarget,
        carouselRef: carouselRef.current
      })

      // Always prevent default to stop vertical scrolling on homepage
      e.preventDefault()
      e.stopPropagation()

      // Check if carousel ref exists
      if (!carouselRef.current) {
        console.log('ERROR: Carousel ref is null!')
        return
      }

      // Simple direct scroll without throttling for testing
      const scrollAmount = e.deltaY * 2 // Increase sensitivity for testing
      const newScrollLeft = carouselRef.current.scrollLeft + scrollAmount

      console.log('Scrolling:', {
        currentScrollLeft: carouselRef.current.scrollLeft,
        scrollAmount,
        newScrollLeft,
        maxScroll: carouselRef.current.scrollWidth - carouselRef.current.clientWidth
      })

      carouselRef.current.scrollLeft = newScrollLeft
    }

    // Add wheel listener to both carousel and document for full page coverage
    const carouselElement = carouselRef.current

    if (carouselElement) {
      console.log('Adding wheel listener to carousel element')
      carouselElement.addEventListener('wheel', handleWheel, { passive: false })
    }

    // Always add document listener for page-wide scrolling
    console.log('Adding wheel listener to document')
    document.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      console.log('Cleaning up wheel event listeners')
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
      <section className="flex-[1.725] flex flex-col overflow-hidden min-h-0 px-20 xl:px-[100px] relative">
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
                }

                const handleMouseLeave = () => {
                  if (hoverTimeoutRef.current) {
                    clearTimeout(hoverTimeoutRef.current)
                  }
                  hoverTimeoutRef.current = setTimeout(() => {
                    setHoveredIndex(null)
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
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                )
              })
            )}
          </div>
        </div>

        {/* Vertical scrollbar on the right that controls horizontal carousel */}
        <div
          ref={verticalScrollRef}
          className="absolute right-0 top-0 bottom-0 w-4 overflow-y-auto overflow-x-hidden"
        >
          <div style={{ height: '200vh' }} /> {/* Dummy content to create scrollbar */}
        </div>
      </section>
    </div>
  )
}
