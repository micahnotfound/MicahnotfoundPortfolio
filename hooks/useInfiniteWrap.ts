import { useCallback, useRef, useEffect, useState } from 'react'

interface UseInfiniteWrapOptions {
  /**
   * The scrollable element ref
   */
  scrollRef: React.RefObject<HTMLElement>
  /**
   * Number of items in the original list
   */
  itemCount: number
  /**
   * Width of each item (for calculations)
   */
  itemWidth: number
  /**
   * Gap between items
   */
  gap?: number
  /**
   * Whether to enable infinite wrap (default: true)
   */
  enabled?: boolean
  /**
   * Callback when wrap occurs
   */
  onWrap?: (direction: 'forward' | 'backward') => void
}

interface UseInfiniteWrapReturn {
  /**
   * Whether infinite wrap is currently active
   */
  isActive: boolean
  /**
   * Current scroll position
   */
  scrollPosition: number
  /**
   * Manually trigger a wrap
   */
  wrapTo: (index: number) => void
}

/**
 * Custom hook for infinite wrap functionality
 * Clones items at the beginning and end for seamless looping
 */
export function useInfiniteWrap({
  scrollRef,
  itemCount,
  itemWidth,
  gap = 0,
  enabled = true,
  onWrap
}: UseInfiniteWrapOptions): UseInfiniteWrapReturn {
  const [isActive, setIsActive] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const isWrappingRef = useRef(false)
  const lastScrollLeftRef = useRef(0)
  const itemTotalWidth = itemWidth + gap

  // Calculate wrap boundaries
  const wrapThreshold = itemCount * itemTotalWidth
  const startWrapPosition = wrapThreshold
  const endWrapPosition = wrapThreshold * 2

  // Wrap to specific index
  const wrapTo = useCallback((index: number) => {
    if (!enabled || !scrollRef.current) return
    
    const element = scrollRef.current
    const targetPosition = startWrapPosition + (index * itemTotalWidth)
    
    isWrappingRef.current = true
    element.scrollLeft = targetPosition
    setScrollPosition(targetPosition)
  }, [enabled, scrollRef, startWrapPosition, itemTotalWidth])

  // Handle scroll events and wrap logic
  const handleScroll = useCallback(() => {
    if (!enabled || !scrollRef.current || isWrappingRef.current) return
    
    const element = scrollRef.current
    const currentScrollLeft = element.scrollLeft
    const scrollDelta = currentScrollLeft - lastScrollLeftRef.current
    
    setScrollPosition(currentScrollLeft)
    setIsActive(true)
    
    // Determine scroll direction
    const isScrollingForward = scrollDelta > 0
    const isScrollingBackward = scrollDelta < 0
    
    // Check if we need to wrap
    if (isScrollingForward && currentScrollLeft >= endWrapPosition) {
      // Wrap to beginning
      isWrappingRef.current = true
      element.scrollLeft = startWrapPosition
      onWrap?.('forward')
    } else if (isScrollingBackward && currentScrollLeft <= startWrapPosition) {
      // Wrap to end
      isWrappingRef.current = true
      element.scrollLeft = endWrapPosition
      onWrap?.('backward')
    }
    
    lastScrollLeftRef.current = element.scrollLeft
    
    // Reset wrapping flag after a short delay
    if (isWrappingRef.current) {
      setTimeout(() => {
        isWrappingRef.current = false
      }, 50)
    }
  }, [enabled, scrollRef, startWrapPosition, endWrapPosition, onWrap])

  // Set up scroll listener
  useEffect(() => {
    const element = scrollRef.current
    if (!element || !enabled) {
      setIsActive(false)
      return
    }

    element.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initialize scroll position
    lastScrollLeftRef.current = element.scrollLeft
    setScrollPosition(element.scrollLeft)

    return () => {
      element.removeEventListener('scroll', handleScroll)
    }
  }, [scrollRef, enabled, handleScroll])

  // Reset active state when scrolling stops
  useEffect(() => {
    if (!isActive) return
    
    const timeout = setTimeout(() => {
      setIsActive(false)
    }, 150)
    
    return () => clearTimeout(timeout)
  }, [isActive])

  return {
    isActive,
    scrollPosition,
    wrapTo
  }
}

/**
 * Helper function to create infinite wrap items
 * Clones the first and last items for seamless looping
 */
export function createInfiniteWrapItems<T>(items: T[]): T[] {
  if (items.length === 0) return items
  
  // Clone first and last items
  const firstItem = items[0]
  const lastItem = items[items.length - 1]
  
  return [lastItem, ...items, firstItem]
}

/**
 * Helper function to get the real index from infinite wrap position
 */
export function getRealIndexFromWrapPosition(
  wrapPosition: number,
  itemCount: number,
  itemWidth: number,
  gap: number = 0
): number {
  const itemTotalWidth = itemWidth + gap
  const wrapThreshold = itemCount * itemTotalWidth
  
  // Adjust for the cloned items
  const adjustedPosition = wrapPosition - wrapThreshold
  
  // Calculate real index
  const realIndex = Math.floor(adjustedPosition / itemTotalWidth)
  
  // Ensure index is within bounds
  return Math.max(0, Math.min(itemCount - 1, realIndex))
}
