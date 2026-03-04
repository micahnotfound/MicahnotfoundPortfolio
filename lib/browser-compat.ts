/**
 * Browser Compatibility Utilities
 *
 * This file contains utilities and polyfills to ensure the site works
 * across all major browsers: Chrome, Firefox, Safari, Edge, and mobile browsers.
 */

/**
 * Safely check if we're in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

/**
 * Get viewport dimensions safely
 */
export const getViewportDimensions = () => {
  if (!isBrowser()) {
    return { width: 0, height: 0 }
  }

  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  }
}

/**
 * Check if device is mobile
 */
export const isMobile = (): boolean => {
  if (!isBrowser()) return false

  const { width } = getViewportDimensions()
  return width < 768
}

/**
 * Check if device is desktop
 */
export const isDesktop = (): boolean => {
  if (!isBrowser()) return false

  const { width } = getViewportDimensions()
  return width >= 768
}

/**
 * Safely use requestAnimationFrame with fallback
 */
export const safeRequestAnimationFrame = (callback: FrameRequestCallback): number => {
  if (!isBrowser()) return 0

  if (typeof window.requestAnimationFrame !== 'undefined') {
    return window.requestAnimationFrame(callback)
  }

  // Fallback for older browsers
  return window.setTimeout(() => callback(Date.now()), 1000 / 60) as unknown as number
}

/**
 * Safely use cancelAnimationFrame with fallback
 */
export const safeCancelAnimationFrame = (id: number): void => {
  if (!isBrowser()) return

  if (typeof window.cancelAnimationFrame !== 'undefined') {
    window.cancelAnimationFrame(id)
  } else {
    window.clearTimeout(id)
  }
}

/**
 * Check if touch events are supported
 */
export const supportsTouchEvents = (): boolean => {
  if (!isBrowser()) return false

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (typeof (window as any).DocumentTouch !== 'undefined' &&
     document instanceof (window as any).DocumentTouch)
  )
}

/**
 * Check if passive event listeners are supported
 */
export const supportsPassiveEvents = (): boolean => {
  if (!isBrowser()) return false

  let passiveSupported = false

  try {
    const options: any = {
      get passive() {
        passiveSupported = true
        return false
      }
    }

    window.addEventListener('test' as any, null as any, options)
    window.removeEventListener('test' as any, null as any, options)
  } catch (err) {
    passiveSupported = false
  }

  return passiveSupported
}

/**
 * Get event listener options with passive support detection
 */
export const getEventListenerOptions = (options?: AddEventListenerOptions): AddEventListenerOptions | boolean => {
  if (!supportsPassiveEvents()) {
    return options?.capture || false
  }

  return options || {}
}

/**
 * Detect browser type
 */
export const detectBrowser = (): string => {
  if (!isBrowser()) return 'unknown'

  const userAgent = navigator.userAgent.toLowerCase()

  if (userAgent.indexOf('edg/') > -1) return 'edge'
  if (userAgent.indexOf('chrome') > -1 && userAgent.indexOf('edg/') === -1) return 'chrome'
  if (userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1) return 'safari'
  if (userAgent.indexOf('firefox') > -1) return 'firefox'

  return 'unknown'
}

/**
 * Check if browser supports modern features
 */
export const supportsModernFeatures = (): boolean => {
  if (!isBrowser()) return false

  try {
    // Check for essential modern features
    return (
      typeof Promise !== 'undefined' &&
      typeof Object.assign !== 'undefined' &&
      typeof Array.from !== 'undefined' &&
      typeof window.requestAnimationFrame !== 'undefined'
    )
  } catch (err) {
    return false
  }
}

/**
 * Debounce function for performance
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function for performance
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => { inThrottle = false }, limit)
    }
  }
}
