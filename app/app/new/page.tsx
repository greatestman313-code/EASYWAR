'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NewChat(){
  useEffect(()=>{
    async function run(){
      const { data } = await supabase.auth.getUser();
      if(!data.user){ location.href='/'; return; }
      const res = await fetch('/api/chats/new', { method: 'POST', body: JSON.stringify({ user_id: data.user.id, title: 'محادثة جديدة' })});
      const j = await res.json();
      if(j.ok) location.href = `/app/chat/${j.chat_id}`;
    }
    run();
  },[]);
  return <div className="p-6">جاري إنشاء محادثة جديدة…</div>
}
