'use client'
import { useState } from 'react'

export default function MessageInput() {
  const [value, setValue] = useState('')

  const onSend = async () => {
    if (!value.trim()) return
    // TODO: call /api/chat (SSE streaming)
    setValue('')
  }

  return (
    <div className="border-t border-white/10 p-3">
      <div className="max-w-4xl mx-auto flex items-end gap-2">
        <button className="rounded-xl px-3 py-2 bg-white/5">＋</button>
        <div className="flex-1 rounded-2xl bg-neutral-800 border border-white/10 max-h-[50vh]">
          <textarea
            className="w-full bg-transparent p-3 outline-none resize-none h-24"
            placeholder="اسألني أي شيء"
            value={value}
            onChange={(e)=>setValue(e.target.value)}
          />
        </div>
        <button onClick={onSend} className="rounded-xl px-3 py-2 bg-white/5">➤</button>
        <button className="rounded-xl px-3 py-2 bg-white/5">🎤</button>
      </div>
    </div>
  )
}
