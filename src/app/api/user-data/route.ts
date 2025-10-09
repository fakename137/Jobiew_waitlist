import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, getLeaderboard, getTotalWaitlistCount } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    console.log('User-data API called')
    
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      console.log('Missing email parameter')
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Fetching data for email:', email)
    
    const [user, leaderboard, totalUsers] = await Promise.all([
      getUserByEmail(email),
      getLeaderboard(10),
      getTotalWaitlistCount()
    ])

    console.log('Fetched data:', { user: !!user, leaderboard: leaderboard?.length, totalUsers })

    if (!user) {
      console.log('User not found for email:', email)
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
      leaderboard,
      totalUsers
    })
  } catch (error) {
    console.error('Error in user-data API:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    )
  }
}
