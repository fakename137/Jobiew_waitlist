import { NextRequest, NextResponse } from 'next/server'
import { addToWaitlist } from '@/lib/database'
import { generateToken } from '@/lib/jwt'
import { validateEmail } from '@/lib/email-validation'
import { Resend } from 'resend'
import { WaitlistEmailTemplate } from '@/components/email-template'

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('Join waitlist API called')
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { email, inviteCode } = body

    if (!email) {
      console.log('Missing email in request')
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email thoroughly
    console.log('Validating email:', email)
    const validationResult = await validateEmail(email, true);
    
    if (!validationResult.valid) {
      console.log('Email validation failed:', validationResult.reason)
      return NextResponse.json(
        { success: false, message: validationResult.reason || 'Invalid email address' },
        { status: 400 }
      )
    }

    console.log('Calling addToWaitlist with:', { email, inviteCode })
    const result = await addToWaitlist(email, inviteCode)
    console.log('addToWaitlist result:', result)

    if (result.success && result.user) {
      // Generate JWT token
      const token = generateToken(result.user.id, result.user.email);
      
      // Send welcome email
      try {
        const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}?invite=${result.user.invite_code}`;
        
        await resend.emails.send({
          from: 'Jobiew <onboarding@resend.dev>',
          to: [result.user.email],
          subject: `Welcome to Jobiew - You're #${result.user.position} in line!`,
          react: WaitlistEmailTemplate({
            position: result.user.position,
            totalUsers: result.totalUsers || result.user.position,
            inviteCode: result.user.invite_code || '',
            referralLink: referralLink,
          }),
        });
        
        console.log('Welcome email sent successfully to:', result.user.email);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't fail the request if email fails, just log it
      }
      
      // Create response with JWT cookie
      const response = NextResponse.json({
        success: true,
        user: result.user,
        message: 'Successfully joined the waitlist!',
        redirectUrl: `/success?user=${encodeURIComponent(JSON.stringify(result.user))}`
      });

      // Set HTTP-only cookie with JWT
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      return response;
    } else {
      console.log('addToWaitlist failed:', result.message)
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in join-waitlist API:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    )
  }
}
