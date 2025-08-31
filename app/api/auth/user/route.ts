import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function GET(){
  const cookieStore = await cookies()
  const access = cookieStore.get('sb-access-token')?.value || cookieStore.get('sb:token')?.value
  if (!access) return Response.json({ user: null })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  if (!url || !anon) return Response.json({ user: null })

  const supa = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${access}` } } })
  const { data: { user } } = await supa.auth.getUser()
  return Response.json({ user })
}
