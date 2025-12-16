import { Metadata } from 'next'
import { getProjectBySlug, getProjects } from '@/lib/content'
import { ProjectPageWrapper } from '@/components/composition/ProjectPageWrapper'
import { notFound } from 'next/navigation'

interface ProjectPageProps {
  params: { slug: string }
}

// Generate metadata for each project
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    }
  }

  // Define Open Graph images for each project
  const getProjectOGImage = (slug: string) => {
    switch (slug) {
      case 'kin':
        return 'https://res.cloudinary.com/dxmq5ewnv/image/upload/v1765922612/PreservationPark_Mocks_fp2i3e.png'
      case 'nycam':
        return 'https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680418/NYCAM_0002_Background_c2dfan.png'
      case 'dreaming-with-the-archives':
        return 'https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680423/BL_horizontal_0000_Layer-Comp-1_fdzxvy.png'
      case 'there-goes-nikki':
        return 'https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680399/BL_horizontal_0001_Layer-Comp-2_ii7g7m.png'
      case 'blacklands':
        return 'https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680397/BL_horizontal_0002_Layer-Comp-3_obhjfz.png'
      case 'moma':
        return 'https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680400/BL_horizontal_0003_Layer-Comp-4_rosizh.png'
      default:
        return 'https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680400/BL_horizontal_0003_Layer-Comp-4_rosizh.png'
    }
  }

  const ogImage = getProjectOGImage(params.slug)

  return {
    title: `${project.title} - Micah Milner`,
    description: project.summary || project.description || 'Creative project by Micah Milner',
    openGraph: {
      title: `${project.title} - Micah Milner`,
      description: project.summary || project.description || 'Creative project by Micah Milner',
      type: 'article',
      url: `https://micahmilner.com/work/${params.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${project.title} - Micah Milner`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} - Micah Milner`,
      description: project.summary || project.description || 'Creative project by Micah Milner',
      images: [ogImage],
    },
  }
}

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = getProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)
  
  if (!project) {
    notFound()
  }

  // Get all media for the project - safely handle optional properties
  const allMedia = project.elements.flatMap(element => [
    ...(element.detail || []),
    ...(element.profile || [])
  ])

  return <ProjectPageWrapper project={project} allMedia={allMedia} />
}
