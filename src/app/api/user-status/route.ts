import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail, getUserByInviteCode } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get('email')
    const inviteCode = searchParams.get('invite_code')

    if (!email && !inviteCode) {
      return NextResponse.json(
        { success: false, message: 'Email or invite code required' },
        { status: 400 }
      )
    }

    let user = null

    if (email) {
      user = await getUserByEmail(email)
    } else if (inviteCode) {
      user = await getUserByInviteCode(inviteCode)
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error in user-status API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
