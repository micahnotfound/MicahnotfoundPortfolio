import { Metadata } from 'next'
import { CarouselWindow } from '@/components/composition/CarouselWindow'
import { ProjectCard } from '@/components/composition/ProjectCard'
import { getHomeData, getFeaturedProjects } from '@/lib/content'
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
  const homeData = getHomeData()
  const featuredProjects = getFeaturedProjects()

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <CarouselWindow
          items={homeData.hero.carousel}
          autoplay={true}
          autoplaySpeed={5000}
          showIndicators={true}
          className="h-full"
        />
        
        {/* Hero Content Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-8">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight text-balance">
              {homeData.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pretty">
              {homeData.hero.subtitle}
            </p>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4 text-balance">{homeData.featuredProjects.title}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
              {homeData.featuredProjects.description}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <a
              href="/work"
              className="btn-primary inline-flex items-center"
            >
              View All Projects
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-20 px-8">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-display font-bold mb-6 text-balance">About</h2>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Creative strategist specializing in immersive media and XR storytelling, with success in bringing complex cultural and environmental narratives to life.
          </p>
          <a
            href="/about"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
          >
            Learn More
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  )
}
