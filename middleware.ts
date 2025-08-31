import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const url = req.nextUrl
  const isChat = url.pathname.startsWith('/chat')
  const hasAuth = req.cookies.get('sb-access-token') || req.cookies.get('sb:token')
  if (isChat && !hasAuth) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/chat/:path*'] }
