'use client';
import { useState, useRef, useEffect } from 'react';
export default function Header({ onArchive, onReport, onClear, onShare, mode, setMode }){
  const [open,setOpen]=useState(false);
  const [more,setMore]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const h=(e)=>{ if(ref.current && !ref.current.contains(e.target)){ setOpen(false); setMore(false);} };
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h);
  },[]);
  return (
    <header className="p-2 border-b border-soft flex items-center justify-between" ref={ref}>
      <div className="flex items-center gap-3">
        <div className="font-bold">CHAT EASY WAR</div>
        <div className="text-xs text-gray-400">v1.2</div>
        <div className="relative">
          <button className="bg-bgdark border border-soft rounded p-1 text-xs" onClick={()=>setOpen(v=>!v)}>{mode}</button>
          {open && (
            <div className="absolute right-0 mt-1 w-44 bg-bgsoft border-soft rounded p-1">
              {['الشات التلقائي','بحث متقدم','التفكير العميق'].map(m=>(
                <button key={m} onClick={()=>{setMode(m);setOpen(false);}} className="block w-full text-right p-2 rounded hover:bg-bgdark">{m}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-2 py-1 rounded hover:bg-bgsoft" title="نسخ رابط المشاركة" onClick={onShare}>🔗</button>
        <div className="relative">
          <button className="px-2 py-1 rounded hover:bg-bgsoft" title="القائمة" onClick={()=>setMore(v=>!v)}>⋮</button>
          {more && (
            <div className="absolute left-0 mt-1 w-48 bg-bgsoft border-soft rounded p-1">
              <button onClick={()=>{setMore(false); onArchive?.();}} className="block w-full text-right p-2 rounded hover:bg-bgdark">أرشفة المحادثة</button>
              <button onClick={()=>{setMore(false); onReport?.();}} className="block w-full text-right p-2 rounded hover:bg-bgdark">تقرير</button>
              <button onClick={()=>{setMore(false); onClear?.();}} className="block w-full text-right p-2 rounded hover:bg-bgdark">مسح الدردشة</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
