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
    <main className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 text-balance">
            About Micah Milner
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 text-pretty">
            Creative strategist specializing in immersive media and XR storytelling
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-8">
        <div className="container-custom max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Contact Sidebar */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-8">
                {/* Contact Info */}
                <div className="card p-6">
                  <h3 className="text-xl font-display font-bold mb-4">Contact</h3>
                  <div className="space-y-3">
                    <p className="text-gray-600">
                      <strong>Email:</strong><br />
                      <a href={`mailto:${siteSettings.email}`} className="text-blue-600 hover:text-blue-800">
                        {siteSettings.email}
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <strong>Location:</strong><br />
                      New York, NY
                    </p>
                  </div>
                </div>

                {/* Education */}
                <div className="card p-6">
                  <h3 className="text-xl font-display font-bold mb-4">Education</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold">MFA, Design & Technology</p>
                      <p className="text-gray-600">Parsons School of Design</p>
                      <p className="text-sm text-gray-500">2018</p>
                    </div>
                    <div>
                      <p className="font-semibold">BA, Media Studies</p>
                      <p className="text-gray-600">University of California, Berkeley</p>
                      <p className="text-sm text-gray-500">2015</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-12">
              {/* Professional Summary */}
              <div className="card p-8">
                <h2 className="text-3xl font-display font-bold mb-6">Professional Summary</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 mb-4">
                    With over a decade of experience at the intersection of immersive technology, storytelling, and education, 
                    I have dedicated my career to building transformative experiences that bring complex scientific and cultural narratives to life.
                  </p>
                  <p className="text-gray-700 mb-4">
                    My work spans AR/VR installations, interactive documentaries, and digital exhibitions, with a focus on 
                    creating accessible, engaging experiences that bridge the gap between complex subject matter and public understanding.
                  </p>
                  <p className="text-gray-700">
                    I&apos;ve collaborated with leading cultural institutions including the Museum of Modern Art, the Smithsonian, 
                    and the American Museum of Natural History, helping them leverage emerging technologies to tell stories 
                    that matter.
                  </p>
                </div>
              </div>

              {/* Current Role */}
              <div className="card p-8">
                <h2 className="text-3xl font-display font-bold mb-6">Current Role</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">Creative Director, Kinfolk Tech</h3>
                    <p className="text-gray-600">2020 - Present</p>
                    <p className="text-gray-700 mt-2">
                      Leading creative strategy and production for immersive media projects, with a focus on 
                      AR/XR storytelling and interactive experiences.
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Projects */}
              <div className="card p-8">
                <h2 className="text-3xl font-display font-bold mb-6">Selected Projects</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">AfroFuturism AR Experience</h3>
                    <p className="text-gray-600">2024 - Award-winning AR installation</p>
                    <p className="text-gray-700 mt-2">
                      An immersive augmented reality experience exploring Afrofuturist themes through the work 
                      of George Clinton, Octavia Butler, and Sun Ra.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">BlackLands Digital Monuments</h3>
                    <p className="text-gray-600">2023 - MoMA Exhibition</p>
                    <p className="text-gray-700 mt-2">
                      Interactive digital monuments honoring African American historical figures, 
                      featuring Manuel Gerritt De Reus, Samuel Anderson, and Sojourner Truth.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">MoMA Interactive Exhibition</h3>
                    <p className="text-gray-600">2023 - Museum of Modern Art</p>
                    <p className="text-gray-700 mt-2">
                      A groundbreaking interactive exhibition exploring New York&apos;s hidden histories 
                      through digital storytelling and immersive experiences.
                    </p>
                  </div>
                </div>
              </div>

              {/* About Kinfolk Tech */}
              <div className="card p-8">
                <h2 className="text-3xl font-display font-bold mb-6">About Kinfolk Tech</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 mb-4">
                    Kinfolk Tech is a creative studio specializing in immersive media and XR storytelling. 
                    We work with cultural institutions, educational organizations, and brands to create 
                    meaningful experiences that engage and inspire.
                  </p>
                  <p className="text-gray-700">
                    Our approach combines cutting-edge technology with thoughtful storytelling, 
                    ensuring that every project not only showcases technical innovation but also 
                    delivers meaningful content that resonates with audiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </main>
  )
}
