import { NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/api-guard';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req){
  const guard = await assertAdmin(req);
  if (guard instanceof NextResponse) return guard;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
  return NextResponse.json({ items: [], count: 0, page, pageSize });
}
