import { NextResponse } from 'next/server';
import { getZeroBounceCredits, getZeroBounceUsage } from '@/lib/zerobounce';

export async function GET() {
  try {
    // Get ZeroBounce account information
    const [credits, usage] = await Promise.all([
      getZeroBounceCredits(),
      getZeroBounceUsage()
    ]);

    return NextResponse.json({
      success: true,
      data: {
        credits,
        usage,
        hasApiKey: !!process.env.ZEROBOUNCE_API_KEY,
        environment: process.env.NODE_ENV
      }
    });
  } catch (error) {
    console.error('Error getting ZeroBounce status:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to get ZeroBounce status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}




