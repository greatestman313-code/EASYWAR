import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function GET(){
  const cookieStore = await cookies()
  const access = cookieStore.get('sb-access-token')?.value || cookieStore.get('sb:token')?.value
  if (!access) return Response.json({ user: null })
  // decode via supabase client
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data: { user } } = await supa.auth.getUser(access)
  return Response.json({ user })
}
