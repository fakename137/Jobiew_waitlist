/**
 * Rate limiting implementation to prevent abuse
 * Tracks signup attempts by IP address
 */

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

// In-memory store for rate limiting
// In production, use Redis or a database for distributed systems
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const RATE_LIMIT_CONFIG = {
  maxAttempts: 5, // Maximum number of signups allowed
  windowMs: 60 * 60 * 1000, // Time window in milliseconds (1 hour)
  blockDurationMs: 60 * 60 * 1000, // How long to block after exceeding limit (1 hour)
};

/**
 * Clean up old entries from the rate limit store
 * Remove entries older than the rate limit window
 */
function cleanupOldEntries() {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_CONFIG.windowMs - RATE_LIMIT_CONFIG.blockDurationMs;
  
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.lastAttempt < cutoff) {
      rateLimitStore.delete(ip);
    }
  }
}

/**
 * Check if an IP address has exceeded the rate limit
 * @param ip - The IP address to check
 * @returns Object with isBlocked status and remaining attempts
 */
export function checkRateLimit(ip: string): {
  isBlocked: boolean;
  remainingAttempts: number;
  resetTime?: Date;
  message?: string;
} {
  // Clean up old entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    cleanupOldEntries();
  }

  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // No previous attempts from this IP
  if (!entry) {
    return {
      isBlocked: false,
      remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts,
    };
  }

  // Check if the time window has expired
  const timeSinceFirstAttempt = now - entry.firstAttempt;
  
  if (timeSinceFirstAttempt > RATE_LIMIT_CONFIG.windowMs) {
    // Window has expired, reset the counter
    rateLimitStore.delete(ip);
    return {
      isBlocked: false,
      remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts,
    };
  }

  // Check if limit has been exceeded
  if (entry.count >= RATE_LIMIT_CONFIG.maxAttempts) {
    const resetTime = new Date(entry.firstAttempt + RATE_LIMIT_CONFIG.windowMs);
    return {
      isBlocked: true,
      remainingAttempts: 0,
      resetTime,
      message: `Too many signup attempts. Please try again after ${resetTime.toLocaleTimeString()}.`,
    };
  }

  // Still within limits
  return {
    isBlocked: false,
    remainingAttempts: RATE_LIMIT_CONFIG.maxAttempts - entry.count,
  };
}

/**
 * Record a signup attempt from an IP address
 * @param ip - The IP address to record
 */
export function recordAttempt(ip: string): void {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry) {
    // First attempt from this IP
    rateLimitStore.set(ip, {
      count: 1,
      firstAttempt: now,
      lastAttempt: now,
    });
  } else {
    // Check if we need to reset the window
    const timeSinceFirstAttempt = now - entry.firstAttempt;
    
    if (timeSinceFirstAttempt > RATE_LIMIT_CONFIG.windowMs) {
      // Reset window
      rateLimitStore.set(ip, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
    } else {
      // Increment counter
      entry.count++;
      entry.lastAttempt = now;
      rateLimitStore.set(ip, entry);
    }
  }
}

/**
 * Get the client IP address from the request
 * Handles various proxy headers
 */
export function getClientIP(request: Request): string {
  const headers = request.headers;
  
  // Check various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }
  
  const cfConnectingIP = headers.get('cf-connecting-ip'); // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }
  
  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Get current rate limit stats (for monitoring/debugging)
 */
export function getRateLimitStats(): {
  totalTrackedIPs: number;
  config: typeof RATE_LIMIT_CONFIG;
} {
  return {
    totalTrackedIPs: rateLimitStore.size,
    config: RATE_LIMIT_CONFIG,
  };
}

/**
 * Manually clear rate limit for an IP (admin function)
 */
export function clearRateLimit(ip: string): boolean {
  return rateLimitStore.delete(ip);
}

/**
 * Clear all rate limits (admin function)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}



