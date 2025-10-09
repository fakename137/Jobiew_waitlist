import { NextRequest, NextResponse } from 'next/server'
import { extractTokenFromCookie, verifyToken } from '@/lib/jwt'
import { getUserByEmail } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieHeader = request.headers.get('cookie');
    const token = extractTokenFromCookie(cookieHeader);

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: 'No authentication token found'
      });
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({
        authenticated: false,
        message: 'Invalid or expired token'
      });
    }

    // Get fresh user data from database
    const user = await getUserByEmail(payload.email);

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: 'User not found'
      });
    }

    return NextResponse.json({
      authenticated: true,
      user
    });

  } catch (error) {
    console.error('Error in check-auth API:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

