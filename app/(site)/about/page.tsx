import { Metadata } from 'next'
import { siteSettings } from '@/config/siteSettings'

export const metadata: Metadata = {
  title: `About - ${siteSettings.siteTitle}`,
  description: 'Creative strategist specializing in immersive media and XR storytelling, with success in bringing complex cultural and environmental narratives to life.',
  keywords: ['about', 'creative strategist', 'AR', 'XR', 'immersive', 'storytelling', 'Kinfolk Tech', 'portfolio'],
  openGraph: {
    title: `About - ${siteSettings.siteTitle}`,
    description: 'Creative strategist specializing in immersive media and XR storytelling.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main className="pt-32">
      {/* Main Content */}
      <section className="py-16 px-8">
        <div className="container-custom max-w-4xl mx-auto">
          {/* Mobile Layout: Image on top, description below */}
          <div className="md:hidden space-y-8">
            {/* Image - Full width on mobile, portrait mode */}
            <div className="w-full animate-fade-in">
              <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680394/micah_j75jbv.png"
                  alt="Micah Milner"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Description - Below image on mobile */}
            <div className="space-y-6">
              {/* Kinfolk Tech Description */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 mb-4 animate-text-reveal" style={{ animationDelay: '0.4s' }}>
                    Kinfolk Tech leverages over six years of leadership in AR and XR innovation to design award-winning educational and cultural experiences. As Chief Strategy Officer, the focus centers on directing creative vision and strategy for public exhibitions and immersive educational tools. Collaborating with schools, cultural institutions, and global brands, the team curates dynamic digital narratives, extending the reach of underrepresented stories in impactful ways.
                  </p>
                  <p className="text-gray-700 animate-text-reveal" style={{ animationDelay: '0.6s' }}>
                    By managing multidisciplinary teams and fostering cross-sector partnerships, Kinfolk Tech creates engaging digital monuments and exhibitions featured in prestigious spaces like MoMA and Tribeca Festival. The mission is to integrate art, equity, and technology into transformative experiences, reimagining how audiences connect with history and culture. Values of inclusion and collaboration drive efforts to amplify diverse narratives in public and educational contexts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Layout: Side by side with text aligned to bottom */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {/* Image Column */}
            <div className="md:col-span-1 animate-fade-in">
              <div className="sticky top-24">
                <div className="aspect-[3/4] bg-gray-200 overflow-hidden">
                  <img
                    src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680394/micah_j75jbv.png"
                    alt="Micah Milner"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Main Content - Aligned to bottom */}
            <div className="md:col-span-2 flex flex-col justify-end animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="space-y-6">
                {/* Kinfolk Tech Description */}
                <div>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 mb-4 animate-text-reveal" style={{ animationDelay: '0.5s' }}>
                      Kinfolk Tech leverages over six years of leadership in AR and XR innovation to design award-winning educational and cultural experiences. As Chief Strategy Officer, the focus centers on directing creative vision and strategy for public exhibitions and immersive educational tools. Collaborating with schools, cultural institutions, and global brands, the team curates dynamic digital narratives, extending the reach of underrepresented stories in impactful ways.
                    </p>
                    <p className="text-gray-700 animate-text-reveal" style={{ animationDelay: '0.7s' }}>
                      By managing multidisciplinary teams and fostering cross-sector partnerships, Kinfolk Tech creates engaging digital monuments and exhibitions featured in prestigious spaces like MoMA and Tribeca Festival. The mission is to integrate art, equity, and technology into transformative experiences, reimagining how audiences connect with history and culture. Values of inclusion and collaboration drive efforts to amplify diverse narratives in public and educational contexts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
