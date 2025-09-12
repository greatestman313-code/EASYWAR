'use client';
export const dynamic = 'force-dynamic';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
export default function LogoutPage(){
  useEffect(()=>{ (async ()=>{ try{ const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); await supabase.auth.signOut(); }catch{} window.location.href='/'; })(); },[]);
  return <div className="min-h-dvh bg-bgdark text-white flex items-center justify-center">...جارٍ تسجيل الخروج</div>;
}
