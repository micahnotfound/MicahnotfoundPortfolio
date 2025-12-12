'use client'

import { useCallback, useState } from 'react'
import { Media } from '@/components/shared/Media'
import { ImageCarousel } from '@/components/composition/ImageCarousel'
import { AdaptiveGrid } from '@/components/composition/AdaptiveGrid'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import { TabSelector } from '@/components/composition/TabSelector'
import { VerticalCarousel } from '@/components/composition/VerticalCarousel'
import { BlacklandsLayout } from '@/components/composition/BlacklandsLayout'
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

  // Filter out the Main Content element for regular processing
  const regularElements = project.elements.filter(element => element.name !== 'Main Content')

  // State to manage the active carousel type for each element
  const [activeCarouselTypes, setActiveCarouselTypes] = useState<Record<string, 'profile' | 'detail'>>({})

  const handleTabChange = useCallback((elementName: string, tabType: 'profile' | 'detail') => {
    setActiveCarouselTypes(prev => ({
      ...prev,
      [elementName]: tabType
    }))
  }, [])

  const getActiveCarouselType = (elementName: string) => {
    return activeCarouselTypes[elementName] || 'profile' // Default to profile if not set
  }

  // Render simplified layout for Blacklands project
  if (project.slug === 'blacklands') {
    const mainContent = project.elements.find(el => el.name === 'Main Content')
    const heroImage = mainContent?.hero?.[0]

    if (!heroImage || !videoPublicId) {
      return <div>Missing required content</div>
    }

    return (
      <BlacklandsLayout
        projectTitle={project.title}
        projectDescription={project.description || ''}
        heroImage={heroImage}
        videoPublicId={videoPublicId}
      />
    )
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
              <h1 className="text-4xl md:text-5xl font-body font-bold mb-8 text-core-dark leading-tight">
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

            {/* Hero Section - Two Column Layout for Blacklands */}
            {project.slug === 'blacklands' && project.elements.find(el => el.name === 'Main Content')?.hero && (
              <div className="space-y-8">
                {/* Hero Image */}
                <div>
                  {project.elements.find(el => el.name === 'Main Content')?.hero?.[0] && (
                    <Media
                      media={project.elements.find(el => el.name === 'Main Content')?.hero![0]!}
                      className="w-full aspect-[9/16] object-cover"
                      alt="BLACKLANDS Hero Image"
                    />
                  )}
                </div>
                
                {/* Video Player */}
                {videoPublicId && (
                  <div>
                    <VideoPlayer 
                      publicId={videoPublicId}
                      portrait={true}
                      className="shadow-lg"
                      controls={true}
                      autoPlay={false}
                      muted={true}
                      loop={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Hero Section - Three Stacked Images Layout for MOMA */}
            {project.slug === 'moma' && project.elements.find(el => el.name === 'Main Content')?.hero && (
              <div className="space-y-8">
                {/* Three Stacked Hero Images */}
                <div className="flex flex-col h-full space-y-4">
                  {project.elements.find(el => el.name === 'Main Content')?.hero?.map((image, index) => (
                    <div key={index} className="flex-1 min-h-0">
                      <div className="w-full h-full" style={{ aspectRatio: '3/1' }}>
                        <Media
                          media={image}
                          className="w-full h-full object-cover overflow-hidden"
                          alt={`MoMA header image ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Video Player */}
                {videoPublicId && (
                  <div>
                    <VideoPlayer 
                      publicId={videoPublicId}
                      portrait={true}
                      className="shadow-lg"
                      controls={true}
                      autoPlay={false}
                      muted={true}
                      loop={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Hero Section - Three Stacked Images Layout for NYCAM */}
            {project.slug === 'nycam' && project.elements.find(el => el.name === 'Main Content')?.hero && (
              <div className="space-y-8">
                {/* Three Stacked Hero Images */}
                <div className="flex flex-col h-full space-y-4">
                  {project.elements.find(el => el.name === 'Main Content')?.hero?.map((image, index) => (
                    <div key={index} className="flex-1 min-h-0">
                      <div className="w-full h-full" style={{ aspectRatio: '3/1' }}>
                        <Media
                          media={image}
                          className="w-full h-full object-cover overflow-hidden"
                          alt={`NYCAM header image ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Video Player */}
                {videoPublicId && (
                  <div>
                    <VideoPlayer 
                      publicId={videoPublicId}
                      portrait={true}
                      className="shadow-lg"
                      controls={true}
                      autoPlay={false}
                      muted={true}
                      loop={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Hero Section - Three Stacked Images Layout for Dreaming with the Archives */}
            {project.slug === 'dreaming-with-the-archives' && project.elements.find(el => el.name === 'Main Content')?.hero && (
              <div className="space-y-8">
                {/* Three Stacked Hero Images */}
                <div className="flex flex-col h-full space-y-4">
                  {project.elements.find(el => el.name === 'Main Content')?.hero?.map((image, index) => (
                    <div key={index} className="flex-1 min-h-0">
                      <div className="w-full h-full" style={{ aspectRatio: '3/1' }}>
                        <Media
                          media={image}
                          className="w-full h-full object-cover overflow-hidden"
                          alt={`Dreaming with the Archives header image ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Video Player */}
                {videoPublicId && (
                  <div>
                    <VideoPlayer 
                      publicId={videoPublicId}
                      portrait={true}
                      className="shadow-lg"
                      controls={true}
                      autoPlay={false}
                      muted={true}
                      loop={false}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Standard Video Player for other projects */}
            {project.slug !== 'blacklands' && project.slug !== 'moma' && project.slug !== 'nycam' && project.slug !== 'dreaming-with-the-archives' && videoPublicId && (
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
            {regularElements.map((element, elementIndex) => (
              <div key={elementIndex} className="space-y-8">
                {/* Element Title and Tab Selector */}
                {(element.profile && element.profile.length > 0) || (element.detail && element.detail.length > 0) ? (
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-body font-bold text-core-dark">
                      {element.name}
                    </h3>
                    {(element.profile && element.profile.length > 0) && (element.detail && element.detail.length > 0) && (
                      <TabSelector 
                        onTabChange={(tabType) => handleTabChange(element.name, tabType)} 
                        hasProfile={!!(element.profile && element.profile.length > 0)} 
                        hasDetail={!!(element.detail && element.detail.length > 0)} 
                      />
                    )}
                  </div>
                ) : null}

                {/* Gallery Images - Adaptive Grid */}
                {element.gallery && element.gallery.length > 0 && (
                  <div>
                    <h3 className="text-xl font-body font-bold text-core-dark mb-4">{element.name}</h3>
                    <AdaptiveGrid
                      images={buildGalleryImages(element.gallery)}
                      className="w-full"
                    />
                  </div>
                )}

                {/* Profile Images Carousel - Default */}
                {element.profile && element.profile.length > 0 && (getActiveCarouselType(element.name) === 'profile' || !element.detail) && (
                  <ImageCarousel
                    images={element.profile.map(img => buildCloudinaryUrl(img.public_id))}
                    title={element.name}
                    type="profile"
                  />
                )}

                {/* Detail Images Carousel - Only when selected */}
                {element.detail && element.detail.length > 0 && getActiveCarouselType(element.name) === 'detail' && (
                  <ImageCarousel
                    images={element.detail.map(img => buildCloudinaryUrl(img.public_id))}
                    title={element.name}
                    type="detail"
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
              </div>
            ))}
          </div>

          {/* Desktop Layout: Side-by-side with sticky sidebar */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-6">
            {/* Masonry Gallery Column - Takes up 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hero Section - Two Column Layout for Blacklands */}
              {project.slug === 'blacklands' && project.elements.find(el => el.name === 'Main Content')?.hero && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Column 1: Hero Image */}
                  <div>
                    {project.elements.find(el => el.name === 'Main Content')?.hero?.[0] && (
                      <Media
                        media={project.elements.find(el => el.name === 'Main Content')?.hero![0]!}
                        className="w-full aspect-[9/16] object-cover"
                        alt="BLACKLANDS Hero Image"
                      />
                    )}
                  </div>
                  
                  {/* Column 2: Video Player */}
                  {videoPublicId && (
                    <div>
                      <VideoPlayer 
                        publicId={videoPublicId}
                        portrait={true}
                        className="shadow-lg"
                        controls={true}
                        autoPlay={false}
                        muted={true}
                        loop={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Hero Section - Three Stacked Images Layout for Dreaming with the Archives */}
              {project.slug === 'dreaming-with-the-archives' && project.elements.find(el => el.name === 'Main Content')?.hero && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Column 1: Three Stacked Hero Images */}
                  <div className="flex flex-col h-full space-y-4">
                    {project.elements.find(el => el.name === 'Main Content')?.hero?.map((image, index) => (
                      <div key={index} className="flex-1 min-h-0">
                        <div className="w-full h-full" style={{ aspectRatio: '3/1' }}>
                          <Media
                            media={image}
                            className="w-full h-full object-cover overflow-hidden"
                            alt={`Dreaming with the Archives header image ${index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Column 2: Video Player */}
                  {videoPublicId && (
                    <div>
                      <VideoPlayer 
                        publicId={videoPublicId}
                        portrait={true}
                        className="shadow-lg"
                        controls={true}
                        autoPlay={false}
                        muted={true}
                        loop={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Hero Section - Three Stacked Images Layout for MOMA */}
              {project.slug === 'moma' && project.elements.find(el => el.name === 'Main Content')?.hero && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Column 1: Three Stacked Hero Images */}
                  <div className="flex flex-col h-full space-y-4">
                    {project.elements.find(el => el.name === 'Main Content')?.hero?.map((image, index) => (
                      <div key={index} className="flex-1 min-h-0">
                        <div className="w-full h-full" style={{ aspectRatio: '3/1' }}>
                          <Media
                            media={image}
                            className="w-full h-full object-cover overflow-hidden"
                            alt={`MoMA header image ${index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Column 2: Video Player */}
                  {videoPublicId && (
                    <div>
                      <VideoPlayer 
                        publicId={videoPublicId}
                        portrait={true}
                        className="shadow-lg"
                        controls={true}
                        autoPlay={false}
                        muted={true}
                        loop={false}
                      />
                    </div>
                  )}
                </div>
              )}

                            {/* Hero Section - Three Stacked Images Layout for NYCAM */}      
              {project.slug === 'nycam' && project.elements.find(el => el.name === 'Main Content')?.hero && (                                                   
                <div className="grid grid-cols-2 gap-6 items-end">
                  {/* Column 1: Three Stacked Hero Images */}
                  <div className="w-full aspect-[9/16] flex flex-col justify-end gap-4">
                    {project.elements.find(el => el.name === 'Main Content')?.hero?.map((image, index) => (                                                     
                      <div key={index} style={{ height: 'calc((100% - 2rem) / 3)' }} className="flex-shrink-0">
                        <Media
                          media={image}
                          className="w-full h-full object-cover overflow-hidden"
                          alt={`NYCAM header image ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Column 2: Video Player */}
                  {videoPublicId && (
                    <div className="w-full">
                      <VideoPlayer
                        publicId={videoPublicId}
                        portrait={true}
                        className="shadow-lg"
                        controls={true}
                        autoPlay={false}
                        muted={true}
                        loop={false}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Standard Video Player for other projects */}
              {project.slug !== 'blacklands' && project.slug !== 'dreaming-with-the-archives' && project.slug !== 'moma' && project.slug !== 'nycam' && videoPublicId && (
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
              {regularElements.map((element, elementIndex) => (
                <div key={elementIndex} className="space-y-8">
                  {/* Element Title and Tab Selector */}
                  {(element.profile && element.profile.length > 0) || (element.detail && element.detail.length > 0) ? (
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-body font-bold text-core-dark">
                        {element.name}
                      </h3>
                      {(element.profile && element.profile.length > 0) && (element.detail && element.detail.length > 0) && (
                        <TabSelector 
                          onTabChange={(tabType) => handleTabChange(element.name, tabType)} 
                          hasProfile={!!(element.profile && element.profile.length > 0)} 
                          hasDetail={!!(element.detail && element.detail.length > 0)} 
                        />
                      )}
                    </div>
                  ) : null}

                  {/* Gallery Images - Adaptive Grid */}
                  {element.gallery && element.gallery.length > 0 && (
                    <div>
                      <h3 className="text-xl font-body font-bold text-core-dark mb-4">{element.name}</h3>
                      <AdaptiveGrid
                        images={buildGalleryImages(element.gallery)}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Profile Images Carousel - Default */}
                  {element.profile && element.profile.length > 0 && (getActiveCarouselType(element.name) === 'profile' || !element.detail) && (
                    <ImageCarousel
                      images={element.profile.map(img => buildCloudinaryUrl(img.public_id))}
                      title={element.name}
                      type="profile"
                    />
                  )}

                  {/* Detail Images Carousel - Only when selected */}
                  {element.detail && element.detail.length > 0 && getActiveCarouselType(element.name) === 'detail' && (
                    <ImageCarousel
                      images={element.detail.map(img => buildCloudinaryUrl(img.public_id))}
                      title={element.name}
                      type="detail"
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
                </div>
              ))}
            </div>

            {/* Project Information (Sticky) - Takes up 1 column */}
            <div className="space-y-8">
              {/* Sticky Project Information Section */}
              <div className="lg:sticky lg:top-32">
                {/* Project Title */}
                <h1 className="text-4xl md:text-5xl font-body font-bold mb-8 text-core-dark leading-tight">
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
