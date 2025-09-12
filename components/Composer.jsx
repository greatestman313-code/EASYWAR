'use client';
import { useRef, useState } from 'react';
import { SvgPlus, SvgMic } from './icons';

export default function Composer({ onSend, onPickFiles }){
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const fileRef = useRef(null);
  const fileRefAudio = useRef(null);

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    const next = files.map(f => {
      const url = URL.createObjectURL(f);
      const kind = (f.type || '').startsWith('image/') ? 'image' : ((f.type || '').startsWith('audio/') ? 'audio' : 'file');
      return { kind, url, name: f.name, size: f.size };
    });
    onPickFiles?.(next);
  };

  return (
    <footer className="p-3 border-t border-[#333]">
      <div className="max-w-4xl mx-auto w-full">
        <div className="composer relative p-2">
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
          <input ref={fileRefAudio} type="file" accept="audio/*" multiple className="hidden" onChange={onFiles} />

          <div className="absolute right-2 top-2">
            <button title="قائمة الإضافة" className="p-1 rounded hover:bg-bgdark" onClick={()=>setMenuOpen(v=>!v)}><SvgPlus /></button>
            {menuOpen && (
              <div className="absolute z-20 right-0 bottom-full mb-2 w-60 bg-bgdark border border-[#333] rounded p-1 shadow-lg">
                <button onClick={()=>{setMenuOpen(false); fileRef.current?.click();}} className="w-full text-right p-2 rounded hover:bg-bgsoft">إضافة ملفات/صور</button>
                <button onClick={()=>{setMenuOpen(false); fileRefAudio.current?.click();}} className="w-full text-right p-2 rounded hover:bg-bgsoft">إضافة صوت</button>
                <div className="border-t border-[#333] my-1"></div>
                <button disabled className="w-full text-right p-2 rounded bg-[#111] text-gray-500">توليد صورة (من الهيدر)</button>
                <button disabled className="w-full text-right p-2 rounded bg-[#111] text-gray-500">بحث متقدم</button>
                <button disabled className="w-full text-right p-2 rounded bg-[#111] text-gray-500">تفكير عميق</button>
              </div>
            )}
          </div>

          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); onSend?.(input); setInput(''); } }}
            placeholder="اسألني أي شيء"
            className="w-full bg-transparent outline-none resize-none pr-8 pl-24 scrollbar-thin mt-2"
            rows={2}
          />

          <div className="absolute left-2 bottom-2 flex items-center gap-2">
            <button className="px-2 py-1 rounded hover:bg-bgdark" title="تسجيل صوت (قريبًا)"><SvgMic active={false} /></button>
            <button onClick={()=>{ onSend?.(input); setInput(''); }} className="px-3 py-1 rounded bg-neon text-black" title="إرسال">➤</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
