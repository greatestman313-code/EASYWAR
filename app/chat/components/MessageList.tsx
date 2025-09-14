'use client'
import { useRef, useEffect } from 'react'
export default function MessageList({items}:{items:{id:string,role:'user'|'assistant',content:string}[]}){
  const ref = useRef<HTMLDivElement>(null)
  useEffect(()=>{ ref.current?.scrollTo({top: ref.current.scrollHeight, behavior:'smooth'}) }, [items])
  return (
    <div ref={ref} className="flex-1 overflow-y-auto scroll-thin p-4 space-y-3">
      {items.map(m=>(
        <div key={m.id} className={`max-w-[80%] ${m.role==='user'?'ml-auto bg-brand.neon text-black':'mr-auto bg-bg/70 text-white'} rounded-xl px-3 py-2`}>
          <div className="text-xs opacity-70 mb-1">{m.role==='user'?'أنت':'النظام'}</div>
          <div className="whitespace-pre-wrap">{m.content}</div>
          {m.role==='assistant' && (
            <div className="flex gap-2 mt-2 text-xs opacity-80">
              <button>👍</button><button>👎</button><button>نسخ</button><button>حفظ</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
