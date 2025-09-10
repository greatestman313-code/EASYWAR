"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([{role:"system", content:"مرحبا بك في CHAT EASY WAR"}]);
  const [input, setInput] = useState("");

  return (
    <div className="flex h-screen bg-bgdark text-white">
      <aside className="w-1/4 bg-bgsoft flex flex-col">
        <div className="p-4 text-lg font-bold">EASY WAR</div>
        <button className="p-2 hover:bg-bgdark">محادثة جديدة</button>
        <button className="p-2 hover:bg-bgdark">أداة البزنز</button>
        <button className="p-2 hover:bg-bgdark">أداة التسعير</button>
        <button className="p-2 hover:bg-bgdark">أداة الإعلانات</button>
        <div className="mt-auto p-4 border-t border-gray-700">المستخدم</div>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="p-2 border-b border-gray-700 flex justify-between">
          <div>CHAT EASY WAR v0.1</div>
          <div>⋮</div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((m,i)=>(
            <div key={i} className={m.role=="user"?"text-right":""}>
              <span className="bg-bgsoft p-2 rounded">{m.content}</span>
            </div>
          ))}
        </div>
        <footer className="p-2 flex space-x-2 border-t border-gray-700">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="اسألني أي شيء" className="flex-1 p-2 bg-bgsoft rounded"/>
          <button onClick={()=>{setMessages([...messages,{role:"user",content:input}]); setInput("");}} className="px-4 bg-neon text-black rounded">➤</button>
        </footer>
      </main>
    </div>
  )
}
