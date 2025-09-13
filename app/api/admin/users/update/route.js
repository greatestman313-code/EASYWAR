import { NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/api-guard';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req){
  const guard = await assertAdmin(req);
  if (guard instanceof NextResponse) return guard;
  const { userId, role, plan } = await req.json();
  if (!userId) return NextResponse.json({ error:'Missing userId' }, { status:400 });
  if (!role && !plan) return NextResponse.json({ error:'Nothing to update' }, { status:400 });
  return NextResponse.json({ ok:true });
}
