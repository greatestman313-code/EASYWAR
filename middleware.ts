
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get: (key) => req.cookies.get(key)?.value,
      set: (key, value, options) => res.cookies.set(key, value, options),
      remove: (key, options) => res.cookies.set(key, '', { ...options, maxAge: 0 })
    }
  })
  const { data: { user } } = await sb.auth.getUser()
  const url = new URL(req.url)
  if (url.pathname.startsWith('/chat/admin')) {
    if (!user) return NextResponse.redirect(new URL('/', req.url))
    const { data: prof } = await sb.from('profiles').select('role').eq('id', user.id).single()
    if (prof?.role !== 'admin') return NextResponse.redirect(new URL('/chat', req.url))
  }
  return res
}
export const config = { matcher: ['/chat/admin/:path*'] }
