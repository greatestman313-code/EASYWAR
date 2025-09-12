'use client';
import { useEffect, useState } from 'react';
export default function SharePage({ params }){
  const { id } = params;
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  useEffect(()=>{
    (async ()=>{
      try{
        const res = await fetch(`/api/share/${id}`);
        const js = await res.json();
        if(!res.ok) throw new Error(js?.error||'error');
        setData(js);
      }catch(e){ setErr(String(e.message||e)); }
    })();
  },[id]);
  if (err) return <div className="p-6">خطأ: {err}</div>;
  if (!data) return <div className="p-6">...جارِ التحميل</div>;
  const m = data.message;
  return (
    <div className="min-h-dvh bg-bgdark text-white p-6">
      <h1 className="text-xl font-bold mb-2">رسالة مشتركة (عرض فقط)</h1>
      <div className="bubble assistant p-4 leading-7 whitespace-pre-line max-w-3xl">
        {m?.content}
        {Array.isArray(m?.attachments)&&m.attachments.length>0 && (
          <div className="attach-grid mt-3">
            {m.attachments.map((a,i)=>(
              <div key={i} className="attach-item">
                {a.kind==='image'?<img className="attach-thumb" src={a.url} alt="image" />:
                 a.kind==='audio'?<audio className="attach-audio" controls src={a.url}/>:
                 <a className="underline" href={a.url} target="_blank" rel="noreferrer">{a.name||'ملف'}</a>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
