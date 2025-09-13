'use client';
import { useState } from 'react';

export default function ReportModal({ open, onClose, onSubmit, defaultReason='' }) {
  const [reason, setReason] = useState(defaultReason);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const canSend = (reason.trim().length > 0 || note.trim().length > 0) && !busy;
  if (!open) return null;
  async function handleSubmit(){
    if (!canSend) return;
    setBusy(true);
    try{ await onSubmit?.({ reason: reason.trim(), note: note.trim() }); onClose?.(); } finally { setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-40 bg-black/60" onClick={()=>!busy && onClose?.()}>
      <div className="w-[560px] max-w-[92vw] bg-bgsoft border border-[#333] rounded p-4 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" onClick={(e)=>e.stopPropagation()}>
        <div className="text-lg font-bold mb-3">إرسال تقرير</div>
        <label className="block text-sm mb-1 opacity-80">السبب (اختياري):</label>
        <textarea className="w-full h-20 bg-bgdark rounded p-2 outline-none mb-3" placeholder="اذكر بإيجاز سبب التقرير" value={reason} onChange={e=>setReason(e.target.value)}/>
        <label className="block text-sm mb-1 opacity-80">ملاحظة إضافية (اختياري):</label>
        <textarea className="w-full h-24 bg-bgdark rounded p-2 outline-none mb-4" placeholder="أي تفاصيل أو أمثلة" value={note} onChange={e=>setNote(e.target.value)}/>
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1 rounded hover:bg-bgdark" disabled={busy} onClick={onClose}>إلغاء</button>
          <button className={`px-3 py-1 rounded ${canSend ? 'bg-neon text-black' : 'bg-[#444] text-gray-300 cursor-not-allowed'}`} disabled={!canSend} onClick={handleSubmit}>{busy ? 'جارِ الإرسال...' : 'إرسال التقرير'}</button>
        </div>
      </div>
    </div>
  );
}
