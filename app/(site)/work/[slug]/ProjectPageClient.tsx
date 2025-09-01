'use client'

import { useCallback } from 'react'
import { Media } from '@/components/shared/Media'
import { ImageCarousel } from '@/components/composition/ImageCarousel'
import { AdaptiveGrid } from '@/components/composition/AdaptiveGrid'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import type { Project, MediaItem } from '@/types/content'

interface ProjectPageClientProps {
  project: Project
  allMedia: MediaItem[]
}

export function ProjectPageClient({ project, allMedia }: ProjectPageClientProps) {
  // Get the video publicId based on the project
  const getVideoPublicId = (slug: string) => {
    switch (slug) {
      case 'blacklands':
        return 'BLACKLANDS_reel_vpw5br'
      case 'dreaming-with-the-archives':
        return 'DWA_Reel_oegaxm'
      case 'moma':
        return 'Nested_Sequence_02_lwwymc'
      case 'nycam':
        return 'NYCAM_reel_qpkje9'
      default:
        return null
    }
  }

  const videoPublicId = getVideoPublicId(project.slug)

  // Build Cloudinary URLs for carousel images
  const buildCloudinaryUrl = (publicId: string) => {
    return `https://res.cloudinary.com/dxmq5ewnv/image/upload/q_auto,f_auto/${publicId}`
  }

  // Build gallery images for AdaptiveGrid
  const buildGalleryImages = (galleryData: any[]) => {
    return galleryData.map((item, index) => ({
      id: `${item.public_id}_${index}`,
      src: buildCloudinaryUrl(item.public_id),
      alt: item.alt || `Gallery image ${index + 1}`,
      caption: item.caption,
      width: item.width || 1200,
      height: item.height || 800
    }))
  }

  return (
    <main className="pt-32 min-h-screen">
      {/* Project Content - Masonry Layout */}
      <section className="py-16 px-8">
        <div className="container-custom">
          {/* Mobile/Tablet Layout: Full width for both sections */}
          <div className="lg:hidden space-y-12">
            {/* Project Information - Full width on mobile/tablet */}
            <div>
              {/* Project Title */}
              <h1 className="text-4xl md:text-5xl font-enigma font-bold mb-8 text-gray-900 leading-tight">
                {project.slug === "moma" ? (
                  <>
                    The<br />
                    Monuments<br />
                    Project
                  </>
                ) : (
                  project.title
                )}
              </h1>

              {/* About This Project */}
              {project.description && (
                <div className="prose prose-lg">
                  {project.description.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4 text-gray-700 font-body leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Video Player - Full width on mobile/tablet */}
            {videoPublicId && (
              <div className="py-8 bg-gray-50">
                <VideoPlayer 
                  publicId={videoPublicId}
                  width={16}
                  height={9}
                  className="shadow-lg"
                  controls={true}
                  autoPlay={false}
                  muted={true}
                  loop={false}
                />
              </div>
            )}

            {/* Image Carousels and Gallery - Full width on mobile/tablet */}
            {project.elements.map((element, elementIndex) => (
              <div key={elementIndex} className="space-y-8">
                {/* Detail Images Carousel */}
                {element.detail && element.detail.length > 0 && (
                  <ImageCarousel
                    images={element.detail.map(img => buildCloudinaryUrl(img.public_id))}
                    title={element.name}
                    type="detail"
                  />
                )}

                {/* Profile Images Carousel */}
                {element.profile && element.profile.length > 0 && (
                  <ImageCarousel
                    images={element.profile.map(img => buildCloudinaryUrl(img.public_id))}
                    title={`${element.name} Profile Views`}
                    type="profile"
                  />
                )}

                {/* Header Clips Carousel */}
                {element['header-clips'] && element['header-clips'].length > 0 && (
                  <ImageCarousel
                    images={element['header-clips'].map(img => buildCloudinaryUrl(img.public_id))}
                    title={element.name}
                    type="header-clips"
                  />
                )}

                {/* Gallery Images - Adaptive Grid */}
                {element.gallery && element.gallery.length > 0 && (
                  <div>
                    <h3 className="text-xl font-enigma font-bold text-gray-900 mb-4">{element.name}</h3>
                    <AdaptiveGrid
                      images={buildGalleryImages(element.gallery)}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Layout: Side-by-side with sticky sidebar */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {/* Masonry Gallery Column - Takes up 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* Video Player - Top of masonry column */}
              {videoPublicId && (
                <div className="py-8 bg-gray-50">
                  <VideoPlayer 
                    publicId={videoPublicId}
                    width={16}
                    height={9}
                    className="shadow-lg"
                    controls={true}
                    autoPlay={false}
                    muted={true}
                    loop={false}
                  />
                </div>
              )}

              {/* Image Carousels and Gallery */}
              {project.elements.map((element, elementIndex) => (
                <div key={elementIndex} className="space-y-8">
                  {/* Detail Images Carousel */}
                  {element.detail && element.detail.length > 0 && (
                    <ImageCarousel
                      images={element.detail.map(img => buildCloudinaryUrl(img.public_id))}
                      title={element.name}
                      type="detail"
                    />
                  )}

                  {/* Profile Images Carousel */}
                  {element.profile && element.profile.length > 0 && (
                    <ImageCarousel
                      images={element.profile.map(img => buildCloudinaryUrl(img.public_id))}
                      title={`${element.name} Profile Views`}
                      type="profile"
                    />
                  )}

                  {/* Header Clips Carousel */}
                  {element['header-clips'] && element['header-clips'].length > 0 && (
                    <ImageCarousel
                      images={element['header-clips'].map(img => buildCloudinaryUrl(img.public_id))}
                      title={element.name}
                      type="header-clips"
                    />
                  )}

                  {/* Gallery Images - Adaptive Grid */}
                  {element.gallery && element.gallery.length > 0 && (
                    <div>
                      <h3 className="text-xl font-enigma font-bold text-gray-900 mb-4">{element.name}</h3>
                      <AdaptiveGrid
                        images={buildGalleryImages(element.gallery)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Project Information (Sticky) - Takes up 1 column */}
            <div className="space-y-8">
              {/* Sticky Project Information Section */}
              <div className="lg:sticky lg:top-32">
                {/* Project Title */}
                <h1 className="text-4xl md:text-5xl font-enigma font-bold mb-8 text-gray-900 leading-tight">
                  {project.slug === "moma" ? (
                    <>
                      The<br />
                      Monuments<br />
                      Project
                    </>
                  ) : (
                    project.title
                  )}
                </h1>

                {/* About This Project */}
                {project.description && (
                  <div className="prose prose-lg">
                    {project.description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 text-gray-700 font-body leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
