import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _admin: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient | null {
  if (_admin) return _admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE
  if (!url || !key) return null
  _admin = createClient(url, key)
  return _admin
}
