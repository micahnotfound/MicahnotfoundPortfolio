/**
 * Analytics event types
 */
export type AnalyticsEventType = 
  | 'page_view'
  | 'project_view'
  | 'project_click'
  | 'contact_click'
  | 'scroll_interaction'
  | 'carousel_interaction'
  | 'gallery_interaction'
  | 'engagement'
  | 'performance'
  | 'error'

/**
 * Analytics event properties
 */
export interface AnalyticsEvent {
  type: AnalyticsEventType
  properties?: Record<string, any>
  timestamp?: number
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean
  debug?: boolean
  endpoint?: string
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV === 'development'
}

let config = { ...defaultConfig }

/**
 * Initialize analytics with custom configuration
 */
export function initAnalytics(customConfig: Partial<AnalyticsConfig> = {}): void {
  config = { ...defaultConfig, ...customConfig }
  
  if (config.debug) {
    console.log('Analytics initialized:', config)
  }
}

/**
 * Track an analytics event
 */
export function trackEvent(
  type: AnalyticsEventType,
  properties: Record<string, any> = {}
): void {
  if (!config.enabled) return
  
  const event: AnalyticsEvent = {
    type,
    properties,
    timestamp: Date.now()
  }
  
  // In production, this would send to your analytics service
  if (config.debug) {
    console.log('Analytics Event:', event)
  }
  
  // Example: Send to analytics endpoint
  if (config.endpoint) {
    fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event)
    }).catch(error => {
      if (config.debug) {
        console.error('Analytics error:', error)
      }
    })
  }
}

/**
 * Track page view
 */
export function trackPageView(page: string, properties: Record<string, any> = {}): void {
  trackEvent('page_view', {
    page,
    url: typeof window !== 'undefined' ? window.location.href : '',
    ...properties
  })
}

/**
 * Track project view
 */
export function trackProjectView(
  projectSlug: string,
  properties: Record<string, any> = {}
): void {
  trackEvent('project_view', {
    project_slug: projectSlug,
    ...properties
  })
}

/**
 * Track project click
 */
export function trackProjectClick(
  projectSlug: string,
  properties: Record<string, any> = {}
): void {
  trackEvent('project_click', {
    project_slug: projectSlug,
    ...properties
  })
}

/**
 * Track contact click
 */
export function trackContactClick(
  method: string,
  properties: Record<string, any> = {}
): void {
  trackEvent('contact_click', {
    contact_method: method,
    ...properties
  })
}

/**
 * Track scroll interaction
 */
export function trackScrollInteraction(
  direction: 'horizontal' | 'vertical',
  component: string,
  properties: Record<string, any> = {}
): void {
  trackEvent('scroll_interaction', {
    direction,
    component,
    ...properties
  })
}

/**
 * Track carousel interaction
 */
export function trackCarouselInteraction(
  action: 'next' | 'prev' | 'autoplay' | 'pause',
  component: string,
  properties: Record<string, any> = {}
): void {
  trackEvent('carousel_interaction', {
    action,
    component,
    ...properties
  })
}

/**
 * Track gallery interaction
 */
export function trackGalleryInteraction(
  action: 'scroll' | 'zoom' | 'fullscreen',
  component: string,
  properties: Record<string, any> = {}
): void {
  trackEvent('gallery_interaction', {
    action,
    component,
    ...properties
  })
}

/**
 * Track user engagement metrics
 */
export function trackEngagement(
  metric: 'time_on_page' | 'scroll_depth' | 'interaction_count',
  value: number,
  properties: Record<string, any> = {}
): void {
  trackEvent('engagement', {
    metric,
    value,
    ...properties
  })
}

/**
 * Track performance metrics
 */
export function trackPerformance(
  metric: 'page_load' | 'image_load' | 'interaction_delay',
  value: number,
  properties: Record<string, any> = {}
): void {
  trackEvent('performance', {
    metric,
    value,
    ...properties
  })
}

/**
 * Track error events
 */
export function trackError(
  error: Error | string,
  context: string,
  properties: Record<string, any> = {}
): void {
  trackEvent('error', {
    error_message: typeof error === 'string' ? error : error.message,
    error_stack: error instanceof Error ? error.stack : undefined,
    context,
    ...properties
  })
}

/**
 * Get analytics configuration
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return { ...config }
}

/**
 * Enable/disable analytics
 */
export function setAnalyticsEnabled(enabled: boolean): void {
  config.enabled = enabled
}

/**
 * Set analytics debug mode
 */
export function setAnalyticsDebug(debug: boolean): void {
  config.debug = debug
}
