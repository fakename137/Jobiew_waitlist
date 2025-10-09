import { supabase } from './supabase'

export interface WaitlistUser {
  id: string
  email: string
  invite_code?: string
  referred_by_code?: string
  referral_count: number
  position: number
  created_at: string
  updated_at: string
}

export interface WaitlistResult {
  success: boolean
  message: string
  user?: WaitlistUser
  totalUsers?: number
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function addToWaitlist(
  email: string, 
  inviteCode?: string
): Promise<WaitlistResult> {
  try {
    console.log('Adding to waitlist:', { email, inviteCode })

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError)
      return { success: false, message: 'Database error' }
    }

    if (existingUser) {
      console.log('Email already exists in waitlist')
      return { 
        success: false, 
        message: 'Email already registered',
        user: existingUser as WaitlistUser
      }
    }

    // Get current position (count of existing users)
    const { count: position, error: countError } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error getting position:', countError)
      return { success: false, message: 'Database error' }
    }

    const nextPosition = (position || 0) + 1
    const userInviteCode = generateInviteCode()

    // Validate invite code if provided
    if (inviteCode) {
      const { data: referrer, error: referrerError } = await supabase
        .from('waitlist_users')
        .select('id, invite_code')
        .eq('invite_code', inviteCode)
        .single()

      if (referrerError && referrerError.code !== 'PGRST116') {
        console.error('Error validating invite code:', referrerError)
      }

      if (!referrer) {
        console.log('Invalid invite code provided:', inviteCode)
        // Continue anyway but don't track the referral
      }
    }

    // Insert new user with referral tracking
    const { data: newUser, error: insertError } = await supabase
      .from('waitlist_users')
      .insert({
        email,
        invite_code: userInviteCode,
        referred_by_code: inviteCode || null,
        position: nextPosition,
        referral_count: 0
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting user:', insertError)
      return { success: false, message: 'Failed to join waitlist' }
    }

    console.log('Successfully added user to waitlist:', newUser)
    
    // Get updated total count for email
    const { count: totalUsers } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })
    
    return {
      success: true,
      message: 'Successfully joined the waitlist!',
      user: newUser,
      totalUsers: totalUsers || nextPosition
    }

  } catch (error) {
    console.error('Unexpected error in addToWaitlist:', error)
    return { success: false, message: 'Internal server error' }
  }
}

export async function getUserByEmail(email: string): Promise<WaitlistUser | null> {
  try {
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user by email:', error)
      return null
    }

    return data as WaitlistUser
  } catch (error) {
    console.error('Error in getUserByEmail:', error)
    return null
  }
}

export async function getUserByInviteCode(inviteCode: string): Promise<WaitlistUser | null> {
  try {
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error getting user by invite code:', error)
      return null
    }

    return data as WaitlistUser
  } catch (error) {
    console.error('Error in getUserByInviteCode:', error)
    return null
  }
}

export async function getWaitlistStats(): Promise<{
  totalUsers: number
  recentUsers: WaitlistUser[]
}> {
  try {
    // Get total count
    const { count: totalUsers, error: countError } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error getting total count:', countError)
      return { totalUsers: 0, recentUsers: [] }
    }

    // Get top users by position (leaderboard)
    const { data: recentUsers, error: recentError } = await supabase
      .from('waitlist_users')
      .select('*')
      .order('position', { ascending: true })
      .limit(10)

    if (recentError) {
      console.error('Error getting recent users:', recentError)
      return { totalUsers: totalUsers || 0, recentUsers: [] }
    }

    return {
      totalUsers: totalUsers || 0,
      recentUsers: recentUsers || []
    }
  } catch (error) {
    console.error('Error in getWaitlistStats:', error)
    return { totalUsers: 0, recentUsers: [] }
  }
}

export async function getLeaderboard(limit: number = 10): Promise<WaitlistUser[]> {
  try {
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('*')
      .order('position', { ascending: true })
      .limit(limit)

    if (error) {
      console.error('Error getting leaderboard:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getLeaderboard:', error)
    return []
  }
}

export async function getTotalWaitlistCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error getting total waitlist count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getTotalWaitlistCount:', error)
    return 0
  }
}
