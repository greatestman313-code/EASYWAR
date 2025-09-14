import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export const supabaseServer = () => {
  const cookieStore = cookies()
  const h = headers()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options: any) {},
        remove(name: string, options: any) {},
      },
      headers: { 'x-forwarded-host': h.get('host') ?? '' }
    }
  )
}
