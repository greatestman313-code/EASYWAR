
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  const sb = supabaseServer()
  const body = await req.json()
  // Save both user and assistant messages in one go
  const rows = (body?.messages ?? []).map((m: any) => ({
    session_id: body.session_id,
    role: m.role,
    content: m.content,
    meta: m.meta ?? null
  }))
  const { data, error } = await sb.from('messages').insert(rows).select('id, role')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ids: data?.map(r => r.id) ?? [] })
}
