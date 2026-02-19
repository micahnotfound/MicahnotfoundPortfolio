'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { Media } from '@/components/shared/Media'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { ProjectPageClient } from '@/app/(site)/work/[slug]/ProjectPageClient'
import type { Project } from '@/types/content'

export default function MomaMobilePage() {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [swipeProgress, setSwipeProgress] = useState(0) // 0 = video view, 1 = fully swiped to content
  const [isDragging, setIsDragging] = useState(false)
  const touchStartRef = useRef<{ y: number; time: number } | null>(null)
  const lastTouchY = useRef<number>(0)
  const [isMobile, setIsMobile] = useState(true) // Default to mobile (this IS a mobile page)

  // Detect if actually desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Load MoMA project data
    const loadProject = async () => {
      const response = await fetch('/api/projects/moma')
      if (response.ok) {
        const data = await response.json()
        setProject(data)
      }
    }
    loadProject()
  }, [])

  // Handle touch events for swipe - bidirectional (up to content, down to video)
  useEffect(() => {
    let lastMoveTime = Date.now()
    let velocity = 0

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchStartRef.current = { y: touch.clientY, time: Date.now() }
      lastTouchY.current = touch.clientY
      lastMoveTime = Date.now()
      velocity = 0
      setIsDragging(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return

      const touch = e.touches[0]
      const currentTime = Date.now()
      const timeDiff = currentTime - lastMoveTime
      const deltaY = lastTouchY.current - touch.clientY // Positive = swipe up, negative = swipe down

      // Calculate velocity (pixels per millisecond)
      if (timeDiff > 0) {
        velocity = deltaY / timeDiff
      }

      lastTouchY.current = touch.clientY
      lastMoveTime = currentTime

      // Calculate progress (0 to 1)
      const maxSwipe = window.innerHeight
      const newProgress = Math.max(0, Math.min(1, swipeProgress + (deltaY / maxSwipe)))
      setSwipeProgress(newProgress)
    }

    const handleTouchEnd = () => {
      if (!touchStartRef.current) return

      setIsDragging(false)

      // Calculate total distance and time from start
      const totalDistance = touchStartRef.current.y - lastTouchY.current
      const totalTime = Date.now() - touchStartRef.current.time

      // Velocity threshold for a "swipe" gesture
      const velocityThreshold = 0.3 // pixels per millisecond
      const isSwipeUp = velocity > velocityThreshold
      const isSwipeDown = velocity < -velocityThreshold

      // Distance threshold
      const distanceThreshold = 50
      const movedEnough = Math.abs(totalDistance) > distanceThreshold

      // Decision logic: Follow the swipe direction with velocity
      if (isSwipeUp || (movedEnough && totalDistance > 0)) {
        setSwipeProgress(1) // Snap to content view
      } else if (isSwipeDown || (movedEnough && totalDistance < 0)) {
        setSwipeProgress(0) // Snap back to video view
      } else {
        // No clear direction: snap to nearest
        if (swipeProgress > 0.5) {
          setSwipeProgress(1)
        } else {
          setSwipeProgress(0)
        }
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

  // If project not loaded yet, show loading (for both mobile and desktop)
  if (!project) {
    return (
      <div className="h-screen w-full bg-[#D1D5DB] flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    )
  }

  // If desktop, use the same desktop design as /work/moma
  if (isMobile === false) {
    // Build allMedia for ProjectPageClient
    const allMedia = project.elements.flatMap(element => [
      ...(element.detail || []),
      ...(element.profile || [])
    ])

    return <ProjectPageClient project={project} allMedia={allMedia} />
  }

  // Get gallery images for mobile
  const galleryImages = project.elements?.reduce((acc, element) => {
    if (element.gallery) return [...acc, ...element.gallery]
    if (element.profile) return [...acc, ...element.profile]
    if (element.hero) return [...acc, ...element.hero]
    return acc
  }, [] as any[]) || []

  const hasReel = !!project.reel
  const displayMedia = hasReel ? project.reel : (project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover)

  return (
    <div className="h-screen w-full relative bg-black" style={{ overflow: swipeProgress < 1 ? 'hidden' : 'visible' }}>
      {/* Fixed M Logo at top - white, small */}
      <div
        className="fixed left-0 w-full z-50 pointer-events-none"
        style={{
          top: '45px',
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
                height: 'auto'
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
          paddingTop: '150px', // Space for M logo at top plus extra margin
          overflowY: swipeProgress >= 1 ? 'auto' : 'hidden',
          overflowX: 'hidden'
        }}
      >
        <div className="pb-12">
          {/* Text content - left aligned with padding */}
          <div className="px-6 mb-8 text-left">
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
