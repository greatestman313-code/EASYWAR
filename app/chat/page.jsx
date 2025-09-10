'use client';
import { useState, useRef, useEffect } from 'react';

/* ====== SVG Icons ====== */
const IconBtn = ({ title, onClick, active=false, children }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-1 rounded hover:bg-bgdark transition ${active ? 'opacity-100' : 'opacity-80'}`}
    aria-label={title}
  >{children}</button>
);
const SvgThumbUp = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M14 9V5a3 3 0 00-3-3l-1 6-5 6v8h11a3 3 0 003-3v-7a3 3 0 00-3-3h-2z" stroke="#cbd5e1" strokeWidth="1.6" fill={filled ? '#cbd5e1' : 'none'} />
  </svg>
);
const SvgThumbDown = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M10 15v4a3 3 0 003 3l1-6 5-6V2H8a3 3 0 00-3 3v7a3 3 0 003 3h2z" stroke="#cbd5e1" strokeWidth="1.6" fill={filled ? '#cbd5e1' : 'none'} />
  </svg>
);
const SvgCopy = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="#cbd5e1" strokeWidth="1.6"/>
    <rect x="4" y="4" width="11" height="11" rx="2" stroke="#cbd5e1" strokeWidth="1.6"/>
  </svg>
);
const SvgBookmark = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M6 3h12a1 1 0 011 1v17l-7-4-7 4V4a1 1 0 011-1z" stroke="#cbd5e1" strokeWidth="1.6" fill={filled ? '#cbd5e1' : 'none'}/>
  </svg>
);
const SvgPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/></svg>
);
const SvgMic = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="9" y="3" width="6" height="10" rx="3" stroke={active ? '#00E0FF' : '#cbd5e1'} strokeWidth="1.6"/>
    <path d="M5 11a7 7 0 0014 0M12 18v3" stroke={active ? '#00E0FF' : '#cbd5e1'} strokeWidth="1.6"/>
  </svg>
);

function SidebarSaved({ list }){
  return (
    <div className="pt-4 space-y-2">
      <div className="text-muted">المحفوظات</div>
      <div className="space-y-1 max-h-48 overflow-auto pr-1">
        {list.length === 0 && <div className="text-gray-400">لا يوجد عناصر محفوظة</div>}
        {list.map(item => (
          <button key={item.id} className="w-full text-left p-2 rounded hover:bg-bgdark text-ellipsis line-clamp-2"
            onClick={()=>navigator.clipboard.writeText(item.content||'[مرفق]')} title="نسخ النص">
            <span className="opacity-70">⎘</span> <span className="opacity-90">{(item.content||'').slice(0,80)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('messages') : null;
    if (raw) return JSON.parse(raw);
    return [{ id: uid(), role: 'assistant', type: 'text', content: 'مرحبا بك في CHAT EASY WAR 👋', vote: null, saved: false }];
  });
  const [savedList, setSavedList] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('saved')||'[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState([]); // {kind:'image'|'audio', url, name, size}
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [adModal, setAdModal] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [genSize, setGenSize] = useState('1024x1024');
  const [withAdImage, setWithAdImage] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [recOn, setRecOn] = useState(false);
  const [recLen, setRecLen] = useState(0);
  const recRef = useRef({ media: null, startAt: 0, timer: null });
  const chatRef = useRef(null);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const fileRefAudio = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [adModal, setAdModal] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [genSize, setGenSize] = useState('1024x1024');
  const [withAdImage, setWithAdImage] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);
  useEffect(() => { localStorage.setItem('messages', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { if (!toast) return; const t=setTimeout(()=>setToast(''),1100); return ()=>clearTimeout(t); }, [toast]);
  useEffect(() => {
    const ta = taRef.current; if (!ta) return;
    ta.style.height='auto'; const max=Math.round(window.innerHeight*0.5);
    ta.style.height=Math.min(ta.scrollHeight,max)+'px';
    ta.style.overflowY= ta.scrollHeight>max ? 'auto':'hidden';
  }, [input]);

  function sanitize(t){
    if(!t) return ''; t=t.replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\u00A0/g,' ');
    t=t.trim(); t=t.replace(/[ \t]+$/gm,''); t=t.replace(/\n{3,}/g,'\n\n'); return t;
  }
  const copyText = async (text)=>{ try{ await navigator.clipboard.writeText(text); setToast('تم النسخ'); }catch{ setToast('تعذر النسخ'); } };
  const toggleSave = (msg)=>{
    setMessages(m=>m.map(x=>x.id===msg.id?{...x,saved:!x.saved}:x));
    setSavedList(prev=>{
      const ex=prev.find(p=>p.id===msg.id); let next;
      if(ex) next=prev.filter(p=>p.id!==msg.id); else next=[...prev,{id:msg.id,content:msg.content,ts:Date.now()}];
      localStorage.setItem('saved', JSON.stringify(next));
      setToast(ex?'تم الإلغاء من المحفوظات':'تم الحفظ'); return next;
    });
  };
  const vote = (msg,dir)=> setMessages(m=>m.map(x=>x.id===msg.id?{...x,vote:x.vote===dir?null:dir}:x));

  const send = () => {
    const cleaned = sanitize(input);
    if (!cleaned && attachments.length===0) return;
    const me = { id: uid(), role:'user', type:'text', content:cleaned, vote:null, saved:false, attachments };
    setMessages(m=>[...m, me]);
    setInput('');
    setAttachments([]);

    setTimeout(()=>{
      const id=uid(); const reply='تم استلام رسالتك ✅\n(سيتم لاحقاً تحليل المرفقات فعليًا)';
      setMessages(m=>[...m, {id, role:'assistant', type:'typing', content:'', vote:null, saved:false}]);
      typeReply(id, reply);
    }, 500);
  };

  function typeReply(id, text){
    let i=0; const it=setInterval(()=>{
      i++; setMessages(m=>m.map(item=> item.id!==id?item:{...item, content:(item.content||'')+text[i-1], type: i>=text.length?'text':'typing'}));
      if(i>=text.length) clearInterval(it);
    }, 12);
  }

  function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }

  // File uploads
  const onPickFiles = (e) => {
    const files = Array.from(e.target.files||[]);
    if (!files.length) return;
    const MAX = 25 * 1024 * 1024;
    const added = files.map(f => {
      if (f.size > MAX) { setToast('ملف أكبر من 25MB'); return null; }
      const isImg = f.type.startsWith('image/');
      const isAud = f.type.startsWith('audio/');
      if (!isImg && !isAud) { setToast('يُسمح فقط بالصور والصوت'); return null; }
      return { kind: isImg ? 'image':'audio', url: URL.createObjectURL(f), name: f.name, size: f.size };
    }).filter(Boolean);
    setAttachments(prev => [...prev, ...added]);
    // reset input value to allow re-upload same file name
    e.target.value = '';
  };

  const removeAttachment = (i) => {
    setAttachments(prev => prev.filter((_, idx) => idx !== i));
  };

  // Recording
  const toggleRecord = async () => {
    if (recOn) {
      // stop
      const { media, timer } = recRef.current;
      if (timer) clearInterval(timer);
      if (media) { media.stop(); }
      setRecOn(false);
      return;
    }
    // start
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = [];
      const media = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      media.ondataavailable = (e)=>{ if(e.data.size>0) chunks.push(e.data); };
      media.onstop = ()=>{
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAttachments(prev => [...prev, { kind:'audio', url, name:'recording.webm', size: blob.size }]);
        stream.getTracks().forEach(t=>t.stop());
        setRecLen(0);
      };
      media.start();
      recRef.current.media = media;
      recRef.current.startAt = Date.now();
      recRef.current.timer = setInterval(()=> setRecLen(Math.floor((Date.now()-recRef.current.startAt)/1000)), 200);
      setRecOn(true);
    } catch (err) {
      console.error(err);
      setToast('المايك غير متاح');
    }
  };

  return (
    <div className="flex h-dvh bg-bgdark text-white">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-80'} transition-all duration-200 bg-bgsoft flex flex-col border-l border-[#333]`}>
        <div className="flex items-center justify-between p-3 border-b border-[#333]">
          <button className="text-lg font-bold" title="الشعار">EASY WAR</button>
          <button onClick={()=>setCollapsed(v=>!v)} title="طي الشريط" className="px-2 py-1 rounded hover:bg-bgdark">⟨⟩</button>
        </div>
        {!collapsed && (
          <div className="p-3 space-y-2 text-[12px]">
            <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2">
              <span className="inline-block w-5 text-center">＋</span> محادثة جديدة
            </button>
            <div className="relative">
              <input placeholder="بحث عن محادثة" className="w-full p-2 pr-8 rounded bg-bgdark outline-none" />
              <span className="absolute right-2 top-1.5 opacity-70">🔎</span>
            </div>
            <div className="pt-2 space-y-1">
              <div className="text-muted">الأدوات</div>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2">
                <span className="inline-block w-5 text-center">💼</span> أداة البزنز
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2">
                <span className="inline-block w-5 text-center">💲</span> أداة التسعير
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2">
                <span className="inline-block w-5 text-center">📊</span> تحليل الإعلانات
              </button>
            </div>
            <SidebarSaved list={savedList} />
          </div>
        )}
        <div className="mt-auto p-3 border-t border-[#333]">
          <button className="w-full p-2 rounded hover:bg-bgdark flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#444] inline-block" />
            {!collapsed && <div><div>اسم المستخدم</div><div className="text-[11px] text-gray-400">Free plan</div></div>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="p-2 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-bold">CHAT EASY WAR</div>
            <div className="text-xs text-gray-400">v1.1</div>
            <div className="relative">
              <select className="bg-bgdark border border-[#333] rounded p-1 text-xs">
                <option>الشات التلقائي</option>
                <option>بحث متقدم</option>
                <option>التفكير العميق</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded hover:bg-bgsoft" title="نسخ رابط المشاركة">🔗</button>
            <button className="px-2 py-1 rounded hover:bg-bgsoft" title="القائمة">⋮</button>
          </div>
        </header>

        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((m) => (
            <div key={m.id} className={`max-w-[92%] md:max-w-[75%] ${m.role==='user' ? 'ml-auto text-right' : 'mr-auto'}`}>
              <div className={`bubble ${m.role==='user'?'user':'assistant'} p-3 leading-7 text-[13px] whitespace-pre-line`}>
                {/* attachments */}
                {Array.isArray(m.attachments) && m.attachments.length>0 && (
                  <div className="attach-grid mb-2">
                    {m.attachments.map((a, idx)=>(
                      <div key={idx} className="attach-item">
                        {a.kind==='image' ? (
                          <a href={a.url} target="_blank" rel="noreferrer">
                            <img className="attach-thumb" src={a.url} alt={a.name||'image'} />
                          </a>
                        ) : (
                          <div className="p-2">
                            <audio className="attach-audio" controls src={a.url}></audio>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {m.content}
              </div>
              <div className="flex gap-1 text-xs mt-1 items-center">
                {m.role === 'assistant' ? (
                  <>
                    <IconBtn title="إعجاب" onClick={()=>vote(m,'up')} active={m.vote==='up'}><SvgThumbUp filled={m.vote==='up'} /></IconBtn>
                    <IconBtn title="عدم إعجاب" onClick={()=>vote(m,'down')} active={m.vote==='down'}><SvgThumbDown filled={m.vote==='down'} /></IconBtn>
                    <IconBtn title="نسخ" onClick={()=>copyText(m.content)}><SvgCopy /></IconBtn>
                    <IconBtn title={m.saved?'إزالة من المحفوظات':'حفظ'} onClick={()=>toggleSave(m)} active={m.saved}><SvgBookmark filled={m.saved} /></IconBtn>
                  </>
                ) : (
                  <IconBtn title="نسخ" onClick={()=>copyText(m.content)}><SvgCopy /></IconBtn>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Composer */}
        <footer className="p-3 border-t border-[#333]">
          <div className="max-w-4xl mx-auto w-full">
            <div className="composer relative p-2">
              {/* File picker (hidden) */}
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onPickFiles} />
              <input ref={fileRefAudio} type="file" accept="audio/*" multiple className="hidden" onChange={onPickFiles} />

              <div className="absolute right-2 top-2">
                <IconBtn title="قائمة الإضافة" onClick={()=>setMenuOpen(v=>!v)}><SvgPlus /></IconBtn>
                {menuOpen && (
                  <div className="absolute z-20 right-0 bottom-full mb-2 w-60 bg-bgdark border border-[#333] rounded p-1 shadow-lg">
                    <button onClick={()=>{setMenuOpen(false); fileRef.current?.click();}} className="w-full text-right p-2 rounded hover:bg-bgsoft">إضافة ملفات/صور</button>
                    <button onClick={()=>{setMenuOpen(false); fileRefAudio.current?.click();}} className="w-full text-right p-2 rounded hover:bg-bgsoft">إضافة صوت</button>
                    <div className="border-t border-[#333] my-1"></div>
                    <button onClick={()=>{setMenuOpen(false); setImgModal(true);}} className="w-full text-right p-2 rounded hover:bg-bgsoft">توليد صورة من نص</button>
                    <button onClick={()=>{setMenuOpen(false); setAdModal(true);}} className="w-full text-right p-2 rounded hover:bg-bgsoft">توليد إعلان من نص</button>
                  </div>
                )}
              </div>

              {/* Selected attachments preview */}
              {attachments.length>0 && (
                <div className="attach-grid">
                  {attachments.map((a, i)=>(
                    <div key={i} className="attach-item">
                      {a.kind==='image' ? (
                        <img className="attach-thumb" src={a.url} alt={a.name||'image'} />
                      ) : (
                        <div className="p-2"><audio className="attach-audio" controls src={a.url}></audio></div>
                      )}
                      <button className="attach-remove" onClick={()=>removeAttachment(i)}>إزالة</button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                ref={taRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }}
                placeholder="اسألني أي شيء"
                className="w-full bg-transparent outline-none resize-none pr-8 pl-24 scrollbar-thin mt-2"
              />

              <div className="absolute left-2 bottom-2 flex items-center gap-2">
                <button onClick={toggleRecord} className={`px-2 py-1 rounded hover:bg-bgdark ${recOn ? 'ring-2 ring-neon' : ''}`} title={recOn ? 'إيقاف التسجيل' : 'تسجيل صوت'}>
                  <SvgMic active={recOn} />
                </button>
                {recOn && <span className="text-xs text-neon select-none">{String(Math.floor(recLen/60)).padStart(2,'0')}:{String(recLen%60).padStart(2,'0')}</span>}
                <button onClick={send} className="px-3 py-1 rounded bg-neon text-black" title="إرسال">➤</button>
              </div>
            </div>
          </div>
          {toast && (
            <div className="fixed left-1/2 -translate-x-1/2 bottom-20 bg-bgsoft border border-[#333] px-3 py-1 rounded text-sm opacity-95">
              {toast}
            </div>
          )}
        {/* Modals */}
{imgModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30">
    <div className="bg-bgsoft border border-[#333] rounded p-4 w-[520px] max-w-[92vw] space-y-3">
      <div className="text-lg font-bold">توليد صورة من نص</div>
      <textarea value={genPrompt} onChange={e=>setGenPrompt(e.target.value)} className="w-full h-28 bg-bgdark rounded p-2 outline-none" placeholder="اكتب وصف الصورة المطلوبة..." />
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-300">الحجم:</label>
        <select value={genSize} onChange={e=>setGenSize(e.target.value)} className="bg-bgdark border border-[#333] rounded p-1 text-sm">
          <option>512x512</option>
          <option>768x768</option>
          <option>1024x1024</option>
        </select>
        {busy && <span className="text-sm text-neon">...جارِ التوليد</span>}
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={()=>setImgModal(false)} className="px-3 py-1 rounded hover:bg-bgdark">إغلاق</button>
        <button onClick={async ()=>{
          if(!genPrompt.trim()) return;
          setBusy(true);
          try {
            const res = await fetch('/api/gen/image', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: genPrompt, size: genSize }) });
            const data = await res.json();
            if (data?.url) {
              const msg = { id: uid(), role:'assistant', type:'text', content: 'نتيجة توليد الصورة:', vote:null, saved:false, attachments: [{kind:'image', url: data.url, name:'generated.png', size:0}] };
              setMessages(m=>[...m, msg]);
              setImgModal(false); setGenPrompt('');
            } else {
              setToast('فشل التوليد'); 
            }
          } catch (e) {
            setToast('خطأ في التوليد');
          } finally {
            setBusy(false);
          }
        }} className="px-3 py-1 rounded bg-neon text-black">توليد</button>
      </div>
    </div>
  </div>
)}

{adModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30">
    <div className="bg-bgsoft border border-[#333] rounded p-4 w-[560px] max-w-[92vw] space-y-3">
      <div className="text-lg font-bold">توليد إعلان من نص</div>
      <textarea value={genPrompt} onChange={e=>setGenPrompt(e.target.value)} className="w-full h-28 bg-bgdark rounded p-2 outline-none" placeholder="صف المنتج/العرض والجمهور..." />
      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-300"><input type="checkbox" checked={withAdImage} onChange={e=>setWithAdImage(e.target.checked)} className="ml-2"/> توليد صورة للإعلان</label>
        {busy && <span className="text-sm text-neon">...جارِ التوليد</span>}
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={()=>setAdModal(false)} className="px-3 py-1 rounded hover:bg-bgdark">إغلاق</button>
        <button onClick={async ()=>{
          if(!genPrompt.trim()) return;
          setBusy(true);
          try {
            const res = await fetch('/api/gen/ad', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: genPrompt, withImage: withAdImage }) });
            const data = await res.json();
            if (data?.ad) {
              let content = `العنوان: ${data.ad.headline || ''}\nالنص: ${data.ad.body || ''}\nCTA: ${data.ad.cta || ''}`.trim();
              const attach = data.imageUrl ? [{kind:'image', url: data.imageUrl, name:'ad.png', size:0}] : [];
              const msg = { id: uid(), role:'assistant', type:'text', content, vote:null, saved:false, attachments: attach };
              setMessages(m=>[...m, msg]);
              setAdModal(false); setGenPrompt('');
            } else {
              setToast('فشل توليد الإعلان');
            }
          } catch (e) {
            setToast('خطأ في توليد الإعلان');
          } finally {
            setBusy(false);
          }
        }} className="px-3 py-1 rounded bg-neon text-black">توليد</button>
      </div>
    </div>
  </div>
)}

        </footer>
      </main>
    </div>
  );
}
