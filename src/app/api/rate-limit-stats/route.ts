import { NextResponse } from 'next/server';
import { getRateLimitStats } from '@/lib/rate-limit';

/**
 * API endpoint to get rate limiting statistics
 * Useful for monitoring and debugging
 */
export async function GET() {
  try {
    const stats = getRateLimitStats();
    
    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting rate limit stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

