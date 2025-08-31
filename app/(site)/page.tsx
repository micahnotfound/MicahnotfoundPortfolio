import { Metadata } from 'next'
import { Media } from '@/components/shared/Media'
import { getProjects } from '@/lib/content'
import { siteSettings } from '@/config/siteSettings'
import Link from 'next/link'

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
          <div className="flex overflow-x-auto space-x-8 pb-6 snap-x snap-mandatory">
            {projects.map((project, index) => {
              // Use thumbnail if available, otherwise fall back to cover image
              const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
                ? project.thumbnails[0]
                : project.cover

              return (
                <div key={project.slug} className="flex-shrink-0 w-80 snap-start">
                  <div className="flex flex-col">
                    {/* Date */}
                    <div className="text-sm font-ui text-gray-600 mb-4">
                      {project.year}
                    </div>

                    {/* Thumbnail */}
                    <div className="mb-6">
                      <Media
                        media={thumbnailMedia}
                        className="w-full aspect-[4/3] object-cover"
                        alt={`${project.title} thumbnail`}
                      />
                    </div>

                    {/* Thick Square Border Button */}
                    <Link
                      href={`/work/${project.slug}`}
                      className="border-4 border-black px-6 py-4 text-center font-ui font-bold text-black hover:bg-black hover:text-white transition-colors duration-200"
                    >
                      {project.title}
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
