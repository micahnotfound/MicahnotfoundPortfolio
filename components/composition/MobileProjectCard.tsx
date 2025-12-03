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
  scrollPosition?: number // Optional fractional scroll position for smooth text bubble transitions
  expansionProgress?: number // Optional expansion progress (0-1) to control when text bubbles appear
}

export function MobileProjectCard({ project, index, selectedIndex, totalCards, onSelect, scrollPosition, expansionProgress }: MobileProjectCardProps) {
  const router = useRouter()
  const isSelected = index === selectedIndex

  // Use fractional scroll position if provided (for slider page), otherwise use selectedIndex
  const effectiveScrollPos = scrollPosition !== undefined ? scrollPosition : selectedIndex
  const relativePosition = index - effectiveScrollPos // Negative = above, Positive = below, 0 = selected

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
      className="flex-shrink-0 w-full transition-all duration-500 ease-out"
      style={{
        height: '100%',
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

        {/* Title box - Grows and shrinks based on proximity to scroll position */}
        {(() => {
          // Hide text bubbles completely when carousel is collapsed (expansionProgress < 0.3)
          if (expansionProgress !== undefined && expansionProgress < 0.3) {
            return null
          }

          // Calculate text bubble visibility based on distance from scroll position
          const distance = Math.abs(relativePosition)

          // Text bubble is ONLY visible when within 1.0 unit of the scroll position
          // This ensures only 1 bubble when selected, or 2 bubbles during transition
          let heightMultiplier = 0
          if (distance < 0.15) {
            heightMultiplier = 1 // Full height when centered (fully selected)
          } else if (distance < 1.0) {
            // Smooth transition from full to zero over a tight range
            heightMultiplier = 1 - ((distance - 0.15) / 0.85)
          }
          // If distance >= 1.0, heightMultiplier stays 0 (no bubble visible)

          // Factor in expansion progress if provided (for slider page)
          if (expansionProgress !== undefined && expansionProgress < 0.95) {
            // During expansion (0.3 to 0.95), gradually fade in text bubbles
            const expansionFactor = (expansionProgress - 0.3) / 0.65 // 0 at 0.3, 1 at 0.95
            heightMultiplier *= expansionFactor
          }

          // Don't render at all if multiplier is too small
          if (heightMultiplier < 0.05) return null

          const maxHeight = 48 // Full height in pixels
          const currentHeight = maxHeight * heightMultiplier

          return (
            <div
              onClick={handleClick}
              className="bg-black text-white font-ui font-bold cursor-pointer flex-shrink-0 overflow-hidden transition-all duration-200"
              style={{
                fontSize: '1.2rem',
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: currentHeight > 24 ? '12px' : '0px',
                paddingBottom: currentHeight > 24 ? '12px' : '0px',
                marginTop: '8px',
                height: `${currentHeight}px`,
                maxHeight: `${currentHeight}px`,
                borderTopLeftRadius: '24px',
                borderBottomLeftRadius: '24px',
                borderTopRightRadius: '0px',
                borderBottomRightRadius: '0px',
                display: 'flex',
                alignItems: 'center',
                opacity: heightMultiplier
              }}
            >
              {project.title}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
