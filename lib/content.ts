import projectsManifest from '@/content/projects.json'
import homeData from '@/content/home.json'
import type { Project, HomeData, WorkData, ProjectData } from '@/types/content'

// Import individual project files
// import afrofuturismData from '@/content/afrofuturism.json'
import blacklandsData from '@/content/blacklands.json'
import dreamingWithArchivesData from '@/content/dreaming-with-the-archives.json'
import kinData from '@/content/kin.json'
import momaData from '@/content/moma.json'
import nycamData from '@/content/nycam.json'
import thereGoesNikkiData from '@/content/there-goes-nikki.json'

// Map of project files
const projectFiles: Record<string, any> = {
  // 'afrofuturism.json': afrofuturismData,
  'blacklands.json': blacklandsData,
  'dreaming-with-the-archives.json': dreamingWithArchivesData,
  'kin.json': kinData,
  'moma.json': momaData,
  'nycam.json': nycamData,
  'there-goes-nikki.json': thereGoesNikkiData,
}

export function getProjects(): Project[] {
  return projectsManifest.map((manifestEntry: any) => {
    const projectData = projectFiles[manifestEntry.file]
    if (!projectData) {
      throw new Error(`Project file not found: ${manifestEntry.file}`)
    }
    
    // Handle both array and single object formats
    const project = Array.isArray(projectData) ? projectData[0] : projectData
    
    return {
      ...project,
      // Ensure manifest metadata takes precedence
      slug: manifestEntry.slug,
      title: manifestEntry.title,
      year: manifestEntry.year,
      role: manifestEntry.role,
      client: manifestEntry.client,
      summary: manifestEntry.summary,
    }
  })
}

export function getProjectsSorted(): Project[] {
  return getProjects().sort((a, b) => a.title.localeCompare(b.title))
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find(project => project.slug === slug)
}

export function getProjectNavigation(currentSlug: string): {
  previous?: Project
  next?: Project
} {
  const projects = getProjectsSorted()
  const currentIndex = projects.findIndex(project => project.slug === currentSlug)
  
  if (currentIndex === -1) return {}
  
  const previous = currentIndex > 0 ? projects[currentIndex - 1] : undefined
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : undefined
  
  return { previous, next }
}

export function validateProjects(): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  const projects = getProjects()

  projects.forEach((project, projectIndex) => {
    // Check required fields
    if (!project.slug) {
      errors.push(`Project ${projectIndex}: Missing slug`)
    }
    if (!project.title) {
      errors.push(`Project ${projectIndex}: Missing title`)
    }
    if (!project.year) {
      errors.push(`Project ${projectIndex}: Missing year`)
    }
    if (!project.role) {
      errors.push(`Project ${projectIndex}: Missing role`)
    }
    if (!project.cover) {
      errors.push(`Project ${projectIndex}: Missing cover`)
    }
    if (!project.elements) {
      errors.push(`Project ${projectIndex}: Missing elements`)
    }
    if (!project.thumbnails) {
      errors.push(`Project ${projectIndex}: Missing thumbnails`)
    }

    // Check cover image
    if (project.cover && !project.cover.public_id) {
      errors.push(`Project ${projectIndex}: Cover missing public_id`)
    }

    // Check elements
    if (project.elements) {
      project.elements.forEach((element, elementIndex) => {
        if (!element.name) {
          errors.push(`Project ${projectIndex}, Element ${elementIndex}: Missing name`)
        }
        if (!element.detail || element.detail.length === 0) {
          errors.push(`Project ${projectIndex}, Element ${element.name}: Missing detail images`)
        }
        if (!element.profile || element.profile.length === 0) {
          errors.push(`Project ${projectIndex}, Element ${element.name}: Missing profile images`)
        }
      })
    }

    // Check thumbnails
    if (project.thumbnails) {
      project.thumbnails.forEach((thumbnail, thumbnailIndex) => {
        if (!thumbnail.public_id) {
          errors.push(`Project ${projectIndex}, Thumbnail ${thumbnailIndex}: Missing public_id`)
        }
      })
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

export function getHomeData(): HomeData {
  return homeData as HomeData
}

export function getFeaturedProjects() {
  const { featuredProjects } = getHomeData()
  const allProjects = getProjects()
  return featuredProjects.projects
    .map(slug => allProjects.find(project => project.slug === slug))
    .filter(Boolean) as Project[]
}

export function getWorkData(): WorkData {
  return {
    title: 'Work',
    description: 'A collection of projects showcasing creative work and collaborations.',
    projects: getProjectsSorted()
  }
}

export function getProjectData(slug: string): ProjectData | null {
  const project = getProjectBySlug(slug)
  if (!project) return null

  const navigation = getProjectNavigation(slug)
  
  return {
    project,
    navigation
  }
}
