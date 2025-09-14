
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const sb = supabaseServer()
  const body = await req.json().catch(()=>({}))
  const { data, error } = await sb.from('sessions').update({
    title: body.title, archived: body.archived
  }).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const sb = supabaseServer()
  const { error } = await sb.from('sessions').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
