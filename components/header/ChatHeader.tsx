'use client'
import { useState } from 'react'

export default function ChatHeader() {
  const [mode, setMode] = useState<'auto'|'advanced'|'deep'>('auto')
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-900/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="relative">
          <button className="rounded-xl px-3 py-2 bg-white/5">CHAT EASY WAR v1.0 ▾</button>
          {/* TODO: dropdown to set mode */}
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl px-3 py-2 bg-white/5">⋮</button>
          <button className="rounded-xl px-3 py-2 bg-white/5">🔗 مشاركة</button>
        </div>
      </div>
    </header>
  )
}
