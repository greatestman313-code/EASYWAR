
'use client'
import { useState } from 'react'

export default function AdsTool() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)

  async function analyze() {
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    // upload to storage
    const up = await fetch('/api/upload', { method: 'POST', body: fd })
    const info = await up.json()
    // call vision
    const resp = await fetch('/api/vision/analyze', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: info.url, platform: 'IG' })
    })
    const js = await resp.json()
    setResult(js)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <input type="file" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <button onClick={analyze} className="btn-neon ml-2">تحليل</button>
      </div>
      {result && (
        <div className="card space-y-3">
          <div>الدرجة الكلية: <b>{result.score_overall}</b></div>
          <pre className="bg-slate-800 p-3 rounded-xl overflow-auto text-xs">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
