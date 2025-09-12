
'use client';
import { useState } from 'react';

export default function ImageModal({ open, onClose, onDone }){
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState('512x512');
  const [busy, setBusy] = useState(false);
  if (!open) return null;

  async function generate(){
    if (!prompt.trim()) return;
    setBusy(true);
    try{
      const res = await fetch('/api/gen/image', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ prompt, size })
      });
      const text = await res.text();
      let data; try{ data = JSON.parse(text); }catch{ data = {}; }
      if (!res.ok){
        const msg = String(data?.detail || data?.error || 'فشل التوليد');
        window.dispatchEvent(new CustomEvent('toast',{ detail: msg }));
        return;
      }
      if (data?.url){
        onDone?.({ url: data.url, prompt, size });
        onClose?.();
        setPrompt('');
      }else{
        window.dispatchEvent(new CustomEvent('toast',{ detail: 'لم يُرجع الخادم رابط صورة.' }));
      }
    }catch(e){
      window.dispatchEvent(new CustomEvent('toast',{ detail: 'خطأ في التوليد' }));
    }finally{ setBusy(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-30" onClick={()=>!busy && onClose?.()}>
      <div onClick={(e)=>e.stopPropagation()} className="bg-bgsoft border border-[#333] rounded p-4 w-[520px] max-w-[92vw] space-y-3">
        <div className="text-lg font-bold">توليد صورة من نص</div>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} className="w-full h-28 bg-bgdark rounded p-2 outline-none" placeholder="اكتب وصف الصورة المطلوبة..." />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-300">الحجم:</label>
          <select value={size} onChange={e=>setSize(e.target.value)} className="bg-bgdark border border-[#333] rounded p-1 text-sm">
            <option>512x512</option>
            <option>768x768</option>
            <option>1024x1024</option>
          </select>
          {busy && <span className="text-sm text-neon">...جارِ التوليد</span>}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={()=>onClose?.()} className="px-3 py-1 rounded hover:bg-bgdark" disabled={busy}>إغلاق</button>
          <button onClick={generate} className="px-3 py-1 rounded bg-neon text-black" disabled={busy}>توليد</button>
        </div>
      </div>
    </div>
  );
}
