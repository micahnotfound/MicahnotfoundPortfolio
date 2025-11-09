'use client'

import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { Media } from '@/components/shared/Media'
import { VideoPlayer } from '@/components/shared/VideoPlayer'
import type { MediaItem } from '@/types/content'

interface BlacklandsLayoutProps {
  projectTitle: string
  projectDescription: string
  heroImage: MediaItem
  videoPublicId: string
}

export function BlacklandsLayout({
  projectTitle,
  projectDescription,
  heroImage,
  videoPublicId
}: BlacklandsLayoutProps) {
  return (
    <div className="min-h-screen bg-[#D1D5DB] flex items-center justify-center p-20 xl:px-[100px]">
      <div className="w-full max-w-[2000px] flex gap-20">
        {/* Left Side: Logo and Text */}
        <div className="flex flex-col items-start gap-8" style={{ flexBasis: '40%' }}>
          {/* Extra Tall Logo - 2x State 1 height */}
          <div className="w-full max-w-[400px]">
            <MorphingHeaderLogo
              state={1}
              style={{
                width: '100%',
                height: 'auto',
                transform: 'scaleY(2)', // Double the height
                transformOrigin: 'top'
              }}
            />
          </div>

          {/* Title and Description - Width matches logo */}
          <div className="w-full max-w-[400px] space-y-4">
            {/* Project Title */}
            <h1 className="text-5xl font-body font-bold text-core-dark leading-none">
              {projectTitle}
            </h1>

            {/* Project Description */}
            <p className="text-base font-ui text-gray-700 leading-relaxed">
              {projectDescription}
            </p>
          </div>
        </div>

        {/* Right Side: Hero Image and Video */}
        <div className="flex gap-6" style={{ flexBasis: '60%' }}>
          {/* Hero Image */}
          <div
            className="flex-1 overflow-hidden"
            style={{
              borderRadius: '24px',
              height: 'calc(100vh - 160px)', // Full height minus padding
              minHeight: '600px'
            }}
          >
            <Media
              media={heroImage}
              className="w-full h-full object-cover"
              alt={heroImage.alt || 'BLACKLANDS Hero'}
            />
          </div>

          {/* Video Player */}
          <div
            className="flex-1 overflow-hidden"
            style={{
              borderRadius: '24px',
              height: 'calc(100vh - 160px)', // Full height minus padding
              minHeight: '600px'
            }}
          >
            <VideoPlayer
              publicId={videoPublicId}
              portrait={true}
              className="w-full h-full"
              controls={true}
              autoPlay={false}
              muted={true}
              loop={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
