import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;
  const isAdminPage = p.startsWith('/chat/admin');
  const isAdminApi  = p.startsWith('/api/admin');
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (n:string)=>req.cookies.get(n)?.value,
        set: (n:string,v:string,o:any)=>res.cookies.set({name:n,value:v,...o}),
        remove: (n:string,o:any)=>res.cookies.delete({name:n,...o})
      }
    }
  );

  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  if (!user) {
    if (isAdminApi) return NextResponse.json({ error:'Unauthorized' }, { status:401 });
    const url = new URL('/login', req.url); url.searchParams.set('next', p);
    return NextResponse.redirect(url);
  }

  const { data: profile } = await supabase.from('users').select('role').eq('email', user.email as string).maybeSingle();
  const role = profile?.role || 'user';
  if (role !== 'admin') {
    if (isAdminApi) return NextResponse.json({ error:'Forbidden' }, { status:403 });
    return NextResponse.redirect(new URL('/403', req.url));
  }
  return res;
}

export const config = { matcher: ['/chat/admin/:path*','/api/admin/:path*'] };
