'use client'

import { useEffect, useState } from 'react'

interface ProjectCardSkeletonProps {
  index: number
}

export function ProjectCardSkeleton({ index }: ProjectCardSkeletonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isGlowing, setIsGlowing] = useState(false)

  useEffect(() => {
    // Staggered animation delay based on index
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 150) // 150ms delay between each skeleton

    return () => clearTimeout(timer)
  }, [index])

  useEffect(() => {
    // Pulsing glow effect
    const glowTimer = setInterval(() => {
      setIsGlowing(prev => !prev)
    }, 2000)

    return () => clearInterval(glowTimer)
  }, [])

  return (
    <div className="flex-shrink-0 w-64 md:w-72 lg:w-80 snap-start">
      <div className="flex flex-col">
        {/* Title Skeleton - Alternating position like real cards */}
        {index % 2 === 1 && (
          <div className="md:hidden mb-4">
            <div className="relative">
              {/* Glowing border effect */}
              <div className={`
                absolute inset-0 border-[7px] border-transparent rounded-sm
                ${isGlowing ? 'animate-pulse' : ''}
                bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500
                opacity-30 blur-sm
              `} />
              
              {/* Main skeleton border */}
              <div className={`
                relative border-[7px] border-gray-200 px-6 py-2 
                bg-gradient-to-r from-gray-100 to-gray-200
                w-32 h-8 rounded-sm
                ${isVisible ? 'animate-fadeIn' : 'opacity-0'}
                transition-all duration-700 ease-out
              `}>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer" />
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
            {/* Animated grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full bg-[linear-gradient(90deg,transparent_50%,rgba(42,3,63,0.1)_50%),linear-gradient(0deg,transparent_50%,rgba(42,3,63,0.1)_50%)] bg-[length:20px_20px]" />
            </div>
            
            {/* Floating geometric shapes */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-gray-400 rounded-full animate-float opacity-40" />
            <div className="absolute top-16 right-6 w-6 h-6 bg-gray-500 rotate-45 animate-float-delayed opacity-40" />
            <div className="absolute bottom-8 left-8 w-4 h-4 bg-gray-600 rounded-sm animate-float-slow opacity-40" />
            
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
          </div>
        </div>

        {/* Desktop Title Skeleton */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Glowing border effect */}
            <div className={`
              absolute inset-0 border-[7px] border-transparent rounded-sm
              ${isGlowing ? 'animate-pulse' : ''}
              bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500
              opacity-30 blur-sm
            `} />
            
            {/* Main skeleton border */}
            <div className={`
              relative border-[7px] border-gray-200 px-6 py-2 
              bg-gradient-to-r from-gray-100 to-gray-200
              w-32 h-8 rounded-sm
              ${isVisible ? 'animate-fadeIn' : 'opacity-0'}
              transition-all duration-700 ease-out
            `}>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Mobile Title Skeleton - Bottom position for even indices */}
        {index % 2 === 0 && (
          <div className="md:hidden">
            <div className="relative">
              {/* Glowing border effect */}
              <div className={`
                absolute inset-0 border-[7px] border-transparent rounded-sm
                ${isGlowing ? 'animate-pulse' : ''}
                bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500
                opacity-30 blur-sm
              `} />
              
              {/* Main skeleton border */}
              <div className={`
                relative border-[7px] border-gray-200 px-6 py-2 
                bg-gradient-to-r from-gray-100 to-gray-200
                w-32 h-8 rounded-sm
                ${isVisible ? 'animate-fadeIn' : 'opacity-0'}
                transition-all duration-700 ease-out
              `}>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-shimmer" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
