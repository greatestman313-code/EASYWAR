import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req, { params }){
  const { id } = params;
  // هنا يمكنك جلب من جدول shares → message
  // مؤقتاً نرجع رسالة ثابتة
  return NextResponse.json({
    ok: true,
    sharedAt: new Date().toISOString(),
    message: {
      id: 'm1', role: 'assistant', content: 'هذه رسالة مشتركة كمثال', createdAt: new Date().toISOString(),
      attachments: []
    }
  });
}
