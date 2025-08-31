import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/app')) {
    const hasCookie = req.cookies.get('sb-access-token') || req.cookies.get('supabase-auth-token');
    if (!hasCookie) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/app/:path*'] };
