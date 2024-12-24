import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ 
        cookies: () => cookieStore,
        options: {
          cookies: {
            get(name: string) {
              const cookie = cookieStore.get(name)
              return cookie?.value
            },
            set(name: string, value: string, options: { path: string; maxAge?: number; domain?: string; sameSite?: 'lax' | 'strict' | 'none'; httpOnly?: boolean }) {
              cookieStore.set(name, value, options)
            },
            remove(name: string, options: { path: string }) {
              cookieStore.delete(name)
            }
          }
        }
      })
      
      await supabase.auth.exchangeCodeForSession(code)
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL('/', requestUrl.origin))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }
}
