import { NextResponse } from 'next/server'

const publicPaths = ['/login', '/api/auth/login']

export function proxy(request) {
  const { pathname } = request.nextUrl

  // Allow public paths and all API routes (API routes handle their own auth)
  if (publicPaths.some(p => pathname.startsWith(p)) || pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Check for auth token in cookies or don't block (client-side auth handles redirect)
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
