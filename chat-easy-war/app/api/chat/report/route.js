import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req){
  const { sessionId, userId=null, reason='', note='' } = await req.json();
  if (!sessionId) return NextResponse.json({ error:'Missing sessionId' }, { status:400 });
  return NextResponse.json({ ok:true });
}
