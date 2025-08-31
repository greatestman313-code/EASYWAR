'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')

  const loginWithGoogle = async () => {
    // Stub — integrate with Supabase Auth (Google) onClick
    window.location.href = '/api/auth/google' // Placeholder
  }

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('TODO: implement Supabase magic link for: ' + email)
  }

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block bg-gradient-to-b from-neutral-900 to-neutral-800 p-8">
        <div className="h-full rounded-3xl border border-white/10 grid place-items-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">📈</div>
            <h2 className="text-2xl font-bold">نمُوّك يبدأ هنا</h2>
            <p className="text-neutral-300">صورة رجال أعمال + أسهم ترتفع (ضع صورتك هنا).</p>
          </div>
        </div>
      </div>
      <div className="p-8 grid place-items-center">
        <form onSubmit={signInWithEmail} className="w-full max-w-sm space-y-4">
          <h1 className="text-3xl font-extrabold text-center mb-6">تسجيل الدخول</h1>
          <input
            className="w-full rounded-xl bg-neutral-800 border border-white/10 p-3 outline-none"
            placeholder="you@email.com"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full rounded-xl bg-white/10 hover:bg-white/20 p-3">أرسل رابط الدخول</button>
          <div className="text-center text-neutral-400">أو</div>
          <button type="button" onClick={loginWithGoogle} className="w-full rounded-xl bg-white text-neutral-900 p-3">دخول عبر Google</button>
        </form>
      </div>
    </main>
  )
}
