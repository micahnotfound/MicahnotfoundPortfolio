'use client'

import Link from 'next/link'
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
  // Exhibition photos
  const exhibitionPhoto1 = {
    public_id: "v1756775074/Blacklands_R1_cobywl",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 1"
  }

  const exhibitionPhoto2 = {
    public_id: "v1756775074/Blacklands_R2_qaects",
    kind: "image" as const,
    alt: "BLACKLANDS exhibition view 2"
  }

  return (
    <div className="min-h-screen bg-[#D1D5DB] overflow-y-auto">
      {/* First section - fills viewport, no scroll */}
      <div className="h-screen px-20 xl:px-[100px] pt-[52px] pb-12">
        <div className="w-full h-full flex gap-10 items-end">
          {/* Left Side: Logo and Text - Fixed left, matches home page positioning */}
          <div className="flex flex-col items-start flex-shrink-0 h-full" style={{ width: '250px' }}>
            {/* Super Tall Logo - State 0, clickable home button, positioned at top */}
            <Link href="/" style={{ width: '250px' }}>
              <MorphingHeaderLogo
                state={0}
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </Link>

            {/* Spacer to push text to bottom */}
            <div style={{ flex: 1 }} />

            {/* Title and Description - at bottom, 40px gap from logo, aligned with media bottom */}
            <div className="space-y-4" style={{ width: '250px', marginBottom: '0' }}>
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

          {/* Right Side: Hero Image and Video - Fill remaining space */}
          <div className="flex gap-6 flex-grow h-full">
            {/* Hero Image - Wider, positioned to show face better */}
            <div
              className="overflow-hidden h-full"
              style={{
                flexBasis: '65%',
                borderRadius: '24px'
              }}
            >
              <Media
                media={heroImage}
                className="w-full h-full object-cover"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center calc(50% + 100px)' // Shift down 100px to show face
                }}
                alt={heroImage.alt || 'BLACKLANDS Hero'}
              />
            </div>

            {/* Video Player - Taller aspect ratio */}
            <div
              className="overflow-hidden h-full"
              style={{
                flexBasis: '35%',
                borderRadius: '24px'
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

      {/* Second section - Exhibition photos row */}
      <div className="px-20 xl:px-[100px] pb-12">
        <div className="flex gap-6">
          {/* Exhibition Photo 1 - 50% width */}
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto1}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto1.alt}
            />
          </div>

          {/* Exhibition Photo 2 - 50% width */}
          <div
            className="overflow-hidden"
            style={{
              flexBasis: '50%',
              borderRadius: '24px',
              height: '600px'
            }}
          >
            <Media
              media={exhibitionPhoto2}
              className="w-full h-full object-cover"
              alt={exhibitionPhoto2.alt}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
