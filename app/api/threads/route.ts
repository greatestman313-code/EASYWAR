import { supabaseAdmin } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest){
  const userId = req.headers.get('x-user-id')
  if(!userId) return new Response('Unauthorized', { status: 401 })
  const { data, error } = await supabaseAdmin().from('threads').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if(error) return new Response(error.message, { status: 500 })
  return Response.json({ threads: data })
}

export async function POST(req: NextRequest){
  const userId = req.headers.get('x-user-id')
  if(!userId) return new Response('Unauthorized', { status: 401 })
  const { title } = await req.json()
  const { data, error } = await supabaseAdmin().from('threads').insert({ user_id: userId, title }).select().single()
  if(error) return new Response(error.message, { status: 500 })
  return Response.json({ thread: data })
}
