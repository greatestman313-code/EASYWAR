import { NextResponse } from 'next/server';
import { assertAuth } from '@/lib/api-guard';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req){
  const guard = await assertAuth(req);
  if (guard instanceof NextResponse) return guard;
  const { sessionId } = await req.json();
  if (!sessionId) return NextResponse.json({ error:'Missing sessionId' }, { status:400 });
  return NextResponse.json({ ok:true });
}
