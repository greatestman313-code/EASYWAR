import { NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/api-guard';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req){
  const guard = await assertAdmin(req);
  if (guard instanceof NextResponse) return guard;
  // وهمي: أعِد قائمة فارغة
  return NextResponse.json({ items: [] });
}
