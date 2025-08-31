'use client'
import { useEffect, useMemo, useRef, useState } from 'react'

type Thread = { id: string; title: string; created_at: string }
type Msg = { id?: string; role: 'user'|'assistant'; content: string; created_at?: string }

async function getUser() {
  const r = await fetch('/api/auth/user')
  const j = await r.json()
  return j.user
}

export default function ChatPage(){
  const [user, setUser] = useState<any>(null)
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')

  // fetch user then threads
  useEffect(()=>{ (async()=>{
    const u = await getUser(); setUser(u)
    if(!u) return
    const r = await fetch('/api/threads', { headers: { 'x-user-id': u.id } })
    const j = await r.json()
    setThreads(j.threads || [])
    if (j.threads?.length) setActiveId(j.threads[0].id)
  })() }, [])

  // load messages on thread change
  useEffect(()=>{ (async()=>{
    if(!user || !activeId) return
    const r = await fetch(`/api/messages?thread_id=${activeId}`, { headers: { 'x-user-id': user.id } })
    const j = await r.json()
    setMessages(j.messages || [])
  })() }, [activeId, user])

  const newThread = async () => {
    if (!user) return
    const r = await fetch('/api/threads', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': user.id }, body: JSON.stringify({ title: 'محادثة جديدة' }) })
    const j = await r.json()
    setThreads((t)=>[j.thread, ...t])
    setActiveId(j.thread.id)
    setMessages([])
  }

  const send = async () => {
    if (!input.trim() || !user || !activeId) return
    const userMsg: Msg = { role: 'user', content: input }
    setInput('')
    setMessages((m)=>[...m, userMsg, { role: 'assistant', content: '' }])

    await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': user.id }, body: JSON.stringify({ thread_id: activeId, role: 'user', content: userMsg.content }) })

    const history = messages.concat(userMsg).map(m=>({ role: m.role, content: m.content }))
    const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role:'system', content:'أجب بالعربية بوضوح.' }, ...history] }) })
    if (!res.body) return
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let acc = ''
    while(true){
      const { value, done } = await reader.read()
      if (done) break
      acc += decoder.decode(value, { stream: true })
      setMessages((prev)=>{
        const copy = [...prev]
        const idx = copy.map(m=>m.role).lastIndexOf('assistant')
        copy[idx] = { role: 'assistant', content: acc }
        return copy
      })
    }
    await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-id': user.id }, body: JSON.stringify({ thread_id: activeId, role: 'assistant', content: acc }) })
  }

  return (
    <main className="grid grid-cols-12 min-h-screen">
      {/* Sidebar */}
      <aside className="col-span-12 md:col-span-3 xl:col-span-2 border-l border-white/10 bg-neutral-900 p-3 text-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <button className="rounded-xl px-3 py-2 bg-white/5">LOGO</button>
          <button className="rounded-xl px-3 py-2 bg-white/5" onClick={newThread}>+ جديدة</button>
        </div>
        <div className="rounded-xl bg-white/5">
          <input className="w-full bg-transparent p-2 outline-none" placeholder="ابحث عن محادثة..." />
        </div>
        <div className="space-y-1 overflow-y-auto max-h-[60vh] pr-1">
          {threads.map(t=>(
            <button key={t.id} onClick={()=>setActiveId(t.id)} className={"w-full text-right rounded-xl px-3 py-2 " + (activeId===t.id ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10')}>
              {t.title || 'بدون عنوان'}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <button className="w-full rounded-xl px-3 py-2 bg-white/5">👤 {user?.email || 'غير مسجّل'}</button>
        </div>
      </aside>

      {/* Chat area */}
      <section className="col-span-12 md:col-span-9 xl:col-span-10 flex flex-col">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-900/80 backdrop-blur">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="relative">
              <button className="rounded-xl px-3 py-2 bg-white/5">CHAT EASY WAR v1.0 ▾</button>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-xl px-3 py-2 bg-white/5">⋮</button>
              <button className="rounded-xl px-3 py-2 bg-white/5">🔗 مشاركة</button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && <div className="text-neutral-400">ابدأ بطرح سؤالك…</div>}
          {messages.map((m, i)=> (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <div className={m.role==='user' ? 'inline-block rounded-2xl bg-white/10 px-4 py-2' : 'inline-block rounded-2xl bg-white/5 px-4 py-2'}>
                <div className="whitespace-pre-wrap">{m.content || '...'}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 p-3">
          <div className="max-w-4xl mx-auto flex items-end gap-2">
            <button className="rounded-xl px-3 py-2 bg-white/5">＋</button>
            <div className="flex-1 rounded-2xl bg-neutral-800 border border-white/10 max-h-[50vh]">
              <textarea className="w-full bg-transparent p-3 outline-none resize-none h-24"
                        placeholder="اسألني أي شيء"
                        value={input}
                        onChange={(e)=>setInput(e.target.value)}
                        onKeyDown={(e)=>{ if(e.key==='Enter' && (e.ctrlKey||e.metaKey)) { e.preventDefault(); send() } }}/>
            </div>
            <button onClick={send} className="rounded-xl px-3 py-2 bg-white/5">➤</button>
            <button className="rounded-xl px-3 py-2 bg-white/5">🎤</button>
          </div>
          <div className="max-w-4xl mx-auto text-xs text-neutral-400 pt-2">اختصار: ⌘/Ctrl + Enter للإرسال</div>
        </div>
      </section>
    </main>
  )
}
