import { useCallback, useRef, useEffect, useState } from 'react'

interface UseRailScrollSyncOptions {
  /**
   * The rail element ref
   */
  railRef: React.RefObject<HTMLElement>
  /**
   * The scrollable content element ref
   */
  contentRef: React.RefObject<HTMLElement>
  /**
   * Whether to enable the sync (default: true)
   */
  enabled?: boolean
  /**
   * Throttle delay in milliseconds (default: 16 for 60fps)
   */
  throttleMs?: number
  /**
   * Callback when rail scroll changes
   */
  onRailScroll?: (progress: number) => void
  /**
   * Callback when content scroll changes
   */
  onContentScroll?: (progress: number) => void
}

interface UseRailScrollSyncReturn {
  /**
   * Current scroll progress [0..1]
   */
  progress: number
  /**
   * Whether sync is currently active
   */
  isActive: boolean
  /**
   * Manually set rail progress
   */
  setRailProgress: (progress: number) => void
  /**
   * Manually set content progress
   */
  setContentProgress: (progress: number) => void
}

/**
 * Custom hook for synchronizing rail scroll with content scroll
 * Provides bidirectional sync with progress tracking
 */
export function useRailScrollSync({
  railRef,
  contentRef,
  enabled = true,
  throttleMs = 16,
  onRailScroll,
  onContentScroll
}: UseRailScrollSyncOptions): UseRailScrollSyncReturn {
  const [progress, setProgress] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const lastUpdateTimeRef = useRef(0)
  const isUpdatingRef = useRef(false)
  const rafIdRef = useRef<number | null>(null)

  // Calculate scroll progress
  const calculateProgress = useCallback((element: HTMLElement): number => {
    const { scrollTop, scrollHeight, clientHeight } = element
    const maxScroll = scrollHeight - clientHeight
    return maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0
  }, [])

  // Throttled update function
  const throttledUpdate = useCallback((newProgress: number) => {
    const now = Date.now()
    if (now - lastUpdateTimeRef.current < throttleMs) {
      return
    }
    
    lastUpdateTimeRef.current = now
    
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current)
    }
    
    rafIdRef.current = requestAnimationFrame(() => {
      setProgress(newProgress)
      setIsActive(true)
    })
  }, [throttleMs])

  // Set rail progress manually
  const setRailProgress = useCallback((newProgress: number) => {
    if (!enabled || !railRef.current || isUpdatingRef.current) return
    
    const clampedProgress = Math.max(0, Math.min(1, newProgress))
    const railElement = railRef.current
    
    // Calculate scroll position for rail
    const maxScroll = railElement.scrollWidth - railElement.clientWidth
    const targetScrollLeft = maxScroll * clampedProgress
    
    isUpdatingRef.current = true
    railElement.scrollLeft = targetScrollLeft
    
    // Update progress state
    throttledUpdate(clampedProgress)
    onRailScroll?.(clampedProgress)
    
    // Reset update flag
    setTimeout(() => {
      isUpdatingRef.current = false
    }, 50)
  }, [enabled, railRef, onRailScroll, throttledUpdate])

  // Set content progress manually
  const setContentProgress = useCallback((newProgress: number) => {
    if (!enabled || !contentRef.current || isUpdatingRef.current) return
    
    const clampedProgress = Math.max(0, Math.min(1, newProgress))
    const contentElement = contentRef.current
    
    // Calculate scroll position for content
    const maxScroll = contentElement.scrollHeight - contentElement.clientHeight
    const targetScrollTop = maxScroll * clampedProgress
    
    isUpdatingRef.current = true
    contentElement.scrollTop = targetScrollTop
    
    // Update progress state
    throttledUpdate(clampedProgress)
    onContentScroll?.(clampedProgress)
    
    // Reset update flag
    setTimeout(() => {
      isUpdatingRef.current = false
    }, 50)
  }, [enabled, contentRef, onContentScroll, throttledUpdate])

  // Handle rail scroll events
  const handleRailScroll = useCallback(() => {
    if (!enabled || !railRef.current || isUpdatingRef.current) return
    
    const railElement = railRef.current
    const railProgress = calculateProgress(railElement)
    
    // Update content scroll
    setContentProgress(railProgress)
  }, [enabled, railRef, calculateProgress, setContentProgress])

  // Handle content scroll events
  const handleContentScroll = useCallback(() => {
    if (!enabled || !contentRef.current || isUpdatingRef.current) return
    
    const contentElement = contentRef.current
    const contentProgress = calculateProgress(contentElement)
    
    // Update rail scroll
    setRailProgress(contentProgress)
  }, [enabled, contentRef, calculateProgress, setRailProgress])

  // Set up event listeners
  useEffect(() => {
    const railElement = railRef.current
    const contentElement = contentRef.current
    
    if (!railElement || !contentElement || !enabled) {
      setIsActive(false)
      return
    }

    // Add scroll event listeners
    railElement.addEventListener('scroll', handleRailScroll, { passive: true })
    contentElement.addEventListener('scroll', handleContentScroll, { passive: true })
    
    // Initialize progress
    const initialProgress = calculateProgress(contentElement)
    setProgress(initialProgress)

    return () => {
      railElement.removeEventListener('scroll', handleRailScroll)
      contentElement.removeEventListener('scroll', handleContentScroll)
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [railRef, contentRef, enabled, handleRailScroll, handleContentScroll, calculateProgress])

  // Reset active state when scrolling stops
  useEffect(() => {
    if (!isActive) return
    
    const timeout = setTimeout(() => {
      setIsActive(false)
    }, 150)
    
    return () => clearTimeout(timeout)
  }, [isActive])

  // Handle resize events
  useEffect(() => {
    if (!enabled) return
    
    const handleResize = () => {
      if (contentRef.current) {
        const newProgress = calculateProgress(contentRef.current)
        setProgress(newProgress)
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [enabled, contentRef, calculateProgress])

  return {
    progress,
    isActive,
    setRailProgress,
    setContentProgress
  }
}
