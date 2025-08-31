'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function TypingEllipsis(){
  return <span className="inline-flex gap-1">
    <span className="w-2 h-2 rounded-full bg-white/70 animate-pulse"></span>
    <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse [animation-delay:150ms]"></span>
    <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse [animation-delay:300ms]"></span>
  </span>;
}

export default function Chat({ params }:{ params: { id: string }}){
  const [mode, setMode] = useState<'auto'|'advanced'|'deep'>('auto');
  const [messages, setMessages] = useState<{role:'user'|'assistant',content:string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatId = params.id;

  useEffect(()=>{
    supabase.auth.getUser().then(async ({ data }) => {
      if(!data.user){ window.location.href='/'; return; }
      setUserId(data.user.id);
      // load messages
      const { data: msgs } = await supabase.from('messages').select('role,content,created_at').eq('chat_id', chatId).order('created_at', { ascending: true });
      setMessages((msgs||[]).map((m:any)=>({ role: m.role, content: m.content })));
    });
  },[chatId]);

  useEffect(()=>{
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(){
    if(!input.trim()) return;
    const userMsg = { role:'user' as const, content: input };
    setMessages(prev=>[...prev, userMsg]);
    setInput('');
    setLoading(true);
    const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ messages:[...messages, userMsg], mode, chat_id: chatId, user_id: userId, set_title: messages.length===0 })});
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let assistant = { role:'assistant' as const, content: '' };
    setMessages(prev=>[...prev, assistant]);
    while(reader){
      const { done, value } = await reader.read();
      if(done) break;
      const chunk = decoder.decode(value);
      assistant.content += chunk;
      setMessages(prev => {
        const copy = [...prev];
        copy[copy.length-1] = {...assistant};
        return copy;
      });
    }
    setLoading(false);
  }

  async function uploadFile(ev: React.ChangeEvent<HTMLInputElement>){
    const file = ev.target.files?.[0];
    if(!file) return;
    setUploading(true);
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('uploads').upload(path, file, { upsert: true });
    setUploading(false);
    if(error){ alert(error.message); return; }
    const { data: urlData } = await supabase.storage.from('uploads').getPublicUrl(path);
    setMessages(prev=>[...prev, { role:'user', content: `تم الرفع: ${urlData.publicUrl}` }]);
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
        <div className="relative">
          <button className="btn flex items-center gap-2">
            CHAT EASY WAR <span className="badge">{process.env.NEXT_PUBLIC_APP_VERSION || 'v0.1.0'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
          </button>
          {/* Mode menu */}
          <div className="absolute mt-2 w-48 menu p-2">
            <div className="menu-item" onClick={()=>setMode('auto')}>الشات التلقائي</div>
            <div className="menu-item" onClick={()=>setMode('advanced')}>بحث متقدم</div>
            <div className="menu-item" onClick={()=>setMode('deep')}>التفكير العميق</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="icon-btn" title="مشاركة الدردشة">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.3 3.3 0 0 0 0-1.39l7-4.11A2.99 2.99 0 1 0 14 5a3 3 0 0 0 .04.5l-7 4.11a3 3 0 1 0 0 4.78l7.05 4.14c-.02.15-.04.3-.04.47a3 3 0 1 0 3-3z"/></svg>
          </button>
          <div className="relative">
            <button className="icon-btn" title="قائمة">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="18" r="1.5"/></svg>
            </button>
            <div className="absolute left-0 mt-2 menu p-2 w-44">
              <div className="menu-item">أرشفة المحادثة</div>
              <div className="menu-item">تقرير</div>
              <div className="menu-item" onClick={()=>setMessages([])}>مسح الدردشة</div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((m, i)=> (
          <div key={i} className={m.role==='user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block max-w-[80ch] ${m.role==='user'?'bg-card2':'bg-card'} rounded-2xl px-4 py-3 leading-7 text-[9pt]`}>
              {m.content}
            </div>
            {m.role==='assistant' && (
              <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                <button className="icon-btn" title="إعجاب"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09A6 6 0 0 1 19 3c3.04 0 5.5 2.46 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></button>
                <button className="icon-btn" title="عدم الإعجاب"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15 3H3v12h12V3zM21 3h-2v12h2V3z"/></svg></button>
                <button className="icon-btn" title="نسخ" onClick={()=>navigator.clipboard.writeText(m.content)}><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 1H4c-1.1 0-2 .9-2 2v12h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14h13c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
                <button className="icon-btn" title="حفظ"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z"/></svg></button>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-left text-sm text-white/80 flex items-center gap-2">
            <span className="animate-pulse">تحليل</span> <TypingEllipsis />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              className="input pr-28 max-h-[50vh]"
              placeholder="اسألني أي شيء"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button className="icon-btn" onClick={send} title="إرسال">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
              </button>
              <button className="icon-btn" title="تسجيل صوت">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 14 0h-2zM11 19h2v3h-2z"/></svg>
              </button>
              <label className="icon-btn cursor-pointer" title="رفع ملف">
                <input type="file" className="hidden" onChange={uploadFile}/>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7z"/></svg>
              </label>
            </div>
          </div>

          <div className="relative">
            <button className="icon-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5v14m-7-7h14"/></svg>
            </button>
            <div className="absolute bottom-12 right-0 menu w-56 p-2 space-y-1">
              <div className="menu-item flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14.59 2.59 13.17 4 19 9.83 20.41 8.41 14.59 2.59zM2 22h4l10.29-10.29-4-4L2 18v4z"/></svg>إضافة ملفات/صور</div>
              <div className="menu-item flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 100 18 9 9 0 000-18zm3 9l-6 4V8l6 4z"/></svg>إضافة صوت</div>
              <div className="menu-item flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 00-2 2v12l4-4h12a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>توليد صور</div>
              <div className="menu-item flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zM3 11h18v2H3zM3 17h18v2H3z"/></svg>بحث متقدم</div>
              <div className="menu-item flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6h6v-2h-4V7z"/></svg>التفكير بعمق</div>
            </div>
          </div>
        </div>
        {uploading && <div className="text-xs text-white/60 mt-1">جاري رفع الملف…</div>}
      </div>
    </div>
  );
}
