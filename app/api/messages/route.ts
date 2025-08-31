import { supabaseAdmin } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest){
  const userId = req.headers.get('x-user-id')
  const threadId = req.nextUrl.searchParams.get('thread_id')
  if(!userId || !threadId) return new Response('Bad Request', { status: 400 })
  const { data, error } = await supabaseAdmin().from('messages').select('*').eq('user_id', userId).eq('thread_id', threadId).order('created_at', { ascending: true })
  if(error) return new Response(error.message, { status: 500 })
  return Response.json({ messages: data })
}

export async function POST(req: NextRequest){
  const userId = req.headers.get('x-user-id')
  const { thread_id, role, content } = await req.json()
  if(!userId || !thread_id || !role || !content) return new Response('Bad Request', { status: 400 })
  const { data, error } = await supabaseAdmin().from('messages').insert({ user_id: userId, thread_id, role, content }).select().single()
  if(error) return new Response(error.message, { status: 500 })
  return Response.json({ message: data })
}
