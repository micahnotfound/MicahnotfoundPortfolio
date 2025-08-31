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
    <main className="min-h-screen pt-16">
      {/* Projects Horizontal Row Section */}
      <section className="py-20 px-8">
        <div className="container-custom">
          {/* Single row with horizontal scroll - shows about 4 projects at once */}
          <div className="flex overflow-x-auto space-x-4 md:space-x-6 lg:space-x-8 pb-6 snap-x snap-mandatory">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
