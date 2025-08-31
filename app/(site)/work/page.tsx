import { Metadata } from 'next'
import { ProjectCard } from '@/components/composition/ProjectCard'
import { getWorkData } from '@/lib/content'
import { siteSettings } from '@/config/siteSettings'

export const metadata: Metadata = {
  title: `Work - ${siteSettings.siteTitle}`,
  description: 'A collection of projects showcasing creative work and collaborations in immersive media and XR storytelling.',
  keywords: ['work', 'projects', 'portfolio', 'AR', 'XR', 'immersive', 'storytelling'],
  openGraph: {
    title: `Work - ${siteSettings.siteTitle}`,
    description: 'A collection of projects showcasing creative work and collaborations.',
    type: 'website',
  },
}

export default function WorkPage() {
  const workData = getWorkData()

  return (
    <main className="pt-32 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-balance">
            {workData.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto text-pretty">
            {workData.description}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 px-8">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workData.projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>


    </main>
  )
}
