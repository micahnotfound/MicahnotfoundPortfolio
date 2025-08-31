import { notFound } from 'next/navigation'
import { Media } from '@/components/shared/Media'
import { Gallery } from '@/components/composition/Gallery'
import { ProjectRail } from '@/components/composition/ProjectRail'
import { getProjectData } from '@/lib/content'
import type { Metadata } from 'next'
import { ProjectPageClient } from './ProjectPageClient'

interface ProjectPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const projectData = getProjectData(params.slug)
  
  if (!projectData) {
    return {
      title: 'Project Not Found',
    }
  }

  const { project } = projectData

  return {
    title: `${project.title} - ${project.year}`,
    description: project.summary || project.description,
    keywords: ['portfolio', 'project', 'creative', 'design', 'art'],
    openGraph: {
      title: `${project.title} - ${project.year}`,
      description: project.summary || project.description,
      type: 'website',
    },
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const projectData = getProjectData(params.slug)
  
  if (!projectData) {
    notFound()
  }

  const { project } = projectData

  // Flatten all media from elements
  const allMedia = project.elements.flatMap(element => [...element.detail, ...element.profile])

  return <ProjectPageClient project={project} allMedia={allMedia} />
}
