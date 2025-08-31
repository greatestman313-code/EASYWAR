'use client'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage(){
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  const loginEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('جارٍ الإرسال…')
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/chat' } })
    setStatus(error ? error.message : 'تحقق من بريدك، تم إرسال رابط الدخول.')
  }

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/chat' } })
  }

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:grid place-items-center bg-neutral-800">
        <div className="text-center space-y-2">
          <div className="text-6xl">📈</div>
          <h2 className="text-2xl font-bold">نمُوّك يبدأ هنا</h2>
          <p className="text-neutral-300">واجهة تسجيل آمنة مع Supabase.</p>
        </div>
      </div>
      <div className="grid place-items-center p-8">
        <form onSubmit={loginEmail} className="w-full max-w-sm space-y-4">
          <h1 className="text-3xl font-extrabold text-center">تسجيل الدخول</h1>
          <input className="w-full rounded-xl bg-neutral-800 border border-white/10 p-3"
                 placeholder="you@email.com" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <button type="submit" className="w-full rounded-xl bg-white/10 hover:bg-white/20 p-3">أرسل رابط الدخول</button>
          <div className="text-center text-neutral-400">أو</div>
          <button type="button" onClick={loginGoogle} className="w-full rounded-xl bg-white text-neutral-900 p-3">دخول عبر Google</button>
          {status && <div className="text-center text-sm text-neutral-400">{status}</div>}
        </form>
      </div>
    </main>
  )
}
