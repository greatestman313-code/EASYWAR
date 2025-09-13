'use client';
import { useState } from 'react';
import { SvgDotsV, SvgShare, SvgArchive, SvgReport, SvgTrash } from './icons';
import ReportModal from './ReportModal';

export default function Header({ sessionId, userId=null, onCleared }) {
  const [mode, setMode] = useState('auto');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const copyShareLink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
      await navigator.clipboard.writeText(url);
      // toast يظهر من المكوّن الأب
      const ev = new CustomEvent('toast', { detail: 'تم النسخ ✅' });
      window.dispatchEvent(ev);
    } catch {}
  };

  async function archive(archived=true){
    if (!sessionId) return;
    await fetch('/api/chat/archive', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId, archived }) });
    setMenuOpen(false);
  }
  async function clearChat(){
    if (!sessionId) return;
    await fetch('/api/chat/clear', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId }) });
    onCleared?.(); setMenuOpen(false);
  }
  async function submitReport({ reason='', note='' }){
    if (!sessionId) return;
    await fetch('/api/chat/report', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId, userId, reason, note }) });
  }

  return (
    <>
      <header className="p-2 border-b border-[#333] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-bold">CHAT EASY WAR</div>
          <div className="text-xs text-gray-400">v1.2</div>
          <select value={mode} onChange={(e)=>setMode(e.target.value)} className="bg-bgdark border border-[#333] rounded p-1 text-xs" title="وضع الشات">
            <option value="auto">الشات التلقائي</option>
            <option value="search">بحث متقدم</option>
            <option value="deep">التفكير العميق</option>
          </select>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <button onClick={copyShareLink} className="px-2 py-1 rounded hover:bg-bgsoft" title="نسخ رابط المشاركة"><SvgShare /></button>
            <button onClick={()=>setMenuOpen(v=>!v)} className="px-2 py-1 rounded hover:bg-bgsoft" title="خيارات"><SvgDotsV /></button>
          </div>
          {menuOpen && (
            <div className="absolute left-0 mt-1 w-56 bg-black border border-[#333] rounded p-1 z-10">
              <button onClick={()=>archive(true)} className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center justify-end gap-2"><span>أرشفة المحادثة</span><SvgArchive/></button>
              <button onClick={()=>{ setReportOpen(true); setMenuOpen(false); }} className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center justify-end gap-2"><span>تقرير</span><SvgReport/></button>
              <button onClick={clearChat} className="w-full text-right p-2 rounded hover:bg-bgdark flex items-center justify-end gap-2"><span>مسح الدردشة</span><SvgTrash/></button>
            </div>
          )}
        </div>
      </header>
      <ReportModal open={reportOpen} onClose={()=>setReportOpen(false)} onSubmit={submitReport} />
    </>
  );
}
