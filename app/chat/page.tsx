'use client'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatHeader from './components/Header'
import Composer from './components/Composer'
import MessageList from './components/MessageList'
import { v4 as uuid } from 'uuid'

export default function ChatPage(){
  const [messages, setMessages] = useState<{id:string,role:'user'|'assistant',content:string}[]>([
    { id: uuid(), role: 'assistant', content: 'مرحبا بك في CHAT EASY WAR 👋' }
  ])

  async function sendMessage(text:string){
    const userMsg = { id: uuid(), role:'user' as const, content: text }
    setMessages(prev=>[...prev, userMsg])
    const r = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: messages.concat(userMsg).slice(-20).map(m=>({role:m.role, content:m.content})) }) })
    const data = await r.json()
    const assistantMsg = { id: uuid(), role:'assistant' as const, content: data.reply || '…' }
    setMessages(prev=>[...prev, assistantMsg])
  }

  return (
    <main className="min-h-screen grid grid-cols-[auto,1fr]">
      <Sidebar/>
      <section className="flex flex-col min-h-screen">
        <ChatHeader/>
        <MessageList items={messages}/>
        <Composer onSend={sendMessage}/>
      </section>
    </main>
  )
}
