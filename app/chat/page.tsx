"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MessageList from "@/components/MessageList";
import Composer from "@/components/Composer";

export default function ChatPage(){
  const [items, setItems] = useState<{id:string, role:'user'|'assistant', content:string}[]>([
    { id: "w1", role:"assistant", content:"مرحبا بك في CHAT EASY WAR 👋" }
  ]);

  async function onSend(text:string){
    const user = { id: crypto.randomUUID(), role:"user" as const, content: text };
    setItems(prev=> [...prev, user]);
    // call API
    const res = await fetch("/api/chat", { method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ messages: items.concat(user).slice(-20) }) });
    const data = await res.json();
    const bot = { id: crypto.randomUUID(), role:"assistant" as const, content: data?.reply ?? "…" };
    setItems(prev=> [...prev, bot]);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex flex-col h-screen">
        <Header />
        <MessageList items={items} />
        <Composer onSend={onSend} />
      </div>
    </div>
  );
}
