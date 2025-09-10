'use client';
import { useState, useRef, useEffect } from 'react';

function Icon({ children, title }) {
  return <span title={title} className="inline-block w-5 text-center">{children}</span>;
}

export default function ChatPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', type: 'text', content: 'مرحبا بك في CHAT EASY WAR 👋' }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const taRef = useRef(null);

  function sanitize(text){
    if(!text) return '';
    // Remove zero-width characters and NBSP, normalize spaces
    let t = text.replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\u00A0/g,' ');
    // Trim overall
    t = t.trim();
    // Remove spaces at end of lines
    t = t.replace(/[ \t]+$/gm, '');
    // Collapse 3+ newlines to 2
    t = t.replace(/\n{3,}/g, '\n\n');
    return t;
  }

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  // autosize textarea up to 50vh, then show scrollbar
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = Math.round(window.innerHeight * 0.5);
    ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
    ta.style.overflowY = ta.scrollHeight > max ? 'auto' : 'hidden';
  }, [input]);

  const send = () => {
    const cleaned = sanitize(input);
    if (!cleaned) return;
    setMessages(m => [...m, { role: 'user', type: 'text', content: cleaned }]);
    setInput('');
    setTimeout(() => {
      const reply = 'رد تجريبي من الذكاء — سيتم لاحقًا ربط OpenAI.\nتم تنسيق النقاط تلقائيًا وتجنّب الفراغات الزائدة.';
      typeReply(reply);
    }, 500);
  };

  function typeReply(text) {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setMessages(m => {
        const last = m[m.length - 1];
        if (last && last.role === 'assistant' && last.type === 'typing') {
          return [...m.slice(0, -1), { ...last, content: (last.content || '') + text[i-1] }];
        }
        return [...m, { role: 'assistant', type: 'typing', content: text[i-1] }];
      });
      if (i >= text.length) {
        clearInterval(id);
        setMessages(m => {
          const last = m[m.length - 1];
          return [...m.slice(0, -1), { ...last, type: 'text' }];
        });
      }
    }, 12);
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
              <Icon title="محادثة جديدة">＋</Icon> محادثة جديدة
            </button>

            <div className="relative">
              <input placeholder="بحث عن محادثة" className="w-full p-2 pr-8 rounded bg-bgdark outline-none" />
              <span className="absolute right-2 top-1.5 opacity-70">🔎</span>
            </div>

            <div className="pt-2 space-y-1">
              <div className="text-muted">الأدوات</div>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2">
                <Icon title="أداة البزنز">💼</Icon> أداة البزنز
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2">
                <Icon title="أداة التسعير">💲</Icon> أداة التسعير
              </button>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark flex items-center gap-2">
                <Icon title="تحليل الإعلانات">📊</Icon> تحليل الإعلانات
              </button>
            </div>

            <div className="pt-4 space-y-1">
              <div className="text-muted">المحادثات</div>
              <button className="w-full text-left p-2 rounded hover:bg-bgdark">أول محادثة تجريبية</button>
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
            <div className="text-xs text-gray-400">v0.3</div>
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
            <div key={i} className={`max-w-[92%] md:max-w-[75%] ${m.role==='user' ? 'ml-auto text-right' : 'mr-auto'}`}>
              <div className={`bubble ${m.role==='user'?'user':'assistant'} p-3 leading-7 text-[13px] whitespace-pre-line`}>
                {m.content}
              </div>
              <div className="flex gap-2 text-xs opacity-70 mt-1">
                <button className="hover:opacity-100">👍</button>
                <button className="hover:opacity-100">👎</button>
                <button className="hover:opacity-100" onClick={()=>navigator.clipboard.writeText(m.content)}>نسخ</button>
                <button className="hover:opacity-100">حفظ</button>
              </div>
            </div>
          ))}
        </div>

        {/* Centered Composer */}
        <footer className="p-3 border-t border-[#333]">
          <div className="max-w-4xl mx-auto w-full">
            <div className="composer relative p-2">
              {/* plus button at right */}
              <div className="absolute right-2 top-2">
                <button className="px-2 py-1 rounded hover:bg-bgdark" title="إضافة">＋</button>
              </div>

              {/* textarea */}
              <textarea
                ref={taRef}
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="اسألني أي شيء"
                className="w-full bg-transparent outline-none resize-none pr-8 pl-20 scrollbar-thin"
              />

              {/* left controls (mic + send) */}
              <div className="absolute left-2 bottom-2 flex gap-2">
                <button className="px-2 py-1 rounded hover:bg-bgdark" title="تسجيل صوت">🎤</button>
                <button onClick={send} className="px-3 py-1 rounded bg-neon text-black" title="إرسال">➤</button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
