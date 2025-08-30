import { clamp, mapRange } from './motion'

/**
 * Calculate scroll progress for an element [0..1]
 */
export function calculateScrollProgress(element: HTMLElement): number {
  const { scrollTop, scrollHeight, clientHeight } = element
  const maxScroll = scrollHeight - clientHeight
  return maxScroll > 0 ? clamp(scrollTop / maxScroll, 0, 1) : 0
}

/**
 * Calculate horizontal scroll progress for an element [0..1]
 */
export function calculateHorizontalScrollProgress(element: HTMLElement): number {
  const { scrollLeft, scrollWidth, clientWidth } = element
  const maxScroll = scrollWidth - clientWidth
  return maxScroll > 0 ? clamp(scrollLeft / maxScroll, 0, 1) : 0
}

/**
 * Scroll element to a specific progress [0..1]
 */
export function scrollToProgress(
  element: HTMLElement,
  progress: number,
  smooth: boolean = true
): void {
  const clampedProgress = clamp(progress, 0, 1)
  const { scrollHeight, clientHeight } = element
  const maxScroll = scrollHeight - clientHeight
  const targetScrollTop = maxScroll * clampedProgress
  
  element.scrollTo({
    top: targetScrollTop,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * Scroll element to horizontal progress [0..1]
 */
export function scrollToHorizontalProgress(
  element: HTMLElement,
  progress: number,
  smooth: boolean = true
): void {
  const clampedProgress = clamp(progress, 0, 1)
  const { scrollWidth, clientWidth } = element
  const maxScroll = scrollWidth - clientWidth
  const targetScrollLeft = maxScroll * clampedProgress
  
  element.scrollTo({
    left: targetScrollLeft,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * Snap scroll to nearest item
 */
export function snapToItem(
  element: HTMLElement,
  itemWidth: number,
  gap: number = 0,
  smooth: boolean = true
): void {
  const { scrollLeft, clientWidth } = element
  const itemTotalWidth = itemWidth + gap
  const currentIndex = Math.round(scrollLeft / itemTotalWidth)
  const targetScrollLeft = currentIndex * itemTotalWidth
  
  element.scrollTo({
    left: targetScrollLeft,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * Snap scroll to specific item index
 */
export function snapToItemIndex(
  element: HTMLElement,
  index: number,
  itemWidth: number,
  gap: number = 0,
  smooth: boolean = true
): void {
  const itemTotalWidth = itemWidth + gap
  const targetScrollLeft = index * itemTotalWidth
  
  element.scrollTo({
    left: targetScrollLeft,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * Check if element is scrolled to bottom
 */
export function isScrolledToBottom(element: HTMLElement, threshold: number = 10): boolean {
  const { scrollTop, scrollHeight, clientHeight } = element
  return scrollTop + clientHeight >= scrollHeight - threshold
}

/**
 * Check if element is scrolled to top
 */
export function isScrolledToTop(element: HTMLElement, threshold: number = 10): boolean {
  return element.scrollTop <= threshold
}

/**
 * Check if element is scrolled to right edge
 */
export function isScrolledToRight(element: HTMLElement, threshold: number = 10): boolean {
  const { scrollLeft, scrollWidth, clientWidth } = element
  return scrollLeft + clientWidth >= scrollWidth - threshold
}

/**
 * Check if element is scrolled to left edge
 */
export function isScrolledToLeft(element: HTMLElement, threshold: number = 10): boolean {
  return element.scrollLeft <= threshold
}

/**
 * Get scroll direction
 */
export function getScrollDirection(
  currentScroll: number,
  previousScroll: number
): 'up' | 'down' | null {
  if (currentScroll > previousScroll) return 'down'
  if (currentScroll < previousScroll) return 'up'
  return null
}

/**
 * Get horizontal scroll direction
 */
export function getHorizontalScrollDirection(
  currentScroll: number,
  previousScroll: number
): 'left' | 'right' | null {
  if (currentScroll > previousScroll) return 'right'
  if (currentScroll < previousScroll) return 'left'
  return null
}

/**
 * Map scroll progress to a different range
 */
export function mapScrollProgress(
  element: HTMLElement,
  outMin: number,
  outMax: number
): number {
  const progress = calculateScrollProgress(element)
  return mapRange(progress, 0, 1, outMin, outMax)
}

/**
 * Map horizontal scroll progress to a different range
 */
export function mapHorizontalScrollProgress(
  element: HTMLElement,
  outMin: number,
  outMax: number
): number {
  const progress = calculateHorizontalScrollProgress(element)
  return mapRange(progress, 0, 1, outMin, outMax)
}

/**
 * Scroll element into view with offset
 */
export function scrollIntoView(
  element: HTMLElement,
  offset: number = 0,
  smooth: boolean = true
): void {
  const elementRect = element.getBoundingClientRect()
  const containerRect = element.parentElement?.getBoundingClientRect() || {
    top: 0,
    left: 0
  }
  
  const relativeTop = elementRect.top - containerRect.top
  const parentElement = element.parentElement
  const currentScrollTop = parentElement?.scrollTop || 0
  const targetScrollTop = currentScrollTop + relativeTop - offset
  
  parentElement?.scrollTo({
    top: targetScrollTop,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

/**
 * Get scroll position relative to viewport
 */
export function getScrollPosition(element: HTMLElement): { x: number; y: number } {
  return {
    x: element.scrollLeft,
    y: element.scrollTop
  }
}

/**
 * Set scroll position
 */
export function setScrollPosition(
  element: HTMLElement,
  x: number,
  y: number,
  smooth: boolean = false
): void {
  element.scrollTo({
    left: x,
    top: y,
    behavior: smooth ? 'smooth' : 'auto'
  })
}
