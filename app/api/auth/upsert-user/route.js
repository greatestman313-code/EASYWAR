import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req){
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error:'Missing email' }, { status:400 });
  return NextResponse.json({ ok:true, userId:'u1', sessionId:'s1' });
}
