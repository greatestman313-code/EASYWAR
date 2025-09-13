import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

type GuardOK = { user:{id:string; email?:string|null}, role:'admin'|'user'|string };

function mockGuardFromHeaders(req: NextRequest) {
  if (process.env.TEST_ENABLE_MOCK_AUTH !== '1') return null;
  const role = req.headers.get('x-mock-role');
  const email = req.headers.get('x-mock-email') || 't@example.com';
  if (!role) return null;
  return { user: { id:'test-user', email }, role };
}

function supaFromReq(req: NextRequest, res: NextResponse){
  return createServerClient(
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
}

export async function assertAuth(req: NextRequest): Promise<GuardOK|NextResponse>{
  const mocked = mockGuardFromHeaders(req);
  if (mocked) return { user: mocked.user, role: mocked.role as any };

  const res = NextResponse.next();
  const supabase = supaFromReq(req, res);
  const { data: auth, error } = await supabase.auth.getUser();
  if (error || !auth?.user) return NextResponse.json({ error:'Unauthorized' }, { status:401 });

  const { data: profile } = await supabase.from('users').select('role').eq('email', auth.user.email as string).maybeSingle();
  return { user: { id: auth.user.id, email: auth.user.email }, role: (profile?.role as any) || 'user' };
}

export async function assertAdmin(req: NextRequest): Promise<GuardOK|NextResponse>{
  const mocked = mockGuardFromHeaders(req);
  if (mocked){
    if (mocked.role !== 'admin') return NextResponse.json({ error:'Forbidden' }, { status:403 });
    return { user: mocked.user, role:'admin' };
  }
  const ok = await assertAuth(req);
  if (ok instanceof NextResponse) return ok;
  if (ok.role !== 'admin') return NextResponse.json({ error:'Forbidden' }, { status:403 });
  return ok;
}
