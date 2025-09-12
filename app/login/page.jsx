'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export default function LoginPage(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function loginGuest(){
    setErr('');
    const n = name.trim();
    const e = email.trim();
    if (!n || !e) { setErr('الاسم والبريد الإلكتروني مطلوبان'); return; }
    try{
      localStorage.setItem('guest_user', JSON.stringify({ name:n, email:e, plan:'free', provider:'guest', at: Date.now() }));
      window.location.href = '/chat';
    }catch(ex){ setErr('تعذر الحفظ محليًا'); }
  }

  async function signInGoogle(){
    setBusy(true); setErr('');
    try{
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${origin}/auth/callback` }
      });
      if (error) setErr(error.message || 'تعذر بدء تسجيل الدخول بجوجل');
    } finally { setBusy(false); }
  }

  function quickGuest(){
    localStorage.setItem('guest_user', JSON.stringify({ name: name.trim() || 'ضيف', email: email.trim() || 'guest@example.com', plan:'free', provider:'guest', at: Date.now() }));
    window.location.href = '/chat';
  }

  return (
    <main className="min-h-dvh bg-bgdark text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl grid md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block">
          <h2 className="text-3xl font-bold mb-2">تسجيل الدخول</h2>
          <div className="opacity-80">مرحبًا بك في <span className="font-bold">CHAT EASY WAR</span></div>
        </div>
        <div className="bg-bgsoft border border-[#333] rounded p-6">
          <div className="text-center text-lg font-bold mb-4">تسجيل الدخول</div>
          {err && <div className="mb-3 text-sm text-red-400">{err}</div>}
          <input className="w-full p-3 rounded bg-bgdark outline-none mb-3" placeholder="الاسم" value={name} onChange={e=>setName(e.target.value)} />
          <input className="w-full p-3 rounded bg-bgdark outline-none mb-4" placeholder="البريد الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)} />
          <button onClick={loginGuest} className="w-full py-2 rounded bg-cyan-400 text-black hover:opacity-90 mb-2">دخول</button>
          <button onClick={signInGoogle} disabled={busy} className="w-full py-2 rounded bg-[#222] hover:bg-[#1a1a1a] mb-2">تسجيل بحساب Google</button>
          <button onClick={quickGuest} className="w-full py-2 rounded bg-[#222] hover:bg-[#1a1a1a]">دخول كضيف</button>
        </div>
      </div>
    </main>
  );
}
