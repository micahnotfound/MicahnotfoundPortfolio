'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { Media } from '@/components/shared/Media'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import type { Project } from '@/types/content'

interface MobileProjectPageProps {
  projectSlug?: string
  project?: Project
}

export function MobileProjectPage({ projectSlug, project: projectProp }: MobileProjectPageProps) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(projectProp || null)
  const [swipeProgress, setSwipeProgress] = useState(0) // 0 = video view, 1 = fully swiped to content
  const [isDragging, setIsDragging] = useState(false)
  const touchStartRef = useRef<{ y: number; time: number } | null>(null)
  const lastTouchY = useRef<number>(0)

  useEffect(() => {
    // If project already provided as prop, don't fetch
    if (projectProp) {
      setProject(projectProp)
      return
    }

    // Otherwise load project data from API
    if (projectSlug) {
      const loadProject = async () => {
        const response = await fetch(`/api/projects/${projectSlug}`)
        if (response.ok) {
          const data = await response.json()
          setProject(data)
        }
      }
      loadProject()
    }
  }, [projectSlug, projectProp])

  // Handle touch events for swipe - bidirectional (up to content, down to video)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = { y: touch.clientY, time: Date.now() }
      lastTouchY.current = touch.clientY
      setIsDragging(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.touches[0]
      const deltaY = touchStartRef.current.y - touch.clientY // Positive = swipe up, negative = swipe down
      lastTouchY.current = touch.clientY

      // Calculate progress (0 to 1)
      const maxSwipe = window.innerHeight
      const progress = Math.max(0, Math.min(1, swipeProgress + (deltaY / maxSwipe)))
      setSwipeProgress(progress)

      // Update touch start for continuous dragging
      touchStartRef.current.y = touch.clientY
    }

    const handleTouchEnd = () => {
      setIsDragging(false)

      // Auto-snap: if past 50% (1/2 way), snap all the way up. Otherwise snap back down
      if (swipeProgress > 0.5) {
        setSwipeProgress(1) // Snap to content view
      } else {
        setSwipeProgress(0) // Snap back to video view
      }

      touchStartRef.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [swipeProgress])

  if (!project) {
    return (
      <div className="h-screen w-full bg-[#D1D5DB] flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    )
  }

  const hasReel = !!project.reel
  const displayMedia = hasReel ? project.reel : (project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover)
  const fallbackImage = project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover

  // Get all images from elements (gallery, profile, hero)
  const galleryImages = project.elements?.reduce((acc, element) => {
    if (element.gallery) return [...acc, ...element.gallery]
    if (element.profile) return [...acc, ...element.profile]
    if (element.hero) return [...acc, ...element.hero]
    return acc
  }, [] as any[]) || []

  return (
    <div className="h-screen w-full relative bg-black" style={{ overflow: swipeProgress < 1 ? 'hidden' : 'visible' }}>
      {/* Fixed M Logo at top - white, small */}
      <div
        className="fixed left-0 w-full z-50 pointer-events-none"
        style={{
          top: '20px',
          paddingLeft: '30px',
          paddingRight: '30px'
        }}
      >
        <div className="flex items-center justify-start pointer-events-auto">
          <div
            className="flex-shrink-0 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <MorphingHeaderLogo
              state={3}
              className="transition-all duration-500 ease-out"
              style={{
                width: '205px',
                height: 'auto',
                filter: 'invert(1) brightness(2)' // White logo stays white on all backgrounds
              }}
            />
          </div>
        </div>
      </div>

      {/* Video section - slides up, full screen */}
      <div
        className="absolute top-0 left-0 w-full h-screen transition-transform z-10"
        style={{
          transform: `translateY(-${swipeProgress * 100}vh)`,
          transition: isDragging ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        <div className="w-full h-full bg-black">
          {displayMedia && (
            <CarouselMedia
              media={displayMedia}
              fallbackImage={hasReel ? fallbackImage : undefined}
              isVisible={true}
              isAdjacent={false}
              className="object-cover w-full h-full"
              alt={project.title}
              priority={true}
            />
          )}
        </div>

        {/* Swipe up indicator */}
        {swipeProgress < 0.1 && (
          <div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-70"
          >
            Swipe up for more
          </div>
        )}
      </div>

      {/* Content section - slides up from below, goes under M logo */}
      <div
        className="absolute left-0 w-full bg-[#D1D5DB] transition-transform"
        style={{
          top: '100vh',
          transform: `translateY(-${swipeProgress * 100}vh)`,
          transition: isDragging ? 'none' : 'transform 0.5s ease-out',
          height: 'auto',
          minHeight: '100vh',
          paddingTop: '115px', // Space for M logo at top
          overflowY: swipeProgress >= 1 ? 'auto' : 'hidden',
          overflowX: 'hidden'
        }}
      >
        <div className="pb-12">
          {/* Text content - right aligned with padding */}
          <div className="px-6 mb-8 text-right">
            {/* Project title */}
            <h1 className="font-ui text-2xl font-bold mb-3 text-black">{project.title}</h1>

            {/* Project metadata */}
            <div className="mb-4 text-black font-ui text-sm">
              <p><strong>Year:</strong> {project.year}</p>
              <p><strong>Role:</strong> {project.role}</p>
              <p><strong>Client:</strong> {project.client}</p>
            </div>

            {/* Description */}
            {project.description && (
              <div className="text-black leading-relaxed font-ui text-sm">
                {project.description}
              </div>
            )}
          </div>

          {/* Full width gallery - one image per row, scroll vertically */}
          {galleryImages.length > 0 && (
            <div className="flex flex-col gap-4 px-3">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="w-full overflow-hidden"
                  style={{
                    borderRadius: '24px'
                  }}
                >
                  <Media
                    media={image}
                    className="w-full h-auto"
                    alt={image.alt || `${project.title} gallery image`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
