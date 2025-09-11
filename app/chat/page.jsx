
"use client";
import { useEffect, useRef, useState } from "react";

const Icon = {
  copy: (cls="w-4 h-4") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M9 9h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6"/></svg>
  ),
  like: (cls="w-4 h-4") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M14 10V5a2 2 0 0 0-2-2l-4 7v11h8l3-8V8h-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M6 10H4v11h2V10Z" stroke="currentColor" strokeWidth="1.6"/></svg>
  ),
  dislike: (cls="w-4 h-4") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M10 14v5a2 2 0 0 0 2 2l4-7V3h-8L5 11v3h5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M20 14h2V3h-2v11Z" stroke="currentColor" strokeWidth="1.6"/></svg>
  ),
  save: (cls="w-4 h-4") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M19 21V7L16 4H5a2 2 0 0 0-2 2v15l5-3 5 3 6-3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
  ),
  send: (cls="w-5 h-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l20-9L2 3v7l14 2L2 14v7z"/></svg>
  ),
  mic: (cls="w-5 h-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.6"/><path d="M12 17v4M8 21h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
  plus: (cls="w-5 h-5") => (
    <svg className={cls} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
};

export default function ChatPage() {
  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("messages")||"[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [genOpen, setGenOpen]   = useState(false); // نافذة توليد صورة
  const [genPrompt, setGenPrompt] = useState("");
  const [genBusy, setGenBusy] = useState(false);

  const chatRef = useRef(null);
  const taRef   = useRef(null);

  // Scroll + حفظ محلي
  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);
  useEffect(() => { localStorage.setItem("messages", JSON.stringify(messages)); }, [messages]);

  // إدراج رسالة
  function pushMessage(msg) {
    setMessages(prev => [...prev, { id: (crypto?.randomUUID?.() || String(Math.random())), ...msg }]);
  }

  // إرسال (Enter) أو سطر جديد (Shift+Enter)
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    pushMessage({ role: "user", type: "text", content: text });
    setInput("");

    // رد تجريبي منظّم (بدون ربط خارجي الآن)
    setTimeout(() => {
      pushMessage({
        role: "ai",
        type: "text",
        content:
          "رد تجريبي من الذكاء — سيتم لاحقاً ربط OpenAI.\\nتم تنسيق النقاط تلقائياً وتجنب الفراغات الزائدة.",
      });
    }, 350);
  }

  // نسخ/حفظ/تقييم
  const onCopy = (m) => navigator.clipboard.writeText(m.content || "");
  const onSave = (m) => {
    const saved = JSON.parse(localStorage.getItem("saved") || "[]");
    saved.push({ ...m, savedAt: Date.now() });
    localStorage.setItem("saved", JSON.stringify(saved));
  };

  // توليد صورة عبر API
  async function generateImage() {
    const prompt = genPrompt.trim();
    if (!prompt) return;
    setGenBusy(true);
    try {
      const r = await fetch("/api/gen/image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt, size: "1024x1024" }),
      });
      const data = await r.json();
      if (data?.dataUrl) {
        pushMessage({
          role: "ai",
          type: "image",
          src: data.dataUrl,
          content: `نتيجة توليد صورة لــ: "${prompt}"`,
        });
        setGenOpen(false);
        setGenPrompt("");
      } else {
        pushMessage({ role: "ai", type: "text", content: "تعذّر توليد الصورة." });
      }
    } catch {
      pushMessage({ role: "ai", type: "text", content: "خطأ في الاتصال بـ /api/gen/image" });
    } finally {
      setGenBusy(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#101214] text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
      {/* منطقة الشات */}
      <section className="h-screen flex flex-col">
        {/* هيدر */}
        <header className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="text-sm text-gray-300">v1.3.1</div>
          <div className="font-bold">CHAT EASY WAR</div>
        </header>

        {/* الرسائل */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {/* رسالة ترحيب */}
          {messages.length === 0 && (
            <div className="mx-auto max-w-3xl rounded-lg bg-[#1B1F24] px-4 py-3 text-sm text-gray-200">
              👋 مرحباً بك في CHAT EASY WAR
              <div className="mt-2 flex gap-3 text-gray-400">
                <button title="حفظ">{Icon.save()}</button>
                <button title="نسخ">{Icon.copy()}</button>
                <button title="لم يعجبني">{Icon.dislike()}</button>
                <button title="أعجبني">{Icon.like()}</button>
              </div>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`mx-auto max-w-3xl`}>
              <div className={`rounded-lg px-4 py-3 ${
                m.role === "user" ? "bg-[#22262C]" : "bg-[#1B1F24]"
              }`}>
                {/* نص أو صورة */}
                {m.type === "image" ? (
                  <div className="space-y-2">
                    {m.content && <div className="text-sm text-gray-300">{m.content}</div>}
                    <img src={m.src} alt="generated" className="rounded-md max-h-[480px] object-contain" />
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap break-words leading-7 text-[14px]">
                    {m.content}
                  </pre>
                )}
              </div>

              {/* شريط الرموز أسفل كل رسالة */}
              <div className="mt-2 flex items-center gap-4 text-gray-400 text-sm">
                {m.role === "ai" ? (
                  <>
                    <button onClick={() => onSave(m)} title="حفظ">{Icon.save()}</button>
                    <button onClick={() => onCopy(m)} title="نسخ">{Icon.copy()}</button>
                    <button title="لم يعجبني">{Icon.dislike()}</button>
                    <button title="أعجبني">{Icon.like()}</button>
                  </>
                ) : (
                  <button onClick={() => onCopy(m)} title="نسخ">{Icon.copy()}</button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* الإدخال */}
        <div className="border-t border-white/5 px-4 py-3">
          <div className="mx-auto max-w-4xl relative">
            <div className="bg-[#1B1F24] rounded-xl p-2 flex items-end gap-2">
              {/* زر إرسال */}
              <button
                onClick={handleSend}
                className="shrink-0 w-10 h-10 rounded-lg bg-[#00D3EE] text-black grid place-items-center"
                title="إرسال"
              >
                {Icon.send("w-5 h-5")}
              </button>

              {/* المايك (شكلي حالياً) */}
              <button className="shrink-0 w-10 h-10 rounded-lg bg-transparent hover:bg-white/5 grid place-items-center" title="تسجيل صوتي">
                {Icon.mic()}
              </button>

              {/* Textarea تتمدّد لأعلى وتظهر سكرول عند الحاجة */}
              <textarea
                ref={taRef}
                placeholder="اسألني أي شيء"
                className="flex-1 max-h[50vh] min-h-[48px] bg-transparent outline-none resize-none leading-7 text-[14px] placeholder:text-gray-500"
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.currentTarget.style.height = "48px";
                  e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
                }}
                onKeyDown={onKeyDown}
              />

              {/* زر + يفتح قائمة للأعلى */}
              <div className="relative">
                <button
                  onClick={() => { setMenuOpen(v=>!v); setGenOpen(false); }}
                  className="shrink-0 w-10 h-10 rounded-lg bg-transparent hover:bg-white/5 grid place-items-center"
                  title="المزيد"
                >
                  {Icon.plus()}
                </button>

                {menuOpen && (
                  <div className="absolute bottom-12 right-0 z-50 w-56 rounded-xl bg-[#1E2228] shadow-lg border border-white/5 overflow-hidden">
                    <button
                      onClick={() => { setGenOpen(true); setMenuOpen(false); }}
                      className="w-full text-right px-3 py-3 hover:bg-white/5 flex items-center justify-between"
                    >
                      توليد صورة من نص <span className="text-xs text-gray-400">Text → Image</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        const context = prompt("اكتب سياق الإعلان (اختياري):") || "";
                        fetch("/api/gen/ad", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ context, lang: "ar" }),
                        }).then(r=>r.json()).then(d=>{
                          if (d.text) {
                            pushMessage({ role: "ai", type: "text", content: d.text });
                          } else {
                            pushMessage({ role: "ai", type: "text", content: "تعذّر توليد الإعلان." });
                          }
                        }).catch(()=>{
                          pushMessage({ role: "ai", type: "text", content: "خطأ في /api/gen/ad" });
                        });
                      }}
                      className="w-full text-right px-3 py-3 hover:bg-white/5 flex items-center justify-between"
                    >
                      اقتراح إعلان سريع <span className="text-xs text-gray-400">Ad Draft</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* نافذة صغيرة لتوليد الصورة (تظهر للأعلى) */}
            {genOpen && (
              <div className="absolute bottom-[76px] right-0 w-full max-w-xl">
                <div className="rounded-xl bg-[#1E2228] border border-white/5 p-3 space-y-3">
                  <div className="text-sm text-gray-300">توليد صورة من وصف نصّي</div>
                  <textarea
                    value={genPrompt}
                    onChange={(e)=>setGenPrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-[#15181D] rounded-lg px-3 py-2 outline-none resize-none"
                    placeholder='مثال: "شعار بسيط بنغمة Neon Blue"'
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={()=>setGenOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5">إلغاء</button>
                    <button
                      disabled={genBusy}
                      onClick={generateImage}
                      className="px-4 py-2 rounded-lg bg-[#00D3EE] text-black font-bold disabled:opacity-60"
                    >
                      {genBusy ? "جاري التوليد…" : "توليد"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* السايدبار */}
      <aside className="hidden lg:flex h-screen border-l border-white/5 flex-col">
        <div className="p-3 border-b border-white/5 font-bold">EASY WAR</div>
        <div className="p-3">
          <input className="w-full rounded-md bg-[#1B1F24] px-3 py-2 text-sm outline-none"
                 placeholder="بحث عن محادثة" />
        </div>
        <div className="px-3 pt-2 text-sm text-gray-400">الأدوات</div>
        <ul className="px-3 py-2 space-y-2 text-sm">
          <li className="bg-transparent hover:bg-white/5 rounded-md px-3 py-2">أداة البزنس</li>
          <li className="bg-transparent hover:bg-white/5 rounded-md px-3 py-2">أداة التسعير</li>
          <li className="bg-transparent hover:bg-white/5 rounded-md px-3 py-2">تحليل الإعلانات</li>
        </ul>
        <div className="px-3 pt-3 text-sm text-gray-400">المحفوظات</div>
        <div className="px-3 py-6 text-xs text-gray-500">لا يوجد عناصر محفوظة</div>
      </aside>
    </div>
  );
}
