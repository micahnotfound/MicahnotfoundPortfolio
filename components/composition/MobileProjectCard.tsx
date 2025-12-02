'use client'

import { useRouter } from 'next/navigation'
import { Media } from '@/components/shared/Media'
import type { Project } from '@/types/content'

interface MobileProjectCardProps {
  project: Project
  index: number
  selectedIndex: number
  totalCards: number
  onSelect: (index: number) => void
}

export function MobileProjectCard({ project, index, selectedIndex, totalCards, onSelect }: MobileProjectCardProps) {
  const router = useRouter()
  const isSelected = index === selectedIndex
  const relativePosition = index - selectedIndex // Negative = above, Positive = below, 0 = selected

  // Use thumbnail if available, otherwise fall back to cover image
  const thumbnailMedia = project.thumbnails && project.thumbnails.length > 0
    ? project.thumbnails[0]
    : project.cover

  // Pie chart distribution: Selected = 66%, First below = 17%, others get progressively smaller
  // All cards always visible (no card goes to 0%)
  const getCardHeight = () => {
    if (isSelected) {
      return '66vh' // Selected card: 66% of viewport
    }

    // Cards below the selected one
    if (relativePosition === 1) {
      return '17vh' // First card below: 17%
    }
    if (relativePosition === 2) {
      return '8.5vh' // Second card below: 8.5% (half of 17)
    }
    if (relativePosition === 3) {
      return '4.25vh' // Third card below: 4.25%
    }
    if (relativePosition >= 4) {
      return '4.25vh' // Remaining cards below: 4.25% (minimum visible sliver)
    }

    // Cards above the selected one (shouldn't happen with selectedIndex=0, but just in case)
    if (relativePosition === -1) {
      return '17vh' // First card above: 17%
    }
    if (relativePosition === -2) {
      return '8.5vh' // Second card above: 8.5%
    }
    if (relativePosition <= -3) {
      return '4.25vh' // Remaining cards above: minimum sliver
    }

    return '4.25vh' // Fallback
  }

  // Calculate opacity - all cards fully visible
  const getOpacity = () => {
    if (isSelected) return 1
    if (Math.abs(relativePosition) === 1) return 0.9
    if (Math.abs(relativePosition) === 2) return 0.8
    return 0.7 // Minimum opacity for visibility
  }

  // Handle click: first tap selects, second tap navigates
  const handleClick = (e: React.MouseEvent) => {
    if (!isSelected) {
      // First tap: select this card
      e.preventDefault()
      onSelect(index)
    } else {
      // Second tap: navigate to project page
      router.push(`/work/${project.slug}`)
    }
  }

  return (
    <div
      className="flex-shrink-0 w-full transition-all duration-500 ease-out mb-2"
      style={{
        height: getCardHeight(),
        opacity: getOpacity()
      }}
    >
      <div className="h-full w-full flex flex-col">
        {/* Image - clickable */}
        <div
          onClick={handleClick}
          className="block w-full relative overflow-hidden cursor-pointer"
          style={{
            borderRadius: '24px',
            flex: isSelected ? '1 1 auto' : '1 1 100%',
            minHeight: 0
          }}
        >
          {/* Project Image - No mask, fully visible */}
          <Media
            media={thumbnailMedia}
            className="w-full h-full object-cover"
            alt={`${project.title} thumbnail`}
          />
        </div>

        {/* Title box - Only show on selected card, below the image */}
        {isSelected && (
          <div
            onClick={handleClick}
            className="bg-black text-white font-ui font-bold px-6 py-3 mt-2 cursor-pointer"
            style={{
              fontSize: '1.2rem',
              borderTopLeftRadius: '24px',
              borderBottomLeftRadius: '24px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px'
            }}
          >
            {project.title}
          </div>
        )}
      </div>
    </div>
  )
}
