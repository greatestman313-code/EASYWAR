import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(req){
  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error:'Missing sessionId' }, { status:400 });
  return NextResponse.json({ ok:true, archived:true });
}
