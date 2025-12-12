'use client'

import { useState, useEffect } from 'react'
import { MobileProjectPage } from './MobileProjectPage'
import { ProjectPageClient } from '@/app/(site)/work/[slug]/ProjectPageClient'
import type { Project } from '@/types/content'

interface ProjectPageWrapperProps {
  project: Project
  allMedia: any[]
}

export function ProjectPageWrapper({ project, allMedia }: ProjectPageWrapperProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show nothing while detecting to avoid hydration issues
  if (isMobile === null) {
    return null
  }

  // Mobile rendering
  if (isMobile) {
    return <MobileProjectPage project={project} />
  }

  // Desktop rendering
  return <ProjectPageClient project={project} allMedia={allMedia} />
}
