
'use client'
import { useState } from 'react'

export default function BusinessTool() {
  const [idea, setIdea] = useState('متجر إلكتروني متخصص في منتجات العناية الطبيعية')
  const [out, setOut] = useState<any>(null)
  async function run() {
    const res = await fetch('/api/tools/business', { method: 'POST', body: JSON.stringify({ idea }), headers: { 'Content-Type': 'application/json' } })
    const js = await res.json()
    setOut(js)
  }
  return (
    <div className="space-y-6">
      <div className="card">
        <textarea className="w-full bg-slate-800 rounded-xl p-3 min-h-[120px]" value={idea} onChange={e=>setIdea(e.target.value)} />
        <button onClick={run} className="btn-neon mt-3">حلّل</button>
      </div>
      {out && <pre className="bg-slate-800 p-3 rounded-xl overflow-auto text-xs">{JSON.stringify(out, null, 2)}</pre>}
    </div>
  )
}
