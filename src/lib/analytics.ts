// Simple analytics tracking for page views and events
// This is a basic implementation - in production you might want to use Google Analytics, Mixpanel, etc.

interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp?: number
}

// Store events in memory (in production, you'd send these to your analytics service)
const events: AnalyticsEvent[] = []

export function trackPageView(page: string) {
  const event: AnalyticsEvent = {
    event: 'page_view',
    properties: {
      page,
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: Date.now()
    },
    timestamp: Date.now()
  }
  
  events.push(event)
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics - Page View:', event)
  }
  
  // In production, you would send this to your analytics service
  // Example: sendToAnalytics(event)
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  const event: AnalyticsEvent = {
    event: eventName,
    properties: {
      ...properties,
      timestamp: Date.now()
    },
    timestamp: Date.now()
  }
  
  events.push(event)
  
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics - Event:', event)
  }
  
  // In production, you would send this to your analytics service
  // Example: sendToAnalytics(event)
}

export function getEvents(): AnalyticsEvent[] {
  return [...events]
}

export function clearEvents(): void {
  events.length = 0
}

// Example function for sending to analytics service (implement as needed)
// function sendToAnalytics(event: AnalyticsEvent) {
//   // Send to Google Analytics, Mixpanel, PostHog, etc.
//   // Example with Google Analytics:
//   // gtag('event', event.event, event.properties)
// }
