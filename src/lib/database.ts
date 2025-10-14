
import { supabase } from './supabase'

// Database types
export interface WaitlistUser {
  id: string
  email: string
  invite_code?: string
  position: number
  created_at: string
  updated_at: string
}

export interface WaitlistStats {
  totalUsers: number
  recentUsers: WaitlistUser[]
}

export interface AddToWaitlistResult {
  success: boolean
  user?: WaitlistUser
  totalUsers?: number
  message?: string
}

// Generate a random invite code
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Add user to waitlist
export async function addToWaitlist(email: string, inviteCode?: string): Promise<AddToWaitlistResult> {
  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking existing user:', checkError)
      return { success: false, message: 'Database error' }
    }

    if (existingUser) {
      return { 
        success: false, 
        message: 'Email already registered',
        user: existingUser,
        totalUsers: await getTotalWaitlistCount()
      }
    }

    // Get current position (count of existing users + 1)
    const { count: totalUsers, error: countError } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error getting user count:', countError)
      return { success: false, message: 'Database error' }
    }

    const position = (totalUsers || 0) + 1
    const userInviteCode = generateInviteCode()

    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('waitlist_users')
      .insert({
        email,
        invite_code: userInviteCode,
        position,
        referred_by_code: inviteCode || null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting user:', insertError)
      return { success: false, message: 'Failed to add to waitlist' }
    }

    return {
      success: true,
      user: newUser,
      totalUsers: position
    }
  } catch (error) {
    console.error('Error in addToWaitlist:', error)
    return { success: false, message: 'Internal server error' }
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<WaitlistUser | null> {
  try {
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null
      }
      console.error('Error getting user by email:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserByEmail:', error)
    return null
  }
}

// Get user by invite code
export async function getUserByInviteCode(inviteCode: string): Promise<WaitlistUser | null> {
  try {
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null
      }
      console.error('Error getting user by invite code:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getUserByInviteCode:', error)
    return null
  }
}

// Get leaderboard (top users by position)
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

// Get total waitlist count
export async function getTotalWaitlistCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('waitlist_users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error getting total count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Error in getTotalWaitlistCount:', error)
    return 0
  }
}

// Get waitlist stats
export async function getWaitlistStats(): Promise<WaitlistStats> {
  try {
    const [totalUsers, recentUsers] = await Promise.all([
      getTotalWaitlistCount(),
      getLeaderboard(10)
    ])

    return {
      totalUsers,
      recentUsers
    }
  } catch (error) {
    console.error('Error in getWaitlistStats:', error)
    return {
      totalUsers: 0,
      recentUsers: []
    }
  }
}