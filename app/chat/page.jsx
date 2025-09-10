'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

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

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: 'user', type: 'text', content: input }]);
    setInput('');
    // mock typing effect
    setTimeout(() => {
      const reply = 'رد تجريبي من الذكاء — سيتم لاحقًا ربط OpenAI. \nتم تنسيق النقاط تلقائيًا وتجنّب الأخطاء الإملائية.';
      typeReply(reply);
    }, 600);
  };

  function typeReply(text) {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setMessages(m => {
        const last = m[m.length - 1];
        if (last && last.role === 'assistant' && last.type === 'typing') {
          // append
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
    }, 15);
  }

  return (
    <div className="flex h-dvh bg-bgdark text-white">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-16' : 'w-72'} transition-all duration-200 bg-bgsoft flex flex-col border-l border-[#333]`}>
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

        {/* User button bottom */}
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
            <div className="text-xs text-gray-400">v0.1</div>
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
            <div className="relative">
              <button className="px-2 py-1 rounded hover:bg-bgsoft" title="القائمة">⋮</button>
              {/* يمكن لاحقاً إضافة القائمة المنسدلة */}
            </div>
          </div>
        </header>

        {/* Chat scroll area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[90%] ${m.role==='user' ? 'ml-auto text-right' : 'mr-auto'}`}>
              {m.type === 'code' ? (
                <pre className="bg-black border border-[#333] rounded p-3 text-xs overflow-auto">
{m.content}
                </pre>
              ) : (
                <div className="bg-bgsoft p-2 rounded leading-7 text-[13px] whitespace-pre-wrap">
                  {m.content}
                </div>
              )}
              {/* actions */}
              <div className="flex gap-2 text-xs opacity-70 mt-1">
                <button className="hover:opacity-100">👍</button>
                <button className="hover:opacity-100">👎</button>
                <button className="hover:opacity-100" onClick={()=>navigator.clipboard.writeText(m.content)}>نسخ</button>
                <button className="hover:opacity-100">حفظ</button>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <footer className="p-2 border-t border-[#333]">
          <div className="flex items-center gap-2">
            <button className="px-2 py-2 rounded hover:bg-bgsoft" title="إضافة">＋</button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e=>setInput(e.target.value)}
                placeholder="اسألني أي شيء"
                className="w-full max-h-[50dvh] min-h-[44px] p-2 pr-10 bg-bgsoft rounded outline-none resize-y"
              />
              {/* mic + send inside input (RTL-aware) */}
              <div className="absolute left-2 bottom-2 flex gap-2">
                <button className="px-2 py-1 rounded hover:bg-bgdark" title="تسجيل صوت">🎤</button>
                <button onClick={send} className="px-2 py-1 rounded bg-neon text-black" title="إرسال">➤</button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
