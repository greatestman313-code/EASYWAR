
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ sessions: [] })
  const { data } = await sb.from('sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  return NextResponse.json({ sessions: data ?? [] })
}

export async function POST(req: NextRequest) {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const title = (body?.title || 'جلسة جديدة').toString().slice(0, 120)
  const { data, error } = await sb.from('sessions').insert({ user_id: user.id, title }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data })
}
