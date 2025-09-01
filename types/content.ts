// Global site config
export interface SiteSettings {
  siteTitle: string
  email: string
  cloudName: string
  logoAssets: {
    logoWithText: string
    logoIconOnly: string
    textOnly: string
  }
}

// Cloudinary Video Player types
declare global {
  interface Window {
    cloudinary: {
      videoPlayer: (element: HTMLVideoElement, options: any) => any
    }
  }
}

// Media
export type MediaKind = 'image' | 'video'

export interface MediaItem {
  public_id: string
  kind: MediaKind
  alt?: string
  caption?: string
}

// Project
export interface ProjectElement {
  name: string
  detail: MediaItem[]
  profile: MediaItem[]
}

export interface Project {
  slug: string
  title: string
  year: string
  role: string
  client?: string
  summary?: string
  description?: string
  technologies?: string[]
  elements: ProjectElement[]
  thumbnails: MediaItem[]
  cover: MediaItem // Primary thumbnail for cards
}

// Page props (derivable)
export interface HomeData {
  hero: {
    title: string
    subtitle: string
    carousel: MediaItem[]
  }
  featuredProjects: {
    title: string
    description: string
    projects: string[] // Array of project slugs
  }
}

export interface WorkData {
  title: string
  description: string
  projects: Project[]
}

export interface ProjectData {
  project: Project
  navigation: {
    previous?: Project
    next?: Project
  }
}
