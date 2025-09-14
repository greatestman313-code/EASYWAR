'use client'
import { useState } from 'react'

export default function Composer({ onSend }:{ onSend:(txt:string)=>void }){
  const [v,setV] = useState('')
  return (
    <div className="p-3 border-t border-white/10 bg-bg/60">
      <div className="flex items-end gap-2">
        <button className="px-3 py-2 bg-bg border border-white/10 rounded">+</button>
        <div className="flex-1 relative">
          <textarea
            value={v}
            onChange={e=>setV(e.target.value)}
            placeholder="اسألني أي شيء"
            className="w-full max-h-[50vh] min-h-[40px] bg-bg/70 border border-white/10 rounded px-3 py-2 resize-y"
            onKeyDown={(e)=>{
              if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); if(v.trim()) onSend(v), setV('') }
            }}
          />
        </div>
        <button onClick={()=>{ if(v.trim()) onSend(v), setV('') }} className="px-3 py-2 rounded bg-brand.neon text-black">إرسال →</button>
        <button className="px-3 py-2 rounded border border-white/10">🎙️</button>
      </div>
    </div>
  )
}
