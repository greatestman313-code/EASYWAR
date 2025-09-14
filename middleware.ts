import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Example: protect /chat/admin (client-side will also hide with role hook)
  if (req.nextUrl.pathname.startsWith('/chat/admin')) {
    // Here you'd check a cookie/header for role; keep open to avoid 403 on fresh demo
    // NextResponse.rewrite or redirect could go here after wiring Supabase SSR.
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*']
}
