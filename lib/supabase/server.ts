import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Don't try to parse Supabase cookie values
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { path: string; maxAge?: number; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; httpOnly?: boolean }) {
          try {
            // Set the cookie with the raw value
            cookieStore.set(name, value, options)
          } catch {
            // Silent error in read-only contexts
          }
        },
        remove(name: string, options: { path: string }) {
          try {
            cookieStore.delete(name)
          } catch {
            // Silent error in read-only contexts
          }
        }
      }
    }
  )
}

export async function getSession() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user ? { user } : null
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function getUserDetails() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error getting user details:', error)
    return null
  }
}
