'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Sidebar(){
  const [collapsed, setCollapsed] = useState(false)
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-72'} transition-all bg-bg/60 border-l border-white/5 min-h-screen p-3 scroll-thin overflow-y-auto`}>
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold">CEW</div>
        <button onClick={()=>setCollapsed(!collapsed)} className="text-xs opacity-70">طي</button>
      </div>
      <Link href="/chat" className="block w-full mb-3 py-2 text-center rounded-lg bg-brand.neon text-black">محادثة جديدة</Link>
      <input placeholder="بحث عن محادثة" className="w-full mb-3 bg-bg/70 border border-white/10 rounded px-3 py-2 text-sm" />
      <div className="space-y-2">
        <Link href="/chat/tools/business" className="block bg-bg/40 border border-white/10 rounded px-3 py-2">👜 أداة البزنز</Link>
        <Link href="/chat/tools/pricing" className="block bg-bg/40 border border-white/10 rounded px-3 py-2">💲 أداة التسعير</Link>
        <Link href="/chat/tools/ads" className="block bg-bg/40 border border-white/10 rounded px-3 py-2">📊 تحليل الإعلانات</Link>
      </div>
      <div className="mt-6 text-xs opacity-60">المحادثات</div>
      <ul className="mt-2 space-y-1">
        <li className="bg-bg/30 rounded px-3 py-2 text-sm">أول دردشة...</li>
      </ul>
      <div className="mt-10 border-t border-white/10 pt-3">
        <button className="w-full text-left text-sm opacity-80">👤 مستخدم (Free)</button>
      </div>
    </aside>
  )
}
