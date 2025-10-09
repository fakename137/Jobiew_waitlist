/**
 * Analytics utility for tracking page views and events
 * 
 * This is a simple client-side analytics implementation.
 * You can integrate with services like Google Analytics, Mixpanel, or Posthog later.
 */

export function trackPageView(pageName: string): void {
  if (typeof window === 'undefined') {
    return; // Don't track on server-side
  }

  try {
    console.log(`[Analytics] Page view: ${pageName}`);
    
    // Add your analytics service integration here
    // Example: window.gtag?.('event', 'page_view', { page_title: pageName });
    // Example: window.mixpanel?.track('Page View', { page: pageName });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return; // Don't track on server-side
  }

  try {
    console.log(`[Analytics] Event: ${eventName}`, properties);
    
    // Add your analytics service integration here
    // Example: window.gtag?.('event', eventName, properties);
    // Example: window.mixpanel?.track(eventName, properties);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === 'undefined') {
    return; // Don't track on server-side
  }

  try {
    console.log(`[Analytics] Identify user: ${userId}`, traits);
    
    // Add your analytics service integration here
    // Example: window.gtag?.('set', 'user_id', userId);
    // Example: window.mixpanel?.identify(userId);
  } catch (error) {
    console.error('Error identifying user:', error);
  }
}

