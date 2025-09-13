'use client';
import { useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Composer from '@/components/Composer';
import ImageModal from '@/components/ImageModal';
import Toast from '@/components/Toast';
import { SvgCopy, SvgThumbUp, SvgThumbDown, SvgBookmark } from '@/components/icons';

const uid = () => Math.random().toString(36).slice(2);

export default function ChatPage(){
  const [collapsed,setCollapsed]=useState(false);
  const [mode,setMode]=useState('الشات التلقائي');

  // messages per session
  const [sessionId,setSessionId]=useState(()=> typeof window!=='undefined' ? (localStorage.getItem('sessionId') || uid()) : uid());
  const [sessions,setSessions]=useState(()=>{
    if(typeof window==='undefined') return {};
    try{ return JSON.parse(localStorage.getItem('sessions') || '{}'); }catch{ return {}; }
  });
  const [messages,setMessages]=useState(()=> sessions[sessionId] || [
    { id: uid(), role: 'assistant', content: 'مرحبا بك في CHAT EASY WAR', vote: null, saved:false }
  ]);
  const [saved,setSaved]=useState(()=>{
    if(typeof window==='undefined') return [];
    try{ return JSON.parse(localStorage.getItem('savedChats')||'[]'); }catch{ return []; }
  });

  const [toast,setToast]=useState('');
  const [imageOpen,setImageOpen]=useState(false);
  const chatRef = useRef(null);

  useEffect(()=>{ localStorage.setItem('sessionId', sessionId); },[sessionId]);
  useEffect(()=>{
    setMessages(sessions[sessionId] || []);
  },[sessionId]);  
  useEffect(()=>{
    localStorage.setItem('sessions', JSON.stringify({...sessions, [sessionId]:messages}));
  },[messages]);

  useEffect(()=>{ try{ localStorage.setItem('savedChats', JSON.stringify(saved)); }catch{} },[saved]);
  useEffect(()=>{ const el = chatRef.current; if(el) el.scrollTop = el.scrollHeight; },[messages]);

  useEffect(()=>{
    const h=()=>setImageOpen(true);
    const t=(e)=>{ setToast(String(e.detail||'')); };
    addEventListener('open-image-modal',h);
    addEventListener('toast',t);
    return ()=>{ removeEventListener('open-image-modal',h); removeEventListener('toast',t); };
  },[]);

  const copyText=(t)=>{ navigator.clipboard?.writeText(String(t||'')); dispatchEvent(new CustomEvent('toast',{detail:'تم النسخ ✅'})); };
  const vote=(m,dir)=> setMessages(list=> list.map(x=> x.id===m.id?{...x, vote:dir}:x));

  const send= async (text)=>{
    const userMsg = { id: uid(), role:'user', content:text, vote:null, saved:false };
    setMessages(m=>[...m,userMsg, { id: uid(), role:'assistant', content:'...', typing:true }]);
    try{
      const res = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:[...messages,userMsg]})});
      const data = await res.json();
      const reply = data?.reply || '…';
      setMessages(list=> list.map(x=> x.typing ? {...x, typing:false, content:reply} : x));
    }catch(e){
      setMessages(list=> list.map(x=> x.typing ? {...x, typing:false, content:'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.'} : x));
    }
  };

  const archive = ()=>{
    // title from first user message
    const firstUser = messages.find(m=>m.role==='user');
    const title = firstUser?.content?.slice(0,40) || 'محادثة';
    const id = sessionId;
    setSaved(list=> [{ id, title, at:Date.now() }, ...list.filter(s=>s.id!==id)]);
    // start new session
    const newId = uid();
    setSessions(prev=> ({...prev,[id]:messages, [newId]:[] }));
    setSessionId(newId);
    setToast('تمت الأرشفة وبدء جلسة جديدة');
  };

  const openSaved = (id)=>{
    setSessionId(id);
    setToast('تم فتح محادثة محفوظة');
  };

  const newChat=()=>{
    // save current into saved
    if(messages.length>0) archive();
  };

  const openTool=(name)=>{
    archive();
    // add intro
    setMessages([ { id: uid(), role:'assistant', content:`هذه جلسة ${name}. اكتب سؤالك.` } ]);
  };

  const share=()=>{
    const url = typeof window!=='undefined' ? window.location.href + `#${sessionId}` : '';
    navigator.clipboard?.writeText(url);
    setToast('تم نسخ رابط المشاركة');
  };

  const report=()=>{
    const reason = prompt('سبب التقرير؟ (اختياري)');
    if(reason!==null){ setToast('تم إرسال التقرير'); }
  };

  const clear=()=> setMessages([]);

  const onImageDone = ({url,prompt})=>{
    setMessages(m=>[...m, { id: uid(), role:'assistant', content:`تم توليد صورة ✅\n${url}`, attachments:[{kind:'image',url}] }]);
  };

  return (
    <div className="flex h-dvh bg-bgdark text-white">
      <Sidebar collapsed={collapsed} onToggle={()=>setCollapsed(v=>!v)} saved={saved} onOpenSaved={openSaved} onNewChat={newChat} onOpenTool={openTool} />
      <main className="flex-1 flex flex-col">
        <Header mode={mode} setMode={setMode} onArchive={archive} onReport={report} onClear={clear} onShare={share} />
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((m)=>(
            <div key={m.id} className={`max-w-[92%] md:max-w-[75%] ${m.role==='user' ? 'ml-auto text-right' : 'mr-auto'}`}>
              <div className={`bubble ${m.role==='user'?'user':'assistant'} p-3 leading-7 text-[13px] whitespace-pre-line`}>
                {Array.isArray(m.attachments) && m.attachments.length>0 && (
                  <div className="attach-grid mb-2">
                    {m.attachments.map((a, idx)=>(
                      <div key={idx} className="attach-item">
                        {a.kind==='image' ? (<a href={a.url} target="_blank"><img className="attach-thumb" src={a.url} /></a>) : null}
                      </div>
                    ))}
                  </div>
                )}
                {m.content}
              </div>
              <div className="flex gap-1 text-xs mt-1 items-center">
                {m.role==='assistant' ? (<>
                  <button title="إعجاب" onClick={()=>vote(m,'up')}><SvgThumbUp filled={m.vote==='up'} /></button>
                  <button title="عدم إعجاب" onClick={()=>vote(m,'down')}><SvgThumbDown filled={m.vote==='down'} /></button>
                  <button title="نسخ" onClick={()=>copyText(m.content)}><SvgCopy /></button>
                  <button title={m.saved?'إزالة من المحفوظات':'حفظ'} onClick={()=>{}}><SvgBookmark filled={false} /></button>
                </>) : (<button title="نسخ" onClick={()=>copyText(m.content)}><SvgCopy /></button>)}
              </div>
            </div>
          ))}
        </div>
        <Composer onSend={send} />
      </main>
      <ImageModal open={imageOpen} onClose={()=>setImageOpen(false)} onDone={onImageDone} />
      <Toast text={toast} onClear={()=>setToast('')} />
    </div>
  );
}
