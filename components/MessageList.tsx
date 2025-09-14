"use client";
export default function MessageList({ items }:{ items:{id:string, role:'user'|'assistant', content:string}[] }){
  return (
    <div className="flex-1 overflow-auto p-4 space-y-3">
      {items.map(m=> (
        <div key={m.id} className={`max-w-[80ch] leading-7 ${m.role==='assistant'?'bg-white/5':'bg-neon/10'} rounded-xl px-4 py-3`}>
          <div className="text-xs opacity-60 mb-1">{m.role==='assistant'?'المساعد':'أنت'}</div>
          <div className="whitespace-pre-wrap">{m.content}</div>
        </div>
      ))}
    </div>
  );
}
