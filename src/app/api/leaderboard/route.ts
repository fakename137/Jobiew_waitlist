import { NextResponse } from 'next/server'
import { getWaitlistStats } from '@/lib/database'

export async function GET() {
  try {
    console.log('Leaderboard API called')
    
    const stats = await getWaitlistStats()
    console.log('Waitlist stats:', stats)

    return NextResponse.json({
      success: true,
      totalUsers: stats.totalUsers,
      recentUsers: stats.recentUsers
    })
  } catch (error) {
    console.error('Error in leaderboard API:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    )
  }
}
