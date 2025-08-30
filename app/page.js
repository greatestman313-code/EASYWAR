"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./components/UserMenu";
import { useEffect, useMemo, useRef, useState } from "react";
import { renderMarkdown } from "@/lib/markdown";

const VERSION = process.env.NEXT_PUBLIC_EASYWAR_VERSION || "v4.3.1";
const initialAssistant = { role: "assistant", ts: Date.now(), content: "مرحباً! اسألني أي شيء.\n- Enter للإرسال\n- Shift+Enter لسطر جديد\n- زر + لإدراج ملفات/صوت/صورة أو إنشاء صورة" };

export default function ChatPage(){
  const [sessions, setSessions] = useState(() => safeGet("ew_sessions", []));
  const [archived, setArchived] = useState(() => safeGet("ew_archived", []));
  const [currentId, setCurrentId] = useState(() => sessions[0]?.id || null);
  const current = useMemo(() => sessions.find(s => s.id === currentId), [sessions, currentId]);

  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return sessions;
    const s = q.trim();
    return sessions.filter(x => (x.title || "").includes(s) || x.messages?.some(m => (m.content || "").includes(s)));
  }, [q, sessions]);

  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [showPlus, setShowPlus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ab, setAb] = useState(null);
  const [recording, setRecording] = useState(false);
  const [userName] = useState(() => (typeof window === "undefined" ? "" : localStorage.getItem("ew_user_name") || "Guest"));
  const [mode, setMode] = useState(() => safeGet("ew_mode", "auto")); // auto | deep | fast
  const [thinkingSec, setThinkingSec] = useState(0);
  const [showKebab, setShowKebab] = useState(false);
  const [speak, setSpeak] = useState(() => safeGet("ew_tts", false));
  const [toast, setToast] = useState("");
  const [showSidebar, setShowSidebar] = useState(() => (typeof window==="undefined" ? true : JSON.parse(localStorage.getItem("ew_showSidebar")||"true")) );
  const [atBottom, setAtBottom] = useState(true);

  const pathname = usePathname();
  const listRef = useRef(null);
  const timerRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (!currentId && sessions.length === 0){
      const id = crypto.randomUUID();
      const s = { id, title: "محادثة جديدة", createdAt: Date.now(), messages: [initialAssistant], attachments: [] };
      const next = [s];
      setSessions(next); setCurrentId(id);
      safeSet("ew_sessions", next);
    }
  }, []);

  useEffect(() => safeSet("ew_sessions", sessions), [sessions]);
  useEffect(() => safeSet("ew_archived", archived), [archived]);
  useEffect(() => safeSet("ew_mode", mode), [mode]);
  useEffect(() => safeSet("ew_tts", speak), [speak]);

  useEffect(() => {
    if(listRef.current) {
      const el = listRef.current;
      const onScroll = () => {
        const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 160;
        setAtBottom(nearBottom);
      };
      el.addEventListener("scroll", onScroll);
      return () => el.removeEventListener("scroll", onScroll);
    }
  }, [listRef.current]);

  useEffect(() => { autoResizeTA(); }, [input]);
  useEffect(()=>{ if(typeof window!=='undefined') localStorage.setItem('ew_showSidebar', JSON.stringify(showSidebar)); }, [showSidebar]);

  const autoResizeTA = () => {
    if (!taRef.current) return;
    const t = taRef.current;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 300) + "px";
  };

  const newChat = () => {
    const id = crypto.randomUUID();
    const s = { id, title: "محادثة جديدة", createdAt: Date.now(), messages: [initialAssistant], attachments: [] };
    const next = [s, ...sessions];
    setSessions(next); setCurrentId(id); setQ("");
  };

  const onPickFiles = (picked) => {
    const arr = Array.from(picked || []);
    if (!arr.length) return;
    setFiles(prev => [...prev, ...arr]);
    setShowPlus(false);
  };
  const removeFile = (idx) => setFiles(prev => prev.filter((_,i)=>i!==idx));

  const parseSlash = (raw) => {
    if (!raw.startsWith("/")) return { cmd:null, arg: raw };
    const [head, ...rest] = raw.slice(1).split(" ");
    return { cmd: head.toLowerCase(), arg: rest.join(" ").trim() };
  };

  const autoDecide = (text) => {
    const t = text.trim();
    if (/^\/img\b/.test(t) || /(صورة|تصميم|ارسم|لوغو|logo|image|generate)/i.test(t)) return "image";
    return "chat";
  };

  const send = async () => {
    if (loading){
      if (ab) ab.abort();
      setLoading(false); stopTimer();
      return;
    }
    const content = input.trim();
    if(!content && files.length===0) return;

    const { cmd, arg } = parseSlash(content);
    if (cmd === "img"){ setInput(arg); await generateImage(arg || content); return; }
    if (cmd === "voice"){ startVoice(); return; }
    if (cmd === "improve"){ selfImprove(); return; }

    const attachNote = files.length ? `\n\n[مرفقات: ${files.map(f=>f.name).join(", ")}]` : "";
    const userMsg = { role:"user", ts:Date.now(), content: content + attachNote };

    const withUser = sessions.map(s => s.id === currentId ? {
      ...s,
      title: s.title === "محادثة جديدة" ? (content.slice(0, 24) + (content.length > 24 ? "…" : "")) : s.title,
      messages: [...s.messages, userMsg]
    } : s);
    setSessions(withUser);
    setInput(""); setFiles([]);

    const decided = mode === "auto" ? autoDecide(content) : "chat";
    if (decided === "image"){ await generateImage(content); return; }

    const controller = new AbortController();
    setAb(controller); setLoading(true); startTimer();
    try{
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ prompt: content, mode: mode==="deep"? "deep":"fast", history: (current?.messages || []) }),
        signal: controller.signal
      });
      const data = await res.json();
      const reply = data?.reply || "تعذر الحصول على رد الآن.";

      const ai = { role:"assistant", ts:Date.now(), content: reply };
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, ai] } : s));
      if (speak) speakNow(reply);
      queueMicrotask(() => { if(listRef.current && !atBottom){ listRef.current.scrollTop = listRef.current.scrollHeight; }});
    }catch(e){
      const err = { role:"assistant", ts:Date.now(), content: (e.name==="AbortError" ? "تم إيقاف التوليد." : "حدث خطأ في الطلب.") };
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, err] } : s));
    }finally{
      setLoading(false); stopTimer();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      send();
    }
  };

  const speakNow = (text) => { try{ const u = new SpeechSynthesisUtterance(text); u.lang = "ar-SA"; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);}catch{} };
  const recRef = useRef(null);
  const startVoice = () => {
    if (recording){ stopVoice(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR){ alert("المتصفح لا يدعم تحويل الصوت إلى نص."); return; }
    const rec = new SR();
    rec.lang = "ar-SA"; rec.interimResults = true; rec.continuous = false;
    rec.onresult = (ev) => { let final = ""; for (const r of ev.results){ final += r[0].transcript; } setInput(prev => (prev ? prev + " " : "") + final); };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    recRef.current = rec; rec.start(); setRecording(true);
  };
  const stopVoice = () => { try{ recRef.current && recRef.current.stop(); }catch{} setRecording(false); };

  const share = () => { const data = JSON.stringify(current || {}, null, 2); navigator.clipboard?.writeText(data); toastMsg("Copied conversation JSON."); };
  const doDelete = () => {
    if (!currentId) return;
    if (!confirm("حذف هذه المحادثة؟")) return;
    const next = sessions.filter(s => s.id !== currentId);
    setSessions(next);
    setCurrentId(next[0]?.id || null);
    setShowKebab(false);
  };
  const doArchive = () => { if (!current) return; setArchived([current, ...archived]); setSessions(sessions.filter(s => s.id !== currentId)); setCurrentId(null); setShowKebab(false); };
  const doReport = () => { console.log("REPORT conversation:", current); toastMsg("تم إرسال تقرير (تجريبي)."); setShowKebab(false); };

  const generateImage = async (textOpt) => {
    const text = (textOpt ?? input.trim()) || prompt("صف الصورة المطلوبة:");
    if (!text) return;
    setShowPlus(false);
    setLoading(true); startTimer();
    try{
      const res = await fetch("/api/image", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ prompt: text }) });
      const data = await res.json();
      const url = data?.url;
      const content = url ? `![image](${url})` : "تعذر إنشاء صورة الآن.";
      const ai = { role:"assistant", ts:Date.now(), content };
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, ai] } : s));
    }catch(e){
      setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, { role:"assistant", ts:Date.now(), content:"خطأ أثناء إنشاء الصورة." }] } : s));
    }finally{ setLoading(false); stopTimer(); }
  };

  const improve = (idx) => {
    const msg = current?.messages?.[idx]; if (!msg) return;
    const refined = `نسخة محسّنة (تجريبية):\n\n${msg.content}`;
    setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: [...s.messages, { role:"assistant", ts:Date.now(), content: refined }] } : s));
  };
  const copyMsg = (text) => { navigator.clipboard?.writeText(text || ""); toastMsg("تم النسخ."); };
  const deleteMsg = (idx) => { setSessions(prev => prev.map(s => s.id === currentId ? { ...s, messages: s.messages.filter((_,i)=>i!==idx) } : s)); };
  const rerunMsg = (idx) => { const msg = current?.messages?.[idx-1]; if (msg?.role==="user"){ setInput(msg.content); send(); } };

  const startTimer = () => { setThinkingSec(0); clearInterval(timerRef.current); timerRef.current = setInterval(()=> setThinkingSec(v=>v+1), 1000); };
  const stopTimer = () => { clearInterval(timerRef.current); };
  const toastMsg = (t) => { setToast(t); setTimeout(()=>setToast(""), 1500); };

  const sourcesFrom = (html) => {
    const urls = Array.from((html || "").matchAll(/https?:\/\/[^\s)]+/g)).map(m=>m[0]);
    return Array.from(new Set(urls));
  };

  return (
    <div className={`container ${showSidebar? "":"withoutSidebar"}`}>
      {/* Left Sidebar */}
      <aside className={`sidebarL ${showSidebar? "":"collapsed"}`}>
<div className="brandRow">
  <div className="brand">
    <span className="dot" />
    <div>
      <div style={{ fontWeight: 600 }}>EASY WAR</div>
      <div style={{ fontSize: 12, opacity: .7 }}>Chat — App Router</div>
    </div>
  </div>
  <button className="brandToggle" onClick={()=>setShowSidebar(v=>!v)} title={showSidebar? "إخفاء القائمة":"إظهار القائمة"}>{showSidebar? "⟨":"⟩"}</button>
</div>
<div className="sidebarBody"><button className="btn" onClick={newChat}>➕ محادثة جديدة</button>

        {/* Vertical Tabs */}
        <div className="tabs">
          <Link href="/tools/biz" className={`tab ${pathname==="/tools/biz"?"tabActive":""}`}>
            <span className="icon"><svg viewBox="0 0 24 24" fill="none"><path d="M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/></svg></span>
            أداة البِزنس
          </Link>
          <Link href="/tools/ads" className={`tab ${pathname==="/tools/ads"?"tabActive":""}`}>
            <span className="icon"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><rect x="7" y="9" width="10" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.6"/></svg></span>
            تحليل الصور
          </Link>
          <Link href="/tools/marketing" className={`tab ${pathname==="/tools/marketing"?"tabActive":""}`}>
            <span className="icon"><svg viewBox="0 0 24 24" fill="none"><path d="M3 11h6l7-4v10l-7-4H3v-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 17v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg></span>
            التسويق والتسعير
          </Link>
        </div>

        <div className="sectionTitle">بحث في المحادثات</div>
        <div style={{display:'flex',gap:8}}>
          <input style={{flex:1,background:'#20232b',border:'1px solid var(--line)',borderRadius:12,padding:'8px',color:'var(--text)'}} value={q} onChange={e=>setQ(e.target.value)} placeholder="ابحث..." />
        </div>

        <div className="sectionTitle">المحادثات</div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {filtered.map(s => (
            <button key={s.id} className="btn" style={{textAlign:'start',background: s.id===currentId? '#242833' : '#20232b'}}
              onClick={()=>setCurrentId(s.id)}>{s.title}</button>
          ))}
        </div>

        <div className="sectionTitle">الأرشيف</div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {archived.map(s => (<div key={s.id} className="btn" style={{opacity:.7}}>{s.title}</div>))}
        </div>

        <div style={{marginTop:'auto',opacity:.8}}></div>
<div className="footerUserWrap"><UserMenu /></div></div>
      </aside>

      {/* Center (Chat) */}
      <main className="main" style={{position:'relative'}}>
        {loading && (<><div className="status"><span className="typing"><span className="dot"></span><span className="dot"></span><span className="dot"></span></span> {mode==="deep"? "تفكير معمّق":"يعمل"} • {thinkingSec}s</div><div className="thinkGlow"/></>)}
        <header className="header">
          <div className="title">
            <strong>Chat — EASYWAR</strong>
            <span className="badge">{VERSION}</span>
            <button className="toggle" onClick={()=>setMode(m=> m==="deep" ? "fast" : (m==="fast" ? "auto" : "deep"))} title="وضع التفكير">
              🧠 {mode.toUpperCase()}
            </button>
            <button className="toggle" onClick={()=>setSpeak(v=>!v)} title="نطق الرد">🔊 {speak? "ON":"OFF"}</button>
          </div>
          <div className="controls">
            <button className="ctrl" onClick={share}>⤴️ مشاركة</button>
            <button className="ctrl" onClick={()=>setShowKebab(v=>!v)}>⋯</button>
            {showKebab && (
              <div className="kebabMenu">
                <button className="kebabItem" onClick={doArchive}>🗂️ Archive</button>
                <button className="kebabItem" onClick={doReport}>🚩 Report</button>
                <button className="kebabItem" onClick={doDelete} style={{color:'var(--red)'}}>🗑️ Delete</button>
              </div>
            )}
          </div>
        </header>
        {!showSidebar && (<button className="sidebarReopen" onClick={()=>setShowSidebar(true)} title="إظهار القائمة">☰</button>)}

        <section className="chatArea" ref={listRef}>
          <div className="chatInner">
            {(current?.messages || []).map((m, idx) => (
              <Message key={idx} role={m.role} ts={m.ts} content={m.content}
                onCopy={()=>copyMsg(m.content)} onImprove={()=>improve(idx)} onDelete={()=>deleteMsg(idx)} onRerun={()=>rerunMsg(idx)}
                sources={sourcesFrom(renderMarkdown(m.content))} />
            ))}
            <div className="divider" />
            {loading && <TypingLine mode={mode} />}
          </div>
        </section>

        <div className="scrollRail">
            <button className="railBtn" onClick={()=>{ if(listRef.current){ listRef.current.scrollTop = 0; } }}>↑</button>
            <button className="railBtn" onClick={()=>{ if(listRef.current){ listRef.current.scrollTop = listRef.current.scrollHeight; } }}>↓</button>
          </div>

        <div className="composerWrap">
          <div className="composer">
            <button className="plus" title="إدراج" onClick={()=>setShowPlus(v=>!v)}>＋</button>
            {showPlus && (
              <div className="plusMenu">
                <button className="toolBtn" onClick={()=>document.getElementById("fileAny").click()}>📎 إضافة ملف</button>
                <button className="toolBtn" onClick={()=>document.getElementById("fileImage").click()}>🖼️ إضافة صورة</button>
                <button className="toolBtn" onClick={()=>document.getElementById("fileVideo").click()}>🎞️ إضافة فيديو</button>
                <button className="toolBtn" onClick={()=>document.getElementById("fileAudio").click()}>🎵 إضافة صوت</button>
                <button className="toolBtn" onClick={startVoice}>{recording? "■ إيقاف التسجيل":"🎙️ تسجيل صوت"}</button>
                <button className="toolBtn" onClick={()=>generateImage()}>✨ توليد صورة</button>
                <button className="toolBtn" onClick={()=>setMode("deep")}>🧠 تفعيل التفكير المعمّق</button>
                <button className="toolBtn" onClick={()=>toastMsg("قريبًا: بحث متقدم وملخصات.")}>🔍 بحث متقدم</button>
              </div>
            )}

            <input id="fileAny" type="file" multiple style={{display:"none"}} onChange={e=>onPickFiles(e.target.files)} />
            <input id="fileImage" type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>onPickFiles(e.target.files)} />
            <input id="fileVideo" type="file" accept="video/*" multiple style={{display:"none"}} onChange={e=>onPickFiles(e.target.files)} />
            <input id="fileAudio" type="file" accept="audio/*" multiple style={{display:"none"}} onChange={e=>onPickFiles(e.target.files)} />

            <textarea ref={taRef} className="textarea" value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKeyDown}
              placeholder="اكتب هنا… Enter للإرسال، Shift+Enter لسطر جديد" dir="auto" />
            <button className="voice" onClick={startVoice}>{recording? "■":"🎙️"}</button>
            <button className={"send " + (loading? "stop":"")} onClick={send}>{loading? "إيقاف":"إرسال"}</button>
          </div>

          {!!files.length && (
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:6}}>
              {files.map((f,idx)=>(<div key={idx} className="pill">{f.name} — {(f.size/1024/1024).toFixed(2)}MB <button className="pill" onClick={()=>removeFile(idx)} style={{marginInlineStart:8}}>إزالة</button></div>))}
            </div>
          )}
        </div>

        {!!toast && <div className="toast">{toast}</div>}
      </main>
    </div>
  );
}

function Message({ role, ts, content, onCopy, onImprove, onDelete, onRerun, sources }){
  const isAssistant = role === "assistant";
  const time = ts ? new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : "";
  return (
    <div className={"message " + (isAssistant? "assistant":"user")}>
      <div className="avatar">{isAssistant? "AI":"أنت"}</div>
      <div style={{flex:1}}>
        <div className="content" dangerouslySetInnerHTML={{__html: renderMarkdown(content)}} />
        {!!sources?.length && (
          <div className="sourceChips">
            {sources.map((u,i)=>(<a key={i} className="sourceChip" href={u} target="_blank" rel="noreferrer">🔗 مصدر</a>))}
          </div>
        )}
        <div className="msgActions">
          {isAssistant ? (
            <>
              <button className="pill reaction" onClick={onCopy}>👍</button>
              <button className="pill reaction" onClick={onCopy}>👎</button>
              <button className="pill reaction" onClick={onCopy}>📋</button>
              <button className="pill reaction" onClick={onRerun}>🔄</button>
              <button className="pill reaction" onClick={onCopy}>↗️</button>
            </>
          ) : (
            <>
              <button className="pill" onClick={onCopy}>📋 نسخ</button>
              <button className="pill" onClick={onDelete}>🗑️ حذف</button>
            </>
          )}
          <span style={{marginInlineStart:'auto',opacity:.6,fontSize:12}}>{time}</span>
        </div>
      </div>
    </div>
  );
}

function TypingLine({ mode }){
  return (
    <div className="message assistant">
      <div className="avatar">AI</div>
      <div className="content">
        <span className="typing"><span className="dot"></span><span className="dot"></span><span className="dot"></span></span>
        {mode==="deep" ? "  تفكير معمّق…" : "  جاري التوليد…"}
      </div>
    </div>
  );
}

// helpers
function safeGet(key, fallback){ if (typeof window === "undefined") return fallback; try{ return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }catch{ return fallback; } }
function safeSet(key, value){ if (typeof window === "undefined") return; try{ localStorage.setItem(key, JSON.stringify(value)); }catch{} }