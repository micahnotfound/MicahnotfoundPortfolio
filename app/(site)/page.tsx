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
      {/* Projects Grid Section */}
      <section className="py-20 px-8">
        <div className="container-custom">
          {/* Desktop: Column Layout */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {projects.map((project, index) => (
              <div key={project.slug} className="flex flex-col">
                {/* Date */}
                <div className="text-sm font-ui text-gray-600 mb-4">
                  {project.year}
                </div>
                
                {/* Thumbnail */}
                <div className="mb-6">
                  <Media
                    media={project.thumbnails[0]}
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
            ))}
          </div>
          
          {/* Mobile: Carousel with Staggered Buttons */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto space-x-6 pb-6 snap-x snap-mandatory">
              {projects.map((project, index) => (
                <div key={project.slug} className="flex-shrink-0 w-80 snap-start">
                  <div className="flex flex-col">
                    {/* Thumbnail */}
                    <div className="mb-4">
                      <Media
                        media={project.thumbnails[0]}
                        className="w-full aspect-[4/3] object-cover"
                        alt={`${project.title} thumbnail`}
                      />
                    </div>
                    
                    {/* Staggered Button Positioning */}
                    <div className={`${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                      <Link
                        href={`/work/${project.slug}`}
                        className="border-4 border-black px-6 py-4 text-center font-ui font-bold text-black hover:bg-black hover:text-white transition-colors duration-200 block"
                      >
                        {project.title}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
