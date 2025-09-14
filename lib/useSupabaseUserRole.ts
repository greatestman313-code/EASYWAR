
'use client'
import { useEffect, useState } from 'react'
import { supabaseBrowser } from './supabaseBrowser'

export type UserRole = 'guest' | 'user' | 'admin'

export function useSupabaseUserRole() {
  const [role, setRole] = useState<UserRole>('guest')
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const sb = supabaseBrowser()
    let mounted = true
    sb.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id
      if (!uid) { mounted && setRole('guest'); setLoading(false); return }
      const { data: prof } = await sb.from('profiles').select('role').eq('id', uid).single()
      mounted && setRole((prof?.role ?? 'user') as UserRole)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])
  return { role, loading }
}
