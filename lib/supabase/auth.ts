import { createBrowserClient } from '@supabase/ssr'
import { type Provider } from '@supabase/supabase-js'

const getSupabase = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUpWithEmail = async (email: string, password: string) => {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`,
      data: {
        email_confirmed: true
      }
    },
  })
  return { data, error }
}

export const signInWithProvider = async (provider: Provider) => {
  const supabase = getSupabase()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

export const signOut = async () => {
  const supabase = getSupabase()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getSession = async () => {
  const supabase = getSupabase()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export const getUser = async () => {
  const supabase = getSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}
