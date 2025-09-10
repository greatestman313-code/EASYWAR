'use client';
import { useState, useRef, useEffect } from 'react';

/* === Minimal inline SVG icons === */
const IconBtn = ({ title, onClick, active=false, children }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-1 rounded hover:bg-bgdark transition ${active ? 'opacity-100' : 'opacity-80'} `}
    aria-label={title}
  >
    {children}
  </button>
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

function Icon({ children, title }) {
  return <span title={title} className="inline-block w-5 text-center">{children}</span>;
}

export default function ChatPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState(() => {
    // hydrate from storage if exists
    const raw = typeof window !== 'undefined' ? localStorage.getItem('messages') : null;
    if (raw) return JSON.parse(raw);
    return [
      { id: cryptoRandom(), role: 'assistant', type: 'text', content: 'مرحبا بك في CHAT EASY WAR 👋', vote: null, saved: false }
    ];
  });
  const [savedList, setSavedList] = useState(() => {
    if (typeof window === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('saved')||'[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [toast, setToast] = useState('');
  const chatRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(()=>setToast(''), 1200);
    return ()=>clearTimeout(t);
  }, [toast]);

  // autosize textarea up to 50vh
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = Math.round(window.innerHeight * 0.5);
    ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
    ta.style.overflowY = ta.scrollHeight > max ? 'auto' : 'hidden';
  }, [input]);

  function sanitize(text){
    if(!text) return '';
    let t = text.replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\u00A0/g,' ');
    t = t.trim();
    t = t.replace(/[ \t]+$/gm, '');
    t = t.replace(/\n{3,}/g, '\n\n');
    return t;
  }

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); setToast('تم النسخ'); } catch { setToast('تعذر النسخ'); }
  };

  const toggleSave = (msg) => {
    setMessages(m => m.map(x => x.id===msg.id ? { ...x, saved: !x.saved } : x));
    setSavedList(prev => {
      const exists = prev.find(p=>p.id===msg.id);
      let next;
      if (exists) next = prev.filter(p=>p.id!==msg.id);
      else next = [...prev, { id: msg.id, content: msg.content, ts: Date.now() }];
      localStorage.setItem('saved', JSON.stringify(next));
      setToast(exists ? 'تم الإلغاء من المحفوظات' : 'تم الحفظ');
      return next;
    });
  };

  const vote = (msg, dir) => {
    setMessages(m => m.map(x => x.id===msg.id ? { ...x, vote: x.vote===dir ? null : dir } : x));
  };

  const send = () => {
    const cleaned = sanitize(input);
    if (!cleaned) return;
    const me = { id: cryptoRandom(), role: 'user', type: 'text', content: cleaned, vote: null, saved: false };
    setMessages(m => [...m, me]);
    setInput('');

    // mock assistant typing then final text
    setTimeout(() => {
      const id = cryptoRandom();
      const reply = 'رد تجريبي من الذكاء — سيتم لاحقًا ربط OpenAI.\nتم تنسيق النقاط تلقائيًا وتجنّب الفراغات الزائدة.';
      // insert typing placeholder with fixed id
      setMessages(m => [...m, { id, role: 'assistant', type: 'typing', content: '', vote: null, saved: false }]);
      typeReply(id, reply);
    }, 500);
  };

  function typeReply(id, text) {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setMessages(m => m.map(item => {
        if (item.id !== id) return item;
        const next = (item.content || '') + text[i-1];
        return { ...item, content: next, type: i >= text.length ? 'text':'typing' };
      }));
      if (i >= text.length) clearInterval(interval);
    }, 12);
  }

  function cryptoRandom() {
    // UUID-lite for client-side keys
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

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

            <div className="pt-4 space-y-2">
              <div className="text-muted">المحادثات</div>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark">أول محادثة تجريبية</button>
            </div>

            <div className="pt-4 space-y-2">
              <div className="text-muted">المحفوظات</div>
              <div className="space-y-1 max-h-48 overflow-auto pr-1">
                {savedList.length === 0 && <div className="text-gray-400">لا يوجد عناصر محفوظة</div>}
                {savedList.map(item => (
                  <button key={item.id} className="w-full text-left p-2 rounded hover:bg-bgdark text-ellipsis line-clamp-2"
                    onClick={()=>navigator.clipboard.writeText(item.content)} title="نسخ النص">
                    <span className="opacity-70">⎘</span> <span className="opacity-90">{item.content.slice(0,80)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* User */}
        <div className="mt-auto p-3 border-t border-[#333]">
          <button className="w-full p-2 rounded hover:bg-bgdark flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#444] inline-block" />
            {!collapsed && <div><div>اسم المستخدم</div><div className="text-[11px] text-gray-400">Free plan</div></div>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-2 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-bold">CHAT EASY WAR</div>
            <div className="text-xs text-gray-400">v0.4</div>
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

        {/* Chat scroll area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={m.id} className={`max-w-[92%] md:max-w-[75%] ${m.role==='user' ? 'ml-auto text-right' : 'mr-auto'}`}>
              <div className={`bubble ${m.role==='user'?'user':'assistant'} p-3 leading-7 text-[13px] whitespace-pre-line`}>
                {m.content}
              </div>
              {/* actions */}
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

        {/* Centered Composer */}
        <footer className="p-3 border-t border-[#333]">
          <div className="max-w-4xl mx-auto w-full">
            <div className="composer relative p-2">
              <div className="absolute right-2 top-2">
                <button className="px-2 py-1 rounded hover:bg-bgdark" title="إضافة">＋</button>
              </div>
              <textarea
                ref={taRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="اسألني أي شيء"
                className="w-full bg-transparent outline-none resize-none pr-8 pl-20 scrollbar-thin"
              />
              <div className="absolute left-2 bottom-2 flex gap-2">
                <button className="px-2 py-1 rounded hover:bg-bgdark" title="تسجيل صوت">🎤</button>
                <button onClick={send} className="px-3 py-1 rounded bg-neon text-black" title="إرسال">➤</button>
              </div>
            </div>
          </div>
          {/* Toast */}
          {toast && (
            <div className="fixed left-1/2 -translate-x-1/2 bottom-20 bg-bgsoft border border-[#333] px-3 py-1 rounded text-sm opacity-95">
              {toast}
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}
