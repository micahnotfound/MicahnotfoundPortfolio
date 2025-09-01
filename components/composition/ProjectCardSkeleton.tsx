'use client'

import { useEffect, useState } from 'react'

interface ProjectCardSkeletonProps {
  index: number
}

export function ProjectCardSkeleton({ index }: ProjectCardSkeletonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Staggered animation delay based on index
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 150) // 150ms delay between each skeleton

    return () => clearTimeout(timer)
  }, [index])

  return (
    <div className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start">
      <div className="flex flex-col">
        {/* Title Skeleton - Alternating position like real cards */}
        {index % 2 === 1 && (
          <div className="md:hidden mb-4">
            <div className="relative">
              {/* Main skeleton border */}
              <div className={`
                border-[7px] border-gray-200 px-6 py-2 
                bg-gradient-to-r from-gray-100 to-gray-200
                w-32 h-8 rounded-sm
                ${isVisible ? 'animate-fadeIn' : 'opacity-0'}
                transition-all duration-700 ease-out
              `}>
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>
          </div>
        )}

        {/* Thumbnail Skeleton */}
        <div className="mb-6 overflow-hidden">
          <div className={`
            relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300
            rounded-sm overflow-hidden
            ${isVisible ? 'animate-fadeIn' : 'opacity-0'}
            transition-all duration-700 ease-out
          `}>
            {/* Simple grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-[linear-gradient(90deg,transparent_50%,rgba(42,3,63,0.05)_50%),linear-gradient(0deg,transparent_50%,rgba(42,3,63,0.05)_50%)] bg-[length:24px_24px]" />
            </div>
            
            {/* Single floating element */}
            <div className="absolute top-6 right-6 w-4 h-4 bg-gray-400 rounded-full animate-float opacity-30" />
            
            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-15 animate-shimmer" />
          </div>
        </div>

        {/* Desktop Title Skeleton */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Main skeleton border */}
            <div className={`
              border-[7px] border-gray-200 px-6 py-2 
              bg-gradient-to-r from-gray-100 to-gray-200
              w-32 h-8 rounded-sm
              ${isVisible ? 'animate-fadeIn' : 'opacity-0'}
              transition-all duration-700 ease-out
            `}>
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Mobile Title Skeleton - Bottom position for even indices */}
        {index % 2 === 0 && (
          <div className="md:hidden">
            <div className="relative">
              {/* Main skeleton border */}
              <div className={`
                border-[7px] border-gray-200 px-6 py-2 
                bg-gradient-to-r from-gray-100 to-gray-200
                w-32 h-8 rounded-sm
                ${isVisible ? 'animate-fadeIn' : 'opacity-0'}
                transition-all duration-700 ease-out
              `}>
                {/* Subtle shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
