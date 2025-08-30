import { useCallback, useRef, useEffect } from 'react'

interface UseHorizontalScrollMappingOptions {
  /**
   * The scrollable element ref
   */
  scrollRef: React.RefObject<HTMLElement>
  /**
   * Sensitivity multiplier for wheel events (default: 1)
   */
  sensitivity?: number
  /**
   * Whether to enable the mapping (default: true)
   */
  enabled?: boolean
  /**
   * Throttle delay in milliseconds (default: 16 for 60fps)
   */
  throttleMs?: number
}

interface UseHorizontalScrollMappingReturn {
  /**
   * Whether the mapping is currently active
   */
  isActive: boolean
  /**
   * Manually trigger a horizontal scroll
   */
  scrollBy: (delta: number) => void
}

/**
 * Custom hook for mapping vertical wheel events to horizontal scrolling
 * with throttling and reduced motion support
 */
export function useHorizontalScrollMapping({
  scrollRef,
  sensitivity = 1,
  enabled = true,
  throttleMs = 16
}: UseHorizontalScrollMappingOptions): UseHorizontalScrollMappingReturn {
  const isActiveRef = useRef(false)
  const lastScrollTimeRef = useRef(0)
  const rafIdRef = useRef<number | null>(null)

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false

  // Throttled scroll function
  const throttledScroll = useCallback((delta: number) => {
    const now = Date.now()
    if (now - lastScrollTimeRef.current < throttleMs) {
      return
    }
    
    lastScrollTimeRef.current = now
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      const element = scrollRef.current
      if (element) {
        const scrollAmount = delta * sensitivity
        element.scrollLeft += scrollAmount
      }
    })
  }, [scrollRef, sensitivity, throttleMs])

  // Manual scroll function
  const scrollBy = useCallback((delta: number) => {
    if (!enabled || prefersReducedMotion) return
    throttledScroll(delta)
  }, [enabled, prefersReducedMotion, throttledScroll])

  // Wheel event handler
  const handleWheel = useCallback((event: WheelEvent) => {
    if (!enabled || prefersReducedMotion) return
    
    // Prevent default vertical scrolling
    event.preventDefault()
    
    // Map vertical wheel delta to horizontal scroll
    const delta = event.deltaY
    throttledScroll(delta)
    
    isActiveRef.current = true
  }, [enabled, prefersReducedMotion, throttledScroll])

  // Set up event listeners
  useEffect(() => {
    const element = scrollRef.current
    if (!element || !enabled || prefersReducedMotion) {
      isActiveRef.current = false
      return
    }

    // Add wheel event listener
    element.addEventListener('wheel', handleWheel, { passive: false })
    
    // Reset active state when scrolling stops
    const handleScrollEnd = () => {
      isActiveRef.current = false
    }
    
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      isActiveRef.current = true
      scrollTimeout = setTimeout(handleScrollEnd, 150)
    }
    
    element.addEventListener('scroll', handleScroll)

    return () => {
      element.removeEventListener('wheel', handleWheel)
      element.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [scrollRef, enabled, prefersReducedMotion, handleWheel])

  return {
    isActive: isActiveRef.current,
    scrollBy
  }
}
