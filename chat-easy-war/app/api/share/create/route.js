import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req){
  try{
    const { messageId } = await req.json();
    if (!messageId) return NextResponse.json({ error:'Missing messageId' }, { status:400 });
    const proto = req.headers.get('x-forwarded-proto') || 'http';
    const host  = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3001';
    const shareId = 'share-' + Math.random().toString(36).slice(2);
    const url = `${proto}://${host}/share/${shareId}`;
    return NextResponse.json({ ok:true, shareId, url });
  }catch(e){ return NextResponse.json({ error:String(e) }, { status:500 }); }
}
