'use client';
export const dynamic = 'force-dynamic';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';


export default function Landing() {
  const [busy, setBusy] = useState(false);

  async function signInGoogle(){
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setBusy(true);
    try{
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${origin}/auth/callback` }
      });
      if (error) console.error(error);
    } finally { setBusy(false); }
  }

  return (
    <main className="min-h-dvh bg-bgdark text-white flex">
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[url('/hero.jpg')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 text-center">
          <div className="text-3xl font-bold mb-2">ارفع أداء أعمالك</div>
          <div className="opacity-80">تحليلات ذكية • أدوات تسويق • دردشة ذكاء اصطناعي</div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-bgsoft border border-[#333] rounded p-6">
          <h1 className="text-xl font-bold mb-1 text-center">CHAT EASY WAR</h1>
          <div className="text-xs text-gray-400 mb-6 text-center">سجّل الدخول للمتابعة</div>
          <button onClick={signInGoogle} disabled={busy} className="w-full py-2 rounded bg-neon text-black hover:opacity-90 mb-3" title="تسجيل الدخول بجوجل">
            {busy ? 'جارٍ التوجيه إلى جوجل...' : 'تسجيل الدخول بجوجل'}
          </button>
          <a href="/login" className="w-full block text-center py-2 rounded bg-[#222] hover:bg-[#1a1a1a] mb-2">تسجيل بالبريد</a>
          <button onClick={()=>{ try{ localStorage.setItem('guest_user', JSON.stringify({ name:'ضيف', email:'guest@example.com', plan:'free', provider:'guest', at: Date.now() })); }catch{} window.location.href='/chat'; }} className="w-full py-2 rounded bg-[#222] hover:bg-[#1a1a1a]">
            دخول كضيف
          </button>
        </div>
      </div>
    </main>
  );
}
