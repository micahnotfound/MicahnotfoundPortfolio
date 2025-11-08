"use client"

import Link from 'next/link'
import { MorphingHeaderLogo } from './MorphingHeaderLogo'

interface ProjectHeaderProps {
  projectTitle: string
  projectDescription?: string
}

export function ProjectHeader({ projectTitle, projectDescription }: ProjectHeaderProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out overflow-hidden"
      style={{
        maxHeight: '140px' // 100px + 40px taller for project pages
      }}
    >
      <div className="w-full bg-[#D1D5DB]/90 backdrop-blur-sm h-full">
        <div className="w-full px-20 xl:px-[100px] h-full">
          <div
            className="flex justify-start items-start pb-6 transition-all duration-500 ease-out h-full"
            style={{
              paddingTop: '12px'
            }}
          >
            {/* Left Side: Logo and Project Info */}
            <div className="flex items-start gap-12 lg:gap-20">
              {/* Morphing Logo - anchored to top */}
              <Link href="/" className="flex-shrink-0">
                <MorphingHeaderLogo
                  state={3}
                  className="transition-all duration-500 ease-out"
                  style={{
                    width: '250px',
                    height: 'auto'
                  }}
                />
              </Link>

              {/* Project Title and Description */}
              <div className="flex flex-col justify-start pt-2">
                {/* Project Title */}
                <h1 className="text-2xl font-body font-bold text-core-dark leading-tight mb-1">
                  {projectTitle}
                </h1>

                {/* Project Description */}
                {projectDescription && (
                  <p className="text-sm font-ui text-gray-700 leading-relaxed max-w-2xl line-clamp-2">
                    {projectDescription}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
