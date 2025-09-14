
'use client'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function PricingTool() {
  const [sku, setSku] = useState('SKU-123')
  const [range, setRange] = useState({ min: 8.9, max: 10.9, step: 0.1 })
  const [data, setData] = useState<{price:number,revenue:number,profit:number}[]>([])

  async function simulate() {
    const res = await fetch('/api/tools/pricing/simulate', {
      method: 'POST', body: JSON.stringify({ sku, range }), headers: { 'Content-Type': 'application/json' }
    })
    const js = await res.json()
    setData(js.grid ?? [])
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex gap-3 items-end">
          <div className="grow">
            <label className="text-sm">SKU</label>
            <input className="w-full bg-slate-800 rounded-xl p-2" value={sku} onChange={e=>setSku(e.target.value)} />
          </div>
          <button onClick={simulate} className="btn-neon">محاكاة</button>
        </div>
      </div>
      <div className="card h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="price" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="profit" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
