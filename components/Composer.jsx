'use client';
import { useRef, useState } from 'react';
import { SvgPlus, SvgMic } from './icons';
export default function Composer({ onSend }){
  const [menuOpen,setMenuOpen]=useState(false);
  const [input, setInput] = useState('');
  const fileRef=useRef(null), fileRefAudio=useRef(null);
  const send=()=>{ const text = input.trim(); if(!text) return; onSend(text); setInput(''); };
  return (
    <div className="p-3 border-t border-soft">
      <div className="max-w-4xl mx-auto w-full relative">
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" />
        <input ref={fileRefAudio} type="file" accept="audio/*" multiple className="hidden" />
        <div className="absolute right-2 top-2">
          <button title="قائمة الإضافة" onClick={()=>setMenuOpen(v=>!v)}><SvgPlus /></button>
          {menuOpen && (
            <div className="absolute z-20 right-0 bottom-full mb-2 w-60 bg-bgdark border border-soft rounded p-1 shadow-lg">
              <button onClick={()=>{setMenuOpen(false); fileRef.current?.click();}} className="w-full text-right p-2 rounded hover:bg-bgsoft">إضافة ملفات/صور</button>
              <button onClick={()=>{setMenuOpen(false); fileRefAudio.current?.click();}} className="w-full text-right p-2 rounded hover:bg-bgsoft">إضافة صوت</button>
              <div className="border-t border-soft my-1" />
              <button onClick={()=>{setMenuOpen(false); dispatchEvent(new CustomEvent('open-image-modal'));}} className="w-full text-right p-2 rounded hover:bg-bgsoft">توليد صورة (من الهيدر)</button>
              <button disabled className="w-full text-right p-2 rounded opacity-50">بحث متقدم</button>
              <button disabled className="w-full text-right p-2 rounded opacity-50">تفكير عميق</button>
            </div>
          )}
        </div>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send(); } }} placeholder="اسألني أي شيء" className="w-full bg-transparent outline-none resize-none pr-8 pl-24 scrollbar-thin mt-2 h-20" />
        <div className="absolute left-2 bottom-2 flex items-center gap-2">
          <button className="px-2 py-1 rounded hover:bg-bgdark" title="تسجيل صوت"><SvgMic active={false} /></button>
          <button onClick={send} className="px-3 py-1 rounded neon" title="إرسال">➤</button>
        </div>
      </div>
    </div>
  );
}
