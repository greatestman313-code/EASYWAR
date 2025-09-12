'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatBox from '@/components/ChatBox';
import Composer from '@/components/Composer';
import ImageModal from '@/components/ImageModal';

const uid = () => Math.random().toString(36).slice(2);
const sanitize = (s) => (s || '').trim();

export default function ChatPage(){
  const [sessionId] = useState(()=> uid());
  const [messages, setMessages] = useState(()=>[
    { id: uid(), role:'assistant', type:'text', content:'مرحبا بك في CHAT EASY WAR', vote:null, saved:false }
  ]);
  const [attachments, setAttachments] = useState([]);
  const [toast, setToast] = useState('');

// Saved chats data (in localStorage)
const [savedChats, setSavedChats] = useState(()=>{
  try{ return JSON.parse(localStorage.getItem('savedChats')||'[]'); }catch{ return []; }
});

useEffect(()=>{ try{ localStorage.setItem('savedChats', JSON.stringify(savedChats)); }catch{} }, [savedChats]);

const loadChat = (chat) => {
  if (!chat) return;
  setSessionId(chat.id);
  setMessages(chat.messages || []);
  window.dispatchEvent(new CustomEvent('toast',{ detail: 'تم فتح المحادثة' }));
};

const savedAction = (chat) => {
  const action = prompt('اختر عملية: delete/share/rename');
  if (!action) return;
  if (action==='delete'){
    setSavedChats(list => list.filter(c=>c.id!==chat.id));
  } else if (action==='share'){
    const url = (typeof window!=='undefined') ? (window.location.origin + '/share/' + chat.id) : chat.id;
    navigator.clipboard?.writeText(url);
    window.dispatchEvent(new CustomEvent('toast',{ detail: 'تم نسخ رابط المشاركة' }));
  } else if (action==='rename'){
    const t = prompt('عنوان جديد', chat.title || 'بدون عنوان');
    if (t) setSavedChats(list => list.map(c=> c.id===chat.id ? {...c, title:t} : c));
  }
};

  const [openImageModal, setOpenImageModal] = useState(false);

  useEffect(()=>{ if(!toast) return; const t=setTimeout(()=>setToast(''),2000); return ()=>clearTimeout(t); },[toast]);

  const copyText = (t) => { navigator.clipboard?.writeText(String(t||'')); setToast('تم النسخ ✅'); };
  const vote = (m, dir) => setMessages(list => list.map(x => x.id===m.id?{...x, vote:dir}:x));
  const toggleSave = (m) => setMessages(list => list.map(x => x.id===m.id?{...x, saved:!x.saved}:x));

  async function handleShareMessage(messageId){
    try{
      const r = await fetch('/api/share/create', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messageId }) });
      const d = await r.json();
      if (!r.ok || !d?.url) { setToast('تعذر إنشاء رابط المشاركة'); return; }
      await navigator.clipboard.writeText(d.url);
      setToast('تم نسخ رابط المشاركة');
    }catch{ setToast('تعذر نسخ رابط المشاركة'); }
  }

  async function sendText(text){
    const cleaned = sanitize(text);
    if (!cleaned && attachments.length===0) return;
    const userMsg = { id: uid(), role:'user', type:'text', content: cleaned, attachments };
    setMessages(m => [...m, userMsg]); setAttachments([]);
    const replyId = uid();
    setMessages(m => [...m, { id: replyId, role:'assistant', type:'typing', content:'' }]);
    try{
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: [...messages, userMsg].map(({role,content})=>({role,content})) }) });
      const data = await res.json(); const reply = data?.reply || '…';
      let i=0; const step=Math.max(1,Math.floor(reply.length/80));
      const tick=()=>{ i+=step; setMessages(list=>list.map(m=>m.id===replyId?{...m,type:'text',content:reply.slice(0,i)}:m)); if(i<reply.length) setTimeout(tick,12); };
      tick();
    }catch{ setMessages(list=>list.map(m=>m.id===replyId?{...m,type:'text',content:'تعذر الاتصال بالخادم'}:m)); }
  }

  return (
    <div className="flex h-dvh bg-bgdark text-white">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header sessionId={sessionId} onCleared={()=>setMessages([])} />
        <ChatBox messages={messages} onCopy={copyText} onVote={vote} onToggleSave={toggleSave} onShareMessage={handleShareMessage} />
        <Composer onSend={sendText} onPickFiles={(files)=>setAttachments(prev=>[...prev,...files])} />
      </main>
      {toast && <div className="fixed bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-2 rounded">{toast}</div>}
    </div>
  );
}
