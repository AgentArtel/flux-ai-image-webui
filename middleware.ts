import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/config/site'

// First, create the next-intl middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

// This function will handle the Supabase auth
const withAuth = async (request: NextRequest, response: NextResponse) => {
  const supabase = createMiddlewareClient({ req: request, res: response })
  await supabase.auth.getSession()
  return response
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Handle auth callback separately
  if (pathname.startsWith('/auth/callback')) {
    const res = NextResponse.next()
    return withAuth(request, res)
  }

  // Handle root path redirect
  if (pathname === '/') {
    const url = new URL(`/${defaultLocale}`, request.url)
    return NextResponse.redirect(url)
  }

  // For all other routes, first handle i18n then auth
  const response = await intlMiddleware(request)
  return withAuth(request, response)
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api, /_next, /_vercel
    // - .*\\..*$ (files)
    '/((?!api|_next|_vercel|.*\\..*$).*)',
    // Also match root path
    '/'
  ]
}
