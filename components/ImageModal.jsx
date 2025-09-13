'use client';
import { useState } from 'react';
export default function ImageModal({ open, onClose, onDone }){
  const [prompt,setPrompt] = useState('');
  const [size,setSize] = useState('512x512');
  const [busy,setBusy] = useState(false);
  if(!open) return null;
  const gen = async()=>{
    if(!prompt.trim()) return;
    setBusy(true);
    try{
      const r = await fetch('/api/gen/image',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,size})});
      const t = await r.text(); let data; try{ data=JSON.parse(t);}catch{ data={}; }
      if(!r.ok) throw new Error(data?.detail || data?.error || t);
      if(data?.url){ onDone?.({ url:data.url, prompt }); onClose?.(); }
      else{ dispatchEvent(new CustomEvent('toast',{detail:'لم يُرجع رابط صورة'})); }
    }catch(e){ dispatchEvent(new CustomEvent('toast',{detail:String(e).slice(0,200)})); }
    finally{ setBusy(false); }
  };
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={()=>!busy && onClose?.()}>
      <div className="bg-bgsoft border-soft rounded p-4 w-[520px] max-w-[92vw] space-y-3" onClick={e=>e.stopPropagation()}>
        <div className="text-lg font-bold">توليد صورة من نص</div>
        <textarea className="w-full h-28" placeholder="اكتب وصف الصورة..." value={prompt} onChange={e=>setPrompt(e.target.value)} />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">الحجم:</span>
          <select value={size} onChange={e=>setSize(e.target.value)}>
            <option>512x512</option>
            <option>768x768</option>
            <option>1024x1024</option>
          </select>
          {busy && <span className="text-neon">...جارٍ التوليد</span>}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={()=>onClose?.()} disabled={busy}>إغلاق</button>
          <button className="neon rounded px-3 py-1" onClick={gen} disabled={busy}>توليد</button>
        </div>
      </div>
    </div>
  );
}
