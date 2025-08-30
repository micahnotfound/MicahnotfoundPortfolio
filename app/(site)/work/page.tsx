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
    <main className="min-h-screen pt-20">
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

      {/* CTA Section */}
      <section className="py-16 px-8 bg-blue-50">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-balance">
            Let&apos;s Create Something Amazing
          </h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Interested in collaborating on an immersive project? 
            I&apos;d love to hear about your vision.
          </p>
          <a
            href={`mailto:${siteSettings.email}`}
            className="btn-primary inline-flex items-center"
          >
            Start a Conversation
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  )
}
