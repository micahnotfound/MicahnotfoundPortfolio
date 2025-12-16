'use client'

import { MobileProjectPage } from './MobileProjectPage'
import { ProjectPageClient } from '@/app/(site)/work/[slug]/ProjectPageClient'
import type { Project } from '@/types/content'

interface ProjectPageWrapperProps {
  project: Project
  allMedia: any[]
}

export function ProjectPageWrapper({ project, allMedia }: ProjectPageWrapperProps) {
  // Render BOTH mobile and desktop views
  // CSS media queries handle which one is visible
  // No JavaScript detection = no re-renders = no flash
  return (
    <div>
      {/* Mobile View - visible on mobile only */}
      <div className="block md:hidden">
        <MobileProjectPage project={project} />
      </div>

      {/* Desktop View - visible on desktop only */}
      <div className="hidden md:block">
        <ProjectPageClient project={project} allMedia={allMedia} />
      </div>
    </div>
  )
}
