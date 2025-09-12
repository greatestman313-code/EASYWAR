'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function AuthCallbackPage(){
  const [msg, setMsg] = useState('...جارٍ التحقق من تسجيل الدخول');
  useEffect(()=>{
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    async function run(){
      try{
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setMsg('تعذر جلب المستخدم. سيتم إعادتك إلى صفحة الدخول.');
          setTimeout(()=>{ window.location.href = '/'; }, 1500); return;
        }
        const res = await fetch('/api/auth/upsert-user', {
          method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ email: user.email, name: user.user_metadata?.name || '', picture: user.user_metadata?.avatar_url || '' })
        });
        if (!res.ok) console.error(await res.text());
        window.location.href = '/chat';
      } catch (e) {
        setMsg('حدث خطأ في المعالجة. سيتم إعادتك إلى صفحة الدخول.');
        setTimeout(()=>{ window.location.href = '/'; }, 1500);
      }
    }
    run();
  },[]);
  return (
    <div className="min-h-dvh bg-bgdark text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-bold">إتمام تسجيل الدخول...</div>
        <div className="opacity-80 mt-2">{msg}</div>
      </div>
    </div>
  );
}
