import { Metadata } from 'next'
import { ProjectCard } from '@/components/composition/ProjectCard'
import { getProjects } from '@/lib/content'
import { siteSettings } from '@/config/siteSettings'

export const metadata: Metadata = {
  title: siteSettings.siteTitle,
  description: 'Creative strategist specializing in immersive media and XR storytelling, with success in bringing complex cultural and environmental narratives to life.',
  keywords: ['creative strategist', 'AR', 'XR', 'immersive', 'storytelling', 'portfolio', 'digital art'],
  openGraph: {
    title: siteSettings.siteTitle,
    description: 'Creative strategist specializing in immersive media and XR storytelling.',
    type: 'website',
  },
}

export default function HomePage() {
  const projects = getProjects()

  return (
    <div className="flex flex-col">
      {/* Projects Horizontal Row Section - Fixed height, no vertical scroll */}
      <section className="flex-1 flex items-center px-6">
        <div className="container-custom w-full">
          {/* Single row with horizontal scroll - shows about 4 projects at once */}
          <div className="flex overflow-x-auto space-x-3 md:space-x-4 lg:space-x-5 pb-6 snap-x snap-mandatory">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
